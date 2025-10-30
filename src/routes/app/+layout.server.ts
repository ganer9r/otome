import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// /app/* 모든 경로는 app_user 필수
	// app_user 없으면 /auth로 리다이렉트
	if (!locals.user) {
		redirect(302, '/auth');
	}

	return {
		user: locals.user
	};
};
