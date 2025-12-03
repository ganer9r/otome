<script lang="ts">
	import { getChefImage, getRandomDialogue } from '../lib/chef-images';

	interface Props {
		finalCapital: number;
		onConfirm: () => void;
	}

	let { finalCapital, onConfirm }: Props = $props();

	const chefImage = getChefImage('angry');
	const chefDialogue = getRandomDialogue('angry');
</script>

<div class="bankrupt-modal">
	<div class="modal-content">
		<!-- 캐릭터 -->
		<div class="chef-area">
			<img src={chefImage} alt="셰프" class="chef-img" />
			<div class="chef-bubble">{chefDialogue}</div>
		</div>
		<h2 class="title">파산!</h2>
		<p class="description">세금을 납부할 수 없어 파산했습니다</p>

		<div class="result-info">
			<div class="result-row">
				<span class="label">최종 잔액</span>
				<span class="value negative">{finalCapital.toLocaleString()}원</span>
			</div>
		</div>

		<button type="button" class="confirm-btn" onclick={onConfirm}>다시 시작</button>
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.bankrupt-modal {
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
		animation: shake 0.5s ease-out;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translateX(-5px);
		}
		20%,
		40%,
		60%,
		80% {
			transform: translateX(5px);
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
		border: 3px solid #d32f2f;
		color: #d32f2f;
		box-shadow: 0 3px 0 #b71c1c;
	}

	.title {
		@apply text-2xl font-bold text-red-600;
		@apply mb-1;
	}

	.description {
		@apply text-sm text-gray-500;
		@apply mb-4;
		@apply text-center;
	}

	.result-info {
		@apply w-full;
		@apply rounded-xl bg-red-50;
		@apply p-4;
		@apply mb-4;
		@apply border-2 border-red-200;
	}

	.result-row {
		@apply flex items-center justify-between;
	}

	.label {
		@apply font-medium text-gray-600;
	}

	.value {
		@apply font-bold;
	}

	.value.negative {
		@apply text-red-500;
		font-size: 1.25rem;
	}

	.confirm-btn {
		@apply w-full;
		@apply px-6 py-3;
		@apply bg-red-500 text-white;
		@apply rounded-xl;
		@apply font-bold;
		@apply transition-all;
	}

	.confirm-btn:hover {
		@apply bg-red-600;
	}

	.confirm-btn:active {
		@apply scale-95;
	}
</style>
