<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { unlockedIngredientsStore, unlockedDishesStore, runStore, starStore } from './lib/store';
	import { customerStore } from './lib/customer-store';
	import { missionStore } from './lib/mission-store';
	import { DAILY_MISSIONS } from './lib/data/missions';
	import type { MissionProgress } from './lib/types';
	import { INGREDIENTS } from './lib/data/ingredients';
	import { RECIPES } from './lib/data/recipes';
	import { getChefImage, getRandomDialogue } from './lib/chef-images';
	import { getChefByStage } from './battle/lib/chef-data';
	import { battleStore } from './battle/lib/battle-store';

	// 런 상태
	let runState = $derived($runStore);

	// 손님 주문 상태
	let customerState = $derived($customerStore);
	let currentOrder = $derived(customerState.currentOrder);

	// 긴급도 계산
	let turnsUntilTax = $derived(runStore.getTurnsUntilTax(runState.turn));
	let urgencyLevel = $derived((): 1 | 2 | 3 => {
		if (turnsUntilTax <= 2) return 3; // 긴급
		if (turnsUntilTax <= 5) return 2; // 보통
		return 1; // 여유
	});
	let customerEmoji = $derived(() => {
		if (currentOrder?.completed) return '😄';
		switch (urgencyLevel()) {
			case 3:
				return '😰';
			case 2:
				return '😐';
			default:
				return '😊';
		}
	});
	let orderBorderColor = $derived(() => {
		if (currentOrder?.completed) return '#22c55e';
		switch (urgencyLevel()) {
			case 3:
				return '#ef4444'; // 빨강
			case 2:
				return '#f59e0b'; // 노랑
			default:
				return '#22c55e'; // 초록
		}
	});

	// 보유 스타
	let totalStars = $derived($starStore);

	// 통계 계산
	let totalIngredients = INGREDIENTS.filter((i) => i.isIngredient).length;
	let totalRecipes = RECIPES.length;
	let unlockedIngredients = $derived($unlockedIngredientsStore.length);
	let unlockedDishes = $derived($unlockedDishesStore.size);

	// 캐릭터
	const chefImage = getChefImage('default');
	let greeting = $state(getRandomDialogue('default'));

	onMount(() => {
		greeting = getRandomDialogue('default');

		// 런 중인데 오더가 없으면 생성
		if (runState.isRunning && !currentOrder) {
			customerStore.generateOrder(runState.turn);
		}
	});

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

	function goCollection() {
		goto('/cook2/collection');
	}

	function goMission() {
		goto('/cook2/mission');
	}

	function goMy() {
		goto('/cook2/my');
	}

	// 미수령 미션 개수
	let unclaimedMissions = $derived(missionStore.getUnclaimedCount());

	// 일일 미션 진행도
	let missionProgress = $derived($missionStore);

	function getMissionProgress(missionId: string): MissionProgress {
		return (
			missionProgress[missionId] || { missionId, current: 0, completed: false, claimed: false }
		);
	}

	function claimMission(missionId: string) {
		missionStore.claimReward(missionId);
	}
	function goBattle() {
		goto('/cook2/battle');
	}

	// 현재 대결 상대 (실제 데이터)
	const clearedStage = battleStore.getClearedStage();
	const currentChef = getChefByStage(clearedStage + 1);
</script>

