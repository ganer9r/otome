import type { Database } from '$lib/supabase/schema.gen';

// Supabase generated types
export type Script = Database['public']['Tables']['scripts']['Row'];
export type InsertScript = Database['public']['Tables']['scripts']['Insert'];

// DTO for generating script
export interface GenerateScriptParams {
	characterId: string;
	prompt: string;
}

// DTO for saving script
export interface SaveScriptParams {
	uid: string;
	characterId: string;
	prompt: string;
	content: string;
	model: string;
	tokensUsed?: number;
}

// LLM generation result
export interface ScriptGenerationResult {
	content: string;
	model: string;
	tokensUsed?: number;
}
