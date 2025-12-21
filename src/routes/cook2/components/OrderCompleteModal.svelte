<script lang="ts">
	import { onMount } from 'svelte';
	import type { CustomerOrder } from '../lib/customer-store';
	import { getCustomerImagePath } from '../lib/customer-store';
	import AnticipationOverlay from './AnticipationOverlay.svelte';
	import GameButton from './GameButton.svelte';
	import CoinFlyEffect from './CoinFlyEffect.svelte';

	interface Props {
		order: CustomerOrder;
		onClose: () => void;
		autoClose?: boolean;
		/** 코인 타겟 위치 (capital-badge) */
		coinTargetX?: number;
		coinTargetY?: number;
	}

	let { order, onClose, autoClose = false, coinTargetX, coinTargetY }: Props = $props();

	// 기대감 연출 완료 여부
	let showAnticipation = $state(true);

	// 애니메이션 상태
	let showContent = $state(false);
	let bonusCount = $state(0);
	let canClose = $state(false);

	function onAnticipationComplete() {
		showAnticipation = false;
		showContent = true;

		setTimeout(() => {
			animateBonus();
		}, 500);

		setTimeout(() => {
			canClose = true;
		}, 1500);

		if (autoClose) {
			setTimeout(() => {
				handleClose();
			}, 3000);
		}
	}

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
	let showCoinEffect = $state(false);
	let coinStartX = $state(0);
	let coinStartY = $state(0);
	let actualTargetX = $state(0);
	let actualTargetY = $state(0);
	let bonusCardRef = $state<HTMLDivElement | null>(null);

	function handleClose() {
		if (canClose && !isExiting) {
			// 보너스 카드 위치에서 코인 시작
			if (bonusCardRef) {
				const rect = bonusCardRef.getBoundingClientRect();
				coinStartX = rect.left + rect.width / 2;
				coinStartY = rect.top + rect.height / 2;
			}

			// 타겟 위치 결정 (props 없으면 DOM에서 찾기)
			if (coinTargetX && coinTargetY) {
				actualTargetX = coinTargetX;
				actualTargetY = coinTargetY;
			} else {
				const capitalBadge = document.querySelector('.capital-badge');
				if (capitalBadge) {
					const rect = capitalBadge.getBoundingClientRect();
					actualTargetX = rect.left + rect.width / 2;
					actualTargetY = rect.top + rect.height / 2;
				} else {
					// fallback: 화면 상단 좌측
					actualTargetX = 80;
					actualTargetY = 40;
				}
			}

			// 코인 효과 시작 (모달은 유지)
			showCoinEffect = true;
		}
	}

	function onCoinComplete() {
		// 코인 효과 완료 후 모달 exit
		showCoinEffect = false;
		isExiting = true;

		// exit 애니메이션 후 onClose
		setTimeout(() => {
			onClose();
		}, 300);
	}
</script>

<!-- 기대감 연출 -->
{#if showAnticipation}
	<AnticipationOverlay onComplete={onAnticipationComplete} />
{/if}

<div class="modal-overlay" class:exit={isExiting} class:hidden={showAnticipation}>
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

		<!-- 손님 대사 -->
		<div class="customer-message">"{order.completeMessage}"</div>

		<!-- 보너스 카드 -->
		<div class="bonus-card" bind:this={bonusCardRef}>
			<div class="bonus-header">
				<img src="/imgs/ui/coin.png" alt="coin" class="bonus-icon" />
				<span class="bonus-title">보너스를 받았어요!</span>
			</div>
			<div class="bonus-amount">
				<span class="bonus-label">보너스</span>
				<span class="bonus-value">+{bonusCount}원</span>
			</div>
		</div>

		<!-- 닫기 버튼 -->
		<GameButton
			variant="primary"
			size="lg"
			class="close-btn {canClose ? 'ready' : ''}"
			onclick={handleClose}
			disabled={!canClose}
		>
			확인
		</GameButton>
	</div>
</div>

<!-- 코인 날아가는 효과 -->
{#if showCoinEffect}
	<CoinFlyEffect
		coinCount={15}
		startX={coinStartX}
		startY={coinStartY}
		targetX={actualTargetX}
		targetY={actualTargetY}
		onComplete={onCoinComplete}
	/>
{/if}

<style lang="postcss">
	@reference '$styles/app.css';

	.modal-overlay {
		@apply fixed inset-0 z-[100];
		@apply flex items-center justify-center;
		@apply h-full w-full;
		background: rgba(0, 0, 0, 0.7);
	}

	.modal-overlay.hidden {
		display: none;
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
		@apply relative flex flex-col items-center rounded-3xl p-5;
		padding-top: 70px;
		width: 280px;
		background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
		border: 4px solid #f59e0b;
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.3),
			0 0 0 6px rgba(245, 158, 11, 0.3);
		transform: scale(0);
		opacity: 0;
	}

	.modal-content.show {
		animation: successBounce 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	@keyframes successBounce {
		0% {
			transform: scale(0) rotate(-15deg);
			opacity: 0;
		}
		40% {
			transform: scale(1.15) rotate(5deg);
			opacity: 1;
		}
		60% {
			transform: scale(0.95) rotate(-3deg);
		}
		80% {
			transform: scale(1.05) rotate(1deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
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
		color: #78350f;
		background: white;
		border: 2px solid #fcd34d;
		box-shadow: 0 2px 0 #f59e0b;
	}

	/* 보너스 카드 */
	.bonus-card {
		@apply mb-3 w-full rounded-xl p-3;
		background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
		border: 3px solid #34d399;
		box-shadow:
			0 4px 12px rgba(16, 185, 129, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.bonus-header {
		@apply mb-2 flex items-center gap-2;
	}

	.bonus-icon {
		width: 24px;
		height: 24px;
	}

	.bonus-title {
		@apply font-bold;
		font-size: 14px;
		color: #065f46;
	}

	.bonus-amount {
		@apply flex items-center justify-between rounded-lg px-3 py-2;
		background: linear-gradient(180deg, #059669 0%, #047857 100%);
		border: 2px solid #065f46;
		box-shadow: 0 2px 8px rgba(5, 150, 105, 0.4);
	}

	.bonus-label {
		@apply font-bold;
		font-size: 13px;
		color: #fde047;
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
		font-size: 18px;
		color: white;
	}

	/* 닫기 버튼 */
	:global(.close-btn) {
		@apply w-full;
		opacity: 0.6;
		transition: all 0.3s ease;
	}

	:global(.close-btn.ready) {
		opacity: 1;
	}
</style>
