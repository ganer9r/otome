import type { Ingredient } from '../types';

/**
 * 재료 + 요리 데이터
 * G: 8개, F: 27개, E: 63개, D: 46개, C: 31개, B: 23개, A: 32개, R: 32개
 * 총: 277개 (재료 82개 + 요리 195개)
 *
 * imageUrl 매핑: cook/ 기존 이미지 재사용 (이름 기반 매칭)
 */
export const INGREDIENTS_DATA: Ingredient[] = [
	// ========== G등급 (8개) - 기본 원소 ==========
	{ id: 1, name: '쌀', grade: 'G', isIngredient: true, imageUrl: '/imgs/ingredients2/28.webp' }, // 쌀
	{ id: 2, name: '밀', grade: 'G', isIngredient: true, imageUrl: '/imgs/ingredients2/29.webp' }, // 밀
	{ id: 3, name: '고기', grade: 'G', isIngredient: true, imageUrl: '/imgs/ingredients2/16.webp' }, // 소고기
	{ id: 4, name: '해물', grade: 'G', isIngredient: true, imageUrl: '/imgs/ingredients2/22.webp' }, // 새우
	{ id: 5, name: '채소', grade: 'G', isIngredient: true, imageUrl: '/imgs/ingredients2/6.webp' }, // 배추
	{ id: 6, name: '과일', grade: 'G', isIngredient: true, imageUrl: '/imgs/ingredients2/34.webp' }, // 사과
	{ id: 7, name: '물', grade: 'G', isIngredient: true, imageUrl: '/imgs/ingredients2/32.webp' }, // 우유
	{ id: 8, name: '불', grade: 'G', isIngredient: true, imageUrl: '/imgs/ingredients2/15.webp' }, // 고추

	// ========== F등급 (27개) - 재료 12개 + 요리 15개 ==========
	// F등급 재료 (12개)
	{ id: 101, name: '밥', grade: 'F', isIngredient: true, imageUrl: '/imgs/ingredients2/109.webp' }, // 밥
	{ id: 102, name: '반죽', grade: 'F', isIngredient: true, imageUrl: '/imgs/ingredients2/110.webp' }, // 밀가루
	{ id: 103, name: '빵', grade: 'F', isIngredient: true, imageUrl: '/imgs/ingredients2/110.webp' }, // 밀가루
	{
		id: 104,
		name: '다짐육',
		grade: 'F',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/17.webp'
	}, // 돼지고기
	{
		id: 105,
		name: '양념육',
		grade: 'F',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/300.webp'
	}, // 불고기
	{
		id: 106,
		name: '양념장',
		grade: 'F',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/204.webp'
	}, // 양념장
	{ id: 107, name: '육수', grade: 'F', isIngredient: true, imageUrl: '/imgs/ingredients2/103.webp' }, // 소고기육수
	{ id: 108, name: '구이', grade: 'F', isIngredient: true, imageUrl: '/imgs/ingredients2/312.webp' }, // 스테이크
	{ id: 109, name: '절임', grade: 'F', isIngredient: true, imageUrl: '/imgs/ingredients2/115.webp' }, // 식초
	{ id: 110, name: '시럽', grade: 'F', isIngredient: true, imageUrl: '/imgs/ingredients2/121.webp' }, // 설탕시럽
	{ id: 111, name: '잼', grade: 'F', isIngredient: true, imageUrl: '/imgs/ingredients2/36.webp' }, // 딸기
	{ id: 112, name: '얼음', grade: 'F', isIngredient: true, imageUrl: '/imgs/ingredients2/32.webp' }, // 우유
	// F등급 요리 (15개)
	{
		id: 113,
		name: '해물무침',
		grade: 'F',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/341.webp'
	}, // 해물볶음
	{
		id: 114,
		name: '구운해물',
		grade: 'F',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/314.webp'
	}, // 새우구이
	{
		id: 115,
		name: '샐러드',
		grade: 'F',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/11.webp'
	}, // 양상추
	{
		id: 116,
		name: '볶음',
		grade: 'F',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/302.webp'
	}, // 버섯볶음
	{
		id: 117,
		name: '과일청',
		grade: 'F',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/121.webp'
	}, // 설탕시럽
	{ id: 118, name: '주스', grade: 'F', isIngredient: false, imageUrl: '/imgs/ingredients2/37.webp' }, // 레몬
	{
		id: 119,
		name: '누룽지',
		grade: 'F',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/109.webp'
	}, // 밥
	{ id: 120, name: '쌈', grade: 'F', isIngredient: false, imageUrl: '/imgs/ingredients2/11.webp' }, // 양상추
	{ id: 121, name: '젓갈', grade: 'F', isIngredient: false, imageUrl: '/imgs/ingredients2/24.webp' }, // 조개
	{
		id: 122,
		name: '해물육수',
		grade: 'F',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/105.webp'
	}, // 다시
	{ id: 123, name: '떡', grade: 'F', isIngredient: true, imageUrl: '/imgs/ingredients2/28.webp' }, // 쌀
	{
		id: 124,
		name: '튀김옷',
		grade: 'F',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루
	{
		id: 125,
		name: '피자도우',
		grade: 'F',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루
	{
		id: 126,
		name: '소시지',
		grade: 'F',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/114.webp'
	}, // 베이컨
	{ id: 127, name: '묵', grade: 'F', isIngredient: false, imageUrl: '/imgs/ingredients2/106.webp' }, // 두부

	// ========== E등급 (63개) - 재료 14개 + 요리 49개 ==========
	// E등급 재료 (14개)
	{ id: 201, name: '면', grade: 'E', isIngredient: true, imageUrl: '/imgs/ingredients2/207.webp' }, // 파스타면
	{ id: 202, name: '김치', grade: 'E', isIngredient: true, imageUrl: '/imgs/ingredients2/6.webp' }, // 배추
	{ id: 203, name: '만두', grade: 'E', isIngredient: true, imageUrl: '/imgs/ingredients2/329.webp' }, // 군만두
	{ id: 204, name: '국', grade: 'E', isIngredient: true, imageUrl: '/imgs/ingredients2/219.webp' }, // 된장국
	{ id: 205, name: '찌개', grade: 'E', isIngredient: true, imageUrl: '/imgs/ingredients2/219.webp' }, // 된장국
	{ id: 206, name: '조림', grade: 'E', isIngredient: true, imageUrl: '/imgs/ingredients2/309.webp' }, // 두부조림
	{
		id: 207,
		name: '스테이크',
		grade: 'E',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/312.webp'
	}, // 스테이크
	{ id: 208, name: '파이', grade: 'E', isIngredient: true, imageUrl: '/imgs/ingredients2/226.webp' }, // 파이반죽
	{
		id: 209,
		name: '케이크',
		grade: 'E',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/227.webp'
	}, // 스펀지케이크
	{
		id: 210,
		name: '아이스크림',
		grade: 'E',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/348.webp'
	}, // 아이스크림
	{ id: 211, name: '초밥', grade: 'E', isIngredient: true, imageUrl: '/imgs/ingredients2/332.webp' }, // 연어초밥
	{ id: 212, name: '덮밥', grade: 'E', isIngredient: true, imageUrl: '/imgs/ingredients2/336.webp' }, // 소고기덮밥
	{
		id: 213,
		name: '볶음밥',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/326.webp'
	}, // 계란볶음밥
	{ id: 214, name: '전', grade: 'E', isIngredient: false, imageUrl: '/imgs/ingredients2/203.webp' }, // 지단
	// E등급 요리 (49개)
	{
		id: 215,
		name: '국밥',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/109.webp'
	}, // 밥
	{
		id: 216,
		name: '비빔밥',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/503.webp'
	}, // 비빔밥
	{
		id: 217,
		name: '토스트',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루
	{
		id: 218,
		name: '샌드위치',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루
	{
		id: 219,
		name: '햄버거',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/114.webp'
	}, // 베이컨
	{
		id: 220,
		name: '피자',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/112.webp'
	}, // 치즈
	{
		id: 221,
		name: '파스타',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/316.webp'
	}, // 토마토파스타
	{
		id: 222,
		name: '라면',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/424.webp'
	}, // 라멘
	{
		id: 223,
		name: '우동',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/221.webp'
	}, // 우동
	{
		id: 224,
		name: '쌀국수',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/207.webp'
	}, // 파스타면
	{
		id: 225,
		name: '냉면',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/207.webp'
	}, // 파스타면
	{
		id: 226,
		name: '잡채',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/328.webp'
	}, // 볶음면
	{
		id: 227,
		name: '탕수육',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/416.webp'
	}, // 탕수육
	{
		id: 228,
		name: '깐풍기',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/515.webp'
	}, // 깐풍기
	{
		id: 229,
		name: '카레',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/211.webp'
	}, // 중화소스
	{
		id: 230,
		name: '돈가스',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/415.webp'
	}, // 돈까스
	{
		id: 231,
		name: '치킨',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/323.webp'
	}, // 로스트치킨
	{ id: 232, name: '족발', grade: 'E', isIngredient: false, imageUrl: '/imgs/ingredients2/17.webp' }, // 돼지고기
	{ id: 233, name: '보쌈', grade: 'E', isIngredient: false, imageUrl: '/imgs/ingredients2/17.webp' }, // 돼지고기
	{
		id: 234,
		name: '갈비찜',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/505.webp'
	}, // 갈비찜
	{
		id: 235,
		name: '불고기',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/300.webp'
	}, // 불고기
	{
		id: 236,
		name: '제육볶음',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/307.webp'
	}, // 오징어볶음
	{
		id: 237,
		name: '닭갈비',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/18.webp'
	}, // 닭
	{
		id: 238,
		name: '떡볶이',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/102.webp'
	}, // 고추장
	{ id: 239, name: '순대', grade: 'E', isIngredient: false, imageUrl: '/imgs/ingredients2/17.webp' }, // 돼지고기
	{
		id: 240,
		name: '오므라이스',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/315.webp'
	}, // 오믈렛
	{
		id: 241,
		name: '리조또',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/339.webp'
	}, // 리소토
	{
		id: 242,
		name: '그라탕',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/319.webp'
	}, // 그라탕
	{
		id: 243,
		name: '스튜',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/342.webp'
	}, // 크랩스튜
	{
		id: 244,
		name: '수프',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/324.webp'
	}, // 머쉬룸수프
	{
		id: 245,
		name: '미역국',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/310.webp'
	}, // 미역국
	{
		id: 246,
		name: '된장국',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/219.webp'
	}, // 된장국
	{
		id: 247,
		name: '김치찌개',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/102.webp'
	}, // 고추장
	{
		id: 248,
		name: '순두부찌개',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/106.webp'
	}, // 두부
	{
		id: 249,
		name: '부대찌개',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/114.webp'
	}, // 베이컨
	{
		id: 250,
		name: '팥빙수',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/348.webp'
	}, // 아이스크림
	{
		id: 251,
		name: '과일빙수',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/348.webp'
	}, // 아이스크림
	{
		id: 252,
		name: '타르트',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/346.webp'
	}, // 애플파이
	{ id: 253, name: '쿠키', grade: 'E', isIngredient: false, imageUrl: '/imgs/ingredients2/40.webp' }, // 아몬드
	{
		id: 254,
		name: '푸딩',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/345.webp'
	}, // 카라멜푸딩
	{
		id: 255,
		name: '마카롱',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/40.webp'
	}, // 아몬드
	{
		id: 256,
		name: '크레페',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루
	{
		id: 257,
		name: '와플',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루
	{
		id: 258,
		name: '도넛',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루
	{
		id: 259,
		name: '츄러스',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루
	{
		id: 260,
		name: '호떡',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루
	{
		id: 261,
		name: '붕어빵',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루
	{
		id: 262,
		name: '회덮밥',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/334.webp'
	}, // 연어회
	{
		id: 263,
		name: '물회',
		grade: 'E',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/334.webp'
	}, // 연어회

	// ========== D등급 (46개) - 재료 13개 + 요리 33개 ==========
	// D등급 재료 (13개)
	{ id: 301, name: '갈비', grade: 'D', isIngredient: true, imageUrl: '/imgs/ingredients2/505.webp' }, // 갈비찜
	{
		id: 302,
		name: '삼겹살',
		grade: 'D',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/331.webp'
	}, // 삼겹살구이
	{ id: 303, name: '회', grade: 'D', isIngredient: true, imageUrl: '/imgs/ingredients2/334.webp' }, // 연어회
	{ id: 304, name: '탕', grade: 'D', isIngredient: true, imageUrl: '/imgs/ingredients2/400.webp' }, // 삼계탕
	{ id: 305, name: '전골', grade: 'D', isIngredient: true, imageUrl: '/imgs/ingredients2/401.webp' }, // 불고기전골
	{
		id: 306,
		name: '구절판재료',
		grade: 'D',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/404.webp'
	}, // 나물모듬
	{
		id: 307,
		name: '롤케이크',
		grade: 'D',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/344.webp'
	}, // 생크림케이크
	{
		id: 308,
		name: '티라미수',
		grade: 'D',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/530.webp'
	}, // 티라미수
	{ id: 309, name: '무스', grade: 'D', isIngredient: true, imageUrl: '/imgs/ingredients2/223.webp' }, // 초코크림
	{
		id: 310,
		name: '짜장면',
		grade: 'D',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/327.webp'
	}, // 짜장면
	{ id: 311, name: '짬뽕', grade: 'D', isIngredient: true, imageUrl: '/imgs/ingredients2/418.webp' }, // 짬뽕
	{
		id: 312,
		name: '오마카세',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/619.webp'
	}, // 오마카세
	{
		id: 313,
		name: '정식',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/601.webp'
	}, // 한정식
	// D등급 요리 (33개)
	{
		id: 314,
		name: 'LA갈비',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/505.webp'
	}, // 갈비찜
	{
		id: 315,
		name: '양념갈비',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/505.webp'
	}, // 갈비찜
	{
		id: 316,
		name: '소갈비찜',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/505.webp'
	}, // 갈비찜
	{
		id: 317,
		name: '돼지갈비',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/505.webp'
	}, // 갈비찜
	{
		id: 318,
		name: '삼겹살구이',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/331.webp'
	}, // 삼겹살구이
	{
		id: 319,
		name: '대패삼겹',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/331.webp'
	}, // 삼겹살구이
	{
		id: 320,
		name: '항정살',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/17.webp'
	}, // 돼지고기
	{
		id: 321,
		name: '연어회',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/334.webp'
	}, // 연어회
	{
		id: 322,
		name: '광어회',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/334.webp'
	}, // 연어회
	{
		id: 323,
		name: '모둠회',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/422.webp'
	}, // 사시미
	{ id: 324, name: '육회', grade: 'D', isIngredient: false, imageUrl: '/imgs/ingredients2/16.webp' }, // 소고기
	{
		id: 325,
		name: '갈비탕',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/103.webp'
	}, // 소고기육수
	{
		id: 326,
		name: '설렁탕',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/103.webp'
	}, // 소고기육수
	{
		id: 327,
		name: '곰탕',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/103.webp'
	}, // 소고기육수
	{
		id: 328,
		name: '삼계탕',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/400.webp'
	}, // 삼계탕
	{
		id: 329,
		name: '추어탕',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/105.webp'
	}, // 다시
	{
		id: 330,
		name: '해물탕',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/506.webp'
	}, // 해물탕
	{
		id: 331,
		name: '매운탕',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/102.webp'
	}, // 고추장
	{
		id: 332,
		name: '샤브샤브',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/524.webp'
	}, // 샤브샤브
	{
		id: 333,
		name: '스키야키',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/732.webp'
	}, // 스키야키
	{
		id: 334,
		name: '훠궈',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/524.webp'
	}, // 샤브샤브
	{
		id: 335,
		name: '카르보나라',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/409.webp'
	}, // 카르보나라
	{
		id: 336,
		name: '봉골레',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/410.webp'
	}, // 해물파스타
	{
		id: 337,
		name: '알리오올리오',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/318.webp'
	}, // 알리오올리오
	{
		id: 338,
		name: '라자냐',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/319.webp'
	}, // 그라탕
	{
		id: 339,
		name: '뇨끼',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/207.webp'
	}, // 파스타면
	{
		id: 340,
		name: '딤섬',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/329.webp'
	}, // 군만두
	{
		id: 341,
		name: '군만두',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/329.webp'
	}, // 군만두
	{
		id: 342,
		name: '물만두',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/329.webp'
	}, // 군만두
	{
		id: 343,
		name: '찐만두',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/329.webp'
	}, // 군만두
	{
		id: 344,
		name: '교자',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/329.webp'
	}, // 군만두
	{
		id: 345,
		name: '슈마이',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/329.webp'
	}, // 군만두
	{
		id: 346,
		name: '하카우',
		grade: 'D',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/329.webp'
	}, // 군만두

	// ========== C등급 (31개) - 재료 12개 + 요리 19개 ==========
	// C등급 재료 (12개)
	{ id: 401, name: '한우', grade: 'C', isIngredient: true, imageUrl: '/imgs/ingredients2/16.webp' }, // 소고기
	{
		id: 402,
		name: '참치회',
		grade: 'C',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/335.webp'
	}, // 참치회
	{
		id: 403,
		name: '랍스터',
		grade: 'C',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/120.webp'
	}, // 랍스터
	{ id: 404, name: '전복', grade: 'C', isIngredient: true, imageUrl: '/imgs/ingredients2/25.webp' }, // 전복
	{
		id: 405,
		name: '킹크랩',
		grade: 'C',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/33.webp'
	}, // 게
	{
		id: 406,
		name: '캐비어',
		grade: 'C',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/24.webp'
	}, // 조개
	{
		id: 407,
		name: '한정식',
		grade: 'C',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/601.webp'
	}, // 한정식
	{
		id: 408,
		name: '코스요리',
		grade: 'C',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/600.webp'
	}, // 전골정식
	{
		id: 409,
		name: '밀푀유',
		grade: 'C',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/752.webp'
	}, // 밀푀유
	{
		id: 410,
		name: '슈크림',
		grade: 'C',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/225.webp'
	}, // 슈크림
	{
		id: 411,
		name: '북경오리',
		grade: 'C',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/611.webp'
	}, // 베이징덕
	{
		id: 412,
		name: '양갈비',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/16.webp'
	}, // 소고기
	// C등급 요리 (19개)
	{
		id: 413,
		name: '한우구이',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/312.webp'
	}, // 스테이크
	{
		id: 414,
		name: '한우육회',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/16.webp'
	}, // 소고기
	{
		id: 415,
		name: '참치뱃살',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/335.webp'
	}, // 참치회
	{
		id: 416,
		name: '대뱃살',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/335.webp'
	}, // 참치회
	{
		id: 417,
		name: '랍스터구이',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/343.webp'
	}, // 랍스터구이
	{
		id: 418,
		name: '랍스터찜',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/429.webp'
	}, // 랍스터찜
	{
		id: 419,
		name: '전복구이',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/305.webp'
	}, // 전복찜
	{
		id: 420,
		name: '전복죽',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/109.webp'
	}, // 밥
	{
		id: 421,
		name: '킹크랩찜',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/425.webp'
	}, // 대게찜
	{
		id: 422,
		name: '킹크랩구이',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/338.webp'
	}, // 게찜
	{
		id: 423,
		name: '양갈비구이',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/312.webp'
	}, // 스테이크
	{
		id: 424,
		name: '양갈비스테이크',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/312.webp'
	}, // 스테이크
	{
		id: 425,
		name: '북경오리구이',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/720.webp'
	}, // 북경 오리구이
	{
		id: 426,
		name: '오리훈제',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/419.webp'
	}, // 오리구이
	{
		id: 427,
		name: '에클레어',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/225.webp'
	}, // 슈크림
	{
		id: 428,
		name: '몽블랑',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/344.webp'
	}, // 생크림케이크
	{
		id: 429,
		name: '오페라',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/627.webp'
	}, // 오페라
	{
		id: 430,
		name: '슈톨렌',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루
	{
		id: 431,
		name: '파네토네',
		grade: 'C',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/110.webp'
	}, // 밀가루

	// ========== B등급 (23개) - 재료 11개 + 요리 12개 ==========
	// B등급 재료 (11개)
	{ id: 501, name: '와규', grade: 'B', isIngredient: true, imageUrl: '/imgs/ingredients2/16.webp' }, // 소고기
	{
		id: 502,
		name: '오토로',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/616.webp'
	}, // 오토로사시미
	{
		id: 503,
		name: '블루랍스터',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/120.webp'
	}, // 랍스터
	{ id: 504, name: '트러플', grade: 'B', isIngredient: true, imageUrl: '/imgs/ingredients2/3.webp' }, // 버섯
	{
		id: 505,
		name: '푸아그라',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/744.webp'
	}, // 푸아그라
	{
		id: 506,
		name: '이베리코',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/17.webp'
	}, // 돼지고기
	{
		id: 507,
		name: '오마카세코스',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/619.webp'
	}, // 오마카세
	{
		id: 508,
		name: '프렌치코스',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/600.webp'
	}, // 전골정식
	{
		id: 509,
		name: '가이세키',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/617.webp'
	}, // 가이세키
	{
		id: 510,
		name: '웨딩케이크',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/344.webp'
	}, // 생크림케이크
	{
		id: 511,
		name: '크로캉부슈',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/751.webp'
	}, // 크로캅부슈
	// B등급 요리 (12개)
	{
		id: 512,
		name: '와규스테이크',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/512.webp'
	}, // 티본스테이크
	{
		id: 513,
		name: '와규초밥',
		grade: 'B',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/421.webp'
	}, // 모듬초밥
	{
		id: 514,
		name: '오토로초밥',
		grade: 'B',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/730.webp'
	}, // 오토로 초밥
	{
		id: 515,
		name: '오토로타타키',
		grade: 'B',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/616.webp'
	}, // 오토로사시미
	{
		id: 516,
		name: '트러플파스타',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/508.webp'
	}, // 트러플파스타
	{
		id: 517,
		name: '트러플리조또',
		grade: 'B',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/607.webp'
	}, // 트러플리조또
	{
		id: 518,
		name: '푸아그라스테이크',
		grade: 'B',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/744.webp'
	}, // 푸아그라
	{
		id: 519,
		name: '푸아그라무스',
		grade: 'B',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/744.webp'
	}, // 푸아그라
	{
		id: 520,
		name: '이베리코구이',
		grade: 'B',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/331.webp'
	}, // 삼겹살구이
	{
		id: 521,
		name: '이베리코샤브',
		grade: 'B',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/524.webp'
	}, // 샤브샤브
	{
		id: 522,
		name: '블루랍스터구이',
		grade: 'B',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/343.webp'
	}, // 랍스터구이
	{
		id: 523,
		name: '블루랍스터테르미도르',
		grade: 'B',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/742.webp'
	}, // 랍스터 테르미도르

	// ========== A등급 (32개) - 재료 14개 + 요리 18개 ==========
	// A등급 재료 (14개)
	{
		id: 601,
		name: '최상급와규',
		grade: 'A',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/16.webp'
	}, // 소고기
	{
		id: 602,
		name: '벨루가캐비어',
		grade: 'A',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/24.webp'
	}, // 조개
	{
		id: 603,
		name: '알바트러플',
		grade: 'A',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/3.webp'
	}, // 버섯
	{
		id: 604,
		name: '마츠타케',
		grade: 'A',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/3.webp'
	}, // 버섯
	{
		id: 605,
		name: '블루핀참치',
		grade: 'A',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/21.webp'
	}, // 참치
	{
		id: 606,
		name: '황제전복',
		grade: 'A',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/25.webp'
	}, // 전복
	{
		id: 607,
		name: '타라바가니',
		grade: 'A',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/618.webp'
	}, // 타라바가니
	{
		id: 608,
		name: '미슐랭코스',
		grade: 'A',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/600.webp'
	}, // 전골정식
	{
		id: 609,
		name: '궁중요리',
		grade: 'A',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/500.webp'
	}, // 궁중전골
	{
		id: 610,
		name: '피에스몽테',
		grade: 'A',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/628.webp'
	}, // 크로캉부슈타워
	{
		id: 611,
		name: '황실디저트',
		grade: 'A',
		isIngredient: true,
		imageUrl: '/imgs/ingredients2/344.webp'
	}, // 생크림케이크
	{
		id: 612,
		name: '분자요리',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/619.webp'
	}, // 오마카세
	{
		id: 613,
		name: '퓨전오마카세',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/619.webp'
	}, // 오마카세
	{
		id: 614,
		name: '그랑크뤼',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/38.webp'
	}, // 포도
	// A등급 요리 (18개)
	{
		id: 615,
		name: '와규풀코스',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/512.webp'
	}, // 티본스테이크
	{
		id: 616,
		name: '캐비어테이스팅',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/24.webp'
	}, // 조개
	{
		id: 617,
		name: '트러플디너',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/607.webp'
	}, // 트러플리조또
	{
		id: 618,
		name: '참치오마카세',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/616.webp'
	}, // 오토로사시미
	{
		id: 619,
		name: '전복정식',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/605.webp'
	}, // 전복해물탕
	{
		id: 620,
		name: '대게코스',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/523.webp'
	}, // 대게정식
	{
		id: 621,
		name: '궁중정식',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/500.webp'
	}, // 궁중전골
	{
		id: 622,
		name: '수라상',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/601.webp'
	}, // 한정식
	{
		id: 623,
		name: '어선회',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/422.webp'
	}, // 사시미
	{
		id: 624,
		name: '분자칵테일',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/37.webp'
	}, // 레몬
	{
		id: 625,
		name: '디저트오마카세',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/344.webp'
	}, // 생크림케이크
	{
		id: 626,
		name: '프티푸르',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/40.webp'
	}, // 아몬드
	{
		id: 627,
		name: '셰프테이블',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/600.webp'
	}, // 전골정식
	{
		id: 628,
		name: '시그니처코스',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/600.webp'
	}, // 전골정식
	{
		id: 629,
		name: '테이스팅메뉴',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/600.webp'
	}, // 전골정식
	{
		id: 630,
		name: '페어링디너',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/600.webp'
	}, // 전골정식
	{
		id: 631,
		name: '프레스티지',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/631.webp'
	}, // 퐁듀타워
	{
		id: 632,
		name: '그랑메종',
		grade: 'A',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/600.webp'
	}, // 전골정식

	// ========== R등급 (16개) - 전설급 요리 ==========
	{
		id: 701,
		name: '신선로',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/700.webp'
	}, // 신선로
	{
		id: 702,
		name: '구절판',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/701.webp'
	}, // 구절판
	{
		id: 706,
		name: '비프웰링턴',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/710.webp'
	}, // 비프 웰링턴
	{
		id: 707,
		name: '트러플카르보나라',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/711.webp'
	}, // 트러플 카르보나라
	{
		id: 708,
		name: '코키유생자크',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/712.webp'
	}, // 코키유 생 자크
	{
		id: 709,
		name: '부야베스',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/713.webp'
	}, // 부야베스
	{
		id: 710,
		name: '부르기뇽',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/714.webp'
	}, // 부르기뇽
	{
		id: 711,
		name: '북경오리구이정식',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/720.webp'
	}, // 북경 오리구이
	{
		id: 712,
		name: '동파육',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/721.webp'
	}, // 동파육
	{
		id: 713,
		name: '불도장',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/722.webp'
	}, // 불도장
	{
		id: 716,
		name: '오토로초밥오마카세',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/730.webp'
	}, // 오토로 초밥
	{
		id: 721,
		name: '전복리소토',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/740.webp'
	}, // 전복 리소토
	{
		id: 722,
		name: '싱가포르칠리크랩',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/741.webp'
	}, // 싱가포르 칠리 크랩
	{
		id: 723,
		name: '랍스터테르미도르',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/742.webp'
	}, // 랍스터 테르미도르
	{
		id: 726,
		name: '오페라케이크',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/750.webp'
	}, // 오페라 케이크
	{
		id: 730,
		name: '초콜릿퐁듀',
		grade: 'R',
		isIngredient: false,
		imageUrl: '/imgs/ingredients2/754.webp'
	} // 초콜릿 퐁듀
];
