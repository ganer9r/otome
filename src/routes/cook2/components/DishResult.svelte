<script lang="ts">
	import { onMount } from 'svelte';
	import type { Ingredient, CookResult } from '../lib/types';
	import { GRADE_COLORS, GRADE_NAMES } from '../lib/types';
	import { getChefImage, getRandomDialogue, type ChefEmotion } from '../lib/chef-images';
	import GameButton from './GameButton.svelte';

	interface Props {
		resultIngredient: Ingredient;
		cookResult: CookResult;
		sellPrice: number;
		profit: number;
		onComplete?: () => void;
	}

	let { resultIngredient, cookResult, sellPrice, profit, onComplete }: Props = $props();

	// 결과 타입
	let isFail = $derived(cookResult.resultType === 'fail');
	let isCritical = $derived(cookResult.resultType === 'critical');
	let displayName = $derived(cookResult.displayName);
	let description = $derived(cookResult.description);

	// 단계: pot -> steam -> dish -> chef -> money -> complete
	type Stage = 'pot' | 'steam' | 'dish' | 'chef' | 'money' | 'complete';
	let stage = $state<Stage>('pot');

	// 각 영역 표시 상태 (한번 true가 되면 유지)
	let showDish = $state(false);
	let showChef = $state(false);
	let showBubble = $state(false);
	let showCoins = $state(false);
	let showButton = $state(false);

	// 버튼 숫자 카운트업
	let displayedProfit = $state(0);

	// 화면 흔들림
	let screenShake = $state(false);

	const potImage = '/imgs/cw_pot.webp';

	// 셰프 이미지 & 대사
	let chefEmotion = $derived((): ChefEmotion => {
		if (isCritical) return 'surprised';
		if (isFail) return 'embarrassed';
		return 'proud';
	});
	let chefImage = $derived(getChefImage(chefEmotion()));
	let chefDialogue = $state('');

	$effect(() => {
		if (description) {
			chefDialogue = description;
		} else {
			chefDialogue = getRandomDialogue(chefEmotion());
		}
	});

	// 김 파티클
	const steamParticles = Array.from({ length: 8 }, (_, i) => ({
		id: i,
		left: 30 + Math.random() * 40,
		delay: Math.random() * 0.5,
		duration: 1.5 + Math.random() * 0.5,
		size: 20 + Math.random() * 20
	}));

	// 코인 물리 시뮬레이션
	interface CoinState {
		id: number;
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		rotation: number;
		rotationSpeed: number;
		groundY: number;
	}

	let coinStates = $state<CoinState[]>([]);
	let coinAnimationId: number | null = null;

	// 코인 초기화
	// 코인 ID 카운터
	let coinIdCounter = 0;
	let coinIntervalId: ReturnType<typeof setInterval> | null = null;

	function initCoins() {
		if (isCritical) {
			// 대박: 폭발 이펙트 반복
			startCriticalCoins();
		} else {
			// 일반 성공: 띠용띠용 하나씩
			startNormalCoins();
		}
	}

	// 대박: 코인 폭발 반복
	function startCriticalCoins() {
		function burstCoins() {
			const gravity = 0.5;
			const newCoins: CoinState[] = [];

			for (let i = 0; i < 12; i++) {
				// X 속도: -12 ~ 12 (가운데 포함)
				const vx = (Math.random() - 0.5) * 24;

				newCoins.push({
					id: coinIdCounter++,
					x: 0,
					y: 0,
					vx: vx,
					vy: -(10 + Math.random() * 8),
					size: 24 + Math.random() * 12,
					rotation: 0,
					rotationSpeed: (Math.random() - 0.5) * 15,
					groundY: 500
				});
			}

			coinStates = [...coinStates, ...newCoins];

			// 물리 시뮬레이션
			function simulate() {
				if (coinStates.length === 0) return;

				coinStates = coinStates
					.map((coin) => {
						const newVy = coin.vy + gravity;
						let newX = coin.x + coin.vx;
						const newY = coin.y + newVy;
						let newVx = coin.vx;

						if (newX < -180) {
							newX = -180;
							newVx = -newVx * 0.3;
						} else if (newX > 180) {
							newX = 180;
							newVx = -newVx * 0.3;
						}

						if (newY > coin.groundY) {
							return null;
						}

						return {
							...coin,
							x: newX,
							y: newY,
							vx: newVx * 0.98,
							vy: newVy,
							rotation: coin.rotation + coin.rotationSpeed
						};
					})
					.filter((coin): coin is CoinState => coin !== null);

				if (coinStates.length > 0) {
					coinAnimationId = requestAnimationFrame(simulate);
				}
			}

			coinAnimationId = requestAnimationFrame(simulate);
		}

		// 첫 폭발
		burstCoins();

		// 1초마다 반복
		coinIntervalId = setInterval(burstCoins, 1000);
	}

	// 일반 성공: 코인 하나씩 띠용띠용
	function startNormalCoins() {
		const gravity = 0.3;

		function spawnCoin() {
			const direction = Math.random() < 0.5 ? -1 : 1;

			const newCoin: CoinState = {
				id: coinIdCounter++,
				x: (Math.random() - 0.5) * 60, // 약간 랜덤 위치
				y: 0,
				vx: direction * (2 + Math.random() * 3),
				vy: -(8 + Math.random() * 4), // 위로 띠용
				size: 28 + Math.random() * 8,
				rotation: 0,
				rotationSpeed: (Math.random() - 0.5) * 10,
				groundY: 400
			};

			coinStates = [...coinStates, newCoin];
		}

		// 물리 시뮬레이션 (계속 실행)
		function simulate() {
			if (coinStates.length > 0) {
				coinStates = coinStates
					.map((coin) => {
						const newVy = coin.vy + gravity;
						const newX = coin.x + coin.vx;
						const newY = coin.y + newVy;

						if (newY > coin.groundY) {
							return null;
						}

						return {
							...coin,
							x: newX,
							y: newY,
							vx: coin.vx * 0.99,
							vy: newVy,
							rotation: coin.rotation + coin.rotationSpeed
						};
					})
					.filter((coin): coin is CoinState => coin !== null);
			}

			coinAnimationId = requestAnimationFrame(simulate);
		}

		// 시뮬레이션 시작
		coinAnimationId = requestAnimationFrame(simulate);

		// 1초마다 코인 하나씩 생성
		coinIntervalId = setInterval(spawnCoin, 1000);

		// 첫 코인은 0.5초 후
		setTimeout(spawnCoin, 500);
	}

	// 코인 애니메이션 정리
	function stopCoins() {
		if (coinAnimationId) {
			cancelAnimationFrame(coinAnimationId);
			coinAnimationId = null;
		}
		if (coinIntervalId) {
			clearInterval(coinIntervalId);
			coinIntervalId = null;
		}
		coinStates = [];
	}

	// 화면 흔들림 트리거
	function triggerShake() {
		screenShake = true;
		setTimeout(() => (screenShake = false), 300);
	}

	onMount(() => {
		const timers: ReturnType<typeof setTimeout>[] = [];

		// 1. 냄비 두근두근 (0.6초)
		timers.push(setTimeout(() => (stage = 'steam'), 600));

		// 2. 김 모락모락 (0.6초) -> 요리 등장
		timers.push(
			setTimeout(() => {
				stage = 'dish';
				showDish = true;
			}, 1200)
		);

		// 3. 셰프 등장 (0.8초 후)
		timers.push(
			setTimeout(() => {
				stage = 'complete';
				showChef = true;
			}, 2000)
		);

		// 4. 말풍선 등장 (0.5초 후)
		timers.push(
			setTimeout(() => {
				showBubble = true;
			}, 2500)
		);

		// 5. 코인 + 버튼 등장 (0.5초 후)
		timers.push(
			setTimeout(() => {
				showCoins = true;
				showButton = true;
				initCoins();
				startProfitCounting();
			}, 3000)
		);

		return () => timers.forEach((t) => clearTimeout(t));
	});

	// 버튼 숫자 카운트업 애니메이션
	function startProfitCounting() {
		const duration = 1500; // 1.5초
		const startTime = performance.now();
		const target = profit;

		function animate(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			// easeOutCubic - 자연스럽게 감속
			const eased = 1 - Math.pow(1 - progress, 3);
			displayedProfit = Math.round(target * eased);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				displayedProfit = target;
			}
		}
		requestAnimationFrame(animate);
	}

	function handleSkip() {
		if (stage !== 'complete') {
			stage = 'complete';
			showDish = true;
			showChef = true;
			showBubble = true;
			showCoins = true;
			showButton = true;
			displayedProfit = profit;
		}
	}

	function handleConfirm() {
		stopCoins();
		onComplete?.();
	}

	// 미사용 변수 처리
	void sellPrice;

	// DOM 요소 참조
	let walletEl: HTMLDivElement;
	let coinBurstEl: HTMLDivElement;
