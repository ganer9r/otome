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
	/** 현재 주문 (있으면 진행중, 없으면 주문 없음) */
	currentOrder: CustomerOrder | null;
	/** 주문 확인 여부 (모달을 봤는지) - true면 뱃지 표시, false면 모달 표시 */
	orderConfirmed: boolean;
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
	/** 주문 완료 모달 표시용 (임시) */
	showOrderCompleteModal: boolean;
	/** 주문 실패 모달 표시용 (임시) */
	showOrderFailModal: boolean;
	/** 마지막 완료된 주문 (완료 모달용) */
	lastCompletedOrder: CustomerOrder | null;
	/** 마지막 실패한 주문 (실패 모달용) */
	lastFailedOrder: CustomerOrder | null;
	/** 다음 손님까지 남은 휴식 턴 (0이면 손님 등장 가능) */
	cooldownTurns: number;
}

/** 휴식턴 설정 */
export const COOLDOWN_CONFIG = {
	/** 게임 시작 시 휴식턴 (1이면 첫 턴 끝나고 손님 등장) */
	INITIAL: 1,
	/** 주문 완료/실패 후 최소 휴식턴 */
	MIN: 2,
	/** 주문 완료/실패 후 최대 휴식턴 */
	MAX: 5
} as const;

/** 랜덤 휴식턴 생성 (MIN ~ MAX) */
function getRandomCooldown(): number {
	return (
		Math.floor(Math.random() * (COOLDOWN_CONFIG.MAX - COOLDOWN_CONFIG.MIN + 1)) +
		COOLDOWN_CONFIG.MIN
	);
}

