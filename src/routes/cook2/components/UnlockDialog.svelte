<script lang="ts">
	import { X, Star, TriangleAlert } from 'lucide-svelte';
	import type { Ingredient } from '../lib/types';
	import { GRADE_COLORS } from '../lib/types';
	import { findIngredientById } from '../lib/data/ingredients';
	import { getRequiredIngredients } from '../lib/data/recipes';
	import { starStore, permanentUnlockStore, UNLOCK_COSTS } from '../lib/store';

	interface Props {
		ingredient: Ingredient | null;
		isOpen: boolean;
		onClose: () => void;
		onUnlock: () => void;
	}

	let { ingredient, isOpen, onClose, onUnlock }: Props = $props();

	// 스타 보유량
	let totalStars = $derived($starStore);

	// 영구 해금 상태
	let permanentUnlocks = $derived($permanentUnlockStore);

	// 미해금 하위 재료 목록 계산
	let unlockedRequirements = $derived.by(() => {
		if (!ingredient) return [];

		const requiredIds = getRequiredIngredients(ingredient.id);
		// G등급과 이미 해금된 재료 제외
		return requiredIds.filter((id) => {
			const ing = findIngredientById(id);
			if (!ing) return false;
			if (ing.grade === 'G') return false;
			if (permanentUnlocks.has(id)) return false;
			return true;
		});
	});

	// 미해금 하위 재료 객체들
	let unlockedRequirementItems = $derived(
		unlockedRequirements
			.map((id) => findIngredientById(id))
			.filter((ing): ing is Ingredient => ing !== undefined)
	);

	// 바로 해금 가능 여부
	let canUnlockDirectly = $derived(unlockedRequirements.length === 0);

	// 이 재료의 해금 비용
	let singleCost = $derived(ingredient ? (UNLOCK_COSTS[ingredient.grade] ?? 0) : 0);

	// 전체 해금 비용 (이 재료 + 미해금 하위 재료)
	let totalCost = $derived.by(() => {
		if (!ingredient) return 0;

		let cost = permanentUnlocks.has(ingredient.id) ? 0 : singleCost;

		for (const id of unlockedRequirements) {
			const ing = findIngredientById(id);
			if (ing) {
				cost += UNLOCK_COSTS[ing.grade] ?? 0;
			}
		}

		return cost;
	});

	// 구매 가능 여부
	let canAfford = $derived(totalStars >= totalCost);

	// 이미 해금됨
	let isAlreadyUnlocked = $derived(ingredient ? permanentUnlocks.has(ingredient.id) : false);

	// 해금 처리
	function handleUnlock() {
		if (!ingredient || !canAfford) return;

		// 하위 재료 먼저 해금
		if (unlockedRequirements.length > 0) {
			permanentUnlockStore.unlockMultiple(unlockedRequirements);
		}

		// 이 재료 해금
		if (!permanentUnlocks.has(ingredient.id)) {
			permanentUnlockStore.unlock(ingredient.id);
		}

		// 스타 차감
		starStore.spend(totalCost);

		onUnlock();
		onClose();
	}

	// 배경 클릭 시 닫기
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}
</script>

