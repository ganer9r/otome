import type { Recipe } from '../types';
import { RECIPES } from '../data/recipes';

/**
 * 재료 조합으로 레시피 찾기
 *
 * @param ingredientIds - 재료 ID 목록 (2개)
 * @param tool - 사용할 도구 (선택사항)
 * @returns 매칭되는 레시피 또는 null
 */
export function findRecipe(ingredientIds: string[], tool?: string): Recipe | null {
	const recipe = RECIPES.find((r) => {
		// 재료 개수 확인
		if (r.inputs.ingredients.length !== ingredientIds.length) return false;

		// 재료 일치 확인 (순서 무관)
		const hasAllIngredients = r.inputs.ingredients.every((id) => ingredientIds.includes(id));
		if (!hasAllIngredients) return false;

		// 도구 확인
		if (r.inputs.tool && r.inputs.tool !== tool) return false;
		if (!r.inputs.tool && tool) return false;

		return true;
	});

	return recipe ?? null;
}
