/**
 * ingredients2 전체 이미지 생성 스크립트
 * 실행: pnpm test src/scripts/generateIngredients2.spec.ts
 */
import { describe, it, expect } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { INGREDIENTS_DATA } from '../routes/cook2/lib/data/ingredients-data';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || '';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const ASSETS_DIR = path.join(PROJECT_ROOT, 'assets');
const REFERENCE_DIR = path.join(ASSETS_DIR, 'reference');
const OUTPUT_DIR = path.join(ASSETS_DIR, 'ingredients2');

const NAME_TO_ENGLISH: Record<string, string> = {
	// ========== G등급 기본 재료 (추상적 → 구체적 형태) ==========
	쌀: 'scattered raw rice grains',
	밀: 'bundle of golden wheat stalks',
	고기: 'raw red meat chunk',
	해물: 'raw shrimp and octopus',
	채소: 'fresh green cabbage',
	과일: 'red apple',
	물: 'single blue water droplet',
	불: 'single orange flame',

	// ========== F등급 재료 ==========
	밥: 'bowl of steamed white rice',
	반죽: 'round ball of pale dough',
	빵: 'golden loaf of bread',
	다짐육: 'raw ground meat',
	양념육: 'raw marinated meat chunks',
	양념장: 'red sauce blob',
	육수: 'bowl of golden broth',
	구이: 'grilled meat piece',
	절임: 'jar of pickled vegetables',
	시럽: 'amber syrup drop',
	잼: 'jar of red jam',
	얼음: 'single ice cube',

	// ========== F등급 재료 (추가) ==========
	해물무침: 'seasoned seafood salad',
	구운해물: 'grilled shrimp',
	샐러드: 'fresh green salad bowl',
	볶음: 'stir-fried vegetables',
	과일청: 'jar of fruit syrup',
	주스: 'glass of orange juice',
	누룽지: 'crispy golden rice crust',
	쌈: 'green lettuce leaf wrap',
	젓갈: 'jar of fermented seafood',
	해물육수: 'bowl of seafood broth',

	// ========== E등급 재료 ==========
	떡: 'white cylinder rice cake',
	튀김옷: 'bowl of yellow batter',
	피자도우: 'round flat pizza dough',
	소시지: 'single brown sausage link',
	묵: 'cube of brown acorn jelly',
	면: 'bundle of yellow noodles',
	김치: 'red napa cabbage kimchi',
	만두: 'single pleated dumpling',

	// ========== 국물/찌개류 ==========
	국: 'bowl of clear soup',
	찌개: 'pot of red stew',
	조림: 'braised dish in brown sauce',

	// ========== 양식 메인 ==========
	스테이크: 'grilled steak on plate',
	파이: 'golden baked pie',
	케이크: 'layered birthday cake',
	아이스크림: 'ice cream cone',

	// ========== 한식 밥류 ==========
	초밥: 'salmon nigiri sushi',
	덮밥: 'rice bowl with toppings',
	볶음밥: 'fried rice on plate',
	전: 'golden korean pancake',
	국밥: 'rice in soup bowl',
	비빔밥: 'colorful bibimbap bowl',

	// ========== 빵/샌드위치류 ==========
	토스트: 'golden buttered toast',
	샌드위치: 'layered sandwich',
	햄버거: 'hamburger with bun',
	피자: 'pepperoni pizza slice',
	파스타: 'spaghetti with red sauce',

	// ========== 면류 ==========
	라면: 'bowl of ramen noodles',
	우동: 'bowl of udon noodles',
	쌀국수: 'bowl of pho noodles',
	냉면: 'cold noodles with ice',
	잡채: 'glass noodles japchae',

	// ========== 중식/튀김류 ==========
	탕수육: 'sweet and sour pork',
	깐풍기: 'crispy spicy chicken',
	카레: 'curry rice plate',
	돈가스: 'breaded pork cutlet',
	치킨: 'crispy fried chicken',

	// ========== 한식 고기류 ==========
	족발: 'sliced pig feet',
	보쌈: 'boiled pork belly slices',
	갈비찜: 'braised short ribs',
	불고기: 'marinated beef bulgogi',
	제육볶음: 'spicy stir-fried pork',
	닭갈비: 'spicy chicken stir-fry',
	떡볶이: 'spicy rice cakes',
	순대: 'korean blood sausage',

	// ========== 양식 메인 (추가) ==========
	오므라이스: 'omurice with ketchup',
	리조또: 'creamy risotto',
	그라탕: 'baked gratin dish',
	스튜: 'beef stew pot',
	수프: 'cream soup bowl',

	// ========== 한식 국류 ==========
	미역국: 'seaweed soup bowl',
	된장국: 'soybean paste soup',
	김치찌개: 'kimchi stew pot',
	순두부찌개: 'soft tofu stew',
	부대찌개: 'army stew pot',

	// ========== 디저트 ==========
	팥빙수: 'red bean shaved ice',
	과일빙수: 'fruit shaved ice',
	타르트: 'fruit tart',
	쿠키: 'chocolate chip cookie',
	푸딩: 'caramel pudding',
	마카롱: 'colorful macarons',
	크레페: 'folded crepe',
	와플: 'golden waffle',
	도넛: 'glazed donut',
	츄러스: 'sugar churros',
	호떡: 'korean sweet pancake',
	붕어빵: 'fish-shaped bread',

	// ========== 회/고기 ==========
	회덮밥: 'sashimi rice bowl',
	물회: 'cold raw fish soup',
	갈비: 'raw beef short ribs',
	삼겹살: 'raw pork belly slices',
	회: 'sliced raw fish sashimi',
	탕: 'hot soup pot',
	전골: 'hot pot with ingredients',

	// ========== 고급 디저트 ==========
	구절판재료: 'gujeolpan colorful platter',
	롤케이크: 'swiss roll cake',
	티라미수: 'tiramisu cake slice',
	무스: 'chocolate mousse',

	// ========== 중식 면류 ==========
	짜장면: 'black bean noodles',
	짬뽕: 'spicy seafood noodles',

	// ========== 코스/정식 ==========
	오마카세: 'omakase sushi set',
	정식: 'korean set meal tray',

	// ========== B등급 고기류 ==========
	LA갈비: 'LA style short ribs',
	양념갈비: 'marinated beef ribs',
	소갈비찜: 'braised beef short ribs',
	돼지갈비: 'grilled pork ribs',
	삼겹살구이: 'grilled pork belly',
	대패삼겹: 'thin sliced pork belly',
	항정살: 'grilled pork jowl',

	// ========== 회류 ==========
	연어회: 'salmon sashimi slices',
	광어회: 'flatfish sashimi',
	모둠회: 'assorted sashimi platter',
	육회: 'beef tartare with egg',

	// ========== 탕류 ==========
	갈비탕: 'short rib soup',
	설렁탕: 'ox bone soup',
	곰탕: 'beef bone soup',
	삼계탕: 'ginseng chicken soup',
	추어탕: 'loach soup',
	해물탕: 'spicy seafood soup',
	매운탕: 'spicy fish stew',

	// ========== 전골류 ==========
	샤브샤브: 'shabu shabu hot pot',
	스키야키: 'sukiyaki pot',
	훠궈: 'chinese hot pot',

	// ========== 파스타류 ==========
	카르보나라: 'carbonara pasta',
	봉골레: 'clam pasta vongole',
	알리오올리오: 'garlic oil pasta',
	라자냐: 'layered lasagna',
	뇨끼: 'potato gnocchi',

	// ========== 만두류 ==========
	딤섬: 'dim sum basket',
	군만두: 'pan-fried dumplings',
	물만두: 'boiled dumplings',
	찐만두: 'steamed dumplings',
	교자: 'japanese gyoza',
	슈마이: 'pork shumai',
	하카우: 'shrimp har gow',

	// ========== A등급 프리미엄 재료 ==========
	모둠고기: 'assorted meat platter',
	참치회: 'tuna sashimi slices',
	랍스터: 'whole red lobster',
	전복: 'single abalone',
	킹크랩: 'whole king crab',
	특선회: 'premium sashimi platter',

	// ========== 코스요리 ==========
	한정식: 'korean full course meal',
	코스요리: 'french course meal',

	// ========== 고급 디저트 ==========
	밀푀유: 'layered mille-feuille',
	슈크림: 'cream puff pastry',

	// ========== 고급 요리 ==========
	북경오리: 'whole peking duck',
	양갈비: 'grilled lamb chops',
	한우구이: 'grilled korean beef',
	한우육회: 'korean beef tartare',
	참치뱃살: 'fatty tuna belly',
	대뱃살: 'otoro fatty tuna',
	랍스터구이: 'grilled lobster',
	랍스터찜: 'steamed whole lobster',
	전복구이: 'grilled abalone',
	전복죽: 'abalone rice porridge',
	킹크랩찜: 'steamed king crab',
	킹크랩구이: 'grilled king crab',
	양갈비구이: 'grilled lamb rack',
	양갈비스테이크: 'lamb steak',
	북경오리구이: 'roasted peking duck',
	오리훈제: 'smoked duck breast',

	// ========== 프리미엄 디저트 ==========
	에클레어: 'chocolate eclair',
	몽블랑: 'mont blanc chestnut cake',
	오페라: 'opera layer cake',
	슈톨렌: 'german stollen bread',
	파네토네: 'italian panettone',

	// ========== R등급 최고급 재료 ==========
	와규: 'marbled wagyu beef steak',
	오토로: 'otoro tuna sashimi',
	블루랍스터: 'rare blue lobster',
	트러플: 'black truffle mushroom',
	푸아그라: 'foie gras slice',
	이베리코: 'iberico ham slices',

	// ========== 최고급 코스 ==========
	오마카세코스: 'luxury omakase course',
	프렌치코스: 'french fine dining course',
	가이세키: 'japanese kaiseki course',
	웨딩케이크: 'tiered wedding cake',
	크로캉부슈: 'croquembouche tower',

	// ========== 최고급 요리 ==========
	와규스테이크: 'wagyu beef steak',
	와규초밥: 'wagyu beef sushi',
	오토로초밥: 'otoro tuna sushi',
	오토로타타키: 'seared otoro tataki',
	트러플파스타: 'truffle pasta',
	트러플리조또: 'truffle risotto',
	푸아그라스테이크: 'foie gras steak',
	푸아그라무스: 'foie gras mousse',
	이베리코구이: 'grilled iberico pork',
	이베리코샤브: 'iberico shabu shabu',
	블루랍스터구이: 'grilled blue lobster',
	블루랍스터테르미도르: 'blue lobster thermidor',

	// ========== 전설 등급 재료 ==========
	와규세트: 'wagyu beef set',
	벨루가캐비어: 'beluga caviar tin',
	알바트러플: 'white alba truffle',
	마츠타케: 'matsutake mushroom',
	블루핀참치: 'bluefin tuna block',
	황제전복: 'giant emperor abalone',
	타라바가니: 'taraba king crab',

	// ========== 전설 코스 ==========
	미슐랭코스: 'michelin star course',
	궁중요리: 'korean royal cuisine',
	피에스몽테: 'piece montee tower',
	황실디저트: 'imperial dessert platter',
	분자요리: 'molecular gastronomy dish',
	퓨전오마카세: 'fusion omakase set',
	그랑크뤼: 'grand cru wine pairing',
	와규풀코스: 'full wagyu course',
	캐비어테이스팅: 'caviar tasting set',
	트러플디너: 'truffle dinner course',
	참치오마카세: 'bluefin tuna omakase',
	전복정식: 'abalone full course',
	대게코스: 'snow crab full course',
	궁중정식: 'royal korean banquet',
	수라상: 'royal surasang table',
	어선회: 'boat sashimi platter',
	분자칵테일: 'molecular cocktail glass',
	디저트오마카세: 'dessert omakase course',
	프티푸르: 'petit four assortment',
	셰프테이블: 'chef table experience',
	시그니처코스: 'signature tasting course',
	테이스팅메뉴: 'tasting menu course',
	페어링디너: 'wine pairing dinner',
	프레스티지: 'prestige dining set',
	그랑메종: 'grand maison course',

	// ========== 전설 요리 ==========
	신선로: 'royal sinseollo hot pot',
	구절판: 'nine-section gujeolpan',
	비프웰링턴: 'beef wellington',
	트러플카르보나라: 'truffle carbonara',
	코키유생자크: 'coquilles saint-jacques',
	부야베스: 'french bouillabaisse',
	부르기뇽: 'beef bourguignon',
	북경오리구이정식: 'peking duck full set',
	동파육: 'dongpo braised pork',
	불도장: 'buddha jumps wall soup',
	오토로초밥오마카세: 'otoro sushi omakase',
	전복리소토: 'abalone risotto',
	싱가포르칠리크랩: 'singapore chili crab',
	타라바캐비어카나페: 'king crab caviar canapé',
	오페라케이크: 'opera layer cake',
	초콜릿퐁듀: 'chocolate fondue set'
};

