<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Star, Coins, Percent, TrendingUp } from 'lucide-svelte';
	import {
		starStore,
		upgradeStore,
		getUpgradeCost,
		UPGRADE_CONFIG,
		type UpgradeType
	} from '../lib/store';

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

	function goBack() {
		history.back();
	}
</script>

<div class="upgrade-container">
	<!-- 헤더 -->
	<header class="header">
		<button class="back-button" onclick={goBack}>
			<ArrowLeft size={24} />
		</button>
		<h1 class="title">강화</h1>
		<div class="star-badge">
			<Star size={18} class="star-icon" />
			<span class="star-count">{totalStars}</span>
		</div>
	</header>

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
								<Star size={14} class="button-star" />
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
		@apply min-h-screen;
		@apply bg-base-100;
	}

	.header {
		@apply flex items-center justify-between;
		@apply px-4 py-3;
		@apply bg-base-200;
		@apply border-base-300 border-b;
	}

	.back-button {
		@apply p-2;
		@apply rounded-lg;
		@apply hover:bg-base-300;
		@apply transition-colors;
	}

	.title {
		@apply text-xl font-bold;
		@apply text-base-content;
	}

	.star-badge {
		@apply flex items-center gap-1;
		@apply px-3 py-1.5;
		@apply rounded-full;
		@apply bg-yellow-100;
	}

	.star-badge :global(.star-icon) {
		@apply text-yellow-500;
		fill: currentColor;
	}

	.star-count {
		@apply text-sm font-bold text-yellow-600;
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
		@apply bg-base-200;
		@apply rounded-xl;
		@apply p-4;
		@apply shadow-md;
	}

	.upgrade-header {
		@apply flex items-center gap-3;
		@apply mb-3;
	}

	.upgrade-icon {
		@apply flex items-center justify-center;
		@apply h-12 w-12;
		@apply rounded-full;
		@apply bg-primary/20;
		@apply text-primary;
	}

	.upgrade-info {
		@apply flex-1;
	}

	.upgrade-name {
		@apply text-lg font-bold;
		@apply text-base-content;
	}

	.upgrade-desc {
		@apply text-sm;
		@apply text-base-content/60;
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
		@apply h-2;
		@apply rounded-full;
		@apply bg-base-300;
	}

	.level-pip.filled {
		@apply bg-primary;
	}

	.level-text {
		@apply text-xs;
		@apply text-base-content/50;
		@apply text-right;
	}

	.upgrade-effect {
		@apply flex items-center justify-between;
		@apply mb-3;
		@apply px-3 py-2;
		@apply rounded-lg;
		@apply bg-base-100;
	}

	.effect-label {
		@apply text-sm;
		@apply text-base-content/60;
	}

	.effect-value {
		@apply text-lg font-bold;
		@apply text-primary;
	}

	.purchase-button {
		@apply flex items-center justify-center gap-1;
		@apply px-3 py-2;
		@apply rounded-lg;
		@apply bg-yellow-500;
		@apply text-sm font-bold text-white;
		@apply transition-all;
		@apply active:scale-95;
		@apply flex-shrink-0;
	}

	.purchase-button:hover:not(:disabled) {
		@apply bg-yellow-600;
	}

	.purchase-button.disabled {
		@apply bg-base-300;
		@apply text-base-content/30;
		@apply cursor-not-allowed;
	}

	.purchase-button.max {
		@apply bg-base-300;
		@apply text-base-content/50;
		@apply px-4;
	}

	.purchase-button :global(.button-star) {
		fill: currentColor;
	}
</style>
