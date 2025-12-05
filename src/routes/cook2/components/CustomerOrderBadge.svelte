<script lang="ts">
	import { customerStore } from '../lib/customer-store';
	import { GRADE_COLORS } from '../lib/types';

	// Props
	interface Props {
		turnsUntilTax: number;
		/** 테스트용: 긴급도 오버라이드 (1~10) */
		testUrgency?: number;
	}

	let { turnsUntilTax, testUrgency }: Props = $props();

	// 실제 남은 턴 (테스트 오버라이드 가능)
	let effectiveTurns = $derived(testUrgency ?? turnsUntilTax);

	// 손님 상태
	let customerState = $derived($customerStore);
	let order = $derived(customerState.currentOrder);

	// 펼침 상태
	let expanded = $state(false);

	// 긴급도 레벨 (1: 여유, 2: 보통, 3: 긴급)
	let urgencyLevel = $derived((): 1 | 2 | 3 => {
		if (effectiveTurns <= 2) return 3; // 긴급
		if (effectiveTurns <= 5) return 2; // 보통
		return 1; // 여유
	});

	// 손님 표정
	let customerEmoji = $derived(() => {
		if (order?.completed) return '😄';
		switch (urgencyLevel()) {
			case 3:
				return '😰';
			case 2:
				return '😐';
			default:
				return '😊';
		}
	});

	// 테두리 색상 (여유=초록, 보통=노랑, 긴급=빨강)
	let borderColor = $derived(() => {
		if (order?.completed) return '#22c55e';
		switch (urgencyLevel()) {
			case 3:
				return '#ef4444'; // 빨강
			case 2:
				return '#f59e0b'; // 노랑
			default:
				return '#22c55e'; // 초록
		}
	});

	function toggleExpand() {
		expanded = !expanded;
	}

	function handleOutsideClick() {
		if (expanded) {
			expanded = false;
		}
	}
</script>

