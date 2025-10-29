<script lang="ts">
	import { goto } from '$app/navigation';
	import { CharacterApi } from '$lib/domain/character/api.client';
	import type { PageData } from './$types';
	import type { UpdateCharacterDto } from '$lib/domain/character/types';

	let { data }: { data: PageData } = $props();

	// 수정 모드 상태
	let isEditMode = $state(false);

	// 삭제 모달 상태
	let isDeleteModalOpen = $state(false);

	// 폼 상태 (수정 모드용)
	let name = $state(data.character.name);
	let info = $state(data.character.info || '');
	let settings = $state(data.character.settings || '');
	let introduction = $state(data.character.introduction || '');
	let chapterGuidelines = $state(
		data.character.options &&
			typeof data.character.options === 'object' &&
			'chapter_guidelines' in data.character.options
			? (data.character.options.chapter_guidelines as string) || ''
			: ''
	);

	let isLoading = $state(false);
	let errorMessage = $state('');

	// API Client
	const apiClient = new CharacterApi(fetch);

	// 수정 모드 진입 (폼 데이터 초기화)
	function enterEditMode() {
		name = data.character.name;
		info = data.character.info || '';
		settings = data.character.settings || '';
		introduction = data.character.introduction || '';
		chapterGuidelines =
			data.character.options &&
			typeof data.character.options === 'object' &&
			'chapter_guidelines' in data.character.options
				? (data.character.options.chapter_guidelines as string) || ''
				: '';
		isEditMode = true;
		errorMessage = '';
	}

	// 수정 취소
	function cancelEdit() {
		isEditMode = false;
		errorMessage = '';
	}

	// 수정 제출
	async function handleUpdate(e: Event) {
		e.preventDefault();
		errorMessage = '';

		// Validation
		if (!name.trim()) {
			errorMessage = '캐릭터 이름은 필수입니다.';
			return;
		}

		isLoading = true;

		try {
			const dto: UpdateCharacterDto = {
				name: name.trim(),
				info: info.trim() || undefined,
				settings: settings.trim() || undefined,
				introduction: introduction.trim() || undefined,
				options: chapterGuidelines.trim()
					? { chapter_guidelines: chapterGuidelines.trim() }
					: undefined
			};

			const updatedCharacter = await apiClient.updateCharacter(data.character.id, dto);

			// 낙관적 업데이트
			data.character = updatedCharacter;

			isEditMode = false;
			isLoading = false;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '캐릭터 수정에 실패했습니다.';
			isLoading = false;
		}
	}

	// 삭제 모달 열기
	function openDeleteModal() {
		isDeleteModalOpen = true;
	}

	// 삭제 모달 닫기
	function closeDeleteModal() {
		isDeleteModalOpen = false;
	}

	// 캐릭터 삭제
	async function handleDelete() {
		isLoading = true;
		errorMessage = '';

		try {
			await apiClient.deleteCharacter(data.character.id);

			// 목록으로 리다이렉트
			goto('/characters');
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '캐릭터 삭제에 실패했습니다.';
			isLoading = false;
			isDeleteModalOpen = false;
		}
	}
</script>

