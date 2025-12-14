import type { Recipe } from '../types';
import { GRADE_PRICES, type IngredientGrade } from '../types';

/**
 * 재료 ID → 등급 매핑
 * 1~8: G, 101~123: F, 201~214: E, 301~313: D, 401~412: C, 501~511: B, 601~612: A
 */
function getGradeById(id: number): IngredientGrade {
	if (id <= 8) return 'G';
	if (id <= 123) return 'F';
	if (id <= 214) return 'E';
	if (id <= 313) return 'D';
	if (id <= 412) return 'C';
	if (id <= 511) return 'B';
	return 'A';
}

/**
 * 판매가 계산 (재료비 × 2~3배, 10원 단위)
 */
function calculateSellPrice(id: number, ingredientIds: number[]): number {
	const cost = ingredientIds.reduce((sum, ingId) => {
		const grade = getGradeById(ingId);
		return sum + GRADE_PRICES[grade];
	}, 0);
	const seed = ((id * 7 + 13) % 11) / 10;
	const multiplier = 2.0 + seed;
	return Math.round((cost * multiplier) / 10) * 10;
}

/**
 * 레시피 데이터
 * 요리 등급 = 사용한 재료의 등급
 * G+G → F재료/G요리, F+F → E재료/F요리, ... A+A → A요리
 */
