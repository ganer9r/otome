import { describe, it, expect } from 'vitest';
import { findRecipe } from './findRecipe';

describe('findRecipe', () => {
	describe('G등급 재료로 F등급 레시피 찾기', () => {
		it('쌀 + 물로 밥 레시피를 찾는다', () => {
			const recipe = findRecipe([1, 7]);
			expect(recipe).not.toBeNull();
			expect(recipe?.name).toBe('밥');
		});

		it('밀 + 물로 반죽 레시피를 찾는다', () => {
			const recipe = findRecipe([2, 7]);
			expect(recipe).not.toBeNull();
			expect(recipe?.name).toBe('반죽');
		});

		it('고기 + 불로 구이 레시피를 찾는다', () => {
			const recipe = findRecipe([3, 8]);
			expect(recipe).not.toBeNull();
			expect(recipe?.name).toBe('구이');
		});

		it('고기 + 물로 육수 레시피를 찾는다', () => {
			const recipe = findRecipe([3, 7]);
			expect(recipe).not.toBeNull();
			expect(recipe?.name).toBe('육수');
		});
	});

	describe('재료 순서 무관 테스트', () => {
		it('물 + 쌀 순서로 입력해도 밥 레시피를 찾는다', () => {
			const recipe = findRecipe([7, 1]);
			expect(recipe).not.toBeNull();
			expect(recipe?.name).toBe('밥');
		});

		it('불 + 고기 순서로 입력해도 구이 레시피를 찾는다', () => {
			const recipe = findRecipe([8, 3]);
			expect(recipe).not.toBeNull();
			expect(recipe?.name).toBe('구이');
		});
	});

	describe('F등급 재료로 E등급 레시피 찾기', () => {
		it('반죽 + 반죽으로 면 레시피를 찾는다', () => {
			const recipe = findRecipe([102, 102]);
			expect(recipe).not.toBeNull();
			expect(recipe?.name).toBe('면');
		});

		it('밥 + 구이로 덮밥 레시피를 찾는다', () => {
			const recipe = findRecipe([101, 108]);
			expect(recipe).not.toBeNull();
			expect(recipe?.name).toBe('덮밥');
		});

		it('절임 + 양념장으로 김치 레시피를 찾는다', () => {
			const recipe = findRecipe([109, 106]);
			expect(recipe).not.toBeNull();
			expect(recipe?.name).toBe('김치');
		});
	});

	describe('레시피 찾기 실패', () => {
		it('존재하지 않는 재료 조합은 null을 반환한다', () => {
			const recipe = findRecipe([1, 1, 1]);
			expect(recipe).toBeNull();
		});

		it('잘못된 재료 ID는 null을 반환한다', () => {
			const recipe = findRecipe([9999, 9998]);
			expect(recipe).toBeNull();
		});
	});

	describe('결과 구조 검증', () => {
		it('찾은 레시피는 올바른 구조를 가진다', () => {
			const recipe = findRecipe([1, 7]);
			expect(recipe).toBeDefined();
			expect(recipe).toHaveProperty('id');
			expect(recipe).toHaveProperty('name');
			expect(recipe).toHaveProperty('resultIngredientId');
			expect(recipe).toHaveProperty('ingredientIds');
		});

		it('레시피의 ingredientIds는 배열이다', () => {
			const recipe = findRecipe([1, 7]);
			expect(Array.isArray(recipe?.ingredientIds)).toBe(true);
		});

		it('레시피의 resultIngredientId는 숫자이다', () => {
			const recipe = findRecipe([1, 7]);
			expect(typeof recipe?.resultIngredientId).toBe('number');
			expect(recipe?.resultIngredientId).toBe(101);
		});
	});
});
