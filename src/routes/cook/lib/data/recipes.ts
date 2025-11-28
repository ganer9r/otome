import type { Recipe, CookingTool } from '../types';
import { RECIPES_DATA } from './recipes-data';

/** 모든 레시피 (253개) */
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
export function findRecipeByIngredients(ids: number[], tool: CookingTool = '없음'): Recipe | undefined {
	const sorted = [...ids].sort((a, b) => a - b);
	return RECIPES.find((r) => {
		if (r.tool !== tool) return false;
		const rSorted = [...r.ingredientIds].sort((a, b) => a - b);
		return rSorted.length === sorted.length && rSorted.every((id, i) => id === sorted[i]);
	});
}

/** 특정 재료를 사용하는 레시피들 */
export function findRecipesUsingIngredient(id: number): Recipe[] {
	return RECIPES.filter((r) => r.ingredientIds.includes(id));
}

/** 도구별 레시피 목록 */
export function getRecipesByTool(tool: CookingTool): Recipe[] {
	return RECIPES.filter((r) => r.tool === tool);
}
