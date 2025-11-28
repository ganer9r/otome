import { INITIAL_INGREDIENTS } from '../data/ingredients';

/**
 * 메모리에 저장된 오픈 재료 목록 (새로고침 시 초기화)
 */
let unlockedIngredients: number[] = INITIAL_INGREDIENTS.map((i) => i.id);

/**
 * 재료를 오픈하여 메모리에 저장
 *
 * @param ingredientId - 오픈할 재료 ID (number)
 */
export function unlockIngredient(ingredientId: number): void {
	// 유효하지 않은 ID 무시
	if (ingredientId === undefined || ingredientId === null) {
		return;
	}

	// 중복 방지
	if (!unlockedIngredients.includes(ingredientId)) {
		unlockedIngredients.push(ingredientId);
	}
}

/**
 * 현재 오픈된 재료 목록 가져오기
 *
 * @returns 오픈된 재료 ID 배열
 */
export function getUnlockedIngredients(): number[] {
	return [...unlockedIngredients];
}

/**
 * 재료가 오픈되었는지 확인
 *
 * @param ingredientId - 확인할 재료 ID
 * @returns 오픈 여부
 */
export function isIngredientUnlocked(ingredientId: number): boolean {
	return unlockedIngredients.includes(ingredientId);
}

/**
 * 오픈 재료 초기화
 */
export function resetUnlockedIngredients(): void {
	unlockedIngredients = INITIAL_INGREDIENTS.map((i) => i.id);
}
