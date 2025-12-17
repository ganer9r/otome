/**
 * 손님 캐릭터 이미지 생성 스크립트
 * 실행: pnpm test src/scripts/generateCustomers.spec.ts
 */
import { describe, it, expect } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { convertToWebp } from './imageUtils';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || '';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const REFERENCE_DIR = path.join(PROJECT_ROOT, 'assets/reference/character');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'assets/customers');
const WEBP_OUTPUT_DIR = path.join(PROJECT_ROOT, 'static/imgs/character/customer');

// 레퍼런스 이미지 (귀여운 동물 캐릭터 스타일)
const REFERENCES = ['10.png'];

// 공통 스타일 프롬프트
const STYLE_PROMPT = `
Reference: attached cute rabbit character style image.

STYLE REQUIREMENTS:
- Cute kawaii chibi/SD (super deformed) animal character
- Large round head with small body proportions (bust shot/upper body)
- Very big expressive oval eyes with white highlights
- Pink round blush on cheeks
- Simple clean lineart with smooth black outlines
- Soft pastel color palette (white, pink, beige, cream)
- White or light neutral background
- Business casual accessories (necktie, bow, collar)
- Minimal shading, flat color style
- Korean/Japanese mascot character aesthetic
- Round soft features, no sharp edges
- Simple paw-like hands visible at bottom
`.trim();

// 손님 캐릭터 정의 (귀여운 동물)
const CUSTOMERS = [
	{
		id: 1,
		name: '토끼',
		desc: 'cute white rabbit character with large upright ears, pink inner ears, pink ribbon bow on left ear, wearing dark gray necktie, white fur, bust shot'
	},
	{
		id: 2,
		name: '여우',
		desc: 'cute fox character with pointy ears, orange-cream fur, white chest area, wearing small bow tie, slightly sly but friendly expression, bust shot'
	},
	{
		id: 3,
		name: '곰',
		desc: 'cute brown bear character with round ears, light brown fur, wearing small collar with tie, chubby cheeks, bust shot'
	},
	{
		id: 4,
		name: '고양이',
		desc: 'cute cat character with pointed ears, gray-white fur, wearing small ribbon bow on head and necktie, bust shot'
	},
	{
		id: 5,
		name: '강아지',
		desc: 'cute dog character with floppy ears, golden-beige fur, wearing small bandana or collar, friendly face, bust shot'
	}
];

// 표정 정의
const EXPRESSIONS: Record<string, string> = {
	order: 'neutral friendly expression, slight smile, looking forward expectantly',
	success: 'very happy, big open smile, eyes closed with joy, sparkling with happiness',
	fail: 'disappointed, sad frown, teary eyes with small tears, upset expression'
};

// 파일명 생성
function getFileName(customerId: number, expression: string): string {
	return `customer_${customerId}_${expression}`;
}

// PNG 파일 존재 확인
function pngExists(customerId: number, expression: string): boolean {
	return fs.existsSync(path.join(OUTPUT_DIR, `${getFileName(customerId, expression)}.png`));
}

// WebP 파일 존재 확인
function webpExists(customerId: number, expression: string): boolean {
	return fs.existsSync(path.join(WEBP_OUTPUT_DIR, `${getFileName(customerId, expression)}.webp`));
}

// 레퍼런스 이미지 로드
function loadReferences(): { mimeType: string; data: string }[] {
	const images: { mimeType: string; data: string }[] = [];

	for (const file of REFERENCES) {
		const filePath = path.join(REFERENCE_DIR, file);
		if (fs.existsSync(filePath)) {
			const ext = path.extname(file).toLowerCase();
			let mimeType = 'image/jpeg';
			if (ext === '.png') mimeType = 'image/png';
			if (ext === '.webp') mimeType = 'image/webp';

			images.push({
				mimeType,
				data: fs.readFileSync(filePath).toString('base64')
			});
			console.log(`  레퍼런스 로드: ${file}`);
		} else {
			console.log(`  ⚠️ 레퍼런스 없음: ${file}`);
		}
	}

	return images;
}

// 프롬프트 생성
function buildPrompt(customer: (typeof CUSTOMERS)[0], expression: string): string {
	return `
${STYLE_PROMPT}

CHARACTER: ${customer.desc}
EXPRESSION: ${EXPRESSIONS[expression]}

Generate a SINGLE cute ${customer.name} character matching the reference cat art style EXACTLY.
Same drawing style, same body proportions, same line thickness, same color tone.
Only change the animal type and expression.
`.trim();
}

