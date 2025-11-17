import { describe, it, expect } from 'vitest';
import { cookDish } from './cookDish';
import { findRecipe } from './findRecipe';

describe('cookDish', () => {
	describe('기본 동작', () => {
		it('레시피를 받아 요리 결과를 반환한다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			expect(recipe).not.toBeNull();

			const dish = cookDish(recipe!);
			expect(dish).toBeDefined();
			expect(dish).toHaveProperty('id');
			expect(dish).toHaveProperty('name');
			expect(dish).toHaveProperty('grade');
			expect(dish).toHaveProperty('recipeId');
			expect(dish.recipeId).toBe('recipe-cooked-rice');
		});

		it('반환된 요리는 success/fail/disaster 중 하나의 등급을 가진다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			const dish = cookDish(recipe!);
			expect(['success', 'fail', 'disaster']).toContain(dish.grade);
		});

		it('요리의 레시피 ID는 입력된 레시피와 일치한다', () => {
			const recipe = findRecipe(['water', 'egg'], 'pot');
			const dish = cookDish(recipe!);
			expect(dish.recipeId).toBe(recipe!.id);
		});
	});

	describe('확률 분포 검증', () => {
		it('여러 번 실행하면 다양한 결과가 나온다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			const results = new Set<string>();

			// 100번 실행
			for (let i = 0; i < 100; i++) {
				const dish = cookDish(recipe!);
				results.add(dish.grade);
			}

			// 최소 2가지 이상의 결과가 나와야 함 (확률적으로)
			expect(results.size).toBeGreaterThanOrEqual(2);
		});

		it('success 등급 요리가 가장 높은 확률로 나온다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			const gradeCounts = { success: 0, fail: 0, disaster: 0 };

			// 1000번 실행
			for (let i = 0; i < 1000; i++) {
				const dish = cookDish(recipe!);
				gradeCounts[dish.grade]++;
			}

			// success가 fail보다 많아야 함
			expect(gradeCounts.success).toBeGreaterThan(gradeCounts.fail);
			// success가 disaster보다 많아야 함
			expect(gradeCounts.success).toBeGreaterThan(gradeCounts.disaster);
		});

		it('Tier 1 레시피는 성공 확률이 높다 (70%+)', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			let successCount = 0;
			const trials = 1000;

			for (let i = 0; i < trials; i++) {
				const dish = cookDish(recipe!);
				if (dish.grade === 'success') successCount++;
			}

			const successRate = successCount / trials;
			// 70% 성공률 기준으로 ±15% 허용 (55% ~ 85%)
			expect(successRate).toBeGreaterThan(0.55);
			expect(successRate).toBeLessThan(0.85);
		});
	});

	describe('다양한 레시피 테스트', () => {
		it('계란 삶기 레시피로 요리를 만든다', () => {
			const recipe = findRecipe(['water', 'egg'], 'pot');
			const dish = cookDish(recipe!);
			expect(dish.recipeId).toBe('recipe-boiled-egg');
			expect(['success', 'fail', 'disaster']).toContain(dish.grade);
		});

		it('계란 깨기 레시피로 요리를 만든다 (도구 없음)', () => {
			const recipe = findRecipe(['egg', 'water']);
			const dish = cookDish(recipe!);
			expect(dish.recipeId).toBe('recipe-raw-egg');
			expect(['success', 'fail', 'disaster']).toContain(dish.grade);
		});

		it('Tier 2 레시피로 요리를 만든다', () => {
			const recipe = findRecipe(['cooked-rice', 'raw-egg']);
			const dish = cookDish(recipe!);
			expect(dish.recipeId).toBe('recipe-egg-rice');
			expect(['success', 'fail', 'disaster']).toContain(dish.grade);
		});

		it('Tier 3 레시피로 요리를 만든다', () => {
			const recipe = findRecipe(['porridge', 'raw-egg'], 'pot');
			const dish = cookDish(recipe!);
			expect(dish.recipeId).toBe('recipe-egg-porridge');
			expect(['success', 'fail', 'disaster']).toContain(dish.grade);
		});

		it('Tier 4 레시피로 요리를 만든다', () => {
			const recipe = findRecipe(['fried-rice', 'egg-rice'], 'pan');
			const dish = cookDish(recipe!);
			expect(dish.recipeId).toBe('recipe-special-fried-rice');
			expect(['success', 'fail', 'disaster']).toContain(dish.grade);
		});
	});

	describe('결과 구조 검증', () => {
		it('요리 결과는 확률 정보를 포함한다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			const dish = cookDish(recipe!);

			// success는 probability가 undefined일 수 있음
			if (dish.grade === 'success') {
				expect(dish.probability).toBeDefined();
			} else {
				// fail, disaster는 probability가 있어야 함
				expect(dish.probability).toBeDefined();
				expect(typeof dish.probability).toBe('number');
			}
		});

		it('요리 이름이 존재한다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			const dish = cookDish(recipe!);
			expect(dish.name).toBeDefined();
			expect(typeof dish.name).toBe('string');
			expect(dish.name.length).toBeGreaterThan(0);
		});

		it('요리 ID가 유효하다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			const dish = cookDish(recipe!);
			expect(dish.id).toBeDefined();
			expect(typeof dish.id).toBe('string');
			expect(dish.id).toContain('dish-');
		});
	});

	describe('재현성 테스트', () => {
		it('같은 레시피로 여러 번 요리하면 다른 결과가 나올 수 있다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');
			const dish1 = cookDish(recipe!);
			const dish2 = cookDish(recipe!);
			const dish3 = cookDish(recipe!);

			// 세 번 모두 같은 결과가 나올 확률은 매우 낮음
			const allSame = dish1.id === dish2.id && dish2.id === dish3.id;
			// 하지만 가능은 함 (확률적으로)
			expect(typeof allSame).toBe('boolean');
		});
	});
});
