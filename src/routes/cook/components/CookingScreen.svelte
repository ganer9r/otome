<script lang="ts">
	import { onMount } from 'svelte';
	import { findIngredientById } from '../lib/data/ingredients';
	import type { CookingTool } from '../lib/types';

	interface Props {
		/** 조리 완료 시 콜백 */
		onComplete?: () => void;
		/** 조리 시간 (초) */
		cookingTime?: number;
		/** 선택한 재료 ID 목록 */
		selectedIngredients?: number[];
		/** 선택한 조리기구 */
		selectedTool?: CookingTool;
	}

	let { onComplete, cookingTime = 5, selectedIngredients = [], selectedTool = '없음' }: Props = $props();

	let remainingTime = $state(cookingTime);
	let progress = $state(0);
	let stage = $state<'dropping' | 'cooking' | 'complete'>('dropping');

	// 조리기구 이미지 매핑
	const toolImages: Record<CookingTool, string> = {
		'없음': '/imgs/cw_pot.webp',
		'냄비': '/imgs/cw_pot.webp',
		'후라이팬': '/imgs/cw_pan.webp',
		'오븐': '/imgs/cw_oven.webp'
	};

	const toolImage = toolImages[selectedTool] || toolImages['냄비'];

	// 재료 정보
	const ingredient1 = selectedIngredients[0] ? findIngredientById(selectedIngredients[0]) : null;
	const ingredient2 = selectedIngredients[1] ? findIngredientById(selectedIngredients[1]) : null;

	// 파티클 생성
	const steamParticles = Array.from({ length: 4 }, (_, i) => ({
		delay: i * 0.3,
		x: (Math.random() - 0.5) * 40,
		duration: 2 + Math.random() * 1
	}));

	const flameParticles = Array.from({ length: 3 }, (_, i) => ({
		delay: i * 0.2,
		x: (i - 1) * 30
	}));

	const sparkleParticles = Array.from({ length: 8 }, (_, i) => ({
		delay: Math.random() * 2,
		x: (Math.random() - 0.5) * 200,
		y: (Math.random() - 0.5) * 200,
		duration: 1 + Math.random() * 1
	}));

	onMount(() => {
		// Stage 1: 재료 떨어지기 (0-2초)
		setTimeout(() => {
			stage = 'cooking';
		}, 2000);

		// Stage 2: 조리 중 (2-10초)
		const interval = setInterval(() => {
			remainingTime -= 1;
			progress = ((cookingTime - remainingTime) / cookingTime) * 100;

			if (remainingTime <= 0) {
				clearInterval(interval);
				stage = 'complete';
				setTimeout(() => {
					onComplete?.();
				}, 500);
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="cooking-screen">
	{#if stage === 'dropping'}
		<!-- 재료 떨어지기 -->
		<div class="dropping-container">
			{#if ingredient1}
				<div class="ingredient-drop" style="--delay: 0s">
					<img src={ingredient1.imageUrl} alt={ingredient1.name} class="ingredient-image" />
					<div class="ingredient-name">{ingredient1.name}</div>
				</div>
			{/if}
			{#if ingredient2}
				<div class="ingredient-drop" style="--delay: 1s">
					<img src={ingredient2.imageUrl} alt={ingredient2.name} class="ingredient-image" />
					<div class="ingredient-name">{ingredient2.name}</div>
				</div>
			{/if}
		</div>

		<!-- 조리기구 (정지) -->
		<div class="tool-container">
			<img src={toolImage} alt="조리기구" class="tool-image" />
		</div>
	{:else if stage === 'cooking'}
		<!-- 조리 중 -->
		<div class="cooking-container">
			<!-- 증기 파티클 -->
			<div class="steam-container">
				{#each steamParticles as particle}
					<div
						class="steam"
						style="
							--delay: {particle.delay}s;
							--x: {particle.x}px;
							--duration: {particle.duration}s;
						"
					>
						💨
					</div>
				{/each}
			</div>

			<!-- 조리기구 (흔들림) -->
			<div class="tool-container">
				<img src={toolImage} alt="조리중" class="tool-image tool-shaking" />
			</div>

			<!-- 불꽃 파티클 -->
			<div class="flame-container">
				{#each flameParticles as particle}
					<div class="flame" style="--delay: {particle.delay}s; --x: {particle.x}px">🔥</div>
				{/each}
			</div>

			<!-- 반짝이 파티클 -->
			<div class="sparkle-container">
				{#each sparkleParticles as particle}
					<div
						class="sparkle"
						style="
							--delay: {particle.delay}s;
							--x: {particle.x}px;
							--y: {particle.y}px;
							--duration: {particle.duration}s;
						"
					>
						✨
					</div>
				{/each}
			</div>

			<!-- 조리 중 텍스트 -->
			<h1 class="cooking-text">조리 중...</h1>

			<!-- 타이머 -->
			<div class="timer-display">{remainingTime}초</div>

			<!-- 프로그레스 바 -->
			<div class="progress-container">
				<div class="progress-bar" style="width: {progress}%"></div>
			</div>
		</div>
	{:else if stage === 'complete'}
		<!-- 완료 -->
		<div class="complete-container">
			<div class="tool-container">
				<img src={toolImage} alt="완료!" class="tool-image tool-jump" />
			</div>
			<h1 class="complete-text">완성!</h1>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.cooking-screen {
		@apply fixed inset-0 z-50;
		@apply bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100;
		@apply flex flex-col items-center justify-center gap-8 p-6;
		@apply overflow-hidden;
	}

	/* ===== Stage 1: 재료 떨어지기 ===== */
	.dropping-container {
		@apply absolute top-0 left-0 w-full h-full;
		@apply flex items-center justify-center;
		@apply pointer-events-none;
	}

	.ingredient-drop {
		@apply absolute;
		@apply flex flex-col items-center gap-2;
		animation: ingredientDrop 1s ease-out forwards;
		animation-delay: var(--delay);
		opacity: 0;
	}

	.ingredient-image {
		@apply w-20 h-20 object-contain;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	.ingredient-name {
		@apply font-bold text-gray-800;
		@apply px-3 py-1 rounded-full;
		@apply bg-white/80 backdrop-blur-sm;
		@apply border-2 border-orange-300;
		font-size: var(--font-md);
	}

	@keyframes ingredientDrop {
		0% {
			transform: translateY(-100vh) rotate(0deg);
			opacity: 0;
		}
		60% {
			transform: translateY(0) rotate(360deg);
			opacity: 1;
		}
		75% {
			transform: translateY(-30px) rotate(360deg);
		}
		85% {
			transform: translateY(-10px) rotate(360deg);
		}
		100% {
			transform: translateY(0) rotate(360deg);
			opacity: 1;
		}
	}

	/* ===== Stage 2: 조리 중 ===== */
	.cooking-container {
		@apply relative w-full h-full;
		@apply flex flex-col items-center justify-center gap-6;
	}

	.tool-container {
		@apply relative;
		@apply flex items-center justify-center;
	}

	.tool-image {
		@apply w-48 h-48 object-contain;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
	}

	.tool-shaking {
		animation: toolShake 0.5s ease-in-out infinite;
	}

	@keyframes toolShake {
		0%,
		100% {
			transform: rotate(0deg) translateY(0);
		}
		25% {
			transform: rotate(-2deg) translateY(-2px);
		}
		50% {
			transform: rotate(0deg) translateY(0);
		}
		75% {
			transform: rotate(2deg) translateY(-2px);
		}
	}

	/* 증기 파티클 */
	.steam-container {
		@apply absolute top-20 left-1/2 -translate-x-1/2;
		@apply w-full h-full;
		@apply pointer-events-none;
	}

	.steam {
		@apply absolute left-1/2 top-0;
		@apply text-4xl;
		animation: steamRise var(--duration) ease-out infinite;
		animation-delay: var(--delay);
		transform: translateX(var(--x));
	}

	@keyframes steamRise {
		0% {
			transform: translateX(var(--x)) translateY(0) scale(0.5);
			opacity: 1;
		}
		100% {
			transform: translateX(var(--x)) translateY(-150px) scale(1.5);
			opacity: 0;
		}
	}

	/* 불꽃 파티클 */
	.flame-container {
		@apply absolute bottom-32 left-1/2 -translate-x-1/2;
		@apply flex gap-8;
		@apply pointer-events-none;
	}

	.flame {
		@apply text-3xl;
		animation: flameFlicker 0.3s ease-in-out infinite alternate;
		animation-delay: var(--delay);
		transform: translateX(var(--x));
	}

	@keyframes flameFlicker {
		0% {
			transform: translateX(var(--x)) translateY(0) scale(1);
			opacity: 0.8;
		}
		100% {
			transform: translateX(var(--x)) translateY(-5px) scale(1.2);
			opacity: 1;
		}
	}

	/* 반짝이 파티클 */
	.sparkle-container {
		@apply absolute inset-0;
		@apply pointer-events-none;
	}

	.sparkle {
		@apply absolute left-1/2 top-1/2;
		@apply text-2xl;
		animation: sparkle var(--duration) ease-out infinite;
		animation-delay: var(--delay);
		transform: translate(var(--x), var(--y));
	}

	@keyframes sparkle {
		0%,
		100% {
			opacity: 0;
			transform: translate(var(--x), var(--y)) scale(0) rotate(0deg);
		}
		50% {
			opacity: 1;
			transform: translate(var(--x), var(--y)) scale(1) rotate(180deg);
		}
	}

	/* 조리 중 텍스트 */
	.cooking-text {
		@apply font-bold text-gray-800;
		@apply relative z-10;
		font-size: var(--font-xxl);
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	/* 타이머 */
	.timer-display {
		@apply font-bold text-orange-600;
		@apply tabular-nums;
		@apply relative z-10;
		font-size: clamp(48px, 12vw, 80px);
	}

	/* 프로그레스 바 */
	.progress-container {
		@apply w-full max-w-md h-4 bg-orange-200 rounded-full overflow-hidden;
		@apply shadow-inner;
		@apply relative z-10;
	}

	.progress-bar {
		@apply h-full bg-gradient-to-r from-orange-400 to-red-500;
		@apply transition-all duration-1000 ease-linear;
		animation: shimmer 1.5s infinite;
	}

	@keyframes shimmer {
		0% {
			opacity: 0.8;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0.8;
		}
	}

	/* ===== Stage 3: 완료 ===== */
	.complete-container {
		@apply flex flex-col items-center justify-center gap-8;
	}

	.tool-jump {
		animation: toolJump 0.6s ease-out;
	}

	@keyframes toolJump {
		0% {
			transform: translateY(0) scale(1);
		}
		30% {
			transform: translateY(-40px) scale(1.1);
		}
		50% {
			transform: translateY(-50px) scale(1.15) rotate(5deg);
		}
		70% {
			transform: translateY(-30px) scale(1.1) rotate(-5deg);
		}
		85% {
			transform: translateY(-10px) scale(1.05);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}

	.complete-text {
		@apply font-bold text-orange-600;
		font-size: var(--font-xxl);
		animation: completePop 0.5s ease-out;
	}

	@keyframes completePop {
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
</style>
