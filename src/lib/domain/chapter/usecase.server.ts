import { ChapterPromptBuilder } from '$lib/llm/builder/chapter-prompt-builder';
import { generateFromLLM } from '$lib/llm/generator.server';
import type { EngineConfig } from '$lib/llm/types';
import { getCharacter } from '$lib/domain/character/usecase.server';
import { saveChapters, softDeleteActiveChapters } from './query.server';
import type { Chapter, ChapterItem } from './types';
import { supabase } from '$lib/supabase/supabase.server';
export { saveChapters, getActiveChapters, getActiveChaptersByCharacterId } from './query.server';

/**
 * 캐릭터 정보를 프로필 텍스트로 조합
 */
export function buildCharacterProfile(characterInfo: {
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
export function extractChaptersFromResponse(content: string): ChapterItem[] {
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
export async function getChapterDataById(chapterId?: string | null): Promise<ChapterItem[] | null> {
	if (!chapterId) {
		return null;
	}

	const { data, error } = await supabase
		.from('chapters')
		.select('data')
		.eq('id', chapterId)
		.single();

	if (error) {
		const message = error.message ?? 'Unknown error';
		console.warn(`Failed to fetch chapter data (${chapterId}): ${message}`);
		return null;
	}

	const payload = (data?.data ?? null) as unknown;

	if (!Array.isArray(payload)) {
		return null;
	}

	return payload as ChapterItem[];
}

export async function generateAndSaveChapters(
	uid: string,
	characterId: string,
	prompt: string,
	chapterId?: string
): Promise<Chapter> {
	// 1. 캐릭터 정보 조회
	const character = await getCharacter(uid, characterId);
	if (!character) {
		throw new Error('Character not found');
	}

	// 2. 프로필 생성
	const profile = buildCharacterProfile(character);
	const existingChapters = await getChapterDataById(chapterId);

	// 3. 프롬프트 빌더 생성
	const promptBuilder = new ChapterPromptBuilder()
		.system('chapter_generate.md')
		.characterInfo(profile, character.name)
		.withPreviousChaptersIf(existingChapters)
		.userRequest(prompt);

	const engine: EngineConfig = {
		model: 'google-ai-studio/gemini-2.5-flash',
		temperature: 0.8,
		maxTokens: 8192
	};

	// 6. LLM 호출 및 파싱
	const { data: chaptersData, model } = await generateFromLLM({
		engine,
		messages: promptBuilder.build(),
		parser: extractChaptersFromResponse
	});

	// 6. 기존 챕터 soft delete 및 신규 저장
	await softDeleteActiveChapters(characterId);

	return saveChapters({
		uid,
		characterId,
		prompt,
		data: chaptersData,
		model
	});
}

