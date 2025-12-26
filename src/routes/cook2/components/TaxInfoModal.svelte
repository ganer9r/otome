<script lang="ts">
	import GameButton from './GameButton.svelte';
	import { RUN_CONFIG } from '../lib/store';

	interface Props {
		turn: number;
		turnsUntilTax: number;
		totalEarned: number;
		taxRate: number;
		onClose: () => void;
	}

	let { turn, turnsUntilTax, totalEarned, taxRate, onClose }: Props = $props();

	let taxRatePercent = $derived(Math.round(taxRate * 100));
</script>

<div
	class="tax-info-modal"
	onclick={onClose}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Escape' && onClose()}
>
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions a11y_no_static_element_interactions -->
	<div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog">
		<h2 class="title">세금 안내</h2>

		<!-- 턴 정보 -->
		<div class="info-box">
			<div class="info-row">
				<span class="label">현재 턴</span>
				<span class="value">{turn}턴</span>
			</div>
			<div class="info-row">
				<span class="label">세금 징수까지</span>
				<span class="value urgent">{turnsUntilTax}턴 남음</span>
			</div>
		</div>

		<!-- 세금 정보 -->
		<div class="info-box">
			<div class="info-row">
				<span class="label">현재 세금률</span>
				<span class="value">{taxRatePercent}%</span>
			</div>
			<div class="info-row">
				<span class="label">이번 주기 수익</span>
				<span class="value">{totalEarned.toLocaleString()}원</span>
			</div>
		</div>

		<!-- 설명 -->
		<p class="description">
			{RUN_CONFIG.TAX_INTERVAL}턴마다 세금이 징수됩니다.<br />
			자본이 0원 미만이 되면 파산합니다.
		</p>

		<GameButton variant="primary" size="lg" class="w-full" onclick={onClose}>확인</GameButton>
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.tax-info-modal {
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

	.title {
		@apply text-lg font-bold;
		color: #5d4037;
		@apply mb-3;
	}

	.info-box {
		@apply w-full;
		@apply rounded-2xl;
		@apply p-3;
		@apply mb-3;
		background: rgba(255, 255, 255, 0.8);
		border: 2px solid #e8d4a8;
	}

	.info-row {
		@apply flex items-center justify-between;
		@apply py-1;
	}

	.label {
		@apply text-sm;
		color: #8d6e63;
	}

	.value {
		@apply text-sm font-bold;
		color: #5d4037;
	}

	.value.urgent {
		color: #e53935;
	}

	.description {
		@apply text-center text-sm;
		@apply mb-4;
		color: #8d6e63;
		line-height: 1.5;
	}
</style>
