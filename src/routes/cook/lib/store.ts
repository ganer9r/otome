import { writable } from 'svelte/store';
import { findIngredientById } from './data/ingredients';
import type { Ingredient } from './types';
import {
	getUnlockedIngredients as getUnlockedIngredientsCore,
	unlockIngredient as unlockIngredientCore,
	resetUnlockedIngredients
} from './usecase/unlockIngredient';

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
	return unlockedIds.map((id) => findIngredientById(id)).filter((ing): ing is Ingredient => ing !== undefined);
}
