<script lang="ts">
	import { onMount } from 'svelte';
	import { Flame } from 'lucide-svelte';

	interface Props {
		/** 조리 완료 시 콜백 */
		onComplete?: () => void;
		/** 조리 시간 (초) */
		cookingTime?: number;
	}

	let { onComplete, cookingTime = 10 }: Props = $props();

	let remainingTime = $state(cookingTime);
	let progress = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			remainingTime -= 1;
			progress = ((cookingTime - remainingTime) / cookingTime) * 100;

			if (remainingTime <= 0) {
				clearInterval(interval);
				setTimeout(() => {
					onComplete?.();
				}, 300);
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="cooking-screen">
	<!-- 불 아이콘 애니메이션 -->
	<div class="flame-container">
		<Flame size={120} class="flame-icon" />
	</div>

	<!-- 조리 중 텍스트 -->
	<h1 class="cooking-text">조리 중...</h1>

	<!-- 타이머 -->
	<div class="timer-display">{remainingTime}초</div>

	<!-- 프로그레스 바 -->
	<div class="progress-container">
		<div class="progress-bar" style="width: {progress}%"></div>
	</div>

	<p class="hint-text">잠시만 기다려주세요</p>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.cooking-screen {
		@apply fixed inset-0 z-50;
		@apply bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100;
		@apply flex flex-col items-center justify-center gap-8 p-6;
	}

	.flame-container {
		@apply text-orange-500;
		animation: flameFlicker 0.5s ease-in-out infinite alternate;
	}

	@keyframes flameFlicker {
		0% {
			transform: scale(1) rotate(-3deg);
			opacity: 0.9;
		}
		100% {
			transform: scale(1.15) rotate(3deg);
			opacity: 1;
		}
	}

	.cooking-text {
		@apply font-bold text-gray-800;
		font-size: var(--font-xxl);
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	.timer-display {
		@apply font-bold text-orange-600;
		@apply tabular-nums;
		font-size: clamp(48px, 12vw, 80px);
	}

	.progress-container {
		@apply w-full max-w-md h-4 bg-orange-200 rounded-full overflow-hidden;
		@apply shadow-inner;
	}

	.progress-bar {
		@apply h-full bg-gradient-to-r from-orange-400 to-red-500;
		@apply transition-all duration-1000 ease-linear;
		animation: shimmer 1.5s infinite;
	}

	@keyframes shimmer {
		0% {
			opacity: 0.8;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0.8;
		}
	}

	.hint-text {
		@apply text-gray-600;
		font-size: var(--font-md);
	}
</style>
