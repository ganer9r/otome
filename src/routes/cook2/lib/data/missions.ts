import type { MissionDefinition } from '../types';

/**
 * 일일 미션 정의
 * 매일 자정에 리셋됨
 */
export const DAILY_MISSIONS: MissionDefinition[] = [
	{
		id: 'daily_cook_3',
		category: 'daily',
		type: 'cook_count',
		title: '요리 3번 하기',
		description: '오늘 요리를 3번 해보세요',
		target: 3,
		reward: 1
	},
	{
		id: 'daily_cook_10',
		category: 'daily',
		type: 'cook_count',
		title: '요리 10번 하기',
		description: '오늘 요리를 10번 해보세요',
		target: 10,
		reward: 3
	},
	{
		id: 'daily_earn_500',
		category: 'daily',
		type: 'earn_money',
		title: '500원 벌기',
		description: '오늘 요리 판매로 500원을 벌어보세요',
		target: 500,
		reward: 2
	},
	{
		id: 'daily_discover_1',
		category: 'daily',
		type: 'discover_recipe',
		title: '새 레시피 발견',
		description: '새로운 레시피를 1개 발견하세요',
		target: 1,
		reward: 2
	}
];

/**
 * 업적 정의
 * 영구적, 1회성
 */
export const ACHIEVEMENTS: MissionDefinition[] = [
	// 요리 횟수 업적
	{
		id: 'achieve_cook_10',
		category: 'achievement',
		type: 'cook_count',
		title: '초보 요리사',
		description: '총 10번 요리하기',
		target: 10,
		reward: 5
	},
	{
		id: 'achieve_cook_50',
		category: 'achievement',
		type: 'cook_count',
		title: '중급 요리사',
		description: '총 50번 요리하기',
		target: 50,
		reward: 10
	},
	{
		id: 'achieve_cook_100',
		category: 'achievement',
		type: 'cook_count',
		title: '고급 요리사',
		description: '총 100번 요리하기',
		target: 100,
		reward: 20
	},
	{
		id: 'achieve_cook_500',
		category: 'achievement',
		type: 'cook_count',
		title: '마스터 셰프',
		description: '총 500번 요리하기',
		target: 500,
		reward: 50
	},

	// 레시피 발견 업적
	{
		id: 'achieve_recipe_10',
		category: 'achievement',
		type: 'discover_recipe',
		title: '레시피 수집가',
		description: '레시피 10개 발견',
		target: 10,
		reward: 5
	},
	{
		id: 'achieve_recipe_30',
		category: 'achievement',
		type: 'discover_recipe',
		title: '레시피 연구가',
		description: '레시피 30개 발견',
		target: 30,
		reward: 15
	},
	{
		id: 'achieve_recipe_50',
		category: 'achievement',
		type: 'discover_recipe',
		title: '레시피 박사',
		description: '레시피 50개 발견',
		target: 50,
		reward: 30
	},

	// 재료 발견 업적
	{
		id: 'achieve_ingredient_10',
		category: 'achievement',
		type: 'discover_ingredient',
		title: '재료 탐험가',
		description: '재료 10개 발견',
		target: 10,
		reward: 5
	},
	{
		id: 'achieve_ingredient_30',
		category: 'achievement',
		type: 'discover_ingredient',
		title: '재료 사냥꾼',
		description: '재료 30개 발견',
		target: 30,
		reward: 15
	},

	// 수익 업적
	{
		id: 'achieve_earn_1000',
		category: 'achievement',
		type: 'earn_money',
		title: '첫 수익',
		description: '총 1,000원 벌기',
		target: 1000,
		reward: 3
	},
	{
		id: 'achieve_earn_10000',
		category: 'achievement',
		type: 'earn_money',
		title: '장사꾼',
		description: '총 10,000원 벌기',
		target: 10000,
		reward: 10
	},
	{
		id: 'achieve_earn_100000',
		category: 'achievement',
		type: 'earn_money',
		title: '부자 셰프',
		description: '총 100,000원 벌기',
		target: 100000,
		reward: 30
	},

	// 등급별 요리 업적
	{
		id: 'achieve_grade_c_5',
		category: 'achievement',
		type: 'cook_grade',
		title: 'C급 요리사',
		description: 'C등급 요리 5개 만들기',
		target: 5,
		reward: 5,
		grade: 'C'
	},
	{
		id: 'achieve_grade_b_5',
		category: 'achievement',
		type: 'cook_grade',
		title: 'B급 요리사',
		description: 'B등급 요리 5개 만들기',
		target: 5,
		reward: 10,
		grade: 'B'
	},
	{
		id: 'achieve_grade_a_3',
		category: 'achievement',
		type: 'cook_grade',
		title: 'A급 요리사',
		description: 'A등급 요리 3개 만들기',
		target: 3,
		reward: 15,
		grade: 'A'
	},
	{
		id: 'achieve_grade_r_1',
		category: 'achievement',
		type: 'cook_grade',
		title: '전설의 요리사',
		description: 'R등급 요리 1개 만들기',
		target: 1,
		reward: 30,
		grade: 'R'
	}
];

/**
 * 모든 미션 정의
 */
export const ALL_MISSIONS: MissionDefinition[] = [...DAILY_MISSIONS, ...ACHIEVEMENTS];

/**
 * 미션 ID로 미션 정의 찾기
 */
export function getMissionById(id: string): MissionDefinition | undefined {
	return ALL_MISSIONS.find((m) => m.id === id);
}
