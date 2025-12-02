<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Coins } from 'lucide-svelte';
	import IngredientSelectScreen from '../components/IngredientSelectScreen.svelte';
	import CookingScreen from '../components/CookingScreen.svelte';
	import DishResultScreen from '../components/DishResultScreen.svelte';
	import RestartModal from '../components/RestartModal.svelte';
	import TaxModal from '../components/TaxModal.svelte';
	import BankruptModal from '../components/BankruptModal.svelte';
	import { findRecipe } from '../lib/usecase/findRecipe';
	import {
		unlockedIngredientsStore,
		failedCombinationsStore,
		triedCombinationsStore,
		successCombinationsStore,
		newIngredientsStore,
		runStore,
		RUN_CONFIG
	} from '../lib/store';
	import { findIngredientById } from '../lib/data/ingredients';
	import { modalStore } from '$lib/stores/modal';
	import type { Recipe, Ingredient } from '../lib/types';
	import type { TaxResult } from '../lib/store';

	// 런 상태
	let runState = $derived($runStore);

	// 다음 세금까지 남은 턴
	let turnsUntilTax = $derived(runStore.getTurnsUntilTax(runState.turn));

	// 선택 상태
	let selectedIngredients = $state<number[]>([]);

	// 단계별 상태 관리
	let step = $state<'ingredient' | 'cooking' | 'result'>('ingredient');
	let currentRecipe = $state<Recipe | null>(null);
	let resultIngredient = $state<Ingredient | null>(null);
	let currentIngredientCost = $state(0);

	// 세금/파산 모달 상태
	let showTaxModal = $state(false);
	let showBankruptModal = $state(false);
	let lastTaxResult = $state<TaxResult | null>(null);

	// 조리 시작 (조리기구 선택 없이 바로)
	function handleCookRequest() {
		// 1. 레시피 찾기
		const recipe = findRecipe(selectedIngredients);

		if (!recipe) {
			// 실패한 조합 저장
			failedCombinationsStore.addFailed(selectedIngredients);
			triedCombinationsStore.addTried(selectedIngredients);

			// 턴 증가 + 세금 체크
			const taxResult = runStore.nextTurn();

			if (taxResult.collected) {
				lastTaxResult = taxResult;
				if (taxResult.isBankrupt) {
					showBankruptModal = true;
				} else {
					showTaxModal = true;
				}
				selectedIngredients = [];
				return;
			}

			alert('해당 조합으로 만들 수 있는 요리가 없습니다!');
			selectedIngredients = [];
			return;
		}

		// 2. 재료비 계산 (이미 차감되었으므로 기록만)
		currentIngredientCost = selectedIngredients.reduce((sum, id) => {
			const ing = findIngredientById(id);
			return sum + (ing?.buyPrice ?? 0);
		}, 0);

		// 3. 성공한 조합 저장
		triedCombinationsStore.addTried(selectedIngredients);
		successCombinationsStore.addSuccess(selectedIngredients, recipe.resultIngredientId);

		// 4. 조리 시작 (cooking 화면 전환)
		currentRecipe = recipe;
		step = 'cooking';
	}

	// 조리 완료
	async function handleCookingComplete() {
		if (!currentRecipe) return;

		// 1. 결과 재료 가져오기
		const result = findIngredientById(currentRecipe.resultIngredientId);
		if (result) {
			resultIngredient = result;
			// 2. 재료 오픈
			unlockedIngredientsStore.unlock(currentRecipe.resultIngredientId);
			// 3. 재료인 경우 NEW 뱃지 추가
			if (result.isIngredient) {
				newIngredientsStore.add(currentRecipe.resultIngredientId);
			}
		}

		// 4. 결과 화면 표시
		step = 'result';
	}

	// 결과 확인 완료
	async function handleResultComplete() {
		// 턴 증가 + 세금 체크
		const taxResult = runStore.nextTurn();

		if (taxResult.collected) {
			lastTaxResult = taxResult;

			if (taxResult.isBankrupt) {
				// 파산 모달 표시
				showBankruptModal = true;
			} else {
				// 세금 모달 표시
				showTaxModal = true;
			}
			return; // 모달 닫힌 후 계속 진행
		}

		// 다시하기 모달 표시
		await modalStore.open({
			component: RestartModal,
			props: {},
			hideClose: true
		});

		// 초기화
		resetRound();
	}

	// 세금 모달 확인
	function handleTaxConfirm() {
		showTaxModal = false;
		continueAfterTax();
	}

	// 파산 모달 확인
	function handleBankruptConfirm() {
		showBankruptModal = false;
		runStore.endRun();
		goto('/cook2');
	}

	// 세금 납부 후 계속
	async function continueAfterTax() {
		await modalStore.open({
			component: RestartModal,
			props: {},
			hideClose: true
		});
		resetRound();
	}

	// 라운드 초기화
	function resetRound() {
		step = 'ingredient';
		selectedIngredients = [];
		currentRecipe = null;
		resultIngredient = null;
		currentIngredientCost = 0;
	}

	// 바로 써보기 (새 재료를 첫 번째 슬롯에 넣고 시작)
	function handleUseNow(ingredientId: number) {
		step = 'ingredient';
		selectedIngredients = [ingredientId];
		currentRecipe = null;
		resultIngredient = null;
	}

	// 런 시작 (페이지 진입 시)
	onMount(() => {
		if (!runState.isRunning) {
			runStore.startRun();
		}
	});
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
	/>
