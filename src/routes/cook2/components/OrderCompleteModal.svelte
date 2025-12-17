<script lang="ts">
	import { onMount } from 'svelte';
	import type { CustomerOrder } from '../lib/customer-store';

	interface Props {
		order: CustomerOrder;
		onClose: () => void;
	}

	let { order, onClose }: Props = $props();

	// 애니메이션 상태
	let showContent = $state(false);
	let showBonus = $state(false);
	let bonusCount = $state(0);
	let showParticles = $state(false);
	let canClose = $state(false);

	onMount(() => {
		// 컨텐츠 등장 (0.1초 후)
		setTimeout(() => {
			showContent = true;
		}, 100);

		// 보너스 표시 시작 (0.5초 후)
		setTimeout(() => {
			showBonus = true;
			animateBonus();
		}, 500);

		// 파티클 효과 (0.8초 후)
		setTimeout(() => {
			showParticles = true;
		}, 800);

		// 닫기 가능 (1.5초 후)
		setTimeout(() => {
			canClose = true;
		}, 1500);

		// 자동 닫기 (3초 후)
		const autoCloseTimer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => {
			clearTimeout(autoCloseTimer);
		};
	});

	// 보너스 카운트업 애니메이션
	function animateBonus() {
		const target = order.bonusAmount;
		const duration = 800;
		const startTime = Date.now();

		function update() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			// easeOutQuad
			const eased = 1 - (1 - progress) * (1 - progress);
			bonusCount = Math.floor(target * eased);

			if (progress < 1) {
				requestAnimationFrame(update);
			} else {
				bonusCount = target;
			}
		}

		requestAnimationFrame(update);
	}

	// 탭하면 즉시 닫기 (canClose가 true일 때만)
	function handleTap() {
		if (canClose) {
			onClose();
		}
	}

	// 파티클 생성
	const particles = Array.from({ length: 20 }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		delay: Math.random() * 0.5,
		duration: 1 + Math.random() * 0.5,
		emoji: ['✨', '🎉', '⭐', '🌟'][Math.floor(Math.random() * 4)]
	}));
</script>

<button class="modal-overlay" onclick={handleTap} aria-label="닫기">
	<div class="modal-content" class:show={showContent}>
		<!-- 파티클 효과 -->
		{#if showParticles}
			<div class="particles">
				{#each particles as particle (particle.id)}
					<span
						class="particle"
						style="
              left: {particle.x}%;
              animation-delay: {particle.delay}s;
              animation-duration: {particle.duration}s;
            "
					>
						{particle.emoji}
					</span>
				{/each}
			</div>
		{/if}

		<!-- 헤더 -->
		<div class="header">
			<span class="header-icon">✨</span>
			<span class="header-text">주문 완료!</span>
			<span class="header-icon">✨</span>
		</div>

		<!-- 손님 만족 -->
		<div class="customer-area">
			<div class="customer-emoji">😄</div>
			<div class="customer-message">"{order.completeMessage}"</div>
		</div>

		<!-- 보너스 -->
		{#if showBonus}
			<div class="bonus-section">
				<span class="bonus-value">+{bonusCount}원</span>
				<span class="bonus-label">보너스!</span>
			</div>
		{/if}

		<!-- 안내 텍스트 -->
		{#if canClose}
			<div class="tap-hint">탭하여 계속</div>
		{/if}
	</div>
</button>

<style lang="postcss">
	@reference '$styles/app.css';

	.modal-overlay {
		@apply fixed inset-0 z-[100];
		@apply flex items-center justify-center;
		@apply h-full w-full;
		@apply border-none;
		@apply cursor-pointer;
		background: rgba(0, 0, 0, 0.7);
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			background: rgba(0, 0, 0, 0);
		}
		to {
			background: rgba(0, 0, 0, 0.7);
		}
	}

	.modal-content {
		@apply relative;
		@apply flex flex-col items-center;
		@apply rounded-3xl p-6;
		width: 260px;
		background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%);
		border: 4px solid #10b981;
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.3),
			0 0 0 6px rgba(16, 185, 129, 0.3);
		transform: scale(0) rotate(-10deg);
		opacity: 0;
		transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.modal-content.show {
		transform: scale(1) rotate(0deg);
		opacity: 1;
	}

	/* 파티클 */
	.particles {
		@apply absolute inset-0;
		@apply pointer-events-none;
		overflow: hidden;
	}

	.particle {
		@apply absolute;
		font-size: 20px;
		top: 50%;
		animation: particleFly linear forwards;
	}

	@keyframes particleFly {
		0% {
			transform: translateY(0) scale(0);
			opacity: 1;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: translateY(-150px) scale(1);
			opacity: 0;
		}
	}

	/* 헤더 */
	.header {
		@apply flex items-center gap-2;
		@apply mb-3;
	}

	.header-icon {
		font-size: 24px;
		animation: sparkle 0.6s ease-in-out infinite alternate;
	}

	@keyframes sparkle {
		from {
			transform: scale(1) rotate(0deg);
		}
		to {
			transform: scale(1.2) rotate(10deg);
		}
	}

	.header-text {
		@apply font-black;
		font-size: 24px;
		color: #065f46;
		text-shadow: 0 2px 0 rgba(255, 255, 255, 0.5);
	}

	/* 손님 영역 */
	.customer-area {
		@apply flex flex-col items-center;
		@apply mb-4;
	}

	.customer-emoji {
		font-size: 56px;
		animation: happyBounce 0.8s ease-out;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	@keyframes happyBounce {
		0% {
			transform: scale(0) rotate(-20deg);
		}
		50% {
			transform: scale(1.3) rotate(10deg);
		}
		70% {
			transform: scale(0.9) rotate(-5deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
		}
	}

	.customer-message {
		@apply mt-2;
		@apply rounded-xl px-4 py-2;
		@apply font-bold;
		font-size: 14px;
		color: #065f46;
		background: white;
		border: 2px solid #34d399;
		box-shadow: 0 2px 0 #10b981;
	}

	/* 보너스 섹션 */
	.bonus-section {
		@apply flex flex-col items-center;
		@apply rounded-2xl px-8 py-4;
		background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
		border: 3px solid #d97706;
		box-shadow:
			0 4px 0 #b45309,
			0 8px 20px rgba(245, 158, 11, 0.4);
		animation: bonusPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes bonusPopIn {
		0% {
			transform: scale(0) rotate(20deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
		}
	}

	.bonus-value {
		@apply font-black;
		font-size: 32px;
		color: #78350f;
		text-shadow:
			0 2px 0 rgba(255, 255, 255, 0.5),
			0 -1px 0 #d97706;
	}

	.bonus-label {
		@apply font-bold;
		font-size: 14px;
		color: #92400e;
	}

	/* 탭 힌트 */
	.tap-hint {
		@apply mt-4;
		@apply font-medium;
		font-size: 12px;
		color: #6b7280;
		animation: tapPulse 1.5s ease-in-out infinite;
	}

	@keyframes tapPulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}
</style>
