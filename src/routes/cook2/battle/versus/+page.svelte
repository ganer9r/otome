<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut, elasticOut, backOut, cubicInOut } from 'svelte/easing';
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

	// Tween 게이지 (0 = 상대 완승, 100 = 나 완승)
	const gauge = new Tween(50, {
		duration: 400,
		easing: elasticOut
	});

	// Tween 스케일 (공격 이펙트)
	const myScale = new Tween(1, { duration: 200, easing: backOut });
	const opponentScale = new Tween(1, { duration: 200, easing: backOut });
	const vsScale = new Tween(1, { duration: 150, easing: elasticOut });

	// 배경 회전
	const bgRotation = new Tween(0, { duration: 100, easing: cubicInOut });

	// 화면 흔들림
	let shakeX = $state(0);
	let shakeY = $state(0);

	// 상태
	let phase = $state<'intro' | 'ready' | 'battle' | 'final' | 'result'>('intro');
	let isWin = $state(false);
	let battleText = $state('');
	let comboCount = $state(0);
	let showHitEffect = $state(false);
	let hitSide = $state<'my' | 'opponent'>('my');

	// 스파크 이펙트
	let sparks = $state<Array<{ id: number; x: number; y: number; angle: number }>>([]);
	let sparkId = 0;

	onMount(() => {
		if (!battleState.isInBattle || !battleState.selectedRecipeId) {
			goto('/cook2/battle');
			return;
		}

		// 배경 회전 애니메이션
		const rotateBackground = () => {
			bgRotation.set(bgRotation.current + 0.5);
			requestAnimationFrame(rotateBackground);
		};
		rotateBackground();

		// 인트로 연출
		setTimeout(() => {
			phase = 'ready';
		}, 500);

		setTimeout(() => {
			phase = 'battle';
			startBattle();
		}, 1500);
	});

	function shake(intensity: number = 10) {
		const duration = 300;
		const startTime = Date.now();

		function animateShake() {
			const elapsed = Date.now() - startTime;
			const progress = elapsed / duration;

			if (progress < 1) {
				const decay = 1 - progress;
				shakeX = (Math.random() - 0.5) * intensity * decay;
				shakeY = (Math.random() - 0.5) * intensity * decay;
				requestAnimationFrame(animateShake);
			} else {
				shakeX = 0;
				shakeY = 0;
			}
		}

		requestAnimationFrame(animateShake);
	}

	function createSparks(side: 'my' | 'opponent') {
		const newSparks: Array<{ id: number; x: number; y: number; angle: number }> = [];
		const baseX = side === 'my' ? 25 : 75;
		for (let i = 0; i < 8; i++) {
			newSparks.push({
				id: sparkId++,
				x: baseX,
				y: 35,
				angle: Math.random() * 360
			});
		}
		sparks = [...sparks, ...newSparks];

		// 스파크 제거
		setTimeout(() => {
			sparks = sparks.filter((s) => !newSparks.includes(s));
		}, 500);
	}

	function showHit(side: 'my' | 'opponent') {
		hitSide = side;
		showHitEffect = true;
		setTimeout(() => {
			showHitEffect = false;
		}, 200);
	}

	// 점수 비율 계산 (내가 얼마나 유리한지, 0.3 ~ 0.7 범위로 제한)
	function getMyPowerRatio() {
		const total = myScore + opponentPower;
		if (total === 0) return 0.5;
		const raw = myScore / total;
		// 너무 극단적이지 않게 0.3 ~ 0.7 범위로 제한
		return Math.max(0.3, Math.min(0.7, raw));
	}

	// 실제 비율 (제한 없는 원본)
	function getRealPowerRatio() {
		const total = myScore + opponentPower;
		if (total === 0) return 0.5;
		return myScore / total;
	}

	async function myAttack() {
		comboCount++;
		battleText = comboCount > 2 ? `${comboCount} COMBO!` : '맛있다!';
		myScale.set(1.4);
		vsScale.set(1.6);
		showHit('opponent');
		createSparks('opponent');

		await new Promise((r) => setTimeout(r, 150));

		myScale.set(1);
		vsScale.set(1);
		shake(18);

		// 게이지 상승 - 내 점수 비율에 따라 데미지 결정 (작은 범위)
		const ratio = getRealPowerRatio();
		const baseDamage = 2 + ratio * 4; // 2~6 범위
		const damage = baseDamage + Math.random() * 2;
		gauge.set(Math.min(95, gauge.current + damage));
	}

	async function opponentAttack() {
		comboCount = 0;
		battleText = '반격!';
		opponentScale.set(1.4);
		vsScale.set(1.6);
		showHit('my');
		createSparks('my');

		await new Promise((r) => setTimeout(r, 150));

		opponentScale.set(1);
		vsScale.set(1);
		shake(18);

		// 게이지 하락 - 상대 점수 비율에 따라 데미지 결정 (작은 범위)
		const ratio = 1 - getRealPowerRatio(); // 상대 비율
		const baseDamage = 2 + ratio * 4; // 2~6 범위
		const damage = baseDamage + Math.random() * 2;
		gauge.set(Math.max(5, gauge.current - damage));
	}

	async function startBattle() {
		const rounds = 12;

		// 시작 게이지: 50 기준으로 비율만큼 조정 (40~60 범위)
		const realRatio = getRealPowerRatio();
		const startGauge = 50 + (realRatio - 0.5) * 20; // 40~60 범위
		gauge.set(startGauge, { duration: 500 });
		await new Promise((r) => setTimeout(r, 500));

		for (let i = 0; i < rounds; i++) {
			await new Promise((r) => setTimeout(r, 400));

			// 점수 비율에 따라 공격 확률 결정 (0.3~0.7 범위)
			const myAttackChance = getMyPowerRatio();
			if (Math.random() < myAttackChance) {
				await myAttack();
			} else {
				await opponentAttack();
			}
		}

		// 최종 결정
		phase = 'final';
		battleText = '심사중...';

		await new Promise((r) => setTimeout(r, 1000));

		// 실제 승패
		isWin = myScore > opponentPower;

		// 최종 게이지 이동 (극적으로)
		if (isWin) {
			gauge.set(95, { duration: 800, easing: cubicOut });
			await new Promise((r) => setTimeout(r, 800));
			battleText = '';

			// 승리 연출
			myScale.set(1.5);
			shake(25);
			await new Promise((r) => setTimeout(r, 400));
			myScale.set(1.2);
		} else {
			gauge.set(5, { duration: 800, easing: cubicOut });
			await new Promise((r) => setTimeout(r, 800));
			battleText = '';

			// 패배 연출
			opponentScale.set(1.5);
			shake(25);
			await new Promise((r) => setTimeout(r, 400));
			opponentScale.set(1.2);
		}

		phase = 'result';
		battleStore.setResult(myScore, opponentPower);

		// 결과 화면으로 자동 이동
		await new Promise((r) => setTimeout(r, 2500));
		goto('/cook2/battle/result');
	}
