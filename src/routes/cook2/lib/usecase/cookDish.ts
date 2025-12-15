/**
 * 요리 결과 판정 로직
 *
 * 확률 계산 방식:
 * [critical][success][fail] 순서로 영역 배치
 *
 * criticalBonus 적용 시 → fail 영역에서 깎임
 * → 전체 범위가 줄어들면서 critical/success 상대 확률 증가
 */

import type { Ingredient, Dish, DishResultType, CookResult, DishEffects } from '../types';
import { GRADE_PROBABILITIES } from '../types';
import {
	getCriticalDishes,
	getFailDishes,
	getRandomFailName,
	getRandomFailDescription,
	getDefaultFailMultiplier,
	getDefaultCriticalMultiplier,
	getRandomTotalFailDescription,
	getRandomTotalFailName
} from '../data/dishes';

/**
 * 확률 영역 계산
 */
interface ProbabilityRanges {
	criticalDishes: { dish: Dish; start: number; end: number }[];
	criticalEnd: number;
	successEnd: number;
	failDishes: { dish: Dish | null; start: number; end: number }[];
	total: number;
}

/**
 * 확률 영역 계산
 * @param ingredient 결과 재료 (레시피 결과물)
 * @param bonuses 재료 효과로 인한 보너스
 */
function calculateProbabilityRanges(
	ingredient: Ingredient,
	bonuses: DishEffects = {}
): ProbabilityRanges {
	const grade = ingredient.grade;
	const baseProbabilities = GRADE_PROBABILITIES[grade];

	// Dish 테이블에서 가져오기
	const criticalDishes = getCriticalDishes(ingredient.id);
	const failDishes = getFailDishes(ingredient.id);

	// critical 영역 계산
	let criticalTotal = baseProbabilities.critical;
	if (criticalDishes.length > 0) {
		// Dish 테이블에 있으면 그 확률 사용
		criticalTotal = criticalDishes.reduce((sum, d) => sum + d.probability, 0);
	}

	// fail 영역 계산 (기본값 또는 Dish 테이블)
	let failTotal = baseProbabilities.fail;
	if (failDishes.length > 0) {
		failTotal = failDishes.reduce((sum, d) => sum + d.probability, 0);
	}

	// criticalBonus 적용 → fail에서 깎음
	const criticalBonus = bonuses.criticalBonus ?? 0;
	const failReduction = bonuses.failReduction ?? 0;
	const adjustedFailTotal = Math.max(0, failTotal - criticalBonus - failReduction);

	// success 영역 = 100 - critical - fail
	const successTotal = 100 - criticalTotal - baseProbabilities.fail;

	// 전체 범위 (fail이 줄어든 만큼 전체도 줄어듦)
	const total = criticalTotal + successTotal + adjustedFailTotal;

	// 영역 배치: [critical][success][fail]
	let cursor = 0;

	// critical 영역
	const criticalRanges: { dish: Dish; start: number; end: number }[] = [];
	if (criticalDishes.length > 0) {
		for (const dish of criticalDishes) {
			criticalRanges.push({ dish, start: cursor, end: cursor + dish.probability });
			cursor += dish.probability;
		}
	} else {
		// 기본 critical (Dish 없음)
		cursor = criticalTotal;
	}
	const criticalEnd = cursor;

	// success 영역
	cursor += successTotal;
	const successEnd = cursor;

	// fail 영역 (비례 배분)
	const failRanges: { dish: Dish | null; start: number; end: number }[] = [];
	if (failDishes.length > 0 && failTotal > 0) {
		for (const dish of failDishes) {
			const ratio = dish.probability / failTotal;
			const adjustedProb = adjustedFailTotal * ratio;
			if (adjustedProb > 0) {
				failRanges.push({ dish, start: cursor, end: cursor + adjustedProb });
				cursor += adjustedProb;
			}
		}
	} else if (adjustedFailTotal > 0) {
		// 기본 fail (Dish 없음)
		failRanges.push({ dish: null, start: cursor, end: cursor + adjustedFailTotal });
	}

	return {
		criticalDishes: criticalRanges,
		criticalEnd,
		successEnd,
		failDishes: failRanges,
		total
	};
}

/**
 * 요리 결과 판정
 * @param ingredient 결과 재료 (레시피 결과물)
 * @param bonuses 재료 효과로 인한 보너스
 */
