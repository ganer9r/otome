import { svelteAction } from '$lib/framework/svelteAction';
import { loginSchema } from '$lib/domain/auth/schemas';
import { login } from '$lib/domain/auth/usecase.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = svelteAction.api({
	form: loginSchema,
	handler: async ({ data, locals }) => {
		return await login({
			email: data.email,
			password: data.password,
			supabase: locals.supabase
		});
	}
});
