import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getCharacter,
	updateCharacter,
	deleteCharacter
} from '$lib/domain/character/usecase.server';

/**
 * GET /api/characters/:id
 * 단일 캐릭터 조회
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const character = await getCharacter(locals.supabase, user.id, params.id);

		if (!character) {
			return json({ error: 'Character not found' }, { status: 404 });
		}

		return json(character, { status: 200 });
	} catch (error) {
		console.error('Failed to fetch character:', error);
		return json({ error: 'Failed to fetch character' }, { status: 500 });
	}
};

/**
 * PATCH /api/characters/:id
 * 캐릭터 수정
 */
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const dto = await request.json();
		const character = await updateCharacter(locals.supabase, user.id, params.id, dto);

		return json(character, { status: 200 });
	} catch (error) {
		console.error('Failed to update character:', error);
		return json({ error: 'Failed to update character' }, { status: 500 });
	}
};

/**
 * DELETE /api/characters/:id
 * 캐릭터 삭제
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await deleteCharacter(locals.supabase, user.id, params.id);

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('Failed to delete character:', error);
		return json({ error: 'Failed to delete character' }, { status: 500 });
	}
};
