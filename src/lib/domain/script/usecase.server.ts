import { supabase } from '$lib/supabase/supabase.server';

export {
	saveScript,
	getScriptByChapter,
	getScriptOrdersByChapter,
	getAllScriptsByChapter,
	getAllScriptsByChapterPublic
} from './query.server';

/**
 * 캐릭터 정보를 프로필 텍스트로 조합
 */
export function buildCharacterProfile(characterInfo: {
	name: string;
	info?: string | null;
	settings?: string | null;
	introduction?: string | null;
	options?: any;
}): string {
	const profile = [];

	// NPC Profile
	profile.push('# NPC Profile');
	profile.push(`## Name\n${characterInfo.name}`);

	if (characterInfo.info) {
		profile.push(`## Details\n${characterInfo.info}`);
	}

	if (characterInfo.settings) {
		profile.push(`## Settings\n${characterInfo.settings}`);
	}

	if (characterInfo.introduction) {
		profile.push(`## Introduction\n${characterInfo.introduction}`);
	}

	// Options에서 추가 정보
	if (characterInfo.options?.chapter_guidelines) {
		profile.push(`## Chapter Guidelines\n${characterInfo.options.chapter_guidelines}`);
	}

	if (characterInfo.options?.player_info) {
		profile.push(`\n# User Avatar (PC)\n${characterInfo.options.player_info}`);
	}

	return profile.join('\n\n');
}

/**
 * 챕터 ID와 order로 챕터 데이터 조회
 */
export async function getChapterDataByOrder(
	chapterId: string,
	chapterOrder: number
): Promise<{ type: 'meet' | 'chat'; title: string; description: string; content: string } | null> {
	const { data: chapter, error } = await supabase
		.from('chapters')
		.select('data')
		.eq('id', chapterId)
		.single();

	if (error || !chapter || !chapter.data) {
		return null;
	}

	const chaptersData = chapter.data as any[];
	const targetChapter = chaptersData.find((ch) => ch.order === chapterOrder);

	return targetChapter || null;
}
