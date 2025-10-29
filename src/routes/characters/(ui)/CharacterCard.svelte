<script lang="ts">
	import type { Character } from '$lib/domain/character/types';

	/**
	 * CharacterCard 컴포넌트
	 * 캐릭터 목록에서 재사용 가능한 카드 컴포넌트
	 */
	let {
		character,
		onclick
	}: {
		character: Character;
		onclick?: () => void;
	} = $props();
</script>

<button
	type="button"
	{onclick}
	class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow text-left w-full"
>
	<div class="card-body">
		<h2 class="card-title">{character.name}</h2>
		{#if character.info}
			<p class="line-clamp-3 text-base-content/80">{character.info}</p>
		{/if}
		<div class="card-actions justify-end mt-2">
			<span class="text-sm text-base-content/60">
				{new Date(character.created_at).toLocaleDateString('ko-KR')}
			</span>
		</div>
	</div>
</button>
