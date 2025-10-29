import { error } from '@sveltejs/kit';
import { getCharacter, TEMP_USER_ID } from '$lib/domain/character/usecase.server';
import type { PageServerLoad } from './$types';

/**
 * 캐릭터 상세 페이지 SSR 로드
 */
export const load: PageServerLoad = async ({ params }) => {
	const character = await getCharacter(TEMP_USER_ID, params.id);

	if (!character) {
		throw error(404, 'Character not found');
	}

	return {
		character
	};
};
