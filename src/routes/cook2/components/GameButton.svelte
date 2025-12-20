<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getSoundManager } from '$lib/domain/sound';
	import { haptic } from '../lib/native-bridge';

	interface Props {
		/** 버튼 스타일 */
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
		/** 버튼 크기 */
		size?: 'sm' | 'md' | 'lg';
		/** 비활성화 */
		disabled?: boolean;
		/** 클릭 이벤트 */
		onclick?: (e: MouseEvent) => void;
		/** 버튼 내용 */
		children: Snippet;
		/** 추가 클래스 */
		class?: string;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		onclick,
		children,
		class: className = ''
	}: Props = $props();

	function handleClick(e: MouseEvent) {
		if (disabled) return;

		// 효과음 + 진동
		getSoundManager().playSfx('button');
		haptic('light');

		// 원래 핸들러 호출
		onclick?.(e);
	}
</script>

<button
	type="button"
	class="game-button {variant} {size} {className}"
	{disabled}
	onclick={handleClick}
>
	{@render children()}
</button>

<style lang="postcss">
	@reference '$styles/app.css';

	.game-button {
		@apply flex items-center justify-center gap-2;
		@apply font-bold;
		@apply rounded-xl;
		@apply transition-all;
		@apply outline-none;
		@apply border-none;
		@apply cursor-pointer;
	}

	/* 크기 */
	.game-button.sm {
		@apply px-3 py-2;
		font-size: 12px;
	}

	.game-button.md {
		@apply px-5 py-3;
		font-size: 14px;
	}

	.game-button.lg {
		@apply px-6 py-4;
		font-size: 16px;
	}

	/* Primary (초록색 - 메인 액션) */
	.game-button.primary {
		color: #fff;
		background: linear-gradient(180deg, #7cc576 0%, #4caf50 50%, #3d9140 100%);
		border-bottom: 3px solid #2d6b2f;
		box-shadow:
			0 3px 0 #1e4620,
			0 5px 10px rgba(0, 0, 0, 0.3);
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
	}

	.game-button.primary:not(:disabled):hover {
		filter: brightness(1.1);
	}

	.game-button.primary:not(:disabled):active {
		transform: translateY(2px);
		box-shadow:
			0 1px 0 #1e4620,
			0 2px 5px rgba(0, 0, 0, 0.3);
	}

	/* Secondary (회색 - 보조 액션) */
	.game-button.secondary {
		color: #4a3728;
		background: linear-gradient(180deg, #fff 0%, #e8e8e8 100%);
		border: 2px solid #8b7355;
		border-bottom-width: 3px;
		box-shadow: 0 2px 0 #5c4a38;
	}

	.game-button.secondary:not(:disabled):hover {
		background: linear-gradient(180deg, #f5f5f5 0%, #ddd 100%);
	}

	.game-button.secondary:not(:disabled):active {
		transform: translateY(2px);
		box-shadow: 0 0 0 #5c4a38;
	}

	/* Danger (빨간색 - 위험 액션) */
	.game-button.danger {
		color: #fff;
		background: linear-gradient(180deg, #ef5350 0%, #e53935 50%, #c62828 100%);
		border-bottom: 3px solid #b71c1c;
		box-shadow:
			0 3px 0 #7f0000,
			0 5px 10px rgba(0, 0, 0, 0.3);
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
	}

	.game-button.danger:not(:disabled):hover {
		filter: brightness(1.1);
	}

	.game-button.danger:not(:disabled):active {
		transform: translateY(2px);
		box-shadow:
			0 1px 0 #7f0000,
			0 2px 5px rgba(0, 0, 0, 0.3);
	}

	/* Ghost (투명 - 최소 스타일) */
	.game-button.ghost {
		color: #5d4037;
		background: transparent;
		@apply hover:bg-base-200;
	}

	.game-button.ghost:not(:disabled):active {
		@apply bg-base-300;
	}

	/* Disabled */
	.game-button:disabled {
		@apply opacity-50;
		@apply cursor-not-allowed;
		filter: grayscale(30%);
	}
</style>
