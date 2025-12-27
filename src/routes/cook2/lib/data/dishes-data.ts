/**
 * 요리 결과 테이블 (Dish Table)
 *
 * 각 재료/요리의 크리티컬/실패 결과 정의
 * - ingredientId: 원본 재료/요리 ID
 * - resultType: 'critical' | 'fail'
 * - name: 결과 이름 (크리티컬: 수식어 + 원래이름, 실패: 유머러스한 이름)
 * - probability: 확률 (%)
 * - priceMultiplier: 가격 배수
 */

import type { IngredientGrade } from '../types';

/**
 * 요리 결과 타입
 */
export type DishResultType = 'critical' | 'fail';

/**
 * 요리 결과 항목
 */
export interface DishEntry {
	ingredientId: number;
	resultType: DishResultType;
	name: string;
	probability: number;
	priceMultiplier: number;
}

/**
 * 등급별 기본 확률 (옵션 A 기준)
 */
export const GRADE_PROBABILITIES: Record<IngredientGrade, { critical: number; fail: number }> = {
	G: { critical: 5, fail: 5 },
	F: { critical: 5, fail: 7 },
	E: { critical: 5, fail: 10 },
	D: { critical: 5, fail: 15 },
	C: { critical: 5, fail: 20 },
	B: { critical: 5, fail: 25 },
	A: { critical: 5, fail: 30 },
	R: { critical: 5, fail: 35 }
};

/**
 * 등급별 크리티컬 가격 배수
 */
export const CRITICAL_MULTIPLIER: Record<IngredientGrade, number> = {
	G: 1.3,
	F: 1.35,
	E: 1.4,
	D: 1.45,
	C: 1.5,
	B: 1.55,
	A: 1.6,
	R: 1.7
};

/**
 * 등급별 실패 가격 배수
 */
export const FAIL_MULTIPLIER: Record<IngredientGrade, number> = {
	G: 0.5,
	F: 0.4,
	E: 0.3,
	D: 0.2,
	C: 0.1,
	B: 0.05,
	A: 0,
	R: 0
};

/**
 * 대성공 수식어 (랜덤 선택용)
 */
export const CRITICAL_PREFIXES = [
	'완벽한',
	'최고의',
	'황금빛',
	'극상의',
	'일품',
	'감동의',
	'환상의',
	'꿈의',
	'기적의',
	'전설의',
	'빛나는',
	'윤기나는',
	'찬란한',
	'장인의',
	'셰프의',
	'달인의',
	'명인의'
];

/**
 * 대성공 설명 (랜덤 선택용)
 */
export const CRITICAL_DESCRIPTIONS = [
	'나여~ 백쉐프~',
	'이야~ 료이키텐카이~',
	'거기요~ 내려와봐유~',
	'어? 내가 이걸 만들었다고?',
	'야~ 내가 이런 요리를?',
	'이게 내 손에서 나왔어?',
	'야~ 이거 진짜 맛있겠다~',
	'이야~ 가게 차려도 되겠어',
	'우와~ 색깔 봐, 색깔~',
	'됐어 됐어~ 이 맛이야~',
	'이거 팔아도 되겠다~',
	'아 이거 제대로야~',
	'어유~ 잘했어 잘했어~',
	'이거 봐봐, 완벽해',
	'이게 되네? 이게 돼~',
	'손님한테 내놔도 되겠어',
	'이 정도면 식당 차려도 돼',
	'이게 집에서 만든 거라고?',
	'미쳤어 이거~',
	'대박이야 대박~',
	'완전 맛집이야~'
];

/**
 * 실패 설명 (랜덤 선택용)
 */
export const FAIL_DESCRIPTIONS = [
	'우리 XX 아니에유',
	'하 미치겠네...',
	'그런 게 있어요? 주세요!',
	'남은 손님들은 신났어유',
	'설탕은 싸악~',
	'어묵을 넣지 말란 법 있어요?',
	'원래 이런 거예요',
	'해외에선 이렇게 먹어요',
	'농가 살리려고 이렇게 한 거예요',
	'요즘 이게 유행이에요',
	'일부러 이렇게 한 거예요',
	'손님 취향 반영했어요',
	'이게 더 맛있어요',
	'숨겨진 레시피예요',
	'레시피가 잘못됐어요',
	'오븐이 이상해요',
	'습도 때문이에요',
	'재료 탓이에요',
	'불이 너무 셌어요',
	'타이밍이 안 맞았어요',
	'디컨스트럭션이에요',
	'분자요리예요',
	'퓨전이에요',
	'뉴트로 스타일이에요',
	'실험적인 요리예요'
];

/**
 * 완전 실패 이름 (레시피 없을 때)
 */
export const TOTAL_FAIL_NAMES = [
	'미확인 물체',
	'검은 덩어리',
	'의문의 물질',
	'알 수 없는 것',
	'수상한 무언가',
	'실패작'
];

/**
 * 완전 실패 설명 (레시피 없을 때)
 */
export const TOTAL_FAIL_DESCRIPTIONS = [
	'이게 뭐야...',
	'어... 이게 아닌데...',
	'뭐가 잘못된 거지?',
	'이건 요리가 아니에유...',
	'실험적인 요리예요',
	'새로운 장르를 개척했어요',
	'예술이에요 예술',
	'이게 요즘 트렌드예요',
	'레시피가 없었어요',
	'재료가 안 맞았어요',
	'원래 이렇게 되는 거예요',
	'다음엔 잘 될 거예요',
	'그게 그러니까...',
	'아니 근데요...',
	'원래 이런 건 아닌데...'
];

/**
 * ========================================
 * 요리 결과 테이블 (DISH_TABLE)
 * ========================================
 *
 * 구조: ingredientId, resultType, name, probability, priceMultiplier
 *
 * 확률/배수는 등급별 기본값 사용 (개별 설정 필요시 여기서 override)
 */
