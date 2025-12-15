/**
 * Dish 관련 헬퍼 함수
 */

import type { Dish, IngredientGrade } from '../types';
import {
	DISHES_DATA,
	CRITICAL_PREFIXES,
	CRITICAL_DESCRIPTIONS,
	FAIL_DESCRIPTIONS,
	FAIL_NAMES,
	CRITICAL_MULTIPLIER_BY_GRADE,
	FAIL_MULTIPLIER_BY_GRADE,
	FAIL_PROBABILITY_BY_GRADE,
	TOTAL_FAIL_DESCRIPTIONS,
	TOTAL_FAIL_NAMES
} from './dishes-data';

/**
 * 특정 Ingredient에 대한 Dish 목록 가져오기
 */
export function getDishesByIngredientId(ingredientId: number): Dish[] {
	return DISHES_DATA.filter((d) => d.ingredientId === ingredientId);
}

/**
 * 특정 Ingredient의 critical Dish 목록
 */
export function getCriticalDishes(ingredientId: number): Dish[] {
	return getDishesByIngredientId(ingredientId).filter((d) => d.resultType === 'critical');
}

/**
 * 특정 Ingredient의 fail Dish 목록
 */
export function getFailDishes(ingredientId: number): Dish[] {
	return getDishesByIngredientId(ingredientId).filter((d) => d.resultType === 'fail');
}

/**
 * 랜덤 대성공 수식어 가져오기
 */
export function getRandomCriticalPrefix(): string {
	return CRITICAL_PREFIXES[Math.floor(Math.random() * CRITICAL_PREFIXES.length)];
}

/**
 * 랜덤 대성공 설명 가져오기
 */
export function getRandomCriticalDescription(): string {
	return CRITICAL_DESCRIPTIONS[Math.floor(Math.random() * CRITICAL_DESCRIPTIONS.length)];
}

/**
 * 랜덤 실패 설명 가져오기
 */
export function getRandomFailDescription(): string {
	return FAIL_DESCRIPTIONS[Math.floor(Math.random() * FAIL_DESCRIPTIONS.length)];
}

/**
 * 특정 재료/요리의 실패 이름 가져오기
 */
export function getFailName(ingredientId: number): string {
	return FAIL_NAMES[ingredientId] || '알 수 없는 물체';
}

/**
 * 대성공 이름 생성 (수식어 + 원래 이름)
 */
export function generateCriticalName(originalName: string): string {
	const prefix = getRandomCriticalPrefix();
	return `${prefix} ${originalName}`;
}

/**
 * 등급에 따른 기본 실패 판매가 배수
 * - 높은 등급일수록 실패해도 어느 정도 가치 있음
 */
export function getDefaultFailMultiplier(grade: IngredientGrade): number {
	return FAIL_MULTIPLIER_BY_GRADE[grade] || 0.3;
}

/**
 * 등급에 따른 기본 대성공 판매가 배수
 */
export function getDefaultCriticalMultiplier(grade: IngredientGrade): number {
	return CRITICAL_MULTIPLIER_BY_GRADE[grade] || 1.3;
}

/**
 * 등급에 따른 실패 확률
 */
export function getFailProbability(grade: IngredientGrade): number {
	return FAIL_PROBABILITY_BY_GRADE[grade] || 10;
}

/**
 * 대성공 확률 (고정 5%)
 */
export function getCriticalProbability(): number {
	return 5;
}

/**
 * 랜덤 실패 이름 가져오기 (레거시 호환)
 */
export function getRandomFailName(): string {
	const names = Object.values(FAIL_NAMES);
	if (names.length === 0) return '알 수 없는 물체';
	return names[Math.floor(Math.random() * names.length)];
}

/**
 * 랜덤 완전 실패 설명 가져오기
 */
export function getRandomTotalFailDescription(): string {
	return TOTAL_FAIL_DESCRIPTIONS[Math.floor(Math.random() * TOTAL_FAIL_DESCRIPTIONS.length)];
}

/**
 * 랜덤 완전 실패 이름 가져오기
 */
export function getRandomTotalFailName(): string {
	return TOTAL_FAIL_NAMES[Math.floor(Math.random() * TOTAL_FAIL_NAMES.length)];
}

// 레거시 호환용 export
export { CRITICAL_PREFIXES as COMMON_CRITICAL_PREFIXES };
export { FAIL_DESCRIPTIONS as COMMON_FAIL_DESCRIPTIONS };
export { FAIL_NAMES as COMMON_FAIL_NAMES };
