/**
 * 요리 시스템 타입 정의
 */

/**
 * 재료 등급
 * - basic: 기본 재료 (물, 쌀, 계란, 고기)
 * - common: Tier 1 조리 재료
 * - rare: Tier 2 조리 재료
 * - epic: Tier 3 조리 재료
 * - legendary: Tier 4 조리 재료
 */
export type IngredientGrade = "basic" | "common" | "rare" | "epic" | "legendary";

/**
 * 요리 결과 등급
 * - success: 성공 (재료 오픈)
 * - fail: 실패 (재료 오픈 안됨)
 * - disaster: 완전 실패 (재료 오픈 안됨)
 */
export type DishGrade = "success" | "fail" | "disaster";

/**
 * 재료
 */
export interface Ingredient {
	/** 재료 고유 ID */
	id: string;
	/** 재료 이름 */
	name: string;
	/** 재료 카테고리 (예: 곡물, 단백질, 액체 등) */
	category: string;
	/** 재료 등급 */
	grade: IngredientGrade;
}

/**
 * 레시피
 */
export interface Recipe {
	/** 레시피 고유 ID */
	id: string;
	/** 레시피 이름 */
	name: string;
	/** 만들어지는 재료 ID */
	resultIngredientId: string;
	/** 레시피 입력 */
	inputs: {
		/** 필요한 재료 ID 목록 (2개) */
		ingredients: string[];
		/** 필요한 도구 (선택사항) */
		tool?: string;
	};
}

/**
 * 요리
 */
export interface Dish {
	/** 요리 고유 ID */
	id: string;
	/** 레시피 ID */
	recipeId: string;
	/** 요리 이름 */
	name: string;
	/** 요리 결과 등급 */
	grade: DishGrade;
	/** 등장 확률 (0-100, success는 생략 가능) */
	probability?: number;
	/** 요리 아이콘 (이모지) */
	icon?: string;
}
