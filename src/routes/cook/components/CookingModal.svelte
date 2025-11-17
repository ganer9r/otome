<script lang="ts">
	import { onMount } from 'svelte';
	import { Flame } from 'lucide-svelte';
	import type { ModalProps } from '$lib/stores/modal';

	export interface CookingModalProps extends ModalProps {
		/** 조리 시간 (초) */
		cookingTime?: number;
	}

	let { id, close, cookingTime = 10 }: CookingModalProps = $props();

	let remainingTime = $state(cookingTime);
	let progress = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			remainingTime -= 1;
			progress = ((cookingTime - remainingTime) / cookingTime) * 100;

			if (remainingTime <= 0) {
				clearInterval(interval);
				// 조리 완료 후 모달 닫기
				setTimeout(() => {
					close();
				}, 300);
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="cooking-modal">
	<!-- 불 아이콘 애니메이션 -->
	<div class="flame-container">
		<Flame size={80} class="flame-icon" />
	</div>

	<!-- 조리 중 텍스트 -->
	<h2 class="cooking-text">조리 중...</h2>

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

	.cooking-modal {
		@apply flex flex-col items-center justify-center gap-6 py-8;
	}

	.flame-container {
		@apply text-primary;
		animation: flameFlicker 0.5s ease-in-out infinite alternate;
	}

	@keyframes flameFlicker {
		0% {
			transform: scale(1) rotate(-2deg);
			opacity: 0.9;
		}
		100% {
			transform: scale(1.1) rotate(2deg);
			opacity: 1;
		}
	}

	.cooking-text {
		@apply text-3xl font-bold text-gray-800;
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
		@apply text-5xl font-bold text-primary;
		@apply tabular-nums;
	}

	.progress-container {
		@apply w-full h-3 bg-base-200 rounded-full overflow-hidden;
	}

	.progress-bar {
		@apply h-full bg-gradient-to-r from-primary to-secondary;
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
		@apply text-sm text-gray-500;
	}
</style>
