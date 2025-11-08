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
		if (!this.userPrompt) {
			throw new Error('ChapterPromptBuilder: user request is not set.');
		}

		return this.createMessages();
	}

	private createMessages(): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
		const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

		// 1. System: 챕터 생성 프롬프트
		messages.push({ role: 'system', content: this.systemPrompt });

		// 2. Assistant: 캐릭터 정보 요청
		messages.push({
			role: 'assistant',
			content: 'Please provide character information for chapter generation.'
		});

		// 3. User: 캐릭터 프로필
		messages.push({ role: 'user', content: this.profile });

		// 4. Assistant: 준비 완료
		messages.push({
			role: 'assistant',
			content: `I understand the character ${this.characterName}. I'm ready to generate 30 chapters for their romance story.`
		});

		// 5. (조건부) 기존 챕터 컨텍스트
		if (this.previousChapters && this.previousChapters.length > 0) {
			const chapterTitles = this.previousChapters
				.map((c) => `[${c.order}] ${c.type === 'meet' ? '👥' : '💬'} ${c.title}`)
				.join('\n');

			messages.push({
				role: 'user',
				content: `현재 생성된 챕터 구조:\n${chapterTitles}\n\n위 챕터 구조를 참고하되, 사용자 요청을 반영하여 30개 챕터를 새롭게 생성해주세요.\n기존 챕터 개수(30개)와 meet/chat 비율은 유지해주세요.`
			});
		}

		// 6. User: 실제 요청
		messages.push({ role: 'user', content: this.userPrompt });

		// 7. User: JSON 출력 요청
		messages.push({
			role: 'user',
			content: `위 캐릭터와 설정을 바탕으로 30개의 챕터를 생성해주세요.
<thinking>부터 시작하여 체크리스트를 모두 확인한 후, 유효한 JSON 배열 형식으로만 출력하세요.
다른 설명 텍스트 없이 JSON만 출력해야 합니다.`
		});

		return messages;
	}
}
