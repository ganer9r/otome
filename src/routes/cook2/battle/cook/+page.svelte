<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut, elasticOut } from 'svelte/easing';
	import { battleStore } from '../lib/battle-store';
	import { findIngredientById } from '../../lib/data/ingredients';

	// 대결 상태
	let battleState = $derived($battleStore);

	// 현재 단계
	let currentStep = $derived(battleState.cookingSteps[battleState.currentStepIndex]);
	let totalSteps = $derived(battleState.cookingSteps.length);
	let currentStepNum = $derived(battleState.currentStepIndex + 1);

	// 조리 애니메이션 상태
	let phase = $state<'intro' | 'drop' | 'cooking' | 'result' | 'serve'>('intro');

	// 진행 게이지
	const progress = new Tween(0, { duration: 2000, easing: cubicOut });

	// 캐릭터 스케일
	const chefScale = new Tween(1, { duration: 300, easing: elasticOut });

	// 파티클
	let particles = $state<Array<{ id: number; x: number; delay: number; type: 'steam' | 'spark' }>>(
		[]
	);
	let particleId = 0;

	// 배경 회전
	const bgRotation = new Tween(0, { duration: 100 });

	onMount(() => {
		if (!battleState.isInBattle || !battleState.selectedRecipeId) {
			goto('/cook2/battle');
			return;
		}

		// 배경 회전
		const rotateBg = () => {
			bgRotation.set(bgRotation.current + 0.3);
			requestAnimationFrame(rotateBg);
		};
		rotateBg();

		// 인트로 후 시작
		setTimeout(() => {
			startCooking();
		}, 500);
	});

	function createParticles(type: 'steam' | 'spark', count: number) {
		const newParticles: Array<{ id: number; x: number; delay: number; type: 'steam' | 'spark' }> =
			[];
		for (let i = 0; i < count; i++) {
			newParticles.push({
				id: particleId++,
				x: 40 + Math.random() * 20,
				delay: Math.random() * 0.5,
				type
			});
		}
		particles = [...particles, ...newParticles];

		setTimeout(() => {
			particles = particles.filter((p) => !newParticles.includes(p));
		}, 2000);
	}

	function startCooking() {
		phase = 'drop';
		chefScale.set(1.05);

		setTimeout(() => {
			chefScale.set(1);
		}, 200);

		// 재료 떨어진 후 조리 시작
		setTimeout(() => {
			phase = 'cooking';
			progress.set(0);
			progress.set(100, { duration: 2500 });

			// 증기 파티클
			createParticles('steam', 5);
			const steamInterval = setInterval(() => {
				if (phase === 'cooking') {
					createParticles('steam', 3);
				} else {
					clearInterval(steamInterval);
				}
			}, 800);

			// 조리 완료
			setTimeout(() => {
				phase = 'result';
				chefScale.set(1.1);
				createParticles('spark', 8);

				setTimeout(() => {
					chefScale.set(1);
				}, 300);

				// 다음 단계 또는 서빙
				setTimeout(() => {
					if (currentStepNum < totalSteps) {
						battleStore.nextStep();
						progress.set(0);
						startCooking();
					} else {
						phase = 'serve';
						chefScale.set(1.15);
						createParticles('spark', 12);
					}
				}, 1500);
			}, 2500);
		}, 1200);
	}

	function goToBattle() {
		goto('/cook2/battle/versus');
	}
</script>

