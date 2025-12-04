import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { MissionProgress, MissionType, IngredientGrade } from './types';
import { DAILY_MISSIONS, ACHIEVEMENTS, getMissionById } from './data/missions';
import { starStore } from './store';

const MISSION_PROGRESS_KEY = 'cook2_mission_progress';
const DAILY_RESET_KEY = 'cook2_daily_reset_date';
const STATS_KEY = 'cook2_stats';

// ============================================
// 통계 (누적)
// ============================================

interface GameStats {
	totalCookCount: number;
	totalEarned: number;
	discoveredRecipes: number;
	discoveredIngredients: number;
	cookCountByGrade: Record<string, number>;
	// 일일 통계 (리셋용)
	dailyCookCount: number;
	dailyEarned: number;
	dailyDiscoveredRecipes: number;
}

function getDefaultStats(): GameStats {
	return {
		totalCookCount: 0,
		totalEarned: 0,
		discoveredRecipes: 0,
		discoveredIngredients: 0,
		cookCountByGrade: {},
		dailyCookCount: 0,
		dailyEarned: 0,
		dailyDiscoveredRecipes: 0
	};
}

function getStoredStats(): GameStats {
	if (!browser) return getDefaultStats();
	const stored = localStorage.getItem(STATS_KEY);
	if (!stored) return getDefaultStats();
	try {
		return { ...getDefaultStats(), ...JSON.parse(stored) };
	} catch {
		return getDefaultStats();
	}
}

