import { svelteAction } from '$lib/framework/svelteAction';
import { generateAndSaveChapters } from '$lib/domain/chapter/usecase.server';
import { z } from 'zod';

/**
 * POST /api/chapters/generate
 * LLM 챕터 생성 및 저장 (30개 챕터)
 */
const generateChaptersSchema = z.object({
	characterId: z.string().uuid('유효한 UUID 형식이 아닙니다'),
	prompt: z.string().min(1, '프롬프트를 입력해주세요')
});

export const POST = svelteAction.api({
	middlewares: [],
	form: generateChaptersSchema,
	handler: async ({ data, locals }) => {
		const uid = locals.user.id;
		const chapters = await generateAndSaveChapters(uid, data.characterId, data.prompt);
		return chapters;
	}
});
