import { svelteAction } from '$lib/framework/svelteAction';
import { getScriptByChapter } from '$lib/domain/script/usecase.server';
import { z } from 'zod';

/**
 * GET /api/scripts/by-chapter?characterId=xxx&chapterId=xxx&chapterOrder=1
 * 특정 챕터의 최신 스크립트 조회
 */
const getScriptByChapterSchema = z.object({
	characterId: z.string().min(1, '캐릭터 ID를 입력해주세요'),
	chapterId: z.string().min(1, '챕터 ID를 입력해주세요'),
	chapterOrder: z.coerce.number().int().min(1).max(30).optional()
});

export const GET = svelteAction.api({
	middlewares: [],
	form: getScriptByChapterSchema,
	handler: async ({ data, locals }) => {
		const uid = locals.user.id;

		const script = await getScriptByChapter(
			uid,
			data.characterId,
			data.chapterId,
			data.chapterOrder
		);

		return { script };
	}
});
