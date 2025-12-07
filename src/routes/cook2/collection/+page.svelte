<script lang="ts">
	import { unlockedIngredientsStore } from '../lib/store';
	import { INGREDIENTS, findIngredientById } from '../lib/data/ingredients';
	import { RECIPES } from '../lib/data/recipes';
	import { GRADE_COLORS, GRADE_NAMES, GRADE_ORDER } from '../lib/types';
	import type { IngredientGrade, Ingredient } from '../lib/types';
	import GameHeader from '../components/GameHeader.svelte';

	// 등급 필터 탭
	const grades: IngredientGrade[] = GRADE_ORDER;
	let selectedGrade = $state<IngredientGrade | 'all'>('all');

	// 탭: 재료 / 요리 / 레시피
	let selectedTab = $state<'ingredients' | 'dishes' | 'recipes'>('ingredients');

	// 언락된 재료
	let unlockedIds = $derived($unlockedIngredientsStore);

	// 필터링된 재료 목록
	let filteredIngredients = $derived(
		INGREDIENTS.filter((ing) => {
			if (!ing.isIngredient) return false;
			if (selectedGrade !== 'all' && ing.grade !== selectedGrade) return false;
			return true;
		})
	);

	// 필터링된 요리 목록
	let filteredDishes = $derived(
		INGREDIENTS.filter((ing) => {
			if (ing.isIngredient) return false;
			if (selectedGrade !== 'all' && ing.grade !== selectedGrade) return false;
			return true;
		})
	);

	// 레시피: 해금된 요리의 레시피만 표시
	let discoveredRecipes = $derived(
		RECIPES.filter((r) => unlockedIds.includes(r.resultIngredientId))
	);
</script>

