import { redirect, error } from '@sveltejs/kit';
import { getCharacter } from '$lib/domain/character/usecase.server';
import type { PageServerLoad } from './$types';

/**
 * 캐릭터 상세 페이지 SSR 로드
 * - 인증 확인 (비로그인 시 로그인 페이지로 리다이렉트)
 * - 캐릭터 ID로 단일 캐릭터 조회
 * - 존재하지 않거나 권한 없으면 404
 */
export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(302, '/login');
	}

	const character = await getCharacter(locals.supabase, user.id, params.id);

	if (!character) {
		throw error(404, 'Character not found');
	}

	return {
		character
	};
};
