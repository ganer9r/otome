<script lang="ts">
	import type { CustomerOrder } from '../lib/customer-store';
	import { getCustomerImagePath } from '../lib/customer-store';
	import AnticipationOverlay from './AnticipationOverlay.svelte';
	import GameButton from './GameButton.svelte';

	interface Props {
		order: CustomerOrder;
		onClose: () => void;
	}

	let { order, onClose }: Props = $props();

	// 실패 대사 풀 (불만 느낌)
	const FAIL_MESSAGES = [
		'너무 오래 걸려요...',
		'언제 나오는 거예요?',
		'다른 데 갈게요!',
		'기다리다 지쳤어요',
		'배고파 죽겠는데...',
		'왜 이렇게 늦어요?',
		'다음엔 빨리 해주세요',
		'실망이에요...'
	];

	const failMessage = FAIL_MESSAGES[Math.floor(Math.random() * FAIL_MESSAGES.length)];

	// 기대감 연출 완료 여부
	let showAnticipation = $state(true);

	// 애니메이션 상태
	let showContent = $state(false);
	let showPenalty = $state(false);
	let canClose = $state(false);
	let isExiting = $state(false);

	function onAnticipationComplete() {
		showAnticipation = false;
		showContent = true;

		setTimeout(() => {
			showPenalty = true;
		}, 700);

		setTimeout(() => {
			canClose = true;
		}, 1400);
	}

	function handleClose() {
		if (canClose && !isExiting) {
			isExiting = true;
			setTimeout(() => {
				onClose();
			}, 300);
		}
	}
</script>

<!-- 기대감 연출 -->
{#if showAnticipation}
	<AnticipationOverlay onComplete={onAnticipationComplete} />
{/if}

<div
	class="modal-overlay"
	class:exit={isExiting}
	class:shake={showContent}
	class:hidden={showAnticipation}
>
	<!-- 딤 영역 상단 타이틀 -->
	<div class="floating-title" class:show={showContent}>
		<span class="title-text">손님이 떠났어요</span>
	</div>

	<div class="modal-content" class:show={showContent} class:exit={isExiting}>
		<!-- 캐릭터 (모달 상단에 걸침) -->
		<img class="customer-image" src={getCustomerImagePath(order.customerId, 'fail')} alt="손님" />

		<!-- 손님 대사 -->
		<div class="customer-message">"{failMessage}"</div>

		<!-- 실패 카드 -->
		<div class="fail-card">
			<div class="fail-header">
				<span class="fail-icon">😢</span>
				<span class="fail-title">주문 실패</span>
			</div>
			<div class="fail-order">
				<span class="fail-label">주문한 요리</span>
				<span class="fail-dish">{order.dish.name}</span>
			</div>
		</div>

		<!-- 패널티 경고 -->
		{#if showPenalty}
			<div class="penalty-warning">
				<span class="penalty-text">세금률 +5% 증가!</span>
			</div>
		{/if}

		<!-- 닫기 버튼 -->
		<GameButton
			variant="danger"
			size="lg"
			class="close-btn {canClose ? 'ready' : ''}"
			onclick={handleClose}
			disabled={!canClose}
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
		@apply h-full w-full;
		background: rgba(0, 0, 0, 0.7);
	}

	.modal-overlay.hidden {
		display: none;
	}

	@keyframes fadeInFlash {
		0% {
			background: rgba(0, 0, 0, 0);
		}
		20% {
			background: rgba(220, 38, 38, 0.6);
		}
		40% {
			background: rgba(0, 0, 0, 0.7);
		}
		100% {
			background: rgba(0, 0, 0, 0.7);
		}
	}

	.modal-overlay.shake {
		animation:
			fadeInFlash 0.5s ease-out,
			screenShake 0.4s ease-out 0.1s;
	}

	@keyframes screenShake {
		0%,
		100% {
			transform: translateX(0);
		}
		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translateX(-6px);
		}
		20%,
		40%,
		60%,
		80% {
			transform: translateX(6px);
		}
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
		@apply relative flex flex-col items-center rounded-3xl p-5;
		padding-top: 70px;
		width: 280px;
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

	/* 실패 카드 */
	.fail-card {
		@apply mb-3 w-full rounded-xl p-3;
		background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
		border: 3px solid #f87171;
		box-shadow:
			0 4px 12px rgba(239, 68, 68, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.fail-header {
		@apply mb-2 flex items-center gap-2;
	}

	.fail-icon {
		font-size: 20px;
	}

	.fail-title {
		@apply font-bold;
		font-size: 14px;
		color: #991b1b;
	}

	.fail-order {
		@apply flex items-center justify-between rounded-lg px-3 py-2;
		background: linear-gradient(180deg, #dc2626 0%, #b91c1c 100%);
		border: 2px solid #991b1b;
		box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
	}

	.fail-label {
		@apply font-bold;
		font-size: 12px;
		color: #fecaca;
	}

	.fail-dish {
		@apply font-black;
		font-size: 16px;
		color: white;
	}

	/* 패널티 경고 */
	.penalty-warning {
		@apply mb-3 flex w-full items-center justify-center py-2;
		animation: penaltyAppear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes penaltyAppear {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.penalty-text {
		@apply font-black;
		font-size: 20px;
		color: #dc2626;
		animation: textBlink 0.25s linear infinite;
	}

	@keyframes textBlink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	@keyframes penaltyShake {
		0%,
		100% {
			transform: translateX(0);
		}
		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translateX(-4px);
		}
		20%,
		40%,
		60%,
		80% {
			transform: translateX(4px);
		}
	}

	.penalty-icon {
		font-size: 24px;
		animation: iconPulse 0.3s ease-in-out infinite;
	}

	@keyframes iconPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
	}

	.penalty-text {
		@apply font-black;
		font-size: 18px;
		color: #78350f;
		animation: textBlink 0.25s linear infinite;
	}

	@keyframes textBlink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* 닫기 버튼 */
	:global(.close-btn) {
		@apply w-full;
		opacity: 0.6;
		transition: all 0.3s ease;
	}

	:global(.close-btn.ready) {
		opacity: 1;
	}
</style>
