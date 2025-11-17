<script lang="ts">
	import type { Ingredient } from '../lib/types';
	import { unlockedIngredientsStore, getUnlockedIngredientsObjects } from '../lib/store';

	interface Props {
		/** 선택된 재료 ID 목록 */
		selectedIds?: string[];
		/** 재료 선택 시 콜백 */
		onSelect?: (ingredientIds: string[]) => void;
	}

	let { selectedIds = $bindable([]), onSelect }: Props = $props();

	// 오픈된 재료 목록 (store 직접 사용)
	let unlockedIngredients = $derived(getUnlockedIngredientsObjects($unlockedIngredientsStore));

	// 재료 선택/해제 토글
	function toggleIngredient(ingredientId: string) {
		let newSelection: string[];

		if (selectedIds.includes(ingredientId)) {
			// 이미 선택된 경우 해제
			newSelection = selectedIds.filter((id) => id !== ingredientId);
		} else {
			// 최대 2개까지만 선택 가능
			if (selectedIds.length >= 2) {
				// 첫 번째 선택 제거하고 새로운 재료 추가
				newSelection = [...selectedIds.slice(1), ingredientId];
			} else {
				newSelection = [...selectedIds, ingredientId];
			}
		}

		selectedIds = newSelection;
		onSelect?.(newSelection);
	}

	// 재료별 등급 색상
	function getGradeColor(grade: string): string {
		switch (grade) {
			case 'basic':
				return 'bg-gray-100 border-gray-300';
			case 'common':
				return 'bg-green-50 border-green-300';
			case 'rare':
				return 'bg-blue-50 border-blue-300';
			case 'epic':
				return 'bg-purple-50 border-purple-300';
			case 'legendary':
				return 'bg-yellow-50 border-yellow-300';
			default:
				return 'bg-gray-100 border-gray-300';
		}
	}
</script>

<div class="ingredient-selector">
	<h3 class="selector-title">재료 선택 (최대 2개)</h3>

	{#if unlockedIngredients.length === 0}
		<div class="text-center text-gray-500 py-4 text-sm">오픈된 재료가 없습니다</div>
	{:else}
		<div class="ingredient-grid">
			{#each unlockedIngredients as ingredient (ingredient.id)}
				<button
					type="button"
					class="ingredient-card {getGradeColor(ingredient.grade)}"
					class:selected={selectedIds.includes(ingredient.id)}
					onclick={() => toggleIngredient(ingredient.id)}
				>
					<div class="ingredient-name">{ingredient.name}</div>
					<div class="ingredient-grade">{ingredient.grade}</div>
				</button>
			{/each}
		</div>
	{/if}

	{#if selectedIds.length > 0}
		<div class="selected-count">
			선택됨: {selectedIds.length}/2
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.ingredient-selector {
		@apply w-full;
	}

	.selector-title {
		@apply font-bold;
		font-size: var(--font-md);
		margin-bottom: var(--spacing-sm);
	}

	.ingredient-grid {
		@apply grid grid-cols-3 gap-2;
		@apply overflow-y-auto;
		max-height: 30vh;
		-webkit-overflow-scrolling: touch;
	}

	.ingredient-card {
		@apply relative flex flex-col items-center justify-center;
		@apply p-3 rounded-lg border-2 transition-all duration-200;
		@apply hover:scale-105 hover:shadow-lg hover:shadow-primary/20;
		@apply cursor-pointer;
		@apply active:scale-95;
		min-height: 70px;
	}

	.ingredient-card.selected {
		@apply ring-4 ring-primary ring-offset-2;
		@apply border-primary;
		@apply shadow-lg shadow-primary/30;
		@apply scale-105;
	}

	.ingredient-card.newly-unlocked {
		animation: unlockPulse 1s ease-out;
	}

	@keyframes unlockPulse {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.15);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.ingredient-name {
		@apply font-semibold;
		font-size: var(--font-sm);
		margin-bottom: var(--spacing-xs);
	}

	.ingredient-grade {
		@apply opacity-60;
		font-size: var(--font-xs);
	}

	.selected-count {
		@apply text-gray-600;
		font-size: var(--font-xs);
		margin-top: var(--spacing-xs);
	}

	.new-badge {
		@apply absolute -top-2 -right-2;
		@apply bg-accent text-accent-content;
		@apply text-xs font-bold px-2 py-1 rounded-full;
		@apply shadow-md;
		animation: badgeBounce 1s ease-out infinite;
	}

	@keyframes badgeBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}
</style>
