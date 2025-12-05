import { writable, get } from 'svelte/store';
import { RECIPES } from './data/recipes';
import { findIngredientById } from './data/ingredients';
import type { Recipe, Ingredient, IngredientGrade } from './types';

/**
 * 손님 주문 시스템
 * - 세금 주기(10턴) 안에 주문한 요리를 만들면 보너스
 * - 못 만들어도 다른 요리 팔 수 있음 (기본 수익)
 */

export interface CustomerOrder {
	/** 주문 ID */
	id: string;
	/** 요청한 요리 (Recipe) */
	recipe: Recipe;
	/** 요청한 요리 결과물 (Ingredient) */
	dish: Ingredient;
	/** 보너스 금액 */
	bonusAmount: number;
	/** 주문 생성 턴 */
	createdAtTurn: number;
	/** 완료 여부 */
	completed: boolean;
}

/**
 * 요리(dish)만 필터링 (isIngredient === false)
 */
function getDishRecipes(): Recipe[] {
	return RECIPES.filter((recipe) => {
		const result = findIngredientById(recipe.resultIngredientId);
		return result && !result.isIngredient;
	});
}

/**
 * 등급별 요리 레시피 필터링
 */
function getDishRecipesByGrade(grade: IngredientGrade): Recipe[] {
	return getDishRecipes().filter((recipe) => {
		const result = findIngredientById(recipe.resultIngredientId);
		return result?.grade === grade;
	});
}

/**
 * 보너스 금액 계산 (등급별)
 */
function calculateBonus(grade: IngredientGrade): number {
	const bonusMap: Record<IngredientGrade, number> = {
		G: 30,
		F: 50,
		E: 80,
		D: 120,
		C: 180,
		B: 250,
		A: 350,
		R: 500
	};
	return bonusMap[grade];
}

/**
 * 랜덤 주문 생성
 * 난이도에 따라 등급 조절
 */
function generateRandomOrder(currentTurn: number, difficulty: number = 1): CustomerOrder | null {
	// 난이도에 따른 등급 가중치
	// difficulty 1: F~E 위주
	// difficulty 2: E~D 위주
	// difficulty 3+: D~C 위주
	const gradeWeights: Record<IngredientGrade, number>[] = [
		// difficulty 1
		{ G: 0, F: 50, E: 40, D: 10, C: 0, B: 0, A: 0, R: 0 },
		// difficulty 2
		{ G: 0, F: 20, E: 50, D: 25, C: 5, B: 0, A: 0, R: 0 },
		// difficulty 3+
		{ G: 0, F: 10, E: 30, D: 40, C: 15, B: 5, A: 0, R: 0 }
	];

	const weights = gradeWeights[Math.min(difficulty - 1, 2)];
	const grades: IngredientGrade[] = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'R'];

	// 가중치 기반 등급 선택
	const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
	let random = Math.random() * totalWeight;
	let selectedGrade: IngredientGrade = 'F';

	for (const grade of grades) {
		random -= weights[grade];
		if (random <= 0) {
			selectedGrade = grade;
			break;
		}
	}

	// 해당 등급의 요리 레시피 가져오기
	const recipes = getDishRecipesByGrade(selectedGrade);
	if (recipes.length === 0) {
		// 해당 등급에 요리가 없으면 F등급으로 폴백
		const fallbackRecipes = getDishRecipesByGrade('F');
		if (fallbackRecipes.length === 0) return null;
		const recipe = fallbackRecipes[Math.floor(Math.random() * fallbackRecipes.length)];
		const dish = findIngredientById(recipe.resultIngredientId);
		if (!dish) return null;

		return {
			id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
			recipe,
			dish,
			bonusAmount: calculateBonus('F'),
			createdAtTurn: currentTurn,
			completed: false
		};
	}

	// 랜덤 레시피 선택
	const recipe = recipes[Math.floor(Math.random() * recipes.length)];
	const dish = findIngredientById(recipe.resultIngredientId);
	if (!dish) return null;

	return {
		id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
		recipe,
		dish,
		bonusAmount: calculateBonus(selectedGrade),
		createdAtTurn: currentTurn,
		completed: false
	};
}

interface CustomerState {
	/** 현재 주문 */
	currentOrder: CustomerOrder | null;
	/** 난이도 (세금 생존 횟수에 따라 증가) */
	difficulty: number;
	/** 총 완료한 주문 수 */
	completedOrders: number;
	/** 총 획득한 보너스 */
	totalBonus: number;
}

function createCustomerStore() {
	const initialState: CustomerState = {
		currentOrder: null,
		difficulty: 1,
		completedOrders: 0,
		totalBonus: 0
	};

	const { subscribe, set, update } = writable<CustomerState>(initialState);

	return {
		subscribe,

		/**
		 * 새 주문 생성
		 */
		generateOrder: (currentTurn: number) => {
			update((state) => {
				const order = generateRandomOrder(currentTurn, state.difficulty);
				return {
					...state,
					currentOrder: order
				};
			});
		},

		/**
		 * 주문 완료 체크 (요리 결과가 주문과 일치하는지)
		 * @returns 보너스 금액 (일치하지 않으면 0)
		 */
		checkOrder: (resultIngredientId: number): number => {
			let bonus = 0;
			update((state) => {
				if (!state.currentOrder) return state;

				if (state.currentOrder.recipe.resultIngredientId === resultIngredientId) {
					// 주문 성공!
					bonus = state.currentOrder.bonusAmount;
					return {
						...state,
						currentOrder: { ...state.currentOrder, completed: true },
						completedOrders: state.completedOrders + 1,
						totalBonus: state.totalBonus + bonus
					};
				}

				return state;
			});
			return bonus;
		},

		/**
		 * 세금 주기 종료 시 호출 (주문 리셋 + 난이도 조절)
		 */
		onTaxPeriodEnd: (survived: boolean, currentTurn: number) => {
			update((state) => {
				const newDifficulty = survived ? state.difficulty + 1 : state.difficulty;
				const order = generateRandomOrder(currentTurn, newDifficulty);
				return {
					...state,
					currentOrder: order,
					difficulty: newDifficulty
				};
			});
		},

		/**
		 * 현재 주문 가져오기
		 */
		getCurrentOrder: (): CustomerOrder | null => {
			return get({ subscribe }).currentOrder;
		},

		/**
		 * 런 시작 시 초기화
		 */
		startRun: (currentTurn: number = 0) => {
			const order = generateRandomOrder(currentTurn, 1);
			set({
				currentOrder: order,
				difficulty: 1,
				completedOrders: 0,
				totalBonus: 0
			});
		},

		/**
		 * 초기화
		 */
		reset: () => {
			set(initialState);
		}
	};
}

export const customerStore = createCustomerStore();
