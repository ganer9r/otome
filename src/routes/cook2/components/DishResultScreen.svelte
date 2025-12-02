<script lang="ts">
	import { onMount } from 'svelte';
	import type { Ingredient, Recipe } from '../lib/types';
	import { GRADE_COLORS } from '../lib/types';
	import { getProgressByGrade, getTotalProgress } from '../lib/data/ingredients';
	import { unlockedIngredientsStore, runStore } from '../lib/store';
	import ResultCard from './ResultCard.svelte';

	interface Props {
		resultIngredient: Ingredient;
		recipe: Recipe;
		onComplete?: () => void;
		onUseNow?: (ingredientId: number) => void;
		onSell?: (ingredientId: number, sellPrice: number) => void;
	}

	let { resultIngredient, recipe, onComplete, onUseNow, onSell }: Props = $props();

	// 런 상태
	let runState = $derived($runStore);

	// 요리인지 & 판매가가 있는지
	let canSell = $derived(
		!resultIngredient.isIngredient && resultIngredient.sellPrice && runState.isRunning
	);

	let unlockedIds = $derived($unlockedIngredientsStore);
	let gradeProgress = $derived(getProgressByGrade(unlockedIds, resultIngredient.grade));
	let totalProgress = $derived(getTotalProgress(unlockedIds));

	let stage = $state<'heartbeat' | 'explosion' | 'card' | 'result'>('heartbeat');
	let cardFlipped = $state(false);
	let canSkip = $state(true);

	const potImage = '/imgs/cw_pot.webp';

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
		const timer1 = setTimeout(() => {
			stage = 'explosion';
		}, 1200);
		const timer2 = setTimeout(() => {
			stage = 'card';
		}, 2000);
		const timer3 = setTimeout(() => {
			cardFlipped = true;
		}, 2500);
		const timer4 = setTimeout(() => {
			stage = 'result';
		}, 3300);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
			clearTimeout(timer4);
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
			onSell?.(resultIngredient.id, resultIngredient.sellPrice);
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
		<div class="stage-card">
			<div class="card-result-container">
				<!-- 카드 -->
				<div class="card-wrapper" class:card-entered={stage === 'card' || stage === 'result'}>
					<!-- 후광 효과 (카드 중앙 기준) -->
					<div class="sunburst-wrapper" class:card-entered={stage === 'card' || stage === 'result'}>
						<img src="/imgs/bg-sunburst.png" alt="" class="sunburst-img" />
					</div>
					<ResultCard ingredient={resultIngredient} flipped={cardFlipped} />
				</div>

				{#if stage === 'result'}
					<div class="result-ui">
						<div class="progress-section">
							<div class="progress-item">
								<span class="progress-label" style="color: {GRADE_COLORS[resultIngredient.grade]}"
									>{resultIngredient.grade}등급</span
								>
								<span class="progress-value"
									>{gradeProgress.discovered}/{gradeProgress.total} ({gradeProgress.percent}%)</span
								>
							</div>
							<div class="progress-bar">
								<div
									class="progress-fill"
									style="width: {gradeProgress.percent}%; background-color: {GRADE_COLORS[
										resultIngredient.grade
									]}"
								></div>
							</div>
							<div class="progress-total">
								전체 발견: {totalProgress.discovered}/{totalProgress.total}
							</div>
						</div>
						<div class="button-group">
							{#if resultIngredient.isIngredient && onUseNow}
								<button type="button" class="use-now-button" onclick={handleUseNow}
									>🧪 바로 써보기</button
								>
							{/if}
							{#if canSell}
								<button type="button" class="sell-button" onclick={handleSell}
									>💰 판매하기 ({resultIngredient.sellPrice?.toLocaleString()}원)</button
								>
							{/if}
							<button type="button" class="confirm-button" onclick={handleConfirm}>확인</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	{#if stage !== 'result' && canSkip}
		<div class="skip-hint">탭하여 스킵</div>
	{/if}
</div>

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
		@apply relative z-10 flex h-full w-full items-center justify-center overflow-hidden;
	}

	.card-result-container {
		@apply relative z-20 flex h-full w-full flex-col items-center overflow-x-hidden overflow-y-auto py-4;
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

	.progress-section {
		@apply flex w-full flex-col items-center rounded-xl bg-white/70 shadow-sm;
		padding: 1.5vh 2vh;
		gap: 0.8vh;
	}

	.progress-item {
		@apply flex w-full justify-between;
	}
	.progress-label {
		@apply font-bold;
		font-size: clamp(11px, 1.6vh, 14px);
	}
	.progress-value {
		@apply font-medium text-gray-700;
		font-size: clamp(11px, 1.6vh, 14px);
	}
	.progress-bar {
		@apply w-full overflow-hidden rounded-full bg-gray-200;
		height: clamp(4px, 0.8vh, 8px);
	}
	.progress-fill {
		@apply h-full rounded-full;
		transition: width 0.5s ease-out;
	}
	.progress-total {
		@apply text-gray-500;
		font-size: clamp(10px, 1.4vh, 12px);
	}

	.button-group {
		@apply flex w-full flex-col items-center;
		gap: 1vh;
	}

	.use-now-button {
		@apply w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white shadow-md;
		padding: 1.2vh 2vh;
		font-size: clamp(12px, 1.8vh, 16px);
		transition: all 0.2s;
	}

	.use-now-button:hover {
		@apply scale-105;
		box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
	}

	.confirm-button {
		@apply w-full rounded-xl border border-gray-200 bg-white font-bold text-gray-700 shadow-sm;
		padding: 1.2vh 2vh;
		font-size: clamp(12px, 1.8vh, 16px);
		transition: all 0.2s;
	}

	.confirm-button:hover {
		@apply scale-105 bg-gray-50;
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
</style>
