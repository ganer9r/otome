import type { CreateCharacterDto, UpdateCharacterDto } from './types';

/**
 * Character API Client
 * 클라이언트 사이드에서 캐릭터 API를 호출하기 위한 클래스
 *
 * 타입 추론 패턴 사용: 반환 타입을 명시하지 않고 TypeScript가 자동으로 추론
 */
export class CharacterApiClient {
	constructor(private fetch: typeof fetch) {}

	/**
	 * 캐릭터 생성
	 * 반환 타입이 자동으로 추론됨
	 */
	async createCharacter(dto: CreateCharacterDto) {
		const res = await this.fetch('/api/characters', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dto)
		});

		if (!res.ok) {
			throw new Error('Failed to create character');
		}

		return res.json();
	}

	/**
	 * 캐릭터 목록 조회
	 * 반환 타입이 자동으로 추론됨
	 */
	async getCharacters() {
		const res = await this.fetch('/api/characters');

		if (!res.ok) {
			throw new Error('Failed to fetch characters');
		}

		return res.json();
	}

	/**
	 * 단일 캐릭터 조회
	 * 반환 타입이 자동으로 추론됨
	 */
	async getCharacter(id: string) {
		const res = await this.fetch(`/api/characters/${id}`);

		if (!res.ok) {
			if (res.status === 404) {
				throw new Error('Character not found');
			}
			throw new Error('Failed to fetch character');
		}

		return res.json();
	}

	/**
	 * 캐릭터 수정
	 * 반환 타입이 자동으로 추론됨
	 */
	async updateCharacter(id: string, dto: UpdateCharacterDto) {
		const res = await this.fetch(`/api/characters/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dto)
		});

		if (!res.ok) {
			throw new Error('Failed to update character');
		}

		return res.json();
	}

	/**
	 * 캐릭터 삭제
	 * 반환 타입: Promise<void>로 추론됨
	 */
	async deleteCharacter(id: string) {
		const res = await this.fetch(`/api/characters/${id}`, {
			method: 'DELETE'
		});

		if (!res.ok) {
			throw new Error('Failed to delete character');
		}
	}
}
