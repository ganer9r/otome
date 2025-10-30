import { error, type RequestEvent } from '@sveltejs/kit';
import type { AppUser } from '$lib/types';

export type AuthMiddlewareResult = {
	user: AppUser;
};

export async function authMiddleware(event: RequestEvent): Promise<AuthMiddlewareResult> {
	try {
		const user = event.locals.user;

		if (!user) {
			error(401, { message: '인증이 필요합니다.' });
		}

		return { user };
	} catch (err) {
		error(401, { message: '인증 처리 중 오류가 발생했습니다.' });
	}
}
