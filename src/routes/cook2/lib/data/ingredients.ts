import type { Ingredient, IngredientGrade } from '../types';
import { INGREDIENTS_DATA } from './ingredients-data';

/** 모든 재료 (272개) */
export const INGREDIENTS: Ingredient[] = INGREDIENTS_DATA;

/** 초기 해금 재료 (G등급 재료만, 요리 제외) */
export const INITIAL_INGREDIENTS = INGREDIENTS.filter((i) => i.grade === 'G' && i.isIngredient);

/** ID로 재료 찾기 */
export function findIngredientById(id: number): Ingredient | undefined {
	return INGREDIENTS.find((i) => i.id === id);
}

/** 등급별 재료 목록 */
export function getIngredientsByGrade(grade: IngredientGrade): Ingredient[] {
	return INGREDIENTS.filter((i) => i.grade === grade);
}

/** 이름으로 재료 찾기 */
export function findIngredientByName(name: string): Ingredient | undefined {
	return INGREDIENTS.find((i) => i.name === name);
}

/** 등급별 발견 현황 */
export function getProgressByGrade(
	unlockedIds: number[],
	grade: IngredientGrade
): { discovered: number; total: number; percent: number } {
	const gradeIngredients = INGREDIENTS.filter((i) => i.grade === grade);
	const discovered = gradeIngredients.filter((i) => unlockedIds.includes(i.id)).length;
	const total = gradeIngredients.length;
	const percent = total > 0 ? Math.round((discovered / total) * 100) : 0;
	return { discovered, total, percent };
}

/** 전체 발견 현황 */
export function getTotalProgress(unlockedIds: number[]): {
	discovered: number;
	total: number;
	percent: number;
} {
	const discovered = unlockedIds.length;
	const total = INGREDIENTS.length;
	const percent = total > 0 ? Math.round((discovered / total) * 100) : 0;
	return { discovered, total, percent };
}
