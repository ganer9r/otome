<script lang="ts">
	import { unlockedIngredientsStore } from '../lib/store';
	import { INGREDIENTS } from '../lib/data/ingredients';
	import type { IngredientGrade } from '../lib/types';

	interface Props {
		/** 선택된 재료 ID 배열 (양방향 바인딩) */
		selectedIds: string[];
	}

	let { selectedIds = $bindable() }: Props = $props();

	// 등급 필터 탭
	const grades: IngredientGrade[] = ['basic', 'common', 'rare', 'epic', 'legendary'];
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

	// 재료 선택/해제
	function toggleIngredient(id: string) {
		if (selectedIds.includes(id)) {
			// 이미 선택된 경우 제거
			selectedIds = selectedIds.filter((i) => i !== id);
		} else {
			// 선택되지 않은 경우 추가 (최대 2개)
			if (selectedIds.length < 2) {
				selectedIds = [...selectedIds, id];
			}
		}
	}

	// 등급별 한글 이름
	const gradeNames: Record<IngredientGrade, string> = {
		basic: '기본',
		common: '일반',
		rare: '희귀',
		epic: '영웅',
		legendary: '전설'
	};
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
			>
				{gradeNames[grade]}
			</button>
		{/each}
	</div>

	<!-- 재료 그리드 -->
	<div class="ingredient-grid">
		{#each filteredIngredients as ingredient (ingredient.id)}
			{@const isSelected = selectedIds.includes(ingredient.id)}
			<button
				type="button"
				class="ingredient-card"
				class:selected={isSelected}
				onclick={() => toggleIngredient(ingredient.id)}
			>
				<div class="ingredient-name">{ingredient.name}</div>
				<div class="ingredient-category">{ingredient.category}</div>
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

	.ingredient-name {
		@apply font-bold text-center;
		font-size: var(--font-xs);
		@apply break-keep;
		@apply leading-tight;
	}

	.ingredient-category {
		@apply text-gray-500;
		font-size: clamp(8px, 2vw, 10px);
	}

	.ingredient-card.selected .ingredient-category {
		@apply text-primary-content/70;
	}

	.empty-message {
		@apply col-span-3;
		@apply flex items-center justify-center;
		@apply text-gray-400;
		@apply py-8;
	}
</style>
