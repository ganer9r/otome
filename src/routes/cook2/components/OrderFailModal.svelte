<script lang="ts">
	import type { CustomerOrder } from '../lib/customer-store';
	import { getCustomerImagePath } from '../lib/customer-store';

	interface Props {
		order: CustomerOrder;
		onClose: () => void;
	}

	let { order, onClose }: Props = $props();

	// 실패 대사 풀
	const FAIL_MESSAGES = [
		'아쉽~',
		'다음에 또 올게!',
		'바빠서 먼저 갈게~',
		'배고파서 다른 데 갈게!',
		'다음엔 꼭!',
		'또 올게요~',
		'시간이 없어서~',
		'다음에 봐요!'
	];

	const failMessage = FAIL_MESSAGES[Math.floor(Math.random() * FAIL_MESSAGES.length)];

	let isExiting = $state(false);
	let showContent = $state(false);

	// 등장 애니메이션
	$effect(() => {
		setTimeout(() => {
			showContent = true;
		}, 100);
	});

	function handleClose() {
		if (!isExiting) {
			isExiting = true;
			setTimeout(() => {
				onClose();
			}, 300);
		}
	}
</script>

<button class="modal-overlay" class:exit={isExiting} onclick={handleClose} aria-label="닫기">
	<!-- 딤 영역 상단 타이틀 -->
	<div class="floating-title" class:show={showContent}>
		<span class="title-text">손님이 떠났어요</span>
	</div>

	<div class="modal-content" class:show={showContent} class:exit={isExiting}>
		<!-- 캐릭터 (모달 상단에 걸침) -->
		<img class="customer-image" src={getCustomerImagePath(order.customerId, 'fail')} alt="손님" />

		<!-- 손님 대사 -->
		<div class="customer-message">"{failMessage}"</div>

		<!-- 실패한 주문 정보 -->
		<div class="order-info">
			<span class="order-label">주문:</span>
			<span class="order-dish">{order.dish.name}</span>
		</div>

		<!-- 안내 텍스트 -->
		<div class="tap-hint">탭하여 계속</div>
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
		background: linear-gradient(180deg, #fef2f2 0%, #fee2e2 100%);
		border: 4px solid #ef4444;
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.3),
			0 0 0 6px rgba(239, 68, 68, 0.3);
		transform: scale(0) rotate(10deg);
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

	/* 캐릭터 이미지 */
	.customer-image {
		position: absolute;
		top: -60px;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: 120px;
		object-fit: contain;
		animation: sadShake 0.8s ease-out backwards;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
		z-index: 1;
	}

	@keyframes sadShake {
		0% {
			transform: translateX(-50%) scale(0) rotate(0deg);
		}
		30% {
			transform: translateX(-50%) scale(1.1) rotate(-5deg);
		}
		50% {
			transform: translateX(-50%) scale(1) rotate(5deg);
		}
		70% {
			transform: translateX(-50%) scale(1.05) rotate(-3deg);
		}
		100% {
			transform: translateX(-50%) scale(1) rotate(0deg);
		}
	}

	.customer-message {
		@apply mb-3 rounded-xl px-4 py-2 font-bold;
		font-size: 14px;
		color: #991b1b;
		background: white;
		border: 2px solid #fca5a5;
		box-shadow: 0 2px 0 #ef4444;
	}

	/* 주문 정보 */
	.order-info {
		@apply mb-4 flex items-center gap-2 rounded-xl px-4 py-2;
		background: rgba(255, 255, 255, 0.8);
		border: 2px solid #fecaca;
	}

	.order-label {
		@apply font-medium;
		font-size: 12px;
		color: #991b1b;
	}

	.order-dish {
		@apply font-bold;
		font-size: 14px;
		color: #7f1d1d;
	}

	/* 탭 힌트 */
	.tap-hint {
		@apply font-medium;
		font-size: 12px;
		color: #9ca3af;
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
