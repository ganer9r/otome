<script lang="ts">
	import { GRADE_COLORS } from '../lib/types';
	import type { CustomerOrder, OrderHint } from '../lib/customer-store';

	interface Props {
		order: CustomerOrder;
		hints: OrderHint[];
		onConfirm: () => void;
	}

	let { order, hints, onConfirm }: Props = $props();

	// 애니메이션 단계 상태
	let animationPhase = $state<'enter' | 'show' | 'ready'>('enter');

	// 등장 애니메이션 타이밍
	$effect(() => {
		// enter -> show (0.3초 후)
		const timer1 = setTimeout(() => {
			animationPhase = 'show';
		}, 300);

		// show -> ready (0.6초 후)
		const timer2 = setTimeout(() => {
			animationPhase = 'ready';
		}, 600);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
		};
	});

	// 힌트 텍스트 생성
	let hintText = $derived(() => {
		return hints.map((h) => (h.revealed ? h.name : '???')).join(' + ');
	});

	// 전체 공개 여부 (F급)
	let isFullyRevealed = $derived(hints.every((h) => h.revealed));
</script>

<div class="modal-overlay" class:enter={animationPhase === 'enter'}>
	<div class="modal-content" class:show={animationPhase !== 'enter'}>
		<!-- 헤더 -->
		<div class="modal-header">
			<span class="bell-icon">🔔</span>
			<span class="header-text">새 주문!</span>
		</div>

		<!-- 손님 영역 -->
		<div class="customer-area">
			<div class="customer-emoji">😊</div>
			<div class="customer-message">"{order.arrivalMessage}"</div>
		</div>

		<!-- 요리 정보 -->
		<div class="dish-card">
			<div class="dish-header">
				<span class="dish-grade" style="background-color: {GRADE_COLORS[order.dish.grade]}">
					{order.dish.grade}
				</span>
				<span class="dish-name">{order.dish.name}</span>
			</div>
			<div class="dish-bonus">
				<span class="bonus-label">보너스</span>
				<span class="bonus-value">+{order.bonusAmount}원</span>
			</div>
		</div>

		<!-- 힌트 영역 -->
		<div class="hint-section" class:full-reveal={isFullyRevealed}>
			<div class="hint-icon">💡</div>
			<div class="hint-content">
				{#if isFullyRevealed}
					<div class="hint-formula">
						{#each hints as hint, i}
							<span class="hint-item revealed">{hint.name}</span>
							{#if i < hints.length - 1}
								<span class="hint-plus">+</span>
							{/if}
						{/each}
						<span class="hint-equals">=</span>
						<span class="hint-result">{order.dish.name}</span>
					</div>
				{:else}
					<div class="hint-formula">
						{#each hints as hint, i}
							{#if hint.revealed}
								<span class="hint-item revealed">{hint.name}</span>
							{:else}
								<span class="hint-item unknown">???</span>
							{/if}
							{#if i < hints.length - 1}
								<span class="hint-plus">+</span>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- 확인 버튼 -->
		<button
			class="confirm-btn"
			class:ready={animationPhase === 'ready'}
			onclick={onConfirm}
			disabled={animationPhase !== 'ready'}
		>
			알겠어요!
		</button>
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.modal-overlay {
		@apply fixed inset-0 z-[100];
		@apply flex items-center justify-center;
		background: rgba(0, 0, 0, 0.7);
		animation: fadeIn 0.3s ease-out;
	}

	.modal-overlay.enter {
		background: rgba(0, 0, 0, 0);
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
		@apply rounded-3xl p-5;
		width: 280px;
		background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
		border: 4px solid #f59e0b;
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.3),
			0 0 0 6px rgba(245, 158, 11, 0.3);
		transform: scale(0.5) translateY(50px);
		opacity: 0;
		transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.modal-content.show {
		transform: scale(1) translateY(0);
		opacity: 1;
	}

	/* 헤더 */
	.modal-header {
		@apply flex items-center gap-2;
		@apply mb-3;
	}

	.bell-icon {
		font-size: 28px;
		animation: bellRing 0.5s ease-in-out 0.5s;
	}

	@keyframes bellRing {
		0%,
		100% {
			transform: rotate(0deg);
		}
		20% {
			transform: rotate(15deg);
		}
		40% {
			transform: rotate(-15deg);
		}
		60% {
			transform: rotate(10deg);
		}
		80% {
			transform: rotate(-10deg);
		}
	}

	.header-text {
		@apply font-black;
		font-size: 22px;
		color: #78350f;
		text-shadow: 0 2px 0 rgba(255, 255, 255, 0.5);
	}

	/* 손님 영역 */
	.customer-area {
		@apply flex flex-col items-center;
		@apply mb-4;
	}

	.customer-emoji {
		font-size: 48px;
		animation: customerBounce 0.6s ease-out 0.3s;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	@keyframes customerBounce {
		0% {
			transform: scale(0);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}

	.customer-message {
		@apply mt-2;
		@apply rounded-xl px-4 py-2;
		@apply font-bold;
		font-size: 14px;
		color: #78350f;
		background: white;
		border: 2px solid #fcd34d;
		box-shadow: 0 2px 0 #f59e0b;
	}

	/* 요리 카드 */
	.dish-card {
		@apply w-full;
		@apply rounded-xl p-3;
		@apply mb-3;
		background: white;
		border: 2px solid #e5e7eb;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.dish-header {
		@apply flex items-center gap-2;
		@apply mb-2;
	}

	.dish-grade {
		@apply rounded px-2 py-0.5;
		@apply font-bold text-white;
		font-size: 12px;
	}

	.dish-name {
		@apply font-bold;
		font-size: 16px;
		color: #1f2937;
	}

	.dish-bonus {
		@apply flex items-center justify-between;
		@apply rounded-lg bg-amber-50 px-3 py-2;
		border: 1px solid #fcd34d;
	}

	.bonus-label {
		@apply font-medium;
		font-size: 12px;
		color: #92400e;
	}

	.bonus-value {
		@apply font-bold;
		font-size: 16px;
		color: #d97706;
	}

	/* 힌트 섹션 */
	.hint-section {
		@apply w-full;
		@apply flex items-start gap-2;
		@apply rounded-xl p-3;
		@apply mb-4;
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
		border: 2px solid #fbbf24;
	}

	.hint-section.full-reveal {
		background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
		border-color: #34d399;
	}

	.hint-icon {
		font-size: 20px;
		flex-shrink: 0;
	}

	.hint-content {
		@apply flex-1;
	}

	.hint-formula {
		@apply flex items-center gap-1;
		@apply flex-wrap;
	}

	.hint-item {
		@apply rounded px-2 py-1;
		@apply font-bold;
		font-size: 13px;
	}

	.hint-item.revealed {
		background: #d1fae5;
		color: #065f46;
		border: 1px solid #10b981;
	}

	.hint-item.unknown {
		background: #fee2e2;
		color: #dc2626;
		border: 1px solid #f87171;
	}

	.hint-plus,
	.hint-equals {
		@apply font-bold;
		font-size: 14px;
		color: #78350f;
	}

	.hint-result {
		@apply rounded px-2 py-1;
		@apply font-bold;
		font-size: 13px;
		background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
		color: #78350f;
		border: 1px solid #d97706;
	}

	/* 확인 버튼 */
	.confirm-btn {
		@apply w-full;
		@apply rounded-xl py-3;
		@apply font-bold;
		font-size: 16px;
		color: white;
		background: linear-gradient(180deg, #9ca3af 0%, #6b7280 100%);
		border: none;
		border-bottom: 3px solid #4b5563;
		box-shadow: 0 3px 0 #374151;
		opacity: 0.6;
		transform: scale(0.95);
		transition: all 0.3s ease;
	}

	.confirm-btn.ready {
		background: linear-gradient(180deg, #34d399 0%, #10b981 100%);
		border-bottom-color: #059669;
		box-shadow: 0 3px 0 #047857;
		opacity: 1;
		transform: scale(1);
		animation: btnPulse 1s ease-in-out infinite;
	}

	.confirm-btn.ready:hover {
		filter: brightness(1.05);
	}

	.confirm-btn.ready:active {
		transform: translateY(2px);
		box-shadow: 0 1px 0 #047857;
	}

	@keyframes btnPulse {
		0%,
		100% {
			box-shadow:
				0 3px 0 #047857,
				0 0 0 0 rgba(16, 185, 129, 0.4);
		}
		50% {
			box-shadow:
				0 3px 0 #047857,
				0 0 0 8px rgba(16, 185, 129, 0);
		}
	}
</style>