<div class="home-container">
	<!-- 헤더: 타이틀 + 리소스 -->
	<header class="top-bar">
		<button class="settings-btn" onclick={goMy}>⚙️</button>
		<h1 class="game-title">흑백의 셰프</h1>
		<div class="resource-group">
			<div class="resource-badge star">
				<img src="/imgs/ui/star.png" alt="star" class="resource-icon" />
				<span class="resource-value">{totalStars}</span>
			</div>
		</div>
	</header>

	<!-- 캐릭터 영역 -->
	<div class="character-area">
		<div class="speech-bubble">
			<span>{greeting}</span>
		</div>
		<img src={chefImage} alt="셰프" class="character-img" />
	</div>

	<!-- 런 진행 중 표시 -->
	{#if runState.isRunning}
		<div class="run-status">
			<div class="run-info">
				<span class="run-badge">PLAYING</span>
				<span class="run-capital">{runState.capital.toLocaleString()}원</span>
			</div>
		</div>
	{/if}

	<!-- 일일 미션 -->
	<div class="daily-missions">
		<div class="mission-header">
			<span class="mission-title">오늘의 미션</span>
			<button class="mission-more" onclick={goMission}>더보기 →</button>
		</div>
		<div class="mission-list">
			{#each DAILY_MISSIONS as mission (mission.id)}
				{@const progress = getMissionProgress(mission.id)}
				<div
					class="mission-item"
					class:completed={progress.completed}
					class:claimed={progress.claimed}
				>
					<div class="mission-info">
						<span class="mission-name">{mission.title}</span>
						<span class="mission-progress">{progress.current}/{mission.target}</span>
					</div>
					{#if progress.claimed}
						<span class="mission-done">✓</span>
					{:else if progress.completed}
						<button class="mission-claim" onclick={() => claimMission(mission.id)}
							>+{mission.reward}⭐</button
						>
					{:else}
						<span class="mission-reward">+{mission.reward}⭐</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- 메인 플레이 버튼 -->
	<div class="main-action">
		{#if runState.isRunning}
			<!-- 손님 오더 뱃지 (버튼 왼쪽 레이어) -->
			{#if currentOrder && !currentOrder.completed}
				<div
					class="order-preview"
					class:urgent={urgencyLevel() === 3}
					style="--border-color: {orderBorderColor()}"
				>
					<span class="order-emoji">{customerEmoji()}</span>
					<span class="order-dish">{currentOrder.dish.name}</span>
				</div>
			{/if}
			<button class="play-button" onclick={continueGame}>
				<span class="play-icon">▶</span>
				<span class="play-text">계속하기</span>
			</button>
		{:else}
			<button class="play-button" onclick={startGame}>
				<span class="play-icon">▶</span>
				<span class="play-text">요리 시작</span>
			</button>
		{/if}
	</div>

	<!-- 하단 메뉴 버튼들 -->
	<nav class="bottom-menu">
		<button class="menu-btn" onclick={goCollection}>
			<div class="menu-icon-wrap">
				<span class="menu-icon">📖</span>
			</div>
			<span class="menu-label">도감</span>
			<span class="menu-badge">{unlockedDishes}/{totalRecipes}</span>
		</button>

		<button class="menu-btn" onclick={goUpgrade}>
			<div class="menu-icon-wrap">
				<span class="menu-icon">⬆️</span>
			</div>
			<span class="menu-label">강화</span>
		</button>

		<button class="menu-btn" onclick={goUnlock}>
			<div class="menu-icon-wrap">
				<span class="menu-icon">🔓</span>
			</div>
			<span class="menu-label">해금</span>
			<span class="menu-badge">{unlockedIngredients}/{totalIngredients}</span>
		</button>

		<button class="menu-btn" onclick={goMission}>
			<div class="menu-icon-wrap">
				<span class="menu-icon">🎯</span>
			</div>
			<span class="menu-label">미션</span>
		</button>
	</nav>
	<!-- 플로팅 대결 버튼 (임시 비활성화)
	{#if currentChef}
		<button class="floating-battle" onclick={goBattle}>
			<span class="floating-icon">{currentChef.emoji}</span>
			<span class="floating-vs">VS</span>
			<span class="floating-badge">Stage {currentChef.stage}</span>
		</button>
	{:else}
		<button class="floating-battle complete" onclick={goBattle}>
			<span class="floating-icon">🏆</span>
			<span class="floating-badge">완료!</span>
		</button>
	{/if}
	-->
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.home-container {
		@apply flex flex-col;
		@apply h-full w-full;
		@apply relative;
		background: linear-gradient(180deg, #4a90c2 0%, #7bb8d9 40%, #a8d4ea 70%, #d4eaf5 100%);
	}

	/* ===== 헤더 ===== */
	.top-bar {
		@apply relative;
		@apply flex items-center justify-center;
		@apply px-3 py-2;
		@apply z-20;
	}

	.game-title {
		@apply text-center font-black;
		font-size: 24px;
		color: #fff;
		text-shadow:
			0 2px 0 #c17a30,
			0 3px 0 #8b5a20;
		letter-spacing: 1px;
		-webkit-text-stroke: 1px #8b5a20;
		paint-order: stroke fill;
	}

	.settings-btn {
		@apply absolute left-3;
		@apply h-8 w-8;
		@apply flex items-center justify-center;
		@apply rounded-full;
		font-size: 14px;
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid #8b7355;
		box-shadow: 0 2px 0 #5c4a38;
	}

	.resource-group {
		@apply absolute right-3;
		@apply flex gap-1;
	}

	.resource-badge {
		@apply flex items-center gap-1;
		@apply px-2 py-1;
		@apply rounded-full;
		background: linear-gradient(180deg, #3d3d3d 0%, #1a1a1a 100%);
		border: 2px solid #5a5a5a;
		box-shadow: 0 2px 0 #0d0d0d;
	}

	.resource-icon {
		width: 16px;
		height: 16px;
	}

	.resource-value {
		@apply font-bold text-white;
		font-size: 12px;
	}

	/* ===== 캐릭터 영역 ===== */
	.character-area {
		@apply flex-1;
		@apply flex flex-col items-center justify-center;
		@apply relative px-3;
		margin-top: -10px;
	}

	.speech-bubble {
		@apply relative;
		@apply px-3 py-1.5;
		@apply rounded-xl;
		@apply font-bold;
		font-size: 13px;
		color: #4a3728;
		background: #fff;
		border: 2px solid #4a3728;
		box-shadow: 0 2px 0 #2d2218;
		margin-bottom: 8px;
	}

	.speech-bubble::after {
		content: '';
		@apply absolute;
		bottom: -8px;
		left: 50%;
		transform: translateX(-50%);
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 8px solid #4a3728;
	}

	.speech-bubble::before {
		content: '';
		@apply absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 7px solid #fff;
		z-index: 1;
	}

	.character-img {
		width: 180px;
		height: auto;
		filter: drop-shadow(0 4px 0 rgba(0, 0, 0, 0.15));
	}

	/* ===== 런 상태 ===== */
	.run-status {
		@apply flex justify-center;
		@apply px-3 py-1;
	}

	.run-info {
		@apply flex items-center gap-2;
		@apply px-3 py-1;
		@apply rounded-full;
		background: linear-gradient(180deg, #3d3d3d 0%, #1a1a1a 100%);
		border: 2px solid #5a5a5a;
		box-shadow: 0 2px 0 #0d0d0d;
	}

	.run-badge {
		@apply rounded px-1.5 py-0.5;
		@apply font-black;
		font-size: 10px;
		background: #4caf50;
		color: white;
	}

	.run-capital {
		@apply font-bold text-white;
		font-size: 12px;
	}

	/* ===== 플레이 버튼 ===== */
	.main-action {
		@apply relative flex justify-center;
		@apply px-4 py-2;
	}

	/* 손님 오더 미리보기 (버튼 왼쪽 레이어) */
	.order-preview {
		@apply absolute;
		@apply flex items-center gap-1;
		@apply px-2 py-1;
		@apply rounded-lg;
		right: calc(50% + 105px);
		background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
		border: 2px solid var(--border-color);
		box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
		animation: orderWobble 2s ease-in-out infinite;
	}

	.order-preview.urgent {
		animation: orderShake 0.3s ease-in-out infinite;
	}

	/* 기본 흔들흔들 (멈춤 → 흔들 → 멈춤 → 흔들) */
	@keyframes orderWobble {
		0%,
		15% {
			transform: rotate(0deg);
		}
		18% {
			transform: rotate(-3deg);
		}
		21% {
			transform: rotate(3deg);
		}
		24% {
			transform: rotate(-2deg);
		}
		27% {
			transform: rotate(2deg);
		}
		30% {
			transform: rotate(0deg);
		}
		30%,
		100% {
			transform: rotate(0deg);
		}
	}

	/* 긴급 흔들림 */
	@keyframes orderShake {
		0%,
		100% {
			transform: translateX(0) rotate(0deg);
		}
		20% {
			transform: translateX(-2px) rotate(-2deg);
		}
		40% {
			transform: translateX(2px) rotate(2deg);
		}
		60% {
			transform: translateX(-2px) rotate(-1deg);
		}
		80% {
			transform: translateX(2px) rotate(1deg);
		}
	}

	.order-emoji {
		font-size: 18px;
	}

	.order-dish {
		@apply font-bold;
		font-size: 10px;
		color: #78350f;
		max-width: 50px;
		line-height: 1.2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		word-break: break-all;
	}

	.play-button {
		@apply flex items-center justify-center gap-2;
		@apply w-full py-3;
		@apply rounded-xl;
		@apply font-black;
		max-width: 200px;
		font-size: 16px;
		color: #fff;
		background: linear-gradient(180deg, #7cc576 0%, #4caf50 50%, #3d9140 100%);
		border: none;
		border-bottom: 3px solid #2d6b2f;
		box-shadow:
			0 3px 0 #1e4620,
			0 5px 10px rgba(0, 0, 0, 0.3);
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
	}

	.play-icon {
		font-size: 14px;
	}

	/* ===== 플로팅 대결 버튼 ===== */
	.floating-battle {
		@apply absolute;
		@apply flex flex-col items-center justify-center;
		@apply rounded-full;
		right: 8px;
		top: 90px;
		width: 36px;
		height: 36px;
		background: #fff;
		border: 2px solid #d84315;
		z-index: 50;
	}

	.floating-icon {
		font-size: 16px;
	}

	.floating-vs {
		@apply absolute;
		@apply px-1 py-0.5;
		@apply rounded;
		@apply font-black;
		bottom: -6px;
		background: #fff;
		color: #d84315;
		border: 1px solid #d84315;
		font-size: 8px;
	}

	.floating-badge {
		@apply absolute;
		@apply font-bold whitespace-nowrap;
		bottom: -22px;
		font-size: 10px;
		color: #4a3728;
	}

	/* ===== 하단 메뉴 ===== */
	.bottom-menu {
		@apply flex gap-2;
		@apply px-3 py-3 pb-4;
		background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
	}

	.menu-btn {
		@apply flex flex-col items-center gap-0.5;
		@apply px-1 py-1.5;
		@apply rounded-lg;
		@apply relative flex-1;
		background: linear-gradient(180deg, #fff 0%, #e8e8e8 100%);
		border: 2px solid #8b7355;
		border-bottom-width: 3px;
		box-shadow: 0 2px 0 #5c4a38;
	}

	.menu-icon-wrap {
		@apply flex items-center justify-center;
		width: 18px;
		height: 18px;
	}

	.menu-icon {
		font-size: 14px;
	}

	.menu-label {
		@apply font-bold;
		font-size: 10px;
		color: #4a3728;
	}

	.menu-badge {
		@apply absolute -top-2 -right-1;
		@apply px-1.5 py-1;
		@apply rounded-full;
		@apply font-bold;
		font-size: 9px;
		background: #ff5722;
		color: white;
		border: 1px solid #fff;
	}

	.menu-badge.alert {
		background: #ff5722;
	}

	/* ===== 일일 미션 ===== */
	.daily-missions {
		@apply mx-3 mb-1;
		@apply overflow-hidden rounded-xl;
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid #8b7355;
		box-shadow: 0 2px 0 #5c4a38;
	}

	.mission-header {
		@apply flex items-center justify-between;
		@apply px-3 py-1;
		background: linear-gradient(180deg, #8b7355 0%, #6d5a45 100%);
	}

	.mission-title {
		@apply font-bold;
		font-size: 11px;
		color: #fff;
	}

	.mission-more {
		@apply font-bold;
		font-size: 10px;
		color: #ffd54f;
	}

	.mission-list {
		@apply flex flex-col;
	}

	.mission-item {
		@apply flex items-center justify-between;
		@apply px-3 py-1;
		border-bottom: 1px solid #e8d4a8;
	}

	.mission-item:last-child {
		border-bottom: none;
	}

	.mission-item.completed {
		background: rgba(76, 175, 80, 0.1);
	}

	.mission-item.claimed {
		opacity: 0.5;
	}

	.mission-info {
		@apply flex items-center gap-1;
	}

	.mission-name {
		@apply font-bold;
		font-size: 10px;
		color: #4a3728;
	}

	.mission-progress {
		font-size: 9px;
		color: #8b7355;
	}

	.mission-reward {
		@apply font-bold;
		font-size: 9px;
		color: #ffc107;
	}

	.mission-claim {
		@apply px-1.5 py-0.5;
		@apply rounded;
		@apply font-bold;
		font-size: 9px;
		background: linear-gradient(180deg, #ffd54f 0%, #ffb300 100%);
		color: #5d4037;
		border: 1px solid #ff8f00;
		animation: pulse 1s ease-in-out infinite;
	}

	.mission-done {
		@apply font-bold;
		font-size: 12px;
		color: #4caf50;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}
</style>
