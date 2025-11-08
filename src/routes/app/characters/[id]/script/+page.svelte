<script lang="ts">
	import { ScriptApi } from '$lib/domain/script/api.client';
	import type { PageData } from './$types';
	import type { Script } from '$lib/domain/script/types';

	let { data }: { data: PageData } = $props();

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
				characterId: data.character.id,
				prompt: prompt.trim()
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
</script>

<div class="container mx-auto p-4 max-w-4xl">
	<!-- 헤더 -->
	<div class="flex justify-between items-center mb-6">
		<div>
			<h1 class="text-3xl font-bold">{data.character.name} - 스크립트 생성</h1>
			<p class="text-sm text-base-content/60 mt-1">LLM을 활용한 스크립트 생성</p>
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
				placeholder="예: 첫 만남 장면을 만들어줘&#10;(Shift+Enter: 줄바꿈, Enter: 생성)"
				bind:value={prompt}
				onkeydown={handleKeydown}
				disabled={isLoading}
			></textarea>

			<div class="card-actions justify-end mt-4">
				<button class="btn btn-primary" onclick={handleGenerate} disabled={isLoading || !prompt.trim()}>
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

	<!-- 결과 표시 영역 -->
	{#if generatedScript}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">생성된 스크립트</h2>
				<div class="divider my-1"></div>

				<!-- 메타 정보 -->
				<div class="grid grid-cols-2 gap-4 mb-4 text-sm">
					<div>
						<span class="font-semibold text-base-content/60">생성일:</span>
						<span class="ml-2">{new Date(generatedScript.created_at).toLocaleString('ko-KR')}</span>
					</div>
					<div>
						<span class="font-semibold text-base-content/60">모델:</span>
						<span class="ml-2">{generatedScript.model}</span>
					</div>
					<div class="col-span-2">
						<span class="font-semibold text-base-content/60">요청:</span>
						<span class="ml-2">{generatedScript.prompt}</span>
					</div>
					{#if generatedScript.tokens_used}
						<div>
							<span class="font-semibold text-base-content/60">토큰 사용:</span>
							<span class="ml-2">{generatedScript.tokens_used.toLocaleString()}</span>
						</div>
					{/if}
				</div>

				<!-- 생성된 콘텐츠 -->
				<div class="bg-base-200 p-4 rounded-lg">
					<pre class="whitespace-pre-wrap text-sm">{generatedScript.content}</pre>
				</div>
			</div>
		</div>
	{/if}

	<!-- 로딩 상태 표시 -->
	{#if isLoading}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body items-center">
				<span class="loading loading-spinner loading-lg"></span>
				<p class="text-base-content/60 mt-4">스크립트를 생성하고 있습니다...</p>
			</div>
		</div>
	{/if}
</div>
