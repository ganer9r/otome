/**
 * Dish 관련 헬퍼 함수
 *
 * dishes-data.ts의 DISH_TABLE을 사용하여 요리 결과 조회
 */

import type { IngredientGrade } from '../types';
import {
	DISH_TABLE,
	GRADE_PROBABILITIES,
	CRITICAL_MULTIPLIER,
	FAIL_MULTIPLIER,
	CRITICAL_PREFIXES,
	CRITICAL_DESCRIPTIONS,
	FAIL_DESCRIPTIONS,
	TOTAL_FAIL_NAMES,
	TOTAL_FAIL_DESCRIPTIONS,
	getCriticalDish,
	getFailDish,
	type DishEntry
} from './dishes-data';

/**
 * 특정 Ingredient의 크리티컬 결과 조회
 */
export function getCriticalDishes(ingredientId: number): DishEntry[] {
	const dish = getCriticalDish(ingredientId);
	return dish ? [dish] : [];
}

/**
 * 특정 Ingredient의 실패 결과 조회
 */
export function getFailDishes(ingredientId: number): DishEntry[] {
	const dish = getFailDish(ingredientId);
	return dish ? [dish] : [];
}

/**
 * 랜덤 대성공 수식어
 */
export function getRandomCriticalPrefix(): string {
	return CRITICAL_PREFIXES[Math.floor(Math.random() * CRITICAL_PREFIXES.length)];
}

/**
 * 랜덤 대성공 설명
 */
export function getRandomCriticalDescription(): string {
	return CRITICAL_DESCRIPTIONS[Math.floor(Math.random() * CRITICAL_DESCRIPTIONS.length)];
}

/**
 * 랜덤 실패 설명
 */
export function getRandomFailDescription(): string {
	return FAIL_DESCRIPTIONS[Math.floor(Math.random() * FAIL_DESCRIPTIONS.length)];
}

/**
 * 특정 재료/요리의 실패 이름
 */
export function getFailName(ingredientId: number): string {
	const dish = getFailDish(ingredientId);
	return dish?.name || '알 수 없는 물체';
}

/**
 * 대성공 이름 생성 (수식어 + 원래 이름)
 */
export function generateCriticalName(originalName: string): string {
	const prefix = getRandomCriticalPrefix();
	return `${prefix} ${originalName}`;
}

/**
 * 등급별 실패 가격 배수
 */
export function getDefaultFailMultiplier(grade: IngredientGrade): number {
	return FAIL_MULTIPLIER[grade] ?? 0.3;
}

/**
 * 등급별 크리티컬 가격 배수
 */
export function getDefaultCriticalMultiplier(grade: IngredientGrade): number {
	return CRITICAL_MULTIPLIER[grade] ?? 1.3;
}

/**
 * 등급별 실패 확률
 */
export function getFailProbability(grade: IngredientGrade): number {
	return GRADE_PROBABILITIES[grade]?.fail ?? 10;
}

/**
 * 등급별 크리티컬 확률
 */
export function getCriticalProbability(grade: IngredientGrade): number {
	return GRADE_PROBABILITIES[grade]?.critical ?? 5;
}

/**
 * 랜덤 실패 이름 (테이블에서)
 */
export function getRandomFailName(): string {
	const failDishes = DISH_TABLE.filter((d) => d.resultType === 'fail');
	if (failDishes.length === 0) return '알 수 없는 물체';
	return failDishes[Math.floor(Math.random() * failDishes.length)].name;
}

/**
 * 랜덤 완전 실패 이름
 */
export function getRandomTotalFailName(): string {
	return TOTAL_FAIL_NAMES[Math.floor(Math.random() * TOTAL_FAIL_NAMES.length)];
}

/**
 * 랜덤 완전 실패 설명
 */
export function getRandomTotalFailDescription(): string {
	return TOTAL_FAIL_DESCRIPTIONS[Math.floor(Math.random() * TOTAL_FAIL_DESCRIPTIONS.length)];
}

// 레거시 호환용 export
export { CRITICAL_PREFIXES as COMMON_CRITICAL_PREFIXES };
export { FAIL_DESCRIPTIONS as COMMON_FAIL_DESCRIPTIONS };
export { GRADE_PROBABILITIES };
