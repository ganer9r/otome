import { describe, it, expect, beforeEach } from 'vitest';
import {
	unlockIngredient,
	getUnlockedIngredients,
	isIngredientUnlocked,
	resetUnlockedIngredients
} from './unlockIngredient';
import { INITIAL_INGREDIENTS } from '../data/ingredients';

describe('unlockIngredient', () => {
	beforeEach(() => {
		// 각 테스트 전에 초기화
		resetUnlockedIngredients();
	});

	describe('기본 동작', () => {
		it('재료를 오픈하면 목록에 추가된다', () => {
			unlockIngredient(100); // 간장
			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain(100);
		});

		it('여러 재료를 오픈할 수 있다', () => {
			unlockIngredient(100); // 간장
			unlockIngredient(101); // 된장
			unlockIngredient(102); // 고추장

			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain(100);
			expect(unlocked).toContain(101);
			expect(unlocked).toContain(102);
		});

		it('isIngredientUnlocked로 오픈 여부를 확인할 수 있다', () => {
			unlockIngredient(100);
			expect(isIngredientUnlocked(100)).toBe(true);
			expect(isIngredientUnlocked(101)).toBe(false);
		});
	});

	describe('중복 저장 방지', () => {
		it('같은 재료를 여러 번 오픈해도 중복 저장되지 않는다', () => {
			unlockIngredient(100);
			unlockIngredient(100);
			unlockIngredient(100);

			const unlocked = getUnlockedIngredients();
			const count = unlocked.filter((id) => id === 100).length;
			expect(count).toBe(1);
		});

		it('중복 오픈 후에도 다른 재료는 정상적으로 추가된다', () => {
			unlockIngredient(100);
			unlockIngredient(100);
			unlockIngredient(101);

			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain(100);
			expect(unlocked).toContain(101);
		});
	});

	describe('초기 재료', () => {
		it('초기화 시 G등급 재료가 자동으로 오픈되어 있다', () => {
			const unlocked = getUnlockedIngredients();
			INITIAL_INGREDIENTS.forEach((ingredient) => {
				expect(unlocked).toContain(ingredient.id);
			});
		});

		it('초기 재료는 G등급 8개이다', () => {
			const unlocked = getUnlockedIngredients();
			expect(unlocked.length).toBe(8);
		});

		it('초기 재료를 다시 오픈해도 중복되지 않는다', () => {
			unlockIngredient(1); // 쌀
			unlockIngredient(2); // 밀

			const unlocked = getUnlockedIngredients();
			const riceCount = unlocked.filter((id) => id === 1).length;
			const wheatCount = unlocked.filter((id) => id === 2).length;

			expect(riceCount).toBe(1);
			expect(wheatCount).toBe(1);
		});
	});

	describe('초기화', () => {
		it('resetUnlockedIngredients로 초기 상태로 되돌릴 수 있다', () => {
			unlockIngredient(100);
			unlockIngredient(101);

			resetUnlockedIngredients();

			const unlocked = getUnlockedIngredients();
			expect(unlocked).not.toContain(100);
			expect(unlocked).not.toContain(101);

			// 초기 재료만 남아있어야 함
			INITIAL_INGREDIENTS.forEach((ingredient) => {
				expect(unlocked).toContain(ingredient.id);
			});
		});
	});

	describe('에지 케이스', () => {
		it('존재하지 않는 재료 ID도 저장할 수 있다', () => {
			// 유효성 검증은 상위 레이어에서 처리
			unlockIngredient(99999);
			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain(99999);
		});

		it('getUnlockedIngredients는 항상 배열을 반환한다', () => {
			const unlocked = getUnlockedIngredients();
			expect(Array.isArray(unlocked)).toBe(true);
		});

		it('isIngredientUnlocked는 항상 boolean을 반환한다', () => {
			expect(typeof isIngredientUnlocked(1)).toBe('boolean');
			expect(typeof isIngredientUnlocked(99999)).toBe('boolean');
		});
	});
});
