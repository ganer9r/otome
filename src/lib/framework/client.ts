// 프레임워크성 파일이라 여러 hack이 사용되었으므로 eslint 옵션 끔
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Fetch = typeof fetch;

// SvelteKit RequestHandler를 위한 타입 추출 유틸리티
export type ApiRequestType<T> = T extends (...args: any[]) => any ? any : never;
export type ApiResponseType<T> = T extends (...args: any[]) => any ? any : never;

export interface ApiClientOptions {
	maxRetries?: number;
	retryDelay?: number;
	headers?: Record<string, string>;
}

export class ApiClient {
	readonly #fetch: Fetch;
	readonly #options: ApiClientOptions;

	constructor(fetch: Fetch, options: ApiClientOptions = {}) {
		this.#fetch = fetch;
		this.#options = {
			maxRetries: 0,
			retryDelay: 1000,
			...options
		};
	}

	async #executeRequest(
		url: string,
		options: RequestInit,
		maxRetries = this.#options.maxRetries || 0
	): Promise<Response> {
		let lastError: Error | null = null;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				const response = await this.#fetch(url, options);

				if (response.ok) {
					return response;
				}

				// 4xx, 5xx 에러 모두 JSON 응답에서 메시지 추출
				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					const error = new Error(errorData.message || `HTTP ${response.status}`);
					// title 속성이 있으면 에러 객체에 추가
					if (errorData.title) {
						(error as any).title = errorData.title;
					}
					throw error;
				}
			} catch (error) {
				lastError = error as Error;

				if (attempt < maxRetries) {
					await new Promise((resolve) => setTimeout(resolve, this.#options.retryDelay));
					continue;
				}
			}
		}

		throw lastError || new Error('Request failed');
	}

	async post<T extends (...args: any[]) => any>(
		url: string,
		body?: ApiRequestType<T>,
		options: ApiClientOptions = {}
	): Promise<ApiResponseType<T>> {
		const response = await this.#executeRequest(
			url,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(options.headers || {})
				},
				body: body ? JSON.stringify(body) : undefined
			},
			options.maxRetries
		);

		return await response.json();
	}

	async get<T extends (...args: any[]) => any>(
		url: string,
		params?: Record<string, string | number | boolean>,
		options: ApiClientOptions = {}
	): Promise<ApiResponseType<T>> {
		const searchParams = params
			? new URLSearchParams(
					Object.entries(params).map(([key, value]) => [key, String(value)])
				).toString()
			: '';

		const fullUrl = searchParams ? `${url}?${searchParams}` : url;

		const response = await this.#executeRequest(
			fullUrl,
			{
				method: 'GET',
				headers: options.headers || {}
			},
			options.maxRetries
		);

		return await response.json();
	}

	async put(url: string, body?: unknown, options: ApiClientOptions = {}): Promise<unknown> {
		const response = await this.#executeRequest(
			url,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					...(options.headers || {})
				},
				body: body ? JSON.stringify(body) : undefined
			},
			options.maxRetries
		);

		return await response.json();
	}

	async patch<T extends (...args: any[]) => any>(
		url: string,
		body?: ApiRequestType<T>,
		options: ApiClientOptions = {}
	): Promise<ApiResponseType<T>> {
		const response = await this.#executeRequest(
			url,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					...(options.headers || {})
				},
				body: body ? JSON.stringify(body) : undefined
			},
			options.maxRetries
		);

		return await response.json();
	}

	async delete(url: string, options: ApiClientOptions = {}): Promise<void> {
		await this.#executeRequest(
			url,
			{
				method: 'DELETE',
				headers: options.headers || {}
			},
			options.maxRetries
		);

		// DELETE는 일반적으로 204 No Content를 반환하므로 응답 본문 파싱 안 함
	}
}
