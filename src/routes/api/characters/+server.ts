import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addCharacter, getCharacters } from '$lib/domain/character/usecase.server';

/**
 * POST /api/characters
 * 캐릭터 생성
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const dto = await request.json();
		const character = await addCharacter(locals.supabase, user.id, dto);

		return json(character, { status: 201 });
	} catch (error) {
		console.error('Failed to create character:', error);
		return json({ error: 'Failed to create character' }, { status: 500 });
	}
};

/**
 * GET /api/characters
 * 캐릭터 목록 조회
 */
export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const characters = await getCharacters(locals.supabase, user.id);

		return json(characters, { status: 200 });
	} catch (error) {
		console.error('Failed to fetch characters:', error);
		return json({ error: 'Failed to fetch characters' }, { status: 500 });
	}
};
