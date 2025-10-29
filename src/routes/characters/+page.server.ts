import { redirect } from '@sveltejs/kit';
import { getCharacters } from '$lib/domain/character/usecase.server';
import type { PageServerLoad } from './$types';

/**
 * 캐릭터 목록 페이지 SSR 로드
 * - 인증 확인 (비로그인 시 로그인 페이지로 리다이렉트)
 * - 사용자의 모든 캐릭터 조회 (created_at DESC)
 */
export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(302, '/login');
	}

	const characters = await getCharacters(locals.supabase, user.id);

	return {
		characters
	};
};
