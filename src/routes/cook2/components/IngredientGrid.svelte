<script lang="ts">
	import {
		unlockedIngredientsStore,
		triedCombinationsStore,
		successCombinationsStore,
		newIngredientsStore,
		runStore,
		upgradeStore
	} from '../lib/store';
	import { INGREDIENTS, findIngredientById } from '../lib/data/ingredients';
	import { getPossiblePairsFor } from '../lib/data/recipes';
	import { GRADE_COLORS, GRADE_NAMES, GRADE_ORDER } from '../lib/types';
	import type { IngredientGrade, Ingredient } from '../lib/types';
	import { haptic } from '../lib/native-bridge';
	import { getSoundManager } from '$lib/domain/sound';

	interface Props {
		/** 선택된 재료 ID 배열 (양방향 바인딩) */
		selectedIds: number[];
		/** 재료 선택 시 콜백 (좌표 정보 포함) */
		onSelect?: (ingredient: Ingredient, rect: DOMRect) => void;
	}

	let { selectedIds = $bindable(), onSelect }: Props = $props();

	// 현재 자본
	let runState = $derived($runStore);

	// 업그레이드 효과
	let upgradeEffects = $derived(upgradeStore.getEffects());

	// 재료/요리 탭
	// 등급 필터 탭 (G, F, E, D, C, B, A, R)
	const grades: IngredientGrade[] = GRADE_ORDER;
	let selectedGrade = $state<IngredientGrade | 'all'>('all');

	// 언락된 재료
	let unlockedIngredients = $derived($unlockedIngredientsStore);

	// 새로 획득한 재료 (NEW 뱃지)
	let newIngredientIds = $derived($newIngredientsStore);

	// 첫 번째 재료가 선택되었을 때, 이미 시도한 조합의 두 번째 재료 목록
	let triedPairIds = $derived(
		selectedIds.length === 1 ? triedCombinationsStore.getTriedPairsFor(selectedIds[0]) : []
	);

	// 첫 번째 재료가 선택되었을 때, 성공한 조합의 결과 맵 { secondIngredientId: resultIngredientId }
	let successResultsMap = $derived(
		selectedIds.length === 1 ? successCombinationsStore.getSuccessResultsFor(selectedIds[0]) : {}
	);

	// 첫 번째 선택된 재료 정보
	let firstSelectedIngredient = $derived(
		selectedIds.length === 1 ? findIngredientById(selectedIds[0]) : null
	);

	// G급 힌트 활성화 여부 (첫 번째 재료가 G급일 때만)
	let isHintEnabled = $derived(firstSelectedIngredient?.grade === 'G');

	// 첫 번째 재료가 선택되었을 때, 조합 가능한 두 번째 재료 ID 목록
	let possiblePairIds = $derived(
		selectedIds.length === 1 ? getPossiblePairsFor(selectedIds[0]) : []
	);

	// 필터링된 재료 목록
	let filteredIngredients = $derived(
		INGREDIENTS.filter((ing) => {
			if (!ing.isIngredient) return false;
			if (selectedGrade !== 'all' && ing.grade !== selectedGrade) return false;
			return true;
		})
	);

	// 필터링된 요리 목록
	let filteredDishes = $derived(
		INGREDIENTS.filter((ing) => {
			if (ing.isIngredient) return false;
			if (selectedGrade !== 'all' && ing.grade !== selectedGrade) return false;
			return true;
		})
	);

	// 해당 등급에 하나라도 해금된 재료가 있는지
	let hasUnlockedIngredient = $derived(
		filteredIngredients.some((i) => unlockedIngredients.includes(i.id))
	);

	// 해당 등급에 하나라도 해금된 요리가 있는지
	let hasUnlockedDish = $derived(filteredDishes.some((i) => unlockedIngredients.includes(i.id)));

	// 재료 가격 확인 (마이너스도 허용 - 세금 때 파산 판정)
	function canAfford(_ingredient: Ingredient): boolean {
		return true; // 항상 구매 가능
	}

	// 할인 적용된 가격 계산
	function getDiscountedPrice(basePrice: number): number {
		const discount = upgradeEffects.ingredientDiscountRate;
		return Math.round(basePrice * (1 - discount));
	}

	// 재료 추가 (같은 재료도 추가 가능, 최대 2개)
	function addIngredient(ingredient: Ingredient, event: MouseEvent) {
		if (selectedIds.length < 2) {
			const basePrice = ingredient.buyPrice ?? 0;
			const discountedPrice = getDiscountedPrice(basePrice);

			// 돈 부족하면 선택 불가
			if (!canAfford(ingredient)) {
				return;
			}

			// 돈 차감 (할인 적용)
			runStore.spend(discountedPrice);

			const target = event.currentTarget as HTMLElement;
			const rect = target.getBoundingClientRect();

			// 콜백으로 좌표 전달 (애니메이션용)
			onSelect?.(ingredient, rect);

			selectedIds = [...selectedIds, ingredient.id];
			// NEW 뱃지 제거
			newIngredientsStore.markSeen(ingredient.id);

			// 재료 선택 효과음 + 진동
			getSoundManager().playSfx('click');
			haptic('light');
		}
	}