<div class="cook-screen">
	<!-- 배경 레이어 -->
	<div class="bg-layer">
		<div class="sunburst" style="transform: rotate({bgRotation.current}deg)">
			<img src="/imgs/bg-sunburst.png" alt="" />
		</div>
		<div class="bg-gradient"></div>
	</div>

	<!-- 파티클 -->
	<div class="particles-layer">
		{#each particles as particle (particle.id)}
			{#if particle.type === 'steam'}
				<div
					class="particle steam"
					style="left: {particle.x}%; animation-delay: {particle.delay}s"
				></div>
			{:else}
				<div
					class="particle spark"
					style="left: {particle.x}%; animation-delay: {particle.delay}s"
				></div>
			{/if}
		{/each}
	</div>

	<!-- 메인 컨텐츠 -->
	<div class="content">
		<!-- 헤더: 단계 표시 -->
		<header class="header">
			<div class="step-badge">
				<span class="step-label">STEP</span>
				<span class="step-current">{currentStepNum}</span>
				<span class="step-divider">/</span>
				<span class="step-total">{totalSteps}</span>
			</div>
		</header>

		{#if currentStep}
			<!-- 상단 영역: 조합 공식 + 결과/게이지 -->
			<div class="top-area">
				<!-- 조합 공식 표시 -->
				<div class="recipe-formula" class:show={phase === 'drop' || phase === 'cooking'}>
					{#each currentStep.ingredientIds as ingId, i}
						{@const ing = findIngredientById(ingId)}
						<div class="formula-item" style="animation-delay: {i * 0.15}s">
							{#if ing?.imageUrl}
								<img src={ing.imageUrl} alt={ing.name} />
							{:else}
								<span class="emoji">🥬</span>
							{/if}
						</div>
						{#if i < currentStep.ingredientIds.length - 1}
							<span class="formula-plus">+</span>
						{/if}
					{/each}
					<span class="formula-arrow">→</span>
					<div class="formula-result">
						<span class="result-question">?</span>
					</div>
				</div>

				<!-- 진행 게이지 -->
				{#if phase === 'cooking'}
					<div class="progress-section">
						<div class="progress-bar">
							<div class="progress-fill" style="width: {progress.current}%">
								<div class="progress-shine"></div>
							</div>
							<div class="progress-glow" style="left: {progress.current}%"></div>
						</div>
						<div class="progress-label">조리 중...</div>
					</div>
				{/if}

				<!-- 결과 표시 (캐릭터 위에) -->
				{#if phase === 'result'}
					{@const result = findIngredientById(currentStep.resultId)}
					<div class="result-popup">
						<div class="result-dish">
							{#if result?.imageUrl}
								<img src={result.imageUrl} alt={result.name} />
							{:else}
								<span>🍽️</span>
							{/if}
						</div>
						<div class="result-info">
							<span class="result-name">{currentStep.resultName}</span>
							<span class="result-grade grade-{currentStep.resultGrade}"
								>{currentStep.resultGrade}급</span
							>
						</div>
					</div>
				{/if}

				<!-- 서빙 결과 (캐릭터 위에) -->
				{#if phase === 'serve'}
					{@const finalDish = findIngredientById(battleState.selectedRecipeId ?? 0)}
					<div class="serve-wrapper">
						<div class="serve-result">
							<div class="serve-banner">
								<span class="banner-text">요리 완성!</span>
							</div>
							<div class="serve-dish">
								{#if finalDish?.imageUrl}
									<img src={finalDish.imageUrl} alt={finalDish.name} />
								{:else}
									<span>🍽️</span>
								{/if}
							</div>
							<span class="serve-name">{finalDish?.name ?? '???'}</span>
						</div>
						<button class="battle-button" onclick={goToBattle}>
							<img src="/imgs/ui/button_rectangle_depth_gradient.png" alt="" class="btn-bg" />
							<span class="btn-content">
								<span class="btn-icon">⚔️</span>
								<span class="btn-text">대결 출전!</span>
							</span>
						</button>
					</div>
				{/if}
			</div>

			<!-- 캐릭터 영역 (하단 고정) -->
			<div class="cooking-area">
				<!-- 캐릭터 -->
				<div class="chef-container" style="transform: scale({chefScale.current})">
					<img
						src="/imgs/character/chef_cooking.webp"
						alt="셰프"
						class="chef-img"
						class:cooking={phase === 'cooking'}
					/>
					<!-- 캐릭터 후광 -->
					{#if phase === 'serve'}
						<div class="chef-glow"></div>
					{/if}
				</div>

				<!-- 재료 떨어지는 애니메이션 -->
				{#if phase === 'drop'}
					<div class="dropping-ingredients">
						{#each currentStep.ingredientIds as ingId, i}
							{@const ing = findIngredientById(ingId)}
							<div class="drop-item" style="--delay: {i * 0.2}s; --x: {(i - 0.5) * 60}px">
								{#if ing?.imageUrl}
									<img src={ing.imageUrl} alt={ing.name} />
								{:else}
									<span>🥬</span>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.cook-screen {
		@apply relative;
		@apply h-full min-h-screen;
		@apply overflow-hidden;
	}

	/* 배경 */
	.bg-layer {
		@apply absolute inset-0;
		background: linear-gradient(180deg, #ff9a56 0%, #ff6b35 30%, #d84315 70%, #bf360c 100%);
	}

	.sunburst {
		@apply absolute;
		top: 30%;
		left: 50%;
		width: 200%;
		height: 200%;
		margin-top: -100%;
		margin-left: -100%;
		opacity: 0.2;
		will-change: transform;
	}

	.sunburst img {
		@apply h-full w-full object-cover;
		filter: brightness(1.5);
	}

	.bg-gradient {
		@apply absolute inset-0;
		background: radial-gradient(ellipse at center 70%, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
	}

	/* 파티클 */
	.particles-layer {
		@apply absolute inset-0;
		@apply pointer-events-none;
		z-index: 5;
	}

	.particle {
		@apply absolute;
		bottom: 30%;
	}

	.particle.steam {
		width: 20px;
		height: 20px;
		background: rgba(255, 255, 255, 0.6);
		border-radius: 50%;
		filter: blur(8px);
		animation: steamRise 2s ease-out forwards;
		animation-delay: var(--delay, 0s);
	}

	.particle.spark {
		width: 8px;
		height: 8px;
		background: #ffd700;
		border-radius: 50%;
		box-shadow: 0 0 10px #ffd700;
		animation: sparkBurst 0.8s ease-out forwards;
		animation-delay: var(--delay, 0s);
	}

	@keyframes steamRise {
		0% {
			transform: translateY(0) scale(0.5);
			opacity: 0.8;
		}
		100% {
			transform: translateY(-150px) scale(2);
			opacity: 0;
		}
	}

	@keyframes sparkBurst {
		0% {
			transform: translateY(0) scale(0);
			opacity: 1;
		}
		100% {
			transform: translateY(-100px) translateX(calc((var(--x, 0) - 50%) * 2)) scale(1);
			opacity: 0;
		}
	}

	/* 메인 컨텐츠 */
	.content {
		@apply relative z-10;
		@apply flex flex-col items-center;
		@apply h-full min-h-screen;
		@apply px-4 py-4;
	}

	/* 헤더 */
	.header {
		@apply py-2;
	}

	.step-badge {
		@apply flex items-center gap-1;
		@apply px-5 py-2;
		@apply rounded-full;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
		border: 3px solid rgba(255, 255, 255, 0.3);
	}

	.step-label {
		@apply font-bold;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.7);
		letter-spacing: 2px;
	}

	.step-current {
		@apply font-black;
		font-size: 24px;
		color: #ffd700;
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.5);
	}

	.step-divider {
		color: rgba(255, 255, 255, 0.5);
		font-size: 18px;
	}

	.step-total {
		@apply font-bold;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.8);
	}

	/* 상단 영역 (결과가 캐릭터 위로) */
	.top-area {
		@apply absolute;
		@apply top-16 right-0 left-0;
		@apply flex flex-col items-center justify-start;
		@apply gap-4;
		@apply pt-4;
		z-index: 20;
		pointer-events: none;
	}

	.top-area > * {
		pointer-events: auto;
	}

	/* 조합 공식 */
	.recipe-formula {
		@apply flex items-center justify-center gap-2;
		opacity: 0;
		transform: translateY(-20px);
		transition: all 0.3s ease-out;
	}

	.recipe-formula.show {
		opacity: 1;
		transform: translateY(0);
	}

	.formula-item {
		@apply h-12 w-12;
		@apply rounded-xl;
		@apply flex items-center justify-center;
		background: rgba(255, 255, 255, 0.9);
		border: 3px solid #8b5a20;
		animation: formulaPop 0.3s ease-out backwards;
	}

	.formula-item img {
		@apply h-10 w-10 object-contain;
	}

	.formula-item .emoji {
		font-size: 28px;
	}

	.formula-plus,
	.formula-arrow {
		@apply font-black;
		font-size: 20px;
		color: #fff;
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.5);
	}

	.formula-result {
		@apply h-12 w-12;
		@apply rounded-xl;
		@apply flex items-center justify-center;
		background: linear-gradient(180deg, #ffd700 0%, #ff9800 100%);
		border: 3px solid #8b5a20;
	}

	.result-question {
		@apply font-black;
		font-size: 24px;
		color: #fff;
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
	}

	@keyframes formulaPop {
		0% {
			transform: scale(0) rotate(-10deg);
			opacity: 0;
		}
		100% {
			transform: scale(1) rotate(0);
			opacity: 1;
		}
	}

	/* 요리 영역 (캐릭터) */
	.cooking-area {
		@apply absolute;
		@apply top-1/4;
		@apply right-0 left-0;
		@apply flex flex-col items-center;
		z-index: 10;
	}

	.chef-container {
		@apply relative;
		will-change: transform;
	}

	.chef-img {
		width: clamp(180px, 50vw, 280px);
		height: auto;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
	}

	.chef-img.cooking {
		animation: chefBounce 0.6s ease-in-out infinite;
	}

	@keyframes chefBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}

	.chef-glow {
		@apply absolute inset-0;
		background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
		animation: glowPulse 1s ease-in-out infinite alternate;
	}

	@keyframes glowPulse {
		0% {
			opacity: 0.5;
			transform: scale(1);
		}
		100% {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	/* 재료 떨어지기 */
	.dropping-ingredients {
		@apply absolute;
		top: -80px;
		left: 50%;
		transform: translateX(-50%);
	}

	.drop-item {
		@apply absolute;
		@apply h-16 w-16;
		left: var(--x);
		animation: dropIn 1s ease-in forwards;
		animation-delay: var(--delay);
		opacity: 0;
	}

	.drop-item img,
	.drop-item span {
		@apply h-full w-full object-contain;
		font-size: 40px;
	}

	@keyframes dropIn {
		0% {
			transform: translateY(-50px) rotate(0deg);
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: translateY(150px) rotate(360deg);
			opacity: 0;
		}
	}

	/* 진행 게이지 */
	.progress-section {
		@apply w-full max-w-xs;
		@apply flex flex-col items-center gap-2;
	}

	.progress-bar {
		@apply relative;
		@apply h-6 w-full;
		@apply rounded-full;
		@apply overflow-visible;
		background: linear-gradient(180deg, #1a1a1a 0%, #333 100%);
		border: 3px solid #555;
	}

	.progress-fill {
		@apply absolute top-0 bottom-0 left-0;
		@apply rounded-full;
		background: linear-gradient(180deg, #7dff7d 0%, #4caf50 50%, #2e7d32 100%);
		box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4);
		transition: width 0.1s;
	}

	.progress-shine {
		@apply absolute inset-0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, transparent 50%);
		border-radius: inherit;
	}

	.progress-glow {
		@apply absolute top-1/2;
		width: 16px;
		height: 24px;
		margin-left: -8px;
		margin-top: -12px;
		background: radial-gradient(ellipse, #fff 0%, transparent 70%);
		transition: left 0.1s;
	}

	.progress-label {
		@apply font-bold;
		font-size: 16px;
		color: #fff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
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

	/* 결과 팝업 (캐릭터 위로 겹침, 눈에 띄게) */
	.result-popup {
		@apply flex flex-col items-center gap-2;
		@apply px-6 py-4;
		@apply rounded-2xl;
		background: rgba(0, 0, 0, 0.7);
		border: 3px solid #ffd700;
		box-shadow:
			0 0 30px rgba(255, 215, 0, 0.5),
			0 8px 32px rgba(0, 0, 0, 0.5);
		animation: resultPop 0.5s ease-out;
	}

	.result-dish {
		@apply h-24 w-24;
		filter: drop-shadow(0 4px 12px rgba(255, 215, 0, 0.6));
	}

	.result-dish img,
	.result-dish span {
		@apply h-full w-full object-contain;
		font-size: 64px;
	}

	.result-info {
		@apply flex flex-col items-center;
	}

	.result-name {
		@apply font-black;
		font-size: 22px;
		color: #fff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.result-grade {
		@apply font-bold;
		@apply px-3 py-1;
		@apply rounded-full;
		font-size: 14px;
	}

	.result-grade.grade-D {
		background: #78909c;
		color: #fff;
	}
	.result-grade.grade-C {
		background: #66bb6a;
		color: #fff;
	}
	.result-grade.grade-B {
		background: #42a5f5;
		color: #fff;
	}
	.result-grade.grade-A {
		background: #ab47bc;
		color: #fff;
	}
	.result-grade.grade-S {
		background: linear-gradient(90deg, #ffd700, #ff9800);
		color: #fff;
	}

	@keyframes resultPop {
		0% {
			transform: scale(0) rotate(-10deg);
			opacity: 0;
		}
		60% {
			transform: scale(1.2) rotate(5deg);
		}
		100% {
			transform: scale(1) rotate(0);
			opacity: 1;
		}
	}

	/* 서빙 wrapper */
	.serve-wrapper {
		@apply relative;
		@apply flex flex-col items-center;
		animation: serveIn 0.8s ease-out;
	}

	/* 서빙 결과 (캐릭터 위로 겹침, 눈에 띄게) */
	.serve-result {
		@apply relative;
		@apply flex flex-col items-center gap-2;
		@apply px-8 py-6;
		@apply pt-10;
		@apply rounded-2xl;
		background: rgba(0, 0, 0, 0.7);
		border: 3px solid #ffd700;
		box-shadow:
			0 0 40px rgba(255, 215, 0, 0.6),
			0 8px 32px rgba(0, 0, 0, 0.5);
	}

	.serve-banner {
		@apply absolute;
		@apply left-1/2;
		top: -24px;
		transform: translateX(-50%);
		@apply px-5 py-2;
		@apply rounded-full;
		background: #ffd700;
		border: 3px solid #5c3d15;
		z-index: 10;
	}

	.banner-bg {
		display: none;
	}

	.banner-text {
		@apply font-black;
		@apply whitespace-nowrap;
		font-size: 18px;
		color: #5c3d15;
	}

	.serve-dish {
		@apply h-28 w-28;
		filter: drop-shadow(0 8px 24px rgba(255, 215, 0, 0.5));
		animation: dishFloat 2s ease-in-out infinite;
	}

	.serve-dish img,
	.serve-dish span {
		@apply h-full w-full object-contain;
		font-size: 80px;
	}

	@keyframes dishFloat {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.serve-name {
		@apply font-black;
		font-size: 24px;
		color: #fff;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.battle-button {
		@apply relative;
		@apply mt-6;
		@apply cursor-pointer;
		background: none;
		border: none;
	}

	.battle-button:active {
		transform: scale(0.95);
	}

	.btn-bg {
		width: 200px;
		height: auto;
	}

	.btn-content {
		@apply absolute inset-0;
		@apply flex items-center justify-center gap-2;
	}

	.btn-icon {
		font-size: 24px;
	}

	.btn-text {
		@apply font-black;
		font-size: 18px;
		color: #5c3d15;
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

	.battle-button:active {
		transform: scale(0.95);
	}

	@keyframes serveIn {
		0% {
			transform: scale(0) translateY(50px);
			opacity: 0;
		}
		60% {
			transform: scale(1.1) translateY(-10px);
		}
		100% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}
</style>
