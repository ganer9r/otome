<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getChefByStage } from './lib/chef-data';
	import { battleStore } from './lib/battle-store';

	// 현재 도전할 요리사 (Stage 1)
	const clearedStage = battleStore.getClearedStage();
	const currentChef = getChefByStage(clearedStage + 1);

	// 내 캐릭터 이모지
	const myEmoji = '👨‍🍳';

	function goBack() {
		goto('/cook2');
	}

	function startBattle() {
		if (!currentChef) return;
		battleStore.startBattle(currentChef);
		goto('/cook2/battle/select');
	}

	onMount(() => {
		// 대결 상태 초기화
		battleStore.endBattle();
	});
</script>

<div class="battle-container">
	<!-- 헤더 -->
	<header class="header">
		<button class="back-btn" onclick={goBack}>
			<span>←</span>
		</button>
		<h1 class="title">대결</h1>
		<div class="spacer"></div>
	</header>

	{#if currentChef}
		<!-- VS 영역 -->
		<div class="vs-area">
			<!-- 내 캐릭터 -->
			<div class="fighter my-fighter">
				<div class="fighter-avatar">{myEmoji}</div>
				<span class="fighter-name">나</span>
			</div>

			<!-- VS -->
			<div class="vs-badge">VS</div>

			<!-- 상대 캐릭터 -->
			<div class="fighter opponent-fighter">
				<div class="fighter-avatar">{currentChef.emoji}</div>
				<span class="fighter-name">{currentChef.name}</span>
			</div>
		</div>

		<!-- 상대 정보 -->
		<div class="opponent-info">
			<div class="info-card">
				<div class="info-row">
					<span class="info-label">Stage</span>
					<span class="info-value">{currentChef.stage}</span>
				</div>
				<div class="info-row">
					<span class="info-label">테마</span>
					<span class="info-value">{currentChef.theme}</span>
				</div>
				<div class="info-row">
					<span class="info-label">실력</span>
					<span class="info-value">{currentChef.power}점</span>
				</div>
			</div>
		</div>

		<!-- 대결 시작 버튼 -->
		<div class="action-area">
			<button class="start-btn" onclick={startBattle}> 대결 시작 </button>
		</div>
	{:else}
		<!-- 모든 스테이지 클리어 -->
		<div class="complete-area">
			<div class="complete-icon">🏆</div>
			<h2 class="complete-title">모든 대결 완료!</h2>
			<p class="complete-desc">모든 요리사를 이겼습니다.</p>
			<button class="home-btn" onclick={goBack}>홈으로</button>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.battle-container {
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
		color: #fff;
		font-size: 20px;
		box-shadow: 0 4px 0 #0d0d0d;
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

	/* ===== VS 영역 ===== */
	.vs-area {
		@apply flex items-center justify-center;
		@apply gap-6;
		@apply py-10;
	}

	.fighter {
		@apply flex flex-col items-center gap-2;
	}

	.fighter-avatar {
		@apply flex items-center justify-center;
		@apply h-24 w-24;
		@apply rounded-full;
		font-size: 48px;
	}

	.my-fighter .fighter-avatar {
		background: #1a1a1a;
		border: 4px solid #333;
	}

	.opponent-fighter .fighter-avatar {
		background: #fff;
		border: 4px solid #e0e0e0;
	}

	.fighter-name {
		@apply font-bold;
		font-size: 16px;
		color: #5c3d15;
	}

	.vs-badge {
		@apply px-4 py-2;
		@apply rounded-lg;
		@apply font-black;
		font-size: 24px;
		color: #fff;
		background: linear-gradient(180deg, #ff7043 0%, #d84315 100%);
		border: 3px solid #bf360c;
	}

	/* ===== 상대 정보 ===== */
	.opponent-info {
		@apply flex justify-center;
		@apply px-6;
	}

	.info-card {
		@apply w-full max-w-sm;
		@apply px-6 py-4;
		@apply rounded-2xl;
		@apply flex flex-col gap-3;
		background: rgba(255, 255, 255, 0.9);
		border: 3px solid #e0c4a8;
	}

	.info-row {
		@apply flex items-center justify-between;
	}

	.info-label {
		color: #8b7355;
		font-size: 14px;
	}

	.info-value {
		@apply font-bold;
		font-size: 16px;
		color: #5c3d15;
	}

	/* ===== 대결 시작 버튼 ===== */
	.action-area {
		@apply flex-1;
		@apply flex items-end justify-center;
		@apply px-6 pb-12;
	}

	.start-btn {
		@apply w-full max-w-sm;
		@apply py-5;
		@apply rounded-2xl;
		@apply font-black;
		font-size: clamp(22px, 6vw, 28px);
		color: #fff;
		background: linear-gradient(180deg, #ff7043 0%, #f4511e 50%, #d84315 100%);
		border: none;
		border-bottom: 6px solid #bf360c;
		box-shadow:
			0 6px 0 #8b2500,
			0 10px 20px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		text-shadow: 0 3px 0 rgba(0, 0, 0, 0.3);
		transition:
			transform 0.1s,
			box-shadow 0.1s;
	}

	.start-btn:active {
		transform: translateY(4px);
		border-bottom-width: 2px;
		box-shadow:
			0 2px 0 #8b2500,
			0 4px 10px rgba(0, 0, 0, 0.3);
	}

	/* ===== 완료 화면 ===== */
	.complete-area {
		@apply flex-1;
		@apply flex flex-col items-center justify-center;
		@apply gap-4;
		@apply px-6;
	}

	.complete-icon {
		font-size: 64px;
	}

	.complete-title {
		@apply font-black;
		font-size: 28px;
		color: #5c3d15;
	}

	.complete-desc {
		color: #8b7355;
		font-size: 16px;
	}

	.home-btn {
		@apply mt-4;
		@apply px-8 py-4;
		@apply rounded-xl;
		@apply font-black;
		font-size: 18px;
		color: #fff;
		background: linear-gradient(180deg, #ff7043 0%, #f4511e 50%, #d84315 100%);
		border: none;
		border-bottom: 6px solid #bf360c;
		box-shadow: 0 6px 0 #8b2500;
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
	}
</style>
