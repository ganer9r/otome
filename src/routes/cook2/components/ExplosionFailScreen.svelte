<script lang="ts">
	import { onMount } from 'svelte';
	import { getChefImage, getRandomDialogue } from '../lib/chef-images';
	import GameButton from './GameButton.svelte';
	import { runStore } from '../lib/store';
	import { customerStore } from '../lib/customer-store';
	import CapitalHUD from './CapitalHUD.svelte';
	import SpeechBubble from './SpeechBubble.svelte';
	import { getSoundManager } from '$lib/domain/sound';

	interface Props {
		/** 재료비 손실 */
		ingredientCost?: number;
		onComplete?: () => void;
	}

	let { ingredientCost = 0, onComplete }: Props = $props();

	// 화면 흔들림
	let screenShake = $state(false);

	// 런 상태 (자본 표시용)
	let runState = $derived($runStore);
	let turnsUntilTax = $derived(runStore.getTurnsUntilTax(runState.turn));
	let taxRate = $derived(customerStore.getTaxRate());

	// 단계: shake -> explosion -> result
	let stage = $state<'shake' | 'explosion' | 'result'>('shake');
	let canSkip = $state(true);

	const potImage = '/imgs/cw_pot.webp';

	// 셰프 이미지 & 대사 (angry)
	let chefImage = $derived(getChefImage('angry'));
	let chefDialogue = $state('');

	// 실패 메시지들
	const FAIL_MESSAGES = [
		'이건 요리가 아니야!',
		'뭘 만든 거야?!',
		'레시피가 없잖아!',
		'이상한 조합이야!',
		'폭발이다!'
	];

	let failMessage = $state('');

	$effect(() => {
		chefDialogue = getRandomDialogue('angry');
		failMessage = FAIL_MESSAGES[Math.floor(Math.random() * FAIL_MESSAGES.length)];
	});

	// 폭발 파티클
	const explosionParticles = Array.from({ length: 20 }, (_, i) => ({
		id: i,
		angle: (i * 360) / 20 + Math.random() * 18,
		distance: 100 + Math.random() * 150,
		size: 20 + Math.random() * 30,
		delay: Math.random() * 0.2,
		emoji: ['💥', '💨', '🔥', '💫', '⚡'][Math.floor(Math.random() * 5)]
	}));

	// 연기 파티클
	const smokeParticles = Array.from({ length: 8 }, (_, i) => ({
		id: i,
		left: 20 + Math.random() * 60,
		delay: Math.random() * 0.5,
		duration: 1.5 + Math.random() * 1,
		size: 40 + Math.random() * 40
	}));

	onMount(() => {
		const sound = getSoundManager();
		const timers: ReturnType<typeof setTimeout>[] = [];

		// 1. 냄비 흔들림 (0.8초) → 폭발
		timers.push(
			setTimeout(() => {
				stage = 'explosion';
				sound.playSfx('explosion');
			}, 800)
		);

		// 2. 폭발 (1초 후 결과) + 화면 흔들림 + 쿵! (X마크)
		timers.push(
			setTimeout(() => {
				stage = 'result';
				screenShake = true;
				sound.playSfx('thud'); // X마크 등장 시 쿵!
				setTimeout(() => (screenShake = false), 500);
			}, 1800)
		);

		// 3. 모든 영역 등장 후 실패 사운드 (1.0s 후 = bottom-section 등장 타이밍)
		timers.push(
			setTimeout(() => {
				sound.playSfx('failNegative');
			}, 2800)
		);

		return () => {
			timers.forEach((t) => clearTimeout(t));
		};
	});

	function handleSkip() {
		if (stage !== 'result' && canSkip) {
			stage = 'result';
		}
	}

	function handleConfirm() {
		onComplete?.();
	}
</script>

<div
	class="explosion-fail-screen"
	class:shake={screenShake}
	onclick={handleSkip}
	onkeydown={(e) => e.key === 'Enter' && handleSkip()}
	role="button"
	tabindex="0"
