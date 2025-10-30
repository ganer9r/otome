import type { Database } from '$lib/supabase/schema.gen';

// Supabase generated types (reuse from schema.gen.ts)
export type Character = Database['public']['Tables']['characters']['Row'];
export type InsertCharacter = Database['public']['Tables']['characters']['Insert'];
export type UpdateCharacter = Database['public']['Tables']['characters']['Update'];

// Character options type for JSONB field
export interface CharacterOptions {
	chapter_guidelines?: string;
	player_info?: string;
	// Add more options here as needed
}

// DTO for creating a character
export interface CreateCharacterDto {
	name: string;
	info?: string;
	settings?: string;
	introduction?: string;
	options?: CharacterOptions;
}

// DTO for updating a character (all fields optional)
export type UpdateCharacterDto = Partial<CreateCharacterDto>;
