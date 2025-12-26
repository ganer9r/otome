<script lang="ts">
	import TaxInfoModal from './TaxInfoModal.svelte';

	interface Props {
		capital: number;
		earnedStars?: number;
		turn?: number;
		turnsUntilTax?: number;
		totalEarned?: number;
		taxRate?: number;
	}

	let {
		capital,
		earnedStars = 0,
		turn,
		turnsUntilTax,
		totalEarned = 0,
		taxRate = 0.3
	}: Props = $props();

	let showTaxInfo = $state(false);

	function handleTurnClick(e: MouseEvent) {
		e.stopPropagation();
		showTaxInfo = true;
	}
</script>

{#if showTaxInfo && turn !== undefined && turnsUntilTax !== undefined}
	<TaxInfoModal
		{turn}
		{turnsUntilTax}
		{totalEarned}
		{taxRate}
		onClose={() => (showTaxInfo = false)}
	/>
{/if}

<div class="capital-hud">
	{#if turn !== undefined && turnsUntilTax !== undefined}
		<button class="turn-badge" class:urgent={turnsUntilTax <= 2} onclick={handleTurnClick}>
			<span class="turn-icon">⏰</span>
			<span>{turn}턴</span>
			<span class="tax-remain">({turnsUntilTax})</span>
		</button>
	{/if}
	<div class="capital-badge">
		<img src="/imgs/ui/coin.png" alt="coin" class="coin-icon" />
		<span class:negative={capital < 0}>{capital.toLocaleString()}원</span>
	</div>
	{#if earnedStars > 0}
		<div class="star-badge">
			<img src="/imgs/ui/star.png" alt="star" class="star-icon" />
			<span>{earnedStars}</span>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.capital-hud {
		@apply flex items-center gap-1;
	}

	.capital-badge {
		@apply flex items-center gap-1;
		@apply px-2 py-1;
		@apply rounded-lg;
		@apply font-bold;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid #e8d4a8;
		color: #e65100;
		font-size: 11px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
	}

	.coin-icon {
		width: 14px;
		height: 14px;
	}

	.capital-badge span.negative {
		color: #d32f2f;
	}

	.star-badge {
		@apply flex items-center gap-0.5;
		@apply px-1.5 py-1;
		@apply rounded-lg;
		@apply font-bold;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid #ffc107;
		color: #e65100;
		font-size: 11px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
	}

	.star-icon {
		width: 12px;
		height: 12px;
	}

	.turn-badge {
		@apply flex items-center gap-0.5;
		@apply px-2 py-1;
		@apply rounded-lg;
		@apply cursor-pointer;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid #e0e0e0;
		color: #757575;
		font-size: 11px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
		transition: all 0.15s ease;
	}

	.turn-badge:hover {
		background: rgba(255, 255, 255, 1);
		border-color: #bdbdbd;
	}

	.turn-badge:active {
		transform: scale(0.97);
	}

	.turn-badge.urgent {
		color: #e57373;
		border-color: #e57373;
	}

	.turn-icon {
		font-size: 10px;
		opacity: 0.6;
	}

	.tax-remain {
		opacity: 0.5;
		font-size: 10px;
	}
</style>
