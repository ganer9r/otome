import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { findIngredientById } from './data/ingredients';
import type { Ingredient } from './types';
import {
	getUnlockedIngredients as getUnlockedIngredientsCore,
	unlockIngredient as unlockIngredientCore,
	resetUnlockedIngredients
} from './usecase/unlockIngredient';

const FAILED_COMBINATIONS_KEY = 'cook2_failed_combinations';
const TRIED_COMBINATIONS_KEY = 'cook2_tried_combinations';
const SUCCESS_COMBINATIONS_KEY = 'cook2_success_combinations';
const NEW_INGREDIENTS_KEY = 'cook2_new_ingredients';

/**
 * 오픈된 재료 ID 목록 관리
 * usecase/unlockIngredient와 연동
 */
function createUnlockedIngredientsStore() {
	const { subscribe, set } = writable<number[]>(getUnlockedIngredientsCore());

	return {
		subscribe,
		/**
		 * 재료 오픈
		 */
		unlock: (ingredientId: number) => {
			unlockIngredientCore(ingredientId);
			set(getUnlockedIngredientsCore());
		},
		/**
		 * Store 새로고침 (localStorage와 동기화)
		 */
		refresh: () => {
			set(getUnlockedIngredientsCore());
		},
		/**
		 * 초기화 (테스트용)
		 */
		reset: () => {
			resetUnlockedIngredients();
			set(getUnlockedIngredientsCore());
		}
	};
}

export const unlockedIngredientsStore = createUnlockedIngredientsStore();

/**
 * 오픈된 재료 객체 목록 (derived)
 */
export function getUnlockedIngredientsObjects(unlockedIds: number[]): Ingredient[] {
	return unlockedIds
		.map((id) => findIngredientById(id))
		.filter((ing): ing is Ingredient => ing !== undefined);
}

/**
 * 조합 키 생성 (순서 무관하게 정렬)
 */
function createCombinationKey(ingredientIds: number[]): string {
	return [...ingredientIds].sort((a, b) => a - b).join(',');
}

/**
 * 실패한 조합 목록 가져오기
 */
function getFailedCombinations(): Set<string> {
	if (!browser) return new Set();
	const stored = localStorage.getItem(FAILED_COMBINATIONS_KEY);
	if (!stored) return new Set();
	try {
		return new Set(JSON.parse(stored));
	} catch {
		return new Set();
	}
}

/**
 * 실패한 조합 목록 저장
 */
function saveFailedCombinations(combinations: Set<string>) {
	if (!browser) return;
	localStorage.setItem(FAILED_COMBINATIONS_KEY, JSON.stringify([...combinations]));
}

/**
 * 실패한 조합 관리 Store
 */
function createFailedCombinationsStore() {
	const { subscribe, set } = writable<Set<string>>(getFailedCombinations());

	return {
		subscribe,
		/**
		 * 실패한 조합 추가
		 */
		addFailed: (ingredientIds: number[]) => {
			const combinations = getFailedCombinations();
			const key = createCombinationKey(ingredientIds);
			combinations.add(key);
			saveFailedCombinations(combinations);
			set(combinations);
		},
		/**
		 * 조합이 실패했는지 확인
		 */
		isFailed: (ingredientIds: number[]): boolean => {
			const combinations = getFailedCombinations();
			const key = createCombinationKey(ingredientIds);
			return combinations.has(key);
		},
		/**
		 * 첫 번째 재료 기준으로 실패한 두 번째 재료 ID 목록 반환
		 */
		getFailedPairsFor: (firstIngredientId: number): number[] => {
			const combinations = getFailedCombinations();
			const failedPairs: number[] = [];
			combinations.forEach((key) => {
				const ids = key.split(',').map(Number);
				if (ids.includes(firstIngredientId)) {
					const otherId = ids.find((id) => id !== firstIngredientId);
					if (otherId !== undefined) {
						failedPairs.push(otherId);
					}
					// 같은 재료 2개 조합인 경우
					if (ids[0] === ids[1] && ids[0] === firstIngredientId) {
						failedPairs.push(firstIngredientId);
					}
				}
			});
			return failedPairs;
		},
		/**
		 * Store 새로고침
		 */
		refresh: () => {
			set(getFailedCombinations());
		},
		/**
		 * 초기화
		 */
		reset: () => {
			if (browser) {
				localStorage.removeItem(FAILED_COMBINATIONS_KEY);
			}
			set(new Set());
		}
	};
}

