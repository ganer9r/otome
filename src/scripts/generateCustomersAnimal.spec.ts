/**
 * 손님 캐릭터 이미지 생성 (동물 버전) - 10.jpg 레퍼런스
 *
 * 실행: pnpm test src/scripts/generateCustomersAnimal.spec.ts
 */
import { describe, it } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || '';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const REFERENCE_DIR = path.join(PROJECT_ROOT, 'assets/reference/character');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'assets/customers');

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

describe('손님 캐릭터 생성 (동물)', () => {
	// 	it('order-sheet-animal', async () => {
	// 		if (!GEMINI_API_KEY) {
	// 			console.log('⚠️ GOOGLE_API_KEY 없음 - 스킵');
	// 			return;
	// 		}

	// 		if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

	// 		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

	// 		// 10.jpg 레퍼런스 로드
	// 		const refPath = path.join(REFERENCE_DIR, '10.jpg');
	// 		const refImage = loadImage(refPath);
	// 		if (!refImage) {
	// 			console.log('❌ 10.jpg 레퍼런스 없음');
	// 			return;
	// 		}
	// 		console.log('레퍼런스 로드: 10.jpg');

	// 		const prompt = `
	// Look at the reference image. It shows a cute rabbit character with:
	// - White rabbit with long upright ears
	// - Pink bow on one ear
	// - White shirt with dark tie
	// - Arms resting on table/surface
	// - Thick black outline
	// - Large round eyes with white highlights
	// - Pink blush on cheeks
	// - Light gray background

	// Draw 5 DIFFERENT animal characters in the EXACT same style, in a single horizontal row.

	// The 5 animals (left to right):
	// 1. White rabbit with pink bow (same as reference)
	// 2. Orange cat with bell collar
	// 3. Brown puppy with floppy ears, red bandana
	// 4. Brown bear with white apron
	// 5. Orange fox with green scarf

	// Rules:
	// - EXACT same art style as the reference
	// - EXACT same pose (arms on table)
	// - EXACT same proportions and size
	// - EXACT same line thickness
	// - All 5 in ONE horizontal row: [1] [2] [3] [4] [5]
	// - Same neutral smile expression
	// - Light gray background
	// `.trim();

	// 		console.log('\n--- 프롬프트 ---');
	// 		console.log(prompt);
	// 		console.log('----------------\n');

	// 		try {
	// 			const response = await ai.models.generateContent({
	// 				model: 'gemini-3-pro-image-preview',
	// 				contents: [{ text: prompt }, { inlineData: refImage }],
	// 				config: {
	// 					responseModalities: ['TEXT', 'IMAGE']
	// 				}
	// 			});

	// 			const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);

	// 			if (part?.inlineData?.data) {
	// 				const pngPath = path.join(OUTPUT_DIR, `order_sheet_animal.png`);
	// 				fs.writeFileSync(pngPath, Buffer.from(part.inlineData.data, 'base64'));
	// 				console.log(`✅ 저장: ${pngPath}`);
	// 			} else {
	// 				console.log('❌ 이미지 생성 실패');
	// 				console.log('응답:', JSON.stringify(response.candidates?.[0]?.content, null, 2));
	// 			}
	// 		} catch (e) {
	// 			console.error('❌ 에러:', e);
	// 		}
	// 	}, 120000);

	it('order-sheet-animal-success', async () => {
		if (!GEMINI_API_KEY) {
			console.log('⚠️ GOOGLE_API_KEY 없음 - 스킵');
			return;
		}

		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

		// 기본 이미지 로드
		const basePath = path.join(OUTPUT_DIR, 'order_sheet_animal.png');
		const baseImage = loadImage(basePath);
		if (!baseImage) {
			console.log('❌ order_sheet_animal.png 없음 - order-sheet-animal 먼저 실행하세요');
			return;
		}
		console.log('기본 이미지 로드: order_sheet_animal.png');

		const prompt = `
This image shows 5 animal characters in a single horizontal row.

Edit this image: change ONLY their facial expressions to HAPPY.
- Big smile, mouth open
- Eyes closed with joy

DO NOT change:
- The number of characters (keep exactly 5)
- The layout (keep single horizontal row, NOT a grid)
- The characters, clothes, poses, colors, background
- The image dimensions or proportions

Output: same image with only expressions changed to happy.
`.trim();

		console.log('\n--- 프롬프트 (success) ---');
		console.log(prompt);
		console.log('----------------\n');

		try {
			const response = await ai.models.generateContent({
				model: 'gemini-3-pro-image-preview',
				contents: [{ text: prompt }, { inlineData: baseImage }],
				config: {
					responseModalities: ['TEXT', 'IMAGE']
				}
			});

			const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);

			if (part?.inlineData?.data) {
				const pngPath = path.join(OUTPUT_DIR, `order_sheet_animal_success.png`);
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

	it('order-sheet-animal-fail', async () => {
		if (!GEMINI_API_KEY) {
			console.log('⚠️ GOOGLE_API_KEY 없음 - 스킵');
			return;
		}

		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

		// 기본 이미지 로드
		const basePath = path.join(OUTPUT_DIR, 'order_sheet_animal.png');
		const baseImage = loadImage(basePath);
		if (!baseImage) {
			console.log('❌ order_sheet_animal.png 없음 - order-sheet-animal 먼저 실행하세요');
			return;
		}
		console.log('기본 이미지 로드: order_sheet_animal.png');

		const prompt = `
This image shows 5 animal characters in a single horizontal row.

Edit this image: change ONLY their facial expressions to SAD.
- Frown, downturned mouth
- Teary eyes with tear drops

DO NOT change:
- The number of characters (keep exactly 5)
- The layout (keep single horizontal row, NOT a grid)
- The characters, clothes, poses, colors, background
- The image dimensions or proportions

Output: same image with only expressions changed to sad.
`.trim();

		console.log('\n--- 프롬프트 (fail) ---');
		console.log(prompt);
		console.log('----------------\n');

		try {
			const response = await ai.models.generateContent({
				model: 'gemini-3-pro-image-preview',
				contents: [{ text: prompt }, { inlineData: baseImage }],
				config: {
					responseModalities: ['TEXT', 'IMAGE']
				}
			});

			const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);

			if (part?.inlineData?.data) {
				const pngPath = path.join(OUTPUT_DIR, `order_sheet_animal_fail.png`);
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
