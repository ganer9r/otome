/**
 * 손님 캐릭터 이미지 생성 (사람 버전) - 요리사 스타일 레퍼런스
 *
 * 실행: pnpm test src/scripts/generateCustomersHuman.spec.ts
 */
import { describe, it } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';
import sharp from 'sharp';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || '';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'assets/customers');
const CHEF_REF = path.join(PROJECT_ROOT, 'static/imgs/character/chef_default.png');

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

describe('손님 캐릭터 생성 (사람)', () => {
	// 	it('order-sheet-human', async () => {
	// 		if (!GEMINI_API_KEY) {
	// 			console.log('⚠️ GOOGLE_API_KEY 없음 - 스킵');
	// 			return;
	// 		}

	// 		if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

	// 		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

	// 		// 요리사 레퍼런스 로드
	// 		const refImage = loadImage(CHEF_REF);
	// 		if (!refImage) {
	// 			console.log('❌ chef_default.png 레퍼런스 없음');
	// 			return;
	// 		}
	// 		console.log('레퍼런스 로드: chef_default.png');

	// 		const prompt = `
	// Look at the reference image. It shows a cute chef character (upper body only).

	// Create a 3x3 GRID SPRITE SHEET with EXACTLY 9 human characters for easy cutting.

	// LAYOUT (3 rows x 3 columns):
	// - Total image: 900px wide x 900px tall
	// - 9 equal cells: each cell is 300px x 300px
	// - Each character CENTERED in its cell with padding
	// - Characters should NOT touch the cell edges

	// The 9 characters (row by row, left to right):
	// Row 1:
	// 1. Office man - black hair, white shirt, blue tie
	// 2. College girl - long brown hair, round glasses, beige hoodie
	// 3. Little boy - short messy hair, striped colorful t-shirt
	// Row 2:
	// 4. Grandma - gray hair in bun, round glasses, yellow cardigan
	// 5. Sporty girl - ponytail, headband, green tank top
	// 6. Businessman - slicked back hair, suit and red tie
	// Row 3:
	// 7. Nurse - short hair, nurse cap, white uniform
	// 8. Artist - messy colorful hair, beret, paint-stained shirt
	// 9. Hipster - beard, man bun, flannel shirt

	// Style rules:
	// - EXACT same art style as the reference chef
	// - Upper body only (bust shot like the reference)
	// - Same soft rounded style, gradient shading, pink blush
	// - Neutral friendly smile
	// - Pure white background (#FFFFFF)
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
	// 				const pngPath = path.join(OUTPUT_DIR, `order_sheet_human.png`);
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

	// 	it('order-sheet-human-success', async () => {
	// 		if (!GEMINI_API_KEY) {
	// 			console.log('⚠️ GOOGLE_API_KEY 없음 - 스킵');
	// 			return;
	// 		}

	// 		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

	// 		// 기본 이미지 로드
	// 		const basePath = path.join(OUTPUT_DIR, 'order_sheet_human.png');
	// 		const baseImage = loadImage(basePath);
	// 		if (!baseImage) {
	// 			console.log('❌ order_sheet_human.png 없음 - order-sheet-human 먼저 실행하세요');
	// 			return;
	// 		}
	// 		console.log('기본 이미지 로드: order_sheet_human.png');

	// 		const prompt = `
	// This image shows a 3x3 grid sprite sheet with 9 human characters.

	// Edit this image: change ONLY their facial expressions to VERY HAPPY.
	// - Big bright smile, mouth wide open
	// - Eyes closed with joy
	// - Add sparkle effects around their faces

	// DO NOT change:
	// - The number of characters (keep exactly 9)
	// - The 3x3 grid layout
	// - The characters, clothes, poses, colors, background
	// - The image dimensions (900px x 900px)

	// Output: same sprite sheet with only expressions changed to very happy.
	// `.trim();

	// 		console.log('\n--- 프롬프트 (success) ---');
	// 		console.log(prompt);
	// 		console.log('----------------\n');

	// 		try {
	// 			const response = await ai.models.generateContent({
	// 				model: 'gemini-3-pro-image-preview',
	// 				contents: [{ text: prompt }, { inlineData: baseImage }],
	// 				config: {
	// 					responseModalities: ['TEXT', 'IMAGE']
	// 				}
	// 			});

	// 			const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);

	// 			if (part?.inlineData?.data) {
	// 				const pngPath = path.join(OUTPUT_DIR, `order_sheet_human_success.png`);
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

	// 	it('order-sheet-human-fail', async () => {
	// 		if (!GEMINI_API_KEY) {
	// 			console.log('⚠️ GOOGLE_API_KEY 없음 - 스킵');
	// 			return;
	// 		}

	// 		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

	// 		// 기본 이미지 로드
	// 		const basePath = path.join(OUTPUT_DIR, 'order_sheet_human.png');
	// 		const baseImage = loadImage(basePath);
	// 		if (!baseImage) {
	// 			console.log('❌ order_sheet_human.png 없음 - order-sheet-human 먼저 실행하세요');
	// 			return;
	// 		}
	// 		console.log('기본 이미지 로드: order_sheet_human.png');

	// 		const prompt = `
	// This image shows a 3x3 grid sprite sheet with 9 human characters.

	// Edit this image: change ONLY their facial expressions to SAD/DISAPPOINTED.
	// - Frown, downturned mouth
	// - Teary eyes with tear drops
	// - Add sweat drop or sad cloud effect

	// DO NOT change:
	// - The number of characters (keep exactly 9)
	// - The 3x3 grid layout
	// - The characters, clothes, poses, colors, background
	// - The image dimensions (900px x 900px)

	// Output: same sprite sheet with only expressions changed to sad.
	// `.trim();

	// 		console.log('\n--- 프롬프트 (fail) ---');
	// 		console.log(prompt);
	// 		console.log('----------------\n');

	// 		try {
	// 			const response = await ai.models.generateContent({
	// 				model: 'gemini-3-pro-image-preview',
	// 				contents: [{ text: prompt }, { inlineData: baseImage }],
	// 				config: {
	// 					responseModalities: ['TEXT', 'IMAGE']
	// 				}
	// 			});

	// 			const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);

	// 			if (part?.inlineData?.data) {
	// 				const pngPath = path.join(OUTPUT_DIR, `order_sheet_human_fail.png`);
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

	// ============================================
	// 시트 이미지를 3x3 그리드로 균등 9등분
	// ============================================
	it('cut-sheets', async () => {
		const sheets = [
			{ file: 'order_sheet_human.png', suffix: 'order' },
			{ file: 'order_sheet_human_success.png', suffix: 'success' },
			{ file: 'order_sheet_human_fail.png', suffix: 'fail' }
		];

		const GRID_COLS = 3;
		const GRID_ROWS = 3;
		const NUM_CHARACTERS = 9;

		for (const sheet of sheets) {
			const sheetPath = path.join(OUTPUT_DIR, sheet.file);
			if (!fs.existsSync(sheetPath)) {
				console.log(`⚠️ ${sheet.file} 없음 - 스킵`);
				continue;
			}

			console.log(`\n커팅: ${sheet.file}`);

			try {
				const metadata = await sharp(sheetPath).metadata();
				const width = metadata.width || 0;
				const height = metadata.height || 0;

				// 3x3 균등 분할
				const cellWidth = Math.floor(width / GRID_COLS);
				const cellHeight = Math.floor(height / GRID_ROWS);

				console.log(`  이미지 크기: ${width}x${height}, 셀: ${cellWidth}x${cellHeight}`);

				for (let i = 0; i < NUM_CHARACTERS; i++) {
					const row = Math.floor(i / GRID_COLS);
					const col = i % GRID_COLS;
					const left = col * cellWidth;
					const top = row * cellHeight;

					const outputName = `customer_${i + 1}_${sheet.suffix}.png`;
					const outputPath = path.join(OUTPUT_DIR, outputName);

					await sharp(sheetPath)
						.extract({
							left: left,
							top: top,
							width: cellWidth,
							height: cellHeight
						})
						.toFile(outputPath);

					console.log(`  ✅ ${outputName} (${cellWidth}x${cellHeight})`);
				}
			} catch (e) {
				console.error(`  ❌ 커팅 실패:`, e);
			}
		}

		console.log('\n커팅 완료!');
	});
});
