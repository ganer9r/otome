import { error } from '@sveltejs/kit';
import { getCharacterById } from '$lib/domain/character/usecase.server';
import { getActiveChaptersByCharacterId } from '$lib/domain/chapter/usecase.server';
import { getAllScriptsByChapterPublic } from '$lib/domain/script/usecase.server';
import type { Script } from '$lib/domain/script/types';
import type { PageServerLoad } from './$types';

/**
 * 챕터 생성 페이지 SSR 로드 (공개)
 */
export const load: PageServerLoad = async ({ params }) => {
	const character = await getCharacterById(params.id);

	if (!character) {
		throw error(404, 'Character not found');
	}

	// 활성 챕터 조회 (있으면 반환, 없으면 null)
	const chapters = await getActiveChaptersByCharacterId(params.id);

	// 모든 스크립트를 한 번에 조회 (order를 key로 하는 Record)
	let scripts: Record<number, Script> = {};
	if (chapters) {
		try {
			const scriptsMap = await getAllScriptsByChapterPublic(params.id, chapters.id);
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
