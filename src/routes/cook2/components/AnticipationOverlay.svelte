<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		duration?: number;
		onComplete: () => void;
	}

	let { duration = 1000, onComplete }: Props = $props();

	let phase = $state<'flash' | 'pulse' | 'burst' | 'done'>('flash');

	const pulseColor = '#ffffff';

	onMount(() => {
		// 1단계: 플래시 (0.3초)
		setTimeout(() => {
			phase = 'pulse';
		}, 300);

		// 2단계: 펄스 (0.5초)
		setTimeout(() => {
			phase = 'burst';
		}, 800);

		// 3단계: 버스트 후 완료
		setTimeout(() => {
			phase = 'done';
			onComplete();
		}, duration);
	});
</script>

{#if phase !== 'done'}
	<div class="anticipation-overlay" class:flash={phase === 'flash'}>
		<div class="pulse-container">
			<!-- 퍼져나가는 파동 링 -->
			<div class="pulse-ring ring-1" style="--pulse-color: {pulseColor}"></div>
			<div class="pulse-ring ring-2" style="--pulse-color: {pulseColor}"></div>
			<div class="pulse-ring ring-3" style="--pulse-color: {pulseColor}"></div>
			<!-- 중앙 빛 -->
			<div
				class="center-glow"
				class:active={phase === 'pulse' || phase === 'burst'}
				class:burst={phase === 'burst'}
				style="--glow-color: {pulseColor}"
			></div>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference '$styles/app.css';

	.anticipation-overlay {
		@apply fixed inset-0 z-[200];
		@apply flex items-center justify-center;
		background: rgba(0, 0, 0, 0.8);
		animation: overlayFadeIn 0.3s ease-out forwards;
	}

	.anticipation-overlay.flash {
		animation: flashWhite 0.3s ease-out forwards;
	}

	@keyframes flashWhite {
		0% {
			background: rgba(0, 0, 0, 0);
		}
		40% {
			background: rgba(255, 255, 255, 0.8);
		}
		100% {
			background: rgba(0, 0, 0, 0.8);
		}
	}

	.pulse-container {
		@apply relative;
		width: 200px;
		height: 200px;
	}

	/* 펄스 링 */
	.pulse-ring {
		@apply absolute;
		top: 50%;
		left: 50%;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 4px solid var(--pulse-color);
		transform: translate(-50%, -50%) scale(0);
		opacity: 0;
	}

	.pulse-ring.ring-1 {
		animation: pulseExpand 0.7s ease-out 0.2s forwards;
	}

	.pulse-ring.ring-2 {
		animation: pulseExpand 0.7s ease-out 0.35s forwards;
	}

	.pulse-ring.ring-3 {
		animation: pulseExpand 0.7s ease-out 0.5s forwards;
	}

	@keyframes pulseExpand {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 1;
			border-width: 6px;
		}
		100% {
			transform: translate(-50%, -50%) scale(8);
			opacity: 0;
			border-width: 1px;
		}
	}

	/* 중앙 빛 */
	.center-glow {
		@apply absolute;
		top: 50%;
		left: 50%;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: radial-gradient(circle, var(--glow-color) 0%, transparent 70%);
		transform: translate(-50%, -50%) scale(0);
		opacity: 0;
	}

	.center-glow.active {
		animation: glowGrow 0.5s ease-out forwards;
	}

	@keyframes glowGrow {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%) scale(5);
			opacity: 1;
		}
	}

	.center-glow.burst {
		animation: glowBurst 0.2s ease-out forwards;
	}

	@keyframes glowBurst {
		0% {
			transform: translate(-50%, -50%) scale(5);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%) scale(20);
			opacity: 0;
		}
	}
</style>
