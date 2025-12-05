<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import IngredientSelectScreen from '../components/IngredientSelectScreen.svelte';
	import CookingScreen from '../components/CookingScreen.svelte';
	import DishResultScreen from '../components/DishResultScreen.svelte';
	import RestartModal from '../components/RestartModal.svelte';
	import TaxModal from '../components/TaxModal.svelte';
	import RunEndModal from '../components/RunEndModal.svelte';
	import { findRecipe } from '../lib/usecase/findRecipe';
	import {
		unlockedIngredientsStore,
		failedCombinationsStore,
		triedCombinationsStore,
		successCombinationsStore,
		newIngredientsStore,
		runStore,
		starStore,
		upgradeStore
	} from '../lib/store';
	import { missionStore } from '../lib/mission-store';
	import { toastStore } from '../lib/toast-store';
	import { findIngredientById } from '../lib/data/ingredients';
	import { modalStore } from '$lib/stores/modal';
	import type { Recipe, Ingredient } from '../lib/types';
	import type { TaxResult } from '../lib/store';

	// 런 상태
	let runState = $derived($runStore);

	// 다음 세금까지 남은 턴
	let turnsUntilTax = $derived(runStore.getTurnsUntilTax(runState.turn));

	// 업그레이드 효과
	let upgradeEffects = $derived(upgradeStore.getEffects());

	// 할인 적용된 가격 계산
	function getDiscountedPrice(basePrice: number): number {
		const discount = upgradeEffects.ingredientDiscountRate;
		return Math.round(basePrice * (1 - discount));
	}

	// 선택 상태
	let selectedIngredients = $state<number[]>([]);

	// 단계별 상태 관리
	let step = $state<'ingredient' | 'cooking' | 'result'>('ingredient');
	let currentRecipe = $state<Recipe | null>(null);
	let resultIngredient = $state<Ingredient | null>(null);
	let currentIngredientCost = $state(0);

	// 세금/런종료 모달 상태
	let showTaxModal = $state(false);
	let showRunEndModal = $state(false);
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
					showRunEndModal = true;
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

		// 2. 재료비 계산 (할인 적용, 이미 차감되었으므로 기록만)
		currentIngredientCost = selectedIngredients.reduce((sum, id) => {
			const ing = findIngredientById(id);
			return sum + getDiscountedPrice(ing?.buyPrice ?? 0);
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

			// 2. 이미 발견한 레시피인지 확인
			const alreadyDiscovered = $unlockedIngredientsStore.includes(
				currentRecipe.resultIngredientId
			);

			// 3. 재료 오픈
			unlockedIngredientsStore.unlock(currentRecipe.resultIngredientId);

			// 4. 재료인 경우 NEW 뱃지 추가
			if (result.isIngredient) {
				newIngredientsStore.add(currentRecipe.resultIngredientId);
				// 새 재료 발견 미션
				if (!alreadyDiscovered) {
					missionStore.onDiscoverIngredient();
				}
			}

			// 5. 미션 업데이트
			missionStore.onCook(result.grade, result.sellPrice ?? 0);

			// 6. 새 레시피 발견 미션
			if (!alreadyDiscovered) {
				missionStore.onDiscoverRecipe();
			}
		}

		// 7. 결과 화면 표시
		step = 'result';
	}

	// 결과 확인 완료
	async function handleResultComplete() {
		// 턴 증가 + 세금 체크
		const taxResult = runStore.nextTurn();

		if (taxResult.collected) {
			lastTaxResult = taxResult;

			if (taxResult.isBankrupt) {
				// 파산 → 런 종료 모달 표시
				showRunEndModal = true;
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

	// 런 종료 모달 확인 (파산/포기)
	function handleRunEndConfirm() {
		// 스타 지급
		if (runState.earnedStars > 0) {
			starStore.add(runState.earnedStars);
		}
		showRunEndModal = false;
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
	<!-- 세금 모달 -->
	{#if showTaxModal && lastTaxResult}
		<TaxModal
			taxAmount={lastTaxResult.taxAmount}
			capitalAfterTax={runState.capital}
			onConfirm={handleTaxConfirm}
		/>
	{/if}

	<!-- 런 종료 모달 (파산/포기) -->
	{#if showRunEndModal}
		<RunEndModal
			isBankrupt={runState.isBankrupt}
			survivedTurns={runState.turn}
			earnedStars={runState.earnedStars}
			finalCapital={runState.capital}
			onConfirm={handleRunEndConfirm}
		/>
	{/if}

	<!-- 게임 화면 -->
	<div class="game-area">
		{#if step === 'ingredient'}
			<!-- 재료 선택 화면 -->
			<IngredientSelectScreen
				bind:selectedIds={selectedIngredients}
				onCook={handleCookRequest}
				capital={runState.capital}
				earnedStars={runState.earnedStars}
				{turnsUntilTax}
			/>
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
		background: linear-gradient(to bottom, #fff8e1, #ffecb3);
	}

	.game-area {
		@apply flex-1;
		@apply overflow-hidden;
	}
</style>
