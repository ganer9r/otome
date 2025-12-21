<script lang="ts">
	import OrderArrivalModal from '../components/OrderArrivalModal.svelte';
	import OrderCompleteModal from '../components/OrderCompleteModal.svelte';
	import OrderFailModal from '../components/OrderFailModal.svelte';
	import ExplosionFailScreen from '../components/ExplosionFailScreen.svelte';
	import DishResult from '../components/DishResult.svelte';
	import DishResultScreen from '../components/DishResultScreen.svelte';
	import type { CustomerOrder } from '../lib/customer-store';
	import type { CookResult, Ingredient, IngredientGrade, Recipe } from '../lib/types';
	import { GRADE_ORDER } from '../lib/types';
	import { findIngredientById, INGREDIENTS } from '../lib/data/ingredients';
	import { RECIPES } from '../lib/data/recipes';

	// 등급 선택
	let selectedGrade = $state<IngredientGrade>('E');

	// 선택된 등급에 해당하는 요리 (isIngredient: false)
	let selectedDish = $derived(
		INGREDIENTS.find((i) => !i.isIngredient && i.grade === selectedGrade)
	);

	// 선택된 등급에 해당하는 재료 (isIngredient: true)
	let selectedMaterial = $derived(
		INGREDIENTS.find((i) => i.isIngredient && i.grade === selectedGrade)
	);

	// 요리 CookResult 생성
	let dishResultFail = $derived<CookResult | null>(
		selectedDish
			? {
					resultType: 'fail',
					ingredient: selectedDish,
					sellPrice: 0,
					displayName: '검게 탄 덩어리',
					description: '이게 뭐야... 탔잖아!'
				}
			: null
	);

	let dishResultSuccess = $derived<CookResult | null>(
		selectedDish
			? {
					resultType: 'success',
					ingredient: selectedDish,
					sellPrice: selectedDish.sellPrice || 0,
					displayName: selectedDish.name,
					description: '맛있게 잘 됐어!'
				}
			: null
	);

	let dishResultCritical = $derived<CookResult | null>(
		selectedDish
			? {
					resultType: 'critical',
					ingredient: selectedDish,
					sellPrice: (selectedDish.sellPrice || 0) * 2,
					displayName: `완벽한 ${selectedDish.name}`,
					description: '이건 예술이야!'
				}
			: null
	);

	// 재료 CookResult 생성
	let materialResultFail = $derived<CookResult | null>(
		selectedMaterial
			? {
					resultType: 'fail',
					ingredient: selectedMaterial,
					sellPrice: 0,
					displayName: '이상한 덩어리',
					description: '뭔가 잘못됐어...'
				}
			: null
	);

	let materialResultSuccess = $derived<CookResult | null>(
		selectedMaterial
			? {
					resultType: 'success',
					ingredient: selectedMaterial,
					sellPrice: selectedMaterial.sellPrice || 0,
					displayName: selectedMaterial.name,
					description: '좋은 재료가 만들어졌어!'
				}
			: null
	);

	let materialResultCritical = $derived<CookResult | null>(
		selectedMaterial
			? {
					resultType: 'critical',
					ingredient: selectedMaterial,
					sellPrice: (selectedMaterial.sellPrice || 0) * 2,
					displayName: `최상급 ${selectedMaterial.name}`,
					description: '완벽한 품질이야!'
				}
			: null
	);

	// 테스트용 더미 레시피 (요리용)
	let dummyRecipeForDish = $derived<Recipe | null>(
		selectedDish
			? {
					id: 0,
					name: 'test-dish',
					resultIngredientId: selectedDish.id,
					ingredientIds: [1, 2]
				}
			: null
	);

	// 테스트용 더미 레시피 (재료용)
	let dummyRecipeForMaterial = $derived<Recipe | null>(
		selectedMaterial
			? {
					id: 0,
					name: 'test-material',
					resultIngredientId: selectedMaterial.id,
					ingredientIds: [1, 2]
				}
			: null
	);

	// 테스트용 주문 생성
	const testRecipe = RECIPES.find((r) => r.id === 13)!; // 과일청
	const testDishOrder = findIngredientById(testRecipe.resultIngredientId)!;

	const testOrder: CustomerOrder = {
		id: 'test-order-1',
		customerId: 1,
		recipe: testRecipe,
		dish: testDishOrder,
		bonusAmount: 150,
		createdAtTurn: 0,
		completed: false,
		hintRevealed: false,
		arrivalMessage: '배고파요~',
		completeMessage: '맛있어요!'
	};

	const testHints = [
		{ ingredientId: 1, name: '사과', revealed: true, owned: true },
		{ ingredientId: 2, name: '설탕', revealed: true, owned: true }
	];

	// 모달 상태
	let showArrival = $state(false);
	let showComplete = $state(false);
	let showFail = $state(false);

	// 요리 결과 테스트 상태
	let showExplosionFail = $state(false); // 조합 실패 (레시피 없음)
	let showCookingFail = $state(false); // 요리 실패 (확률 실패)
	let showCookingSuccess = $state(false); // 요리 성공
	let showCookingCritical = $state(false); // 대성공

	// 재료 결과 테스트 상태
	let showMaterialFail = $state(false);
	let showMaterialSuccess = $state(false);
	let showMaterialCritical = $state(false);

	// 테스트용 자본금
	let testCapital = $state(1000);
