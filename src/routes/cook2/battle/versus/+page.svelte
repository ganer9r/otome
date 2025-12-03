<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { battleStore } from '../lib/battle-store';
	import { findIngredientById } from '../../lib/data/ingredients';

	// 대결 상태
	let battleState = $derived($battleStore);

	// 내 요리
	let myDish = $derived(
		battleState.selectedRecipeId ? findIngredientById(battleState.selectedRecipeId) : null
	);
	let myScore = $derived(myDish?.sellPrice ?? 0);
	let opponentPower = $derived(battleState.currentChef?.power ?? 0);

	// 게이지 상태 (0 = 상대 완전 우세, 100 = 내가 완전 우세)
	let gaugeValue = $state(50);
	let phase = $state<'battle' | 'result'>('battle');
	let isWin = $state(false);

	// 이펙트 상태
	let myAttack = $state(false);
	let opponentAttack = $state(false);

	onMount(() => {
		if (!battleState.isInBattle || !battleState.selectedRecipeId) {
			goto('/cook2/battle');
			return;
		}

		// 대결 시작
		startBattle();
	});

	function startBattle() {
		let round = 0;
		const maxRounds = 12;

		const battleInterval = setInterval(() => {
			round++;

			// 랜덤하게 공격 (누가 이길지는 랜덤하게 왔다갔다)
			const attackerIsMe = Math.random() > 0.5;

			if (attackerIsMe) {
				// 내가 공격
				myAttack = true;
				setTimeout(() => {
					myAttack = false;
				}, 300);

				// 게이지 상승 (내 쪽으로)
				const damage = 8 + Math.random() * 12;
				gaugeValue = Math.min(95, gaugeValue + damage);
			} else {
				// 상대가 공격
				opponentAttack = true;
				setTimeout(() => {
					opponentAttack = false;
				}, 300);

				// 게이지 하락 (상대 쪽으로)
				const damage = 8 + Math.random() * 12;
				gaugeValue = Math.max(5, gaugeValue - damage);
			}

			// 마지막 라운드
			if (round >= maxRounds) {
				clearInterval(battleInterval);

				// 최종 결과 (실제 점수 기반)
				isWin = myScore > opponentPower;

				// 최종 게이지 위치
				setTimeout(() => {
					if (isWin) {
						// 승리: 게이지를 내 쪽으로 확 밀기
						gaugeValue = 75 + Math.random() * 20;
					} else {
						// 패배: 게이지를 상대 쪽으로 확 밀기
						gaugeValue = 5 + Math.random() * 20;
					}

					// 결과 표시
					setTimeout(() => {
						phase = 'result';
						battleStore.setResult(myScore, opponentPower);

						// 2초 후 결과 화면
						setTimeout(() => {
							goto('/cook2/battle/result');
						}, 2000);
					}, 500);
				}, 300);
			}
		}, 400);
	}
</script>

