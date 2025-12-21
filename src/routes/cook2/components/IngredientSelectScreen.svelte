<script lang="ts">
	import { Flame, Coins, ChevronLeft, HelpCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import IngredientGrid from './IngredientGrid.svelte';
	import GameButton from './GameButton.svelte';
	import { findIngredientById } from '../lib/data/ingredients';
	import {
		runStore,
		upgradeStore,
		triedCombinationsStore,
		successCombinationsStore
	} from '../lib/store';
	import type { Ingredient } from '../lib/types';
	import type { Snippet } from 'svelte';
	import { getSoundManager } from '$lib/domain/sound';
	import { GRADE_COLORS } from '../lib/types';

	interface Props {
		/** 선택된 재료 ID 배열 (양방향 바인딩) */
		selectedIds: number[];
		/** 요리하기 버튼 클릭 콜백 */
		onCook: () => void;
		/** 현재 자본 */
		capital?: number;
		/** 획득한 스타 */
		earnedStars?: number;
		/** 세금까지 남은 턴 */
		turnsUntilTax?: number;
		/** 손님 뱃지 슬롯 */
		customerBadge?: Snippet;
	}

	let {
		selectedIds = $bindable(),
		onCook,
		capital = 0,
		earnedStars = 0,
		turnsUntilTax = 0,
		customerBadge
	}: Props = $props();

	// 홈으로 이동
	function handleBack() {
		goto('/cook2');
	}

	// 업그레이드 효과
	let upgradeEffects = $derived(upgradeStore.getEffects());

	// 할인 적용된 가격 계산
	function getDiscountedPrice(basePrice: number): number {
		const discount = upgradeEffects.ingredientDiscountRate;
		return Math.round(basePrice * (1 - discount));
	}

	// 슬롯 DOM 참조
	let slot1: HTMLButtonElement | undefined = $state();
	let slot2: HTMLButtonElement | undefined = $state();

	// 날아가는 재료 상태
	let flyingIngredient = $state<{
		imageUrl: string;
		startX: number;
		startY: number;
		endX: number;
		endY: number;
	} | null>(null);

	// 재료 정보
	let ingredients = $derived(
		selectedIds.map((id) => findIngredientById(id)).filter((ing) => ing !== undefined)
	);

	// 요리하기 버튼 활성화 여부 (1개 이상 선택 시)
	let canCook = $derived(selectedIds.length >= 1);

	// 총 재료 비용 (할인 적용)
	let totalCost = $derived(
		ingredients.reduce((sum, ing) => sum + getDiscountedPrice(ing?.buyPrice ?? 0), 0)
	);

	// 결과 미리보기 (2개 선택 시)
	let previewResult = $derived.by(() => {
		if (selectedIds.length !== 2) return null;

		const hasTried = triedCombinationsStore.hasTried(selectedIds);
		if (!hasTried) {
			return { type: 'unknown' as const };
		}

		// 성공한 조합인지 확인
		const successMap = $successCombinationsStore;
		const sortedIds = [...selectedIds].sort((a, b) => a - b);
		const key = sortedIds.join(',');
		const resultId = successMap[key];

		if (resultId) {
			const resultIngredient = findIngredientById(resultId);
			return { type: 'success' as const, ingredient: resultIngredient };
		}

		return { type: 'failed' as const };
	});

	// 재료비 변경 애니메이션
	let costBounce = $state(false);
	let prevCost = $state(0);
	$effect(() => {
		if (totalCost !== prevCost) {
			prevCost = totalCost;
			if (totalCost > 0) {
				costBounce = true;
				setTimeout(() => (costBounce = false), 300);
			}
		}
	});

	// 요리하기 버튼 핸들러
	function handleCook() {
		if (canCook) {
			onCook?.();
		}
	}

	// 슬롯 클릭 시 해당 재료 제거 + 환불
	function removeIngredient(slotIndex: number) {
		const ingredientId = selectedIds[slotIndex];
		if (ingredientId !== undefined) {
			const ingredient = findIngredientById(ingredientId);
			if (ingredient?.buyPrice) {
				runStore.earn(getDiscountedPrice(ingredient.buyPrice)); // 할인된 가격으로 환불
			}
			selectedIds = selectedIds.filter((_, i) => i !== slotIndex);

			// 재료 제거 효과음
			getSoundManager().playSfx('click');
		}
	}

	// 재료 선택 시 애니메이션
	function handleIngredientSelect(ingredient: Ingredient, fromRect: DOMRect) {
		// 목표 슬롯 결정 (현재 선택된 개수에 따라)
		const targetSlot = selectedIds.length === 0 ? slot1 : slot2;
		if (!targetSlot) return;

		const toRect = targetSlot.getBoundingClientRect();

		// 날아가는 요소 생성
		flyingIngredient = {
			imageUrl: ingredient.imageUrl || '',
			startX: fromRect.left + fromRect.width / 2,
			startY: fromRect.top + fromRect.height / 2,
			endX: toRect.left + toRect.width / 2,
			endY: toRect.top + toRect.height / 2
		};

		// 애니메이션 종료 후 제거
		setTimeout(() => {
			flyingIngredient = null;
		}, 300);
	}
</script>

<div class="ingredient-select-screen">
	<!-- 날아가는 재료 애니메이션 -->
	{#if flyingIngredient}
		<div
			class="flying-ingredient"
			style="
				--start-x: {flyingIngredient.startX}px;
				--start-y: {flyingIngredient.startY}px;
				--end-x: {flyingIngredient.endX}px;
				--end-y: {flyingIngredient.endY}px;
			"
		>
			<img src={flyingIngredient.imageUrl} alt="flying" class="flying-image" />
		</div>
	{/if}
	<!-- 주방 영역 (100vw height) -->
	<div class="kitchen-section">
		<!-- 손님 주문 뱃지 슬롯 -->
		<div class="customer-slot">
			{@render customerBadge?.()}
		</div>

		<!-- 상단 정보 바 -->
		<div class="info-bar">
			<button class="back-button" onclick={handleBack}>
				<ChevronLeft size={20} />
			</button>
			<div class="right-info">
				<div class="capital-badge">
					<Coins size={18} />
					<span class:negative={capital < 0}>{capital.toLocaleString()}원</span>
				</div>
				{#if earnedStars > 0}
					<div class="star-badge">
						<img src="/imgs/ui/star.png" alt="star" class="star-icon" />
						<span>{earnedStars}</span>
					</div>
				{/if}
				<div class="tax-badge">
					<span class="tax-label">세금</span>
					<span class="tax-count">{turnsUntilTax}턴</span>
				</div>
			</div>
		</div>

		<!-- 타이틀 -->
		<div class="title-section">
			<h1 class="title">재료를 선택하세요</h1>
		</div>

		<!-- 재료 슬롯 2개 -->
		<div class="slots-section">
			<button
				bind:this={slot1}
				type="button"
				class="slot"
				class:filled={ingredients[0]}
				onclick={() => removeIngredient(0)}
				disabled={!ingredients[0]}
			>
				{#if ingredients[0]}
					<div class="slot-filled">
						<img src={ingredients[0].imageUrl} alt={ingredients[0].name} class="slot-image" />
						<span class="ingredient-text">{ingredients[0].name}</span>
					</div>
				{:else}
					<div class="slot-empty">
						<span class="plus-icon">+</span>
						<span class="slot-label">재료 1</span>
					</div>
				{/if}
			</button>

			<button
				bind:this={slot2}
				type="button"
				class="slot"
				class:filled={ingredients[1]}
				onclick={() => removeIngredient(1)}
				disabled={!ingredients[1]}
			>
				{#if ingredients[1]}
					<div class="slot-filled">
						<img src={ingredients[1].imageUrl} alt={ingredients[1].name} class="slot-image" />
						<span class="ingredient-text">{ingredients[1].name}</span>
					</div>
				{:else}
					<div class="slot-empty">
						<span class="plus-icon">+</span>
						<span class="slot-label">재료 2</span>
					</div>
				{/if}
			</button>
		</div>

		<!-- 요리하기 버튼 -->
		<div class="button-section">
			<div class="cost-display" class:bounce={costBounce}>
				재료비: {totalCost > 0 ? `${totalCost}원` : '-'}
			</div>
			<GameButton class="cook-button" disabled={!canCook} onclick={handleCook}>
				{#if previewResult?.type === 'success' && previewResult.ingredient}
					<img
						src={previewResult.ingredient.imageUrl}
						alt={previewResult.ingredient.name}
						class="preview-image"
					/>
				{:else if previewResult?.type === 'failed'}
					<span class="fail-icon">🚫</span>
				{:else}
					<Flame size={20} class="flame-icon" />
				{/if}
				<span class="button-text">요리하기</span>
			</GameButton>
		</div>
	</div>

	<!-- 재료 그리드 (width 100%) -->
	<div class="grid-section">
		<IngredientGrid bind:selectedIds onSelect={handleIngredientSelect} />
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.ingredient-select-screen {
		@apply flex flex-col;
		@apply h-full;
		@apply overflow-hidden;
	}

	/* 주방 영역 */
	.kitchen-section {
		@apply relative;
		@apply flex flex-col;
		@apply w-full;
		height: 70vw;
		flex-shrink: 0;
		background-image: url('/imgs/cook_bg.webp');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	/* 손님 주문 뱃지 슬롯 */
	.customer-slot {
		@apply absolute;
		left: 8px;
		bottom: 8px;
		z-index: 10;
	}

	/* 상단 정보 바 */
	.info-bar {
		@apply flex items-center justify-between;
		@apply px-2 py-1;
	}

	.back-button {
		@apply flex items-center justify-center;
		@apply rounded-lg;
		@apply p-1;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid #e8d4a8;
		color: #5d4037;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
		transition: all 0.15s;
	}

	.back-button:active {
		transform: scale(0.95);
		background: rgba(255, 255, 255, 1);
	}

	.right-info {
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

	.tax-badge {
		@apply flex items-center gap-1;
		@apply px-2 py-1;
		@apply rounded-lg;
		@apply font-bold;
		background: linear-gradient(to bottom, rgba(255, 204, 128, 0.95), rgba(255, 183, 77, 0.95));
		border: 1px solid #f57c00;
		color: #5d4037;
		font-size: 11px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
	}

	.tax-label {
		color: #795548;
		font-size: 9px;
	}

	.tax-count {
		color: #e65100;
	}

	/* 타이틀 섹션 */
	.title-section {
		@apply flex flex-col items-center;
		@apply pb-2;
		@apply px-4;
	}

	.title {
		@apply font-bold text-white;
		@apply drop-shadow-lg;
		font-size: var(--font-lg);
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	/* 슬롯 섹션 */
	.slots-section {
		@apply flex justify-center gap-3;
		@apply flex-1;
		@apply px-4;
		@apply items-center;
	}

	.slot {
		@apply flex items-center justify-center;
		@apply rounded-2xl;
		@apply transition-all duration-300;
		backdrop-filter: blur(4px);
		width: 100px;
		height: 70px;
		background: rgba(255, 255, 255, 0.75);
		border: 3px dashed rgba(139, 119, 101, 0.5);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.slot.filled {
		border: 3px solid #ffb74d;
		background: linear-gradient(to bottom, rgba(255, 248, 225, 0.9), rgba(255, 236, 179, 0.9));
		box-shadow:
			0 4px 8px rgba(255, 152, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		animation: slotPop 0.3s ease-out;
		backdrop-filter: blur(4px);
	}

	@keyframes slotPop {
		0% {
			transform: scale(0.8);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	.slot-empty {
		@apply flex flex-col items-center gap-1;
		color: #8d6e63;
	}

	.plus-icon {
		@apply font-light;
		font-size: 28px;
		color: #a1887f;
	}

	.slot-label {
		@apply text-sm font-bold;
		color: #8d6e63;
		font-size: var(--font-xs);
	}

	.slot-filled {
		@apply flex flex-col items-center gap-1;
	}

	.slot-image {
		width: 40px;
		height: 40px;
		@apply object-contain;
		@apply rounded-lg;
		filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15));
	}

	.ingredient-text {
		@apply text-sm font-bold;
		color: #5d4037;
		font-size: var(--font-sm);
	}

	/* 버튼 섹션 */
	.button-section {
		@apply flex flex-col items-center gap-2;
		@apply px-4 pb-3;
	}

	.cost-display {
		@apply font-bold;
		@apply px-3 py-1;
		@apply rounded-lg;
		background: rgba(255, 255, 255, 0.85);
		color: #5d4037;
		border: 2px solid #e8d4a8;
		font-size: 11px;
		transition:
			transform 0.15s ease-out,
			background 0.15s ease-out;
	}

	.cost-display.bounce {
		transform: scale(1.15);
		background: #fff3e0;
		border-color: #ffb74d;
	}

	.cook-button {
		@apply w-full;
		max-width: 180px;
		@apply px-5 py-2.5;
		@apply rounded-xl;
		@apply flex items-center justify-center gap-2;
		@apply transition-all duration-300;
		@apply font-bold;
		font-size: 14px;
		background: linear-gradient(to bottom, #ff7043, #f4511e);
		color: white;
		border: 3px solid #e64a19;
		box-shadow: 0 4px 0 #bf360c;
	}

	.cook-button:not(:disabled) {
		animation: cookPulse 2s ease-in-out infinite;
	}

	.cook-button:not(:disabled):hover {
		filter: brightness(1.1);
	}

	.cook-button:not(:disabled):active {
		box-shadow: 0 2px 0 #bf360c;
		transform: translateY(2px) scale(0.95);
	}

	.cook-button:disabled {
		@apply cursor-not-allowed;
		background: #bcaaa4;
		border-color: #a1887f;
		box-shadow: 0 3px 0 #8d6e63;
		animation: none;
	}

	@keyframes cookPulse {
		0%,
		100% {
			box-shadow: 0 4px 0 #bf360c;
		}
		50% {
			box-shadow:
				0 4px 0 #bf360c,
				0 0 20px rgba(255, 112, 67, 0.6);
			transform: translateY(-2px);
		}
	}

	.button-text {
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.preview-image {
		width: 20px;
		height: 20px;
		object-fit: contain;
		filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
	}

	.fail-icon {
		font-size: 18px;
		line-height: 1;
	}

	.cook-button :global(.flame-icon) {
		animation: flameFlicker 0.5s ease-in-out infinite alternate;
	}

	@keyframes flameFlicker {
		0% {
			transform: rotate(-5deg);
		}
		100% {
			transform: rotate(5deg);
		}
	}

	/* 그리드 섹션 (width 100%, 나머지 높이) */
	.grid-section {
		@apply flex-1;
		@apply w-full;
		@apply overflow-hidden;
	}

	/* 날아가는 재료 애니메이션 */
	.flying-ingredient {
		@apply fixed z-50;
		@apply pointer-events-none;
		animation: flyToSlot 0.3s ease-out forwards;
	}

	.flying-image {
		@apply h-12 w-12;
		@apply object-contain;
		@apply rounded-lg;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
	}

	@keyframes flyToSlot {
		0% {
			left: var(--start-x);
			top: var(--start-y);
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
		50% {
			transform: translate(-50%, -50%) scale(1.3);
		}
		100% {
			left: var(--end-x);
			top: var(--end-y);
			transform: translate(-50%, -50%) scale(0.8);
			opacity: 0.8;
		}
	}
</style>
