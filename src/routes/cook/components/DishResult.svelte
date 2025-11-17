<script lang="ts">
	import { CheckCircle, XCircle, AlertTriangle, RotateCcw } from 'lucide-svelte';
	import type { Dish } from '../lib/types';
	import { findIngredientById } from '../lib/data/ingredients';

	interface Props {
		/** 요리 결과 */
		dish: Dish | null;
		/** 만들어진 재료 ID (success인 경우) */
		resultIngredientId?: string;
		/** 다시하기 버튼 클릭 시 콜백 */
		onReset?: () => void;
	}

	let { dish, resultIngredientId, onReset }: Props = $props();

	// 등급별 아이콘 및 색상
	function getGradeInfo(grade: string) {
		switch (grade) {
			case 'success':
				return {
					icon: CheckCircle,
					color: 'text-success',
					bgColor: 'bg-success/10',
					borderColor: 'border-success',
					label: '성공!'
				};
			case 'fail':
				return {
					icon: AlertTriangle,
					color: 'text-warning',
					bgColor: 'bg-warning/10',
					borderColor: 'border-warning',
					label: '실패'
				};
			case 'disaster':
				return {
					icon: XCircle,
					color: 'text-error',
					bgColor: 'bg-error/10',
					borderColor: 'border-error',
					label: '대실패'
				};
			default:
				return {
					icon: AlertTriangle,
					color: 'text-gray-500',
					bgColor: 'bg-gray-100',
					borderColor: 'border-gray-300',
					label: '알 수 없음'
				};
		}
	}

	let gradeInfo = $derived(dish ? getGradeInfo(dish.grade) : null);
	let resultIngredient = $derived(
		resultIngredientId ? findIngredientById(resultIngredientId) : null
	);
</script>

{#if dish}
	<div class="dish-result-container">
		<div class="result-card {gradeInfo?.bgColor} {gradeInfo?.borderColor}">
			<!-- 등급 아이콘 -->
			<div class="grade-icon {gradeInfo?.color}">
				{#if gradeInfo}
					<svelte:component this={gradeInfo.icon} size={64} />
				{/if}
			</div>

			<!-- 등급 라벨 -->
			<div class="grade-label {gradeInfo?.color}">
				{gradeInfo?.label}
			</div>

			<!-- 요리 이름 -->
			<h2 class="dish-name">{dish.name}</h2>

			<!-- 결과 재료 (success인 경우) -->
			{#if dish.grade === 'success' && resultIngredient}
				<div class="result-ingredient">
					<p class="text-sm text-gray-600">새로운 재료를 얻었습니다!</p>
					<div class="ingredient-badge">
						<span class="ingredient-name">{resultIngredient.name}</span>
						<span class="ingredient-grade">({resultIngredient.grade})</span>
					</div>
				</div>
			{/if}

			<!-- 확률 표시 (참고용) -->
			{#if dish.probability !== undefined}
				<div class="probability-text">확률: {dish.probability}%</div>
			{/if}
		</div>

		<!-- 다시하기 버튼 -->
		<button type="button" class="btn btn-secondary btn-lg reset-button" onclick={onReset}>
			<RotateCcw size={20} />
			<span>다시 하기</span>
		</button>
	</div>
{/if}

<style lang="postcss">
	@reference '$styles/app.css';

	.dish-result-container {
		@apply flex flex-col items-center gap-6 w-full;
		animation: fadeInUp 0.5s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.result-card {
		@apply flex flex-col items-center gap-4;
		@apply w-full max-w-md p-8 rounded-2xl;
		@apply border-4 shadow-2xl;
		@apply transition-all duration-300;
	}

	.grade-icon {
		animation: bounceIn 0.6s ease-out;
	}

	@keyframes bounceIn {
		0% {
			transform: scale(0);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}

	.grade-label {
		@apply text-2xl font-bold;
		animation: fadeIn 0.8s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.dish-name {
		@apply text-3xl font-bold text-gray-800;
		animation: fadeIn 1s ease-out;
	}

	.result-ingredient {
		@apply flex flex-col items-center gap-2 mt-2;
		animation: slideInFromRight 0.7s ease-out;
	}

	@keyframes slideInFromRight {
		from {
			opacity: 0;
			transform: translateX(20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.ingredient-badge {
		@apply px-5 py-3 bg-primary/20 rounded-xl;
		@apply border-2 border-primary;
		@apply shadow-md hover:shadow-lg;
		@apply transition-all duration-200;
	}

	.ingredient-name {
		@apply text-lg font-bold text-primary;
	}

	.ingredient-grade {
		@apply text-sm text-gray-600 ml-2;
	}

	.probability-text {
		@apply text-xs text-gray-500 mt-2;
	}

	.reset-button {
		@apply flex items-center gap-2;
		@apply shadow-lg hover:shadow-xl;
		@apply transition-all duration-200;
		@apply hover:scale-105 active:scale-95;
	}
</style>