</script>

<div class="ingredient-grid-container">
	<!-- 등급 필터 탭 -->
	<div class="grade-tabs">
		<button
			type="button"
			class="tab"
			class:active={selectedGrade === 'all'}
			onclick={() => (selectedGrade = 'all')}
		>
			전체
		</button>
		{#each grades as grade}
			<button
				type="button"
				class="tab"
				class:active={selectedGrade === grade}
				onclick={() => (selectedGrade = grade)}
				style="--grade-color: {GRADE_COLORS[grade]}"
			>
				{GRADE_NAMES[grade]}
			</button>
		{/each}
	</div>

	<div class="scroll-container">
		{#if selectedGrade === 'all'}
			<!-- 전체: 해금된 재료만 -->
			<div class="ingredient-grid" style="padding: 12px;">
				{#each filteredIngredients.filter( (i) => unlockedIngredients.includes(i.id) ) as ingredient (ingredient.id)}
					{@const isTried = triedPairIds.includes(ingredient.id)}
					{@const isNew = newIngredientIds.has(ingredient.id)}
					{@const resultId = successResultsMap[ingredient.id]}
					{@const resultIngredient = resultId ? findIngredientById(resultId) : null}
					{@const isPossible = possiblePairIds.includes(ingredient.id)}
					{@const isImpossible =
						isHintEnabled && selectedIds.length === 1 && !isPossible && !isTried}
					{@const price = ingredient.buyPrice ?? 0}
					{@const affordable = canAfford(ingredient)}

					<button
						type="button"
						class="ingredient-card"
						class:tried={isTried && selectedIds.length === 1}
						class:possible={isHintEnabled && isPossible && !isTried && selectedIds.length === 1}
						class:impossible={isImpossible}
						class:is-new={isNew}
						class:unaffordable={!affordable}
						onclick={(e) => addIngredient(ingredient, e)}
						disabled={!affordable}
						style="--grade-color: {GRADE_COLORS[ingredient.grade]}"
					>
						<img src={ingredient.imageUrl} alt={ingredient.name} class="ingredient-image" />
						<div class="ingredient-name">{ingredient.name}</div>
						{#if isNew}
							<div class="new-badge">NEW</div>
						{/if}
						{#if resultIngredient && selectedIds.length === 1}
							<div class="result-badge">
								<img
									src={resultIngredient.imageUrl}
									alt={resultIngredient.name}
									class="result-image"
								/>
							</div>
						{/if}
					</button>
				{/each}
			</div>
		{:else}
			<!-- 등급별: 재료 섹션 + 요리 섹션 -->
			<!-- 재료 섹션 (재료가 있고, 하나라도 해금되었을 때만) -->
			{#if filteredIngredients.length > 0 && hasUnlockedIngredient}
				<div class="section">
					<div class="section-header">
						<span class="section-title">🥬 재료</span>
						<span class="section-count"
							>{filteredIngredients.filter((i) => unlockedIngredients.includes(i.id))
								.length}/{filteredIngredients.length}</span
						>
					</div>
					<div class="ingredient-grid">
						{#each filteredIngredients as ingredient (ingredient.id)}
							{@const isUnlocked = unlockedIngredients.includes(ingredient.id)}
							{@const isTried = triedPairIds.includes(ingredient.id)}
							{@const isNew = newIngredientIds.has(ingredient.id)}
							{@const resultId = successResultsMap[ingredient.id]}
							{@const resultIngredient = resultId ? findIngredientById(resultId) : null}
							{@const isPossible = possiblePairIds.includes(ingredient.id)}
							{@const isImpossible =
								isHintEnabled && selectedIds.length === 1 && !isPossible && !isTried}
							{@const price = ingredient.buyPrice ?? 0}
							{@const affordable = canAfford(ingredient)}

							{#if isUnlocked}
								<button
									type="button"
									class="ingredient-card"
									class:tried={isTried && selectedIds.length === 1}
									class:possible={isHintEnabled &&
										isPossible &&
										!isTried &&
										selectedIds.length === 1}
									class:impossible={isImpossible}
									class:is-new={isNew}
									class:unaffordable={!affordable}
									onclick={(e) => addIngredient(ingredient, e)}
									disabled={!affordable}
									style="--grade-color: {GRADE_COLORS[ingredient.grade]}"
								>
									<img src={ingredient.imageUrl} alt={ingredient.name} class="ingredient-image" />
									<div class="ingredient-name">{ingredient.name}</div>
									{#if isNew}
										<div class="new-badge">NEW</div>
									{/if}
									{#if resultIngredient && selectedIds.length === 1}
										<div class="result-badge">
											<img
												src={resultIngredient.imageUrl}
												alt={resultIngredient.name}
												class="result-image"
											/>
										</div>
									{/if}
								</button>
							{:else}
								<div class="ingredient-card locked">
									<div class="locked-image">
										<img src={ingredient.imageUrl} alt="?" class="silhouette-image" />
									</div>
									<div class="locked-text">?</div>
									<div class="ingredient-grade" style="color: {GRADE_COLORS[ingredient.grade]}">
										{ingredient.grade}
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/if}

			<!-- 요리 섹션 (하나라도 해금되었을 때만) -->
			{#if hasUnlockedDish}
				<div class="section">
					<div class="section-header">
						<span class="section-title">🍳 요리</span>
						<span class="section-count"
							>{filteredDishes.filter((i) => unlockedIngredients.includes(i.id))
								.length}/{filteredDishes.length}</span
						>
					</div>
					<div class="ingredient-grid">
						{#each filteredDishes as dish (dish.id)}
							{@const isUnlocked = unlockedIngredients.includes(dish.id)}

							{#if isUnlocked}
								<div
									class="ingredient-card dish-card"
									style="--grade-color: {GRADE_COLORS[dish.grade]}"
								>
									<img src={dish.imageUrl} alt={dish.name} class="ingredient-image" />
									<div class="ingredient-name">{dish.name}</div>
									<div class="ingredient-grade" style="color: {GRADE_COLORS[dish.grade]}">
										{dish.grade}
									</div>
								</div>
							{:else}
								<div class="ingredient-card locked">
									<div class="locked-image">
										<img src={dish.imageUrl} alt="?" class="silhouette-image" />
									</div>
									<div class="locked-text">?</div>
									<div class="ingredient-grade" style="color: {GRADE_COLORS[dish.grade]}">
										{dish.grade}
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.ingredient-grid-container {
		@apply flex flex-col;
		@apply h-full;
		background: linear-gradient(to bottom, #fffde7, #fff8e1);
		overflow: hidden;
	}

	.grade-tabs {
		@apply flex gap-1.5;
		@apply px-2 py-2;
		background: rgba(255, 255, 255, 0.7);
		border-bottom: 3px solid #e8d4a8;
		@apply overflow-x-auto;
		flex-shrink: 0;
	}

	.tab {
		@apply px-3 py-1.5;
		@apply rounded-xl;
		@apply font-bold;
		@apply transition-all;
		@apply whitespace-nowrap;
		font-size: var(--font-xs);
		flex-shrink: 0;
		background: rgba(255, 255, 255, 0.6);
		color: #8d6e63;
		border: 2px solid #d7ccc8;
	}

	.tab:hover {
		background: rgba(255, 255, 255, 0.9);
	}

	.tab.active {
		background: linear-gradient(to bottom, #ffb74d, #ff9800);
		color: #5d4037;
		border-color: #f57c00;
		box-shadow: 0 2px 0 #e65100;
	}

	/* 스크롤 컨테이너 */
	.scroll-container {
		@apply flex-1;
		@apply overflow-y-auto;
	}

	/* 섹션 */
	.section {
		@apply p-3;
		@apply pb-2;
	}

	.section-header {
		@apply flex items-center justify-between;
		@apply mb-2 px-1;
	}

	.section-title {
		@apply font-bold;
		color: #5d4037;
		font-size: var(--font-sm);
	}

	.section-count {
		@apply font-medium;
		color: #a1887f;
		font-size: var(--font-xs);
	}

	.ingredient-grid {
		@apply grid grid-cols-4 gap-2;
		@apply content-start;
	}

	.ingredient-card {
		@apply aspect-square;
		@apply rounded-2xl;
		@apply flex flex-col items-center justify-center gap-1;
		@apply p-2;
		@apply outline-none;
		@apply relative;
		background: rgba(255, 255, 255, 0.9);
		border: 3px solid #e8d4a8;
		box-shadow:
			0 3px 6px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.ingredient-card:active {
		animation: cardPop 0.2s ease-out;
	}

	@keyframes cardPop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(0.9);
		}
		100% {
			transform: scale(1);
		}
	}

	/* 이미 시도한 조합 (딤 처리) */
	.ingredient-card.tried {
		@apply opacity-40;
		background: #e0d4c0;
		filter: grayscale(50%);
	}

	/* 조합 가능 (강조) */
	.ingredient-card.possible {
		border-color: #81c784;
		background: linear-gradient(to bottom, #e8f5e9, #c8e6c9);
		box-shadow:
			0 0 8px rgba(76, 175, 80, 0.4),
			0 3px 6px rgba(0, 0, 0, 0.1);
	}

	/* 요리 카드 (선택 불가, 보기만) */
	.ingredient-card.dish-card {
		@apply cursor-default;
		background: linear-gradient(to bottom, #fff8e1, #ffecb3);
		border-color: #ffb74d;
	}

	/* 미해금 (실루엣) */
	.ingredient-card.locked {
		background: rgba(200, 190, 170, 0.5);
		border-color: #c9b896;
		@apply cursor-default;
	}

	.locked-image {
		@apply h-12 w-12;
		@apply flex items-center justify-center;
		@apply overflow-hidden;
	}

	.silhouette-image {
		@apply h-full w-full;
		@apply object-contain;
		filter: brightness(0) opacity(0.15);
	}

	.locked-text {
		@apply font-bold;
		color: #a1887f;
		font-size: var(--font-md);
	}

	/* 조합 불가능 (더 흐리게) */
	.ingredient-card.impossible {
		@apply opacity-30;
		filter: grayscale(70%);
	}

	/* NEW 뱃지 */
	.ingredient-card.is-new {
		border-color: #81c784;
		animation: newGlow 1.5s ease-in-out infinite;
	}

	@keyframes newGlow {
		0%,
		100% {
			box-shadow:
				0 0 8px rgba(76, 175, 80, 0.4),
				0 3px 6px rgba(0, 0, 0, 0.1);
		}
		50% {
			box-shadow:
				0 0 16px rgba(76, 175, 80, 0.7),
				0 3px 6px rgba(0, 0, 0, 0.1);
		}
	}

	.new-badge {
		@apply absolute -top-1 -left-1;
		@apply px-1.5 py-0.5;
		@apply text-xs font-bold text-white;
		background: linear-gradient(to bottom, #81c784, #4caf50);
		border: 2px solid #388e3c;
		@apply rounded-lg;
		box-shadow: 0 2px 0 #2e7d32;
		animation: newBadgePulse 1s ease-in-out infinite;
	}

	@keyframes newBadgePulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.ingredient-image {
		@apply h-12 w-12;
		@apply object-contain;
		@apply rounded-lg;
		filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.1));
	}

	.ingredient-name {
		@apply text-center font-bold;
		font-size: var(--font-xs);
		color: #5d4037;
		@apply break-keep;
		@apply leading-tight;
	}

	.ingredient-grade {
		@apply font-bold;
		font-size: clamp(8px, 2vw, 10px);
	}

	.empty-message {
		@apply col-span-3;
		@apply flex items-center justify-center;
		color: #a1887f;
		@apply py-8;
	}

	/* 결과 요리 뱃지 (우하단) */
	.result-badge {
		@apply absolute -right-1 -bottom-1;
		@apply h-7 w-7;
		@apply rounded-full;
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid #ffb74d;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
		@apply flex items-center justify-center;
		@apply overflow-hidden;
	}

	.result-image {
		@apply h-5 w-5;
		@apply object-contain;
	}

	/* 구매 불가 */
	.ingredient-card.unaffordable {
		@apply opacity-50;
		@apply cursor-not-allowed;
		filter: grayscale(50%);
	}

	.ingredient-card.unaffordable:active {
		animation: none;
	}
</style>
