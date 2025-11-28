/**
 * 재료 프롬프트 영어 번역 스크립트
 * 실행: pnpm test assets/updateIngredientPromptsToEnglish.spec.ts
 */
import { describe, it, expect } from 'vitest';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

interface IngredientData {
	id: number;
	name: string;
	grade: string;
	prompt_en?: string | null;
}

async function getSupabaseClient() {
	const { createClient } = await import('@supabase/supabase-js');
	return createClient(
		'http://127.0.0.1:54521',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
	);
}

async function translateToEnglish(genAI: GoogleGenerativeAI, name: string): Promise<string> {
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

	const prompt = `
Translate this Korean food/ingredient name to English.
Provide a short, descriptive prompt for generating an image of this ingredient.
Format: Just the English description, nothing else.

Korean name: ${name}

Example:
Input: 토마토
Output: A fresh red tomato with green stem

Input: 김치볶음밥
Output: Korean kimchi fried rice with egg on top
`;

	const result = await model.generateContent(prompt);
	return result.response.text().trim();
}

describe('프롬프트 영어 번역', () => {
	it.skip('누락된 prompt_en 번역', async () => {
		if (!GEMINI_API_KEY) {
			console.log('GEMINI_API_KEY 필요');
			return;
		}

		const supabase = await getSupabaseClient();
		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

		// prompt_en이 없는 재료 조회
		const { data: ingredients, error } = await supabase
			.from('cooking_game_ingredients')
			.select('id, name, grade, prompt_en')
			.is('prompt_en', null)
			.order('id')
			.limit(50);

		if (error) throw error;
		if (!ingredients?.length) {
			console.log('번역할 재료가 없습니다.');
			return;
		}

		console.log(`번역할 재료: ${ingredients.length}개`);

		for (const ing of ingredients) {
			console.log(`번역 중: [${ing.id}] ${ing.name}`);

			try {
				const promptEn = await translateToEnglish(genAI, ing.name);
				console.log(`  → ${promptEn}`);

				const { error: updateError } = await supabase
					.from('cooking_game_ingredients')
					.update({ prompt_en: promptEn })
					.eq('id', ing.id);

				if (updateError) {
					console.error(`업데이트 실패: ${updateError.message}`);
				}

				await new Promise((r) => setTimeout(r, 500));
			} catch (e) {
				console.error(`번역 실패: ${e}`);
			}
		}

		expect(true).toBe(true);
	});

	it('prompt_en 현황 확인', async () => {
		const supabase = await getSupabaseClient();

		const { data: all } = await supabase.from('cooking_game_ingredients').select('id');
		const { data: withPrompt } = await supabase
			.from('cooking_game_ingredients')
			.select('id')
			.not('prompt_en', 'is', null);
		const { data: withoutPrompt } = await supabase
			.from('cooking_game_ingredients')
			.select('id, name')
			.is('prompt_en', null)
			.limit(10);

		console.log('\n=== prompt_en 현황 ===');
		console.log(`전체: ${all?.length || 0}개`);
		console.log(`번역됨: ${withPrompt?.length || 0}개`);
		console.log(`미번역: ${(all?.length || 0) - (withPrompt?.length || 0)}개`);

		if (withoutPrompt?.length) {
			console.log('\n미번역 재료 샘플:');
			withoutPrompt.forEach((ing) => console.log(`  [${ing.id}] ${ing.name}`));
		}

		expect(all?.length).toBeGreaterThan(0);
	});
});
