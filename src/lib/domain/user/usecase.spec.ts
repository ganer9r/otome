/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { randomUUID } from 'crypto';
import { supabase } from '$lib/supabase/supabase.server';
import type { AppUser } from '$lib/types';
import { findUser, createUser } from './usecase.server';

describe('User usecase TDD 테스트', () => {
	let testUid: string;
	let createdUserIds: string[] = [];

	beforeEach(async () => {
		// 테스트용 UUID 생성
		testUid = randomUUID();
		createdUserIds = [];
	});

	afterEach(async () => {
		// 테스트 데이터 정리
		if (createdUserIds.length > 0) {
			await supabase.from('app_user').delete().in('id', createdUserIds);
		}
	});

	describe('findUser(uid)', () => {
		it('존재하는 사용자를 조회할 수 있어야 한다', async () => {
			// Given - 사용자 생성
			const userData = {
				uid: testUid,
				email: 'test@example.com',
				nickname: '테스트유저'
			};
			const createdUser = await createUser(userData);
			if (createdUser) createdUserIds.push(createdUser.id);

			// When - uid로 사용자 조회
			const foundUser = await findUser(testUid);

			// Then - 사용자가 조회되어야 함
			expect(foundUser).not.toBeNull();
			expect(foundUser?.uid).toBe(testUid);
			expect(foundUser?.email).toBe('test@example.com');
			expect(foundUser?.nickname).toBe('테스트유저');
		});

		it('존재하지 않는 uid는 null을 반환해야 한다', async () => {
			// Given - 존재하지 않는 uid
			const nonExistentUid = randomUUID();

			// When - 조회 시도
			const foundUser = await findUser(nonExistentUid);

			// Then - null 반환
			expect(foundUser).toBeNull();
		});

		it('undefined uid는 null을 반환해야 한다', async () => {
			// When - undefined uid로 조회
			const foundUser = await findUser(undefined);

			// Then - null 반환
			expect(foundUser).toBeNull();
		});
	});

	describe('createUser(userData)', () => {
		it('사용자를 생성할 수 있어야 한다', async () => {
			// Given - 사용자 데이터
			const userData = {
				uid: testUid,
				email: 'newuser@example.com',
				nickname: '새유저',
				profile_img: 'https://example.com/avatar.png'
			};

			// When - 사용자 생성
			const createdUser = await createUser(userData);
			if (createdUser) createdUserIds.push(createdUser.id);

			// Then - 사용자가 생성되어야 함
			expect(createdUser).not.toBeNull();
			expect(createdUser?.uid).toBe(testUid);
			expect(createdUser?.email).toBe('newuser@example.com');
			expect(createdUser?.nickname).toBe('새유저');
			expect(createdUser?.profile_img).toBe('https://example.com/avatar.png');
		});

		it('nickname과 profile_img는 선택사항이어야 한다', async () => {
			// Given - 필수값만 있는 사용자 데이터
			const userData = {
				uid: testUid,
				email: 'minimal@example.com'
			};

			// When - 사용자 생성
			const createdUser = await createUser(userData);
			if (createdUser) createdUserIds.push(createdUser.id);

			// Then - 사용자가 생성되어야 함
			expect(createdUser).not.toBeNull();
			expect(createdUser?.uid).toBe(testUid);
			expect(createdUser?.email).toBe('minimal@example.com');
			expect(createdUser?.nickname).toBeNull();
			expect(createdUser?.profile_img).toBeNull();
		});

		it('중복된 uid로 생성 시 null을 반환해야 한다', async () => {
			// Given - 이미 생성된 사용자
			const userData = {
				uid: testUid,
				email: 'first@example.com'
			};
			const firstUser = await createUser(userData);
			if (firstUser) createdUserIds.push(firstUser.id);

			// When - 동일한 uid로 다시 생성 시도
			const duplicateUser = await createUser({
				uid: testUid,
				email: 'second@example.com'
			});

			// Then - null 반환 (중복 에러)
			expect(duplicateUser).toBeNull();
		});

		it('created_at과 updated_at이 자동으로 설정되어야 한다', async () => {
			// Given - 사용자 데이터
			const userData = {
				uid: testUid,
				email: 'timestamp@example.com'
			};

			// When - 사용자 생성
			const createdUser = await createUser(userData);
			if (createdUser) createdUserIds.push(createdUser.id);

			// Then - 타임스탬프가 존재해야 함
			expect(createdUser).not.toBeNull();
			expect(createdUser?.created_at).toBeDefined();
			expect(createdUser?.updated_at).toBeDefined();
			expect(new Date(createdUser!.created_at).getTime()).toBeGreaterThan(0);
		});
	});
});
