import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { RECIPES } from './data/recipes';
import { findIngredientById } from './data/ingredients';
import { getUnlockedIngredients } from './usecase/unlockIngredient';
import type { Recipe, Ingredient, IngredientGrade } from './types';

const CUSTOMER_STORAGE_KEY = 'cook2_customer_state';

/**
 * 손님 주문 시스템
 * - 내 재료 1개 + 모르는 재료 1개 조합인 레시피를 주문
 * - 가진 재료만 힌트로 보여주고, 없는 건 "???"
 * - 세금 주기(10턴) 안에 주문한 요리를 만들면 보너스
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
	/** 힌트 공개 여부 (RV 시청 시 true) */
	hintRevealed: boolean;
}

/**
 * 힌트 정보 (재료별 공개 여부)
 */
export interface OrderHint {
	/** 재료 ID */
	ingredientId: number;
	/** 재료 이름 */
	name: string;
	/** 공개 여부 (내가 가진 재료 or RV 시청) */
	revealed: boolean;
	/** 내가 가진 재료인지 */
	owned: boolean;
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
 * 주문 가능한 레시피 필터링
 * - 재료 2개 레시피만
 * - 내 재료 1개 + 모르는 재료 1개
 */
function getOrderableRecipes(unlockedIds: number[]): Recipe[] {
	const dishRecipes = getDishRecipes();
	const unlockedSet = new Set(unlockedIds);

	return dishRecipes.filter((recipe) => {
		// 2개 재료 레시피만
		if (recipe.ingredientIds.length !== 2) return false;

		const [id1, id2] = recipe.ingredientIds;
		const has1 = unlockedSet.has(id1);
		const has2 = unlockedSet.has(id2);

		// 하나만 가지고 있어야 함 (XOR)
		return (has1 && !has2) || (!has1 && has2);
	});
}

/**
 * 등급별 필터링
 */
function filterByGrade(recipes: Recipe[], grade: IngredientGrade): Recipe[] {
	return recipes.filter((recipe) => {
		const result = findIngredientById(recipe.resultIngredientId);
		return result?.grade === grade;
	});
}

/**
 * 랜덤 주문 생성
 * - 내 재료 기반으로 주문 가능한 레시피 선택
 *
 * TODO: 테스트 끝나면 원복 필요
 */
function generateRandomOrder(currentTurn: number, _difficulty: number = 1): CustomerOrder | null {
	const unlockedIds = getUnlockedIngredients();

	// 난이도에 따라 등급 선택
	const gradesByDifficulty: IngredientGrade[][] = [
		['F', 'E'], // 난이도 1
		['E', 'D'], // 난이도 2
		['D', 'C'], // 난이도 3
		['C', 'B'], // 난이도 4
		['B', 'A'], // 난이도 5+
		['A', 'R'] // 난이도 6+
	];

	const gradeIndex = Math.min(_difficulty - 1, gradesByDifficulty.length - 1);
	const targetGrades = gradesByDifficulty[gradeIndex];

	// 주문 가능한 레시피 찾기
	let orderableRecipes = getOrderableRecipes(unlockedIds);

	// 등급 필터링
	for (const grade of targetGrades) {
		const filtered = filterByGrade(orderableRecipes, grade);
		if (filtered.length > 0) {
			orderableRecipes = filtered;
			break;
		}
	}

	// 주문 가능한 레시피가 없으면 모든 요리 레시피에서 선택
	if (orderableRecipes.length === 0) {
		const allDishRecipes = getDishRecipes();
		if (allDishRecipes.length === 0) return null;
		orderableRecipes = allDishRecipes;
	}

	// 랜덤 선택
	const recipe = orderableRecipes[Math.floor(Math.random() * orderableRecipes.length)];
	const dish = findIngredientById(recipe.resultIngredientId);

	if (!dish) return null;

	return {
		id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
		recipe,
		dish,
		bonusAmount: calculateBonus(dish.grade),
		createdAtTurn: currentTurn,
		completed: false,
		hintRevealed: false
	};
}

/**
 * 주문의 힌트 정보 가져오기
 * - 내가 가진 재료는 이름 표시
 * - 없는 재료는 "???"
 */
export function getOrderHints(order: CustomerOrder | null): OrderHint[] {
	if (!order) return [];

	const unlockedIds = getUnlockedIngredients();
	const unlockedSet = new Set(unlockedIds);

	return order.recipe.ingredientIds.map((id) => {
		const ingredient = findIngredientById(id);
		const owned = unlockedSet.has(id);
		const revealed = owned || order.hintRevealed;

		return {
			ingredientId: id,
			name: ingredient?.name ?? '???',
			revealed,
			owned
		};
	});
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

const initialState: CustomerState = {
	currentOrder: null,
	difficulty: 1,
	completedOrders: 0,
	totalBonus: 0
};

/**
 * localStorage에서 상태 복원
 */
function getStoredCustomerState(): CustomerState {
	if (!browser) return initialState;
	const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
	if (!stored) return initialState;
	try {
		const parsed = JSON.parse(stored);
		// recipe, dish 객체 복원 (ID만 저장되어 있으므로)
		if (parsed.currentOrder) {
			const recipe = RECIPES.find((r) => r.id === parsed.currentOrder.recipeId);
			const dish = findIngredientById(parsed.currentOrder.dishId);
			if (recipe && dish) {
				parsed.currentOrder.recipe = recipe;
				parsed.currentOrder.dish = dish;
			} else {
				parsed.currentOrder = null;
			}
		}
		return parsed;
	} catch {
		return initialState;
	}
}

/**
 * localStorage에 상태 저장
 */
function saveCustomerState(state: CustomerState) {
	if (!browser) return;
	// recipe, dish는 ID만 저장 (객체 전체 저장하면 너무 큼)
	const toSave = {
		...state,
		currentOrder: state.currentOrder
			? {
					...state.currentOrder,
					recipeId: state.currentOrder.recipe.id,
					dishId: state.currentOrder.dish.id,
					recipe: undefined,
					dish: undefined
				}
			: null
	};
	localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(toSave));
}

function createCustomerStore() {
	const { subscribe, set, update } = writable<CustomerState>(getStoredCustomerState());

	// 상태 변경 시 자동 저장
	const updateAndSave = (updater: (state: CustomerState) => CustomerState) => {
		update((state) => {
			const newState = updater(state);
			saveCustomerState(newState);
			return newState;
		});
	};

	return {
		subscribe,

		/**
		 * 새 주문 생성
		 */
		generateOrder: (currentTurn: number) => {
			updateAndSave((state) => {
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
			updateAndSave((state) => {
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
		 * 힌트 공개 (RV 시청 후)
		 */
		revealHint: () => {
			updateAndSave((state) => {
				if (!state.currentOrder) return state;
				return {
					...state,
					currentOrder: { ...state.currentOrder, hintRevealed: true }
				};
			});
		},

		/**
		 * 세금 주기 종료 시 호출 (주문 리셋 + 난이도 조절)
		 */
		onTaxPeriodEnd: (survived: boolean, currentTurn: number) => {
			updateAndSave((state) => {
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
			const newState = {
				currentOrder: order,
				difficulty: 1,
				completedOrders: 0,
				totalBonus: 0
			};
			saveCustomerState(newState);
			set(newState);
		},

		/**
		 * 초기화
		 */
		reset: () => {
			if (browser) {
				localStorage.removeItem(CUSTOMER_STORAGE_KEY);
			}
			set(initialState);
		},

		/**
		 * 테스트용: 특정 레시피로 주문 생성
		 */
		setTestOrder: (recipeId: number, currentTurn: number = 0) => {
			const recipe = RECIPES.find((r) => r.id === recipeId);
			if (!recipe) return;

			const dish = findIngredientById(recipe.resultIngredientId);
			if (!dish) return;

			const order: CustomerOrder = {
				id: `test-order-${Date.now()}`,
				recipe,
				dish,
				bonusAmount: calculateBonus(dish.grade),
				createdAtTurn: currentTurn,
				completed: false,
				hintRevealed: false
			};

			updateAndSave((state) => ({
				...state,
				currentOrder: order
			}));
		}
	};
}

export const customerStore = createCustomerStore();
