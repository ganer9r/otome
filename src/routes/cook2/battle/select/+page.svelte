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
							<span class="dish-price">{dish.sellPrice ?? 0}점</span>
						</div>
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
		background: linear-gradient(180deg, #e8956c 0%, #f0b08a 40%, #f5c9a8 70%, #fae4d4 100%);
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
		background: linear-gradient(180deg, #3d3d3d 0%, #1a1a1a 100%);
		border: 3px solid #5a5a5a;
		box-shadow: 0 4px 0 #0d0d0d;
		color: #fff;
		font-size: 20px;
	}

	.title {
		@apply font-black;
		font-size: 28px;
		color: #fff;
		text-shadow:
			0 3px 0 #8b4513,
			0 6px 0 #5c2e0a;
		-webkit-text-stroke: 2px #5c2e0a;
		paint-order: stroke fill;
	}

	.spacer {
		@apply w-10;
	}

	/* ===== 안내 ===== */
	.guide {
		@apply text-center;
		@apply px-4 py-4;
		color: #5c3d15;
		font-size: 15px;
		font-weight: 500;
	}

	.opponent-power {
		@apply mt-2;
		@apply inline-block;
		@apply px-4 py-2;
		@apply rounded-full;
		@apply font-bold;
		background: linear-gradient(180deg, #3d3d3d 0%, #1a1a1a 100%);
		border: 3px solid #5a5a5a;
		color: #ffd700;
		font-size: 14px;
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
		@apply rounded-2xl;
		background: linear-gradient(180deg, #fff 0%, #f0f0f0 100%);
		border: 4px solid #8b7355;
		border-bottom-width: 6px;
		box-shadow: 0 4px 0 #5c4a38;
		cursor: pointer;
		transition: transform 0.1s;
	}

	.dish-card:active {
		transform: translateY(3px);
		border-bottom-width: 3px;
		box-shadow: 0 1px 0 #5c4a38;
	}

	.dish-image {
		@apply flex items-center justify-center;
		@apply aspect-square w-full;
		@apply rounded-xl;
		@apply mb-2;
		background: #f5f5f5;
		border: 2px solid #e0c4a8;
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
		@apply font-bold;
		font-size: 14px;
		color: #4a3728;
	}

	.dish-meta {
		@apply flex items-center justify-between;
	}

	.dish-grade {
		@apply font-bold;
		font-size: 12px;
	}

	.dish-price {
		@apply font-black;
		font-size: 13px;
		color: #d84315;
	}
</style>