export const failedCombinationsStore = createFailedCombinationsStore();

/**
 * 시도한 조합 목록 가져오기 (성공 포함)
 */
function getTriedCombinations(): Set<string> {
	if (!browser) return new Set();
	const stored = localStorage.getItem(TRIED_COMBINATIONS_KEY);
	if (!stored) return new Set();
	try {
		return new Set(JSON.parse(stored));
	} catch {
		return new Set();
	}
}

/**
 * 시도한 조합 목록 저장
 */
function saveTriedCombinations(combinations: Set<string>) {
	if (!browser) return;
	localStorage.setItem(TRIED_COMBINATIONS_KEY, JSON.stringify([...combinations]));
}

/**
 * 시도한 조합 관리 Store (성공/실패 모두 포함)
 */
function createTriedCombinationsStore() {
	const { subscribe, set } = writable<Set<string>>(getTriedCombinations());

	return {
		subscribe,
		/**
		 * 시도한 조합 추가
		 */
		addTried: (ingredientIds: number[]) => {
			const combinations = getTriedCombinations();
			const key = createCombinationKey(ingredientIds);
			combinations.add(key);
			saveTriedCombinations(combinations);
			set(combinations);
		},
		/**
		 * 조합을 시도했는지 확인
		 */
		hasTried: (ingredientIds: number[]): boolean => {
			const combinations = getTriedCombinations();
			const key = createCombinationKey(ingredientIds);
			return combinations.has(key);
		},
		/**
		 * 첫 번째 재료 기준으로 시도한 두 번째 재료 ID 목록 반환
		 */
		getTriedPairsFor: (firstIngredientId: number): number[] => {
			const combinations = getTriedCombinations();
			const triedPairs: number[] = [];
			combinations.forEach((key) => {
				const ids = key.split(',').map(Number);
				if (ids.includes(firstIngredientId)) {
					const otherId = ids.find((id) => id !== firstIngredientId);
					if (otherId !== undefined) {
						triedPairs.push(otherId);
					}
					// 같은 재료 2개 조합인 경우
					if (ids[0] === ids[1] && ids[0] === firstIngredientId) {
						triedPairs.push(firstIngredientId);
					}
				}
			});
			return triedPairs;
		},
		/**
		 * Store 새로고침
		 */
		refresh: () => {
			set(getTriedCombinations());
		},
		/**
		 * 초기화
		 */
		reset: () => {
			if (browser) {
				localStorage.removeItem(TRIED_COMBINATIONS_KEY);
			}
			set(new Set());
		}
	};
}

export const triedCombinationsStore = createTriedCombinationsStore();

/**
 * 성공한 조합과 결과 저장 (조합키 -> 결과 재료 ID)
 */
type SuccessCombinations = Record<string, number>;

function getSuccessCombinations(): SuccessCombinations {
	if (!browser) return {};
	const stored = localStorage.getItem(SUCCESS_COMBINATIONS_KEY);
	if (!stored) return {};
	try {
		return JSON.parse(stored);
	} catch {
		return {};
	}
}

function saveSuccessCombinations(combinations: SuccessCombinations) {
	if (!browser) return;
	localStorage.setItem(SUCCESS_COMBINATIONS_KEY, JSON.stringify(combinations));
}

