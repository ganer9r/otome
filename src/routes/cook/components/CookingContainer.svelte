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

	<!-- 중앙 그릇 -->
	<div class="bowl-container">
		<!-- 그릇 배경 -->
		<div class="bowl">
			{#if bowlImage()}
				<img src={bowlImage()} alt="조리기구" class="bowl-image" />
			{/if}

			<!-- 선택된 재료들 -->
			<div class="ingredients-in-bowl">
				{#if ingredients.length === 0}
					<div class="empty-bowl">
						<div class="empty-text">재료를 선택하세요</div>
					</div>
				{:else}
					{#each ingredients as ingredient (ingredient.id)}
						<div class="ingredient-item">
							<div class="ingredient-bubble">
								{ingredient.name}
							</div>
						</div>
					{/each}
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
		@apply flex gap-3 justify-center;
		@apply w-full;
		@apply px-4;
	}

	.tool-item {
		@apply flex flex-col items-center gap-1;
		@apply p-2;
		@apply rounded-xl;
		@apply bg-white;
		@apply border-2 border-gray-200;
		@apply transition-all;
		@apply shadow-sm;
		@apply cursor-pointer;
		min-width: 60px;
	}

	.tool-item:hover {
		@apply scale-110;
		@apply border-orange-400;
		@apply shadow-lg;
	}

	.tool-item.selected {
		@apply bg-gradient-to-br from-orange-500 to-red-500;
		@apply border-orange-600;
		@apply scale-110;
		@apply shadow-xl shadow-orange-500/50;
	}

	.tool-item.selected .tool-icon {
		filter: brightness(1.2);
	}

	.tool-icon-img {
		@apply w-12 h-12 object-contain;
	}

	.tool-name {
		@apply font-bold;
		font-size: var(--font-xs);
		@apply text-gray-700;
	}

	.tool-item.selected .tool-name {
		@apply text-white;
	}

	/* 중앙 그릇 */
	.bowl-container {
		@apply relative;
		width: clamp(140px, 35vw, 200px);
		height: clamp(140px, 35vw, 200px);
	}

	.bowl {
		@apply relative;
		@apply w-full h-full;
		@apply flex items-center justify-center;
	}

	.bowl-image {
		@apply absolute inset-0;
		@apply w-full h-full;
		@apply object-contain;
		@apply transition-all duration-500;
		object-position: bottom;
	}

	/* 그릇 안 재료들 */
	.ingredients-in-bowl {
		@apply relative;
		@apply flex flex-col items-center justify-center gap-3;
		@apply w-full;
		z-index: 10;
	}

	.empty-bowl {
		@apply flex items-center justify-center;
		@apply w-full h-full;
	}

	.empty-text {
		@apply text-orange-600/50;
		@apply font-bold;
		@apply text-center;
		font-size: var(--font-sm);
	}

	.ingredient-item {
		animation: ingredientDrop 0.5s ease-out;
	}

	@keyframes ingredientDrop {
		0% {
			transform: translateY(-50px) scale(0);
			opacity: 0;
		}
		60% {
			transform: translateY(5px) scale(1.1);
		}
		100% {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
	}

	.ingredient-bubble {
		@apply px-4 py-2;
		@apply rounded-full;
		@apply bg-white;
		@apply border-3 border-orange-500;
		@apply shadow-lg;
		@apply font-bold;
		@apply text-orange-800;
		@apply text-center;
		font-size: var(--font-sm);
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
