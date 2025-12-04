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
	/** 구매가 (재료인 경우) */
	buyPrice?: number;
	/** 판매가 (요리인 경우) */
	sellPrice?: number;
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
	/** 판매가 (요리인 경우) */
	sellPrice?: number;
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
	G: 'G급',
	F: 'F급',
	E: 'E급',
	D: 'D급',
	C: 'C급',
	B: 'B급',
	A: 'A급',
	R: 'R급'
};

/**
 * 등급별 재료 구매 가격
 */
export const GRADE_PRICES: Record<IngredientGrade, number> = {
	G: 50,
	F: 80,
	E: 120,
	D: 180,
	C: 250,
	B: 350,
	A: 500,
	R: 800
};

/**
 * 재료 가격 가져오기
 */
export function getIngredientPrice(grade: IngredientGrade): number {
	return GRADE_PRICES[grade];
}

// ============================================
// 미션 시스템
// ============================================

/**
 * 미션 타입
 */
export type MissionType =
	| 'cook_count' // N번 요리하기
	| 'cook_grade' // N등급 요리 M개 만들기
	| 'earn_money' // N원 벌기
	| 'discover_ingredient' // 새 재료 N개 발견
	| 'discover_recipe'; // 새 레시피 N개 발견

/**
 * 미션 카테고리
 */
export type MissionCategory = 'daily' | 'achievement';

/**
 * 미션 정의 (템플릿)
 */
export interface MissionDefinition {
	/** 미션 고유 ID */
	id: string;
	/** 카테고리 */
	category: MissionCategory;
	/** 미션 타입 */
	type: MissionType;
	/** 미션 제목 */
	title: string;
	/** 미션 설명 */
	description: string;
	/** 목표 수치 */
	target: number;
	/** 보상 (스타) */
	reward: number;
	/** 등급 조건 (cook_grade 타입일 때) */
	grade?: IngredientGrade;
}

/**
 * 미션 진행 상태
 */
export interface MissionProgress {
	/** 미션 ID */
	missionId: string;
	/** 현재 진행도 */
	current: number;
	/** 완료 여부 */
	completed: boolean;
	/** 보상 수령 여부 */
	claimed: boolean;
}
