import { svelteAction } from '$lib/framework/svelteAction';
import { supabase } from '$lib/supabase/supabase.server';
import { z } from 'zod';

/**
 * PATCH /api/chapters/[id]/update-item
 * 챕터 data 배열 내의 특정 항목 수정
 */
const updateChapterItemSchema = z.object({
	order: z.number().int().min(1).max(30),
	title: z.string().min(1),
	content: z.string().min(1)
});

export const PATCH = svelteAction.api({
	middlewares: [],
	form: updateChapterItemSchema,
	handler: async ({ data, params }) => {
		const chapterId = params.id;

		if (!chapterId) {
			throw new Error('Chapter ID is required');
		}

		// 1. 기존 챕터 조회 (공개 - 권한 체크 없음)
		const { data: chapter, error: fetchError } = await supabase
			.from('chapters')
			.select('data')
			.eq('id', chapterId)
			.single();

		if (fetchError) {
			throw new Error(`Failed to fetch chapter: ${fetchError.message}`);
		}

		// 2. data 배열에서 해당 order의 항목 찾아서 수정
		const chaptersData = (chapter.data as any[]) || [];
		const targetIndex = chaptersData.findIndex((ch) => ch.order === data.order);

		if (targetIndex === -1) {
			throw new Error(`Chapter with order ${data.order} not found`);
		}

		// 3. 항목 업데이트 (type은 유지)
		chaptersData[targetIndex] = {
			...chaptersData[targetIndex],
			title: data.title,
			content: data.content
		};

		// 4. DB 저장 (권한 체크 없이 업데이트)
		const { error: updateError } = await supabase
			.from('chapters')
			.update({ data: chaptersData })
			.eq('id', chapterId);

		if (updateError) {
			throw new Error(`Failed to update chapter: ${updateError.message}`);
		}

		return { success: true };
	}
});
