<script lang="ts">
	import { onMount } from 'svelte';
	import type { CustomerOrder } from '../lib/customer-store';
	import { getCustomerImagePath } from '../lib/customer-store';

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
		setTimeout(() => {
			showContent = true;
		}, 100);

		setTimeout(() => {
			showBonus = true;
			animateBonus();
		}, 500);

		setTimeout(() => {
			showParticles = true;
		}, 800);

		setTimeout(() => {
			canClose = true;
		}, 1500);

		const autoCloseTimer = setTimeout(() => {
			handleTap();
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

	let isExiting = $state(false);

	function handleTap() {
		if (canClose && !isExiting) {
			isExiting = true;
			setTimeout(() => {
				onClose();
			}, 300);
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

<button class="modal-overlay" class:exit={isExiting} onclick={handleTap} aria-label="닫기">
	<!-- 딤 영역 상단 타이틀 -->
	<div class="floating-title" class:show={showContent}>
		<span class="title-text">주문 완료!</span>
	</div>

	<div class="modal-content" class:show={showContent} class:exit={isExiting}>
		<!-- 캐릭터 (모달 상단에 걸침) -->
		<img
			class="customer-image"
			src={getCustomerImagePath(order.customerId, 'success')}
			alt="손님"
		/>

		<!-- 파티클 효과 -->
		{#if showParticles}
			<div class="particles">
				{#each particles as particle (particle.id)}
					<span
						class="particle"
						style="left: {particle.x}%; animation-delay: {particle.delay}s; animation-duration: {particle.duration}s;"
					>
						{particle.emoji}
					</span>
				{/each}
			</div>
		{/if}

		<!-- 손님 대사 -->
		<div class="customer-message">"{order.completeMessage}"</div>

		<!-- 보너스 -->
		{#if showBonus}
			<div class="bonus-section">
				<span class="bonus-label">팁</span>
				<span class="bonus-value">+{bonusCount}원</span>
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
		@apply h-full w-full cursor-pointer border-none;
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

	/* 딤 영역 상단 타이틀 */
	.floating-title {
		@apply absolute flex items-center justify-center;
		top: 40px;
		left: 0;
		right: 0;
		width: 100%;
		padding: 0 16px;
		transform: translateY(-20px);
		opacity: 0;
		transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		z-index: 10;
	}

	.floating-title.show {
		transform: translateY(0);
		opacity: 1;
	}

	.title-text {
		@apply font-black;
		font-size: 24px;
		color: white;
	}

	.modal-content {
		@apply relative flex flex-col items-center rounded-3xl p-6;
		padding-top: 70px;
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

	.modal-overlay.exit {
		background: rgba(0, 0, 0, 0);
		transition: background 0.3s ease-out;
	}

	.modal-content.exit {
		transform: scale(0.3) translate(-150px, -200px);
		opacity: 0;
		transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
	}

	/* 파티클 */
	.particles {
		@apply pointer-events-none absolute inset-0;
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

	/* 캐릭터 이미지 */
	.customer-image {
		position: absolute;
		top: -60px;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: 120px;
		object-fit: contain;
		animation: happyBounce 0.8s ease-out backwards;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
		z-index: 1;
	}

	@keyframes happyBounce {
		0% {
			transform: translateX(-50%) scale(0) rotate(-20deg);
		}
		50% {
			transform: translateX(-50%) scale(1.3) rotate(10deg);
		}
		70% {
			transform: translateX(-50%) scale(0.9) rotate(-5deg);
		}
		100% {
			transform: translateX(-50%) scale(1) rotate(0deg);
		}
	}

	.customer-message {
		@apply mb-3 rounded-xl px-4 py-2 font-bold;
		font-size: 14px;
		color: #065f46;
		background: white;
		border: 2px solid #34d399;
		box-shadow: 0 2px 0 #10b981;
	}

	/* 보너스 섹션 */
	.bonus-section {
		@apply flex items-center gap-3 rounded-2xl px-6 py-3;
		background: linear-gradient(180deg, #059669 0%, #047857 100%);
		border: 3px solid #065f46;
		box-shadow:
			0 4px 0 #064e3b,
			0 8px 20px rgba(5, 150, 105, 0.4);
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

	.bonus-label {
		@apply font-bold;
		font-size: 14px;
		color: #fde047;
		animation: labelBlink 0.25s linear infinite;
	}

	@keyframes labelBlink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	.bonus-value {
		@apply font-black;
		font-size: 28px;
		color: white;
	}

	/* 탭 힌트 */
	.tap-hint {
		@apply mt-4 font-medium;
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
