<script lang="ts">
	import { Coins, Percent, TrendingUp } from 'lucide-svelte';
	import {
		starStore,
		upgradeStore,
		getUpgradeCost,
		UPGRADE_CONFIG,
		type UpgradeType
	} from '../lib/store';
	import GameHeader from '../components/GameHeader.svelte';

	// 보유 스타
	let totalStars = $derived($starStore);

	// 업그레이드 상태
	let upgrades = $derived($upgradeStore);

	// 업그레이드 정보
	const upgradeInfo: {
		type: UpgradeType;
		name: string;
		description: string;
		icon: typeof Coins;
		effectText: (level: number) => string;
	}[] = [
		{
			type: 'initialCapital',
			name: '초기 자본',
			description: '런 시작 시 자본 증가',
			icon: Coins,
			effectText: (level) => `+${level * UPGRADE_CONFIG.EFFECTS.INITIAL_CAPITAL_PER_LEVEL}원`
		},
		{
			type: 'ingredientDiscount',
			name: '재료비 할인',
			description: '재료 구매 비용 감소',
			icon: Percent,
			effectText: (level) =>
				`-${Math.round(level * UPGRADE_CONFIG.EFFECTS.INGREDIENT_DISCOUNT_PER_LEVEL * 100)}%`
		},
		{
			type: 'sellBonus',
			name: '판매가 상승',
			description: '요리 판매 가격 증가',
			icon: TrendingUp,
			effectText: (level) =>
				`+${Math.round(level * UPGRADE_CONFIG.EFFECTS.SELL_BONUS_PER_LEVEL * 100)}%`
		}
	];

	function handleUpgradePurchase(type: UpgradeType) {
		upgradeStore.purchase(type);
	}
</script>

<div class="upgrade-container">
	<GameHeader title="강화" backHref="/cook2" showStar stars={totalStars} />

	<div class="content-area">
		<section class="upgrade-list">
			{#each upgradeInfo as info}
				{@const level = upgrades[info.type]}
				{@const isMaxLevel = level >= UPGRADE_CONFIG.MAX_LEVEL}
				{@const cost = getUpgradeCost(level)}
				{@const canAfford = totalStars >= cost}

				<div class="upgrade-card">
					<div class="upgrade-header">
						<div class="upgrade-icon">
							<info.icon size={24} />
						</div>
						<div class="upgrade-info">
							<h2 class="upgrade-name">{info.name}</h2>
							<p class="upgrade-desc">{info.description}</p>
						</div>
						{#if isMaxLevel}
							<button class="purchase-button max" disabled> MAX </button>
						{:else}
							<button
								class="purchase-button"
								class:disabled={!canAfford}
								disabled={!canAfford}
								onclick={() => handleUpgradePurchase(info.type)}
							>
								<img src="/imgs/ui/star.png" alt="star" class="button-star" />
								<span>{cost}</span>
							</button>
						{/if}
					</div>

					<div class="upgrade-details">
						<div class="level-bar">
							{#each Array(UPGRADE_CONFIG.MAX_LEVEL) as _, i}
								<div class="level-pip" class:filled={i < level}></div>
							{/each}
						</div>
						<div class="level-text">
							Lv.{level} / {UPGRADE_CONFIG.MAX_LEVEL}
						</div>
					</div>

					<div class="upgrade-effect">
						<span class="effect-label">현재 효과:</span>
						<span class="effect-value">{info.effectText(level)}</span>
					</div>
				</div>
			{/each}
		</section>
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.upgrade-container {
		@apply flex flex-col;
		@apply h-full w-full;
		background: linear-gradient(to bottom, #fff8e1, #ffecb3);
	}

	/* 콘텐츠 영역 */
	.content-area {
		@apply flex-1;
		@apply overflow-y-auto;
		@apply p-4;
		@apply flex flex-col gap-4;
	}

	/* 업그레이드 목록 */
	.upgrade-list {
		@apply flex flex-col gap-3;
	}

	.upgrade-card {
		@apply rounded-2xl;
		@apply p-4;
		background: rgba(255, 255, 255, 0.85);
		border: 3px solid #e8d4a8;
		box-shadow:
			0 4px 8px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.upgrade-header {
		@apply flex items-center gap-3;
		@apply mb-3;
	}

	.upgrade-icon {
		@apply flex items-center justify-center;
		@apply h-12 w-12;
		@apply rounded-xl;
		background: linear-gradient(to bottom, #ffcc80, #ffb74d);
		color: #5d4037;
		border: 2px solid #f9a825;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
	}

	.upgrade-info {
		@apply flex-1;
	}

	.upgrade-name {
		@apply text-lg font-bold;
		color: #5d4037;
	}

	.upgrade-desc {
		@apply text-sm;
		color: #8d6e63;
	}

	.upgrade-details {
		@apply mb-3;
	}

	.level-bar {
		@apply flex gap-1;
		@apply mb-1;
	}

	.level-pip {
		@apply flex-1;
		@apply h-3;
		@apply rounded-full;
		background: #e0d4c0;
		border: 1px solid #c9b896;
	}

	.level-pip.filled {
		background: linear-gradient(to bottom, #ffb74d, #ff9800);
		border-color: #f57c00;
	}

	.level-text {
		@apply text-xs font-medium;
		color: #8d6e63;
		@apply text-right;
	}

	.upgrade-effect {
		@apply flex items-center justify-between;
		@apply mb-3;
		@apply px-3 py-2;
		@apply rounded-xl;
		background: rgba(255, 248, 225, 0.8);
		border: 2px solid #e8d4a8;
	}

	.effect-label {
		@apply text-sm;
		color: #8d6e63;
	}

	.effect-value {
		@apply text-lg font-bold;
		color: #e65100;
	}

	.purchase-button {
		@apply flex items-center justify-center gap-1;
		@apply px-4 py-2;
		@apply rounded-xl;
		@apply text-sm font-bold;
		@apply transition-all;
		@apply active:scale-95;
		@apply flex-shrink-0;
		background: linear-gradient(to bottom, #ffd54f, #ffb300);
		color: #5d4037;
		border: 2px solid #ff8f00;
		box-shadow: 0 3px 0 #e65100;
	}

	.purchase-button:hover:not(:disabled) {
		filter: brightness(1.05);
	}

	.purchase-button:active:not(:disabled) {
		box-shadow: 0 1px 0 #e65100;
		transform: translateY(2px) scale(0.95);
	}

	.purchase-button.disabled {
		background: #e0d4c0;
		color: #a1887f;
		border-color: #bcaaa4;
		box-shadow: 0 2px 0 #a1887f;
		@apply cursor-not-allowed;
	}

	.purchase-button.max {
		background: linear-gradient(to bottom, #81c784, #4caf50);
		color: white;
		border-color: #388e3c;
		box-shadow: 0 3px 0 #2e7d32;
		@apply px-4;
	}

	.button-star {
		width: 16px;
		height: 16px;
	}
</style>
