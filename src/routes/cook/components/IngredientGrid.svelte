<script lang="ts">
	import { unlockedIngredientsStore } from '../lib/store';
	import { INGREDIENTS } from '../lib/data/ingredients';
	import { GRADE_COLORS, GRADE_NAMES, GRADE_ORDER } from '../lib/types';
	import type { IngredientGrade } from '../lib/types';

	interface Props {
		/** 선택된 재료 ID 배열 (양방향 바인딩) */
		selectedIds: number[];
	}

	let { selectedIds = $bindable() }: Props = $props();

	// 등급 필터 탭 (G, F, E, D, C, B, A, R)
	const grades: IngredientGrade[] = GRADE_ORDER;
	let selectedGrade = $state<IngredientGrade | 'all'>('all');

	// 언락된 재료
	let unlockedIngredients = $derived($unlockedIngredientsStore);

	// 필터링된 재료 목록
	let filteredIngredients = $derived(
		INGREDIENTS.filter((ing) => {
			// 언락 여부 체크
			if (!unlockedIngredients.includes(ing.id)) return false;
			// 등급 필터
			if (selectedGrade !== 'all' && ing.grade !== selectedGrade) return false;
			return true;
		})
	);

	// 재료 추가 (같은 재료도 추가 가능, 최대 2개)
	function addIngredient(id: number) {
		if (selectedIds.length < 2) {
			selectedIds = [...selectedIds, id];
		}
	}
</script>

<div class="ingredient-grid-container">
	<!-- 등급 필터 탭 -->
	<div class="grade-tabs">
		<button
			type="button"
			class="tab"
			class:active={selectedGrade === 'all'}
			onclick={() => (selectedGrade = 'all')}
		>
			전체
		</button>
		{#each grades as grade}
			<button
				type="button"
				class="tab"
				class:active={selectedGrade === grade}
				onclick={() => (selectedGrade = grade)}
				style="--grade-color: {GRADE_COLORS[grade]}"
			>
				{GRADE_NAMES[grade]}
			</button>
		{/each}
	</div>

	<!-- 재료 그리드 -->
	<div class="ingredient-grid">
		{#each filteredIngredients as ingredient (ingredient.id)}
			{@const selectionCount = selectedIds.filter((id) => id === ingredient.id).length}
			<button
				type="button"
				class="ingredient-card"
				class:selected={selectionCount > 0}
				class:selected-twice={selectionCount >= 2}
				onclick={() => addIngredient(ingredient.id)}
				style="--grade-color: {GRADE_COLORS[ingredient.grade]}"
			>
				<img src={ingredient.imageUrl} alt={ingredient.name} class="ingredient-image" />
				<div class="ingredient-name">{ingredient.name}</div>
				<div class="ingredient-grade" style="color: {GRADE_COLORS[ingredient.grade]}">{ingredient.grade}</div>
			</button>
		{/each}

		{#if filteredIngredients.length === 0}
			<div class="empty-message">
				<p>해당 등급의 재료가 없습니다</p>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.ingredient-grid-container {
		@apply flex flex-col;
		@apply h-full;
		@apply bg-base-100;
		@apply rounded-2xl;
		@apply border border-base-300;
		@apply shadow-lg;
		overflow: hidden;
	}

	.grade-tabs {
		@apply flex gap-2;
		@apply p-3;
		@apply bg-base-200;
		@apply border-b border-base-300;
		@apply overflow-x-auto;
		flex-shrink: 0;
	}

	.tab {
		@apply px-4 py-2;
		@apply rounded-lg;
		@apply font-medium;
		@apply transition-all;
		@apply whitespace-nowrap;
		@apply border-2 border-transparent;
		font-size: var(--font-xs);
		flex-shrink: 0;
	}

	.tab:hover {
		@apply bg-base-300;
	}

	.tab.active {
		@apply bg-primary text-primary-content;
		@apply border-primary;
		@apply shadow-md;
	}

	.ingredient-grid {
		@apply flex-1;
		@apply p-3;
		@apply overflow-y-auto;
		@apply grid grid-cols-3 gap-2;
		@apply content-start;
	}

	.ingredient-card {
		@apply aspect-square;
		@apply rounded-xl;
		@apply bg-white;
		@apply border-3 border-gray-200;
		@apply flex flex-col items-center justify-center gap-1;
		@apply p-2;
		@apply transition-all;
		@apply shadow-sm;
	}

	.ingredient-card:hover {
		@apply border-primary/50;
		@apply shadow-md;
		@apply scale-105;
	}

	.ingredient-card.selected {
		@apply bg-primary text-primary-content;
		@apply border-primary;
		@apply shadow-lg;
		@apply scale-95;
	}

	.ingredient-card.selected-twice {
		@apply bg-orange-500 text-white;
		@apply border-orange-600;
		box-shadow: 0 0 12px rgba(249, 115, 22, 0.6);
	}

	.ingredient-image {
		@apply w-12 h-12;
		@apply object-contain;
		@apply rounded-lg;
	}

	.ingredient-name {
		@apply font-bold text-center;
		font-size: var(--font-xs);
		@apply break-keep;
		@apply leading-tight;
	}

	.ingredient-grade {
		@apply font-bold;
		font-size: clamp(8px, 2vw, 10px);
	}

	.ingredient-card.selected .ingredient-grade {
		@apply text-primary-content/70;
	}

	.empty-message {
		@apply col-span-3;
		@apply flex items-center justify-center;
		@apply text-gray-400;
		@apply py-8;
	}
</style>
