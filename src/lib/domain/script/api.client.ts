import { ApiClient, type Fetch } from '$lib/framework/client';
import type { POST as PostGenerateScript } from '$api/scripts/generate/+server';
import type { GET as GetScriptByChapter } from '$api/scripts/by-chapter/+server';
import type { GenerateScriptParams, Script } from './types';

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

	/**
	 * 챕터별 최신 스크립트 조회
	 * GET /api/scripts/by-chapter?characterId=xxx&chapterId=xxx&chapterOrder=1
	 * 타입 추론: GET 핸들러의 응답 타입 자동 추론
	 */
	async getByChapter(characterId: string, chapterId: string, chapterOrder?: number) {
		return await this.get<typeof GetScriptByChapter>('/api/scripts/by-chapter', {
			characterId,
			chapterId,
			...(chapterOrder !== undefined && { chapterOrder: chapterOrder.toString() })
		});
	}
}
