<script lang="ts">
	import { toastStore, type Toast } from '../lib/toast-store';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let toasts: Toast[] = $state([]);

	$effect(() => {
		const unsubscribe = toastStore.subscribe((value) => {
			toasts = value;
		});
		return unsubscribe;
	});

	const typeIcons: Record<Toast['type'], string> = {
		success: '✓',
		error: '✗',
		warning: '!',
		info: '★'
	};
</script>

<div class="game-toast-container">
	{#each toasts as t (t.id)}
		<div
			class="game-toast game-toast-{t.type}"
			in:fly={{ y: -80, duration: 300 }}
			out:fly={{ y: -80, duration: 250 }}
			animate:flip={{ duration: 200 }}
		>
			<span class="game-toast-icon">{typeIcons[t.type]}</span>
			<span class="game-toast-msg">{t.message}</span>
		</div>
	{/each}
</div>

<style lang="postcss">
	.game-toast-container {
		position: fixed;
		top: 16px;
		left: 16px;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 8px;
		pointer-events: none;
	}

	.game-toast {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 20px;
		border-radius: 8px;
		font-weight: 700;
		font-size: 14px;
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.3),
			0 2px 4px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		border: 2px solid rgba(0, 0, 0, 0.3);
		text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
		pointer-events: auto;
		animation: game-toast-bounce 0.3s ease-out;
	}

	@keyframes game-toast-bounce {
		0% {
			transform: scale(0.8);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}

	.game-toast-icon {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 14px;
		font-weight: 900;
		background: rgba(0, 0, 0, 0.2);
		flex-shrink: 0;
	}

	.game-toast-msg {
		white-space: nowrap;
	}

	/* 타입별 색상 - 게임스러운 비비드 컬러 */
	.game-toast-success {
		background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
		color: #052e16;
		border-color: #166534;
	}

	.game-toast-success .game-toast-icon {
		background: #166534;
		color: #4ade80;
	}

	.game-toast-error {
		background: linear-gradient(180deg, #f87171 0%, #ef4444 100%);
		color: #450a0a;
		border-color: #991b1b;
	}

	.game-toast-error .game-toast-icon {
		background: #991b1b;
		color: #fca5a5;
	}

	.game-toast-warning {
		background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
		color: #451a03;
		border-color: #92400e;
	}

	.game-toast-warning .game-toast-icon {
		background: #92400e;
		color: #fcd34d;
	}

	.game-toast-info {
		background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
		color: #172554;
		border-color: #1e40af;
	}

	.game-toast-info .game-toast-icon {
		background: #1e40af;
		color: #93c5fd;
	}
</style>
