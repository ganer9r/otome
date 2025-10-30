import { svelteAction } from '$lib/framework/svelteAction';

/**
 * POST /api/auth/logout
 * 로그아웃
 */
export const POST = svelteAction.api({
	middlewares: [],
	handler: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		return { success: true };
	}
});
