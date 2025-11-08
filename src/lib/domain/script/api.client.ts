import { ApiClient, type Fetch } from '$lib/framework/client';
import type { POST as PostGenerateScript } from '$api/scripts/generate/+server';
import type { GenerateScriptParams } from './types';

/**
 * Script API Client
 * ApiClient를 상속하여 스크립트 API 호출 구현
 */
export class ScriptApi extends ApiClient {
	constructor(fetch: Fetch) {
		super(fetch);
	}

	/**
	 * 스크립트 생성
	 * POST /api/scripts/generate
	 * 타입 추론: POST 핸들러의 응답 타입 자동 추론
	 */
	async generateScript(params: GenerateScriptParams) {
		return await this.post<typeof PostGenerateScript>('/api/scripts/generate', params);
	}
}