</script>

<div class="versus-screen" style="transform: translate({shakeX}px, {shakeY}px)">
	<!-- 배경 레이어 -->
	<div class="bg-layer">
		<!-- 그라데이션 오버레이 -->
		<div class="bg-overlay"></div>
		<!-- 파티클 -->
		<div class="particles">
			{#each Array(20) as _, i}
				<div class="particle" style="--delay: {i * 0.2}s; --x: {Math.random() * 100}%"></div>
			{/each}
		</div>
	</div>

	<!-- 메인 컨텐츠 -->
	<div class="content">
		<!-- 스테이지 정보 -->
		<div class="stage-info">
			<div class="stage-badge">
				<span class="stage-label">STAGE</span>
				<span class="stage-num">{battleState.currentChef?.stage ?? 1}</span>
			</div>
		</div>

		<!-- 대결자들 -->
		<div class="arena">
			<!-- 내 요리 (왼쪽) -->
			<div
				class="fighter-card my-side"
				class:winner={phase === 'result' && isWin}
				class:loser={phase === 'result' && !isWin}
				class:hit={showHitEffect && hitSide === 'my'}
				style="transform: scale({myScale.current})"
			>
				<div class="card-inner">
					<div class="card-glow my"></div>
					<div class="fighter-visual">
						{#if myDish?.imageUrl}
							<img src={myDish.imageUrl} alt={myDish.name} class="dish-img" />
						{:else}
							<span class="dish-emoji">🍽️</span>
						{/if}
					</div>
					<div class="fighter-info">
						<span class="fighter-label">나의 요리</span>
						<span class="fighter-name">{myDish?.name ?? '???'}</span>
					</div>
					<div class="score-box my">
						<span class="score-value">{myScore}</span>
						<span class="score-unit">점</span>
					</div>
				</div>
			</div>

			<!-- VS 영역 (중앙) -->
			<div class="vs-zone">
				<div class="vs-text">VS</div>
				{#if battleText}
					<div class="action-text" class:combo={comboCount > 2}>
						{battleText}
					</div>
				{/if}
			</div>

			<!-- 상대 (오른쪽) -->
			<div
				class="fighter-card opponent-side"
				class:winner={phase === 'result' && !isWin}
				class:loser={phase === 'result' && isWin}
				class:hit={showHitEffect && hitSide === 'opponent'}
				style="transform: scale({opponentScale.current})"
			>
				<div class="card-inner">
					<div class="card-glow opponent"></div>
					<div class="fighter-visual">
						<span class="chef-emoji">{battleState.currentChef?.emoji ?? '🧑‍🍳'}</span>
					</div>
					<div class="fighter-info">
						<span class="fighter-label">도전자</span>
						<span class="fighter-name">{battleState.currentChef?.name ?? '???'}</span>
					</div>
					<div class="score-box opponent">
						<span class="score-value">{opponentPower}</span>
						<span class="score-unit">점</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 파워 게이지 -->
		<div class="gauge-section">
			<div class="gauge-frame">
				<div class="gauge-track">
					<div class="gauge-fill my" style="width: {gauge.current}%">
						<div class="gauge-shine"></div>
					</div>
					<div class="gauge-fill opponent" style="width: {100 - gauge.current}%">
						<div class="gauge-shine"></div>
					</div>
					<div class="gauge-center-marker"></div>
					<!-- 현재 위치 인디케이터 -->
					<div class="gauge-indicator" style="left: {gauge.current}%">
						<div class="indicator-glow"></div>
					</div>
				</div>
				<!-- 게이지 라벨 -->
				<div class="gauge-ends">
					<div class="gauge-end my">
						<img src="/imgs/ui/icon_circle.png" alt="" class="end-icon" />
					</div>
					<div class="gauge-end opponent">
						<img src="/imgs/ui/icon_circle.png" alt="" class="end-icon" />
					</div>
				</div>
			</div>
			<div class="gauge-names">
				<span class="name my">나</span>
				<span class="name opponent">상대</span>
			</div>
		</div>

		<!-- 상태 표시 -->
		<div class="status-area">
			{#if phase === 'intro'}
				<div class="status-text intro">대결 준비...</div>
			{:else if phase === 'ready'}
				<div class="status-text ready">READY...</div>
			{:else if phase === 'battle'}
				<div class="status-text battle">FIGHT!</div>
			{:else if phase === 'final'}
				<div class="status-text final">심사중...</div>
			{:else if phase === 'result'}
				<div class="result-banner" class:win={isWin} class:lose={!isWin}>
					<div class="result-bg"></div>
					<div class="result-content">
						<span class="result-label">{isWin ? 'VICTORY' : 'DEFEAT'}</span>
						<span class="result-sub">{isWin ? '승리!' : '패배...'}</span>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- 스파크 이펙트 -->
	{#each sparks as spark (spark.id)}
		<div class="spark" style="left: {spark.x}%; top: {spark.y}%; --angle: {spark.angle}deg"></div>
	{/each}

	<!-- 히트 플래시 -->
	{#if showHitEffect}
		<div
			class="hit-flash"
			class:my={hitSide === 'my'}
			class:opponent={hitSide === 'opponent'}
		></div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.versus-screen {
		@apply relative;
		@apply h-full min-h-screen;
		@apply overflow-hidden;
		will-change: transform;
	}

	/* 배경 레이어 */
	.bg-layer {
		@apply absolute inset-0;
		@apply overflow-hidden;
		background: linear-gradient(180deg, #ffab70 0%, #ff8a50 30%, #e86a30 70%, #d05020 100%);
	}

	.bg-overlay {
		@apply absolute inset-0;
		background: radial-gradient(ellipse at center 70%, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
	}

	.particles {
		@apply absolute inset-0;
		@apply pointer-events-none;
	}

	.particle {
		@apply absolute;
		width: 4px;
		height: 4px;
		background: #ffd700;
		border-radius: 50%;
		left: var(--x);
		animation: float 4s ease-in-out infinite;
		animation-delay: var(--delay);
		opacity: 0.6;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(100vh) scale(0);
			opacity: 0;
		}
		10% {
			opacity: 0.6;
		}
		90% {
			opacity: 0.6;
		}
		100% {
			transform: translateY(-20vh) scale(1);
			opacity: 0;
		}
	}

	/* 메인 컨텐츠 */
	.content {
		@apply relative z-10;
		@apply flex flex-col items-center;
		@apply h-full min-h-screen;
		@apply px-3 py-4;
	}

	/* 스테이지 정보 */
	.stage-info {
		@apply py-2;
	}

	.stage-badge {
		@apply flex items-center gap-2;
		@apply px-4 py-2;
		@apply rounded-full;
		background: linear-gradient(180deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.05) 100%);
		border: 2px solid rgba(255, 215, 0, 0.5);
	}

	.stage-label {
		@apply font-bold;
		font-size: 12px;
		color: rgba(255, 215, 0, 0.8);
		letter-spacing: 2px;
	}

	.stage-num {
		@apply font-black;
		font-size: 20px;
		color: #ffd700;
		text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
	}

	/* 아레나 */
	.arena {
		@apply flex items-center justify-center gap-2;
		@apply w-full;
		@apply py-4;
		@apply flex-1;
	}

	/* 파이터 카드 */
	.fighter-card {
		@apply relative;
		@apply flex flex-col items-center;
		width: 120px;
		will-change: transform;
		transition: filter 0.3s;
	}

	.fighter-card.hit {
		filter: brightness(2) saturate(0.5);
	}

	.fighter-card.loser {
		filter: grayscale(0.7) brightness(0.6);
	}

	.card-glow {
		@apply absolute;
		@apply inset-0;
		@apply rounded-2xl;
		@apply opacity-0;
		transition: opacity 0.3s;
		z-index: 0;
	}

	.fighter-card.winner .card-glow {
		@apply opacity-100;
	}

	.card-glow.my {
		background: radial-gradient(ellipse, rgba(46, 204, 113, 0.6) 0%, transparent 70%);
		box-shadow: 0 0 40px rgba(46, 204, 113, 0.8);
	}

	.card-glow.opponent {
		background: radial-gradient(ellipse, rgba(231, 76, 60, 0.6) 0%, transparent 70%);
		box-shadow: 0 0 40px rgba(231, 76, 60, 0.8);
	}

	.card-inner {
		@apply relative;
		@apply flex flex-col items-center gap-2;
		@apply p-3;
		@apply rounded-2xl;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(255, 255, 255, 0.02) 100%
		);
		border: 2px solid rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
	}

	.fighter-card.winner .card-inner {
		border-color: #ffd700;
		box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
	}

	.fighter-visual {
		@apply relative;
		@apply h-20 w-20;
		@apply flex items-center justify-center;
	}

	.dish-img {
		@apply h-full w-full object-contain;
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.6));
	}

	.dish-emoji,
	.chef-emoji {
		font-size: 52px;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
	}

	.fighter-info {
		@apply flex flex-col items-center;
	}

	.fighter-label {
		font-size: 10px;
		color: rgba(255, 255, 255, 0.5);
		letter-spacing: 1px;
	}

	.fighter-name {
		@apply font-bold text-white;
		font-size: 13px;
		text-align: center;
	}

	.score-box {
		@apply flex items-baseline gap-1;
		@apply px-3 py-1;
		@apply rounded-lg;
	}

	.score-box.my {
		background: linear-gradient(180deg, #2ecc71 0%, #27ae60 100%);
	}

	.score-box.opponent {
		background: linear-gradient(180deg, #e74c3c 0%, #c0392b 100%);
	}

	.score-value {
		@apply font-black text-white;
		font-size: 18px;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.score-unit {
		@apply font-bold;
		font-size: 11px;
		color: rgba(255, 255, 255, 0.8);
	}

	/* VS 영역 */
	.vs-zone {
		@apply flex flex-col items-center;
		@apply mx-2;
		min-width: 50px;
	}

	.vs-text {
		@apply font-black;
		font-size: 42px;
		color: #fff;
		text-shadow:
			0 3px 0 #8b4513,
			0 6px 0 #5c2e0a;
		-webkit-text-stroke: 2px #5c2e0a;
		paint-order: stroke fill;
	}

	.action-text {
		@apply mt-2;
		@apply font-black;
		font-size: 14px;
		color: #ffd700;
		text-shadow:
			0 0 10px rgba(255, 215, 0, 1),
			0 2px 0 rgba(0, 0, 0, 0.5);
		animation: actionPop 0.2s ease-out;
	}

	.action-text.combo {
		font-size: 16px;
		color: #ff6b35;
		animation: comboPop 0.3s ease-out;
	}

	@keyframes actionPop {
		0% {
			transform: scale(0) translateY(10px);
			opacity: 0;
		}
		100% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}

	@keyframes comboPop {
		0% {
			transform: scale(0) rotate(-10deg);
		}
		60% {
			transform: scale(1.3) rotate(5deg);
		}
		100% {
			transform: scale(1) rotate(0);
		}
	}

	/* 게이지 섹션 */
	.gauge-section {
		@apply w-full max-w-xs;
		@apply px-4;
		@apply flex flex-col items-center gap-2;
	}

	.gauge-frame {
		@apply relative;
		@apply h-6 w-full;
		@apply rounded-full;
		@apply overflow-visible;
		background: linear-gradient(180deg, #1a1a1a 0%, #333 100%);
		border: 3px solid #555;
	}

	.gauge-track {
		@apply absolute inset-0;
		@apply rounded-full;
		@apply flex;
		@apply overflow-hidden;
	}

	.gauge-fill {
		@apply relative h-full;
		@apply overflow-hidden;
		transition: width 0.15s ease-out;
	}

	.gauge-fill.my {
		background: linear-gradient(180deg, #7dff7d 0%, #4caf50 50%, #2e7d32 100%);
		box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4);
	}

	.gauge-fill.opponent {
		background: linear-gradient(180deg, #ff7d7d 0%, #e74c3c 50%, #c0392b 100%);
		box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4);
	}

	.gauge-shine {
		@apply absolute inset-0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, transparent 50%);
		border-radius: inherit;
	}

	.gauge-center-marker {
		@apply absolute top-0 bottom-0;
		left: 50%;
		width: 3px;
		margin-left: -1.5px;
		background: #fff;
		z-index: 5;
	}

	.gauge-indicator {
		@apply absolute top-1/2;
		width: 16px;
		height: 24px;
		margin-left: -8px;
		margin-top: -12px;
		background: radial-gradient(ellipse, #fff 0%, transparent 70%);
		z-index: 10;
		transition: left 0.15s ease-out;
	}

	.indicator-glow {
		display: none;
	}

	.gauge-ends {
		display: none;
	}

	.gauge-end {
		display: none;
	}

	.gauge-end.my {
		display: none;
	}

	.gauge-end.opponent {
		display: none;
	}

	.end-icon {
		display: none;
	}

	.gauge-names {
		@apply flex w-full justify-between;
		@apply px-1;
	}

	.gauge-names .name {
		@apply font-bold;
		font-size: 14px;
		color: #fff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.gauge-names .name.my {
		color: #fff;
	}

	.gauge-names .name.opponent {
		color: #fff;
	}

	/* 상태 표시 */
	.status-area {
		@apply flex justify-center;
		@apply px-4 pt-6 pb-12;
		@apply mt-auto;
		@apply flex-shrink-0;
		min-height: 100px;
	}

	.status-text {
		@apply font-black;
		font-size: 24px;
		color: #fff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.status-text.intro {
		opacity: 0.5;
		animation: pulse 1s ease-in-out infinite;
	}

	.status-text.ready {
		color: #ffd700;
		animation: readyPulse 0.5s ease-in-out infinite alternate;
	}

	.status-text.battle {
		color: #ff6b35;
		font-size: 32px;
		animation: fightPop 0.5s ease-out;
		text-shadow:
			0 0 20px rgba(255, 107, 53, 1),
			0 4px 0 #a02020;
	}

	.status-text.final {
		color: #ffd700;
		animation: pulse 0.8s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}

	@keyframes readyPulse {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(1.1);
		}
	}

	@keyframes fightPop {
		0% {
			transform: scale(0) rotate(-15deg);
			opacity: 0;
		}
		60% {
			transform: scale(1.3) rotate(5deg);
		}
		100% {
			transform: scale(1) rotate(0);
			opacity: 1;
		}
	}

	/* 결과 배너 */
	.result-banner {
		@apply relative;
		@apply px-8 py-4;
		animation: bannerSlam 0.5s ease-out;
	}

	.result-bg {
		@apply absolute inset-0;
		@apply rounded-lg;
		transform: skewX(-5deg);
	}

	.result-banner.win .result-bg {
		background: linear-gradient(90deg, #27ae60 0%, #2ecc71 50%, #27ae60 100%);
		box-shadow:
			0 0 40px rgba(46, 204, 113, 0.8),
			0 6px 0 #1e8449;
	}

	.result-banner.lose .result-bg {
		background: linear-gradient(90deg, #c0392b 0%, #e74c3c 50%, #c0392b 100%);
		box-shadow:
			0 0 40px rgba(231, 76, 60, 0.8),
			0 6px 0 #922b21;
	}

	.result-content {
		@apply relative z-10;
		@apply flex flex-col items-center;
	}

	.result-label {
		@apply font-black;
		font-size: 36px;
		color: #fff;
		text-shadow:
			0 0 20px rgba(255, 255, 255, 0.5),
			0 4px 0 rgba(0, 0, 0, 0.3);
		letter-spacing: 4px;
	}

	.result-sub {
		@apply font-bold;
		font-size: 16px;
		color: rgba(255, 255, 255, 0.9);
	}

	@keyframes bannerSlam {
		0% {
			transform: scale(3) rotate(-10deg);
			opacity: 0;
		}
		60% {
			transform: scale(0.9) rotate(2deg);
		}
		100% {
			transform: scale(1) rotate(0);
			opacity: 1;
		}
	}

	/* 스파크 이펙트 */
	.spark {
		@apply absolute;
		width: 8px;
		height: 8px;
		background: #ffd700;
		border-radius: 50%;
		pointer-events: none;
		z-index: 100;
		animation: sparkFly 0.5s ease-out forwards;
	}

	@keyframes sparkFly {
		0% {
			transform: translate(0, 0) scale(1);
			opacity: 1;
		}
		100% {
			transform: translate(calc(cos(var(--angle)) * 80px), calc(sin(var(--angle)) * 80px)) scale(0);
			opacity: 0;
		}
	}

	/* 히트 플래시 */
	.hit-flash {
		@apply absolute inset-0;
		@apply pointer-events-none;
		z-index: 50;
		animation: flash 0.15s ease-out;
	}

	.hit-flash.my {
		background: radial-gradient(ellipse at 25% 40%, rgba(46, 204, 113, 0.4) 0%, transparent 50%);
	}

	.hit-flash.opponent {
		background: radial-gradient(ellipse at 75% 40%, rgba(231, 76, 60, 0.4) 0%, transparent 50%);
	}

	@keyframes flash {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
