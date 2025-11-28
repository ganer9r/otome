<script lang="ts">
	import { X } from 'lucide-svelte';
	import { findIngredientById } from '../lib/data/ingredients';
	import type { CookingTool } from '../lib/types';

	interface Props {
		/** 선택된 재료 ID 배열 */
		selectedIngredients: number[];
		/** 조리기구 선택 콜백 */
		onSelect: (tool: CookingTool) => void;
		/** 취소 콜백 */
		onCancel: () => void;
	}

	let { selectedIngredients, onSelect, onCancel }: Props = $props();

	// 조리기구 목록
	const tools: { id: CookingTool; name: string; image: string | null }[] = [
		{ id: '냄비', name: '냄비', image: '/imgs/cw_pot.webp' },
		{ id: '후라이팬', name: '프라이팬', image: '/imgs/cw_pan.webp' },
		{ id: '오븐', name: '오븐', image: '/imgs/cw_oven.webp' },
		{ id: '없음', name: '사용안함', image: null }
	];

	// 선택된 조리기구 (아직 확정 전)
	let selectedToolId = $state<CookingTool | null>(null);

	// 재료 정보
	let ingredients = $derived(
		selectedIngredients.map((id) => findIngredientById(id)).filter((ing) => ing !== undefined)
	);

	// 조리기구 카드 클릭 (선택 상태만 변경, 아직 확정 안 함)
	function handleToolClick(toolId: CookingTool) {
		selectedToolId = toolId;
	}

	// "선택 완료" 버튼 클릭 (선택한 도구로 확정)
	function handleConfirm() {
		if (selectedToolId !== null) {
			onSelect?.(selectedToolId);
		}
	}

	// 오버레이 클릭 시 취소
	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onCancel?.();
		}
	}
</script>

<div
	class="dialog-overlay"
	onclick={handleOverlayClick}
	onkeydown={(e) => e.key === 'Escape' && onCancel?.()}
	role="dialog"
	aria-modal="true"
	tabindex="-1"
