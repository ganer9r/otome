import { loadPrompt } from './prompts';

/**
 * 프롬프트 템플릿 로더 (Cloudflare Workers/Pages 호환)
 * 빌드 타임에 프롬프트 파일이 번들링됨
 */
export class PromptTemplateLoader {
	private templatesCache: Map<string, string> = new Map();

	/**
	 * 템플릿 로드 (파일명 직접 지정)
	 * @param filename - 'script_chat.md', 'chapter_generate.md' 등
	 */
	load(filename: string): string {
		// 캐시 확인
		if (this.templatesCache.has(filename)) {
			return this.templatesCache.get(filename)!;
		}

		// 빌드 타임에 번들링된 프롬프트 로드
		const content = loadPrompt(filename);
		this.templatesCache.set(filename, content);
		return content;
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