</script>

<div
	class="dish-result-screen"
	class:fail-bg={isFail && showDish}
	class:shake={screenShake}
	onclick={handleSkip}
	onkeydown={(e) => e.key === 'Enter' && handleSkip()}
	role="button"
	tabindex="0"
>
	<!-- 지갑 아이콘 (우상단) -->
	<div class="wallet-icon" bind:this={walletEl}>
		<img src="/imgs/ui/coin.png" alt="지갑" />
	</div>

	{#if stage === 'pot'}
		<!-- 냄비 두근두근 -->
		<div class="stage-pot">
			<div class="pot-wrapper">
				<div class="pot-glow"></div>
				<img src={potImage} alt="냄비" class="pot-shaking" />
			</div>
			<div class="stage-text">쿵쿵...</div>
		</div>
	{:else if stage === 'steam'}
		<!-- 김 모락모락 -->
		<div class="stage-steam">
			<div class="pot-wrapper">
				<img src={potImage} alt="냄비" class="pot-still" />
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
			<div class="stage-text">모락모락~</div>
		</div>
	{:else}
		<!-- 메인 결과 화면 (고정 레이아웃) -->
		<div class="result-layout">
			<!-- 영역 1: 요리 (고정 높이) -->
			<div class="slot slot-dish">
				<!-- 코인 물리 시뮬레이션 (요리 중앙에서 터짐) -->
				{#if showCoins && !isFail}
					<div class="coin-burst" bind:this={coinBurstEl}>
						{#each coinStates as coin (coin.id)}
							<div class="coin-wrapper" style="transform: translate({coin.x}px, {coin.y}px);">
								<img
									src="/imgs/ui/coin.png"
									alt=""
									class="coin-particle"
									style="
										width: {coin.size}px;
										height: {coin.size}px;
										transform: rotate({coin.rotation}deg);
									"
								/>
							</div>
						{/each}
					</div>
				{/if}

				<div class="dish-content" class:visible={showDish} class:animate={showDish}>
					{#if isFail}
						<div class="black-blob">
							<div class="blob-body">
								<div class="blob-eye left"></div>
								<div class="blob-eye right"></div>
							</div>
						</div>
						<h2 class="dish-name fail">{displayName || '미확인 물체'}</h2>
					{:else}
						<div class="dish-glow"></div>
						<img src={resultIngredient.imageUrl} alt={resultIngredient.name} class="dish-image" />
						<h2 class="dish-name">{resultIngredient.name}</h2>
						<div
							class="dish-grade"
							style="background-color: {GRADE_COLORS[resultIngredient.grade]}"
						>
							{resultIngredient.grade}등급 · {GRADE_NAMES[resultIngredient.grade]}
						</div>
					{/if}
				</div>
			</div>

			<!-- 하단 영역: 셰프 + 버튼 -->
			<div class="bottom-section">
				<div
					class="chef-content"
					class:visible={showChef}
					class:critical={isCritical}
					class:fail={isFail}
				>
					<div class="chef-wrapper" class:animate={showChef} class:idle={showBubble}>
						<!-- 집중선 효과 (셰프 뒤) -->
						<div class="chef-focus-lines" class:visible={showChef} class:critical={isCritical}>
							{#each Array(12) as _, i}
								<div class="focus-line" style="--i: {i}"></div>
							{/each}
						</div>
						<img src={chefImage} alt="셰프" class="chef-image" />
					</div>
					<div
						class="speech-bubble"
						class:visible={showBubble}
						class:critical={isCritical}
						class:fail={isFail}
					>
						<span>{chefDialogue}</span>
					</div>
				</div>

				<div class="button-content" class:visible={showButton}>
					<GameButton variant={isFail ? 'secondary' : 'primary'} size="lg" onclick={handleConfirm}>
						{isFail ? '다시 도전!' : `+${displayedProfit.toLocaleString()}원 획득하기`}
					</GameButton>
				</div>
			</div>
		</div>
	{/if}

	{#if stage !== 'complete'}
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
		transition: background 0.3s ease;
	}

	.dish-result-screen.fail-bg {
		background: linear-gradient(to bottom, #5d4e4e, #3d3535);
	}

	.dish-result-screen.shake {
		animation: screenShake 0.3s ease-out;
	}

	@keyframes screenShake {
		0%,
		100% {
			transform: translateX(0) translateY(0);
		}
		20% {
			transform: translateX(-8px) translateY(4px);
		}
		40% {
			transform: translateX(8px) translateY(-4px);
		}
		60% {
			transform: translateX(-4px) translateY(2px);
		}
		80% {
			transform: translateX(4px) translateY(-2px);
		}
	}

	/* ===== 지갑 아이콘 ===== */
	.wallet-icon {
		@apply absolute z-50;
		top: 16px;
		right: 16px;
		width: 48px;
		height: 48px;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 50%;
		padding: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.wallet-icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.wallet-icon.pulse {
		animation: walletPulse 0.2s ease-out 5;
	}

	@keyframes walletPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.4);
		}
	}

	/* ===== 냄비 단계 ===== */
	.stage-pot,
	.stage-steam {
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

	.pot-still {
		@apply relative z-10 h-40 w-40 object-contain;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
	}

	.stage-text {
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

	/* ===== 고정 레이아웃 ===== */
	.result-layout {
		@apply flex flex-col items-center;
		@apply h-full w-full;
		@apply px-4;
		padding-top: 40px;
		padding-bottom: 32px;
	}

	.slot {
		@apply flex items-center justify-center;
		@apply w-full;
	}

	.slot-dish {
		@apply relative flex items-center justify-center;
		flex: 1;
		min-height: 200px;
	}

	.bottom-section {
		@apply relative flex flex-col items-center gap-3;
		@apply w-full;
		flex: 0 0 auto;
		padding: 0 16px;
	}

	/* ===== 요리 영역 ===== */
	.dish-content {
		@apply flex flex-col items-center gap-2;
		opacity: 0;
		transform: scale(0.3) translateY(30px);
		transition: none;
	}

	.dish-content.visible {
		opacity: 1;
		transform: scale(1) translateY(0);
	}

	.dish-content.animate {
		animation: dishAppear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
	}

	@keyframes dishAppear {
		0% {
			opacity: 0;
			transform: scale(0.3) translateY(30px);
		}
		60% {
			transform: scale(1.1) translateY(-10px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.dish-glow {
		@apply absolute rounded-full;
		width: 220px;
		height: 220px;
		background: radial-gradient(circle, rgba(255, 200, 100, 0.4) 0%, transparent 60%);
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
		width: clamp(140px, 38vw, 180px);
		height: clamp(140px, 38vw, 180px);
		@apply object-contain;
		filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.25));
	}

	.dish-name {
		@apply font-black text-gray-800;
		font-size: clamp(24px, 6vw, 36px);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dish-name.fail {
		@apply text-red-400;
	}

	.dish-grade {
		@apply px-4 py-1.5;
		@apply rounded-full;
		@apply font-bold text-white;
		font-size: clamp(12px, 3vw, 16px);
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
	}

	/* 검은 덩어리 */
	.black-blob {
		@apply relative;
		width: clamp(120px, 35vw, 160px);
		height: clamp(120px, 35vw, 160px);
		animation: blobWobble 0.8s ease-in-out infinite;
	}

	@keyframes blobWobble {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
		}
		25% {
			transform: scale(1.02, 0.98) rotate(-1deg);
		}
		50% {
			transform: scale(0.98, 1.02) rotate(1deg);
		}
		75% {
			transform: scale(1.01, 0.99) rotate(-0.5deg);
		}
	}

	.blob-body {
		@apply absolute inset-0 rounded-full;
		background: radial-gradient(ellipse at 30% 30%, #4a4a4a 0%, #1a1a1a 50%, #0a0a0a 100%);
		box-shadow:
			inset 0 -20px 40px rgba(0, 0, 0, 0.5),
			0 10px 30px rgba(0, 0, 0, 0.5);
	}

	.blob-eye {
		@apply absolute rounded-full;
		width: 20%;
		height: 25%;
		background: white;
		top: 35%;
	}

	.blob-eye.left {
		left: 25%;
	}
	.blob-eye.right {
		right: 25%;
	}

	.blob-eye::after {
		content: '';
		@apply absolute rounded-full;
		width: 50%;
		height: 50%;
		background: #1a1a1a;
		top: 30%;
		left: 25%;
	}

	/* ===== 셰프 영역 ===== */
	.chef-content {
		@apply relative flex items-center gap-4;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.chef-content.visible {
		opacity: 1;
	}

	/* 집중선 효과 */
	.chef-focus-lines {
		@apply pointer-events-none absolute;
		width: 300px;
		height: 300px;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
	}

	.chef-focus-lines.visible {
		opacity: 1;
		animation: focusLinesSpin 10s linear infinite;
	}

	.chef-focus-lines.critical {
		opacity: 1;
		animation: focusLinesSpin 4s linear infinite;
	}

	@keyframes focusLinesSpin {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	.focus-line {
		@apply absolute;
		left: 50%;
		top: 50%;
		width: 6px;
		height: 120px;
		background: linear-gradient(to top, rgba(255, 193, 7, 0.9) 0%, rgba(255, 193, 7, 0) 100%);
		transform-origin: bottom center;
		transform: translateX(-50%) translateY(-100%) rotate(calc(var(--i) * 30deg));
		border-radius: 3px;
	}

	.chef-wrapper {
		@apply relative flex-shrink-0;
		overflow: visible;
		width: clamp(140px, 40vw, 220px);
		height: clamp(140px, 40vw, 220px);
		transform: scale(0);
	}

	.chef-wrapper.animate {
		animation: chefAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	/* 등장 후 idle 애니메이션 - 통통 튀기 */
	.chef-wrapper.idle {
		animation:
			chefAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
			chefIdle 1.5s ease-in-out 0.5s infinite;
	}

	@keyframes chefAppear {
		0% {
			transform: scale(2);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes chefIdle {
		0%,
		100% {
			transform: scale(1) translateY(0);
		}
		50% {
			transform: scale(1.02) translateY(-5px);
		}
	}

	.chef-image {
		@apply h-full w-full object-contain;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
	}

	/* 대박: 깡충깡충 점프 */
	.chef-content.critical .chef-wrapper.idle {
		animation:
			chefAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
			chefJump 0.6s ease-in-out 0.5s infinite;
	}

	@keyframes chefJump {
		0%,
		100% {
			transform: scale(1) translateY(0) rotate(0deg);
		}
		25% {
			transform: scale(1.05) translateY(-15px) rotate(-3deg);
		}
		50% {
			transform: scale(1) translateY(0) rotate(0deg);
		}
		75% {
			transform: scale(1.05) translateY(-15px) rotate(3deg);
		}
	}

	/* 실패: 고개 떨구기 */
	.chef-content.fail .chef-wrapper.idle {
		animation:
			chefAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
			chefSad 2s ease-in-out 0.5s infinite;
	}

	@keyframes chefSad {
		0%,
		100% {
			transform: scale(1) translateY(0) rotate(0deg);
		}
		50% {
			transform: scale(0.95) translateY(5px) rotate(-5deg);
		}
	}

	/* 말풍선 */
	.speech-bubble {
		@apply relative;
		@apply px-5 py-3;
		@apply rounded-2xl;
		@apply font-black;
		font-size: clamp(16px, 4vw, 24px);
		background: white;
		border: 4px solid #5d4037;
		color: #5d4037;
		box-shadow: 0 4px 0 #3e2723;
		max-width: clamp(180px, 50vw, 280px);
		opacity: 0;
		transform: scale(0);
	}

	.speech-bubble.visible {
		animation: bubblePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	.speech-bubble::before {
		content: '';
		@apply absolute;
		left: -12px;
		top: 50%;
		transform: translateY(-50%);
		border: 8px solid transparent;
		border-right-color: #5d4037;
	}

	.speech-bubble::after {
		content: '';
		@apply absolute;
		left: -6px;
		top: 50%;
		transform: translateY(-50%);
		border: 6px solid transparent;
		border-right-color: white;
	}

	@keyframes bubblePop {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		60% {
			transform: scale(1.08);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.speech-bubble.critical {
		background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
		border-color: #f59e0b;
		color: #92400e;
		box-shadow:
			0 3px 0 #d97706,
			0 0 20px rgba(251, 191, 36, 0.5);
	}

	.speech-bubble.critical::before {
		border-right-color: #f59e0b;
	}
	.speech-bubble.critical::after {
		border-right-color: #fffbeb;
	}

	.speech-bubble.fail {
		background: #ffebee;
		border-color: #c62828;
		color: #c62828;
		box-shadow: 0 3px 0 #b71c1c;
	}

	.speech-bubble.fail::before {
		border-right-color: #c62828;
	}
	.speech-bubble.fail::after {
		border-right-color: #ffebee;
	}

	/* ===== 금액 영역 ===== */
	.money-content {
		@apply flex flex-col items-center gap-2;
		opacity: 0;
		transform: scale(0);
		transition: none;
	}

	.money-content.visible {
		opacity: 1;
		transform: scale(1);
	}

	.money-content.animate {
		animation: moneyAppear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
	}

	@keyframes moneyAppear {
		0% {
			opacity: 0;
			transform: scale(0) rotate(-10deg);
		}
		60% {
			transform: scale(1.15) rotate(5deg);
		}
		100% {
			opacity: 1;
			transform: scale(1) rotate(0);
		}
	}

	.profit-display {
		@apply flex items-center gap-2;
	}

	.profit-coin {
		width: clamp(36px, 9vw, 50px);
		height: clamp(36px, 9vw, 50px);
		animation: coinSpin 0.6s ease-out;
	}

	@keyframes coinSpin {
		0% {
			transform: rotateY(0deg) scale(0);
		}
		50% {
			transform: rotateY(180deg) scale(1.2);
		}
		100% {
			transform: rotateY(360deg) scale(1);
		}
	}

	.profit-number {
		@apply font-black;
		font-size: clamp(40px, 10vw, 64px);
		text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
	}

	.profit-number.positive {
		color: #16a34a;
	}
	.profit-number.negative {
		color: #dc2626;
	}

	.bonus-tag,
	.fail-tag {
		@apply px-4 py-1.5;
		@apply rounded-full;
		@apply font-black;
		font-size: clamp(14px, 3.5vw, 20px);
		animation: tagPop 0.3s ease-out 0.3s both;
	}

	@keyframes tagPop {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		60% {
			transform: scale(1.15);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.bonus-tag {
		background: linear-gradient(180deg, #ffd54f 0%, #ffb300 100%);
		color: #5d4037;
		border: 3px solid #ff8f00;
		box-shadow:
			0 3px 0 #e65100,
			0 0 25px rgba(255, 193, 7, 0.5);
	}

	.fail-tag {
		background: linear-gradient(180deg, #ef5350 0%, #c62828 100%);
		color: white;
		border: 3px solid #b71c1c;
		box-shadow: 0 3px 0 #7f0000;
	}

	/* ===== 코인 물리 시뮬레이션 ===== */
	.coin-burst {
		@apply absolute;
		@apply pointer-events-none;
		left: 50%;
		top: 50%;
		width: 400px;
		height: 300px;
		transform: translate(-50%, -50%);
		z-index: 10;
	}

	.coin-wrapper {
		@apply absolute;
		left: 50%;
		top: 50%;
		transition: none;
	}

	/* 착지 후 부드러운 둥둥 */
	.coin-wrapper.landed {
		transition: transform 0.1s ease-out;
	}

	.coin-particle {
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
		transition: transform 0.05s linear;
	}

	/* 코인 그림자 */
	.coin-shadow {
		@apply absolute;
		left: 50%;
		bottom: -8px;
		height: 6px;
		background: radial-gradient(ellipse, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
		border-radius: 50%;
		transition:
			opacity 0.1s,
			transform 0.1s;
	}

	/* 지갑으로 수집 - JS로 직접 제어 */
	.coin-wrapper.collecting {
		transition: none;
	}

	/* ===== 버튼 영역 ===== */
	.button-content {
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.3s ease-out;
	}

	.button-content.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* ===== 스킵 힌트 ===== */
	.skip-hint {
		@apply absolute bottom-6 left-1/2 -translate-x-1/2;
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
