import { getAllCharacters } from '$lib/domain/character/usecase.server';
import type { PageServerLoad } from './$types';

/**
 * 캐릭터 목록 페이지 SSR 로드 (모든 캐릭터 공개)
 */
export const load: PageServerLoad = async () => {
	const characters = await getAllCharacters();

	return {
		characters
	};
};