const initialState: CustomerState = {
	currentOrder: null,
	orderConfirmed: false,
	difficulty: 1,
	completedOrders: 0,
	totalBonus: 0,
	stageCompletedOrders: 0,
	taxRate: STAGE_CONFIG.BASE_TAX_RATE,
	showOrderCompleteModal: false,
	showOrderFailModal: false,
	lastCompletedOrder: null,
	lastFailedOrder: null,
	cooldownTurns: COOLDOWN_CONFIG.INITIAL
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
		// 마이그레이션: 기존 데이터에서 orderConfirmed 결정
		// - orderConfirmed가 이미 있으면 그대로 사용
		// - 없으면: currentOrder가 있으면 이미 본 것으로 간주 (true)
		const orderConfirmed = parsed.orderConfirmed ?? parsed.currentOrder !== null;

		// 마이그레이션: cooldownTurns 필드 추가
		// - 이미 손님이 있으면 0 (휴식 필요 없음)
		// - 손님이 없으면 INITIAL (곧 손님 등장)
		const cooldownTurns =
			parsed.cooldownTurns ?? (parsed.currentOrder ? 0 : COOLDOWN_CONFIG.INITIAL);

		return {
			...initialState,
			...parsed,
			orderConfirmed,
			showOrderCompleteModal: parsed.showOrderCompleteModal ?? false,
			showOrderFailModal: parsed.showOrderFailModal ?? false,
			lastFailedOrder: parsed.lastFailedOrder ?? null,
			cooldownTurns
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
		generateOrder: (currentTurn: number) => {
			updateAndSave((state) => {
				const order = generateRandomOrder(currentTurn, state.difficulty);
				return {
					...state,
					currentOrder: order,
					orderConfirmed: false // 새 주문이므로 확인 안 됨 → 모달 표시
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
						// showOrderCompleteModal은 조리대 복귀 시 표시 (showOrderComplete() 호출)
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
		 * 세금 주기 종료 시 호출 (난이도 조절 + 세금률 조절 + 미완료 주문 실패 처리)
		 * 손님 생성은 onTurnEnd에서 휴식턴 기반으로 처리됨
		 * @returns 스테이지 결과 { success: boolean, newTaxRate: number, orderFailed: boolean }
		 */
		onTaxPeriodEnd: (
			survived: boolean,
			_currentTurn: number
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

				result = { success: stageSuccess, newTaxRate, orderFailed, failedOrder };

				return {
					...state,
					// 미완료 주문은 제거하고 휴식턴 설정 (새 손님은 onTurnEnd에서 생성)
					currentOrder: null,
					orderConfirmed: false,
					difficulty: newDifficulty,
					stageCompletedOrders: 0, // 스테이지 주문 수 리셋
					taxRate: newTaxRate,
					showOrderFailModal: orderFailed,
					lastFailedOrder: failedOrder,
					cooldownTurns: orderFailed ? getRandomCooldown() : state.cooldownTurns
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
		 * 주문 확인 (모달 닫기 → 뱃지 표시)
		 */
		confirmOrder: () => {
			updateAndSave((state) => ({
				...state,
				orderConfirmed: true
			}));
		},

		/**
		 * 주문 완료 모달 표시 (조리대 복귀 시 호출)
		 */
		showOrderComplete: () => {
			updateAndSave((state) => {
				if (!state.lastCompletedOrder) return state;
				return {
					...state,
					showOrderCompleteModal: true
				};
			});
		},

		/**
		 * 주문 완료 모달 닫기 (휴식턴 설정, 휴식 후 새 손님 등장)
		 */
		closeOrderCompleteModal: () => {
			updateAndSave((state) => {
				return {
					...state,
					currentOrder: null, // 완료된 주문 제거
					showOrderCompleteModal: false,
					lastCompletedOrder: null,
					cooldownTurns: getRandomCooldown() // 2~5턴 휴식 후 새 손님
				};
			});
		},

		/**
		 * 주문 실패 모달 닫기 (휴식턴 설정, 휴식 후 새 손님 등장)
		 */
		closeOrderFailModal: () => {
			updateAndSave((state) => ({
				...state,
				currentOrder: null, // 실패한 주문 제거
				showOrderFailModal: false,
				lastFailedOrder: null,
				cooldownTurns: getRandomCooldown() // 2~5턴 휴식 후 새 손님
			}));
		},

		/**
		 * 턴 종료 시 호출 (휴식턴 감소, 0이면 새 손님 생성)
		 * @returns 새 손님이 등장했는지 여부
		 */
		onTurnEnd: (currentTurn: number): boolean => {
			let newCustomerArrived = false;

			updateAndSave((state) => {
				// 이미 손님이 있으면 아무것도 안 함
				if (state.currentOrder && !state.currentOrder.completed) {
					return state;
				}

				// 휴식턴 감소
				const newCooldown = Math.max(0, state.cooldownTurns - 1);

				// 휴식턴이 0이면 새 손님 생성
				if (newCooldown === 0) {
					const order = generateRandomOrder(currentTurn, state.difficulty);
					if (order) {
						newCustomerArrived = true;
						return {
							...state,
							currentOrder: order,
							orderConfirmed: false,
							cooldownTurns: 0
						};
					}
				}

				return {
					...state,
					cooldownTurns: newCooldown
				};
			});

			return newCustomerArrived;
		},

		/**
		 * 현재 세금률 가져오기
		 */
		getTaxRate: (): number => {
			return get({ subscribe }).taxRate;
		},

		/**
		 * 런 시작 시 초기화 (손님 없이 시작, 휴식턴 후 첫 손님 등장)
		 */
		startRun: (_currentTurn: number = 0) => {
			const newState: CustomerState = {
				currentOrder: null, // 시작 시 손님 없음
				orderConfirmed: false,
				difficulty: 1,
				completedOrders: 0,
				totalBonus: 0,
				stageCompletedOrders: 0,
				taxRate: STAGE_CONFIG.BASE_TAX_RATE,
				showOrderCompleteModal: false,
				showOrderFailModal: false,
				lastCompletedOrder: null,
				lastFailedOrder: null,
				cooldownTurns: COOLDOWN_CONFIG.INITIAL // 첫 턴 끝나면 손님 등장
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
