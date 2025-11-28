/**
 * Gemini API를 사용한 재료 이미지 생성 스크립트
 * 실행: pnpm test assets/generateIngredientImages.spec.ts
 */
import { describe, it, expect } from 'vitest';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// 환경변수에서 API 키 로드
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// 경로 설정
const ASSETS_DIR = path.resolve(__dirname);
const INGREDIENTS_DIR = path.join(ASSETS_DIR, 'ingredients');
const REFERENCE_DIR = path.join(ASSETS_DIR, 'reference');

// 재료 데이터 (DB에서 가져온 데이터)
interface IngredientData {
	id: number;
	name: string;
	grade: string;
	prompt_en?: string;
}

// Supabase에서 재료 데이터 조회
async function fetchIngredientsFromDB(): Promise<IngredientData[]> {
	const { createClient } = await import('@supabase/supabase-js');
	const supabase = createClient(
		'http://127.0.0.1:54521',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
	);

	const { data, error } = await supabase
		.from('cooking_game_ingredients')
		.select('id, name, grade, prompt_en')
		.order('id');

	if (error) throw error;
	return data || [];
}

// 레퍼런스 이미지 로드
function loadReferenceImages(): { mimeType: string; data: string }[] {
	const referenceFiles = fs.readdirSync(REFERENCE_DIR).filter((f) => f.endsWith('.png'));
	return referenceFiles.map((file) => {
		const filePath = path.join(REFERENCE_DIR, file);
		const data = fs.readFileSync(filePath).toString('base64');
		return { mimeType: 'image/png', data };
	});
}

// 이미지 생성
async function generateImage(
	genAI: GoogleGenerativeAI,
	ingredient: IngredientData,
	referenceImages: { mimeType: string; data: string }[]
): Promise<Buffer | null> {
	const model = genAI.getGenerativeModel({
		model: 'gemini-2.0-flash-exp',
		generationConfig: {
			// @ts-expect-error - Gemini API 타입 정의 문제
			responseModalities: ['Text', 'Image']
		}
	});

	const prompt = `
You are creating a game ingredient icon.

STYLE REQUIREMENTS:
- Cute, kawaii style like the reference images
- Simple, clean design with soft colors
- White or transparent background
- Single item centered in frame
- Consistent with the reference style

INGREDIENT TO DRAW:
Name: ${ingredient.name}
Description: ${ingredient.prompt_en || ingredient.name}

Generate a single cute icon image for this ingredient.
`;

	const parts: any[] = [
		{ text: prompt },
		...referenceImages.slice(0, 4).map((img) => ({
			inlineData: img
		}))
	];

	try {
		const result = await model.generateContent(parts);
		const response = result.response;

		for (const candidate of response.candidates || []) {
			for (const part of candidate.content?.parts || []) {
				if (part.inlineData?.data) {
					return Buffer.from(part.inlineData.data, 'base64');
				}
			}
		}
	} catch (error) {
		console.error(`Error generating image for ${ingredient.name}:`, error);
	}

	return null;
}

// 이미지 존재 여부 확인
function imageExists(id: number): boolean {
	const imagePath = path.join(INGREDIENTS_DIR, `${id}.png`);
	return fs.existsSync(imagePath);
}

// 이미지 저장
function saveImage(id: number, buffer: Buffer): void {
	const imagePath = path.join(INGREDIENTS_DIR, `${id}.png`);
	fs.writeFileSync(imagePath, buffer);
	console.log(`Saved: ${imagePath}`);
}

describe('Gemini 이미지 생성', () => {
	it.skip('단일 재료 이미지 생성 테스트', async () => {
		if (!GEMINI_API_KEY) {
			console.log('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
			return;
		}

		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
		const referenceImages = loadReferenceImages();

		const testIngredient: IngredientData = {
			id: 999,
			name: '테스트 토마토',
			grade: 'G',
			prompt_en: 'A fresh red tomato'
		};

		const imageBuffer = await generateImage(genAI, testIngredient, referenceImages);

		if (imageBuffer) {
			const testPath = path.join(ASSETS_DIR, 'test_output.png');
			fs.writeFileSync(testPath, imageBuffer);
			console.log(`테스트 이미지 저장: ${testPath}`);
		}

		expect(imageBuffer).not.toBeNull();
	});

	it.skip('누락된 이미지만 생성', async () => {
		if (!GEMINI_API_KEY) {
			console.log('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
			return;
		}

		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
		const referenceImages = loadReferenceImages();
		const ingredients = await fetchIngredientsFromDB();

		// 누락된 재료 찾기
		const missingIngredients = ingredients.filter((ing) => !imageExists(ing.id));
		console.log(`총 ${ingredients.length}개 중 ${missingIngredients.length}개 이미지 누락`);

		// 배치 처리 (5개씩)
		const batchSize = 5;
		for (let i = 0; i < missingIngredients.length; i += batchSize) {
			const batch = missingIngredients.slice(i, i + batchSize);

			for (const ingredient of batch) {
				console.log(`생성 중: [${ingredient.id}] ${ingredient.name}`);
				const imageBuffer = await generateImage(genAI, ingredient, referenceImages);

				if (imageBuffer) {
					saveImage(ingredient.id, imageBuffer);
				} else {
					console.log(`실패: [${ingredient.id}] ${ingredient.name}`);
				}

				// Rate limit 대응
				await new Promise((r) => setTimeout(r, 2000));
			}

			console.log(`진행: ${Math.min(i + batchSize, missingIngredients.length)}/${missingIngredients.length}`);
		}

		expect(true).toBe(true);
	});

	it.skip('특정 ID 범위 이미지 생성', async () => {
		if (!GEMINI_API_KEY) {
			console.log('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
			return;
		}

		const START_ID = 1;
		const END_ID = 10;

		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
		const referenceImages = loadReferenceImages();
		const ingredients = await fetchIngredientsFromDB();

		const targetIngredients = ingredients.filter(
			(ing) => ing.id >= START_ID && ing.id <= END_ID && !imageExists(ing.id)
		);

		console.log(`ID ${START_ID}-${END_ID} 범위에서 ${targetIngredients.length}개 생성 예정`);

		for (const ingredient of targetIngredients) {
			console.log(`생성 중: [${ingredient.id}] ${ingredient.name}`);
			const imageBuffer = await generateImage(genAI, ingredient, referenceImages);

			if (imageBuffer) {
				saveImage(ingredient.id, imageBuffer);
			}

			await new Promise((r) => setTimeout(r, 2000));
		}

		expect(true).toBe(true);
	});

	it('이미지 생성 현황 확인', async () => {
		const ingredients = await fetchIngredientsFromDB();
		const existing = ingredients.filter((ing) => imageExists(ing.id));
		const missing = ingredients.filter((ing) => !imageExists(ing.id));

		console.log('\n=== 이미지 생성 현황 ===');
		console.log(`전체: ${ingredients.length}개`);
		console.log(`생성됨: ${existing.length}개`);
		console.log(`누락: ${missing.length}개`);

		if (missing.length > 0 && missing.length <= 20) {
			console.log('\n누락된 재료:');
			missing.forEach((ing) => console.log(`  [${ing.id}] ${ing.name}`));
		}

		expect(existing.length).toBeGreaterThan(0);
	});
});
