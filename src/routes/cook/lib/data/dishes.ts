import type { Dish } from '../types';

/**
 * 요리 데이터
 *
 * 17개 레시피 × 3개 배리에이션 = 51개 요리
 * - success: probability 생략 (자동 계산)
 * - fail: 확률 명시
 * - disaster: 확률 명시
 */

/** Tier 1 레시피의 요리 결과 (4개 레시피 × 3개 = 12개) */
const tier1Dishes: Dish[] = [
	// 밥 짓기
	{ id: 'dish-cooked-rice-success', recipeId: 'recipe-cooked-rice', name: '완벽한 밥', grade: 'success', icon: '🍚' },
	{ id: 'dish-cooked-rice-fail', recipeId: 'recipe-cooked-rice', name: '반쯤 깬 쌀알의 저항', grade: 'fail', probability: 25, icon: '😤' },
	{ id: 'dish-cooked-rice-disaster', recipeId: 'recipe-cooked-rice', name: '숯덩어리 코스프레', grade: 'disaster', probability: 5, icon: '🔥' },

	// 계란 삶기
	{ id: 'dish-boiled-egg-success', recipeId: 'recipe-boiled-egg', name: '반숙계란', grade: 'success', icon: '🥚' },
	{ id: 'dish-boiled-egg-fail', recipeId: 'recipe-boiled-egg', name: '돌처럼 단단한 완숙', grade: 'fail', probability: 30, icon: '🪨' },
	{ id: 'dish-boiled-egg-disaster', recipeId: 'recipe-boiled-egg', name: '계란의 비극적 폭발', grade: 'disaster', probability: 10, icon: '💥' },

	// 고기 볶기
	{ id: 'dish-fried-meat-success', recipeId: 'recipe-fried-meat', name: '완벽한 볶은고기', grade: 'success', icon: '🥩' },
	{ id: 'dish-fried-meat-fail', recipeId: 'recipe-fried-meat', name: '아직 살아있는 듯한 고기', grade: 'fail', probability: 20, icon: '🩸' },
	{ id: 'dish-fried-meat-disaster', recipeId: 'recipe-fried-meat', name: '흑역사가 된 고기', grade: 'disaster', probability: 10, icon: '🖤' },

	// 국물 내기
	{ id: 'dish-broth-success', recipeId: 'recipe-broth', name: '진한 국물', grade: 'success', icon: '🍲' },
	{ id: 'dish-broth-fail', recipeId: 'recipe-broth', name: '물 코스프레 중인 국물', grade: 'fail', probability: 20, icon: '💧' },
	{ id: 'dish-broth-disaster', recipeId: 'recipe-broth', name: '소금폭탄 국물', grade: 'disaster', probability: 5, icon: '💣' }
];

/** Tier 2 레시피의 요리 결과 (6개 레시피 × 3개 = 18개) */
const tier2Dishes: Dish[] = [
	// 계란밥 만들기
	{ id: 'dish-egg-rice-success', recipeId: 'recipe-egg-rice', name: '완벽한 계란밥', grade: 'success', icon: '🍳' },
	{ id: 'dish-egg-rice-fail', recipeId: 'recipe-egg-rice', name: '계란의 정체성을 잃은 밥', grade: 'fail', probability: 25, icon: '❓' },
	{ id: 'dish-egg-rice-disaster', recipeId: 'recipe-egg-rice', name: '스크램블의 비극', grade: 'disaster', probability: 10, icon: '😭' },

	// 고기밥 만들기
	{ id: 'dish-meat-rice-success', recipeId: 'recipe-meat-rice', name: '완벽한 고기밥', grade: 'success', icon: '🍖' },
	{ id: 'dish-meat-rice-fail', recipeId: 'recipe-meat-rice', name: '고기 찾기 게임', grade: 'fail', probability: 20, icon: '🔍' },
	{ id: 'dish-meat-rice-disaster', recipeId: 'recipe-meat-rice', name: '차가운 현실의 고기밥', grade: 'disaster', probability: 5, icon: '🧊' },

	// 죽 만들기
	{ id: 'dish-porridge-success', recipeId: 'recipe-porridge', name: '완벽한 죽', grade: 'success', icon: '🥣' },
	{ id: 'dish-porridge-fail', recipeId: 'recipe-porridge', name: '물인지 죽인지 모를 것', grade: 'fail', probability: 30, icon: '💦' },
	{ id: 'dish-porridge-disaster', recipeId: 'recipe-porridge', name: '검게 변한 미스터리', grade: 'disaster', probability: 10, icon: '🌑' },

	// 계란국 만들기
	{ id: 'dish-egg-soup-success', recipeId: 'recipe-egg-soup', name: '완벽한 계란국', grade: 'success', icon: '🍵' },
	{ id: 'dish-egg-soup-fail', recipeId: 'recipe-egg-soup', name: '계란꽃이 핀 국', grade: 'fail', probability: 25, icon: '🌸' },
	{ id: 'dish-egg-soup-disaster', recipeId: 'recipe-egg-soup', name: '바닷물보다 짠 국', grade: 'disaster', probability: 5, icon: '🌊' },

	// 비빔밥 만들기
	{ id: 'dish-bibimbap-success', recipeId: 'recipe-bibimbap', name: '완벽한 비빔밥', grade: 'success', icon: '🍱' },
	{ id: 'dish-bibimbap-fail', recipeId: 'recipe-bibimbap', name: '비빔의 의미를 잃은 밥', grade: 'fail', probability: 20, icon: '🤷' },
	{ id: 'dish-bibimbap-disaster', recipeId: 'recipe-bibimbap', name: '혼돈의 카오스 밥', grade: 'disaster', probability: 10, icon: '🌀' },

	// 주먹밥 만들기
	{ id: 'dish-onigiri-success', recipeId: 'recipe-onigiri', name: '완벽한 주먹밥', grade: 'success', icon: '🍙' },
	{ id: 'dish-onigiri-fail', recipeId: 'recipe-onigiri', name: '정체불명의 덩어리', grade: 'fail', probability: 25, icon: '👽' },
	{ id: 'dish-onigiri-disaster', recipeId: 'recipe-onigiri', name: '손가락 사이로 사라진 밥', grade: 'disaster', probability: 10, icon: '✋' }
];

