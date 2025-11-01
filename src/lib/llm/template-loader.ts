import { readFileSync } from 'fs';
import { join } from 'path';

export class PromptTemplateLoader {
	private templatesCache: Map<string, string> = new Map();
	private basePath: string;

	constructor(basePath?: string) {
		this.basePath = basePath ?? join(process.cwd(), 'src/lib/llm/prompt');
	}

	/**
	 * 템플릿 로드 (파일명 직접 지정)
	 * @param filename - 'script_chat.md', 'chapter_guide.md' 등
	 */
	load(filename: string): string {
		// 캐시 확인
		if (this.templatesCache.has(filename)) {
			return this.templatesCache.get(filename)!;
		}

		// 파일 로드
		const filepath = join(this.basePath, filename);

		try {
			const content = readFileSync(filepath, 'utf-8');
			this.templatesCache.set(filename, content);
			return content;
		} catch (error) {
			throw new Error(`Failed to load template: ${filename}`);
		}
	}

	/**
	 * 여러 템플릿 미리 로드
	 */
	preloadAll(filenames: string[]): void {
		filenames.forEach((filename) => this.load(filename));
	}

	/**
	 * 캐시 초기화
	 */
	clearCache(): void {
		this.templatesCache.clear();
	}
}
