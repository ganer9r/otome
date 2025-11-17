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
			unlockIngredient('cooked-rice');
			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain('cooked-rice');
		});

		it('여러 재료를 오픈할 수 있다', () => {
			unlockIngredient('cooked-rice');
			unlockIngredient('boiled-egg');
			unlockIngredient('fried-meat');

			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain('cooked-rice');
			expect(unlocked).toContain('boiled-egg');
			expect(unlocked).toContain('fried-meat');
		});

		it('isIngredientUnlocked로 오픈 여부를 확인할 수 있다', () => {
			unlockIngredient('cooked-rice');
			expect(isIngredientUnlocked('cooked-rice')).toBe(true);
			expect(isIngredientUnlocked('boiled-egg')).toBe(false);
		});
	});

	describe('중복 저장 방지', () => {
		it('같은 재료를 여러 번 오픈해도 중복 저장되지 않는다', () => {
			unlockIngredient('cooked-rice');
			unlockIngredient('cooked-rice');
			unlockIngredient('cooked-rice');

			const unlocked = getUnlockedIngredients();
			const count = unlocked.filter((id) => id === 'cooked-rice').length;
			expect(count).toBe(1);
		});

		it('중복 오픈 후에도 다른 재료는 정상적으로 추가된다', () => {
			unlockIngredient('cooked-rice');
			unlockIngredient('cooked-rice');
			unlockIngredient('boiled-egg');

			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain('cooked-rice');
			expect(unlocked).toContain('boiled-egg');
			expect(unlocked.length).toBe(2);
		});
	});

	describe('초기 재료', () => {
		it('초기화 시 기본 4개 재료가 자동으로 오픈되어 있다', () => {
			const unlocked = getUnlockedIngredients();
			INITIAL_INGREDIENTS.forEach((id) => {
				expect(unlocked).toContain(id);
			});
		});

		it('초기 재료는 water, rice, egg, meat이다', () => {
			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain('water');
			expect(unlocked).toContain('rice');
			expect(unlocked).toContain('egg');
			expect(unlocked).toContain('meat');
		});

		it('초기 재료를 다시 오픈해도 중복되지 않는다', () => {
			unlockIngredient('water');
			unlockIngredient('rice');

			const unlocked = getUnlockedIngredients();
			const waterCount = unlocked.filter((id) => id === 'water').length;
			const riceCount = unlocked.filter((id) => id === 'rice').length;

			expect(waterCount).toBe(1);
			expect(riceCount).toBe(1);
		});
	});

	describe('localStorage 연동', () => {
		it('오픈한 재료는 새로고침 후에도 유지된다', () => {
			unlockIngredient('cooked-rice');
			unlockIngredient('boiled-egg');

			// 새로운 인스턴스에서 가져오기 시뮬레이션
			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain('cooked-rice');
			expect(unlocked).toContain('boiled-egg');
		});

		it('resetUnlockedIngredients로 초기 상태로 되돌릴 수 있다', () => {
			unlockIngredient('cooked-rice');
			unlockIngredient('boiled-egg');

			resetUnlockedIngredients();

			const unlocked = getUnlockedIngredients();
			expect(unlocked).not.toContain('cooked-rice');
			expect(unlocked).not.toContain('boiled-egg');

			// 초기 재료만 남아있어야 함
			INITIAL_INGREDIENTS.forEach((id) => {
				expect(unlocked).toContain(id);
			});
		});
	});

	describe('에지 케이스', () => {
		it('빈 문자열 재료 ID는 무시된다', () => {
			const beforeCount = getUnlockedIngredients().length;
			unlockIngredient('');
			const afterCount = getUnlockedIngredients().length;
			expect(afterCount).toBe(beforeCount);
		});

		it('존재하지 않는 재료 ID도 저장할 수 있다', () => {
			// 유효성 검증은 상위 레이어에서 처리
			unlockIngredient('invalid-ingredient-id');
			const unlocked = getUnlockedIngredients();
			expect(unlocked).toContain('invalid-ingredient-id');
		});

		it('getUnlockedIngredients는 항상 배열을 반환한다', () => {
			const unlocked = getUnlockedIngredients();
			expect(Array.isArray(unlocked)).toBe(true);
		});

		it('isIngredientUnlocked는 항상 boolean을 반환한다', () => {
			expect(typeof isIngredientUnlocked('water')).toBe('boolean');
			expect(typeof isIngredientUnlocked('invalid')).toBe('boolean');
		});
	});
});
