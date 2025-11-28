import { describe, it, expect } from 'vitest';
import { findRecipe } from './findRecipe';

describe('findRecipe', () => {
	describe('기본 재료로 레시피 찾기', () => {
		it('콩 + 콩으로 간장 레시피를 찾는다 (도구 없음)', () => {
			const recipe = findRecipe([8, 8], '없음');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe(1);
			expect(recipe?.name).toBe('간장');
		});

		it('콩 + 쌀 + 냄비로 된장 레시피를 찾는다', () => {
			const recipe = findRecipe([8, 28], '냄비');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe(2);
			expect(recipe?.name).toBe('된장');
		});

		it('쌀 + 냄비로 밥 레시피를 찾는다', () => {
			const recipe = findRecipe([28], '냄비');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe(10);
			expect(recipe?.name).toBe('밥');
		});

		it('계란 + 후라이팬으로 후라이 레시피를 찾는다', () => {
			const recipe = findRecipe([31], '후라이팬');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe(8);
			expect(recipe?.name).toBe('후라이');
		});
	});

	describe('재료 순서 무관 테스트', () => {
		it('쌀 + 콩 순서로 입력해도 된장 레시피를 찾는다', () => {
			const recipe = findRecipe([28, 8], '냄비');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe(2);
		});

		it('고추 + 쌀 순서로 입력해도 고추장 레시피를 찾는다', () => {
			const recipe = findRecipe([28, 15], '냄비');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe(3);
			expect(recipe?.name).toBe('고추장');
		});
	});

	describe('도구 검증', () => {
		it('도구가 필요한데 없으면 레시피를 찾지 못한다', () => {
			const recipe = findRecipe([8, 28]); // 냄비 필요
			expect(recipe).toBeNull();
		});

		it('도구가 필요 없는데 도구를 제공하면 레시피를 찾지 못한다', () => {
			const recipe = findRecipe([8, 8], '냄비'); // 도구 불필요
			expect(recipe).toBeNull();
		});

		it('잘못된 도구를 제공하면 레시피를 찾지 못한다', () => {
			const recipe = findRecipe([8, 28], '후라이팬'); // 냄비 필요
			expect(recipe).toBeNull();
		});
	});

	describe('조리 재료 레시피 찾기', () => {
		it('간장(100) + 마늘(14)로 간장양념 레시피를 찾는다 (E등급)', () => {
			const recipe = findRecipe([100, 14], '없음');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe(11);
			expect(recipe?.name).toBe('간장양념');
		});

		it('소고기(16) + 간장양념(200) + 후라이팬으로 불고기 레시피를 찾는다 (D등급)', () => {
			const recipe = findRecipe([16, 200], '후라이팬');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe(18);
			expect(recipe?.name).toBe('불고기');
		});
	});

	describe('레시피 찾기 실패', () => {
		it('존재하지 않는 재료 조합은 null을 반환한다', () => {
			const recipe = findRecipe([1, 1, 1]); // 토마토 3개
			expect(recipe).toBeNull();
		});

		it('잘못된 재료 ID는 null을 반환한다', () => {
			const recipe = findRecipe([9999, 9998]);
			expect(recipe).toBeNull();
		});
	});

	describe('결과 구조 검증', () => {
		it('찾은 레시피는 올바른 구조를 가진다', () => {
			const recipe = findRecipe([8, 28], '냄비');
			expect(recipe).toBeDefined();
			expect(recipe).toHaveProperty('id');
			expect(recipe).toHaveProperty('name');
			expect(recipe).toHaveProperty('resultIngredientId');
			expect(recipe).toHaveProperty('ingredientIds');
			expect(recipe).toHaveProperty('tool');
		});

		it('레시피의 ingredientIds는 배열이다', () => {
			const recipe = findRecipe([8, 28], '냄비');
			expect(Array.isArray(recipe?.ingredientIds)).toBe(true);
		});

		it('레시피의 resultIngredientId는 숫자이다', () => {
			const recipe = findRecipe([8, 28], '냄비');
			expect(typeof recipe?.resultIngredientId).toBe('number');
			expect(recipe?.resultIngredientId).toBe(101);
		});
	});
});
