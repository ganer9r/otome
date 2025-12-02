<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Star, Sparkles } from 'lucide-svelte';
	import { starStore, permanentUnlockStore, unlockedIngredientsStore } from '../lib/store';
	import { INGREDIENTS } from '../lib/data/ingredients';
	import { GRADE_COLORS, GRADE_ORDER, type IngredientGrade, type Ingredient } from '../lib/types';
	import UnlockDialog from '../components/UnlockDialog.svelte';

	// 다이얼로그 상태
	let selectedIngredient = $state<Ingredient | null>(null);
	let isDialogOpen = $state(false);

	// 보유 스타
	let totalStars = $derived($starStore);

	// 영구 해금 상태
	let permanentUnlocks = $derived($permanentUnlockStore);

	// 발견한 재료 (런에서 사용한 적 있는)
	let discoveredIds = $derived($unlockedIngredientsStore);

	// 선택된 등급 필터
	let selectedGrade = $state<IngredientGrade | 'all'>('all');

	// 해금 가능한 재료 목록 (G등급 제외, 재료만)
	let unlockableIngredients = $derived(
		INGREDIENTS.filter((ing) => {
			if (!ing.isIngredient) return false;
			if (ing.grade === 'G') return false;
			if (selectedGrade !== 'all' && ing.grade !== selectedGrade) return false;
			return true;
		})
	);

	// 해금 통계
	let unlockStats = $derived.by(() => {
		const total = INGREDIENTS.filter((ing) => ing.isIngredient && ing.grade !== 'G').length;
		const unlocked = INGREDIENTS.filter(
			(ing) => ing.isIngredient && ing.grade !== 'G' && permanentUnlocks.has(ing.id)
		).length;
		const discovered = INGREDIENTS.filter(
			(ing) => ing.isIngredient && ing.grade !== 'G' && discoveredIds.includes(ing.id)
		).length;
		return {
			total,
			unlocked,
			discovered,
			percentage: total > 0 ? Math.round((unlocked / total) * 100) : 0
		};
	});

	// 재료 카드 클릭
	function handleIngredientClick(ingredient: Ingredient) {
		if (!discoveredIds.includes(ingredient.id)) return;
		selectedIngredient = ingredient;
		isDialogOpen = true;
	}

	function handleDialogClose() {
		isDialogOpen = false;
		selectedIngredient = null;
	}

	function handleUnlockComplete() {
		// 해금 완료 후 처리
	}

	function goBack() {
		goto('/cook2/upgrade');
	}
</script>

