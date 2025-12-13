import { describe, it, expect } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || '';
const PROJECT_ROOT = '/Users/ganer9r/Project/app/otome';
const REFERENCE_DIR = path.join(PROJECT_ROOT, 'assets/reference');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'assets/ingredients2');

describe('1개 테스트', () => {
	it('쌀 이미지 생성', async () => {
		if (!GEMINI_API_KEY) {
			console.log('⚠️ API키 없음');
			return;
		}
		if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

		const files = fs.readdirSync(REFERENCE_DIR).filter((f) => f.endsWith('.png'));
		const referenceImages = files.map((file) => ({
			mimeType: 'image/png',
			data: fs.readFileSync(path.join(REFERENCE_DIR, file)).toString('base64')
		}));
		console.log(`레퍼런스 ${files.length}개 로드`);

		const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
		const prompt = `
Reference: Pokemon Sleep cooking game icons.
STYLE: Brown outline, simple flat cartoon, cute rounded shapes, vibrant colors, white background, soft shadow, 10% padding.
GENERATE: rice icon. Match reference style exactly.
`;

		console.log('생성 중...');
		const response = await ai.models.generateContent({
			model: 'gemini-3-pro-image-preview',
			contents: [{ text: prompt }, ...referenceImages.map((img) => ({ inlineData: img }))],
			config: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '1:1' } }
		});

		const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
		if (part?.inlineData?.data) {
			fs.writeFileSync(path.join(OUTPUT_DIR, '1.png'), Buffer.from(part.inlineData.data, 'base64'));
			console.log('✅ 저장: assets/ingredients2/1.png');
		}
		expect(part?.inlineData?.data).toBeTruthy();
	}, 60000);
});
