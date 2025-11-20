<script lang="ts">
	import IngredientGrid from './IngredientGrid.svelte';
	import { findIngredientById } from '../lib/data/ingredients';

	interface Props {
		/** 선택된 재료 ID 배열 (양방향 바인딩) */
		selectedIds: string[];
		/** 다음 버튼 클릭 콜백 */
		onNext: () => void;
	}

	let { selectedIds = $bindable(), onNext }: Props = $props();

	// 재료 정보
	let ingredients = $derived(
		selectedIds.map((id) => findIngredientById(id)).filter((ing) => ing !== null)
	);

	// 다음 버튼 활성화 여부 (2개 선택 시)
	let canNext = $derived(selectedIds.length === 2);

	// 다음 버튼 핸들러
	function handleNext() {
		if (canNext) {
			onNext?.();
		}
	}
</script>

<div class="ingredient-select-screen">
	<!-- 상단: 타이틀 -->
	<div class="title-section">
		<h1 class="title">재료를 선택하세요</h1>
		<p class="subtitle">맛있는 요리를 위해 2가지 재료를 골라주세요</p>
	</div>

	<!-- 중앙: 재료 슬롯 2개 -->
	<div class="slots-section">
		<div class="slot" class:filled={ingredients[0]}>
			{#if ingredients[0]}
				<div class="slot-filled">
					<span class="ingredient-emoji">🥘</span>
					<span class="ingredient-text">{ingredients[0].name}</span>
				</div>
			{:else}
				<div class="slot-empty">
					<span class="plus-icon">+</span>
					<span class="slot-label">재료 1</span>
				</div>
			{/if}
		</div>

		<div class="slot" class:filled={ingredients[1]}>
			{#if ingredients[1]}
				<div class="slot-filled">
					<span class="ingredient-emoji">🥘</span>
					<span class="ingredient-text">{ingredients[1].name}</span>
				</div>
			{:else}
				<div class="slot-empty">
					<span class="plus-icon">+</span>
					<span class="slot-label">재료 2</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- 다음 버튼 -->
	<div class="button-section">
		<button type="button" class="next-button" disabled={!canNext} onclick={handleNext}>
			<span class="button-text">다음</span>
			<span class="button-arrow">→</span>
		</button>
	</div>

	<!-- 하단: 재료 그리드 -->
	<div class="grid-section">
		<IngredientGrid bind:selectedIds />
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.ingredient-select-screen {
		@apply flex flex-col;
		@apply h-screen;
		@apply overflow-hidden;
		background-image: url('/imgs/cook_bg.webp');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	/* 타이틀 섹션 */
	.title-section {
		@apply flex flex-col items-center gap-2;
		@apply pt-6 pb-4;
		@apply px-4;
		flex-shrink: 0;
	}

	.title {
		@apply text-white font-bold;
		@apply drop-shadow-lg;
		font-size: var(--font-xl);
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.subtitle {
		@apply text-white/90;
		@apply drop-shadow-md;
		font-size: var(--font-sm);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	/* 슬롯 섹션 */
	.slots-section {
		@apply flex gap-3 justify-center;
		@apply px-4 pb-4;
		flex-shrink: 0;
	}

	.slot {
		@apply flex items-center justify-center;
		@apply rounded-xl;
		@apply border-3 border-dashed border-white/50;
		@apply bg-white/70;
		@apply transition-all duration-300;
		@apply shadow-md;
		backdrop-filter: blur(4px);
		width: clamp(120px, 40vw, 160px);
		height: clamp(80px, 20vw, 100px);
	}

	.slot.filled {
		@apply border-solid border-orange-400;
		@apply bg-orange-100/80;
		@apply shadow-lg shadow-orange-300;
		animation: slotPop 0.3s ease-out;
		backdrop-filter: blur(4px);
	}

	@keyframes slotPop {
		0% {
			transform: scale(0.8);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	.slot-empty {
		@apply flex flex-col items-center gap-1;
		@apply text-white/70;
	}

	.plus-icon {
		@apply text-4xl font-light;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
	}

	.slot-label {
		@apply text-sm font-medium;
		@apply drop-shadow-md;
		font-size: var(--font-xs);
	}

	.slot-filled {
		@apply flex flex-col items-center gap-1;
	}

	.ingredient-emoji {
		@apply text-3xl;
	}

	.ingredient-text {
		@apply text-sm font-bold text-orange-700;
		font-size: var(--font-sm);
	}

	/* 버튼 섹션 */
	.button-section {
		@apply flex justify-center;
		@apply px-4 pb-4;
		flex-shrink: 0;
	}

	.next-button {
		@apply w-full max-w-xs;
		@apply px-6 py-3;
		@apply rounded-xl;
		@apply bg-gradient-to-r from-orange-500 to-red-500;
		@apply text-white;
		@apply flex items-center justify-center gap-2;
		@apply shadow-lg;
		@apply transition-all duration-300;
		@apply font-bold;
		@apply border-3 border-orange-600;
		font-size: var(--font-md);
	}

	.next-button:not(:disabled) {
		animation: nextPulse 2s ease-in-out infinite;
	}

	.next-button:not(:disabled):hover {
		@apply scale-110;
		@apply shadow-orange-500/50;
	}

	.next-button:not(:disabled):active {
		@apply scale-95;
	}

	.next-button:disabled {
		@apply opacity-40;
		@apply cursor-not-allowed;
		@apply from-gray-400 to-gray-500;
		@apply border-gray-500;
		animation: none;
	}

	@keyframes nextPulse {
		0%,
		100% {
			box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
		}
		50% {
			box-shadow: 0 20px 25px -5px rgb(249 115 22 / 0.5), 0 8px 10px -6px rgb(249 115 22 / 0.5);
			transform: translateY(-2px);
		}
	}

	.button-text {
		@apply drop-shadow-lg;
	}

	.button-arrow {
		@apply text-xl;
		animation: arrowSlide 1s ease-in-out infinite;
	}

	@keyframes arrowSlide {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(4px);
		}
	}

	/* 그리드 섹션 */
	.grid-section {
		@apply flex-1;
		@apply overflow-hidden;
		@apply px-4 pb-4;
	}
</style>