<div class="collection-container">
	<GameHeader title="도감" backHref="/cook2" />

	<!-- 탭 선택 -->
	<div class="tab-bar">
		<button
			class="main-tab"
			class:active={selectedTab === 'ingredients'}
			onclick={() => (selectedTab = 'ingredients')}
		>
			재료
		</button>
		<button
			class="main-tab"
			class:active={selectedTab === 'dishes'}
			onclick={() => (selectedTab = 'dishes')}
		>
			요리
		</button>
		<button
			class="main-tab"
			class:active={selectedTab === 'recipes'}
			onclick={() => (selectedTab = 'recipes')}
		>
			레시피
		</button>
	</div>

	<!-- 등급 필터 (레시피 제외) -->
	{#if selectedTab !== 'recipes'}
		<div class="grade-tabs">
			<button
				class="tab"
				class:active={selectedGrade === 'all'}
				onclick={() => (selectedGrade = 'all')}
			>
				전체
			</button>
			{#each grades as grade}
				<button
					class="tab"
					class:active={selectedGrade === grade}
					onclick={() => (selectedGrade = grade)}
				>
					{GRADE_NAMES[grade]}
				</button>
			{/each}
		</div>
	{/if}

	<div class="collection-content">
		{#if selectedTab === 'ingredients'}
			<div class="item-grid">
				{#each filteredIngredients as item (item.id)}
					{@const isUnlocked = unlockedIds.includes(item.id)}
					<div
						class="item-card"
						class:locked={!isUnlocked}
						style="--grade-color: {GRADE_COLORS[item.grade]}"
					>
						{#if isUnlocked}
							<img src={item.imageUrl} alt={item.name} class="item-image" />
							<div class="item-name">{item.name}</div>
						{:else}
							<div class="locked-image">
								<img src={item.imageUrl} alt="?" class="silhouette" />
							</div>
							<div class="locked-text">?</div>
						{/if}
						<div class="item-grade" style="color: {GRADE_COLORS[item.grade]}">
							{item.grade}
						</div>
					</div>
				{/each}
			</div>
		{:else if selectedTab === 'dishes'}
			<div class="item-grid">
				{#each filteredDishes as item (item.id)}
					{@const isUnlocked = unlockedIds.includes(item.id)}
					<div
						class="item-card dish"
						class:locked={!isUnlocked}
						style="--grade-color: {GRADE_COLORS[item.grade]}"
					>
						{#if isUnlocked}
							<img src={item.imageUrl} alt={item.name} class="item-image" />
							<div class="item-name">{item.name}</div>
						{:else}
							<div class="locked-image">
								<img src={item.imageUrl} alt="?" class="silhouette" />
							</div>
							<div class="locked-text">?</div>
						{/if}
						<div class="item-grade" style="color: {GRADE_COLORS[item.grade]}">
							{item.grade}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- 레시피 목록 -->
			<div class="recipe-list">
				{#each discoveredRecipes as recipe (recipe.resultIngredientId)}
					{@const result = findIngredientById(recipe.resultIngredientId)}
					{@const ing1 = findIngredientById(recipe.ingredientIds[0])}
					{@const ing2 = findIngredientById(recipe.ingredientIds[1])}
					{#if result && ing1 && ing2}
						<div class="recipe-card">
							<div class="recipe-inputs">
								<img src={ing1.imageUrl} alt={ing1.name} class="recipe-img" />
								<span class="plus">+</span>
								<img src={ing2.imageUrl} alt={ing2.name} class="recipe-img" />
							</div>
							<span class="arrow">=</span>
							<div class="recipe-output">
								<img src={result.imageUrl} alt={result.name} class="recipe-img result" />
								<span class="result-name">{result.name}</span>
							</div>
						</div>
					{/if}
				{/each}
				{#if discoveredRecipes.length === 0}
					<div class="empty-state">아직 발견한 레시피가 없습니다</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.collection-container {
		@apply flex flex-col;
		@apply h-full w-full;
		@apply bg-base-100;
	}

	/* 메인 탭 */
	.tab-bar {
		@apply flex gap-2;
		@apply px-4 pb-2;
	}

	.main-tab {
		@apply flex-1;
		@apply py-2;
		@apply rounded-lg;
		@apply font-medium;
		@apply bg-base-200;
		@apply transition-all;
	}

	.main-tab.active {
		@apply bg-primary text-primary-content;
	}

	/* 등급 필터 */
	.grade-tabs {
		@apply flex gap-1;
		@apply px-4 pb-2;
		@apply overflow-x-auto;
	}

	.tab {
		@apply px-3 py-1;
		@apply rounded-md;
		@apply text-sm font-medium;
		@apply bg-base-200;
		@apply whitespace-nowrap;
	}

	.tab.active {
		@apply bg-primary text-primary-content;
	}

	.collection-content {
		@apply flex-1;
		@apply overflow-auto;
		@apply p-4;
	}

	/* 아이템 그리드 */
	.item-grid {
		@apply grid grid-cols-3 gap-2;
	}

	.item-card {
		@apply aspect-square;
		@apply rounded-xl;
		@apply bg-white;
		@apply border-2 border-gray-200;
		@apply flex flex-col items-center justify-center gap-1;
		@apply p-2;
		@apply shadow-sm;
	}

	.item-card.dish {
		@apply border-amber-300 bg-amber-50;
	}

	.item-card.locked {
		@apply border-gray-300 bg-gray-200;
	}

	.item-image {
		@apply h-12 w-12;
		@apply object-contain;
	}

	.item-name {
		@apply text-center font-bold;
		@apply text-xs;
		@apply leading-tight;
	}

	.item-grade {
		@apply text-xs font-bold;
	}

	.locked-image {
		@apply h-12 w-12;
		@apply flex items-center justify-center;
	}

	.silhouette {
		@apply h-full w-full object-contain;
		filter: brightness(0) opacity(0.3);
	}

	.locked-text {
		@apply font-bold text-gray-400;
	}

	/* 레시피 리스트 */
	.recipe-list {
		@apply flex flex-col gap-3;
	}

	.recipe-card {
		@apply flex items-center gap-3;
		@apply p-3;
		@apply bg-white;
		@apply rounded-xl;
		@apply shadow-sm;
	}

	.recipe-inputs {
		@apply flex items-center gap-2;
	}

	.recipe-img {
		@apply h-10 w-10;
		@apply object-contain;
		@apply rounded-lg;
		@apply bg-base-200;
		@apply p-1;
	}

	.recipe-img.result {
		@apply h-12 w-12;
		@apply bg-amber-100;
	}

	.plus,
	.arrow {
		@apply font-bold text-gray-400;
	}

	.recipe-output {
		@apply flex items-center gap-2;
		@apply ml-auto;
	}

	.result-name {
		@apply text-sm font-bold;
	}

	.empty-state {
		@apply text-center;
		@apply text-gray-400;
		@apply py-8;
	}
</style>
