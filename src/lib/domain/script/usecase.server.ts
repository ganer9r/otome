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
	prompt: string,
	chapterId?: string,
	chapterOrder?: number
): Promise<Script> {
	// 1. 캐릭터 정보 조회
	const character = await getCharacter(uid, characterId);
	if (!character) {
		throw new Error('Character not found');
	}

	// 2. 챕터 정보 조회 (chapterId와 chapterOrder가 있는 경우)
	let chapterInfo = '';
	let chapterType: 'meet' | 'chat' | null = null;
	if (chapterId && chapterOrder) {
		const { data: chapter, error } = await supabase
			.from('chapters')
			.select('data')
			.eq('id', chapterId)
			.single();

		if (!error && chapter && chapter.data) {
			const chaptersData = chapter.data as any[];
			const targetChapter = chaptersData.find((ch) => ch.order === chapterOrder);
			if (targetChapter) {
				chapterType = targetChapter.type;
				chapterInfo = `\n\n# 현재 챕터 정보\n챕터 번호: ${targetChapter.order}\n타입: ${targetChapter.type === 'meet' ? '만남' : '채팅'}\n제목: ${targetChapter.title}\n설명: ${targetChapter.description}\n내용:\n${targetChapter.content}`;
			}
		}
	}

	// 3. 프로필 생성
	const profile = buildCharacterProfile(character) + chapterInfo;

	// 3. 기본 엔진 설정 (provider/model 형식)
	// 사용 예제:
	// 'google-ai-studio/gemini-2.5-pro'     // Google Gemini
	// 'openai/gpt-4'                        // OpenAI GPT-4
	// 'anthropic/claude-3-sonnet-20240229'  // Anthropic Claude
	// 'deepseek/deepseek-chat'              // DeepSeek Chat
	// 'deepseek/deepseek-reasoner'          // DeepSeek Reasoner
	const engine: EngineConfig = {
		model: 'deepseek/deepseek-chat',
		// model: 'google-ai-studio/gemini-2.5-flash',
		temperature: 0.8,
		maxTokens: 4096
	};

	// 4. LLM 클라이언트 초기화
	const client = createLLMClient(engine);

	// 5. 프롬프트 빌드 (챕터 타입에 따라 다른 프롬프트 사용)
	const systemPromptFile = chapterType === 'meet' ? 'script_meet.md' : 'script_chat.md';
	const messages = new ScriptPromptBuilder(engine)
		.setSystemPrompt(systemPromptFile)
		.setProfile(profile, character.name)
		.request(prompt);

	// 6. LLM 호출
	const result = await client.generate(messages);

	// 7. DB에 저장
	const scriptId = uuidv7();
	const { data, error } = await supabase
		.from('scripts')
		.insert({
			id: scriptId,
			uid,
			character_id: characterId,
			chapter_id: chapterId || null,
			chapter_order: chapterOrder || null,
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
			chapter_id: params.chapterId || null,
			chapter_order: params.chapterOrder || null,
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

/**
 * 챕터별 최신 스크립트 조회
 */
export async function getScriptByChapter(
	uid: string,
	characterId: string,
	chapterId: string,
	chapterOrder?: number
): Promise<Script | null> {
	let query = supabase
		.from('scripts')
		.select('*')
		.eq('uid', uid)
		.eq('character_id', characterId)
		.eq('chapter_id', chapterId);

	if (chapterOrder !== undefined) {
		query = query.eq('chapter_order', chapterOrder);
	}

	const { data, error } = await query
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	if (error) {
		// 404는 정상적인 상황 (스크립트가 없을 수 있음)
		if (error.code === 'PGRST116') {
			return null;
		}
		throw new Error(`Failed to fetch script: ${error.message}`);
	}

	return data;
}

/**
 * 챕터에 속한 스크립트의 chapter_order 목록 조회
 * 챕터 목록에서 스크립트 존재 여부 표시용
 */
export async function getScriptOrdersByChapter(
	uid: string,
	characterId: string,
	chapterId: string
): Promise<number[]> {
	const { data, error } = await supabase
		.from('scripts')
		.select('chapter_order')
		.eq('uid', uid)
		.eq('character_id', characterId)
		.eq('chapter_id', chapterId)
		.not('chapter_order', 'is', null);

	if (error) {
		throw new Error(`Failed to fetch script orders: ${error.message}`);
	}

	// 중복 제거 후 정렬
	const orders = Array.from(new Set(data.map((item) => item.chapter_order as number)));
	return orders.sort((a, b) => a - b);
}
