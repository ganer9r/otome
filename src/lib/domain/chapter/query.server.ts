import { uuidv7 } from 'uuidv7';
import { supabase } from '$lib/supabase/supabase.server';
import type { Chapter, ChapterItem, SaveChaptersParams } from './types';

/**
 * 챕터 직접 저장 (이미 생성된 챕터)
 */
export async function saveChapters(params: SaveChaptersParams): Promise<Chapter> {
	const chapterId = uuidv7();

	const { data, error } = await supabase
		.from('chapters')
		.insert({
			id: chapterId,
			uid: params.uid,
			character_id: params.characterId,
			prompt: params.prompt,
			data: params.data,
			model: params.model
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to save chapters: ${error.message}`);
	}

	return data;
}

/**
 * 캐릭터의 활성 챕터 조회 (deleted_at IS NULL)
 */
export async function getActiveChapters(
	uid: string,
	characterId: string
): Promise<Chapter | null> {
	const { data, error } = await supabase
		.from('chapters')
		.select('*')
		.eq('uid', uid)
		.eq('character_id', characterId)
		.is('deleted_at', null)
		.single();

	if (error) {
		if (error.code === 'PGRST116') {
			// No rows found
			return null;
		}
		throw new Error(`Failed to get chapters: ${error.message}`);
	}

	return data;
}

export async function softDeleteActiveChapters(characterId: string): Promise<void> {
	const now = new Date().toISOString();

	const { error } = await supabase
		.from('chapters')
		.update({ deleted_at: now })
		.eq('character_id', characterId)
		.is('deleted_at', null);

	if (error) {
		throw new Error(`Failed to soft delete chapters: ${error.message}`);
	}
}
