<script lang="ts">
	import { onMount } from 'svelte';
	import { findIngredientById } from '../lib/data/ingredients';
	import { haptic } from '../lib/native-bridge';

	interface Props {
		/** 조리 완료 시 콜백 */
		onComplete?: () => void;
		/** 조리 시간 (초) */
		cookingTime?: number;
		/** 선택한 재료 ID 목록 */
		selectedIngredients?: number[];
	}

	let { onComplete, cookingTime = 8, selectedIngredients = [] }: Props = $props();

	let remainingTime = $state(cookingTime);
	let progress = $state(0);
	let stage = $state<'dropping' | 'cooking' | 'complete'>('dropping');

	// 재료 정보
	const ingredient1 = selectedIngredients[0] ? findIngredientById(selectedIngredients[0]) : null;
	const ingredient2 = selectedIngredients[1] ? findIngredientById(selectedIngredients[1]) : null;

	// 완료 시 터지는 파티클
	const burstParticles = Array.from({ length: 12 }, (_, _i) => ({
		angle: _i * 30 * (Math.PI / 180),
		delay: Math.random() * 0.2,
		distance: 80 + Math.random() * 40
	}));

	onMount(() => {
		// Stage 1: 재료 떨어지기 (0-1.5초)
		setTimeout(() => {
			stage = 'cooking';
			haptic('medium'); // 재료 투입 진동
		}, 1500);

		// Stage 2: 조리 중
		const interval = setInterval(() => {
			remainingTime -= 1;
			progress = ((cookingTime - remainingTime) / cookingTime) * 100;

			// 조리 중 가벼운 진동
			haptic('light');

			if (remainingTime <= 0) {
				clearInterval(interval);
				stage = 'complete';
				haptic('success'); // 조리 완료 진동
				// 터지는 효과 후 결과 화면으로
				setTimeout(() => {
					onComplete?.();
				}, 1200);
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="cooking-screen">
	<!-- 상단: 조합 공식 -->
	<div class="top-area">
		<div class="recipe-formula">
			{#if ingredient1}
				<div class="formula-item">
					<img src={ingredient1.imageUrl} alt={ingredient1.name} />
				</div>
			{/if}
			<span class="formula-plus">+</span>
			{#if ingredient2}
				<div class="formula-item">
					<img src={ingredient2.imageUrl} alt={ingredient2.name} />
				</div>
			{/if}
			<span class="formula-arrow">→</span>
			<div class="formula-result">
				<span class="result-question">?</span>
			</div>
		</div>

		<!-- 프로그레스 영역 (항상 공간 확보) -->
		<div class="progress-section">
			{#if stage === 'cooking'}
				<div class="progress-container">
					<div class="progress-bar" style="width: {progress}%"></div>
				</div>
				<div class="progress-label">조리 중...</div>
			{:else if stage === 'complete'}
				<h1 class="complete-text">완성!</h1>
			{/if}
		</div>
	</div>

	<!-- 중앙: 캐릭터 -->
	<div class="character-area">
		<img
			src="/imgs/character/chef_cooking.webp"
			alt="셰프"
			class="chef-img"
			class:cooking={stage === 'cooking'}
			class:complete={stage === 'complete'}
		/>

		<!-- 재료 떨어지기 -->
		{#if stage === 'dropping'}
			<div class="dropping-ingredients">
				{#if ingredient1}
					<div class="drop-item" style="--delay: 0s; --x: -40px">
						<img src={ingredient1.imageUrl} alt={ingredient1.name} />
					</div>
				{/if}
				{#if ingredient2}
					<div class="drop-item" style="--delay: 0.3s; --x: 40px">
						<img src={ingredient2.imageUrl} alt={ingredient2.name} />
					</div>
				{/if}
			</div>
		{/if}

		<!-- 완료 시 터지는 파티클 -->
		{#if stage === 'complete'}
			<div class="burst-container">
				{#each burstParticles as particle, i}
					<div
						class="burst-particle"
						style="
							--angle: {particle.angle}rad;
							--delay: {particle.delay}s;
							--distance: {particle.distance}px;
						"
					>
						✨
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.cooking-screen {
		@apply absolute inset-0 z-50;
		@apply flex flex-col;
		@apply overflow-hidden;
		@apply bg-gradient-to-br from-orange-100 via-amber-100 to-orange-200;
	}

	/* ===== 상단 영역 ===== */
	.top-area {
		@apply flex flex-col items-center;
		@apply px-3 pt-4;
		@apply gap-2;
		z-index: 20;
	}

	/* 조합 공식 */
	.recipe-formula {
		@apply flex items-center justify-center gap-1;
	}

	.formula-item {
		@apply h-10 w-10;
		@apply rounded-lg;
		@apply flex items-center justify-center;
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid #8b5a20;
	}

	.formula-item img {
		@apply h-7 w-7 object-contain;
	}

	.formula-plus,
	.formula-arrow {
		@apply font-black;
		font-size: 16px;
		color: #8b5a20;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.formula-result {
		@apply h-10 w-10;
		@apply rounded-lg;
		@apply flex items-center justify-center;
		background: linear-gradient(180deg, #ffd700 0%, #ff9800 100%);
		border: 2px solid #8b5a20;
	}

	.result-question {
		@apply font-black;
		font-size: 18px;
		color: #fff;
		text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
	}

	/* 프로그레스 섹션 (항상 공간 확보) */
	.progress-section {
		@apply w-full;
		max-width: 200px;
		@apply flex flex-col items-center justify-center gap-1;
		min-height: 40px;
	}

	.progress-container {
		@apply h-4 w-full;
		@apply rounded-full;
		@apply overflow-hidden;
		@apply relative;
		background: linear-gradient(180deg, #1a1a1a 0%, #333 100%);
		border: 2px solid #555;
	}

	.progress-bar {
		@apply absolute top-0 bottom-0 left-0;
		@apply rounded-full;
		background: linear-gradient(180deg, #7dff7d 0%, #4caf50 50%, #2e7d32 100%);
		box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.4);
		@apply transition-all duration-1000 ease-linear;
	}

	.progress-label {
		@apply font-bold;
		font-size: 12px;
		color: #8b5a20;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
		animation: pulse 1s ease-in-out infinite;
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

	/* ===== 캐릭터 영역 ===== */
	.character-area {
		@apply relative;
		@apply flex-1;
		@apply flex items-center justify-center;
	}

	.chef-img {
		width: 180px;
		height: auto;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
	}

	.chef-img.cooking {
		animation: chefBounce 0.6s ease-in-out infinite;
	}

	.chef-img.complete {
		animation: chefJump 0.6s ease-out;
	}

	@keyframes chefBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@keyframes chefJump {
		0% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-30px) scale(1.1);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}

	/* 완성 텍스트 */
	.complete-text {
		@apply font-black;
		font-size: 20px;
		color: #ffd700;
		text-shadow:
			0 2px 0 #8b6914,
			0 3px 0 #5c4a0a;
		-webkit-text-stroke: 1px #5c2e0a;
		paint-order: stroke fill;
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

	/* 재료 떨어지기 */
	.dropping-ingredients {
		@apply absolute;
		top: -60px;
		left: 50%;
		transform: translateX(-50%);
	}

	.drop-item {
		@apply absolute;
		@apply h-10 w-10;
		left: var(--x);
		animation: dropIn 1s ease-in forwards;
		animation-delay: var(--delay);
		opacity: 0;
	}

	.drop-item img {
		@apply h-full w-full object-contain;
	}

	@keyframes dropIn {
		0% {
			transform: translateY(-30px) rotate(0deg);
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: translateY(120px) rotate(360deg);
			opacity: 0;
		}
	}

	/* 완료 시 터지는 파티클 */
	.burst-container {
		@apply absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 30;
	}

	.burst-particle {
		@apply absolute;
		font-size: 20px;
		animation: burst 0.8s ease-out forwards;
		animation-delay: var(--delay);
	}

	@keyframes burst {
		0% {
			transform: translate(0, 0) scale(0);
			opacity: 1;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: translate(
					calc(cos(var(--angle)) * var(--distance)),
					calc(sin(var(--angle)) * var(--distance))
				)
				scale(1);
			opacity: 0;
		}
	}
</style>
