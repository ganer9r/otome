import { getCharacters } from '$lib/domain/character/usecase.server';
import type { PageServerLoad } from './$types';

/**
 * 캐릭터 목록 페이지 SSR 로드
 */
export const load: PageServerLoad = async ({ locals }) => {
	const uid = locals.user.id;
	const characters = await getCharacters(uid);

	return {
		characters
	};
};
