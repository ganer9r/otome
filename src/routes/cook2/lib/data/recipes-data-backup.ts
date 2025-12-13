import type { Recipe } from '../types';
import { GRADE_PRICES, type IngredientGrade } from '../types';

/**
 * 재료 ID → 등급 매핑 (간단한 방식)
 * 1~8: G, 101~127: F, 201~263: E, 301~347: D, 401~439: C, 501~523: B, 601~614: A, 701~730: R
 */
function getGradeById(id: number): IngredientGrade {
	if (id <= 8) return 'G';
	if (id <= 127) return 'F';
	if (id <= 263) return 'E';
	if (id <= 347) return 'D';
	if (id <= 439) return 'C';
	if (id <= 523) return 'B';
	if (id <= 614) return 'A';
	return 'R';
}

/**
 * 판매가 계산 (재료비 × 2~3배, 10원 단위)
 * 시드 기반으로 일관된 값 생성
 */
function calculateSellPrice(id: number, ingredientIds: number[]): number {
	const cost = ingredientIds.reduce((sum, ingId) => {
		const grade = getGradeById(ingId);
		return sum + GRADE_PRICES[grade];
	}, 0);

	// id 기반 시드로 2.0~3.0 배수 결정
	const seed = ((id * 7 + 13) % 11) / 10; // 0.0 ~ 1.0
	const multiplier = 2.0 + seed; // 2.0 ~ 3.0

	// 10원 단위로 반올림
	return Math.round((cost * multiplier) / 10) * 10;
}

/**
 * 레시피 데이터
 * 총: 238개 (G→F: 27, F→E: 55, E→D: 47, D→C: 39, C→B: 31, B→A: 20, A→R: 16)
 */
