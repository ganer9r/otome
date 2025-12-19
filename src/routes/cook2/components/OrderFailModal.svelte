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
		'아쉽네요...',
		'다음엔 꼭요!',
		'기다렸는데...',
		'배고픈데...',
		'흑흑...',
		'다른 데 가볼게요...',
		'시간이 없어서요...',
		'아쉬워요~'
	];

	const failMessage = FAIL_MESSAGES[Math.floor(Math.random() * FAIL_MESSAGES.length)];
</script>

<button class="modal-overlay" onclick={onClose} aria-label="닫기">
	<div class="modal-content">
		<!-- 헤더 -->
		<div class="header">
			<span class="header-text">주문 실패...</span>
		</div>

		<!-- 손님 실망 -->
		<div class="customer-area">
			<img class="customer-image" src={getCustomerImagePath(order.customerId, 'fail')} alt="손님" />
			<div class="customer-message">"{failMessage}"</div>
		</div>

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
		background: linear-gradient(180deg, #fef2f2 0%, #fee2e2 100%);
		border: 4px solid #ef4444;
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.3),
			0 0 0 6px rgba(239, 68, 68, 0.3);
		transform: scale(0) rotate(10deg);
		opacity: 0;
		animation: modalShow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	@keyframes modalShow {
		to {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	/* 헤더 */
	.header {
		@apply flex items-center gap-2;
		@apply mb-3;
	}

	.header-text {
		@apply font-black;
		font-size: 24px;
		color: #991b1b;
		text-shadow: 0 2px 0 rgba(255, 255, 255, 0.5);
	}

	/* 손님 영역 */
	.customer-area {
		@apply flex flex-col items-center;
		@apply mb-4;
	}

	.customer-image {
		width: 100px;
		height: 100px;
		object-fit: contain;
		animation: sadShake 0.8s ease-out;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	@keyframes sadShake {
		0% {
			transform: scale(0) rotate(0deg);
		}
		30% {
			transform: scale(1.1) rotate(-5deg);
		}
		50% {
			transform: scale(1) rotate(5deg);
		}
		70% {
			transform: scale(1.05) rotate(-3deg);
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
		color: #991b1b;
		background: white;
		border: 2px solid #fca5a5;
		box-shadow: 0 2px 0 #ef4444;
	}

	/* 주문 정보 */
	.order-info {
		@apply flex items-center gap-2;
		@apply rounded-xl px-4 py-2;
		@apply mb-4;
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
