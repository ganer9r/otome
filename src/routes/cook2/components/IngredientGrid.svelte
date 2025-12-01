<script lang="ts">
	import {
		unlockedIngredientsStore,
		triedCombinationsStore,
		successCombinationsStore,
		newIngredientsStore
	} from '../lib/store';
	import { INGREDIENTS, findIngredientById } from '../lib/data/ingredients';
	import { GRADE_COLORS, GRADE_NAMES, GRADE_ORDER } from '../lib/types';
	import type { IngredientGrade, Ingredient } from '../lib/types';

	interface Props {
		/** 선택된 재료 ID 배열 (양방향 바인딩) */
		selectedIds: number[];
		/** 재료 선택 시 콜백 (좌표 정보 포함) */
		onSelect?: (ingredient: Ingredient, rect: DOMRect) => void;
	}

	let { selectedIds = $bindable(), onSelect }: Props = $props();

	// 등급 필터 탭 (G, F, E, D, C, B, A, R)
	const grades: IngredientGrade[] = GRADE_ORDER;
	let selectedGrade = $state<IngredientGrade | 'all'>('all');

	// 언락된 재료
	let unlockedIngredients = $derived($unlockedIngredientsStore);

	// 새로 획득한 재료 (NEW 뱃지)
	let newIngredientIds = $derived($newIngredientsStore);

	// 첫 번째 재료가 선택되었을 때, 이미 시도한 조합의 두 번째 재료 목록
	let triedPairIds = $derived(
		selectedIds.length === 1 ? triedCombinationsStore.getTriedPairsFor(selectedIds[0]) : []
	);

	// 첫 번째 재료가 선택되었을 때, 성공한 조합의 결과 맵 { secondIngredientId: resultIngredientId }
	let successResultsMap = $derived(
		selectedIds.length === 1 ? successCombinationsStore.getSuccessResultsFor(selectedIds[0]) : {}
	);

	// 필터링된 재료 목록 (isIngredient: true인 것만)
	let filteredIngredients = $derived(
		INGREDIENTS.filter((ing) => {
			// 재료만 표시 (요리는 제외)
			if (!ing.isIngredient) return false;
			// 언락 여부 체크
			if (!unlockedIngredients.includes(ing.id)) return false;
			// 등급 필터
			if (selectedGrade !== 'all' && ing.grade !== selectedGrade) return false;
			return true;
		})
	);

	// 재료 추가 (같은 재료도 추가 가능, 최대 2개)
	function addIngredient(ingredient: Ingredient, event: MouseEvent) {
		if (selectedIds.length < 2) {
			const target = event.currentTarget as HTMLElement;
			const rect = target.getBoundingClientRect();

			// 콜백으로 좌표 전달 (애니메이션용)
			onSelect?.(ingredient, rect);

			selectedIds = [...selectedIds, ingredient.id];
			// NEW 뱃지 제거
			newIngredientsStore.markSeen(ingredient.id);
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
			{@const isTried = triedPairIds.includes(ingredient.id)}
			{@const isNew = newIngredientIds.has(ingredient.id)}
			{@const resultId = successResultsMap[ingredient.id]}
			{@const resultIngredient = resultId ? findIngredientById(resultId) : null}
			<button
				type="button"
				class="ingredient-card"
				class:tried={isTried && selectedIds.length === 1}
				class:is-new={isNew}
				onclick={(e) => addIngredient(ingredient, e)}
				style="--grade-color: {GRADE_COLORS[ingredient.grade]}"
			>
				<img src={ingredient.imageUrl} alt={ingredient.name} class="ingredient-image" />
				<div class="ingredient-name">{ingredient.name}</div>
				<div class="ingredient-grade" style="color: {GRADE_COLORS[ingredient.grade]}">
					{ingredient.grade}
				</div>
				{#if isNew}
					<div class="new-badge">NEW</div>
				{/if}
				{#if resultIngredient && selectedIds.length === 1}
					<div class="result-badge">
						<img src={resultIngredient.imageUrl} alt={resultIngredient.name} class="result-image" />
					</div>
				{/if}
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
		overflow: hidden;
	}

	.grade-tabs {
		@apply flex gap-1;
		@apply px-2 py-1.5;
		@apply bg-base-200;
		@apply border-base-300 border-b;
		@apply overflow-x-auto;
		flex-shrink: 0;
	}

	.tab {
		@apply px-3 py-1;
		@apply rounded-md;
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
		@apply shadow-sm;
		@apply outline-none;
		@apply relative;
	}

	.ingredient-card:active {
		animation: cardPop 0.2s ease-out;
	}

	@keyframes cardPop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(0.9);
		}
		100% {
			transform: scale(1);
		}
	}

	/* 이미 시도한 조합 (딤 처리) */
	.ingredient-card.tried {
		@apply opacity-40;
		@apply bg-gray-100;
		filter: grayscale(50%);
	}

	/* NEW 뱃지 */
	.ingredient-card.is-new {
		@apply border-emerald-400;
		animation: newGlow 1.5s ease-in-out infinite;
	}

	@keyframes newGlow {
		0%,
		100% {
			box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
		}
		50% {
			box-shadow: 0 0 16px rgba(16, 185, 129, 0.7);
		}
	}

	.new-badge {
		@apply absolute -top-1 -left-1;
		@apply px-1.5 py-0.5;
		@apply bg-emerald-500 text-white;
		@apply rounded-md;
		@apply text-xs font-bold;
		@apply shadow-md;
		animation: newBadgePulse 1s ease-in-out infinite;
	}

	@keyframes newBadgePulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.ingredient-image {
		@apply h-12 w-12;
		@apply object-contain;
		@apply rounded-lg;
	}

	.ingredient-name {
		@apply text-center font-bold;
		font-size: var(--font-xs);
		@apply break-keep;
		@apply leading-tight;
	}

	.ingredient-grade {
		@apply font-bold;
		font-size: clamp(8px, 2vw, 10px);
	}

	.empty-message {
		@apply col-span-3;
		@apply flex items-center justify-center;
		@apply text-gray-400;
		@apply py-8;
	}

	/* 결과 요리 뱃지 (우하단) */
	.result-badge {
		@apply absolute -right-1 -bottom-1;
		@apply h-7 w-7;
		@apply rounded-full;
		@apply bg-white;
		@apply border-2 border-orange-400;
		@apply shadow-md;
		@apply flex items-center justify-center;
		@apply overflow-hidden;
	}

	.result-image {
		@apply h-5 w-5;
		@apply object-contain;
	}
</style>
