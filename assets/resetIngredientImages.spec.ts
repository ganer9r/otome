/**
 * 재료 이미지 리셋/삭제 스크립트
 * 실행: pnpm test assets/resetIngredientImages.spec.ts
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const INGREDIENTS_DIR = path.resolve(__dirname, 'ingredients');

describe('이미지 리셋', () => {
	it.skip('모든 이미지 삭제', () => {
		const files = fs.readdirSync(INGREDIENTS_DIR).filter((f) => f.endsWith('.png'));
		console.log(`삭제할 이미지: ${files.length}개`);

		files.forEach((file) => {
			const filePath = path.join(INGREDIENTS_DIR, file);
			fs.unlinkSync(filePath);
			console.log(`삭제: ${file}`);
		});

		expect(true).toBe(true);
	});

	it.skip('특정 ID 범위 이미지 삭제', () => {
		const START_ID = 100;
		const END_ID = 150;

		const files = fs.readdirSync(INGREDIENTS_DIR).filter((f) => {
			const id = parseInt(f.replace('.png', ''));
			return id >= START_ID && id <= END_ID;
		});

		console.log(`ID ${START_ID}-${END_ID} 범위에서 ${files.length}개 삭제`);

		files.forEach((file) => {
			const filePath = path.join(INGREDIENTS_DIR, file);
			fs.unlinkSync(filePath);
			console.log(`삭제: ${file}`);
		});

		expect(true).toBe(true);
	});

	it('현재 이미지 목록', () => {
		const files = fs.readdirSync(INGREDIENTS_DIR).filter((f) => f.endsWith('.png'));
		console.log(`현재 이미지: ${files.length}개`);

		// ID별 정렬
		const ids = files.map((f) => parseInt(f.replace('.png', ''))).sort((a, b) => a - b);

		// 누락된 ID 찾기
		const maxId = Math.max(...ids);
		const missingIds: number[] = [];
		for (let i = 1; i <= maxId; i++) {
			if (!ids.includes(i)) {
				missingIds.push(i);
			}
		}

		if (missingIds.length > 0) {
			console.log(`\n누락된 ID (${missingIds.length}개):`);
			console.log(missingIds.join(', '));
		}

		expect(files.length).toBeGreaterThan(0);
	});
});
