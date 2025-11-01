import type { EngineConfig } from '../types';
import { PromptTemplateLoader } from '../template-loader';

export class ScriptPromptBuilder {
	private loader: PromptTemplateLoader;
	private engine: EngineConfig | null;
	private systemPrompt: string = '';
	private profile: string = '';

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
	 * 프로필 주입 (NPC + User Avatar)
	 */
	setProfile(profile: string): this {
		this.profile = profile;
		return this;
	}

	/**
	 * 최종 요청 + 빌드
	 */
	request(userRequest: string): Array<{ role: 'system' | 'user'; content: string }> {
		const systemContent = `
${this.systemPrompt}

${this.profile}
`.trim();

		return [
			{ role: 'system', content: systemContent },
			{ role: 'user', content: userRequest }
		];
	}

	getEngine(): EngineConfig | null {
		return this.engine;
	}
}