function saveStats(stats: GameStats): void {
	if (!browser) return;
	localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// ============================================
// 미션 진행도
// ============================================

function getStoredProgress(): Record<string, MissionProgress> {
	if (!browser) return {};
	const stored = localStorage.getItem(MISSION_PROGRESS_KEY);
	if (!stored) return {};
	try {
		return JSON.parse(stored);
	} catch {
		return {};
	}
}

function saveProgress(progress: Record<string, MissionProgress>): void {
	if (!browser) return;
	localStorage.setItem(MISSION_PROGRESS_KEY, JSON.stringify(progress));
}

// ============================================
// 일일 리셋 체크
// ============================================

function getLastResetDate(): string {
	if (!browser) return '';
	return localStorage.getItem(DAILY_RESET_KEY) || '';
}

function saveResetDate(date: string): void {
	if (!browser) return;
	localStorage.setItem(DAILY_RESET_KEY, date);
}

function getTodayString(): string {
	return new Date().toISOString().split('T')[0];
}

function checkAndResetDaily(): void {
	const today = getTodayString();
	const lastReset = getLastResetDate();

	if (lastReset !== today) {
		// 일일 미션 리셋
		const progress = getStoredProgress();
		DAILY_MISSIONS.forEach((mission) => {
			delete progress[mission.id];
		});
		saveProgress(progress);

		// 일일 통계 리셋
		const stats = getStoredStats();
		stats.dailyCookCount = 0;
		stats.dailyEarned = 0;
		stats.dailyDiscoveredRecipes = 0;
		saveStats(stats);

		saveResetDate(today);
	}
}

// ============================================
// Mission Store
// ============================================

function createMissionStore() {
	// 초기화 시 일일 리셋 체크
	if (browser) {
		checkAndResetDaily();
	}

	const { subscribe, set } = writable<Record<string, MissionProgress>>(getStoredProgress());
	const statsStore = writable<GameStats>(getStoredStats());

	/**
	 * 미션 진행도 업데이트
	 */
	function updateMissionProgress(type: MissionType, grade?: IngredientGrade): void {
		const progress = getStoredProgress();
		const stats = getStoredStats();
		const allMissions = [...DAILY_MISSIONS, ...ACHIEVEMENTS];

		// 해당 타입의 모든 미션 업데이트
		allMissions
			.filter((m) => m.type === type)
			.filter((m) => !m.grade || m.grade === grade) // 등급 조건 체크
			.forEach((mission) => {
				// 이미 완료된 미션은 스킵
				if (progress[mission.id]?.completed) return;

				// 진행도 계산
				let current = 0;

				if (mission.category === 'daily') {
					// 일일 미션: 일일 통계 기준
					switch (type) {
						case 'cook_count':
							current = stats.dailyCookCount;
							break;
						case 'earn_money':
							current = stats.dailyEarned;
							break;
						case 'discover_recipe':
							current = stats.dailyDiscoveredRecipes;
							break;
						default:
							current = progress[mission.id]?.current || 0;
					}
				} else {
					// 업적: 누적 통계 기준
					switch (type) {
						case 'cook_count':
							current = stats.totalCookCount;
							break;
						case 'earn_money':
							current = stats.totalEarned;
							break;
						case 'discover_recipe':
							current = stats.discoveredRecipes;
							break;
						case 'discover_ingredient':
							current = stats.discoveredIngredients;
							break;
						case 'cook_grade':
							current = stats.cookCountByGrade[grade || ''] || 0;
							break;
					}
				}

				const completed = current >= mission.target;

				progress[mission.id] = {
					missionId: mission.id,
					current,
					completed,
					claimed: progress[mission.id]?.claimed || false
				};
			});

		saveProgress(progress);
		set(progress);
	}

	return {
		subscribe,
		stats: { subscribe: statsStore.subscribe },

		/**
		 * 요리 완료 시 호출
		 */
		onCook: (grade: IngredientGrade, sellPrice: number) => {
			const stats = getStoredStats();

			// 통계 업데이트
			stats.totalCookCount += 1;
			stats.dailyCookCount += 1;
			stats.totalEarned += sellPrice;
			stats.dailyEarned += sellPrice;
			stats.cookCountByGrade[grade] = (stats.cookCountByGrade[grade] || 0) + 1;

			saveStats(stats);
			statsStore.set(stats);

			// 미션 진행도 업데이트
			updateMissionProgress('cook_count');
			updateMissionProgress('earn_money');
			updateMissionProgress('cook_grade', grade);
		},

		/**
		 * 새 레시피 발견 시 호출
		 */
		onDiscoverRecipe: () => {
			const stats = getStoredStats();
			stats.discoveredRecipes += 1;
			stats.dailyDiscoveredRecipes += 1;
			saveStats(stats);
			statsStore.set(stats);

			updateMissionProgress('discover_recipe');
		},

		/**
		 * 새 재료 발견 시 호출
		 */
		onDiscoverIngredient: () => {
			const stats = getStoredStats();
			stats.discoveredIngredients += 1;
			saveStats(stats);
			statsStore.set(stats);

			updateMissionProgress('discover_ingredient');
		},

		/**
		 * 보상 수령
		 */
		claimReward: (missionId: string): boolean => {
			const progress = getStoredProgress();
			const missionProgress = progress[missionId];

			if (!missionProgress?.completed || missionProgress.claimed) {
				return false;
			}

			const mission = getMissionById(missionId);
			if (!mission) return false;

			// 스타 지급
			starStore.add(mission.reward);

			// 수령 처리
			progress[missionId] = {
				...missionProgress,
				claimed: true
			};
			saveProgress(progress);
			set(progress);

			return true;
		},

		/**
		 * 미션 진행도 가져오기
		 */
		getProgress: (missionId: string): MissionProgress | undefined => {
			return getStoredProgress()[missionId];
		},

		/**
		 * 완료되었지만 수령하지 않은 미션 개수
		 */
		getUnclaimedCount: (): number => {
			const progress = getStoredProgress();
			return Object.values(progress).filter((p) => p.completed && !p.claimed).length;
		},

		/**
		 * 일일 리셋 체크 (앱 시작 시 호출)
		 */
		checkDailyReset: () => {
			checkAndResetDaily();
			set(getStoredProgress());
			statsStore.set(getStoredStats());
		},

		/**
		 * Store 새로고침
		 */
		refresh: () => {
			set(getStoredProgress());
			statsStore.set(getStoredStats());
		},

		/**
		 * 초기화 (테스트용)
		 */
		reset: () => {
			if (browser) {
				localStorage.removeItem(MISSION_PROGRESS_KEY);
				localStorage.removeItem(DAILY_RESET_KEY);
				localStorage.removeItem(STATS_KEY);
			}
			set({});
			statsStore.set(getDefaultStats());
		}
	};
}

export const missionStore = createMissionStore();
