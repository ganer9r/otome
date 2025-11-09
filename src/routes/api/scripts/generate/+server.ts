import { svelteAction } from '$lib/framework/svelteAction';
import { z } from 'zod';
import { getCharacter } from '$lib/domain/character/usecase.server';
import {
	buildCharacterProfile,
	getChapterDataByOrder,
	saveScript
} from '$lib/domain/script/usecase.server';
import { ScriptPromptBuilder } from '$lib/llm/builder/script-prompt-builder';
import { createLLMClient } from '$lib/llm/client.server';
import type { EngineConfig } from '$lib/llm/types';

/**
 * POST /api/scripts/generate
 * LLM 스크립트 생성 및 저장
 */
const generateScriptSchema = z.object({
	characterId: z.string().min(1, '캐릭터 ID를 입력해주세요'),
	prompt: z.string().min(1, '프롬프트를 입력해주세요'),
	chapterId: z.string().optional(),
	chapterOrder: z.number().int().min(1).max(30).optional()
});

export const POST = svelteAction.api({
	middlewares: [],
	form: generateScriptSchema,
	handler: async ({ data, locals }) => {
		const uid = locals.user.id;
		const { characterId, prompt, chapterId, chapterOrder } = data;

		// 1. 캐릭터 정보 조회
		const character = await getCharacter(uid, characterId);
		if (!character) {
			throw new Error('Character not found');
		}

		// 2. 프로필 생성
		const profile = buildCharacterProfile(character);

		// 3. 챕터 정보 조회 및 프로필에 추가
		let chapterContext = '';
		let chapterType: 'meet' | 'chat' | null = null;

		if (chapterId && chapterOrder) {
			const chapterData = await getChapterDataByOrder(chapterId, chapterOrder);
			if (chapterData) {
				chapterType = chapterData.type;
				chapterContext = `\n\n# 현재 챕터 정보\n챕터 번호: ${chapterOrder}\n타입: ${chapterData.type === 'meet' ? '만남' : '채팅'}\n제목: ${chapterData.title}\n설명: ${chapterData.description}\n내용:\n${chapterData.content}`;
			}
		}

		const fullProfile = profile + chapterContext;

		// 4. 엔진 설정
		const engine: EngineConfig = {
			model: 'deepseek/deepseek-chat',
			temperature: 0.8,
			maxTokens: 4096
		};

		// 5. 프롬프트 빌드 (챕터 타입에 따라 다른 프롬프트 사용)
		const systemPromptFile = chapterType === 'meet' ? 'script_meet.md' : 'script_chat.md';
		const messages = new ScriptPromptBuilder(engine)
			.setSystemPrompt(systemPromptFile)
			.setProfile(fullProfile, character.name)
			.request(prompt);

		// 6. LLM 클라이언트 초기화 및 호출
		const client = createLLMClient(engine);
		const result = await client.generate(messages);

		// 7. DB에 저장
		return saveScript({
			uid,
			characterId,
			chapterId: chapterId ?? null,
			chapterOrder: chapterOrder ?? null,
			prompt,
			content: result.content,
			model: result.model,
			tokensUsed: result.tokensUsed ?? null
		});
	}
});