function getEnglishName(name: string): string {
	return NAME_TO_ENGLISH[name] || name;
}

function buildIdToEnglishMap(): Record<number, string> {
	const map: Record<number, string> = {};
	for (const ing of INGREDIENTS_DATA) {
		map[ing.id] = NAME_TO_ENGLISH[ing.name] || ing.name;
	}
	return map;
}

const ID_TO_ENGLISH = buildIdToEnglishMap();

function getEnglishNameById(id: number): string {
	return ID_TO_ENGLISH[id] || String(id);
}

function loadReferenceImages(): { mimeType: string; data: string }[] {
	const files = fs.readdirSync(REFERENCE_DIR).filter((f) => f.endsWith('.png'));
	console.log(`레퍼런스 이미지: ${files.join(', ')}`);
	return files.map((file) => ({
		mimeType: 'image/png',
		data: fs.readFileSync(path.join(REFERENCE_DIR, file)).toString('base64')
	}));
}

function imageExists(id: number): boolean {
	return fs.existsSync(path.join(OUTPUT_DIR, `${id}.png`));
}

describe('ingredients2 이미지 생성', () => {
	it('전체 생성', async () => {
		if (!GEMINI_API_KEY) {
			console.log('⚠️ GOOGLE_API_KEY 없음');
			return;
		}

		if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
		const referenceImages = loadReferenceImages();
		const missing = INGREDIENTS_DATA.filter((ing) => !imageExists(ing.id));

		console.log(`\n전체: ${INGREDIENTS_DATA.length}개, 누락: ${missing.length}개\n`);
		if (missing.length === 0) return;

		let success = 0,
			fail = 0;

		for (let i = 0; i < missing.length; i++) {
			const ing = missing[i];
			const englishName = getEnglishNameById(ing.id);
			console.log(`[${i + 1}/${missing.length}] ${ing.id}: ${ing.name} -> ${englishName}`);

			const prompt = `
Reference: Pokemon Sleep cooking game icons.

STYLE: Brown outline, simple flat cartoon, cute rounded shapes, vibrant colors, white background, NO shadow, 10% padding.

GENERATE: ${englishName} icon. Match reference style exactly.
`;

			try {
				const response = await ai.models.generateContent({
					model: 'gemini-3-pro-image-preview',
					contents: [{ text: prompt }, ...referenceImages.map((img) => ({ inlineData: img }))],
					config: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '1:1' } }
				});

				const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
				if (part?.inlineData?.data) {
					fs.writeFileSync(
						path.join(OUTPUT_DIR, `${ing.id}.png`),
						Buffer.from(part.inlineData.data, 'base64')
					);
					console.log(`  ✅ 저장됨`);
					success++;
				} else {
					console.log(`  ❌ 이미지 없음`);
					fail++;
				}
			} catch (e) {
				console.error(`  ❌ 에러:`, e);
				fail++;
			}

			await new Promise((r) => setTimeout(r, 3000));
		}

		console.log(`\n완료: 성공 ${success}, 실패 ${fail}`);
		expect(success).toBeGreaterThan(0);
	}, 3600000);

	it('현황 확인', async () => {
		if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
		const existing = INGREDIENTS_DATA.filter((ing) => imageExists(ing.id));
		const missing = INGREDIENTS_DATA.filter((ing) => !imageExists(ing.id));
		console.log(
			`\n전체: ${INGREDIENTS_DATA.length}, 생성됨: ${existing.length}, 누락: ${missing.length}`
		);
		if (missing.length <= 50)
			console.log('\n누락:', missing.map((i) => `${i.id}:${i.name}`).join(', '));
	});

	it('전체 매핑 출력 (id:name)', () => {
		// 이미지 생성 여부와 무관하게 모든 항목 출력
		INGREDIENTS_DATA.forEach((ing) => {
			console.log(`${ing.id}:${ing.name}`);
		});
	});
});
