import type { Database } from '$lib/supabase/schema.gen';

/**
 * Supabase generated types
 */
export type Script = Database['public']['Tables']['scripts']['Row'];
export type InsertScript = Database['public']['Tables']['scripts']['Insert'];

/**
 * DTO for generating script (API request)
 */
export interface GenerateScriptParams {
	characterId: string;
	prompt: string;
	chapterId?: string;
	chapterOrder?: number;
	model?: 'gemini' | 'deepseek'; // 사용할 모델 선택
}

/**
 * DTO for saving script to DB
 */
export interface SaveScriptParams {
	uid: string;
	characterId: string;
	chapterId: string | null;
	chapterOrder: number | null;
	prompt: string;
	content: string;
	model: string;
	tokensUsed: number | null;
}
