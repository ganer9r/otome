<script lang="ts">
	interface Props {
		capital: number;
		earnedStars?: number;
	}

	let { capital, earnedStars = 0 }: Props = $props();
</script>

<div class="capital-hud">
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
</style>
