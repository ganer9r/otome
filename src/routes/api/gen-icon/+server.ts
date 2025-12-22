import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

// 이 API는 로컬 파일 시스템을 사용하므로 개발 환경에서만 동작
// Cloudflare Workers에서는 node:fs를 사용할 수 없음

export const POST: RequestHandler = async ({ request }) => {
	if (!dev) {
		throw error(503, 'This API is only available in development environment');
	}

	// 동적 import로 Node.js 모듈 로드 (개발 환경에서만)
	const fs = await import('node:fs');
	const path = await import('node:path');
	const { GoogleGenAI } = await import('@google/genai');

	const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
	const REFERENCE_PATH = path.resolve(process.cwd(), 'static/imgs/ui/star.png');
	const OUTPUT_DIR = path.resolve(process.cwd(), 'static/imgs/ui');

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

		let referenceImage: { mimeType: string; data: string } | null = null;
		if (fs.existsSync(REFERENCE_PATH)) {
			referenceImage = {
				mimeType: 'image/png',
				data: fs.readFileSync(REFERENCE_PATH).toString('base64')
			};
		}

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
	if (!dev) {
		throw error(503, 'This API is only available in development environment');
	}

	const fs = await import('node:fs');
	const path = await import('node:path');

	const OUTPUT_DIR = path.resolve(process.cwd(), 'static/imgs/ui');

	if (!fs.existsSync(OUTPUT_DIR)) {
		return json({ icons: [] });
	}

	const files = fs.readdirSync(OUTPUT_DIR).filter((f: string) => f.endsWith('.png'));
	const icons = files.map((f: string) => ({
		name: f.replace('.png', ''),
		path: `/imgs/ui/${f}`
	}));

	return json({ icons });
};
