import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { RECIPES } from './data/recipes';
import { findIngredientById } from './data/ingredients';
import { getUnlockedIngredients } from './usecase/unlockIngredient';
import type { Recipe, Ingredient, IngredientGrade } from './types';

const CUSTOMER_STORAGE_KEY = 'cook2_customer_state';

/** 스테이지별 설정 */
export const STAGE_CONFIG = {
	/** 스테이지별 주문 목표 개수 */
	ORDER_TARGETS: [2, 3, 3, 4, 4, 5, 5, 6, 6, 7], // 스테이지 1~10
	/** 기본 세금률 */
	BASE_TAX_RATE: 0.3,
	/** 주문 실패 시 세금률 증가량 */
	TAX_RATE_PENALTY: 0.05,
	/** 최대 세금률 */
	MAX_TAX_RATE: 0.6
} as const;

/** 스테이지 주문 목표 가져오기 */
export function getOrderTarget(stage: number): number {
	const index = Math.min(stage - 1, STAGE_CONFIG.ORDER_TARGETS.length - 1);
	return STAGE_CONFIG.ORDER_TARGETS[Math.max(0, index)];
}

/**
 * 손님 주문 시스템
 * - 내 재료 1개 + 모르는 재료 1개 조합인 레시피를 주문
 * - 가진 재료만 힌트로 보여주고, 없는 건 "???"
 * - 세금 주기(10턴) 안에 주문한 요리를 만들면 보너스
 */

/** 현재 사용 가능한 캐릭터 수 (최대 9) */
export const MAX_CUSTOMER_ID = 2;

export interface CustomerOrder {
	/** 주문 ID */
	id: string;
	/** 손님 캐릭터 ID (1~9) */
	customerId: number;
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
	/** 짧은 대사 (등장 시) */
	arrivalMessage: string;
	/** 짧은 대사 (완료 시) */
	completeMessage: string;
}

/**
 * 캐릭터 이미지 경로 생성
 * @param customerId 손님 ID (1~9)
 * @param state 상태 ('order' | 'success' | 'fail')
 */
