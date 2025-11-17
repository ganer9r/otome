import type { Dish } from '../types';

/**
 * 요리 배열의 확률을 자동 계산
 * - success의 확률 = 100 - (fail + disaster)
 * - fail, disaster는 명시된 확률 사용
 */
export function calculateProbabilities(dishes: Dish[]): Dish[] {
	// 빈 배열 처리
	if (dishes.length === 0) {
		return [];
	}

	// success 찾기
	const successDishes = dishes.filter((d) => d.grade === 'success');

	// success 검증
	if (successDishes.length === 0) {
		throw new Error('success가 없습니다');
	}
	if (successDishes.length > 1) {
		throw new Error('success는 하나만 있어야 합니다');
	}

	// 비-success 확률 합산
	const nonSuccessTotal = dishes
		.filter((d) => d.grade !== 'success')
		.reduce((sum, d) => sum + (d.probability ?? 0), 0);

	// 확률 합 검증
	if (nonSuccessTotal >= 100) {
		throw new Error('확률 합계가 100을 초과합니다');
	}

	// success 확률 계산
	const successProbability = 100 - nonSuccessTotal;

	// 새 배열 반환 (불변성)
	return dishes.map((d) => ({
		...d,
		probability: d.grade === 'success' ? successProbability : (d.probability ?? 0)
	}));
}
