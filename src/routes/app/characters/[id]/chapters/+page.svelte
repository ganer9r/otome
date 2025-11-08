<script lang="ts">
	import { ChapterApi } from '$lib/domain/chapter/api.client';
	import type { PageData } from './$types';
	import type { Chapter, ChapterItem } from '$lib/domain/chapter/types';

	let { data }: { data: PageData } = $props();

	// 상태 관리
	let prompt = $state('');
	let generatedChapters = $state<Chapter | null>(data.chapters);
	let isLoading = $state(false);
	let errorMessage = $state('');

	const apiClient = new ChapterApi(fetch);

	// 타입 안전한 챕터 데이터 (derived)
	const chaptersData = $derived(
		generatedChapters ? (generatedChapters.data as unknown as ChapterItem[]) : []
	);

	// 챕터 생성 핸들러
	async function handleGenerate() {
		if (!prompt.trim()) {
			errorMessage = '요청 내용을 입력해주세요.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const result = await apiClient.generateChapters({
				characterId: data.character.id,
				prompt: prompt.trim()
			});
			generatedChapters = result;
			prompt = ''; // 성공 시 입력 초기화
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '챕터 생성에 실패했습니다.';
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
</script>

<div class="container mx-auto p-4 max-w-6xl">
	<!-- 헤더 -->
	<div class="flex justify-between items-center mb-6">
		<div>
			<h1 class="text-3xl font-bold">{data.character.name} - 챕터 생성</h1>
			<p class="text-sm text-base-content/60 mt-1">AI 기반 30개 챕터 자동 생성</p>
		</div>
		<a href="/app/characters/{data.character.id}" class="btn btn-ghost">캐릭터 상세로</a>
	</div>

	<!-- 에러 메시지 -->
	{#if errorMessage}
		<div class="alert alert-error mb-4">
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- 입력 폼 -->
	<div class="card bg-base-100 shadow-xl mb-6">
		<div class="card-body">
			<h2 class="card-title">요청 입력</h2>
			<div class="divider my-1"></div>

			<textarea
				class="textarea textarea-bordered w-full h-32"
				placeholder="예: 로맨스 중심의 감동적인 스토리로 만들어줘&#10;(Shift+Enter: 줄바꿈, Enter: 생성)"
				bind:value={prompt}
				onkeydown={handleKeydown}
				disabled={isLoading}
			></textarea>

			<div class="card-actions justify-end mt-4">
				<button class="btn btn-primary" onclick={handleGenerate} disabled={isLoading || !prompt.trim()}>
					{#if isLoading}
						<span class="loading loading-spinner loading-sm"></span>
						생성 중... (30-60초 소요)
					{:else}
						챕터 생성
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- 챕터 목록 표시 -->
	{#if generatedChapters && generatedChapters.data}
		<div class="mb-6">
			<h2 class="text-2xl font-bold mb-4">
				생성된 챕터 ({chaptersData.length}개)
			</h2>

			<!-- 메타 정보 -->
			<div class="card bg-base-100 shadow-xl mb-4">
				<div class="card-body">
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
						<div>
							<span class="font-semibold text-base-content/60">생성일:</span>
							<span class="ml-2">{new Date(generatedChapters.created_at).toLocaleString('ko-KR')}</span>
						</div>
						<div>
							<span class="font-semibold text-base-content/60">모델:</span>
							<span class="ml-2">{generatedChapters.model}</span>
						</div>
						<div class="col-span-2">
							<span class="font-semibold text-base-content/60">요청:</span>
							<span class="ml-2">{generatedChapters.prompt}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 챕터 리스트 -->
			<div class="space-y-4">
				{#each chaptersData as chapter (chapter.order)}
					<div class="bg-base-100 border border-base-300 rounded-lg p-4">
						<div class="flex items-start gap-3 mb-3">
							<div class="badge badge-primary badge-lg flex-shrink-0">{chapter.order}</div>
							<div class="flex-shrink-0 text-xl mt-0.5">
								{#if chapter.type === 'meet'}
									👥
								{:else}
									💬
								{/if}
							</div>
							<div class="flex-1 min-w-0">
								<h3 class="font-bold text-lg">{chapter.title}</h3>
								<span class="badge badge-sm badge-outline mt-1">
									{chapter.type === 'meet' ? '만남' : '채팅'}
								</span>
							</div>
						</div>
						<div class="pl-12">
							<pre class="whitespace-pre-wrap text-sm leading-relaxed text-base-content/80">{chapter.content}</pre>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- 로딩 상태 표시 -->
	{#if isLoading}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body items-center">
				<span class="loading loading-spinner loading-lg"></span>
				<p class="text-base-content/60 mt-4">30개 챕터를 생성하고 있습니다...</p>
				<p class="text-sm text-base-content/40">30-60초 정도 소요됩니다.</p>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference "$styles/app.css";
</style>