{#if isOpen && ingredient}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="dialog-backdrop" onclick={handleBackdropClick}>
		<div class="dialog-content">
			<!-- 닫기 버튼 -->
			<button class="close-btn" onclick={onClose}>
				<X size={20} />
			</button>

			<!-- 재료 정보 -->
			<div class="ingredient-preview">
				<img src={ingredient.imageUrl} alt={ingredient.name} class="ingredient-image" />
				<span class="grade-badge" style="background-color: {GRADE_COLORS[ingredient.grade]}">
					{ingredient.grade}
				</span>
			</div>

			<h2 class="ingredient-name">{ingredient.name}</h2>

			{#if isAlreadyUnlocked}
				<!-- 이미 해금됨 -->
				<div class="already-unlocked">
					<span class="check-icon">✓</span>
					<span>이미 해금되었습니다</span>
				</div>
			{:else}
				<!-- 하위 재료 필요 경고 -->
				{#if !canUnlockDirectly}
					<div class="warning-box">
						<TriangleAlert size={18} />
						<span>먼저 해금이 필요해요</span>
					</div>

					<!-- 미해금 하위 재료 스택 -->
					<div class="required-ingredients">
						<div class="ingredient-stack">
							{#each unlockedRequirementItems.slice(0, 4) as item, i}
								<div class="stack-item" style="z-index: {10 - i}; margin-left: {i * -12}px;">
									<img src={item.imageUrl} alt={item.name} />
								</div>
							{/each}
							{#if unlockedRequirementItems.length > 4}
								<div class="stack-more" style="margin-left: {4 * -12}px;">
									+{unlockedRequirementItems.length - 4}
								</div>
							{/if}
						</div>
						<p class="required-text">
							{#if unlockedRequirementItems.length === 1}
								{unlockedRequirementItems[0].name}
							{:else}
								{unlockedRequirementItems[0].name} 외 {unlockedRequirementItems.length - 1}개
							{/if}
						</p>
					</div>
				{/if}

				<!-- 비용 및 해금 버튼 -->
				<div class="unlock-section">
					<div class="cost-display">
						<Star size={20} class="star-icon" />
						<span class="cost-amount">{totalCost}</span>
					</div>

					<button
						class="unlock-btn"
						class:disabled={!canAfford}
						disabled={!canAfford}
						onclick={handleUnlock}
					>
						{#if canUnlockDirectly}
							해금하기
						{:else}
							전체 해금하기
						{/if}
					</button>

					{#if !canAfford}
						<p class="not-enough">스타가 부족합니다</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference '$styles/app.css';

	.dialog-backdrop {
		@apply fixed inset-0;
		@apply z-50;
		@apply flex items-center justify-center;
		@apply bg-black/50;
		@apply p-4;
	}

	.dialog-content {
		@apply relative;
		@apply w-full max-w-sm;
		@apply bg-base-100;
		@apply rounded-2xl;
		@apply p-6;
		@apply shadow-xl;
		@apply flex flex-col items-center;
	}

	.close-btn {
		@apply absolute top-3 right-3;
		@apply p-2;
		@apply rounded-full;
		@apply text-base-content/50;
		@apply hover:bg-base-200;
		@apply transition-colors;
	}

	/* 재료 미리보기 */
	.ingredient-preview {
		@apply relative;
		@apply mb-3;
	}

	.ingredient-image {
		@apply h-24 w-24;
		@apply rounded-2xl;
		@apply object-contain;
		@apply bg-base-200;
		@apply p-2;
	}

	.grade-badge {
		@apply absolute -right-1 -bottom-1;
		@apply px-2 py-0.5;
		@apply rounded-full;
		@apply text-sm font-bold text-white;
	}

	.ingredient-name {
		@apply text-xl font-bold;
		@apply text-base-content;
		@apply mb-4;
	}

	/* 이미 해금됨 */
	.already-unlocked {
		@apply flex items-center gap-2;
		@apply text-green-600;
		@apply font-medium;
	}

	.check-icon {
		@apply flex items-center justify-center;
		@apply h-6 w-6;
		@apply rounded-full;
		@apply bg-green-500;
		@apply text-sm font-bold text-white;
	}

	/* 경고 박스 */
	.warning-box {
		@apply flex items-center gap-2;
		@apply px-4 py-2;
		@apply rounded-lg;
		@apply bg-amber-100;
		@apply text-amber-700;
		@apply text-sm font-medium;
		@apply mb-4;
	}

	/* 미해금 하위 재료 */
	.required-ingredients {
		@apply flex flex-col items-center;
		@apply mb-4;
	}

	.ingredient-stack {
		@apply flex items-center;
		@apply mb-2;
	}

	.stack-item {
		@apply relative;
		@apply h-10 w-10;
		@apply rounded-full;
		@apply bg-base-200;
		@apply border-base-100 border-2;
		@apply overflow-hidden;
		@apply flex-shrink-0;
	}

	.stack-item:first-child {
		margin-left: 0 !important;
	}

	.stack-item img {
		@apply h-full w-full;
		@apply object-contain;
		@apply p-1;
	}

	.stack-more {
		@apply relative;
		@apply h-10 w-10;
		@apply rounded-full;
		@apply bg-base-300;
		@apply border-base-100 border-2;
		@apply flex items-center justify-center;
		@apply text-xs font-bold;
		@apply text-base-content/70;
		@apply flex-shrink-0;
	}

	.required-text {
		@apply text-sm;
		@apply text-base-content/60;
	}

	/* 해금 섹션 */
	.unlock-section {
		@apply flex flex-col items-center;
		@apply w-full;
	}

	.cost-display {
		@apply flex items-center gap-1;
		@apply mb-3;
	}

	.cost-display :global(.star-icon) {
		@apply text-yellow-500;
		fill: currentColor;
	}

	.cost-amount {
		@apply text-2xl font-bold;
		@apply text-yellow-600;
	}

	.unlock-btn {
		@apply w-full;
		@apply py-3;
		@apply rounded-xl;
		@apply bg-gradient-to-r from-purple-500 to-indigo-500;
		@apply font-bold text-white;
		@apply transition-all;
		@apply active:scale-95;
	}

	.unlock-btn:hover:not(:disabled) {
		@apply from-purple-600 to-indigo-600;
	}

	.unlock-btn.disabled {
		@apply bg-base-300 from-base-300 to-base-300;
		@apply text-base-content/30;
		@apply cursor-not-allowed;
	}

	.not-enough {
		@apply mt-2;
		@apply text-sm;
		@apply text-error;
	}
</style>
