import { error } from '@sveltejs/kit';
import { getCharacterById } from '$lib/domain/character/usecase.server';
import type { PageServerLoad } from './$types';

/**
 * 캐릭터 상세 페이지 SSR 로드 (공개)
 */
export const load: PageServerLoad = async ({ params }) => {
	const character = await getCharacterById(params.id);

	if (!character) {
		throw error(404, 'Character not found');
	}

	return {
		character
	};
};