</svelte:head>

<div class="play-container">
	<!-- 상단 자본 표시 (조리 중에는 숨김) -->
	{#if step !== 'cooking'}
		<div class="capital-bar">
			<div class="capital-display">
				<Coins size={20} class="text-yellow-500" />
				<span class="capital-amount" class:negative={runState.capital < 0}>
					{runState.capital.toLocaleString()}원
				</span>
			</div>
			<div class="turn-display">
				<span class="turn-label">세금까지</span>
				<span class="turn-count">{turnsUntilTax}턴</span>
			</div>
		</div>
	{/if}

	<!-- 세금 모달 -->
	{#if showTaxModal && lastTaxResult}
		<TaxModal
			taxAmount={lastTaxResult.taxAmount}
			capitalAfterTax={runState.capital}
			onConfirm={handleTaxConfirm}
		/>
	{/if}

	<!-- 파산 모달 -->
	{#if showBankruptModal}
		<BankruptModal finalCapital={runState.capital} onConfirm={handleBankruptConfirm} />
	{/if}

	<!-- 게임 화면 -->
	<div class="game-area">
		{#if step === 'ingredient'}
			<!-- 재료 선택 화면 -->
			<IngredientSelectScreen bind:selectedIds={selectedIngredients} onCook={handleCookRequest} />
		{:else if step === 'cooking'}
			<!-- 조리 화면 -->
			<CookingScreen onComplete={handleCookingComplete} {selectedIngredients} />
		{:else if step === 'result' && resultIngredient && currentRecipe}
			<!-- 결과 화면 -->
			<DishResultScreen
				{resultIngredient}
				recipe={currentRecipe}
				ingredientCost={currentIngredientCost}
				onComplete={handleResultComplete}
				onUseNow={resultIngredient.isIngredient ? handleUseNow : undefined}
			/>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	:global(:root) {
		/* vw 기반 폰트 크기 */
		--font-xxl: clamp(28px, 7vw, 48px);
		--font-xl: clamp(24px, 6vw, 40px);
		--font-lg: clamp(18px, 4.5vw, 32px);
		--font-md: clamp(14px, 3.5vw, 24px);
		--font-sm: clamp(12px, 3vw, 18px);
		--font-xs: clamp(10px, 2.5vw, 14px);

		/* vw 기반 간격 */
		--spacing-xl: clamp(24px, 6vw, 40px);
		--spacing-lg: clamp(16px, 4vw, 32px);
		--spacing-md: clamp(12px, 3vw, 24px);
		--spacing-sm: clamp(8px, 2vw, 16px);
		--spacing-xs: clamp(4px, 1vw, 8px);
	}

	.play-container {
		@apply flex flex-col;
		@apply h-screen;
		@apply bg-base-100;
	}

	.capital-bar {
		@apply flex items-center justify-between;
		@apply px-4 py-2;
		@apply bg-base-200;
		@apply border-base-300 border-b;
		flex-shrink: 0;
	}

	.capital-display {
		@apply flex items-center gap-2;
	}

	.capital-amount {
		@apply text-lg font-bold;
		@apply text-yellow-600;
	}

	.capital-amount.negative {
		@apply text-red-500;
	}

	.turn-display {
		@apply flex items-center gap-1.5;
		@apply px-2 py-1;
		@apply rounded-full bg-orange-100;
	}

	.turn-label {
		@apply text-xs text-orange-600;
	}

	.turn-count {
		@apply text-sm font-bold text-orange-700;
	}

	.game-area {
		@apply flex-1;
		@apply overflow-hidden;
	}
</style>
