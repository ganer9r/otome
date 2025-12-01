<script lang="ts">
	import { onMount } from 'svelte';
	import type { Ingredient, Recipe } from '../lib/types';
	import { GRADE_COLORS } from '../lib/types';
	import { getProgressByGrade, getTotalProgress } from '../lib/data/ingredients';
	import { unlockedIngredientsStore } from '../lib/store';
	import ResultCard from './ResultCard.svelte';

	interface Props {
		/** 결과 재료 */
		resultIngredient: Ingredient;
		/** 레시피 정보 */
		recipe: Recipe;
		/** 완료 콜백 */
		onComplete?: () => void;
		/** 바로 써보기 콜백 (재료인 경우만) */
		onUseNow?: (ingredientId: number) => void;
	}

	let { resultIngredient, recipe, onComplete, onUseNow }: Props = $props();

	// 진행도 계산
	let unlockedIds = $derived($unlockedIngredientsStore);
	let gradeProgress = $derived(getProgressByGrade(unlockedIds, resultIngredient.grade));
	let totalProgress = $derived(getTotalProgress(unlockedIds));

	// 연출 단계
	let stage = $state<'heartbeat' | 'explosion' | 'card' | 'result'>('heartbeat');

	// 카드 뒤집힘 상태
	let cardFlipped = $state(false);

	// 스킵 가능 여부
	let canSkip = $state(true);

	// 냄비 이미지
	const potImage = '/imgs/cw_pot.webp';

	// 등급별 색상 테마
	let explosionTheme = $derived(() => {
		const gradeIndex = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'R'].indexOf(resultIngredient.grade);
		if (gradeIndex >= 6) {
			return { color: '#FBBF24', particles: ['✨', '⭐', '💫'] }; // A, R - 골드
		}
		if (gradeIndex >= 4) {
			return { color: '#A855F7', particles: ['✨', '💜', '🔮'] }; // C, B - 퍼플
		}
		return { color: '#3B82F6', particles: ['✨', '💠', '🌟'] }; // G~D - 블루
	});

	// 연출 시퀀스
	onMount(() => {
		// 1. 두근두근 (1.2초)
		const timer1 = setTimeout(() => {
			stage = 'explosion';
		}, 1200);

		// 2. 빛 폭발 (0.8초)
		const timer2 = setTimeout(() => {
			stage = 'card';
		}, 2000);

		// 3. 카드 등장 후 뒤집기 (0.5초 후)
		const timer3 = setTimeout(() => {
			cardFlipped = true;
		}, 2500);

		// 4. 결과 UI 표시 (카드 뒤집힌 후 0.8초)
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

	// 스킵 처리
	function handleSkip() {
		if (stage !== 'result' && canSkip) {
			stage = 'result';
			cardFlipped = true;
		}
	}

	// 바로 써보기
	function handleUseNow() {
		onUseNow?.(resultIngredient.id);
	}

	// 확인
	function handleConfirm() {
		onComplete?.();
	}

	// 빛 광선 (더 많고 다양한 두께)
	const lightRays = Array.from({ length: 24 }, (_, i) => ({
		angle: i * 15,
		width: 2 + Math.random() * 6,
		delay: Math.random() * 0.2
	}));

	// 파티클 폭발 (더 많고 다양한 크기)
	const burstParticles = Array.from({ length: 40 }, (_, i) => ({
		angle: i * 9 + Math.random() * 9,
		distance: 80 + Math.random() * 200,
		size: 0.6 + Math.random() * 0.8,
		delay: Math.random() * 0.3
	}));

	// 링 이펙트
	const rings = Array.from({ length: 3 }, (_, i) => ({
		delay: i * 0.15,
		scale: 1 + i * 0.5
	}));

	// recipe를 사용하지 않으면 경고가 나오므로 콘솔에서 확인용 (추후 확장 가능)
	$effect(() => {
		if (recipe) {
			// 레시피 정보 활용 가능
		}
	});
</script>

<!-- 풀스크린 배경 -->
<div
	class="result-screen"
	onclick={handleSkip}
	onkeydown={(e) => e.key === 'Enter' && handleSkip()}
	role="button"
	tabindex="0"
>
	<!-- 배경 -->
	<div class="background-base"></div>

	{#if stage === 'heartbeat'}
		<!-- 1단계: 두근두근 -->
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
		<!-- 2단계: 빛 폭발 -->
		<div class="stage-explosion">
			<!-- 중앙 플래시 -->
			<div class="center-flash" style="--color: {explosionTheme().color}"></div>

			<!-- 확산 링 -->
			{#each rings as ring}
				<div
					class="explosion-ring"
					style="--delay: {ring.delay}s; --scale: {ring.scale}; --color: {explosionTheme().color}"
				></div>
			{/each}

			<!-- 빛 광선 -->
			<div class="rays-container">
				{#each lightRays as ray}
					<div
						class="light-ray"
						style="--angle: {ray.angle}deg; --width: {ray.width}px; --delay: {ray.delay}s; --color: {explosionTheme()
							.color}"
					></div>
				{/each}
			</div>

			<!-- 파티클 폭발 -->
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
		<!-- 3-4단계: 카드 등장 및 결과 -->
		<div class="stage-card">
			<!-- 배경 글로우 -->
			<div class="card-background-glow" style="--color: {explosionTheme().color}"></div>

			<!-- 떠다니는 파티클 -->
			<div class="floating-particles">
				{#each Array(20) as _, i}
					<div
						class="floating-particle"
						style="--x: {Math.random() * 100}%; --y: {Math.random() *
							100}%; --delay: {Math.random() * 3}s; --duration: {2 + Math.random() * 2}s"
					>
						{explosionTheme().particles[i % 3]}
					</div>
				{/each}
			</div>

			<!-- 카드 + 결과 UI 컨테이너 -->
			<div class="card-result-container">
				<!-- 카드 -->
				<div class="card-wrapper" class:card-entered={stage === 'card' || stage === 'result'}>
					<ResultCard ingredient={resultIngredient} flipped={cardFlipped} />
				</div>

				<!-- 결과 UI (카드 아래) -->
				{#if stage === 'result'}
					<div class="result-ui">
						<!-- 진행도 -->
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

						<!-- 버튼 -->
						<div class="button-group">
							{#if resultIngredient.isIngredient && onUseNow}
								<button type="button" class="use-now-button" onclick={handleUseNow}>
									🧪 바로 써보기
								</button>
							{/if}
							<button type="button" class="confirm-button" onclick={handleConfirm}>확인</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- 스킵 힌트 -->
	{#if stage !== 'result' && canSkip}
		<div class="skip-hint">탭하여 스킵</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.result-screen {
		@apply fixed inset-0 z-50;
		@apply flex items-center justify-center;
		@apply overflow-hidden;
		@apply cursor-pointer;
	}

	.background-base {
		@apply absolute inset-0;
		@apply bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900;
	}

	/* ===== 1단계: 두근두근 ===== */
	.stage-heartbeat {
		@apply relative z-10;
		@apply flex flex-col items-center gap-4;
	}

	.pot-wrapper {
		@apply relative;
	}

	.pot-glow {
		@apply absolute inset-0;
		@apply rounded-full;
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
		@apply relative z-10;
		@apply h-48 w-48 object-contain;
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
		@apply font-bold text-white/90;
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

	/* ===== 2단계: 빛 폭발 ===== */
	.stage-explosion {
		@apply absolute inset-0;
		@apply flex items-center justify-center;
	}

	/* 중앙 플래시 */
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

	/* 확산 링 */
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

	/* 빛 광선 */
	.rays-container {
		@apply absolute inset-0;
		@apply flex items-center justify-center;
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

	/* 파티클 폭발 */
	.particles-container {
		@apply absolute inset-0;
		@apply flex items-center justify-center;
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

	/* ===== 3-4단계: 카드 ===== */
	.stage-card {
		@apply relative z-10;
		@apply flex items-center justify-center;
		@apply h-full w-full;
	}

	.card-background-glow {
		@apply absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 50vh;
		height: 50vh;
		background: radial-gradient(circle, var(--color) 0%, transparent 70%);
		opacity: 0.3;
		filter: blur(60px);
		animation: bgGlowPulse 2s ease-in-out infinite;
	}

	@keyframes bgGlowPulse {
		0%,
		100% {
			opacity: 0.2;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 0.4;
			transform: translate(-50%, -50%) scale(1.2);
		}
	}

	/* 떠다니는 파티클 */
	.floating-particles {
		@apply absolute inset-0;
		@apply pointer-events-none;
		@apply overflow-hidden;
	}

	.floating-particle {
		@apply absolute;
		left: var(--x);
		top: var(--y);
		font-size: clamp(16px, 4vw, 24px);
		animation: particleFloat var(--duration) ease-in-out var(--delay) infinite;
		opacity: 0.6;
	}

	@keyframes particleFloat {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
			opacity: 0.4;
		}
		50% {
			transform: translateY(-30px) rotate(180deg);
			opacity: 0.8;
		}
	}

	/* 카드 + 결과 컨테이너 */
	.card-result-container {
		@apply relative z-20;
		@apply flex flex-col items-center;
		@apply h-full w-full;
		@apply py-4;
		@apply overflow-y-auto;
	}

	/* 카드 래퍼 */
	.card-wrapper {
		@apply flex-shrink-0;
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
		@apply flex flex-col items-center;
		@apply mt-3 w-full px-4;
		@apply flex-shrink-0;
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

	/* 진행도 */
	.progress-section {
		@apply flex w-full flex-col items-center;
		@apply rounded-xl bg-white/10;
		@apply backdrop-blur-sm;
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
		@apply font-medium text-white/90;
		font-size: clamp(11px, 1.6vh, 14px);
	}

	.progress-bar {
		@apply w-full overflow-hidden rounded-full bg-white/20;
		height: clamp(4px, 0.8vh, 8px);
	}

	.progress-fill {
		@apply h-full rounded-full;
		transition: width 0.5s ease-out;
	}

	.progress-total {
		@apply text-white/60;
		font-size: clamp(10px, 1.4vh, 12px);
	}

	/* 버튼 그룹 */
	.button-group {
		@apply flex flex-col items-center;
		@apply w-full;
		gap: 1vh;
	}

	.use-now-button {
		@apply w-full;
		@apply bg-gradient-to-r from-emerald-500 to-green-500;
		@apply text-white;
		@apply rounded-xl;
		@apply font-bold;
		@apply shadow-lg;
		padding: 1.2vh 2vh;
		font-size: clamp(12px, 1.8vh, 16px);
		transition: all 0.2s;
		animation: buttonPulse 1.5s ease-in-out infinite;
	}

	.use-now-button:hover {
		@apply scale-105;
		box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
	}

	@keyframes buttonPulse {
		0%,
		100% {
			box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
		}
		50% {
			box-shadow: 0 0 25px rgba(16, 185, 129, 0.5);
		}
	}

	.confirm-button {
		@apply w-full;
		@apply bg-white/20 text-white;
		@apply rounded-xl;
		@apply font-bold;
		@apply backdrop-blur-sm;
		@apply border border-white/30;
		padding: 1.2vh 2vh;
		font-size: clamp(12px, 1.8vh, 16px);
		transition: all 0.2s;
	}

	.confirm-button:hover {
		@apply scale-105;
		@apply bg-white/30;
	}

	/* 스킵 힌트 */
	.skip-hint {
		@apply absolute bottom-8 left-1/2 -translate-x-1/2;
		@apply text-white/50;
		font-size: var(--font-sm);
		animation: hintFade 1.5s ease-in-out infinite;
	}

	@keyframes hintFade {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>
