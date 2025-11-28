/**
 * 이미지 유틸리티 함수
 */
import * as fs from 'node:fs';
import sharp from 'sharp';

interface ConvertOptions {
	size?: number;
	tolerance?: number;
	expandPixels?: number;
	quality?: number;
}

/**
 * Flood Fill 배경 투명화 + 경계 확장
 */
async function removeBackground(
	inputBuffer: Buffer,
	tolerance: number,
	expandPixels: number
): Promise<Buffer> {
	const image = sharp(inputBuffer);
	const { width, height } = await image.metadata();
	if (!width || !height) throw new Error('이미지 메타데이터 오류');

	const rawBuffer = await image.ensureAlpha().raw().toBuffer();
	const bgR = rawBuffer[0], bgG = rawBuffer[1], bgB = rawBuffer[2];

	const getDistance = (idx: number) => Math.sqrt(
		(rawBuffer[idx] - bgR) ** 2 + (rawBuffer[idx + 1] - bgG) ** 2 + (rawBuffer[idx + 2] - bgB) ** 2
	);

	// BFS로 배경 영역 찾기
	const isBg = new Uint8Array(width * height);
	const queue: number[] = [];

	for (let x = 0; x < width; x++) { queue.push(x); queue.push((height - 1) * width + x); }
	for (let y = 0; y < height; y++) { queue.push(y * width); queue.push(y * width + width - 1); }

	while (queue.length > 0) {
		const pos = queue.shift()!;
		if (isBg[pos]) continue;
		if (getDistance(pos * 4) > tolerance) continue;

		isBg[pos] = 1;
		const x = pos % width, y = Math.floor(pos / width);
		if (x > 0) queue.push(pos - 1);
		if (x < width - 1) queue.push(pos + 1);
		if (y > 0) queue.push(pos - width);
		if (y < height - 1) queue.push(pos + width);
	}

	// N픽셀 확장
	const expandLevel = new Uint8Array(width * height);
	for (let level = 1; level <= expandPixels; level++) {
		for (let pos = 0; pos < width * height; pos++) {
			if (isBg[pos] || expandLevel[pos]) continue;
			const neighbors = [pos - 1, pos + 1, pos - width, pos + width];
			for (const n of neighbors) {
				if (n >= 0 && n < width * height) {
					if ((level === 1 && isBg[n]) || (level > 1 && expandLevel[n] === level - 1)) {
						expandLevel[pos] = level;
						break;
					}
				}
			}
		}
	}

	// 투명화 적용
	for (let pos = 0; pos < width * height; pos++) {
		const idx = pos * 4;
		if (isBg[pos]) {
			rawBuffer[idx + 3] = 0;
		} else if (expandLevel[pos]) {
			rawBuffer[idx + 3] = Math.round((expandLevel[pos] / (expandPixels + 1)) * 255);
		}
	}

	return sharp(rawBuffer, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

/**
 * PNG -> WebP 변환 (배경 투명화 포함)
 */
export async function convertToWebp(
	sourcePath: string,
	outputPath: string,
	options: ConvertOptions = {}
): Promise<{ srcSize: number; outSize: number }> {
	const { size = 512, tolerance = 80, expandPixels = 2, quality = 80 } = options;

	if (!fs.existsSync(sourcePath)) {
		throw new Error(`원본 없음: ${sourcePath}`);
	}

	let imageBuffer = await sharp(sourcePath).resize(size, size).png().toBuffer();
	imageBuffer = await removeBackground(imageBuffer, tolerance, expandPixels);
	await sharp(imageBuffer).webp({ quality }).toFile(outputPath);

	return {
		srcSize: fs.statSync(sourcePath).size,
		outSize: fs.statSync(outputPath).size
	};
}
