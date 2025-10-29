import { createClient } from '@supabase/supabase-js';

// 테스트 환경에서는 환경 변수에서 직접 가져오기
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_SECRET = process.env.SUPABASE_SECRET || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET, {
	auth: {
		persistSession: false,
		autoRefreshToken: false
	},
	db: {
		schema: 'public'
	}
});