export const DISH_TABLE: DishEntry[] = [
	// ========== G등급 재료 (1-8) ==========
	{
		ingredientId: 1,
		resultType: 'critical',
		name: '완벽한 쌀',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 1,
		resultType: 'fail',
		name: '의문의 곡물',
		probability: 5,
		priceMultiplier: 0.5
	},
	{
		ingredientId: 2,
		resultType: 'critical',
		name: '황금빛 밀',
		probability: 5,
		priceMultiplier: 1.3
	},
	{ ingredientId: 2, resultType: 'fail', name: '가루 뭉치', probability: 5, priceMultiplier: 0.5 },
	{
		ingredientId: 3,
		resultType: 'critical',
		name: '극상의 고기',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 3,
		resultType: 'fail',
		name: '수상한 단백질',
		probability: 5,
		priceMultiplier: 0.5
	},
	{
		ingredientId: 4,
		resultType: 'critical',
		name: '싱싱한 해물',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 4,
		resultType: 'fail',
		name: '비린내 덩어리',
		probability: 5,
		priceMultiplier: 0.5
	},
	{
		ingredientId: 5,
		resultType: 'critical',
		name: '신선한 채소',
		probability: 5,
		priceMultiplier: 1.3
	},
	{ ingredientId: 5, resultType: 'fail', name: '시든 풀', probability: 5, priceMultiplier: 0.5 },
	{
		ingredientId: 6,
		resultType: 'critical',
		name: '달콤한 과일',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 6,
		resultType: 'fail',
		name: '상한 것 같은 과일',
		probability: 5,
		priceMultiplier: 0.5
	},
	{
		ingredientId: 7,
		resultType: 'critical',
		name: '맑은 물',
		probability: 5,
		priceMultiplier: 1.3
	},
	{ ingredientId: 7, resultType: 'fail', name: '그냥 물', probability: 5, priceMultiplier: 0.5 },
	{
		ingredientId: 8,
		resultType: 'critical',
		name: '완벽한 불',
		probability: 5,
		priceMultiplier: 1.3
	},
	{ ingredientId: 8, resultType: 'fail', name: '꺼진 불', probability: 5, priceMultiplier: 0.5 },

	// ========== G등급 요리 (9-23) ==========
	{
		ingredientId: 9,
		resultType: 'critical',
		name: '감동의 해초나물',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 9,
		resultType: 'fail',
		name: '미역 같은 것',
		probability: 5,
		priceMultiplier: 0.5
	},
	{
		ingredientId: 10,
		resultType: 'critical',
		name: '황금빛 구운해물',
		probability: 5,
		priceMultiplier: 1.3
	},
	{ ingredientId: 10, resultType: 'fail', name: '태운 해물', probability: 5, priceMultiplier: 0.5 },
	{
		ingredientId: 11,
		resultType: 'critical',
		name: '신선한 샐러드',
		probability: 5,
		priceMultiplier: 1.3
	},
	{ ingredientId: 11, resultType: 'fail', name: '풀떼기', probability: 20, priceMultiplier: 0.5 },
	{
		ingredientId: 12,
		resultType: 'critical',
		name: '완벽한 칼솟',
		probability: 5,
		priceMultiplier: 1.3
	},
	{ ingredientId: 12, resultType: 'fail', name: '매운 물', probability: 5, priceMultiplier: 0.5 },
	{
		ingredientId: 13,
		resultType: 'critical',
		name: '달콤한 과일청',
		probability: 5,
		priceMultiplier: 1.3
	},
	{ ingredientId: 13, resultType: 'fail', name: '설탕물', probability: 20, priceMultiplier: 0.5 },
	{
		ingredientId: 14,
		resultType: 'critical',
		name: '상큼한 주스',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 14,
		resultType: 'fail',
		name: '색깔 있는 물',
		probability: 5,
		priceMultiplier: 0.5
	},
	{
		ingredientId: 15,
		resultType: 'critical',
		name: '바삭한 누룽지',
		probability: 5,
		priceMultiplier: 1.3
	},
	{ ingredientId: 15, resultType: 'fail', name: '탄 쌀', probability: 5, priceMultiplier: 0.5 },
	{
		ingredientId: 16,
		resultType: 'critical',
		name: '건강한 나물밥',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 16,
		resultType: 'fail',
		name: '풀 섞인 밥',
		probability: 5,
		priceMultiplier: 0.5
	},
	{
		ingredientId: 17,
		resultType: 'critical',
		name: '쫄깃한 어묵',
		probability: 5,
		priceMultiplier: 1.3
	},
	{ ingredientId: 17, resultType: 'fail', name: '생선 반죽', probability: 5, priceMultiplier: 0.5 },
	{
		ingredientId: 18,
		resultType: 'critical',
		name: '시원한 조개탕',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 18,
		resultType: 'fail',
		name: '조개 우린 물',
		probability: 5,
		priceMultiplier: 0.5
	},
	{
		ingredientId: 19,
		resultType: 'critical',
		name: '바삭한 크래커',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 19,
		resultType: 'fail',
		name: '딱딱한 과자',
		probability: 20,
		priceMultiplier: 0.5
	},
	{
		ingredientId: 20,
		resultType: 'critical',
		name: '쫀득한 또띠아',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 20,
		resultType: 'fail',
		name: '밀가루 전병',
		probability: 5,
		priceMultiplier: 0.5
	},
	{
		ingredientId: 21,
		resultType: 'critical',
		name: '육즙 가득 소시지',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 21,
		resultType: 'fail',
		name: '분홍 덩어리',
		probability: 5,
		priceMultiplier: 0.5
	},
	{
		ingredientId: 22,
		resultType: 'critical',
		name: '탱글탱글 묵',
		probability: 5,
		priceMultiplier: 1.3
	},
	{ ingredientId: 22, resultType: 'fail', name: '회색 젤리', probability: 5, priceMultiplier: 0.5 },
	{
		ingredientId: 23,
		resultType: 'critical',
		name: '따뜻한 온수',
		probability: 5,
		priceMultiplier: 1.3
	},
	{
		ingredientId: 23,
		resultType: 'fail',
		name: '미지근한 물',
		probability: 5,
		priceMultiplier: 0.5
	},

	// ========== F등급 재료 (101-123) ==========
	{
		ingredientId: 101,
		resultType: 'critical',
		name: '윤기나는 밥',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 101, resultType: 'fail', name: '덜 된 밥', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 102,
		resultType: 'critical',
		name: '쫀득한 반죽',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 102,
		resultType: 'fail',
		name: '밀가루 덩어리',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 103,
		resultType: 'critical',
		name: '갓 구운 빵',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 103,
		resultType: 'fail',
		name: '딱딱한 빵',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 104,
		resultType: 'critical',
		name: '신선한 다짐육',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 104,
		resultType: 'fail',
		name: '으깬 고기',
		probability: 22,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 105,
		resultType: 'critical',
		name: '풍미 가득 양념육',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 105, resultType: 'fail', name: '짠 고기', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 106,
		resultType: 'critical',
		name: '감칠맛 양념장',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 106, resultType: 'fail', name: '짠 물', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 107,
		resultType: 'critical',
		name: '진한 육수',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 107, resultType: 'fail', name: '고기 물', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 108,
		resultType: 'critical',
		name: '싱싱한 횟감',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 108, resultType: 'fail', name: '날생선', probability: 22, priceMultiplier: 0.4 },
	{
		ingredientId: 109,
		resultType: 'critical',
		name: '아삭한 절임',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 109, resultType: 'fail', name: '짠 채소', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 111,
		resultType: 'critical',
		name: '달콤한 잼',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 111,
		resultType: 'fail',
		name: '끈적한 것',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 112,
		resultType: 'critical',
		name: '투명한 얼음',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 112,
		resultType: 'fail',
		name: '녹은 얼음',
		probability: 22,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 123,
		resultType: 'critical',
		name: '쫄깃한 떡',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 123,
		resultType: 'fail',
		name: '찐 쌀 뭉치',
		probability: 22,
		priceMultiplier: 0.4
	},

	// ========== F등급 요리 (124-172) ==========
	{
		ingredientId: 124,
		resultType: 'critical',
		name: '정성 가득 주먹밥',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 124, resultType: 'fail', name: '뭉친 밥', probability: 22, priceMultiplier: 0.4 },
	{
		ingredientId: 125,
		resultType: 'critical',
		name: '뜨끈한 국밥',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 125,
		resultType: 'fail',
		name: '밥 말은 국',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 126,
		resultType: 'critical',
		name: '화려한 비빔밥',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 126, resultType: 'fail', name: '섞은 밥', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 127,
		resultType: 'critical',
		name: '폭신한 오므라이스',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 127,
		resultType: 'fail',
		name: '계란 범벅 밥',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 128,
		resultType: 'critical',
		name: '달콤한 유부초밥',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 128,
		resultType: 'fail',
		name: '유부에 밥',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 129,
		resultType: 'critical',
		name: '명절 떡국',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 129,
		resultType: 'fail',
		name: '떡 넣은 국',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 130,
		resultType: 'critical',
		name: '쫄깃한 칼국수',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 130,
		resultType: 'fail',
		name: '밀가루 국수',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 131,
		resultType: 'critical',
		name: '국물이 끝내주는 라면',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 131,
		resultType: 'fail',
		name: '불은 라면',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 132,
		resultType: 'critical',
		name: '바삭한 파이',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 132,
		resultType: 'fail',
		name: '납작한 빵',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 133,
		resultType: 'critical',
		name: '시원한 냉면',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 133, resultType: 'fail', name: '찬 국수', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 134,
		resultType: 'critical',
		name: '겉바속촉 호떡',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 134,
		resultType: 'fail',
		name: '기름진 떡',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 135,
		resultType: 'critical',
		name: '육즙 터지는 햄버거',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 135,
		resultType: 'fail',
		name: '빵 사이 고기',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 136,
		resultType: 'critical',
		name: '노릇한 토스트',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 136, resultType: 'fail', name: '구운 빵', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 137,
		resultType: 'critical',
		name: '알찬 샌드위치',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 137,
		resultType: 'fail',
		name: '빵 사이 뭔가',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 138,
		resultType: 'critical',
		name: '바삭한 쿠키',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 138,
		resultType: 'fail',
		name: '딱딱한 쿠키',
		probability: 22,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 139,
		resultType: 'critical',
		name: '촉촉한 프렌치토스트',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 139,
		resultType: 'fail',
		name: '눅눅한 빵',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 140,
		resultType: 'critical',
		name: '우아한 카나페',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 140,
		resultType: 'fail',
		name: '빵 위에 뭔가',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 141,
		resultType: 'critical',
		name: '탱글탱글 완자탕',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 141,
		resultType: 'fail',
		name: '고기 경단 국',
		probability: 22,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 142,
		resultType: 'critical',
		name: '달콤짭짤 불고기',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 142,
		resultType: 'fail',
		name: '볶은 고기',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 143,
		resultType: 'critical',
		name: '윤기나는 장조림',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 143,
		resultType: 'fail',
		name: '짭짤한 고기',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 144,
		resultType: 'critical',
		name: '탱글한 미트볼',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 144,
		resultType: 'fail',
		name: '둥근 고기',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 145,
		resultType: 'critical',
		name: '육즙 가득 떡갈비',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 145,
		resultType: 'fail',
		name: '납작한 고기',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 146,
		resultType: 'critical',
		name: '시원한 냉채',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 146,
		resultType: 'fail',
		name: '찬 고기 채',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 147,
		resultType: 'critical',
		name: '신선한 육회',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 147, resultType: 'fail', name: '날 고기', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 148,
		resultType: 'critical',
		name: '매콤한 제육볶음',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 148,
		resultType: 'fail',
		name: '매운 고기',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 149,
		resultType: 'critical',
		name: '부드러운 보쌈',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 149,
		resultType: 'fail',
		name: '삶은 고기',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 150,
		resultType: 'critical',
		name: '바삭한 닭강정',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 150, resultType: 'fail', name: '단 닭', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 151,
		resultType: 'critical',
		name: '달콤한 떡꼬치',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 151, resultType: 'fail', name: '떡 꼬치', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 152,
		resultType: 'critical',
		name: '쫀득한 절편',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 152, resultType: 'fail', name: '납작 떡', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 153,
		resultType: 'critical',
		name: '바삭한 빈대떡',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 153,
		resultType: 'fail',
		name: '기름진 전',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 154,
		resultType: 'critical',
		name: '새콤한 회무침',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 154,
		resultType: 'fail',
		name: '생선 무침',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 155,
		resultType: 'critical',
		name: '매콤달콤 떡볶이',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 155, resultType: 'fail', name: '매운 떡', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 156,
		resultType: 'critical',
		name: '윤기나는 데리야끼',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 156,
		resultType: 'fail',
		name: '단짠 고기',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 157,
		resultType: 'critical',
		name: '달콤한 식혜',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 157, resultType: 'fail', name: '단 물', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 158,
		resultType: 'critical',
		name: '구수한 된장국',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 158, resultType: 'fail', name: '된장 물', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 159,
		resultType: 'critical',
		name: '달콤한 단팥죽',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 159, resultType: 'fail', name: '단 팥죽', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 160,
		resultType: 'critical',
		name: '시원한 냉국',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 160, resultType: 'fail', name: '찬 국', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 161,
		resultType: 'critical',
		name: '감칠맛 젓갈',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 161,
		resultType: 'fail',
		name: '삭힌 생선',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 162,
		resultType: 'critical',
		name: '투명한 빙어회',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 162,
		resultType: 'fail',
		name: '얼린 생선',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 163,
		resultType: 'critical',
		name: '뜨끈한 어묵탕',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 163, resultType: 'fail', name: '어묵 국', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 164,
		resultType: 'critical',
		name: '아삭한 피클',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 164, resultType: 'fail', name: '신 채소', probability: 22, priceMultiplier: 0.4 },
	{
		ingredientId: 165,
		resultType: 'critical',
		name: '달콤한 과일절임',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 165, resultType: 'fail', name: '신 과일', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 166,
		resultType: 'critical',
		name: '시원한 동치미',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 166,
		resultType: 'fail',
		name: '찬 김치 국물',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 167,
		resultType: 'critical',
		name: '부드러운 푸딩',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 167,
		resultType: 'fail',
		name: '흐물한 것',
		probability: 22,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 168,
		resultType: 'critical',
		name: '바삭한 약과',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 168,
		resultType: 'fail',
		name: '기름에 튀긴 것',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 169,
		resultType: 'critical',
		name: '달콤한 약밥',
		probability: 5,
		priceMultiplier: 1.35
	},
	{ ingredientId: 169, resultType: 'fail', name: '단 밥', probability: 7, priceMultiplier: 0.4 },
	{
		ingredientId: 170,
		resultType: 'critical',
		name: '시원한 팥빙수',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 170,
		resultType: 'fail',
		name: '얼음에 팥',
		probability: 22,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 171,
		resultType: 'critical',
		name: '쫀득한 떡빙수',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 171,
		resultType: 'fail',
		name: '얼음에 떡',
		probability: 7,
		priceMultiplier: 0.4
	},
	{
		ingredientId: 172,
		resultType: 'critical',
		name: '폭신한 도넛',
		probability: 5,
		priceMultiplier: 1.35
	},
	{
		ingredientId: 172,
		resultType: 'fail',
		name: '기름진 빵',
		probability: 7,
		priceMultiplier: 0.4
	},

	// ========== E등급 재료 (201-214) ==========
	{
		ingredientId: 201,
		resultType: 'critical',
		name: '쫄깃한 면',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 201,
		resultType: 'fail',
		name: '늘어난 면',
		probability: 25,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 202,
		resultType: 'critical',
		name: '바삭한 튀김',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 202,
		resultType: 'fail',
		name: '기름 덩어리',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 203,
		resultType: 'critical',
		name: '완벽한 구이',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 203, resultType: 'fail', name: '탄 고기', probability: 25, priceMultiplier: 0.3 },
	{
		ingredientId: 204,
		resultType: 'critical',
		name: '진한 수프',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 204,
		resultType: 'fail',
		name: '뜨거운 물',
		probability: 25,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 205,
		resultType: 'critical',
		name: '싱싱한 회',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 205,
		resultType: 'fail',
		name: '차가운 생선',
		probability: 25,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 206,
		resultType: 'critical',
		name: '쫀득한 가래떡',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 206, resultType: 'fail', name: '긴 떡', probability: 25, priceMultiplier: 0.3 },
	{
		ingredientId: 207,
		resultType: 'critical',
		name: '부드러운 찜',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 207,
		resultType: 'fail',
		name: '뜨거운 고기',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 208,
		resultType: 'critical',
		name: '아삭한 김치',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 208, resultType: 'fail', name: '신 채소', probability: 10, priceMultiplier: 0.3 },
	{
		ingredientId: 209,
		resultType: 'critical',
		name: '꽉 찬 만두',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 209,
		resultType: 'fail',
		name: '피 없는 만두',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 210,
		resultType: 'critical',
		name: '걸쭉한 찌개',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 210, resultType: 'fail', name: '매운 국', probability: 10, priceMultiplier: 0.3 },
	{
		ingredientId: 211,
		resultType: 'critical',
		name: '탱글한 초밥',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 211,
		resultType: 'fail',
		name: '밥 위 생선',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 212,
		resultType: 'critical',
		name: '폭신한 케이크',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 212,
		resultType: 'fail',
		name: '폭삭한 빵',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 213,
		resultType: 'critical',
		name: '상큼한 과일아이스크림',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 213,
		resultType: 'fail',
		name: '녹은 아이스크림',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 214,
		resultType: 'critical',
		name: '살이 꽉 찬 게살',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 214, resultType: 'fail', name: '게 속살', probability: 10, priceMultiplier: 0.3 },

	// ========== E등급 요리 (215-248) ==========
	{
		ingredientId: 215,
		resultType: 'critical',
		name: '쫄깃한 우동',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 215,
		resultType: 'fail',
		name: '불은 우동',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 216,
		resultType: 'critical',
		name: '불맛 나는 볶음면',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 216,
		resultType: 'fail',
		name: '기름진 면',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 217,
		resultType: 'critical',
		name: '시원한 잔치국수',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 217,
		resultType: 'fail',
		name: '잔치 국수',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 218,
		resultType: 'critical',
		name: '매콤한 비빔국수',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 218,
		resultType: 'fail',
		name: '비빈 국수',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 219,
		resultType: 'critical',
		name: '바삭한 새우튀김',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 219,
		resultType: 'fail',
		name: '튀긴 새우',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 220,
		resultType: 'critical',
		name: '바삭한 텐동',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 220,
		resultType: 'fail',
		name: '튀김 덮밥',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 221,
		resultType: 'critical',
		name: '육즙 가득 꼬치구이',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 221, resultType: 'fail', name: '탄 꼬치', probability: 10, priceMultiplier: 0.3 },
	{
		ingredientId: 222,
		resultType: 'critical',
		name: '불맛 나는 철판구이',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 222,
		resultType: 'fail',
		name: '철판 탄 것',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 223,
		resultType: 'critical',
		name: '폭신한 핫케이크',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 223,
		resultType: 'fail',
		name: '납작 케이크',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 224,
		resultType: 'critical',
		name: '진한 해물수프',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 224, resultType: 'fail', name: '해물 물', probability: 10, priceMultiplier: 0.3 },
	{
		ingredientId: 225,
		resultType: 'critical',
		name: '시원한 물회',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 225, resultType: 'fail', name: '생선 물', probability: 10, priceMultiplier: 0.3 },
	{
		ingredientId: 226,
		resultType: 'critical',
		name: '신선한 회덮밥',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 226, resultType: 'fail', name: '생선 밥', probability: 10, priceMultiplier: 0.3 },
	{
		ingredientId: 227,
		resultType: 'critical',
		name: '부드러운 떡찜',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 227, resultType: 'fail', name: '찐 떡', probability: 10, priceMultiplier: 0.3 },
	{
		ingredientId: 228,
		resultType: 'critical',
		name: '맛있는 두부김치',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 228,
		resultType: 'fail',
		name: '두부와 김치',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 229,
		resultType: 'critical',
		name: '든든한 떡만두국',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 229,
		resultType: 'fail',
		name: '떡 만두 국',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 230,
		resultType: 'critical',
		name: '고급진 궁중떡볶이',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 230,
		resultType: 'fail',
		name: '안 매운 떡볶이',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 231,
		resultType: 'critical',
		name: '김이 모락모락 만두찜',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 231, resultType: 'fail', name: '찐 만두', probability: 10, priceMultiplier: 0.3 },
	{
		ingredientId: 232,
		resultType: 'critical',
		name: '쫄깃한 코다리찜',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 232,
		resultType: 'fail',
		name: '코다리 조림',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 233,
		resultType: 'critical',
		name: '매콤한 김치만두',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 233,
		resultType: 'fail',
		name: '김치 만두',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 234,
		resultType: 'critical',
		name: '바삭한 김치전',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 234,
		resultType: 'fail',
		name: '김치 부침',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 235,
		resultType: 'critical',
		name: '쫄깃한 김치수제비',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 235,
		resultType: 'fail',
		name: '김치 수제비',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 236,
		resultType: 'critical',
		name: '상큼한 과일스무디',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 236,
		resultType: 'fail',
		name: '과일 음료',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 237,
		resultType: 'critical',
		name: '얼큰한 김치찌개',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 237, resultType: 'fail', name: '김치 국', probability: 10, priceMultiplier: 0.3 },
	{
		ingredientId: 238,
		resultType: 'critical',
		name: '얼큰한 동태찌개',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 238,
		resultType: 'fail',
		name: '생선 찌개',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 239,
		resultType: 'critical',
		name: '고소한 게살볶음밥',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 239,
		resultType: 'fail',
		name: '게 볶음밥',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 240,
		resultType: 'critical',
		name: '바삭한 튀김아이스크림',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 240,
		resultType: 'fail',
		name: '녹은 튀김',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 241,
		resultType: 'critical',
		name: '바삭한 튀김우동',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 241,
		resultType: 'fail',
		name: '튀김 우동',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 242,
		resultType: 'critical',
		name: '부드러운 생크림케이크',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 242,
		resultType: 'fail',
		name: '크림 범벅',
		probability: 25,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 243,
		resultType: 'critical',
		name: '부드러운 젤라또',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 243,
		resultType: 'fail',
		name: '이탈리안 아이스',
		probability: 25,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 244,
		resultType: 'critical',
		name: '불맛 나는 김치볶음밥',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 244, resultType: 'fail', name: '김치 밥', probability: 10, priceMultiplier: 0.3 },
	{
		ingredientId: 245,
		resultType: 'critical',
		name: '얇고 바삭한 크레페',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 245,
		resultType: 'fail',
		name: '얇은 케이크',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 246,
		resultType: 'critical',
		name: '쫀득한 아이스크림떡',
		probability: 5,
		priceMultiplier: 1.4
	},
	{
		ingredientId: 246,
		resultType: 'fail',
		name: '아이스 떡',
		probability: 10,
		priceMultiplier: 0.3
	},
	{
		ingredientId: 247,
		resultType: 'critical',
		name: '노릇한 가래떡구이',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 247, resultType: 'fail', name: '구운 떡', probability: 25, priceMultiplier: 0.3 },
	{
		ingredientId: 248,
		resultType: 'critical',
		name: '든든한 완탕면',
		probability: 5,
		priceMultiplier: 1.4
	},
	{ ingredientId: 248, resultType: 'fail', name: '완탕 면', probability: 10, priceMultiplier: 0.3 },

	// ========== D등급 재료 (301-313) ==========
	{
		ingredientId: 301,
		resultType: 'critical',
		name: '완벽한 스테이크',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 301,
		resultType: 'fail',
		name: '질긴 스테이크',
		probability: 30,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 302,
		resultType: 'critical',
		name: '겉바속촉 삼겹살구이',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 302,
		resultType: 'fail',
		name: '기름진 삼겹살',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 303,
		resultType: 'critical',
		name: '알찬 후토마키',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 303,
		resultType: 'fail',
		name: '김밥 같은 것',
		probability: 30,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 304,
		resultType: 'critical',
		name: '바삭한 돈카츠',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 304,
		resultType: 'fail',
		name: '눅눅한 돈카츠',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 305,
		resultType: 'critical',
		name: '신선한 모듬초밥',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 305,
		resultType: 'fail',
		name: '밥 위 생선들',
		probability: 30,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 306,
		resultType: 'critical',
		name: '푸짐한 해물찜',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 306,
		resultType: 'fail',
		name: '해물 범벅',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 307,
		resultType: 'critical',
		name: '얼큰한 꽃게탕',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 307, resultType: 'fail', name: '게 국', probability: 15, priceMultiplier: 0.2 },
	{
		ingredientId: 308,
		resultType: 'critical',
		name: '향긋한 알리오올리오',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 308,
		resultType: 'fail',
		name: '기름 파스타',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 309,
		resultType: 'critical',
		name: '푸짐한 전골',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 309,
		resultType: 'fail',
		name: '이것저것 국',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 310,
		resultType: 'critical',
		name: '바삭한 모듬전',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 310, resultType: 'fail', name: '여러 전', probability: 15, priceMultiplier: 0.2 },
	{
		ingredientId: 311,
		resultType: 'critical',
		name: '화려한 과일케이크',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 311, resultType: 'fail', name: '과일 빵', probability: 15, priceMultiplier: 0.2 },
	{
		ingredientId: 312,
		resultType: 'critical',
		name: '부드러운 크림',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 312,
		resultType: 'fail',
		name: '하얀 덩어리',
		probability: 30,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 313,
		resultType: 'critical',
		name: '진한 라멘',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 313,
		resultType: 'fail',
		name: '일본 라면',
		probability: 15,
		priceMultiplier: 0.2
	},

	// ========== D등급 요리 (314-340) ==========
	{
		ingredientId: 314,
		resultType: 'critical',
		name: '육즙 가득 챠슈동',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 314,
		resultType: 'fail',
		name: '고기 덮밥',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 315,
		resultType: 'critical',
		name: '바삭한 돈카츠카레',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 315,
		resultType: 'fail',
		name: '카레 돈카츠',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 316,
		resultType: 'critical',
		name: '달콤짭짤 규동',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 316,
		resultType: 'fail',
		name: '소고기 덮밥',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 317,
		resultType: 'critical',
		name: '진한 차슈멘',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 317,
		resultType: 'fail',
		name: '고기 라멘',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 318,
		resultType: 'critical',
		name: '바삭한 치킨카츠',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 318,
		resultType: 'fail',
		name: '치킨 튀김',
		probability: 30,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 319,
		resultType: 'critical',
		name: '쫄깃한 문어숙회',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 319,
		resultType: 'fail',
		name: '삶은 문어',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 320,
		resultType: 'critical',
		name: '탱글한 조개찜',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 320,
		resultType: 'fail',
		name: '조개 범벅',
		probability: 30,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 321,
		resultType: 'critical',
		name: '얼큰한 매운탕',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 321,
		resultType: 'fail',
		name: '매운 생선국',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 322,
		resultType: 'critical',
		name: '푸짐한 낙지전골',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 322, resultType: 'fail', name: '낙지 국', probability: 15, priceMultiplier: 0.2 },
	{
		ingredientId: 323,
		resultType: 'critical',
		name: '부드러운 크림새우',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 323,
		resultType: 'fail',
		name: '크림 새우',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 324,
		resultType: 'critical',
		name: '알이 꽉 찬 꽃게찜',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 324, resultType: 'fail', name: '찐 게', probability: 30, priceMultiplier: 0.2 },
	{
		ingredientId: 325,
		resultType: 'critical',
		name: '얼큰한 짬뽕',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 325,
		resultType: 'fail',
		name: '매운 해물면',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 326,
		resultType: 'critical',
		name: '바삭한 돈가스정식',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 326,
		resultType: 'fail',
		name: '돈카츠 세트',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 327,
		resultType: 'critical',
		name: '뜨끈한 우동전골',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 327, resultType: 'fail', name: '우동 국', probability: 15, priceMultiplier: 0.2 },
	{
		ingredientId: 328,
		resultType: 'critical',
		name: '든든한 라멘교자',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 328,
		resultType: 'fail',
		name: '라멘과 만두',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 329,
		resultType: 'critical',
		name: '고소한 삼겹파스타',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 329, resultType: 'fail', name: '삼겹 면', probability: 15, priceMultiplier: 0.2 },
	{
		ingredientId: 330,
		resultType: 'critical',
		name: '진한 카르보나라',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 330, resultType: 'fail', name: '크림 면', probability: 15, priceMultiplier: 0.2 },
	{
		ingredientId: 331,
		resultType: 'critical',
		name: '탱글한 봉골레',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 331, resultType: 'fail', name: '조개 면', probability: 30, priceMultiplier: 0.2 },
	{
		ingredientId: 332,
		resultType: 'critical',
		name: '든든한 부대찌개',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 332, resultType: 'fail', name: '부대 국', probability: 30, priceMultiplier: 0.2 },
	{
		ingredientId: 333,
		resultType: 'critical',
		name: '바삭한 해물전',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 333,
		resultType: 'fail',
		name: '해물 부침',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 334,
		resultType: 'critical',
		name: '바삭한 파전',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 334, resultType: 'fail', name: '파 부침', probability: 30, priceMultiplier: 0.2 },
	{
		ingredientId: 335,
		resultType: 'critical',
		name: '부드러운 김치찜',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 335, resultType: 'fail', name: '김치 찜', probability: 15, priceMultiplier: 0.2 },
	{
		ingredientId: 336,
		resultType: 'critical',
		name: '걸쭉한 울면',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 336,
		resultType: 'fail',
		name: '걸쭉한 면',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 337,
		resultType: 'critical',
		name: '바삭한 유린기',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 337,
		resultType: 'fail',
		name: '바삭한 닭',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 338,
		resultType: 'critical',
		name: '바삭한 츄러스',
		probability: 5,
		priceMultiplier: 1.45
	},
	{ ingredientId: 338, resultType: 'fail', name: '긴 튀김', probability: 15, priceMultiplier: 0.2 },
	{
		ingredientId: 339,
		resultType: 'critical',
		name: '부드러운 티라미수',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 339,
		resultType: 'fail',
		name: '커피 케이크',
		probability: 15,
		priceMultiplier: 0.2
	},
	{
		ingredientId: 340,
		resultType: 'critical',
		name: '바삭한 해물파전',
		probability: 5,
		priceMultiplier: 1.45
	},
	{
		ingredientId: 340,
		resultType: 'fail',
		name: '해물 파전',
		probability: 15,
		priceMultiplier: 0.2
	},

	// ========== C등급 재료 (401-412) ==========
	{
		ingredientId: 401,
		resultType: 'critical',
		name: '부드러운 갈비찜',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 401,
		resultType: 'fail',
		name: '질긴 갈비',
		probability: 35,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 402,
		resultType: 'critical',
		name: '싱싱한 모듬회',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 402,
		resultType: 'fail',
		name: '생선 모음',
		probability: 35,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 403,
		resultType: 'critical',
		name: '푸짐한 해물탕',
		probability: 5,
		priceMultiplier: 1.5
	},
	{ ingredientId: 403, resultType: 'fail', name: '해물 국', probability: 20, priceMultiplier: 0.1 },
	{
		ingredientId: 404,
		resultType: 'critical',
		name: '탱글한 전복찜',
		probability: 5,
		priceMultiplier: 1.5
	},
	{ ingredientId: 404, resultType: 'fail', name: '전복 찜', probability: 20, priceMultiplier: 0.1 },
	{
		ingredientId: 405,
		resultType: 'critical',
		name: '진한 게살수프',
		probability: 5,
		priceMultiplier: 1.5
	},
	{ ingredientId: 405, resultType: 'fail', name: '게 수프', probability: 20, priceMultiplier: 0.1 },
	{
		ingredientId: 406,
		resultType: 'critical',
		name: '부드러운 크림파스타',
		probability: 5,
		priceMultiplier: 1.5
	},
	{ ingredientId: 406, resultType: 'fail', name: '크림 면', probability: 20, priceMultiplier: 0.1 },
	{
		ingredientId: 407,
		resultType: 'critical',
		name: '화려한 전주비빔밥',
		probability: 5,
		priceMultiplier: 1.5
	},
	{ ingredientId: 407, resultType: 'fail', name: '전주 밥', probability: 20, priceMultiplier: 0.1 },
	{
		ingredientId: 408,
		resultType: 'critical',
		name: '신선한 초밥세트',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 408,
		resultType: 'fail',
		name: '초밥 세트',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 409,
		resultType: 'critical',
		name: '육즙 가득 오리로스',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 409,
		resultType: 'fail',
		name: '구운 오리',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 410,
		resultType: 'critical',
		name: '바삭한 탕수육',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 410,
		resultType: 'fail',
		name: '튀긴 고기',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 411,
		resultType: 'critical',
		name: '달콤한 과일타르트',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 411,
		resultType: 'fail',
		name: '과일 타르트',
		probability: 35,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 412,
		resultType: 'critical',
		name: '달콤한 크림브륄레',
		probability: 5,
		priceMultiplier: 1.5
	},
	{ ingredientId: 412, resultType: 'fail', name: '탄 크림', probability: 35, priceMultiplier: 0.1 },

	// ========== C등급 요리 (413-432) ==========
	{
		ingredientId: 413,
		resultType: 'critical',
		name: '완벽한 갈비크림파스타',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 413,
		resultType: 'fail',
		name: '갈비 크림면',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 414,
		resultType: 'critical',
		name: '우아한 카나르오랑주',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 414,
		resultType: 'fail',
		name: '오리와 오렌지',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 415,
		resultType: 'critical',
		name: '향긋한 오리훈제',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 415,
		resultType: 'fail',
		name: '훈제 오리',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 416,
		resultType: 'critical',
		name: '깊은 맛 비프스튜',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 416,
		resultType: 'fail',
		name: '소고기 스튜',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 417,
		resultType: 'critical',
		name: '고소한 전복버터구이',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 417,
		resultType: 'fail',
		name: '버터 전복',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 418,
		resultType: 'critical',
		name: '신선한 전복초밥',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 418,
		resultType: 'fail',
		name: '전복 초밥',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 419,
		resultType: 'critical',
		name: '고급진 전복크림파스타',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 419,
		resultType: 'fail',
		name: '전복 크림면',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 420,
		resultType: 'critical',
		name: '진한 게살크림리조또',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 420,
		resultType: 'fail',
		name: '게살 리조또',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 421,
		resultType: 'critical',
		name: '싱싱한 도미회',
		probability: 5,
		priceMultiplier: 1.5
	},
	{ ingredientId: 421, resultType: 'fail', name: '도미 회', probability: 20, priceMultiplier: 0.1 },
	{
		ingredientId: 422,
		resultType: 'critical',
		name: '향긋한 해물솥밥',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 422,
		resultType: 'fail',
		name: '해물 솥밥',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 423,
		resultType: 'critical',
		name: '신선한 회샤브샤브',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 423,
		resultType: 'fail',
		name: '회 샤브샤브',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 424,
		resultType: 'critical',
		name: '진한 해물그라탕',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 424,
		resultType: 'fail',
		name: '해물 그라탕',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 425,
		resultType: 'critical',
		name: '고소한 전복죽',
		probability: 5,
		priceMultiplier: 1.5
	},
	{ ingredientId: 425, resultType: 'fail', name: '전복 죽', probability: 20, priceMultiplier: 0.1 },
	{
		ingredientId: 426,
		resultType: 'critical',
		name: '진한 갈비탕',
		probability: 5,
		priceMultiplier: 1.5
	},
	{ ingredientId: 426, resultType: 'fail', name: '갈비 국', probability: 20, priceMultiplier: 0.1 },
	{
		ingredientId: 427,
		resultType: 'critical',
		name: '푸짐한 한정식',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 427,
		resultType: 'fail',
		name: '한식 세트',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 428,
		resultType: 'critical',
		name: '매콤한 깐쇼새우',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 428,
		resultType: 'fail',
		name: '매운 새우',
		probability: 20,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 429,
		resultType: 'critical',
		name: '화려한 팔보채',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 429,
		resultType: 'fail',
		name: '해물 볶음',
		probability: 35,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 430,
		resultType: 'critical',
		name: '달콤한 타르트타탱',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 430,
		resultType: 'fail',
		name: '사과 타르트',
		probability: 35,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 431,
		resultType: 'critical',
		name: '부드러운 무스케이크',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 431,
		resultType: 'fail',
		name: '무스 케이크',
		probability: 35,
		priceMultiplier: 0.1
	},
	{
		ingredientId: 432,
		resultType: 'critical',
		name: '부드러운 밀크레페',
		probability: 5,
		priceMultiplier: 1.5
	},
	{
		ingredientId: 432,
		resultType: 'fail',
		name: '층층 크레페',
		probability: 20,
		priceMultiplier: 0.1
	},

	// ========== B등급 재료 (501-511) ==========
	{
		ingredientId: 501,
		resultType: 'critical',
		name: '완벽한 채끝스테이크',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 501,
		resultType: 'fail',
		name: '채끝 고기',
		probability: 40,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 502,
		resultType: 'critical',
		name: '최고급 참치회',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 502,
		resultType: 'fail',
		name: '참치 회',
		probability: 40,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 503,
		resultType: 'critical',
		name: '호화로운 크랩앤랍스터',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 503,
		resultType: 'fail',
		name: '게와 랍스터',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 504,
		resultType: 'critical',
		name: '향긋한 트러플리조또',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 504,
		resultType: 'fail',
		name: '트러플 밥',
		probability: 40,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 505,
		resultType: 'critical',
		name: '바삭한 오리콩피',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 505,
		resultType: 'fail',
		name: '오리 다리',
		probability: 40,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 506,
		resultType: 'critical',
		name: '바삭한 슈바인학센',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 506,
		resultType: 'fail',
		name: '독일 족발',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 507,
		resultType: 'critical',
		name: '화려한 스시모듬',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 507,
		resultType: 'fail',
		name: '스시 모음',
		probability: 40,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 508,
		resultType: 'critical',
		name: '우아한 프렌치정식',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 508,
		resultType: 'fail',
		name: '프랑스 세트',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 509,
		resultType: 'critical',
		name: '고급진 궁중떡갈비',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 509,
		resultType: 'fail',
		name: '궁중 떡갈비',
		probability: 40,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 510,
		resultType: 'critical',
		name: '부드러운 전복스테이크',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 510,
		resultType: 'fail',
		name: '전복 스테이크',
		probability: 40,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 511,
		resultType: 'critical',
		name: '진한 가토쇼콜라',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 511,
		resultType: 'fail',
		name: '초코 케이크',
		probability: 25,
		priceMultiplier: 0.05
	},

	// ========== B등급 요리 (512-529) ==========
	{
		ingredientId: 512,
		resultType: 'critical',
		name: '신선한 스테이크타르타르',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 512,
		resultType: 'fail',
		name: '생고기 요리',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 513,
		resultType: 'critical',
		name: '완벽한 로스트비프',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 513,
		resultType: 'fail',
		name: '구운 소고기',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 514,
		resultType: 'critical',
		name: '호화로운 트러플스테이크',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 514,
		resultType: 'fail',
		name: '트러플 고기',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 515,
		resultType: 'critical',
		name: '신선한 참치카르파초',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 515,
		resultType: 'fail',
		name: '참치 샐러드',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 516,
		resultType: 'critical',
		name: '정통 카이세키',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 516,
		resultType: 'fail',
		name: '일본 코스',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 517,
		resultType: 'critical',
		name: '진한 랍스터비스크',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 517,
		resultType: 'fail',
		name: '랍스터 수프',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 518,
		resultType: 'critical',
		name: '완벽한 오리가슴살구이',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 518,
		resultType: 'fail',
		name: '오리 가슴살',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 519,
		resultType: 'critical',
		name: '달콤한 오리불고기',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 519,
		resultType: 'fail',
		name: '오리 불고기',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 520,
		resultType: 'critical',
		name: '푸짐한 아이스바인',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 520,
		resultType: 'fail',
		name: '독일 족발',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 521,
		resultType: 'critical',
		name: '바삭한 슈바인브라텐',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 521,
		resultType: 'fail',
		name: '독일 돼지',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 522,
		resultType: 'critical',
		name: '화려한 카이센동',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 522,
		resultType: 'fail',
		name: '해물 덮밥',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 523,
		resultType: 'critical',
		name: '신선한 전복회무침',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 523,
		resultType: 'fail',
		name: '전복 무침',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 524,
		resultType: 'critical',
		name: '푸짐한 어복쟁반',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 524,
		resultType: 'fail',
		name: '어복쟁반',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 525,
		resultType: 'critical',
		name: '푸짐한 불고기정식',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 525,
		resultType: 'fail',
		name: '불고기 세트',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 526,
		resultType: 'critical',
		name: '바삭한 밀푀유쇼콜라',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 526,
		resultType: 'fail',
		name: '초코 밀푀유',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 527,
		resultType: 'critical',
		name: '부드러운 초콜릿무스',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 527,
		resultType: 'fail',
		name: '초코 무스',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 528,
		resultType: 'critical',
		name: '진한 퐁뒤',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 528,
		resultType: 'fail',
		name: '치즈 녹인 것',
		probability: 25,
		priceMultiplier: 0.05
	},
	{
		ingredientId: 529,
		resultType: 'critical',
		name: '신선한 아쿠아파차',
		probability: 5,
		priceMultiplier: 1.55
	},
	{
		ingredientId: 529,
		resultType: 'fail',
		name: '생선 스튜',
		probability: 25,
		priceMultiplier: 0.05
	},

	// ========== A등급 재료 (601-612) ==========
	{
		ingredientId: 601,
		resultType: 'critical',
		name: '전설의 T본스테이크',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 601, resultType: 'fail', name: 'T본 고기', probability: 45, priceMultiplier: 0 },
	{
		ingredientId: 602,
		resultType: 'critical',
		name: '최고급 참치스테이크',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 602, resultType: 'fail', name: '참치 구이', probability: 45, priceMultiplier: 0 },
	{
		ingredientId: 603,
		resultType: 'critical',
		name: '황금빛 트러플크림수프',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 603,
		resultType: 'fail',
		name: '트러플 수프',
		probability: 45,
		priceMultiplier: 0
	},
	{
		ingredientId: 604,
		resultType: 'critical',
		name: '호화로운 전복해물찜',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 604, resultType: 'fail', name: '전복 해물', probability: 30, priceMultiplier: 0 },
	{
		ingredientId: 605,
		resultType: 'critical',
		name: '황금빛 랍스터그라탕',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 605,
		resultType: 'fail',
		name: '랍스터 그라탕',
		probability: 30,
		priceMultiplier: 0
	},
	{
		ingredientId: 606,
		resultType: 'critical',
		name: '최고급 킹크랩버터구이',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 606,
		resultType: 'fail',
		name: '킹크랩 버터',
		probability: 45,
		priceMultiplier: 0
	},
	{
		ingredientId: 607,
		resultType: 'critical',
		name: '정통 카수레',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 607,
		resultType: 'fail',
		name: '프랑스 스튜',
		probability: 45,
		priceMultiplier: 0
	},
	{
		ingredientId: 608,
		resultType: 'critical',
		name: '완벽한 마그레',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 608, resultType: 'fail', name: '오리 요리', probability: 45, priceMultiplier: 0 },
	{
		ingredientId: 609,
		resultType: 'critical',
		name: '호화로운 씨푸드플래터',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 609,
		resultType: 'fail',
		name: '해물 플래터',
		probability: 45,
		priceMultiplier: 0
	},
	{
		ingredientId: 610,
		resultType: 'critical',
		name: '정통 궁중잡채',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 610, resultType: 'fail', name: '궁중 잡채', probability: 45, priceMultiplier: 0 },
	{
		ingredientId: 611,
		resultType: 'critical',
		name: '화려한 후나모리',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 611, resultType: 'fail', name: '일본 회', probability: 45, priceMultiplier: 0 },
	{
		ingredientId: 612,
		resultType: 'critical',
		name: '완벽한 파리브레스트',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 612,
		resultType: 'fail',
		name: '파리 디저트',
		probability: 45,
		priceMultiplier: 0
	},

	// ========== A등급 요리 (613-628) ==========
	{
		ingredientId: 613,
		resultType: 'critical',
		name: '전설의 신선로',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 613, resultType: 'fail', name: '전골 요리', probability: 30, priceMultiplier: 0 },
	{
		ingredientId: 614,
		resultType: 'critical',
		name: '완벽한 구절판',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 614, resultType: 'fail', name: '아홉 가지', probability: 30, priceMultiplier: 0 },
	{
		ingredientId: 615,
		resultType: 'critical',
		name: '전설의 비프웰링턴',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 615,
		resultType: 'fail',
		name: '소고기 파이',
		probability: 30,
		priceMultiplier: 0
	},
	{
		ingredientId: 616,
		resultType: 'critical',
		name: '황금빛 트러플카르보나라',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 616,
		resultType: 'fail',
		name: '트러플 파스타',
		probability: 30,
		priceMultiplier: 0
	},
	{
		ingredientId: 617,
		resultType: 'critical',
		name: '완벽한 코키유생자크',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 617,
		resultType: 'fail',
		name: '프랑스 조개',
		probability: 30,
		priceMultiplier: 0
	},
	{
		ingredientId: 618,
		resultType: 'critical',
		name: '정통 부야베스',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 618,
		resultType: 'fail',
		name: '프랑스 해물탕',
		probability: 30,
		priceMultiplier: 0
	},
	{
		ingredientId: 619,
		resultType: 'critical',
		name: '깊은 맛 부르기뇽',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 619,
		resultType: 'fail',
		name: '프랑스 스튜',
		probability: 30,
		priceMultiplier: 0
	},
	{
		ingredientId: 620,
		resultType: 'critical',
		name: '정통 북경오리',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 620, resultType: 'fail', name: '중국 오리', probability: 30, priceMultiplier: 0 },
	{
		ingredientId: 621,
		resultType: 'critical',
		name: '부드러운 동파육',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 621, resultType: 'fail', name: '중국 돼지', probability: 30, priceMultiplier: 0 },
	{
		ingredientId: 622,
		resultType: 'critical',
		name: '전설의 불도장',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 622, resultType: 'fail', name: '고급 탕', probability: 30, priceMultiplier: 0 },
	{
		ingredientId: 623,
		resultType: 'critical',
		name: '최고급 참치오마카세',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 623, resultType: 'fail', name: '참치 코스', probability: 30, priceMultiplier: 0 },
	{
		ingredientId: 624,
		resultType: 'critical',
		name: '진한 전복리소토',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 624,
		resultType: 'fail',
		name: '전복 리소토',
		probability: 30,
		priceMultiplier: 0
	},
	{
		ingredientId: 625,
		resultType: 'critical',
		name: '매콤한 싱가포르칠리크랩',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 625,
		resultType: 'fail',
		name: '싱가포르 크랩',
		probability: 30,
		priceMultiplier: 0
	},
	{
		ingredientId: 626,
		resultType: 'critical',
		name: '호화로운 랍스터테르미도르',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 626,
		resultType: 'fail',
		name: '랍스터 요리',
		probability: 30,
		priceMultiplier: 0
	},
	{
		ingredientId: 627,
		resultType: 'critical',
		name: '완벽한 오페라케이크',
		probability: 5,
		priceMultiplier: 1.6
	},
	{
		ingredientId: 627,
		resultType: 'fail',
		name: '오페라 케이크',
		probability: 45,
		priceMultiplier: 0
	},
	{
		ingredientId: 628,
		resultType: 'critical',
		name: '진한 초콜릿퐁듀',
		probability: 5,
		priceMultiplier: 1.6
	},
	{ ingredientId: 628, resultType: 'fail', name: '초코 퐁듀', probability: 30, priceMultiplier: 0 }
];

