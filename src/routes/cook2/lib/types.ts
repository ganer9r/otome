/**
 * 요리 시스템 타입 정의
 */

/**
 * 재료 등급 (8단계)
 * G -> F -> E -> D -> C -> B -> A -> R
 */
export type IngredientGrade = 'G' | 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'R';

/**
 * 재료/요리
 */
export interface Ingredient {
	/** 고유 ID (숫자) */
	id: number;
	/** 이름 */
	name: string;
	/** 등급 */
	grade: IngredientGrade;
	/** 이미지 URL (optional) */
	imageUrl?: string;
	/** 재료 여부 (true: 다음 조합에 사용 가능, false: 요리만) */
	isIngredient: boolean;
}

/**
 * 레시피
 */
export interface Recipe {
	/** 레시피 고유 ID */
	id: number;
	/** 레시피 이름 */
	name: string;
	/** 결과 재료 ID */
	resultIngredientId: number;
	/** 필요 재료 ID 목록 (2개) */
	ingredientIds: number[];
}

/**
 * 등급 순서 (낮은 등급 -> 높은 등급)
 */
export const GRADE_ORDER: IngredientGrade[] = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'R'];

/**
 * 등급별 색상
 */
export const GRADE_COLORS: Record<IngredientGrade, string> = {
	G: '#9CA3AF', // gray
	F: '#78716C', // stone
	E: '#22C55E', // green
	D: '#3B82F6', // blue
	C: '#A855F7', // purple
	B: '#F97316', // orange
	A: '#EF4444', // red
	R: '#FBBF24' // gold/yellow
};

/**
 * 등급별 한글 이름
 */
export const GRADE_NAMES: Record<IngredientGrade, string> = {
	G: '기본',
	F: '일반',
	E: '고급',
	D: '희귀',
	C: '영웅',
	B: '전설',
	A: '신화',
	R: '레어'
};
