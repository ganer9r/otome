<script lang="ts">
	import OrderArrivalModal from '../components/OrderArrivalModal.svelte';
	import OrderCompleteModal from '../components/OrderCompleteModal.svelte';
	import OrderFailModal from '../components/OrderFailModal.svelte';
	import type { CustomerOrder } from '../lib/customer-store';
	import { findIngredientById } from '../lib/data/ingredients';
	import { RECIPES } from '../lib/data/recipes';

	// 테스트용 주문 생성
	const testRecipe = RECIPES.find((r) => r.id === 13)!; // 과일청
	const testDish = findIngredientById(testRecipe.resultIngredientId)!;

	const testOrder: CustomerOrder = {
		id: 'test-order-1',
		customerId: 1,
		recipe: testRecipe,
		dish: testDish,
		bonusAmount: 50,
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
</script>

<div class="test-container">
	<h1>모달 테스트</h1>

	<div class="button-group">
		<button class="test-btn arrival" onclick={() => (showArrival = true)}> 새 주문 모달 </button>
		<button class="test-btn complete" onclick={() => (showComplete = true)}>
			주문 완료 모달
		</button>
		<button class="test-btn fail" onclick={() => (showFail = true)}> 손님 떠남 모달 </button>
	</div>
</div>

{#if showArrival}
	<OrderArrivalModal order={testOrder} hints={testHints} onConfirm={() => (showArrival = false)} />
{/if}

{#if showComplete}
	<OrderCompleteModal order={testOrder} onClose={() => (showComplete = false)} autoClose={false} />
{/if}

{#if showFail}
	<OrderFailModal order={testOrder} onClose={() => (showFail = false)} />
{/if}

<style lang="postcss">
	@reference '$styles/app.css';

	.test-container {
		@apply flex flex-col items-center justify-center gap-8;
		@apply min-h-screen;
		@apply p-8;
		background: linear-gradient(to bottom, #fff8e1, #ffecb3);
	}

	h1 {
		@apply text-2xl font-bold;
		color: #78350f;
	}

	.button-group {
		@apply flex flex-col gap-4;
	}

	.test-btn {
		@apply rounded-xl px-8 py-4 font-bold text-white;
		font-size: 18px;
		min-width: 200px;
		border: none;
		cursor: pointer;
		transition: transform 0.2s;
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
</style>
