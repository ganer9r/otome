<script lang="ts">
	interface Props {
		/** 파산 여부 */
		isBankrupt: boolean;
		/** 생존 턴 수 */
		survivedTurns: number;
		/** 획득 스타 수 */
		earnedStars: number;
		/** 최종 자본 */
		finalCapital: number;
		/** 확인 버튼 콜백 */
		onConfirm: () => void;
	}

	let { isBankrupt, survivedTurns, earnedStars, finalCapital, onConfirm }: Props = $props();
</script>

<div class="run-end-modal">
	<div class="modal-content">
		<!-- 아이콘 -->
		<div class="icon">
			{#if isBankrupt}
				💸
			{:else}
				🏁
			{/if}
		</div>

		<!-- 타이틀 -->
		<h2 class="title">
			{#if isBankrupt}
				파산!
			{:else}
				런 종료
			{/if}
		</h2>

		{#if isBankrupt}
			<p class="description">세금을 납부할 수 없어 파산했습니다</p>
		{:else}
			<p class="description">수고하셨습니다!</p>
		{/if}

		<!-- 결과 정보 -->
		<div class="result-info">
			<div class="result-row">
				<span class="label">생존 턴</span>
				<span class="value">{survivedTurns}턴</span>
			</div>
			<div class="result-row">
				<span class="label">최종 자본</span>
				<span class="value" class:negative={finalCapital < 0}>
					{finalCapital.toLocaleString()}원
				</span>
			</div>
			<div class="divider"></div>
			<div class="result-row star-row">
				<span class="label">획득 스타</span>
				<span class="value star">
					<img src="/imgs/ui/star.png" alt="star" class="star-icon" />
					<span>{earnedStars}</span>
				</span>
			</div>
		</div>

		<!-- 확인 버튼 -->
		<button type="button" class="confirm-btn" onclick={onConfirm}> 확인 </button>
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.run-end-modal {
		@apply fixed inset-0 z-50;
		@apply flex items-center justify-center;
		background: rgba(0, 0, 0, 0.7);
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

	.icon {
		font-size: 56px;
		@apply mb-2;
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

	.result-info {
		@apply w-full;
		@apply rounded-2xl;
		@apply p-4;
		@apply mb-4;
		background: rgba(255, 255, 255, 0.8);
		border: 3px solid #e8d4a8;
	}

	.result-row {
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

	.value.negative {
		color: #d32f2f;
	}

	.divider {
		border-top: 2px solid #e8d4a8;
		@apply my-2;
	}

	.star-row {
		@apply pt-2;
	}

	.value.star {
		@apply flex items-center gap-1;
		color: #e65100;
		font-size: 1.25rem;
	}

	.star-icon {
		width: 22px;
		height: 22px;
	}

	.confirm-btn {
		@apply w-full;
		@apply px-6 py-3;
		@apply rounded-xl;
		@apply font-bold;
		@apply transition-all;
		background: linear-gradient(to bottom, #ffb74d, #ff9800);
		color: #5d4037;
		border: 3px solid #f57c00;
		box-shadow: 0 4px 0 #e65100;
	}

	.confirm-btn:hover {
		filter: brightness(1.05);
	}

	.confirm-btn:active {
		box-shadow: 0 2px 0 #e65100;
		transform: translateY(2px) scale(0.95);
	}
</style>
