import { json, error } from '@sveltejs/kit';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { RequestHandler } from './$types';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const REFERENCE_PATH = path.resolve(process.cwd(), 'static/imgs/ui/star.png');
const OUTPUT_DIR = path.resolve(process.cwd(), 'static/imgs/ui');

function loadReferenceImage(): { mimeType: string; data: string } | null {
	if (!fs.existsSync(REFERENCE_PATH)) return null;
	return {
		mimeType: 'image/png',
		data: fs.readFileSync(REFERENCE_PATH).toString('base64')
	};
}

export const POST: RequestHandler = async ({ request }) => {
	if (!GOOGLE_API_KEY) {
		throw error(500, 'GOOGLE_API_KEY not configured');
	}

	const { name, prompt } = await request.json();

	if (!name || !prompt) {
		throw error(400, 'name and prompt are required');
	}

	// 파일명 정리 (특수문자 제거)
	const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
	const outputPath = path.join(OUTPUT_DIR, `${safeName}.png`);

	try {
		const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
		const referenceImage = loadReferenceImage();

		const fullPrompt = `
Reference: Pokemon Sleep cooking game icons.

STYLE: Brown outline, simple flat cartoon, cute rounded shapes, vibrant colors, white background, NO shadow, 10% padding.

GENERATE: ${prompt} icon. Match reference style exactly.
`;

		const contents: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [
			{ text: fullPrompt }
		];
		if (referenceImage) {
			contents.push({ inlineData: referenceImage });
		}

		const response = await ai.models.generateContent({
			model: 'gemini-3-pro-image-preview',
			contents,
			config: {
				responseModalities: ['TEXT', 'IMAGE'],
				imageConfig: { aspectRatio: '1:1' }
			}
		});

		const part = response.candidates?.[0]?.content?.parts?.find(
			(p: { inlineData?: { data?: string } }) => p.inlineData?.data
		);

		if (!part?.inlineData?.data) {
			throw error(500, 'No image generated');
		}

		// 저장
		if (!fs.existsSync(OUTPUT_DIR)) {
			fs.mkdirSync(OUTPUT_DIR, { recursive: true });
		}
		fs.writeFileSync(outputPath, Buffer.from(part.inlineData.data, 'base64'));

		return json({
			success: true,
			name: safeName,
			path: `/imgs/ui/${safeName}.png`,
			size: part.inlineData.data.length
		});
	} catch (e) {
		console.error('Icon generation error:', e);
		throw error(500, e instanceof Error ? e.message : 'Generation failed');
	}
};

// 기존 아이콘 목록 조회
export const GET: RequestHandler = async () => {
	if (!fs.existsSync(OUTPUT_DIR)) {
		return json({ icons: [] });
	}

	const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith('.png'));
	const icons = files.map((f) => ({
		name: f.replace('.png', ''),
		path: `/imgs/ui/${f}`
	}));

	return json({ icons });
};
