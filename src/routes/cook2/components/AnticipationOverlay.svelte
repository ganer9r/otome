<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		onComplete: () => void;
	}

	let { onComplete }: Props = $props();

	// 펄스 단계: wait → pulse1 → pulse2 → pulse3 → done
	let phase = $state<'wait' | 'pulse1' | 'pulse2' | 'pulse3' | 'done'>('wait');

	onMount(() => {
		// 0.5초 대기 후 첫 번째 펄스
		setTimeout(() => {
			phase = 'pulse1';
		}, 500);

		// 1.3초: 두 번째 펄스 (0.8초 갭)
		setTimeout(() => {
			phase = 'pulse2';
		}, 1300);

		// 2.1초: 세 번째 펄스 (0.8초 갭)
		setTimeout(() => {
			phase = 'pulse3';
		}, 2100);

		// 3초: 완료
		setTimeout(() => {
			phase = 'done';
			onComplete();
		}, 3000);
	});
</script>

{#if phase !== 'done'}
	<div
		class="anticipation-overlay"
		class:pulse1={phase === 'pulse1'}
		class:pulse2={phase === 'pulse2'}
		class:pulse3={phase === 'pulse3'}
	>
		<div class="pulse-container">
			<!-- 첫 번째 펄스: 링 1개 -->
			{#if phase === 'pulse1' || phase === 'pulse2' || phase === 'pulse3'}
				<div class="pulse-ring ring-1-1"></div>
				<div class="center-glow glow-1"></div>
			{/if}

			<!-- 두 번째 펄스: 링 2개 -->
			{#if phase === 'pulse2' || phase === 'pulse3'}
				<div class="pulse-ring ring-2-1"></div>
				<div class="pulse-ring ring-2-2"></div>
				<div class="center-glow glow-2"></div>
			{/if}

			<!-- 세 번째 펄스: 링 3개 -->
			{#if phase === 'pulse3'}
				<div class="pulse-ring ring-3-1"></div>
				<div class="pulse-ring ring-3-2"></div>
				<div class="pulse-ring ring-3-3"></div>
				<div class="center-glow glow-3"></div>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference '$styles/app.css';

	.anticipation-overlay {
		@apply fixed inset-0 z-[200];
		@apply flex items-center justify-center;
		background: rgba(0, 0, 0, 0.7);
		animation: fadeIn 0.4s ease-out forwards;
	}

	@keyframes fadeIn {
		from {
			background: rgba(0, 0, 0, 0);
		}
		to {
			background: rgba(0, 0, 0, 0.7);
		}
	}

	/* 펄스별 화면 플래시 */
	.anticipation-overlay.pulse1 {
		animation: flash1 0.35s ease-out forwards;
	}

	.anticipation-overlay.pulse2 {
		animation: flash2 0.35s ease-out forwards;
	}

	.anticipation-overlay.pulse3 {
		animation: flash3 0.4s ease-out forwards;
	}

	@keyframes flash1,
	@keyframes flash2,
	@keyframes flash3 {
		0% {
			background: rgba(0, 0, 0, 0.7);
		}
		30% {
			background: rgba(255, 255, 255, 0.5);
		}
		100% {
			background: rgba(0, 0, 0, 0.7);
		}
	}

	.pulse-container {
		@apply relative;
		width: 300px;
		height: 300px;
	}

	/* 펄스 링 기본 */
	.pulse-ring {
		@apply absolute;
		top: 50%;
		left: 50%;
		border-radius: 50%;
		border: 4px solid white;
		transform: translate(-50%, -50%) scale(0);
		opacity: 0;
	}

	/* ===== 펄스 링 공통 ===== */
	.pulse-ring.ring-1-1,
	.pulse-ring.ring-1-2,
	.pulse-ring.ring-1-3,
	.pulse-ring.ring-2-1,
	.pulse-ring.ring-2-2,
	.pulse-ring.ring-2-3,
	.pulse-ring.ring-3-1,
	.pulse-ring.ring-3-2,
	.pulse-ring.ring-3-3 {
		width: 40px;
		height: 40px;
	}

	/* 1번째 펄스: 느리게 (0.5초) - 링 1개라서 천천히 */
	.pulse-ring.ring-1-1 {
		animation: pulseExpand 0.5s ease-out forwards;
	}

	/* 2번째 펄스: 중간 (0.4초) - 링 2개 */
	.pulse-ring.ring-2-1 {
		animation: pulseExpandMedium 0.4s ease-out forwards;
	}
	.pulse-ring.ring-2-2 {
		animation: pulseExpandMedium 0.4s ease-out 0.08s forwards;
	}

	/* 3번째 펄스: 원래대로 (0.5초) */
	.pulse-ring.ring-3-1 {
		animation: pulseExpand 0.5s ease-out forwards;
	}
	.pulse-ring.ring-3-2 {
		animation: pulseExpand 0.5s ease-out 0.1s forwards;
	}
	.pulse-ring.ring-3-3 {
		animation: pulseExpand 0.5s ease-out 0.2s forwards;
	}

	@keyframes pulseExpandMedium {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 1;
			border-width: 6px;
		}
		100% {
			transform: translate(-50%, -50%) scale(7);
			opacity: 0;
			border-width: 1px;
		}
	}

	@keyframes pulseExpand {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 1;
			border-width: 6px;
		}
		100% {
			transform: translate(-50%, -50%) scale(7);
			opacity: 0;
			border-width: 1px;
		}
	}

	/* ===== 중앙 빛 ===== */
	.center-glow {
		@apply absolute;
		top: 50%;
		left: 50%;
		border-radius: 50%;
		background: radial-gradient(circle, white 0%, transparent 70%);
		transform: translate(-50%, -50%) scale(0);
		opacity: 0;
	}

	.center-glow.glow-1,
	.center-glow.glow-2,
	.center-glow.glow-3 {
		width: 30px;
		height: 30px;
	}

	/* 1~2번째: 짧게 */
	.center-glow.glow-1 {
		animation: glowPulseShort 0.2s ease-out forwards;
	}
	.center-glow.glow-2 {
		animation: glowPulseShort 0.25s ease-out forwards;
	}
	/* 3번째: 원래대로 */
	.center-glow.glow-3 {
		animation: glowPulse 0.4s ease-out forwards;
	}

	@keyframes glowPulseShort {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
		40% {
			transform: translate(-50%, -50%) scale(4);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%) scale(7);
			opacity: 0;
		}
	}

	@keyframes glowPulse {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
		30% {
			transform: translate(-50%, -50%) scale(4);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%) scale(7);
			opacity: 0;
		}
	}
</style>
