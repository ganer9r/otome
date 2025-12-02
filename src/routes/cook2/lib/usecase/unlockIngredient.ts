import { browser } from '$app/environment';
import { INITIAL_INGREDIENTS } from '../data/ingredients';

const PERMANENT_UNLOCK_KEY = 'cook2_permanent_unlocks';

/**
 * 영구 해금된 재료 가져오기
 */
function getPermanentUnlocks(): number[] {
	if (!browser) return [];
	const stored = localStorage.getItem(PERMANENT_UNLOCK_KEY);
	if (!stored) return [];
	try {
		return JSON.parse(stored);
	} catch {
		return [];
	}
}

/**
 * 초기 해금 재료 (G등급 + 영구 해금)
 */
function getInitialUnlocks(): number[] {
	const gGrade = INITIAL_INGREDIENTS.map((i) => i.id);
	const permanent = getPermanentUnlocks();
	return [...new Set([...gGrade, ...permanent])];
}

/**
 * 메모리에 저장된 오픈 재료 목록 (새로고침 시 초기화)
 */
let unlockedIngredients: number[] = getInitialUnlocks();

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
 * 오픈 재료 초기화 (G등급 + 영구 해금으로 리셋)
 */
export function resetUnlockedIngredients(): void {
	unlockedIngredients = getInitialUnlocks();
}

/**
 * 영구 해금 반영하여 새로고침
 */
export function refreshUnlockedIngredients(): void {
	const currentUnlocks = [...unlockedIngredients];
	const initialUnlocks = getInitialUnlocks();
	// 기존 해금 + 새로 영구해금된 것 합치기
	unlockedIngredients = [...new Set([...currentUnlocks, ...initialUnlocks])];
}