<!-- 바깥 클릭 감지용 오버레이 -->
{#if expanded}
	<button class="overlay" onclick={handleOutsideClick} aria-label="닫기"></button>
{/if}

<div class="badge-container">
	{#if order}
		<!-- 접힌 상태: 뱃지 -->
		<button
			class="order-badge"
			class:completed={order.completed}
			class:urgent={urgencyLevel() === 3 && !order.completed}
			class:warning={urgencyLevel() === 2 && !order.completed}
			style="--border-color: {borderColor()}"
			onclick={toggleExpand}
		>
			<!-- 손님 얼굴 (박스 위로 튀어나옴) -->
			<div class="customer-face">
				<span class="face-emoji">{customerEmoji()}</span>
			</div>

			<!-- 요리 이름 박스 -->
			<div class="dish-box">
				<div class="dish-name">{order.dish.name}</div>
				{#if order.completed}
					<div class="completed-text">완료!</div>
				{/if}
			</div>
		</button>

		<!-- 펼친 상태: 상세 정보 -->
		{#if expanded}
			<div class="expanded-panel" style="--border-color: {borderColor()}">
				<div class="panel-header">
					<span class="panel-emoji">{customerEmoji()}</span>
					<span class="panel-title">손님 주문</span>
				</div>

				<div class="panel-content">
					<div class="dish-row">
						<span class="dish-grade" style="background-color: {GRADE_COLORS[order.dish.grade]}">
							{order.dish.grade}
						</span>
						<span class="dish-name-large">{order.dish.name}</span>
					</div>

					{#if !order.completed}
						<div class="info-row">
							<span class="info-label">보너스</span>
							<span class="info-value bonus">+{order.bonusAmount}원</span>
						</div>
						<div class="info-row">
							<span class="info-label">남은 턴</span>
							<span class="info-value turns" class:urgent={urgencyLevel() === 3}>
								{effectiveTurns}턴
							</span>
						</div>
					{:else}
						<div class="completed-message">주문 완료!</div>
					{/if}
				</div>
			</div>
		{/if}
	{:else}
		<!-- 주문 없음 -->
		<div class="no-order-badge">
			<span class="no-order-emoji">💤</span>
			<span class="no-order-text">대기중</span>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.overlay {
		@apply fixed inset-0 z-40;
		background: transparent;
		border: none;
		cursor: default;
	}

	.badge-container {
		@apply absolute z-50;
		right: 12px;
		top: 48px;
	}

	/* 뱃지 (접힌 상태) */
	.order-badge {
		@apply relative flex flex-col items-center;
		@apply cursor-pointer;
		@apply transition-all duration-200;
		padding-top: 24px; /* 얼굴 공간 확보 */
		background: transparent;
		border: none;
	}

	.order-badge:hover {
		transform: scale(1.05);
	}

	.order-badge:active {
		transform: scale(0.98);
	}

	.order-badge.warning {
		animation: wobble 0.5s ease-in-out infinite;
	}

	.order-badge.urgent {
		animation: shake 0.3s ease-in-out infinite;
	}

	@keyframes wobble {
		0%,
		100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(-2deg);
		}
		75% {
			transform: rotate(2deg);
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0) rotate(0deg);
		}
		25% {
			transform: translateX(-2px) rotate(-1deg);
		}
		75% {
			transform: translateX(2px) rotate(1deg);
		}
	}

	/* 얼굴 (박스 위로 튀어나옴) */
	.customer-face {
		@apply absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
	}

	.face-emoji {
		font-size: 32px;
		line-height: 1;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	/* 요리 이름 박스 */
	.dish-box {
		@apply flex flex-col items-center;
		@apply rounded-xl;
		@apply px-3 py-2;
		margin-top: 4px;
		min-width: 70px;
		background: linear-gradient(to bottom, #fffbeb, #fef3c7);
		border: 3px solid var(--border-color);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.order-badge.completed .dish-box {
		background: linear-gradient(to bottom, #ecfdf5, #d1fae5);
	}

	.order-badge.urgent .dish-box {
		animation: urgentGlow 1s ease-in-out infinite;
	}

	@keyframes urgentGlow {
		0%,
		100% {
			box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
		}
		50% {
			box-shadow: 0 4px 20px rgba(239, 68, 68, 0.6);
		}
	}

	.dish-name {
		@apply text-xs font-bold;
		@apply text-center;
		@apply leading-tight;
		color: #78350f;
		max-width: 64px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.completed-text {
		@apply mt-0.5 text-xs font-bold;
		color: #16a34a;
	}

	/* 펼친 패널 */
	.expanded-panel {
		@apply absolute top-full right-0 mt-2;
		@apply rounded-2xl;
		@apply overflow-hidden;
		width: 180px;
		background: white;
		border: 3px solid var(--border-color);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.2),
			0 4px 8px rgba(0, 0, 0, 0.1);
		animation: expandIn 0.2s ease-out;
	}

	@keyframes expandIn {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.panel-header {
		@apply flex items-center gap-2;
		@apply px-3 py-2;
		background: linear-gradient(to bottom, #fef3c7, #fde68a);
		border-bottom: 2px solid var(--border-color);
	}

	.panel-emoji {
		font-size: 20px;
	}

	.panel-title {
		@apply text-sm font-bold;
		color: #78350f;
	}

	.panel-content {
		@apply flex flex-col gap-2;
		@apply p-3;
	}

	.dish-row {
		@apply flex items-center gap-2;
	}

	.dish-grade {
		@apply rounded px-1.5 py-0.5;
		@apply text-xs font-bold text-white;
	}

	.dish-name-large {
		@apply text-sm font-bold;
		color: #1f2937;
	}

	.info-row {
		@apply flex items-center justify-between;
	}

	.info-label {
		@apply text-xs;
		color: #6b7280;
	}

	.info-value {
		@apply text-sm font-bold;
		color: #1f2937;
	}

	.info-value.bonus {
		color: #d97706;
	}

	.info-value.turns.urgent {
		color: #ef4444;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.completed-message {
		@apply py-2 text-center text-sm font-bold;
		color: #16a34a;
	}

	/* 주문 없음 */
	.no-order-badge {
		@apply flex flex-col items-center;
		@apply rounded-2xl;
		@apply p-2;
		width: 72px;
		background: #f3f4f6;
		border: 2px dashed #d1d5db;
	}

	.no-order-emoji {
		font-size: 24px;
		opacity: 0.5;
	}

	.no-order-text {
		@apply text-xs;
		color: #9ca3af;
	}
</style>
