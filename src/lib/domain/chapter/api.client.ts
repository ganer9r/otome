import { ApiClient, type Fetch } from '$lib/framework/client';
import type { POST as PostGenerateChapters } from '$api/chapters/generate/+server';
import type { GenerateChaptersParams } from './types';

/**
 * Chapter API Client
 * ApiClient를 상속하여 챕터 API 호출 구현
 */
export class ChapterApi extends ApiClient {
	constructor(fetch: Fetch) {
		super(fetch);
	}

	/**
	 * 챕터 생성
	 * POST /api/chapters/generate
	 * 타입 추론: POST 핸들러의 응답 타입 자동 추론
	 */
	async generateChapters(params: GenerateChaptersParams) {
		return await this.post<typeof PostGenerateChapters>('/api/chapters/generate', params);
	}
}