function createSuccessCombinationsStore() {
	const { subscribe, set } = writable<SuccessCombinations>(getSuccessCombinations());

	return {
		subscribe,
		/**
		 * 성공한 조합 추가
		 */
		addSuccess: (ingredientIds: number[], resultId: number) => {
			const combinations = getSuccessCombinations();
			const key = createCombinationKey(ingredientIds);
			combinations[key] = resultId;
			saveSuccessCombinations(combinations);
			set(combinations);
		},
		/**
		 * 첫 번째 재료 기준으로 성공한 조합의 결과 맵 반환
		 * { secondIngredientId: resultIngredientId }
		 */
		getSuccessResultsFor: (firstIngredientId: number): Record<number, number> => {
			const combinations = getSuccessCombinations();
			const results: Record<number, number> = {};
			Object.entries(combinations).forEach(([key, resultId]) => {
				const ids = key.split(',').map(Number);
				if (ids.includes(firstIngredientId)) {
					const otherId = ids.find((id) => id !== firstIngredientId);
					if (otherId !== undefined) {
						results[otherId] = resultId;
					}
					// 같은 재료 2개 조합인 경우
					if (ids[0] === ids[1] && ids[0] === firstIngredientId) {
						results[firstIngredientId] = resultId;
					}
				}
			});
			return results;
		},
		/**
		 * Store 새로고침
		 */
		refresh: () => {
			set(getSuccessCombinations());
		},
		/**
		 * 초기화
		 */
		reset: () => {
			if (browser) {
				localStorage.removeItem(SUCCESS_COMBINATIONS_KEY);
			}
			set({});
		}
	};
}

export const successCombinationsStore = createSuccessCombinationsStore();

/**
 * 새로 획득한 재료 ID 목록 (NEW 뱃지 표시용)
 */
function getNewIngredients(): Set<number> {
	if (!browser) return new Set();
	const stored = localStorage.getItem(NEW_INGREDIENTS_KEY);
	if (!stored) return new Set();
	try {
		return new Set(JSON.parse(stored));
	} catch {
		return new Set();
	}
}

function saveNewIngredients(ids: Set<number>) {
	if (!browser) return;
	localStorage.setItem(NEW_INGREDIENTS_KEY, JSON.stringify([...ids]));
}

function createNewIngredientsStore() {
	const { subscribe, set } = writable<Set<number>>(getNewIngredients());

	return {
		subscribe,
		/**
		 * 새 재료 추가 (NEW 뱃지 표시)
		 */
		add: (ingredientId: number) => {
			const newIds = getNewIngredients();
			newIds.add(ingredientId);
			saveNewIngredients(newIds);
			set(newIds);
		},
		/**
		 * NEW 뱃지 제거 (재료 확인 시)
		 */
		markSeen: (ingredientId: number) => {
			const newIds = getNewIngredients();
			newIds.delete(ingredientId);
			saveNewIngredients(newIds);
			set(newIds);
		},
		/**
		 * 모든 NEW 뱃지 제거
		 */
		clearAll: () => {
			if (browser) {
				localStorage.removeItem(NEW_INGREDIENTS_KEY);
			}
			set(new Set());
		},
		/**
		 * 새 재료인지 확인
		 */
		isNew: (ingredientId: number): boolean => {
			return getNewIngredients().has(ingredientId);
		},
		/**
		 * Store 새로고침
		 */
		refresh: () => {
			set(getNewIngredients());
		}
	};
}

export const newIngredientsStore = createNewIngredientsStore();

/**
 * 해금된 요리(레시피 결과물) Store
 * unlockedIngredientsStore에서 isIngredient=false인 것만 필터링
 */
export function getUnlockedDishIds(): Set<number> {
	const unlockedIds = getUnlockedIngredientsCore();
	const dishIds = new Set<number>();

	for (const id of unlockedIds) {
		const ing = findIngredientById(id);
		if (ing && !ing.isIngredient) {
			dishIds.add(id);
		}
	}
	return dishIds;
}

function createUnlockedDishesStore() {
	const { subscribe, set } = writable<Set<number>>(getUnlockedDishIds());

	return {
		subscribe,
		refresh: () => {
			set(getUnlockedDishIds());
		},
		reset: () => {
			// unlockedIngredientsStore.reset()이 호출되면 이것도 같이 리셋됨
			set(new Set());
		}
	};
}

export const unlockedDishesStore = createUnlockedDishesStore();

// ============================================
// 스타 시스템 (영구 재화)
// ============================================

const STAR_STORAGE_KEY = 'cook2_stars';

