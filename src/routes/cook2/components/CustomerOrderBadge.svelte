<script lang="ts">
	import { customerStore, getOrderHints } from '../lib/customer-store';
	import { findRecipeByResult } from '../lib/data/recipes';
	import { findIngredientById } from '../lib/data/ingredients';
	import { getUnlockedIngredients } from '../lib/usecase/unlockIngredient';
	import { GRADE_COLORS } from '../lib/types';

	// Props
	interface Props {
		turnsUntilTax: number;
		/** 테스트용: 긴급도 오버라이드 (1~10) */
		testUrgency?: number;
	}

	let { turnsUntilTax, testUrgency }: Props = $props();

	// 실제 남은 턴 (테스트 오버라이드 가능)
	let effectiveTurns = $derived(testUrgency ?? turnsUntilTax);

	// 손님 상태
	let customerState = $derived($customerStore);
	let order = $derived(customerState.currentOrder);

	// 힌트 정보 (가진 재료만 보임)
	let hints = $derived(getOrderHints(order));

	// 펼침 상태
	let expanded = $state(false);

	// 조합 트리 노드 타입
	interface RecipeNode {
		id: number;
		name: string;
		owned: boolean; // 내가 가진 재료인지
		children: RecipeNode[]; // 하위 재료들 (재귀)
	}

	// 조합법 팝업 상태 (트리 구조)
	let recipePopup = $state<{
		targetName: string;
		tree: RecipeNode[];
	} | null>(null);

	// 긴급도 레벨 (1: 여유, 2: 보통, 3: 긴급)
	let urgencyLevel = $derived((): 1 | 2 | 3 => {
		if (effectiveTurns <= 2) return 3; // 긴급
		if (effectiveTurns <= 5) return 2; // 보통
		return 1; // 여유
	});

	// 손님 표정
	let customerEmoji = $derived(() => {
		if (order?.completed) return '😄';
		switch (urgencyLevel()) {
			case 3:
				return '😰';
			case 2:
				return '😐';
			default:
				return '😊';
		}
	});

	// 테두리 색상 (여유=초록, 보통=노랑, 긴급=빨강)
	let borderColor = $derived(() => {
		if (order?.completed) return '#22c55e';
		switch (urgencyLevel()) {
			case 3:
				return '#ef4444'; // 빨강
			case 2:
				return '#f59e0b'; // 노랑
			default:
				return '#22c55e'; // 초록
		}
	});

	// 힌트 텍스트 생성
	let hintText = $derived(() => {
		if (hints.length === 0) return '';
		return hints.map((h) => (h.revealed ? h.name : '???')).join(' + ');
	});

	// 모든 힌트가 공개되었는지
	let allHintsRevealed = $derived(hints.every((h) => h.revealed));

	function toggleExpand() {
		expanded = !expanded;
	}

	function handleOutsideClick() {
		if (expanded) {
			expanded = false;
		}
	}

	// RV 보기 (힌트 공개)
	function handleWatchAd() {
		// TODO: 실제 RV 연동
		customerStore.revealHint();
	}

	/**
	 * 재료의 조합 트리를 재귀적으로 생성
	 * - 내가 가진 재료면 멈춤
	 * - 없으면 그 재료를 만드는 레시피 탐색
	 */
	function buildRecipeTree(ingredientId: number, visited: Set<number> = new Set()): RecipeNode {
		// 순환 참조 방지
		if (visited.has(ingredientId)) {
			const ing = findIngredientById(ingredientId);
			return { id: ingredientId, name: ing?.name ?? '???', owned: false, children: [] };
		}
		visited.add(ingredientId);

		const ingredient = findIngredientById(ingredientId);
		const unlockedIds = getUnlockedIngredients();
		const owned = unlockedIds.includes(ingredientId);

		const node: RecipeNode = {
			id: ingredientId,
			name: ingredient?.name ?? '???',
			owned,
			children: []
		};

		// 내가 가진 재료면 더 이상 탐색 안 함
		if (owned) {
			return node;
		}

		// 이 재료를 만드는 레시피 찾기
		const recipe = findRecipeByResult(ingredientId);
		if (recipe && recipe.ingredientIds.length >= 1) {
			// 하위 재료들 재귀 탐색
			node.children = recipe.ingredientIds.map((id) => buildRecipeTree(id, new Set(visited)));
		}

		return node;
	}

	// 재료 클릭 → 조합 트리 팝업
	function handleIngredientClick(ingredientId: number, ingredientName: string) {
		const tree = [buildRecipeTree(ingredientId)];
		recipePopup = {
			targetName: ingredientName,
			tree
		};
	}

	function closeRecipePopup() {
		recipePopup = null;
	}
