<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { battleStore } from '../lib/battle-store';
	import { findIngredientById } from '../../lib/data/ingredients';

	// 대결 상태
	let battleState = $derived($battleStore);

	// 결과 정보
	let isWin = $derived(battleState.result === 'win');
	let myDish = $derived(
		battleState.selectedRecipeId ? findIngredientById(battleState.selectedRecipeId) : null
	);
	let myScore = $derived(battleState.myScore);
	let opponentPower = $derived(battleState.currentChef?.power ?? 0);

	// 보상 레시피 (샘플 - 김치찌개)
	const rewardRecipe = {
		id: 301,
		name: '김치찌개',
		grade: 'D',
		imageUrl: '/imgs/ingredients2/203.webp'
	};

	onMount(() => {
		// 대결 결과가 없으면 돌아가기
		if (!battleState.result) {
			goto('/cook2/battle');
			return;
		}
	});

	function goHome() {
		battleStore.endBattle();
		goto('/cook2');
	}

	function retryBattle() {
		// 다시 대결 시작
		if (battleState.currentChef) {
			battleStore.startBattle(battleState.currentChef);
			goto('/cook2/battle/select');
		} else {
			goto('/cook2/battle');
		}
	}

	function nextBattle() {
		battleStore.endBattle();
		goto('/cook2/battle');
	}
</script>

