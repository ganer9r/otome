/**
 * 요리사 데이터
 */

export interface Chef {
	id: number;
	name: string;
	emoji: string;
	stage: number;
	theme: string;
	/** 상대 요리 점수 (내 판매가보다 높으면 패배) */
	power: number;
}

export const CHEFS: Chef[] = [
	{
		id: 1,
		name: '동네 아줌마',
		emoji: '🧑‍🍳',
		stage: 1,
		theme: '한식',
		power: 150
	}
];

/** Stage로 요리사 찾기 */
export function getChefByStage(stage: number): Chef | undefined {
	return CHEFS.find((c) => c.stage === stage);
}

/** 현재 도전할 요리사 (클리어한 다음 스테이지) */
export function getCurrentChef(clearedStage: number): Chef | undefined {
	return getChefByStage(clearedStage + 1);
}
