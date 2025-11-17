<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { findIngredientById } from '../lib/data/ingredients';

	interface Props {
		/** 선택된 재료 ID 배열 (최대 2개) */
		selectedIds: string[];
	}

	let { selectedIds }: Props = $props();

	// 슬롯별 재료 정보
	let slot1 = $derived(selectedIds[0] ? findIngredientById(selectedIds[0]) : null);
	let slot2 = $derived(selectedIds[1] ? findIngredientById(selectedIds[1]) : null);
</script>

<div class="ingredient-slots">
	<!-- 슬롯 1 -->
	<div class="slot" class:filled={slot1}>
		{#if slot1}
			<div class="slot-content">
				<div class="ingredient-name">{slot1.name}</div>
				<div class="ingredient-grade">{slot1.grade}</div>
			</div>
		{:else}
			<div class="slot-empty">
				<Plus size={48} />
				<span>재료 선택</span>
			</div>
		{/if}
	</div>

	<!-- 슬롯 2 -->
	<div class="slot" class:filled={slot2}>
		{#if slot2}
			<div class="slot-content">
				<div class="ingredient-name">{slot2.name}</div>
				<div class="ingredient-grade">{slot2.grade}</div>
			</div>
		{:else}
			<div class="slot-empty">
				<Plus size={48} />
				<span>재료 선택</span>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.ingredient-slots {
		@apply flex gap-4 justify-center items-center;
		@apply w-full;
		padding: var(--spacing-md);
	}

	.slot {
		@apply flex-1 max-w-[180px];
		@apply aspect-square;
		@apply rounded-3xl;
		@apply border-4 border-dashed border-gray-300;
		@apply bg-white;
		@apply flex items-center justify-center;
		@apply transition-all duration-300;
		@apply shadow-lg;
	}

	.slot.filled {
		@apply border-solid border-primary;
		@apply bg-gradient-to-br from-primary/10 to-secondary/10;
		@apply shadow-xl;
		animation: slotFill 0.3s ease-out;
	}

	@keyframes slotFill {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.slot-empty {
		@apply flex flex-col items-center gap-2;
		@apply text-gray-400;
		@apply opacity-50;
	}

	.slot-empty span {
		font-size: var(--font-xs);
		@apply font-medium;
	}

	.slot-content {
		@apply flex flex-col items-center gap-2;
		@apply text-center;
		@apply p-4;
	}

	.ingredient-name {
		@apply font-bold text-gray-800;
		font-size: var(--font-md);
		@apply break-keep;
	}

	.ingredient-grade {
		@apply text-primary font-medium;
		font-size: var(--font-xs);
		@apply px-3 py-1 rounded-full;
		@apply bg-primary/20;
	}
</style>
