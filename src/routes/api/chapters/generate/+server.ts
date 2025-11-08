import { svelteAction } from '$lib/framework/svelteAction';
import { z } from 'zod';
import { getCharacter } from '$lib/domain/character/usecase.server';
import { saveChapters, softDeleteActiveChapters } from '$lib/domain/chapter/query.server';
import {
	buildCharacterProfile,
	extractChaptersFromResponse,
	getChapterDataById
} from '$lib/domain/chapter/usecase.server';
import { ChapterPromptBuilder } from '$lib/llm/builder/chapter-prompt-builder';
import { generateFromLLM } from '$lib/llm/generator.server';
import type { EngineConfig } from '$lib/llm/types';

/**
 * POST /api/chapters/generate
 * LLM 챕터 생성 및 저장 (30개 챕터)
 */
const generateChaptersSchema = z.object({
	characterId: z.string().uuid('유효한 UUID 형식이 아닙니다'),
	prompt: z.string().min(1, '프롬프트를 입력해주세요'),
	chapterId: z.string().uuid().optional()
});

export const POST = svelteAction.api({
	middlewares: [],
	form: generateChaptersSchema,
	handler: async ({ data, locals }) => {
		const uid = locals.user.id;
		const { characterId, prompt, chapterId } = data;

		// 1. 캐릭터 정보 조회
		const character = await getCharacter(uid, characterId);
		if (!character) {
			throw new Error('Character not found');
		}

		// 2. 프로필 생성
		const profile = buildCharacterProfile(character);

		// 3. 기존 챕터 컨텍스트 확보
		const existingChapters = await getChapterDataById(chapterId);

		// 4. 프롬프트 빌더 생성
		const messages = new ChapterPromptBuilder()
			.system('chapter_generate.md')
			.characterInfo(profile, character.name)
			.withPreviousChaptersIf(existingChapters)
			.userRequest(prompt)
			.build();

		console.log(messages);

		// 5. 엔진 설정
		const engine: EngineConfig = {
			model: 'google-ai-studio/gemini-2.5-flash',
			temperature: 0.8,
			maxTokens: 8192
		};

		// 6. LLM 호출 및 파싱
		const { data: chaptersData, model } = await generateFromLLM({
			engine,
			messages,
			parser: extractChaptersFromResponse
		});

		// 7. 기존 챕터 soft delete 및 신규 저장
		await softDeleteActiveChapters(characterId);

		const chapters = await saveChapters({
			uid,
			characterId,
			prompt,
			data: chaptersData,
			model
		});

		return chapters;
	}
});
