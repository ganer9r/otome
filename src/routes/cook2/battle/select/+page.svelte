<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { battleStore } from '../lib/battle-store';
	import { buildRecipeTree, getStepCount } from '../lib/recipe-tree';
	import { getUnlockedDishIds } from '../../lib/store';
	import { findIngredientById } from '../../lib/data/ingredients';
	import { GRADE_COLORS } from '../../lib/types';
	import type { Ingredient } from '../../lib/types';

	// 대결 상태
	let battleState = $derived($battleStore);

	// 발견한 요리(레시피) 목록
	let unlockedDishes: Ingredient[] = $state([]);

	// 테스트용 샘플 요리 ID들 (F, E, D 등급 요리)
	// 113: 해물무침(F), 115: 샐러드(F), 215: 국밥(E), 216: 비빔밥(E), 219: 햄버거(E)
	const SAMPLE_DISH_IDS = [113, 115, 215, 216, 219];

	onMount(() => {
		// 대결 중이 아니면 메인으로
		if (!battleState.isInBattle) {
			goto('/cook2/battle');
			return;
		}

		// 발견한 요리 목록 가져오기
		const dishIds = getUnlockedDishIds();
		let dishes = Array.from(dishIds)
			.map((id) => findIngredientById(id))
			.filter((ing): ing is Ingredient => ing !== undefined);

		// 발견한 요리가 없으면 샘플 요리 사용
		if (dishes.length === 0) {
			dishes = SAMPLE_DISH_IDS.map((id) => findIngredientById(id)).filter(
				(ing): ing is Ingredient => ing !== undefined
			);
		}

		// 판매가 높은 순 정렬
		unlockedDishes = dishes.sort((a, b) => (b.sellPrice ?? 0) - (a.sellPrice ?? 0));
	});

	function goBack() {
		goto('/cook2/battle');
	}

	function selectRecipe(dish: Ingredient) {
		// 레시피 조합 트리 계산
		const steps = buildRecipeTree(dish.id);

		// Store에 저장
		battleStore.selectRecipe(dish.id, steps);

		// 조리 화면으로
		goto('/cook2/battle/cook');
	}

	function getGradeColor(grade: string): string {
		return GRADE_COLORS[grade as keyof typeof GRADE_COLORS] ?? '#9CA3AF';
	}
</script>

<div class="select-container">
	<!-- 헤더 -->
	<header class="header">
		<button class="back-btn" onclick={goBack}>
			<span>←</span>
		</button>
		<h1 class="title">요리 선택</h1>
		<div class="spacer"></div>
	</header>

	<!-- 안내 -->
	<div class="guide">
		<p>대결에 사용할 요리를 선택하세요</p>
		{#if battleState.currentChef}
			<p class="opponent-power">상대 실력: {battleState.currentChef.power}점</p>
		{/if}
	</div>

	<!-- 요리 목록 -->
	<div class="dish-grid">
		{#if unlockedDishes.length === 0}
			<div class="empty-state">
				<p>발견한 요리가 없습니다.</p>
				<p class="sub">자유 요리에서 레시피를 발견하세요!</p>
			</div>
		{:else}
			{#each unlockedDishes as dish}
				{@const stepCount = getStepCount(dish.id)}
				<button class="dish-card" onclick={() => selectRecipe(dish)}>
					<div class="dish-image">
						{#if dish.imageUrl}
							<img src={dish.imageUrl} alt={dish.name} />
						{:else}
							<span class="dish-emoji">🍳</span>
						{/if}
					</div>
					<div class="dish-info">
						<span class="dish-name">{dish.name}</span>
						<div class="dish-meta">
							<span class="dish-grade" style="color: {getGradeColor(dish.grade)}">
								{dish.grade}급
							</span>
							<span class="dish-price">{dish.sellPrice ?? 0}원</span>
						</div>
						<span class="dish-steps">{stepCount}단계</span>
					</div>
				</button>
			{/each}
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.select-container {
		@apply flex flex-col;
		@apply h-full min-h-screen;
		background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
	}

	/* ===== 헤더 ===== */
	.header {
		@apply flex items-center justify-between;
		@apply px-4 py-3;
	}

	.back-btn {
		@apply flex items-center justify-center;
		@apply h-10 w-10;
		@apply rounded-full;
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
		font-size: 20px;
	}

	.title {
		@apply font-black text-white;
		font-size: 24px;
	}

	.spacer {
		@apply w-10;
	}

	/* ===== 안내 ===== */
	.guide {
		@apply text-center;
		@apply px-4 py-4;
		color: #9ca3af;
		font-size: 14px;
	}

	.opponent-power {
		@apply mt-1;
		@apply font-bold;
		color: #f44336;
	}

	/* ===== 요리 목록 ===== */
	.dish-grid {
		@apply flex-1;
		@apply grid grid-cols-2 gap-3;
		@apply px-4 pb-6;
		@apply overflow-auto;
	}

	.empty-state {
		@apply col-span-2;
		@apply flex flex-col items-center justify-center;
		@apply py-12;
		color: #9ca3af;
	}

	.empty-state .sub {
		@apply mt-2;
		font-size: 14px;
		color: #6b7280;
	}

	.dish-card {
		@apply flex flex-col;
		@apply p-3;
		@apply rounded-xl;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.1);
		cursor: pointer;
		transition: all 0.2s;
	}

	.dish-card:hover {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.dish-card:active {
		transform: scale(0.98);
	}

	.dish-image {
		@apply flex items-center justify-center;
		@apply aspect-square w-full;
		@apply rounded-lg;
		@apply mb-2;
		background: rgba(255, 255, 255, 0.05);
		overflow: hidden;
	}

	.dish-image img {
		@apply h-full w-full object-contain;
	}

	.dish-emoji {
		font-size: 48px;
	}

	.dish-info {
		@apply flex flex-col gap-1;
	}

	.dish-name {
		@apply font-bold text-white;
		font-size: 14px;
	}

	.dish-meta {
		@apply flex items-center gap-2;
	}

	.dish-grade {
		@apply font-bold;
		font-size: 12px;
	}

	.dish-price {
		@apply font-bold;
		font-size: 12px;
		color: #ffd700;
	}

	.dish-steps {
		font-size: 11px;
		color: #9ca3af;
	}
</style>
