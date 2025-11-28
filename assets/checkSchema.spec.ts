/**
 * DB 스키마 확인 스크립트
 * 실행: pnpm test assets/checkSchema.spec.ts
 */
import { describe, it, expect } from 'vitest';

async function getSupabaseClient() {
	const { createClient } = await import('@supabase/supabase-js');
	return createClient(
		'http://127.0.0.1:54521',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
	);
}

describe('DB 스키마 확인', () => {
	it('재료 테이블 확인', async () => {
		const supabase = await getSupabaseClient();

		const { data, error } = await supabase
			.from('cooking_game_ingredients')
			.select('*')
			.limit(5);

		if (error) {
			console.error('Error:', error);
			throw error;
		}

		console.log('\n=== cooking_game_ingredients 샘플 ===');
		console.log(JSON.stringify(data, null, 2));

		// 등급별 개수
		const { data: gradeCounts } = await supabase
			.from('cooking_game_ingredients')
			.select('grade');

		const counts: Record<string, number> = {};
		gradeCounts?.forEach((row) => {
			counts[row.grade] = (counts[row.grade] || 0) + 1;
		});

		console.log('\n=== 등급별 재료 수 ===');
		Object.entries(counts)
			.sort()
			.forEach(([grade, count]) => {
				console.log(`${grade}: ${count}개`);
			});

		expect(data?.length).toBeGreaterThan(0);
	});

	it('레시피 테이블 확인', async () => {
		const supabase = await getSupabaseClient();

		const { data, error } = await supabase
			.from('cooking_game_recipes')
			.select('*')
			.limit(5);

		if (error) {
			console.error('Error:', error);
			throw error;
		}

		console.log('\n=== cooking_game_recipes 샘플 ===');
		console.log(JSON.stringify(data, null, 2));

		const { count } = await supabase
			.from('cooking_game_recipes')
			.select('*', { count: 'exact', head: true });

		console.log(`\n총 레시피 수: ${count}개`);

		expect(data?.length).toBeGreaterThan(0);
	});

	it('조리기구별 레시피 수', async () => {
		const supabase = await getSupabaseClient();

		const { data } = await supabase.from('cooking_game_recipes').select('tool');

		const counts: Record<string, number> = {};
		data?.forEach((row) => {
			const tool = row.tool || '없음';
			counts[tool] = (counts[tool] || 0) + 1;
		});

		console.log('\n=== 조리기구별 레시피 수 ===');
		Object.entries(counts).forEach(([tool, count]) => {
			console.log(`${tool}: ${count}개`);
		});

		expect(data?.length).toBeGreaterThan(0);
	});
});
