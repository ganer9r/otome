import { uuidv7 } from 'uuidv7';
import { supabase } from '$lib/supabase/supabase.server';
import { ScriptPromptBuilder } from '$lib/llm/builder/script-prompt-builder';
import { createLLMClient } from '$lib/llm/client.server';
import type { EngineConfig } from '$lib/llm/types';
import { getCharacter } from '$lib/domain/character/usecase.server';
import type { SaveScriptParams, Script } from './types';

/**
 * 캐릭터 + 유저 정보를 프로필 텍스트로 조합
 */
function buildCharacterProfile(characterInfo: {
	name: string;
	info?: string | null;
	settings?: string | null;
	introduction?: string | null;
	options?: any;
}): string {
	const profile = [];

	// NPC Profile
	profile.push('# NPC Profile');
	profile.push(`## Name\n${characterInfo.name}`);

	if (characterInfo.info) {
		profile.push(`## Details\n${characterInfo.info}`);
	}

	if (characterInfo.settings) {
		profile.push(`## Settings\n${characterInfo.settings}`);
	}

	if (characterInfo.introduction) {
		profile.push(`## Introduction\n${characterInfo.introduction}`);
	}

	// Options에서 추가 정보
	if (characterInfo.options?.chapter_guidelines) {
		profile.push(`## Chapter Guidelines\n${characterInfo.options.chapter_guidelines}`);
	}

	if (characterInfo.options?.player_info) {
		profile.push(`\n# User Avatar (PC)\n${characterInfo.options.player_info}`);
	}

	return profile.join('\n\n');
}

/**
 * LLM을 이용한 스크립트 생성 및 DB 저장
 */
export async function generateAndSaveScript(
	uid: string,
	characterId: string,
	prompt: string
): Promise<Script> {
	// 1. 캐릭터 정보 조회
	const character = await getCharacter(uid, characterId);
	if (!character) {
		throw new Error('Character not found');
	}

	// 2. 프로필 생성
	const profile = buildCharacterProfile(character);

	// 3. 기본 엔진 설정 (provider/model 형식)
	// 사용 예제:
	// 'google-ai-studio/gemini-2.5-pro'     // Google Gemini
	// 'openai/gpt-4'                        // OpenAI GPT-4
	// 'anthropic/claude-3-sonnet-20240229'  // Anthropic Claude
	// 'deepseek/deepseek-chat'              // DeepSeek Chat
	// 'deepseek/deepseek-reasoner'          // DeepSeek Reasoner
	const engine: EngineConfig = {
		// model: 'deepseek/deepseek-chat',
		model: 'google-ai-studio/gemini-2.5-flash',
		temperature: 0.8,
		maxTokens: 4096
	};

	// 4. LLM 클라이언트 초기화
	const client = createLLMClient(engine.model);

	// 5. 프롬프트 빌드
	const messages = new ScriptPromptBuilder(engine)
		.setSystemPrompt('script_meet.md')
		.setProfile(profile, character.name)
		.request(prompt);

	// 6. LLM 호출
	const result = await client.generate(messages, engine);

	// 7. DB에 저장
	const scriptId = uuidv7();
	const { data, error } = await supabase
		.from('scripts')
		.insert({
			id: scriptId,
			uid,
			character_id: characterId,
			prompt,
			content: result.content,
			model: result.model,
			tokens_used: result.tokensUsed || null
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to save script: ${error.message}`);
	}

	return data;
}

/**
 * 스크립트 직접 저장 (이미 생성된 스크립트)
 */
export async function saveScript(params: SaveScriptParams): Promise<Script> {
	const scriptId = uuidv7();

	const { data, error } = await supabase
		.from('scripts')
		.insert({
			id: scriptId,
			uid: params.uid,
			character_id: params.characterId,
			prompt: params.prompt,
			content: params.content,
			model: params.model,
			tokens_used: params.tokensUsed || null
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to save script: ${error.message}`);
	}

	return data;
}
