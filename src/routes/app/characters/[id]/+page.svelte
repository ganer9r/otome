<script lang="ts">
	import { goto } from '$app/navigation';
	import { CharacterApi } from '$lib/domain/character/api.client';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// 삭제 모달 상태
	let isDeleteModalOpen = $state(false);
	let isLoading = $state(false);
	let errorMessage = $state('');

	const apiClient = new CharacterApi(fetch);

	// 수정 페이지로 이동
	function goToEdit() {
		goto(`/app/characters/${data.character.id}/edit`);
	}

	// 챕터 페이지로 이동
	function goToChapters() {
		goto(`/app/characters/${data.character.id}/chapters`);
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
			goto('/app/characters');
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
			<a href="/app/characters" class="btn btn-ghost">목록으로</a>
			<button class="btn btn-secondary" onclick={goToChapters}>챕터 관리하기</button>
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
			<!-- 기본 정보 -->
			<div>
				<h2 class="text-xl font-semibold mb-2">
					기본 정보

					<div class="flex gap-2">
						<button class="btn btn-primary" onclick={goToEdit}>수정</button>
						<button class="btn btn-error" onclick={openDeleteModal}>삭제</button>
					</div>
				</h2>
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

			<!-- 플레이어 정보 -->
			{#if data.character.options && typeof data.character.options === 'object' && 'player_info' in data.character.options}
				<div>
					<h2 class="text-xl font-semibold mb-2">플레이어 정보</h2>
					<div class="divider my-1"></div>
					<p class="whitespace-pre-wrap">{data.character.options.player_info}</p>
				</div>
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
