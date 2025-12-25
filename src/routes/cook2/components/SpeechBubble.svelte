<script lang="ts">
	import { onDestroy } from 'svelte';

	interface Props {
		/** 표시할 텍스트 */
		text: string;
		/** 말꼬리 위치 */
		tailPosition?: 'left' | 'right' | 'top' | 'bottom' | 'none';
		/** 말풍선 스타일 변형 */
		variant?: 'default' | 'critical' | 'fail' | 'customer';
		/** 타이핑 속도 (ms per character) */
		typingSpeed?: number;
		/** 전체 너비 사용 여부 */
		fullWidth?: boolean;
		/** 타이핑 완료 콜백 */
		onTypingComplete?: () => void;
		/** 추가 클래스 */
		class?: string;
	}

	let {
		text,
		tailPosition = 'left',
		variant = 'default',
		typingSpeed = 50,
		fullWidth = true,
		onTypingComplete,
		class: className = ''
	}: Props = $props();

	let displayedText = $state('');
	let isTyping = $state(false);
	let typingInterval: ReturnType<typeof setInterval> | null = null;

	// 타이핑 효과
	function startTyping() {
		displayedText = '';
		isTyping = true;
		let index = 0;

		typingInterval = setInterval(() => {
			if (index < text.length) {
				displayedText += text[index];
				index++;
			} else {
				stopTyping();
				onTypingComplete?.();
			}
		}, typingSpeed);
	}

	function stopTyping() {
		if (typingInterval) {
			clearInterval(typingInterval);
			typingInterval = null;
		}
		isTyping = false;
	}

	// 텍스트 변경 시 타이핑 재시작
	$effect(() => {
		if (text) {
			startTyping();
		}
		return () => stopTyping();
	});

	// 클릭 시 타이핑 스킵
	function handleClick() {
		if (isTyping) {
			stopTyping();
			displayedText = text;
			onTypingComplete?.();
		}
	}

	onDestroy(() => {
		stopTyping();
	});
</script>

