<script lang="ts">
	import { Flame } from 'lucide-svelte';
	import { findIngredientById } from '../lib/data/ingredients';

	interface Props {
		/** 선택된 재료 ID 배열 (최대 2개) */
		selectedIngredients: string[];
		/** 선택된 조리기구 (양방향 바인딩) */
		selectedTool: string | null;
		/** 요리하기 콜백 */
		onCook: () => void;
	}

	let { selectedIngredients, selectedTool = $bindable(), onCook }: Props = $props();

	// 조리기구 목록
	const tools = [
		{ id: 'pot', name: '냄비', image: '/imgs/cw_pot.webp' },
		{ id: 'pan', name: '프라이팬', image: '/imgs/cw_pan.webp' },
		{ id: 'oven', name: '오븐', image: '/imgs/cw_oven.webp' }
	];

	// 재료 정보
	let ingredients = $derived(
		selectedIngredients.map((id) => findIngredientById(id)).filter((ing) => ing !== null)
	);

	// 조리기구 선택/해제
	function toggleTool(toolId: string) {
		selectedTool = selectedTool === toolId ? null : toolId;
	}

	// 요리하기 버튼 활성화 여부 (조리기구 선택 시)
	let canCook = $derived(selectedTool !== null);

	// 요리하기 핸들러
	function handleCook() {
		if (canCook) {
			onCook?.();
		}
	}
</script>

<div class="tool-select-screen">
	<!-- 상단: 선택한 재료 표시 -->
	<div class="ingredients-section">
		<div class="ingredients-badge">
			{#each ingredients as ingredient (ingredient?.id || Math.random())}
				{#if ingredient}
					<div class="ingredient-chip">
						<span class="ingredient-emoji">🥘</span>
						<span class="ingredient-name">{ingredient.name}</span>
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<!-- 중앙: 타이틀 -->
	<div class="title-section">
		<h1 class="title">🔥 조리기구를 선택하세요</h1>
		<p class="subtitle">어떤 방식으로 요리하실건가요?</p>
	</div>

	<!-- 조리기구 카드 -->
	<div class="tools-section">
		{#each tools as tool (tool.id)}
			<button
				type="button"
				class="tool-card"
				class:selected={selectedTool === tool.id}
				onclick={() => toggleTool(tool.id)}
			>
				<div class="tool-image-wrapper">
					<img src={tool.image} alt={tool.name} class="tool-image" />
				</div>
				<div class="tool-name">{tool.name}</div>
			</button>
		{/each}
	</div>

	<!-- 하단: 요리하기 버튼 -->
	<div class="button-section">
		<button type="button" class="cook-button" disabled={!canCook} onclick={handleCook}>
			<Flame size={20} class="flame-icon" />
			<span class="button-text">요리하기</span>
		</button>
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.tool-select-screen {
		@apply flex flex-col;
		@apply h-screen;
		@apply overflow-hidden;
		background-image: url('/imgs/cook_bg.webp');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	/* 재료 섹션 */
	.ingredients-section {
		@apply flex justify-center;
		@apply pt-6 pb-4;
		@apply px-4;
		flex-shrink: 0;
	}

	.ingredients-badge {
		@apply flex gap-2 flex-wrap justify-center;
		@apply bg-white/90;
		@apply rounded-xl;
		@apply px-4 py-2;
		@apply shadow-md;
		@apply border-2 border-orange-200;
		backdrop-filter: blur(4px);
	}

	.ingredient-chip {
		@apply flex items-center gap-1.5;
		@apply bg-orange-100;
		@apply rounded-lg;
		@apply px-3 py-1.5;
		@apply border-2 border-orange-300;
	}

	.ingredient-emoji {
		@apply text-lg;
	}

	.ingredient-name {
		@apply text-sm font-bold text-orange-700;
		font-size: var(--font-sm);
	}

	/* 타이틀 섹션 */
	.title-section {
		@apply flex flex-col items-center gap-2;
		@apply pb-6;
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

	/* 조리기구 섹션 */
	.tools-section {
		@apply flex flex-col gap-3;
		@apply px-4 pb-6;
		flex-shrink: 0;
	}

	.tool-card {
		@apply flex flex-row items-center gap-4;
		@apply bg-white/90;
		@apply rounded-xl;
		@apply p-4;
		@apply shadow-md;
		@apply border-3 border-transparent;
		@apply transition-all duration-300;
		@apply cursor-pointer;
		backdrop-filter: blur(4px);
	}

	.tool-card:hover {
		@apply bg-white;
		@apply border-orange-300;
		@apply shadow-lg;
		transform: translateX(8px);
	}

	.tool-card.selected {
		@apply bg-gradient-to-br from-orange-500 to-red-500;
		@apply border-orange-600;
		@apply shadow-xl shadow-orange-300;
		animation: toolPop 0.3s ease-out;
		transform: translateX(8px);
	}

	@keyframes toolPop {
		0% {
			transform: scale(0.95) translateX(0);
		}
		50% {
			transform: scale(1.05) translateX(8px);
		}
		100% {
			transform: scale(1) translateX(8px);
		}
	}

	.tool-image-wrapper {
		@apply flex-shrink-0;
		width: clamp(60px, 15vw, 80px);
		height: clamp(60px, 15vw, 80px);
	}

	.tool-image {
		@apply w-full h-full;
		@apply object-contain;
		@apply transition-all duration-300;
	}

	.tool-card.selected .tool-image {
		filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
	}

	.tool-name {
		@apply flex-1;
		@apply font-bold;
		@apply text-gray-800;
		font-size: var(--font-lg);
	}

	.tool-card.selected .tool-name {
		@apply text-white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	/* 버튼 섹션 */
	.button-section {
		@apply flex justify-center;
		@apply px-4 pb-4;
		flex-shrink: 0;
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
			box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
		}
		50% {
			box-shadow: 0 20px 25px -5px rgb(249 115 22 / 0.5), 0 8px 10px -6px rgb(249 115 22 / 0.5);
			transform: translateY(-2px);
		}
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

	.button-text {
		@apply drop-shadow-lg;
	}
</style>
