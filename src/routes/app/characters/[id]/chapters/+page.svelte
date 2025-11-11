<script lang="ts">
	import { ChapterApi } from '$lib/domain/chapter/api.client';
	import type { PageData } from './$types';
	import type { Chapter, ChapterItem } from '$lib/domain/chapter/types';
	import type { Script } from '$lib/domain/script/types';
	import { modalStore } from '$lib/stores/modal';
	import RegenerateChapterModal, {
		type RegenerateChapterModalProps
	} from './(ui)/RegenerateChapterModal.svelte';
	import ScriptSidePanel from './(ui)/ScriptSidePanel.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	// 상태 관리
	let prompt = $state('');
	let selectedModel = $state<'gemini' | 'deepseek'>('deepseek');
	let generatedChapters = $state<Chapter | null>(data.chapters);
	let scripts = $state<Record<number, Script>>(data.scripts);
	let isLoading = $state(false);
	let errorMessage = $state('');
	let selectedChapterId = $state<string | null>(null);
	let selectedChapter = $state<ChapterItem | null>(null);

	const apiClient = new ChapterApi(fetch);

	// 스크립트가 생성된 챕터 order Set (빠른 조회용)
	const scriptOrdersSet = $derived(new Set(Object.keys(scripts).map(Number)));

	// URL 쿼리 파라미터에서 챕터 ID 읽기
	$effect(() => {
		const chapterIdFromUrl = $page.url.searchParams.get('chapter');
		if (chapterIdFromUrl) {
			selectedChapterId = chapterIdFromUrl;
			// chaptersData에서 해당 챕터 찾기
			const chapterOrder = parseInt(chapterIdFromUrl, 10);
			selectedChapter = chaptersData.find((ch) => ch.order === chapterOrder) || null;
		}
	});

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
				prompt: prompt.trim(),
				model: selectedModel
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

	// 재생성 모달 열기
	async function openRegenerateDialog() {
		if (!generatedChapters) return;

		try {
			const result = await modalStore.open<
				Chapter | null,
				Omit<RegenerateChapterModalProps, 'id' | 'close'>
			>({
				component: RegenerateChapterModal,
				props: {
					characterId: data.character.id,
					currentChapters: generatedChapters
				}
			});

			// 결과가 있으면 챕터 업데이트
			if (result) {
				generatedChapters = result;
			}
		} catch (error) {
			// 모달이 취소되거나 오류 발생
			console.error('Modal error:', error);
		}
	}

	// 챕터 카드 클릭 핸들러
	function handleChapterClick(chapter: ChapterItem) {
		selectedChapterId = String(chapter.order);
		selectedChapter = chapter;
		// URL 쿼리 파라미터 업데이트
		const url = new URL($page.url);
		url.searchParams.set('chapter', String(chapter.order));
		goto(url.toString(), { replaceState: true });
	}

	// 패널 닫기 핸들러
	function handleClosePanel() {
		selectedChapterId = null;
		selectedChapter = null;
		// URL 쿼리 파라미터 제거
		const url = new URL($page.url);
		url.searchParams.delete('chapter');
		goto(url.toString(), { replaceState: true });
	}

	// 스크립트 업데이트 핸들러
	function handleScriptUpdate(script: Script) {
		if (script.chapter_order !== null && script.chapter_order !== undefined) {
			scripts = { ...scripts, [script.chapter_order]: script };
		}
	}
</script>

<!-- 챕터 목록 영역 (항상 전체 너비) -->
<div class="min-h-screen">
	<div class="overflow-y-auto">
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

					<!-- 모델 선택 -->
					<div class="form-control w-full mb-4">
						<label class="label" for="chapter-model-select">
							<span class="label-text">모델 선택</span>
						</label>
						<select id="chapter-model-select" class="select select-bordered w-full" bind:value={selectedModel} disabled={isLoading}>
							<option value="gemini">Gemini 2.5 Flash (빠름, 추천)</option>
							<option value="deepseek">DeepSeek Chat (저렴)</option>
						</select>
					</div>

					<textarea
						class="textarea textarea-bordered w-full h-32"
						placeholder="예: 로맨스 중심의 감동적인 스토리로 만들어줘&#10;(Shift+Enter: 줄바꿈, Enter: 생성)"
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
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-2xl font-bold">생성된 챕터 ({chaptersData.length}개)</h2>
						<button class="btn btn-outline btn-secondary btn-sm" onclick={openRegenerateDialog}>
							챕터 재생성
						</button>
					</div>

					<!-- 메타 정보 -->
					<div class="card bg-base-100 shadow-xl mb-4">
						<div class="card-body">
							<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
								<div>
									<span class="font-semibold text-base-content/60">생성일:</span>
									<span class="ml-2"
										>{new Date(generatedChapters.created_at).toLocaleString('ko-KR')}</span
									>
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
							<div
								class="bg-base-100 border border-base-300 rounded-lg p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all group"
								class:ring-2={selectedChapterId === String(chapter.order)}
								class:ring-primary={selectedChapterId === String(chapter.order)}
								onclick={() => handleChapterClick(chapter)}
								role="button"
								tabindex="0"
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										handleChapterClick(chapter);
									}
								}}
							>
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
										<div class="flex items-center gap-2 mb-1">
											<h3 class="font-bold text-lg">{chapter.title}</h3>
											{#if scriptOrdersSet.has(chapter.order)}
												<span
													class="badge badge-success badge-sm gap-1"
													title="스크립트 생성됨"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 20 20"
														fill="currentColor"
														class="w-3 h-3"
													>
														<path
															fill-rule="evenodd"
															d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
															clip-rule="evenodd"
														/>
													</svg>
													스크립트
												</span>
											{/if}
										</div>
										<span class="badge badge-sm badge-outline mt-1">
											{chapter.type === 'meet' ? '만남' : '채팅'}
										</span>
									</div>
									<!-- 클릭 가능 표시 아이콘 -->
									<div class="flex-shrink-0 text-base-content/40 group-hover:text-primary transition-colors">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											class="w-6 h-6"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
										</svg>
									</div>
								</div>
								<div class="pl-12">
									<pre
										class="whitespace-pre-wrap text-sm leading-relaxed text-base-content/80">{chapter.content}</pre>
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
	</div>

	<!-- 사이드 패널: selectedChapter가 있을 때만 표시 -->
	{#if selectedChapter && generatedChapters}
		<ScriptSidePanel
			chapter={selectedChapter}
			chapterId={generatedChapters.id}
			characterId={data.character.id}
			script={scripts[selectedChapter.order] ?? null}
			onClose={handleClosePanel}
			onScriptUpdate={handleScriptUpdate}
		/>
	{/if}
</div>

<style lang="postcss">
	@reference "$styles/app.css";
</style>
