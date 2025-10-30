<script lang="ts">
	import { goto } from '$app/navigation';
	import { CharacterApi } from '$lib/domain/character/api.client';
	import type { PageData } from './$types';
	import type { UpdateCharacterDto } from '$lib/domain/character/types';

	let { data }: { data: PageData } = $props();

	// 폼 상태
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
	let playerInfo = $state(
		data.character.options &&
			typeof data.character.options === 'object' &&
			'player_info' in data.character.options
			? (data.character.options.player_info as string) || ''
			: ''
	);

	let isLoading = $state(false);
	let errorMessage = $state('');

	const apiClient = new CharacterApi(fetch);

	// 수정 제출
	async function handleUpdate(e: Event) {
		e.preventDefault();
		errorMessage = '';

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
				options:
					chapterGuidelines.trim() || playerInfo.trim()
						? {
								chapter_guidelines: chapterGuidelines.trim() || undefined,
								player_info: playerInfo.trim() || undefined
							}
						: undefined
			};

			await apiClient.updateCharacter(data.character.id, dto);

			// 상세 페이지로 리다이렉트
			goto(`/app/characters/${data.character.id}`);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '캐릭터 수정에 실패했습니다.';
			isLoading = false;
		}
	}

	// 취소
	function handleCancel() {
		goto(`/app/characters/${data.character.id}`);
	}
</script>

<div class="container mx-auto p-4 max-w-3xl">
	<!-- 헤더 -->
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">캐릭터 수정</h1>
		<div class="flex gap-2">
			<button class="btn btn-ghost" onclick={handleCancel} disabled={isLoading}>취소</button>
			<button class="btn btn-primary" onclick={handleUpdate} disabled={isLoading}>
				{isLoading ? '저장 중...' : '저장'}
			</button>
		</div>
	</div>

	<!-- 에러 메시지 -->
	{#if errorMessage}
		<div class="alert alert-error mb-4">
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- 수정 폼 -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<form onsubmit={handleUpdate} class="space-y-6">
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
			</form>
		</div>
	</div>
</div>
