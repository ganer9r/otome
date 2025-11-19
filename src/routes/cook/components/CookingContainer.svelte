<script lang="ts">
	import { Soup, Flame, Scale } from 'lucide-svelte';
	import { findIngredientById } from '../lib/data/ingredients';

	interface Props {
		/** 선택된 재료 ID 배열 (최대 2개) */
		selectedIngredientIds: string[];
		/** 선택된 도구 */
		selectedTool: string | null;
		/** 요리하기 콜백 */
		onCook?: () => void;
	}

	let { selectedIngredientIds, selectedTool = $bindable(), onCook }: Props = $props();

	// 도구 목록
	const tools = [
		{ id: 'pot', name: '냄비', image: '/imgs/cw_pot.webp' },
		{ id: 'pan', name: '프라이팬', image: '/imgs/cw_pan.webp' },
		{ id: 'oven', name: '오븐', image: '/imgs/cw_oven.webp' }
	];

	// 재료 정보
	let ingredients = $derived(
		selectedIngredientIds.map((id) => findIngredientById(id)).filter((ing) => ing !== null)
	);

	// 도구 선택/해제
	function toggleTool(toolId: string) {
		selectedTool = selectedTool === toolId ? null : toolId;
	}

	// 요리하기 버튼 활성화 여부
	let canCook = $derived(selectedIngredientIds.length === 2);

	// 요리하기 핸들러
	function handleCook() {
		if (canCook) {
			onCook?.();
		}
	}

	// 그릇 이미지 (조리기구에 따라)
	let bowlImage = $derived(() => {
		switch (selectedTool) {
			case 'pot':
				return '/imgs/cw_pot.webp';
			case 'pan':
				return '/imgs/cw_pan.webp';
			case 'oven':
				return '/imgs/cw_oven.webp';
			default:
				return null;
		}
	});
</script>

<div class="cooking-container">
	<!-- 조리 도구 선택 (상단) -->
	<div class="tools-section">
		{#each tools as tool (tool.id)}
			<button
				type="button"
				class="tool-item"
				class:selected={selectedTool === tool.id}
				onclick={() => toggleTool(tool.id)}
			>
				<img src={tool.image} alt={tool.name} class="tool-icon-img" />
				<div class="tool-name">{tool.name}</div>
			</button>
		{/each}
	</div>

	<!-- 중앙 그릇 + 재료 슬롯 오버레이 -->
	<div class="bowl-container">
		<!-- 조리기구 이미지 (배경) -->
		<div class="bowl">
			{#if bowlImage()}
				<img src={bowlImage()} alt="조리기구" class="bowl-image" />
			{/if}
		</div>

		<!-- 재료 슬롯 (오버레이) -->
		<div class="ingredient-slots">
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
	</div>

	<!-- 요리하기 버튼 -->
	<button type="button" class="cook-button" disabled={!canCook} onclick={handleCook}>
		<Flame size={20} class="flame-icon" />
		<span class="button-text">요리하기</span>
	</button>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.cooking-container {
		@apply w-full;
		@apply flex flex-col items-center gap-3;
		@apply p-4;
	}

	/* 도구 섹션 */
	.tools-section {
		@apply flex gap-1 justify-center;
		@apply bg-white/90;
		@apply rounded-xl;
		@apply p-1;
		@apply shadow-md;
		@apply border-2 border-orange-200;
		@apply mx-auto;
		max-width: fit-content;
	}

	.tool-item {
		@apply flex flex-row items-center gap-1.5;
		@apply px-2.5 py-1.5;
		@apply rounded-lg;
		@apply bg-transparent;
		@apply border-2 border-transparent;
		@apply transition-all;
		@apply cursor-pointer;
	}

	.tool-item:hover {
		@apply bg-orange-50;
		@apply border-orange-300;
	}

	.tool-item.selected {
		@apply bg-gradient-to-br from-orange-500 to-red-500;
		@apply border-orange-600;
		@apply shadow-md;
	}

	.tool-item.selected .tool-icon-img {
		filter: brightness(1.2);
	}

	.tool-icon-img {
		@apply w-5 h-5 object-contain;
	}

	.tool-name {
		@apply font-semibold;
		@apply whitespace-nowrap;
		font-size: clamp(10px, 2.5vw, 12px);
		@apply text-gray-700;
	}

	.tool-item.selected .tool-name {
		@apply text-white;
	}

	/* 중앙 그릇 */
	.bowl-container {
		@apply relative;
		@apply flex items-center justify-center;
		width: clamp(200px, 50vw, 300px);
		height: clamp(200px, 50vw, 300px);
	}

	/* 재료 슬롯 (오버레이) */
	.ingredient-slots {
		@apply absolute top-4;
		@apply flex gap-3 justify-center;
		@apply w-full;
		z-index: 10;
	}

	.slot {
		@apply flex items-center justify-center;
		@apply w-28 h-16;
		@apply rounded-xl;
		@apply border-3 border-dashed border-gray-300;
		@apply bg-white/70;
		@apply transition-all duration-300;
		@apply shadow-md;
		backdrop-filter: blur(4px);
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
		@apply text-gray-400;
	}

	.plus-icon {
		@apply text-3xl font-light;
	}

	.slot-label {
		@apply text-xs font-medium;
	}

	.slot-filled {
		@apply flex flex-col items-center gap-1;
	}

	.ingredient-emoji {
		@apply text-2xl;
	}

	.ingredient-text {
		@apply text-sm font-bold text-orange-700;
	}

	.bowl {
		@apply absolute inset-0;
		@apply flex items-center justify-center;
	}

	.bowl-image {
		@apply absolute inset-0;
		@apply w-full h-full;
		@apply object-contain;
		@apply transition-all duration-500;
		object-position: bottom;
	}

	/* 요리하기 버튼 */
	.cook-button {
		@apply w-full max-w-xs;
		@apply px-6 py-2.5;
		@apply rounded-xl;
		@apply bg-gradient-to-r from-orange-500 to-red-500;
		@apply text-white;
		@apply flex items-center justify-center gap-2;
		@apply shadow-lg;
		@apply transition-all duration-300;
		@apply font-bold;
		@apply border-3 border-orange-600;
		@apply mt-2;
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
			box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
		}
		50% {
			box-shadow: 0 20px 25px -5px rgb(249 115 22 / 0.5), 0 8px 10px -6px rgb(249 115 22 / 0.5);
			transform: translateY(-2px);
		}
	}

	.cook-button .flame-icon {
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

	.button-text {
		@apply drop-shadow-lg;
	}
</style>
