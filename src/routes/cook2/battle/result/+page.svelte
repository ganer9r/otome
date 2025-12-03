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
		imageUrl: '/imgs/ingredients2/301.webp'
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

<div class="result-container" class:win={isWin} class:lose={!isWin}>
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
		@apply h-full min-h-screen;
		@apply px-6 py-8;
	}

	.result-container.win {
		background: linear-gradient(180deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%);
	}

	.result-container.lose {
		background: linear-gradient(180deg, #3d1f1f 0%, #5c2e2e 50%, #7a3e3e 100%);
	}

	/* ===== 결과 헤더 ===== */
	.result-header {
		@apply flex flex-col items-center;
		@apply py-8;
	}

	.result-icon {
		font-size: 64px;
		animation: bounce 1s ease-in-out;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	.result-title {
		@apply font-black;
		font-size: 48px;
		text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.result-title.win {
		color: #ffd700;
	}

	.result-title.lose {
		color: #9ca3af;
	}

	/* ===== 점수 비교 ===== */
	.score-comparison {
		@apply flex items-center justify-center;
		@apply gap-4;
		@apply py-6;
	}

	.score-card {
		@apply flex flex-col items-center;
		@apply px-4 py-4;
		@apply rounded-xl;
		@apply min-w-24;
		background: rgba(255, 255, 255, 0.1);
	}

	.score-label {
		font-size: 12px;
		color: #9ca3af;
	}

	.dish-name {
		@apply font-bold text-white;
		font-size: 14px;
		@apply my-1;
	}

	.score-value {
		@apply font-black;
		font-size: 24px;
	}

	.my-score .score-value {
		color: #4caf50;
	}

	.opponent-score .score-value {
		color: #f44336;
	}

	.vs {
		@apply font-black;
		font-size: 20px;
		color: #ffd700;
	}

	/* ===== 보상 영역 ===== */
	.reward-area {
		@apply flex flex-col items-center;
		@apply py-6;
	}

	.reward-title {
		@apply font-bold text-white;
		font-size: 18px;
		@apply mb-3;
	}

	.reward-recipe {
		@apply flex items-center gap-4;
		@apply px-5 py-4;
		@apply rounded-xl;
		background: rgba(255, 215, 0, 0.15);
		border: 2px solid rgba(255, 215, 0, 0.5);
	}

	.recipe-image {
		@apply h-16 w-16;
		@apply rounded-lg;
		@apply overflow-hidden;
		background: rgba(255, 255, 255, 0.1);
	}

	.recipe-image img {
		@apply h-full w-full object-contain;
	}

	.recipe-emoji {
		@apply flex items-center justify-center;
		@apply h-full w-full;
		font-size: 40px;
	}

	.recipe-info {
		@apply flex flex-col;
	}

	.recipe-name {
		@apply font-black;
		font-size: 18px;
		color: #ffd700;
	}

	.recipe-grade {
		@apply font-bold;
		font-size: 14px;
		color: #9ca3af;
	}

	.reward-desc {
		@apply mt-3;
		font-size: 14px;
		color: #9ca3af;
	}

	/* ===== 버튼 영역 ===== */
	.action-area {
		@apply flex-1;
		@apply flex flex-col items-center justify-end;
		@apply gap-3;
		@apply pb-6;
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
		transform: scale(0.98);
	}

	.action-btn.primary {
		color: #fff;
		background: linear-gradient(180deg, #ff7043 0%, #f4511e 50%, #d84315 100%);
		border: none;
		border-bottom: 4px solid #bf360c;
	}

	.action-btn.secondary {
		color: #fff;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}
</style>
