import type { PageServerLoad } from './$types';
import { getCharacter } from '$lib/domain/character/usecase.server';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const characterId = params.id;
	const uid = locals.user.id;

	const character = await getCharacter(uid, characterId);

	if (!character) {
		error(404, '캐릭터를 찾을 수 없습니다.');
	}

	return {
		character
	};
};
