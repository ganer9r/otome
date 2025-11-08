import { error } from '@sveltejs/kit';
import { getCharacter } from '$lib/domain/character/usecase.server';
import { getActiveChapters } from '$lib/domain/chapter/usecase.server';
import type { PageServerLoad } from './$types';

/**
 * 챕터 생성 페이지 SSR 로드
 */
export const load: PageServerLoad = async ({ params, locals }) => {
	const uid = locals.user.id;
	const character = await getCharacter(uid, params.id);

	if (!character) {
		throw error(404, 'Character not found');
	}

	// 활성 챕터 조회 (있으면 반환, 없으면 null)
	const chapters = await getActiveChapters(uid, params.id);

	return {
		character,
		chapters
	};
};
