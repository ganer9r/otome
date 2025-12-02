<script lang="ts">
	import { goto } from '$app/navigation';
	import { ChefHat, Play, Trophy, Utensils } from 'lucide-svelte';
	import { unlockedIngredientsStore, unlockedDishesStore } from './lib/store';
	import { INGREDIENTS } from './lib/data/ingredients';
	import { RECIPES } from './lib/data/recipes';

	// 통계 계산
	let totalIngredients = INGREDIENTS.filter((i) => i.isIngredient).length;
	let totalRecipes = RECIPES.length;
	let unlockedIngredients = $derived($unlockedIngredientsStore.length);
	let unlockedDishes = $derived($unlockedDishesStore.size);

	let ingredientProgress = $derived(Math.round((unlockedIngredients / totalIngredients) * 100));
	let recipeProgress = $derived(Math.round((unlockedDishes / totalRecipes) * 100));

	function startGame() {
		goto('/cook2/play');
	}
</script>

<div class="home-container">
	<!-- 헤더 -->
	<header class="header">
		<div class="logo">
			<ChefHat size={40} class="text-primary" />
			<h1 class="title">요리 대작전</h1>
		</div>
	</header>

	<!-- 진행률 카드 -->
	<section class="progress-section">
		<div class="progress-card">
			<div class="progress-header">
				<Utensils size={20} />
				<span>재료 수집</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {ingredientProgress}%"></div>
			</div>
			<div class="progress-text">
				{unlockedIngredients} / {totalIngredients}
			</div>
		</div>

		<div class="progress-card">
			<div class="progress-header">
				<Trophy size={20} />
				<span>레시피 발견</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill recipe" style="width: {recipeProgress}%"></div>
			</div>
			<div class="progress-text">
				{unlockedDishes} / {totalRecipes}
			</div>
		</div>
	</section>

	<!-- 메인 버튼 -->
	<section class="action-section">
		<button class="start-button" onclick={startGame}>
			<Play size={32} />
			<span>요리 시작!</span>
		</button>
	</section>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.home-container {
		@apply flex flex-col items-center;
		@apply min-h-full;
		@apply p-6;
		@apply from-base-200 to-base-100 bg-gradient-to-b;
	}

	.header {
		@apply py-8;
	}

	.logo {
		@apply flex flex-col items-center gap-2;
	}

	.title {
		@apply text-3xl font-bold;
		@apply text-base-content;
	}

	.progress-section {
		@apply w-full max-w-sm;
		@apply flex flex-col gap-4;
		@apply my-8;
	}

	.progress-card {
		@apply bg-base-100;
		@apply rounded-xl;
		@apply p-4;
		@apply shadow-md;
	}

	.progress-header {
		@apply flex items-center gap-2;
		@apply text-sm font-medium;
		@apply text-base-content/70;
		@apply mb-2;
	}

	.progress-bar {
		@apply h-3;
		@apply bg-base-300;
		@apply rounded-full;
		@apply overflow-hidden;
	}

	.progress-fill {
		@apply h-full;
		@apply bg-primary;
		@apply rounded-full;
		@apply transition-all duration-500;
	}

	.progress-fill.recipe {
		@apply bg-secondary;
	}

	.progress-text {
		@apply text-right;
		@apply text-sm;
		@apply text-base-content/50;
		@apply mt-1;
	}

	.action-section {
		@apply flex-1;
		@apply flex items-center justify-center;
		@apply w-full;
	}

	.start-button {
		@apply flex items-center justify-center gap-3;
		@apply w-full max-w-xs;
		@apply py-5;
		@apply bg-primary;
		@apply text-primary-content;
		@apply text-xl font-bold;
		@apply rounded-2xl;
		@apply shadow-lg;
		@apply transition-transform active:scale-95;
	}

	.start-button:hover {
		@apply bg-primary/90;
	}
</style>
