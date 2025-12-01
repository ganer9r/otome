<script lang="ts">
	import { Flame } from 'lucide-svelte';
	import IngredientGrid from './IngredientGrid.svelte';
	import { findIngredientById } from '../lib/data/ingredients';

	interface Props {
		/** 선택된 재료 ID 배열 (양방향 바인딩) */
		selectedIds: number[];
		/** 요리하기 버튼 클릭 콜백 */
		onCook: () => void;
	}

	let { selectedIds = $bindable(), onCook }: Props = $props();

	// 재료 정보
	let ingredients = $derived(
		selectedIds.map((id) => findIngredientById(id)).filter((ing) => ing !== undefined)
	);

	// 요리하기 버튼 활성화 여부 (1개 이상 선택 시)
	let canCook = $derived(selectedIds.length >= 1);

	// 요리하기 버튼 핸들러
	function handleCook() {
		if (canCook) {
			onCook?.();
		}
	}

	// 슬롯 클릭 시 해당 재료 제거
	function removeIngredient(slotIndex: number) {
		if (selectedIds[slotIndex] !== undefined) {
			selectedIds = selectedIds.filter((_, i) => i !== slotIndex);
		}
	}
</script>

<div class="ingredient-select-screen">
	<!-- 주방 영역 (100vw height) -->
	<div class="kitchen-section">
		<!-- 타이틀 -->
		<div class="title-section">
			<h1 class="title">재료를 선택하세요</h1>
			<p class="subtitle">맛있는 요리를 위해 1-2가지 재료를 골라주세요</p>
		</div>

		<!-- 재료 슬롯 2개 -->
		<div class="slots-section">
			<button
				type="button"
				class="slot"
				class:filled={ingredients[0]}
				onclick={() => removeIngredient(0)}
				disabled={!ingredients[0]}
			>
				{#if ingredients[0]}
					<div class="slot-filled">
						<img src={ingredients[0].imageUrl} alt={ingredients[0].name} class="slot-image" />
						<span class="ingredient-text">{ingredients[0].name}</span>
						<span class="remove-hint">탭하여 제거</span>
					</div>
				{:else}
					<div class="slot-empty">
						<span class="plus-icon">+</span>
						<span class="slot-label">재료 1</span>
					</div>
				{/if}
			</button>

			<button
				type="button"
				class="slot"
				class:filled={ingredients[1]}
				onclick={() => removeIngredient(1)}
				disabled={!ingredients[1]}
			>
				{#if ingredients[1]}
					<div class="slot-filled">
						<img src={ingredients[1].imageUrl} alt={ingredients[1].name} class="slot-image" />
						<span class="ingredient-text">{ingredients[1].name}</span>
						<span class="remove-hint">탭하여 제거</span>
					</div>
				{:else}
					<div class="slot-empty">
						<span class="plus-icon">+</span>
						<span class="slot-label">재료 2</span>
					</div>
				{/if}
			</button>
		</div>

		<!-- 요리하기 버튼 -->
		<div class="button-section">
			<button type="button" class="cook-button" disabled={!canCook} onclick={handleCook}>
				<Flame size={20} class="flame-icon" />
				<span class="button-text">요리하기</span>
			</button>
		</div>
	</div>

	<!-- 재료 그리드 (width 100%) -->
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
	}

	/* 주방 영역 (100vw height) */
	.kitchen-section {
		@apply flex flex-col;
		@apply w-full;
		height: 100vw;
		flex-shrink: 0;
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
	}

	.title {
		@apply font-bold text-white;
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
		@apply flex justify-center gap-3;
		@apply flex-1;
		@apply px-4;
		@apply items-center;
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

	.slot-image {
		@apply h-10 w-10;
		@apply object-contain;
		@apply rounded-lg;
	}

	.ingredient-text {
		@apply text-sm font-bold text-orange-700;
		font-size: var(--font-sm);
	}

	.remove-hint {
		@apply text-orange-500/70;
		@apply mt-0.5;
		font-size: clamp(8px, 2vw, 10px);
	}

	/* 버튼 섹션 */
	.button-section {
		@apply flex justify-center;
		@apply px-4 pb-6;
	}

	.cook-button {
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

	.cook-button:not(:disabled) {
		animation: cookPulse 2s ease-in-out infinite;
	}

	.cook-button:not(:disabled):hover {
		@apply scale-110;
		@apply shadow-orange-500/50;
	}

	.cook-button:not(:disabled):active {
		@apply scale-95;
	}

	.cook-button:disabled {
		@apply opacity-40;
		@apply cursor-not-allowed;
		@apply from-gray-400 to-gray-500;
		@apply border-gray-500;
		animation: none;
	}

	@keyframes cookPulse {
		0%,
		100% {
			box-shadow:
				0 20px 25px -5px rgb(0 0 0 / 0.1),
				0 8px 10px -6px rgb(0 0 0 / 0.1);
		}
		50% {
			box-shadow:
				0 20px 25px -5px rgb(249 115 22 / 0.5),
				0 8px 10px -6px rgb(249 115 22 / 0.5);
			transform: translateY(-2px);
		}
	}

	.button-text {
		@apply drop-shadow-lg;
	}

	.cook-button :global(.flame-icon) {
		animation: flameFlicker 0.5s ease-in-out infinite alternate;
	}

	@keyframes flameFlicker {
		0% {
			transform: rotate(-5deg);
		}
		100% {
			transform: rotate(5deg);
		}
	}

	/* 그리드 섹션 (width 100%, 나머지 높이) */
	.grid-section {
		@apply flex-1;
		@apply w-full;
		@apply overflow-hidden;
		@apply bg-amber-50;
	}
</style>
