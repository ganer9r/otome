import type { Ingredient } from '../types';

/**
 * 재료 + 요리 데이터
 *
 * 요리 등급 = 사용한 재료의 등급
 * G+G → F재료/G요리, F+F → E재료/F요리, ... A+A → A요리
 *
 * 총: 261개 (재료 82개 + 요리 179개)
 */
export const INGREDIENTS_DATA: Ingredient[] = [
	// ========== G등급 - 재료 8개 + 요리 15개 ==========
	// G등급 재료
	{
		id: 1,
		name: '쌀',
		grade: 'G',
		isIngredient: true,
		buyPrice: 50,
		sellPrice: 110,
		imageUrl: '/imgs/ingredients2/1.webp'
	},
	{
		id: 2,
		name: '밀',
		grade: 'G',
		isIngredient: true,
		buyPrice: 40,
		sellPrice: 90,
		imageUrl: '/imgs/ingredients2/2.webp'
	},
	{
		id: 3,
		name: '고기',
		grade: 'G',
		isIngredient: true,
		buyPrice: 60,
		sellPrice: 140,
		imageUrl: '/imgs/ingredients2/3.webp'
	},
	{
		id: 4,
		name: '해물',
		grade: 'G',
		isIngredient: true,
		buyPrice: 50,
		sellPrice: 120,
		imageUrl: '/imgs/ingredients2/4.webp'
	},
	{
		id: 5,
		name: '채소',
		grade: 'G',
		isIngredient: true,
		buyPrice: 40,
		sellPrice: 100,
		imageUrl: '/imgs/ingredients2/5.webp'
	},
	{
		id: 6,
		name: '과일',
		grade: 'G',
		isIngredient: true,
		buyPrice: 50,
		sellPrice: 110,
		imageUrl: '/imgs/ingredients2/6.webp'
	},
	{
		id: 7,
		name: '물',
		grade: 'G',
		isIngredient: true,
		buyPrice: 40,
		sellPrice: 90,
		imageUrl: '/imgs/ingredients2/7.webp'
	},
	{
		id: 8,
		name: '불',
		grade: 'G',
		isIngredient: true,
		buyPrice: 60,
		sellPrice: 150,
		imageUrl: '/imgs/ingredients2/8.webp'
	},
	// G등급 요리
	{
		id: 9,
		name: '해초나물',
		grade: 'G',
		isIngredient: false,
		sellPrice: 230,
		imageUrl: '/imgs/ingredients2/9.webp'
	},
	{
		id: 10,
		name: '구운해물',
		grade: 'G',
		isIngredient: false,
		sellPrice: 280,
		imageUrl: '/imgs/ingredients2/10.webp'
	},
	{
		id: 11,
		name: '샐러드',
		grade: 'G',
		isIngredient: false,
		sellPrice: 200,
		imageUrl: '/imgs/ingredients2/11.webp'
	},
	{
		id: 12,
		name: '칼솟',
		grade: 'G',
		isIngredient: false,
		sellPrice: 250,
		imageUrl: '/imgs/ingredients2/12.webp'
	},
	{
		id: 13,
		name: '과일청',
		grade: 'G',
		isIngredient: false,
		sellPrice: 220,
		imageUrl: '/imgs/ingredients2/13.webp'
	},
	{
		id: 14,
		name: '주스',
		grade: 'G',
		isIngredient: false,
		sellPrice: 210,
		imageUrl: '/imgs/ingredients2/14.webp'
	},
	{
		id: 15,
		name: '누룽지',
		grade: 'G',
		isIngredient: false,
		sellPrice: 270,
		imageUrl: '/imgs/ingredients2/15.webp'
	},
	{
		id: 16,
		name: '나물밥',
		grade: 'G',
		isIngredient: false,
		sellPrice: 220,
		imageUrl: '/imgs/ingredients2/16.webp'
	},
	{
		id: 17,
		name: '어묵',
		grade: 'G',
		isIngredient: false,
		sellPrice: 250,
		imageUrl: '/imgs/ingredients2/17.webp'
	},
	{
		id: 18,
		name: '조개탕',
		grade: 'G',
		isIngredient: false,
		sellPrice: 230,
		imageUrl: '/imgs/ingredients2/18.webp'
	},
	{
		id: 19,
		name: '크래커',
		grade: 'G',
		isIngredient: false,
		sellPrice: 200,
		imageUrl: '/imgs/ingredients2/19.webp'
	},
	{
		id: 20,
		name: '또띠아',
		grade: 'G',
		isIngredient: false,
		sellPrice: 210,
		imageUrl: '/imgs/ingredients2/20.webp'
	},
	{
		id: 21,
		name: '소시지',
		grade: 'G',
		isIngredient: false,
		sellPrice: 280,
		imageUrl: '/imgs/ingredients2/21.webp'
	},
	{
		id: 22,
		name: '묵',
		grade: 'G',
		isIngredient: false,
		sellPrice: 240,
		imageUrl: '/imgs/ingredients2/22.webp'
	},
	{
		id: 23,
		name: '온수',
		grade: 'G',
		isIngredient: false,
		sellPrice: 200,
		imageUrl: '/imgs/ingredients2/23.webp'
	},

	// ========== F등급 - 재료 12개 + 요리 49개 ==========
	// F등급 재료
	{
		id: 101,
		name: '밥',
		grade: 'F',
		isIngredient: true,
		buyPrice: 80,
		sellPrice: 180,
		imageUrl: '/imgs/ingredients2/101.webp'
	},
	{
		id: 102,
		name: '반죽',
		grade: 'F',
		isIngredient: true,
		buyPrice: 70,
		sellPrice: 160,
		imageUrl: '/imgs/ingredients2/102.webp'
	},
	{
		id: 103,
		name: '빵',
		grade: 'F',
		isIngredient: true,
		buyPrice: 90,
		sellPrice: 200,
		imageUrl: '/imgs/ingredients2/103.webp'
	},
	{
		id: 104,
		name: '다짐육',
		grade: 'F',
		isIngredient: true,
		buyPrice: 100,
		sellPrice: 230,
		imageUrl: '/imgs/ingredients2/104.webp'
	},
	{
		id: 105,
		name: '양념육',
		grade: 'F',
		isIngredient: true,
		buyPrice: 90,
		sellPrice: 210,
		imageUrl: '/imgs/ingredients2/105.webp'
	},
	{
		id: 106,
		name: '양념장',
		grade: 'F',
		isIngredient: true,
		buyPrice: 80,
		sellPrice: 180,
		imageUrl: '/imgs/ingredients2/106.webp'
	},
	{
		id: 107,
		name: '육수',
		grade: 'F',
		isIngredient: true,
		buyPrice: 70,
		sellPrice: 160,
		imageUrl: '/imgs/ingredients2/107.webp'
	},
	{
		id: 108,
		name: '횟감',
		grade: 'F',
		isIngredient: true,
		buyPrice: 100,
		sellPrice: 240,
		imageUrl: '/imgs/ingredients2/108.webp'
	},
	{
		id: 109,
		name: '절임',
		grade: 'F',
		isIngredient: true,
		buyPrice: 70,
		sellPrice: 150,
		imageUrl: '/imgs/ingredients2/109.webp'
	},
	{
		id: 111,
		name: '잼',
		grade: 'F',
		isIngredient: true,
		buyPrice: 90,
		sellPrice: 200,
		imageUrl: '/imgs/ingredients2/111.webp'
	},
	{
		id: 112,
		name: '얼음',
		grade: 'F',
		isIngredient: true,
		buyPrice: 60,
		imageUrl: '/imgs/ingredients2/112.webp'
	},
	{
		id: 123,
		name: '떡',
		grade: 'F',
		isIngredient: true,
		buyPrice: 80,
		imageUrl: '/imgs/ingredients2/123.webp'
	},
	// F등급 요리
	{
		id: 124,
		name: '주먹밥',
		grade: 'F',
		isIngredient: false,
		sellPrice: 350,
		imageUrl: '/imgs/ingredients2/124.webp'
	},
	{
		id: 125,
		name: '국밥',
		grade: 'F',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/125.webp'
	},
	{
		id: 126,
		name: '비빔밥',
		grade: 'F',
		isIngredient: false,
		sellPrice: 430,
		imageUrl: '/imgs/ingredients2/126.webp'
	},
	{
		id: 127,
		name: '오므라이스',
		grade: 'F',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/127.webp'
	},
	{
		id: 128,
		name: '유부초밥',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/128.webp'
	},
	{
		id: 129,
		name: '떡국',
		grade: 'F',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/129.webp'
	},
	{
		id: 130,
		name: '칼국수',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/130.webp'
	},
	{
		id: 131,
		name: '라면',
		grade: 'F',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/131.webp'
	},
	{
		id: 132,
		name: '파이',
		grade: 'F',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/132.webp'
	},
	{
		id: 133,
		name: '냉면',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/133.webp'
	},
	{
		id: 134,
		name: '호떡',
		grade: 'F',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/134.webp'
	},
	{
		id: 135,
		name: '햄버거',
		grade: 'F',
		isIngredient: false,
		sellPrice: 480,
		imageUrl: '/imgs/ingredients2/135.webp'
	},
	{
		id: 136,
		name: '토스트',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/136.webp'
	},
	{
		id: 137,
		name: '샌드위치',
		grade: 'F',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/137.webp'
	},
	{
		id: 138,
		name: '쿠키',
		grade: 'F',
		isIngredient: false,
		sellPrice: 350,
		imageUrl: '/imgs/ingredients2/138.webp'
	},
	{
		id: 139,
		name: '프렌치토스트',
		grade: 'F',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/139.webp'
	},
	{
		id: 140,
		name: '카나페',
		grade: 'F',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/140.webp'
	},
	{
		id: 141,
		name: '완자탕',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/141.webp'
	},
	{
		id: 142,
		name: '불고기',
		grade: 'F',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/142.webp'
	},
	{
		id: 143,
		name: '장조림',
		grade: 'F',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/143.webp'
	},
	{
		id: 144,
		name: '미트볼',
		grade: 'F',
		isIngredient: false,
		sellPrice: 470,
		imageUrl: '/imgs/ingredients2/144.webp'
	},
	{
		id: 145,
		name: '떡갈비',
		grade: 'F',
		isIngredient: false,
		sellPrice: 460,
		imageUrl: '/imgs/ingredients2/145.webp'
	},
	{
		id: 146,
		name: '냉채',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/146.webp'
	},
	{
		id: 147,
		name: '육회',
		grade: 'F',
		isIngredient: false,
		sellPrice: 480,
		imageUrl: '/imgs/ingredients2/147.webp'
	},
	{
		id: 148,
		name: '제육볶음',
		grade: 'F',
		isIngredient: false,
		sellPrice: 470,
		imageUrl: '/imgs/ingredients2/148.webp'
	},
	{
		id: 149,
		name: '보쌈',
		grade: 'F',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/149.webp'
	},
	{
		id: 150,
		name: '닭강정',
		grade: 'F',
		isIngredient: false,
		sellPrice: 430,
		imageUrl: '/imgs/ingredients2/150.webp'
	},
	{
		id: 151,
		name: '떡꼬치',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/151.webp'
	},
	{
		id: 152,
		name: '냉삼',
		grade: 'F',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/152.webp'
	},
	{
		id: 153,
		name: '쌈장',
		grade: 'F',
		isIngredient: false,
		sellPrice: 350,
		imageUrl: '/imgs/ingredients2/153.webp'
	},
	{
		id: 154,
		name: '회무침',
		grade: 'F',
		isIngredient: false,
		sellPrice: 360,
		imageUrl: '/imgs/ingredients2/154.webp'
	},
	{
		id: 155,
		name: '떡볶이',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/155.webp'
	},
	{
		id: 156,
		name: '데리야끼',
		grade: 'F',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/156.webp'
	},
	{
		id: 157,
		name: '냉소스',
		grade: 'F',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/157.webp'
	},
	{
		id: 158,
		name: '된장국',
		grade: 'F',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/158.webp'
	},
	{
		id: 159,
		name: '단팥죽',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/159.webp'
	},
	{
		id: 160,
		name: '냉국',
		grade: 'F',
		isIngredient: false,
		sellPrice: 370,
		imageUrl: '/imgs/ingredients2/160.webp'
	},
	{
		id: 161,
		name: '젓갈',
		grade: 'F',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/161.webp'
	},
	{
		id: 162,
		name: '빙어회',
		grade: 'F',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/162.webp'
	},
	{
		id: 163,
		name: '어묵탕',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/163.webp'
	},
	{
		id: 164,
		name: '피클',
		grade: 'F',
		isIngredient: false,
		sellPrice: 350,
		imageUrl: '/imgs/ingredients2/164.webp'
	},
	{
		id: 165,
		name: '과일절임',
		grade: 'F',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/165.webp'
	},
	{
		id: 166,
		name: '동치미',
		grade: 'F',
		isIngredient: false,
		sellPrice: 360,
		imageUrl: '/imgs/ingredients2/166.webp'
	},
	{
		id: 167,
		name: '푸딩',
		grade: 'F',
		isIngredient: false,
		sellPrice: 430,
		imageUrl: '/imgs/ingredients2/167.webp'
	},
	{
		id: 168,
		name: '약과',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/168.webp'
	},
	{
		id: 169,
		name: '약밥',
		grade: 'F',
		isIngredient: false,
		sellPrice: 420,
		imageUrl: '/imgs/ingredients2/169.webp'
	},
	{
		id: 170,
		name: '팥빙수',
		grade: 'F',
		isIngredient: false,
		sellPrice: 400,
		imageUrl: '/imgs/ingredients2/170.webp'
	},
	{
		id: 171,
		name: '떡빙수',
		grade: 'F',
		isIngredient: false,
		sellPrice: 450,
		imageUrl: '/imgs/ingredients2/171.webp'
	},
	{
		id: 172,
		name: '도넛',
		grade: 'F',
		isIngredient: false,
		sellPrice: 380,
		imageUrl: '/imgs/ingredients2/172.webp'
	},

	// ========== E등급 - 재료 14개 + 요리 34개 ==========
	// E등급 재료
	{
		id: 201,
		name: '면',
		grade: 'E',
		isIngredient: true,
		buyPrice: 120,
		imageUrl: '/imgs/ingredients2/201.webp'
	},
	{
		id: 202,
		name: '튀김',
		grade: 'E',
		isIngredient: true,
		buyPrice: 130,
		imageUrl: '/imgs/ingredients2/202.webp'
	},
	{
		id: 203,
		name: '구이',
		grade: 'E',
		isIngredient: true,
		buyPrice: 150,
		imageUrl: '/imgs/ingredients2/203.webp'
	},
	{
		id: 204,
		name: '수프',
		grade: 'E',
		isIngredient: true,
		buyPrice: 100,
		imageUrl: '/imgs/ingredients2/204.webp'
	},
	{
		id: 205,
		name: '회',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/205.webp'
	},
	{
		id: 206,
		name: '가래떡',
		grade: 'E',
		isIngredient: true,
		buyPrice: 100,
		imageUrl: '/imgs/ingredients2/206.webp'
	},
	{
		id: 207,
		name: '찜',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/207.webp'
	},
	{
		id: 208,
		name: '김치',
		grade: 'E',
		isIngredient: true,
		buyPrice: 110,
		imageUrl: '/imgs/ingredients2/208.webp'
	},
	{
		id: 209,
		name: '만두',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/209.webp'
	},
	{
		id: 210,
		name: '찌개',
		grade: 'E',
		isIngredient: true,
		buyPrice: 130,
		imageUrl: '/imgs/ingredients2/210.webp'
	},
	{
		id: 211,
		name: '초밥',
		grade: 'E',
		isIngredient: true,
		buyPrice: 130,
		imageUrl: '/imgs/ingredients2/211.webp'
	},
	{
		id: 212,
		name: '케이크',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/212.webp'
	},
	{
		id: 213,
		name: '과일아이스크림',
		grade: 'E',
		isIngredient: true,
		buyPrice: 120,
		imageUrl: '/imgs/ingredients2/213.webp'
	},
	{
		id: 214,
		name: '게살',
		grade: 'E',
		isIngredient: true,
		buyPrice: 140,
		imageUrl: '/imgs/ingredients2/214.webp'
	},
	// E등급 요리
	{
		id: 215,
		name: '우동',
		grade: 'E',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/215.webp'
	},
	{
		id: 216,
		name: '볶음면',
		grade: 'E',
		isIngredient: false,
		sellPrice: 620,
		imageUrl: '/imgs/ingredients2/216.webp'
	},
	{
		id: 217,
		name: '잔치국수',
		grade: 'E',
		isIngredient: false,
		sellPrice: 580,
		imageUrl: '/imgs/ingredients2/217.webp'
	},
	{
		id: 218,
		name: '비빔국수',
		grade: 'E',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/218.webp'
	},
	{
		id: 219,
		name: '새우튀김',
		grade: 'E',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/219.webp'
	},
	{
		id: 220,
		name: '텐동',
		grade: 'E',
		isIngredient: false,
		sellPrice: 700,
		imageUrl: '/imgs/ingredients2/220.webp'
	},
	{
		id: 221,
		name: '꼬치구이',
		grade: 'E',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/221.webp'
	},
	{
		id: 222,
		name: '철판구이',
		grade: 'E',
		isIngredient: false,
		sellPrice: 750,
		imageUrl: '/imgs/ingredients2/222.webp'
	},
	{
		id: 223,
		name: '핫케이크',
		grade: 'E',
		isIngredient: false,
		sellPrice: 550,
		imageUrl: '/imgs/ingredients2/223.webp'
	},
	{
		id: 224,
		name: '해물수프',
		grade: 'E',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/224.webp'
	},
	{
		id: 225,
		name: '물회',
		grade: 'E',
		isIngredient: false,
		sellPrice: 700,
		imageUrl: '/imgs/ingredients2/225.webp'
	},
	{
		id: 226,
		name: '회덮밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 720,
		imageUrl: '/imgs/ingredients2/226.webp'
	},
	{
		id: 227,
		name: '떡찜',
		grade: 'E',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/227.webp'
	},
	{
		id: 228,
		name: '두부김치',
		grade: 'E',
		isIngredient: false,
		sellPrice: 580,
		imageUrl: '/imgs/ingredients2/228.webp'
	},
	{
		id: 229,
		name: '떡만두국',
		grade: 'E',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/229.webp'
	},
	{
		id: 230,
		name: '궁중떡볶이',
		grade: 'E',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/230.webp'
	},
	{
		id: 231,
		name: '만두찜',
		grade: 'E',
		isIngredient: false,
		sellPrice: 620,
		imageUrl: '/imgs/ingredients2/231.webp'
	},
	{
		id: 232,
		name: '코다리찜',
		grade: 'E',
		isIngredient: false,
		sellPrice: 700,
		imageUrl: '/imgs/ingredients2/232.webp'
	},
	{
		id: 233,
		name: '김치만두',
		grade: 'E',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/233.webp'
	},
	{
		id: 234,
		name: '김치전',
		grade: 'E',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/234.webp'
	},
	{
		id: 235,
		name: '김치수제비',
		grade: 'E',
		isIngredient: false,
		sellPrice: 580,
		imageUrl: '/imgs/ingredients2/235.webp'
	},
	{
		id: 236,
		name: '과일스무디',
		grade: 'E',
		isIngredient: false,
		sellPrice: 550,
		imageUrl: '/imgs/ingredients2/236.webp'
	},
	{
		id: 237,
		name: '김치찌개',
		grade: 'E',
		isIngredient: false,
		sellPrice: 620,
		imageUrl: '/imgs/ingredients2/237.webp'
	},
	{
		id: 238,
		name: '동태찌개',
		grade: 'E',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/238.webp'
	},
	{
		id: 239,
		name: '게살볶음밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 720,
		imageUrl: '/imgs/ingredients2/239.webp'
	},
	{
		id: 240,
		name: '튀김아이스크림',
		grade: 'E',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/240.webp'
	},
	{
		id: 241,
		name: '튀김우동',
		grade: 'E',
		isIngredient: false,
		sellPrice: 650,
		imageUrl: '/imgs/ingredients2/241.webp'
	},
	{
		id: 242,
		name: '생크림케이크',
		grade: 'E',
		isIngredient: false,
		sellPrice: 680,
		imageUrl: '/imgs/ingredients2/242.webp'
	},
	{
		id: 243,
		name: '젤라또',
		grade: 'E',
		isIngredient: false,
		sellPrice: 550,
		imageUrl: '/imgs/ingredients2/243.webp'
	},
	{
		id: 244,
		name: '김치볶음밥',
		grade: 'E',
		isIngredient: false,
		sellPrice: 600,
		imageUrl: '/imgs/ingredients2/244.webp'
	},
	{
		id: 245,
		name: '크레페',
		grade: 'E',
		isIngredient: false,
		sellPrice: 580,
		imageUrl: '/imgs/ingredients2/245.webp'
	},
	{
		id: 246,
		name: '아이스크림떡',
		grade: 'E',
		isIngredient: false,
		sellPrice: 550,
		imageUrl: '/imgs/ingredients2/246.webp'
	},
	{
		id: 247,
		name: '가래떡구이',
		grade: 'E',
		isIngredient: false,
		sellPrice: 520,
		imageUrl: '/imgs/ingredients2/247.webp'
	},
	{
		id: 248,
		name: '완탕면',
		grade: 'E',
		isIngredient: false,
		sellPrice: 620,
		imageUrl: '/imgs/ingredients2/248.webp'
	},

	// ========== D등급 - 재료 13개 + 요리 27개 ==========
	// D등급 재료
	{
		id: 301,
		name: '스테이크',
		grade: 'D',
		isIngredient: true,
		buyPrice: 200,
		imageUrl: '/imgs/ingredients2/301.webp'
	},
	{
		id: 302,
		name: '삼겹살구이',
		grade: 'D',
		isIngredient: true,
		buyPrice: 180,
		imageUrl: '/imgs/ingredients2/302.webp'
	},
	{
		id: 303,
		name: '후토마키',
		grade: 'D',
		isIngredient: true,
		buyPrice: 190,
		imageUrl: '/imgs/ingredients2/303.webp'
	},
	{
		id: 304,
		name: '돈카츠',
		grade: 'D',
		isIngredient: true,
		buyPrice: 200,
		imageUrl: '/imgs/ingredients2/304.webp'
	},
	{
		id: 305,
		name: '모듬초밥',
		grade: 'D',
		isIngredient: true,
		buyPrice: 180,
		imageUrl: '/imgs/ingredients2/305.webp'
	},
	{
		id: 306,
		name: '해물찜',
		grade: 'D',
		isIngredient: true,
		buyPrice: 210,
		imageUrl: '/imgs/ingredients2/306.webp'
	},
	{
		id: 307,
		name: '꽃게탕',
		grade: 'D',
		isIngredient: true,
		buyPrice: 200,
		imageUrl: '/imgs/ingredients2/307.webp'
	},
	{
		id: 308,
		name: '알리오올리오',
		grade: 'D',
		isIngredient: true,
		buyPrice: 170,
		imageUrl: '/imgs/ingredients2/308.webp'
	},
	{
		id: 309,
		name: '전골',
		grade: 'D',
		isIngredient: true,
		buyPrice: 190,
		imageUrl: '/imgs/ingredients2/309.webp'
	},
	{
		id: 310,
		name: '모듬전',
		grade: 'D',
		isIngredient: true,
		buyPrice: 170,
		imageUrl: '/imgs/ingredients2/310.webp'
	},
	{
		id: 311,
		name: '과일케이크',
		grade: 'D',
		isIngredient: true,
		buyPrice: 180,
		imageUrl: '/imgs/ingredients2/311.webp'
	},
	{
		id: 312,
		name: '크림',
		grade: 'D',
		isIngredient: true,
		buyPrice: 170,
		imageUrl: '/imgs/ingredients2/312.webp'
	},
	{
		id: 313,
		name: '라멘',
		grade: 'D',
		isIngredient: true,
		buyPrice: 180,
		imageUrl: '/imgs/ingredients2/313.webp'
	},
	// D등급 요리
	{
		id: 314,
		name: '챠슈동',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1400,
		imageUrl: '/imgs/ingredients2/314.webp'
	},
	{
		id: 315,
		name: '돈카츠카레',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/315.webp'
	},
	{
		id: 316,
		name: '규동',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/316.webp'
	},
	{
		id: 317,
		name: '차슈멘',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/317.webp'
	},
	{
		id: 318,
		name: '치킨카츠',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1250,
		imageUrl: '/imgs/ingredients2/318.webp'
	},
	{
		id: 319,
		name: '문어숙회',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1400,
		imageUrl: '/imgs/ingredients2/319.webp'
	},
	{
		id: 320,
		name: '조개찜',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1450,
		imageUrl: '/imgs/ingredients2/320.webp'
	},
	{
		id: 321,
		name: '매운탕',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1200,
		imageUrl: '/imgs/ingredients2/321.webp'
	},
	{
		id: 322,
		name: '낙지전골',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/322.webp'
	},
	{
		id: 323,
		name: '크림새우',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/323.webp'
	},
	{
		id: 324,
		name: '꽃게찜',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1400,
		imageUrl: '/imgs/ingredients2/324.webp'
	},
	{
		id: 325,
		name: '짬뽕',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1250,
		imageUrl: '/imgs/ingredients2/325.webp'
	},
	{
		id: 326,
		name: '돈가스정식',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1400,
		imageUrl: '/imgs/ingredients2/326.webp'
	},
	{
		id: 327,
		name: '우동전골',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/327.webp'
	},
	{
		id: 328,
		name: '라멘교자',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/328.webp'
	},
	{
		id: 329,
		name: '삼겹파스타',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/329.webp'
	},
	{
		id: 330,
		name: '카르보나라',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1250,
		imageUrl: '/imgs/ingredients2/330.webp'
	},
	{
		id: 331,
		name: '봉골레',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1200,
		imageUrl: '/imgs/ingredients2/331.webp'
	},
	{
		id: 332,
		name: '부대찌개',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/332.webp'
	},
	{
		id: 333,
		name: '해물전',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1250,
		imageUrl: '/imgs/ingredients2/333.webp'
	},
	{
		id: 334,
		name: '파전',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1150,
		imageUrl: '/imgs/ingredients2/334.webp'
	},
	{
		id: 335,
		name: '김치찜',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1350,
		imageUrl: '/imgs/ingredients2/335.webp'
	},
	{
		id: 336,
		name: '울면',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1200,
		imageUrl: '/imgs/ingredients2/336.webp'
	},
	{
		id: 337,
		name: '유린기',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1300,
		imageUrl: '/imgs/ingredients2/337.webp'
	},
	{
		id: 338,
		name: '츄러스',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1100,
		imageUrl: '/imgs/ingredients2/338.webp'
	},
	{
		id: 339,
		name: '티라미수',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1150,
		imageUrl: '/imgs/ingredients2/339.webp'
	},
	{
		id: 340,
		name: '해물파전',
		grade: 'D',
		isIngredient: false,
		sellPrice: 1250,
		imageUrl: '/imgs/ingredients2/340.webp'
	},

	// ========== C등급 - 재료 12개 + 요리 20개 ==========
	// C등급 재료
	{
		id: 401,
		name: '갈비찜',
		grade: 'C',
		isIngredient: true,
		buyPrice: 280,
		imageUrl: '/imgs/ingredients2/401.webp'
	},
	{
		id: 402,
		name: '모듬회',
		grade: 'C',
		isIngredient: true,
		buyPrice: 260,
		imageUrl: '/imgs/ingredients2/402.webp'
	},
	{
		id: 403,
		name: '해물탕',
		grade: 'C',
		isIngredient: true,
		buyPrice: 300,
		imageUrl: '/imgs/ingredients2/403.webp'
	},
	{
		id: 404,
		name: '전복찜',
		grade: 'C',
		isIngredient: true,
		buyPrice: 270,
		imageUrl: '/imgs/ingredients2/404.webp'
	},
	{
		id: 405,
		name: '게살수프',
		grade: 'C',
		isIngredient: true,
		buyPrice: 290,
		imageUrl: '/imgs/ingredients2/405.webp'
	},
	{
		id: 406,
		name: '크림파스타',
		grade: 'C',
		isIngredient: true,
		buyPrice: 300,
		imageUrl: '/imgs/ingredients2/406.webp'
	},
	{
		id: 407,
		name: '전주비빔밥',
		grade: 'C',
		isIngredient: true,
		buyPrice: 250,
		imageUrl: '/imgs/ingredients2/407.webp'
	},
	{
		id: 408,
		name: '초밥세트',
		grade: 'C',
		isIngredient: true,
		buyPrice: 280,
		imageUrl: '/imgs/ingredients2/408.webp'
	},
	{
		id: 409,
		name: '오리로스',
		grade: 'C',
		isIngredient: true,
		buyPrice: 270,
		imageUrl: '/imgs/ingredients2/409.webp'
	},
	{
		id: 410,
		name: '탕수육',
		grade: 'C',
		isIngredient: true,
		buyPrice: 230,
		imageUrl: '/imgs/ingredients2/410.webp'
	},
	{
		id: 411,
		name: '과일타르트',
		grade: 'C',
		isIngredient: true,
		buyPrice: 240,
		imageUrl: '/imgs/ingredients2/411.webp'
	},
	{
		id: 412,
		name: '크림브륄레',
		grade: 'C',
		isIngredient: true,
		buyPrice: 250,
		imageUrl: '/imgs/ingredients2/412.webp'
	},
	// C등급 요리
	{
		id: 413,
		name: '갈비크림파스타',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1800,
		imageUrl: '/imgs/ingredients2/413.webp'
	},
	{
		id: 414,
		name: '카나르오랑주',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1900,
		imageUrl: '/imgs/ingredients2/414.webp'
	},
	{
		id: 415,
		name: '오리훈제',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1750,
		imageUrl: '/imgs/ingredients2/415.webp'
	},
	{
		id: 416,
		name: '비프스튜',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1850,
		imageUrl: '/imgs/ingredients2/416.webp'
	},
	{
		id: 417,
		name: '전복버터구이',
		grade: 'C',
		isIngredient: false,
		sellPrice: 2000,
		imageUrl: '/imgs/ingredients2/417.webp'
	},
	{
		id: 418,
		name: '전복초밥',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1900,
		imageUrl: '/imgs/ingredients2/418.webp'
	},
	{
		id: 419,
		name: '전복크림파스타',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1950,
		imageUrl: '/imgs/ingredients2/419.webp'
	},
	{
		id: 420,
		name: '게살크림리조또',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1850,
		imageUrl: '/imgs/ingredients2/420.webp'
	},
	{
		id: 421,
		name: '도미회',
		grade: 'C',
		isIngredient: false,
		sellPrice: 2100,
		imageUrl: '/imgs/ingredients2/421.webp'
	},
	{
		id: 422,
		name: '해물솥밥',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1800,
		imageUrl: '/imgs/ingredients2/422.webp'
	},
	{
		id: 423,
		name: '회샤브샤브',
		grade: 'C',
		isIngredient: false,
		sellPrice: 2000,
		imageUrl: '/imgs/ingredients2/423.webp'
	},
	{
		id: 424,
		name: '해물그라탕',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1750,
		imageUrl: '/imgs/ingredients2/424.webp'
	},
	{
		id: 425,
		name: '전복죽',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1800,
		imageUrl: '/imgs/ingredients2/425.webp'
	},
	{
		id: 426,
		name: '갈비탕',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1900,
		imageUrl: '/imgs/ingredients2/426.webp'
	},
	{
		id: 427,
		name: '한정식',
		grade: 'C',
		isIngredient: false,
		sellPrice: 2200,
		imageUrl: '/imgs/ingredients2/427.webp'
	},
	{
		id: 428,
		name: '깐쇼새우',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1700,
		imageUrl: '/imgs/ingredients2/428.webp'
	},
	{
		id: 429,
		name: '팔보채',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1850,
		imageUrl: '/imgs/ingredients2/429.webp'
	},
	{
		id: 430,
		name: '타르트타탱',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1600,
		imageUrl: '/imgs/ingredients2/430.webp'
	},
	{
		id: 431,
		name: '무스케이크',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1650,
		imageUrl: '/imgs/ingredients2/431.webp'
	},
	{
		id: 432,
		name: '밀크레페',
		grade: 'C',
		isIngredient: false,
		sellPrice: 1700,
		imageUrl: '/imgs/ingredients2/432.webp'
	},

	// ========== B등급 - 재료 11개 + 요리 18개 ==========
	// B등급 재료
	{
		id: 501,
		name: '채끝스테이크',
		grade: 'B',
		isIngredient: true,
		buyPrice: 380,
		imageUrl: '/imgs/ingredients2/501.webp'
	},
	{
		id: 502,
		name: '참치회',
		grade: 'B',
		isIngredient: true,
		buyPrice: 400,
		imageUrl: '/imgs/ingredients2/502.webp'
	},
	{
		id: 503,
		name: '크랩앤랍스터',
		grade: 'B',
		isIngredient: true,
		buyPrice: 420,
		imageUrl: '/imgs/ingredients2/503.webp'
	},
	{
		id: 504,
		name: '트러플리조또',
		grade: 'B',
		isIngredient: true,
		buyPrice: 380,
		imageUrl: '/imgs/ingredients2/504.webp'
	},
	{
		id: 505,
		name: '오리콩피',
		grade: 'B',
		isIngredient: true,
		buyPrice: 350,
		imageUrl: '/imgs/ingredients2/505.webp'
	},
	{
		id: 506,
		name: '슈바인학센',
		grade: 'B',
		isIngredient: true,
		buyPrice: 360,
		imageUrl: '/imgs/ingredients2/506.webp'
	},
	{
		id: 507,
		name: '스시모듬',
		grade: 'B',
		isIngredient: true,
		buyPrice: 400,
		imageUrl: '/imgs/ingredients2/507.webp'
	},
	{
		id: 508,
		name: '프렌치정식',
		grade: 'B',
		isIngredient: true,
		buyPrice: 380,
		imageUrl: '/imgs/ingredients2/508.webp'
	},
	{
		id: 509,
		name: '궁중떡갈비',
		grade: 'B',
		isIngredient: true,
		buyPrice: 390,
		imageUrl: '/imgs/ingredients2/509.webp'
	},
	{
		id: 510,
		name: '전복스테이크',
		grade: 'B',
		isIngredient: true,
		buyPrice: 340,
		imageUrl: '/imgs/ingredients2/510.webp'
	},
	{
		id: 511,
		name: '가토쇼콜라',
		grade: 'B',
		isIngredient: true,
		buyPrice: 350,
		imageUrl: '/imgs/ingredients2/511.webp'
	},
	// B등급 요리
	{
		id: 512,
		name: '스테이크타르타르',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2400,
		imageUrl: '/imgs/ingredients2/512.webp'
	},
	{
		id: 513,
		name: '로스트비프',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2500,
		imageUrl: '/imgs/ingredients2/513.webp'
	},
	{
		id: 514,
		name: '트러플스테이크',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2800,
		imageUrl: '/imgs/ingredients2/514.webp'
	},
	{
		id: 515,
		name: '참치카르파초',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2600,
		imageUrl: '/imgs/ingredients2/515.webp'
	},
	{
		id: 516,
		name: '카이세키',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2700,
		imageUrl: '/imgs/ingredients2/516.webp'
	},
	{
		id: 517,
		name: '랍스터비스크',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2900,
		imageUrl: '/imgs/ingredients2/517.webp'
	},
	{
		id: 518,
		name: '오리가슴살구이',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2650,
		imageUrl: '/imgs/ingredients2/518.webp'
	},
	{
		id: 519,
		name: '오리불고기',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2550,
		imageUrl: '/imgs/ingredients2/519.webp'
	},
	{
		id: 520,
		name: '아이스바인',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2700,
		imageUrl: '/imgs/ingredients2/520.webp'
	},
	{
		id: 521,
		name: '슈바인브라텐',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2750,
		imageUrl: '/imgs/ingredients2/521.webp'
	},
	{
		id: 522,
		name: '카이센동',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2850,
		imageUrl: '/imgs/ingredients2/522.webp'
	},
	{
		id: 523,
		name: '전복회무침',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2600,
		imageUrl: '/imgs/ingredients2/523.webp'
	},
	{
		id: 524,
		name: '어복쟁반',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2800,
		imageUrl: '/imgs/ingredients2/524.webp'
	},
	{
		id: 525,
		name: '불고기정식',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2500,
		imageUrl: '/imgs/ingredients2/525.webp'
	},
	{
		id: 526,
		name: '밀푀유쇼콜라',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2300,
		imageUrl: '/imgs/ingredients2/526.webp'
	},
	{
		id: 527,
		name: '초콜릿무스',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2400,
		imageUrl: '/imgs/ingredients2/527.webp'
	},
	{
		id: 528,
		name: '퐁뒤',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2650,
		imageUrl: '/imgs/ingredients2/528.webp'
	},
	{
		id: 529,
		name: '아쿠아파차',
		grade: 'B',
		isIngredient: false,
		sellPrice: 2750,
		imageUrl: '/imgs/ingredients2/529.webp'
	},

	// ========== A등급 - 재료 12개 + 요리 16개 ==========
	// A등급 재료
	{
		id: 601,
		name: 'T본스테이크',
		grade: 'A',
		isIngredient: true,
		buyPrice: 550,
		imageUrl: '/imgs/ingredients2/601.webp'
	},
	{
		id: 602,
		name: '참치스테이크',
		grade: 'A',
		isIngredient: true,
		buyPrice: 560,
		imageUrl: '/imgs/ingredients2/602.webp'
	},
	{
		id: 603,
		name: '트러플크림수프',
		grade: 'A',
		isIngredient: true,
		buyPrice: 540,
		imageUrl: '/imgs/ingredients2/603.webp'
	},
	{
		id: 604,
		name: '전복해물찜',
		grade: 'A',
		isIngredient: true,
		buyPrice: 560,
		imageUrl: '/imgs/ingredients2/604.webp'
	},
	{
		id: 605,
		name: '랍스터그라탕',
		grade: 'A',
		isIngredient: true,
		buyPrice: 580,
		imageUrl: '/imgs/ingredients2/605.webp'
	},
	{
		id: 606,
		name: '킹크랩버터구이',
		grade: 'A',
		isIngredient: true,
		buyPrice: 600,
		imageUrl: '/imgs/ingredients2/606.webp'
	},
	{
		id: 607,
		name: '카수레',
		grade: 'A',
		isIngredient: true,
		buyPrice: 520,
		imageUrl: '/imgs/ingredients2/607.webp'
	},
	{
		id: 608,
		name: '마그레',
		grade: 'A',
		isIngredient: true,
		buyPrice: 500,
		imageUrl: '/imgs/ingredients2/608.webp'
	},
	{
		id: 609,
		name: '씨푸드플래터',
		grade: 'A',
		isIngredient: true,
		buyPrice: 570,
		imageUrl: '/imgs/ingredients2/609.webp'
	},
	{
		id: 610,
		name: '궁중잡채',
		grade: 'A',
		isIngredient: true,
		buyPrice: 480,
		imageUrl: '/imgs/ingredients2/610.webp'
	},
	{
		id: 611,
		name: '후나모리',
		grade: 'A',
		isIngredient: true,
		buyPrice: 590,
		imageUrl: '/imgs/ingredients2/611.webp'
	},
	{
		id: 612,
		name: '파리브레스트',
		grade: 'A',
		isIngredient: true,
		buyPrice: 450,
		imageUrl: '/imgs/ingredients2/612.webp'
	},
	// A등급 요리
	{
		id: 613,
		name: '신선로',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3200,
		imageUrl: '/imgs/ingredients2/613.webp'
	},
	{
		id: 614,
		name: '구절판',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3300,
		imageUrl: '/imgs/ingredients2/614.webp'
	},
	{
		id: 615,
		name: '비프웰링턴',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3400,
		imageUrl: '/imgs/ingredients2/615.webp'
	},
	{
		id: 616,
		name: '트러플카르보나라',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3500,
		imageUrl: '/imgs/ingredients2/616.webp'
	},
	{
		id: 617,
		name: '코키유생자크',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3300,
		imageUrl: '/imgs/ingredients2/617.webp'
	},
	{
		id: 618,
		name: '부야베스',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3400,
		imageUrl: '/imgs/ingredients2/618.webp'
	},
	{
		id: 619,
		name: '부르기뇽',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3350,
		imageUrl: '/imgs/ingredients2/619.webp'
	},
	{
		id: 620,
		name: '북경오리',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3100,
		imageUrl: '/imgs/ingredients2/620.webp'
	},
	{
		id: 621,
		name: '동파육',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3200,
		imageUrl: '/imgs/ingredients2/621.webp'
	},
	{
		id: 622,
		name: '불도장',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3450,
		imageUrl: '/imgs/ingredients2/622.webp'
	},
	{
		id: 623,
		name: '참치오마카세',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3300,
		imageUrl: '/imgs/ingredients2/623.webp'
	},
	{
		id: 624,
		name: '전복리소토',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3250,
		imageUrl: '/imgs/ingredients2/624.webp'
	},
	{
		id: 625,
		name: '싱가포르칠리크랩',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3350,
		imageUrl: '/imgs/ingredients2/625.webp'
	},
	{
		id: 626,
		name: '랍스터테르미도르',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3500,
		imageUrl: '/imgs/ingredients2/626.webp'
	},
	{
		id: 627,
		name: '오페라케이크',
		grade: 'A',
		isIngredient: false,
		sellPrice: 2800,
		imageUrl: '/imgs/ingredients2/627.webp'
	},
	{
		id: 628,
		name: '초콜릿퐁듀',
		grade: 'A',
		isIngredient: false,
		sellPrice: 3000,
		imageUrl: '/imgs/ingredients2/628.webp'
	}
];
