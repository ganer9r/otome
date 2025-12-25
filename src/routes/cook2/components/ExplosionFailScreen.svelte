<script lang="ts">
	import { onMount } from 'svelte';
	import { getChefImage, getRandomDialogue } from '../lib/chef-images';
	import GameButton from './GameButton.svelte';
	import { runStore } from '../lib/store';
	import CapitalHUD from './CapitalHUD.svelte';

	interface Props {
		/** 재료비 손실 */
		ingredientCost?: number;
		onComplete?: () => void;
	}

	let { ingredientCost = 0, onComplete }: Props = $props();

	// 런 상태 (자본 표시용)
	let runState = $derived($runStore);

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
		// 1. 냄비 흔들림 (0.8초)
		const timer1 = setTimeout(() => {
			stage = 'explosion';
		}, 800);

		// 2. 폭발 (1초 후 결과)
		const timer2 = setTimeout(() => {
			stage = 'result';
		}, 1800);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
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
	onclick={handleSkip}
	onkeydown={(e) => e.key === 'Enter' && handleSkip()}
	role="button"
	tabindex="0"
>
	<!-- HUD -->
	<div class="hud-area">
		<CapitalHUD capital={runState.capital} earnedStars={runState.earnedStars} />
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
			<!-- 상단: 실패 타이틀 -->
			<div class="result-header">
				<span class="header-icon">💥</span>
				<span class="header-text">요리 실패!</span>
				<span class="header-icon">💥</span>
			</div>

			<!-- 중앙: 재 이미지 영역 -->
			<div class="fail-image-container">
				<div class="smoke-bg"></div>
				<div class="ash-pile">🪨</div>
				<div class="floating-smoke">💨</div>
			</div>

			<!-- 실패 메시지 -->
			<div class="fail-info">
				<h2 class="fail-name">{failMessage}</h2>
				<div class="fail-description">이 조합으로는 요리를 만들 수 없어요</div>
			</div>

			<!-- 손실 표시 -->
			{#if ingredientCost > 0}
				<div class="loss-section">
					<span class="loss-icon">💸</span>
					<span class="loss-amount">-{ingredientCost.toLocaleString()}원</span>
				</div>
			{/if}

			<!-- 하단: 셰프 + 버튼 -->
			<div class="bottom-section">
				<div class="chef-area">
					<div class="chef-bubble">{chefDialogue}</div>
					<img src={chefImage} alt="셰프" class="chef-img" />
				</div>
				<GameButton variant="secondary" size="lg" class="w-full max-w-xs" onclick={handleConfirm}>
					확인
				</GameButton>
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

	.result-header {
		@apply flex items-center gap-2;
		animation: headerSlide 0.5s ease-out;
	}

	@keyframes headerSlide {
		0% {
			opacity: 0;
			transform: translateY(-30px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.header-icon {
		font-size: clamp(24px, 6vw, 36px);
	}

	.header-text {
		@apply font-black text-red-400;
		font-size: clamp(28px, 7vw, 42px);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	/* 실패 이미지 영역 */
	.fail-image-container {
		@apply relative;
		@apply flex items-center justify-center;
		width: clamp(140px, 40vw, 200px);
		height: clamp(140px, 40vw, 200px);
		animation: failImagePop 0.5s ease-out 0.2s both;
	}

	@keyframes failImagePop {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.smoke-bg {
		@apply absolute inset-0 rounded-full;
		background: radial-gradient(circle, rgba(80, 80, 80, 0.4) 0%, transparent 70%);
		animation: smokeBg 2s ease-in-out infinite;
	}

	@keyframes smokeBg {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.2);
			opacity: 0.3;
		}
	}

	.ash-pile {
		@apply relative z-10;
		font-size: clamp(80px, 20vw, 120px);
		filter: grayscale(0.5) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
	}

	.floating-smoke {
		@apply absolute;
		top: 10%;
		right: 10%;
		font-size: clamp(30px, 8vw, 50px);
		animation: floatSmoke 1.5s ease-in-out infinite;
		opacity: 0.7;
	}

	@keyframes floatSmoke {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-15px) rotate(10deg);
		}
	}

	/* 실패 정보 */
	.fail-info {
		@apply flex flex-col items-center gap-2;
		animation: infoFade 0.4s ease-out 0.3s both;
	}

	@keyframes infoFade {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.fail-name {
		@apply font-black text-gray-200;
		font-size: clamp(22px, 5.5vw, 32px);
	}

	.fail-description {
		@apply text-gray-400;
		font-size: clamp(14px, 3.5vw, 18px);
	}

	/* 손실 표시 */
	.loss-section {
		@apply flex items-center gap-2;
		animation: lossPop 0.4s ease-out 0.4s both;
	}

	@keyframes lossPop {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.loss-icon {
		font-size: clamp(28px, 7vw, 40px);
	}

	.loss-amount {
		@apply font-black text-red-400;
		font-size: clamp(32px, 8vw, 48px);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	/* 하단: 셰프 + 버튼 */
	.bottom-section {
		@apply relative;
		@apply flex flex-col items-center;
		@apply w-full;
		animation: bottomFade 0.4s ease-out 0.5s both;
	}

	@keyframes bottomFade {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.chef-area {
		@apply absolute;
		@apply flex flex-col items-center;
		right: 8px;
		bottom: 60px;
	}

	.chef-bubble {
		@apply px-3 py-1.5;
		@apply rounded-xl;
		@apply font-bold;
		font-size: clamp(11px, 3vw, 14px);
		background: white;
		border: 2px solid #5d4037;
		color: #5d4037;
		box-shadow: 0 2px 0 #3e2723;
		margin-bottom: 4px;
		max-width: 120px;
		text-align: center;
	}

	.chef-img {
		width: clamp(100px, 28vw, 140px);
		height: auto;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
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
