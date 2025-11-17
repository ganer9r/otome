import { describe, it, expect } from 'vitest';
import { calculateProbabilities } from './calculateProbabilities';
import type { Dish } from '../types';

describe('calculateProbabilities', () => {
	it('success가 없는 요리 배열의 확률을 자동 계산한다', () => {
		const dishes: Dish[] = [
			{ id: 'dish-1', recipeId: 'recipe-1', name: '완벽한 밥', grade: 'success' },
			{ id: 'dish-2', recipeId: 'recipe-1', name: '설익은 밥', grade: 'fail', probability: 25 },
			{ id: 'dish-3', recipeId: 'recipe-1', name: '탄 밥', grade: 'disaster', probability: 5 }
		];

		const result = calculateProbabilities(dishes);

		// success의 확률은 100 - (25 + 5) = 70
		expect(result[0].probability).toBe(70);
		expect(result[1].probability).toBe(25);
		expect(result[2].probability).toBe(5);
	});

	it('확률 합계가 100이 되어야 한다', () => {
		const dishes: Dish[] = [
			{ id: 'dish-1', recipeId: 'recipe-1', name: '성공', grade: 'success' },
			{ id: 'dish-2', recipeId: 'recipe-1', name: '실패', grade: 'fail', probability: 30 },
			{ id: 'dish-3', recipeId: 'recipe-1', name: '완전실패', grade: 'disaster', probability: 10 }
		];

		const result = calculateProbabilities(dishes);

		const total = result.reduce((sum, dish) => sum + (dish.probability ?? 0), 0);
		expect(total).toBe(100);
	});

	it('여러 success가 있을 경우 에러를 발생시킨다', () => {
		const dishes: Dish[] = [
			{ id: 'dish-1', recipeId: 'recipe-1', name: '성공1', grade: 'success' },
			{ id: 'dish-2', recipeId: 'recipe-1', name: '성공2', grade: 'success' },
			{ id: 'dish-3', recipeId: 'recipe-1', name: '실패', grade: 'fail', probability: 30 }
		];

		expect(() => calculateProbabilities(dishes)).toThrow('success는 하나만 있어야 합니다');
	});

	it('success가 없을 경우 에러를 발생시킨다', () => {
		const dishes: Dish[] = [
			{ id: 'dish-1', recipeId: 'recipe-1', name: '실패1', grade: 'fail', probability: 50 },
			{ id: 'dish-2', recipeId: 'recipe-1', name: '실패2', grade: 'fail', probability: 50 }
		];

		expect(() => calculateProbabilities(dishes)).toThrow('success가 없습니다');
	});

	it('fail/disaster 확률 합이 100 이상일 경우 에러를 발생시킨다', () => {
		const dishes: Dish[] = [
			{ id: 'dish-1', recipeId: 'recipe-1', name: '성공', grade: 'success' },
			{ id: 'dish-2', recipeId: 'recipe-1', name: '실패', grade: 'fail', probability: 70 },
			{ id: 'dish-3', recipeId: 'recipe-1', name: '완전실패', grade: 'disaster', probability: 40 }
		];

		expect(() => calculateProbabilities(dishes)).toThrow('확률 합계가 100을 초과합니다');
	});

	it('빈 배열일 경우 빈 배열을 반환한다', () => {
		const dishes: Dish[] = [];
		const result = calculateProbabilities(dishes);
		expect(result).toEqual([]);
	});

	it('원본 배열을 수정하지 않고 새로운 배열을 반환한다', () => {
		const dishes: Dish[] = [
			{ id: 'dish-1', recipeId: 'recipe-1', name: '성공', grade: 'success' },
			{ id: 'dish-2', recipeId: 'recipe-1', name: '실패', grade: 'fail', probability: 25 },
			{ id: 'dish-3', recipeId: 'recipe-1', name: '완전실패', grade: 'disaster', probability: 5 }
		];

		const originalFirst = dishes[0];
		const result = calculateProbabilities(dishes);

		// 원본은 그대로
		expect(dishes[0]).toBe(originalFirst);
		expect(dishes[0].probability).toBeUndefined();

		// 결과는 새로운 객체
		expect(result[0]).not.toBe(originalFirst);
		expect(result[0].probability).toBe(70);
	});
});
