<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { unlockedIngredientsStore, unlockedDishesStore, runStore, starStore } from './lib/store';
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
			{#if unclaimedMissions > 0}
				<span class="menu-badge alert">{unclaimedMissions}</span>
			{/if}
		</button>
	</nav>

	<!-- 플로팅 대결 버튼 -->
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
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.home-container {
		@apply flex flex-col;
		@apply h-full w-full;
		@apply relative;
		background: linear-gradient(180deg, #4a90c2 0%, #7bb8d9 40%, #a8d4ea 70%, #d4eaf5 100%);
	}

	/* ===== 헤더: 타이틀 + 리소스 ===== */
	.top-bar {
		@apply relative;
		@apply flex items-center justify-center;
		@apply px-4 py-3;
		@apply z-20;
	}

	.game-title {
		@apply font-black;
		@apply text-center;
		font-size: 48px;
		color: #fff;
		text-shadow:
			0 3px 0 #c17a30,
			0 6px 0 #8b5a20;
		letter-spacing: 2px;
		-webkit-text-stroke: 2px #8b5a20;
		paint-order: stroke fill;
	}

	.settings-btn {
		@apply absolute left-4;
		@apply h-11 w-11;
		@apply flex items-center justify-center;
		@apply rounded-full;
		font-size: 24px;
		background: rgba(255, 255, 255, 0.9);
		border: 3px solid #8b7355;
		box-shadow: 0 3px 0 #5c4a38;
		cursor: pointer;
	}

	.settings-btn:active {
		box-shadow: 0 1px 0 #5c4a38;
		transform: translateY(2px);
	}

	.resource-group {
		@apply absolute right-4;
		@apply flex gap-2;
	}

	.resource-badge {
		@apply flex items-center gap-1;
		@apply px-3 py-1.5;
		@apply rounded-full;
		background: linear-gradient(180deg, #3d3d3d 0%, #1a1a1a 100%);
		border: 3px solid #5a5a5a;
		box-shadow:
			0 4px 0 #0d0d0d,
			inset 0 2px 0 rgba(255, 255, 255, 0.1);
	}

	.resource-icon {
		width: 24px;
		height: 24px;
	}

	.resource-value {
		@apply font-bold text-white;
		font-size: 16px;
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.5);
	}

	/* ===== 캐릭터 영역 ===== */
	.character-area {
		@apply flex-1;
		@apply flex flex-col items-center justify-center;
		@apply relative;
		@apply px-4;
		margin-top: -20px;
	}

	.speech-bubble {
		@apply relative;
		@apply px-6 py-3;
		@apply rounded-3xl;
		@apply font-bold;
		font-size: 22px;
		color: #4a3728;
		background: #fff;
		border: 4px solid #4a3728;
		box-shadow: 0 4px 0 #2d2218;
		margin-bottom: 16px;
	}

	.speech-bubble::after {
		content: '';
		@apply absolute;
		bottom: -16px;
		left: 50%;
		transform: translateX(-50%);
		border-left: 12px solid transparent;
		border-right: 12px solid transparent;
		border-top: 16px solid #4a3728;
	}

	.speech-bubble::before {
		content: '';
		@apply absolute;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%);
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 14px solid #fff;
		z-index: 1;
	}

	.character-img {
		width: 280px;
		height: auto;
		filter: drop-shadow(0 8px 0 rgba(0, 0, 0, 0.15));
	}

	/* ===== 런 상태 ===== */
	.run-status {
		@apply flex justify-center;
		@apply px-4 py-2;
	}

	.run-info {
		@apply flex items-center gap-3;
		@apply px-5 py-2;
		@apply rounded-full;
		background: linear-gradient(180deg, #3d3d3d 0%, #1a1a1a 100%);
		border: 3px solid #5a5a5a;
		box-shadow: 0 4px 0 #0d0d0d;
	}

	.run-badge {
		@apply px-2 py-0.5;
		@apply rounded;
		@apply text-xs font-black;
		background: #4caf50;
		color: white;
	}

	.run-capital {
		@apply font-bold text-white;
		font-size: 18px;
	}

	/* ===== 메인 플레이 버튼 ===== */
	.main-action {
		@apply flex justify-center;
		@apply px-6 py-4;
	}

	.play-button {
		@apply flex items-center justify-center gap-3;
		@apply w-full;
		max-width: 320px;
		@apply py-5;
		@apply rounded-2xl;
		@apply font-black;
		font-size: 28px;
		color: #fff;
		background: linear-gradient(180deg, #7cc576 0%, #4caf50 50%, #3d9140 100%);
		border: none;
		border-bottom: 6px solid #2d6b2f;
		box-shadow:
			0 6px 0 #1e4620,
			0 10px 20px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		text-shadow: 0 3px 0 rgba(0, 0, 0, 0.3);
		transition:
			transform 0.1s,
			box-shadow 0.1s;
	}

	.play-button:active {
		transform: translateY(4px);
		border-bottom-width: 2px;
		box-shadow:
			0 2px 0 #1e4620,
			0 4px 10px rgba(0, 0, 0, 0.3);
	}

	.play-icon {
		font-size: 24px;
	}

	/* ===== 플로팅 대결 버튼 ===== */
	.floating-battle {
		@apply absolute;
		@apply flex flex-col items-center justify-center;
		right: 16px;
		top: 180px;
		width: 56px;
		height: 56px;
		@apply rounded-full;
		background: #fff;
		border: 3px solid #d84315;
		cursor: pointer;
		z-index: 50;
		transition: transform 0.1s;
	}

	.floating-battle:active {
		transform: scale(0.95);
	}

	.floating-icon {
		font-size: 28px;
	}

	.floating-vs {
		@apply absolute;
		@apply px-1.5 py-0.5;
		@apply rounded;
		@apply font-black;
		bottom: -10px;
		background: #fff;
		color: #d84315;
		border: 2px solid #d84315;
		font-size: 10px;
		z-index: 10;
	}

	.floating-badge {
		@apply absolute;
		bottom: -38px;
		@apply text-xs font-bold;
		@apply whitespace-nowrap;
		color: #4a3728;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	/* ===== 하단 메뉴 ===== */
	.bottom-menu {
		@apply flex gap-3;
		@apply px-4 py-6;
		@apply pb-8;
		background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
	}

	.menu-btn {
		@apply flex flex-col items-center gap-0.5;
		@apply px-1 py-2;
		@apply rounded-xl;
		@apply relative;
		@apply flex-1;
		background: linear-gradient(180deg, #fff 0%, #e8e8e8 100%);
		border: 3px solid #8b7355;
		border-bottom-width: 4px;
		box-shadow: 0 3px 0 #5c4a38;
		cursor: pointer;
		transition: transform 0.1s;
	}

	.menu-btn:active {
		transform: translateY(2px);
		border-bottom-width: 2px;
		box-shadow: 0 1px 0 #5c4a38;
	}

	.menu-icon-wrap {
		@apply flex items-center justify-center;
		width: 28px;
		height: 28px;
	}

	.menu-icon {
		font-size: 24px;
	}

	.menu-label {
		@apply font-bold;
		font-size: 13px;
		color: #4a3728;
	}

	.menu-badge {
		@apply absolute -top-2 -right-2;
		@apply px-2 py-0.5;
		@apply rounded-full;
		@apply text-xs font-bold;
		background: #ff5722;
		color: white;
		border: 2px solid #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.menu-badge.alert {
		background: #f44336;
		animation: pulse 1s ease-in-out infinite;
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

	/* ===== 일일 미션 ===== */
	.daily-missions {
		@apply mx-4 mb-2;
		@apply rounded-2xl;
		@apply overflow-hidden;
		background: rgba(255, 255, 255, 0.9);
		border: 3px solid #8b7355;
		box-shadow: 0 4px 0 #5c4a38;
	}

	.mission-header {
		@apply flex items-center justify-between;
		@apply px-4 py-2;
		background: linear-gradient(180deg, #8b7355 0%, #6d5a45 100%);
	}

	.mission-title {
		@apply font-bold;
		color: #fff;
		font-size: 14px;
	}

	.mission-more {
		@apply font-bold;
		color: #ffd54f;
		font-size: 12px;
	}

	.mission-list {
		@apply flex flex-col;
	}

	.mission-item {
		@apply flex items-center justify-between;
		@apply px-4 py-2;
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
		@apply flex items-center gap-2;
	}

	.mission-name {
		@apply font-bold;
		font-size: 13px;
		color: #4a3728;
	}

	.mission-progress {
		font-size: 12px;
		color: #8b7355;
	}

	.mission-reward {
		font-size: 12px;
		color: #ffc107;
		font-weight: bold;
	}

	.mission-claim {
		@apply px-2 py-1;
		@apply rounded-lg;
		@apply font-bold;
		font-size: 12px;
		background: linear-gradient(180deg, #ffd54f 0%, #ffb300 100%);
		color: #5d4037;
		border: 2px solid #ff8f00;
		animation: pulse 1s ease-in-out infinite;
	}

	.mission-done {
		@apply font-bold;
		font-size: 16px;
		color: #4caf50;
	}
</style>
