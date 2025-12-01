import type { Recipe } from '../types';

/**
 * 레시피 데이터
 * 총: 277개
 */
export const RECIPES_DATA: Recipe[] = [
	// ========== G → F등급 (27개) ==========
	// F등급 재료 (12개)
	{ id: 1, name: '밥', resultIngredientId: 101, ingredientIds: [1, 7] }, // 쌀 + 물
	{ id: 2, name: '반죽', resultIngredientId: 102, ingredientIds: [2, 7] }, // 밀 + 물
	{ id: 3, name: '빵', resultIngredientId: 103, ingredientIds: [2, 8] }, // 밀 + 불
	{ id: 4, name: '다짐육', resultIngredientId: 104, ingredientIds: [3, 3] }, // 고기 + 고기
	{ id: 5, name: '양념육', resultIngredientId: 105, ingredientIds: [3, 5] }, // 고기 + 채소
	{ id: 6, name: '양념장', resultIngredientId: 106, ingredientIds: [3, 6] }, // 고기 + 과일
	{ id: 7, name: '육수', resultIngredientId: 107, ingredientIds: [3, 7] }, // 고기 + 물
	{ id: 8, name: '구이', resultIngredientId: 108, ingredientIds: [3, 8] }, // 고기 + 불
	{ id: 9, name: '절임', resultIngredientId: 109, ingredientIds: [5, 7] }, // 채소 + 물
	{ id: 10, name: '시럽', resultIngredientId: 110, ingredientIds: [6, 6] }, // 과일 + 과일
	{ id: 11, name: '잼', resultIngredientId: 111, ingredientIds: [6, 8] }, // 과일 + 불
	{ id: 12, name: '얼음', resultIngredientId: 112, ingredientIds: [7, 7] }, // 물 + 물
	// F등급 요리 (15개)
	{ id: 13, name: '해물무침', resultIngredientId: 113, ingredientIds: [4, 5] }, // 해물 + 채소
	{ id: 14, name: '구운해물', resultIngredientId: 114, ingredientIds: [4, 8] }, // 해물 + 불
	{ id: 15, name: '샐러드', resultIngredientId: 115, ingredientIds: [5, 5] }, // 채소 + 채소
	{ id: 16, name: '볶음', resultIngredientId: 116, ingredientIds: [5, 8] }, // 채소 + 불
	{ id: 17, name: '과일청', resultIngredientId: 117, ingredientIds: [5, 6] }, // 채소 + 과일
	{ id: 18, name: '주스', resultIngredientId: 118, ingredientIds: [6, 7] }, // 과일 + 물
	{ id: 19, name: '누룽지', resultIngredientId: 119, ingredientIds: [1, 8] }, // 쌀 + 불
	{ id: 20, name: '쌈', resultIngredientId: 120, ingredientIds: [1, 5] }, // 쌀 + 채소
	{ id: 21, name: '젓갈', resultIngredientId: 121, ingredientIds: [4, 4] }, // 해물 + 해물
	{ id: 22, name: '해물육수', resultIngredientId: 122, ingredientIds: [4, 7] }, // 해물 + 물
	{ id: 23, name: '떡', resultIngredientId: 123, ingredientIds: [1, 1] }, // 쌀 + 쌀
	{ id: 24, name: '튀김옷', resultIngredientId: 124, ingredientIds: [2, 2] }, // 밀 + 밀
	{ id: 25, name: '피자도우', resultIngredientId: 125, ingredientIds: [2, 5] }, // 밀 + 채소
	{ id: 26, name: '소시지', resultIngredientId: 126, ingredientIds: [3, 4] }, // 고기 + 해물
	{ id: 27, name: '묵', resultIngredientId: 127, ingredientIds: [1, 4] }, // 쌀 + 해물

	// ========== F → E등급 (55개) ==========
	// E등급 재료 (14개)
	{ id: 101, name: '면', resultIngredientId: 201, ingredientIds: [102, 102] }, // 반죽 + 반죽
	{ id: 102, name: '김치', resultIngredientId: 202, ingredientIds: [109, 106] }, // 절임 + 양념장
	{ id: 103, name: '만두', resultIngredientId: 203, ingredientIds: [102, 104] }, // 반죽 + 다짐육
	{ id: 104, name: '국', resultIngredientId: 204, ingredientIds: [107, 109] }, // 육수 + 절임
	{ id: 105, name: '찌개', resultIngredientId: 205, ingredientIds: [107, 106] }, // 육수 + 양념장
	{ id: 106, name: '조림', resultIngredientId: 206, ingredientIds: [108, 106] }, // 구이 + 양념장
	{ id: 107, name: '스테이크', resultIngredientId: 207, ingredientIds: [108, 107] }, // 구이 + 육수
	{ id: 108, name: '파이', resultIngredientId: 208, ingredientIds: [102, 111] }, // 반죽 + 잼
	{ id: 109, name: '케이크', resultIngredientId: 209, ingredientIds: [103, 110] }, // 빵 + 시럽
	{ id: 110, name: '아이스크림', resultIngredientId: 210, ingredientIds: [112, 110] }, // 얼음 + 시럽
	{ id: 111, name: '초밥', resultIngredientId: 211, ingredientIds: [101, 109] }, // 밥 + 절임
	{ id: 112, name: '덮밥', resultIngredientId: 212, ingredientIds: [101, 108] }, // 밥 + 구이
	{ id: 113, name: '볶음밥', resultIngredientId: 213, ingredientIds: [101, 106] }, // 밥 + 양념장
	{ id: 114, name: '전', resultIngredientId: 214, ingredientIds: [102, 105] }, // 반죽 + 양념육
	// E등급 요리 (41개)
	{ id: 115, name: '국밥', resultIngredientId: 215, ingredientIds: [101, 107] }, // 밥 + 육수
	{ id: 116, name: '비빔밥', resultIngredientId: 216, ingredientIds: [101, 105] }, // 밥 + 양념육
	{ id: 117, name: '토스트', resultIngredientId: 217, ingredientIds: [103, 111] }, // 빵 + 잼
	{ id: 118, name: '샌드위치', resultIngredientId: 218, ingredientIds: [103, 105] }, // 빵 + 양념육
	{ id: 119, name: '햄버거', resultIngredientId: 219, ingredientIds: [103, 108] }, // 빵 + 구이
	{ id: 120, name: '피자', resultIngredientId: 220, ingredientIds: [102, 108] }, // 반죽 + 구이
	{ id: 121, name: '라면', resultIngredientId: 222, ingredientIds: [102, 106] }, // 반죽 + 양념장
	{ id: 122, name: '우동', resultIngredientId: 223, ingredientIds: [102, 107] }, // 반죽 + 육수
	{ id: 123, name: '냉면', resultIngredientId: 225, ingredientIds: [102, 112] }, // 반죽 + 얼음
	{ id: 124, name: '탕수육', resultIngredientId: 227, ingredientIds: [104, 110] }, // 다짐육 + 시럽
	{ id: 125, name: '깐풍기', resultIngredientId: 228, ingredientIds: [104, 106] }, // 다짐육 + 양념장
	{ id: 126, name: '카레', resultIngredientId: 229, ingredientIds: [105, 107] }, // 양념육 + 육수
	{ id: 127, name: '돈가스', resultIngredientId: 230, ingredientIds: [104, 103] }, // 다짐육 + 빵
	{ id: 128, name: '치킨', resultIngredientId: 231, ingredientIds: [105, 106] }, // 양념육 + 양념장
	{ id: 129, name: '족발', resultIngredientId: 232, ingredientIds: [105, 109] }, // 양념육 + 절임
	{ id: 130, name: '보쌈', resultIngredientId: 233, ingredientIds: [108, 109] }, // 구이 + 절임
	{ id: 131, name: '갈비찜', resultIngredientId: 234, ingredientIds: [108, 105] }, // 구이 + 양념육
	{ id: 132, name: '불고기', resultIngredientId: 235, ingredientIds: [106, 108] }, // 양념장 + 구이
	{ id: 133, name: '제육볶음', resultIngredientId: 236, ingredientIds: [105, 108] }, // 양념육 + 구이
	{ id: 134, name: '떡볶이', resultIngredientId: 238, ingredientIds: [101, 106] }, // 밥 + 양념장 (떡 대용)
	{ id: 135, name: '오므라이스', resultIngredientId: 240, ingredientIds: [101, 104] }, // 밥 + 다짐육
	{ id: 136, name: '리조또', resultIngredientId: 241, ingredientIds: [101, 107] }, // 밥 + 육수
	{ id: 137, name: '그라탕', resultIngredientId: 242, ingredientIds: [102, 103] }, // 반죽 + 빵
	{ id: 138, name: '스튜', resultIngredientId: 243, ingredientIds: [107, 108] }, // 육수 + 구이
	{ id: 139, name: '수프', resultIngredientId: 244, ingredientIds: [107, 107] }, // 육수 + 육수
	{ id: 140, name: '미역국', resultIngredientId: 245, ingredientIds: [107, 109] }, // 육수 + 절임
	{ id: 141, name: '된장국', resultIngredientId: 246, ingredientIds: [107, 105] }, // 육수 + 양념육
	{ id: 142, name: '김치찌개', resultIngredientId: 247, ingredientIds: [109, 107] }, // 절임 + 육수
	{ id: 143, name: '순두부찌개', resultIngredientId: 248, ingredientIds: [106, 107] }, // 양념장 + 육수
	{ id: 144, name: '부대찌개', resultIngredientId: 249, ingredientIds: [104, 107] }, // 다짐육 + 육수
	{ id: 145, name: '팥빙수', resultIngredientId: 250, ingredientIds: [112, 111] }, // 얼음 + 잼
	{ id: 146, name: '과일빙수', resultIngredientId: 251, ingredientIds: [112, 110] }, // 얼음 + 시럽
	{ id: 147, name: '타르트', resultIngredientId: 252, ingredientIds: [102, 110] }, // 반죽 + 시럽
	{ id: 148, name: '쿠키', resultIngredientId: 253, ingredientIds: [103, 103] }, // 빵 + 빵
	{ id: 149, name: '푸딩', resultIngredientId: 254, ingredientIds: [110, 111] }, // 시럽 + 잼
	{ id: 150, name: '마카롱', resultIngredientId: 255, ingredientIds: [111, 111] }, // 잼 + 잼
	{ id: 151, name: '크레페', resultIngredientId: 256, ingredientIds: [102, 109] }, // 반죽 + 절임
	{ id: 152, name: '와플', resultIngredientId: 257, ingredientIds: [103, 110] }, // 빵 + 시럽
	{ id: 153, name: '도넛', resultIngredientId: 258, ingredientIds: [103, 112] }, // 빵 + 얼음
	{ id: 154, name: '호떡', resultIngredientId: 260, ingredientIds: [101, 110] }, // 밥 + 시럽
	{ id: 155, name: '회덮밥', resultIngredientId: 262, ingredientIds: [101, 109] }, // 밥 + 절임

	// ========== E → D등급 (47개) ==========
	// D등급 재료 (13개)
	{ id: 201, name: '갈비', resultIngredientId: 301, ingredientIds: [207, 206] }, // 스테이크 + 조림
	{ id: 202, name: '삼겹살', resultIngredientId: 302, ingredientIds: [207, 214] }, // 스테이크 + 전
	{ id: 203, name: '회', resultIngredientId: 303, ingredientIds: [211, 202] }, // 초밥 + 김치
	{ id: 204, name: '탕', resultIngredientId: 304, ingredientIds: [204, 205] }, // 국 + 찌개
	{ id: 205, name: '전골', resultIngredientId: 305, ingredientIds: [205, 207] }, // 찌개 + 스테이크
	{ id: 206, name: '구절판재료', resultIngredientId: 306, ingredientIds: [214, 206] }, // 전 + 조림
	{ id: 207, name: '롤케이크', resultIngredientId: 307, ingredientIds: [209, 210] }, // 케이크 + 아이스크림
	{ id: 208, name: '티라미수', resultIngredientId: 308, ingredientIds: [209, 208] }, // 케이크 + 파이
	{ id: 209, name: '무스', resultIngredientId: 309, ingredientIds: [210, 208] }, // 아이스크림 + 파이
	{ id: 210, name: '짜장면', resultIngredientId: 310, ingredientIds: [201, 206] }, // 면 + 조림
	{ id: 211, name: '짬뽕', resultIngredientId: 311, ingredientIds: [201, 205] }, // 면 + 찌개
	{ id: 212, name: '오마카세', resultIngredientId: 312, ingredientIds: [211, 203] }, // 초밥 + 만두
	{ id: 213, name: '정식', resultIngredientId: 313, ingredientIds: [212, 204] }, // 덮밥 + 국
	// D등급 요리 (34개)
	{ id: 214, name: 'LA갈비', resultIngredientId: 314, ingredientIds: [207, 213] }, // 스테이크 + 볶음밥
	{ id: 215, name: '양념갈비', resultIngredientId: 315, ingredientIds: [206, 207] }, // 조림 + 스테이크
	{ id: 216, name: '소갈비찜', resultIngredientId: 316, ingredientIds: [206, 205] }, // 조림 + 찌개
	{ id: 217, name: '돼지갈비', resultIngredientId: 317, ingredientIds: [214, 207] }, // 전 + 스테이크
	{ id: 218, name: '삼겹살구이', resultIngredientId: 318, ingredientIds: [214, 213] }, // 전 + 볶음밥
	{ id: 219, name: '연어회', resultIngredientId: 321, ingredientIds: [211, 204] }, // 초밥 + 국
	{ id: 220, name: '광어회', resultIngredientId: 322, ingredientIds: [211, 214] }, // 초밥 + 전
	{ id: 221, name: '모둠회', resultIngredientId: 323, ingredientIds: [211, 211] }, // 초밥 + 초밥
	{ id: 222, name: '육회', resultIngredientId: 324, ingredientIds: [207, 202] }, // 스테이크 + 김치
	{ id: 223, name: '갈비탕', resultIngredientId: 325, ingredientIds: [204, 207] }, // 국 + 스테이크
	{ id: 224, name: '설렁탕', resultIngredientId: 326, ingredientIds: [204, 204] }, // 국 + 국
	{ id: 225, name: '곰탕', resultIngredientId: 327, ingredientIds: [205, 204] }, // 찌개 + 국
	{ id: 226, name: '삼계탕', resultIngredientId: 328, ingredientIds: [204, 213] }, // 국 + 볶음밥
	{ id: 227, name: '해물탕', resultIngredientId: 330, ingredientIds: [205, 211] }, // 찌개 + 초밥
	{ id: 228, name: '매운탕', resultIngredientId: 331, ingredientIds: [205, 202] }, // 찌개 + 김치
	{ id: 229, name: '샤브샤브', resultIngredientId: 332, ingredientIds: [207, 204] }, // 스테이크 + 국
	{ id: 230, name: '스키야키', resultIngredientId: 333, ingredientIds: [205, 214] }, // 찌개 + 전
	{ id: 231, name: '훠궈', resultIngredientId: 334, ingredientIds: [205, 203] }, // 찌개 + 만두
	{ id: 232, name: '카르보나라', resultIngredientId: 335, ingredientIds: [201, 209] }, // 면 + 케이크
	{ id: 233, name: '봉골레', resultIngredientId: 336, ingredientIds: [201, 211] }, // 면 + 초밥
	{ id: 234, name: '알리오올리오', resultIngredientId: 337, ingredientIds: [201, 214] }, // 면 + 전
	{ id: 235, name: '라자냐', resultIngredientId: 338, ingredientIds: [201, 207] }, // 면 + 스테이크
	{ id: 236, name: '뇨끼', resultIngredientId: 339, ingredientIds: [201, 208] }, // 면 + 파이
	{ id: 237, name: '딤섬', resultIngredientId: 340, ingredientIds: [203, 211] }, // 만두 + 초밥
	{ id: 238, name: '군만두', resultIngredientId: 341, ingredientIds: [203, 214] }, // 만두 + 전
	{ id: 239, name: '물만두', resultIngredientId: 342, ingredientIds: [203, 204] }, // 만두 + 국
	{ id: 240, name: '찐만두', resultIngredientId: 343, ingredientIds: [203, 205] }, // 만두 + 찌개
	{ id: 241, name: '교자', resultIngredientId: 344, ingredientIds: [203, 206] }, // 만두 + 조림
	{ id: 242, name: '슈마이', resultIngredientId: 345, ingredientIds: [203, 207] }, // 만두 + 스테이크
	{ id: 243, name: '하카우', resultIngredientId: 346, ingredientIds: [203, 203] }, // 만두 + 만두

	// ========== D → C등급 (39개) ==========
	// C등급 재료 (12개)
	{ id: 301, name: '한우', resultIngredientId: 401, ingredientIds: [301, 302] }, // 갈비 + 삼겹살
	{ id: 302, name: '참치회', resultIngredientId: 402, ingredientIds: [303, 312] }, // 회 + 오마카세
	{ id: 303, name: '랍스터', resultIngredientId: 403, ingredientIds: [303, 305] }, // 회 + 전골
	{ id: 304, name: '전복', resultIngredientId: 404, ingredientIds: [303, 304] }, // 회 + 탕
	{ id: 305, name: '킹크랩', resultIngredientId: 405, ingredientIds: [305, 312] }, // 전골 + 오마카세
	{ id: 306, name: '캐비어', resultIngredientId: 406, ingredientIds: [312, 303] }, // 오마카세 + 회
	{ id: 307, name: '한정식', resultIngredientId: 407, ingredientIds: [313, 306] }, // 정식 + 구절판재료
	{ id: 308, name: '코스요리', resultIngredientId: 408, ingredientIds: [313, 312] }, // 정식 + 오마카세
	{ id: 309, name: '밀푀유', resultIngredientId: 409, ingredientIds: [307, 308] }, // 롤케이크 + 티라미수
	{ id: 310, name: '슈크림', resultIngredientId: 410, ingredientIds: [308, 309] }, // 티라미수 + 무스
	{ id: 311, name: '북경오리', resultIngredientId: 411, ingredientIds: [301, 306] }, // 갈비 + 구절판재료
	{ id: 312, name: '양갈비', resultIngredientId: 412, ingredientIds: [301, 313] }, // 갈비 + 정식
	// C등급 요리 (27개)
	{ id: 313, name: '한우구이', resultIngredientId: 413, ingredientIds: [301, 301] }, // 갈비 + 갈비
	{ id: 314, name: '한우육회', resultIngredientId: 414, ingredientIds: [301, 303] }, // 갈비 + 회
	{ id: 315, name: '참치뱃살', resultIngredientId: 415, ingredientIds: [303, 313] }, // 회 + 정식
	{ id: 316, name: '대뱃살', resultIngredientId: 416, ingredientIds: [303, 303] }, // 회 + 회
	{ id: 317, name: '랍스터구이', resultIngredientId: 417, ingredientIds: [305, 301] }, // 전골 + 갈비
	{ id: 318, name: '랍스터찜', resultIngredientId: 418, ingredientIds: [305, 304] }, // 전골 + 탕
	{ id: 319, name: '전복구이', resultIngredientId: 419, ingredientIds: [304, 301] }, // 탕 + 갈비
	{ id: 320, name: '전복죽', resultIngredientId: 420, ingredientIds: [304, 313] }, // 탕 + 정식
	{ id: 321, name: '킹크랩찜', resultIngredientId: 421, ingredientIds: [305, 305] }, // 전골 + 전골
	{ id: 322, name: '킹크랩구이', resultIngredientId: 422, ingredientIds: [305, 306] }, // 전골 + 구절판재료
	{ id: 323, name: '양갈비구이', resultIngredientId: 423, ingredientIds: [301, 304] }, // 갈비 + 탕
	{ id: 324, name: '양갈비스테이크', resultIngredientId: 424, ingredientIds: [301, 312] }, // 갈비 + 오마카세
	{ id: 325, name: '북경오리구이', resultIngredientId: 425, ingredientIds: [306, 301] }, // 구절판재료 + 갈비
	{ id: 326, name: '오리훈제', resultIngredientId: 426, ingredientIds: [306, 304] }, // 구절판재료 + 탕
	{ id: 327, name: '에클레어', resultIngredientId: 427, ingredientIds: [307, 309] }, // 롤케이크 + 무스
	{ id: 328, name: '몽블랑', resultIngredientId: 428, ingredientIds: [308, 307] }, // 티라미수 + 롤케이크
	{ id: 329, name: '오페라', resultIngredientId: 429, ingredientIds: [309, 307] }, // 무스 + 롤케이크
	{ id: 330, name: '슈톨렌', resultIngredientId: 430, ingredientIds: [307, 307] }, // 롤케이크 + 롤케이크
	{ id: 331, name: '파네토네', resultIngredientId: 431, ingredientIds: [308, 308] }, // 티라미수 + 티라미수

	// ========== C → B등급 (31개) ==========
	// B등급 재료 (11개)
	{ id: 401, name: '와규', resultIngredientId: 501, ingredientIds: [401, 401] }, // 한우 + 한우
	{ id: 402, name: '오토로', resultIngredientId: 502, ingredientIds: [402, 402] }, // 참치회 + 참치회
	{ id: 403, name: '블루랍스터', resultIngredientId: 503, ingredientIds: [403, 403] }, // 랍스터 + 랍스터
	{ id: 404, name: '트러플', resultIngredientId: 504, ingredientIds: [406, 407] }, // 캐비어 + 한정식
	{ id: 405, name: '푸아그라', resultIngredientId: 505, ingredientIds: [411, 407] }, // 북경오리 + 한정식
	{ id: 406, name: '이베리코', resultIngredientId: 506, ingredientIds: [401, 412] }, // 한우 + 양갈비
	{ id: 407, name: '오마카세코스', resultIngredientId: 507, ingredientIds: [408, 402] }, // 코스요리 + 참치회
	{ id: 408, name: '프렌치코스', resultIngredientId: 508, ingredientIds: [408, 403] }, // 코스요리 + 랍스터
	{ id: 409, name: '가이세키', resultIngredientId: 509, ingredientIds: [407, 402] }, // 한정식 + 참치회
	{ id: 410, name: '웨딩케이크', resultIngredientId: 510, ingredientIds: [409, 410] }, // 밀푀유 + 슈크림
	{ id: 411, name: '크로캉부슈', resultIngredientId: 511, ingredientIds: [410, 409] }, // 슈크림 + 밀푀유
	// B등급 요리 (20개)
	{ id: 412, name: '와규스테이크', resultIngredientId: 512, ingredientIds: [401, 408] }, // 한우 + 코스요리
	{ id: 413, name: '와규초밥', resultIngredientId: 513, ingredientIds: [401, 402] }, // 한우 + 참치회
	{ id: 414, name: '오토로초밥', resultIngredientId: 514, ingredientIds: [402, 407] }, // 참치회 + 한정식
	{ id: 415, name: '오토로타타키', resultIngredientId: 515, ingredientIds: [402, 408] }, // 참치회 + 코스요리
	{ id: 416, name: '트러플파스타', resultIngredientId: 516, ingredientIds: [406, 408] }, // 캐비어 + 코스요리
	{ id: 417, name: '트러플리조또', resultIngredientId: 517, ingredientIds: [406, 401] }, // 캐비어 + 한우
	{ id: 418, name: '푸아그라스테이크', resultIngredientId: 518, ingredientIds: [411, 401] }, // 북경오리 + 한우
	{ id: 419, name: '푸아그라무스', resultIngredientId: 519, ingredientIds: [411, 409] }, // 북경오리 + 밀푀유
	{ id: 420, name: '이베리코구이', resultIngredientId: 520, ingredientIds: [412, 401] }, // 양갈비 + 한우
	{ id: 421, name: '이베리코샤브', resultIngredientId: 521, ingredientIds: [412, 407] }, // 양갈비 + 한정식
	{ id: 422, name: '블루랍스터구이', resultIngredientId: 522, ingredientIds: [403, 408] }, // 랍스터 + 코스요리
	{ id: 423, name: '블루랍스터테르미도르', resultIngredientId: 523, ingredientIds: [403, 401] }, // 랍스터 + 한우

	// ========== B → A등급 (20개) ==========
	// A등급 재료 (14개)
	{ id: 501, name: '최상급와규', resultIngredientId: 601, ingredientIds: [501, 501] }, // 와규 + 와규
	{ id: 502, name: '벨루가캐비어', resultIngredientId: 602, ingredientIds: [504, 507] }, // 트러플 + 오마카세코스
	{ id: 503, name: '알바트러플', resultIngredientId: 603, ingredientIds: [504, 504] }, // 트러플 + 트러플
	{ id: 504, name: '마츠타케', resultIngredientId: 604, ingredientIds: [509, 504] }, // 가이세키 + 트러플
	{ id: 505, name: '블루핀참치', resultIngredientId: 605, ingredientIds: [502, 502] }, // 오토로 + 오토로
	{ id: 506, name: '황제전복', resultIngredientId: 606, ingredientIds: [509, 503] }, // 가이세키 + 블루랍스터
	{ id: 507, name: '타라바가니', resultIngredientId: 607, ingredientIds: [503, 509] }, // 블루랍스터 + 가이세키
	{ id: 508, name: '미슐랭코스', resultIngredientId: 608, ingredientIds: [508, 507] }, // 프렌치코스 + 오마카세코스
	{ id: 509, name: '궁중요리', resultIngredientId: 609, ingredientIds: [509, 505] }, // 가이세키 + 푸아그라
	{ id: 510, name: '피에스몽테', resultIngredientId: 610, ingredientIds: [510, 511] }, // 웨딩케이크 + 크로캅부슈
	{ id: 511, name: '황실디저트', resultIngredientId: 611, ingredientIds: [511, 510] }, // 크로캅부슈 + 웨딩케이크
	{ id: 512, name: '분자요리', resultIngredientId: 612, ingredientIds: [508, 504] }, // 프렌치코스 + 트러플
	{ id: 513, name: '퓨전오마카세', resultIngredientId: 613, ingredientIds: [507, 509] }, // 오마카세코스 + 가이세키
	{ id: 514, name: '그랑크뤼', resultIngredientId: 614, ingredientIds: [510, 504] }, // 웨딩케이크 + 트러플

	// ========== A → R등급 (32개) ==========
	{ id: 601, name: '신선로', resultIngredientId: 701, ingredientIds: [609, 607] }, // 궁중요리 + 타라바가니
	{ id: 602, name: '구절판', resultIngredientId: 702, ingredientIds: [609, 608] }, // 궁중요리 + 미슐랭코스
	{ id: 603, name: '장흥삼합', resultIngredientId: 703, ingredientIds: [606, 601] }, // 황제전복 + 최상급와규
	{ id: 604, name: '삼계해물탕', resultIngredientId: 704, ingredientIds: [607, 609] }, // 타라바가니 + 궁중요리
	{ id: 605, name: '어복쟁반', resultIngredientId: 705, ingredientIds: [605, 609] }, // 블루핀참치 + 궁중요리
	{ id: 606, name: '비프웰링턴', resultIngredientId: 706, ingredientIds: [601, 608] }, // 최상급와규 + 미슐랭코스
	{ id: 607, name: '트러플카르보나라', resultIngredientId: 707, ingredientIds: [603, 608] }, // 알바트러플 + 미슐랭코스
	{ id: 608, name: '코키유생자크', resultIngredientId: 708, ingredientIds: [606, 608] }, // 황제전복 + 미슐랭코스
	{ id: 609, name: '부야베스', resultIngredientId: 709, ingredientIds: [607, 608] }, // 타라바가니 + 미슐랭코스
	{ id: 610, name: '부르기뇽', resultIngredientId: 710, ingredientIds: [601, 603] }, // 최상급와규 + 알바트러플
	{ id: 611, name: '북경오리구이정식', resultIngredientId: 711, ingredientIds: [609, 613] }, // 궁중요리 + 퓨전오마카세
	{ id: 612, name: '동파육', resultIngredientId: 712, ingredientIds: [601, 609] }, // 최상급와규 + 궁중요리
	{ id: 613, name: '불도장', resultIngredientId: 713, ingredientIds: [606, 607] }, // 황제전복 + 타라바가니
	{ id: 614, name: '청초해분', resultIngredientId: 714, ingredientIds: [605, 607] }, // 블루핀참치 + 타라바가니
	{ id: 615, name: '좌종당계', resultIngredientId: 715, ingredientIds: [609, 603] }, // 궁중요리 + 알바트러플
	{ id: 616, name: '오토로초밥오마카세', resultIngredientId: 716, ingredientIds: [605, 613] }, // 블루핀참치 + 퓨전오마카세
	{ id: 617, name: '마츠바가니', resultIngredientId: 717, ingredientIds: [607, 604] }, // 타라바가니 + 마츠타케
	{ id: 618, name: '스키야키정식', resultIngredientId: 718, ingredientIds: [601, 613] }, // 최상급와규 + 퓨전오마카세
	{ id: 619, name: '참치삼중주', resultIngredientId: 719, ingredientIds: [605, 605] }, // 블루핀참치 + 블루핀참치
	{ id: 620, name: '해물오마카세', resultIngredientId: 720, ingredientIds: [607, 613] }, // 타라바가니 + 퓨전오마카세
	{ id: 621, name: '전복리소토', resultIngredientId: 721, ingredientIds: [606, 603] }, // 황제전복 + 알바트러플
	{ id: 622, name: '싱가포르칠리크랩', resultIngredientId: 722, ingredientIds: [607, 612] }, // 타라바가니 + 분자요리
	{ id: 623, name: '랍스터테르미도르', resultIngredientId: 723, ingredientIds: [607, 602] }, // 타라바가니 + 벨루가캐비어
	{ id: 624, name: '대게테르미도르', resultIngredientId: 724, ingredientIds: [607, 601] }, // 타라바가니 + 최상급와규
	{ id: 625, name: '푸아그라스페셜', resultIngredientId: 725, ingredientIds: [603, 609] }, // 알바트러플 + 궁중요리
	{ id: 626, name: '오페라케이크', resultIngredientId: 726, ingredientIds: [610, 611] }, // 피에스몽테 + 황실디저트
	{ id: 627, name: '크로캅부슈타워', resultIngredientId: 727, ingredientIds: [611, 610] }, // 황실디저트 + 피에스몽테
	{ id: 628, name: '밀푀유스페셜', resultIngredientId: 728, ingredientIds: [610, 614] }, // 피에스몽테 + 그랑크뤼
	{ id: 629, name: '베이크드알래스카', resultIngredientId: 729, ingredientIds: [611, 614] }, // 황실디저트 + 그랑크뤼
	{ id: 630, name: '초콜릿퐁듀', resultIngredientId: 730, ingredientIds: [614, 610] }, // 그랑크뤼 + 피에스몽테
	{ id: 631, name: '황제의만찬', resultIngredientId: 731, ingredientIds: [608, 609] }, // 미슐랭코스 + 궁중요리
	{ id: 632, name: '미슐랭삼성', resultIngredientId: 732, ingredientIds: [608, 608] } // 미슐랭코스 + 미슐랭코스
];
