/**
 * 손님 캐릭터 이미지 생성 스크립트
 *
 * 실행: pnpm test src/scripts/generateCustomers.spec.ts
 */
import { describe, it } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || '';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const REFERENCE_DIR = path.join(PROJECT_ROOT, 'assets/reference/character');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'assets/customers');

// 스타일 레퍼런스 (1,2,3,4.jpg - 사람 이모션 시트)
const STYLE_REFERENCES = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];

// 이미지 로드 헬퍼
function loadImage(filePath: string): { mimeType: string; data: string } | null {
	if (!fs.existsSync(filePath)) return null;

	const ext = path.extname(filePath).toLowerCase();
	let mimeType = 'image/png';
	if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
	if (ext === '.webp') mimeType = 'image/webp';

	return {
		mimeType,
		data: fs.readFileSync(filePath).toString('base64')
	};
}

// 스타일 레퍼런스 이미지 로드
function loadStyleReferences(): { mimeType: string; data: string }[] {
	const images: { mimeType: string; data: string }[] = [];

	for (const file of STYLE_REFERENCES) {
		const filePath = path.join(REFERENCE_DIR, file);
		const img = loadImage(filePath);
		if (img) {
			images.push(img);
			console.log(`  레퍼런스 로드: ${file}`);
		} else {
			console.log(`  ⚠️ 레퍼런스 없음: ${file}`);
		}
	}

	return images;
}

describe('손님 캐릭터 생성', () => {
	it('order-sheet', async () => {
		if (!GEMINI_API_KEY) {
			console.log('⚠️ GOOGLE_API_KEY 없음 - 스킵');
			return;
		}

		if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
		const styleRefs = loadStyleReferences();

		const prompt = `
Draw 5 different characters side by side in a single horizontal line.
All 5 must be in ONE row, NOT stacked vertically.

Layout: [1] [2] [3] [4] [5] (left to right, single row)

Characters:
1. Young man - black hair, white shirt, blue tie
2. Young woman - long brown hair, round glasses, beige hoodie
3. Little boy - short messy hair, striped t-shirt
4. Old woman - gray hair bun, round glasses, yellow cardigan
5. Young woman - ponytail, headband, green tank top

Art style (match references):
- Upper body with hands visible
- Large round eyes with white highlights and thick eyelashes
- Peach/pink blush on cheeks
- Soft black outline
- Soft cel-shading
- Korean webtoon sticker style
- White background
`.trim();

		console.log('\n--- 프롬프트 ---');
		console.log(prompt);
		console.log('----------------\n');

		try {
			const response = await ai.models.generateContent({
				model: 'gemini-3-pro-image-preview',
				contents: [{ text: prompt }, ...styleRefs.map((img) => ({ inlineData: img }))],
				config: {
					responseModalities: ['TEXT', 'IMAGE']
				}
			});

			const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);

			if (part?.inlineData?.data) {
				const pngPath = path.join(OUTPUT_DIR, `order_sheet.png`);
				fs.writeFileSync(pngPath, Buffer.from(part.inlineData.data, 'base64'));
				console.log(`✅ 저장: ${pngPath}`);
			} else {
				console.log('❌ 이미지 생성 실패');
				console.log('응답:', JSON.stringify(response.candidates?.[0]?.content, null, 2));
			}
		} catch (e) {
			console.error('❌ 에러:', e);
		}
	}, 120000);
});
