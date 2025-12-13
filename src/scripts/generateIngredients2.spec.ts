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
	// ========== G등급 재료 (8개) ==========
	쌀: 'scattered raw rice grains', // 1
	밀: 'bundle of golden wheat stalks', // 2
	고기: 'raw red meat chunk', // 3
	해물: 'raw shrimp and octopus', // 4
	채소: 'fresh green cabbage', // 5
	과일: 'red apple', // 6
	물: 'single blue water droplet', // 7
	불: 'single orange flame', // 8

	// ========== G등급 요리 (15개) ==========
	해물무침: 'seasoned raw seafood salad', // 9
	구운해물: 'grilled shrimp and squid', // 10
	샐러드: 'fresh green salad bowl', // 11
	칼솟: 'stir-fried vegetables', // 12
	과일청: 'jar of fruit syrup', // 13
	주스: 'glass of orange juice', // 14
	누룽지: 'crispy golden rice crust', // 15
	나물밥: 'rice with seasoned vegetables', // 16
	어묵: 'fish cake slices', // 17
	조개탕: 'clam soup bowl', // 18
	크래커: 'stack of crackers', // 19
	또띠아: 'round flour tortilla', // 20
	소시지: 'grilled sausage links', // 21
	묵: 'cube of acorn jelly', // 22
	온수: 'cup of hot water with steam', // 23

	// ========== F등급 재료 (12개) ==========
	밥: 'bowl of steamed white rice', // 101
	반죽: 'round ball of pale dough', // 102
	빵: 'golden loaf of bread', // 103
	다짐육: 'raw ground meat', // 104
	양념육: 'raw marinated meat chunks', // 105
	양념장: 'red sauce blob', // 106
	육수: 'bowl of golden broth', // 107
	횟감: 'fresh raw fish fillet', // 108
	절임: 'jar of pickled vegetables', // 109
	잼: 'jar of red jam', // 111
	얼음: 'single ice cube', // 112
	떡: 'white rice cake block', // 123

	// ========== F등급 요리 (49개) ==========
	주먹밥: 'triangle rice ball onigiri', // 124
	국밥: 'rice in soup bowl', // 125
	비빔밥: 'colorful bibimbap bowl', // 126
	오므라이스: 'omurice with ketchup', // 127
	유부초밥: 'inari sushi pieces', // 128
	떡국: 'sliced rice cake soup', // 129
	칼국수: 'knife-cut noodle soup', // 130
	라면: 'bowl of ramen noodles', // 131
	파이: 'golden baked pie', // 132
	냉면: 'cold noodles with ice', // 133
	호떡: 'korean sweet pancake', // 134
	햄버거: 'hamburger with bun', // 135
	토스트: 'golden buttered toast', // 136
	샌드위치: 'layered sandwich', // 137
	쿠키: 'chocolate chip cookie', // 138
	빵푸딩: 'bread pudding dessert', // 139
	카나페: 'canape appetizers', // 140
	완자탕: 'meatball soup', // 141
	불고기: 'marinated beef bulgogi', // 142
	장조림: 'soy braised beef', // 143
	미트볼: 'meatballs in sauce', // 144
	떡갈비: 'grilled short rib patties', // 145
	냉채: 'cold meat salad', // 146
	육회: 'beef tartare with egg yolk', // 147
	제육볶음: 'spicy stir-fried pork', // 148
	보쌈: 'boiled pork belly slices', // 149
	닭강정: 'crispy sweet chicken', // 150
	떡꼬치: 'rice cake skewers', // 151
	냉삼: 'cold pork belly slices', // 152
	쌈장: 'ssamjang dipping sauce', // 153
	회무침: 'spicy raw fish salad', // 154
	떡볶이: 'spicy rice cakes', // 155
	데리야끼: 'teriyaki glazed meat', // 156
	냉소스: 'cold dipping sauce', // 157
	된장국: 'soybean paste soup', // 158
	단팥죽: 'sweet red bean porridge', // 159
	냉국: 'cold cucumber soup', // 160
	젓갈: 'jar of fermented seafood', // 161
	회냉채: 'cold raw fish salad', // 162
	어묵탕: 'fish cake soup', // 163
	피클: 'pickled cucumbers', // 164
	과일절임: 'preserved fruit in syrup', // 165
	동치미: 'radish water kimchi', // 166
	푸딩: 'caramel pudding', // 167
	약과: 'korean honey cookie', // 168
	약밥: 'sweet rice with nuts', // 169
	빙수: 'shaved ice dessert', // 170
	떡빙수: 'rice cake shaved ice', // 171
	도넛: 'glazed donut', // 172

	// ========== E등급 재료 (14개) ==========
	면: 'bundle of yellow noodles', // 201
	튀김: 'crispy fried tempura', // 202
	구이: 'grilled meat piece', // 203
	수프: 'cream soup bowl', // 204
	회: 'sliced raw fish sashimi', // 205
	가래떡: 'long cylinder rice cake', // 206
	찜: 'steamed dish in pot', // 207
	김치: 'red napa cabbage kimchi', // 208
	만두: 'single pleated dumpling', // 209
	찌개: 'pot of red stew', // 210
	초밥: 'salmon nigiri sushi', // 211
	케이크: 'layered birthday cake', // 212
	과일아이스크림: 'fruit ice cream cone', // 213
	게살: 'crab meat pieces', // 214

	// ========== E등급 요리 (34개) ==========
	우동: 'bowl of udon noodles', // 215
	볶음면: 'stir-fried noodles', // 216
	잔치국수: 'banquet noodle soup', // 217
	비빔국수: 'spicy mixed noodles', // 218
	새우튀김: 'fried shrimp tempura', // 219
	텐동: 'tempura rice bowl', // 220
	꼬치구이: 'grilled meat skewers', // 221
	철판구이: 'teppanyaki grill', // 222
	핫케이크: 'stack of pancakes', // 223
	해물수프: 'seafood cream soup', // 224
	물회: 'cold raw fish soup', // 225
	회덮밥: 'sashimi rice bowl', // 226
	떡찜: 'steamed rice cake dish', // 227
	두부김치: 'tofu with stir-fried kimchi', // 228
	떡만두국: 'rice cake dumpling soup', // 229
	궁중떡볶이: 'royal court rice cakes', // 230
	만두찜: 'steamed dumplings', // 231
	코다리찜: 'steamed dried pollock', // 232
	김치만두: 'kimchi dumplings', // 233
	김치전: 'kimchi pancake', // 234
	김치수제비: 'kimchi sujebi soup', // 235
	과일스무디: 'fruit smoothie glass', // 236
	김치찌개: 'kimchi stew pot', // 237
	동태찌개: 'frozen pollack stew', // 238
	게살볶음밥: 'crab fried rice', // 239
	튀김아이스크림: 'fried ice cream', // 240
	튀김우동: 'tempura udon bowl', // 241
	생크림케이크: 'fresh cream cake', // 242
	젤라또: 'italian gelato cups', // 243
	김치볶음밥: 'kimchi fried rice', // 244
	크레페: 'folded crepe with cream', // 245
	아이스크림떡: 'mochi ice cream', // 246
	가래떡구이: 'grilled rice cake sticks', // 247
	완탕면: 'wonton noodle soup', // 248

	// ========== D등급 재료 (13개) ==========
	스테이크: 'grilled beef steak', // 301
	삼겹살구이: 'grilled pork belly', // 302
	사시미: 'sashimi platter', // 303
	돈카츠: 'breaded pork cutlet', // 304
	모듬초밥: 'assorted sushi plate', // 305
	해물찜: 'steamed seafood platter', // 306
	꽃게탕: 'blue crab stew', // 307
	파스타: 'spaghetti with sauce', // 308
	전골: 'hot pot with ingredients', // 309
	모듬전: 'assorted korean pancakes', // 310
	과일케이크: 'fresh fruit cake', // 311
	크림: 'whipped cream dollop', // 312
	라멘: 'japanese ramen bowl', // 313

	// ========== D등급 요리 (27개) ==========
	챠슈동: 'chashu pork rice bowl', // 314
	돈카츠카레: 'pork cutlet curry', // 315
	규동: 'beef bowl gyudon', // 316
	차슈멘: 'chashu ramen bowl', // 317
	치킨카츠: 'chicken cutlet', // 318
	해물덮밥: 'seafood rice bowl', // 319
	조개찜: 'steamed clams', // 320
	매운탕: 'spicy fish stew', // 321
	낙지전골: 'octopus hot pot', // 322
	크림새우: 'cream sauce shrimp', // 323
	꽃게찜: 'steamed blue crab', // 324
	짬뽕: 'spicy seafood noodles', // 325
	돈가스정식: 'tonkatsu set meal', // 326
	우동전골: 'udon hot pot', // 327
	라멘교자: 'ramen with gyoza', // 328
	삼겹파스타: 'pork belly pasta', // 329
	카르보나라: 'carbonara pasta', // 330
	봉골레: 'clam pasta vongole', // 331
	부대찌개: 'army stew budaejjigae', // 332
	해물전: 'seafood pancake', // 333
	파전: 'green onion pancake', // 334
	김치찜: 'braised kimchi with pork', // 335
	울면: 'thick seafood noodles', // 336
	유린기: 'chinese crispy chicken', // 337
	츄러스: 'sugar churros', // 338
	티라미수: 'tiramisu cake slice', // 339
	해물파전: 'seafood green onion pancake', // 340

	// ========== C등급 재료 (12개) ==========
	갈비찜: 'braised short ribs', // 401
	모듬회: 'assorted sashimi platter', // 402
	해물탕: 'spicy seafood soup', // 403
	전복찜: 'steamed abalone', // 404
	게살수프: 'crab meat soup', // 405
	크림파스타: 'creamy pasta', // 406
	전주비빔밥: 'jeonju bibimbap', // 407
	초밥세트: 'sushi set platter', // 408
	오리로스: 'roasted duck breast', // 409
	탕수육: 'sweet and sour pork', // 410
	과일타르트: 'fresh fruit tart', // 411
	크림브륄레: 'creme brulee', // 412

	// ========== C등급 요리 (20개) ==========
	갈비크림파스타: 'short rib cream pasta', // 413
	카나르오랑주: 'duck a l orange', // 414
	오리훈제: 'smoked duck breast', // 415
	비프스튜: 'beef stew pot', // 416
	전복버터구이: 'butter grilled abalone', // 417
	전복초밥: 'abalone nigiri sushi', // 418
	전복크림파스타: 'abalone cream pasta', // 419
	게살크림리조또: 'crab cream risotto', // 420
	사시미모듬: 'premium sashimi platter', // 421
	해물초밥: 'seafood sushi set', // 422
	회샤브샤브: 'sashimi shabu shabu', // 423
	해물그라탕: 'seafood gratin', // 424
	전복죽: 'abalone rice porridge', // 425
	갈비탕: 'short rib soup', // 426
	한정식: 'korean full course meal', // 427
	깐쇼새우: 'crispy chili shrimp', // 428
	팔보채: 'eight treasure vegetables', // 429
	타르트타탱: 'tarte tatin', // 430
	무스케이크: 'chocolate mousse cake', // 431
	밀크레페: 'mille crepe cake', // 432

	// ========== B등급 재료 (11개) ==========
	채끝스테이크: 'sirloin steak', // 501
	참치회: 'tuna sashimi slices', // 502
	크랩앤랍스터: 'crab and lobster platter', // 503
	트러플리조또: 'truffle risotto', // 504
	오리콩피: 'duck confit leg', // 505
	슈바인학센: 'schweinshaxe pork knuckle', // 506
	스시모듬: 'premium sushi platter', // 507
	프렌치정식: 'french set meal', // 508
	궁중떡갈비: 'royal short rib patties', // 509
	전복스테이크: 'abalone steak', // 510
	가토쇼콜라: 'gateau au chocolat', // 511

	// ========== B등급 요리 (18개) ==========
	스테이크타르타르: 'steak tartare', // 512
	로스트비프: 'roast beef slices', // 513
	트러플스테이크: 'truffle steak', // 514
	참치카르파초: 'tuna carpaccio', // 515
	니기리모듬: 'assorted nigiri sushi', // 516
	랍스터비스크: 'lobster bisque soup', // 517
	오리가슴살구이: 'grilled duck breast', // 518
	오리불고기: 'duck bulgogi', // 519
	아이스바인: 'german eisbein', // 520
	슈바인브라텐: 'schweinebraten roast', // 521
	에도마에스시: 'edomae style sushi', // 522
	전복회무침: 'spicy abalone salad', // 523
	어복쟁반: 'royal seafood platter', // 524
	불고기정식: 'bulgogi set meal', // 525
	밀푀유쇼콜라: 'chocolate mille-feuille', // 526
	초콜릿무스: 'chocolate mousse', // 527
	퐁뒤: 'cheese fondue pot', // 528
	아쿠아파차: 'acqua pazza fish stew', // 529

	// ========== A등급 재료 (12개) ==========
	T본스테이크: 't-bone steak', // 601
	참치스테이크: 'seared tuna steak', // 602
	트러플크림수프: 'truffle cream soup', // 603
	전복해물찜: 'abalone seafood steam', // 604
	랍스터그라탕: 'lobster gratin', // 605
	킹크랩버터구이: 'butter grilled king crab', // 606
	카수레: 'french cassoulet', // 607
	마그레: 'magret de canard', // 608
	씨푸드플래터: 'luxury seafood platter', // 609
	궁중잡채: 'royal japchae', // 610
	카이세키: 'kaiseki course meal', // 611
	파리브레스트: 'paris-brest pastry', // 612

	// ========== A등급 요리 (16개) ==========
	신선로: 'royal sinseollo hot pot', // 613
	구절판: 'nine-section platter', // 614
	비프웰링턴: 'beef wellington', // 615
	트러플카르보나라: 'truffle carbonara', // 616
	코키유생자크: 'coquilles saint-jacques', // 617
	부야베스: 'french bouillabaisse', // 618
	부르기뇽: 'beef bourguignon', // 619
	북경오리: 'whole peking duck', // 620
	동파육: 'dongpo braised pork', // 621
	불도장: 'buddha jumps wall soup', // 622
	참치오마카세: 'tuna omakase course', // 623
	전복리소토: 'abalone risotto', // 624
	싱가포르칠리크랩: 'singapore chili crab', // 625
	랍스터테르미도르: 'lobster thermidor', // 626
	오페라케이크: 'opera layer cake', // 627
	초콜릿퐁듀: 'chocolate fondue set' // 628
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

			// 딜레이 없이 연속 생성
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
