import { error } from '@sveltejs/kit';
import { getCharacter } from '$lib/domain/character/usecase.server';
import { getActiveChapters } from '$lib/domain/chapter/usecase.server';
import { getAllScriptsByChapter } from '$lib/domain/script/usecase.server';
import type { Script } from '$lib/domain/script/types';
import type { PageServerLoad } from './$types';

/**
 * 챕터 생성 페이지 SSR 로드
 */
export const load: PageServerLoad = async ({ params, locals }) => {
	const uid = locals.user.id;
	const character = await getCharacter(uid, params.id);

	if (!character) {
		throw error(404, 'Character not found');
	}

	// 활성 챕터 조회 (있으면 반환, 없으면 null)
	const chapters = await getActiveChapters(uid, params.id);

	// 모든 스크립트를 한 번에 조회 (order를 key로 하는 Record)
	let scripts: Record<number, Script> = {};
	if (chapters) {
		try {
			const scriptsMap = await getAllScriptsByChapter(uid, params.id, chapters.id);
			// Map을 Record로 변환 (직렬화 가능하도록)
			scripts = Object.fromEntries(scriptsMap);
		} catch (e) {
			// 스크립트 조회 실패는 무시 (빈 객체로 처리)
			console.error('Failed to fetch scripts:', e);
		}
	}

	return {
		character,
		chapters,
		scripts
	};
};
