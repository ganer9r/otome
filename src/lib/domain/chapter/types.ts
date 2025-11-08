import type { Database } from '$lib/supabase/schema.gen';

// Supabase generated types
export type Chapter = Database['public']['Tables']['chapters']['Row'];
export type InsertChapter = Database['public']['Tables']['chapters']['Insert'];

// Single chapter item in the data array
export interface ChapterItem {
	order: number; // 1-30
	type: 'meet' | 'chat'; // 만남/채팅 구분
	title: string;
	description: string;
	content: string;
}

// DTO for generating chapters
export interface GenerateChaptersParams {
	characterId: string;
	prompt: string;
}

// DTO for saving chapters
export interface SaveChaptersParams {
	uid: string;
	characterId: string;
	prompt: string;
	data: ChapterItem[];
	model: string;
	tokensUsed?: number;
}

// LLM generation result
export interface ChaptersGenerationResult {
	data: ChapterItem[];
	model: string;
	tokensUsed?: number;
}