describe('손님 캐릭터 생성', () => {
	it('전체 생성 (15장)', async () => {
		if (!GEMINI_API_KEY) {
			console.log('⚠️ GOOGLE_API_KEY 없음 - 스킵');
			return;
		}

		// 디렉토리 생성
		if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
		if (!fs.existsSync(WEBP_OUTPUT_DIR)) fs.mkdirSync(WEBP_OUTPUT_DIR, { recursive: true });

		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
		const referenceImages = loadReferences();

		if (referenceImages.length === 0) {
			console.log('❌ 레퍼런스 이미지 없음');
			return;
		}

		// 생성할 목록 계산
		const toGenerate: { customer: (typeof CUSTOMERS)[0]; expression: string }[] = [];
		for (const customer of CUSTOMERS) {
			for (const expression of Object.keys(EXPRESSIONS)) {
				if (!pngExists(customer.id, expression)) {
					toGenerate.push({ customer, expression });
				}
			}
		}

		console.log(`\n전체: ${CUSTOMERS.length * 3}장, 누락: ${toGenerate.length}장\n`);

		if (toGenerate.length === 0) {
			console.log('✅ 모든 이미지 생성 완료됨');
			return;
		}

		let success = 0;
		let fail = 0;

		for (let i = 0; i < toGenerate.length; i++) {
			const { customer, expression } = toGenerate[i];
			const fileName = getFileName(customer.id, expression);

			console.log(`[${i + 1}/${toGenerate.length}] ${fileName}: ${customer.name} - ${expression}`);

			const prompt = buildPrompt(customer, expression);

			try {
				const response = await ai.models.generateContent({
					model: 'gemini-3-pro-image-preview',
					contents: [{ text: prompt }, ...referenceImages.map((img) => ({ inlineData: img }))],
					config: {
						responseModalities: ['TEXT', 'IMAGE'],
						imageConfig: { aspectRatio: '1:1' }
					}
				});

				const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);

				if (part?.inlineData?.data) {
					const pngPath = path.join(OUTPUT_DIR, `${fileName}.png`);
					fs.writeFileSync(pngPath, Buffer.from(part.inlineData.data, 'base64'));
					console.log(`  ✅ PNG 저장: ${fileName}.png`);
					success++;
				} else {
					console.log(`  ❌ 이미지 생성 실패`);
					fail++;
				}
			} catch (e) {
				console.error(`  ❌ 에러:`, e);
				fail++;
			}

			// API 제한 방지 딜레이
			if (i < toGenerate.length - 1) {
				await new Promise((r) => setTimeout(r, 2000));
			}
		}

		console.log(`\n완료: 성공 ${success}, 실패 ${fail}`);
		expect(success).toBeGreaterThan(0);
	}, 3600000);

	it('WebP 변환', async () => {
		if (!fs.existsSync(OUTPUT_DIR)) {
			console.log('⚠️ PNG 원본 폴더 없음');
			return;
		}
		if (!fs.existsSync(WEBP_OUTPUT_DIR)) fs.mkdirSync(WEBP_OUTPUT_DIR, { recursive: true });

		let converted = 0;
		let skipped = 0;

		for (const customer of CUSTOMERS) {
			for (const expression of Object.keys(EXPRESSIONS)) {
				const fileName = getFileName(customer.id, expression);
				const pngPath = path.join(OUTPUT_DIR, `${fileName}.png`);
				const webpPath = path.join(WEBP_OUTPUT_DIR, `${fileName}.webp`);

				if (!fs.existsSync(pngPath)) {
					continue;
				}

				if (fs.existsSync(webpPath)) {
					skipped++;
					continue;
				}

				try {
					const result = await convertToWebp(pngPath, webpPath, {
						size: 512,
						tolerance: 80,
						expandPixels: 2,
						quality: 85
					});
					console.log(
						`✅ ${fileName}: ${Math.round(result.srcSize / 1024)}KB → ${Math.round(result.outSize / 1024)}KB`
					);
					converted++;
				} catch (e) {
					console.error(`❌ ${fileName} 변환 실패:`, e);
				}
			}
		}

		console.log(`\n변환 완료: ${converted}개, 스킵: ${skipped}개`);
	});

	it('현황 확인', () => {
		console.log('\n=== 손님 캐릭터 이미지 현황 ===\n');

		let totalPng = 0;
		let totalWebp = 0;

		for (const customer of CUSTOMERS) {
			console.log(`[${customer.id}] ${customer.name}`);

			for (const expression of Object.keys(EXPRESSIONS)) {
				const hasPng = pngExists(customer.id, expression);
				const hasWebp = webpExists(customer.id, expression);

				const pngStatus = hasPng ? '✅' : '❌';
				const webpStatus = hasWebp ? '✅' : '❌';

				console.log(`  ${expression}: PNG ${pngStatus} | WebP ${webpStatus}`);

				if (hasPng) totalPng++;
				if (hasWebp) totalWebp++;
			}
		}

		console.log(`\n총계: PNG ${totalPng}/15, WebP ${totalWebp}/15`);
	});

	it('단일 테스트 (1번 손님 order)', async () => {
		if (!GEMINI_API_KEY) {
			console.log('⚠️ GOOGLE_API_KEY 없음 - 스킵');
			return;
		}

		if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
		const referenceImages = loadReferences();

		const customer = CUSTOMERS[0];
		const expression = 'order';
		const fileName = getFileName(customer.id, expression);

		console.log(`테스트 생성: ${fileName} (${customer.name} - ${expression})`);

		const prompt = buildPrompt(customer, expression);
		console.log('\n--- 프롬프트 ---');
		console.log(prompt);
		console.log('----------------\n');

		try {
			const response = await ai.models.generateContent({
				model: 'gemini-3-pro-image-preview',
				contents: [{ text: prompt }, ...referenceImages.map((img) => ({ inlineData: img }))],
				config: {
					responseModalities: ['TEXT', 'IMAGE'],
					imageConfig: { aspectRatio: '1:1' }
				}
			});

			const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);

			if (part?.inlineData?.data) {
				const pngPath = path.join(OUTPUT_DIR, `${fileName}_test.png`);
				fs.writeFileSync(pngPath, Buffer.from(part.inlineData.data, 'base64'));
				console.log(`✅ 테스트 이미지 저장: ${pngPath}`);
			} else {
				console.log('❌ 이미지 생성 실패');
				console.log('응답:', JSON.stringify(response.candidates?.[0]?.content, null, 2));
			}
		} catch (e) {
			console.error('❌ 에러:', e);
		}
	}, 120000);
});
