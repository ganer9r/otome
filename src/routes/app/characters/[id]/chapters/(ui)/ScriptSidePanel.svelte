<script lang="ts">
	import { fly } from 'svelte/transition';
	import { ScriptApi } from '$lib/domain/script/api.client';
	import type { Script } from '$lib/domain/script/types';
	import type { ChapterItem } from '$lib/domain/chapter/types';

	interface Props {
		chapter: ChapterItem;
		chapterId: string;
		characterId: string;
		script: Script | null;
		onClose: () => void;
		onScriptUpdate: (script: Script) => void;
	}

	let { chapter, chapterId, characterId, script, onClose, onScriptUpdate }: Props = $props();

	// 상태 관리
	let prompt = $state('');
	let generatedScript = $state<Script | null>(script);
	let isLoading = $state(false);
	let errorMessage = $state('');

	// 챕터 편집 상태
	let isEditingChapter = $state(false);
	let editedChapter = $state({
		title: chapter.title,
		description: chapter.description,
		content: chapter.content
	});

	const apiClient = new ScriptApi(fetch);

	// script prop 변경 시 generatedScript 업데이트
	$effect(() => {
		generatedScript = script;
	});

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
				chapterId,
				chapterOrder: chapter.order
			});
			generatedScript = result;
			onScriptUpdate(result); // 상위 컴포넌트에 알림
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

	// 챕터 편집 모드 토글
	function toggleEditMode() {
		if (isEditingChapter) {
			// 취소: 원래 값으로 되돌림
			editedChapter = {
				title: chapter.title,
				description: chapter.description,
				content: chapter.content
			};
		}
		isEditingChapter = !isEditingChapter;
	}

	// 챕터 저장
	async function saveChapterEdit() {
		try {
			isLoading = true;
			const response = await fetch(`/api/chapters/${chapterId}/update-item`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					order: chapter.order,
					title: editedChapter.title,
					description: editedChapter.description,
					content: editedChapter.content
				})
			});

			if (!response.ok) {
				throw new Error('Failed to update chapter');
			}

			// 성공 시 편집 모드 종료 및 부모에게 알림 (페이지 새로고침 필요)
			isEditingChapter = false;
			alert('챕터가 수정되었습니다. 페이지를 새로고침해주세요.');
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '챕터 수정에 실패했습니다.';
		} finally {
			isLoading = false;
		}
	}

	// 스크립트 파싱
	interface ParsedScript {
		thinking: string | null;
		lines: Array<{ speaker: string | null; text: string; type?: 'narration' }>;
	}

	function parseScriptContent(content: string | any): ParsedScript {
		// content가 없거나 string이 아닌 경우 처리
		if (!content) {
			return { thinking: null, lines: [] };
		}

		// content가 객체인 경우 (JSON 파싱 필요)
		let textContent = '';
		if (typeof content === 'string') {
			textContent = content;
		} else if (typeof content === 'object') {
			// JSON으로 저장되어 있을 경우
			textContent = JSON.stringify(content, null, 2);
		} else {
			return { thinking: null, lines: [] };
		}

		// <thinking> 추출
		const thinkingMatch = textContent.match(/<thinking>([\s\S]*?)<\/thinking>/);
		const thinking = thinkingMatch ? thinkingMatch[1].trim() : null;

		// thinking 제거한 나머지 부분
		const scriptContent = textContent.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim();

		// 각 라인 파싱
		const lines: Array<{ speaker: string | null; text: string; type?: 'narration' }> = [];
		const scriptLines = scriptContent.split('\n').filter((line) => line.trim());

		for (const line of scriptLines) {
			// [narration] 매칭
			const narrationMatch = line.match(/^\[narration\]\s*(.+)$/);
			if (narrationMatch) {
				lines.push({ speaker: null, text: narrationMatch[1].trim(), type: 'narration' });
				continue;
			}

			// [user] 매칭
			const userMatch = line.match(/^\[user\]\s*(.+)$/);
			if (userMatch) {
				lines.push({ speaker: 'user', text: userMatch[1].trim() });
				continue;
			}

			// [char:이름] 매칭
			const charMatch = line.match(/^\[char:(.+?)\]\s*(.+)$/);
			if (charMatch) {
				lines.push({ speaker: charMatch[1].trim(), text: charMatch[2].trim() });
				continue;
			}
		}

		return { thinking, lines };
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

				{#if isEditingChapter}
					<!-- 편집 모드 -->
					<input
						type="text"
						class="input input-bordered w-full mb-2"
						bind:value={editedChapter.title}
						placeholder="제목"
					/>
					<textarea
						class="textarea textarea-bordered w-full mb-3 h-20"
						bind:value={editedChapter.description}
						placeholder="설명"
					></textarea>
					<textarea
						class="textarea textarea-bordered w-full h-32 bg-base-200"
						bind:value={editedChapter.content}
						placeholder="내용"
					></textarea>
					<div class="flex gap-2 mt-3">
						<button class="btn btn-primary btn-sm" onclick={saveChapterEdit} disabled={isLoading}>
							{#if isLoading}
								<span class="loading loading-spinner loading-xs"></span>
							{/if}
							저장
						</button>
						<button class="btn btn-ghost btn-sm" onclick={toggleEditMode} disabled={isLoading}>
							취소
						</button>
					</div>
				{:else}
					<!-- 보기 모드 -->
					<h2 id="panel-title" class="text-2xl font-bold mb-2">{chapter.title}</h2>
					<p class="text-sm text-base-content/70 mb-3">{chapter.description}</p>
					<div class="bg-base-200 p-3 rounded-lg">
						<pre class="whitespace-pre-wrap text-xs text-base-content/80">{chapter.content}</pre>
					</div>
				{/if}
			</div>

			<div class="flex flex-col gap-2 ml-4">
				{#if !isEditingChapter}
					<button
						class="btn btn-ghost btn-sm btn-circle"
						onclick={toggleEditMode}
						aria-label="챕터 편집"
						title="챕터 편집"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="w-5 h-5"
							fill="none"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182L7.5 19.213l-4.125.688.688-4.125L16.862 3.487z"
							/>
						</svg>
					</button>
				{/if}
				<button
					class="btn btn-ghost btn-sm btn-circle"
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
				{@const parsed = parseScriptContent(generatedScript.content)}
				<div class="card bg-base-200 shadow-md">
					<div class="card-body">
						<div class="flex items-center justify-between mb-2">
							<h3 class="card-title text-lg">생성된 스크립트</h3>
							{#if generatedScript.chapter_order}
								<div class="badge badge-primary badge-lg">Chapter {generatedScript.chapter_order}</div>
							{/if}
						</div>
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

						<!-- Thinking 섹션 (접을 수 있음) -->
						{#if parsed.thinking}
							<details class="collapse collapse-arrow bg-base-100 mb-4">
								<summary class="collapse-title text-sm font-medium">📋 작성 계획 (Thinking)</summary>
								<div class="collapse-content">
									<pre class="whitespace-pre-wrap text-xs text-base-content/70">{parsed.thinking}</pre>
								</div>
							</details>
						{/if}

						<!-- 스크립트 대화 -->
						<div class="bg-base-100 p-4 rounded-lg border border-base-300">
							<h4 class="font-semibold text-base-content/60 mb-3 text-sm">스크립트</h4>
							{#if parsed.lines.length > 0}
								<div class="space-y-2">
									{#each parsed.lines as line}
										{#if line.type === 'narration'}
											<!-- Narration: 중앙 정렬, 이탤릭 -->
											<div class="flex justify-center my-3">
												<div class="text-sm italic text-base-content/60 text-center max-w-[90%]">
													{line.text}
												</div>
											</div>
										{:else if line.speaker === 'user'}
											<div class="flex justify-end">
												<div class="bg-primary text-primary-content px-3 py-2 rounded-lg max-w-[80%]">
													<div class="text-xs opacity-70 mb-1">[user]</div>
													<div class="text-sm">{line.text}</div>
												</div>
											</div>
										{:else if line.speaker}
											<div class="flex justify-start">
												<div class="bg-base-200 px-3 py-2 rounded-lg max-w-[80%]">
													<div class="text-xs text-base-content/60 mb-1">[char:{line.speaker}]</div>
													<div class="text-sm">{line.text}</div>
												</div>
											</div>
										{/if}
									{/each}
								</div>
							{:else}
								<!-- 파싱 실패 시 raw content 표시 -->
								<details class="collapse collapse-arrow bg-base-200">
									<summary class="collapse-title text-sm">원본 내용 보기</summary>
									<div class="collapse-content">
										<pre
											class="whitespace-pre-wrap text-xs overflow-x-auto">{typeof generatedScript.content === 'string'
												? generatedScript.content
												: JSON.stringify(generatedScript.content, null, 2)}</pre>
									</div>
								</details>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
