/**
 * PNG -> WebP 변환 스크립트
 * 실행: pnpm test src/scripts/convertToWebp.spec.ts
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { convertToWebp } from './imageUtils';

// ======= 설정 =======
const TARGET_ID = 1;
// ====================

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const SOURCE_DIR = path.join(PROJECT_ROOT, 'assets/ingredients');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'static/imgs/ingredients');

describe('PNG -> WebP 변환', () => {
	it(`${TARGET_ID}.png -> ${TARGET_ID}.webp`, async () => {
		if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

		const sourcePath = path.join(SOURCE_DIR, `${TARGET_ID}.png`);
		const outputPath = path.join(OUTPUT_DIR, `${TARGET_ID}.webp`);

		const { srcSize, outSize } = await convertToWebp(sourcePath, outputPath);
		console.log(`✅ ${TARGET_ID}.png -> ${TARGET_ID}.webp (${(srcSize / 1024).toFixed(1)}KB -> ${(outSize / 1024).toFixed(1)}KB)`);

		expect(fs.existsSync(outputPath)).toBe(true);
	});
});
