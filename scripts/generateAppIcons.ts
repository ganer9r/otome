import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_IMAGE = path.join(__dirname, '../static/imgs/character/chef_default.png');
const APP_ASSETS = path.join(__dirname, '../app/assets');

async function generateIcon(
	outputPath: string,
	size: number,
	bgColor: string,
	addDevBadge: boolean = false
) {
	// 캐릭터 이미지를 100% 크기로 (여백 없음)
	const characterSize = size;
	const character = await sharp(SOURCE_IMAGE)
		.resize(characterSize, characterSize, {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		})
		.toBuffer();

	// 배경 생성 + 캐릭터 합성
	let image = sharp({
		create: {
			width: size,
			height: size,
			channels: 4,
			background: bgColor
		}
	}).composite([
		{
			input: character,
			gravity: 'center'
		}
	]);

	// DEV 배지 추가 (왼쪽 상단 큰 대각선 띠)
	if (addDevBadge) {
		const devRibbon = Buffer.from(`
			<svg width="${size}" height="${size}">
				<defs>
					<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
						<feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.5"/>
					</filter>
				</defs>
				<rect x="-${size * 0.3}" y="${size * 0.15}" width="${size * 0.9}" height="${size * 0.15}" fill="#FF0000" transform="rotate(-45, ${size * 0.22}, ${size * 0.22})" filter="url(#shadow)"/>
				<text x="${size * 0.22}" y="${size * 0.26}" text-anchor="middle" font-size="${size * 0.09}" font-weight="bold" fill="white" font-family="Arial Black, sans-serif" transform="rotate(-45, ${size * 0.22}, ${size * 0.22})">DEV</text>
			</svg>
		`);

		image = sharp(await image.png().toBuffer()).composite([
			{
				input: devRibbon,
				gravity: 'northwest'
			}
		]);
	}

	await image.png().toFile(outputPath);
	console.log(`Generated: ${outputPath}`);
}

async function main() {
	// PROD 아이콘 (흰색 배경)
	await generateIcon(path.join(APP_ASSETS, 'icon.png'), 1024, '#FFFFFF');
	await generateIcon(path.join(APP_ASSETS, 'adaptive-icon.png'), 1024, '#FFFFFF');
	await generateIcon(path.join(APP_ASSETS, 'splash-icon.png'), 1024, '#FFFFFF');
	await generateIcon(path.join(APP_ASSETS, 'favicon.png'), 48, '#FFFFFF');

	// DEV 아이콘 (노란색 배경 + DEV 배지)
	await generateIcon(path.join(APP_ASSETS, 'icon-dev.png'), 1024, '#FFD700', true);
	await generateIcon(path.join(APP_ASSETS, 'adaptive-icon-dev.png'), 1024, '#FFD700', true);

	console.log('\nDone! Icons generated.');
}

main().catch(console.error);