<div class="unlock-container">
	<!-- 헤더 -->
	<header class="header">
		<button class="back-button" onclick={goBack}>
			<ArrowLeft size={24} />
		</button>
		<h1 class="title">재료 해금</h1>
		<div class="star-badge">
			<Star size={18} class="star-icon" />
			<span class="star-count">{totalStars}</span>
		</div>
	</header>

	<!-- 통계 카드 -->
	<div class="stats-card">
		<div class="stats-icon">
			<Sparkles size={32} />
		</div>
		<div class="stats-info">
			<div class="stats-row">
				<span class="stats-label">해금됨</span>
				<span class="stats-value">{unlockStats.unlocked} / {unlockStats.total}</span>
			</div>
			<div class="stats-bar">
				<div class="stats-bar-fill" style="width: {unlockStats.percentage}%"></div>
			</div>
			<div class="stats-row sub">
				<span class="stats-label">발견됨</span>
				<span class="stats-value">{unlockStats.discovered}개</span>
			</div>
		</div>
	</div>

	<!-- 안내 문구 -->
	<p class="info-text">
		게임에서 발견한 재료만 해금할 수 있어요.<br />
		해금한 재료는 다음 런에서 상점에 등장해요!
	</p>

	<!-- 등급 필터 -->
	<div class="grade-filter">
		<button
			class="grade-btn"
			class:active={selectedGrade === 'all'}
			onclick={() => (selectedGrade = 'all')}
		>
			전체
		</button>
		{#each GRADE_ORDER.filter((g) => g !== 'G') as grade}
			<button
				class="grade-btn"
				class:active={selectedGrade === grade}
				style="--grade-color: {GRADE_COLORS[grade]}"
				onclick={() => (selectedGrade = grade)}
			>
				{grade}
			</button>
		{/each}
	</div>

	<!-- 재료 그리드 -->
	<div class="ingredient-grid">
		{#each unlockableIngredients as ingredient}
			{@const isDiscovered = discoveredIds.includes(ingredient.id)}
			{@const isPermanentUnlocked = permanentUnlocks.has(ingredient.id)}

			<button
				class="ingredient-card"
				class:discovered={isDiscovered}
				class:locked={!isDiscovered}
				class:unlocked={isPermanentUnlocked}
				onclick={() => handleIngredientClick(ingredient)}
				disabled={!isDiscovered}
			>
				{#if isDiscovered}
					<img src={ingredient.imageUrl} alt={ingredient.name} class="card-image" />
					<span class="card-name">{ingredient.name}</span>
				{:else}
					<div class="card-silhouette">
						<img src={ingredient.imageUrl} alt="?" class="silhouette-img" />
					</div>
					<span class="card-name locked">???</span>
				{/if}

				<span class="card-grade" style="background-color: {GRADE_COLORS[ingredient.grade]}">
					{ingredient.grade}
				</span>

				{#if isPermanentUnlocked}
					<div class="card-check">✓</div>
				{/if}
			</button>
		{/each}

		{#if unlockableIngredients.length === 0}
			<div class="empty-message">해금 가능한 재료가 없습니다</div>
		{/if}
	</div>
</div>

<!-- 해금 다이얼로그 -->
<UnlockDialog
	ingredient={selectedIngredient}
	isOpen={isDialogOpen}
	onClose={handleDialogClose}
	onUnlock={handleUnlockComplete}
/>

<style lang="postcss">
	@reference '$styles/app.css';

	.unlock-container {
		@apply flex flex-col;
		@apply min-h-screen;
		@apply bg-base-100;
	}

	.header {
		@apply flex items-center justify-between;
		@apply px-4 py-3;
		@apply bg-base-200;
		@apply border-base-300 border-b;
	}

	.back-button {
		@apply p-2;
		@apply rounded-lg;
		@apply hover:bg-base-300;
		@apply transition-colors;
	}

	.title {
		@apply text-xl font-bold;
		@apply text-base-content;
	}

	.star-badge {
		@apply flex items-center gap-1;
		@apply px-3 py-1.5;
		@apply rounded-full;
		@apply bg-yellow-100;
	}

	.star-badge :global(.star-icon) {
		@apply text-yellow-500;
		fill: currentColor;
	}

	.star-count {
		@apply text-sm font-bold text-yellow-600;
	}

	/* 통계 카드 */
	.stats-card {
		@apply flex items-center gap-4;
		@apply mx-4 mt-4;
		@apply p-4;
		@apply rounded-2xl;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		@apply shadow-lg;
	}

	.stats-icon {
		@apply flex items-center justify-center;
		@apply h-16 w-16;
		@apply rounded-xl;
		@apply bg-white/20;
		@apply text-white;
		@apply backdrop-blur-sm;
	}

	.stats-info {
		@apply flex-1;
	}

	.stats-row {
		@apply flex items-center justify-between;
		@apply text-white;
	}

	.stats-row.sub {
		@apply mt-1;
		@apply text-white/70;
	}

	.stats-label {
		@apply text-sm;
	}

	.stats-value {
		@apply font-bold;
	}

	.stats-bar {
		@apply h-2;
		@apply mt-2 mb-1;
		@apply rounded-full;
		@apply bg-white/20;
		@apply overflow-hidden;
	}

	.stats-bar-fill {
		@apply h-full;
		@apply rounded-full;
		@apply bg-yellow-400;
		@apply transition-all duration-300;
	}

	/* 안내 문구 */
	.info-text {
		@apply text-center;
		@apply text-sm;
		@apply text-base-content/60;
		@apply px-4 py-3;
		@apply leading-relaxed;
	}

	/* 등급 필터 */
	.grade-filter {
		@apply flex gap-2;
		@apply px-4 py-2;
		@apply overflow-x-auto;
	}

	.grade-btn {
		@apply px-3 py-1.5;
		@apply rounded-full;
		@apply text-sm font-medium;
		@apply bg-base-200;
		@apply text-base-content/70;
		@apply transition-colors;
		@apply whitespace-nowrap;
	}

	.grade-btn.active {
		@apply bg-primary;
		@apply text-white;
	}

	/* 재료 그리드 */
	.ingredient-grid {
		@apply grid grid-cols-3 gap-2;
		@apply flex-1;
		@apply overflow-y-auto;
		@apply p-4;
	}

	.ingredient-card {
		@apply relative;
		@apply aspect-square;
		@apply rounded-xl;
		@apply bg-base-200;
		@apply flex flex-col items-center justify-center;
		@apply p-2;
		@apply border-2 border-transparent;
		@apply transition-all;
	}

	.ingredient-card.discovered {
		@apply border-base-300;
		@apply active:scale-95;
	}

	.ingredient-card.discovered:hover {
		@apply border-primary/50;
	}

	.ingredient-card.locked {
		@apply bg-base-300;
		@apply cursor-not-allowed;
	}

	.ingredient-card.unlocked {
		@apply border-green-400;
		@apply bg-green-50;
	}

	.card-image {
		@apply h-12 w-12;
		@apply object-contain;
		@apply mb-1;
	}

	.card-name {
		@apply text-xs font-medium;
		@apply text-base-content;
		@apply text-center;
		@apply truncate;
		@apply w-full;
	}

	.card-name.locked {
		@apply text-base-content/30;
	}

	.card-silhouette {
		@apply h-12 w-12;
		@apply flex items-center justify-center;
		@apply mb-1;
	}

	.silhouette-img {
		@apply h-full w-full;
		@apply object-contain;
		filter: brightness(0) opacity(0.2);
	}

	.card-grade {
		@apply absolute top-1 right-1;
		@apply px-1.5 py-0.5;
		@apply rounded;
		@apply text-xs font-bold text-white;
	}

	.card-check {
		@apply absolute right-1 bottom-1;
		@apply h-5 w-5;
		@apply rounded-full;
		@apply bg-green-500;
		@apply text-xs font-bold text-white;
		@apply flex items-center justify-center;
	}

	.empty-message {
		@apply col-span-3;
		@apply text-center;
		@apply py-8;
		@apply text-base-content/50;
	}
</style>
