import type { Ingredient } from '../types';

/**
 * 재료 데이터
 *
 * Tier 구조:
 * - Tier 0 (basic): 기본 재료 4개
 * - Tier 1 (common): 조리 재료 4개
 * - Tier 2 (rare): 조리 재료 6개
 * - Tier 3 (epic): 조리 재료 4개
 * - Tier 4 (legendary): 조리 재료 3개
 *
 * 총 21개 재료
 */

/** Tier 0: 기본 재료 (4개) */
const tier0: Ingredient[] = [
	{ id: 'water', name: '물', category: '액체', grade: 'basic' },
	{ id: 'rice', name: '쌀', category: '곡물', grade: 'basic' },
	{ id: 'egg', name: '계란', category: '단백질', grade: 'basic' },
	{ id: 'meat', name: '고기', category: '단백질', grade: 'basic' }
];

/** Tier 1: 조리 재료 (4개) */
const tier1: Ingredient[] = [
	{ id: 'cooked-rice', name: '밥', category: '곡물', grade: 'common' },
	{ id: 'boiled-egg', name: '삶은계란', category: '단백질', grade: 'common' },
	{ id: 'fried-meat', name: '볶은고기', category: '단백질', grade: 'common' },
	{ id: 'broth', name: '국물', category: '액체', grade: 'common' }
];

/** Tier 2: 조리 재료 (6개) */
const tier2: Ingredient[] = [
	{ id: 'egg-rice', name: '계란밥', category: '복합', grade: 'rare' },
	{ id: 'meat-rice', name: '고기밥', category: '복합', grade: 'rare' },
	{ id: 'porridge', name: '죽', category: '곡물', grade: 'rare' },
	{ id: 'egg-soup', name: '계란국', category: '액체', grade: 'rare' },
	{ id: 'bibimbap', name: '비빔밥', category: '복합', grade: 'rare' },
	{ id: 'onigiri', name: '주먹밥', category: '곡물', grade: 'rare' }
];

/** Tier 3: 조리 재료 (4개) */
const tier3: Ingredient[] = [
	{ id: 'egg-porridge', name: '계란죽', category: '곡물', grade: 'epic' },
	{ id: 'meat-porridge', name: '고기죽', category: '곡물', grade: 'epic' },
	{ id: 'fried-rice', name: '볶음밥', category: '복합', grade: 'epic' },
	{ id: 'kimbap', name: '김밥', category: '복합', grade: 'epic' }
];

/** Tier 4: 조리 재료 (3개) */
const tier4: Ingredient[] = [
	{ id: 'special-fried-rice', name: '특제볶음밥', category: '복합', grade: 'legendary' },
	{ id: 'special-kimbap', name: '특제김밥', category: '복합', grade: 'legendary' },
	{ id: 'ultimate-porridge', name: '궁극의죽', category: '곡물', grade: 'legendary' }
];

/** 모든 재료 (22개) */
export const INGREDIENTS: Ingredient[] = [...tier0, ...tier1, ...tier2, ...tier3, ...tier4];

/** 재료 ID로 재료 찾기 */
export function findIngredientById(id: string): Ingredient | undefined {
	return INGREDIENTS.find((ingredient) => ingredient.id === id);
}

/** 기본 재료 목록 (처음부터 오픈) */
export const INITIAL_INGREDIENTS = tier0.map((i) => i.id);
