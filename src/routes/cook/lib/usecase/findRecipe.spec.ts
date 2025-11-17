import { describe, it, expect } from 'vitest';
import { findRecipe } from './findRecipe';

describe('findRecipe', () => {
	describe('기본 재료로 레시피 찾기', () => {
		it('물 + 쌀 + 냄비로 밥 짓기 레시피를 찾는다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe('recipe-cooked-rice');
			expect(recipe?.name).toBe('밥 짓기');
		});

		it('물 + 계란 + 냄비로 계란 삶기 레시피를 찾는다', () => {
			const recipe = findRecipe(['water', 'egg'], 'pot');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe('recipe-boiled-egg');
		});

		it('계란 + 물 (도구 없음)로 계란 깨기 레시피를 찾는다', () => {
			const recipe = findRecipe(['egg', 'water']);
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe('recipe-raw-egg');
			expect(recipe?.inputs.tool).toBeUndefined();
		});
	});

	describe('재료 순서 무관 테스트', () => {
		it('쌀 + 물 순서로 입력해도 밥 짓기 레시피를 찾는다', () => {
			const recipe = findRecipe(['rice', 'water'], 'pot');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe('recipe-cooked-rice');
		});

		it('계란 + 물 순서로 입력해도 계란 삶기 레시피를 찾는다', () => {
			const recipe = findRecipe(['egg', 'water'], 'pot');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe('recipe-boiled-egg');
		});

		it('물 + 계란 순서로 입력해도 계란 깨기 레시피를 찾는다', () => {
			const recipe = findRecipe(['water', 'egg']);
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe('recipe-raw-egg');
		});
	});

	describe('도구 검증', () => {
		it('도구가 필요한데 없으면 레시피를 찾지 못한다', () => {
			const recipe = findRecipe(['water', 'rice']); // 냄비 필요
			expect(recipe).toBeNull();
		});

		it('도구가 필요 없는데 도구를 제공하면 레시피를 찾지 못한다', () => {
			const recipe = findRecipe(['egg', 'water'], 'pot'); // 도구 불필요
			expect(recipe).toBeNull();
		});

		it('잘못된 도구를 제공하면 레시피를 찾지 못한다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pan'); // 냄비 필요
			expect(recipe).toBeNull();
		});
	});

	describe('조리 재료 레시피 찾기', () => {
		it('밥 + 계란물로 계란밥 레시피를 찾는다 (Tier 2)', () => {
			const recipe = findRecipe(['cooked-rice', 'raw-egg']);
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe('recipe-egg-rice');
		});

		it('밥 + 볶은고기로 고기밥 레시피를 찾는다 (Tier 2)', () => {
			const recipe = findRecipe(['cooked-rice', 'fried-meat']);
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe('recipe-meat-rice');
		});

		it('죽 + 계란물 + 냄비로 계란죽 레시피를 찾는다 (Tier 3)', () => {
			const recipe = findRecipe(['porridge', 'raw-egg'], 'pot');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe('recipe-egg-porridge');
		});

		it('볶음밥 + 계란밥 + 팬으로 특제볶음밥 레시피를 찾는다 (Tier 4)', () => {
			const recipe = findRecipe(['fried-rice', 'egg-rice'], 'pan');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe('recipe-special-fried-rice');
		});
	});

	describe('레시피 찾기 실패', () => {
		it('존재하지 않는 재료 조합은 null을 반환한다', () => {
			const recipe = findRecipe(['water', 'water']);
			expect(recipe).toBeNull();
		});

		it('잘못된 재료 ID는 null을 반환한다', () => {
			const recipe = findRecipe(['invalid-id-1', 'invalid-id-2']);
			expect(recipe).toBeNull();
		});

		it('재료가 1개만 있으면 null을 반환한다', () => {
			const recipe = findRecipe(['water']);
			expect(recipe).toBeNull();
		});

		it('재료가 3개 이상이면 null을 반환한다', () => {
			const recipe = findRecipe(['water', 'rice', 'egg'], 'pot');
			expect(recipe).toBeNull();
		});
	});

	describe('결과 구조 검증', () => {
		it('찾은 레시피는 올바른 구조를 가진다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			expect(recipe).toBeDefined();
			expect(recipe).toHaveProperty('id');
			expect(recipe).toHaveProperty('name');
			expect(recipe).toHaveProperty('resultIngredientId');
			expect(recipe).toHaveProperty('inputs');
			expect(recipe?.inputs).toHaveProperty('ingredients');
		});

		it('레시피의 inputs.ingredients는 배열이다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			expect(Array.isArray(recipe?.inputs.ingredients)).toBe(true);
			expect(recipe?.inputs.ingredients.length).toBe(2);
		});

		it('레시피의 resultIngredientId는 문자열이다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			expect(typeof recipe?.resultIngredientId).toBe('string');
			expect(recipe?.resultIngredientId).toBe('cooked-rice');
		});
	});
});
