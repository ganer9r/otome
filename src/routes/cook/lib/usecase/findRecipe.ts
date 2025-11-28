import type { Recipe, CookingTool } from '../types';
import { findRecipeByIngredients } from '../data/recipes';

/**
 * 재료 조합으로 레시피 찾기
 *
 * @param ingredientIds - 재료 ID 목록 (1-2개)
 * @param tool - 사용할 도구 (기본: '없음')
 * @returns 매칭되는 레시피 또는 null
 */
export function findRecipe(ingredientIds: number[], tool: CookingTool = '없음'): Recipe | null {
	return findRecipeByIngredients(ingredientIds, tool) ?? null;
}
