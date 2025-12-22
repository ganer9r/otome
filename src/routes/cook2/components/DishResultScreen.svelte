<script lang="ts">
	import { onMount } from 'svelte';
	import type { Ingredient, Recipe, CookResult } from '../lib/types';
	import { GRADE_COLORS } from '../lib/types';
	import { getProgressByGrade } from '../lib/data/ingredients';
	import { unlockedIngredientsStore, runStore, upgradeStore } from '../lib/store';
	import { getChefImage, getRandomDialogue, type ChefEmotion } from '../lib/chef-images';
	import ResultCard from './ResultCard.svelte';
	import DishResult from './DishResult.svelte';
	import GameButton from './GameButton.svelte';

	interface Props {
		resultIngredient: Ingredient;
		recipe: Recipe;
		/** 요리 결과 (critical/success/fail) */
		cookResult: CookResult;
		/** 재료비 (이미 차감됨) */
		ingredientCost?: number;
		onComplete?: () => void;
		onUseNow?: (ingredientId: number) => void;
	}

	let {
		resultIngredient,
		recipe,
		cookResult,
		ingredientCost = 0,
		onComplete,
		onUseNow
	}: Props = $props();

	// 요리인지 재료인지 구분
	let isDish = $derived(!resultIngredient.isIngredient);

	// 런 상태
	let runState = $derived($runStore);

	// 업그레이드 효과
	let upgradeEffects = $derived(upgradeStore.getEffects());

	// 판매 금액 (cookResult에서 가져옴 + 업그레이드 보너스 적용)
	let baseSellPrice = $derived(cookResult.sellPrice);
	let sellPrice = $derived(Math.round(baseSellPrice * (1 + upgradeEffects.sellBonusRate)));
	// 순이익 (판매가 - 재료비)
	let profit = $derived(sellPrice - ingredientCost);
	let sold = $state(false);

	// 런 진행 중이면 자동 판매 (1회만) - 재료일 때만 여기서 처리
	// 요리는 DishResult 컴포넌트에서 처리하지 않고 여기서 통합 처리
	$effect(() => {
		if (!sold && runState.isRunning && sellPrice > 0) {
			runStore.earn(sellPrice);
			sold = true;
		}
	});

	let unlockedIds = $derived($unlockedIngredientsStore);
	let gradeProgress = $derived(getProgressByGrade(unlockedIds, resultIngredient.grade));

	let stage = $state<'heartbeat' | 'explosion' | 'card' | 'cardShake' | 'result'>('heartbeat');
	let cardFlipped = $state(false);
	let cardShaking = $state(false);
	let canSkip = $state(true);

	// 대성공 여부
	let isCritical = $derived(cookResult.resultType === 'critical');

	const potImage = '/imgs/cw_pot.webp';

	// 캐릭터 이모션 결정 (cookResult 기반)
	let chefEmotion = $derived((): ChefEmotion => {
		// 결과 타입에 따른 감정
		if (cookResult.resultType === 'critical') return 'surprised';
		if (cookResult.resultType === 'fail') return 'embarrassed';
		// success인 경우
		if (resultIngredient.isIngredient) return 'surprised'; // 새 재료 발견
		const gradeIndex = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'R'].indexOf(resultIngredient.grade);
		if (gradeIndex >= 6) return 'surprised'; // A, R 등급
		if (gradeIndex >= 4) return 'happy'; // C, B 등급
		return 'proud'; // 일반
	});
	let chefImage = $derived(getChefImage(chefEmotion()));
	let chefDialogue = $state('');

	$effect(() => {
		chefDialogue = getRandomDialogue(chefEmotion());
	});

	let explosionTheme = $derived(() => {
		// 재료 획득: 빨간색
		if (resultIngredient.isIngredient) {
			return { color: '#dc2626', particles: ['✨', '❤️', '🔥'] };
		}
		// 요리 완성: 등급별 색상
		const gradeIndex = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'R'].indexOf(resultIngredient.grade);
		if (gradeIndex >= 6) return { color: '#FBBF24', particles: ['✨', '⭐', '💫'] };
		if (gradeIndex >= 4) return { color: '#A855F7', particles: ['✨', '💜', '🔮'] };
		return { color: '#3B82F6', particles: ['✨', '💠', '🌟'] };
	});

	onMount(() => {
		const timers: ReturnType<typeof setTimeout>[] = [];

		timers.push(
			setTimeout(() => {
				stage = 'explosion';
			}, 1200)
		);

		timers.push(
			setTimeout(() => {
				stage = 'card';
				if (isCritical) {
					cardShaking = true;
				}
			}, 2000)
		);

		if (isCritical) {
			// 대성공: 2초 흔들림 후 뒤집기
			timers.push(
				setTimeout(() => {
					cardShaking = false;
					cardFlipped = true;
				}, 4000)
			); // 2초 흔들림

			timers.push(
				setTimeout(() => {
					stage = 'result';
				}, 4800)
			);
		} else {
			// 일반: 바로 뒤집기
			timers.push(
				setTimeout(() => {
					cardFlipped = true;
				}, 2500)
			);

			timers.push(
				setTimeout(() => {
					stage = 'result';
				}, 3300)
			);
		}

		return () => {
			timers.forEach((t) => clearTimeout(t));
		};
	});

	function handleSkip() {
		if (stage !== 'result' && canSkip) {
			stage = 'result';
			cardFlipped = true;
		}
	}

	function handleUseNow() {
		onUseNow?.(resultIngredient.id);
	}
	function handleSell() {
		if (resultIngredient.sellPrice) {
			runStore.earn(resultIngredient.sellPrice);
			onComplete?.();
		}
	}
	function handleConfirm() {
		onComplete?.();
	}

	const lightRays = Array.from({ length: 24 }, (_, i) => ({
		angle: i * 15,
		width: 2 + Math.random() * 6,
		delay: Math.random() * 0.2
	}));

	const burstParticles = Array.from({ length: 40 }, (_, i) => ({
		angle: i * 9 + Math.random() * 9,
		distance: 80 + Math.random() * 200,
		size: 0.6 + Math.random() * 0.8,
		delay: Math.random() * 0.3
	}));

	const rings = Array.from({ length: 3 }, (_, i) => ({
		delay: i * 0.15,
		scale: 1 + i * 0.5
	}));
