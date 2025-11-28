/**
 * 바나나 이미지 생성 테스트 (Gemini Nano Banana)
 * 실행: pnpm test assets/testGenerateBanana.spec.ts
 *
 * 참고: https://ai.google.dev/gemini-api/docs/image-generation?hl=ko
 */
import { describe, it, expect } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || '';

// ======= 여기만 수정 =======
const TARGET_ID = 734;
const TARGET_NAME = 'seafood omakase, chef\'s choice seafood course';
// ==========================

// 프로젝트 루트 기준 assets 경로
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const ASSETS_DIR = path.join(PROJECT_ROOT, 'assets');
const REFERENCE_DIR = path.join(ASSETS_DIR, 'reference');
const TEST_DIR = path.join(ASSETS_DIR, 'test');

// 모든 레퍼런스 이미지 로드 (12개)
function loadAllReferenceImages(): { mimeType: string; data: string }[] {
	const files = fs.readdirSync(REFERENCE_DIR).filter((f) => f.endsWith('.png'));
	console.log(`레퍼런스 이미지 파일: ${files.join(', ')}`);

	return files.map((file) => {
		const filePath = path.join(REFERENCE_DIR, file);
		const data = fs.readFileSync(filePath).toString('base64');
		return { mimeType: 'image/png', data };
	});
}

describe('Gemini 이미지 생성 테스트', () => {
	it('바나나 이미지 생성', async () => {
		if (!GEMINI_API_KEY) {
			console.log('⚠️ GEMINI_API_KEY 환경변수가 없어서 스킵');
			return;
		}

		// test 폴더 생성
		if (!fs.existsSync(TEST_DIR)) {
			fs.mkdirSync(TEST_DIR, { recursive: true });
		}

		console.log('레퍼런스 이미지 로드 중...');
		const referenceImages = loadAllReferenceImages();
		console.log(`✅ 레퍼런스 이미지 ${referenceImages.length}개 로드됨`);

		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

		const prompt = `
Reference: Pokemon Sleep cooking game icons.

STYLE: Brown outline, simple flat cartoon, cute rounded shapes, vibrant colors, white background, soft shadow, 10% padding.

GENERATE: ${TARGET_NAME} icon. Match reference style exactly.
`;

		// contents 배열: 프롬프트 텍스트 + 레퍼런스 이미지들
		const contents = [
			{ text: prompt },
			...referenceImages.map((img) => ({
				inlineData: img
			}))
		];

		console.log('이미지 생성 요청 중...');

		const response = await ai.models.generateContent({
			model: 'gemini-3-pro-image-preview',
			contents: contents,
			config: {
				responseModalities: ['TEXT', 'IMAGE'],
				imageConfig: {
					aspectRatio: '1:1'
				}
			}
		});

		// 응답에서 이미지 추출
		let imageGenerated = false;
		for (const part of response.candidates?.[0]?.content?.parts || []) {
			if (part.inlineData?.data) {
				const buffer = Buffer.from(part.inlineData.data, 'base64');
				const outputPath = path.join(TEST_DIR, 'banana_test.png');
				fs.writeFileSync(outputPath, buffer);
				console.log(`✅ 이미지 저장됨: ${outputPath}`);
				imageGenerated = true;
				break;
			}
			if (part.text) {
				console.log('응답 텍스트:', part.text);
			}
		}

		expect(imageGenerated).toBe(true);
	}, 60000); // 60초 타임아웃
});
