<script lang="ts">
	interface Props {
		taxAmount: number;
		capitalAfterTax: number;
		onConfirm: () => void;
	}

	let { taxAmount, capitalAfterTax, onConfirm }: Props = $props();
</script>

<div class="tax-modal">
	<div class="modal-content">
		<div class="icon">🏛️</div>
		<h2 class="title">세금 징수</h2>
		<p class="description">국세청에서 세금을 징수합니다</p>

		<div class="tax-info">
			<div class="tax-row">
				<span class="label">징수 세금</span>
				<span class="value tax">-{taxAmount.toLocaleString()}원</span>
			</div>
			<div class="divider"></div>
			<div class="tax-row">
				<span class="label">잔액</span>
				<span class="value" class:negative={capitalAfterTax < 0}>
					{capitalAfterTax.toLocaleString()}원
				</span>
			</div>
		</div>

		<button type="button" class="confirm-btn" onclick={onConfirm}>확인</button>
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.tax-modal {
		@apply fixed inset-0 z-50;
		@apply flex items-center justify-center;
		@apply bg-black/60;
	}

	.modal-content {
		@apply flex flex-col items-center;
		@apply rounded-2xl bg-white;
		@apply p-6;
		@apply mx-4;
		@apply shadow-2xl;
		@apply w-full max-w-sm;
		animation: modalPop 0.3s ease-out;
	}

	@keyframes modalPop {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.icon {
		font-size: 48px;
		@apply mb-2;
	}

	.title {
		@apply text-xl font-bold text-gray-800;
		@apply mb-1;
	}

	.description {
		@apply text-sm text-gray-500;
		@apply mb-4;
	}

	.tax-info {
		@apply w-full;
		@apply rounded-xl bg-gray-100;
		@apply p-4;
		@apply mb-4;
	}

	.tax-row {
		@apply flex items-center justify-between;
		@apply py-1;
	}

	.label {
		@apply font-medium text-gray-600;
	}

	.value {
		@apply font-bold text-gray-800;
	}

	.value.tax {
		@apply text-red-500;
	}

	.value.negative {
		@apply text-red-500;
	}

	.divider {
		@apply border-t border-gray-300;
		@apply my-2;
	}

	.confirm-btn {
		@apply w-full;
		@apply px-6 py-3;
		@apply bg-blue-500 text-white;
		@apply rounded-xl;
		@apply font-bold;
		@apply transition-all;
	}

	.confirm-btn:hover {
		@apply bg-blue-600;
	}

	.confirm-btn:active {
		@apply scale-95;
	}
</style>