<div
	class="speech-bubble {variant} tail-{tailPosition} {className}"
	class:typing={isTyping}
	class:full-width={fullWidth}
	onclick={handleClick}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
	{#if fullWidth}
		<!-- 공간 확보용 (투명) -->
		<span class="bubble-text-placeholder">{text}</span>
		<!-- 실제 표시되는 텍스트 -->
		<span class="bubble-text">
			{displayedText}
			{#if isTyping}
				<span class="cursor">|</span>
			{/if}
		</span>
	{:else}
		<span class="bubble-text-inline">
			{displayedText}
			{#if isTyping}
				<span class="cursor">|</span>
			{/if}
		</span>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.speech-bubble {
		@apply relative inline-block;
		@apply px-5 py-3;
		@apply rounded-2xl;
		@apply font-bold;
		font-size: clamp(14px, 3.5vw, 18px);
		background: white;
		border: 3px solid #5d4037;
		color: #5d4037;
		box-shadow: 0 3px 0 #3e2723;
		cursor: pointer;
		user-select: none;
	}

	.speech-bubble.full-width {
		@apply block w-full;
	}

	/* 말꼬리 - 왼쪽 */
	.speech-bubble.tail-left::before {
		content: '';
		@apply absolute;
		left: -16px;
		top: 50%;
		transform: translateY(-50%);
		border: 8px solid transparent;
		border-right-color: #5d4037;
	}

	.speech-bubble.tail-left::after {
		content: '';
		@apply absolute;
		left: -9px;
		top: 50%;
		transform: translateY(-50%);
		border: 6px solid transparent;
		border-right-color: white;
	}

	/* 말꼬리 - 오른쪽 */
	.speech-bubble.tail-right::before {
		content: '';
		@apply absolute;
		right: -16px;
		top: 50%;
		transform: translateY(-50%);
		border: 8px solid transparent;
		border-left-color: #5d4037;
	}

	.speech-bubble.tail-right::after {
		content: '';
		@apply absolute;
		right: -9px;
		top: 50%;
		transform: translateY(-50%);
		border: 6px solid transparent;
		border-left-color: white;
	}

	/* 말꼬리 - 위 */
	.speech-bubble.tail-top::before {
		content: '';
		@apply absolute;
		top: -16px;
		left: 50%;
		transform: translateX(-50%);
		border: 8px solid transparent;
		border-bottom-color: #5d4037;
	}

	.speech-bubble.tail-top::after {
		content: '';
		@apply absolute;
		top: -9px;
		left: 50%;
		transform: translateX(-50%);
		border: 6px solid transparent;
		border-bottom-color: white;
	}

	/* 말꼬리 - 아래 */
	.speech-bubble.tail-bottom::before {
		content: '';
		@apply absolute;
		bottom: -16px;
		left: 50%;
		transform: translateX(-50%);
		border: 8px solid transparent;
		border-top-color: #5d4037;
	}

	.speech-bubble.tail-bottom::after {
		content: '';
		@apply absolute;
		bottom: -9px;
		left: 50%;
		transform: translateX(-50%);
		border: 6px solid transparent;
		border-top-color: white;
	}

	/* 말꼬리 없음 */
	.speech-bubble.tail-none::before,
	.speech-bubble.tail-none::after {
		display: none;
	}

	/* Variant: critical (황금) */
	.speech-bubble.critical {
		background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
		border-color: #f59e0b;
		color: #92400e;
		box-shadow:
			0 3px 0 #d97706,
			0 0 20px rgba(251, 191, 36, 0.5);
	}

	.speech-bubble.critical.tail-left::before {
		border-right-color: #f59e0b;
	}
	.speech-bubble.critical.tail-left::after {
		border-right-color: #fffbeb;
	}
	.speech-bubble.critical.tail-right::before {
		border-left-color: #f59e0b;
	}
	.speech-bubble.critical.tail-right::after {
		border-left-color: #fffbeb;
	}
	.speech-bubble.critical.tail-top::before {
		border-bottom-color: #f59e0b;
	}
	.speech-bubble.critical.tail-top::after {
		border-bottom-color: #fffbeb;
	}
	.speech-bubble.critical.tail-bottom::before {
		border-top-color: #f59e0b;
	}
	.speech-bubble.critical.tail-bottom::after {
		border-top-color: #fffbeb;
	}

	/* Variant: fail (빨강) */
	.speech-bubble.fail {
		background: #ffebee;
		border-color: #c62828;
		color: #c62828;
		box-shadow: 0 3px 0 #b71c1c;
	}

	.speech-bubble.fail.tail-left::before {
		border-right-color: #c62828;
	}
	.speech-bubble.fail.tail-left::after {
		border-right-color: #ffebee;
	}
	.speech-bubble.fail.tail-right::before {
		border-left-color: #c62828;
	}
	.speech-bubble.fail.tail-right::after {
		border-left-color: #ffebee;
	}
	.speech-bubble.fail.tail-top::before {
		border-bottom-color: #c62828;
	}
	.speech-bubble.fail.tail-top::after {
		border-bottom-color: #ffebee;
	}
	.speech-bubble.fail.tail-bottom::before {
		border-top-color: #c62828;
	}
	.speech-bubble.fail.tail-bottom::after {
		border-top-color: #ffebee;
	}

	/* Variant: customer (손님용 - 노랑) */
	.speech-bubble.customer {
		background: white;
		border-color: #fcd34d;
		color: #78350f;
		box-shadow: 0 2px 0 #f59e0b;
	}

	.speech-bubble.customer.tail-left::before {
		border-right-color: #fcd34d;
	}
	.speech-bubble.customer.tail-left::after {
		border-right-color: white;
	}
	.speech-bubble.customer.tail-right::before {
		border-left-color: #fcd34d;
	}
	.speech-bubble.customer.tail-right::after {
		border-left-color: white;
	}
	.speech-bubble.customer.tail-top::before {
		border-bottom-color: #fcd34d;
	}
	.speech-bubble.customer.tail-top::after {
		border-bottom-color: white;
	}
	.speech-bubble.customer.tail-bottom::before {
		border-top-color: #fcd34d;
	}
	.speech-bubble.customer.tail-bottom::after {
		border-top-color: white;
	}

	/* 타이핑 커서 */
	.cursor {
		animation: blink 0.7s infinite;
		font-weight: normal;
		color: inherit;
		opacity: 0.7;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	.bubble-text-placeholder {
		@apply invisible;
		line-height: 1.4;
		word-break: keep-all;
	}

	.bubble-text {
		@apply absolute inset-0;
		@apply px-5 py-3;
		line-height: 1.4;
		word-break: keep-all;
	}

	.bubble-text-inline {
		line-height: 1.4;
		word-break: keep-all;
	}
</style>
