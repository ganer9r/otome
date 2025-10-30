/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SECRET } from '$env/static/private';
import { findUser, createUser } from '$lib/domain/user/usecase.server';
import type { AppUser } from '$lib/types';

// 테스트용 Supabase 클라이언트 (service_role)
const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET, {
	auth: {
		persistSession: false,
		autoRefreshToken: false
	}
});

describe('인증 플로우 통합 테스트', () => {
	let testAuthUserIds: string[] = [];
	let testAppUserIds: string[] = [];

	afterEach(async () => {
		// 테스트 데이터 정리 (app_user 먼저 삭제)
		if (testAppUserIds.length > 0) {
			await supabase.from('app_user').delete().in('id', testAppUserIds);
		}

		// Auth 사용자 삭제 (admin API 사용)
		for (const authUserId of testAuthUserIds) {
			try {
				const { error } = await supabase.auth.admin.deleteUser(authUserId);
				if (error) {
					console.error(`Failed to delete auth user ${authUserId}:`, error.message);
				}
			} catch (err) {
				console.error(`Error deleting auth user ${authUserId}:`, err);
			}
		}

		// 배열 초기화
		testAuthUserIds = [];
		testAppUserIds = [];
	});

	describe('회원가입 플로우', () => {
		it('이메일/비밀번호로 가입 → app_user 생성 → 로그인 성공', async () => {
			// Given - 테스트용 회원가입 데이터
			const email = `test-${Date.now()}@example.com`;
			const password = 'testpass123';
			const nickname = '테스트유저';

			// When 1 - Supabase Auth 회원가입 (admin API 사용)
			const { data: authData, error: authError } = await supabase.auth.admin.createUser({
				email,
				password,
				email_confirm: true
			});

			// Then 1 - Auth 가입 성공
			expect(authError).toBeNull();
			expect(authData.user).not.toBeNull();
			expect(authData.user?.email).toBe(email);

			// 테스트 정리를 위해 user id 저장
			if (authData.user) {
				testAuthUserIds.push(authData.user.id);
			}

			// When 2 - app_user 생성
			const appUser = await createUser({
				uid: authData.user!.id,
				email,
				nickname
			});

			// Then 2 - app_user 생성 성공
			expect(appUser).not.toBeNull();
			expect(appUser?.email).toBe(email);
			expect(appUser?.nickname).toBe(nickname);
			expect(appUser?.uid).toBe(authData.user!.id);

			// 테스트 정리를 위해 app_user id 저장
			if (appUser) {
				testAppUserIds.push(appUser.id);
			}

			// When 3 - 로그인 시도
			const { data: signInData, error: signInError } =
				await supabase.auth.signInWithPassword({
					email,
					password
				});

			// Then 3 - 로그인 성공
			expect(signInError).toBeNull();
			expect(signInData.user).not.toBeNull();
			expect(signInData.session).not.toBeNull();
			expect(signInData.user?.id).toBe(authData.user!.id);

			// When 4 - app_user 조회
			const foundUser = await findUser(signInData.user!.id);

			// Then 4 - app_user 조회 성공
			expect(foundUser).not.toBeNull();
			expect(foundUser?.nickname).toBe(nickname);
			expect(foundUser?.email).toBe(email);
		});

		it('중복 이메일로 가입 시 에러 발생', async () => {
			// Given - 이미 가입된 이메일
			const email = `existing-${Date.now()}@example.com`;
			const password = 'testpass123';

			// 첫 번째 가입 (admin API 사용)
			const { data: firstAuth, error: firstError } =
				await supabase.auth.admin.createUser({
					email,
					password,
					email_confirm: true
				});
			expect(firstError).toBeNull();
			if (firstAuth.user) {
				testAuthUserIds.push(firstAuth.user.id);
				const appUser = await createUser({
					uid: firstAuth.user.id,
					email,
					nickname: '첫번째유저'
				});
				if (appUser) {
					testAppUserIds.push(appUser.id);
				}
			}

			// When - 동일한 이메일로 재가입 시도
			const { data: secondAuth, error: secondError } =
				await supabase.auth.admin.createUser({
					email,
					password,
					email_confirm: true
				});

			// Then - 에러 발생 (중복 이메일)
			expect(secondError).not.toBeNull();
		});
	});

	describe('로그인 플로우', () => {
		it('가입된 사용자 → 로그인 → app_user 조회 성공', async () => {
			// Given - 미리 생성된 사용자
			const email = `login-test-${Date.now()}@example.com`;
			const password = 'loginpass123';
			const nickname = '로그인테스트';

			// 사용자 생성 (admin API 사용)
			const { data: authData, error: authError } =
				await supabase.auth.admin.createUser({
					email,
					password,
					email_confirm: true
				});
			expect(authError).toBeNull();
			if (authData.user) {
				testAuthUserIds.push(authData.user.id);
				const appUser = await createUser({
					uid: authData.user.id,
					email,
					nickname
				});
				if (appUser) {
					testAppUserIds.push(appUser.id);
				}
			}

			// When - 로그인
			const { data: signInData, error: signInError } =
				await supabase.auth.signInWithPassword({
					email,
					password
				});

			// Then - 로그인 성공 및 app_user 조회 성공
			expect(signInError).toBeNull();
			expect(signInData.user).not.toBeNull();
			expect(signInData.session).not.toBeNull();

			const foundUser = await findUser(signInData.user!.id);
			expect(foundUser).not.toBeNull();
			expect(foundUser?.nickname).toBe(nickname);
			expect(foundUser?.email).toBe(email);
		});

		it('app_user 없는 계정 → 로그인 → app_user null', async () => {
			// Given - Supabase Auth만 있고 app_user 없음
			const email = `auth-only-${Date.now()}@example.com`;
			const password = 'authonlypass123';

			// Auth 사용자만 생성 (admin API 사용)
			const { data: authData, error: authError } =
				await supabase.auth.admin.createUser({
					email,
					password,
					email_confirm: true
				});
			expect(authError).toBeNull();
			if (authData.user) {
				testAuthUserIds.push(authData.user.id);
			}

			// When - 로그인
			const { data: signInData, error: signInError } =
				await supabase.auth.signInWithPassword({
					email,
					password
				});

			// Then - 로그인 성공하지만 app_user는 null
			expect(signInError).toBeNull();
			expect(signInData.user).not.toBeNull();

			const foundUser = await findUser(signInData.user!.id);
			expect(foundUser).toBeNull();
		});
	});

	describe('인증 실패 케이스', () => {
		it('잘못된 비밀번호 → 로그인 실패', async () => {
			// Given - 가입된 사용자
			const email = `wrongpw-${Date.now()}@example.com`;
			const correctPassword = 'correctpass123';
			const wrongPassword = 'wrongpass123';

			const { data: authData, error: authError } =
				await supabase.auth.admin.createUser({
					email,
					password: correctPassword,
					email_confirm: true
				});
			expect(authError).toBeNull();
			if (authData.user) {
				testAuthUserIds.push(authData.user.id);
				const appUser = await createUser({
					uid: authData.user.id,
					email,
					nickname: '비밀번호테스트'
				});
				if (appUser) {
					testAppUserIds.push(appUser.id);
				}
			}

			// When - 잘못된 비밀번호로 로그인
			const { data: signInData, error: signInError } =
				await supabase.auth.signInWithPassword({
					email,
					password: wrongPassword
				});

			// Then - 에러 발생
			expect(signInError).not.toBeNull();
			expect(signInData.user).toBeNull();
			expect(signInData.session).toBeNull();
		});

		it('존재하지 않는 이메일 → 로그인 실패', async () => {
			// Given - 존재하지 않는 이메일
			const email = `nonexistent-${Date.now()}@example.com`;
			const password = 'anypass123';

			// When - 로그인 시도
			const { data: signInData, error: signInError } =
				await supabase.auth.signInWithPassword({
					email,
					password
				});

			// Then - 에러 발생
			expect(signInError).not.toBeNull();
			expect(signInData.user).toBeNull();
			expect(signInData.session).toBeNull();
		});

		// NOTE: 비밀번호 최소 길이 검증은 클라이언트 측 signUp에서만 동작
		// admin API는 모든 제약을 우회할 수 있어서 테스트 불가능
		it.skip('비밀번호 최소 길이 미달 → 가입 실패', async () => {
			// 이 테스트는 실제 클라이언트 signUp API에서만 동작합니다
			// admin API는 비밀번호 길이 제한을 우회할 수 있습니다
		});
	});

	describe('로그아웃 플로우', () => {
		it('로그인 → 로그아웃 → 세션 만료', async () => {
			// Given - 가입 및 로그인된 사용자
			const email = `logout-${Date.now()}@example.com`;
			const password = 'logoutpass123';

			const { data: authData, error: authError } =
				await supabase.auth.admin.createUser({
					email,
					password,
					email_confirm: true
				});
			expect(authError).toBeNull();
			if (authData.user) {
				testAuthUserIds.push(authData.user.id);
				const appUser = await createUser({
					uid: authData.user.id,
					email,
					nickname: '로그아웃테스트'
				});
				if (appUser) {
					testAppUserIds.push(appUser.id);
				}
			}

			// 로그인
			const { data: signInData, error: signInError } =
				await supabase.auth.signInWithPassword({
					email,
					password
				});
			expect(signInError).toBeNull();
			expect(signInData.session).not.toBeNull();

			// When - 로그아웃
			const { error: signOutError } = await supabase.auth.signOut();

			// Then - 로그아웃 성공
			expect(signOutError).toBeNull();

			// 세션 확인
			const {
				data: { session }
			} = await supabase.auth.getSession();
			expect(session).toBeNull();
		});
	});
});
