<script lang="ts">
	import { Flame } from 'lucide-svelte';

	interface Props {
		/** 선택된 재료 ID 목록 */
		ingredientIds: string[];
		/** 선택된 도구 */
		tool?: string | null;
		/** 조리 버튼 클릭 시 콜백 */
		onCook?: () => void;
	}

	let { ingredientIds, tool = null, onCook }: Props = $props();

	// 버튼 활성화 조건: 재료 2개 선택
	let isEnabled = $derived(ingredientIds.length === 2);

	function handleCook() {
		if (isEnabled) {
			onCook?.();
		}
	}
</script>

<button
	type="button"
	class="cook-button"
	disabled={!isEnabled}
	onclick={handleCook}
>
	<Flame size={28} class="flame-icon" />
	<span class="button-text">요리하기</span>
</button>

<style lang="postcss">
	@reference '$styles/app.css';

	.cook-button {
		@apply w-full max-w-md;
		@apply px-8 py-4;
		@apply rounded-2xl;
		@apply bg-gradient-to-r from-orange-500 to-red-500;
		@apply text-white;
		@apply flex items-center justify-center gap-3;
		@apply shadow-2xl;
		@apply transition-all duration-300;
		@apply font-bold;
		@apply border-4 border-orange-600;
		font-size: var(--font-lg);
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

	.flame-icon {
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
