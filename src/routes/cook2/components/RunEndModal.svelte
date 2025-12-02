<script lang="ts">
	import { Star } from 'lucide-svelte';

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
					<Star size={18} class="star-icon" />
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
		@apply bg-black/70;
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
		font-size: 56px;
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

	.result-info {
		@apply w-full;
		@apply rounded-xl bg-gray-100;
		@apply p-4;
		@apply mb-4;
	}

	.result-row {
		@apply flex items-center justify-between;
		@apply py-1;
	}

	.label {
		@apply font-medium text-gray-600;
	}

	.value {
		@apply font-bold text-gray-800;
	}

	.value.negative {
		@apply text-red-500;
	}

	.divider {
		@apply border-t border-gray-300;
		@apply my-2;
	}

	.star-row {
		@apply pt-2;
	}

	.value.star {
		@apply flex items-center gap-1;
		@apply text-yellow-500;
		font-size: 1.25rem;
	}

	.value.star :global(.star-icon) {
		@apply text-yellow-400;
		fill: currentColor;
	}

	.confirm-btn {
		@apply w-full;
		@apply px-6 py-3;
		@apply bg-orange-500 text-white;
		@apply rounded-xl;
		@apply font-bold;
		@apply transition-all;
	}

	.confirm-btn:hover {
		@apply bg-orange-600;
	}

	.confirm-btn:active {
		@apply scale-95;
	}
</style>
