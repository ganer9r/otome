<script lang="ts">
	import { onMount } from 'svelte';
	import type { ModalProps } from '$lib/stores/modal';
	import type { Dish } from '../lib/types';
	import { findIngredientById } from '../lib/data/ingredients';

	export interface DishResultModalProps extends ModalProps {
		/** 요리 결과 */
		dish: Dish;
		/** 만들어진 재료 ID (success인 경우) */
		resultIngredientId?: string;
	}

	let { id, close, dish, resultIngredientId }: DishResultModalProps = $props();

	let resultIngredient = $derived(
		resultIngredientId ? findIngredientById(resultIngredientId) : null
	);

	// 연출 단계
	let stage = $state<'heartbeat' | 'halo' | 'result'>('heartbeat');

	// 등급별 후광 색상
	let haloColor = $derived(() => {
		switch (dish.grade) {
			case 'success':
				return 'halo-success';
			case 'fail':
				return 'halo-fail';
			case 'disaster':
				return 'halo-disaster';
			default:
				return 'halo-fail';
		}
	});

	// 등급별 대사 풀 (랜덤 선택)
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

	// 랜덤 대사 선택
	let selectedComment = $state('');

	let reaction = $derived(() => ({
		emoji: '👨‍🍳',
		comment: selectedComment
	}));

	// 연출 시퀀스
	onMount(() => {
		// 0. 랜덤 대사 선택
		const commentList = comments[dish.grade] || ['...'];
		selectedComment = commentList[Math.floor(Math.random() * commentList.length)];

		// 1. 두근두근 (1초)
		setTimeout(() => {
			stage = 'halo';
		}, 1000);

		// 2. 후광 (0.8초)
		setTimeout(() => {
			stage = 'result';
		}, 1800);
	});

	// 확인 핸들러
	function handleReset() {
		close(); // 모달 닫기
	}
</script>

