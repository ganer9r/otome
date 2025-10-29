import { getCharacters } from '$lib/domain/character/usecase.server';
import type { PageServerLoad } from './$types';

/**
 * 캐릭터 목록 페이지 SSR 로드
 */
export const load: PageServerLoad = async () => {
	const characters = await getCharacters();

	return {
		characters
	};
};
