import type { Ingredient } from '../types';

/**
 * 재료 + 요리 데이터 (가격 하드코딩)
 *
 * 구매가 (buyPrice): 재료만, 등급별 기준 ± 변동 (10원 단위)
 *   G: 40~60, F: 70~100, E: 100~150, D: 150~220, C: 200~300, B: 280~420, A: 400~600, R: 640~960
 *
 * 판매가 (sellPrice): 요리만, 재료비 × 2~3배 (10원 단위)
 *
 * 총: 277개 (재료 82개 + 요리 195개)
 */
export const INGREDIENTS_DATA: Ingredient[] = [
	// ========== G등급 (8개) - 기본 원소 ==========
	{
		id: 1,
		name: '쌀',
		grade: 'G',
		isIngredient: true,
		buyPrice: 50,
		sellPrice: 110,
		imageUrl: '/imgs/ingredients2/28.webp'
	},
	{
		id: 2,
		name: '밀',
		grade: 'G',
		isIngredient: true,
		buyPrice: 40,
		sellPrice: 90,
		imageUrl: '/imgs/ingredients2/29.webp'
	},
	{
		id: 3,
		name: '고기',
		grade: 'G',
		isIngredient: true,
		buyPrice: 60,
		sellPrice: 140,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	{
		id: 4,
		name: '해물',
		grade: 'G',
		isIngredient: true,
		buyPrice: 50,
		sellPrice: 120,
		imageUrl: '/imgs/ingredients2/22.webp'
	},
	{
		id: 5,
		name: '채소',
		grade: 'G',
		isIngredient: true,
		buyPrice: 40,
		sellPrice: 100,
		imageUrl: '/imgs/ingredients2/6.webp'
	},
	{
		id: 6,
		name: '과일',
		grade: 'G',
		isIngredient: true,
		buyPrice: 50,
		sellPrice: 110,
		imageUrl: '/imgs/ingredients2/34.webp'
	},
	{
		id: 7,
		name: '물',
		grade: 'G',
		isIngredient: true,
		buyPrice: 40,
		sellPrice: 90,
		imageUrl: '/imgs/ingredients2/32.webp'
	},
	{
		id: 8,
		name: '불',
		grade: 'G',
		isIngredient: true,
		buyPrice: 60,
		sellPrice: 150,
		imageUrl: '/imgs/ingredients2/15.webp'
	},

	// ========== F등급 (27개) - 재료 12개 + 요리 15개 ==========
	// F등급 재료 (12개) - sellPrice는 buyPrice의 2~2.5배
	{
		id: 101,
		name: '밥',
		grade: 'F',
		isIngredient: true,
		buyPrice: 80,
		sellPrice: 180,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 102,
		name: '반죽',
		grade: 'F',
		isIngredient: true,
		buyPrice: 70,
		sellPrice: 160,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 103,
		name: '빵',
		grade: 'F',
		isIngredient: true,
		buyPrice: 90,
		sellPrice: 200,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 104,
		name: '다짐육',
		grade: 'F',
		isIngredient: true,
		buyPrice: 100,
		sellPrice: 230,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 105,
		name: '양념육',
		grade: 'F',
		isIngredient: true,
		buyPrice: 90,
		sellPrice: 210,
		imageUrl: '/imgs/ingredients2/300.webp'
	},
	{
		id: 106,
		name: '양념장',
		grade: 'F',
		isIngredient: true,
		buyPrice: 80,
		sellPrice: 180,
		imageUrl: '/imgs/ingredients2/204.webp'
	},
	{
		id: 107,
		name: '육수',
		grade: 'F',
		isIngredient: true,
		buyPrice: 70,
		sellPrice: 160,
		imageUrl: '/imgs/ingredients2/103.webp'
	},
	{
		id: 108,
		name: '구이',
		grade: 'F',
		isIngredient: true,
		buyPrice: 100,
		sellPrice: 240,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 109,
		name: '절임',
		grade: 'F',
		isIngredient: true,
		buyPrice: 70,
		sellPrice: 150,
		imageUrl: '/imgs/ingredients2/115.webp'
	},
	{
		id: 110,
		name: '시럽',
		grade: 'F',
		isIngredient: true,
		buyPrice: 80,
		sellPrice: 180,
		imageUrl: '/imgs/ingredients2/121.webp'
	},
	{
		id: 111,
		name: '잼',
		grade: 'F',
		isIngredient: true,
		buyPrice: 90,
		sellPrice: 200,
		imageUrl: '/imgs/ingredients2/36.webp'
	},
	{
		id: 112,
		name: '얼음',
		grade: 'F',
		isIngredient: true,
		buyPrice: 60,
		imageUrl: '/imgs/ingredients2/32.webp'
	},
	// F등급 요리 (15개) - 재료비 90~120원 기준, 판매가 200~300원
	{
		id: 113,
		name: '해물무침',
		grade: 'F',
		isIngredient: false,
		sellPrice: 230,
		imageUrl: '/imgs/ingredients2/341.webp'
	},
	{
		id: 114,
		name: '구운해물',
		grade: 'F',
		isIngredient: false,
		sellPrice: 280,
		imageUrl: '/imgs/ingredients2/314.webp'
	},
	{
		id: 115,
		name: '샐러드',
		grade: 'F',
		isIngredient: false,
		sellPrice: 200,
		imageUrl: '/imgs/ingredients2/11.webp'
	},
	{
		id: 116,
		name: '볶음',
		grade: 'F',
		isIngredient: false,
		sellPrice: 250,
		imageUrl: '/imgs/ingredients2/302.webp'
	},
	{
		id: 117,
		name: '과일청',
		grade: 'F',
		isIngredient: false,
		sellPrice: 220,
		imageUrl: '/imgs/ingredients2/121.webp'
	},
	{
		id: 118,
		name: '주스',
		grade: 'F',
		isIngredient: false,
		sellPrice: 210,
		imageUrl: '/imgs/ingredients2/37.webp'
	},
	{
		id: 119,
		name: '누룽지',
		grade: 'F',
		isIngredient: false,
		sellPrice: 270,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 120,
		name: '쌈',
		grade: 'F',
		isIngredient: false,
		sellPrice: 220,
		imageUrl: '/imgs/ingredients2/11.webp'
	},
	{
		id: 121,
		name: '젓갈',
		grade: 'F',
		isIngredient: false,
		sellPrice: 250,
		imageUrl: '/imgs/ingredients2/24.webp'
	},
	{
		id: 122,
		name: '해물육수',
		grade: 'F',
		isIngredient: false,
		sellPrice: 230,
		imageUrl: '/imgs/ingredients2/105.webp'
	},
	{
		id: 123,
		name: '떡',
		grade: 'F',
		isIngredient: true,
		buyPrice: 80,
		imageUrl: '/imgs/ingredients2/28.webp'
	},
	{
		id: 124,
		name: '튀김옷',
		grade: 'F',
		isIngredient: false,
		sellPrice: 200,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 125,
		name: '피자도우',
		grade: 'F',
		isIngredient: false,
		sellPrice: 210,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 126,
		name: '소시지',
		grade: 'F',
		isIngredient: false,
		sellPrice: 280,
		imageUrl: '/imgs/ingredients2/114.webp'
	},
	{
		id: 127,
		name: '묵',
		grade: 'F',
		isIngredient: false,
		sellPrice: 240,
		imageUrl: '/imgs/ingredients2/106.webp'
	},

	// ========== E등급 (63개) - 재료 14개 + 요리 49개 ==========
	// E등급 재료 (14개)
	{
		id: 201,
		name: '면',
		grade: 'E',
		isIngredient: true,
		buyPrice: 120,
		imageUrl: '/imgs/ingredients2/207.webp'
	},
	{
		id: 202,
		name: '김치',
		grade: 'E',
		isIngredient: true,
		buyPrice: 110,
		imageUrl: '/imgs/ingredients2/6.webp'
	},
	{
		id: 203,
		name: '만두',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/329.webp'
	},
	{
		id: 204,
		name: '국',
		grade: 'E',
		isIngredient: true,
		buyPrice: 100,
		imageUrl: '/imgs/ingredients2/219.webp'
	},
	{
		id: 205,
		name: '찌개',
		grade: 'E',
		isIngredient: true,
		buyPrice: 130,
		imageUrl: '/imgs/ingredients2/219.webp'
	},
	{
		id: 206,
		name: '조림',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/309.webp'
	},
	{
		id: 207,
		name: '스테이크',
		grade: 'E',
		isIngredient: true,
		buyPrice: 150,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 208,
		name: '파이',
		grade: 'E',
		isIngredient: true,
		buyPrice: 130,
		imageUrl: '/imgs/ingredients2/226.webp'
	},
	{
		id: 209,
		name: '케이크',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/227.webp'
	},
	{
		id: 210,
		name: '아이스크림',
		grade: 'E',
		isIngredient: true,
		buyPrice: 120,
		imageUrl: '/imgs/ingredients2/348.webp'
	},
	{
		id: 211,
		name: '초밥',
		grade: 'E',
		isIngredient: true,
		buyPrice: 130,
		imageUrl: '/imgs/ingredients2/332.webp'
	},
	{
		id: 212,
		name: '덮밥',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/336.webp'
	},
	{
		id: 213,
		name: '볶음밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/326.webp'
	},
	{
		id: 214,
		name: '전',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/203.webp'
	},
	// E등급 요리 (49개) - 재료비 140~200원 기준, 판매가 350~550원
	{
		id: 215,
		name: '국밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 216,
		name: '비빔밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 430,
		imageUrl: '/imgs/ingredients2/503.webp'
	},
	{
		id: 217,
		name: '토스트',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 218,
		name: '샌드위치',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 219,
		name: '햄버거',
		grade: 'E',
		isIngredient: false,
		sellPrice: 480,
		imageUrl: '/imgs/ingredients2/114.webp'
	},
	{
		id: 220,
		name: '피자',
		grade: 'E',
		isIngredient: false,
		sellPrice: 500,
		imageUrl: '/imgs/ingredients2/112.webp'
	},
	{
		id: 221,
		name: '파스타',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/316.webp'
	},
	{
		id: 222,
		name: '라면',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/424.webp'
	},
	{
		id: 223,
		name: '우동',
		grade: 'E',
		isIngredient: false,
		sellPrice: 370,
		imageUrl: '/imgs/ingredients2/221.webp'
	},
	{
		id: 224,
		name: '쌀국수',
		grade: 'E',
		isIngredient: false,
		sellPrice: 390,
		imageUrl: '/imgs/ingredients2/207.webp'
	},
	{
		id: 225,
		name: '냉면',
		grade: 'E',
		isIngredient: false,
		sellPrice: 360,
		imageUrl: '/imgs/ingredients2/207.webp'
	},
	{
		id: 226,
		name: '잡채',
		grade: 'E',
		isIngredient: false,
		sellPrice: 410,
		imageUrl: '/imgs/ingredients2/328.webp'
	},
	{
		id: 227,
		name: '탕수육',
		grade: 'E',
		isIngredient: false,
		sellPrice: 470,
		imageUrl: '/imgs/ingredients2/416.webp'
	},
	{
		id: 228,
		name: '깐풍기',
		grade: 'E',
		isIngredient: false,
		sellPrice: 460,
		imageUrl: '/imgs/ingredients2/515.webp'
	},
	{
		id: 229,
		name: '카레',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/211.webp'
	},
	{
		id: 230,
		name: '돈가스',
		grade: 'E',
		isIngredient: false,
		sellPrice: 480,
		imageUrl: '/imgs/ingredients2/415.webp'
	},
	{
		id: 231,
		name: '치킨',
		grade: 'E',
		isIngredient: false,
		sellPrice: 430,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	{
		id: 232,
		name: '족발',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 233,
		name: '보쌈',
		grade: 'E',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 234,
		name: '갈비찜',
		grade: 'E',
		isIngredient: false,
		sellPrice: 490,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	{
		id: 235,
		name: '불고기',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/300.webp'
	},
	{
		id: 236,
		name: '제육볶음',
		grade: 'E',
		isIngredient: false,
		sellPrice: 470,
		imageUrl: '/imgs/ingredients2/307.webp'
	},
	{
		id: 237,
		name: '닭갈비',
		grade: 'E',
		isIngredient: false,
		sellPrice: 440,
		imageUrl: '/imgs/ingredients2/18.webp'
	},
	{
		id: 238,
		name: '떡볶이',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 239,
		name: '순대',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 240,
		name: '오므라이스',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/315.webp'
	},
	{
		id: 241,
		name: '리조또',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/339.webp'
	},
	{
		id: 242,
		name: '그라탕',
		grade: 'E',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/319.webp'
	},
	{
		id: 243,
		name: '스튜',
		grade: 'E',
		isIngredient: false,
		sellPrice: 430,
		imageUrl: '/imgs/ingredients2/342.webp'
	},
	{
		id: 244,
		name: '수프',
		grade: 'E',
		isIngredient: false,
		sellPrice: 350,
		imageUrl: '/imgs/ingredients2/324.webp'
	},
	{
		id: 245,
		name: '미역국',
		grade: 'E',
		isIngredient: false,
		sellPrice: 360,
		imageUrl: '/imgs/ingredients2/310.webp'
	},
	{
		id: 246,
		name: '된장국',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/219.webp'
	},
	{
		id: 247,
		name: '김치찌개',
		grade: 'E',
		isIngredient: false,
		sellPrice: 360,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 248,
		name: '순두부찌개',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/106.webp'
	},
	{
		id: 249,
		name: '부대찌개',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/114.webp'
	},
	{
		id: 250,
		name: '팥빙수',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/348.webp'
	},
	{
		id: 251,
		name: '과일빙수',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/348.webp'
	},
	{
		id: 252,
		name: '타르트',
		grade: 'E',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/346.webp'
	},
	{
		id: 253,
		name: '쿠키',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/40.webp'
	},
	{
		id: 254,
		name: '푸딩',
		grade: 'E',
		isIngredient: false,
		sellPrice: 430,
		imageUrl: '/imgs/ingredients2/345.webp'
	},
	{
		id: 255,
		name: '마카롱',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/40.webp'
	},
	{
		id: 256,
		name: '크레페',
		grade: 'E',
		isIngredient: false,
		sellPrice: 360,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 257,
		name: '와플',
		grade: 'E',
		isIngredient: false,
		sellPrice: 430,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 258,
		name: '도넛',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 259,
		name: '츄러스',
		grade: 'E',
		isIngredient: false,
		sellPrice: 370,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 260,
		name: '호떡',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 261,
		name: '붕어빵',
		grade: 'E',
		isIngredient: false,
		sellPrice: 350,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 262,
		name: '회덮밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 263,
		name: '물회',
		grade: 'E',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/334.webp'
	},

	// ========== D등급 (46개) - 재료 13개 + 요리 33개 ==========
	// D등급 재료 (13개)
	{
		id: 301,
		name: '갈비',
		grade: 'D',
		isIngredient: true,
		buyPrice: 200,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	{
		id: 302,
		name: '삼겹살',
		grade: 'D',
		isIngredient: true,
		buyPrice: 180,
		imageUrl: '/imgs/ingredients2/331.webp'
	},
	{
		id: 303,
		name: '회',
		grade: 'D',
		isIngredient: true,
		buyPrice: 190,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 304,
		name: '탕',
		grade: 'D',
		isIngredient: true,
		buyPrice: 170,
		imageUrl: '/imgs/ingredients2/400.webp'
	},
	{
		id: 305,
		name: '전골',
		grade: 'D',
		isIngredient: true,
		buyPrice: 210,
		imageUrl: '/imgs/ingredients2/401.webp'
	},
	{
		id: 306,
		name: '구절판재료',
		grade: 'D',
		isIngredient: true,
		buyPrice: 200,
		imageUrl: '/imgs/ingredients2/404.webp'
	},
	{
		id: 307,
		name: '롤케이크',
		grade: 'D',
		isIngredient: true,
		buyPrice: 180,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	{
		id: 308,
		name: '티라미수',
		grade: 'D',
		isIngredient: true,
		buyPrice: 190,
		imageUrl: '/imgs/ingredients2/530.webp'
	},
	{
		id: 309,
		name: '무스',
		grade: 'D',
		isIngredient: true,
		buyPrice: 170,
		imageUrl: '/imgs/ingredients2/223.webp'
	},
	{
		id: 310,
		name: '짜장면',
		grade: 'D',
		isIngredient: true,
		buyPrice: 160,
		imageUrl: '/imgs/ingredients2/327.webp'
	},
	{
		id: 311,
		name: '짬뽕',
		grade: 'D',
		isIngredient: true,
		buyPrice: 180,
		imageUrl: '/imgs/ingredients2/418.webp'
	},
	{
		id: 312,
		name: '오마카세',
		grade: 'D',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/619.webp'
	},
	{
		id: 313,
		name: '정식',
		grade: 'D',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/601.webp'
	},
	// D등급 요리 (33개) - 재료비 260~380원 기준, 판매가 600~950원
	{
		id: 314,
		name: 'LA갈비',
		grade: 'D',
		isIngredient: false,
		sellPrice: 880,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	{
		id: 315,
		name: '양념갈비',
		grade: 'D',
		isIngredient: false,
		sellPrice: 850,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	{
		id: 316,
		name: '소갈비찜',
		grade: 'D',
		isIngredient: false,
		sellPrice: 820,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	{
		id: 317,
		name: '돼지갈비',
		grade: 'D',
		isIngredient: false,
		sellPrice: 800,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	{
		id: 318,
		name: '삼겹살구이',
		grade: 'D',
		isIngredient: false,
		sellPrice: 750,
		imageUrl: '/imgs/ingredients2/331.webp'
	},
	{
		id: 319,
		name: '대패삼겹',
		grade: 'D',
		isIngredient: false,
		sellPrice: 700,
		imageUrl: '/imgs/ingredients2/331.webp'
	},
	{
		id: 320,
		name: '항정살',
		grade: 'D',
		isIngredient: false,
		sellPrice: 780,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 321,
		name: '연어회',
		grade: 'D',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 322,
		name: '광어회',
		grade: 'D',
		isIngredient: false,
		sellPrice: 720,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 323,
		name: '모둠회',
		grade: 'D',
		isIngredient: false,
		sellPrice: 780,
		imageUrl: '/imgs/ingredients2/422.webp'
	},
	{
		id: 324,
		name: '육회',
		grade: 'D',
		isIngredient: false,
		sellPrice: 760,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	{
		id: 325,
		name: '갈비탕',
		grade: 'D',
		isIngredient: false,
		sellPrice: 700,
		imageUrl: '/imgs/ingredients2/103.webp'
	},
	{
		id: 326,
		name: '설렁탕',
		grade: 'D',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/103.webp'
	},
	{
		id: 327,
		name: '곰탕',
		grade: 'D',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/103.webp'
	},
	{
		id: 328,
		name: '삼계탕',
		grade: 'D',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/400.webp'
	},
	{
		id: 329,
		name: '추어탕',
		grade: 'D',
		isIngredient: false,
		sellPrice: 620,
		imageUrl: '/imgs/ingredients2/105.webp'
	},
	{
		id: 330,
		name: '해물탕',
		grade: 'D',
		isIngredient: false,
		sellPrice: 800,
		imageUrl: '/imgs/ingredients2/506.webp'
	},
	{
		id: 331,
		name: '매운탕',
		grade: 'D',
		isIngredient: false,
		sellPrice: 720,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 332,
		name: '샤브샤브',
		grade: 'D',
		isIngredient: false,
		sellPrice: 850,
		imageUrl: '/imgs/ingredients2/524.webp'
	},
	{
		id: 333,
		name: '스키야키',
		grade: 'D',
		isIngredient: false,
		sellPrice: 880,
		imageUrl: '/imgs/ingredients2/732.webp'
	},
	{
		id: 334,
		name: '훠궈',
		grade: 'D',
		isIngredient: false,
		sellPrice: 820,
		imageUrl: '/imgs/ingredients2/524.webp'
	},
	{
		id: 335,
		name: '카르보나라',
		grade: 'D',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/409.webp'
	},
	{
		id: 336,
		name: '봉골레',
		grade: 'D',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/410.webp'
	},
	{
		id: 337,
		name: '알리오올리오',
		grade: 'D',
		isIngredient: false,
		sellPrice: 620,
		imageUrl: '/imgs/ingredients2/318.webp'
	},
	{
		id: 338,
		name: '라자냐',
		grade: 'D',
		isIngredient: false,
		sellPrice: 700,
		imageUrl: '/imgs/ingredients2/319.webp'
	},
	{
		id: 339,
		name: '뇨끼',
		grade: 'D',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/207.webp'
	},
	{
		id: 340,
		name: '딤섬',
		grade: 'D',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/329.webp'
	},
	{
		id: 341,
		name: '군만두',
		grade: 'D',
		isIngredient: false,
		sellPrice: 700,
		imageUrl: '/imgs/ingredients2/329.webp'
	},
	{
		id: 342,
		name: '물만두',
		grade: 'D',
		isIngredient: false,
		sellPrice: 620,
		imageUrl: '/imgs/ingredients2/329.webp'
	},
	{
		id: 343,
		name: '찐만두',
		grade: 'D',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/329.webp'
	},
	{
		id: 344,
		name: '교자',
		grade: 'D',
		isIngredient: false,
		sellPrice: 700,
		imageUrl: '/imgs/ingredients2/329.webp'
	},
	{
		id: 345,
		name: '슈마이',
		grade: 'D',
		isIngredient: false,
		sellPrice: 750,
		imageUrl: '/imgs/ingredients2/329.webp'
	},
	{
		id: 346,
		name: '하카우',
		grade: 'D',
		isIngredient: false,
		sellPrice: 720,
		imageUrl: '/imgs/ingredients2/329.webp'
	},

	// ========== C등급 (31개) - 재료 12개 + 요리 19개 ==========
	// C등급 재료 (12개)
	{
		id: 401,
		name: '한우',
		grade: 'C',
		isIngredient: true,
		buyPrice: 280,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	{
		id: 402,
		name: '참치회',
		grade: 'C',
		isIngredient: true,
		buyPrice: 260,
		imageUrl: '/imgs/ingredients2/335.webp'
	},
	{
		id: 403,
		name: '랍스터',
		grade: 'C',
		isIngredient: true,
		buyPrice: 300,
		imageUrl: '/imgs/ingredients2/120.webp'
	},
	{
		id: 404,
		name: '전복',
		grade: 'C',
		isIngredient: true,
		buyPrice: 270,
		imageUrl: '/imgs/ingredients2/25.webp'
	},
	{
		id: 405,
		name: '킹크랩',
		grade: 'C',
		isIngredient: true,
		buyPrice: 290,
		imageUrl: '/imgs/ingredients2/33.webp'
	},
	{
		id: 406,
		name: '캐비어',
		grade: 'C',
		isIngredient: true,
		buyPrice: 300,
		imageUrl: '/imgs/ingredients2/24.webp'
	},
	{
		id: 407,
		name: '한정식',
		grade: 'C',
		isIngredient: true,
		buyPrice: 250,
		imageUrl: '/imgs/ingredients2/601.webp'
	},
	{
		id: 408,
		name: '코스요리',
		grade: 'C',
		isIngredient: true,
		buyPrice: 280,
		imageUrl: '/imgs/ingredients2/600.webp'
	},
	{
		id: 409,
		name: '밀푀유',
		grade: 'C',
		isIngredient: true,
		buyPrice: 240,
		imageUrl: '/imgs/ingredients2/752.webp'
	},
	{
		id: 410,
		name: '슈크림',
		grade: 'C',
		isIngredient: true,
		buyPrice: 230,
		imageUrl: '/imgs/ingredients2/225.webp'
	},
	{
		id: 411,
		name: '북경오리',
		grade: 'C',
		isIngredient: true,
		buyPrice: 270,
		imageUrl: '/imgs/ingredients2/611.webp'
	},
	{
		id: 412,
		name: '양갈비',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1100,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	// C등급 요리 (19개) - 재료비 400~600원 기준, 판매가 1000~1600원
	{
		id: 413,
		name: '한우구이',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1400,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 414,
		name: '한우육회',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	{
		id: 415,
		name: '참치뱃살',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/335.webp'
	},
	{
		id: 416,
		name: '대뱃살',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1250,
		imageUrl: '/imgs/ingredients2/335.webp'
	},
	{
		id: 417,
		name: '랍스터구이',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1450,
		imageUrl: '/imgs/ingredients2/343.webp'
	},
	{
		id: 418,
		name: '랍스터찜',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1400,
		imageUrl: '/imgs/ingredients2/429.webp'
	},
	{
		id: 419,
		name: '전복구이',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1200,
		imageUrl: '/imgs/ingredients2/305.webp'
	},
	{
		id: 420,
		name: '전복죽',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1100,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 421,
		name: '킹크랩찜',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1500,
		imageUrl: '/imgs/ingredients2/425.webp'
	},
	{
		id: 422,
		name: '킹크랩구이',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1450,
		imageUrl: '/imgs/ingredients2/338.webp'
	},
	{
		id: 423,
		name: '양갈비구이',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1200,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 424,
		name: '양갈비스테이크',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 425,
		name: '북경오리구이',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/720.webp'
	},
	{
		id: 426,
		name: '오리훈제',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1150,
		imageUrl: '/imgs/ingredients2/419.webp'
	},
	{
		id: 427,
		name: '에클레어',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1000,
		imageUrl: '/imgs/ingredients2/225.webp'
	},
	{
		id: 428,
		name: '몽블랑',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1050,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	{
		id: 429,
		name: '오페라',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1100,
		imageUrl: '/imgs/ingredients2/627.webp'
	},
	{
		id: 430,
		name: '슈톨렌',
		grade: 'C',
		isIngredient: false,
		sellPrice: 950,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 431,
		name: '파네토네',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1000,
		imageUrl: '/imgs/ingredients2/110.webp'
	},

	// ========== B등급 (23개) - 재료 11개 + 요리 12개 ==========
	// B등급 재료 (11개)
	{
		id: 501,
		name: '와규',
		grade: 'B',
		isIngredient: true,
		buyPrice: 380,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	{
		id: 502,
		name: '오토로',
		grade: 'B',
		isIngredient: true,
		buyPrice: 400,
		imageUrl: '/imgs/ingredients2/616.webp'
	},
	{
		id: 503,
		name: '블루랍스터',
		grade: 'B',
		isIngredient: true,
		buyPrice: 420,
		imageUrl: '/imgs/ingredients2/120.webp'
	},
	{
		id: 504,
		name: '트러플',
		grade: 'B',
		isIngredient: true,
		buyPrice: 380,
		imageUrl: '/imgs/ingredients2/3.webp'
	},
	{
		id: 505,
		name: '푸아그라',
		grade: 'B',
		isIngredient: true,
		buyPrice: 350,
		imageUrl: '/imgs/ingredients2/744.webp'
	},
	{
		id: 506,
		name: '이베리코',
		grade: 'B',
		isIngredient: true,
		buyPrice: 360,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 507,
		name: '오마카세코스',
		grade: 'B',
		isIngredient: true,
		buyPrice: 400,
		imageUrl: '/imgs/ingredients2/619.webp'
	},
	{
		id: 508,
		name: '프렌치코스',
		grade: 'B',
		isIngredient: true,
		buyPrice: 380,
		imageUrl: '/imgs/ingredients2/600.webp'
	},
	{
		id: 509,
		name: '가이세키',
		grade: 'B',
		isIngredient: true,
		buyPrice: 390,
		imageUrl: '/imgs/ingredients2/617.webp'
	},
	{
		id: 510,
		name: '웨딩케이크',
		grade: 'B',
		isIngredient: true,
		buyPrice: 340,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	{
		id: 511,
		name: '크로캉부슈',
		grade: 'B',
		isIngredient: true,
		buyPrice: 350,
		imageUrl: '/imgs/ingredients2/751.webp'
	},
	// B등급 요리 (12개) - 재료비 600~900원 기준, 판매가 1500~2400원
	{
		id: 512,
		name: '와규스테이크',
		grade: 'B',
		isIngredient: true,
		buyPrice: 400,
		imageUrl: '/imgs/ingredients2/512.webp'
	},
	{
		id: 513,
		name: '와규초밥',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1800,
		imageUrl: '/imgs/ingredients2/421.webp'
	},
	{
		id: 514,
		name: '오토로초밥',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2000,
		imageUrl: '/imgs/ingredients2/730.webp'
	},
	{
		id: 515,
		name: '오토로타타키',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1950,
		imageUrl: '/imgs/ingredients2/616.webp'
	},
	{
		id: 516,
		name: '트러플파스타',
		grade: 'B',
		isIngredient: true,
		buyPrice: 380,
		imageUrl: '/imgs/ingredients2/508.webp'
	},
	{
		id: 517,
		name: '트러플리조또',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1700,
		imageUrl: '/imgs/ingredients2/607.webp'
	},
	{
		id: 518,
		name: '푸아그라스테이크',
		grade: 'B',
		isIngredient: true,
		buyPrice: 360,
		imageUrl: '/imgs/ingredients2/744.webp'
	},
	{
		id: 519,
		name: '푸아그라무스',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1600,
		imageUrl: '/imgs/ingredients2/744.webp'
	},
	{
		id: 520,
		name: '이베리코구이',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1750,
		imageUrl: '/imgs/ingredients2/331.webp'
	},
	{
		id: 521,
		name: '이베리코샤브',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1650,
		imageUrl: '/imgs/ingredients2/524.webp'
	},
	{
		id: 522,
		name: '블루랍스터구이',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2100,
		imageUrl: '/imgs/ingredients2/343.webp'
	},
	{
		id: 523,
		name: '블루랍스터테르미도르',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2200,
		imageUrl: '/imgs/ingredients2/742.webp'
	},

	// ========== A등급 (32개) - 재료 14개 + 요리 18개 ==========
	// A등급 재료 (14개)
	{
		id: 601,
		name: '최상급와규',
		grade: 'A',
		isIngredient: true,
		buyPrice: 550,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	{
		id: 602,
		name: '벨루가캐비어',
		grade: 'A',
		isIngredient: true,
		buyPrice: 580,
		imageUrl: '/imgs/ingredients2/24.webp'
	},
	{
		id: 603,
		name: '알바트러플',
		grade: 'A',
		isIngredient: true,
		buyPrice: 600,
		imageUrl: '/imgs/ingredients2/3.webp'
	},
	{
		id: 604,
		name: '마츠타케',
		grade: 'A',
		isIngredient: true,
		buyPrice: 520,
		imageUrl: '/imgs/ingredients2/3.webp'
	},
	{
		id: 605,
		name: '블루핀참치',
		grade: 'A',
		isIngredient: true,
		buyPrice: 560,
		imageUrl: '/imgs/ingredients2/21.webp'
	},
	{
		id: 606,
		name: '황제전복',
		grade: 'A',
		isIngredient: true,
		buyPrice: 540,
		imageUrl: '/imgs/ingredients2/25.webp'
	},
	{
		id: 607,
		name: '타라바가니',
		grade: 'A',
		isIngredient: true,
		buyPrice: 580,
		imageUrl: '/imgs/ingredients2/618.webp'
	},
	{
		id: 608,
		name: '미슐랭코스',
		grade: 'A',
		isIngredient: true,
		buyPrice: 600,
		imageUrl: '/imgs/ingredients2/600.webp'
	},
	{
		id: 609,
		name: '궁중요리',
		grade: 'A',
		isIngredient: true,
		buyPrice: 550,
		imageUrl: '/imgs/ingredients2/500.webp'
	},
	{
		id: 610,
		name: '피에스몽테',
		grade: 'A',
		isIngredient: true,
		buyPrice: 500,
		imageUrl: '/imgs/ingredients2/628.webp'
	},
	{
		id: 611,
		name: '황실디저트',
		grade: 'A',
		isIngredient: true,
		buyPrice: 480,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	{
		id: 612,
		name: '분자요리',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2600,
		imageUrl: '/imgs/ingredients2/619.webp'
	},
	{
		id: 613,
		name: '퓨전오마카세',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2500,
		imageUrl: '/imgs/ingredients2/619.webp'
	},
	{
		id: 614,
		name: '그랑크뤼',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2400,
		imageUrl: '/imgs/ingredients2/38.webp'
	},
	// A등급 요리 (18개) - 재료비 900~1200원 기준, 판매가 2200~3200원
	{
		id: 615,
		name: '와규풀코스',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2800,
		imageUrl: '/imgs/ingredients2/512.webp'
	},
	{
		id: 616,
		name: '캐비어테이스팅',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2900,
		imageUrl: '/imgs/ingredients2/24.webp'
	},
	{
		id: 617,
		name: '트러플디너',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3000,
		imageUrl: '/imgs/ingredients2/607.webp'
	},
	{
		id: 618,
		name: '참치오마카세',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2850,
		imageUrl: '/imgs/ingredients2/616.webp'
	},
	{
		id: 619,
		name: '전복정식',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2700,
		imageUrl: '/imgs/ingredients2/605.webp'
	},
	{
		id: 620,
		name: '대게코스',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2950,
		imageUrl: '/imgs/ingredients2/523.webp'
	},
	{
		id: 621,
		name: '궁중정식',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2600,
		imageUrl: '/imgs/ingredients2/500.webp'
	},
	{
		id: 622,
		name: '수라상',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2750,
		imageUrl: '/imgs/ingredients2/601.webp'
	},
	{
		id: 623,
		name: '어선회',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2650,
		imageUrl: '/imgs/ingredients2/422.webp'
	},
	{
		id: 624,
		name: '분자칵테일',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2400,
		imageUrl: '/imgs/ingredients2/37.webp'
	},
	{
		id: 625,
		name: '디저트오마카세',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2300,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	{
		id: 626,
		name: '프티푸르',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2200,
		imageUrl: '/imgs/ingredients2/40.webp'
	},
	{
		id: 627,
		name: '셰프테이블',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3100,
		imageUrl: '/imgs/ingredients2/600.webp'
	},
	{
		id: 628,
		name: '시그니처코스',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3000,
		imageUrl: '/imgs/ingredients2/600.webp'
	},
	{
		id: 629,
		name: '테이스팅메뉴',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2900,
		imageUrl: '/imgs/ingredients2/600.webp'
	},
	{
		id: 630,
		name: '페어링디너',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3050,
		imageUrl: '/imgs/ingredients2/600.webp'
	},
	{
		id: 631,
		name: '프레스티지',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2800,
		imageUrl: '/imgs/ingredients2/631.webp'
	},
	{
		id: 632,
		name: '그랑메종',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3200,
		imageUrl: '/imgs/ingredients2/600.webp'
	},

	// ========== R등급 (16개) - 전설급 요리 ==========
	// R등급 요리 - 재료비 1000~1200원 기준, 판매가 2500~3500원
	{
		id: 701,
		name: '신선로',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3200,
		imageUrl: '/imgs/ingredients2/700.webp'
	},
	{
		id: 702,
		name: '구절판',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3300,
		imageUrl: '/imgs/ingredients2/701.webp'
	},
	{
		id: 706,
		name: '비프웰링턴',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3400,
		imageUrl: '/imgs/ingredients2/710.webp'
	},
	{
		id: 707,
		name: '트러플카르보나라',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3500,
		imageUrl: '/imgs/ingredients2/711.webp'
	},
	{
		id: 708,
		name: '코키유생자크',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3300,
		imageUrl: '/imgs/ingredients2/712.webp'
	},
	{
		id: 709,
		name: '부야베스',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3400,
		imageUrl: '/imgs/ingredients2/713.webp'
	},
	{
		id: 710,
		name: '부르기뇽',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3350,
		imageUrl: '/imgs/ingredients2/714.webp'
	},
	{
		id: 711,
		name: '북경오리구이정식',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3100,
		imageUrl: '/imgs/ingredients2/720.webp'
	},
	{
		id: 712,
		name: '동파육',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3200,
		imageUrl: '/imgs/ingredients2/721.webp'
	},
	{
		id: 713,
		name: '불도장',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3450,
		imageUrl: '/imgs/ingredients2/722.webp'
	},
	{
		id: 716,
		name: '오토로초밥오마카세',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3300,
		imageUrl: '/imgs/ingredients2/730.webp'
	},
	{
		id: 721,
		name: '전복리소토',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3250,
		imageUrl: '/imgs/ingredients2/740.webp'
	},
	{
		id: 722,
		name: '싱가포르칠리크랩',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3350,
		imageUrl: '/imgs/ingredients2/741.webp'
	},
	{
		id: 723,
		name: '랍스터테르미도르',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3500,
		imageUrl: '/imgs/ingredients2/742.webp'
	},
	{
		id: 726,
		name: '오페라케이크',
		grade: 'R',
		isIngredient: false,
		sellPrice: 2800,
		imageUrl: '/imgs/ingredients2/750.webp'
	},
	{
		id: 730,
		name: '초콜릿퐁듀',
		grade: 'R',
		isIngredient: false,
		sellPrice: 3000,
		imageUrl: '/imgs/ingredients2/754.webp'
	}
];
