/**
 * 가격 생성 스크립트 (한 번 실행용)
 *
 * 등급별 기준 구매가:
 * G: 50, F: 80, E: 120, D: 180, C: 250, B: 350, A: 500, R: 800
 *
 * 구매가: 기준가 ± 10~20% 변동 (10원 단위)
 * 판매가: 재료비 합계 × 2~3배 (10원 단위)
 */

import { RECIPES_DATA } from './recipes-data';

// 등급별 기준 구매가
const BASE_PRICES: Record<string, number> = {
	G: 50,
	F: 80,
	E: 120,
	D: 180,
	C: 250,
	B: 350,
	A: 500,
	R: 800
};

// 시드 기반 랜덤 (일관된 결과)
function seededRandom(seed: number): number {
	const x = Math.sin(seed * 9999) * 10000;
	return x - Math.floor(x);
}

// 구매가 계산 (기준가 ± 20%, 10원 단위)
export function calculateBuyPrice(id: number, grade: string): number {
	const basePrice = BASE_PRICES[grade] || 100;
	const variation = seededRandom(id) * 0.4 - 0.2; // -20% ~ +20%
	const price = basePrice * (1 + variation);
	return Math.round(price / 10) * 10;
}

// 판매가 계산 (재료비 × 2~3배, 10원 단위)
export function calculateSellPrice(
	id: number,
	ingredientIds: number[],
	ingredientPrices: Map<number, number>
): number {
	const cost = ingredientIds.reduce((sum, ingId) => {
		return sum + (ingredientPrices.get(ingId) || 100);
	}, 0);

	const multiplier = 2 + seededRandom(id + 1000); // 2.0 ~ 3.0
	const price = cost * multiplier;
	return Math.round(price / 10) * 10;
}

// 가격 맵 생성
export function generatePriceMap(): {
	buyPrices: Map<number, number>;
	sellPrices: Map<number, number>;
} {
	const buyPrices = new Map<number, number>();
	const sellPrices = new Map<number, number>();

	// 1. 먼저 모든 재료의 구매가 계산 (등급 기반)
	// ID 범위로 등급 추정
	const getGrade = (id: number): string => {
		if (id <= 8) return 'G';
		if (id <= 127) return 'F';
		if (id <= 262) return 'E';
		if (id <= 346) return 'D';
		if (id <= 431) return 'C';
		if (id <= 523) return 'B';
		if (id <= 614) return 'A';
		return 'R';
	};

	// 모든 ID에 대해 구매가 계산
	for (let id = 1; id <= 800; id++) {
		const grade = getGrade(id);
		buyPrices.set(id, calculateBuyPrice(id, grade));
	}

	// 2. 레시피 기반으로 판매가 계산
	for (const recipe of RECIPES_DATA) {
		if (recipe.sellPrice) {
			// 이미 계산된 판매가 사용
			sellPrices.set(recipe.resultIngredientId, recipe.sellPrice);
		}
	}

	return { buyPrices, sellPrices };
}

// 콘솔 출력용
const { buyPrices, sellPrices } = generatePriceMap();

console.log('=== 구매가 샘플 ===');
[1, 2, 3, 101, 102, 201, 301, 401, 501, 601, 701].forEach((id) => {
	console.log(`ID ${id}: ${buyPrices.get(id)}원`);
});

console.log('\n=== 판매가 샘플 ===');
[113, 114, 115, 215, 314, 413, 513, 701].forEach((id) => {
	console.log(`ID ${id}: ${sellPrices.get(id)}원`);
});
