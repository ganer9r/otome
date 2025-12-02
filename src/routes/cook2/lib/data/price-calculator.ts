/**
 * 가격 계산 모듈
 *
 * buyPrice: 재료만, 조합비용의 90% (10원 단위)
 * sellPrice: 모든 결과물, 조합비용의 2~3배 (10원 단위)
 */

import { RECIPES_DATA } from './recipes-data';

// G등급 기본 재료 buyPrice
const BASE_BUY_PRICES: Record<number, number> = {
	1: 50, // 쌀
	2: 40, // 밀
	3: 60, // 고기
	4: 50, // 해물
	5: 40, // 채소
	6: 50, // 과일
	7: 40, // 물
	8: 60 // 불
};

// 재료 ID Set (isIngredient = true인 것들)
const INGREDIENT_IDS = new Set([
	// G등급 (8개)
	1, 2, 3, 4, 5, 6, 7, 8,
	// F등급 재료 (13개)
	101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 123,
	// E등급 재료 (12개)
	201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212,
	// D등급 재료 (11개)
	301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311,
	// C등급 재료 (11개)
	401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411,
	// B등급 재료 (15개) - 와규스테이크, 트러플파스타, 푸아그라스테이크 포함
	501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 516, 518,
	// A등급 재료 (11개)
	601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611
]);

// 레시피 맵 (resultId -> [ing1, ing2])
const recipeMap = new Map<number, [number, number]>();
for (const recipe of RECIPES_DATA) {
	recipeMap.set(recipe.resultIngredientId, recipe.ingredientIds as [number, number]);
}

// buyPrice 캐시
const buyPriceCache: Record<number, number> = { ...BASE_BUY_PRICES };

/**
 * buyPrice 계산 (재귀)
 * 재료: 조합비용의 90%
 * 요리: 0
 */
export function calculateBuyPrice(id: number): number {
	if (buyPriceCache[id] !== undefined) {
		return buyPriceCache[id];
	}

	// 요리면 buyPrice = 0
	if (!INGREDIENT_IDS.has(id)) {
		buyPriceCache[id] = 0;
		return 0;
	}

	const recipe = recipeMap.get(id);
	if (!recipe) {
		console.warn(`No recipe for ingredient id ${id}`);
		return 0;
	}

	const [ing1, ing2] = recipe;
	const cost = calculateBuyPrice(ing1) + calculateBuyPrice(ing2);

	// 조합비용의 90%, 10원 단위
	buyPriceCache[id] = Math.round((cost * 0.9) / 10) * 10;
	return buyPriceCache[id];
}

/**
 * sellPrice 계산
 * 조합비용의 2~3배 (id 기반 시드로 결정)
 */
export function calculateSellPrice(id: number): number {
	const recipe = recipeMap.get(id);
	if (!recipe) {
		// G등급 기본 재료도 팔 수 있게 (buyPrice * 2)
		const baseBuyPrice = BASE_BUY_PRICES[id];
		if (baseBuyPrice) {
			return baseBuyPrice * 2;
		}
		return 0;
	}

	const [ing1, ing2] = recipe;
	const cost = calculateBuyPrice(ing1) + calculateBuyPrice(ing2);

	// id 기반 시드로 2.0~3.0 배수 결정
	const seed = ((id * 7 + 13) % 11) / 10; // 0.0 ~ 1.0
	const multiplier = 2.0 + seed; // 2.0 ~ 3.0

	return Math.round((cost * multiplier) / 10) * 10;
}

/**
 * 조합비용 계산 (재료1 + 재료2의 buyPrice 합)
 */
export function calculateCombinationCost(ingredientIds: number[]): number {
	return ingredientIds.reduce((sum, id) => sum + calculateBuyPrice(id), 0);
}

/**
 * 모든 가격 초기화 (캐시 리셋)
 */
export function initializePrices(): void {
	// 캐시 리셋
	Object.keys(buyPriceCache).forEach((key) => {
		if (!BASE_BUY_PRICES[Number(key)]) {
			delete buyPriceCache[Number(key)];
		}
	});

	// 모든 레시피 결과물의 가격 계산
	for (const recipe of RECIPES_DATA) {
		calculateBuyPrice(recipe.resultIngredientId);
	}
}

// 모듈 로드 시 초기화
initializePrices();
