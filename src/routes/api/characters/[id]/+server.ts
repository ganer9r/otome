import { svelteAction } from '$lib/framework/svelteAction';
import {
	getCharacter,
	updateCharacter,
	deleteCharacter,
	TEMP_USER_ID
} from '$lib/domain/character/usecase.server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

/**
 * GET /api/characters/:id
 * 단일 캐릭터 조회
 */
export const GET = svelteAction.api({
	middlewares: [],
	handler: async ({ params }) => {
		if (!params.id) {
			error(400, { message: 'Character ID is required' });
		}

		const character = await getCharacter(TEMP_USER_ID, params.id);

		if (!character) {
			error(404, { message: 'Character not found' });
		}

		return character;
	}
});

/**
 * PATCH /api/characters/:id
 * 캐릭터 수정
 */
const updateCharacterSchema = z.object({
	name: z.string().min(1).optional(),
	info: z.string().optional(),
	settings: z.string().optional(),
	introduction: z.string().optional(),
	options: z
		.object({
			chapter_guidelines: z.string().optional()
		})
		.optional()
});

export const PATCH = svelteAction.api({
	middlewares: [],
	form: updateCharacterSchema,
	handler: async ({ data, params }) => {
		if (!params.id) {
			error(400, { message: 'Character ID is required' });
		}

		const character = await updateCharacter(TEMP_USER_ID, params.id, data);
		return character;
	}
});

/**
 * DELETE /api/characters/:id
 * 캐릭터 삭제
 */
export const DELETE = svelteAction.api({
	middlewares: [],
	handler: async ({ params }) => {
		if (!params.id) {
			error(400, { message: 'Character ID is required' });
		}

		await deleteCharacter(TEMP_USER_ID, params.id);
		return new Response(null, { status: 204 });
	}
});
