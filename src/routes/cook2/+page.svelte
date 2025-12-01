<script lang="ts">
	import IngredientSelectScreen from './components/IngredientSelectScreen.svelte';
	import CookingScreen from './components/CookingScreen.svelte';
	import DishResultScreen from './components/DishResultScreen.svelte';
	import RestartModal from './components/RestartModal.svelte';
	import { findRecipe } from './lib/usecase/findRecipe';
	import { unlockedIngredientsStore } from './lib/store';
	import { findIngredientById } from './lib/data/ingredients';
	import { modalStore } from '$lib/stores/modal';
	import type { Recipe, Ingredient } from './lib/types';

	// 선택 상태
	let selectedIngredients = $state<number[]>([]);

	// 단계별 상태 관리
	let step = $state<'ingredient' | 'cooking' | 'result'>('ingredient');
	let currentRecipe = $state<Recipe | null>(null);
	let resultIngredient = $state<Ingredient | null>(null);

	// 조리 시작 (조리기구 선택 없이 바로)
	function handleCookRequest() {
		// 1. 레시피 찾기
		const recipe = findRecipe(selectedIngredients);

		if (!recipe) {
			alert('해당 조합으로 만들 수 있는 요리가 없습니다!');
			return;
		}

		// 2. 조리 시작 (cooking 화면 전환)
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
		}

		// 3. 결과 화면 표시
		step = 'result';
	}

	// 결과 확인 완료
	async function handleResultComplete() {
		// 다시하기 모달 표시
		await modalStore.open({
			component: RestartModal,
			props: {},
			hideClose: true
		});

		// 초기화
		step = 'ingredient';
		selectedIngredients = [];
		currentRecipe = null;
		resultIngredient = null;
	}
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
	/>
</svelte:head>

{#if step === 'ingredient'}
	<!-- 재료 선택 화면 -->
	<IngredientSelectScreen bind:selectedIds={selectedIngredients} onCook={handleCookRequest} />
{:else if step === 'cooking'}
	<!-- 조리 화면 -->
	<CookingScreen onComplete={handleCookingComplete} {selectedIngredients} />
{:else if step === 'result' && resultIngredient && currentRecipe}
	<!-- 결과 화면 -->
	<DishResultScreen {resultIngredient} recipe={currentRecipe} onComplete={handleResultComplete} />
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
</style>
