/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { randomUUID } from 'crypto';
import { supabase } from '$lib/supabase/supabase.server';
import type { CreateCharacterDto, UpdateCharacterDto } from './types';
import {
	addCharacter,
	getCharacters,
	getCharacter,
	updateCharacter,
	deleteCharacter
} from './usecase.server';

describe('Character usecase TDD 테스트', () => {
	let testUid: string;
	let testCharacterIds: string[] = [];

	beforeEach(async () => {
		// 테스트용 UUID 생성
		testUid = randomUUID();
		testCharacterIds = [];
	});

	afterEach(async () => {
		// 테스트 데이터 정리
		if (testCharacterIds.length > 0) {
			await supabase.from('characters').delete().in('id', testCharacterIds);
		}
	});

	describe('addCharacter(uid, dto)', () => {
		it('UUID v7 생성으로 캐릭터가 시간순 정렬 가능해야 한다', async () => {
			// Given - 2개의 캐릭터 데이터
			const dto1: CreateCharacterDto = {
				name: '캐릭터1',
				info: '첫 번째 캐릭터'
			};
			const dto2: CreateCharacterDto = {
				name: '캐릭터2',
				info: '두 번째 캐릭터'
			};

			// When - 순차적으로 캐릭터 생성
			const char1 = await addCharacter(testUid, dto1);
			testCharacterIds.push(char1.id);

			// 약간의 시간 지연 (UUID v7의 시간 구분을 위해)
			await new Promise((resolve) => setTimeout(resolve, 10));

			const char2 = await addCharacter(testUid, dto2);
			testCharacterIds.push(char2.id);

			// Then - UUID v7은 시간순 정렬 가능
			expect(char1.id < char2.id).toBe(true);
		});

		it('캐릭터 생성이 성공해야 한다', async () => {
			// Given - 캐릭터 데이터
			const dto: CreateCharacterDto = {
				name: '테스트 캐릭터',
				info: '캐릭터 정보',
				settings: '캐릭터 설정',
				introduction: '캐릭터 도입부',
				options: {
					chapter_guidelines: '챕터 가이드라인'
				}
			};

			// When - 캐릭터 생성
			const character = await addCharacter(testUid, dto);
			testCharacterIds.push(character.id);

			// Then - 캐릭터 생성 확인
			expect(character.id).toBeDefined();
			expect(character.uid).toBe(testUid);
			expect(character.name).toBe('테스트 캐릭터');
			expect(character.info).toBe('캐릭터 정보');
			expect(character.settings).toBe('캐릭터 설정');
			expect(character.introduction).toBe('캐릭터 도입부');
			expect(character.created_at).toBeDefined();
			expect(character.updated_at).toBeDefined();
		});

		it('options jsonb가 올바르게 저장되어야 한다', async () => {
			// Given - options 포함 캐릭터 데이터
			const dto: CreateCharacterDto = {
				name: '캐릭터',
				options: {
					chapter_guidelines: '가이드라인 내용'
				}
			};

			// When - 캐릭터 생성
			const character = await addCharacter(testUid, dto);
			testCharacterIds.push(character.id);

			// Then - options 저장 확인
			expect(character.options).toBeDefined();
			expect((character.options as any).chapter_guidelines).toBe('가이드라인 내용');
		});

		it('name이 필수값이므로 없으면 에러가 발생해야 한다', async () => {
			// Given - name이 없는 데이터
			const dto = {
				info: '정보만 있음'
			} as CreateCharacterDto;

			// When & Then - 에러 발생
			await expect(addCharacter(testUid, dto)).rejects.toThrow();
		});
	});

	describe('getCharacters(uid)', () => {
		it('사용자별 캐릭터 목록을 조회해야 한다', async () => {
			// Given - 2개의 캐릭터 생성
			const dto1: CreateCharacterDto = { name: '캐릭터1' };
			const dto2: CreateCharacterDto = { name: '캐릭터2' };

			const char1 = await addCharacter(testUid, dto1);
			testCharacterIds.push(char1.id);

			const char2 = await addCharacter(testUid, dto2);
			testCharacterIds.push(char2.id);

			// When - 캐릭터 목록 조회
			const characters = await getCharacters(testUid);

			// Then - 2개의 캐릭터가 조회됨
			expect(characters.length).toBe(2);
			expect(characters.find((c) => c.id === char1.id)).toBeDefined();
			expect(characters.find((c) => c.id === char2.id)).toBeDefined();
		});

		it('생성일자 내림차순으로 정렬되어야 한다', async () => {
			// Given - 3개의 캐릭터 순차 생성
			const char1 = await addCharacter(testUid, { name: '첫번째' });
			testCharacterIds.push(char1.id);

			await new Promise((resolve) => setTimeout(resolve, 10));

			const char2 = await addCharacter(testUid, { name: '두번째' });
			testCharacterIds.push(char2.id);

			await new Promise((resolve) => setTimeout(resolve, 10));

			const char3 = await addCharacter(testUid, { name: '세번째' });
			testCharacterIds.push(char3.id);

			// When - 캐릭터 목록 조회
			const characters = await getCharacters(testUid);

			// Then - 최신순 정렬 확인
			expect(characters[0].id).toBe(char3.id);
			expect(characters[1].id).toBe(char2.id);
			expect(characters[2].id).toBe(char1.id);
		});

		it('데이터가 없을 때 빈 배열을 반환해야 한다', async () => {
			// Given - 캐릭터가 없는 상태

			// When - 캐릭터 목록 조회
			const characters = await getCharacters(testUid);

			// Then - 빈 배열 반환
			expect(characters).toEqual([]);
		});

		it('다른 사용자의 캐릭터는 조회되지 않아야 한다', async () => {
			// Given - 다른 사용자의 캐릭터 생성
			const otherUid = randomUUID();
			const otherChar = await addCharacter(otherUid, { name: '다른 사용자 캐릭터' });
			testCharacterIds.push(otherChar.id);

			// When - 현재 사용자의 캐릭터 목록 조회
			const characters = await getCharacters(testUid);

			// Then - 다른 사용자 캐릭터는 조회되지 않음
			expect(characters).toEqual([]);
		});
	});

	describe('getCharacter(supabase, uid, id)', () => {
		it('ID로 단일 캐릭터를 조회해야 한다', async () => {
			// Given - 캐릭터 생성
			const dto: CreateCharacterDto = {
				name: '단일 캐릭터',
				info: '캐릭터 정보'
			};
			const created = await addCharacter(testUid, dto);
			testCharacterIds.push(created.id);

			// When - ID로 캐릭터 조회
			const character = await getCharacter(testUid, created.id);

			// Then - 캐릭터 조회 확인
			expect(character).not.toBeNull();
			expect(character?.id).toBe(created.id);
			expect(character?.name).toBe('단일 캐릭터');
			expect(character?.info).toBe('캐릭터 정보');
		});

		it('존재하지 않는 ID는 null을 반환해야 한다', async () => {
			// Given - 존재하지 않는 UUID
			const nonExistentId = randomUUID();

			// When - 존재하지 않는 캐릭터 조회
			const character = await getCharacter(testUid, nonExistentId);

			// Then - null 반환
			expect(character).toBeNull();
		});

		it('타인의 캐릭터를 조회하려 하면 null을 반환해야 한다', async () => {
			// Given - 다른 사용자의 캐릭터
			const otherUid = randomUUID();
			const otherChar = await addCharacter(otherUid, { name: '타인 캐릭터' });
			testCharacterIds.push(otherChar.id);

			// When - 타인의 캐릭터 조회 시도
			const character = await getCharacter(testUid, otherChar.id);

			// Then - null 반환 (uid 검증)
			expect(character).toBeNull();
		});
	});

	describe('updateCharacter(supabase, uid, id, dto)', () => {
		it('부분 업데이트가 가능해야 한다', async () => {
			// Given - 캐릭터 생성
			const created = await addCharacter(testUid, {
				name: '원본 이름',
				info: '원본 정보',
				settings: '원본 설정'
			});
			testCharacterIds.push(created.id);

			// When - name만 업데이트
			const updateDto: UpdateCharacterDto = {
				name: '변경된 이름'
			};
			const updated = await updateCharacter(testUid, created.id, updateDto);

			// Then - name만 변경, 나머지는 유지
			expect(updated.name).toBe('변경된 이름');
			expect(updated.info).toBe('원본 정보');
			expect(updated.settings).toBe('원본 설정');
		});

		it('options jsonb를 업데이트할 수 있어야 한다', async () => {
			// Given - 캐릭터 생성
			const created = await addCharacter(testUid, {
				name: '캐릭터',
				options: { chapter_guidelines: '원본 가이드라인' }
			});
			testCharacterIds.push(created.id);

			// When - options 업데이트
			const updateDto: UpdateCharacterDto = {
				options: { chapter_guidelines: '변경된 가이드라인' }
			};
			const updated = await updateCharacter(testUid, created.id, updateDto);

			// Then - options 변경 확인
			expect((updated.options as any).chapter_guidelines).toBe('변경된 가이드라인');
		});

		it('updated_at이 자동으로 업데이트되어야 한다', async () => {
			// Given - 캐릭터 생성
			const created = await addCharacter(testUid, { name: '캐릭터' });
			testCharacterIds.push(created.id);
			const originalUpdatedAt = created.updated_at;

			// 시간 경과 대기
			await new Promise((resolve) => setTimeout(resolve, 100));

			// When - 캐릭터 업데이트
			const updated = await updateCharacter(testUid, created.id, {
				name: '변경된 이름'
			});

			// Then - updated_at이 변경됨
			expect(new Date(updated.updated_at).getTime()).toBeGreaterThan(
				new Date(originalUpdatedAt).getTime()
			);
		});

		it('타인의 캐릭터는 수정할 수 없어야 한다', async () => {
			// Given - 다른 사용자의 캐릭터
			const otherUid = randomUUID();
			const otherChar = await addCharacter(otherUid, { name: '타인 캐릭터' });
			testCharacterIds.push(otherChar.id);

			// When & Then - 에러 발생
			await expect(
				updateCharacter(testUid, otherChar.id, { name: '변경 시도' })
			).rejects.toThrow();
		});
	});

	describe('deleteCharacter(supabase, uid, id)', () => {
		it('캐릭터 삭제가 성공해야 한다', async () => {
			// Given - 캐릭터 생성
			const created = await addCharacter(testUid, { name: '삭제할 캐릭터' });
			testCharacterIds.push(created.id);

			// When - 캐릭터 삭제
			await deleteCharacter(testUid, created.id);

			// Then - 삭제 확인
			const character = await getCharacter(testUid, created.id);
			expect(character).toBeNull();

			// 정리 목록에서 제거 (이미 삭제됨)
			testCharacterIds = testCharacterIds.filter((id) => id !== created.id);
		});

		it('타인의 캐릭터는 삭제할 수 없어야 한다', async () => {
			// Given - 다른 사용자의 캐릭터
			const otherUid = randomUUID();
			const otherChar = await addCharacter(otherUid, { name: '타인 캐릭터' });
			testCharacterIds.push(otherChar.id);

			// When & Then - 에러 발생
			await expect(deleteCharacter(testUid, otherChar.id)).rejects.toThrow();
		});

		it('존재하지 않는 캐릭터 삭제 시 에러가 발생해야 한다', async () => {
			// Given - 존재하지 않는 ID
			const nonExistentId = randomUUID();

			// When & Then - 에러 발생
			await expect(deleteCharacter(testUid, nonExistentId)).rejects.toThrow();
		});
	});

	describe('통합 시나리오 테스트', () => {
		it('캐릭터 생성 → 조회 → 수정 → 삭제 전체 흐름이 정상 동작해야 한다', async () => {
			// Given - 초기 상태

			// When - Step 1: 캐릭터 생성
			const created = await addCharacter(testUid, {
				name: '시나리오 캐릭터',
				info: '초기 정보'
			});
			testCharacterIds.push(created.id);

			// Step 2: 캐릭터 조회
			const fetched = await getCharacter(testUid, created.id);
			expect(fetched).not.toBeNull();
			expect(fetched?.name).toBe('시나리오 캐릭터');

			// Step 3: 캐릭터 수정
			const updated = await updateCharacter(testUid, created.id, {
				info: '수정된 정보'
			});
			expect(updated.info).toBe('수정된 정보');

			// Step 4: 캐릭터 삭제
			await deleteCharacter(testUid, created.id);
			const deleted = await getCharacter(testUid, created.id);
			expect(deleted).toBeNull();

			// Then - 전체 흐름 검증 완료
			testCharacterIds = testCharacterIds.filter((id) => id !== created.id);
		});

		it('여러 캐릭터를 생성하고 목록을 조회할 수 있어야 한다', async () => {
			// Given - 여러 캐릭터 생성
			const characters: Character[] = [];

			for (let i = 1; i <= 5; i++) {
				const char = await addCharacter(testUid, { name: `캐릭터${i}` });
				testCharacterIds.push(char.id);
				characters.push(char);
				await new Promise((resolve) => setTimeout(resolve, 10));
			}

			// When - 캐릭터 목록 조회
			const list = await getCharacters(testUid);

			// Then - 5개 캐릭터 모두 조회됨
			expect(list.length).toBe(5);
			expect(list[0].name).toBe('캐릭터5'); // 최신순
			expect(list[4].name).toBe('캐릭터1');
		});
	});
});