function getStoredStars(): number {
	if (!browser) return 0;
	const stored = localStorage.getItem(STAR_STORAGE_KEY);
	return stored ? parseInt(stored, 10) : 0;
}

function saveStars(stars: number) {
	if (!browser) return;
	localStorage.setItem(STAR_STORAGE_KEY, String(stars));
}

function createStarStore() {
	const { subscribe, set, update } = writable<number>(getStoredStars());

	return {
		subscribe,
		/**
		 * 스타 추가 (런 종료 시)
		 */
		add: (amount: number) => {
			update((current) => {
				const newTotal = current + amount;
				saveStars(newTotal);
				return newTotal;
			});
		},
		/**
		 * 스타 차감 (업그레이드 구매 시)
		 */
		spend: (amount: number): boolean => {
			let success = false;
			update((current) => {
				if (current >= amount) {
					const newTotal = current - amount;
					saveStars(newTotal);
					success = true;
					return newTotal;
				}
				return current;
			});
			return success;
		},
		/**
		 * Store 새로고침
		 */
		refresh: () => {
			set(getStoredStars());
		},
		/**
		 * 초기화 (테스트용)
		 */
		reset: () => {
			if (browser) {
				localStorage.removeItem(STAR_STORAGE_KEY);
			}
			set(0);
		}
	};
}

export const starStore = createStarStore();

// ============================================
// 영구 업그레이드 시스템
// ============================================

const UPGRADE_STORAGE_KEY = 'cook2_upgrades';

/** 업그레이드 설정 */
export const UPGRADE_CONFIG = {
	/** 초기 비용 (모든 업그레이드 동일) */
	BASE_COST: 5,
	/** 최대 레벨 */
	MAX_LEVEL: 10,
	/** 업그레이드별 효과 */
	EFFECTS: {
		/** 초기 자본 증가량 (레벨당) */
		INITIAL_CAPITAL_PER_LEVEL: 50,
		/** 재료비 할인율 (레벨당, 0.03 = 3%) */
		INGREDIENT_DISCOUNT_PER_LEVEL: 0.03,
		/** 판매가 상승률 (레벨당, 0.03 = 3%) */
		SELL_BONUS_PER_LEVEL: 0.03
	}
} as const;

export type UpgradeType = 'initialCapital' | 'ingredientDiscount' | 'sellBonus';

export interface UpgradeState {
	/** 초기 자본 업그레이드 레벨 */
	initialCapital: number;
	/** 재료비 할인 업그레이드 레벨 */
	ingredientDiscount: number;
	/** 판매가 상승 업그레이드 레벨 */
	sellBonus: number;
}

function getStoredUpgrades(): UpgradeState {
	if (!browser) return { initialCapital: 0, ingredientDiscount: 0, sellBonus: 0 };
	const stored = localStorage.getItem(UPGRADE_STORAGE_KEY);
	if (!stored) return { initialCapital: 0, ingredientDiscount: 0, sellBonus: 0 };
	try {
		return JSON.parse(stored);
	} catch {
		return { initialCapital: 0, ingredientDiscount: 0, sellBonus: 0 };
	}
}

function saveUpgrades(upgrades: UpgradeState) {
	if (!browser) return;
	localStorage.setItem(UPGRADE_STORAGE_KEY, JSON.stringify(upgrades));
}

/**
 * 업그레이드 비용 계산 (뱀서 방식: BASE_COST × 레벨)
 */
export function getUpgradeCost(level: number): number {
	return UPGRADE_CONFIG.BASE_COST * (level + 1);
}

/**
 * 업그레이드 효과 계산
 */
export function getUpgradeEffects(state: UpgradeState) {
	return {
		/** 추가 초기 자본 */
		bonusInitialCapital: state.initialCapital * UPGRADE_CONFIG.EFFECTS.INITIAL_CAPITAL_PER_LEVEL,
		/** 재료비 할인율 (0.09 = 9%) */
		ingredientDiscountRate:
			state.ingredientDiscount * UPGRADE_CONFIG.EFFECTS.INGREDIENT_DISCOUNT_PER_LEVEL,
		/** 판매가 상승률 (0.09 = 9%) */
		sellBonusRate: state.sellBonus * UPGRADE_CONFIG.EFFECTS.SELL_BONUS_PER_LEVEL
	};
}

