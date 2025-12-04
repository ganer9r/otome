import { browser } from '$app/environment';
import { INITIAL_INGREDIENTS } from '../data/ingredients';

const UNLOCKED_INGREDIENTS_KEY = 'cook2_unlocked_ingredients';

/**
 * localStorage에서 해금된 재료 가져오기
 */
function getStoredUnlocks(): number[] {
	if (!browser) return [];
	const stored = localStorage.getItem(UNLOCKED_INGREDIENTS_KEY);
	if (!stored) return [];
	try {
		return JSON.parse(stored);
	} catch {
		return [];
	}
}

/**
 * localStorage에 해금된 재료 저장
 */
function saveUnlocks(ids: number[]): void {
	if (!browser) return;
	localStorage.setItem(UNLOCKED_INGREDIENTS_KEY, JSON.stringify(ids));
}

/**
 * 초기 해금 재료 (G등급 + localStorage 저장분)
 */
function getInitialUnlocks(): number[] {
	const gGrade = INITIAL_INGREDIENTS.map((i) => i.id);
	const stored = getStoredUnlocks();
	return [...new Set([...gGrade, ...stored])];
}

/**
 * 오픈 재료 목록 (메모리 캐시)
 */
let unlockedIngredients: number[] = getInitialUnlocks();

/**
 * 재료를 오픈하여 localStorage에 저장
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
		saveUnlocks(unlockedIngredients);
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
 * 오픈 재료 초기화 (G등급만 남기고 리셋)
 */
export function resetUnlockedIngredients(): void {
	if (browser) {
		localStorage.removeItem(UNLOCKED_INGREDIENTS_KEY);
	}
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