>
	<div class="dialog-content" onclick={(e) => e.stopPropagation()}>
		<!-- 닫기 버튼 -->
		<button type="button" class="close-button" onclick={onCancel} aria-label="닫기">
			<X size={24} />
		</button>

		<!-- 타이틀 -->
		<div class="title-section">
			<h2 class="title">🔥 조리기구 선택</h2>
		</div>

		<!-- 선택한 재료 표시 (간단하게) -->
		<div class="ingredients-text">
			<span class="label">재료:</span>
			{#each ingredients as ingredient, i}
				{#if ingredient}
					<span class="ingredient-simple">
						{ingredient.name}{i < ingredients.length - 1 ? ', ' : ''}
					</span>
				{/if}
			{/each}
		</div>

		<div class="divider"></div>

		<!-- 조리기구 선택 -->
		<div class="tools-section">
			{#each tools as tool (tool.id)}
				<button
					type="button"
					class="tool-option"
					class:selected={selectedToolId === tool.id}
					class:no-tool={tool.id === '없음'}
					onclick={() => handleToolClick(tool.id)}
				>
					<div class="tool-image-wrapper">
						{#if tool.image}
							<img src={tool.image} alt={tool.name} class="tool-image" />
						{:else}
							<div class="no-tool-icon">🚫</div>
						{/if}
					</div>
					<span class="tool-name">{tool.name}</span>
					{#if selectedToolId === tool.id}
						<div class="check-badge">✓</div>
					{/if}
				</button>
			{/each}
		</div>

		<!-- 선택 확정 버튼 -->
		<div class="confirm-section">
			<button
				type="button"
				class="confirm-button"
				disabled={selectedToolId === null}
				onclick={handleConfirm}
			>
				✓ 선택 완료
			</button>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	/* 오버레이 */
	.dialog-overlay {
		@apply fixed inset-0;
		@apply flex items-center justify-center;
		@apply bg-black/60;
		@apply z-50;
		backdrop-filter: blur(4px);
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* 다이얼로그 */
	.dialog-content {
		@apply relative;
		@apply w-full max-w-md;
		@apply mx-4;
		@apply bg-white;
		@apply rounded-2xl;
		@apply shadow-2xl;
		@apply p-6;
		@apply flex flex-col gap-4;
		animation: scaleUp 0.3s ease-out;
		max-height: 90vh;
		overflow-y: auto;
	}

	@keyframes scaleUp {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* 닫기 버튼 */
	.close-button {
		@apply absolute top-4 right-4;
		@apply w-8 h-8;
		@apply flex items-center justify-center;
		@apply rounded-full;
		@apply bg-gray-100;
		@apply text-gray-600;
		@apply transition-all duration-200;
		@apply hover:bg-gray-200 hover:text-gray-800;
		@apply active:scale-95;
	}

	/* 타이틀 섹션 */
	.title-section {
		@apply flex flex-col items-center gap-2;
		@apply pt-2;
	}

	.title {
		@apply text-2xl font-bold;
		@apply text-gray-800;
		font-size: var(--font-xl);
	}

	/* 재료 텍스트 (간단하게) */
	.ingredients-text {
		@apply text-center;
		@apply text-gray-600;
		font-size: var(--font-sm);
	}

	.ingredients-text .label {
		@apply font-medium text-gray-500;
	}

	.ingredients-text .ingredient-simple {
		@apply font-bold text-orange-600;
	}

	/* 구분선 */
	.divider {
		@apply w-full h-px;
		@apply bg-gray-200;
		@apply my-1;
	}

	/* 조리기구 섹션 */
	.tools-section {
		@apply grid grid-cols-4 gap-3;
	}

	.tool-option {
		@apply relative;
		@apply flex flex-col items-center gap-2;
		@apply bg-white;
		@apply rounded-xl;
		@apply p-4;
		@apply border-2 border-gray-200;
		@apply transition-all duration-300;
		@apply cursor-pointer;
		@apply hover:shadow-lg;
		@apply hover:scale-105;
		@apply hover:border-orange-300;
		@apply active:scale-95;
	}

	.tool-option.selected {
		@apply border-orange-500;
		@apply bg-gradient-to-br from-orange-100 to-orange-200;
		@apply scale-105;
		box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
	}

	.check-badge {
		@apply absolute top-2 right-2;
		@apply bg-orange-500 text-white;
		@apply rounded-full;
		@apply w-6 h-6;
		@apply flex items-center justify-center;
		@apply text-sm font-bold;
		box-shadow: 0 2px 8px rgba(249, 115, 22, 0.5);
		animation: checkBounce 0.3s ease-out;
	}

	@keyframes checkBounce {
		0% {
			transform: scale(0);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}

	.tool-image-wrapper {
		@apply w-full;
		@apply aspect-square;
		@apply flex items-center justify-center;
		@apply p-2;
	}

	.tool-image {
		@apply max-w-full max-h-full;
		@apply object-contain;
		@apply transition-all duration-300;
	}

	.tool-option:hover .tool-image {
		filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.5));
	}

	.tool-name {
		@apply text-base font-bold;
		@apply text-gray-700;
		font-size: var(--font-sm);
	}

	/* "없음" 옵션 */
	.tool-option.no-tool {
		@apply bg-white;
	}

	.tool-option.no-tool.selected {
		@apply border-gray-500;
		@apply bg-gradient-to-br from-gray-50 to-gray-100;
		box-shadow: 0 0 20px rgba(107, 114, 128, 0.3);
	}

	.no-tool-icon {
		@apply text-2xl;
		@apply flex items-center justify-center;
	}

	/* 선택 완료 버튼 */
	.confirm-section {
		@apply w-full;
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.confirm-button {
		@apply w-full;
		@apply px-6 py-4;
		@apply rounded-xl;
		@apply bg-gradient-to-r from-orange-500 to-red-500;
		@apply text-white;
		@apply font-bold;
		@apply shadow-lg shadow-orange-500/50;
		@apply transition-all duration-300;
		@apply border-2 border-orange-600;
		@apply hover:scale-105;
		@apply hover:shadow-xl hover:shadow-orange-500/60;
		@apply active:scale-95;
		font-size: var(--font-md);
		animation: pulse 2s ease-in-out infinite;
	}

	.confirm-button:disabled {
		@apply opacity-40;
		@apply cursor-not-allowed;
		@apply from-gray-400 to-gray-500;
		@apply border-gray-500;
		animation: none;
	}

	@keyframes pulse {
		0%, 100% {
			box-shadow: 0 10px 15px -3px rgb(249 115 22 / 0.5);
		}
		50% {
			box-shadow: 0 20px 25px -5px rgb(249 115 22 / 0.5);
		}
	}
</style>
