import type { Ingredient, IngredientGrade } from '../types';
import { INGREDIENTS_DATA } from './ingredients-data';

/** 모든 재료 (272개) */
export const INGREDIENTS: Ingredient[] = INGREDIENTS_DATA;

/** 초기 해금 재료 (G등급) */
export const INITIAL_INGREDIENTS = INGREDIENTS.filter((i) => i.grade === 'G');

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
