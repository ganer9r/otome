import { svelteAction } from '$lib/framework/svelteAction';
import { addCharacter, getCharacters } from '$lib/domain/character/usecase.server';
import { z } from 'zod';

/**
 * POST /api/characters
 * 캐릭터 생성
 */
const createCharacterSchema = z.object({
	name: z.string().min(1),
	info: z.string().optional(),
	settings: z.string().optional(),
	introduction: z.string().optional(),
	options: z
		.object({
			chapter_guidelines: z.string().optional()
		})
		.optional()
});

export const POST = svelteAction.api({
	middlewares: [],
	form: createCharacterSchema,
	handler: async ({ data, locals }) => {
		const uid = locals.user.id;
		const character = await addCharacter(uid, data);
		return character;
	}
});

/**
 * GET /api/characters
 * 캐릭터 목록 조회
 */
export const GET = svelteAction.api({
	middlewares: [],
	handler: async ({ locals }) => {
		const uid = locals.user.id;
		const characters = await getCharacters(uid);
		return characters;
	}
});
