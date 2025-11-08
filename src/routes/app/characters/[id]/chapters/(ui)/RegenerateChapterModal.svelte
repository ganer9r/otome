<script lang="ts">
	import type { ModalProps } from '$lib/stores/modal';
	import type { Chapter } from '$lib/domain/chapter/types';
	import { ChapterApi } from '$lib/domain/chapter/api.client';

	export interface RegenerateChapterModalProps extends ModalProps {
		characterId: string;
		currentChapters: Chapter;
	}

	let { id, close, characterId, currentChapters }: RegenerateChapterModalProps = $props();

	// 상태 관리
	let regeneratePrompt = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');

	const apiClient = new ChapterApi(fetch);

	// 재생성 핸들러
	async function handleRegenerate() {
		if (!regeneratePrompt.trim()) {
			errorMessage = '수정 요청 내용을 입력해주세요.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const result = await apiClient.generateChapters({
				characterId,
				prompt: regeneratePrompt.trim(),
				chapterId: currentChapters.id
			});

			// 성공 시 결과를 반환하고 모달 닫기
			close(result);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '챕터 재생성에 실패했습니다.';
		} finally {
			isLoading = false;
		}
	}

	// 취소 핸들러
	function handleCancel() {
		close(null);
	}
</script>

<div>
	<h3 class="font-bold text-lg mb-2">챕터 재생성 요청</h3>
	<p class="text-sm text-base-content/60 mb-4">
		현재 생성된 챕터를 바탕으로 수정 요청을 반영합니다
	</p>

	<!-- 에러 메시지 -->
	{#if errorMessage}
		<div class="alert alert-error mb-4">
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- 입력 폼 -->
	<textarea
		class="textarea textarea-bordered w-full h-32 mb-4"
		placeholder="예: 더 로맨틱하게 만들어줘&#10;(기존 챕터 구조는 유지됩니다)"
		bind:value={regeneratePrompt}
		disabled={isLoading}
	></textarea>

	<!-- 버튼들 -->
	<div class="modal-action">
		<button class="btn btn-ghost" onclick={handleCancel} disabled={isLoading}>
			취소
		</button>
		<button
			class="btn btn-primary"
			onclick={handleRegenerate}
			disabled={isLoading || !regeneratePrompt.trim()}
		>
			{#if isLoading}
				<span class="loading loading-spinner loading-sm"></span>
				재생성 중...
			{:else}
				재생성
			{/if}
		</button>
	</div>
</div>
