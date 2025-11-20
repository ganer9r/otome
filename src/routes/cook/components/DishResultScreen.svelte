<script lang="ts">
	import { onMount } from 'svelte';
	import type { Dish } from '../lib/types';
	import { findIngredientById } from '../lib/data/ingredients';

	interface Props {
		/** 요리 결과 */
		dish: Dish;
		/** 만들어진 재료 ID (success인 경우) */
		resultIngredientId?: string;
		/** 완료 콜백 */
		onComplete?: () => void;
	}

	let { dish, resultIngredientId, onComplete }: Props = $props();

	let resultIngredient = $derived(
		resultIngredientId ? findIngredientById(resultIngredientId) : null
	);

	// 연출 단계
	let stage = $state<'heartbeat' | 'opening' | 'result'>('heartbeat');

	// 스킵 가능 여부
	let canSkip = $state(true);

	// 냄비 이미지
	const potImage = '/imgs/cw_pot.webp';

	// 등급별 별 개수
	const starsCount = $derived(() => {
		switch (dish.grade) {
			case 'success':
				return 3;
			case 'fail':
				return 2;
			case 'disaster':
				return 1;
			default:
				return 2;
		}
	});

	// 등급별 색상 테마
	let theme = $derived(() => {
		switch (dish.grade) {
			case 'success':
				return {
					bg: 'from-yellow-600/30 via-amber-600/30 to-orange-600/30',
					particle: '⭐'
				};
			case 'fail':
				return {
					bg: 'from-gray-600/30 via-blue-600/30 to-gray-600/30',
					particle: '💨'
				};
			case 'disaster':
				return {
					bg: 'from-red-600/30 via-orange-600/30 to-red-600/30',
					particle: '💥'
				};
			default:
				return {
					bg: 'from-gray-600/30 via-gray-600/30 to-gray-600/30',
					particle: '•'
				};
		}
	});

	// 연출 시퀀스
	onMount(() => {
		// 1. 두근두근 (1.5초)
		const timer1 = setTimeout(() => {
			stage = 'opening';
		}, 1500);

		// 2. 냄비 열림 (1초)
		const timer2 = setTimeout(() => {
			stage = 'result';
			canSkip = true;
		}, 2500);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
		};
	});

	// 스킵 또는 확인
	function handleClick() {
		if (stage === 'result') {
			// 결과 화면에서는 확인
			onComplete?.();
		} else if (canSkip) {
			// 연출 중이면 스킵
			stage = 'result';
		}
	}

	// 빛 광선 파티클
	const rayParticles = Array.from({ length: 12 }, (_, i) => ({
		angle: i * 30
	}));

	// 반짝이 폭발 파티클
	const sparkleParticles = Array.from({ length: 20 }, (_, i) => ({
		angle: i * 18,
		distance: 100 + Math.random() * 150
	}));
</script>

