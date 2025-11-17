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
		{ id: 'pot', name: '냄비', icon: '🍲' },
		{ id: 'pan', name: '프라이팬', icon: '🍳' },
		{ id: 'scale', name: '저울', icon: '⚖️' }
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

	// 그릇 색상 (조리기구에 따라)
	let bowlColor = $derived(() => {
		switch (selectedTool) {
			case 'pot':
				return 'from-blue-200 via-blue-100 to-blue-200 border-blue-400';
			case 'pan':
				return 'from-orange-200 via-yellow-100 to-orange-200 border-orange-400';
			case 'scale':
				return 'from-green-200 via-green-100 to-green-200 border-green-400';
			default:
				return 'from-gray-200 via-gray-100 to-gray-200 border-gray-400';
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
				<div class="tool-icon">{tool.icon}</div>
				<div class="tool-name">{tool.name}</div>
			</button>
		{/each}
	</div>

	<!-- 중앙 그릇 -->
	<div class="bowl-container">
		<!-- 그릇 배경 -->
		<div class="bowl bg-gradient-to-br {bowlColor()}">
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

		<!-- 그릇 테두리 장식 -->
		<div class="bowl-rim"></div>
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

	.tool-icon {
		font-size: clamp(24px, 6vw, 36px);
		line-height: 1;
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
		@apply absolute inset-0;
		@apply rounded-full;
		@apply border-8;
		@apply shadow-2xl;
		@apply flex items-center justify-center;
		@apply p-6;
		@apply transition-all duration-500;
	}

	.bowl-rim {
		@apply absolute inset-0;
		@apply rounded-full;
		@apply border-4 border-orange-500/30;
		@apply pointer-events-none;
		animation: rimPulse 2s ease-in-out infinite;
	}

	@keyframes rimPulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.05);
			opacity: 0.8;
		}
	}

	/* 그릇 안 재료들 */
	.ingredients-in-bowl {
		@apply flex flex-col items-center justify-center gap-3;
		@apply w-full;
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
