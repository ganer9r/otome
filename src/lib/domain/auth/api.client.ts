import { ApiClient, type Fetch } from '$lib/framework/client';
import type { POST as PostLogin } from '$api/auth/login/+server';
import type { POST as PostSignup } from '$api/auth/signup/+server';

export class AuthApi extends ApiClient {
	constructor(fetch: Fetch) {
		super(fetch);
	}

	/**
	 * 로그인
	 * @param email 이메일
	 * @param password 비밀번호
	 */
	async login(email: string, password: string) {
		return await this.post<typeof PostLogin>('/api/auth/login', { email, password });
	}

	/**
	 * 회원가입
	 * @param email 이메일
	 * @param password 비밀번호
	 * @param nickname 닉네임
	 */
	async signup(email: string, password: string, nickname: string) {
		return await this.post<typeof PostSignup>('/api/auth/signup', { email, password, nickname });
	}
}
