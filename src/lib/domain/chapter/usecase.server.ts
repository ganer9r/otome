import { uuidv7 } from 'uuidv7';
import { supabase } from '$lib/supabase/supabase.server';
import { ChapterPromptBuilder } from '$lib/llm/builder/chapter-prompt-builder';
import { createLLMClient } from '$lib/llm/client.server';
import type { EngineConfig } from '$lib/llm/types';
import { getCharacter } from '$lib/domain/character/usecase.server';
import type { Chapter, ChapterItem, SaveChaptersParams } from './types';

/**
 * 캐릭터 정보를 프로필 텍스트로 조합
 */
function buildCharacterProfile(characterInfo: {
	name: string;
	info?: string | null;
	settings?: string | null;
	introduction?: string | null;
	options?: any;
}): string {
	const profile = [];

	// Character Profile
	profile.push('# Character Profile');
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
		profile.push(`\n# Player Information\n${characterInfo.options.player_info}`);
	}

	return profile.join('\n\n');
}

/**
 * JSON 응답에서 챕터 배열 추출 (thinking 태그 제거 + 불완전한 JSON 복구)
 */
function extractChaptersFromResponse(content: string): ChapterItem[] {
	// 1. <thinking> 태그 제거
	let cleaned = content.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();

	// 2. JSON 코드 블록 제거 (```json ... ```)
	cleaned = cleaned.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();

	// 3. 불완전한 JSON 복구 시도
	// 마지막 배열 요소가 끊긴 경우 처리
	if (cleaned.endsWith(',')) {
		// 마지막 쉼표 제거하고 배열 닫기
		cleaned = cleaned.slice(0, -1) + ']';
	} else if (!cleaned.endsWith(']')) {
		// 배열이 닫히지 않은 경우
		// 마지막 불완전한 객체 찾아서 제거
		const lastCompleteIndex = cleaned.lastIndexOf('},');
		if (lastCompleteIndex !== -1) {
			cleaned = cleaned.slice(0, lastCompleteIndex + 1) + ']';
		} else {
			// 완전한 객체가 하나도 없으면 배열 닫기만 시도
			if (!cleaned.includes(']')) {
				cleaned += ']';
			}
		}
	}

	// 4. JSON 파싱
	let chapters: any[];
	try {
		chapters = JSON.parse(cleaned);
	} catch (parseError) {
		// 파싱 실패 시 디버깅 정보 포함
		const preview = cleaned.length > 500 ? cleaned.slice(0, 500) + '...' : cleaned;
		throw new Error(
			`JSON parsing failed. Preview: ${preview}\nError: ${parseError instanceof Error ? parseError.message : String(parseError)}`
		);
	}

	// 5. 배열 검증
	if (!Array.isArray(chapters)) {
		throw new Error('Generated content is not a valid JSON array');
	}

	// 6. 챕터 개수 검증 (30개 미만이면 경고하지만 진행)
	if (chapters.length < 20) {
		throw new Error(`Too few chapters: expected 30, but got ${chapters.length}`);
	}

	if (chapters.length !== 30) {
		console.warn(`Warning: Expected 30 chapters, but got ${chapters.length}`);
	}

	// 7. 유효한 챕터만 필터링
	const validChapters = chapters.filter((chapter, index) => {
		const isValid =
			typeof chapter.order === 'number' &&
			['meet', 'chat'].includes(chapter.type) &&
			typeof chapter.title === 'string' &&
			typeof chapter.description === 'string' &&
			typeof chapter.content === 'string';

		if (!isValid) {
			console.warn(`Skipping invalid chapter at index ${index}:`, chapter);
		}

		return isValid;
	});

	// 8. 최소 챕터 수 검증
	if (validChapters.length < 20) {
		throw new Error(`Not enough valid chapters: got ${validChapters.length} valid out of ${chapters.length} total`);
	}

	return validChapters as ChapterItem[];
}

/**
 * LLM을 이용한 챕터 생성 및 DB 저장 (soft delete 포함)
 */
