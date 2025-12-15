<script lang="ts">
	import { onMount } from 'svelte';
	import type { Ingredient, Recipe } from '../lib/types';
	import { GRADE_COLORS } from '../lib/types';
	import { getProgressByGrade } from '../lib/data/ingredients';
	import { unlockedIngredientsStore, runStore, upgradeStore } from '../lib/store';
	import { getChefImage, getRandomDialogue, type ChefEmotion } from '../lib/chef-images';
	import ResultCard from './ResultCard.svelte';
	import DishResult from './DishResult.svelte';

	interface Props {
		resultIngredient: Ingredient;
		recipe: Recipe;
		/** 재료비 (이미 차감됨) */
		ingredientCost?: number;
		/** 손님 주문 보너스 */
		orderBonus?: number;
		onComplete?: () => void;
		onUseNow?: (ingredientId: number) => void;
	}

	let {
		resultIngredient,
		recipe,
		ingredientCost = 0,
		orderBonus = 0,
		onComplete,
		onUseNow
	}: Props = $props();

	// 요리인지 재료인지 구분
	let isDish = $derived(!resultIngredient.isIngredient);

	// 런 상태
	let runState = $derived($runStore);

	// 업그레이드 효과
	let upgradeEffects = $derived(upgradeStore.getEffects());

	// 판매 금액 (업그레이드 보너스 적용)
	let baseSellPrice = $derived(resultIngredient.sellPrice ?? 0);
	let sellPrice = $derived(Math.round(baseSellPrice * (1 + upgradeEffects.sellBonusRate)));
	// 순이익 (판매가 - 재료비 + 보너스)
	let profit = $derived(sellPrice - ingredientCost + orderBonus);
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

	let stage = $state<'heartbeat' | 'explosion' | 'card' | 'result'>('heartbeat');
	let cardFlipped = $state(false);
	let canSkip = $state(true);

	const potImage = '/imgs/cw_pot.webp';

	// 캐릭터 이모션 결정
	let chefEmotion = $derived((): ChefEmotion => {
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

<!-- 요리: 새로운 심플 연출 -->
{#if isDish}
	<DishResult {resultIngredient} {sellPrice} {profit} {orderBonus} onComplete={handleConfirm} />
{:else}
	<!-- 재료: 기존 카드 뒤집기 연출 -->
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
					<!-- 카드 영역 -->
					<div class="card-chef-area">
						<!-- 카드 -->
						<div class="card-wrapper" class:card-entered={stage === 'card' || stage === 'result'}>
							<div
								class="sunburst-wrapper"
								class:card-entered={stage === 'card' || stage === 'result'}
							>
								<img src="/imgs/bg-sunburst.png" alt="" class="sunburst-img" />
							</div>
							<ResultCard ingredient={resultIngredient} flipped={cardFlipped} />
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
									{#if orderBonus > 0}
										<div class="bonus-badge">
											주문 보너스 +{orderBonus}원
										</div>
									{/if}
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
						<div class="chef-section">
							<div class="chef-bubble">{chefDialogue}</div>
							<img src={chefImage} alt="셰프" class="chef-img" />
						</div>

						<!-- 버튼 -->
						<div class="button-row">
							{#if onUseNow}
								<button type="button" class="btn-secondary" onclick={handleUseNow}
									>바로 써보기</button
								>
							{/if}
							<button type="button" class="btn-primary" onclick={handleConfirm}>확인</button>
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
		width: clamp(120px, 35vw, 180px);
		height: auto;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
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
		max-width: 140px;
		text-align: center;
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

	.btn-primary {
		@apply flex-1;
		@apply py-4;
		@apply rounded-2xl;
		@apply font-bold;
		font-size: clamp(16px, 4vw, 20px);
		background: linear-gradient(180deg, #7cc576 0%, #4caf50 100%);
		color: white;
		border: none;
		border-bottom: 5px solid #2d6b2f;
		box-shadow: 0 4px 12px rgba(45, 107, 47, 0.3);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.btn-primary:active {
		border-bottom-width: 2px;
		transform: translateY(3px);
	}

	.btn-secondary {
		@apply flex-1;
		@apply py-4;
		@apply rounded-2xl;
		@apply font-bold;
		font-size: clamp(14px, 3.5vw, 18px);
		background: linear-gradient(180deg, #fff 0%, #f5f5f5 100%);
		color: #5d4037;
		border: 3px solid #8b7355;
		border-bottom-width: 5px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.btn-secondary:active {
		border-bottom-width: 2px;
		transform: translateY(3px);
	}
</style>
