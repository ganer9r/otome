<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { battleStore } from '../lib/battle-store';
	import { findIngredientById } from '../../lib/data/ingredients';

	// 대결 상태
	let battleState = $derived($battleStore);

	// 현재 단계
	let currentStep = $derived(battleState.cookingSteps[battleState.currentStepIndex]);
	let totalSteps = $derived(battleState.cookingSteps.length);
	let currentStepNum = $derived(battleState.currentStepIndex + 1);

	// 조리 애니메이션 상태
	let phase = $state<'drop' | 'cooking' | 'explode' | 'result' | 'serve'>('drop');

	// 냄비 이미지
	const potImage = '/imgs/cw_pot.webp';

	onMount(() => {
		// 대결 중이 아니거나 레시피 선택 안됐으면 돌아가기
		if (!battleState.isInBattle || !battleState.selectedRecipeId) {
			goto('/cook2/battle');
			return;
		}

		// 조리 시작
		startCooking();
	});

	function startCooking() {
		phase = 'drop';

		// 1초 후 조리 시작
		setTimeout(() => {
			phase = 'cooking';

			// 2초 후 폭발
			setTimeout(() => {
				phase = 'explode';

				// 0.5초 후 결과 표시
				setTimeout(() => {
					phase = 'result';

					// 1.5초 후 다음 단계 또는 서빙
					setTimeout(() => {
						if (currentStepNum < totalSteps) {
							battleStore.nextStep();
							startCooking();
						} else {
							// 마지막 단계 → 서빙 화면 (버튼 클릭 대기)
							phase = 'serve';
						}
					}, 1500);
				}, 500);
			}, 2000);
		}, 1000);
	}

	function goToBattle() {
		// 대결 화면으로 이동
		goto('/cook2/battle/versus');
	}
</script>

