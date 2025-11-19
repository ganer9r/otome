<script lang="ts">
	interface Props {
		/** 선택된 도구 */
		selectedTool?: string | null;
		/** 도구 선택 시 콜백 */
		onSelect?: (tool: string | null) => void;
	}

	let { selectedTool = $bindable(null), onSelect }: Props = $props();

	/** 사용 가능한 도구 목록 */
	const tools = [
		{ id: 'pot', name: '냄비', image: '/imgs/cw_pot.webp' },
		{ id: 'pan', name: '프라이팬', image: '/imgs/cw_pan.webp' },
		{ id: 'oven', name: '오븐', image: '/imgs/cw_oven.webp' }
	];

	/** 도구 선택/해제 토글 */
	function toggleTool(toolId: string) {
		if (selectedTool === toolId) {
			// 이미 선택된 도구를 다시 클릭하면 선택 해제
			selectedTool = null;
		} else {
			// 다른 도구 선택
			selectedTool = toolId;
		}
		onSelect?.(selectedTool);
	}
</script>

<div class="tool-selector">
	<h3 class="selector-title">도구 선택 (선택사항)</h3>

	<div class="flex flex-wrap gap-2 justify-center">
		{#each tools as tool (tool.id)}
			<button
				type="button"
				class="tool-button"
				class:selected={selectedTool === tool.id}
				onclick={() => toggleTool(tool.id)}
			>
				<img src={tool.image} alt={tool.name} class="tool-image" />
				<span class="tool-name">{tool.name}</span>
			</button>
		{/each}
	</div>

	{#if selectedTool}
		<div class="selected-text">
			선택됨: {tools.find((t) => t.id === selectedTool)?.name}
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.tool-selector {
		@apply w-full;
	}

	.selector-title {
		@apply font-bold text-center;
		font-size: var(--font-md);
		margin-bottom: var(--spacing-sm);
	}

	.selected-text {
		@apply text-gray-600 text-center;
		font-size: var(--font-xs);
		margin-top: var(--spacing-xs);
	}

	.tool-image {
		@apply w-12 h-12 object-contain;
	}

	.tool-button {
		@apply flex flex-col items-center justify-center;
		@apply px-6 py-3 rounded-lg;
		@apply bg-base-200 hover:bg-base-300;
		@apply border-2 border-transparent;
		@apply transition-all duration-200 cursor-pointer;
		@apply hover:scale-105 hover:shadow-lg hover:shadow-secondary/20;
		@apply active:scale-95;
		min-width: 80px;
	}

	.tool-button.selected {
		@apply ring-2 ring-secondary;
		@apply border-secondary bg-secondary/10;
		@apply shadow-md shadow-secondary/30;
		@apply scale-105;
	}

	.tool-name {
		@apply font-semibold;
		font-size: var(--font-xs);
		margin-top: var(--spacing-xs);
	}
</style>
