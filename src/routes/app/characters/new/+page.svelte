<script lang="ts">
	import { goto } from '$app/navigation';
	import { CharacterApi } from '$lib/domain/character/api.client';
	import type { CreateCharacterDto } from '$lib/domain/character/types';

	// Form state (Svelte 5 Runes)
	let name = $state('');
	let info = $state('');
	let settings = $state('');
	let introduction = $state('');
	let chapterGuidelines = $state('');
	let playerInfo = $state('');

	let isLoading = $state(false);
	let errorMessage = $state('');

	// API Client
	const apiClient = new CharacterApi(fetch);

	// Form submit handler
	async function handleSubmit(e: Event) {
		e.preventDefault();
		errorMessage = '';

		// Validation
		if (!name.trim()) {
			errorMessage = '캐릭터 이름은 필수입니다.';
			return;
		}

		isLoading = true;

		try {
			const dto: CreateCharacterDto = {
				name: name.trim(),
				info: info.trim() || undefined,
				settings: settings.trim() || undefined,
				introduction: introduction.trim() || undefined,
				options:
					chapterGuidelines.trim() || playerInfo.trim()
						? {
								chapter_guidelines: chapterGuidelines.trim() || undefined,
								player_info: playerInfo.trim() || undefined
							}
						: undefined
			};

			await apiClient.createCharacter(dto);

			// 목록 페이지로 리다이렉트
			goto('/app/characters');
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '캐릭터 생성에 실패했습니다.';
			isLoading = false;
		}
	}
</script>

<div class="container mx-auto p-4 max-w-2xl">
	<!-- 헤더 -->
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">새 캐릭터 만들기</h1>
	</div>

	<!-- 폼 -->
	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- 이름 (필수) -->
		<div class="grid grid-cols-[160px_1fr] gap-4 items-start">
			<label for="name" class="pt-2 font-semibold">
				캐릭터 이름 <span class="text-error">*</span>
			</label>
			<input
				type="text"
				id="name"
				bind:value={name}
				class="input input-bordered w-full"
				placeholder="예: 엘리자베스"
				required
			/>
		</div>

		<!-- 정보 -->
		<div class="grid grid-cols-[160px_1fr] gap-4 items-start">
			<label for="info" class="pt-2 font-semibold">캐릭터 정보</label>
			<textarea
				id="info"
				bind:value={info}
				class="textarea textarea-bordered w-full h-24"
				placeholder="캐릭터의 배경, 성격 등을 입력하세요"
			></textarea>
		</div>

		<!-- 설정 -->
		<div class="grid grid-cols-[160px_1fr] gap-4 items-start">
			<label for="settings" class="pt-2 font-semibold">캐릭터 설정</label>
			<textarea
				id="settings"
				bind:value={settings}
				class="textarea textarea-bordered w-full h-24"
				placeholder="외모, 특징 등 설정을 입력하세요"
			></textarea>
		</div>

		<!-- 도입부 -->
		<div class="grid grid-cols-[160px_1fr] gap-4 items-start">
			<label for="introduction" class="pt-2 font-semibold">도입부</label>
			<textarea
				id="introduction"
				bind:value={introduction}
				class="textarea textarea-bordered w-full h-24"
				placeholder="스토리의 시작 부분을 입력하세요"
			></textarea>
		</div>

		<!-- 챕터 가이드라인 -->
		<div class="grid grid-cols-[160px_1fr] gap-4 items-start">
			<label for="chapterGuidelines" class="pt-2 font-semibold">챕터 가이드라인</label>
			<textarea
				id="chapterGuidelines"
				bind:value={chapterGuidelines}
				class="textarea textarea-bordered w-full h-24"
				placeholder="챕터별 진행 가이드를 입력하세요"
			></textarea>
		</div>

		<!-- 플레이어 정보 -->
		<div class="grid grid-cols-[160px_1fr] gap-4 items-start">
			<label for="playerInfo" class="pt-2 font-semibold">플레이어 정보</label>
			<textarea
				id="playerInfo"
				bind:value={playerInfo}
				class="textarea textarea-bordered w-full h-24"
				placeholder="플레이어(주인공) 정보를 입력하세요"
			></textarea>
		</div>

		<!-- 에러 메시지 -->
		{#if errorMessage}
			<div class="alert alert-error">
				<span>{errorMessage}</span>
			</div>
		{/if}

		<!-- 제출 버튼 -->
		<div class="flex justify-end gap-2">
			<a href="/characters" class="btn btn-ghost">취소</a>
			<button type="submit" class="btn btn-primary" disabled={isLoading}>
				{isLoading ? '생성 중...' : '캐릭터 생성'}
			</button>
		</div>
	</form>
</div>
