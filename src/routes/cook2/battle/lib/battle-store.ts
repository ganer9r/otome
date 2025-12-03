/**
 * 대결 상태 관리
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Chef } from './chef-data';
import type { CookStep } from './recipe-tree';

const BATTLE_PROGRESS_KEY = 'cook2_battle_progress';

export interface BattleState {
	/** 현재 대결 중인 요리사 */
	currentChef: Chef | null;
	/** 선택한 레시피 결과 ID */
	selectedRecipeId: number | null;
	/** 조리 단계들 */
	cookingSteps: CookStep[];
	/** 현재 진행 중인 단계 인덱스 */
	currentStepIndex: number;
	/** 대결 진행 중 여부 */
	isInBattle: boolean;
	/** 대결 결과 */
	result: 'win' | 'lose' | null;
	/** 내 요리 판매가 */
	myScore: number;
}

const initialState: BattleState = {
	currentChef: null,
	selectedRecipeId: null,
	cookingSteps: [],
	currentStepIndex: 0,
	isInBattle: false,
	result: null,
	myScore: 0
};

/** 클리어한 스테이지 저장/불러오기 */
function getClearedStage(): number {
	if (!browser) return 0;
	const stored = localStorage.getItem(BATTLE_PROGRESS_KEY);
	return stored ? parseInt(stored, 10) : 0;
}

function saveClearedStage(stage: number): void {
	if (!browser) return;
	localStorage.setItem(BATTLE_PROGRESS_KEY, String(stage));
}

function createBattleStore() {
	const { subscribe, set, update } = writable<BattleState>(initialState);

	return {
		subscribe,

		/** 대결 시작 (요리사 설정) */
		startBattle: (chef: Chef) => {
			set({
				...initialState,
				currentChef: chef,
				isInBattle: true
			});
		},

		/** 레시피 선택 */
		selectRecipe: (recipeId: number, steps: CookStep[]) => {
			update((state) => ({
				...state,
				selectedRecipeId: recipeId,
				cookingSteps: steps,
				currentStepIndex: 0
			}));
		},

		/** 다음 조리 단계로 */
		nextStep: () => {
			update((state) => ({
				...state,
				currentStepIndex: state.currentStepIndex + 1
			}));
		},

		/** 대결 결과 설정 */
		setResult: (myScore: number, opponentPower: number) => {
			const result = myScore > opponentPower ? 'win' : 'lose';

			// 결과 저장하지 않음 (테스트용)

			update((state) => ({
				...state,
				result,
				myScore
			}));
		},

		/** 대결 종료 (초기화) */
		endBattle: () => {
			set(initialState);
		},

		/** 클리어한 스테이지 가져오기 */
		getClearedStage,

		/** 초기화 (테스트용) */
		reset: () => {
			if (browser) {
				localStorage.removeItem(BATTLE_PROGRESS_KEY);
			}
			set(initialState);
		}
	};
}

export const battleStore = createBattleStore();
