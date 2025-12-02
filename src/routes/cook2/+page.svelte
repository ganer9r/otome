<script lang="ts">
	import { goto } from '$app/navigation';
	import { Play, Trophy, Utensils, Coins, ArrowUpCircle, Sparkles } from 'lucide-svelte';
	import { unlockedIngredientsStore, unlockedDishesStore, runStore, starStore } from './lib/store';
	import { INGREDIENTS } from './lib/data/ingredients';
	import { RECIPES } from './lib/data/recipes';

	// 런 상태
	let runState = $derived($runStore);

	// 보유 스타
	let totalStars = $derived($starStore);

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

	function continueGame() {
		goto('/cook2/play');
	}

	function goUpgrade() {
		goto('/cook2/upgrade');
	}

	function goUnlock() {
		goto('/cook2/unlock');
	}
</script>

<div class="home-container">
	<!-- 헤더 -->
	<header class="header">
		<div class="logo">
			<img src="/imgs/ui/icon_circle.png" alt="" class="logo-icon" />
			<h1 class="title">요리 대작전</h1>
		</div>
		<!-- 보유 스타 -->
		<div class="star-badge">
			<img src="/imgs/ui/star.png" alt="star" class="star-icon" />
			<span class="star-count">{totalStars}</span>
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

	<!-- 런 상태 카드 (진행 중일 때) -->
	{#if runState.isRunning}
		<section class="run-section">
			<div class="run-card">
				<div class="run-header">
					<Coins size={24} class="text-yellow-500" />
					<span class="run-title">진행 중인 런</span>
				</div>
				<div class="run-capital">
					{runState.capital.toLocaleString()}원
				</div>
				<div class="run-turn">
					턴 {runState.turn}
				</div>
			</div>
		</section>
	{/if}

	<!-- 메인 버튼 -->
	<section class="action-section">
		<div class="button-group">
			{#if runState.isRunning}
				<button class="game-button primary" onclick={continueGame}>
					<Play size={28} />
					<span>계속하기</span>
				</button>
			{:else}
				<button class="game-button primary" onclick={startGame}>
					<Play size={28} />
					<span>요리 시작!</span>
				</button>
			{/if}

			<div class="sub-buttons">
				<button class="game-button secondary" onclick={goUpgrade}>
					<ArrowUpCircle size={20} />
					<span>업그레이드</span>
				</button>
				<button class="game-button secondary" onclick={goUnlock}>
					<Sparkles size={20} />
					<span>재료 해금</span>
				</button>
			</div>
		</div>
	</section>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.home-container {
		@apply flex flex-col items-center;
		@apply min-h-full;
		@apply p-6;
		@apply relative;
		background: linear-gradient(to bottom, #fff8e1, #ffecb3);
	}

	.header {
		@apply py-6;
	}

	.logo {
		@apply flex flex-col items-center gap-2;
	}

	.logo-icon {
		width: 56px;
		height: 56px;
		filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
	}

	.title {
		@apply text-3xl font-bold;
		color: #5d4037;
		text-shadow:
			2px 2px 0 #fff,
			-1px -1px 0 #fff,
			1px -1px 0 #fff,
			-1px 1px 0 #fff;
	}

	.progress-section {
		@apply w-full max-w-sm;
		@apply flex flex-col gap-3;
		@apply my-6;
	}

	.progress-card {
		@apply rounded-2xl;
		@apply p-4;
		background: rgba(255, 255, 255, 0.85);
		border: 3px solid #e8d4a8;
		box-shadow:
			0 4px 8px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.progress-header {
		@apply flex items-center gap-2;
		@apply text-sm font-bold;
		color: #6d4c41;
		@apply mb-2;
	}

	.progress-bar {
		@apply h-4;
		background: #e0d4c0;
		@apply rounded-full;
		@apply overflow-hidden;
		border: 2px solid #c9b896;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.progress-fill {
		@apply h-full;
		background: linear-gradient(to bottom, #ffb74d, #ff9800);
		@apply rounded-full;
		@apply transition-all duration-500;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.progress-fill.recipe {
		background: linear-gradient(to bottom, #81c784, #4caf50);
	}

	.progress-text {
		@apply text-right;
		@apply text-sm font-bold;
		color: #8d6e63;
		@apply mt-1;
	}

	.action-section {
		@apply flex-1;
		@apply flex items-center justify-center;
		@apply w-full;
	}

	.button-group {
		@apply flex flex-col gap-4;
		@apply w-full max-w-xs;
	}

	/* 게임 버튼 - 이미지 기반 */
	.game-button {
		@apply flex items-center justify-center gap-3;
		@apply w-full;
		@apply font-bold;
		@apply transition-transform active:scale-95;
		border: none;
		background: none;
		position: relative;
		cursor: pointer;
	}

	.game-button.primary {
		@apply py-5;
		@apply text-xl;
		color: #5d4037;
		background: url('/imgs/ui/button_rectangle_depth_flat.png') center/100% 100% no-repeat;
		min-height: 70px;
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
	}

	.game-button.primary:hover {
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2)) brightness(1.05);
	}

	.game-button.primary:active {
		filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2)) brightness(0.95);
	}

	.game-button.secondary {
		@apply flex-1;
		@apply py-3;
		@apply text-sm;
		color: #5d4037;
		background: url('/imgs/ui/button_rectangle_depth_gradient.png') center/100% 100% no-repeat;
		min-height: 52px;
		filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.15));
	}

	.game-button.secondary:hover {
		filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.15)) brightness(1.05);
	}

	/* 런 상태 카드 */
	.run-section {
		@apply w-full max-w-sm;
		@apply mb-4;
	}

	.run-card {
		@apply rounded-2xl;
		@apply p-4;
		@apply text-center;
		background: linear-gradient(to bottom, #fff8e1, #ffecb3);
		border: 3px solid #ffc107;
		box-shadow:
			0 4px 8px rgba(0, 0, 0, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.run-header {
		@apply flex items-center justify-center gap-2;
		@apply mb-2;
	}

	.run-title {
		@apply text-sm font-bold;
		color: #f57c00;
	}

	.run-capital {
		@apply text-3xl font-bold;
		color: #e65100;
		text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
	}

	.run-turn {
		@apply text-sm font-medium;
		color: #ff9800;
		@apply mt-1;
	}

	/* 서브 버튼 그룹 */
	.sub-buttons {
		@apply flex gap-3;
		@apply w-full;
	}

	/* 스타 뱃지 */
	.star-badge {
		@apply flex items-center gap-1;
		@apply px-4 py-2;
		@apply rounded-full;
		@apply absolute top-6 right-6;
		background: linear-gradient(to bottom, #fff8e1, #ffecb3);
		border: 3px solid #ffc107;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
	}

	.star-icon {
		width: 24px;
		height: 24px;
	}

	.star-count {
		@apply text-base font-bold;
		color: #e65100;
	}
</style>