export function getCustomerImagePath(
	customerId: number,
	state: 'order' | 'success' | 'fail'
): string {
	return `/imgs/character/customer/customer_${customerId}_${state}.png`;
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

/** 등장 대사 풀 */
const ARRIVAL_MESSAGES = [
	'배고파요~',
	'맛있는 거 주세요!',
	'기대할게요!',
	'오늘 뭐가 맛있어요?',
	'추천해주세요!',
	'출출해서 왔어요~',
	'여기 음식이 맛있다던데!',
	'빨리 먹고 싶어요!',
	'든든하게 한 끼 하려고요!',
	'맛집이라고 들었어요!'
];

/** 완료 대사 풀 */
const COMPLETE_MESSAGES = [
	'맛있어요!',
	'감사합니다!',
	'또 올게요!',
	'최고예요!',
	'역시 여기가 맛있네요!',
	'기대 이상이에요!',
	'친구한테 추천할게요!',
	'정말 맛있었어요!',
	'행복해요~',
	'완벽해요!'
];

/** 랜덤 대사 가져오기 */
function getRandomMessage(messages: string[]): string {
	return messages[Math.floor(Math.random() * messages.length)];
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
 * - 내 재료 1개 이상 보유
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

		// 최소 1개 이상 가지고 있어야 함 (힌트 제공 가능)
		return has1 || has2;
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

	// 주문 가능한 레시피가 없으면 해당 등급의 모든 요리에서 선택
	if (orderableRecipes.length === 0) {
		const allDishRecipes = getDishRecipes();
		if (allDishRecipes.length === 0) return null;

		// 등급 필터링 적용
		for (const grade of targetGrades) {
			const filtered = filterByGrade(allDishRecipes, grade);
			if (filtered.length > 0) {
				orderableRecipes = filtered;
				break;
			}
		}

		// 그래도 없으면 F, E, D 순서로 시도
		if (orderableRecipes.length === 0) {
			const fallbackGrades: IngredientGrade[] = ['F', 'E', 'D', 'C'];
			for (const grade of fallbackGrades) {
				const filtered = filterByGrade(allDishRecipes, grade);
				if (filtered.length > 0) {
					orderableRecipes = filtered;
					break;
				}
			}
		}

		// 최후의 수단: 아무 요리나
		if (orderableRecipes.length === 0) {
			orderableRecipes = allDishRecipes;
		}
	}

	// 랜덤 선택
	const recipe = orderableRecipes[Math.floor(Math.random() * orderableRecipes.length)];
	const dish = findIngredientById(recipe.resultIngredientId);

	if (!dish) return null;

	// 랜덤 캐릭터 ID 생성 (1 ~ MAX_CUSTOMER_ID)
	const customerId = Math.floor(Math.random() * MAX_CUSTOMER_ID) + 1;

	return {
		id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
		customerId,
		recipe,
		dish,
		bonusAmount: calculateBonus(dish.grade),
		createdAtTurn: currentTurn,
		completed: false,
		hintRevealed: false,
		arrivalMessage: getRandomMessage(ARRIVAL_MESSAGES),
		completeMessage: getRandomMessage(COMPLETE_MESSAGES)
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

/**
 * 새 주문 모달용 힌트 정보 가져오기 (등급별 공개 수준)
 * - F급: 전체 공개 (튜토리얼)
 * - E급: 1개 공개 (가진 재료 우선)
 * - D급~: ??? + ??? (RV로 공개)
 */
export function getOrderHintsForModal(order: CustomerOrder | null): OrderHint[] {
	if (!order) return [];

	const dishGrade = order.dish.grade;
	const unlockedIds = getUnlockedIngredients();
	const unlockedSet = new Set(unlockedIds);

	return order.recipe.ingredientIds.map((id, index) => {
		const ingredient = findIngredientById(id);
		const owned = unlockedSet.has(id);

		let revealed = false;

		if (dishGrade === 'F') {
			// F급: 전체 공개
			revealed = true;
		} else if (dishGrade === 'E') {
			// E급: 가진 재료 공개, 또는 첫 번째 재료만 공개
			revealed = owned || index === 0;
		} else {
			// D급 이상: 가진 재료만 공개
			revealed = owned;
		}

		// RV로 힌트 공개한 경우
		if (order.hintRevealed) {
			revealed = true;
		}

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
	/** 난이도 (세금 생존 횟수에 따라 증가) = 스테이지 */
	difficulty: number;
	/** 총 완료한 주문 수 (전체) */
	completedOrders: number;
	/** 총 획득한 보너스 */
	totalBonus: number;
	/** 현재 스테이지 완료한 주문 수 */
	stageCompletedOrders: number;
	/** 현재 세금률 */
	taxRate: number;
	/** 새 주문 등장 플래그 (모달 표시용) */
	showNewOrderModal: boolean;
	/** 주문 완료 플래그 (모달 표시용) */
	showOrderCompleteModal: boolean;
	/** 주문 실패 플래그 (모달 표시용) */
	showOrderFailModal: boolean;
	/** 마지막 완료된 주문 (완료 모달용) */
	lastCompletedOrder: CustomerOrder | null;
	/** 마지막 실패한 주문 (실패 모달용) */
	lastFailedOrder: CustomerOrder | null;
}

const initialState: CustomerState = {
	currentOrder: null,
	difficulty: 1,
	completedOrders: 0,
	totalBonus: 0,
	stageCompletedOrders: 0,
	taxRate: STAGE_CONFIG.BASE_TAX_RATE,
	showNewOrderModal: false,
	showOrderCompleteModal: false,
	showOrderFailModal: false,
	lastCompletedOrder: null,
	lastFailedOrder: null
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
				// 완전히 새 객체로 복원 (기존 undefined 값 제거)
				parsed.currentOrder = {
					id: parsed.currentOrder.id,
					customerId: parsed.currentOrder.customerId || 1,
					recipe,
					dish,
					bonusAmount: parsed.currentOrder.bonusAmount,
					createdAtTurn: parsed.currentOrder.createdAtTurn,
					completed: parsed.currentOrder.completed,
					hintRevealed: parsed.currentOrder.hintRevealed,
					arrivalMessage: parsed.currentOrder.arrivalMessage || getRandomMessage(ARRIVAL_MESSAGES),
					completeMessage:
						parsed.currentOrder.completeMessage || getRandomMessage(COMPLETE_MESSAGES)
				};
			} else {
				parsed.currentOrder = null;
			}
		}
		// lastCompletedOrder도 복원
		if (parsed.lastCompletedOrder) {
			const recipe = RECIPES.find((r) => r.id === parsed.lastCompletedOrder.recipeId);
			const dish = findIngredientById(parsed.lastCompletedOrder.dishId);
			if (recipe && dish) {
				parsed.lastCompletedOrder = {
					id: parsed.lastCompletedOrder.id,
					customerId: parsed.lastCompletedOrder.customerId || 1,
					recipe,
					dish,
					bonusAmount: parsed.lastCompletedOrder.bonusAmount,
					createdAtTurn: parsed.lastCompletedOrder.createdAtTurn,
					completed: parsed.lastCompletedOrder.completed,
					hintRevealed: parsed.lastCompletedOrder.hintRevealed,
					arrivalMessage: parsed.lastCompletedOrder.arrivalMessage || '',
					completeMessage: parsed.lastCompletedOrder.completeMessage || ''
				};
			} else {
				parsed.lastCompletedOrder = null;
			}
		}
		// 새 필드들 기본값 보장
		return {
			...initialState,
			...parsed,
			showNewOrderModal: parsed.showNewOrderModal ?? false,
			showOrderCompleteModal: parsed.showOrderCompleteModal ?? false,
			showOrderFailModal: parsed.showOrderFailModal ?? false,
			lastFailedOrder: parsed.lastFailedOrder ?? null
		};
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
			: null,
		lastCompletedOrder: state.lastCompletedOrder
			? {
					...state.lastCompletedOrder,
					recipeId: state.lastCompletedOrder.recipe.id,
					dishId: state.lastCompletedOrder.dish.id,
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
		generateOrder: (currentTurn: number, showModal: boolean = true) => {
			updateAndSave((state) => {
				const order = generateRandomOrder(currentTurn, state.difficulty);
				return {
					...state,
					currentOrder: order,
					showNewOrderModal: showModal
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
					const completedOrder = { ...state.currentOrder, completed: true };
					return {
						...state,
						currentOrder: completedOrder,
						completedOrders: state.completedOrders + 1,
						stageCompletedOrders: state.stageCompletedOrders + 1,
						totalBonus: state.totalBonus + bonus,
						showOrderCompleteModal: true,
						lastCompletedOrder: completedOrder
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
		 * 세금 주기 종료 시 호출 (주문 리셋 + 난이도 조절 + 세금률 조절)
		 * @returns 스테이지 결과 { success: boolean, newTaxRate: number, orderFailed: boolean }
		 */
		onTaxPeriodEnd: (
			survived: boolean,
			currentTurn: number
		): {
			success: boolean;
			newTaxRate: number;
			orderFailed: boolean;
			failedOrder: CustomerOrder | null;
		} => {
			let result = {
				success: false,
				newTaxRate: STAGE_CONFIG.BASE_TAX_RATE as number,
				orderFailed: false,
				failedOrder: null as CustomerOrder | null
			};

			updateAndSave((state) => {
				const orderTarget = getOrderTarget(state.difficulty);
				const stageSuccess = state.stageCompletedOrders >= orderTarget;

				// 현재 주문이 미완료 상태인지 확인
				const orderFailed = state.currentOrder !== null && !state.currentOrder.completed;
				const failedOrder = orderFailed ? state.currentOrder : null;

				// 세금률 계산: 목표 미달 시 증가
				let newTaxRate = state.taxRate;
				if (!stageSuccess) {
					newTaxRate = Math.min(
						state.taxRate + STAGE_CONFIG.TAX_RATE_PENALTY,
						STAGE_CONFIG.MAX_TAX_RATE
					);
				}

				const newDifficulty = survived ? state.difficulty + 1 : state.difficulty;
				const order = generateRandomOrder(currentTurn, newDifficulty);

				result = { success: stageSuccess, newTaxRate, orderFailed, failedOrder };

				return {
					...state,
					currentOrder: order,
					difficulty: newDifficulty,
					stageCompletedOrders: 0, // 스테이지 주문 수 리셋
					taxRate: newTaxRate,
					showNewOrderModal: !orderFailed, // 실패 모달 후에 표시
					showOrderFailModal: orderFailed,
					lastFailedOrder: failedOrder
				};
			});

			return result;
		},

		/**
		 * 현재 주문 가져오기
		 */
		getCurrentOrder: (): CustomerOrder | null => {
			return get({ subscribe }).currentOrder;
		},

		/**
		 * 현재 스테이지 정보 가져오기
		 */
		getStageInfo: () => {
			const state = get({ subscribe });
			return {
				stage: state.difficulty,
				completedOrders: state.stageCompletedOrders,
				orderTarget: getOrderTarget(state.difficulty),
				taxRate: state.taxRate
			};
		},

		/**
		 * 새 주문 모달 표시
		 */
		showNewOrder: () => {
			updateAndSave((state) => ({
				...state,
				showNewOrderModal: true
			}));
		},

		/**
		 * 새 주문 모달 닫기
		 */
		closeNewOrderModal: () => {
			updateAndSave((state) => ({
				...state,
				showNewOrderModal: false
			}));
		},

		/**
		 * 주문 완료 모달 닫기 (새 주문은 세금 시점에 생성)
		 */
		closeOrderCompleteModal: () => {
			updateAndSave((state) => {
				return {
					...state,
					showOrderCompleteModal: false,
					lastCompletedOrder: null
					// 새 주문은 세금 시점(onTaxPeriodEnd)에서 생성
				};
			});
		},

		/**
		 * 주문 실패 모달 닫기 + 새 주문 모달 표시
		 */
		closeOrderFailModal: () => {
			updateAndSave((state) => ({
				...state,
				showOrderFailModal: false,
				lastFailedOrder: null,
				showNewOrderModal: true
			}));
		},

		/**
		 * 현재 세금률 가져오기
		 */
		getTaxRate: (): number => {
			return get({ subscribe }).taxRate;
		},

		/**
		 * 런 시작 시 초기화
		 */
		startRun: (currentTurn: number = 0) => {
			const order = generateRandomOrder(currentTurn, 1);
			const newState: CustomerState = {
				currentOrder: order,
				difficulty: 1,
				completedOrders: 0,
				totalBonus: 0,
				stageCompletedOrders: 0,
				taxRate: STAGE_CONFIG.BASE_TAX_RATE,
				showNewOrderModal: false, // 첫 요리 완료 후 모달 표시
				showOrderCompleteModal: false,
				showOrderFailModal: false,
				lastCompletedOrder: null,
				lastFailedOrder: null
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
				customerId: Math.floor(Math.random() * MAX_CUSTOMER_ID) + 1,
				recipe,
				dish,
				bonusAmount: calculateBonus(dish.grade),
				createdAtTurn: currentTurn,
				completed: false,
				hintRevealed: false,
				arrivalMessage: getRandomMessage(ARRIVAL_MESSAGES),
				completeMessage: getRandomMessage(COMPLETE_MESSAGES)
			};

			updateAndSave((state) => ({
				...state,
				currentOrder: order
			}));
		}
	};
}

export const customerStore = createCustomerStore();