<div class="versus-container">
	<!-- 상단 VS 텍스트 -->
	<div class="vs-header">
		<span class="vs-text">⚔️ 대결 ⚔️</span>
	</div>

	<!-- 대결자들 -->
	<div class="fighters">
		<!-- 내 요리 (왼쪽) -->
		<div
			class="fighter my-side"
			class:attacking={myAttack}
			class:winner={phase === 'result' && isWin}
		>
			<div class="fighter-dish">
				{#if myDish?.imageUrl}
					<img src={myDish.imageUrl} alt={myDish.name} />
				{:else}
					<span>🍽️</span>
				{/if}
			</div>
			<span class="fighter-name">{myDish?.name ?? '???'}</span>
			<span class="fighter-score">{myScore}점</span>
			{#if myAttack}
				<div class="attack-effect">💥</div>
			{/if}
		</div>

		<!-- VS -->
		<div class="vs-badge" class:clash={myAttack || opponentAttack}>VS</div>

		<!-- 상대 (오른쪽) -->
		<div
			class="fighter opponent-side"
			class:attacking={opponentAttack}
			class:winner={phase === 'result' && !isWin}
		>
			<div class="fighter-avatar">
				{battleState.currentChef?.emoji ?? '🧑‍🍳'}
			</div>
			<span class="fighter-name">{battleState.currentChef?.name ?? '???'}</span>
			<span class="fighter-score">{opponentPower}점</span>
			{#if opponentAttack}
				<div class="attack-effect">💥</div>
			{/if}
		</div>
	</div>

	<!-- 게이지 바 -->
	<div class="gauge-area">
		<div class="gauge-bar">
			<!-- 내 게이지 (왼쪽에서 채워짐) -->
			<div class="my-gauge" style="width: {gaugeValue}%"></div>
			<!-- 상대 게이지 (오른쪽에서 채워짐) -->
			<div class="opponent-gauge" style="width: {100 - gaugeValue}%"></div>
			<!-- 중앙선 -->
			<div class="center-line"></div>
		</div>
		<div class="gauge-labels">
			<span class="label-me">나</span>
			<span class="label-opponent">상대</span>
		</div>
	</div>

	<!-- 상태 텍스트 -->
	<div class="status-area">
		{#if phase === 'battle'}
			<span class="status-text battle">대결 중...</span>
		{:else}
			<span class="status-text" class:win={isWin} class:lose={!isWin}>
				{isWin ? '🎉 승리!' : '😢 패배...'}
			</span>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.versus-container {
		@apply flex flex-col items-center;
		@apply h-full min-h-screen;
		@apply px-6 py-8;
		background: linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #1a1a2e 100%);
	}

	/* VS 헤더 */
	.vs-header {
		@apply py-4;
	}

	.vs-text {
		@apply font-black;
		font-size: 32px;
		color: #ffd700;
		text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
	}

	/* 대결자들 */
	.fighters {
		@apply flex items-center justify-center gap-4;
		@apply py-8;
		@apply w-full;
	}

	.fighter {
		@apply relative;
		@apply flex flex-col items-center gap-2;
		@apply p-4;
		@apply rounded-xl;
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid rgba(255, 255, 255, 0.1);
		transition: all 0.2s;
	}

	.fighter.attacking {
		transform: scale(1.1);
		border-color: #ffd700;
		box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
	}

	.fighter.winner {
		background: rgba(255, 215, 0, 0.2);
		border-color: #ffd700;
		box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
		animation: winnerGlow 1s ease-in-out infinite;
	}

	@keyframes winnerGlow {
		0%,
		100% {
			box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
		}
		50% {
			box-shadow: 0 0 50px rgba(255, 215, 0, 0.9);
		}
	}

	.fighter-dish {
		@apply h-20 w-20;
	}

	.fighter-dish img,
	.fighter-dish span {
		@apply h-full w-full object-contain;
		font-size: 56px;
	}

	.fighter-avatar {
		@apply flex items-center justify-center;
		@apply h-20 w-20;
		font-size: 56px;
	}

	.fighter-name {
		@apply font-bold text-white;
		font-size: 14px;
	}

	.fighter-score {
		@apply font-black;
		font-size: 18px;
		color: #ffd700;
	}

	.attack-effect {
		@apply absolute;
		top: -10px;
		right: -10px;
		font-size: 32px;
		animation: attackPop 0.3s ease-out;
	}

	@keyframes attackPop {
		0% {
			transform: scale(0) rotate(0deg);
			opacity: 0;
		}
		50% {
			transform: scale(1.5) rotate(15deg);
			opacity: 1;
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 0;
		}
	}

	.vs-badge {
		@apply px-3 py-1;
		@apply rounded;
		@apply font-black;
		font-size: 20px;
		color: #fff;
		background: linear-gradient(180deg, #ff7043 0%, #d84315 100%);
		transition: all 0.1s;
	}

	.vs-badge.clash {
		transform: scale(1.3);
		background: linear-gradient(180deg, #ffd700 0%, #ff9800 100%);
		color: #1a1a1a;
	}

	/* 게이지 */
	.gauge-area {
		@apply w-full max-w-sm;
		@apply mt-8;
	}

	.gauge-bar {
		@apply relative;
		@apply h-10;
		@apply rounded-full;
		@apply overflow-hidden;
		@apply flex;
		background: #1a1a1a;
		border: 3px solid #333;
	}

	.my-gauge {
		@apply h-full;
		background: linear-gradient(90deg, #4caf50, #8bc34a);
		transition: width 0.3s ease-out;
		box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3);
	}

	.opponent-gauge {
		@apply h-full;
		background: linear-gradient(90deg, #ff5722, #f44336);
		transition: width 0.3s ease-out;
		box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3);
	}

	.center-line {
		@apply absolute top-0 bottom-0;
		left: 50%;
		width: 4px;
		background: #fff;
		transform: translateX(-50%);
		box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
	}

	.gauge-labels {
		@apply flex justify-between;
		@apply mt-2 px-2;
	}

	.label-me {
		@apply font-bold;
		color: #4caf50;
	}

	.label-opponent {
		@apply font-bold;
		color: #f44336;
	}

	/* 상태 텍스트 */
	.status-area {
		@apply mt-8;
	}

	.status-text {
		@apply font-black;
		font-size: 28px;
	}

	.status-text.battle {
		color: #fff;
		animation: battlePulse 0.5s ease-in-out infinite;
	}

	@keyframes battlePulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.05);
		}
	}

	.status-text.win {
		color: #4caf50;
		animation: winPop 0.5s ease-out;
	}

	.status-text.lose {
		color: #f44336;
		animation: losePop 0.5s ease-out;
	}

	@keyframes winPop {
		0% {
			transform: scale(0);
		}
		60% {
			transform: scale(1.3);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes losePop {
		0% {
			transform: scale(0);
		}
		60% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