function createUpgradeStore() {
	const { subscribe, set } = writable<UpgradeState>(getStoredUpgrades());

	return {
		subscribe,
		/**
		 * 업그레이드 구매
		 * @returns 성공 여부
		 */
		purchase: (type: UpgradeType): boolean => {
			const currentUpgrades = getStoredUpgrades();
			const currentLevel = currentUpgrades[type];

			// 최대 레벨 체크
			if (currentLevel >= UPGRADE_CONFIG.MAX_LEVEL) {
				return false;
			}

			// 비용 계산
			const cost = getUpgradeCost(currentLevel);

			// 스타 차감 시도
			const success = starStore.spend(cost);
			if (!success) {
				return false;
			}

			// 업그레이드 레벨 증가
			const newUpgrades = {
				...currentUpgrades,
				[type]: currentLevel + 1
			};
			saveUpgrades(newUpgrades);
			set(newUpgrades);

			return true;
		},
		/**
		 * 현재 업그레이드 효과 가져오기
		 */
		getEffects: () => {
			return getUpgradeEffects(getStoredUpgrades());
		},
		/**
		 * Store 새로고침
		 */
		refresh: () => {
			set(getStoredUpgrades());
		},
		/**
		 * 초기화 (테스트용)
		 */
		reset: () => {
			if (browser) {
				localStorage.removeItem(UPGRADE_STORAGE_KEY);
			}
			set({ initialCapital: 0, ingredientDiscount: 0, sellBonus: 0 });
		}
	};
}

export const upgradeStore = createUpgradeStore();

// ============================================
// 런 상태 관리 (로그라이트)
// ============================================

/** 게임 밸런스 상수 (테스트용 조절 가능) */
export const RUN_CONFIG = {
	/** 초기 자본 */
	INITIAL_CAPITAL: 500,
	/** 세금 징수 주기 (턴) */
	TAX_INTERVAL: 3,
	/** 세금률 (0.2 = 20%) */
	TAX_RATE: 0.2
} as const;

export interface RunState {
	/** 현재 자본 */
	capital: number;
	/** 현재 턴 */
	turn: number;
	/** 런 진행 중 여부 */
	isRunning: boolean;
	/** 누적 수익 (세금 계산용) */
	totalEarned: number;
	/** 파산 여부 */
	isBankrupt: boolean;
	/** 런 중 획득한 스타 (세금 생존 시마다 +1) */
	earnedStars: number;
}

export interface TaxResult {
	/** 세금 징수 여부 */
	collected: boolean;
	/** 징수된 세금액 */
	taxAmount: number;
	/** 파산 여부 */
	isBankrupt: boolean;
	/** 스타 획득 여부 (생존 시) */
	starEarned: boolean;
}

