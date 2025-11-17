import type { Recipe } from '../types';

/**
 * 레시피 데이터
 *
 * 17개 레시피로 Tier 1-4 재료 생성
 * - Tier 1 생성: 4개 레시피
 * - Tier 2 생성: 6개 레시피
 * - Tier 3 생성: 4개 레시피
 * - Tier 4 생성: 3개 레시피
 */

/** Tier 1 재료 생성 레시피 (4개) */
const tier1Recipes: Recipe[] = [
	{
		id: 'recipe-cooked-rice',
		name: '밥 짓기',
		resultIngredientId: 'cooked-rice',
		inputs: { ingredients: ['water', 'rice'], tool: 'pot' }
	},
	{
		id: 'recipe-boiled-egg',
		name: '계란 삶기',
		resultIngredientId: 'boiled-egg',
		inputs: { ingredients: ['water', 'egg'], tool: 'pot' }
	},
	{
		id: 'recipe-fried-meat',
		name: '고기 볶기',
		resultIngredientId: 'fried-meat',
		inputs: { ingredients: ['meat', 'water'], tool: 'pan' }
	},
	{
		id: 'recipe-broth',
		name: '국물 내기',
		resultIngredientId: 'broth',
		inputs: { ingredients: ['water', 'meat'], tool: 'pot' }
	}
];

/** Tier 2 재료 생성 레시피 (6개) */
const tier2Recipes: Recipe[] = [
	{
		id: 'recipe-egg-rice',
		name: '계란밥 만들기',
		resultIngredientId: 'egg-rice',
		inputs: { ingredients: ['cooked-rice', 'egg'] }
	},
	{
		id: 'recipe-meat-rice',
		name: '고기밥 만들기',
		resultIngredientId: 'meat-rice',
		inputs: { ingredients: ['cooked-rice', 'fried-meat'] }
	},
	{
		id: 'recipe-porridge',
		name: '죽 만들기',
		resultIngredientId: 'porridge',
		inputs: { ingredients: ['cooked-rice', 'broth'], tool: 'pot' }
	},
	{
		id: 'recipe-egg-soup',
		name: '계란국 만들기',
		resultIngredientId: 'egg-soup',
		inputs: { ingredients: ['broth', 'egg'] }
	},
	{
		id: 'recipe-bibimbap',
		name: '비빔밥 만들기',
		resultIngredientId: 'bibimbap',
		inputs: { ingredients: ['cooked-rice', 'fried-meat'], tool: 'bowl' }
	},
	{
		id: 'recipe-onigiri',
		name: '주먹밥 만들기',
		resultIngredientId: 'onigiri',
		inputs: { ingredients: ['cooked-rice', 'boiled-egg'] }
	}
];

/** Tier 3 재료 생성 레시피 (4개) */
const tier3Recipes: Recipe[] = [
	{
		id: 'recipe-egg-porridge',
		name: '계란죽 만들기',
		resultIngredientId: 'egg-porridge',
		inputs: { ingredients: ['porridge', 'egg'], tool: 'pot' }
	},
	{
		id: 'recipe-meat-porridge',
		name: '고기죽 만들기',
		resultIngredientId: 'meat-porridge',
		inputs: { ingredients: ['porridge', 'fried-meat'], tool: 'pot' }
	},
	{
		id: 'recipe-fried-rice',
		name: '볶음밥 만들기',
		resultIngredientId: 'fried-rice',
		inputs: { ingredients: ['egg-rice', 'fried-meat'], tool: 'pan' }
	},
	{
		id: 'recipe-kimbap',
		name: '김밥 만들기',
		resultIngredientId: 'kimbap',
		inputs: { ingredients: ['onigiri', 'fried-meat'] }
	}
];

/** Tier 4 재료 생성 레시피 (3개) */
const tier4Recipes: Recipe[] = [
	{
		id: 'recipe-special-fried-rice',
		name: '특제볶음밥 만들기',
		resultIngredientId: 'special-fried-rice',
		inputs: { ingredients: ['fried-rice', 'egg-rice'], tool: 'pan' }
	},
	{
		id: 'recipe-special-kimbap',
		name: '특제김밥 만들기',
		resultIngredientId: 'special-kimbap',
		inputs: { ingredients: ['kimbap', 'bibimbap'] }
	},
	{
		id: 'recipe-ultimate-porridge',
		name: '궁극의죽 만들기',
		resultIngredientId: 'ultimate-porridge',
		inputs: { ingredients: ['egg-porridge', 'meat-porridge'], tool: 'pot' }
	}
];

/** 모든 레시피 (17개) */
export const RECIPES: Recipe[] = [...tier1Recipes, ...tier2Recipes, ...tier3Recipes, ...tier4Recipes];

/** 레시피 ID로 레시피 찾기 */
export function findRecipeById(id: string): Recipe | undefined {
	return RECIPES.find((recipe) => recipe.id === id);
}

/** 재료 조합으로 레시피 찾기 (순서 무관) */
export function findRecipeByIngredients(
	ingredientIds: string[],
	tool?: string
): Recipe | undefined {
	return RECIPES.find((recipe) => {
		// 재료 개수 확인
		if (recipe.inputs.ingredients.length !== ingredientIds.length) return false;

		// 재료 일치 확인 (순서 무관)
		const hasAllIngredients = recipe.inputs.ingredients.every((id) => ingredientIds.includes(id));
		if (!hasAllIngredients) return false;

		// 도구 확인
		if (recipe.inputs.tool && recipe.inputs.tool !== tool) return false;
		if (!recipe.inputs.tool && tool) return false;

		return true;
	});
}
