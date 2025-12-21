<script lang="ts">
	import { customerStore, getOrderTarget } from '../lib/customer-store';

	interface Props {
		capital: number;
		earnedStars: number;
		turnsUntilTax: number;
	}

	let { capital, earnedStars, turnsUntilTax }: Props = $props();

	// 손님 상태에서 스테이지 정보 가져오기
	let customerState = $derived($customerStore);
	let stage = $derived(customerState.difficulty);
	let completedOrders = $derived(customerState.stageCompletedOrders);
	let orderTarget = $derived(getOrderTarget(stage));
	let taxRate = $derived(customerState.taxRate);
	let taxRatePercent = $derived(Math.round(taxRate * 100));

	// 주문 진행도 퍼센트
	let orderProgress = $derived(Math.min((completedOrders / orderTarget) * 100, 100));

	// 세금률 색상 (높을수록 빨간색)
	let taxRateColor = $derived(() => {
		if (taxRate <= 0.3) return '#22c55e'; // 초록
		if (taxRate <= 0.4) return '#f59e0b'; // 노랑
		if (taxRate <= 0.5) return '#f97316'; // 오렌지
		return '#ef4444'; // 빨강
	});

	// 긴급도 색상
	let urgencyColor = $derived(() => {
		if (turnsUntilTax <= 2) return '#ef4444'; // 빨강
		if (turnsUntilTax <= 5) return '#f59e0b'; // 노랑
		return '#22c55e'; // 초록
	});
</script>

<div class="hud-container">
	<!-- 상단: 자본금 + 스타 -->
	<div class="hud-top">
		<div class="capital-badge">
			<img src="/imgs/ui/coin.png" alt="coin" class="capital-icon" />
			<span class="capital-value">{capital.toLocaleString()}원</span>
		</div>
		<div class="star-badge">
			<img src="/imgs/ui/star.png" alt="star" class="star-icon" />
			<span class="star-value">{earnedStars}</span>
		</div>
	</div>

	<!-- 하단: 주문 진행도 + 세금 정보 -->
	<div class="hud-bottom">
		<!-- 주문 진행도 -->
		<div class="order-progress">
			<div class="progress-header">
				<span class="progress-icon">📋</span>
				<span class="progress-label">주문</span>
				<span class="progress-value">{completedOrders}/{orderTarget}</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {orderProgress}%"></div>
			</div>
		</div>

		<!-- 세금 정보 -->
		<div class="tax-info">
			<div class="tax-item">
				<span class="tax-icon">⏰</span>
				<span class="tax-value" style="color: {urgencyColor()}">{turnsUntilTax}턴</span>
			</div>
			<div class="tax-divider"></div>
			<div class="tax-item">
				<span class="tax-icon">💸</span>
				<span class="tax-value" style="color: {taxRateColor()}">{taxRatePercent}%</span>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.hud-container {
		@apply flex flex-col gap-2;
		@apply px-3 py-2;
	}

	/* 상단: 자본금 + 스타 */
	.hud-top {
		@apply flex items-center justify-between;
	}

	.capital-badge {
		@apply flex items-center gap-1;
		@apply px-3 py-1.5;
		@apply rounded-full;
		background: linear-gradient(180deg, #3d3d3d 0%, #1a1a1a 100%);
		border: 2px solid #5a5a5a;
		box-shadow: 0 2px 0 #0d0d0d;
	}

	.capital-icon {
		width: 16px;
		height: 16px;
	}

	.capital-value {
		@apply font-bold text-white;
		font-size: 14px;
	}

	.star-badge {
		@apply flex items-center gap-1;
		@apply px-2.5 py-1.5;
		@apply rounded-full;
		background: linear-gradient(180deg, #3d3d3d 0%, #1a1a1a 100%);
		border: 2px solid #5a5a5a;
		box-shadow: 0 2px 0 #0d0d0d;
	}

	.star-icon {
		width: 16px;
		height: 16px;
	}

	.star-value {
		@apply font-bold text-white;
		font-size: 12px;
	}

	/* 하단: 주문 진행도 + 세금 정보 */
	.hud-bottom {
		@apply flex items-center gap-3;
		@apply px-3 py-2;
		@apply rounded-xl;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
	}

	/* 주문 진행도 */
	.order-progress {
		@apply flex-1;
		@apply flex flex-col gap-1;
	}

	.progress-header {
		@apply flex items-center gap-1;
	}

	.progress-icon {
		font-size: 12px;
	}

	.progress-label {
		@apply font-medium text-white/70;
		font-size: 10px;
	}

	.progress-value {
		@apply ml-auto;
		@apply font-bold text-white;
		font-size: 11px;
	}

	.progress-bar {
		@apply h-2 w-full;
		@apply rounded-full;
		@apply overflow-hidden;
		background: rgba(255, 255, 255, 0.2);
	}

	.progress-fill {
		@apply h-full;
		@apply rounded-full;
		background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
		transition: width 0.3s ease-out;
	}

	/* 세금 정보 */
	.tax-info {
		@apply flex items-center gap-2;
	}

	.tax-divider {
		@apply h-6 w-px;
		background: rgba(255, 255, 255, 0.3);
	}

	.tax-item {
		@apply flex items-center gap-1;
	}

	.tax-icon {
		font-size: 12px;
	}

	.tax-value {
		@apply font-bold;
		font-size: 12px;
	}
</style>