</script>

<div class="test-container">
	<!-- 상단 HUD (코인 타겟용) -->
	<div class="test-hud">
		<div class="capital-badge">
			<img src="/imgs/ui/coin.png" alt="coin" class="capital-icon" />
			<span class="capital-value">{testCapital.toLocaleString()}원</span>
		</div>
	</div>

	<h1>UI 테스트</h1>

	<!-- 요리 결과 테스트 섹션 -->
	<div class="section">
		<h2>요리/재료 결과 테스트</h2>

		<!-- 등급 선택 -->
		<div class="grade-selector">
			<label for="grade-select">등급 선택:</label>
			<select id="grade-select" bind:value={selectedGrade}>
				{#each GRADE_ORDER as grade}
					<option value={grade}>{grade}등급</option>
				{/each}
			</select>
		</div>

		<!-- 선택된 요리/재료 정보 -->
		<div class="selected-info">
			<div class="info-item">
				<span class="info-label">요리:</span>
				{#if selectedDish}
					<img src={selectedDish.imageUrl} alt={selectedDish.name} class="info-img" />
					<span class="info-name">{selectedDish.name}</span>
				{:else}
					<span class="info-none">해당 등급 없음</span>
				{/if}
			</div>
			<div class="info-item">
				<span class="info-label">재료:</span>
				{#if selectedMaterial}
					<img src={selectedMaterial.imageUrl} alt={selectedMaterial.name} class="info-img" />
					<span class="info-name">{selectedMaterial.name}</span>
				{:else}
					<span class="info-none">해당 등급 없음</span>
				{/if}
			</div>
		</div>

		<div class="result-grid">
			<!-- 조합 실패 (공통) -->
			<div class="result-column full-width">
				<button class="test-btn explosion" onclick={() => (showExplosionFail = true)}>
					💥 조합 실패 (레시피 없음)
				</button>
			</div>

			<!-- 요리 (왼쪽) -->
			<div class="result-column">
				<h3>요리</h3>
				<button
					class="test-btn cooking-fail"
					onclick={() => (showCookingFail = true)}
					disabled={!selectedDish}
				>
					💀 실패
				</button>
				<button
					class="test-btn cooking-success"
					onclick={() => (showCookingSuccess = true)}
					disabled={!selectedDish}
				>
					🍳 성공
				</button>
				<button
					class="test-btn cooking-critical"
					onclick={() => (showCookingCritical = true)}
					disabled={!selectedDish}
				>
					⭐ 대성공
				</button>
			</div>

			<!-- 재료 (오른쪽) -->
			<div class="result-column">
				<h3>재료</h3>
				<button
					class="test-btn material-fail"
					onclick={() => (showMaterialFail = true)}
					disabled={!selectedMaterial}
				>
					💀 실패
				</button>
				<button
					class="test-btn material-success"
					onclick={() => (showMaterialSuccess = true)}
					disabled={!selectedMaterial}
				>
					🥬 성공
				</button>
				<button
					class="test-btn material-critical"
					onclick={() => (showMaterialCritical = true)}
					disabled={!selectedMaterial}
				>
					⭐ 대성공
				</button>
			</div>
		</div>
	</div>

	<!-- 주문 모달 테스트 섹션 -->
	<div class="section">
		<h2>주문 모달 테스트</h2>
		<div class="button-group">
			<button class="test-btn arrival" onclick={() => (showArrival = true)}> 새 주문 모달 </button>
			<button class="test-btn complete" onclick={() => (showComplete = true)}>
				주문 완료 모달
			</button>
			<button class="test-btn fail" onclick={() => (showFail = true)}> 손님 떠남 모달 </button>
		</div>
	</div>
</div>

{#if showArrival}
	<OrderArrivalModal order={testOrder} hints={testHints} onConfirm={() => (showArrival = false)} />
{/if}

{#if showComplete}
	<OrderCompleteModal
		order={testOrder}
		onClose={() => {
			showComplete = false;
			testCapital += testOrder.bonusAmount;
		}}
		autoClose={false}
	/>
{/if}

{#if showFail}
	<OrderFailModal order={testOrder} onClose={() => (showFail = false)} />
{/if}

<!-- 조합 실패 (레시피 없음) -->
{#if showExplosionFail}
	<ExplosionFailScreen ingredientCost={350} onComplete={() => (showExplosionFail = false)} />
{/if}

<!-- 요리 실패 (확률 실패) -->
{#if showCookingFail && selectedDish && dishResultFail}
	<DishResult
		resultIngredient={selectedDish}
		cookResult={dishResultFail}
		sellPrice={0}
		profit={-(selectedDish.buyPrice || 100)}
		onComplete={() => (showCookingFail = false)}
	/>
{/if}

<!-- 요리 성공 -->
{#if showCookingSuccess && selectedDish && dishResultSuccess}
	<DishResult
		resultIngredient={selectedDish}
		cookResult={dishResultSuccess}
		sellPrice={selectedDish.sellPrice || 0}
		profit={(selectedDish.sellPrice || 0) - (selectedDish.buyPrice || 100)}
		onComplete={() => (showCookingSuccess = false)}
	/>
{/if}

<!-- 요리 대성공 -->
{#if showCookingCritical && selectedDish && dishResultCritical}
	<DishResult
		resultIngredient={selectedDish}
		cookResult={dishResultCritical}
		sellPrice={(selectedDish.sellPrice || 0) * 2}
		profit={(selectedDish.sellPrice || 0) * 2 - (selectedDish.buyPrice || 100)}
		onComplete={() => (showCookingCritical = false)}
	/>
{/if}

<!-- 재료 실패 -->
{#if showMaterialFail && selectedMaterial && materialResultFail}
	<DishResult
		resultIngredient={selectedMaterial}
		cookResult={materialResultFail}
		sellPrice={0}
		profit={-(selectedMaterial.buyPrice || 50)}
		onComplete={() => (showMaterialFail = false)}
	/>
{/if}

<!-- 재료 성공 -->
{#if showMaterialSuccess && selectedMaterial && materialResultSuccess}
	<DishResult
		resultIngredient={selectedMaterial}
		cookResult={materialResultSuccess}
		sellPrice={selectedMaterial.sellPrice || 0}
		profit={(selectedMaterial.sellPrice || 0) - (selectedMaterial.buyPrice || 50)}
		onComplete={() => (showMaterialSuccess = false)}
	/>
{/if}

<!-- 재료 대성공 -->
{#if showMaterialCritical && selectedMaterial && materialResultCritical}
	<DishResult
		resultIngredient={selectedMaterial}
		cookResult={materialResultCritical}
		sellPrice={(selectedMaterial.sellPrice || 0) * 2}
		profit={(selectedMaterial.sellPrice || 0) * 2 - (selectedMaterial.buyPrice || 50)}
		onComplete={() => (showMaterialCritical = false)}
	/>
{/if}

<style lang="postcss">
	@reference '$styles/app.css';

	.test-container {
		@apply flex flex-col items-center gap-6;
		@apply min-h-screen;
		@apply p-4 pt-16;
		background: linear-gradient(to bottom, #fff8e1, #ffecb3);
	}

	.section {
		@apply flex flex-col items-center gap-3;
		@apply w-full;
	}

	h2 {
		@apply text-lg font-bold;
		color: #78350f;
	}

	/* 등급 선택 */
	.grade-selector {
		@apply flex items-center gap-2;
	}

	.grade-selector label {
		@apply text-sm font-bold;
		color: #78350f;
	}

	.grade-selector select {
		@apply rounded-lg px-3 py-2 font-bold;
		background: white;
		border: 2px solid #d97706;
		color: #78350f;
		font-size: 14px;
	}

	/* 선택된 요리/재료 정보 */
	.selected-info {
		@apply flex w-full gap-4;
		@apply rounded-lg p-3;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid #fcd34d;
	}

	.info-item {
		@apply flex flex-1 items-center gap-2;
	}

	.info-label {
		@apply text-xs font-bold;
		color: #92400e;
	}

	.info-img {
		width: 32px;
		height: 32px;
		object-fit: contain;
	}

	.info-name {
		@apply text-sm font-bold;
		color: #78350f;
	}

	.info-none {
		@apply text-xs text-gray-400;
	}

	/* 테스트용 HUD */
	.test-hud {
		@apply fixed top-4 left-4 z-50;
	}

	.capital-badge {
		@apply flex items-center gap-1;
		@apply px-3 py-1.5;
		@apply rounded-full;
		background: linear-gradient(180deg, #3d3d3d 0%, #1a1a1a 100%);
		border: 2px solid #5a5a5a;
		box-shadow: 0 2px 0 #0d0d0d;
	}

	.capital-icon {
		width: 16px;
		height: 16px;
	}

	.capital-value {
		@apply font-bold text-white;
		font-size: 14px;
	}

	h1 {
		@apply text-2xl font-bold;
		color: #78350f;
	}

	.button-group {
		@apply flex flex-col gap-2;
		@apply w-full;
	}

	/* 결과 그리드 (2단) */
	.result-grid {
		@apply grid gap-3;
		grid-template-columns: 1fr 1fr;
		width: 100%;
	}

	.result-column {
		@apply flex flex-col gap-2;
	}

	.result-column.full-width {
		grid-column: 1 / -1;
	}

	.result-column h3 {
		@apply text-center text-sm font-bold;
		color: #92400e;
	}

	.test-btn {
		@apply rounded-xl px-3 py-3 font-bold text-white;
		font-size: 14px;
		border: none;
		cursor: pointer;
		transition: transform 0.2s;
		width: 100%;
	}

	.test-btn:hover {
		transform: scale(1.05);
	}

	.test-btn:active {
		transform: scale(0.98);
	}

	.test-btn.arrival {
		background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
	}

	.test-btn.complete {
		background: linear-gradient(180deg, #10b981 0%, #059669 100%);
	}

	.test-btn.fail {
		background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
	}

	/* 요리 결과 버튼 스타일 */
	.test-btn.explosion {
		background: linear-gradient(180deg, #6b7280 0%, #4b5563 100%);
	}

	.test-btn.cooking-fail {
		background: linear-gradient(180deg, #78716c 0%, #57534e 100%);
	}

	.test-btn.cooking-success {
		background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
	}

	.test-btn.cooking-critical {
		background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
	}

	/* 재료 버튼 스타일 */
	.test-btn.material-fail {
		background: linear-gradient(180deg, #a1a1aa 0%, #71717a 100%);
	}

	.test-btn.material-success {
		background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
	}

	.test-btn.material-critical {
		background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
	}

	.test-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		transform: none;
	}

	.test-btn:disabled:hover {
		transform: none;
	}
</style>
