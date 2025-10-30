import { svelteAction } from '$lib/framework/svelteAction';
import { signupSchema } from '$lib/domain/auth/schemas';
import { signup } from '$lib/domain/auth/usecase.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = svelteAction.api({
	form: signupSchema,
	handler: async ({ data, locals }) => {
		return await signup({
			email: data.email,
			password: data.password,
			nickname: data.nickname,
			supabase: locals.supabase
		});
	}
});