<div class="result-container">
	<!-- 결과 텍스트 -->
	<div class="result-header">
		{#if isWin}
			<div class="result-icon">🎉</div>
			<h1 class="result-title win">승리!</h1>
		{:else}
			<div class="result-icon">😢</div>
			<h1 class="result-title lose">패배...</h1>
		{/if}
	</div>

	<!-- 점수 비교 -->
	<div class="score-comparison">
		<div class="score-card my-score">
			<span class="score-label">내 요리</span>
			{#if myDish}
				<span class="dish-name">{myDish.name}</span>
			{/if}
			<span class="score-value">{myScore}점</span>
		</div>

		<div class="vs">VS</div>

		<div class="score-card opponent-score">
			<span class="score-label">상대</span>
			<span class="dish-name">{battleState.currentChef?.name ?? '???'}</span>
			<span class="score-value">{opponentPower}점</span>
		</div>
	</div>

	<!-- 보상 (승리 시) -->
	{#if isWin}
		<div class="reward-area">
			<h2 class="reward-title">특별 레시피 획득!</h2>
			<div class="reward-recipe-wrapper">
				<div class="reward-recipe">
					<div class="recipe-image">
						{#if rewardRecipe.imageUrl}
							<img src={rewardRecipe.imageUrl} alt={rewardRecipe.name} />
						{:else}
							<span class="recipe-emoji">🍲</span>
						{/if}
					</div>
					<div class="recipe-info">
						<span class="recipe-name">{rewardRecipe.name}</span>
						<span class="recipe-grade">{rewardRecipe.grade}급 레시피</span>
					</div>
				</div>
			</div>
			<p class="reward-desc">이제 이 요리를 만들 수 있습니다!</p>
		</div>
	{/if}

	<!-- 버튼들 -->
	<div class="action-area">
		{#if isWin}
			<button class="action-btn primary" onclick={nextBattle}> 다음 대결 </button>
			<button class="action-btn secondary" onclick={goHome}> 홈으로 </button>
		{:else}
			<button class="action-btn primary" onclick={retryBattle}> 다시 도전 </button>
			<button class="action-btn secondary" onclick={goHome}> 홈으로 </button>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.result-container {
		@apply flex flex-col;
		@apply h-screen;
		@apply px-4 py-4;
		@apply overflow-hidden;
		background: linear-gradient(180deg, #e8956c 0%, #f0b08a 40%, #f5c9a8 70%, #fae4d4 100%);
	}

	/* ===== 결과 헤더 ===== */
	.result-header {
		@apply flex flex-col items-center;
		@apply py-4;
	}

	.result-icon {
		font-size: 48px;
		animation: bounce 1s ease-in-out;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.result-title {
		@apply font-black;
		font-size: 36px;
		-webkit-text-stroke: 2px #5c2e0a;
		paint-order: stroke fill;
	}

	.result-title.win {
		color: #ffd700;
		text-shadow:
			0 3px 0 #8b6914,
			0 6px 0 #5c4a0a;
	}

	.result-title.lose {
		color: #8b7355;
		text-shadow:
			0 3px 0 #5c4a38,
			0 6px 0 #3d3028;
	}

	/* ===== 점수 비교 ===== */
	.score-comparison {
		@apply flex items-center justify-center;
		@apply gap-3;
		@apply py-3;
	}

	.score-card {
		@apply flex flex-col items-center;
		@apply px-4 py-3;
		@apply rounded-xl;
		@apply min-w-24;
		background: rgba(255, 255, 255, 0.9);
		border: 3px solid #e0c4a8;
	}

	.score-label {
		font-size: 11px;
		color: #8b7355;
	}

	.dish-name {
		@apply font-bold;
		font-size: 13px;
		color: #4a3728;
	}

	.score-value {
		@apply font-black;
		font-size: 20px;
	}

	.my-score .score-value {
		color: #1a1a1a;
	}

	.opponent-score .score-value {
		color: #d84315;
	}

	.vs {
		@apply font-black;
		font-size: 18px;
		color: #fff;
		background: linear-gradient(180deg, #ff7043 0%, #d84315 100%);
		@apply px-2 py-1;
		@apply rounded-lg;
		border: 2px solid #bf360c;
	}

	/* ===== 보상 영역 ===== */
	.reward-area {
		@apply flex flex-col items-center;
		@apply py-3;
	}

	.reward-title {
		@apply font-black;
		font-size: 16px;
		color: #4a3728;
		@apply mb-2;
	}

	.reward-recipe-wrapper {
		@apply relative;
		@apply rounded-xl;
		padding: 3px;
		background: linear-gradient(90deg, #c9a227, #ffd700, #fff5cc, #ffd700, #c9a227);
		background-size: 200% 100%;
		animation: shimmer 2s linear infinite;
	}

	.reward-recipe {
		@apply flex items-center gap-3;
		@apply px-4 py-3;
		@apply rounded-lg;
		background: #fff;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.recipe-image {
		@apply h-12 w-12;
		@apply rounded-lg;
		@apply overflow-hidden;
		background: #f5f5f5;
	}

	.recipe-image img {
		@apply h-full w-full object-contain;
	}

	.recipe-emoji {
		@apply flex items-center justify-center;
		@apply h-full w-full;
		font-size: 32px;
	}

	.recipe-info {
		@apply flex flex-col;
	}

	.recipe-name {
		@apply font-black;
		font-size: 15px;
		color: #4a3728;
	}

	.recipe-grade {
		@apply font-bold;
		font-size: 12px;
		color: #8b7355;
	}

	.reward-desc {
		@apply mt-2;
		font-size: 12px;
		color: #5c3d15;
	}

	/* ===== 버튼 영역 ===== */
	.action-area {
		@apply flex-1;
		@apply flex flex-col items-center justify-end;
		@apply gap-2;
		@apply pb-4;
	}

	.action-btn {
		@apply w-full max-w-xs;
		@apply py-4;
		@apply rounded-2xl;
		@apply font-black;
		font-size: 18px;
		cursor: pointer;
		transition: transform 0.1s;
	}

	.action-btn:active {
		transform: translateY(2px);
	}

	.action-btn.primary {
		color: #fff;
		background: linear-gradient(180deg, #ff7043 0%, #f4511e 50%, #d84315 100%);
		border: none;
		border-bottom: 4px solid #bf360c;
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
	}

	.action-btn.primary:active {
		border-bottom-width: 2px;
	}

	.action-btn.secondary {
		color: #4a3728;
		background: rgba(255, 255, 255, 0.9);
		border: 3px solid #8b7355;
	}
</style>
