import { svelteAction } from '$lib/framework/svelteAction';
import { generateAndSaveScript } from '$lib/domain/script/usecase.server';
import { z } from 'zod';

/**
 * POST /api/scripts/generate
 * LLM 스크립트 생성 및 저장
 */
const generateScriptSchema = z.object({
	characterId: z.string().min(1),
	prompt: z.string().min(1),
	chapterId: z.string().optional()
});

export const POST = svelteAction.api({
	middlewares: [],
	form: generateScriptSchema,
	handler: async ({ data, locals }) => {
		const uid = locals.user.id;
		const script = await generateAndSaveScript(uid, data.characterId, data.prompt, data.chapterId);
		return script;
	}
});
