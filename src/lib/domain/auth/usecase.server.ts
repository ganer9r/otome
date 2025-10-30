import type { SupabaseClient } from '@supabase/supabase-js';
import { findUser, createUser } from '$lib/domain/user/usecase.server';
import type { Database } from '$lib/supabase/schema.gen';

/**
 * 로그인
 */
export async function login(params: {
	email: string;
	password: string;
	supabase: SupabaseClient<Database>;
}) {
	const { email, password, supabase } = params;

	// Supabase Auth 로그인
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error || !data.user) {
		return {
			success: false,
			message: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
		};
	}

	// app_user 존재 확인
	const user = await findUser(data.user.id);

	if (user) {
		return {
			success: true,
			redirectTo: '/app/characters'
		};
	} else {
		// Supabase Auth에는 있지만 app_user가 없으면 회원가입 페이지로
		return {
			success: true,
			redirectTo: '/auth/signup'
		};
	}
}

/**
 * 회원가입
 */
export async function signup(params: {
	email: string;
	password: string;
	nickname: string;
	supabase: SupabaseClient<Database>;
}) {
	const { email, password, nickname, supabase } = params;

	// 1. Supabase Auth에 가입
	const { data, error } = await supabase.auth.signUp({
		email,
		password
	});

	if (error || !data.user) {
		return {
			success: false,
			message: '회원가입에 실패했습니다. 다시 시도해주세요.'
		};
	}

	// 2. app_user 테이블에 레코드 생성
	const user = await createUser({
		uid: data.user.id,
		email,
		nickname
	});

	if (!user) {
		return {
			success: false,
			message: '사용자 정보 저장에 실패했습니다.'
		};
	}

	// 3. 성공 응답
	return {
		success: true,
		redirectTo: '/app/characters'
	};
}
