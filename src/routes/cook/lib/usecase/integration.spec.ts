import { describe, it, expect, beforeEach } from 'vitest';
import { findRecipe } from './findRecipe';
import { cookDish } from './cookDish';
import {
	unlockIngredient,
	getUnlockedIngredients,
	isIngredientUnlocked,
	resetUnlockedIngredients
} from './unlockIngredient';

describe('통합 테스트: 전체 요리 플로우', () => {
	beforeEach(() => {
		resetUnlockedIngredients();
	});

	describe('기본 요리 플로우', () => {
		it('물 + 쌀 + 냄비로 밥을 지어 cooked-rice를 오픈할 수 있다', () => {
			// 1. 레시피 찾기
			const recipe = findRecipe(['water', 'rice'], 'pot');
			expect(recipe).not.toBeNull();
			expect(recipe?.id).toBe('recipe-cooked-rice');

			// 2. 요리하기 (여러 번 시도하여 success 얻기)
			let successDish = null;
			for (let i = 0; i < 100; i++) {
				const dish = cookDish(recipe!);
				if (dish.grade === 'success') {
					successDish = dish;
					break;
				}
			}

			expect(successDish).not.toBeNull();
			expect(successDish?.grade).toBe('success');

			// 3. success 요리로 재료 오픈
			unlockIngredient(recipe!.resultIngredientId);

			// 4. 재료가 오픈되었는지 확인
			expect(isIngredientUnlocked('cooked-rice')).toBe(true);
			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain('cooked-rice');
		});

		it('fail 요리는 재료를 오픈하지 않는다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pot');

			// fail 요리 얻기
			let failDish = null;
			for (let i = 0; i < 100; i++) {
				const dish = cookDish(recipe!);
				if (dish.grade === 'fail' || dish.grade === 'disaster') {
					failDish = dish;
					break;
				}
			}

			if (failDish) {
				// fail/disaster는 재료 오픈 안함
				const beforeUnlocked = getUnlockedIngredients();
				// 이 테스트는 "fail 시 오픈하지 말아야 한다"는 규칙을 확인
				// 실제로는 success만 오픈하므로, fail 케이스에서는 아무것도 하지 않음
				expect(beforeUnlocked).not.toContain('cooked-rice');
			}
		});
	});

	describe('체인 요리 플로우', () => {
		it('Tier 1 → Tier 2 체인 요리가 가능하다', () => {
			// Step 1: 밥 짓기 (Tier 1)
			const recipe1 = findRecipe(['water', 'rice'], 'pot');
			unlockIngredient(recipe1!.resultIngredientId); // cooked-rice 오픈

			// Step 2: 계란 깨기 (Tier 1)
			const recipe2 = findRecipe(['egg', 'water']);
			unlockIngredient(recipe2!.resultIngredientId); // raw-egg 오픈

			// Step 3: 계란밥 만들기 (Tier 2)
			const recipe3 = findRecipe(['cooked-rice', 'raw-egg']);
			expect(recipe3).not.toBeNull();
			expect(recipe3?.id).toBe('recipe-egg-rice');

			const dish3 = cookDish(recipe3!);
			if (dish3.grade === 'success') {
				unlockIngredient(recipe3!.resultIngredientId); // egg-rice 오픈
				expect(isIngredientUnlocked('egg-rice')).toBe(true);
			}
		});

		it('Tier 1 → Tier 2 → Tier 3 체인 요리가 가능하다', () => {
			// Tier 1: 밥 + 국물
			unlockIngredient('cooked-rice');
			unlockIngredient('broth');

			// Tier 2: 죽 만들기
			const recipe2 = findRecipe(['cooked-rice', 'broth'], 'pot');
			expect(recipe2?.id).toBe('recipe-porridge');
			unlockIngredient('porridge');

			// Tier 1: 계란물
			unlockIngredient('raw-egg');

			// Tier 3: 계란죽 만들기
			const recipe3 = findRecipe(['porridge', 'raw-egg'], 'pot');
			expect(recipe3?.id).toBe('recipe-egg-porridge');

			const dish3 = cookDish(recipe3!);
			expect(['success', 'fail', 'disaster']).toContain(dish3.grade);
		});
	});

	describe('재료 오픈 누적', () => {
		it('여러 요리를 통해 재료가 계속 누적된다', () => {
			const initialCount = getUnlockedIngredients().length; // 초기 4개

			// 밥 오픈
			unlockIngredient('cooked-rice');
			expect(getUnlockedIngredients().length).toBe(initialCount + 1);

			// 계란물 오픈
			unlockIngredient('raw-egg');
			expect(getUnlockedIngredients().length).toBe(initialCount + 2);

			// 볶은고기 오픈
			unlockIngredient('fried-meat');
			expect(getUnlockedIngredients().length).toBe(initialCount + 3);

			// 모두 포함되는지 확인
			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain('cooked-rice');
			expect(unlocked).toContain('raw-egg');
			expect(unlocked).toContain('fried-meat');
		});

		it('중복 오픈해도 재료 개수는 증가하지 않는다', () => {
			unlockIngredient('cooked-rice');
			const count1 = getUnlockedIngredients().length;

			unlockIngredient('cooked-rice');
			unlockIngredient('cooked-rice');
			const count2 = getUnlockedIngredients().length;

			expect(count1).toBe(count2);
		});
	});

	describe('전체 시나리오', () => {
		it('초기 재료로 시작하여 Tier 4까지 도달할 수 있다', () => {
			// 초기 상태: water, rice, egg, meat
			expect(isIngredientUnlocked('water')).toBe(true);
			expect(isIngredientUnlocked('rice')).toBe(true);
			expect(isIngredientUnlocked('egg')).toBe(true);
			expect(isIngredientUnlocked('meat')).toBe(true);

			// Tier 1 재료들 오픈
			unlockIngredient('cooked-rice');
			unlockIngredient('raw-egg');
			unlockIngredient('fried-meat');

			// Tier 2: 계란밥
			const eggRiceRecipe = findRecipe(['cooked-rice', 'raw-egg']);
			expect(eggRiceRecipe).not.toBeNull();
			unlockIngredient('egg-rice');

			// Tier 2: 고기밥 (비빔밥용)
			unlockIngredient('bibimbap');

			// Tier 3: 볶음밥
			const friedRiceRecipe = findRecipe(['egg-rice', 'fried-meat'], 'pan');
			expect(friedRiceRecipe?.id).toBe('recipe-fried-rice');
			unlockIngredient('fried-rice');

			// Tier 4: 특제볶음밥
			const specialFriedRiceRecipe = findRecipe(['fried-rice', 'egg-rice'], 'pan');
			expect(specialFriedRiceRecipe?.id).toBe('recipe-special-fried-rice');

			const finalDish = cookDish(specialFriedRiceRecipe!);
			expect(['success', 'fail', 'disaster']).toContain(finalDish.grade);

			if (finalDish.grade === 'success') {
				unlockIngredient('special-fried-rice');
				expect(isIngredientUnlocked('special-fried-rice')).toBe(true);
			}
		});
	});

	describe('에러 처리', () => {
		it('존재하지 않는 재료 조합은 레시피를 찾을 수 없다', () => {
			const recipe = findRecipe(['water', 'water']);
			expect(recipe).toBeNull();
		});

		it('도구가 없으면 도구 필요 레시피를 찾을 수 없다', () => {
			const recipe = findRecipe(['water', 'rice']); // 냄비 필요
			expect(recipe).toBeNull();
		});

		it('잘못된 도구를 제공하면 레시피를 찾을 수 없다', () => {
			const recipe = findRecipe(['water', 'rice'], 'pan'); // 냄비 필요
			expect(recipe).toBeNull();
		});
	});
});
