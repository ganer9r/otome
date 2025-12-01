<script lang="ts">
	import type { Ingredient } from '../lib/types';
	import { GRADE_COLORS, GRADE_NAMES } from '../lib/types';

	interface Props {
		/** 결과 재료 */
		ingredient: Ingredient;
		/** 카드 뒤집힘 상태 */
		flipped?: boolean;
	}

	let { ingredient, flipped = false }: Props = $props();

	// 등급별 별 개수
	const starsCount = $derived(() => {
		const gradeIndex = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'R'].indexOf(ingredient.grade);
		if (gradeIndex >= 6) return 3; // A, R
		if (gradeIndex >= 4) return 2; // C, B
		return 1; // G, F, E, D
	});

	// 등급별 카드 테마
	const cardTheme = $derived(() => {
		const gradeIndex = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'R'].indexOf(ingredient.grade);
		if (gradeIndex >= 6) {
			// A, R 등급 - 골드/레전더리
			return {
				border: 'border-yellow-400',
				bg: 'bg-gradient-to-br from-yellow-900/90 via-amber-800/90 to-yellow-900/90',
				glow: 'shadow-[0_0_40px_rgba(251,191,36,0.6)]',
				shimmer: 'from-yellow-200/30 via-white/50 to-yellow-200/30'
			};
		}
		if (gradeIndex >= 4) {
			// C, B 등급 - 퍼플/에픽
			return {
				border: 'border-purple-400',
				bg: 'bg-gradient-to-br from-purple-900/90 via-violet-800/90 to-purple-900/90',
				glow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
				shimmer: 'from-purple-200/30 via-white/40 to-purple-200/30'
			};
		}
		// G, F, E, D 등급 - 블루/레어
		return {
			border: 'border-blue-400',
			bg: 'bg-gradient-to-br from-slate-800/90 via-gray-700/90 to-slate-800/90',
			glow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
			shimmer: 'from-blue-200/20 via-white/30 to-blue-200/20'
		};
	});
</script>

