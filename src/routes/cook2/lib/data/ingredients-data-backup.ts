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
		name: '횟감',
		grade: 'F',
		isIngredient: true,
		buyPrice: 100,
		sellPrice: 240,
		imageUrl: '/imgs/ingredients2/22.webp'
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
	{
		id: 123,
		name: '떡',
		grade: 'F',
		isIngredient: true,
		buyPrice: 80,
		imageUrl: '/imgs/ingredients2/28.webp'
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
		name: '칼솟',
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
		name: '나물밥',
		grade: 'F',
		isIngredient: false,
		sellPrice: 220,
		imageUrl: '/imgs/ingredients2/11.webp'
	},
	{
		id: 121,
		name: '어묵',
		grade: 'F',
		isIngredient: false,
		sellPrice: 250,
		imageUrl: '/imgs/ingredients2/24.webp'
	},
	{
		id: 122,
		name: '조개탕',
		grade: 'F',
		isIngredient: false,
		sellPrice: 230,
		imageUrl: '/imgs/ingredients2/105.webp'
	},
	{
		id: 124,
		name: '크래커',
		grade: 'F',
		isIngredient: false,
		sellPrice: 200,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 125,
		name: '또띠아',
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
	{
		id: 128,
		name: '온수',
		grade: 'F',
		isIngredient: false,
		sellPrice: 200,
		imageUrl: '/imgs/ingredients2/32.webp'
	},

	// ========== E등급 - 재료 14개 + 요리 64개 ==========
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
		name: '튀김',
		grade: 'E',
		isIngredient: true,
		buyPrice: 130,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	{
		id: 203,
		name: '구이',
		grade: 'E',
		isIngredient: true,
		buyPrice: 150,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 204,
		name: '수프',
		grade: 'E',
		isIngredient: true,
		buyPrice: 100,
		imageUrl: '/imgs/ingredients2/324.webp'
	},
	{
		id: 205,
		name: '회',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 206,
		name: '가래떡',
		grade: 'E',
		isIngredient: true,
		buyPrice: 100,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 207,
		name: '찜',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	{
		id: 208,
		name: '김치',
		grade: 'E',
		isIngredient: true,
		buyPrice: 110,
		imageUrl: '/imgs/ingredients2/6.webp'
	},
	{
		id: 209,
		name: '만두',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/329.webp'
	},
	{
		id: 210,
		name: '찌개',
		grade: 'E',
		isIngredient: true,
		buyPrice: 130,
		imageUrl: '/imgs/ingredients2/219.webp'
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
		name: '케이크',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/227.webp'
	},
	{
		id: 213,
		name: '과일아이스크림',
		grade: 'E',
		isIngredient: true,
		buyPrice: 120,
		imageUrl: '/imgs/ingredients2/348.webp'
	},
	{
		id: 214,
		name: '게살',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/33.webp'
	},
	// E등급 요리 (49개) - 재료비 140~200원 기준, 판매가 350~550원
	// 밥 조합 (7개)
	{
		id: 215,
		name: '주먹밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 350,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 216,
		name: '국밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 217,
		name: '비빔밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 430,
		imageUrl: '/imgs/ingredients2/503.webp'
	},
	{
		id: 218,
		name: '오므라이스',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/315.webp'
	},
	{
		id: 219,
		name: '유부초밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/332.webp'
	},
	{
		id: 220,
		name: '떡국',
		grade: 'E',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	// 반죽 조합 (5개)
	{
		id: 221,
		name: '칼국수',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/221.webp'
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
		name: '파이',
		grade: 'E',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/226.webp'
	},
	{
		id: 224,
		name: '냉면',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/207.webp'
	},
	{
		id: 225,
		name: '호떡',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	// 빵 조합 (7개)
	{
		id: 226,
		name: '햄버거',
		grade: 'E',
		isIngredient: false,
		sellPrice: 480,
		imageUrl: '/imgs/ingredients2/114.webp'
	},
	{
		id: 227,
		name: '토스트',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 228,
		name: '샌드위치',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	{
		id: 229,
		name: '쿠키',
		grade: 'E',
		isIngredient: false,
		sellPrice: 350,
		imageUrl: '/imgs/ingredients2/40.webp'
	},
	{
		id: 230,
		name: '빵푸딩',
		grade: 'E',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/345.webp'
	},
	{
		id: 231,
		name: '카나페',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/110.webp'
	},
	// 다짐육 조합 (8개)
	{
		id: 232,
		name: '완자탕',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/103.webp'
	},
	{
		id: 233,
		name: '불고기',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/300.webp'
	},
	{
		id: 234,
		name: '장조림',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/309.webp'
	},
	{
		id: 235,
		name: '미트볼',
		grade: 'E',
		isIngredient: false,
		sellPrice: 470,
		imageUrl: '/imgs/ingredients2/416.webp'
	},
	{
		id: 236,
		name: '떡갈비',
		grade: 'E',
		isIngredient: false,
		sellPrice: 460,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	{
		id: 237,
		name: '냉채',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/341.webp'
	},
	{
		id: 238,
		name: '육회',
		grade: 'E',
		isIngredient: false,
		sellPrice: 480,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	// 양념육 조합 (5개)
	{
		id: 239,
		name: '제육볶음',
		grade: 'E',
		isIngredient: false,
		sellPrice: 470,
		imageUrl: '/imgs/ingredients2/307.webp'
	},
	{
		id: 240,
		name: '보쌈',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 241,
		name: '닭강정',
		grade: 'E',
		isIngredient: false,
		sellPrice: 430,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	{
		id: 242,
		name: '떡꼬치',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 243,
		name: '냉삼',
		grade: 'E',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/331.webp'
	},
	// 양념장 조합 (7개)
	{
		id: 244,
		name: '쌈장',
		grade: 'E',
		isIngredient: false,
		sellPrice: 350,
		imageUrl: '/imgs/ingredients2/204.webp'
	},
	{
		id: 245,
		name: '회무침',
		grade: 'E',
		isIngredient: false,
		sellPrice: 360,
		imageUrl: '/imgs/ingredients2/115.webp'
	},
	{
		id: 246,
		name: '떡볶이',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 247,
		name: '데리야끼',
		grade: 'E',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/204.webp'
	},
	{
		id: 248,
		name: '냉소스',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/204.webp'
	},
	// 육수 조합 (3개)
	{
		id: 249,
		name: '된장국',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/219.webp'
	},
	{
		id: 250,
		name: '단팥죽',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 251,
		name: '냉국',
		grade: 'E',
		isIngredient: false,
		sellPrice: 370,
		imageUrl: '/imgs/ingredients2/324.webp'
	},
	// 횟감 조합 (4개)
	{
		id: 252,
		name: '젓갈',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/24.webp'
	},
	{
		id: 253,
		name: '회냉채',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 254,
		name: '어묵탕',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/24.webp'
	},
	// 절임 조합 (3개)
	{
		id: 255,
		name: '피클',
		grade: 'E',
		isIngredient: false,
		sellPrice: 350,
		imageUrl: '/imgs/ingredients2/115.webp'
	},
	{
		id: 256,
		name: '과일절임',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/121.webp'
	},
	{
		id: 257,
		name: '동치미',
		grade: 'E',
		isIngredient: false,
		sellPrice: 360,
		imageUrl: '/imgs/ingredients2/115.webp'
	},
	// 잼 조합 (3개)
	{
		id: 258,
		name: '푸딩',
		grade: 'E',
		isIngredient: false,
		sellPrice: 430,
		imageUrl: '/imgs/ingredients2/345.webp'
	},
	{
		id: 259,
		name: '약과',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/40.webp'
	},
	{
		id: 260,
		name: '약밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/348.webp'
	},
	// 얼음 조합 (4개)
	{
		id: 261,
		name: '빙수',
		grade: 'E',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/348.webp'
	},
	{
		id: 262,
		name: '떡빙수',
		grade: 'E',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/348.webp'
	},
	// 떡 조합 (1개)
	{
		id: 263,
		name: '도넛',
		grade: 'E',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/102.webp'
	},

	// ========== D등급 - 재료 13개 ==========
	// D등급 재료 (13개)
	{
		id: 301,
		name: '스테이크',
		grade: 'D',
		isIngredient: true,
		buyPrice: 200,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 302,
		name: '삼겹살구이',
		grade: 'D',
		isIngredient: true,
		buyPrice: 180,
		imageUrl: '/imgs/ingredients2/331.webp'
	},
	{
		id: 303,
		name: '사시미',
		grade: 'D',
		isIngredient: true,
		buyPrice: 190,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 304,
		name: '돈카츠',
		grade: 'D',
		isIngredient: true,
		buyPrice: 200,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	{
		id: 305,
		name: '모듬초밥',
		grade: 'D',
		isIngredient: true,
		buyPrice: 180,
		imageUrl: '/imgs/ingredients2/332.webp'
	},
	{
		id: 306,
		name: '해물찜',
		grade: 'D',
		isIngredient: true,
		buyPrice: 210,
		imageUrl: '/imgs/ingredients2/506.webp'
	},
	{
		id: 307,
		name: '꽃게탕',
		grade: 'D',
		isIngredient: true,
		buyPrice: 200,
		imageUrl: '/imgs/ingredients2/33.webp'
	},
	{
		id: 308,
		name: '파스타',
		grade: 'D',
		isIngredient: true,
		buyPrice: 170,
		imageUrl: '/imgs/ingredients2/409.webp'
	},
	{
		id: 309,
		name: '전골',
		grade: 'D',
		isIngredient: true,
		buyPrice: 190,
		imageUrl: '/imgs/ingredients2/401.webp'
	},
	{
		id: 310,
		name: '모듬전',
		grade: 'D',
		isIngredient: true,
		buyPrice: 170,
		imageUrl: '/imgs/ingredients2/404.webp'
	},
	{
		id: 311,
		name: '과일케이크',
		grade: 'D',
		isIngredient: true,
		buyPrice: 180,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	{
		id: 312,
		name: '크림',
		grade: 'D',
		isIngredient: true,
		buyPrice: 170,
		imageUrl: '/imgs/ingredients2/324.webp'
	},
	{
		id: 313,
		name: '라멘',
		grade: 'D',
		isIngredient: true,
		buyPrice: 180,
		imageUrl: '/imgs/ingredients2/424.webp'
	},
	// D등급 요리 (33개)
	{
		id: 314,
		name: '우동',
		grade: 'D',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/221.webp'
	},
	{
		id: 315,
		name: '볶음면',
		grade: 'D',
		isIngredient: false,
		sellPrice: 620,
		imageUrl: '/imgs/ingredients2/207.webp'
	},
	{
		id: 316,
		name: '잔치국수',
		grade: 'D',
		isIngredient: false,
		sellPrice: 580,
		imageUrl: '/imgs/ingredients2/221.webp'
	},
	{
		id: 317,
		name: '비빔국수',
		grade: 'D',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/207.webp'
	},
	{
		id: 318,
		name: '새우튀김',
		grade: 'D',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	{
		id: 319,
		name: '텐동',
		grade: 'D',
		isIngredient: false,
		sellPrice: 700,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	{
		id: 320,
		name: '꼬치구이',
		grade: 'D',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 321,
		name: '철판구이',
		grade: 'D',
		isIngredient: false,
		sellPrice: 750,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 322,
		name: '핫케이크',
		grade: 'D',
		isIngredient: false,
		sellPrice: 550,
		imageUrl: '/imgs/ingredients2/227.webp'
	},
	{
		id: 323,
		name: '해물수프',
		grade: 'D',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/324.webp'
	},
	{
		id: 324,
		name: '물회',
		grade: 'D',
		isIngredient: false,
		sellPrice: 700,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 325,
		name: '회덮밥',
		grade: 'D',
		isIngredient: false,
		sellPrice: 720,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 326,
		name: '떡찜',
		grade: 'D',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 327,
		name: '두부김치',
		grade: 'D',
		isIngredient: false,
		sellPrice: 580,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 328,
		name: '떡만두국',
		grade: 'D',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 329,
		name: '궁중떡볶이',
		grade: 'D',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 330,
		name: '만두찜',
		grade: 'D',
		isIngredient: false,
		sellPrice: 620,
		imageUrl: '/imgs/ingredients2/329.webp'
	},
	{
		id: 331,
		name: '코다리찜',
		grade: 'D',
		isIngredient: false,
		sellPrice: 700,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	{
		id: 332,
		name: '김치만두',
		grade: 'D',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/329.webp'
	},
	{
		id: 333,
		name: '김치전',
		grade: 'D',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/404.webp'
	},
	{
		id: 334,
		name: '김치수제비',
		grade: 'D',
		isIngredient: false,
		sellPrice: 580,
		imageUrl: '/imgs/ingredients2/221.webp'
	},
	{
		id: 335,
		name: '과일스무디',
		grade: 'D',
		isIngredient: false,
		sellPrice: 550,
		imageUrl: '/imgs/ingredients2/37.webp'
	},
	{
		id: 336,
		name: '김치찌개',
		grade: 'D',
		isIngredient: false,
		sellPrice: 620,
		imageUrl: '/imgs/ingredients2/219.webp'
	},
	{
		id: 337,
		name: '동태찌개',
		grade: 'D',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/219.webp'
	},
	{
		id: 338,
		name: '게살볶음밥',
		grade: 'D',
		isIngredient: false,
		sellPrice: 720,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 339,
		name: '튀김아이스크림',
		grade: 'D',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/348.webp'
	},
	{
		id: 340,
		name: '튀김우동',
		grade: 'D',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/221.webp'
	},
	{
		id: 341,
		name: '생크림케이크',
		grade: 'D',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/227.webp'
	},
	{
		id: 342,
		name: '젤라또',
		grade: 'D',
		isIngredient: false,
		sellPrice: 550,
		imageUrl: '/imgs/ingredients2/348.webp'
	},
	{
		id: 343,
		name: '김치볶음밥',
		grade: 'D',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 344,
		name: '크레페',
		grade: 'D',
		isIngredient: false,
		sellPrice: 580,
		imageUrl: '/imgs/ingredients2/227.webp'
	},
	{
		id: 345,
		name: '아이스크림떡',
		grade: 'D',
		isIngredient: false,
		sellPrice: 550,
		imageUrl: '/imgs/ingredients2/348.webp'
	},
	{
		id: 346,
		name: '가래떡구이',
		grade: 'D',
		isIngredient: false,
		sellPrice: 520,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 347,
		name: '완탕면',
		grade: 'D',
		isIngredient: false,
		sellPrice: 620,
		imageUrl: '/imgs/ingredients2/221.webp'
	},

	// ========== C등급 (39개) - 재료 12개 + 요리 27개 ==========
	// C등급 재료 (12개)
	{
		id: 401,
		name: '갈비찜',
		grade: 'C',
		isIngredient: true,
		buyPrice: 280,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	{
		id: 402,
		name: '모듬회',
		grade: 'C',
		isIngredient: true,
		buyPrice: 260,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 403,
		name: '해물탕',
		grade: 'C',
		isIngredient: true,
		buyPrice: 300,
		imageUrl: '/imgs/ingredients2/506.webp'
	},
	{
		id: 404,
		name: '전복찜',
		grade: 'C',
		isIngredient: true,
		buyPrice: 270,
		imageUrl: '/imgs/ingredients2/25.webp'
	},
	{
		id: 405,
		name: '게살수프',
		grade: 'C',
		isIngredient: true,
		buyPrice: 290,
		imageUrl: '/imgs/ingredients2/324.webp'
	},
	{
		id: 406,
		name: '크림파스타',
		grade: 'C',
		isIngredient: true,
		buyPrice: 300,
		imageUrl: '/imgs/ingredients2/409.webp'
	},
	{
		id: 407,
		name: '전주비빔밥',
		grade: 'C',
		isIngredient: true,
		buyPrice: 250,
		imageUrl: '/imgs/ingredients2/503.webp'
	},
	{
		id: 408,
		name: '초밥세트',
		grade: 'C',
		isIngredient: true,
		buyPrice: 280,
		imageUrl: '/imgs/ingredients2/332.webp'
	},
	{
		id: 409,
		name: '오리로스',
		grade: 'C',
		isIngredient: true,
		buyPrice: 270,
		imageUrl: '/imgs/ingredients2/611.webp'
	},
	{
		id: 410,
		name: '탕수육',
		grade: 'C',
		isIngredient: true,
		buyPrice: 230,
		imageUrl: '/imgs/ingredients2/416.webp'
	},
	{
		id: 411,
		name: '과일타르트',
		grade: 'C',
		isIngredient: true,
		buyPrice: 240,
		imageUrl: '/imgs/ingredients2/226.webp'
	},
	{
		id: 412,
		name: '크림브륄레',
		grade: 'C',
		isIngredient: true,
		buyPrice: 250,
		imageUrl: '/imgs/ingredients2/345.webp'
	},
	// C등급 요리 (27개) - 재료비 400~600원 기준, 판매가 1000~1600원
	// 고기 계열 (5개)
	{
		id: 413,
		name: '챠슈동',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1400,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 414,
		name: '돈카츠카레',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	{
		id: 415,
		name: '규동',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 416,
		name: '차슈멘',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/424.webp'
	},
	{
		id: 417,
		name: '치킨카츠',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1250,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	// 해물 계열 (7개)
	{
		id: 418,
		name: '해물덮밥',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1400,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 419,
		name: '조개찜',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1450,
		imageUrl: '/imgs/ingredients2/506.webp'
	},
	{
		id: 420,
		name: '매운탕',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1200,
		imageUrl: '/imgs/ingredients2/219.webp'
	},
	{
		id: 421,
		name: '낙지전골',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/401.webp'
	},
	{
		id: 422,
		name: '크림새우',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/324.webp'
	},
	{
		id: 423,
		name: '꽃게찜',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1400,
		imageUrl: '/imgs/ingredients2/33.webp'
	},
	{
		id: 424,
		name: '짬뽕',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1250,
		imageUrl: '/imgs/ingredients2/424.webp'
	},
	// 초밥/일식 계열 (3개)
	{
		id: 425,
		name: '돈가스정식',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1400,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	{
		id: 426,
		name: '우동전골',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/221.webp'
	},
	{
		id: 427,
		name: '라멘교자',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/424.webp'
	},
	// 파스타/양식 계열 (3개)
	{
		id: 428,
		name: '삼겹파스타',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/409.webp'
	},
	{
		id: 429,
		name: '카르보나라',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1250,
		imageUrl: '/imgs/ingredients2/409.webp'
	},
	{
		id: 430,
		name: '봉골레',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1200,
		imageUrl: '/imgs/ingredients2/409.webp'
	},
	// 한식 계열 (4개)
	{
		id: 431,
		name: '부대찌개',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/219.webp'
	},
	{
		id: 432,
		name: '해물전',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1250,
		imageUrl: '/imgs/ingredients2/404.webp'
	},
	{
		id: 433,
		name: '파전',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1150,
		imageUrl: '/imgs/ingredients2/404.webp'
	},
	{
		id: 434,
		name: '김치찜',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	// 중식 계열 (2개)
	{
		id: 435,
		name: '울면',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1200,
		imageUrl: '/imgs/ingredients2/424.webp'
	},
	{
		id: 436,
		name: '유린기',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	// 디저트 계열 (3개)
	{
		id: 437,
		name: '츄러스',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1100,
		imageUrl: '/imgs/ingredients2/40.webp'
	},
	{
		id: 438,
		name: '티라미수',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1150,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	{
		id: 439,
		name: '해물파전',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1250,
		imageUrl: '/imgs/ingredients2/404.webp'
	},

	// ========== B등급 (31개) - 재료 11개 + 요리 20개 ==========
	// B등급 재료 (11개)
	{
		id: 501,
		name: '채끝스테이크',
		grade: 'B',
		isIngredient: true,
		buyPrice: 380,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	{
		id: 502,
		name: '참치회',
		grade: 'B',
		isIngredient: true,
		buyPrice: 400,
		imageUrl: '/imgs/ingredients2/616.webp'
	},
	{
		id: 503,
		name: '크랩앤랍스터',
		grade: 'B',
		isIngredient: true,
		buyPrice: 420,
		imageUrl: '/imgs/ingredients2/120.webp'
	},
	{
		id: 504,
		name: '트러플리조또',
		grade: 'B',
		isIngredient: true,
		buyPrice: 380,
		imageUrl: '/imgs/ingredients2/3.webp'
	},
	{
		id: 505,
		name: '오리콩피',
		grade: 'B',
		isIngredient: true,
		buyPrice: 350,
		imageUrl: '/imgs/ingredients2/744.webp'
	},
	{
		id: 506,
		name: '슈바인학센',
		grade: 'B',
		isIngredient: true,
		buyPrice: 360,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 507,
		name: '스시모듬',
		grade: 'B',
		isIngredient: true,
		buyPrice: 400,
		imageUrl: '/imgs/ingredients2/619.webp'
	},
	{
		id: 508,
		name: '프렌치정식',
		grade: 'B',
		isIngredient: true,
		buyPrice: 380,
		imageUrl: '/imgs/ingredients2/600.webp'
	},
	{
		id: 509,
		name: '궁중떡갈비',
		grade: 'B',
		isIngredient: true,
		buyPrice: 390,
		imageUrl: '/imgs/ingredients2/617.webp'
	},
	{
		id: 510,
		name: '전복스테이크',
		grade: 'B',
		isIngredient: true,
		buyPrice: 340,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	{
		id: 511,
		name: '가토쇼콜라',
		grade: 'B',
		isIngredient: true,
		buyPrice: 350,
		imageUrl: '/imgs/ingredients2/751.webp'
	},
	// B등급 요리 (20개) - 재료비 600~900원 기준, 판매가 1500~2400원
	// 고기 계열 (4개)
	{
		id: 512,
		name: '갈비크림파스타',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1800,
		imageUrl: '/imgs/ingredients2/409.webp'
	},
	{
		id: 513,
		name: '카나르오랑주',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1900,
		imageUrl: '/imgs/ingredients2/611.webp'
	},
	{
		id: 514,
		name: '오리훈제',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1750,
		imageUrl: '/imgs/ingredients2/611.webp'
	},
	{
		id: 515,
		name: '비프스튜',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1850,
		imageUrl: '/imgs/ingredients2/324.webp'
	},
	// 해물 계열 (4개)
	{
		id: 516,
		name: '전복버터구이',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2000,
		imageUrl: '/imgs/ingredients2/25.webp'
	},
	{
		id: 517,
		name: '전복초밥',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1900,
		imageUrl: '/imgs/ingredients2/332.webp'
	},
	{
		id: 518,
		name: '전복크림파스타',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1950,
		imageUrl: '/imgs/ingredients2/409.webp'
	},
	{
		id: 519,
		name: '게살크림리조또',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1850,
		imageUrl: '/imgs/ingredients2/607.webp'
	},
	// 일식 계열 (3개)
	{
		id: 520,
		name: '사시미모듬',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2100,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 521,
		name: '해물초밥',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1800,
		imageUrl: '/imgs/ingredients2/332.webp'
	},
	{
		id: 522,
		name: '회샤브샤브',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2000,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	// 양식 계열 (1개)
	{
		id: 523,
		name: '해물그라탕',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1750,
		imageUrl: '/imgs/ingredients2/506.webp'
	},
	// 한식 계열 (3개)
	{
		id: 524,
		name: '전복죽',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1800,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 525,
		name: '갈비탕',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1900,
		imageUrl: '/imgs/ingredients2/103.webp'
	},
	{
		id: 526,
		name: '한정식',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2200,
		imageUrl: '/imgs/ingredients2/601.webp'
	},
	// 중식 계열 (2개)
	{
		id: 527,
		name: '깐쇼새우',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1700,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	{
		id: 528,
		name: '팔보채',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1850,
		imageUrl: '/imgs/ingredients2/416.webp'
	},
	// 디저트 계열 (3개)
	{
		id: 529,
		name: '타르트타탱',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1600,
		imageUrl: '/imgs/ingredients2/226.webp'
	},
	{
		id: 530,
		name: '무스케이크',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1650,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	{
		id: 531,
		name: '밀크레페',
		grade: 'B',
		isIngredient: false,
		sellPrice: 1700,
		imageUrl: '/imgs/ingredients2/227.webp'
	},

	// ========== A등급 - 재료 12개 + 요리 ==========
	// A등급 재료 (12개)
	{
		id: 601,
		name: 'T본스테이크',
		grade: 'A',
		isIngredient: true,
		buyPrice: 550,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	{
		id: 602,
		name: '참치스테이크',
		grade: 'A',
		isIngredient: true,
		buyPrice: 560,
		imageUrl: '/imgs/ingredients2/21.webp'
	},
	{
		id: 603,
		name: '트러플크림수프',
		grade: 'A',
		isIngredient: true,
		buyPrice: 540,
		imageUrl: '/imgs/ingredients2/324.webp'
	},
	{
		id: 604,
		name: '전복해물찜',
		grade: 'A',
		isIngredient: true,
		buyPrice: 560,
		imageUrl: '/imgs/ingredients2/506.webp'
	},
	{
		id: 605,
		name: '랍스터그라탕',
		grade: 'A',
		isIngredient: true,
		buyPrice: 580,
		imageUrl: '/imgs/ingredients2/120.webp'
	},
	{
		id: 606,
		name: '킹크랩버터구이',
		grade: 'A',
		isIngredient: true,
		buyPrice: 600,
		imageUrl: '/imgs/ingredients2/618.webp'
	},
	{
		id: 607,
		name: '카수레',
		grade: 'A',
		isIngredient: true,
		buyPrice: 520,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 608,
		name: '마그레',
		grade: 'A',
		isIngredient: true,
		buyPrice: 500,
		imageUrl: '/imgs/ingredients2/611.webp'
	},
	{
		id: 609,
		name: '씨푸드플래터',
		grade: 'A',
		isIngredient: true,
		buyPrice: 570,
		imageUrl: '/imgs/ingredients2/600.webp'
	},
	{
		id: 610,
		name: '궁중잡채',
		grade: 'A',
		isIngredient: true,
		buyPrice: 480,
		imageUrl: '/imgs/ingredients2/500.webp'
	},
	{
		id: 611,
		name: '카이세키',
		grade: 'A',
		isIngredient: true,
		buyPrice: 590,
		imageUrl: '/imgs/ingredients2/619.webp'
	},
	{
		id: 612,
		name: '파리브레스트',
		grade: 'A',
		isIngredient: true,
		buyPrice: 450,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	// A등급 요리 (18개) - B등급 재료 조합, 판매가 2200~3200원
	{
		id: 613,
		name: '스테이크타르타르',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2400,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	{
		id: 614,
		name: '로스트비프',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2500,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 615,
		name: '트러플스테이크',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2800,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 616,
		name: '참치카르파초',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2600,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 617,
		name: '니기리모듬',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2700,
		imageUrl: '/imgs/ingredients2/332.webp'
	},
	{
		id: 618,
		name: '랍스터비스크',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2900,
		imageUrl: '/imgs/ingredients2/324.webp'
	},
	{
		id: 619,
		name: '오리가슴살구이',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2650,
		imageUrl: '/imgs/ingredients2/611.webp'
	},
	{
		id: 620,
		name: '오리불고기',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2550,
		imageUrl: '/imgs/ingredients2/611.webp'
	},
	{
		id: 621,
		name: '아이스바인',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2700,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 622,
		name: '슈바인브라텐',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2750,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 623,
		name: '에도마에스시',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2850,
		imageUrl: '/imgs/ingredients2/332.webp'
	},
	{
		id: 624,
		name: '전복회무침',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2600,
		imageUrl: '/imgs/ingredients2/25.webp'
	},
	{
		id: 625,
		name: '어복쟁반',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2800,
		imageUrl: '/imgs/ingredients2/500.webp'
	},
	{
		id: 626,
		name: '불고기정식',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2500,
		imageUrl: '/imgs/ingredients2/300.webp'
	},
	{
		id: 627,
		name: '밀푀유쇼콜라',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2300,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	{
		id: 628,
		name: '초콜릿무스',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2400,
		imageUrl: '/imgs/ingredients2/344.webp'
	},
	{
		id: 629,
		name: '퐁뒤',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2650,
		imageUrl: '/imgs/ingredients2/607.webp'
	},
	{
		id: 630,
		name: '아쿠아파차',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2750,
		imageUrl: '/imgs/ingredients2/506.webp'
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
		name: '북경오리',
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
		name: '참치오마카세',
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
