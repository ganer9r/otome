/**
 * 프롬프트 파일들을 빌드 타임에 번들링
 * Cloudflare Workers/Pages 호환
 */
import chapterGenerate from './prompt/chapter_generate.md?raw';
import scriptChat from './prompt/script_chat.md?raw';
import scriptMeet from './prompt/script_meet.md?raw';

export const PROMPTS: Record<string, string> = {
	'chapter_generate.md': chapterGenerate,
	'script_chat.md': scriptChat,
	'script_meet.md': scriptMeet
};

/**
 * 프롬프트 로드 함수
 */
export function loadPrompt(filename: string): string {
	const content = PROMPTS[filename];
	if (!content) {
		throw new Error(`Prompt template not found: ${filename}`);
	}
	return content;
}