<div class="card-container" class:flipped>
	<div class="card-inner">
		<!-- 카드 뒷면 -->
		<div class="card-back">
			<div class="card-back-pattern">
				<div class="pattern-circle"></div>
				<div class="pattern-circle pattern-circle-2"></div>
				<div class="pattern-circle pattern-circle-3"></div>
				<span class="card-back-text">?</span>
			</div>
		</div>

		<!-- 카드 앞면 -->
		<div class="card-front {cardTheme().bg} {cardTheme().border} {cardTheme().glow}">
			<!-- 홀로그램 효과 -->
			<div class="hologram-effect bg-gradient-to-br {cardTheme().shimmer}"></div>

			<!-- 별 등급 -->
			<div class="stars-row">
				{#each Array(starsCount()) as _, i}
					<span class="star" style="animation-delay: {i * 0.1}s">⭐</span>
				{/each}
			</div>

			<!-- 메인 이미지 -->
			<div class="image-container">
				<div class="image-glow"></div>
				<img src={ingredient.imageUrl} alt={ingredient.name} class="ingredient-image" />
			</div>

			<!-- 구분선 -->
			<div class="divider">
				<div class="divider-line"></div>
				<div class="divider-diamond">◆</div>
				<div class="divider-line"></div>
			</div>

			<!-- 이름 -->
			<h3 class="ingredient-name">{ingredient.name}</h3>

			<!-- 등급 뱃지 -->
			<div class="grade-badge" style="background-color: {GRADE_COLORS[ingredient.grade]}">
				{ingredient.grade}등급 · {GRADE_NAMES[ingredient.grade]}
			</div>

			<!-- 재료 해금 표시 -->
			{#if ingredient.isIngredient}
				<div class="unlock-badge">
					<span class="unlock-icon">🔓</span>
					<span class="unlock-text">새로운 재료 해금!</span>
				</div>
			{:else}
				<div class="dish-badge">
					<span class="dish-icon">🍽️</span>
					<span class="dish-text">요리 완성!</span>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	/* 카드 컨테이너 - vh 기준 (화면 높이의 55%) */
	.card-container {
		--card-height: min(55vh, 420px);
		--card-width: calc(var(--card-height) * 0.68);
		--card-radius: calc(var(--card-height) * 0.04);
		--card-padding: calc(var(--card-height) * 0.04);
		--card-border: calc(var(--card-height) * 0.008);

		perspective: 1000px;
		width: var(--card-width);
		height: var(--card-height);
	}

	.card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.flipped .card-inner {
		transform: rotateY(180deg);
	}

	.card-back,
	.card-front {
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		border-radius: var(--card-radius);
		overflow: hidden;
	}

	/* 카드 뒷면 */
	.card-back {
		@apply bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900;
		@apply flex items-center justify-center;
		border: var(--card-border) solid rgb(129 140 248);
		box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
	}

	.card-back-pattern {
		@apply relative flex items-center justify-center;
		@apply h-full w-full;
	}

	.pattern-circle {
		@apply absolute rounded-full;
		border: 2px solid rgba(129, 140, 248, 0.3);
		width: 80%;
		height: 80%;
		animation: patternRotate 10s linear infinite;
	}

	.pattern-circle-2 {
		width: 60%;
		height: 60%;
		animation-direction: reverse;
		animation-duration: 8s;
	}

	.pattern-circle-3 {
		width: 40%;
		height: 40%;
		animation-duration: 6s;
	}

	@keyframes patternRotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.card-back-text {
		@apply absolute;
		@apply text-indigo-300/50;
		font-size: calc(var(--card-height) * 0.25);
		font-weight: bold;
	}

	/* 카드 앞면 */
	.card-front {
		transform: rotateY(180deg);
		@apply flex flex-col items-center justify-between;
		border-width: var(--card-border);
		padding: var(--card-padding);
	}

	/* 홀로그램 효과 */
	.hologram-effect {
		@apply absolute inset-0;
		@apply pointer-events-none;
		animation: hologramShift 3s ease-in-out infinite;
		mix-blend-mode: overlay;
	}

	@keyframes hologramShift {
		0%,
		100% {
			opacity: 0.3;
			transform: translateX(-100%) rotate(25deg);
		}
		50% {
			opacity: 0.6;
			transform: translateX(100%) rotate(25deg);
		}
	}

	/* 별 */
	.stars-row {
		@apply flex;
		gap: calc(var(--card-height) * 0.015);
	}

	.star {
		font-size: calc(var(--card-height) * 0.065);
		animation: starShine 1.5s ease-in-out infinite;
		filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.8));
	}

	@keyframes starShine {
		0%,
		100% {
			transform: scale(1);
			filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.8));
		}
		50% {
			transform: scale(1.15);
			filter: drop-shadow(0 0 16px rgba(251, 191, 36, 1));
		}
	}

	/* 이미지 컨테이너 */
	.image-container {
		@apply relative;
		@apply flex items-center justify-center;
	}

	.image-glow {
		@apply absolute;
		@apply rounded-full;
		width: 140%;
		height: 140%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
		animation: imageGlow 2s ease-in-out infinite;
	}

	@keyframes imageGlow {
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

	.ingredient-image {
		@apply relative z-10;
		width: calc(var(--card-height) * 0.32);
		height: calc(var(--card-height) * 0.32);
		@apply object-contain;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
	}

	/* 구분선 */
	.divider {
		@apply flex items-center;
		@apply w-full;
		gap: calc(var(--card-height) * 0.02);
		padding: 0 calc(var(--card-height) * 0.04);
	}

	.divider-line {
		@apply flex-1;
		height: 2px;
		@apply bg-gradient-to-r from-transparent via-white/40 to-transparent;
	}

	.divider-diamond {
		@apply text-white/60;
		font-size: calc(var(--card-height) * 0.025);
	}

	/* 이름 */
	.ingredient-name {
		@apply font-bold text-white;
		@apply text-center;
		font-size: calc(var(--card-height) * 0.055);
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
	}

	/* 등급 뱃지 */
	.grade-badge {
		@apply rounded-full;
		@apply font-bold text-white;
		padding: calc(var(--card-height) * 0.015) calc(var(--card-height) * 0.04);
		font-size: calc(var(--card-height) * 0.035);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	/* 해금 뱃지 */
	.unlock-badge {
		@apply flex items-center;
		@apply bg-gradient-to-r from-emerald-500 to-green-400;
		@apply rounded-xl;
		@apply shadow-lg;
		gap: calc(var(--card-height) * 0.015);
		padding: calc(var(--card-height) * 0.02) calc(var(--card-height) * 0.04);
		animation: unlockPulse 1.5s ease-in-out infinite;
	}

	@keyframes unlockPulse {
		0%,
		100% {
			box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
		}
		50% {
			box-shadow: 0 0 25px rgba(16, 185, 129, 0.8);
		}
	}

	.unlock-icon {
		font-size: calc(var(--card-height) * 0.045);
	}

	.unlock-text {
		@apply font-bold text-white;
		font-size: calc(var(--card-height) * 0.032);
	}

	/* 요리 완성 뱃지 */
	.dish-badge {
		@apply flex items-center;
		@apply bg-gradient-to-r from-orange-500 to-amber-400;
		@apply rounded-xl;
		@apply shadow-lg;
		gap: calc(var(--card-height) * 0.015);
		padding: calc(var(--card-height) * 0.02) calc(var(--card-height) * 0.04);
	}

	.dish-icon {
		font-size: calc(var(--card-height) * 0.045);
	}

	.dish-text {
		@apply font-bold text-white;
		font-size: calc(var(--card-height) * 0.032);
	}
</style>
