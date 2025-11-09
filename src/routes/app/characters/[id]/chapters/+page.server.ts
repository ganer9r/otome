import { error } from '@sveltejs/kit';
import { getCharacter } from '$lib/domain/character/usecase.server';
import { getActiveChapters } from '$lib/domain/chapter/usecase.server';
import { getScriptOrdersByChapter } from '$lib/domain/script/usecase.server';
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

	// 스크립트가 생성된 챕터 order 목록 조회
	let scriptOrders: number[] = [];
	if (chapters) {
		try {
			scriptOrders = await getScriptOrdersByChapter(uid, params.id, chapters.id);
		} catch (e) {
			// 스크립트 조회 실패는 무시 (빈 배열로 처리)
			console.error('Failed to fetch script orders:', e);
		}
	}

	return {
		character,
		chapters,
		scriptOrders
	};
};