<!-- 풀스크린 배경 (어두운 overlay) -->
<div class="result-screen" onclick={handleClick} role="button" tabindex="0">
	<!-- 배경 그라데이션 (등급별) -->
	<div class="background-overlay bg-gradient-to-br {theme().bg}"></div>

	{#if stage === 'heartbeat'}
		<!-- 1단계: 두근두근 -->
		<div class="stage-heartbeat">
			<div class="pot-container">
				<img src={potImage} alt="냄비" class="pot-shaking" />
			</div>
			<div class="heartbeat-text">두근두근...</div>
			<div class="heartbeat-icon">💓</div>
		</div>
	{:else if stage === 'opening'}
		<!-- 2단계: 냄비 열림 + 빛 폭발 -->
		<div class="stage-opening">
			<!-- 냄비 뚜껑 날아감 -->
			<div class="pot-lid-flying">
				<div class="lid">🎩</div>
			</div>

			<!-- 냄비 (아래) -->
			<div class="pot-container-static">
				<img src={potImage} alt="냄비" class="pot-image" />
			</div>

			<!-- 빛 폭발 -->
			<div class="light-burst">
				{#each rayParticles as particle}
					<div class="ray" style="--angle: {particle.angle}deg"></div>
				{/each}
			</div>

			<!-- 반짝이 폭발 -->
			<div class="sparkle-burst-container">
				{#each sparkleParticles as particle}
					<div
						class="sparkle-burst"
						style="--angle: {particle.angle}deg; --distance: {particle.distance}px"
					>
						✨
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<!-- 3단계: 결과 표시 -->
		<div class="stage-result">
			<!-- 플래시 효과 -->
			<div class="flash-effect"></div>

			<!-- 등급별 별 -->
			<div class="stars-container">
				{#each Array(starsCount()) as _}
					<div class="star">⭐</div>
				{/each}
			</div>

			<!-- 요리 아이콘 (크게) -->
			<div class="dish-icon-large">{dish.icon}</div>

			<!-- 요리 이름 -->
			<h2 class="dish-name">{dish.name}</h2>

			<!-- 새 재료 획득 (success만) -->
			{#if dish.grade === 'success' && resultIngredient}
				<div class="new-ingredient">
					<p class="new-ingredient-label">🎉 새로운 재료 획득!</p>
					<div class="ingredient-badge">
						<span class="ingredient-icon">🥘</span>
						<span class="ingredient-name">{resultIngredient.name}</span>
					</div>
				</div>
			{/if}

			<!-- 파티클 효과 -->
			<div class="particles">
				{#each Array(30) as _, i}
					<div
						class="particle"
						style="--delay: {i * 0.03}s; --angle: {i * 12}deg; --distance: {80 + Math.random() * 100}px"
					>
						{theme().particle}
					</div>
				{/each}
			</div>

			<!-- 확인 버튼 -->
			<button type="button" class="confirm-button">확인</button>
		</div>
	{/if}

	<!-- 스킵 힌트 (연출 중) -->
	{#if stage !== 'result' && canSkip}
		<div class="skip-hint">탭하여 스킵</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	/* 풀스크린 배경 */
	.result-screen {
		@apply fixed inset-0 z-50;
		@apply flex items-center justify-center;
		@apply bg-black;
		@apply overflow-hidden;
		@apply cursor-pointer;
	}

	.background-overlay {
		@apply absolute inset-0;
		animation: bgFadeIn 1s ease-out;
	}

	@keyframes bgFadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* ===== 1단계: 두근두근 ===== */
	.stage-heartbeat {
		@apply flex flex-col items-center gap-6;
		@apply relative z-10;
	}

	.pot-container {
		@apply flex items-center justify-center;
	}

	.pot-shaking {
		@apply w-48 h-48 object-contain;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
		animation: potShake 0.3s ease-in-out infinite;
	}

	@keyframes potShake {
		0%,
		100% {
			transform: rotate(0deg) translateX(0);
		}
		25% {
			transform: rotate(-3deg) translateX(-3px);
		}
		50% {
			transform: rotate(0deg) translateX(0);
		}
		75% {
			transform: rotate(3deg) translateX(3px);
		}
	}

	.heartbeat-text {
		@apply text-white/90 font-bold;
		font-size: var(--font-xl);
		animation: textPulse 1s ease-in-out infinite;
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

	.heartbeat-icon {
		font-size: clamp(60px, 15vw, 100px);
		animation: heartbeatPulse 0.8s ease-in-out infinite;
	}

	@keyframes heartbeatPulse {
		0%,
		100% {
			transform: scale(1);
		}
		25% {
			transform: scale(1.3);
		}
		50% {
			transform: scale(1);
		}
		75% {
			transform: scale(1.2);
		}
	}

	/* ===== 2단계: 냄비 열림 + 빛 폭발 ===== */
	.stage-opening {
		@apply relative w-full h-full;
		@apply flex items-center justify-center;
	}

	.pot-lid-flying {
		@apply absolute z-30;
		animation: lidFly 1s ease-out;
	}

	.lid {
		font-size: clamp(80px, 20vw, 120px);
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
	}

	@keyframes lidFly {
		0% {
			transform: translateY(0) rotate(0deg) scale(1);
			opacity: 1;
		}
		100% {
			transform: translateY(-150vh) rotate(720deg) scale(0.5);
			opacity: 0;
		}
	}

	.pot-container-static {
		@apply absolute z-20;
	}

	.pot-image {
		@apply w-48 h-48 object-contain;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
	}

	/* 빛 폭발 */
	.light-burst {
		@apply absolute inset-0 z-10;
	}

	.ray {
		@apply absolute;
		left: 50%;
		top: 50%;
		width: 6px;
		height: 60vh;
		@apply bg-gradient-to-t from-transparent via-white/70 to-transparent;
		transform-origin: center bottom;
		transform: rotate(var(--angle)) translateY(-50%);
		animation: rayExpand 0.8s ease-out;
	}

	@keyframes rayExpand {
		0% {
			height: 0;
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			height: 60vh;
			opacity: 0.2;
		}
	}

	/* 반짝이 폭발 */
	.sparkle-burst-container {
		@apply absolute inset-0 z-15;
		@apply flex items-center justify-center;
	}

	.sparkle-burst {
		@apply absolute;
		@apply text-4xl;
		animation: sparkleBurst 1s ease-out;
	}

	@keyframes sparkleBurst {
		0% {
			transform: translate(-50%, -50%) scale(0) rotate(0deg);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%)
				translateX(calc(cos(var(--angle) * 3.14159 / 180) * var(--distance)))
				translateY(calc(sin(var(--angle) * 3.14159 / 180) * var(--distance))) scale(1.5)
				rotate(360deg);
			opacity: 0;
		}
	}

	/* ===== 3단계: 결과 ===== */
	.stage-result {
		@apply relative z-10;
		@apply flex flex-col items-center justify-center;
		@apply w-full h-full;
		@apply gap-4;
		@apply px-6;
		animation: resultFadeIn 0.5s ease-out;
	}

	@keyframes resultFadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* 플래시 효과 */
	.flash-effect {
		@apply absolute inset-0;
		@apply bg-white;
		@apply pointer-events-none;
		animation: flash 0.3s ease-out;
	}

	@keyframes flash {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	/* 별 */
	.stars-container {
		@apply flex gap-2;
		animation: starsEnter 0.6s ease-out 0.3s backwards;
	}

	.star {
		font-size: clamp(40px, 10vw, 60px);
		animation: starPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
	}

	.star:nth-child(1) {
		animation-delay: 0.4s;
	}

	.star:nth-child(2) {
		animation-delay: 0.5s;
	}

	.star:nth-child(3) {
		animation-delay: 0.6s;
	}

	@keyframes starsEnter {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes starPop {
		0% {
			transform: scale(0) rotate(-180deg);
			opacity: 0;
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	/* 요리 아이콘 (크게) */
	.dish-icon-large {
		@apply relative z-10;
		font-size: clamp(120px, 30vw, 200px);
		line-height: 1;
		filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.6));
		animation: dishEnter 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.7s backwards;
	}

	@keyframes dishEnter {
		0% {
			transform: scale(0) rotate(-360deg);
			opacity: 0;
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	/* 요리 이름 */
	.dish-name {
		@apply font-bold text-white;
		@apply text-center;
		@apply drop-shadow-2xl;
		font-size: var(--font-xxl);
		animation: nameFadeIn 0.6s ease-out 1s backwards;
	}

	@keyframes nameFadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* 새 재료 획득 */
	.new-ingredient {
		@apply flex flex-col items-center gap-3;
		@apply mt-4;
		animation: ingredientSlideUp 0.6s ease-out 1.2s backwards;
	}

	@keyframes ingredientSlideUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.new-ingredient-label {
		@apply text-white/90 font-bold;
		font-size: var(--font-md);
	}

	.ingredient-badge {
		@apply flex items-center gap-2;
		@apply px-6 py-3;
		@apply bg-white/95 backdrop-blur-sm;
		@apply rounded-2xl;
		@apply border-3 border-yellow-400;
		@apply shadow-2xl;
	}

	.ingredient-icon {
		@apply text-3xl;
	}

	.ingredient-name {
		@apply font-bold text-orange-600;
		font-size: var(--font-lg);
	}

	/* 파티클 */
	.particles {
		@apply absolute inset-0;
		@apply pointer-events-none;
	}

	.particle {
		@apply absolute;
		left: 50%;
		top: 50%;
		font-size: clamp(20px, 5vw, 32px);
		animation: particleBurst 1.5s ease-out var(--delay) forwards;
	}

	@keyframes particleBurst {
		0% {
			transform: translate(-50%, -50%) scale(0) rotate(0deg);
			opacity: 1;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%)
				translateX(calc(cos(var(--angle) * 3.14159 / 180) * var(--distance)))
				translateY(calc(sin(var(--angle) * 3.14159 / 180) * var(--distance))) scale(1.2)
				rotate(720deg);
			opacity: 0;
		}
	}

	/* 확인 버튼 */
	.confirm-button {
		@apply mt-6 px-12 py-4;
		@apply bg-white text-gray-900;
		@apply rounded-2xl;
		@apply font-bold;
		@apply shadow-2xl;
		@apply border-4 border-gray-900;
		font-size: var(--font-lg);
		animation: buttonSlideUp 0.6s ease-out 1.4s backwards, buttonPulse 2s ease-in-out 2s infinite;
		transition: all 0.2s;
	}

	.confirm-button:hover {
		@apply scale-110;
		@apply shadow-[0_0_30px_rgba(255,255,255,0.5)];
	}

	@keyframes buttonSlideUp {
		from {
			opacity: 0;
			transform: translateY(40px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes buttonPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
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