</script>

<!-- 바깥 클릭 감지용 오버레이 -->
{#if expanded}
	<button class="overlay" onclick={handleOutsideClick} aria-label="닫기"></button>
{/if}

<div class="badge-container">
	{#if order}
		<!-- 접힌 상태: 뱃지 -->
		<button
			class="order-badge"
			class:completed={order.completed}
			class:urgent={urgencyLevel() === 3 && !order.completed}
			class:warning={urgencyLevel() === 2 && !order.completed}
			style="--border-color: {borderColor()}"
			onclick={toggleExpand}
		>
			<!-- 손님 얼굴 (박스 위로 튀어나옴) -->
			<div class="customer-face">
				<span class="face-emoji">{customerEmoji()}</span>
			</div>

			<!-- 요리 이름 박스 -->
			<div class="dish-box">
				<div class="dish-name">{order.dish.name}</div>
				{#if order.completed}
					<div class="completed-text">완료!</div>
				{/if}
			</div>
		</button>

		<!-- 펼친 상태: 상세 정보 -->
		{#if expanded}
			<div class="expanded-panel" style="--border-color: {borderColor()}">
				<div class="panel-header">
					<span class="panel-emoji">{customerEmoji()}</span>
					<span class="panel-title">손님 주문</span>
				</div>

				<div class="panel-content">
					<div class="dish-row">
						<span class="dish-grade" style="background-color: {GRADE_COLORS[order.dish.grade]}">
							{order.dish.grade}
						</span>
						<span class="dish-name-large">{order.dish.name}</span>
					</div>

					{#if !order.completed}
						<!-- 힌트 표시: 재료 + ??? = 요리 형태 -->
						<div class="hint-section">
							<span class="hint-label">조합 힌트</span>
							<div class="hint-formula">
								{#each hints as hint, i}
									{#if hint.revealed}
										<!-- 공개된 재료: 클릭 가능 -->
										<button
											class="hint-item clickable"
											class:owned={hint.owned}
											class:missing={!hint.owned}
											onclick={() => handleIngredientClick(hint.ingredientId, hint.name)}
										>
											{hint.name}
										</button>
									{:else}
										<!-- 미공개 재료: ??? 빨간색 -->
										<span class="hint-item unknown">???</span>
									{/if}
									{#if i < hints.length - 1}
										<span class="hint-plus">+</span>
									{/if}
								{/each}
								<span class="hint-equals">=</span>
								<span class="hint-result">{order.dish.name}</span>
							</div>
						</div>

						<!-- RV 버튼 (힌트 미공개 시) -->
						{#if !allHintsRevealed}
							<button class="rv-button" onclick={handleWatchAd}>
								<span class="rv-icon">📺</span>
								<span class="rv-text">광고 보고 힌트 보기</span>
							</button>
						{/if}

						<div class="info-row">
							<span class="info-label">보너스</span>
							<span class="info-value bonus">+{order.bonusAmount}원</span>
						</div>
						<div class="info-row">
							<span class="info-label">남은 턴</span>
							<span class="info-value turns" class:urgent={urgencyLevel() === 3}>
								{effectiveTurns}턴
							</span>
						</div>
					{:else}
						<div class="completed-message">주문 완료!</div>
					{/if}
				</div>
			</div>
		{/if}
	{:else}
		<!-- 주문 없음 -->
		<div class="no-order-badge">
			<span class="no-order-emoji">💤</span>
			<span class="no-order-text">대기중</span>
		</div>
	{/if}
</div>

<!-- 조합법 팝업 (트리 구조) -->
{#if recipePopup}
	<div class="recipe-popup-overlay" onclick={closeRecipePopup}>
		<div class="recipe-popup" onclick={(e) => e.stopPropagation()}>
			<button class="popup-close" onclick={closeRecipePopup}>✕</button>
			<div class="popup-title">🔍 {recipePopup.targetName} 만드는 법</div>
			<div class="recipe-tree">
				{#each recipePopup.tree as node}
					{@render recipeNode(node, 0)}
				{/each}
			</div>
		</div>
	</div>
{/if}

{#snippet recipeNode(node: RecipeNode, depth: number)}
	<div class="tree-node" style="--depth: {depth}">
		{#if node.children.length > 0}
			<!-- 조합이 필요한 재료 -->
			<div class="node-formula">
				{#each node.children as child, i}
					<span class="node-item" class:owned={child.owned} class:missing={!child.owned}>
						{child.name}
					</span>
					{#if i < node.children.length - 1}
						<span class="node-plus">+</span>
					{/if}
				{/each}
				<span class="node-equals">=</span>
				<span class="node-result">{node.name}</span>
			</div>
			<!-- 하위 재료들 (없는 것만) -->
			{#each node.children.filter((c) => !c.owned && c.children.length > 0) as child}
				{@render recipeNode(child, depth + 1)}
			{/each}
		{:else if node.owned}
			<!-- 내가 가진 재료 -->
			<div class="node-owned">✓ {node.name} (보유중)</div>
		{:else}
			<!-- 기본 재료 (G등급) -->
			<div class="node-base">🛒 {node.name} (구매 필요)</div>
		{/if}
	</div>
{/snippet}

<style lang="postcss">
	@reference '$styles/app.css';

	.overlay {
		@apply fixed inset-0 z-40;
		background: transparent;
		border: none;
		cursor: default;
	}

	.badge-container {
		@apply absolute z-50;
		right: 12px;
		top: 48px;
	}

	/* 뱃지 (접힌 상태) */
	.order-badge {
		@apply relative flex flex-col items-center;
		@apply cursor-pointer;
		@apply transition-all duration-200;
		padding-top: 24px; /* 얼굴 공간 확보 */
		background: transparent;
		border: none;
	}

	.order-badge:hover {
		transform: scale(1.05);
	}

	.order-badge:active {
		transform: scale(0.98);
	}

	.order-badge.warning {
		animation: wobble 0.5s ease-in-out infinite;
	}

	.order-badge.urgent {
		animation: shake 0.3s ease-in-out infinite;
	}

	@keyframes wobble {
		0%,
		100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(-2deg);
		}
		75% {
			transform: rotate(2deg);
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0) rotate(0deg);
		}
		25% {
			transform: translateX(-2px) rotate(-1deg);
		}
		75% {
			transform: translateX(2px) rotate(1deg);
		}
	}

	/* 얼굴 (박스 위로 튀어나옴) */
	.customer-face {
		@apply absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
	}

	.face-emoji {
		font-size: 32px;
		line-height: 1;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	/* 요리 이름 박스 */
	.dish-box {
		@apply flex flex-col items-center;
		@apply rounded-xl;
		@apply px-3 py-2;
		margin-top: 4px;
		min-width: 70px;
		background: linear-gradient(to bottom, #fffbeb, #fef3c7);
		border: 3px solid var(--border-color);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.order-badge.completed .dish-box {
		background: linear-gradient(to bottom, #ecfdf5, #d1fae5);
	}

	.order-badge.urgent .dish-box {
		animation: urgentGlow 1s ease-in-out infinite;
	}

	@keyframes urgentGlow {
		0%,
		100% {
			box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
		}
		50% {
			box-shadow: 0 4px 20px rgba(239, 68, 68, 0.6);
		}
	}

	.dish-name {
		@apply text-xs font-bold;
		@apply text-center;
		@apply leading-tight;
		color: #78350f;
		max-width: 64px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.completed-text {
		@apply mt-0.5 text-xs font-bold;
		color: #16a34a;
	}

	/* 펼친 패널 */
	.expanded-panel {
		@apply absolute top-full right-0 mt-2;
		@apply rounded-2xl;
		@apply overflow-hidden;
		width: 180px;
		background: white;
		border: 3px solid var(--border-color);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.2),
			0 4px 8px rgba(0, 0, 0, 0.1);
		animation: expandIn 0.2s ease-out;
	}

	@keyframes expandIn {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.panel-header {
		@apply flex items-center gap-2;
		@apply px-3 py-2;
		background: linear-gradient(to bottom, #fef3c7, #fde68a);
		border-bottom: 2px solid var(--border-color);
	}

	.panel-emoji {
		font-size: 20px;
	}

	.panel-title {
		@apply text-sm font-bold;
		color: #78350f;
	}

	.panel-content {
		@apply flex flex-col gap-2;
		@apply p-3;
	}

	.dish-row {
		@apply flex items-center gap-2;
	}

	.dish-grade {
		@apply rounded px-1.5 py-0.5;
		@apply text-xs font-bold text-white;
	}

	.dish-name-large {
		@apply text-sm font-bold;
		color: #1f2937;
	}

	.info-row {
		@apply flex items-center justify-between;
	}

	.info-label {
		@apply text-xs;
		color: #6b7280;
	}

	.info-value {
		@apply text-sm font-bold;
		color: #1f2937;
	}

	.info-value.bonus {
		color: #d97706;
	}

	.info-value.turns.urgent {
		color: #ef4444;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.completed-message {
		@apply py-2 text-center text-sm font-bold;
		color: #16a34a;
	}

	/* 힌트 섹션 */
	.hint-section {
		@apply flex flex-col gap-1;
		@apply rounded-lg bg-amber-50 p-2;
		border: 1px solid #fcd34d;
	}

	.hint-label {
		@apply text-xs font-medium;
		color: #92400e;
	}

	.hint-formula {
		@apply flex items-center justify-center gap-1;
		@apply flex-wrap;
	}

	.hint-item {
		@apply rounded px-2 py-0.5;
		@apply text-sm font-bold;
		background: #fef3c7;
		color: #78350f;
	}

	.hint-item.clickable {
		cursor: pointer;
		transition: all 0.15s;
	}

	.hint-item.clickable:hover {
		transform: scale(1.05);
	}

	/* 내가 가진 재료: 초록 */
	.hint-item.owned {
		background: #d1fae5;
		color: #065f46;
		border: 1px solid #10b981;
	}

	.hint-item.owned:hover {
		background: #a7f3d0;
	}

	/* 내가 없는 재료: 빨강 */
	.hint-item.missing {
		background: #fecaca;
		color: #dc2626;
		border: 1px solid #f87171;
	}

	.hint-item.missing:hover {
		background: #fca5a5;
	}

	/* 미공개 (???) */
	.hint-item.unknown {
		background: #e5e7eb;
		color: #6b7280;
		font-weight: bold;
	}

	.hint-plus {
		@apply text-sm font-bold;
		color: #9ca3af;
	}

	.hint-equals {
		@apply text-sm font-bold;
		color: #78350f;
		margin: 0 2px;
	}

	.hint-result {
		@apply rounded px-2 py-0.5;
		@apply text-sm font-bold;
		background: linear-gradient(to bottom, #fbbf24, #f59e0b);
		color: #78350f;
		border: 1px solid #d97706;
	}

	/* RV 버튼 */
	.rv-button {
		@apply flex items-center justify-center gap-1;
		@apply w-full rounded-lg py-2;
		@apply text-xs font-bold;
		background: linear-gradient(to bottom, #fbbf24, #f59e0b);
		color: #78350f;
		border: 2px solid #d97706;
		box-shadow: 0 2px 0 #b45309;
		transition: all 0.2s;
	}

	.rv-button:hover {
		filter: brightness(1.05);
	}

	.rv-button:active {
		box-shadow: 0 0 0 #b45309;
		transform: translateY(2px);
	}

	.rv-icon {
		font-size: 14px;
	}

	.rv-text {
		font-size: 11px;
	}

	/* 주문 없음 */
	.no-order-badge {
		@apply flex flex-col items-center;
		@apply rounded-2xl;
		@apply p-2;
		width: 72px;
		background: #f3f4f6;
		border: 2px dashed #d1d5db;
	}

	.no-order-emoji {
		font-size: 24px;
		opacity: 0.5;
	}

	.no-order-text {
		@apply text-xs;
		color: #9ca3af;
	}

	/* 조합법 팝업 */
	.recipe-popup-overlay {
		@apply fixed inset-0 z-[100];
		@apply flex items-center justify-center;
		background: rgba(0, 0, 0, 0.6);
		animation: fadeIn 0.15s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.recipe-popup {
		@apply relative;
		@apply rounded-2xl p-4;
		@apply flex flex-col items-center gap-3;
		background: linear-gradient(to bottom, #fffbeb, #fef3c7);
		border: 3px solid #f59e0b;
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.3),
			0 0 0 4px rgba(245, 158, 11, 0.3);
		min-width: 200px;
		animation: popIn 0.2s ease-out;
	}

	@keyframes popIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.popup-close {
		@apply absolute top-2 right-2;
		@apply h-6 w-6 rounded-full;
		@apply flex items-center justify-center;
		@apply text-sm font-bold;
		background: #fecaca;
		color: #dc2626;
		border: none;
		cursor: pointer;
		transition: all 0.15s;
	}

	.popup-close:hover {
		background: #fca5a5;
		transform: scale(1.1);
	}

	.popup-title {
		@apply text-sm font-bold;
		color: #78350f;
		margin-bottom: 8px;
	}

	/* 조합 트리 */
	.recipe-tree {
		@apply flex flex-col gap-2;
		@apply w-full;
		max-height: 60vh;
		overflow-y: auto;
	}

	.tree-node {
		@apply flex flex-col gap-1;
		padding-left: calc(var(--depth) * 12px);
	}

	.node-formula {
		@apply flex items-center gap-1;
		@apply flex-wrap;
		@apply rounded-lg p-2;
		background: white;
		border: 1px solid #e5e7eb;
	}

	.node-item {
		@apply rounded px-2 py-0.5;
		@apply text-xs font-bold;
	}

	.node-item.owned {
		background: #d1fae5;
		color: #065f46;
		border: 1px solid #10b981;
	}

	.node-item.missing {
		background: #fecaca;
		color: #dc2626;
		border: 1px solid #f87171;
	}

	.node-plus,
	.node-equals {
		@apply text-sm font-bold;
		color: #9ca3af;
	}

	.node-result {
		@apply rounded px-2 py-0.5;
		@apply text-xs font-bold;
		background: linear-gradient(to bottom, #fbbf24, #f59e0b);
		color: #78350f;
		border: 1px solid #d97706;
	}

	.node-owned {
		@apply text-xs;
		@apply rounded-lg px-3 py-1;
		background: #d1fae5;
		color: #065f46;
	}

	.node-base {
		@apply text-xs;
		@apply rounded-lg px-3 py-1;
		background: #fef3c7;
		color: #92400e;
	}
</style>