<div class="container mx-auto p-4 max-w-3xl">
	<!-- 헤더 -->
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">{data.character.name}</h1>
		<div class="flex gap-2">
			<a href="/characters" class="btn btn-ghost">목록으로</a>
			{#if !isEditMode}
				<button class="btn btn-primary" onclick={enterEditMode}>수정</button>
				<button class="btn btn-error" onclick={openDeleteModal}>삭제</button>
			{:else}
				<button class="btn btn-ghost" onclick={cancelEdit}>취소</button>
				<button class="btn btn-primary" onclick={handleUpdate} disabled={isLoading}>
					{isLoading ? '저장 중...' : '저장'}
				</button>
			{/if}
		</div>
	</div>

	<!-- 에러 메시지 -->
	{#if errorMessage}
		<div class="alert alert-error mb-4">
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- 캐릭터 정보 카드 -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body space-y-6">
			{#if !isEditMode}
				<!-- 읽기 모드 -->
				<!-- 기본 정보 -->
				<div>
					<h2 class="text-xl font-semibold mb-2">기본 정보</h2>
					<div class="divider my-1"></div>
					<dl class="space-y-2">
						<div>
							<dt class="text-sm font-semibold text-base-content/60">이름</dt>
							<dd class="text-base">{data.character.name}</dd>
						</div>
						<div>
							<dt class="text-sm font-semibold text-base-content/60">생성일</dt>
							<dd class="text-base">
								{new Date(data.character.created_at).toLocaleString('ko-KR')}
							</dd>
						</div>
						<div>
							<dt class="text-sm font-semibold text-base-content/60">수정일</dt>
							<dd class="text-base">
								{new Date(data.character.updated_at).toLocaleString('ko-KR')}
							</dd>
						</div>
					</dl>
				</div>

				<!-- 캐릭터 정보 -->
				{#if data.character.info}
					<div>
						<h2 class="text-xl font-semibold mb-2">캐릭터 정보</h2>
						<div class="divider my-1"></div>
						<p class="whitespace-pre-wrap">{data.character.info}</p>
					</div>
				{/if}

				<!-- 캐릭터 설정 -->
				{#if data.character.settings}
					<div>
						<h2 class="text-xl font-semibold mb-2">캐릭터 설정</h2>
						<div class="divider my-1"></div>
						<p class="whitespace-pre-wrap">{data.character.settings}</p>
					</div>
				{/if}

				<!-- 도입부 -->
				{#if data.character.introduction}
					<div>
						<h2 class="text-xl font-semibold mb-2">도입부</h2>
						<div class="divider my-1"></div>
						<p class="whitespace-pre-wrap">{data.character.introduction}</p>
					</div>
				{/if}

				<!-- 챕터 가이드라인 -->
				{#if data.character.options && typeof data.character.options === 'object' && 'chapter_guidelines' in data.character.options}
					<div>
						<h2 class="text-xl font-semibold mb-2">챕터 가이드라인</h2>
						<div class="divider my-1"></div>
						<p class="whitespace-pre-wrap">{data.character.options.chapter_guidelines}</p>
					</div>
				{/if}
			{:else}
				<!-- 수정 모드 -->
				<form onsubmit={handleUpdate} class="space-y-4">
					<!-- 이름 (필수) -->
					<div class="form-control">
						<label for="name" class="label">
							<span class="label-text font-semibold"
								>캐릭터 이름 <span class="text-error">*</span></span
							>
						</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							class="input input-bordered w-full"
							required
						/>
					</div>

					<!-- 정보 -->
					<div class="form-control">
						<label for="info" class="label">
							<span class="label-text font-semibold">캐릭터 정보</span>
						</label>
						<textarea
							id="info"
							bind:value={info}
							class="textarea textarea-bordered h-24"
							placeholder="캐릭터의 배경, 성격 등을 입력하세요"
						></textarea>
					</div>

					<!-- 설정 -->
					<div class="form-control">
						<label for="settings" class="label">
							<span class="label-text font-semibold">캐릭터 설정</span>
						</label>
						<textarea
							id="settings"
							bind:value={settings}
							class="textarea textarea-bordered h-24"
							placeholder="외모, 특징 등 설정을 입력하세요"
						></textarea>
					</div>

					<!-- 도입부 -->
					<div class="form-control">
						<label for="introduction" class="label">
							<span class="label-text font-semibold">도입부</span>
						</label>
						<textarea
							id="introduction"
							bind:value={introduction}
							class="textarea textarea-bordered h-24"
							placeholder="스토리의 시작 부분을 입력하세요"
						></textarea>
					</div>

					<!-- 챕터 가이드라인 -->
					<div class="form-control">
						<label for="chapterGuidelines" class="label">
							<span class="label-text font-semibold">챕터 가이드라인</span>
						</label>
						<textarea
							id="chapterGuidelines"
							bind:value={chapterGuidelines}
							class="textarea textarea-bordered h-24"
							placeholder="챕터별 진행 가이드를 입력하세요"
						></textarea>
					</div>
				</form>
			{/if}
		</div>
	</div>

	<!-- 삭제 확인 모달 -->
	{#if isDeleteModalOpen}
		<div class="modal modal-open">
			<div class="modal-box">
				<h3 class="font-bold text-lg">캐릭터 삭제</h3>
				<p class="py-4">
					정말로 <strong>{data.character.name}</strong> 캐릭터를 삭제하시겠습니까?<br />
					이 작업은 되돌릴 수 없습니다.
				</p>
				<div class="modal-action">
					<button class="btn btn-ghost" onclick={closeDeleteModal} disabled={isLoading}>
						취소
					</button>
					<button class="btn btn-error" onclick={handleDelete} disabled={isLoading}>
						{isLoading ? '삭제 중...' : '삭제'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