/** Tier 3 레시피의 요리 결과 (4개 레시피 × 3개 = 12개) */
const tier3Dishes: Dish[] = [
	// 계란죽 만들기
	{ id: 'dish-egg-porridge-success', recipeId: 'recipe-egg-porridge', name: '완벽한 계란죽', grade: 'success', icon: '🥚' },
	{ id: 'dish-egg-porridge-fail', recipeId: 'recipe-egg-porridge', name: '계란 찾아 삼만리 죽', grade: 'fail', probability: 30, icon: '🗺️' },
	{ id: 'dish-egg-porridge-disaster', recipeId: 'recipe-egg-porridge', name: '검은 반점의 추억', grade: 'disaster', probability: 15, icon: '⚫' },

	// 고기죽 만들기
	{ id: 'dish-meat-porridge-success', recipeId: 'recipe-meat-porridge', name: '완벽한 고기죽', grade: 'success', icon: '🥘' },
	{ id: 'dish-meat-porridge-fail', recipeId: 'recipe-meat-porridge', name: '고기는 어디로 갔을까', grade: 'fail', probability: 30, icon: '🤔' },
	{ id: 'dish-meat-porridge-disaster', recipeId: 'recipe-meat-porridge', name: '타버린 영혼의 죽', grade: 'disaster', probability: 15, icon: '👻' },

	// 볶음밥 만들기
	{ id: 'dish-fried-rice-success', recipeId: 'recipe-fried-rice', name: '완벽한 볶음밥', grade: 'success', icon: '🍛' },
	{ id: 'dish-fried-rice-fail', recipeId: 'recipe-fried-rice', name: '볶음인지 찜인지 모를 밥', grade: 'fail', probability: 35, icon: '❔' },
	{ id: 'dish-fried-rice-disaster', recipeId: 'recipe-fried-rice', name: '불의 심판을 받은 밥', grade: 'disaster', probability: 15, icon: '⚖️' },

	// 김밥 만들기
	{ id: 'dish-kimbap-success', recipeId: 'recipe-kimbap', name: '완벽한 김밥', grade: 'success', icon: '🍱' },
	{ id: 'dish-kimbap-fail', recipeId: 'recipe-kimbap', name: '뚱뚱하고 못생긴 김밥', grade: 'fail', probability: 30, icon: '🐷' },
	{ id: 'dish-kimbap-disaster', recipeId: 'recipe-kimbap', name: '폭발한 김밥의 잔해', grade: 'disaster', probability: 20, icon: '💥' }
];

/** Tier 4 레시피의 요리 결과 (3개 레시피 × 3개 = 9개) */
const tier4Dishes: Dish[] = [
	// 특제볶음밥 만들기
	{ id: 'dish-special-fried-rice-success', recipeId: 'recipe-special-fried-rice', name: '완벽한 특제볶음밥', grade: 'success', icon: '✨' },
	{ id: 'dish-special-fried-rice-fail', recipeId: 'recipe-special-fried-rice', name: '특제인지 일반인지 모를 밥', grade: 'fail', probability: 40, icon: '🤨' },
	{ id: 'dish-special-fried-rice-disaster', recipeId: 'recipe-special-fried-rice', name: '검은 마법의 저주받은 밥', grade: 'disaster', probability: 20, icon: '🧙' },

	// 특제김밥 만들기
	{ id: 'dish-special-kimbap-success', recipeId: 'recipe-special-kimbap', name: '완벽한 특제김밥', grade: 'success', icon: '🌟' },
	{ id: 'dish-special-kimbap-fail', recipeId: 'recipe-special-kimbap', name: '특제급 흉측한 비주얼', grade: 'fail', probability: 40, icon: '😱' },
	{ id: 'dish-special-kimbap-disaster', recipeId: 'recipe-special-kimbap', name: '특별히 망한 김밥', grade: 'disaster', probability: 20, icon: '💀' },

	// 궁극의죽 만들기
	{ id: 'dish-ultimate-porridge-success', recipeId: 'recipe-ultimate-porridge', name: '완벽한 궁극의죽', grade: 'success', icon: '👑' },
	{ id: 'dish-ultimate-porridge-fail', recipeId: 'recipe-ultimate-porridge', name: '궁극적으로 묽은 죽', grade: 'fail', probability: 45, icon: '💧' },
	{ id: 'dish-ultimate-porridge-disaster', recipeId: 'recipe-ultimate-porridge', name: '궁극의 실패작', grade: 'disaster', probability: 25, icon: '☠️' }
];

/** 모든 요리 (54개) */
export const DISHES: Dish[] = [...tier1Dishes, ...tier2Dishes, ...tier3Dishes, ...tier4Dishes];

/** 레시피 ID로 요리 목록 찾기 */
export function findDishesByRecipeId(recipeId: string): Dish[] {
	return DISHES.filter((dish) => dish.recipeId === recipeId);
}
