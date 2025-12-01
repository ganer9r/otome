import type { Recipe } from '../types';
import { findRecipeByIngredients } from '../data/recipes';

/**
 * 재료 조합으로 레시피 찾기
 *
 * @param ingredientIds - 재료 ID 목록 (2개)
 * @returns 매칭되는 레시피 또는 null
 */
export function findRecipe(ingredientIds: number[]): Recipe | null {
	return findRecipeByIngredients(ingredientIds) ?? null;
}
