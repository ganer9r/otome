/**
 * 모든 PNG -> WebP 일괄 변환
 * 실행: pnpm test src/scripts/convertAllToWebp.spec.ts
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { convertToWebp } from './imageUtils';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const SOURCE_DIR = path.join(PROJECT_ROOT, 'assets/ingredients');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'static/imgs/ingredients');

describe('모든 PNG -> WebP 변환', () => {
	it('일괄 변환', async () => {
		if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

		const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.png'));
		console.log(`\n📁 총 ${files.length}개 파일 변환 시작...\n`);

		let totalSrc = 0, totalOut = 0, success = 0, fail = 0;

		for (const file of files) {
			const id = path.basename(file, '.png');
			const sourcePath = path.join(SOURCE_DIR, file);
			const outputPath = path.join(OUTPUT_DIR, `${id}.webp`);

			try {
				const { srcSize, outSize } = await convertToWebp(sourcePath, outputPath);
				totalSrc += srcSize;
				totalOut += outSize;
				success++;

				if (success % 50 === 0) {
					console.log(`   진행: ${success}/${files.length}`);
				}
			} catch (e) {
				console.log(`❌ ${file}: ${e}`);
				fail++;
			}
		}

		console.log(`\n✅ 완료: ${success}개 성공, ${fail}개 실패`);
		console.log(`📊 용량: ${(totalSrc / 1024 / 1024).toFixed(1)}MB -> ${(totalOut / 1024 / 1024).toFixed(1)}MB (${((1 - totalOut / totalSrc) * 100).toFixed(0)}% 감소)`);

		expect(success).toBeGreaterThan(0);
	}, 600000); // 10분 타임아웃
});
