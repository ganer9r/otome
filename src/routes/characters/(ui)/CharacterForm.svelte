<script lang="ts">
	import type { Character } from '$lib/domain/character/types';

	/**
	 * CharacterForm 컴포넌트
	 * 캐릭터 생성/수정 폼 (재사용 가능)
	 */
	let {
		initialData = undefined,
		onsubmit,
		submitButtonText = '제출',
		isLoading = false
	}: {
		initialData?: Partial<Character>;
		onsubmit: (data: {
			name: string;
			info?: string;
			settings?: string;
			introduction?: string;
			options?: { chapter_guidelines?: string };
		}) => void;
		submitButtonText?: string;
		isLoading?: boolean;
	} = $props();

	// 폼 상태
	let name = $state(initialData?.name || '');
	let info = $state(initialData?.info || '');
	let settings = $state(initialData?.settings || '');
	let introduction = $state(initialData?.introduction || '');
	let chapterGuidelines = $state(
		initialData?.options &&
			typeof initialData.options === 'object' &&
			'chapter_guidelines' in initialData.options
			? (initialData.options.chapter_guidelines as string) || ''
			: ''
	);

	// 폼 제출 핸들러
	function handleSubmit(e: Event) {
		e.preventDefault();

		onsubmit({
			name: name.trim(),
			info: info.trim() || undefined,
			settings: settings.trim() || undefined,
			introduction: introduction.trim() || undefined,
			options: chapterGuidelines.trim()
				? { chapter_guidelines: chapterGuidelines.trim() }
				: undefined
		});
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<!-- 이름 (필수) -->
	<div class="form-control">
		<label for="name" class="label">
			<span class="label-text font-semibold">캐릭터 이름 <span class="text-error">*</span></span>
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

	<!-- 제출 버튼 슬롯 (외부에서 커스터마이징 가능) -->
	<slot name="actions">
		<div class="flex justify-end">
			<button type="submit" class="btn btn-primary" disabled={isLoading}>
				{isLoading ? '처리 중...' : submitButtonText}
			</button>
		</div>
	</slot>
</form>