</script>

<!-- 요리 또는 실패: DishResult 사용 -->
{#if isDish || cookResult.resultType === 'fail'}
	<DishResult {resultIngredient} {cookResult} {sellPrice} {profit} onComplete={handleConfirm} />
{:else}
	<!-- 재료 성공/대성공: 카드 뒤집기 연출 -->
	<div
		class="result-screen"
		onclick={handleSkip}
		onkeydown={(e) => e.key === 'Enter' && handleSkip()}
		role="button"
		tabindex="0"
	>
		{#if stage === 'heartbeat'}
			<div class="stage-heartbeat">
				<div class="pot-wrapper">
					<div class="pot-glow"></div>
					<img src={potImage} alt="냄비" class="pot-shaking" />
				</div>
				<div class="heartbeat-text">두근두근...</div>
				<div class="heartbeat-hearts">
					<span class="heart heart-1">💓</span>
					<span class="heart heart-2">💗</span>
					<span class="heart heart-3">💓</span>
				</div>
			</div>
		{:else if stage === 'explosion'}
			<div class="stage-explosion">
				<div class="center-flash" style="--color: {explosionTheme().color}"></div>
				{#each rings as ring}
					<div
						class="explosion-ring"
						style="--delay: {ring.delay}s; --scale: {ring.scale}; --color: {explosionTheme().color}"
					></div>
				{/each}
				<div class="rays-container">
					{#each lightRays as ray}
						<div
							class="light-ray"
							style="--angle: {ray.angle}deg; --width: {ray.width}px; --delay: {ray.delay}s; --color: {explosionTheme()
								.color}"
						></div>
					{/each}
				</div>
				<div class="particles-container">
					{#each burstParticles as particle, i}
						<div
							class="burst-particle"
							style="--angle: {particle.angle}deg; --distance: {particle.distance}px; --size: {particle.size}; --delay: {particle.delay}s"
						>
							{explosionTheme().particles[i % 3]}
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="stage-card" class:critical={isCritical}>
				<!-- 대성공 배경 플래시 -->
				{#if isCritical && cardFlipped}
					<div class="critical-flash"></div>
				{/if}

				<div class="card-result-container">
					<!-- 카드 영역 -->
					<div class="card-chef-area">
						<!-- 대성공 흔들림 텍스트 -->
						{#if cardShaking}
							<div class="shake-text">두근두근...</div>
						{/if}
						<!-- 대성공 배너 -->
						{#if isCritical && cardFlipped}
							<div class="critical-banner">대성공!</div>
						{/if}
						<!-- 카드 -->
						<div
							class="card-wrapper"
							class:card-entered={stage === 'card' || stage === 'result'}
							class:card-shaking={cardShaking}
							class:critical={isCritical && cardFlipped}
						>
							<!-- 대성공 글로우 -->
							{#if isCritical && cardFlipped}
								<div class="card-glow"></div>
							{/if}
							<div
								class="sunburst-wrapper"
								class:card-entered={stage === 'card' || stage === 'result'}
								class:critical={isCritical && cardFlipped}
							>
								<img src="/imgs/bg-sunburst.png" alt="" class="sunburst-img" />
							</div>
							<ResultCard ingredient={resultIngredient} flipped={cardFlipped} />
							<!-- 대성공 반짝이 -->
							{#if isCritical && cardFlipped}
								<!-- 별 모양 -->
								<div class="sparkle sparkle-star sparkle-1"></div>
								<div class="sparkle sparkle-star sparkle-2"></div>
								<div class="sparkle sparkle-star sparkle-3"></div>
								<!-- 원형 글로우 -->
								<div class="sparkle sparkle-circle sparkle-4"></div>
								<div class="sparkle sparkle-circle sparkle-5"></div>
								<div class="sparkle sparkle-circle sparkle-6"></div>
								<!-- 이모지 -->
								<div class="sparkle sparkle-emoji sparkle-7">✨</div>
								<div class="sparkle sparkle-emoji sparkle-8">⭐</div>
								<div class="sparkle sparkle-emoji sparkle-9">💫</div>
								<div class="sparkle sparkle-emoji sparkle-10">🌟</div>
							{/if}
						</div>
					</div>

					<!-- 하단 정보 (심플) -->
					{#if stage === 'result'}
						<div class="result-info">
							<!-- 수익 표시 -->
							{#if sellPrice > 0}
								<div class="profit-display">
									<span
										class="profit-amount"
										class:positive={profit >= 0}
										class:negative={profit < 0}
									>
										{profit >= 0 ? '+' : ''}{profit.toLocaleString()}원
									</span>
								</div>
							{/if}

							<!-- 진행률 -->
							<div class="progress-display">
								<span class="progress-text" style="color: {GRADE_COLORS[resultIngredient.grade]}">
									{resultIngredient.grade}등급 {gradeProgress.discovered}/{gradeProgress.total}
								</span>
							</div>
						</div>
					{/if}
				</div>

				<!-- 하단 영역: 캐릭터 + 버튼 -->
				{#if stage === 'result'}
					<div class="bottom-area">
						<!-- 캐릭터 -->
						<div class="chef-section" class:critical={isCritical}>
							<div class="chef-bubble" class:critical={isCritical}>{chefDialogue}</div>
							<img src={chefImage} alt="셰프" class="chef-img" />
						</div>

						<!-- 버튼 -->
						<div class="button-row">
							{#if onUseNow}
								<GameButton variant="secondary" size="lg" class="flex-1" onclick={handleUseNow}>
									바로 써보기
								</GameButton>
							{/if}
							<GameButton variant="primary" size="lg" class="flex-1" onclick={handleConfirm}>
								확인
							</GameButton>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		{#if stage !== 'result' && canSkip}
			<div class="skip-hint">탭하여 스킵</div>
		{/if}
	</div>
{/if}

<style lang="postcss">
	@reference '$styles/app.css';

	.result-screen {
		@apply fixed inset-0 z-50;
		@apply flex items-center justify-center;
		@apply cursor-pointer overflow-hidden;
		@apply bg-gradient-to-br from-orange-100 via-amber-100 to-orange-200;
	}

	/* 1단계: 두근두근 */
	.stage-heartbeat {
		@apply relative z-10 flex flex-col items-center gap-4;
	}

	.pot-wrapper {
		@apply relative;
	}

	.pot-glow {
		@apply absolute inset-0 rounded-full;
		background: radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%);
		animation: potGlowPulse 0.5s ease-in-out infinite;
		transform: scale(1.5);
	}

	@keyframes potGlowPulse {
		0%,
		100% {
			opacity: 0.5;
			transform: scale(1.5);
		}
		50% {
			opacity: 0.9;
			transform: scale(1.8);
		}
	}

	.pot-shaking {
		@apply relative z-10 h-48 w-48 object-contain;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
		animation: potShake 0.15s ease-in-out infinite;
	}

	@keyframes potShake {
		0%,
		100% {
			transform: rotate(0deg) translateX(0) translateY(0);
		}
		25% {
			transform: rotate(-2deg) translateX(-4px) translateY(-2px);
		}
		75% {
			transform: rotate(2deg) translateX(4px) translateY(-2px);
		}
	}

	.heartbeat-text {
		@apply font-bold text-orange-800;
		font-size: var(--font-xl);
		animation: textPulse 0.5s ease-in-out infinite;
	}

	@keyframes textPulse {
		0%,
		100% {
			opacity: 0.6;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	.heartbeat-hearts {
		@apply flex gap-4;
	}

	.heart {
		font-size: clamp(40px, 10vw, 60px);
		animation: heartFloat 0.8s ease-in-out infinite;
	}

	.heart-1 {
		animation-delay: 0s;
	}
	.heart-2 {
		animation-delay: 0.2s;
	}
	.heart-3 {
		animation-delay: 0.4s;
	}

	@keyframes heartFloat {
		0%,
		100% {
			transform: scale(1) translateY(0);
		}
		50% {
			transform: scale(1.3) translateY(-10px);
		}
	}

	/* 2단계: 빛 폭발 */
	.stage-explosion {
		@apply absolute inset-0 flex items-center justify-center;
	}

	.center-flash {
		@apply absolute;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: radial-gradient(circle, white 0%, var(--color) 50%, transparent 70%);
		animation: centerFlash 0.8s ease-out forwards;
	}

	@keyframes centerFlash {
		0% {
			transform: scale(0);
			opacity: 1;
		}
		50% {
			transform: scale(3);
			opacity: 1;
		}
		100% {
			transform: scale(8);
			opacity: 0;
		}
	}

	.explosion-ring {
		@apply absolute;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		border: 4px solid var(--color);
		animation: ringExpand 0.8s ease-out var(--delay) forwards;
		opacity: 0;
	}

	@keyframes ringExpand {
		0% {
			transform: scale(0);
			opacity: 1;
		}
		100% {
			transform: scale(calc(var(--scale) * 10));
			opacity: 0;
		}
	}

	.rays-container {
		@apply absolute inset-0 flex items-center justify-center;
	}

	.light-ray {
		@apply absolute;
		width: var(--width);
		height: 0;
		background: linear-gradient(
			to top,
			transparent,
			var(--color),
			white,
			var(--color),
			transparent
		);
		transform-origin: center bottom;
		transform: rotate(var(--angle)) translateY(-50%);
		animation: rayShoot 0.6s ease-out var(--delay) forwards;
	}

	@keyframes rayShoot {
		0% {
			height: 0;
			opacity: 0;
		}
		30% {
			opacity: 1;
		}
		100% {
			height: 150vh;
			opacity: 0;
		}
	}

	.particles-container {
		@apply absolute inset-0 flex items-center justify-center;
	}

	.burst-particle {
		@apply absolute;
		font-size: calc(clamp(20px, 5vw, 32px) * var(--size));
		animation: particleBurst 0.8s ease-out var(--delay) forwards;
		opacity: 0;
	}

	@keyframes particleBurst {
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

	/* 3-4단계: 카드 */
	.stage-card {
		@apply relative z-10 flex h-full w-full flex-col items-center justify-between overflow-hidden;
	}

	.card-result-container {
		@apply relative z-20 flex h-full w-full flex-col items-center py-4;
		overflow: hidden;
	}

	/* 후광 효과 (카드 중앙 기준) */
	.sunburst-wrapper {
		@apply pointer-events-none absolute;
		width: 150vw;
		height: 150vw;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
		z-index: -1;
		transition: opacity 0.6s ease-out;
	}

	.sunburst-wrapper.card-entered {
		opacity: 0.6;
	}

	.sunburst-img {
		@apply h-full w-full object-contain;
		animation: sunburstRotate 20s linear infinite;
	}

	@keyframes sunburstRotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* 카드 래퍼 */
	.card-wrapper {
		@apply relative flex-shrink-0;
		z-index: 10;
		transform: scale(0) translateY(50px);
		opacity: 0;
		transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.card-wrapper.card-entered {
		transform: scale(1) translateY(0);
		opacity: 1;
	}

	/* 대성공 카드 흔들림 */
	.card-wrapper.card-shaking {
		animation: cardShake 0.15s ease-in-out infinite;
	}

	@keyframes cardShake {
		0%,
		100% {
			transform: scale(1) translateY(0) rotate(0deg);
		}
		25% {
			transform: scale(1) translateY(0) rotate(-3deg) translateX(-5px);
		}
		75% {
			transform: scale(1) translateY(0) rotate(3deg) translateX(5px);
		}
	}

	/* 대성공 카드 글로우 */
	.card-wrapper.critical {
		filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
	}

	.card-glow {
		@apply pointer-events-none absolute;
		top: -20px;
		left: -20px;
		right: -20px;
		bottom: -20px;
		background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
		animation: cardGlowPulse 1.5s ease-in-out infinite;
		z-index: -1;
	}

	@keyframes cardGlowPulse {
		0%,
		100% {
			opacity: 0.5;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	/* 대성공 배너 */
	.critical-banner {
		@apply absolute left-1/2 -translate-x-1/2;
		top: -50px;
		@apply font-black;
		font-size: clamp(28px, 7vw, 40px);
		background: linear-gradient(135deg, #ffd700 0%, #ffb300 50%, #ffd700 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 2px 4px rgba(255, 180, 0, 0.5));
		animation: bannerPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
		z-index: 30;
	}

	@keyframes bannerPop {
		0% {
			transform: translateX(-50%) scale(0);
			opacity: 0;
		}
		60% {
			transform: translateX(-50%) scale(1.2);
		}
		100% {
			transform: translateX(-50%) scale(1);
			opacity: 1;
		}
	}

	/* 대성공 배경 플래시 */
	.critical-flash {
		@apply pointer-events-none absolute inset-0;
		background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
		animation: flashPulse 0.5s ease-out forwards;
		z-index: 1;
	}

	@keyframes flashPulse {
		0% {
			opacity: 1;
			transform: scale(0.5);
		}
		100% {
			opacity: 0;
			transform: scale(2);
		}
	}

	/* 대성공 후광 강화 */
	.sunburst-wrapper.critical {
		opacity: 0.9;
	}

	.sunburst-wrapper.critical .sunburst-img {
		animation: sunburstRotate 8s linear infinite;
		filter: brightness(1.2) saturate(1.3);
	}

	/* 대성공 반짝이 파티클 */
	.sparkle {
		@apply pointer-events-none absolute;
		z-index: 30;
	}

	/* ===== 별 모양 (큰 별 blur + 작은 별 선명 겹치기) ===== */
	.sparkle-star {
		background: transparent;
	}

	.sparkle-star::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 180%;
		height: 180%;
		background: rgba(255, 215, 0, 0.9);
		clip-path: polygon(
			50% 0%,
			61% 35%,
			98% 35%,
			68% 57%,
			79% 91%,
			50% 70%,
			21% 91%,
			32% 57%,
			2% 35%,
			39% 35%
		);
		filter: blur(6px);
	}

	.sparkle-star::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		background: #fff;
		clip-path: polygon(
			50% 0%,
			61% 35%,
			98% 35%,
			68% 57%,
			79% 91%,
			50% 70%,
			21% 91%,
			32% 57%,
			2% 35%,
			39% 35%
		);
	}

	.sparkle-1 {
		width: 26px;
		height: 26px;
		top: -15px;
		right: -15px;
		animation: sparkleFlash 0.8s ease-in-out infinite;
	}

	.sparkle-2 {
		width: 20px;
		height: 20px;
		top: 20%;
		left: -18px;
		animation: sparkleFlash 1s ease-in-out 0.3s infinite;
	}

	.sparkle-3 {
		width: 22px;
		height: 22px;
		bottom: -10px;
		right: 20%;
		animation: sparkleFlash 0.9s ease-in-out 0.6s infinite;
	}

	/* ===== 원형 글로우 ===== */
	.sparkle-circle {
		border-radius: 50%;
		background: #fff;
		box-shadow:
			0 0 8px 4px #fff,
			0 0 16px 8px rgba(255, 215, 0, 0.7),
			0 0 24px 12px rgba(255, 215, 0, 0.4);
	}

	.sparkle-4 {
		width: 12px;
		height: 12px;
		top: -8px;
		left: 25%;
		animation: sparkleGlow 1s ease-in-out infinite;
	}

	.sparkle-5 {
		width: 10px;
		height: 10px;
		bottom: 15%;
		left: -12px;
		animation: sparkleGlow 0.8s ease-in-out 0.4s infinite;
	}

	.sparkle-6 {
		width: 8px;
		height: 8px;
		top: 40%;
		right: -10px;
		animation: sparkleGlow 0.9s ease-in-out 0.7s infinite;
	}

	/* ===== 이모지 파티클 ===== */
	.sparkle-emoji {
		font-size: 20px;
		filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8));
	}

	.sparkle-7 {
		top: -20px;
		left: 10%;
		animation: emojiFloat 1.2s ease-in-out infinite;
	}

	.sparkle-8 {
		bottom: -15px;
		left: -5px;
		font-size: 18px;
		animation: emojiFloat 1s ease-in-out 0.2s infinite;
	}

	.sparkle-9 {
		top: 30%;
		right: -20px;
		font-size: 16px;
		animation: emojiFloat 1.1s ease-in-out 0.5s infinite;
	}

	.sparkle-10 {
		bottom: 20%;
		right: -15px;
		font-size: 22px;
		animation: emojiFloat 1.3s ease-in-out 0.8s infinite;
	}

	@keyframes sparkleFlash {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(0.6);
		}
		50% {
			opacity: 1;
			transform: scale(1.3);
		}
	}

	@keyframes sparkleGlow {
		0%,
		100% {
			opacity: 0.5;
			transform: scale(0.5);
		}
		50% {
			opacity: 1;
			transform: scale(1.5);
		}
	}

	@keyframes emojiFloat {
		0%,
		100% {
			opacity: 0.6;
			transform: translateY(0) scale(0.8) rotate(-10deg);
		}
		50% {
			opacity: 1;
			transform: translateY(-8px) scale(1.1) rotate(10deg);
		}
	}

	/* 대성공 두근두근 텍스트 */
	.shake-text {
		@apply absolute -top-12 left-1/2 -translate-x-1/2;
		@apply font-bold text-amber-600;
		font-size: clamp(18px, 4.5vw, 24px);
		animation: shakeTextPulse 0.5s ease-in-out infinite;
		white-space: nowrap;
		z-index: 20;
	}

	@keyframes shakeTextPulse {
		0%,
		100% {
			opacity: 0.6;
			transform: translateX(-50%) scale(1);
		}
		50% {
			opacity: 1;
			transform: translateX(-50%) scale(1.1);
		}
	}

	/* 결과 UI */
	.result-ui {
		@apply mt-3 flex w-full flex-shrink-0 flex-col items-center px-4;
		max-width: min(55vh * 0.68, 280px);
		gap: 2vh;
		animation: resultFadeIn 0.5s ease-out;
	}

	@keyframes resultFadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* 수익 섹션 */
	.profit-section {
		@apply flex w-full flex-col rounded-2xl;
		padding: 1.5vh 2vh;
		gap: 0.6vh;
		background: rgba(255, 255, 255, 0.85);
		border: 3px solid #e8d4a8;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
	}

	.profit-row {
		@apply flex w-full items-center justify-between;
	}

	.profit-row.total {
		@apply pt-1;
	}

	.profit-label {
		@apply font-bold;
		color: #8d6e63;
		font-size: clamp(11px, 1.5vh, 13px);
	}

	.profit-row.total .profit-label {
		@apply font-bold;
		color: #5d4037;
		font-size: clamp(12px, 1.7vh, 14px);
	}

	.profit-value {
		@apply font-bold;
		color: #5d4037;
		font-size: clamp(12px, 1.6vh, 14px);
	}

	.profit-value.sell {
		color: #4caf50;
	}

	.profit-value.cost {
		color: #d32f2f;
	}

	.profit-value.positive {
		color: #4caf50;
		font-size: clamp(14px, 2vh, 18px);
	}

	.profit-value.negative {
		color: #d32f2f;
		font-size: clamp(14px, 2vh, 18px);
	}

	.profit-divider {
		@apply w-full;
		border-top: 2px solid #e8d4a8;
		margin: 0.3vh 0;
	}

	.progress-section {
		@apply flex w-full flex-col items-center rounded-2xl;
		padding: 1.5vh 2vh;
		gap: 0.8vh;
		background: rgba(255, 255, 255, 0.75);
		border: 3px solid #e8d4a8;
	}

	.progress-item {
		@apply flex w-full justify-between;
	}
	.progress-label {
		@apply font-bold;
		font-size: clamp(11px, 1.6vh, 14px);
	}
	.progress-value {
		@apply font-bold;
		color: #5d4037;
		font-size: clamp(11px, 1.6vh, 14px);
	}
	.progress-bar {
		@apply w-full overflow-hidden rounded-full;
		background: #e0d4c0;
		border: 2px solid #c9b896;
		height: clamp(6px, 1vh, 10px);
	}
	.progress-fill {
		@apply h-full rounded-full;
		transition: width 0.5s ease-out;
	}
	.progress-total {
		color: #8d6e63;
		font-size: clamp(10px, 1.4vh, 12px);
	}

	.button-group {
		@apply flex w-full flex-col items-center;
		gap: 1vh;
	}

	.use-now-button {
		@apply w-full rounded-xl font-bold;
		padding: 1.2vh 2vh;
		font-size: clamp(12px, 1.8vh, 16px);
		transition: all 0.2s;
		background: linear-gradient(to bottom, #ffb74d, #ff9800);
		color: #5d4037;
		border: 3px solid #f57c00;
		box-shadow: 0 3px 0 #e65100;
	}

	.use-now-button:hover {
		filter: brightness(1.05);
	}

	.use-now-button:active {
		box-shadow: 0 1px 0 #e65100;
		transform: translateY(2px);
	}

	.confirm-button {
		@apply w-full rounded-xl font-bold;
		padding: 1.2vh 2vh;
		font-size: clamp(12px, 1.8vh, 16px);
		transition: all 0.2s;
		background: rgba(255, 255, 255, 0.9);
		color: #5d4037;
		border: 3px solid #e8d4a8;
	}

	.confirm-button:hover {
		background: rgba(255, 255, 255, 1);
	}

	.confirm-button:active {
		transform: translateY(1px);
	}

	.skip-hint {
		@apply absolute bottom-8 left-1/2 -translate-x-1/2 text-orange-700/60;
		font-size: var(--font-sm);
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

	/* ===== 카드 + 캐릭터 레이어드 ===== */
	.card-chef-area {
		@apply relative;
		@apply flex justify-center;
	}

	/* 하단 영역: 캐릭터 + 버튼 */
	.bottom-area {
		@apply relative;
		@apply flex flex-col items-center;
		@apply w-full;
		@apply px-4 pb-4;
		animation: resultFadeIn 0.4s ease-out;
	}

	.chef-section {
		@apply absolute;
		@apply flex flex-col items-center;
		right: 16px;
		bottom: 70px;
		z-index: 10;
	}

	.chef-img {
		width: clamp(160px, 45vw, 240px);
		height: auto;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
		animation: chefBounce 1.5s ease-in-out infinite;
	}

	@keyframes chefBounce {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-8px) scale(1.02);
		}
	}

	/* 대성공 시 더 역동적인 애니메이션 */
	.chef-section.critical .chef-img {
		animation: chefJump 0.6s ease-in-out infinite;
	}

	@keyframes chefJump {
		0%,
		100% {
			transform: translateY(0) scale(1) rotate(0deg);
		}
		25% {
			transform: translateY(-15px) scale(1.05) rotate(-3deg);
		}
		50% {
			transform: translateY(0) scale(1) rotate(0deg);
		}
		75% {
			transform: translateY(-15px) scale(1.05) rotate(3deg);
		}
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
		max-width: 160px;
		text-align: center;
	}

	.chef-bubble.critical {
		background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
		border-color: #f59e0b;
		color: #92400e;
		box-shadow:
			0 2px 0 #d97706,
			0 0 15px rgba(251, 191, 36, 0.4);
	}

	/* ===== 하단 결과 정보 (심플) ===== */
	.result-info {
		@apply flex flex-col items-center gap-3;
		@apply mt-4 px-4;
		@apply w-full max-w-sm;
		animation: resultFadeIn 0.4s ease-out;
	}

	.profit-display {
		@apply text-center;
	}

	.profit-amount {
		@apply font-black;
		font-size: clamp(28px, 7vw, 40px);
		text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
	}

	.profit-amount.positive {
		color: #4caf50;
	}

	.profit-amount.negative {
		color: #d32f2f;
	}

	.bonus-badge {
		@apply mt-2 px-4 py-1.5;
		@apply rounded-full;
		@apply font-bold;
		font-size: clamp(12px, 3vw, 16px);
		background: linear-gradient(180deg, #ffd54f 0%, #ffb300 100%);
		color: #5d4037;
		border: 2px solid #ff8f00;
		box-shadow: 0 2px 4px rgba(255, 143, 0, 0.3);
		animation: bonusPop 0.5s ease-out;
	}

	@keyframes bonusPop {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.progress-display {
		@apply text-center;
	}

	.progress-text {
		@apply font-bold;
		font-size: clamp(14px, 3.5vw, 18px);
	}

	.button-row {
		@apply flex gap-3;
		@apply w-full;
		max-width: 24rem;
	}
</style>
