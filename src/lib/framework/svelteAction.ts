// 프레임워크성 파일이라 여러 hack이 사용되었으므로 eslint 옵션 끔
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	fail,
	json,
	type Action,
	type RequestEvent,
	type RequestHandler,
	type ActionFailure
} from '@sveltejs/kit';
import { superValidate, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { z, ZodTypeAny } from 'zod';

// --- 공통 타입 유틸리티 ---
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

type Middleware = (event: RequestEvent) => object | void | Promise<object | void>;

type MiddlewaresResult<T> = T extends readonly Middleware[]
	? UnionToIntersection<Awaited<ReturnType<T[number]>>>
	: Record<string, never>;

// --- svelteAction.form 구현 ---
type FormLogicArgs<
	V extends ZodTypeAny | undefined,
	M extends readonly Middleware[] | undefined
> = RequestEvent &
	MiddlewaresResult<M> &
	(V extends ZodTypeAny ? { form: SuperValidated<z.infer<V>> } : Record<string, never>);

interface FormActionOptions<
	V extends ZodTypeAny | undefined,
	M extends readonly Middleware[] | undefined
> {
	middlewares?: M;
	form?: V;
	handler: (args: FormLogicArgs<V, M>) => ReturnType<Action>;
}

function form<V extends ZodTypeAny | undefined, M extends readonly Middleware[] | undefined>(
	options: FormActionOptions<V, M>
): Action {
	const { middlewares, form: formSchema, handler } = options;

	return async (event: RequestEvent) => {
		try {
			let extendedContext = {};
			if (middlewares) {
				for (const middleware of middlewares) {
					const result = await middleware(event);
					if (result) extendedContext = { ...extendedContext, ...result };
				}
			}

			if (formSchema) {
				const form = await superValidate(event.request, zod(formSchema as any));
				if (!form.valid) return fail(400, { form });
				extendedContext = { ...extendedContext, form };
			}

			const finalArgs = { ...event, ...extendedContext } as FormLogicArgs<V, M>;
			return await handler(finalArgs);
		} catch (err: unknown) {
			// ActionFailure인 경우 그대로 반환
			if (
				err &&
				typeof (err as ActionFailure).status === 'number' &&
				'data' in (err as ActionFailure)
			) {
				return err as ActionFailure;
			}

			// SvelteKit HttpError인 경우 fail()로 변환
			if (err && typeof err === 'object' && 'status' in err && 'body' in err) {
				const httpError = err as {
					status: number;
					body: { message?: string; [key: string]: unknown };
				};
				return fail(httpError.status, httpError.body);
			}

			console.error('Form Action Error:', err);
			return fail(500, { message: 'Internal Server Error' });
		}
	};
}

// --- svelteAction.api 구현 ---
type ApiLogicArgs<
	V extends ZodTypeAny | undefined,
	M extends readonly Middleware[] | undefined
> = RequestEvent &
	MiddlewaresResult<M> &
	(V extends ZodTypeAny ? { data: z.infer<V> } : { data?: never });

interface ApiActionOptions<
	V extends ZodTypeAny | undefined,
	M extends readonly Middleware[] | undefined
> {
	middlewares?: M;
	form?: V;
	handler: (args: ApiLogicArgs<V, M>) => unknown | Promise<unknown>;
}

function api<V extends ZodTypeAny | undefined, M extends readonly Middleware[] | undefined>(
	options: ApiActionOptions<V, M>
): RequestHandler {
	const { middlewares, form: formSchema, handler } = options;

	return async (event) => {
		try {
			let extendedContext: Record<string, unknown> = {};
			if (middlewares) {
				for (const middleware of middlewares) {
					const result = await middleware(event);
					if (result) extendedContext = { ...extendedContext, ...result };
				}
			}

			let validatedData;
			if (formSchema) {
				let input: unknown;
				if (['GET', 'DELETE'].includes(event.request.method)) {
					input = Object.fromEntries(event.url.searchParams);
				} else {
					try {
						input = await event.request.json();
					} catch {
						return json({ message: 'Invalid JSON body' }, { status: 400 });
					}
				}
				const result = formSchema.safeParse(input);
				if (!result.success) {
					return json(
						{ message: 'Validation failed', errors: result.error.flatten() },
						{ status: 400 }
					);
				}
				validatedData = result.data;
			}

			// handler에는 'data'를 전달
			const finalArgs = { ...event, ...extendedContext, data: validatedData } as ApiLogicArgs<V, M>;
			const result = await handler(finalArgs);

			// 결과가 이미 Response 객체인지 확인
			if (result instanceof Response) {
				return result;
			}

			// 그렇지 않으면 json()으로 감싸기
			return json(result);
		} catch (err: unknown) {
			// 일반 Error 객체인 경우 App.Error 형태로 변환
			if (err instanceof Error) {
				const errorResponse: App.Error = {
					message: err.message
				};
				return json(errorResponse, { status: 400 });
			}

			// SvelteKit HttpError인 경우 그대로 전달
			if (err && typeof err === 'object' && 'status' in err && 'body' in err) {
				const httpError = err as {
					status: number;
					body: { message?: string; [key: string]: unknown };
				};
				return json(httpError.body, { status: httpError.status });
			}

			// 그 외 모든 에러는 일반 서버 에러로 처리
			console.error('API Error:', err);
			return json({ message: 'Internal Server Error' }, { status: 500 });
		}
	};
}

// --- 최종 export 객체 ---
export const svelteAction = {
	form,
	api
};
