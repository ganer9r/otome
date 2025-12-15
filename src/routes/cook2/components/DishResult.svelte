<script lang="ts">
	import { onMount } from 'svelte';
	import type { Ingredient } from '../lib/types';
	import { GRADE_COLORS, GRADE_NAMES } from '../lib/types';
	import { getChefImage, getRandomDialogue } from '../lib/chef-images';

	interface Props {
		resultIngredient: Ingredient;
		/** 판매가 (업그레이드 보너스 적용됨) */
		sellPrice: number;
		/** 순이익 (판매가 - 재료비 + 보너스) */
		profit: number;
		/** 손님 주문 보너스 */
		orderBonus?: number;
		onComplete?: () => void;
	}

	let { resultIngredient, sellPrice, profit, orderBonus = 0, onComplete }: Props = $props();

	// 단계: pot -> steam -> reveal -> result
	let stage = $state<'pot' | 'steam' | 'reveal' | 'result'>('pot');
	let canSkip = $state(true);

	// 카운팅 애니메이션
	let displayedProfit = $state(0);
	let countingComplete = $state(false);

	const potImage = '/imgs/cw_pot.webp';

	// 셰프 이미지 & 대사
	let chefImage = $derived(getChefImage('proud'));
	let chefDialogue = $state('');

	$effect(() => {
		chefDialogue = getRandomDialogue('proud');
	});

	// 김 파티클
	const steamParticles = Array.from({ length: 8 }, (_, i) => ({
		id: i,
		left: 30 + Math.random() * 40, // 30% ~ 70%
		delay: Math.random() * 0.5,
		duration: 1.5 + Math.random() * 0.5,
		size: 20 + Math.random() * 20
	}));

	onMount(() => {
		// 1. 냄비 두근두근 (0.8초)
		const timer1 = setTimeout(() => {
			stage = 'steam';
		}, 800);

		// 2. 김 모락모락 (0.8초)
		const timer2 = setTimeout(() => {
			stage = 'reveal';
		}, 1600);

		// 3. 요리 등장 (0.5초 후 결과)
		const timer3 = setTimeout(() => {
			stage = 'result';
			startCounting();
		}, 2100);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
		};
	});

	// 수익 카운팅 애니메이션
	function startCounting() {
		const duration = 500; // 0.5초
		const startTime = performance.now();
		const targetProfit = profit;

		function animate(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// easeOutQuad
			const eased = 1 - (1 - progress) * (1 - progress);
			displayedProfit = Math.round(targetProfit * eased);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				displayedProfit = targetProfit;
				countingComplete = true;
			}
		}

		requestAnimationFrame(animate);
	}

	function handleSkip() {
		if (stage !== 'result' && canSkip) {
			stage = 'result';
			displayedProfit = profit;
			countingComplete = true;
		}
	}

	function handleConfirm() {
		onComplete?.();
	}
</script>

<div
	class="dish-result-screen"
	onclick={handleSkip}
	onkeydown={(e) => e.key === 'Enter' && handleSkip()}
	role="button"
	tabindex="0"