>
	<!-- HUD -->
	<div class="hud-area">
		<CapitalHUD
			capital={runState.capital}
			earnedStars={runState.earnedStars}
			turn={runState.turn}
			{turnsUntilTax}
			totalEarned={runState.totalEarned}
			{taxRate}
		/>
	</div>

	{#if stage === 'shake'}
		<!-- 냄비 격렬하게 흔들림 -->
		<div class="stage-shake">
			<div class="pot-wrapper">
				<div class="pot-danger-glow"></div>
				<img src={potImage} alt="냄비" class="pot-shaking-hard" />
				<div class="warning-marks">
					<span class="warning-mark">!</span>
					<span class="warning-mark delay-1">!</span>
					<span class="warning-mark delay-2">!</span>
				</div>
			</div>
			<div class="shake-text">위험해...!</div>
		</div>
	{:else if stage === 'explosion'}
		<!-- 폭발 -->
		<div class="stage-explosion">
			<!-- 중앙 플래시 -->
			<div class="explosion-flash"></div>

			<!-- 폭발 파티클 -->
			<div class="particles-container">
				{#each explosionParticles as particle}
					<div
						class="explosion-particle"
						style="
							--angle: {particle.angle}deg;
							--distance: {particle.distance}px;
							--size: {particle.size}px;
							--delay: {particle.delay}s;
						"
					>
						{particle.emoji}
					</div>
				{/each}
			</div>

			<!-- 연기 -->
			<div class="smoke-container">
				{#each smokeParticles as smoke}
					<div
						class="smoke-particle"
						style="
							left: {smoke.left}%;
							animation-delay: {smoke.delay}s;
							animation-duration: {smoke.duration}s;
							width: {smoke.size}px;
							height: {smoke.size}px;
						"
					></div>
				{/each}
			</div>

			<!-- 폭발 텍스트 -->
			<div class="boom-text">펑!</div>
		</div>
	{:else}
		<!-- 결과 화면 -->
		<div class="stage-result">
			<!-- 상단: 큰 X 마크 + 핵심 메시지 -->
			<div class="fail-main">
				<div class="x-mark-container">
					<div class="x-mark">✕</div>
					<div class="x-glow"></div>
				</div>
				<h1 class="fail-title">조합 실패!</h1>
				<p class="fail-description">이 재료들로는 요리를 만들 수 없어요</p>
			</div>

			<!-- 손실 표시 (애니메이션) -->
			{#if ingredientCost > 0}
				<div class="loss-section">
					<div class="loss-coins">
						<img src="/imgs/ui/coin.png" alt="coin" class="coin-fall coin-1" />
						<img src="/imgs/ui/coin.png" alt="coin" class="coin-fall coin-2" />
						<img src="/imgs/ui/coin.png" alt="coin" class="coin-fall coin-3" />
					</div>
					<span class="loss-amount">-{ingredientCost.toLocaleString()}원</span>
					<span class="loss-label">재료비 손실</span>
				</div>
			{/if}

			<!-- 하단: 셰프 (크게) + 버튼 -->
			<div class="bottom-section">
				<div class="chef-area">
					<img src={chefImage} alt="셰프" class="chef-img" />
					<div class="bubble-wrapper">
						<SpeechBubble text={chefDialogue} tailPosition="left" variant="fail" />
					</div>
				</div>
				<GameButton variant="secondary" size="lg" onclick={handleConfirm}>다시 도전!</GameButton>
			</div>
		</div>
	{/if}

	{#if stage !== 'result' && canSkip}
		<div class="skip-hint">탭하여 스킵</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	/* HUD 영역 (IngredientSelectScreen과 동일 위치) */
	.hud-area {
		@apply absolute top-0 right-0;
		@apply flex justify-end;
		@apply px-2 py-1;
		z-index: 60;
	}

	.explosion-fail-screen {
		@apply fixed inset-0 z-50;
		@apply flex items-center justify-center;
		@apply cursor-pointer overflow-hidden;
		background: linear-gradient(to bottom, #4a4a4a, #2d2d2d);
	}

	/* ===== 1단계: 냄비 격렬 흔들림 ===== */
	.stage-shake {
		@apply flex flex-col items-center gap-4;
	}

	.pot-wrapper {
		@apply relative;
	}

	.pot-danger-glow {
		@apply absolute inset-0 rounded-full;
		background: radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, transparent 70%);
		animation: dangerPulse 0.2s ease-in-out infinite;
		transform: scale(1.5);
	}

	@keyframes dangerPulse {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(1.5);
		}
		50% {
			opacity: 0.9;
			transform: scale(2);
		}
	}

	.pot-shaking-hard {
		@apply relative z-10 h-40 w-40 object-contain;
		filter: drop-shadow(0 8px 16px rgba(239, 68, 68, 0.5));
		animation: hardShake 0.05s ease-in-out infinite;
	}

	@keyframes hardShake {
		0%,
		100% {
			transform: translateX(0) translateY(0) rotate(0deg);
		}
		25% {
			transform: translateX(-8px) translateY(-4px) rotate(-5deg);
		}
		75% {
			transform: translateX(8px) translateY(-4px) rotate(5deg);
		}
	}

	.warning-marks {
		@apply absolute -top-8 left-1/2 -translate-x-1/2;
		@apply flex gap-2;
	}

	.warning-mark {
		@apply font-black text-red-500;
		font-size: clamp(24px, 6vw, 36px);
		animation: warningBounce 0.3s ease-in-out infinite;
	}

	.warning-mark.delay-1 {
		animation-delay: 0.1s;
	}

	.warning-mark.delay-2 {
		animation-delay: 0.2s;
	}

	@keyframes warningBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.shake-text {
		@apply font-bold text-red-400;
		font-size: clamp(20px, 5vw, 28px);
		animation: textShake 0.1s ease-in-out infinite;
	}

	@keyframes textShake {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(4px);
		}
	}

	/* ===== 2단계: 폭발 ===== */
	.stage-explosion {
		@apply absolute inset-0 flex items-center justify-center;
		background: radial-gradient(circle, #ff6b35 0%, #2d2d2d 70%);
		animation: flashBg 0.5s ease-out;
	}

	@keyframes flashBg {
		0% {
			background: radial-gradient(circle, #ffffff 0%, #ff6b35 30%, #2d2d2d 70%);
		}
		100% {
			background: radial-gradient(circle, #ff6b35 0%, #2d2d2d 70%);
		}
	}

	.explosion-flash {
		@apply absolute;
		width: 150px;
		height: 150px;
		border-radius: 50%;
		background: radial-gradient(circle, white 0%, #ff6b35 50%, transparent 70%);
		animation: flashExpand 0.5s ease-out forwards;
	}

	@keyframes flashExpand {
		0% {
			transform: scale(0);
			opacity: 1;
		}
		50% {
			transform: scale(3);
			opacity: 0.8;
		}
		100% {
			transform: scale(5);
			opacity: 0;
		}
	}

	.particles-container {
		@apply absolute inset-0 flex items-center justify-center;
	}

	.explosion-particle {
		@apply absolute;
		font-size: var(--size);
		animation: particleFly 0.8s ease-out var(--delay) forwards;
		opacity: 0;
	}

	@keyframes particleFly {
		0% {
			transform: translate(0, 0) scale(0) rotate(0deg);
			opacity: 1;
		}
		100% {
			transform: translate(
					calc(cos(var(--angle) * 3.14159 / 180) * var(--distance)),
					calc(sin(var(--angle) * 3.14159 / 180) * var(--distance))
				)
				scale(1) rotate(360deg);
			opacity: 0;
		}
	}

	.smoke-container {
		@apply absolute;
		top: 30%;
		left: 0;
		right: 0;
		height: 200px;
		pointer-events: none;
	}

	.smoke-particle {
		@apply absolute rounded-full;
		background: rgba(100, 100, 100, 0.6);
		filter: blur(15px);
		animation: smokeRise linear infinite;
	}

	@keyframes smokeRise {
		0% {
			opacity: 0;
			transform: translateY(0) scale(0.5);
		}
		30% {
			opacity: 0.7;
		}
		100% {
			opacity: 0;
			transform: translateY(-150px) scale(2);
		}
	}

	.boom-text {
		@apply absolute font-black text-white;
		font-size: clamp(60px, 15vw, 100px);
		text-shadow:
			0 0 20px #ff6b35,
			0 0 40px #ff6b35,
			0 0 60px #ff6b35;
		animation: boomPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	@keyframes boomPop {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.3);
			opacity: 1;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* ===== 3단계: 결과 ===== */
	.stage-result {
		@apply flex flex-col items-center;
		@apply h-full w-full;
		@apply px-4 py-6;
		@apply justify-between;
	}

	/* 화면 흔들림 */
	.explosion-fail-screen.shake {
		animation: screenShake 0.5s ease-out;
	}

	@keyframes screenShake {
		0%,
		100% {
			transform: translateX(0) translateY(0);
		}
		10% {
			transform: translateX(-10px) translateY(5px);
		}
		20% {
			transform: translateX(10px) translateY(-5px);
		}
		30% {
			transform: translateX(-8px) translateY(4px);
		}
		40% {
			transform: translateX(8px) translateY(-4px);
		}
		50% {
			transform: translateX(-5px) translateY(2px);
		}
		60% {
			transform: translateX(5px) translateY(-2px);
		}
		70% {
			transform: translateX(-3px) translateY(1px);
		}
		80% {
			transform: translateX(3px) translateY(-1px);
		}
	}

	/* 메인 실패 영역 - 쿵! (1번째) */
	.fail-main {
		@apply flex flex-col items-center gap-3;
		animation: slamDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0s both;
	}

	/* 쿵쿵쿵 공통 애니메이션 */
	@keyframes slamDown {
		0% {
			opacity: 0;
			transform: translateY(-80px) scale(1.2);
		}
		60% {
			opacity: 1;
			transform: translateY(10px) scale(0.95);
		}
		80% {
			transform: translateY(-5px) scale(1.02);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* X 마크 */
	.x-mark-container {
		@apply relative;
		@apply flex items-center justify-center;
		width: clamp(100px, 28vw, 140px);
		height: clamp(100px, 28vw, 140px);
	}

	.x-mark {
		@apply font-black;
		font-size: clamp(80px, 22vw, 120px);
		color: #ef4444;
		text-shadow:
			0 0 20px rgba(239, 68, 68, 0.6),
			0 4px 8px rgba(0, 0, 0, 0.4);
		animation: xPulse 1.5s ease-in-out infinite;
		z-index: 10;
	}

	.x-glow {
		@apply absolute inset-0;
		background: radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%);
		animation: glowPulse 1.5s ease-in-out infinite;
	}

	@keyframes xPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	@keyframes glowPulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.3);
			opacity: 0.8;
		}
	}

	.fail-title {
		@apply font-black;
		font-size: clamp(32px, 8vw, 48px);
		color: #fca5a5;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.fail-description {
		@apply text-center;
		font-size: clamp(14px, 3.5vw, 18px);
		color: rgba(255, 255, 255, 0.7);
		max-width: 280px;
	}

	/* 손실 표시 - 쿵! (2번째) */
	.loss-section {
		@apply flex flex-col items-center gap-1;
		@apply relative;
		animation: slamDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
	}

	/* 떨어지는 코인 애니메이션 - 쿵쿵쿵 */
	.loss-coins {
		@apply relative;
		height: 50px;
		width: 120px;
	}

	.coin-fall {
		@apply absolute;
		width: 32px;
		height: 32px;
		top: 0;
		opacity: 0;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}

	.coin-1 {
		left: 10%;
		animation:
			coinBounce 0.8s cubic-bezier(0.33, 1, 0.68, 1) 0s forwards,
			coinShake 0.1s ease-in-out 0.5s;
	}
	.coin-2 {
		left: 45%;
		animation:
			coinBounce 0.8s cubic-bezier(0.33, 1, 0.68, 1) 0.25s forwards,
			coinShake 0.1s ease-in-out 0.75s;
	}
	.coin-3 {
		left: 80%;
		animation:
			coinBounce 0.8s cubic-bezier(0.33, 1, 0.68, 1) 0.5s forwards,
			coinShake 0.1s ease-in-out 1s;
	}

	@keyframes coinBounce {
		0% {
			opacity: 1;
			transform: translateY(-60px) rotate(0deg) scale(0.8);
		}
		45% {
			transform: translateY(20px) rotate(180deg) scale(1);
		}
		55% {
			transform: translateY(5px) rotate(200deg) scale(1.1);
		}
		65% {
			transform: translateY(18px) rotate(220deg) scale(1);
		}
		75% {
			transform: translateY(12px) rotate(230deg) scale(1.05);
		}
		85% {
			transform: translateY(18px) rotate(240deg) scale(1);
		}
		100% {
			opacity: 1;
			transform: translateY(18px) rotate(250deg) scale(1);
		}
	}

	@keyframes coinShake {
		0%,
		100% {
			transform: translateY(18px) translateX(0) rotate(250deg);
		}
		50% {
			transform: translateY(18px) translateX(-3px) rotate(250deg);
		}
	}

	.loss-amount {
		@apply font-black;
		font-size: clamp(36px, 10vw, 56px);
		color: #ef4444;
		text-shadow:
			0 0 10px rgba(239, 68, 68, 0.4),
			0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.loss-label {
		font-size: clamp(12px, 3vw, 14px);
		color: rgba(255, 255, 255, 0.5);
	}

	/* 하단: 셰프 + 버튼 - 쿵! (3번째) */
	.bottom-section {
		@apply relative;
		@apply flex flex-col items-center gap-4;
		@apply w-full;
		animation: slamDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1s both;
	}

	.chef-area {
		@apply flex items-end gap-2;
	}

	.chef-img {
		width: clamp(140px, 38vw, 200px);
		height: auto;
		filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
	}

	.bubble-wrapper {
		@apply mb-8;
	}

	/* 스킵 힌트 */
	.skip-hint {
		@apply absolute bottom-8 left-1/2 -translate-x-1/2;
		@apply text-gray-400;
		font-size: clamp(12px, 3vw, 16px);
		animation: hintFade 1.5s ease-in-out infinite;
	}

	@keyframes hintFade {
		0%,
		100% {
			opacity: 0.4;
		}
		50% {
			opacity: 0.8;
		}
	}
</style>
