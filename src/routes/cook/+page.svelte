<script lang="ts">
	import CookingContainer from './components/CookingContainer.svelte';
	import IngredientGrid from './components/IngredientGrid.svelte';
	import CookingScreen from './components/CookingScreen.svelte';
	import DishResultScreen from './components/DishResultScreen.svelte';
	import RestartModal from './components/RestartModal.svelte';
	import { findRecipe } from './lib/usecase/findRecipe';
	import { cookDish } from './lib/usecase/cookDish';
	import { unlockedIngredientsStore } from './lib/store';
	import { modalStore } from '$lib/stores/modal';
	import type { Recipe, Dish } from './lib/types';

	// 선택 상태
	let selectedIngredients = $state<string[]>([]);
	let selectedTool = $state<string | null>(null);

	// 조리 상태
	let isCooking = $state(false);
	let showResult = $state(false);
	let currentRecipe = $state<Recipe | null>(null);
	let currentDish = $state<Dish | null>(null);

	// 조리 시작
	function handleCook() {
		// 1. 레시피 찾기
		const recipe = findRecipe(selectedIngredients, selectedTool || undefined);

		if (!recipe) {
			alert('해당 조합으로 만들 수 있는 요리가 없습니다!');
			return;
		}

		// 2. 조리 시작 (full 화면 전환)
		currentRecipe = recipe;
		isCooking = true;
	}

	// 조리 완료
	async function handleCookingComplete() {
		if (!currentRecipe) return;

		// 1. 조리 화면 종료
		isCooking = false;

		// 2. 요리 만들기
		const dish = cookDish(currentRecipe);
		currentDish = dish;

		// 3. 성공 시 재료 오픈
		if (dish.grade === 'success') {
			unlockedIngredientsStore.unlock(currentRecipe.resultIngredientId);
		}

		// 4. 풀스크린 결과 화면 표시
		showResult = true;
	}

	// 결과 확인 완료
	async function handleResultComplete() {
		// 결과 화면 닫기
		showResult = false;

		// 다시하기 모달 표시
		await modalStore.open({
			component: RestartModal,
			props: {},
			hideClose: true
		});

		// 초기화
		selectedIngredients = [];
		selectedTool = null;
		currentRecipe = null;
		currentDish = null;
	}
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
</svelte:head>

{#if isCooking}
	<!-- 조리 화면 (full 화면) -->
	<CookingScreen onComplete={handleCookingComplete} />
{:else if showResult && currentDish && currentRecipe}
	<!-- 결과 화면 (full 화면) -->
	<DishResultScreen
		dish={currentDish}
		resultIngredientId={currentRecipe.resultIngredientId}
		onComplete={handleResultComplete}
	/>
{:else}
	<!-- 선택 화면 -->
	<div class="cook-page">
		<!-- 상단: 조리 용기 + 도구 선택 + 요리하기 버튼 -->
		<div class="container-section">
			<CookingContainer
				selectedIngredientIds={selectedIngredients}
				bind:selectedTool
				onCook={handleCook}
			/>
		</div>

		<!-- 하단: 재료 그리드 -->
		<div class="grid-section">
			<IngredientGrid bind:selectedIds={selectedIngredients} />
		</div>
	</div>
{/if}

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

	.cook-page {
		@apply bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50;
		@apply flex flex-col;
		height: 100vh;
		overflow: hidden;
		padding: var(--spacing-sm);
		gap: var(--spacing-sm);
	}

	.container-section {
		@apply bg-white/80;
		@apply rounded-2xl;
		@apply shadow-xl;
		@apply border-2 border-orange-300;
		flex-shrink: 0;
	}

	.grid-section {
		@apply flex-1;
		overflow: hidden;
	}
</style>
