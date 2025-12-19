<script lang="ts" module>
	import { browser } from '$app/environment';

	const ONBOARDING_KEY = 'cook2_onboarding_done';
	const HINT_STEP_KEY = 'cook2_hint_step';

	/** 온보딩 완료 여부 확인 */
	export function isOnboardingComplete(): boolean {
		if (!browser) return true;
		return localStorage.getItem(ONBOARDING_KEY) === 'true';
	}

	/** 힌트 단계 증가 (요리 완료 시 호출) */
	export function advanceHintStep(): void {
		if (!browser) return;
		const current = parseInt(localStorage.getItem(HINT_STEP_KEY) || '0', 10);
		if (current < 3) {
			localStorage.setItem(HINT_STEP_KEY, String(current + 1));
		}
	}

	/** 힌트 단계 가져오기 */
	export function getHintStep(): number {
		if (!browser) return 3;
		return parseInt(localStorage.getItem(HINT_STEP_KEY) || '0', 10);
	}
</script>

<script lang="ts">
	import { browser as isBrowser } from '$app/environment';

	interface Props {
		/** 현재 선택된 재료 개수 */
		selectedCount: number;
		/** 현재 단계 */
		step: 'ingredient' | 'cooking' | 'result' | 'explosion';
		/** 온보딩 완료 콜백 */
		onComplete?: () => void;
	}

	let { selectedCount, step, onComplete }: Props = $props();

	// 온보딩 완료 여부
	let isDone = $state(isBrowser ? localStorage.getItem(ONBOARDING_KEY) === 'true' : true);

	// 온보딩 단계
	let onboardingStep = $state<'intro' | 'select' | 'cook' | 'done'>('intro');

	// 힌트 학습 단계 (0: 초록테두리, 1: 회색, 2: 성공이미지, 3: 완료)
	let hintStep = $state(isBrowser ? getHintStep() : 3);

	// 힌트 툴팁 표시 여부
	let showHintTooltip = $state(false);

	// 재료 선택에 따라 단계 자동 진행
	$effect(() => {
		if (isDone) return;

		// 2개 선택 시 요리 버튼 단계로
		if (onboardingStep === 'select' && selectedCount >= 2) {
			onboardingStep = 'cook';
		}
	});

	// 힌트 툴팁은 온보딩 완료 후에만 표시 (온보딩 중에는 select-guide가 역할 대신)
	$effect(() => {
		if (isDone && selectedCount === 1 && hintStep < 3 && step === 'ingredient') {
			showHintTooltip = true;
		} else {
			showHintTooltip = false;
		}
	});

	// 요리 단계로 넘어가면 온보딩 완료
	$effect(() => {
		if (isDone) return;

		if (step === 'cooking' && onboardingStep === 'cook') {
			completeOnboarding();
		}
	});

	function startOnboarding() {
		onboardingStep = 'select';
	}

	function skipOnboarding() {
		completeOnboarding();
	}

	function completeOnboarding() {
		isDone = true;
		onboardingStep = 'done';
		if (isBrowser) {
			localStorage.setItem(ONBOARDING_KEY, 'true');
		}
		onComplete?.();
	}

	function dismissHintTooltip() {
		showHintTooltip = false;
	}

	// 힌트 메시지
	const HINT_MESSAGES = [
		{ icon: '💚', text: '초록 테두리 = 조합 가능!' },
		{ icon: '🔘', text: '회색 재료 = 이미 시도한 조합' },
		{ icon: '✨', text: '결과 이미지 = 성공했던 조합!' }
	];
</script>

