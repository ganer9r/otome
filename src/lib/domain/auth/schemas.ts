import { z } from 'zod';

// 로그인 스키마
export const loginSchema = z.object({
	email: z.string().email('유효한 이메일을 입력해주세요.'),
	password: z.string().min(1, '비밀번호를 입력해주세요.')
});

export type LoginSchema = typeof loginSchema;

// 회원가입 스키마
export const signupSchema = z.object({
	email: z.string().email('유효한 이메일을 입력해주세요.'),
	password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
	nickname: z.string().min(1, '닉네임을 입력해주세요.')
});

export type SignupSchema = typeof signupSchema;