<div class="dish-result-modal">
	{#if stage === 'heartbeat'}
		<!-- 1단계: 두근두근 -->
		<div class="heartbeat-stage">
			<div class="heartbeat">💓</div>
			<div class="question-mark">?</div>
		</div>
	{:else if stage === 'halo'}
		<!-- 2단계: 후광 등장 -->
		<div class="halo-stage">
			<div class="halo {haloColor()}"></div>
			<div class="halo-ring {haloColor()}"></div>
		</div>
	{:else}
		<!-- 3단계: 결과 표시 -->
		<div class="result-card">
			<!-- 후광 배경 -->
			<div class="halo-background {haloColor()}"></div>

			<!-- 백종원 캐릭터 + 말풍선 -->
			<div class="chef-section">
				<div class="speech-bubble">
					{reaction().comment}
				</div>
				<div class="chef-character">{reaction().emoji}</div>
			</div>

			<!-- 요리 아이콘 (후광 효과) -->
			{#if dish.icon}
				<div class="dish-icon-container">
					<div class="dish-glow {haloColor()}"></div>
					<div class="dish-icon">{dish.icon}</div>
				</div>
			{/if}

			<!-- 요리 이름 -->
			<h2 class="dish-name">{dish.name}</h2>

			<!-- 결과 재료 (success인 경우) -->
			{#if dish.grade === 'success' && resultIngredient}
				<div class="result-ingredient">
					<p class="text-sm text-gray-600 mb-2">새로운 재료를 얻었습니다!</p>
					<div class="ingredient-badge">
						<span class="ingredient-name">{resultIngredient.name}</span>
						<span class="ingredient-grade">({resultIngredient.grade})</span>
					</div>
				</div>
			{/if}

			<!-- 파티클 효과 -->
			{#if dish.grade === 'success'}
				<div class="particles-success">
					{#each Array(20) as _, i}
						<div class="particle star" style="--delay: {i * 0.1}s; --x: {Math.random() * 100}%; --y: {Math.random() * 100}%">⭐</div>
					{/each}
				</div>
			{:else if dish.grade === 'disaster'}
				<div class="particles-disaster">
					{#each Array(30) as _, i}
						<div class="particle explosion" style="--delay: {i * 0.05}s; --angle: {i * 12}deg">💥</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- 확인 버튼 -->
		<button type="button" class="btn btn-primary btn-lg btn-block confirm-button" onclick={handleReset}>
			<span>확인</span>
		</button>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.dish-result-modal {
		@apply flex flex-col items-center w-full;
		@apply relative;
		height: 65vh;
	}

	.result-card {
		@apply flex flex-col items-center justify-center gap-6;
		@apply w-full p-8 rounded-2xl;
		@apply bg-gradient-to-br from-primary/5 to-secondary/5;
		@apply border-4 border-primary/20;
		@apply shadow-2xl;
		@apply flex-1;
		@apply mb-[76px];
		animation: bounceIn 0.5s ease-out;
	}

	@keyframes bounceIn {
		0% {
			transform: scale(0.3);
			opacity: 0;
		}
		50% {
			transform: scale(1.05);
		}
		70% {
			transform: scale(0.9);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* 백종원 캐릭터 + 말풍선 */
	.chef-section {
		@apply flex flex-col items-center gap-3 mb-4;
		animation: chefEnter 0.6s ease-out;
	}

	@keyframes chefEnter {
		from {
			opacity: 0;
			transform: translateY(-20px);
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
		@apply shadow-lg;
		@apply border-3 border-gray-800;
		@apply font-bold text-center;
		font-size: var(--font-md);
		@apply text-gray-800;
		line-height: 1.5;
		max-width: 80%;
		animation: bubblePop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s backwards;
		white-space: pre-line;
	}

	/* 말풍선 꼬리 */
	.speech-bubble::after {
		content: '';
		@apply absolute;
		bottom: -12px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 15px solid transparent;
		border-right: 15px solid transparent;
		border-top: 15px solid #1f2937;
	}

	.speech-bubble::before {
		content: '';
		@apply absolute;
		bottom: -9px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 13px solid transparent;
		border-right: 13px solid transparent;
		border-top: 13px solid white;
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
		font-size: clamp(56px, 14vw, 88px);
		line-height: 1;
		animation: chefBounce 0.6s ease-out 0.4s backwards;
	}

	@keyframes chefBounce {
		0% {
			transform: scale(0) rotate(-180deg);
		}
		60% {
			transform: scale(1.15) rotate(10deg);
		}
		80% {
			transform: scale(0.95) rotate(-5deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
		}
	}

	/* 요리 아이콘 + 후광 */
	.dish-icon-container {
		@apply relative;
		@apply flex items-center justify-center;
		@apply my-4;
	}

	.dish-glow {
		@apply absolute;
		width: clamp(120px, 30vw, 200px);
		height: clamp(120px, 30vw, 200px);
		@apply rounded-full;
		@apply blur-3xl;
		opacity: 0.8;
		animation: dishGlowPulse 2s ease-in-out infinite;
	}

	@keyframes dishGlowPulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.6;
		}
		50% {
			transform: scale(1.2);
			opacity: 0.9;
		}
	}

	.dish-icon {
		@apply relative z-10;
		@apply text-center;
		font-size: clamp(64px, 16vw, 120px);
		line-height: 1;
		animation: dishIconPop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
	}

	@keyframes dishIconPop {
		0% {
			transform: scale(0) rotate(-180deg);
			opacity: 0;
		}
		60% {
			transform: scale(1.15) rotate(10deg);
		}
		80% {
			transform: scale(0.95) rotate(-5deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	.dish-name {
		@apply font-bold text-gray-800;
		@apply text-center;
		font-size: var(--font-xxl);
	}

	.result-ingredient {
		@apply flex flex-col items-center mt-2;
		animation: slideUp 0.7s ease-out;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.ingredient-badge {
		@apply px-6 py-3 bg-primary/20 rounded-xl;
		@apply border-2 border-primary;
		@apply shadow-md;
	}

	.ingredient-name {
		@apply font-bold text-primary;
		font-size: var(--font-lg);
	}

	.ingredient-grade {
		@apply text-gray-600;
		font-size: var(--font-sm);
		margin-left: var(--spacing-xs);
	}

	.probability-text {
		@apply text-gray-500;
		font-size: var(--font-xs);
		margin-top: var(--spacing-xs);
	}

	.confirm-button {
		@apply flex items-center justify-center;
		@apply shadow-xl;
		@apply font-bold;
		@apply absolute;
		@apply w-full;
		height: 60px;
		bottom: 0;
		font-size: var(--font-md);
		gap: var(--spacing-sm);
		animation: slideUp 0.9s ease-out;
	}

	/* ===== 1단계: 두근두근 ===== */
	.heartbeat-stage {
		@apply flex flex-col items-center justify-center gap-4;
		@apply w-full h-full;
	}

	.heartbeat {
		font-size: clamp(80px, 20vw, 140px);
		animation: heartbeatPulse 0.8s ease-in-out infinite;
	}

	@keyframes heartbeatPulse {
		0%,
		100% {
			transform: scale(1);
		}
		25% {
			transform: scale(1.2);
		}
		50% {
			transform: scale(1);
		}
		75% {
			transform: scale(1.15);
		}
	}

	.question-mark {
		@apply text-gray-400;
		font-size: clamp(48px, 12vw, 80px);
		animation: questionFade 1.5s ease-in-out infinite;
	}

	@keyframes questionFade {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 1;
		}
	}

	/* ===== 2단계: 후광 ===== */
	.halo-stage {
		@apply relative flex items-center justify-center;
		@apply w-full h-full;
	}

	.halo {
		@apply absolute;
		width: clamp(160px, 40vw, 280px);
		height: clamp(160px, 40vw, 280px);
		@apply rounded-full;
		@apply blur-2xl;
		animation: haloRotate 3s linear infinite, haloGlow 1.5s ease-in-out infinite;
	}

	.halo-ring {
		@apply absolute;
		width: clamp(200px, 50vw, 350px);
		height: clamp(200px, 50vw, 350px);
		@apply rounded-full;
		@apply border-8;
		animation: ringPulse 1.2s ease-in-out infinite;
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

	@keyframes ringPulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.4;
		}
		50% {
			transform: scale(1.15);
			opacity: 0.8;
		}
	}

	/* 등급별 후광 색상 */
	.halo-success {
		@apply bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400;
		@apply border-yellow-400;
		box-shadow: 0 0 60px rgba(251, 191, 36, 0.8), 0 0 100px rgba(251, 191, 36, 0.5);
	}

	.halo-fail {
		@apply bg-gradient-to-br from-gray-300 via-blue-200 to-gray-400;
		@apply border-gray-400;
		box-shadow: 0 0 40px rgba(156, 163, 175, 0.6);
	}

	.halo-disaster {
		@apply bg-gradient-to-br from-red-500 via-orange-600 to-red-700;
		@apply border-red-600;
		box-shadow: 0 0 60px rgba(239, 68, 68, 0.9), 0 0 100px rgba(239, 68, 68, 0.6);
	}

	/* 결과 화면 배경 후광 */
	.halo-background {
		@apply absolute inset-0;
		@apply rounded-2xl;
		@apply opacity-20;
		@apply pointer-events-none;
		animation: backgroundGlow 2s ease-in-out infinite;
	}

	@keyframes backgroundGlow {
		0%,
		100% {
			opacity: 0.15;
		}
		50% {
			opacity: 0.3;
		}
	}

	/* ===== 파티클 효과 ===== */
	.particles-success,
	.particles-disaster {
		@apply absolute inset-0;
		@apply pointer-events-none;
		@apply overflow-hidden;
	}

	.particle {
		@apply absolute;
		font-size: clamp(16px, 4vw, 28px);
		animation-fill-mode: forwards;
	}

	/* 성공 파티클: 별 */
	.particle.star {
		animation: starBurst 1.5s ease-out var(--delay);
	}

	@keyframes starBurst {
		0% {
			transform: translate(-50%, -50%) scale(0) rotate(0deg);
			opacity: 1;
			left: 50%;
			top: 50%;
		}
		100% {
			transform: translate(0, 0) scale(1) rotate(180deg);
			opacity: 0;
			left: var(--x);
			top: var(--y);
		}
	}

	/* 재앙 파티클: 폭발 */
	.particle.explosion {
		animation: explosionScatter 1.2s ease-out var(--delay);
	}

	@keyframes explosionScatter {
		0% {
			transform: translate(-50%, -50%) scale(0) rotate(0deg);
			opacity: 1;
			left: 50%;
			top: 50%;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%) translateX(calc(cos(var(--angle)) * 200px))
				translateY(calc(sin(var(--angle)) * 200px)) scale(1.5) rotate(720deg);
			opacity: 0;
			left: 50%;
			top: 50%;
		}
	}

	/* 재앙 화면 흔들림 */
	.result-card:has(.particles-disaster) {
		animation: screenShake 0.5s ease-in-out 0.2s;
	}

	@keyframes screenShake {
		0%,
		100% {
			transform: translateX(0);
		}
		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translateX(-8px);
		}
		20%,
		40%,
		60%,
		80% {
			transform: translateX(8px);
		}
	}
</style>
