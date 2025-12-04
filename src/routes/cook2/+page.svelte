<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { unlockedIngredientsStore, unlockedDishesStore, runStore, starStore } from './lib/store';
	import { missionStore } from './lib/mission-store';
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
		@apply h-full min-h-screen;
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
		font-size: clamp(32px, 8vw, 48px);
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
		@apply h-10 w-10;
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
		font-size: clamp(16px, 4.5vw, 22px);
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
		width: clamp(200px, 55vw, 300px);
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
		@apply w-full max-w-xs;
		@apply py-5;
		@apply rounded-2xl;
		@apply font-black;
		font-size: clamp(22px, 6vw, 28px);
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
		@apply flex justify-center gap-4;
		@apply px-4 py-6;
		@apply pb-8;
		background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
	}

	.menu-btn {
		@apply flex flex-col items-center gap-1;
		@apply px-4 py-3;
		@apply rounded-2xl;
		@apply relative;
		min-width: 80px;
		background: linear-gradient(180deg, #fff 0%, #e8e8e8 100%);
		border: 4px solid #8b7355;
		border-bottom-width: 6px;
		box-shadow: 0 4px 0 #5c4a38;
		cursor: pointer;
		transition: transform 0.1s;
	}

	.menu-btn:active {
		transform: translateY(3px);
		border-bottom-width: 3px;
		box-shadow: 0 1px 0 #5c4a38;
	}

	.menu-icon-wrap {
		@apply flex items-center justify-center;
		width: 40px;
		height: 40px;
	}

	.menu-icon {
		font-size: 28px;
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
</style>
