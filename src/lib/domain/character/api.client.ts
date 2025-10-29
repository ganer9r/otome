import { ApiClient, type Fetch } from '$lib/framework/client';
import type { POST as PostCharacter } from '$api/characters/+server';
import type { GET as GetCharacters } from '$api/characters/+server';
import type { GET as GetCharacter } from '$api/characters/[id]/+server';
import type { PATCH as PatchCharacter } from '$api/characters/[id]/+server';
import type { CreateCharacterDto, UpdateCharacterDto } from './types';

/**
 * Character API Client
 * ApiClient를 상속하여 캐릭터 API 호출 구현
 */
export class CharacterApi extends ApiClient {
	constructor(fetch: Fetch) {
		super(fetch);
	}

	/**
	 * 캐릭터 생성
	 * 타입 추론: POST 핸들러의 응답 타입 자동 추론
	 */
	async createCharacter(dto: CreateCharacterDto) {
		return await this.post<typeof PostCharacter>('/api/characters', dto);
	}

	/**
	 * 캐릭터 목록 조회
	 * 타입 추론: GET 핸들러의 응답 타입 자동 추론
	 */
	async getCharacters() {
		return await this.get<typeof GetCharacters>('/api/characters');
	}

	/**
	 * 단일 캐릭터 조회
	 * 타입 추론: GET 핸들러의 응답 타입 자동 추론
	 */
	async getCharacter(id: string) {
		return await this.get<typeof GetCharacter>(`/api/characters/${id}`);
	}

	/**
	 * 캐릭터 수정
	 * 타입 추론: PATCH 핸들러의 응답 타입 자동 추론
	 */
	async updateCharacter(id: string, dto: UpdateCharacterDto) {
		return await this.patch<typeof PatchCharacter>(`/api/characters/${id}`, dto);
	}

	/**
	 * 캐릭터 삭제
	 */
	async deleteCharacter(id: string) {
		return await this.delete(`/api/characters/${id}`);
	}
}
