import type { EngineConfig } from '../types';
import { PromptTemplateLoader } from '../template-loader';

export class ChapterPromptBuilder {
	private loader: PromptTemplateLoader;
	private engine: EngineConfig | null;
	private systemPrompt: string = '';
	private profile: string = '';
	private characterName: string = '';

	constructor(engine?: EngineConfig) {
		this.loader = new PromptTemplateLoader();
		this.engine = engine ?? null;
	}

	setEngine(engine: EngineConfig): this {
		this.engine = engine;
		return this;
	}

	/**
	 * 시스템 프롬프트 주입 (파일명만)
	 */
	setSystemPrompt(filename: string): this {
		this.systemPrompt = this.loader.load(filename);
		return this;
	}

	/**
	 * 프로필 주입 (캐릭터 정보)
	 */
	setProfile(profile: string, characterName: string): this {
		this.profile = profile;
		this.characterName = characterName;
		return this;
	}

	/**
	 * 최종 요청 + 빌드
	 */
	request(
		userRequest: string
	): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
		return [
			// 1. System: 챕터 생성 프롬프트
			{ role: 'system', content: this.systemPrompt },

			// 2. Assistant: 캐릭터 정보 요청
			{ role: 'assistant', content: 'Please provide character information for chapter generation.' },

			// 3. User: 캐릭터 프로필
			{ role: 'user', content: this.profile },

			// 4. Assistant: 준비 완료
			{
				role: 'assistant',
				content: `I understand the character ${this.characterName}. I'm ready to generate 30 chapters for their romance story.`
			},

			// 5. User: 실제 요청
			{ role: 'user', content: userRequest },

			// 6. User: JSON 출력 요청
			{
				role: 'user',
				content: `위 캐릭터와 설정을 바탕으로 30개의 챕터를 생성해주세요.
<thinking>부터 시작하여 체크리스트를 모두 확인한 후, 유효한 JSON 배열 형식으로만 출력하세요.
다른 설명 텍스트 없이 JSON만 출력해야 합니다.`
			}
		];
	}

	getEngine(): EngineConfig | null {
		return this.engine;
	}
}