export function cookDish(ingredient: Ingredient, bonuses: DishEffects = {}): CookResult {
	const ranges = calculateProbabilityRanges(ingredient, bonuses);
	const baseSellPrice = ingredient.sellPrice ?? 0;

	// 난수 생성 (0 ~ total)
	const roll = Math.random() * ranges.total;

	// 1. critical 판정
	for (const { dish, start, end } of ranges.criticalDishes) {
		if (roll >= start && roll < end) {
			const multiplier =
				dish.effects?.sellPriceMultiplier ?? getDefaultCriticalMultiplier(ingredient.grade);
			return {
				resultType: 'critical',
				dish,
				ingredient,
				sellPrice: Math.round(baseSellPrice * multiplier),
				displayName: dish.name,
				displayImage: dish.imageUrl ?? ingredient.imageUrl,
				description: dish.description
			};
		}
	}

	// 기본 critical (Dish 테이블에 없는 경우)
	if (roll < ranges.criticalEnd) {
		const multiplier = getDefaultCriticalMultiplier(ingredient.grade);
		return {
			resultType: 'critical',
			ingredient,
			sellPrice: Math.round(baseSellPrice * multiplier),
			displayName: `완벽한 ${ingredient.name}`,
			displayImage: ingredient.imageUrl,
			description: '완벽해!'
		};
	}

	// 2. success 판정
	if (roll < ranges.successEnd) {
		return {
			resultType: 'success',
			ingredient,
			sellPrice: baseSellPrice,
			displayName: ingredient.name,
			displayImage: ingredient.imageUrl
		};
	}

	// 3. fail 판정
	for (const { dish, start, end } of ranges.failDishes) {
		if (roll >= start && roll < end) {
			if (dish) {
				// Dish 테이블에 있는 실패
				const multiplier =
					dish.effects?.sellPriceMultiplier ?? getDefaultFailMultiplier(ingredient.grade);
				return {
					resultType: 'fail',
					dish,
					ingredient,
					sellPrice: Math.round(baseSellPrice * multiplier),
					displayName: dish.name,
					displayImage: dish.imageUrl ?? ingredient.imageUrl,
					description: dish.description
				};
			} else {
				// 기본 실패 (Dish 테이블에 없는 경우)
				const multiplier = getDefaultFailMultiplier(ingredient.grade);
				return {
					resultType: 'fail',
					ingredient,
					sellPrice: Math.round(baseSellPrice * multiplier),
					displayName: getRandomFailName(),
					displayImage: ingredient.imageUrl,
					description: getRandomFailDescription()
				};
			}
		}
	}

	// fallback (이론상 여기 안 옴)
	return {
		resultType: 'success',
		ingredient,
		sellPrice: baseSellPrice,
		displayName: ingredient.name,
		displayImage: ingredient.imageUrl
	};
}

/**
 * 완전 실패 결과 생성 (레시피 없음, 재료 부족 등)
 * @param ingredients 사용된 재료들 (비용 계산용)
 */
export function createTotalFailResult(ingredients: Ingredient[] = []): CookResult {
	// 더미 Ingredient (완전 실패용)
	const dummyIngredient: Ingredient = {
		id: -1,
		name: '???',
		grade: 'G',
		isIngredient: false,
		sellPrice: 0
	};

	return {
		resultType: 'total_fail',
		ingredient: dummyIngredient,
		sellPrice: 0,
		displayName: getRandomTotalFailName(),
		displayImage: undefined, // CSS로 검은 덩어리 그림
		description: getRandomTotalFailDescription()
	};
}

/**
 * 결과 타입에 따른 캐릭터 표정
 */
export function getEmotionForResult(resultType: DishResultType): string {
	switch (resultType) {
		case 'critical':
			return 'surprised';
		case 'success':
			return 'happy';
		case 'fail':
			return 'embarrassed';
		case 'total_fail':
			return 'shocked';
		default:
			return 'default';
	}
}

/**
 * 디버깅용: 확률 분포 확인
 */
export function debugProbabilities(ingredient: Ingredient, bonuses: DishEffects = {}) {
	const ranges = calculateProbabilityRanges(ingredient, bonuses);

	console.log(`=== ${ingredient.name} (${ingredient.grade}급) 확률 분포 ===`);
	console.log(`전체 범위: 0 ~ ${ranges.total}`);
	console.log(
		`\nCritical (0 ~ ${ranges.criticalEnd}): ${((ranges.criticalEnd / ranges.total) * 100).toFixed(1)}%`
	);
	for (const { dish, start, end } of ranges.criticalDishes) {
		console.log(
			`  - ${dish.name}: ${start} ~ ${end} (${(((end - start) / ranges.total) * 100).toFixed(1)}%)`
		);
	}
	console.log(
		`\nSuccess (${ranges.criticalEnd} ~ ${ranges.successEnd}): ${(((ranges.successEnd - ranges.criticalEnd) / ranges.total) * 100).toFixed(1)}%`
	);
	console.log(
		`\nFail (${ranges.successEnd} ~ ${ranges.total}): ${(((ranges.total - ranges.successEnd) / ranges.total) * 100).toFixed(1)}%`
	);
	for (const { dish, start, end } of ranges.failDishes) {
		const name = dish?.name ?? '기본 실패';
		console.log(
			`  - ${name}: ${start.toFixed(1)} ~ ${end.toFixed(1)} (${(((end - start) / ranges.total) * 100).toFixed(1)}%)`
		);
	}
}