function createRunStore() {
	const initialState: RunState = {
		capital: RUN_CONFIG.INITIAL_CAPITAL,
		turn: 0,
		isRunning: false,
		totalEarned: 0,
		isBankrupt: false,
		earnedStars: 0
	};

	const { subscribe, set, update } = writable<RunState>(initialState);

	return {
		subscribe,
		/**
		 * 새 런 시작 (업그레이드 효과 적용)
		 */
		startRun: () => {
			const effects = getUpgradeEffects(getStoredUpgrades());
			const initialCapital = RUN_CONFIG.INITIAL_CAPITAL + effects.bonusInitialCapital;

			set({
				capital: initialCapital,
				turn: 0,
				isRunning: true,
				totalEarned: 0,
				isBankrupt: false,
				earnedStars: 0
			});
		},
		/**
		 * 런 종료
		 */
		endRun: () => {
			update((state) => ({
				...state,
				isRunning: false
			}));
		},
		/**
		 * 자본 차감 (재료 구매) - 마이너스 허용
		 */
		spend: (amount: number) => {
			update((state) => ({
				...state,
				capital: state.capital - amount
			}));
		},
		/**
		 * 자본 추가 (요리 판매)
		 */
		earn: (amount: number) => {
			update((state) => ({
				...state,
				capital: state.capital + amount,
				totalEarned: state.totalEarned + amount
			}));
		},
		/**
		 * 턴 증가 + 세금 징수 체크
		 * @returns 세금 징수 결과
		 */
		nextTurn: (): TaxResult => {
			let result: TaxResult = {
				collected: false,
				taxAmount: 0,
				isBankrupt: false,
				starEarned: false
			};

			update((state) => {
				const newTurn = state.turn + 1;

				// 세금 징수 턴인지 확인
				if (newTurn > 0 && newTurn % RUN_CONFIG.TAX_INTERVAL === 0) {
					const taxAmount = Math.floor(state.totalEarned * RUN_CONFIG.TAX_RATE);
					const newCapital = state.capital - taxAmount;
					const isBankrupt = newCapital < 0;
					const starEarned = !isBankrupt; // 생존하면 스타 획득

					result = { collected: true, taxAmount, isBankrupt, starEarned };

					return {
						...state,
						turn: newTurn,
						capital: newCapital,
						totalEarned: 0, // 세금 징수 후 리셋
						isBankrupt,
						earnedStars: starEarned ? state.earnedStars + 1 : state.earnedStars
					};
				}

				return { ...state, turn: newTurn };
			});

			return result;
		},
		/**
		 * 다음 세금까지 남은 턴
		 */
		getTurnsUntilTax: (currentTurn: number): number => {
			return RUN_CONFIG.TAX_INTERVAL - (currentTurn % RUN_CONFIG.TAX_INTERVAL);
		},
		/**
		 * 초기화
		 */
		reset: () => {
			set(initialState);
		}
	};
}

export const runStore = createRunStore();

// ============================================
// 영구 재료 해금 시스템
// ============================================

const PERMANENT_UNLOCK_KEY = 'cook2_permanent_unlocks';

/** 등급별 해금 비용 (스타) */
export const UNLOCK_COSTS: Record<string, number> = {
	G: 0, // 기본 해금
	F: 3,
	E: 5,
	D: 8,
	C: 12,
	B: 18,
	A: 25,
	R: 35
};

function getStoredPermanentUnlocks(): Set<number> {
	if (!browser) return new Set();
	const stored = localStorage.getItem(PERMANENT_UNLOCK_KEY);
	if (!stored) return new Set();
	try {
		return new Set(JSON.parse(stored));
	} catch {
		return new Set();
	}
}

function savePermanentUnlocks(unlocks: Set<number>) {
	if (!browser) return;
	localStorage.setItem(PERMANENT_UNLOCK_KEY, JSON.stringify([...unlocks]));
}

function createPermanentUnlockStore() {
	const { subscribe, set } = writable<Set<number>>(getStoredPermanentUnlocks());

	return {
		subscribe,
		/**
		 * 재료가 영구 해금되었는지 확인
		 */
		isUnlocked: (ingredientId: number): boolean => {
			return getStoredPermanentUnlocks().has(ingredientId);
		},
		/**
		 * 단일 재료 해금
		 */
		unlock: (ingredientId: number) => {
			const unlocks = getStoredPermanentUnlocks();
			unlocks.add(ingredientId);
			savePermanentUnlocks(unlocks);
			set(unlocks);
		},
		/**
		 * 여러 재료 해금 (연관 재료 포함)
		 */
		unlockMultiple: (ingredientIds: number[]) => {
			const unlocks = getStoredPermanentUnlocks();
			ingredientIds.forEach((id) => unlocks.add(id));
			savePermanentUnlocks(unlocks);
			set(unlocks);
		},
		/**
		 * Store 새로고침
		 */
		refresh: () => {
			set(getStoredPermanentUnlocks());
		},
		/**
		 * 초기화 (테스트용)
		 */
		reset: () => {
			if (browser) {
				localStorage.removeItem(PERMANENT_UNLOCK_KEY);
			}
			set(new Set());
		}
	};
}

export const permanentUnlockStore = createPermanentUnlockStore();