const RECIPES_RAW: Omit<Recipe, 'sellPrice'>[] = [
	// ========== G → F/G등급 (27개) ==========
	{ id: 1, name: '밥', resultIngredientId: 101, ingredientIds: [1, 7] },
	{ id: 2, name: '반죽', resultIngredientId: 102, ingredientIds: [2, 7] },
	{ id: 3, name: '빵', resultIngredientId: 103, ingredientIds: [2, 8] },
	{ id: 4, name: '다짐육', resultIngredientId: 104, ingredientIds: [3, 3] },
	{ id: 5, name: '양념육', resultIngredientId: 105, ingredientIds: [3, 5] },
	{ id: 6, name: '양념장', resultIngredientId: 106, ingredientIds: [5, 6] },
	{ id: 7, name: '육수', resultIngredientId: 107, ingredientIds: [3, 7] },
	{ id: 8, name: '횟감', resultIngredientId: 108, ingredientIds: [4, 4] },
	{ id: 9, name: '절임', resultIngredientId: 109, ingredientIds: [5, 7] },
	{ id: 10, name: '과일청', resultIngredientId: 13, ingredientIds: [6, 6] },
	{ id: 11, name: '잼', resultIngredientId: 111, ingredientIds: [6, 8] },
	{ id: 12, name: '얼음', resultIngredientId: 112, ingredientIds: [7, 7] },
	{ id: 13, name: '해초나물', resultIngredientId: 9, ingredientIds: [4, 5] },
	{ id: 14, name: '구운해물', resultIngredientId: 10, ingredientIds: [4, 8] },
	{ id: 15, name: '샐러드', resultIngredientId: 11, ingredientIds: [5, 5] },
	{ id: 16, name: '칼솟', resultIngredientId: 12, ingredientIds: [5, 8] },
	{ id: 17, name: '어묵', resultIngredientId: 17, ingredientIds: [4, 2] },
	{ id: 18, name: '주스', resultIngredientId: 14, ingredientIds: [6, 7] },
	{ id: 19, name: '누룽지', resultIngredientId: 15, ingredientIds: [1, 8] },
	{ id: 20, name: '나물밥', resultIngredientId: 16, ingredientIds: [1, 5] },
	{ id: 21, name: '온수', resultIngredientId: 23, ingredientIds: [7, 8] },
	{ id: 22, name: '조개탕', resultIngredientId: 18, ingredientIds: [4, 7] },
	{ id: 23, name: '떡', resultIngredientId: 123, ingredientIds: [1, 1] },
	{ id: 24, name: '크래커', resultIngredientId: 19, ingredientIds: [2, 2] },
	{ id: 25, name: '또띠아', resultIngredientId: 20, ingredientIds: [2, 5] },
	{ id: 26, name: '소시지', resultIngredientId: 21, ingredientIds: [3, 4] },
	{ id: 27, name: '묵', resultIngredientId: 22, ingredientIds: [1, 4] },

	// ========== F → E/F등급 (63개) ==========
	{ id: 101, name: '면', resultIngredientId: 201, ingredientIds: [102, 102] },
	{ id: 102, name: '튀김', resultIngredientId: 202, ingredientIds: [102, 103] },
	{ id: 103, name: '구이', resultIngredientId: 203, ingredientIds: [105, 105] },
	{ id: 104, name: '수프', resultIngredientId: 204, ingredientIds: [107, 107] },
	{ id: 105, name: '회', resultIngredientId: 205, ingredientIds: [108, 108] },
	{ id: 106, name: '가래떡', resultIngredientId: 206, ingredientIds: [123, 123] },
	{ id: 107, name: '찜', resultIngredientId: 207, ingredientIds: [105, 107] },
	{ id: 108, name: '김치', resultIngredientId: 208, ingredientIds: [109, 106] },
	{ id: 109, name: '만두', resultIngredientId: 209, ingredientIds: [102, 104] },
	{ id: 110, name: '찌개', resultIngredientId: 210, ingredientIds: [107, 106] },
	{ id: 111, name: '초밥', resultIngredientId: 211, ingredientIds: [101, 108] },
	{ id: 112, name: '케이크', resultIngredientId: 212, ingredientIds: [103, 111] },
	{ id: 113, name: '과일아이스크림', resultIngredientId: 213, ingredientIds: [112, 111] },
	{ id: 114, name: '게살', resultIngredientId: 214, ingredientIds: [108, 107] },
	{ id: 115, name: '주먹밥', resultIngredientId: 124, ingredientIds: [101, 101] },
	{ id: 116, name: '국밥', resultIngredientId: 125, ingredientIds: [101, 107] },
	{ id: 117, name: '비빔밥', resultIngredientId: 126, ingredientIds: [101, 106] },
	{ id: 118, name: '오므라이스', resultIngredientId: 127, ingredientIds: [101, 104] },
	{ id: 119, name: '유부초밥', resultIngredientId: 128, ingredientIds: [101, 109] },
	{ id: 120, name: '떡국', resultIngredientId: 129, ingredientIds: [107, 123] },
	{ id: 121, name: '칼국수', resultIngredientId: 130, ingredientIds: [102, 107] },
	{ id: 122, name: '라면', resultIngredientId: 131, ingredientIds: [102, 106] },
	{ id: 123, name: '파이', resultIngredientId: 132, ingredientIds: [102, 111] },
	{ id: 124, name: '냉면', resultIngredientId: 133, ingredientIds: [102, 112] },
	{ id: 125, name: '호떡', resultIngredientId: 134, ingredientIds: [102, 123] },
	{ id: 126, name: '햄버거', resultIngredientId: 135, ingredientIds: [103, 104] },
	{ id: 127, name: '토스트', resultIngredientId: 136, ingredientIds: [103, 105] },
	{ id: 128, name: '샌드위치', resultIngredientId: 137, ingredientIds: [103, 109] },
	{ id: 129, name: '쿠키', resultIngredientId: 138, ingredientIds: [103, 103] },
	{ id: 130, name: '프렌치토스트', resultIngredientId: 139, ingredientIds: [103, 112] },
	{ id: 131, name: '카나페', resultIngredientId: 140, ingredientIds: [103, 108] },
	{ id: 132, name: '완자탕', resultIngredientId: 141, ingredientIds: [104, 104] },
	{ id: 133, name: '불고기', resultIngredientId: 142, ingredientIds: [104, 106] },
	{ id: 134, name: '장조림', resultIngredientId: 143, ingredientIds: [104, 109] },
	{ id: 135, name: '미트볼', resultIngredientId: 144, ingredientIds: [104, 111] },
	{ id: 136, name: '떡갈비', resultIngredientId: 145, ingredientIds: [104, 123] },
	{ id: 137, name: '냉채', resultIngredientId: 146, ingredientIds: [104, 112] },
	{ id: 138, name: '육회', resultIngredientId: 147, ingredientIds: [104, 108] },
	{ id: 139, name: '제육볶음', resultIngredientId: 148, ingredientIds: [105, 106] },
	{ id: 140, name: '보쌈', resultIngredientId: 149, ingredientIds: [105, 109] },
	{ id: 141, name: '닭강정', resultIngredientId: 150, ingredientIds: [105, 111] },
	{ id: 142, name: '떡꼬치', resultIngredientId: 151, ingredientIds: [105, 123] },
	{ id: 143, name: '냉삼', resultIngredientId: 152, ingredientIds: [105, 112] },
	{ id: 144, name: '쌈장', resultIngredientId: 153, ingredientIds: [106, 106] },
	{ id: 145, name: '회무침', resultIngredientId: 154, ingredientIds: [106, 108] },
	{ id: 146, name: '떡볶이', resultIngredientId: 155, ingredientIds: [106, 123] },
	{ id: 147, name: '데리야끼', resultIngredientId: 156, ingredientIds: [106, 111] },
	{ id: 148, name: '냉소스', resultIngredientId: 157, ingredientIds: [106, 112] },
	{ id: 149, name: '된장국', resultIngredientId: 158, ingredientIds: [107, 109] },
	{ id: 150, name: '단팥죽', resultIngredientId: 159, ingredientIds: [107, 111] },
	{ id: 151, name: '냉국', resultIngredientId: 160, ingredientIds: [107, 112] },
	{ id: 152, name: '젓갈', resultIngredientId: 161, ingredientIds: [108, 109] },
	{ id: 153, name: '빙어회', resultIngredientId: 162, ingredientIds: [108, 112] },
	{ id: 154, name: '어묵탕', resultIngredientId: 163, ingredientIds: [108, 123] },
	{ id: 155, name: '피클', resultIngredientId: 164, ingredientIds: [109, 109] },
	{ id: 156, name: '과일절임', resultIngredientId: 165, ingredientIds: [109, 111] },
	{ id: 157, name: '동치미', resultIngredientId: 166, ingredientIds: [109, 112] },
	{ id: 158, name: '푸딩', resultIngredientId: 167, ingredientIds: [111, 111] },
	{ id: 159, name: '약과', resultIngredientId: 168, ingredientIds: [111, 123] },
	{ id: 160, name: '약밥', resultIngredientId: 169, ingredientIds: [101, 123] },
	{ id: 161, name: '팥빙수', resultIngredientId: 170, ingredientIds: [112, 112] },
	{ id: 162, name: '떡빙수', resultIngredientId: 171, ingredientIds: [112, 123] },
	{ id: 163, name: '도넛', resultIngredientId: 172, ingredientIds: [103, 123] },

	// ========== E → D/E등급 (47개) ==========
	{ id: 201, name: '스테이크', resultIngredientId: 301, ingredientIds: [203, 203] },
	{ id: 202, name: '삼겹살구이', resultIngredientId: 302, ingredientIds: [203, 208] },
	{ id: 203, name: '후토마키', resultIngredientId: 303, ingredientIds: [205, 205] },
	{ id: 204, name: '돈카츠', resultIngredientId: 304, ingredientIds: [202, 203] },
	{ id: 205, name: '모듬초밥', resultIngredientId: 305, ingredientIds: [211, 211] },
	{ id: 206, name: '해물찜', resultIngredientId: 306, ingredientIds: [214, 207] },
	{ id: 207, name: '꽃게탕', resultIngredientId: 307, ingredientIds: [214, 210] },
	{ id: 208, name: '알리오올리오', resultIngredientId: 308, ingredientIds: [201, 204] },
	{ id: 209, name: '전골', resultIngredientId: 309, ingredientIds: [210, 209] },
	{ id: 210, name: '모듬전', resultIngredientId: 310, ingredientIds: [202, 206] },
	{ id: 211, name: '과일케이크', resultIngredientId: 311, ingredientIds: [212, 213] },
	{ id: 212, name: '크림', resultIngredientId: 312, ingredientIds: [204, 204] },
	{ id: 213, name: '라멘', resultIngredientId: 313, ingredientIds: [201, 210] },
	{ id: 214, name: '우동', resultIngredientId: 215, ingredientIds: [201, 214] },
	{ id: 215, name: '볶음면', resultIngredientId: 216, ingredientIds: [201, 203] },
	{ id: 216, name: '잔치국수', resultIngredientId: 217, ingredientIds: [201, 207] },
	{ id: 217, name: '비빔국수', resultIngredientId: 218, ingredientIds: [201, 208] },
	{ id: 218, name: '새우튀김', resultIngredientId: 219, ingredientIds: [202, 205] },
	{ id: 219, name: '텐동', resultIngredientId: 220, ingredientIds: [202, 211] },
	{ id: 220, name: '꼬치구이', resultIngredientId: 221, ingredientIds: [203, 209] },
	{ id: 221, name: '철판구이', resultIngredientId: 222, ingredientIds: [203, 214] },
	{ id: 222, name: '핫케이크', resultIngredientId: 223, ingredientIds: [212, 203] },
	{ id: 223, name: '해물수프', resultIngredientId: 224, ingredientIds: [204, 214] },
	{ id: 224, name: '물회', resultIngredientId: 225, ingredientIds: [205, 204] },
	{ id: 225, name: '회덮밥', resultIngredientId: 226, ingredientIds: [205, 211] },
	{ id: 226, name: '떡찜', resultIngredientId: 227, ingredientIds: [206, 207] },
	{ id: 227, name: '두부김치', resultIngredientId: 228, ingredientIds: [207, 208] },
	{ id: 228, name: '떡만두국', resultIngredientId: 229, ingredientIds: [206, 209] },
	{ id: 229, name: '궁중떡볶이', resultIngredientId: 230, ingredientIds: [206, 203] },
	{ id: 230, name: '만두찜', resultIngredientId: 231, ingredientIds: [207, 209] },
	{ id: 231, name: '코다리찜', resultIngredientId: 232, ingredientIds: [207, 205] },
	{ id: 232, name: '김치만두', resultIngredientId: 233, ingredientIds: [208, 209] },
	{ id: 233, name: '김치전', resultIngredientId: 234, ingredientIds: [208, 202] },
	{ id: 234, name: '김치수제비', resultIngredientId: 235, ingredientIds: [208, 204] },
	{ id: 235, name: '과일스무디', resultIngredientId: 236, ingredientIds: [204, 213] },
	{ id: 236, name: '김치찌개', resultIngredientId: 237, ingredientIds: [208, 210] },
	{ id: 237, name: '동태찌개', resultIngredientId: 238, ingredientIds: [210, 205] },
	{ id: 238, name: '게살볶음밥', resultIngredientId: 239, ingredientIds: [214, 211] },
	{ id: 239, name: '튀김아이스크림', resultIngredientId: 240, ingredientIds: [213, 202] },
	{ id: 240, name: '튀김우동', resultIngredientId: 241, ingredientIds: [201, 202] },
	{ id: 241, name: '생크림케이크', resultIngredientId: 242, ingredientIds: [212, 212] },
	{ id: 242, name: '젤라또', resultIngredientId: 243, ingredientIds: [213, 213] },
	{ id: 243, name: '김치볶음밥', resultIngredientId: 244, ingredientIds: [211, 208] },
	{ id: 244, name: '크레페', resultIngredientId: 245, ingredientIds: [212, 202] },
	{ id: 245, name: '아이스크림떡', resultIngredientId: 246, ingredientIds: [213, 206] },
	{ id: 246, name: '가래떡구이', resultIngredientId: 247, ingredientIds: [206, 206] },
	{ id: 247, name: '완탕면', resultIngredientId: 248, ingredientIds: [201, 209] },

	// ========== D → C/D등급 (39개) ==========
	{ id: 301, name: '갈비찜', resultIngredientId: 401, ingredientIds: [301, 301] },
	{ id: 302, name: '모듬회', resultIngredientId: 402, ingredientIds: [303, 303] },
	{ id: 303, name: '해물탕', resultIngredientId: 403, ingredientIds: [306, 307] },
	{ id: 304, name: '전복찜', resultIngredientId: 404, ingredientIds: [306, 305] },
	{ id: 305, name: '게살수프', resultIngredientId: 405, ingredientIds: [307, 312] },
	{ id: 306, name: '크림파스타', resultIngredientId: 406, ingredientIds: [308, 312] },
	{ id: 307, name: '전주비빔밥', resultIngredientId: 407, ingredientIds: [309, 310] },
	{ id: 308, name: '초밥세트', resultIngredientId: 408, ingredientIds: [305, 303] },
	{ id: 309, name: '오리로스', resultIngredientId: 409, ingredientIds: [302, 301] },
	{ id: 310, name: '탕수육', resultIngredientId: 410, ingredientIds: [304, 311] },
	{ id: 311, name: '과일타르트', resultIngredientId: 411, ingredientIds: [311, 311] },
	{ id: 312, name: '크림브륄레', resultIngredientId: 412, ingredientIds: [312, 312] },
	{ id: 313, name: '챠슈동', resultIngredientId: 314, ingredientIds: [301, 313] },
	{ id: 314, name: '돈카츠카레', resultIngredientId: 315, ingredientIds: [304, 309] },
	{ id: 315, name: '규동', resultIngredientId: 316, ingredientIds: [301, 305] },
	{ id: 316, name: '차슈멘', resultIngredientId: 317, ingredientIds: [302, 313] },
	{ id: 317, name: '치킨카츠', resultIngredientId: 318, ingredientIds: [304, 304] },
	{ id: 318, name: '문어숙회', resultIngredientId: 319, ingredientIds: [303, 306] },
	{ id: 319, name: '조개찜', resultIngredientId: 320, ingredientIds: [306, 306] },
	{ id: 320, name: '매운탕', resultIngredientId: 321, ingredientIds: [303, 307] },
	{ id: 321, name: '낙지전골', resultIngredientId: 322, ingredientIds: [306, 309] },
	{ id: 322, name: '크림새우', resultIngredientId: 323, ingredientIds: [306, 312] },
	{ id: 323, name: '꽃게찜', resultIngredientId: 324, ingredientIds: [307, 307] },
	{ id: 324, name: '짬뽕', resultIngredientId: 325, ingredientIds: [306, 313] },
	{ id: 325, name: '돈가스정식', resultIngredientId: 326, ingredientIds: [304, 305] },
	{ id: 326, name: '우동전골', resultIngredientId: 327, ingredientIds: [303, 309] },
	{ id: 327, name: '라멘교자', resultIngredientId: 328, ingredientIds: [305, 313] },
	{ id: 328, name: '삼겹파스타', resultIngredientId: 329, ingredientIds: [301, 308] },
	{ id: 329, name: '카르보나라', resultIngredientId: 330, ingredientIds: [312, 302] },
	{ id: 330, name: '봉골레', resultIngredientId: 331, ingredientIds: [308, 308] },
	{ id: 331, name: '부대찌개', resultIngredientId: 332, ingredientIds: [309, 309] },
	{ id: 332, name: '해물전', resultIngredientId: 333, ingredientIds: [307, 310] },
	{ id: 333, name: '파전', resultIngredientId: 334, ingredientIds: [310, 310] },
	{ id: 334, name: '김치찜', resultIngredientId: 335, ingredientIds: [302, 309] },
	{ id: 335, name: '울면', resultIngredientId: 336, ingredientIds: [307, 313] },
	{ id: 336, name: '유린기', resultIngredientId: 337, ingredientIds: [301, 304] },
	{ id: 337, name: '츄러스', resultIngredientId: 338, ingredientIds: [311, 308] },
	{ id: 338, name: '티라미수', resultIngredientId: 339, ingredientIds: [311, 312] },
	{ id: 339, name: '해물파전', resultIngredientId: 340, ingredientIds: [303, 310] },

	// ========== C → B/C등급 (31개) ==========
	{ id: 401, name: '채끝스테이크', resultIngredientId: 501, ingredientIds: [401, 401] },
	{ id: 402, name: '참치회', resultIngredientId: 502, ingredientIds: [402, 402] },
	{ id: 403, name: '크랩앤랍스터', resultIngredientId: 503, ingredientIds: [403, 405] },
	{ id: 404, name: '트러플리조또', resultIngredientId: 504, ingredientIds: [406, 406] },
	{ id: 405, name: '오리콩피', resultIngredientId: 505, ingredientIds: [409, 409] },
	{ id: 406, name: '슈바인학센', resultIngredientId: 506, ingredientIds: [401, 409] },
	{ id: 407, name: '스시모듬', resultIngredientId: 507, ingredientIds: [408, 408] },
	{ id: 408, name: '프렌치정식', resultIngredientId: 508, ingredientIds: [406, 405] },
	{ id: 409, name: '궁중떡갈비', resultIngredientId: 509, ingredientIds: [407, 407] },
	{ id: 410, name: '전복스테이크', resultIngredientId: 510, ingredientIds: [404, 404] },
	{ id: 411, name: '가토쇼콜라', resultIngredientId: 511, ingredientIds: [411, 412] },
	{ id: 412, name: '갈비크림파스타', resultIngredientId: 413, ingredientIds: [401, 406] },
	{ id: 413, name: '카나르오랑주', resultIngredientId: 414, ingredientIds: [409, 411] },
	{ id: 414, name: '오리훈제', resultIngredientId: 415, ingredientIds: [409, 410] },
	{ id: 415, name: '비프스튜', resultIngredientId: 416, ingredientIds: [401, 405] },
	{ id: 416, name: '전복버터구이', resultIngredientId: 417, ingredientIds: [404, 401] },
	{ id: 417, name: '전복초밥', resultIngredientId: 418, ingredientIds: [404, 408] },
	{ id: 418, name: '전복크림파스타', resultIngredientId: 419, ingredientIds: [404, 406] },
	{ id: 419, name: '게살크림리조또', resultIngredientId: 420, ingredientIds: [405, 402] },
	{ id: 420, name: '도미회', resultIngredientId: 421, ingredientIds: [402, 408] },
	{ id: 421, name: '해물솥밥', resultIngredientId: 422, ingredientIds: [403, 408] },
	{ id: 422, name: '회샤브샤브', resultIngredientId: 423, ingredientIds: [402, 407] },
	{ id: 423, name: '해물그라탕', resultIngredientId: 424, ingredientIds: [403, 406] },
	{ id: 424, name: '전복죽', resultIngredientId: 425, ingredientIds: [404, 407] },
	{ id: 425, name: '갈비탕', resultIngredientId: 426, ingredientIds: [401, 403] },
	{ id: 426, name: '한정식', resultIngredientId: 427, ingredientIds: [407, 409] },
	{ id: 427, name: '깐쇼새우', resultIngredientId: 428, ingredientIds: [410, 403] },
	{ id: 428, name: '팔보채', resultIngredientId: 429, ingredientIds: [410, 410] },
	{ id: 429, name: '타르트타탱', resultIngredientId: 430, ingredientIds: [411, 411] },
	{ id: 430, name: '무스케이크', resultIngredientId: 431, ingredientIds: [412, 412] },
	{ id: 431, name: '밀크레페', resultIngredientId: 432, ingredientIds: [411, 406] },

	// ========== B → A/B등급 (30개) ==========
	{ id: 501, name: 'T본스테이크', resultIngredientId: 601, ingredientIds: [501, 501] },
	{ id: 502, name: '참치스테이크', resultIngredientId: 602, ingredientIds: [502, 502] },
	{ id: 503, name: '트러플크림수프', resultIngredientId: 603, ingredientIds: [504, 504] },
	{ id: 504, name: '전복해물찜', resultIngredientId: 604, ingredientIds: [510, 503] },
	{ id: 505, name: '랍스터그라탕', resultIngredientId: 605, ingredientIds: [503, 508] },
	{ id: 506, name: '킹크랩버터구이', resultIngredientId: 606, ingredientIds: [503, 503] },
	{ id: 507, name: '카수레', resultIngredientId: 607, ingredientIds: [506, 506] },
	{ id: 508, name: '마그레', resultIngredientId: 608, ingredientIds: [505, 505] },
	{ id: 509, name: '씨푸드플래터', resultIngredientId: 609, ingredientIds: [508, 508] },
	{ id: 510, name: '궁중잡채', resultIngredientId: 610, ingredientIds: [509, 509] },
	{ id: 511, name: '후나모리', resultIngredientId: 611, ingredientIds: [507, 507] },
	{ id: 512, name: '파리브레스트', resultIngredientId: 612, ingredientIds: [511, 511] },
	{ id: 513, name: '스테이크타르타르', resultIngredientId: 512, ingredientIds: [501, 502] },
	{ id: 514, name: '로스트비프', resultIngredientId: 513, ingredientIds: [501, 508] },
	{ id: 515, name: '트러플스테이크', resultIngredientId: 514, ingredientIds: [501, 504] },
	{ id: 516, name: '참치카르파초', resultIngredientId: 515, ingredientIds: [502, 504] },
	{ id: 517, name: '카이세키', resultIngredientId: 516, ingredientIds: [502, 507] },
	{ id: 518, name: '랍스터비스크', resultIngredientId: 517, ingredientIds: [503, 504] },
	{ id: 519, name: '오리가슴살구이', resultIngredientId: 518, ingredientIds: [505, 508] },
	{ id: 520, name: '오리불고기', resultIngredientId: 519, ingredientIds: [505, 509] },
	{ id: 521, name: '아이스바인', resultIngredientId: 520, ingredientIds: [506, 508] },
	{ id: 522, name: '슈바인브라텐', resultIngredientId: 521, ingredientIds: [506, 504] },
	{ id: 523, name: '카이센동', resultIngredientId: 522, ingredientIds: [507, 510] },
	{ id: 524, name: '전복회무침', resultIngredientId: 523, ingredientIds: [510, 502] },
	{ id: 525, name: '어복쟁반', resultIngredientId: 524, ingredientIds: [509, 510] },
	{ id: 526, name: '불고기정식', resultIngredientId: 525, ingredientIds: [509, 501] },
	{ id: 527, name: '밀푀유쇼콜라', resultIngredientId: 526, ingredientIds: [511, 504] },
	{ id: 528, name: '초콜릿무스', resultIngredientId: 527, ingredientIds: [511, 508] },
	{ id: 529, name: '퐁뒤', resultIngredientId: 528, ingredientIds: [504, 508] },
	{ id: 530, name: '아쿠아파차', resultIngredientId: 529, ingredientIds: [510, 508] },

	// ========== A → A등급 (16개) ==========
	{ id: 601, name: '신선로', resultIngredientId: 613, ingredientIds: [610, 606] },
	{ id: 602, name: '구절판', resultIngredientId: 614, ingredientIds: [610, 609] },
	{ id: 606, name: '비프웰링턴', resultIngredientId: 615, ingredientIds: [601, 603] },
	{ id: 607, name: '트러플카르보나라', resultIngredientId: 616, ingredientIds: [603, 607] },
	{ id: 608, name: '코키유생자크', resultIngredientId: 617, ingredientIds: [604, 609] },
	{ id: 609, name: '부야베스', resultIngredientId: 618, ingredientIds: [605, 606] },
	{ id: 610, name: '부르기뇽', resultIngredientId: 619, ingredientIds: [601, 607] },
	{ id: 611, name: '북경오리', resultIngredientId: 620, ingredientIds: [608, 610] },
	{ id: 612, name: '동파육', resultIngredientId: 621, ingredientIds: [607, 610] },
	{ id: 613, name: '불도장', resultIngredientId: 622, ingredientIds: [604, 606] },
	{ id: 616, name: '참치오마카세', resultIngredientId: 623, ingredientIds: [602, 611] },
	{ id: 621, name: '전복리소토', resultIngredientId: 624, ingredientIds: [604, 603] },
	{ id: 622, name: '싱가포르칠리크랩', resultIngredientId: 625, ingredientIds: [606, 609] },
	{ id: 623, name: '랍스터테르미도르', resultIngredientId: 626, ingredientIds: [605, 603] },
	{ id: 626, name: '오페라케이크', resultIngredientId: 627, ingredientIds: [612, 612] },
	{ id: 630, name: '초콜릿퐁듀', resultIngredientId: 628, ingredientIds: [612, 603] }
];

/**
 * 결과물이 요리인지 판별 (isIngredient = false)
 */
function isDishResult(resultId: number): boolean {
	// G등급 요리: 9~23
	if (resultId >= 9 && resultId <= 23) return true;
	// F등급 요리: 124~172
	if (resultId >= 124 && resultId <= 172) return true;
	// E등급 요리: 215~248
	if (resultId >= 215 && resultId <= 248) return true;
	// D등급 요리: 314~340
	if (resultId >= 314 && resultId <= 340) return true;
	// C등급 요리: 413~432
	if (resultId >= 413 && resultId <= 432) return true;
	// B등급 요리: 512~529
	if (resultId >= 512 && resultId <= 529) return true;
	// A등급 요리: 613~628
	if (resultId >= 613 && resultId <= 628) return true;
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
