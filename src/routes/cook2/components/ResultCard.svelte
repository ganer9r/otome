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
</script>

<div class="card-container" class:flipped>
	<div class="card-inner">
		<!-- 카드 뒷면 (남색) -->
		<div class="card-back">
			<div class="card-back-pattern">
				<div class="pattern-circle"></div>
				<div class="pattern-circle pattern-circle-2"></div>
				<div class="pattern-circle pattern-circle-3"></div>
				<span class="card-back-text">?</span>
			</div>
		</div>

		<!-- 카드 앞면 -->
		<div class="card-front" class:golden={ingredient.isIngredient}>
			<!-- 좌상단 재료 뱃지 -->
			{#if ingredient.isIngredient}
				<div class="ingredient-type-badge">
					<span>재료</span>
				</div>
			{/if}

			<!-- 별 등급 -->
			<div class="stars-row">
				{#each Array(starsCount()) as _}
					<span class="star">⭐</span>
				{/each}
			</div>

			<!-- 메인 이미지 -->
			<div class="image-container">
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

	/* 카드 컨테이너 - vh 기준 (화면 높이의 45%) */
	.card-container {
		--card-height: min(45vh, 340px);
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

	/* 카드 뒷면 (오렌지/앰버) */
	.card-back {
		@apply flex items-center justify-center;
		background: linear-gradient(135deg, #c2410c 0%, #9a3412 50%, #c2410c 100%);
		border: var(--card-border) solid #ea580c;
		box-shadow: 0 8px 24px rgba(194, 65, 12, 0.3);
	}

	.card-back-pattern {
		@apply relative flex items-center justify-center;
		@apply h-full w-full;
	}

	.pattern-circle {
		@apply absolute rounded-full;
		border: 2px solid rgba(251, 191, 36, 0.4);
		width: 80%;
		height: 80%;
	}

	.pattern-circle-2 {
		width: 60%;
		height: 60%;
	}

	.pattern-circle-3 {
		width: 40%;
		height: 40%;
	}

	.card-back-text {
		@apply absolute;
		color: rgba(251, 191, 36, 0.5);
		font-size: calc(var(--card-height) * 0.25);
		font-weight: bold;
	}

	/* 카드 앞면 (기본: 흰색) */
	.card-front {
		transform: rotateY(180deg);
		@apply flex flex-col items-center justify-between;
		@apply bg-white;
		border: var(--card-border) solid #e5e7eb;
		padding: var(--card-padding);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	}

	/* 카드 앞면 (재료: 골카 - 빨간색) */
	.card-front.golden {
		background: linear-gradient(135deg, #fef2f2 0%, #fecaca 50%, #fca5a5 100%);
		border: var(--card-border) solid #dc2626;
		box-shadow: 0 8px 32px rgba(220, 38, 38, 0.25);
	}

	/* 좌상단 재료 뱃지 */
	.ingredient-type-badge {
		@apply absolute;
		top: calc(var(--card-height) * 0.03);
		left: calc(var(--card-height) * 0.03);
		@apply bg-gradient-to-r from-red-600 to-red-500;
		@apply font-bold;
		@apply rounded-lg;
		padding: calc(var(--card-height) * 0.015) calc(var(--card-height) * 0.035);
		font-size: calc(var(--card-height) * 0.038);
		box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
		overflow: hidden;
	}

	.ingredient-type-badge span {
		background: linear-gradient(90deg, #fff 0%, #fff 40%, #fef08a 50%, #fff 60%, #fff 100%);
		background-size: 200% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: textShine 2s linear infinite;
	}

	@keyframes textShine {
		0% {
			background-position: 100% 0;
		}
		100% {
			background-position: -100% 0;
		}
	}

	/* 뱃지 샤이닝 오버레이 */
	.ingredient-type-badge::after {
		content: '';
		@apply absolute inset-0;
		background: linear-gradient(
			120deg,
			transparent 0%,
			transparent 30%,
			rgba(255, 255, 255, 0.4) 50%,
			transparent 70%,
			transparent 100%
		);
		background-size: 200% 100%;
		animation: badgeShine 2.5s ease-in-out infinite;
	}

	@keyframes badgeShine {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	@keyframes badgePulse {
		0%,
		100% {
			transform: scale(1);
			box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
		}
		50% {
			transform: scale(1.05);
			box-shadow: 0 4px 16px rgba(220, 38, 38, 0.6);
		}
	}

	/* 별 */
	.stars-row {
		@apply flex;
		gap: calc(var(--card-height) * 0.015);
	}

	.star {
		font-size: calc(var(--card-height) * 0.065);
		filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.5));
	}

	/* 이미지 컨테이너 */
	.image-container {
		@apply relative;
		@apply flex items-center justify-center;
	}

	.ingredient-image {
		width: calc(var(--card-height) * 0.32);
		height: calc(var(--card-height) * 0.32);
		@apply object-contain;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
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
		height: 1px;
		@apply bg-gradient-to-r from-transparent via-gray-300 to-transparent;
	}

	.golden .divider-line {
		@apply bg-gradient-to-r from-transparent via-red-400 to-transparent;
	}

	.divider-diamond {
		@apply text-gray-400;
		font-size: calc(var(--card-height) * 0.025);
	}

	.golden .divider-diamond {
		@apply text-red-500;
	}

	/* 이름 */
	.ingredient-name {
		@apply font-bold text-gray-800;
		@apply text-center;
		font-size: calc(var(--card-height) * 0.055);
	}

	/* 등급 뱃지 */
	.grade-badge {
		@apply rounded-full;
		@apply font-bold text-white;
		padding: calc(var(--card-height) * 0.015) calc(var(--card-height) * 0.04);
		font-size: calc(var(--card-height) * 0.035);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	/* 해금 뱃지 */
	.unlock-badge {
		@apply flex items-center;
		@apply bg-gradient-to-r from-emerald-500 to-green-400;
		@apply rounded-xl;
		gap: calc(var(--card-height) * 0.015);
		padding: calc(var(--card-height) * 0.02) calc(var(--card-height) * 0.04);
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
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
		gap: calc(var(--card-height) * 0.015);
		padding: calc(var(--card-height) * 0.02) calc(var(--card-height) * 0.04);
		box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
	}

	.dish-icon {
		font-size: calc(var(--card-height) * 0.045);
	}

	.dish-text {
		@apply font-bold text-white;
		font-size: calc(var(--card-height) * 0.032);
	}
</style>
