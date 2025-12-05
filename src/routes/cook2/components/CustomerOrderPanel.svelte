<script lang="ts">
	import { customerStore, type CustomerOrder } from '../lib/customer-store';
	import { GRADE_COLORS } from '../lib/types';

	// Props
	interface Props {
		turnsUntilTax: number;
	}

	let { turnsUntilTax }: Props = $props();

	// 손님 상태
	let customerState = $derived($customerStore);
	let order = $derived(customerState.currentOrder);

	// 등급 색상
	function getGradeColor(order: CustomerOrder | null): string {
		if (!order) return GRADE_COLORS['F'];
		return GRADE_COLORS[order.dish.grade];
	}
</script>

<div class="customer-panel">
	{#if order}
		<div class="order-card" class:completed={order.completed}>
			<!-- 손님 아이콘 -->
			<div class="customer-icon">
				{#if order.completed}
					<span class="check-icon">✓</span>
				{:else}
					<span class="customer-emoji">👤</span>
				{/if}
			</div>

			<!-- 주문 내용 -->
			<div class="order-content">
				<div class="order-header">
					<span class="order-label">{order.completed ? '완료!' : '주문'}</span>
					<span class="turns-left" class:urgent={turnsUntilTax <= 2}>
						{turnsUntilTax}턴 남음
					</span>
				</div>

				<div class="dish-info">
					<span class="dish-grade" style="background-color: {getGradeColor(order)}; color: white;">
						{order.dish.grade}
					</span>
					<span class="dish-name">{order.dish.name}</span>
				</div>

				{#if !order.completed}
					<div class="bonus-info">
						<span class="bonus-label">보너스</span>
						<span class="bonus-amount">+{order.bonusAmount}</span>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="no-order">
			<span class="no-order-text">주문 없음</span>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.customer-panel {
		@apply w-full;
		@apply px-2 py-1;
	}

	.order-card {
		@apply flex items-center gap-3;
		@apply rounded-xl bg-white/90;
		@apply p-3;
		@apply shadow-md;
		@apply border-2 border-amber-300;
		@apply transition-all duration-300;
	}

	.order-card.completed {
		@apply border-green-400 bg-green-50/90;
	}

	.customer-icon {
		@apply flex items-center justify-center;
		@apply h-10 w-10;
		@apply rounded-full bg-amber-100;
		@apply flex-shrink-0;
	}

	.order-card.completed .customer-icon {
		@apply bg-green-200;
	}

	.customer-emoji {
		@apply text-xl;
	}

	.check-icon {
		@apply text-xl font-bold text-green-600;
	}

	.order-content {
		@apply min-w-0 flex-1;
	}

	.order-header {
		@apply flex items-center justify-between;
		@apply mb-1;
	}

	.order-label {
		@apply text-xs font-medium text-gray-500;
	}

	.order-card.completed .order-label {
		@apply text-green-600;
	}

	.turns-left {
		@apply text-xs font-bold;
		@apply rounded-full px-2 py-0.5;
		@apply bg-amber-100 text-amber-700;
	}

	.turns-left.urgent {
		@apply bg-red-100 text-red-600;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	.dish-info {
		@apply flex items-center gap-2;
	}

	.dish-grade {
		@apply text-xs font-bold;
		@apply rounded px-1.5 py-0.5;
	}

	.dish-name {
		@apply text-sm font-bold text-gray-800;
		@apply truncate;
	}

	.bonus-info {
		@apply mt-1 flex items-center gap-1;
	}

	.bonus-label {
		@apply text-xs text-gray-400;
	}

	.bonus-amount {
		@apply text-xs font-bold text-amber-600;
	}

	.no-order {
		@apply flex items-center justify-center;
		@apply rounded-xl bg-gray-100;
		@apply p-3;
		@apply border-2 border-dashed border-gray-300;
	}

	.no-order-text {
		@apply text-sm text-gray-400;
	}
</style>
