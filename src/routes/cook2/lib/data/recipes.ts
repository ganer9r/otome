import type { Recipe } from '../types';
import { RECIPES_DATA } from './recipes-data';

/** 모든 레시피 */
export const RECIPES: Recipe[] = RECIPES_DATA;

/** ID로 레시피 찾기 */
export function findRecipeById(id: number): Recipe | undefined {
	return RECIPES.find((r) => r.id === id);
}

/** 결과 재료로 레시피 찾기 */
export function findRecipeByResult(resultId: number): Recipe | undefined {
	return RECIPES.find((r) => r.resultIngredientId === resultId);
}

/** 재료 조합으로 레시피 찾기 (순서 무관) */
export function findRecipeByIngredients(ids: number[]): Recipe | undefined {
	const sorted = [...ids].sort((a, b) => a - b);
	return RECIPES.find((r) => {
		const rSorted = [...r.ingredientIds].sort((a, b) => a - b);
		return rSorted.length === sorted.length && rSorted.every((id, i) => id === sorted[i]);
	});
}

/** 특정 재료를 사용하는 레시피들 */
export function findRecipesUsingIngredient(id: number): Recipe[] {
	return RECIPES.filter((r) => r.ingredientIds.includes(id));
}

/** 첫 번째 재료와 조합 가능한 두 번째 재료 ID 목록 반환 */
export function getPossiblePairsFor(firstIngredientId: number): number[] {
	const recipes = findRecipesUsingIngredient(firstIngredientId);
	const pairs: number[] = [];

	recipes.forEach((recipe) => {
		recipe.ingredientIds.forEach((id) => {
			if (id !== firstIngredientId) {
				pairs.push(id);
			}
		});
		// 같은 재료 2개 조합인 경우
		if (
			recipe.ingredientIds.length === 2 &&
			recipe.ingredientIds[0] === recipe.ingredientIds[1] &&
			recipe.ingredientIds[0] === firstIngredientId
		) {
			pairs.push(firstIngredientId);
		}
		// 단일 재료 레시피인 경우 (재료 1개로 만드는 요리)
		if (recipe.ingredientIds.length === 1 && recipe.ingredientIds[0] === firstIngredientId) {
			// 이 경우는 두 번째 재료 없이 조리 가능
		}
	});

	return [...new Set(pairs)];
}

/** 레시피의 판매가 가져오기 (요리만 판매가 있음) */
export function getRecipeSellPrice(recipe: Recipe): number | undefined {
	return recipe.sellPrice;
}
