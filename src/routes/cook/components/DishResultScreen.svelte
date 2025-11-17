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
	let stage = $state<'heartbeat' | 'lightburst' | 'result'>('heartbeat');

	// 스킵 가능 여부
	let canSkip = $state(true);

	// 등급별 대사 풀
	const comments = {
		success: [
			'이게 바로 요리사의 손맛이지!',
			'오! 완벽한 조합이에요!',
			'이 정도면 미슐랭 1스타!',
			'역시 실력자시네요!',
			'이게 진짜 프로의 맛입니다!'
		],
		fail: [
			'이게 정통 레시피에요!',
			'이 정도면 레스토랑 퀄리티죠!',
			'원래 이렇게 만드는 거예요!',
			'이게 정석입니다!',
			'프로는 이렇게 해요!',
			'외국에선 이렇게 먹어요!'
		],
		disaster: [
			'이게 원조 스타일입니다!',
			'이게 진짜 맛이에요!',
			'요즘 트렌드가 이거예요!',
			'미슐랭 3스타 레시피입니다!',
			'이게 정답이에요!',
			'완벽한 조리법이죠!'
		]
	};

	let selectedComment = $state('');

	// 등급별 색상 테마
	let theme = $derived(() => {
		switch (dish.grade) {
			case 'success':
				return {
					bg: 'from-yellow-600/20 via-amber-600/20 to-orange-600/20',
					glow: 'halo-success',
					particle: '⭐'
				};
			case 'fail':
				return {
					bg: 'from-gray-600/20 via-blue-600/20 to-gray-600/20',
					glow: 'halo-fail',
					particle: '💨'
				};
			case 'disaster':
				return {
					bg: 'from-red-600/20 via-orange-600/20 to-red-600/20',
					glow: 'halo-disaster',
					particle: '💥'
				};
			default:
				return {
					bg: 'from-gray-600/20 via-gray-600/20 to-gray-600/20',
					glow: 'halo-fail',
					particle: '•'
				};
		}
	});

	// 연출 시퀀스
	onMount(() => {
		// 랜덤 대사 선택
		const commentList = comments[dish.grade] || ['...'];
		selectedComment = commentList[Math.floor(Math.random() * commentList.length)];

		// 1. 두근두근 (1.5초)
		const timer1 = setTimeout(() => {
			stage = 'lightburst';
		}, 1500);

		// 2. 빛 폭발 (1초)
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
</script>

<!-- 풀스크린 배경 (어두운 overlay) -->
<div class="result-screen" onclick={handleClick} role="button" tabindex="0">
	<!-- 배경 그라데이션 (등급별) -->
	<div class="background-overlay bg-gradient-to-br {theme().bg}"></div>

	{#if stage === 'heartbeat'}
		<!-- 1단계: 두근두근 -->
		<div class="stage-heartbeat">
			<div class="heartbeat-icon">💓</div>
			<div class="heartbeat-text">두근두근...</div>
		</div>
	{:else if stage === 'lightburst'}
		<!-- 2단계: 빛 폭발 -->
		<div class="stage-lightburst">
			<!-- 방사형 광선 -->
			<div class="light-rays">
				{#each Array(12) as _, i}
					<div class="ray" style="--angle: {i * 30}deg"></div>
				{/each}
			</div>

			<!-- 회전하는 다중 후광 -->
			<div class="halos">
				<div class="halo halo-outer {theme().glow}"></div>
				<div class="halo halo-middle {theme().glow}"></div>
				<div class="halo halo-inner {theme().glow}"></div>
			</div>
		</div>
	{:else}
		<!-- 3단계: 결과 표시 -->
		<div class="stage-result">
			<!-- 플래시 효과 -->
			<div class="flash-effect"></div>

			<!-- 백종원 + 말풍선 -->
			<div class="chef-section">
				<div class="speech-bubble">
					{selectedComment}
				</div>
				<div class="chef-character">👨‍🍳</div>
			</div>

			<!-- 요리 아이콘 + 후광 -->
			<div class="dish-section">
				<div class="dish-halo-container">
					<!-- 회전 후광 -->
					<div class="dish-halo-outer {theme().glow}"></div>
					<div class="dish-halo-middle {theme().glow}"></div>
					<div class="dish-halo-inner {theme().glow}"></div>
				</div>
				<div class="dish-icon">{dish.icon}</div>
			</div>

			<!-- 요리 이름 -->
			<h2 class="dish-name">{dish.name}</h2>

			<!-- 결과 재료 (success) -->
			{#if dish.grade === 'success' && resultIngredient}
				<div class="result-ingredient">
					<p class="ingredient-label">새로운 재료 획득!</p>
					<div class="ingredient-badge">
						<span class="ingredient-name">{resultIngredient.name}</span>
					</div>
				</div>
			{/if}

			<!-- 파티클 폭발 -->
			<div class="particles">
				{#each Array(40) as _, i}
					<div
						class="particle"
						style="--delay: {i * 0.02}s; --angle: {i * 9}deg; --distance: {80 + Math.random() * 120}px"
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

	.heartbeat-icon {
		font-size: clamp(100px, 25vw, 180px);
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

	.heartbeat-text {
		@apply text-white/80 font-bold;
		font-size: var(--font-lg);
		animation: textFade 1.5s ease-in-out infinite;
	}

	@keyframes textFade {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}

	/* ===== 2단계: 빛 폭발 ===== */
	.stage-lightburst {
		@apply relative;
		@apply w-full h-full;
		@apply flex items-center justify-center;
	}

	/* 방사형 광선 */
	.light-rays {
		@apply absolute;
		@apply w-full h-full;
	}

	.ray {
		@apply absolute;
		left: 50%;
		top: 50%;
		width: 4px;
		height: 50vh;
		@apply bg-gradient-to-t from-transparent via-white/60 to-transparent;
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
			height: 50vh;
			opacity: 0.3;
		}
	}

	/* 회전하는 다중 후광 */
	.halos {
		@apply relative;
		@apply flex items-center justify-center;
	}

	.halo {
		@apply absolute;
		@apply rounded-full;
		@apply blur-2xl;
	}

	.halo-outer {
		width: clamp(300px, 70vw, 500px);
		height: clamp(300px, 70vw, 500px);
		animation: haloRotate 3s linear infinite, haloGlow 1.5s ease-in-out infinite;
	}

	.halo-middle {
		width: clamp(200px, 50vw, 350px);
		height: clamp(200px, 50vw, 350px);
		animation: haloRotate 2s linear infinite reverse, haloGlow 1.5s ease-in-out infinite 0.5s;
	}

	.halo-inner {
		width: clamp(120px, 30vw, 200px);
		height: clamp(120px, 30vw, 200px);
		animation: haloRotate 1.5s linear infinite, haloGlow 1.5s ease-in-out infinite 1s;
	}

	@keyframes haloRotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes haloGlow {
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

	/* 등급별 후광 색상 */
	.halo-success {
		@apply bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500;
		box-shadow: 0 0 100px rgba(251, 191, 36, 0.9);
	}

	.halo-fail {
		@apply bg-gradient-to-br from-gray-400 via-blue-300 to-gray-500;
		box-shadow: 0 0 80px rgba(156, 163, 175, 0.7);
	}

	.halo-disaster {
		@apply bg-gradient-to-br from-red-500 via-orange-600 to-red-700;
		box-shadow: 0 0 120px rgba(239, 68, 68, 1);
	}

	/* ===== 3단계: 결과 ===== */
	.stage-result {
		@apply relative z-10;
		@apply flex flex-col items-center;
		@apply w-full h-full;
		@apply justify-center;
		@apply gap-6;
		@apply px-6;
		animation: resultFadeIn 0.5s ease-out;
	}

	@keyframes resultFadeIn {
		from {
			opacity: 0;
			transform: scale(0.9);
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

	/* 백종원 섹션 */
	.chef-section {
		@apply flex flex-col items-center gap-3;
		animation: chefEnter 0.6s ease-out 0.3s backwards;
	}

	@keyframes chefEnter {
		from {
			opacity: 0;
			transform: translateY(-30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.speech-bubble {
		@apply relative;
		@apply bg-white;
		@apply rounded-2xl;
		@apply px-6 py-4;
		@apply shadow-2xl;
		@apply border-4 border-gray-900;
		@apply font-bold text-center;
		font-size: var(--font-lg);
		@apply text-gray-900;
		line-height: 1.5;
		max-width: 85%;
		animation: bubblePop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s backwards;
	}

	.speech-bubble::after {
		content: '';
		@apply absolute;
		bottom: -16px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 18px solid transparent;
		border-right: 18px solid transparent;
		border-top: 18px solid #111827;
	}

	.speech-bubble::before {
		content: '';
		@apply absolute;
		bottom: -12px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 15px solid transparent;
		border-right: 15px solid transparent;
		border-top: 15px solid white;
		z-index: 1;
	}

	@keyframes bubblePop {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.chef-character {
		font-size: clamp(64px, 16vw, 100px);
		animation: chefBounce 0.7s ease-out 0.7s backwards;
	}

	@keyframes chefBounce {
		0% {
			transform: scale(0) rotate(-180deg);
		}
		60% {
			transform: scale(1.2) rotate(10deg);
		}
		80% {
			transform: scale(0.95) rotate(-5deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
		}
	}

	/* 요리 섹션 */
	.dish-section {
		@apply relative;
		@apply flex items-center justify-center;
		animation: dishEnter 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.9s backwards;
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

	.dish-halo-container {
		@apply absolute;
		@apply flex items-center justify-center;
	}

	.dish-halo-outer,
	.dish-halo-middle,
	.dish-halo-inner {
		@apply absolute;
		@apply rounded-full;
		@apply blur-3xl;
	}

	.dish-halo-outer {
		width: clamp(200px, 50vw, 350px);
		height: clamp(200px, 50vw, 350px);
		animation: dishHaloRotate 4s linear infinite, dishHaloPulse 2s ease-in-out infinite;
	}

	.dish-halo-middle {
		width: clamp(140px, 35vw, 240px);
		height: clamp(140px, 35vw, 240px);
		animation: dishHaloRotate 3s linear infinite reverse, dishHaloPulse 2s ease-in-out infinite 0.5s;
	}

	.dish-halo-inner {
		width: clamp(80px, 20vw, 140px);
		height: clamp(80px, 20vw, 140px);
		animation: dishHaloRotate 2s linear infinite, dishHaloPulse 2s ease-in-out infinite 1s;
	}

	@keyframes dishHaloRotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes dishHaloPulse {
		0%,
		100% {
			opacity: 0.7;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.15);
		}
	}

	.dish-icon {
		@apply relative z-10;
		font-size: clamp(100px, 25vw, 180px);
		line-height: 1;
		filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.5));
	}

	/* 요리 이름 */
	.dish-name {
		@apply font-bold text-white;
		@apply text-center;
		@apply drop-shadow-2xl;
		font-size: var(--font-xxl);
		animation: nameFadeIn 0.6s ease-out 1.2s backwards;
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

	/* 결과 재료 */
	.result-ingredient {
		@apply flex flex-col items-center gap-2;
		animation: ingredientSlideUp 0.6s ease-out 1.4s backwards;
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

	.ingredient-label {
		@apply text-white/80 font-bold;
		font-size: var(--font-sm);
	}

	.ingredient-badge {
		@apply px-6 py-3;
		@apply bg-white/95;
		@apply rounded-xl;
		@apply border-3 border-yellow-500;
		@apply shadow-xl;
	}

	.ingredient-name {
		@apply font-bold text-yellow-600;
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
		font-size: clamp(20px, 5vw, 36px);
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
				translateX(calc(cos(var(--angle)) * var(--distance)))
				translateY(calc(sin(var(--angle)) * var(--distance))) scale(1) rotate(720deg);
			opacity: 0;
		}
	}

	/* 확인 버튼 */
	.confirm-button {
		@apply mt-8 px-12 py-4;
		@apply bg-white text-gray-900;
		@apply rounded-2xl;
		@apply font-bold;
		@apply shadow-2xl;
		@apply border-4 border-gray-900;
		font-size: var(--font-lg);
		animation: buttonSlideUp 0.6s ease-out 1.6s backwards, buttonPulse 2s ease-in-out 2.2s infinite;
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
			box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.3);
		}
		50% {
			transform: scale(1.05);
			box-shadow: 0 20px 25px -5px rgb(255 255 255 / 0.5);
		}
	}

	/* 스킵 힌트 */
	.skip-hint {
		@apply absolute bottom-8 left-1/2 -translate-x-1/2;
		@apply text-white/50 text-sm;
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
