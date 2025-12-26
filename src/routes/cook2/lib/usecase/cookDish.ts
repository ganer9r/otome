/**
 * 요리 결과 판정 로직
 *
 * DISH_TABLE에서 크리티컬/실패 확률과 가격 배수를 조회하여 결과 판정
 */

import type { Ingredient, CookResult, DishEffects, DishResultType } from '../types';
import {
	getCriticalDishes,
	getFailDishes,
	getRandomFailDescription,
	getDefaultFailMultiplier,
	getDefaultCriticalMultiplier,
	getRandomTotalFailDescription,
	getRandomTotalFailName,
	getRandomCriticalDescription,
	GRADE_PROBABILITIES
} from '../data/dishes';
import type { DishEntry } from '../data/dishes-data';

/**
 * 확률 영역 계산 결과
 */
interface ProbabilityRanges {
	criticalEntry: DishEntry | null;
	criticalEnd: number;
	successEnd: number;
	failEntry: DishEntry | null;
	failStart: number;
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

	// DISH_TABLE에서 조회
	const criticalDishes = getCriticalDishes(ingredient.id);
	const failDishes = getFailDishes(ingredient.id);

	const criticalEntry = criticalDishes[0] ?? null;
	const failEntry = failDishes[0] ?? null;

	// 확률 가져오기 (테이블 값 우선, 없으면 기본값)
	const criticalProb = criticalEntry?.probability ?? baseProbabilities.critical;
	const failProb = failEntry?.probability ?? baseProbabilities.fail;

	// criticalBonus 적용 → fail에서 깎음
	const criticalBonus = bonuses.criticalBonus ?? 0;
	const failReduction = bonuses.failReduction ?? 0;
	const adjustedFailProb = Math.max(0, failProb - criticalBonus - failReduction);

	// success 영역 = 100 - critical - fail (기본 fail 기준)
	const successProb = 100 - criticalProb - failProb;

	// 전체 범위 (fail이 줄어든 만큼 전체도 줄어듦)
	const total = criticalProb + successProb + adjustedFailProb;

	// 영역 배치: [critical][success][fail]
	const criticalEnd = criticalProb;
	const successEnd = criticalProb + successProb;
	const failStart = successEnd;

	return {
		criticalEntry,
		criticalEnd,
		successEnd,
		failEntry,
		failStart,
		total
	};
}

/**
 * 요리 결과 판정
 * @param ingredient 결과 재료 (레시피 결과물)
 * @param bonuses 재료 효과로 인한 보너스
 */
export function cookDish(ingredient: Ingredient, bonuses: DishEffects = {}): CookResult {
	const baseSellPrice = ingredient.sellPrice ?? 0;
	const ranges = calculateProbabilityRanges(ingredient, bonuses);

	// 난수 생성 (0 ~ total)
	const roll = Math.random() * ranges.total;

	// 1. critical 판정
	if (roll < ranges.criticalEnd) {
		const entry = ranges.criticalEntry;
		const multiplier = entry?.priceMultiplier ?? getDefaultCriticalMultiplier(ingredient.grade);
		const displayName = entry?.name ?? `완벽한 ${ingredient.name}`;

		return {
			resultType: 'critical',
			ingredient,
			sellPrice: Math.round(baseSellPrice * multiplier),
			displayName,
			displayImage: ingredient.imageUrl,
			description: getRandomCriticalDescription()
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
	const entry = ranges.failEntry;
	const multiplier = entry?.priceMultiplier ?? getDefaultFailMultiplier(ingredient.grade);
	const displayName = entry?.name ?? '알 수 없는 물체';

	return {
		resultType: 'fail',
		ingredient,
		sellPrice: Math.round(baseSellPrice * multiplier),
		displayName,
		displayImage: ingredient.imageUrl,
		description: getRandomFailDescription()
	};
}

/**
 * 완전 실패 결과 생성 (레시피 없음, 재료 부족 등)
 */
export function createTotalFailResult(): CookResult {
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
		displayImage: undefined,
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
	if (ranges.criticalEntry) {
		console.log(`  - ${ranges.criticalEntry.name}`);
	}
	console.log(
		`\nSuccess (${ranges.criticalEnd} ~ ${ranges.successEnd}): ${(((ranges.successEnd - ranges.criticalEnd) / ranges.total) * 100).toFixed(1)}%`
	);
	console.log(
		`\nFail (${ranges.failStart} ~ ${ranges.total}): ${(((ranges.total - ranges.failStart) / ranges.total) * 100).toFixed(1)}%`
	);
	if (ranges.failEntry) {
		console.log(`  - ${ranges.failEntry.name}`);
	}
}