/**
 * ========================================
 * 헬퍼 함수
 * ========================================
 */

/**
 * ingredientId로 크리티컬 결과 조회
 */
export function getCriticalDish(ingredientId: number): DishEntry | undefined {
	return DISH_TABLE.find((d) => d.ingredientId === ingredientId && d.resultType === 'critical');
}

/**
 * ingredientId로 실패 결과 조회
 */
export function getFailDish(ingredientId: number): DishEntry | undefined {
	return DISH_TABLE.find((d) => d.ingredientId === ingredientId && d.resultType === 'fail');
}

/**
 * ingredientId로 모든 결과 조회
 */
export function getDishes(ingredientId: number): DishEntry[] {
	return DISH_TABLE.filter((d) => d.ingredientId === ingredientId);
}

/**
 * 랜덤 크리티컬 수식어
 */
export function getRandomCriticalPrefix(): string {
	return CRITICAL_PREFIXES[Math.floor(Math.random() * CRITICAL_PREFIXES.length)];
}

/**
 * 랜덤 크리티컬 설명
 */
export function getRandomCriticalDescription(): string {
	return CRITICAL_DESCRIPTIONS[Math.floor(Math.random() * CRITICAL_DESCRIPTIONS.length)];
}

/**
 * 랜덤 실패 설명
 */
export function getRandomFailDescription(): string {
	return FAIL_DESCRIPTIONS[Math.floor(Math.random() * FAIL_DESCRIPTIONS.length)];
}

/**
 * 랜덤 완전 실패 이름
 */
export function getRandomTotalFailName(): string {
	return TOTAL_FAIL_NAMES[Math.floor(Math.random() * TOTAL_FAIL_NAMES.length)];
}

/**
 * 랜덤 완전 실패 설명
 */
export function getRandomTotalFailDescription(): string {
	return TOTAL_FAIL_DESCRIPTIONS[Math.floor(Math.random() * TOTAL_FAIL_DESCRIPTIONS.length)];
}
