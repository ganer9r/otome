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
	let showMoney = $state(false);
	let showButton = $state(false);

	// 화면 흔들림
	let screenShake = $state(false);

	// 코인 애니메이션 상태
	let showCoins = $state(false);
	let coinsCollecting = $state(false);
	let displayedProfit = $state(0);

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
		vx: number; // x 속도
		vy: number; // y 속도
		size: number;
		rotation: number;
		rotationSpeed: number;
		landed: boolean;
		floatPhase: number;
		groundY: number; // 각 코인마다 다른 바닥 높이
	}

	let coinStates = $state<CoinState[]>([]);
	let coinAnimationId: number | null = null;

	// 코인 초기화
	function initCoins() {
		const gravity = 0.5; // 중력 (높이면 빨리 떨어짐)
		const coins: CoinState[] = [];

		for (let i = 0; i < 16; i++) {
			// 360도로 균등 분포
			const baseAngle = (i / 16) * 360;
			const angle = baseAngle + (Math.random() - 0.5) * 30;
			const radian = (angle * Math.PI) / 180;

			// 초기 속도 (좁은 범위로 퍼짐)
			const power = 4 + Math.random() * 4; // 바깥으로 퍼지는 힘 줄임
			const upPower = 12 + Math.random() * 6; // 위로 솟구치는 힘

			coins.push({
				id: i,
				x: 0,
				y: 0,
				vx: Math.cos(radian) * power,
				vy: -upPower, // 위로!
				size: 24 + Math.random() * 12,
				rotation: 0,
				rotationSpeed: (Math.random() - 0.5) * 15,
				landed: false,
				floatPhase: Math.random() * Math.PI * 2,
				groundY: -150 + Math.random() * 270 // 각 코인마다 다른 바닥 (-150 ~ 120)
			});
		}

		coinStates = coins;

		// 물리 시뮬레이션 시작
		const startTime = performance.now();
		const duration = 1200; // 1.2초

		function simulate(currentTime: number) {
			const elapsed = currentTime - startTime;

			if (elapsed < duration) {
				coinStates = coinStates.map((coin) => {
					if (coin.landed) return coin;

					// 중력 적용
					const newVy = coin.vy + gravity;
					let newX = coin.x + coin.vx;
					const newY = coin.y + newVy;
					const newRotation = coin.rotation + coin.rotationSpeed;
					let newVx = coin.vx;

					// X 범위 제한 (-180 ~ 180)
					if (newX < -180) {
						newX = -180;
						newVx = -newVx * 0.3; // 벽에 튕김
					} else if (newX > 180) {
						newX = 180;
						newVx = -newVx * 0.3;
					}

					// 각 코인의 고유 바닥에 착지
					if (newY > coin.groundY) {
						return {
							...coin,
							x: newX,
							y: coin.groundY,
							vy: 0,
							vx: 0,
							rotation: newRotation,
							landed: true
						};
					}

					// 공기 저항
					const drag = 0.98;

					return {
						...coin,
						x: newX,
						y: newY,
						vx: newVx * drag,
						vy: newVy,
						rotation: newRotation
					};
				});

				coinAnimationId = requestAnimationFrame(simulate);
			} else {
				// 애니메이션 완료 - 모든 코인 착지
				coinStates = coinStates.map((coin) => ({
					...coin,
					landed: true,
					vy: 0,
					vx: 0
				}));
			}
		}

		coinAnimationId = requestAnimationFrame(simulate);
	}

	// 둥둥 떠다니기 (착지 후)
	$effect(() => {
		if (!showCoins || coinsCollecting) return;

		const floatInterval = setInterval(() => {
			coinStates = coinStates.map((coin) => ({
				...coin,
				floatPhase: coin.floatPhase + 0.08
			}));
		}, 30);

		return () => clearInterval(floatInterval);
	});

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
				triggerShake();
			}, 1200)
		);

		// 3. 셰프 등장 (0.8초 후)
		timers.push(
			setTimeout(() => {
				stage = 'chef';
				showChef = true;
				triggerShake();
			}, 2000)
		);

		// 4. 금액 등장 (0.8초 후)
		timers.push(
			setTimeout(() => {
				stage = 'money';
				showMoney = true;
				showCoins = true;
				initCoins(); // 코인 물리 시뮬레이션 시작
				triggerShake();
				startCounting();
			}, 2800)
		);

		// 5. 버튼 등장 (0.6초 후)
		timers.push(
			setTimeout(() => {
				stage = 'complete';
				showButton = true;
			}, 3400)
		);

		return () => timers.forEach((t) => clearTimeout(t));
	});

	// 수익 카운팅 애니메이션
	function startCounting() {
		const duration = 600;
		const startTime = performance.now();
		const targetProfit = profit;

		function animate(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - (1 - progress) * (1 - progress);
			displayedProfit = Math.round(targetProfit * eased);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				displayedProfit = targetProfit;
			}
		}
		requestAnimationFrame(animate);
	}

	function handleSkip() {
		if (stage !== 'complete') {
			stage = 'complete';
			showDish = true;
			showChef = true;
			showMoney = true;
			showCoins = true;
			showButton = true;
			displayedProfit = profit;
		}
	}

	function handleConfirm() {
		if (isFail) {
			onComplete?.();
			return;
		}

		// 코인 수집 애니메이션 - 지갑으로 빨려들어감
		coinsCollecting = true;

		const startTime = performance.now();
		const duration = 800;

		// 지갑과 coin-burst의 실제 위치 계산
		let walletX = 250;
		let walletY = -350;

		if (walletEl && coinBurstEl) {
			const walletRect = walletEl.getBoundingClientRect();
			const burstRect = coinBurstEl.getBoundingClientRect();

			// coin-burst 중심 기준 지갑 상대 위치
			const burstCenterX = burstRect.left + burstRect.width / 2;
			const burstCenterY = burstRect.top + burstRect.height / 2;
			const walletCenterX = walletRect.left + walletRect.width / 2;
			const walletCenterY = walletRect.top + walletRect.height / 2;

			walletX = walletCenterX - burstCenterX;
			walletY = walletCenterY - burstCenterY;
		}

		// 각 코인의 시작 상태 저장
		const startStates = coinStates.map((coin) => ({
			x: coin.x,
			y: coin.y,
			size: coin.size,
			rotation: coin.rotation
		}));

		function animateCollect(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			coinStates = coinStates.map((coin, i) => {
				const start = startStates[i];
				// 시간차 두기
				const delay = i * 0.03;
				const coinProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
				// easeInCubic - 점점 빨라짐
				const coinEased = coinProgress * coinProgress * coinProgress;

				return {
					...coin,
					x: start.x + (walletX - start.x) * coinEased,
					y: start.y + (walletY - start.y) * coinEased,
					rotation: start.rotation + coinEased * 720,
					size: start.size * (1 - coinEased * 0.8) // 마지막에 작아짐
				};
			});

			if (progress < 1) {
				requestAnimationFrame(animateCollect);
			} else {
				// 코인 다 들어감 - 지갑 펄스 후 완료
				coinStates = [];
				setTimeout(() => {
					onComplete?.();
				}, 300);
			}
		}

		requestAnimationFrame(animateCollect);
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
	<div class="wallet-icon" class:pulse={coinsCollecting} bind:this={walletEl}>
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

			<!-- 영역 2: 셰프 (고정 높이) -->
			<div class="slot slot-chef">
				<div
					class="chef-content"
					class:visible={showChef}
					class:animate={showChef}
					class:critical={isCritical}
					class:fail={isFail}
				>
					<div class="chef-wrapper">
						<img src={chefImage} alt="셰프" class="chef-image" />
					</div>
					<div class="speech-bubble" class:critical={isCritical} class:fail={isFail}>
						<span>{chefDialogue}</span>
					</div>
				</div>
			</div>

			<!-- 영역 3: 금액 (고정 높이) -->
			<div class="slot slot-money">
				<!-- 코인 물리 시뮬레이션 -->
				{#if showCoins && !isFail}
					<div class="coin-burst" class:collecting={coinsCollecting} bind:this={coinBurstEl}>
						{#each coinStates as coin (coin.id)}
							{@const floatY = coin.landed ? Math.sin(coin.floatPhase) * 6 : 0}
							<div
								class="coin-wrapper"
								class:collecting={coinsCollecting}
								class:landed={coin.landed}
								style="
									transform: translate({coin.x}px, {coin.y + floatY}px);
								"
							>
								<img
									src="/imgs/ui/coin.png"
									alt=""
									class="coin-particle"
									style="
										width: {coin.size}px;
										height: {coin.size}px;
										transform: rotate({coin.rotation}deg) scale({coin.landed ? 1 : 1.1});
									"
								/>
								<div
									class="coin-shadow"
									style="
										width: {coin.size * 0.6}px;
										opacity: {coin.landed ? 0.4 : 0.2};
										transform: translateX(-50%) scale({coin.landed ? 1 : 0.5});
									"
								></div>
							</div>
						{/each}
					</div>
				{/if}

				<div class="money-content" class:visible={showMoney} class:animate={showMoney}>
					<div class="profit-display">
						<img src="/imgs/ui/coin.png" alt="coin" class="profit-coin" />
						<span
							class="profit-number"
							class:positive={displayedProfit >= 0}
							class:negative={displayedProfit < 0}
						>
							{displayedProfit >= 0 ? '+' : ''}{displayedProfit.toLocaleString()}원
						</span>
					</div>
					{#if isFail}
						<div class="fail-tag">재료비 날림!</div>
					{:else if isCritical}
						<div class="bonus-tag">대박!</div>
					{/if}
				</div>
			</div>

			<!-- 영역 4: 버튼 (고정 높이) -->
			<div class="slot slot-button">
				<div class="button-content" class:visible={showButton}>
					<GameButton variant={isFail ? 'secondary' : 'primary'} size="lg" onclick={handleConfirm}>
						{isFail ? '다시 도전!' : '획득하기'}
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
		padding-top: 60px;
		padding-bottom: 40px;
	}

	.slot {
		@apply flex items-center justify-center;
		@apply w-full;
	}

	.slot-dish {
		flex: 0 0 auto;
		min-height: 200px;
	}

	.slot-chef {
		flex: 0 0 auto;
		min-height: 100px;
		margin-top: 8px;
	}

	.slot-money {
		@apply relative;
		flex: 0 0 auto;
		min-height: 100px;
		margin-top: 12px;
	}

	.slot-button {
		flex: 0 0 auto;
		min-height: 60px;
		margin-top: 16px;
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
		@apply flex items-center gap-3;
		opacity: 0;
		transform: translateX(-50px);
		transition: none;
	}

	.chef-content.visible {
		opacity: 1;
		transform: translateX(0);
	}

	.chef-content.animate {
		animation: chefAppear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
	}

	@keyframes chefAppear {
		0% {
			opacity: 0;
			transform: translateX(-80px) scale(0.5);
		}
		60% {
			transform: translateX(10px) scale(1.05);
		}
		100% {
			opacity: 1;
			transform: translateX(0) scale(1);
		}
	}

	.chef-wrapper {
		@apply flex-shrink-0;
		width: clamp(80px, 22vw, 110px);
		height: clamp(80px, 22vw, 110px);
	}

	.chef-image {
		@apply h-full w-full object-contain;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
	}

	.chef-content.critical .chef-wrapper {
		animation: chefJump 0.6s ease-out 0.3s;
	}

	@keyframes chefJump {
		0%,
		100% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(-15px) rotate(-5deg);
		}
		60% {
			transform: translateY(-8px) rotate(3deg);
		}
	}

	.chef-content.fail .chef-wrapper {
		animation: chefSad 0.5s ease-out 0.3s;
	}

	@keyframes chefSad {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(5px) rotate(-3deg);
		}
	}

	/* 말풍선 */
	.speech-bubble {
		@apply relative;
		@apply px-4 py-2.5;
		@apply rounded-2xl;
		@apply font-bold;
		font-size: clamp(14px, 3.5vw, 20px);
		background: white;
		border: 3px solid #5d4037;
		color: #5d4037;
		box-shadow: 0 3px 0 #3e2723;
		max-width: clamp(160px, 45vw, 240px);
		animation: bubblePop 0.3s ease-out 0.2s both;
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
