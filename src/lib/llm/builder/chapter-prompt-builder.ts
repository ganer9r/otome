import type { EngineConfig } from '../types';
import { PromptTemplateLoader } from '../template-loader';
import type { ChapterItem } from '$lib/domain/chapter/types';

export class ChapterPromptBuilder {
	private loader: PromptTemplateLoader;
	private systemPrompt: string = '';
	private profile: string = '';
	private characterName: string = '';
	private userPrompt: string = '';
	private previousChapters: ChapterItem[] | null = null;
	private metadata: Record<string, any> = {};

	constructor(engine?: EngineConfig) {
		this.loader = new PromptTemplateLoader();
	}

	/**
	 * 시스템 프롬프트 설정
	 */
	system(filename: string): this {
		this.systemPrompt = this.loader.load(filename);
		return this;
	}

	/**
	 * 캐릭터 정보 설정
	 */
	characterInfo(profile: string, characterName: string): this {
		this.profile = profile;
		this.characterName = characterName;
		return this;
	}

	/**
	 * 사용자 요청 설정
	 */
	userRequest(prompt: string): this {
		this.userPrompt = prompt;
		return this;
	}

	/**
	 * 기존 챕터 참조 추가
	 */
	withPreviousChapters(chapters: ChapterItem[]): this {
		this.previousChapters = chapters;
		return this;
	}

	/**
	 * 기존 챕터 참조 추가 (조건부)
	 */
	withPreviousChaptersIf(chapters: ChapterItem[] | null | undefined): this {
		if (chapters && chapters.length > 0) {
			this.previousChapters = chapters;
		}
		return this;
	}

	/**
	 * 메타 정보 추가
	 */
	addMeta(data: Record<string, any>): this {
		this.metadata = { ...this.metadata, ...data };
		return this;
	}

	/**
	 * 메시지 빌드
	 */
	build(): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
		return this.createMessages();
	}

	private createMessages(): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
		const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

		// 1. System: 챕터 생성 프롬프트
		messages.push({ role: 'system', content: this.systemPrompt });

		// 2. Assistant: 캐릭터 정보 요청
		messages.push({
			role: 'assistant',
			content: 'Please provide character information.'
		});

		// 3. User: 캐릭터 프로필
		messages.push({ role: 'user', content: this.profile });

		// 4-5. (조건부) 기존 챕터 정보 요청
		if (this.previousChapters && this.previousChapters.length > 0) {
			const chapterTitles = this.previousChapters
				.map((c) => `[${c.order}] ${c.type === 'meet' ? '👥' : '💬'} ${c.title}`)
				.join('\n');

			messages.push({
				role: 'assistant',
				content: 'Please provide previous chapter information.'
			});

			messages.push({
				role: 'user',
				content: `현재 생성된 챕터 구조:\n${chapterTitles}`
			});
		}

		// 6. Assistant: 준비 완료
		messages.push({
			role: 'assistant',
			content: `I understand the character ${this.characterName}. I'm ready to generate 30 chapters. Shall we start?`
		});

		// 7. User: 시나리오 요청 + 생성 지시
		const hasUserPrompt = typeof this.userPrompt === 'string' && this.userPrompt.trim().length > 0;
		const finalPrompt = hasUserPrompt
			? `${this.userPrompt}\n\n위 설정으로 <thinking>부터 시작하여 30개 챕터를 생성하세요.`
			: `위 캐릭터 설정으로 <thinking>부터 시작하여 30개 챕터를 생성하세요.`;

		messages.push({
			role: 'user',
			content: finalPrompt
		});

		return messages;
	}
}