{#if !isDone}
	<!-- 인트로 모달 -->
	{#if onboardingStep === 'intro'}
		<div class="overlay">
			<div class="intro-modal">
				<img src="/imgs/character/chef_default.png" alt="백종원 셰프" class="chef-image" />
				<h2 class="title">요리를 시작해볼까요?</h2>
				<p class="description">
					재료 2개를 선택해서<br />
					맛있는 요리를 만들어보세요!
				</p>
				<div class="buttons">
					<button class="start-btn" onclick={startOnboarding}>시작하기</button>
					<button class="skip-btn" onclick={skipOnboarding}>건너뛰기</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- 재료 선택 가이드 (재료 그리드 위) -->
	{#if onboardingStep === 'select'}
		<div class="select-guide">
			<div class="tooltip-content">
				<span class="tooltip-icon">👇</span>
				{#if selectedCount === 0}
					<span class="tooltip-text">재료 2개를 선택해주세요!</span>
				{:else if selectedCount === 1}
					<span class="tooltip-text">초록 테두리 재료와 조합해보세요!</span>
				{/if}
			</div>
			<div class="tooltip-arrow"></div>
		</div>
	{/if}

	<!-- 요리 버튼 가이드 (요리 버튼 아래) -->
	{#if onboardingStep === 'cook'}
		<div class="cook-guide">
			<div class="tooltip-arrow up"></div>
			<div class="tooltip-content">
				<span class="tooltip-icon">☝️</span>
				<span class="tooltip-text">요리 버튼을 눌러주세요!</span>
			</div>
		</div>
	{/if}
{/if}

<!-- 힌트 툴팁 비활성화 -->

<style lang="postcss">
	@reference '$styles/app.css';

	/* 인트로 오버레이 */
	.overlay {
		@apply fixed inset-0 z-[200];
		@apply flex items-center justify-center;
		background: rgba(0, 0, 0, 0.8);
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.intro-modal {
		@apply flex flex-col items-center;
		@apply rounded-3xl p-8;
		@apply mx-4;
		width: 300px;
		background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
		border: 4px solid #f59e0b;
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.3),
			0 0 0 6px rgba(245, 158, 11, 0.3);
		animation: modalPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes modalPop {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.chef-image {
		width: 120px;
		height: auto;
		margin-bottom: 16px;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	.title {
		@apply text-xl font-bold;
		@apply mb-2;
		color: #78350f;
	}

	.description {
		@apply text-center text-sm;
		@apply mb-6;
		color: #92400e;
		line-height: 1.6;
	}

	.buttons {
		@apply flex flex-col gap-3;
		@apply w-full;
	}

	.start-btn {
		@apply w-full py-3;
		@apply rounded-xl;
		@apply font-bold;
		font-size: 16px;
		color: white;
		background: linear-gradient(180deg, #34d399 0%, #10b981 100%);
		border: none;
		border-bottom: 4px solid #059669;
		box-shadow: 0 4px 0 #047857;
		transition: all 0.2s;
	}

	.start-btn:hover {
		filter: brightness(1.05);
	}

	.start-btn:active {
		transform: translateY(2px);
		box-shadow: 0 2px 0 #047857;
	}

	.skip-btn {
		@apply w-full py-2;
		@apply font-medium;
		font-size: 14px;
		color: #9ca3af;
		background: transparent;
		border: none;
	}

	.skip-btn:hover {
		color: #6b7280;
	}

	/* 재료 선택 가이드 - 재료 그리드 바로 위 */
	.select-guide {
		@apply fixed z-[150];
		@apply flex flex-col items-center;
		@apply pointer-events-none;
		/* 70vw는 kitchen-section 높이 */
		top: calc(70vw - 20px);
		left: 50%;
		transform: translateX(-50%);
		animation: selectPulse 1.5s ease-in-out infinite;
	}

	@keyframes selectPulse {
		0%,
		100% {
			transform: translateX(-50%) translateY(0);
		}
		50% {
			transform: translateX(-50%) translateY(5px);
		}
	}

	/* 요리 버튼 가이드 - 요리 버튼 바로 아래 */
	.cook-guide {
		@apply fixed z-[150];
		@apply flex flex-col items-center;
		@apply pointer-events-none;
		/* kitchen-section 아래, 재료 그리드 위 */
		top: calc(70vw + 10px);
		left: 50%;
		transform: translateX(-50%);
		animation: cookPulse 1.5s ease-in-out infinite;
	}

	@keyframes cookPulse {
		0%,
		100% {
			transform: translateX(-50%) translateY(0);
		}
		50% {
			transform: translateX(-50%) translateY(5px);
		}
	}

	.tooltip-content {
		@apply flex items-center gap-2;
		@apply rounded-xl px-4 py-3;
		background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
		border: 3px solid #d97706;
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.2),
			0 0 0 4px rgba(245, 158, 11, 0.3);
	}

	.tooltip-icon {
		font-size: 24px;
	}

	.tooltip-text {
		@apply font-bold;
		font-size: 16px;
		color: #78350f;
		white-space: nowrap;
	}

	.tooltip-arrow {
		width: 0;
		height: 0;
		border-left: 12px solid transparent;
		border-right: 12px solid transparent;
		border-top: 12px solid #d97706;
		margin-top: -1px;
	}

	.tooltip-arrow.up {
		border-top: none;
		border-bottom: 12px solid #d97706;
		margin-top: 0;
		margin-bottom: -1px;
	}

	/* 힌트 툴팁 (단계별 학습) */
	.hint-tooltip {
		@apply fixed z-[150];
		@apply flex flex-col items-center;
		/* 재료 그리드 상단에 위치 */
		top: calc(70vw + 60px);
		left: 50%;
		transform: translateX(-50%);
		background: none;
		border: none;
		cursor: pointer;
		animation: hintAppear 0.3s ease-out;
	}

	@keyframes hintAppear {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.hint-tooltip-content {
		@apply flex items-center gap-2;
		@apply rounded-xl px-4 py-3;
		background: linear-gradient(180deg, #34d399 0%, #10b981 100%);
		border: 3px solid #059669;
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.2),
			0 0 0 4px rgba(16, 185, 129, 0.3);
	}

	.hint-tooltip-icon {
		font-size: 20px;
	}

	.hint-tooltip-text {
		@apply font-bold;
		font-size: 14px;
		color: white;
		white-space: nowrap;
	}

	.hint-tooltip-dismiss {
		@apply mt-1;
		font-size: 11px;
		color: rgba(255, 255, 255, 0.7);
	}
</style>
