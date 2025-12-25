<script lang="ts">
	import { GRADE_COLORS } from '../lib/types';
	import type { CustomerOrder, OrderHint } from '../lib/customer-store';
	import { getCustomerImagePath } from '../lib/customer-store';
	import AnticipationOverlay from './AnticipationOverlay.svelte';
	import GameButton from './GameButton.svelte';
	import SpeechBubble from './SpeechBubble.svelte';

	interface Props {
		order: CustomerOrder;
		hints: OrderHint[];
		onConfirm: () => void;
	}

	let { order, hints, onConfirm }: Props = $props();

	// 기대감 연출 완료 여부
	let showAnticipation = $state(true);

	// 애니메이션 단계 상태
	let animationPhase = $state<'enter' | 'show' | 'ready' | 'exit'>('enter');

	function onAnticipationComplete() {
		showAnticipation = false;
		animationPhase = 'show';

		setTimeout(() => {
			animationPhase = 'ready';
		}, 300);
	}

	// 전체 공개 여부 (F급)
	let isFullyRevealed = $derived(hints.every((h) => h.revealed));

	// 확인 버튼 클릭 시 exit 애니메이션 후 onConfirm 호출
	function handleConfirm() {
		animationPhase = 'exit';
		setTimeout(() => {
			onConfirm();
		}, 300);
	}
</script>

<!-- 기대감 연출 -->
{#if showAnticipation}
	<AnticipationOverlay onComplete={onAnticipationComplete} />
{/if}

<div
	class="modal-overlay"
	class:enter={animationPhase === 'enter'}
	class:exit={animationPhase === 'exit'}
	class:hidden={showAnticipation}
>
	<!-- 딤 영역 상단 타이틀 -->
	<div class="floating-title" class:show={animationPhase !== 'enter'}>
		<span class="title-text">새로운 손님이 왔어요!</span>
	</div>

	<div
		class="modal-content"
		class:show={animationPhase !== 'enter'}
		class:exit={animationPhase === 'exit'}
	>
		<!-- 캐릭터 (모달 상단에 걸침) -->
		<img class="customer-image" src={getCustomerImagePath(order.customerId, 'order')} alt="손님" />

		<!-- 손님 대사 -->
		<SpeechBubble
			text={order.arrivalMessage}
			tailPosition="top"
			variant="customer"
			typingSpeed={40}
			fullWidth={false}
			class="mb-3"
		/>

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
		<GameButton
			variant="primary"
			size="lg"
			class="confirm-btn {animationPhase === 'ready' ? 'ready' : ''}"
			onclick={handleConfirm}
			disabled={animationPhase !== 'ready'}
		>
			확인
		</GameButton>
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

	.modal-overlay.hidden {
		display: none;
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
		@apply absolute;
		@apply flex items-center justify-center;
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
		text-shadow:
			0 2px 4px rgba(0, 0, 0, 0.5),
			0 0 20px rgba(255, 200, 50, 0.5);
	}

	.modal-content {
		@apply relative;
		@apply flex flex-col items-center;
		@apply rounded-3xl p-5;
		padding-top: 70px;
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
		animation: customerBounce 0.6s ease-out 0.3s backwards;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
		z-index: 1;
	}

	@keyframes customerBounce {
		0% {
			transform: translateX(-50%) scale(0);
		}
		50% {
			transform: translateX(-50%) scale(1.2);
		}
		100% {
			transform: translateX(-50%) scale(1);
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

	/* 요리 카드 */
	.dish-card {
		@apply mb-3 w-full rounded-xl p-3;
		background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
		border: 3px solid #34d399;
		box-shadow:
			0 4px 12px rgba(16, 185, 129, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.dish-header {
		@apply mb-2 flex items-center gap-2;
	}

	.dish-grade {
		@apply rounded px-2 py-0.5 font-bold text-white;
		font-size: 12px;
	}

	.dish-name {
		@apply font-bold;
		font-size: 16px;
		color: #1f2937;
	}

	.dish-bonus {
		@apply flex items-center justify-between rounded-lg px-3 py-2;
		background: linear-gradient(180deg, #059669 0%, #047857 100%);
		border: 2px solid #065f46;
		box-shadow: 0 2px 8px rgba(5, 150, 105, 0.4);
	}

	.bonus-label {
		@apply font-bold;
		font-size: 13px;
		color: #fde047;
		animation: labelBlink 0.25s linear infinite;
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

	/* 힌트 섹션 */
	.hint-section {
		@apply mb-4 flex w-full items-start gap-2 rounded-xl p-3;
		background: white;
		border: 2px solid #e5e7eb;
	}

	.hint-section.full-reveal {
		background: white;
		border-color: #e5e7eb;
	}

	.hint-icon {
		font-size: 20px;
		flex-shrink: 0;
	}

	.hint-content {
		@apply flex-1;
	}

	.hint-formula {
		@apply flex flex-wrap items-center gap-1;
	}

	.hint-item {
		@apply rounded px-2 py-1 font-bold;
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
		@apply rounded px-2 py-1 font-bold;
		font-size: 13px;
		background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
		color: #78350f;
		border: 1px solid #d97706;
	}

	/* 확인 버튼 */
	:global(.confirm-btn) {
		@apply w-full;
		opacity: 0.6;
		transform: scale(0.95);
		transition: all 0.3s ease;
	}

	:global(.confirm-btn.ready) {
		opacity: 1;
		transform: scale(1);
	}
</style>