export async function generateAndSaveChapters(
	uid: string,
	characterId: string,
	prompt: string,
	chapterId?: string
): Promise<Chapter> {
	// 1. 기존 챕터 조회 (deleted_at IS NULL)
	const { data: existingChapters, error: fetchError } = await supabase
		.from('chapters')
		.select('id')
		.eq('character_id', characterId)
		.is('deleted_at', null);

	if (fetchError) {
		throw new Error(`Failed to fetch existing chapters: ${fetchError.message}`);
	}

	// 2. 기존 챕터가 있으면 soft delete
	if (existingChapters && existingChapters.length > 0) {
		const now = new Date().toISOString();
		const { error: deleteError } = await supabase
			.from('chapters')
			.update({ deleted_at: now })
			.eq('character_id', characterId)
			.is('deleted_at', null);

		if (deleteError) {
			throw new Error(`Failed to soft delete existing chapters: ${deleteError.message}`);
		}
	}

	// 3. 캐릭터 정보 조회
	const character = await getCharacter(uid, characterId);
	if (!character) {
		throw new Error('Character not found');
	}

	// 4. 프로필 생성
	const profile = buildCharacterProfile(character);

	// 5. 기본 엔진 설정
	const engine: EngineConfig = {
		model: 'google-ai-studio/gemini-2.5-flash',
		temperature: 0.8,
		maxTokens: 8192
	};

	// 6. LLM 클라이언트 초기화
	const client = createLLMClient(engine.model);

	// 6-1. 재생성 시 기존 챕터 컨텍스트 추가
	let finalPrompt = prompt;
	if (chapterId) {
		const { data: existingChapter, error: existingError } = await supabase
			.from('chapters')
			.select('data')
			.eq('id', chapterId)
			.single();

		if (existingError) {
			console.warn(`Failed to fetch existing chapter for regeneration: ${existingError.message}`);
		} else if (existingChapter && existingChapter.data) {
			// 기존 챕터 제목 리스트 추출
			const existingData = existingChapter.data as unknown as ChapterItem[];
			const chapterTitles = existingData
				.map((c) => `[${c.order}] ${c.type === 'meet' ? '👥' : '💬'} ${c.title}`)
				.join('\n');

			finalPrompt = `현재 생성된 챕터 구조:
${chapterTitles}

사용자 수정 요청: ${prompt}

위 챕터 구조를 참고하되, 사용자 요청을 반영하여 30개 챕터를 새롭게 생성해주세요.
기존 챕터 개수(30개)와 meet/chat 비율은 유지해주세요.`;
		}
	}

	// 7. 프롬프트 빌드
	const messages = new ChapterPromptBuilder(engine)
		.setSystemPrompt('chapter_generate.md')
		.setProfile(profile, character.name)
		.request(finalPrompt);

	// 8. LLM 호출
	let result;
	try {
		result = await client.generate(messages, engine);
	} catch (error) {
		throw new Error(
			`Failed to generate chapters with LLM: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}

	// 9. JSON 파싱 및 검증
	let chaptersData: ChapterItem[];
	try {
		chaptersData = extractChaptersFromResponse(result.content);
	} catch (error) {
		throw new Error(
			`Failed to parse chapters from LLM response: ${error instanceof Error ? error.message : 'Invalid JSON'}`
		);
	}

	// 10. DB에 저장
	const newChapterId = uuidv7();
	const { data, error } = await supabase
		.from('chapters')
		.insert({
			id: newChapterId,
			uid,
			character_id: characterId,
			prompt,
			data: chaptersData,
			model: result.model
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to save chapters: ${error.message}`);
	}

	return data;
}

/**
 * 챕터 직접 저장 (이미 생성된 챕터)
 */
export async function saveChapters(params: SaveChaptersParams): Promise<Chapter> {
	const chapterId = uuidv7();

	const { data, error } = await supabase
		.from('chapters')
		.insert({
			id: chapterId,
			uid: params.uid,
			character_id: params.characterId,
			prompt: params.prompt,
			data: params.data,
			model: params.model
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to save chapters: ${error.message}`);
	}

	return data;
}

/**
 * 캐릭터의 활성 챕터 조회 (deleted_at IS NULL)
 */
export async function getActiveChapters(
	uid: string,
	characterId: string
): Promise<Chapter | null> {
	const { data, error } = await supabase
		.from('chapters')
		.select('*')
		.eq('uid', uid)
		.eq('character_id', characterId)
		.is('deleted_at', null)
		.single();

	if (error) {
		if (error.code === 'PGRST116') {
			// No rows found
			return null;
		}
		throw new Error(`Failed to get chapters: ${error.message}`);
	}

	return data;
}