>
	{#if stage === 'pot'}
		<!-- 냄비 두근두근 -->
		<div class="stage-pot">
			<div class="pot-wrapper">
				<div class="pot-glow"></div>
				<img src={potImage} alt="냄비" class="pot-shaking" />
			</div>
			<div class="pot-text">쿵쿵...</div>
		</div>
	{:else if stage === 'steam'}
		<!-- 김 모락모락 -->
		<div class="stage-steam">
			<div class="pot-wrapper">
				<img src={potImage} alt="냄비" class="pot-still" />
				<!-- 김 파티클 -->
				<div class="steam-container">
					{#each steamParticles as particle}
						<div
							class="steam-particle"
							style="
								left: {particle.left}%;
								animation-delay: {particle.delay}s;
								animation-duration: {particle.duration}s;
								width: {particle.size}px;
								height: {particle.size}px;
							"
						></div>
					{/each}
				</div>
			</div>
			<div class="steam-text">모락모락~</div>
		</div>
	{:else}
		<!-- 요리 등장 & 결과 -->
		<div class="stage-result">
			<!-- 상단: 요리 완성 타이틀 -->
			<div class="result-header">
				<span class="header-icon">🍳</span>
				<span class="header-text">요리 완성!</span>
				<span class="header-icon">🍳</span>
			</div>

			<!-- 중앙: 요리 이미지 -->
			<div class="dish-image-container" class:revealed={stage === 'result'}>
				<div class="dish-glow"></div>
				<img src={resultIngredient.imageUrl} alt={resultIngredient.name} class="dish-image" />
			</div>

			<!-- 요리 정보 -->
			<div class="dish-info" class:visible={stage === 'result'}>
				<h2 class="dish-name">{resultIngredient.name}</h2>
				<div class="dish-grade" style="background-color: {GRADE_COLORS[resultIngredient.grade]}">
					{resultIngredient.grade}등급 · {GRADE_NAMES[resultIngredient.grade]}
				</div>
			</div>

			<!-- 수익 표시 -->
			{#if stage === 'result'}
				<div class="profit-section">
					<div class="profit-main" class:counting={!countingComplete}>
						<span class="coin-icon" class:bounce={countingComplete}>💰</span>
						<span
							class="profit-number"
							class:positive={displayedProfit >= 0}
							class:negative={displayedProfit < 0}
						>
							{displayedProfit >= 0 ? '+' : ''}{displayedProfit.toLocaleString()}원
						</span>
					</div>
					{#if orderBonus > 0 && countingComplete}
						<div class="bonus-tag">
							주문 보너스 +{orderBonus.toLocaleString()}원
						</div>
					{/if}
				</div>

				<!-- 하단: 셰프 + 버튼 -->
				<div class="bottom-section">
					<div class="chef-area">
						<div class="chef-bubble">{chefDialogue}</div>
						<img src={chefImage} alt="셰프" class="chef-img" />
					</div>
					<button type="button" class="confirm-btn" onclick={handleConfirm}> 확인 </button>
				</div>
			{/if}
		</div>
	{/if}

	{#if stage !== 'result' && canSkip}
		<div class="skip-hint">탭하여 스킵</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.dish-result-screen {
		@apply fixed inset-0 z-50;
		@apply flex items-center justify-center;
		@apply cursor-pointer overflow-hidden;
		background: linear-gradient(to bottom, #fff8e1, #ffecb3);
	}

	/* ===== 1단계: 냄비 두근두근 ===== */
	.stage-pot {
		@apply flex flex-col items-center gap-4;
	}

	.pot-wrapper {
		@apply relative;
	}

	.pot-glow {
		@apply absolute inset-0 rounded-full;
		background: radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%);
		animation: potGlowPulse 0.4s ease-in-out infinite;
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
		@apply relative z-10 h-40 w-40 object-contain;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
		animation: potShake 0.1s ease-in-out infinite;
	}

	@keyframes potShake {
		0%,
		100% {
			transform: translateX(0) translateY(0);
		}
		25% {
			transform: translateX(-3px) translateY(-1px);
		}
		75% {
			transform: translateX(3px) translateY(-1px);
		}
	}

	.pot-text {
		@apply font-bold text-orange-700;
		font-size: clamp(20px, 5vw, 28px);
		animation: textPulse 0.4s ease-in-out infinite;
	}

	@keyframes textPulse {
		0%,
		100% {
			opacity: 0.6;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.05);
		}
	}

	/* ===== 2단계: 김 모락모락 ===== */
	.stage-steam {
		@apply flex flex-col items-center gap-4;
	}

	.pot-still {
		@apply relative z-10 h-40 w-40 object-contain;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
	}

	.steam-container {
		@apply absolute;
		top: -20px;
		left: 0;
		right: 0;
		height: 100px;
		pointer-events: none;
	}

	.steam-particle {
		@apply absolute rounded-full;
		background: rgba(255, 255, 255, 0.8);
		filter: blur(8px);
		animation: steamRise linear infinite;
	}

	@keyframes steamRise {
		0% {
			opacity: 0;
			transform: translateY(0) scale(0.5);
		}
		20% {
			opacity: 0.8;
		}
		80% {
			opacity: 0.4;
		}
		100% {
			opacity: 0;
			transform: translateY(-80px) scale(1.5);
		}
	}

	.steam-text {
		@apply font-bold text-gray-500;
		font-size: clamp(18px, 4.5vw, 24px);
	}

	/* ===== 3-4단계: 요리 등장 & 결과 ===== */
	.stage-result {
		@apply flex flex-col items-center;
		@apply h-full w-full;
		@apply px-4 py-6;
		@apply justify-between;
	}

	.result-header {
		@apply flex items-center gap-2;
		animation: headerBounce 0.5s ease-out;
	}

	@keyframes headerBounce {
		0% {
			opacity: 0;
			transform: translateY(-20px);
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
		@apply font-black text-orange-600;
		font-size: clamp(28px, 7vw, 42px);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	/* 요리 이미지 */
	.dish-image-container {
		@apply relative;
		@apply flex items-center justify-center;
		opacity: 0;
		transform: scale(0.5);
		transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.dish-image-container.revealed {
		opacity: 1;
		transform: scale(1);
	}

	.dish-glow {
		@apply absolute rounded-full;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255, 200, 100, 0.3) 0%, transparent 60%);
		animation: dishGlow 2s ease-in-out infinite;
	}

	@keyframes dishGlow {
		0%,
		100% {
			opacity: 0.5;
			transform: scale(1);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.1);
		}
	}

	.dish-image {
		@apply relative z-10;
		width: clamp(140px, 40vw, 200px);
		height: clamp(140px, 40vw, 200px);
		@apply object-contain;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
	}

	/* 요리 정보 */
	.dish-info {
		@apply flex flex-col items-center gap-2;
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.4s ease-out 0.2s;
	}

	.dish-info.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.dish-name {
		@apply font-black text-gray-800;
		font-size: clamp(24px, 6vw, 36px);
	}

	.dish-grade {
		@apply px-4 py-1.5;
		@apply rounded-full;
		@apply font-bold text-white;
		font-size: clamp(12px, 3vw, 16px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	/* 수익 표시 */
	.profit-section {
		@apply flex flex-col items-center gap-2;
		animation: profitFadeIn 0.4s ease-out 0.3s both;
	}

	@keyframes profitFadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.profit-main {
		@apply flex items-center gap-2;
	}

	.coin-icon {
		font-size: clamp(32px, 8vw, 48px);
		transition: transform 0.3s ease;
	}

	.coin-icon.bounce {
		animation: coinBounce 0.5s ease;
	}

	@keyframes coinBounce {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.3);
		}
	}

	.profit-number {
		@apply font-black;
		font-size: clamp(36px, 9vw, 56px);
		text-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
		transition: transform 0.1s ease;
	}

	.profit-main.counting .profit-number {
		animation: numberPulse 0.1s ease-in-out infinite;
	}

	@keyframes numberPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.02);
		}
	}

	.profit-number.positive {
		color: #16a34a;
	}

	.profit-number.negative {
		color: #dc2626;
	}

	.bonus-tag {
		@apply px-4 py-1.5;
		@apply rounded-full;
		@apply font-bold;
		font-size: clamp(12px, 3vw, 16px);
		background: linear-gradient(180deg, #ffd54f 0%, #ffb300 100%);
		color: #5d4037;
		border: 2px solid #ff8f00;
		box-shadow: 0 2px 4px rgba(255, 143, 0, 0.3);
		animation: bonusPop 0.4s ease-out;
	}

	@keyframes bonusPop {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* 하단: 셰프 + 버튼 */
	.bottom-section {
		@apply relative;
		@apply flex flex-col items-center;
		@apply w-full;
		animation: bottomFadeIn 0.4s ease-out 0.5s both;
	}

	@keyframes bottomFadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
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

	.confirm-btn {
		@apply w-full max-w-xs;
		@apply py-4;
		@apply rounded-2xl;
		@apply font-bold;
		font-size: clamp(18px, 4.5vw, 24px);
		background: linear-gradient(180deg, #7cc576 0%, #4caf50 100%);
		color: white;
		border: none;
		border-bottom: 5px solid #2d6b2f;
		box-shadow: 0 4px 12px rgba(45, 107, 47, 0.3);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.confirm-btn:active {
		border-bottom-width: 2px;
		transform: translateY(3px);
	}

	/* 스킵 힌트 */
	.skip-hint {
		@apply absolute bottom-8 left-1/2 -translate-x-1/2;
		@apply text-orange-700/60;
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
