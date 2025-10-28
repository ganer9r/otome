import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Supabase Connection', () => {
	let supabase: ReturnType<typeof createClient>;

	beforeAll(() => {
		console.time('Supabase Client Creation');
		// 클라이언트는 한 번만 생성
		supabase = createClient(
			process.env.PUBLIC_SUPABASE_URL!,
			process.env.PUBLIC_SUPABASE_ANON_KEY!,
			{
				auth: {
					persistSession: false, // 세션 저장 비활성화
					autoRefreshToken: false, // 자동 토큰 갱신 비활성화
					detectSessionInUrl: false // URL 세션 감지 비활성화
				}
			}
		);
		console.timeEnd('Supabase Client Creation');
	});

	it('should connect to local Supabase', async () => {
		// 환경 변수 확인
		console.log('Environment:', {
			env: process.env.PUBLIC_ENV,
			url: process.env.PUBLIC_SUPABASE_URL,
			hasAnonKey: !!process.env.PUBLIC_SUPABASE_ANON_KEY
		});

		expect(process.env.PUBLIC_ENV).toBe('test');
		expect(process.env.PUBLIC_SUPABASE_URL).toBe('http://localhost:54521');
		expect(process.env.PUBLIC_SUPABASE_ANON_KEY).toBeDefined();

		// 연결 테스트 - auth.getSession으로 확인
		console.time('Auth Session Check');
		const { data, error } = await supabase.auth.getSession();
		console.timeEnd('Auth Session Check');

		// 세션이 없어도 에러가 없으면 연결 성공
		expect(error).toBeNull();
		console.log('Supabase connection successful!');
	});

	it('should query database', async () => {
		// 실제 DB 쿼리 테스트 - auth.users 시스템 테이블 조회
		console.time('Database Query');
		const { data, error } = await supabase
			.from('auth.users')
			.select('*', { count: 'exact', head: true });
		console.timeEnd('Database Query');

		// DB가 실행 중이면 에러 없음 (데이터 없어도 OK)
		expect(error).toBeNull();
		console.log('Database query successful! DB is running.');
	});
});
