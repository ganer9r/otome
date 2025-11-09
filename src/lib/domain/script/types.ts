import type { Database } from '$lib/supabase/schema.gen';

// Supabase generated types
export type Script = Database['public']['Tables']['scripts']['Row'];
export type InsertScript = Database['public']['Tables']['scripts']['Insert'];

// DTO for generating script
export interface GenerateScriptParams {
	characterId: string;
	prompt: string;
	chapterId?: string;
	chapterOrder?: number;
}

// DTO for saving script
export interface SaveScriptParams {
	uid: string;
	characterId: string;
	prompt: string;
	content: string;
	model: string;
	tokensUsed?: number;
	chapterId?: string;
	chapterOrder?: number;
}

// LLM generation result
export interface ScriptGenerationResult {
	content: string;
	model: string;
	tokensUsed?: number;
}
