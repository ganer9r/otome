<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getSoundManager } from '$lib/domain/sound';
	import IngredientSelectScreen from '../components/IngredientSelectScreen.svelte';
	import CookingScreen from '../components/CookingScreen.svelte';
	import DishResultScreen from '../components/DishResultScreen.svelte';
	import ExplosionFailScreen from '../components/ExplosionFailScreen.svelte';
	import RestartModal from '../components/RestartModal.svelte';
	import TaxModal from '../components/TaxModal.svelte';
	import RunEndModal from '../components/RunEndModal.svelte';
	import OrderArrivalModal from '../components/OrderArrivalModal.svelte';
	import OrderCompleteModal from '../components/OrderCompleteModal.svelte';
	import OrderFailModal from '../components/OrderFailModal.svelte';
	import OnboardingOverlay, {
		isOnboardingComplete,
		advanceHintStep
	} from '../components/OnboardingOverlay.svelte';
	import GameHUD from '../components/GameHUD.svelte';
	import { findRecipe } from '../lib/usecase/findRecipe';
	import { cookDish } from '../lib/usecase/cookDish';
	import type { CookResult } from '../lib/types';
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
	// import { missionStore } from '../lib/mission-store';
	import { customerStore, getOrderHintsForModal } from '../lib/customer-store';
	import CustomerOrderBadge from '../components/CustomerOrderBadge.svelte';
	import { findIngredientById } from '../lib/data/ingredients';
	import { modalStore } from '$lib/stores/modal';
	import { showInterstitialAd } from '../lib/native-bridge';
	import type { Recipe, Ingredient } from '../lib/types';
	import type { TaxResult } from '../lib/store';

	// 인터스티셜 광고 타이밍 관리 (3~5분 랜덤 간격)
	const AD_MIN_INTERVAL = 3 * 60 * 1000; // 3분
	const AD_MAX_INTERVAL = 5 * 60 * 1000; // 5분
	let lastAdTime = Date.now(); // 런 시작 시점 기준
	let nextAdInterval = getRandomAdInterval();

	function getRandomAdInterval(): number {
		return AD_MIN_INTERVAL + Math.random() * (AD_MAX_INTERVAL - AD_MIN_INTERVAL);
	}

	function shouldShowInterstitialAd(): boolean {
		const elapsed = Date.now() - lastAdTime;
		return elapsed >= nextAdInterval;
	}

	async function tryShowInterstitialAd(): Promise<void> {
		if (shouldShowInterstitialAd()) {
			await showInterstitialAd();
			lastAdTime = Date.now();
			nextAdInterval = getRandomAdInterval();
		}
	}

	// 런 상태
	let runState = $derived($runStore);

	// 다음 세금까지 남은 턴
	let turnsUntilTax = $derived(runStore.getTurnsUntilTax(runState.turn));

	// 세금률
	let taxRate = $derived(customerStore.getTaxRate());

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
	let step = $state<'ingredient' | 'cooking' | 'result' | 'explosion'>('ingredient');
	let currentRecipe = $state<Recipe | null>(null);
	let resultIngredient = $state<Ingredient | null>(null);
	let currentIngredientCost = $state(0);
	let currentCookResult = $state<CookResult | null>(null);

	// 세금/런종료 모달 상태
	let showTaxModal = $state(false);
	let showRunEndModal = $state(false);
	let lastTaxResult = $state<TaxResult | null>(null);
	// 손님 실패 모달 후 런 종료 모달 표시 대기
	let pendingRunEndModal = $state(false);

	// 손님 상태
	let customerState = $derived($customerStore);

	// 보너스 획득 상태 (결과 화면에서 표시용)
	let earnedBonus = $state(0);

	// 테스트용 긴급도 오버라이드
	let testUrgency = $state<number | undefined>(undefined);

	// 주문 상태 (customerStore에서 직접 가져옴)
	let currentOrder = $derived(customerState.currentOrder);
	let orderConfirmed = $derived(customerState.orderConfirmed);
	let showOrderCompleteModal = $derived(customerState.showOrderCompleteModal);
	let showOrderFailModal = $derived(customerState.showOrderFailModal);
	let lastCompletedOrder = $derived(customerState.lastCompletedOrder);
	let lastFailedOrder = $derived(customerState.lastFailedOrder);

	// 새 주문 모달 표시 조건: 주문 있고 + 확인 안 됨 + 온보딩 완료
	let onboardingDone = $state(isOnboardingComplete());
	let showNewOrderModal = $derived(currentOrder && !orderConfirmed && onboardingDone);

	// 뱃지 표시 조건: 주문 있고 + 확인됨
	let showOrderBadge = $derived(currentOrder && orderConfirmed);

	// 새 주문 모달용 힌트
	let newOrderHints = $derived(getOrderHintsForModal(currentOrder));

	// 주문 완료 모달 대기 상태 (주방 복귀 시 표시)
	let pendingCompleteModal = $state(false);

	// 조리 시작 (조리기구 선택 없이 바로)
	function handleCookRequest() {
		// 1. 레시피 찾기
		const recipe = findRecipe(selectedIngredients);

		// 2. 재료비 계산 (할인 적용)
		currentIngredientCost = selectedIngredients.reduce((sum, id) => {
			const ing = findIngredientById(id);
			return sum + getDiscountedPrice(ing?.buyPrice ?? 0);
		}, 0);

		if (!recipe) {
			// 실패한 조합 저장
			failedCombinationsStore.addFailed(selectedIngredients);
			triedCombinationsStore.addTried(selectedIngredients);

			// 조리 화면으로 전환 (레시피 없음 = null 상태로)
			currentRecipe = null;
			step = 'cooking';
			return;
		}

		// 3. 시도한 조합 저장 (성공 조합은 요리 결과 판정 후에 저장)
		triedCombinationsStore.addTried(selectedIngredients);

		// 4. 조리 시작 (cooking 화면 전환)
		currentRecipe = recipe;
		step = 'cooking';
	}

	// 조리 완료
	async function handleCookingComplete() {
		// 레시피가 없으면 폭발 화면으로
		if (!currentRecipe) {
			step = 'explosion';
			return;
		}

		// 1. 결과 재료 가져오기
		const result = findIngredientById(currentRecipe.resultIngredientId);
		if (!result) {
			step = 'result';
			return;
		}

		resultIngredient = result;

		// 2. 요리 결과 판정 (critical/success/fail)
		currentCookResult = cookDish(result);

		// 요리 실패 시 (fail/total_fail) → 재료 해금, 성공 조합 저장 안 함
		const isCookingFailed =
			currentCookResult.resultType === 'fail' || currentCookResult.resultType === 'total_fail';

		if (!isCookingFailed) {
			// 3. 성공한 조합 저장 (성공/크리티컬일 때만)
			successCombinationsStore.addSuccess(selectedIngredients, currentRecipe.resultIngredientId);

			// 4. 재료 오픈 (성공/크리티컬일 때만)
			unlockedIngredientsStore.unlock(currentRecipe.resultIngredientId);

			// 5. 재료인 경우 NEW 뱃지 추가 (성공/크리티컬일 때만)
			if (result.isIngredient) {
				newIngredientsStore.add(currentRecipe.resultIngredientId);
			}

			// 6. 손님 주문 체크 → 보너스 지급 (성공/크리티컬일 때만)
			earnedBonus = customerStore.checkOrder(currentRecipe.resultIngredientId);
			if (earnedBonus > 0) {
				// 보너스 금액 추가
				runStore.earn(earnedBonus);
				// 주문 완료 모달 대기 (주방 복귀 시 표시)
				pendingCompleteModal = true;
			}
		}

		// 8. 힌트 학습 단계 증가
		advanceHintStep();

		// 9. 결과 화면 먼저 표시
		step = 'result';

		// 8. 결과 화면 뜬 후 미션 업데이트 (토스트가 결과 화면에서 보이도록)
		// 미션 시스템 임시 비활성화
		// setTimeout(() => {
		// 	missionStore.onCook(result.grade, currentCookResult?.sellPrice ?? 0);
		// }, 500);

		// setTimeout(() => {
		// 	if (!alreadyDiscovered) {
		// 		missionStore.onDiscoverRecipe();
		// 	}
		// }, 700);

		// setTimeout(() => {
		// 	if (result.isIngredient && !alreadyDiscovered) {
		// 		missionStore.onDiscoverIngredient();
		// 	}
		// }, 900);
	}

	// 결과 확인 완료
	async function handleResultComplete() {
		// 세금률 가져오기
		const taxRate = customerStore.getTaxRate();

		// 턴 증가 + 세금 체크 (세금률 전달)
		const taxResult = runStore.nextTurn(taxRate);

		// 손님 시스템: 턴 종료 처리 (휴식턴 감소, 새 손님 생성)
		customerStore.onTurnEnd(runState.turn);

		if (taxResult.collected) {
			lastTaxResult = taxResult;

			// 세금 주기 종료 → 미완료 주문 실패 처리
			customerStore.onTaxPeriodEnd(!taxResult.isBankrupt, runState.turn);

			// 손님 실패 모달이 있으면 먼저 표시, 없으면 바로 세금/런종료 모달
			if (customerState.showOrderFailModal) {
				// 손님 실패 모달 먼저, 런종료는 대기
				if (taxResult.isBankrupt) {
					pendingRunEndModal = true;
				} else {
					showTaxModal = true;
				}
			} else {
				// 손님 실패 없음 → 바로 세금/런종료 모달
				if (taxResult.isBankrupt) {
					showRunEndModal = true;
				} else {
					showTaxModal = true;
				}
			}
			return; // 모달 닫힌 후 계속 진행
		}

		// 인터스티셜 광고 (3~5분 간격)
		await tryShowInterstitialAd();

		// 다시하기 모달 표시
		await modalStore.open({
			component: RestartModal,
			props: {},
			hideClose: true
		});

		// 초기화
		resetRound();
	}

	// 폭발 실패 완료 (레시피 없는 조합)
	async function handleExplosionComplete() {
		// 세금률 가져오기
		const taxRate = customerStore.getTaxRate();

		// 턴 증가 + 세금 체크 (세금률 전달)
		const taxResult = runStore.nextTurn(taxRate);

		// 손님 시스템: 턴 종료 처리 (휴식턴 감소, 새 손님 생성)
		customerStore.onTurnEnd(runState.turn);

		if (taxResult.collected) {
			lastTaxResult = taxResult;

			// 세금 주기 종료 → 미완료 주문 실패 처리
			customerStore.onTaxPeriodEnd(!taxResult.isBankrupt, runState.turn);

			// 손님 실패 모달이 있으면 먼저 표시
			if (customerState.showOrderFailModal) {
				if (taxResult.isBankrupt) {
					pendingRunEndModal = true;
				} else {
					showTaxModal = true;
				}
			} else {
				if (taxResult.isBankrupt) {
					showRunEndModal = true;
				} else {
					showTaxModal = true;
				}
			}
			selectedIngredients = [];
			step = 'ingredient';
			return;
		}

		// 인터스티셜 광고 (3~5분 간격)
		await tryShowInterstitialAd();

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
		// 세금 주기 종료 → 새 주문 생성
		customerStore.onTaxPeriodEnd(true, runState.turn);
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
		earnedBonus = 0;

		// 주방 복귀 시 주문 완료 모달 표시 (대기 중이었다면)
		if (pendingCompleteModal) {
			pendingCompleteModal = false;
			customerStore.showOrderComplete();
		}
		// 새 주문 모달은 자동으로 표시됨 (currentOrder && !orderConfirmed)
	}

	// 새 주문 모달 확인 → 뱃지 표시
	function handleNewOrderConfirm() {
		customerStore.confirmOrder();
	}

	// 주문 완료 모달 닫기
	function handleOrderCompleteClose() {
		customerStore.closeOrderCompleteModal();
	}

	// 주문 실패 모달 닫기
	function handleOrderFailClose() {
		customerStore.closeOrderFailModal();

		// 런 종료 모달 대기 중이면 표시
		if (pendingRunEndModal) {
			pendingRunEndModal = false;
			showRunEndModal = true;
		}
		// orderConfirmed가 false로 유지되므로 새 주문 모달이 자동으로 표시됨
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
		// BGM 재생
		getSoundManager().playBgm('cook');

		if (!runState.isRunning) {
			runStore.startRun();
			// 손님 시스템 초기화 및 첫 주문 생성
			customerStore.startRun(0);
		}
		// 이어하기: 상태는 customerStore에서 자동으로 복원됨
		// - currentOrder && orderConfirmed → 뱃지 표시
		// - currentOrder && !orderConfirmed → 모달 표시
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

	<!-- 새 주문 도착 모달 (온보딩 완료 후에만) -->
	{#if showNewOrderModal && currentOrder && onboardingDone}
		<OrderArrivalModal
			order={currentOrder}
			hints={newOrderHints}
			onConfirm={handleNewOrderConfirm}
		/>
	{/if}

	<!-- 주문 완료 모달 -->
	{#if showOrderCompleteModal && lastCompletedOrder}
		<OrderCompleteModal order={lastCompletedOrder} onClose={handleOrderCompleteClose} />
	{/if}

	<!-- 주문 실패 모달 -->
	{#if showOrderFailModal && lastFailedOrder}
		<OrderFailModal order={lastFailedOrder} onClose={handleOrderFailClose} />
	{/if}

	<!-- 온보딩 오버레이 -->
	<OnboardingOverlay
		selectedCount={selectedIngredients.length}
		{step}
		onComplete={() => {
			onboardingDone = true;
			// 온보딩 완료 후 새 주문 모달은 첫 요리 완료 후 표시 (pendingNewOrderModal)
		}}
	/>

	<!-- 테스트 버튼 (숨김) -->
	<!-- <div class="test-controls">
		<div class="test-label">긴급도 테스트</div>
		<div class="test-buttons">
			<button class="test-btn" onclick={() => (testUrgency = 10)}>여유</button>
			<button class="test-btn" onclick={() => (testUrgency = 5)}>보통</button>
			<button class="test-btn" onclick={() => (testUrgency = 2)}>긴급</button>
			<button class="test-btn" onclick={() => (testUrgency = undefined)}>리셋</button>
		</div>
		<div class="test-label">주문 테스트</div>
		<div class="test-buttons">
			<button class="test-btn" onclick={() => customerStore.setTestOrder(13, runState.turn)}>
				F급
			</button>
			<button class="test-btn" onclick={() => customerStore.setTestOrder(313, runState.turn)}>
				C급
			</button>
			<button class="test-btn" onclick={() => customerStore.setTestOrder(601, runState.turn)}>
				R급
			</button>
		</div>
	</div> -->

	<!-- 게임 화면 -->
	<div class="game-area">
		{#if step === 'ingredient'}
			<!-- 재료 선택 화면 -->
			<IngredientSelectScreen
				bind:selectedIds={selectedIngredients}
				onCook={handleCookRequest}
				capital={runState.capital}
				earnedStars={runState.earnedStars}
				turn={runState.turn}
				{turnsUntilTax}
				totalEarned={runState.totalEarned}
				{taxRate}
			>
				{#snippet customerBadge()}
					<CustomerOrderBadge {turnsUntilTax} {testUrgency} visible={!!showOrderBadge} />
				{/snippet}
			</IngredientSelectScreen>
		{:else if step === 'cooking'}
			<!-- 조리 화면 -->
			<CookingScreen onComplete={handleCookingComplete} {selectedIngredients} />
		{:else if step === 'result' && resultIngredient && currentRecipe && currentCookResult}
			<!-- 결과 화면 -->
			<DishResultScreen
				{resultIngredient}
				recipe={currentRecipe}
				cookResult={currentCookResult}
				ingredientCost={currentIngredientCost}
				onComplete={handleResultComplete}
				onUseNow={resultIngredient.isIngredient ? handleUseNow : undefined}
			/>
		{:else if step === 'explosion'}
			<!-- 폭발 실패 화면 (레시피 없는 조합) -->
			<ExplosionFailScreen
				ingredientCost={currentIngredientCost}
				onComplete={handleExplosionComplete}
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

	/* 테스트 컨트롤 */
	.test-controls {
		@apply fixed z-50;
		left: 12px;
		top: 12px;
		@apply flex flex-col gap-1;
		@apply rounded-xl bg-black/70 p-2;
	}

	.test-label {
		@apply text-xs text-white/70;
		@apply text-center;
	}

	.test-buttons {
		@apply flex gap-1;
	}

	.test-btn {
		@apply rounded px-2 py-1;
		@apply text-xs font-bold text-white;
		@apply bg-white/20;
		@apply transition-colors;
	}

	.test-btn:hover {
		@apply bg-white/30;
	}

	.test-btn:active {
		@apply bg-white/40;
	}
</style>
