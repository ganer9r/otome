<script lang="ts">
	import { fly } from 'svelte/transition';
	import { ScriptApi } from '$lib/domain/script/api.client';
	import type { Script } from '$lib/domain/script/types';
	import type { ChapterItem } from '$lib/domain/chapter/types';

	interface Props {
		chapter: ChapterItem;
		chapterId: string;
		characterId: string;
		onClose: () => void;
	}

	let { chapter, chapterId, characterId, onClose }: Props = $props();

	// 상태 관리
	let prompt = $state('');
	let generatedScript = $state<Script | null>(null);
	let isLoading = $state(false);
	let errorMessage = $state('');

	const apiClient = new ScriptApi(fetch);

	// 스크립트 생성 핸들러
	async function handleGenerate() {
		if (!prompt.trim()) {
			errorMessage = '요청 내용을 입력해주세요.';
			return;
		}

		isLoading = true;
		errorMessage = '';
		generatedScript = null;

		try {
			const result = await apiClient.generateScript({
				characterId,
				prompt: prompt.trim(),
				chapterId
			});
			generatedScript = result;
			prompt = ''; // 성공 시 입력 초기화
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '스크립트 생성에 실패했습니다.';
		} finally {
			isLoading = false;
		}
	}

	// Enter 키 처리 (Shift+Enter는 줄바꿈, Enter는 생성)
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleGenerate();
		}
	}

	// 오버레이 클릭 핸들러
	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}
</script>

<!-- 오버레이 -->
<div
	class="fixed inset-0 bg-black/30 z-40"
	onclick={handleOverlayClick}
	role="presentation"
	transition:fly={{ x: 0, opacity: 0, duration: 200 }}
>
	<!-- 사이드 패널 -->
	<div
		class="fixed top-0 right-0 h-full w-[60%] bg-base-100 shadow-2xl z-50 flex flex-col"
		transition:fly={{ x: '100%', duration: 300 }}
		role="dialog"
		aria-modal="true"
		aria-labelledby="panel-title"
	>
		<!-- 헤더 -->
		<div class="flex justify-between items-start p-6 border-b border-base-300">
			<div class="flex-1">
				<div class="flex items-center gap-3 mb-3">
					<div class="badge badge-primary badge-lg">{chapter.order}</div>
					<span class="badge badge-outline">
						{chapter.type === 'meet' ? '만남' : '채팅'}
					</span>
				</div>
				<h2 id="panel-title" class="text-2xl font-bold mb-2">{chapter.title}</h2>
				<p class="text-sm text-base-content/70 mb-3">{chapter.description}</p>
				<div class="bg-base-200 p-3 rounded-lg">
					<pre class="whitespace-pre-wrap text-xs text-base-content/80">{chapter.content}</pre>
				</div>
			</div>
			<button
				class="btn btn-ghost btn-sm btn-circle ml-4"
				onclick={onClose}
				aria-label="패널 닫기"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-5 h-5"
					fill="none"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- 본문 (스크롤 가능) -->
		<div class="flex-1 overflow-y-auto p-6">
			<!-- 에러 메시지 -->
			{#if errorMessage}
				<div class="alert alert-error mb-4">
					<span>{errorMessage}</span>
				</div>
			{/if}

			<!-- 입력 폼 -->
			<div class="card bg-base-200 shadow-md mb-6">
				<div class="card-body">
					<h3 class="card-title text-lg">요청 입력</h3>
					<div class="divider my-1"></div>

					<textarea
						class="textarea textarea-bordered w-full h-32 bg-base-100"
						placeholder="예: 첫 만남 장면을 만들어줘&#10;(Shift+Enter: 줄바꿈, Enter: 생성)"
						bind:value={prompt}
						onkeydown={handleKeydown}
						disabled={isLoading}
					></textarea>

					<div class="card-actions justify-end mt-4">
						<button
							class="btn btn-primary"
							onclick={handleGenerate}
							disabled={isLoading || !prompt.trim()}
						>
							{#if isLoading}
								<span class="loading loading-spinner loading-sm"></span>
								생성 중...
							{:else}
								스크립트 생성
							{/if}
						</button>
					</div>
				</div>
			</div>

			<!-- 로딩 상태 표시 -->
			{#if isLoading}
				<div class="card bg-base-200 shadow-md">
					<div class="card-body items-center">
						<span class="loading loading-spinner loading-lg"></span>
						<p class="text-base-content/60 mt-4">스크립트를 생성하고 있습니다...</p>
					</div>
				</div>
			{/if}

			<!-- 결과 표시 영역 -->
			{#if generatedScript}
				<div class="card bg-base-200 shadow-md">
					<div class="card-body">
						<h3 class="card-title text-lg">생성된 스크립트</h3>
						<div class="divider my-1"></div>

						<!-- 메타 정보 -->
						<div class="grid grid-cols-1 gap-3 mb-4 text-sm">
							<div class="flex flex-col gap-1">
								<span class="font-semibold text-base-content/60">생성일:</span>
								<span class="ml-2 text-base-content">
									{new Date(generatedScript.created_at).toLocaleString('ko-KR')}
								</span>
							</div>
							<div class="flex flex-col gap-1">
								<span class="font-semibold text-base-content/60">모델:</span>
								<span class="ml-2 text-base-content">{generatedScript.model}</span>
							</div>
							<div class="flex flex-col gap-1">
								<span class="font-semibold text-base-content/60">요청:</span>
								<span class="ml-2 text-base-content">{generatedScript.prompt}</span>
							</div>
							{#if generatedScript.tokens_used}
								<div class="flex flex-col gap-1">
									<span class="font-semibold text-base-content/60">토큰 사용:</span>
									<span class="ml-2 text-base-content">
										{generatedScript.tokens_used.toLocaleString()}
									</span>
								</div>
							{/if}
						</div>

						<!-- 생성된 콘텐츠 -->
						<div class="bg-base-100 p-4 rounded-lg border border-base-300">
							<h4 class="font-semibold text-base-content/60 mb-2 text-sm">스크립트 JSON:</h4>
							<pre
								class="whitespace-pre-wrap text-xs overflow-x-auto">{JSON.stringify(
									generatedScript.content,
									null,
									2
								)}</pre>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
