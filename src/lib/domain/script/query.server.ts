import { uuidv7 } from 'uuidv7';
import { supabase } from '$lib/supabase/supabase.server';
import type { Script, SaveScriptParams } from './types';

/**
 * 스크립트 저장
 */
export async function saveScript(params: SaveScriptParams): Promise<Script> {
	const scriptId = uuidv7();

	const { data, error } = await supabase
		.from('scripts')
		.insert({
			id: scriptId,
			uid: params.uid,
			character_id: params.characterId,
			chapter_id: params.chapterId ?? null,
			chapter_order: params.chapterOrder ?? null,
			prompt: params.prompt,
			content: params.content,
			model: params.model,
			tokens_used: params.tokensUsed ?? null
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to save script: ${error.message}`);
	}

	return data;
}

/**
 * 챕터별 최신 스크립트 조회
 */
export async function getScriptByChapter(
	uid: string,
	characterId: string,
	chapterId: string,
	chapterOrder?: number
): Promise<Script | null> {
	let query = supabase
		.from('scripts')
		.select('*')
		.eq('uid', uid)
		.eq('character_id', characterId)
		.eq('chapter_id', chapterId);

	if (chapterOrder !== undefined) {
		query = query.eq('chapter_order', chapterOrder);
	}

	const { data, error } = await query
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	if (error) {
		// 404는 정상적인 상황 (스크립트가 없을 수 있음)
		if (error.code === 'PGRST116') {
			return null;
		}
		throw new Error(`Failed to fetch script: ${error.message}`);
	}

	return data;
}

/**
 * 챕터에 속한 스크립트의 chapter_order 목록 조회
 * 챕터 목록에서 스크립트 존재 여부 표시용
 */
export async function getScriptOrdersByChapter(
	uid: string,
	characterId: string,
	chapterId: string
): Promise<number[]> {
	const { data, error } = await supabase
		.from('scripts')
		.select('chapter_order')
		.eq('uid', uid)
		.eq('character_id', characterId)
		.eq('chapter_id', chapterId)
		.not('chapter_order', 'is', null);

	if (error) {
		throw new Error(`Failed to fetch script orders: ${error.message}`);
	}

	// 중복 제거 후 정렬
	const orders = Array.from(new Set(data.map((item) => item.chapter_order as number)));
	return orders.sort((a, b) => a - b);
}

/**
 * 챕터에 속한 모든 스크립트를 한 번에 조회
 * order별 최신 스크립트만 반환 (Map<order, Script>)
 */
export async function getAllScriptsByChapter(
	uid: string,
	characterId: string,
	chapterId: string
): Promise<Map<number, Script>> {
	const { data, error } = await supabase
		.from('scripts')
		.select('*')
		.eq('uid', uid)
		.eq('character_id', characterId)
		.eq('chapter_id', chapterId)
		.not('chapter_order', 'is', null)
		.order('created_at', { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch scripts: ${error.message}`);
	}

	// order별로 가장 최신 스크립트만 Map에 저장
	const scriptsMap = new Map<number, Script>();
	for (const script of data) {
		const order = script.chapter_order as number;
		if (!scriptsMap.has(order)) {
			scriptsMap.set(order, script);
		}
	}

	return scriptsMap;
}

/**
 * 챕터에 속한 모든 스크립트를 한 번에 조회 (공개) - UID 검증 없음
 * order별 최신 스크립트만 반환 (Map<order, Script>)
 */
export async function getAllScriptsByChapterPublic(
	characterId: string,
	chapterId: string
): Promise<Map<number, Script>> {
	const { data, error } = await supabase
		.from('scripts')
		.select('*')
		.eq('character_id', characterId)
		.eq('chapter_id', chapterId)
		.not('chapter_order', 'is', null)
		.order('created_at', { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch scripts: ${error.message}`);
	}

	// order별로 가장 최신 스크립트만 Map에 저장
	const scriptsMap = new Map<number, Script>();
	for (const script of data) {
		const order = script.chapter_order as number;
		if (!scriptsMap.has(order)) {
			scriptsMap.set(order, script);
		}
	}

	return scriptsMap;
}
