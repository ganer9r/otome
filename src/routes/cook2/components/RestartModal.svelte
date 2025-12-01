<script lang="ts">
	import { RotateCcw, Sparkles } from 'lucide-svelte';
	import type { ModalProps } from '$lib/stores/modal';

	export interface RestartModalProps extends ModalProps {}

	let { id, close }: RestartModalProps = $props();

	// 다시하기 핸들러
	function handleRestart() {
		close(); // 모달 닫기
	}
</script>

<div class="restart-modal">
	<!-- 컨텐츠 카드 (결과 모달과 크기 맞추기) -->
	<div class="content-card">
		<!-- 아이콘 -->
		<div class="icon-container">
			<Sparkles size={80} class="sparkle-icon" />
		</div>

		<!-- 메시지 -->
		<h2 class="message-title">새로운 조합에 도전하세요!</h2>
		<p class="message-subtitle">재료를 조합해서 더 많은 요리를 발견해보세요</p>
	</div>

	<!-- 다시하기 버튼 (확인 버튼과 동일한 위치/크기) -->
	<button type="button" class="btn btn-primary btn-lg btn-block restart-button" onclick={handleRestart}>
		<RotateCcw size={24} />
		<span>다시하기</span>
	</button>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.restart-modal {
		@apply flex flex-col items-center w-full;
		@apply relative;
		height: 65vh;
	}

	.content-card {
		@apply flex flex-col items-center gap-4;
		@apply w-full p-8 rounded-2xl;
		@apply bg-gradient-to-br from-primary/5 to-secondary/5;
		@apply border-4 border-primary/20;
		@apply shadow-2xl;
		@apply flex-1 overflow-y-auto;
		@apply mb-[76px];
		@apply justify-center;
	}

	.icon-container {
		@apply text-primary;
		animation: bounce 2s ease-in-out infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.sparkle-icon {
		animation: rotate 3s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.message-title {
		@apply font-bold text-gray-800;
		@apply text-center;
		font-size: var(--font-xl);
	}

	.message-subtitle {
		@apply text-gray-600;
		@apply text-center;
		@apply max-w-sm;
		font-size: var(--font-md);
	}

	.restart-button {
		@apply flex items-center justify-center;
		@apply shadow-xl;
		@apply font-bold;
		@apply absolute;
		@apply w-full;
		height: 60px;
		bottom: 0;
		font-size: var(--font-md);
		gap: var(--spacing-sm);
	}
</style>