<div class="cook-container">
	<!-- 단계 표시 -->
	<header class="header">
		<div class="step-indicator">
			<span class="step-current">{currentStepNum}</span>
			<span class="step-divider">/</span>
			<span class="step-total">{totalSteps}</span>
		</div>
	</header>

	{#if currentStep}
		<div class="cooking-area">
			<!-- 재료 떨어지기 -->
			{#if phase === 'drop'}
				<div class="drop-area">
					{#each currentStep.ingredientIds as ingId, i}
						{@const ing = findIngredientById(ingId)}
						<div class="dropping-ingredient" style="--delay: {i * 0.3}s">
							{#if ing?.imageUrl}
								<img src={ing.imageUrl} alt={ing.name} />
							{:else}
								<span>🥬</span>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			<!-- 냄비 -->
			{#if phase !== 'serve'}
				<div class="pot-area">
					<img
						src={potImage}
						alt="냄비"
						class="pot-image"
						class:shaking={phase === 'cooking'}
						class:exploding={phase === 'explode'}
					/>

					<!-- 조리 중 이펙트 -->
					{#if phase === 'cooking'}
						<div class="steam-effects">
							<span class="steam" style="--delay: 0s">💨</span>
							<span class="steam" style="--delay: 0.3s">💨</span>
							<span class="steam" style="--delay: 0.6s">💨</span>
						</div>
					{/if}

					<!-- 폭발 이펙트 -->
					{#if phase === 'explode'}
						<div class="explode-effects">
							<span class="spark" style="--x: -60px; --y: -80px">✨</span>
							<span class="spark" style="--x: 60px; --y: -70px">✨</span>
							<span class="spark" style="--x: -40px; --y: -100px">⭐</span>
							<span class="spark" style="--x: 40px; --y: -90px">⭐</span>
							<span class="spark" style="--x: 0px; --y: -120px">💥</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- 결과 요리 -->
			{#if phase === 'result'}
				{@const result = findIngredientById(currentStep.resultId)}
				<div class="result-area">
					<div class="result-dish">
						{#if result?.imageUrl}
							<img src={result.imageUrl} alt={result.name} />
						{:else}
							<span>🍽️</span>
						{/if}
					</div>
					<span class="result-name">{currentStep.resultName}</span>
					<span class="result-grade">{currentStep.resultGrade}급</span>
				</div>
			{/if}

			<!-- 서빙 (마지막 단계 후) -->
			{#if phase === 'serve'}
				{@const finalDish = findIngredientById(battleState.selectedRecipeId ?? 0)}
				<div class="serve-area">
					<div class="serve-text">대결 요리 완성!</div>
					<div class="serve-dish">
						{#if finalDish?.imageUrl}
							<img src={finalDish.imageUrl} alt={finalDish.name} />
						{:else}
							<span>🍽️</span>
						{/if}
					</div>
					<span class="serve-name">{finalDish?.name ?? '???'}</span>
					<button class="serve-button" onclick={goToBattle}>
						<span class="serve-icon">⚔️</span>
						<span class="serve-label">대결 출전!</span>
					</button>
				</div>
			{/if}

			<!-- 조리 중 텍스트 -->
			{#if phase === 'cooking'}
				<div class="cooking-text">조리 중...</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.cook-container {
		@apply flex flex-col;
		@apply h-full min-h-screen;
		background: linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #0f3460 100%);
		overflow: hidden;
	}

	.header {
		@apply flex items-center justify-center;
		@apply px-4 py-4;
	}

	.step-indicator {
		@apply px-4 py-2;
		@apply rounded-full;
		@apply font-bold;
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	.step-current {
		color: #ffd700;
		font-size: 20px;
	}

	.step-divider {
		@apply mx-1;
		color: #6b7280;
	}

	.step-total {
		color: #9ca3af;
	}

	/* ===== 조리 영역 ===== */
	.cooking-area {
		@apply flex-1;
		@apply flex flex-col items-center justify-center;
		@apply relative;
	}

	/* 재료 떨어지기 */
	.drop-area {
		@apply absolute top-0;
		@apply flex gap-8;
	}

	.dropping-ingredient {
		@apply h-20 w-20;
		animation: dropToPot 1s ease-in forwards;
		animation-delay: var(--delay);
		opacity: 0;
	}

	.dropping-ingredient img,
	.dropping-ingredient span {
		@apply h-full w-full object-contain;
		font-size: 48px;
	}

	@keyframes dropToPot {
		0% {
			transform: translateY(0) rotate(0deg);
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: translateY(300px) rotate(360deg);
			opacity: 0;
		}
	}

	/* 냄비 */
	.pot-area {
		@apply relative;
		@apply flex items-center justify-center;
	}

	.pot-image {
		width: 160px;
		height: 160px;
		object-fit: contain;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
		transition: transform 0.1s;
	}

	.pot-image.shaking {
		animation: shake 0.2s ease-in-out infinite;
	}

	.pot-image.exploding {
		animation: explodePot 0.5s ease-out;
	}

	@keyframes shake {
		0%,
		100% {
			transform: rotate(-3deg) scale(1);
		}
		50% {
			transform: rotate(3deg) scale(1.02);
		}
	}

	@keyframes explodePot {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.3);
		}
		100% {
			transform: scale(1);
		}
	}

	/* 증기 */
	.steam-effects {
		@apply absolute;
		top: -60px;
	}

	.steam {
		@apply absolute;
		font-size: 32px;
		animation: steamRise 1s ease-out infinite;
		animation-delay: var(--delay);
	}

	@keyframes steamRise {
		0% {
			transform: translateY(0) scale(0.5);
			opacity: 0.8;
		}
		100% {
			transform: translateY(-80px) scale(1.2);
			opacity: 0;
		}
	}

	/* 폭발 이펙트 */
	.explode-effects {
		@apply absolute;
		top: 0;
	}

	.spark {
		@apply absolute;
		font-size: 32px;
		animation: sparkExplode 0.5s ease-out forwards;
		transform: translate(var(--x), var(--y));
	}

	@keyframes sparkExplode {
		0% {
			transform: translate(0, 0) scale(0);
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: translate(var(--x), var(--y)) scale(1.5);
			opacity: 0;
		}
	}

	/* 결과 */
	.result-area {
		@apply absolute;
		@apply flex flex-col items-center gap-2;
		top: 20%;
		animation: resultPop 0.5s ease-out;
	}

	.result-dish {
		@apply h-32 w-32;
		filter: drop-shadow(0 4px 12px rgba(255, 215, 0, 0.5));
	}

	.result-dish img,
	.result-dish span {
		@apply h-full w-full object-contain;
		font-size: 80px;
	}

	.result-name {
		@apply font-black text-white;
		font-size: 24px;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.result-grade {
		@apply font-bold;
		color: #ffd700;
		font-size: 18px;
	}

	@keyframes resultPop {
		0% {
			transform: scale(0) translateY(50px);
			opacity: 0;
		}
		60% {
			transform: scale(1.2) translateY(0);
		}
		100% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}

	/* 조리 중 텍스트 */
	.cooking-text {
		@apply absolute bottom-32;
		@apply font-bold;
		font-size: 24px;
		color: #ff7043;
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* 서빙 (대결 출전) */
	.serve-area {
		@apply flex flex-col items-center gap-4;
		animation: serveIn 0.8s ease-out;
	}

	@keyframes serveIn {
		0% {
			transform: scale(0.5) translateY(100px);
			opacity: 0;
		}
		60% {
			transform: scale(1.1) translateY(-20px);
		}
		100% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}

	.serve-text {
		@apply font-black;
		font-size: 28px;
		color: #ffd700;
		text-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
	}

	.serve-dish {
		@apply h-40 w-40;
		filter: drop-shadow(0 8px 24px rgba(255, 215, 0, 0.4));
		animation: dishGlow 1.5s ease-in-out infinite;
	}

	@keyframes dishGlow {
		0%,
		100% {
			filter: drop-shadow(0 8px 24px rgba(255, 215, 0, 0.4));
		}
		50% {
			filter: drop-shadow(0 8px 32px rgba(255, 215, 0, 0.7));
		}
	}

	.serve-dish img,
	.serve-dish span {
		@apply h-full w-full object-contain;
		font-size: 100px;
	}

	.serve-name {
		@apply font-black text-white;
		font-size: 24px;
	}

	.serve-button {
		@apply flex items-center gap-2;
		@apply px-8 py-4;
		@apply rounded-full;
		@apply mt-4;
		@apply cursor-pointer;
		background: linear-gradient(180deg, #ff7043 0%, #d84315 100%);
		border: none;
		border-bottom: 4px solid #bf360c;
		box-shadow: 0 4px 0 #8d2608;
		animation: actionPulse 1s ease-in-out infinite;
		transition: transform 0.1s;
	}

	.serve-button:active {
		transform: translateY(2px);
		border-bottom-width: 2px;
		box-shadow: 0 2px 0 #8d2608;
	}

	@keyframes actionPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	@keyframes actionPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	.serve-icon {
		font-size: 24px;
	}

	.serve-label {
		@apply font-black text-white;
		font-size: 18px;
	}
</style>
