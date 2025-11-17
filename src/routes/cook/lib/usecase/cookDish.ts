import type { Recipe, Dish } from '../types';
import { findDishesByRecipeId } from '../data/dishes';
import { calculateProbabilities } from '../utils/calculateProbabilities';

/**
 * 레시피로 요리 결과 생성 (확률 기반 weighted random)
 *
 * @param recipe - 사용할 레시피
 * @returns 조리된 요리 결과
 */
export function cookDish(recipe: Recipe): Dish {
	// 1. 레시피에 해당하는 모든 요리 찾기
	const dishes = findDishesByRecipeId(recipe.id);

	if (dishes.length === 0) {
		throw new Error(`No dishes found for recipe: ${recipe.id}`);
	}

	// 2. 확률 계산 (success 자동 계산)
	const dishesWithProbabilities = calculateProbabilities(dishes);

	// 3. Weighted random 선택
	const random = Math.random() * 100; // 0-100
	let cumulative = 0;

	for (const dish of dishesWithProbabilities) {
		cumulative += dish.probability!;
		if (random < cumulative) {
			return dish;
		}
	}

	// 혹시 모를 경우를 대비해 마지막 요리 반환 (확률 합이 100이므로 여기 도달하지 않음)
	return dishesWithProbabilities[dishesWithProbabilities.length - 1];
}
