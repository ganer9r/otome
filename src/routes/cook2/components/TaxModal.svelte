<script lang="ts">
	import { getChefImage, getRandomDialogue } from '../lib/chef-images';

	interface Props {
		taxAmount: number;
		capitalAfterTax: number;
		onConfirm: () => void;
	}

	let { taxAmount, capitalAfterTax, onConfirm }: Props = $props();

	const chefImage = getChefImage('sad');
	const chefDialogue = getRandomDialogue('sad');
</script>

<div class="tax-modal">
	<div class="modal-content">
		<!-- 캐릭터 -->
		<div class="chef-area">
			<img src={chefImage} alt="셰프" class="chef-img" />
			<div class="chef-bubble">{chefDialogue}</div>
		</div>

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
		background: rgba(0, 0, 0, 0.6);
	}

	.modal-content {
		@apply flex flex-col items-center;
		@apply rounded-3xl;
		@apply p-6;
		@apply mx-4;
		@apply w-full max-w-sm;
		background: linear-gradient(to bottom, #fffde7, #fff8e1);
		border: 4px solid #e8d4a8;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.25),
			inset 0 2px 0 rgba(255, 255, 255, 0.8);
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

	/* 캐릭터 영역 */
	.chef-area {
		@apply flex flex-col items-center;
		@apply mb-4;
	}

	.chef-img {
		width: 100px;
		height: auto;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	.chef-bubble {
		@apply mt-2 px-4 py-2;
		@apply rounded-xl;
		@apply text-sm font-bold;
		background: white;
		border: 3px solid #5d4037;
		color: #5d4037;
		box-shadow: 0 3px 0 #3e2723;
	}

	.title {
		@apply text-xl font-bold;
		color: #5d4037;
		@apply mb-1;
	}

	.description {
		@apply text-sm font-medium;
		color: #8d6e63;
		@apply mb-4;
	}

	.tax-info {
		@apply w-full;
		@apply rounded-2xl;
		@apply p-4;
		@apply mb-4;
		background: rgba(255, 255, 255, 0.8);
		border: 3px solid #e8d4a8;
	}

	.tax-row {
		@apply flex items-center justify-between;
		@apply py-1;
	}

	.label {
		@apply font-bold;
		color: #8d6e63;
	}

	.value {
		@apply font-bold;
		color: #5d4037;
	}

	.value.tax {
		color: #d32f2f;
	}

	.value.negative {
		color: #d32f2f;
	}

	.divider {
		border-top: 2px solid #e8d4a8;
		@apply my-2;
	}

	.confirm-btn {
		@apply w-full;
		@apply px-6 py-3;
		@apply rounded-xl;
		@apply font-bold;
		@apply transition-all;
		background: linear-gradient(to bottom, #64b5f6, #2196f3);
		color: white;
		border: 3px solid #1976d2;
		box-shadow: 0 4px 0 #1565c0;
	}

	.confirm-btn:hover {
		filter: brightness(1.05);
	}

	.confirm-btn:active {
		box-shadow: 0 2px 0 #1565c0;
		transform: translateY(2px) scale(0.95);
	}
</style>
