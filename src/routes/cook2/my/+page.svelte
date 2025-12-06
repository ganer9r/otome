<script lang="ts">
	import { dev } from '$app/environment';
	import { Settings, RotateCcw, Info, Play, Film } from 'lucide-svelte';
	import {
		unlockedIngredientsStore,
		unlockedDishesStore,
		triedCombinationsStore,
		successCombinationsStore
	} from '../lib/store';

	// 통계
	let unlockedIngredients = $derived($unlockedIngredientsStore.length);
	let unlockedDishes = $derived($unlockedDishesStore.size);
	let triedCombinations = $derived($triedCombinationsStore.size);
	let successCombinations = $derived(Object.keys($successCombinationsStore).length);

	let showResetConfirm = $state(false);

	// 광고 테스트
	let showAdResult = $state(false);
	let adResult = $state<unknown>(null);
	let adType = $state('');

	function resetProgress() {
		unlockedIngredientsStore.reset();
		unlockedDishesStore.reset();
		triedCombinationsStore.reset();
		successCombinationsStore.reset();
		showResetConfirm = false;
	}

	async function testRewardedAd() {
		adType = 'Rewarded Ad';
		if (!window.NativeBridge) {
			adResult = { error: 'NativeBridge not available (웹 환경)' };
			showAdResult = true;
			return;
		}
		adResult = await window.NativeBridge.showRewardedAd();
		showAdResult = true;
	}

	async function testInterstitialAd() {
		adType = 'Interstitial Ad';
		if (!window.NativeBridge) {
			adResult = { error: 'NativeBridge not available (웹 환경)' };
			showAdResult = true;
			return;
		}
		adResult = await window.NativeBridge.showInterstitialAd();
		showAdResult = true;
	}

	function testCrash() {
		if (!window.NativeBridge) {
			alert('NativeBridge not available (웹 환경)');
			return;
		}
		window.NativeBridge.testCrash();
	}
</script>

<div class="my-container">
	<header class="my-header">
		<h1 class="title">My</h1>
	</header>

	<!-- 통계 섹션 -->
	<section class="stats-section">
		<h2 class="section-title">
			<Info size={18} />
			통계
		</h2>
		<div class="stats-grid">
			<div class="stat-item">
				<span class="stat-value">{unlockedIngredients}</span>
				<span class="stat-label">해금된 재료</span>
			</div>
			<div class="stat-item">
				<span class="stat-value">{unlockedDishes}</span>
				<span class="stat-label">발견한 요리</span>
			</div>
			<div class="stat-item">
				<span class="stat-value">{triedCombinations}</span>
				<span class="stat-label">시도한 조합</span>
			</div>
			<div class="stat-item">
				<span class="stat-value">{successCombinations}</span>
				<span class="stat-label">성공한 조합</span>
			</div>
		</div>
	</section>

	<!-- 설정 섹션 -->
	<section class="settings-section">
		<h2 class="section-title">
			<Settings size={18} />
			설정
		</h2>

		<div class="settings-list">
			<button class="setting-item danger" onclick={() => (showResetConfirm = true)}>
				<RotateCcw size={20} />
				<span>진행 상황 초기화</span>
			</button>
		</div>
	</section>

	{#if dev}
		<!-- 광고 테스트 섹션 (개발 환경에서만) -->
		<section class="settings-section">
			<h2 class="section-title">
				<Play size={18} />
				광고 테스트
			</h2>

			<div class="settings-list">
				<button class="setting-item" onclick={testRewardedAd}>
					<Film size={20} />
					<span>리워드 광고 (RV)</span>
				</button>
				<button class="setting-item" onclick={testInterstitialAd}>
					<Play size={20} />
					<span>전면 광고 (Interstitial)</span>
				</button>
				<button class="setting-item danger" onclick={testCrash}>
					<RotateCcw size={20} />
					<span>크래시 테스트 (앱 강제종료)</span>
				</button>
			</div>
		</section>
	{/if}
</div>

<!-- 광고 결과 모달 -->
{#if showAdResult}
	<div class="modal-overlay" onclick={() => (showAdResult = false)} role="presentation">
		<div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog">
			<h3 class="modal-title">{adType} 결과</h3>
			<pre class="result-json">{JSON.stringify(adResult, null, 2)}</pre>
			<div class="modal-actions">
				<button class="btn-cancel" onclick={() => (showAdResult = false)}>닫기</button>
			</div>
		</div>
	</div>
{/if}

<!-- 초기화 확인 모달 -->
{#if showResetConfirm}
	<div class="modal-overlay" onclick={() => (showResetConfirm = false)} role="presentation">
		<div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog">
			<h3 class="modal-title">정말 초기화하시겠습니까?</h3>
			<p class="modal-desc">모든 진행 상황이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</p>
			<div class="modal-actions">
				<button class="btn-cancel" onclick={() => (showResetConfirm = false)}>취소</button>
				<button class="btn-confirm" onclick={resetProgress}>초기화</button>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference '$styles/app.css';

	.my-container {
		@apply flex flex-col;
		@apply h-full;
		@apply bg-base-100;
	}

	.my-header {
		@apply p-4;
		@apply border-base-300 border-b;
	}

	.title {
		@apply text-xl font-bold;
		@apply text-center;
	}

	.section-title {
		@apply flex items-center gap-2;
		@apply text-sm font-medium;
		@apply text-base-content/70;
		@apply mb-3;
	}

	/* 통계 */
	.stats-section {
		@apply p-4;
	}

	.stats-grid {
		@apply grid grid-cols-2 gap-3;
	}

	.stat-item {
		@apply flex flex-col items-center;
		@apply bg-base-200;
		@apply rounded-xl;
		@apply p-4;
	}

	.stat-value {
		@apply text-2xl font-bold;
		@apply text-primary;
	}

	.stat-label {
		@apply text-xs;
		@apply text-base-content/60;
		@apply mt-1;
	}

	/* 설정 */
	.settings-section {
		@apply p-4;
		@apply border-base-300 border-t;
	}

	.settings-list {
		@apply flex flex-col gap-2;
	}

	.setting-item {
		@apply flex items-center gap-3;
		@apply w-full;
		@apply p-4;
		@apply bg-base-200;
		@apply rounded-xl;
		@apply text-left;
		@apply transition-colors;
	}

	.setting-item:hover {
		@apply bg-base-300;
	}

	.setting-item.danger {
		@apply text-error;
	}

	/* 모달 */
	.modal-overlay {
		@apply fixed inset-0;
		@apply bg-black/50;
		@apply flex items-center justify-center;
		@apply p-4;
		z-index: 200;
	}

	.modal-content {
		@apply bg-base-100;
		@apply rounded-2xl;
		@apply p-6;
		@apply w-full max-w-sm;
	}

	.modal-title {
		@apply text-lg font-bold;
		@apply mb-2;
	}

	.modal-desc {
		@apply text-sm;
		@apply text-base-content/70;
		@apply mb-6;
	}

	.modal-actions {
		@apply flex gap-3;
	}

	.btn-cancel {
		@apply flex-1;
		@apply py-3;
		@apply bg-base-200;
		@apply rounded-xl;
		@apply font-medium;
	}

	.btn-confirm {
		@apply flex-1;
		@apply py-3;
		@apply bg-error;
		@apply text-error-content;
		@apply rounded-xl;
		@apply font-medium;
	}

	/* 광고 결과 */
	.result-json {
		@apply bg-base-200;
		@apply rounded-lg;
		@apply p-3;
		@apply text-xs;
		@apply overflow-auto;
		@apply max-h-48;
		@apply mb-4;
	}
</style>
