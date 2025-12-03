/**
 * 레시피 조합 트리 계산
 * 최종 요리를 만들기 위한 모든 조합 단계를 순서대로 반환
 */

import { findRecipeByResult } from '../../lib/data/recipes';
import { findIngredientById } from '../../lib/data/ingredients';

export interface CookStep {
	/** 필요 재료 ID 목록 */
	ingredientIds: number[];
	/** 필요 재료 이름 목록 */
	ingredientNames: string[];
	/** 결과 ID */
	resultId: number;
	/** 결과 이름 */
	resultName: string;
	/** 결과 등급 */
	resultGrade: string;
}

/**
 * 재료가 기본 재료(G등급)인지 확인
 * 기본 재료 = 레시피 없이 바로 사용 가능한 재료
 */
function isBaseIngredient(ingredientId: number): boolean {
	const recipe = findRecipeByResult(ingredientId);
	return recipe === undefined;
}

/**
 * 재료를 만드는 조합 단계들을 재귀적으로 수집
 * (하위 재료부터 상위 재료 순서로)
 */
function collectSteps(ingredientId: number, steps: CookStep[], visited: Set<number>): void {
	// 순환 참조 방지
	if (visited.has(ingredientId)) return;
	visited.add(ingredientId);

	// 기본 재료면 스킵
	if (isBaseIngredient(ingredientId)) return;

	// 이 재료를 만드는 레시피 찾기
	const recipe = findRecipeByResult(ingredientId);
	if (!recipe) return;

	// 하위 재료들 먼저 처리 (재귀)
	for (const inputId of recipe.ingredientIds) {
		collectSteps(inputId, steps, visited);
	}

	// 현재 단계 추가
	const resultIngredient = findIngredientById(ingredientId);
	const ingredientNames = recipe.ingredientIds.map((id) => {
		const ing = findIngredientById(id);
		return ing?.name ?? '???';
	});

	steps.push({
		ingredientIds: recipe.ingredientIds,
		ingredientNames,
		resultId: ingredientId,
		resultName: resultIngredient?.name ?? '???',
		resultGrade: resultIngredient?.grade ?? 'G'
	});
}

/**
 * 최종 요리를 만들기 위한 모든 조합 단계 반환
 * @param targetResultId 만들고 싶은 최종 요리의 재료 ID
 * @returns 조합 단계 배열 (순서대로 실행)
 */
export function buildRecipeTree(targetResultId: number): CookStep[] {
	const steps: CookStep[] = [];
	const visited = new Set<number>();

	collectSteps(targetResultId, steps, visited);

	return steps;
}

/**
 * 조합 단계 수 계산 (미리보기용)
 */
export function getStepCount(targetResultId: number): number {
	return buildRecipeTree(targetResultId).length;
}