const RECIPES_RAW: Omit<Recipe, 'sellPrice'>[] = [
	// ========== G → F등급 (27개) ==========
	// F등급 재료 (12개) - 판매 불가
	{ id: 1, name: '밥', resultIngredientId: 101, ingredientIds: [1, 7] }, // 쌀 + 물
	{ id: 2, name: '반죽', resultIngredientId: 102, ingredientIds: [2, 7] }, // 밀 + 물
	{ id: 3, name: '빵', resultIngredientId: 103, ingredientIds: [2, 8] }, // 밀 + 불
	{ id: 4, name: '다짐육', resultIngredientId: 104, ingredientIds: [3, 3] }, // 고기 + 고기
	{ id: 5, name: '양념육', resultIngredientId: 105, ingredientIds: [3, 5] }, // 고기 + 채소
	{ id: 6, name: '양념장', resultIngredientId: 106, ingredientIds: [5, 6] }, // 채소 + 과일
	{ id: 7, name: '육수', resultIngredientId: 107, ingredientIds: [3, 7] }, // 고기 + 물
	{ id: 8, name: '횟감', resultIngredientId: 108, ingredientIds: [4, 4] }, // 해물 + 해물
	{ id: 9, name: '절임', resultIngredientId: 109, ingredientIds: [5, 7] }, // 채소 + 물
	{ id: 10, name: '과일청', resultIngredientId: 117, ingredientIds: [6, 6] }, // 과일 + 과일
	{ id: 11, name: '잼', resultIngredientId: 111, ingredientIds: [6, 8] }, // 과일 + 불
	{ id: 12, name: '얼음', resultIngredientId: 112, ingredientIds: [7, 7] }, // 물 + 물
	// F등급 요리 (15개)
	{ id: 13, name: '해물무침', resultIngredientId: 113, ingredientIds: [4, 5] }, // 해물 + 채소
	{ id: 14, name: '구운해물', resultIngredientId: 114, ingredientIds: [4, 8] }, // 해물 + 불
	{ id: 15, name: '샐러드', resultIngredientId: 115, ingredientIds: [5, 5] }, // 채소 + 채소
	{ id: 16, name: '칼솟', resultIngredientId: 116, ingredientIds: [5, 8] }, // 채소 + 불
	{ id: 17, name: '어묵', resultIngredientId: 121, ingredientIds: [4, 2] }, // 해물 + 밀
	{ id: 18, name: '주스', resultIngredientId: 118, ingredientIds: [6, 7] }, // 과일 + 물
	{ id: 19, name: '누룽지', resultIngredientId: 119, ingredientIds: [1, 8] }, // 쌀 + 불
	{ id: 20, name: '나물밥', resultIngredientId: 120, ingredientIds: [1, 5] }, // 쌀 + 채소
	{ id: 21, name: '온수', resultIngredientId: 128, ingredientIds: [7, 8] }, // 물 + 불
	{ id: 22, name: '조개탕', resultIngredientId: 122, ingredientIds: [4, 7] }, // 해물 + 물
	{ id: 23, name: '떡', resultIngredientId: 123, ingredientIds: [1, 1] }, // 쌀 + 쌀
	{ id: 24, name: '크래커', resultIngredientId: 124, ingredientIds: [2, 2] }, // 밀 + 밀
	{ id: 25, name: '또띠아', resultIngredientId: 125, ingredientIds: [2, 5] }, // 밀 + 채소
	{ id: 26, name: '소시지', resultIngredientId: 126, ingredientIds: [3, 4] }, // 고기 + 해물
	{ id: 27, name: '묵', resultIngredientId: 127, ingredientIds: [1, 4] }, // 쌀 + 해물

	// ========== F → E등급 ==========
	// E등급 재료 (14개)
	{ id: 101, name: '면', resultIngredientId: 201, ingredientIds: [102, 102] }, // 반죽 + 반죽
	{ id: 102, name: '튀김', resultIngredientId: 202, ingredientIds: [102, 103] }, // 반죽 + 빵
	{ id: 103, name: '구이', resultIngredientId: 203, ingredientIds: [105, 105] }, // 양념육 + 양념육
	{ id: 104, name: '수프', resultIngredientId: 204, ingredientIds: [107, 107] }, // 육수 + 육수
	{ id: 105, name: '회', resultIngredientId: 205, ingredientIds: [108, 108] }, // 횟감 + 횟감
	{ id: 106, name: '가래떡', resultIngredientId: 206, ingredientIds: [123, 123] }, // 떡 + 떡
	{ id: 107, name: '찜', resultIngredientId: 207, ingredientIds: [105, 107] }, // 양념육 + 육수
	{ id: 108, name: '김치', resultIngredientId: 208, ingredientIds: [109, 106] }, // 절임 + 양념장
	{ id: 109, name: '만두', resultIngredientId: 209, ingredientIds: [102, 104] }, // 반죽 + 다짐육
	{ id: 110, name: '찌개', resultIngredientId: 210, ingredientIds: [107, 106] }, // 육수 + 양념장
	{ id: 111, name: '초밥', resultIngredientId: 211, ingredientIds: [101, 108] }, // 밥 + 횟감
	{ id: 112, name: '케이크', resultIngredientId: 212, ingredientIds: [103, 111] }, // 빵 + 잼
	{ id: 113, name: '과일아이스크림', resultIngredientId: 213, ingredientIds: [112, 111] }, // 얼음 + 잼
	{ id: 114, name: '게살', resultIngredientId: 214, ingredientIds: [108, 107] }, // 횟감 + 육수
	// E등급 요리 (49개)
	// 밥 조합 (7개)
	{ id: 115, name: '주먹밥', resultIngredientId: 215, ingredientIds: [101, 101] }, // 밥 + 밥
	{ id: 116, name: '국밥', resultIngredientId: 216, ingredientIds: [101, 107] }, // 밥 + 육수
	{ id: 117, name: '비빔밥', resultIngredientId: 217, ingredientIds: [101, 106] }, // 밥 + 양념장
	{ id: 118, name: '오므라이스', resultIngredientId: 218, ingredientIds: [101, 104] }, // 밥 + 다짐육
	{ id: 119, name: '유부초밥', resultIngredientId: 219, ingredientIds: [101, 109] }, // 밥 + 절임
	{ id: 120, name: '떡국', resultIngredientId: 220, ingredientIds: [107, 123] }, // 육수 + 떡
	// 반죽 조합 (5개)
	{ id: 121, name: '칼국수', resultIngredientId: 221, ingredientIds: [102, 107] }, // 반죽 + 육수
	{ id: 122, name: '라면', resultIngredientId: 222, ingredientIds: [102, 106] }, // 반죽 + 양념장
	{ id: 123, name: '파이', resultIngredientId: 223, ingredientIds: [102, 111] }, // 반죽 + 잼
	{ id: 124, name: '냉면', resultIngredientId: 224, ingredientIds: [102, 112] }, // 반죽 + 얼음
	{ id: 125, name: '호떡', resultIngredientId: 225, ingredientIds: [102, 123] }, // 반죽 + 떡
	// 빵 조합 (7개)
	{ id: 126, name: '햄버거', resultIngredientId: 226, ingredientIds: [103, 104] }, // 빵 + 다짐육
	{ id: 127, name: '토스트', resultIngredientId: 227, ingredientIds: [103, 105] }, // 빵 + 양념육
	{ id: 128, name: '샌드위치', resultIngredientId: 228, ingredientIds: [103, 109] }, // 빵 + 절임
	{ id: 129, name: '쿠키', resultIngredientId: 229, ingredientIds: [103, 103] }, // 빵 + 빵
	{ id: 130, name: '빵푸딩', resultIngredientId: 230, ingredientIds: [103, 112] }, // 빵 + 얼음
	{ id: 131, name: '카나페', resultIngredientId: 231, ingredientIds: [103, 108] }, // 빵 + 횟감
	// 다짐육 조합 (8개)
	{ id: 132, name: '완자탕', resultIngredientId: 232, ingredientIds: [104, 104] }, // 다짐육 + 다짐육
	{ id: 133, name: '불고기', resultIngredientId: 233, ingredientIds: [104, 106] }, // 다짐육 + 양념장
	{ id: 134, name: '장조림', resultIngredientId: 234, ingredientIds: [104, 109] }, // 다짐육 + 절임
	{ id: 135, name: '미트볼', resultIngredientId: 235, ingredientIds: [104, 111] }, // 다짐육 + 잼
	{ id: 136, name: '떡갈비', resultIngredientId: 236, ingredientIds: [104, 123] }, // 다짐육 + 떡
	{ id: 137, name: '냉채', resultIngredientId: 237, ingredientIds: [104, 112] }, // 다짐육 + 얼음
	{ id: 138, name: '육회', resultIngredientId: 238, ingredientIds: [104, 108] }, // 다짐육 + 횟감
	// 양념육 조합 (5개)
	{ id: 139, name: '제육볶음', resultIngredientId: 239, ingredientIds: [105, 106] }, // 양념육 + 양념장
	{ id: 140, name: '보쌈', resultIngredientId: 240, ingredientIds: [105, 109] }, // 양념육 + 절임
	{ id: 141, name: '닭강정', resultIngredientId: 241, ingredientIds: [105, 111] }, // 양념육 + 잼
	{ id: 142, name: '떡꼬치', resultIngredientId: 242, ingredientIds: [105, 123] }, // 양념육 + 떡
	{ id: 143, name: '냉삼', resultIngredientId: 243, ingredientIds: [105, 112] }, // 양념육 + 얼음
	// 양념장 조합 (7개)
	{ id: 144, name: '쌈장', resultIngredientId: 244, ingredientIds: [106, 106] }, // 양념장 + 양념장
	{ id: 145, name: '회무침', resultIngredientId: 245, ingredientIds: [106, 108] }, // 양념장 + 횟감
	{ id: 146, name: '떡볶이', resultIngredientId: 246, ingredientIds: [106, 123] }, // 양념장 + 떡
	{ id: 147, name: '데리야끼', resultIngredientId: 247, ingredientIds: [106, 111] }, // 양념장 + 잼
	{ id: 148, name: '냉소스', resultIngredientId: 248, ingredientIds: [106, 112] }, // 양념장 + 얼음
	// 육수 조합 (3개)
	{ id: 149, name: '된장국', resultIngredientId: 249, ingredientIds: [107, 109] }, // 육수 + 절임
	{ id: 150, name: '단팥죽', resultIngredientId: 250, ingredientIds: [107, 111] }, // 육수 + 잼
	{ id: 151, name: '냉국', resultIngredientId: 251, ingredientIds: [107, 112] }, // 육수 + 얼음
	// 횟감 조합 (4개)
	{ id: 152, name: '젓갈', resultIngredientId: 252, ingredientIds: [108, 109] }, // 횟감 + 절임
	{ id: 153, name: '회냉채', resultIngredientId: 253, ingredientIds: [108, 112] }, // 횟감 + 얼음
	{ id: 154, name: '어묵탕', resultIngredientId: 254, ingredientIds: [108, 123] }, // 횟감 + 떡
	// 절임 조합 (3개)
	{ id: 155, name: '피클', resultIngredientId: 255, ingredientIds: [109, 109] }, // 절임 + 절임
	{ id: 156, name: '과일절임', resultIngredientId: 256, ingredientIds: [109, 111] }, // 절임 + 잼
	{ id: 157, name: '동치미', resultIngredientId: 257, ingredientIds: [109, 112] }, // 절임 + 얼음
	// 잼 조합 (3개)
	{ id: 158, name: '푸딩', resultIngredientId: 258, ingredientIds: [111, 111] }, // 잼 + 잼
	{ id: 159, name: '약과', resultIngredientId: 259, ingredientIds: [111, 123] }, // 잼 + 떡
	{ id: 160, name: '약밥', resultIngredientId: 260, ingredientIds: [101, 123] }, // 밥 + 떡
	// 얼음 조합 (4개)
	{ id: 161, name: '빙수', resultIngredientId: 261, ingredientIds: [112, 112] }, // 얼음 + 얼음
	{ id: 162, name: '떡빙수', resultIngredientId: 262, ingredientIds: [112, 123] }, // 얼음 + 떡
	// 떡 조합 (1개)
	{ id: 163, name: '도넛', resultIngredientId: 263, ingredientIds: [103, 123] }, // 빵 + 떡

	// ========== E → D등급 ==========
	// D등급 재료 (13개)
	{ id: 201, name: '스테이크', resultIngredientId: 301, ingredientIds: [203, 203] }, // 구이 + 구이
	{ id: 202, name: '삼겹살구이', resultIngredientId: 302, ingredientIds: [203, 208] }, // 구이 + 김치
	{ id: 203, name: '사시미', resultIngredientId: 303, ingredientIds: [205, 205] }, // 회 + 회
	{ id: 204, name: '돈카츠', resultIngredientId: 304, ingredientIds: [202, 203] }, // 튀김 + 구이
	{ id: 205, name: '모듬초밥', resultIngredientId: 305, ingredientIds: [211, 211] }, // 초밥 + 초밥
	{ id: 206, name: '해물찜', resultIngredientId: 306, ingredientIds: [214, 207] }, // 게살 + 찜
	{ id: 207, name: '꽃게탕', resultIngredientId: 307, ingredientIds: [214, 210] }, // 게살 + 찌개
	{ id: 208, name: '파스타', resultIngredientId: 308, ingredientIds: [201, 204] }, // 면 + 수프
	{ id: 209, name: '전골', resultIngredientId: 309, ingredientIds: [210, 209] }, // 찌개 + 만두
	{ id: 210, name: '모듬전', resultIngredientId: 310, ingredientIds: [202, 206] }, // 튀김 + 가래떡
	{ id: 211, name: '과일케이크', resultIngredientId: 311, ingredientIds: [212, 213] }, // 케이크 + 과일아이스크림
	{ id: 212, name: '크림', resultIngredientId: 312, ingredientIds: [204, 204] }, // 수프 + 수프
	{ id: 213, name: '라멘', resultIngredientId: 313, ingredientIds: [201, 210] }, // 면 + 찌개
	// D등급 요리 (34개)
	{ id: 214, name: '우동', resultIngredientId: 314, ingredientIds: [201, 214] }, // 면 + 게살
	{ id: 215, name: '볶음면', resultIngredientId: 315, ingredientIds: [201, 203] }, // 면 + 구이
	{ id: 216, name: '잔치국수', resultIngredientId: 316, ingredientIds: [201, 207] }, // 면 + 찜
	{ id: 217, name: '비빔국수', resultIngredientId: 317, ingredientIds: [201, 208] }, // 면 + 김치
	{ id: 218, name: '새우튀김', resultIngredientId: 318, ingredientIds: [202, 205] }, // 튀김 + 회
	{ id: 219, name: '텐동', resultIngredientId: 319, ingredientIds: [202, 211] }, // 튀김 + 초밥
	{ id: 220, name: '꼬치구이', resultIngredientId: 320, ingredientIds: [203, 209] }, // 구이 + 만두
	{ id: 221, name: '철판구이', resultIngredientId: 321, ingredientIds: [203, 214] }, // 구이 + 게살
	{ id: 222, name: '핫케이크', resultIngredientId: 322, ingredientIds: [212, 203] }, // 케이크 + 구이
	{ id: 223, name: '해물수프', resultIngredientId: 323, ingredientIds: [204, 214] }, // 수프 + 게살
	{ id: 224, name: '물회', resultIngredientId: 324, ingredientIds: [205, 204] }, // 회 + 수프
	{ id: 225, name: '회덮밥', resultIngredientId: 325, ingredientIds: [205, 211] }, // 회 + 초밥
	{ id: 226, name: '떡찜', resultIngredientId: 326, ingredientIds: [206, 207] }, // 가래떡 + 찜
	{ id: 227, name: '두부김치', resultIngredientId: 327, ingredientIds: [207, 208] }, // 찜 + 김치
	{ id: 228, name: '떡만두국', resultIngredientId: 328, ingredientIds: [206, 209] }, // 가래떡 + 만두
	{ id: 229, name: '궁중떡볶이', resultIngredientId: 329, ingredientIds: [206, 203] }, // 가래떡 + 구이
	{ id: 230, name: '만두찜', resultIngredientId: 330, ingredientIds: [207, 209] }, // 찜 + 만두
	{ id: 231, name: '코다리찜', resultIngredientId: 331, ingredientIds: [207, 205] }, // 찜 + 회
	{ id: 232, name: '김치만두', resultIngredientId: 332, ingredientIds: [208, 209] }, // 김치 + 만두
	{ id: 233, name: '김치전', resultIngredientId: 333, ingredientIds: [208, 202] }, // 김치 + 튀김
	{ id: 234, name: '김치수제비', resultIngredientId: 334, ingredientIds: [208, 204] }, // 김치 + 수프
	{ id: 235, name: '과일스무디', resultIngredientId: 335, ingredientIds: [204, 213] }, // 수프 + 과일아이스크림
	{ id: 236, name: '김치찌개', resultIngredientId: 336, ingredientIds: [208, 210] }, // 김치 + 찌개
	{ id: 237, name: '동태찌개', resultIngredientId: 337, ingredientIds: [210, 205] }, // 찌개 + 회
	{ id: 238, name: '게살볶음밥', resultIngredientId: 338, ingredientIds: [214, 211] }, // 게살 + 초밥
	{ id: 239, name: '튀김아이스크림', resultIngredientId: 339, ingredientIds: [213, 202] }, // 아이스크림 + 튀김
	{ id: 240, name: '튀김우동', resultIngredientId: 340, ingredientIds: [201, 202] }, // 면 + 튀김
	{ id: 241, name: '생크림케이크', resultIngredientId: 341, ingredientIds: [212, 212] }, // 케이크 + 케이크
	{ id: 242, name: '젤라또', resultIngredientId: 342, ingredientIds: [213, 213] }, // 아이스크림 + 아이스크림
	{ id: 243, name: '김치볶음밥', resultIngredientId: 343, ingredientIds: [211, 208] }, // 초밥 + 김치
	{ id: 244, name: '크레페', resultIngredientId: 344, ingredientIds: [212, 202] }, // 케이크 + 튀김
	{ id: 245, name: '아이스크림떡', resultIngredientId: 345, ingredientIds: [213, 206] }, // 아이스크림 + 가래떡
	{ id: 246, name: '가래떡구이', resultIngredientId: 346, ingredientIds: [206, 206] }, // 가래떡 + 가래떡
	{ id: 247, name: '완탕면', resultIngredientId: 347, ingredientIds: [201, 209] }, // 면 + 만두

	// ========== D → C등급 (39개) ==========
	// C등급 재료 (12개)
	{ id: 301, name: '갈비찜', resultIngredientId: 401, ingredientIds: [301, 301] }, // 스테이크 + 스테이크
	{ id: 302, name: '모듬회', resultIngredientId: 402, ingredientIds: [303, 303] }, // 사시미 + 사시미
	{ id: 303, name: '해물탕', resultIngredientId: 403, ingredientIds: [306, 307] }, // 해물찜 + 꽃게탕
	{ id: 304, name: '전복찜', resultIngredientId: 404, ingredientIds: [306, 305] }, // 해물찜 + 모듬초밥
	{ id: 305, name: '게살수프', resultIngredientId: 405, ingredientIds: [307, 312] }, // 꽃게탕 + 크림
	{ id: 306, name: '크림파스타', resultIngredientId: 406, ingredientIds: [308, 312] }, // 파스타 + 크림
	{ id: 307, name: '전주비빔밥', resultIngredientId: 407, ingredientIds: [309, 310] }, // 전골 + 모듬전
	{ id: 308, name: '초밥세트', resultIngredientId: 408, ingredientIds: [305, 303] }, // 모듬초밥 + 사시미
	{ id: 309, name: '오리로스', resultIngredientId: 409, ingredientIds: [302, 301] }, // 삼겹살구이 + 스테이크
	{ id: 310, name: '탕수육', resultIngredientId: 410, ingredientIds: [304, 311] }, // 돈카츠 + 과일케이크
	{ id: 311, name: '과일타르트', resultIngredientId: 411, ingredientIds: [311, 311] }, // 과일케이크 + 과일케이크
	{ id: 312, name: '크림브륄레', resultIngredientId: 412, ingredientIds: [312, 312] }, // 크림 + 크림
	// C등급 요리 (27개)
	// 고기 계열 (5개)
	{ id: 313, name: '챠슈동', resultIngredientId: 413, ingredientIds: [301, 313] }, // 스테이크 + 라멘
	{ id: 314, name: '돈카츠카레', resultIngredientId: 414, ingredientIds: [304, 309] }, // 돈카츠 + 전골
	{ id: 315, name: '규동', resultIngredientId: 415, ingredientIds: [301, 305] }, // 스테이크 + 모듬초밥
	{ id: 316, name: '차슈멘', resultIngredientId: 416, ingredientIds: [302, 313] }, // 삼겹살구이 + 라멘
	{ id: 317, name: '치킨카츠', resultIngredientId: 417, ingredientIds: [304, 304] }, // 돈카츠 + 돈카츠
	// 해물 계열 (7개)
	{ id: 318, name: '해물덮밥', resultIngredientId: 418, ingredientIds: [303, 306] }, // 사시미 + 해물찜
	{ id: 319, name: '조개찜', resultIngredientId: 419, ingredientIds: [306, 306] }, // 해물찜 + 해물찜
	{ id: 320, name: '매운탕', resultIngredientId: 420, ingredientIds: [303, 307] }, // 사시미 + 꽃게탕
	{ id: 321, name: '낙지전골', resultIngredientId: 421, ingredientIds: [306, 309] }, // 해물찜 + 전골
	{ id: 322, name: '크림새우', resultIngredientId: 422, ingredientIds: [306, 312] }, // 해물찜 + 크림
	{ id: 323, name: '꽃게찜', resultIngredientId: 423, ingredientIds: [307, 307] }, // 꽃게탕 + 꽃게탕
	{ id: 324, name: '짬뽕', resultIngredientId: 424, ingredientIds: [306, 313] }, // 해물찜 + 라멘
	// 초밥/일식 계열 (3개)
	{ id: 325, name: '돈가스정식', resultIngredientId: 425, ingredientIds: [304, 305] }, // 돈카츠 + 모듬초밥
	{ id: 326, name: '우동전골', resultIngredientId: 426, ingredientIds: [303, 309] }, // 사시미 + 전골
	{ id: 327, name: '라멘교자', resultIngredientId: 427, ingredientIds: [305, 313] }, // 모듬초밥 + 라멘
	// 파스타/양식 계열 (3개)
	{ id: 328, name: '삼겹파스타', resultIngredientId: 428, ingredientIds: [301, 308] }, // 스테이크 + 파스타
	{ id: 329, name: '카르보나라', resultIngredientId: 429, ingredientIds: [312, 302] }, // 크림 + 삼겹살구이
	{ id: 330, name: '봉골레', resultIngredientId: 430, ingredientIds: [308, 308] }, // 파스타 + 파스타
	// 한식 계열 (4개)
	{ id: 331, name: '부대찌개', resultIngredientId: 431, ingredientIds: [309, 309] }, // 전골 + 전골
	{ id: 332, name: '해물전', resultIngredientId: 432, ingredientIds: [307, 310] }, // 꽃게탕 + 모듬전
	{ id: 333, name: '파전', resultIngredientId: 433, ingredientIds: [310, 310] }, // 모듬전 + 모듬전
	{ id: 334, name: '김치찜', resultIngredientId: 434, ingredientIds: [302, 309] }, // 삼겹살구이 + 전골
	// 중식 계열 (2개)
	{ id: 335, name: '울면', resultIngredientId: 435, ingredientIds: [307, 313] }, // 꽃게탕 + 라멘
	{ id: 336, name: '유린기', resultIngredientId: 436, ingredientIds: [301, 304] }, // 스테이크 + 돈카츠
	// 디저트 계열 (3개)
	{ id: 337, name: '츄러스', resultIngredientId: 437, ingredientIds: [311, 308] }, // 과일케이크 + 파스타
	{ id: 338, name: '티라미수', resultIngredientId: 438, ingredientIds: [311, 312] }, // 과일케이크 + 크림
	{ id: 339, name: '해물파전', resultIngredientId: 439, ingredientIds: [303, 310] }, // 사시미 + 모듬전

	// ========== C → B등급 (31개) ==========
	// B등급 재료 (11개)
	{ id: 401, name: '채끝스테이크', resultIngredientId: 501, ingredientIds: [401, 401] }, // 갈비찜 + 갈비찜
	{ id: 402, name: '참치회', resultIngredientId: 502, ingredientIds: [402, 402] }, // 모듬회 + 모듬회
	{ id: 403, name: '크랩앤랍스터', resultIngredientId: 503, ingredientIds: [403, 405] }, // 해물탕 + 게살수프
	{ id: 404, name: '트러플리조또', resultIngredientId: 504, ingredientIds: [406, 406] }, // 크림파스타 + 크림파스타
	{ id: 405, name: '오리콩피', resultIngredientId: 505, ingredientIds: [409, 409] }, // 오리로스 + 오리로스
	{ id: 406, name: '슈바인학센', resultIngredientId: 506, ingredientIds: [401, 409] }, // 갈비찜 + 오리로스
	{ id: 407, name: '스시모듬', resultIngredientId: 507, ingredientIds: [408, 408] }, // 초밥세트 + 초밥세트
	{ id: 408, name: '프렌치정식', resultIngredientId: 508, ingredientIds: [406, 405] }, // 크림파스타 + 게살수프
	{ id: 409, name: '궁중떡갈비', resultIngredientId: 509, ingredientIds: [407, 407] }, // 전주비빔밥 + 전주비빔밥
	{ id: 410, name: '전복스테이크', resultIngredientId: 510, ingredientIds: [404, 404] }, // 전복찜 + 전복찜
	{ id: 411, name: '가토쇼콜라', resultIngredientId: 511, ingredientIds: [411, 412] }, // 과일타르트 + 크림브륄레
	// B등급 요리 (20개)
	// 고기 계열 (4개)
	{ id: 412, name: '갈비크림파스타', resultIngredientId: 512, ingredientIds: [401, 406] }, // 갈비찜 + 크림파스타
	{ id: 413, name: '카나르오랑주', resultIngredientId: 513, ingredientIds: [409, 411] }, // 오리로스 + 과일타르트
	{ id: 414, name: '오리훈제', resultIngredientId: 514, ingredientIds: [409, 410] }, // 오리로스 + 탕수육
	{ id: 415, name: '비프스튜', resultIngredientId: 515, ingredientIds: [401, 405] }, // 갈비찜 + 게살수프
	// 해물 계열 (4개)
	{ id: 416, name: '전복버터구이', resultIngredientId: 516, ingredientIds: [404, 401] }, // 전복찜 + 갈비찜
	{ id: 417, name: '전복초밥', resultIngredientId: 517, ingredientIds: [404, 408] }, // 전복찜 + 초밥세트
	{ id: 418, name: '전복크림파스타', resultIngredientId: 518, ingredientIds: [404, 406] }, // 전복찜 + 크림파스타
	{ id: 419, name: '게살크림리조또', resultIngredientId: 519, ingredientIds: [405, 402] }, // 게살수프 + 모듬회
	// 일식 계열 (3개)
	{ id: 420, name: '사시미모듬', resultIngredientId: 520, ingredientIds: [402, 408] }, // 모듬회 + 초밥세트
	{ id: 421, name: '해물초밥', resultIngredientId: 521, ingredientIds: [403, 408] }, // 해물탕 + 초밥세트
	{ id: 422, name: '회샤브샤브', resultIngredientId: 522, ingredientIds: [402, 407] }, // 모듬회 + 전주비빔밥
	// 양식 계열 (1개)
	{ id: 423, name: '해물그라탕', resultIngredientId: 523, ingredientIds: [403, 406] }, // 해물탕 + 크림파스타
	// 한식 계열 (3개)
	{ id: 424, name: '전복죽', resultIngredientId: 524, ingredientIds: [404, 407] }, // 전복찜 + 전주비빔밥
	{ id: 425, name: '갈비탕', resultIngredientId: 525, ingredientIds: [401, 403] }, // 갈비찜 + 해물탕
	{ id: 426, name: '한정식', resultIngredientId: 526, ingredientIds: [407, 409] }, // 전주비빔밥 + 오리로스
	// 중식 계열 (2개)
	{ id: 427, name: '깐쇼새우', resultIngredientId: 527, ingredientIds: [410, 403] }, // 탕수육 + 해물탕
	{ id: 428, name: '팔보채', resultIngredientId: 528, ingredientIds: [410, 410] }, // 탕수육 + 탕수육
	// 디저트 계열 (3개)
	{ id: 429, name: '타르트타탱', resultIngredientId: 529, ingredientIds: [411, 411] }, // 과일타르트 + 과일타르트
	{ id: 430, name: '무스케이크', resultIngredientId: 530, ingredientIds: [412, 412] }, // 크림브륄레 + 크림브륄레
	{ id: 431, name: '밀크레페', resultIngredientId: 531, ingredientIds: [411, 406] }, // 과일타르트 + 크림파스타

	// ========== B → A등급 (12개) ==========
	// A등급 재료 (12개)
	{ id: 501, name: 'T본스테이크', resultIngredientId: 601, ingredientIds: [501, 501] }, // 채끝스테이크 + 채끝스테이크
	{ id: 502, name: '참치스테이크', resultIngredientId: 602, ingredientIds: [502, 502] }, // 참치회 + 참치회
	{ id: 503, name: '트러플크림수프', resultIngredientId: 603, ingredientIds: [504, 504] }, // 트러플리조또 + 트러플리조또
	{ id: 504, name: '전복해물찜', resultIngredientId: 604, ingredientIds: [510, 503] }, // 전복스테이크 + 크랩앤랍스터
	{ id: 505, name: '랍스터그라탕', resultIngredientId: 605, ingredientIds: [503, 508] }, // 크랩앤랍스터 + 프렌치정식
	{ id: 506, name: '킹크랩버터구이', resultIngredientId: 606, ingredientIds: [503, 503] }, // 크랩앤랍스터 + 크랩앤랍스터
	{ id: 507, name: '카수레', resultIngredientId: 607, ingredientIds: [506, 506] }, // 슈바인학센 + 슈바인학센
	{ id: 508, name: '마그레', resultIngredientId: 608, ingredientIds: [505, 505] }, // 오리콩피 + 오리콩피
	{ id: 509, name: '씨푸드플래터', resultIngredientId: 609, ingredientIds: [508, 508] }, // 프렌치정식 + 프렌치정식
	{ id: 510, name: '궁중잡채', resultIngredientId: 610, ingredientIds: [509, 509] }, // 궁중떡갈비 + 궁중떡갈비
	{ id: 511, name: '카이세키', resultIngredientId: 611, ingredientIds: [507, 507] }, // 스시모듬 + 스시모듬
	{ id: 512, name: '파리브레스트', resultIngredientId: 612, ingredientIds: [511, 511] }, // 가토쇼콜라 + 가토쇼콜라
	// A등급 요리 (18개)
	{ id: 513, name: '스테이크타르타르', resultIngredientId: 613, ingredientIds: [501, 502] }, // 채끝스테이크 + 참치회
	{ id: 514, name: '로스트비프', resultIngredientId: 614, ingredientIds: [501, 508] }, // 채끝스테이크 + 프렌치정식
	{ id: 515, name: '트러플스테이크', resultIngredientId: 615, ingredientIds: [501, 504] }, // 채끝스테이크 + 트러플리조또
	{ id: 516, name: '참치카르파초', resultIngredientId: 616, ingredientIds: [502, 504] }, // 참치회 + 트러플리조또
	{ id: 517, name: '니기리모듬', resultIngredientId: 617, ingredientIds: [502, 507] }, // 참치회 + 스시모듬
	{ id: 518, name: '랍스터비스크', resultIngredientId: 618, ingredientIds: [503, 504] }, // 크랩앤랍스터 + 트러플리조또
	{ id: 519, name: '오리가슴살구이', resultIngredientId: 619, ingredientIds: [505, 508] }, // 오리콩피 + 프렌치정식
	{ id: 520, name: '오리불고기', resultIngredientId: 620, ingredientIds: [505, 509] }, // 오리콩피 + 궁중떡갈비
	{ id: 521, name: '아이스바인', resultIngredientId: 621, ingredientIds: [506, 508] }, // 슈바인학센 + 프렌치정식
	{ id: 522, name: '슈바인브라텐', resultIngredientId: 622, ingredientIds: [506, 504] }, // 슈바인학센 + 트러플리조또
	{ id: 523, name: '에도마에스시', resultIngredientId: 623, ingredientIds: [507, 510] }, // 스시모듬 + 전복스테이크
	{ id: 524, name: '전복회무침', resultIngredientId: 624, ingredientIds: [510, 502] }, // 전복스테이크 + 참치회
	{ id: 525, name: '어복쟁반', resultIngredientId: 625, ingredientIds: [509, 510] }, // 궁중떡갈비 + 전복스테이크
	{ id: 526, name: '불고기정식', resultIngredientId: 626, ingredientIds: [509, 501] }, // 궁중떡갈비 + 채끝스테이크
	{ id: 527, name: '밀푀유쇼콜라', resultIngredientId: 627, ingredientIds: [511, 504] }, // 가토쇼콜라 + 트러플리조또
	{ id: 528, name: '초콜릿무스', resultIngredientId: 628, ingredientIds: [511, 508] }, // 가토쇼콜라 + 프렌치정식
	{ id: 529, name: '퐁뒤', resultIngredientId: 629, ingredientIds: [504, 508] }, // 트러플리조또 + 프렌치정식
	{ id: 530, name: '아쿠아파차', resultIngredientId: 630, ingredientIds: [510, 508] }, // 전복스테이크 + 프렌치정식

	// ========== A → R등급 (16개) ==========
	{ id: 601, name: '신선로', resultIngredientId: 701, ingredientIds: [610, 606] }, // 궁중잡채 + 킹크랩버터구이
	{ id: 602, name: '구절판', resultIngredientId: 702, ingredientIds: [610, 609] }, // 궁중잡채 + 씨푸드플래터
	{ id: 606, name: '비프웰링턴', resultIngredientId: 706, ingredientIds: [601, 603] }, // T본스테이크 + 트러플크림수프
	{ id: 607, name: '트러플카르보나라', resultIngredientId: 707, ingredientIds: [603, 607] }, // 트러플크림수프 + 카수레
	{ id: 608, name: '코키유생자크', resultIngredientId: 708, ingredientIds: [604, 609] }, // 전복해물찜 + 씨푸드플래터
	{ id: 609, name: '부야베스', resultIngredientId: 709, ingredientIds: [605, 606] }, // 랍스터그라탕 + 킹크랩버터구이
	{ id: 610, name: '부르기뇽', resultIngredientId: 710, ingredientIds: [601, 607] }, // T본스테이크 + 카수레
	{ id: 611, name: '북경오리', resultIngredientId: 711, ingredientIds: [608, 610] }, // 마그레 + 궁중잡채
	{ id: 612, name: '동파육', resultIngredientId: 712, ingredientIds: [607, 610] }, // 카수레 + 궁중잡채
	{ id: 613, name: '불도장', resultIngredientId: 713, ingredientIds: [604, 606] }, // 전복해물찜 + 킹크랩버터구이
	{ id: 616, name: '참치오마카세', resultIngredientId: 716, ingredientIds: [602, 611] }, // 참치스테이크 + 카이세키
	{ id: 621, name: '전복리소토', resultIngredientId: 721, ingredientIds: [604, 603] }, // 전복해물찜 + 트러플크림수프
	{ id: 622, name: '싱가포르칠리크랩', resultIngredientId: 722, ingredientIds: [606, 609] }, // 킹크랩버터구이 + 씨푸드플래터
	{ id: 623, name: '랍스터테르미도르', resultIngredientId: 723, ingredientIds: [605, 603] }, // 랍스터그라탕 + 트러플크림수프
	{ id: 626, name: '오페라케이크', resultIngredientId: 726, ingredientIds: [612, 612] }, // 파리브레스트 + 파리브레스트
	{ id: 630, name: '초콜릿퐁듀', resultIngredientId: 730, ingredientIds: [612, 603] } // 파리브레스트 + 트러플크림수프
];

/**
 * 결과물이 요리인지 판별 (isIngredient = false)
 * 요리 ID 범위: 113~127 (F), 215~262 (E), 314~347 (D), 413~439 (C), 512~523 (B), R등급 전체
 */
function isDishResult(resultId: number): boolean {
	// F등급 요리: 113~127
	if (resultId >= 113 && resultId <= 127) return true;
	// E등급 요리: 215~262
	if (resultId >= 215 && resultId <= 262) return true;
	// D등급 요리: 314~347
	if (resultId >= 314 && resultId <= 347) return true;
	// C등급 요리: 413~439
	if (resultId >= 413 && resultId <= 439) return true;
	// B등급 요리: 512~523
	if (resultId >= 512 && resultId <= 523) return true;
	// R등급은 전부 요리
	if (resultId >= 701) return true;
	return false;
}

/**
 * 판매가가 포함된 레시피 데이터
 */
export const RECIPES_DATA: Recipe[] = RECIPES_RAW.map((recipe) => ({
	...recipe,
	sellPrice: isDishResult(recipe.resultIngredientId)
		? calculateSellPrice(recipe.id, recipe.ingredientIds)
		: undefined
}));
