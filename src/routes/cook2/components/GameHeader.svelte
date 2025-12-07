<script lang="ts">
	import { goto } from '$app/navigation';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';

	interface Props {
		title: string;
		backHref?: string;
		showStar?: boolean;
		stars?: number;
	}

	let { title, backHref, showStar = false, stars = 0 }: Props = $props();

	function goBack() {
		if (backHref) {
			goto(backHref);
		} else {
			history.back();
		}
	}
</script>

<header class="header">
	{#if backHref !== undefined}
		<button class="back-btn" onclick={goBack}>
			<ArrowLeft size={16} />
		</button>
	{:else}
		<div class="spacer"></div>
	{/if}

	<h1 class="title">{title}</h1>

	{#if showStar}
		<div class="star-badge">
			<img src="/imgs/ui/star.png" alt="star" class="star-icon" />
			<span class="star-count">{stars}</span>
		</div>
	{:else}
		<div class="spacer"></div>
	{/if}
</header>

<style lang="postcss">
	@reference '$styles/app.css';

	.header {
		@apply flex items-center justify-between;
		@apply px-3 py-2;
		@apply z-20;
	}

	.back-btn {
		@apply h-8 w-8;
		@apply flex items-center justify-center;
		@apply rounded-full;
		font-size: 14px;
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid #8b7355;
		box-shadow: 0 2px 0 #5c4a38;
		cursor: pointer;
		color: #5d4037;
	}

	.back-btn:active {
		box-shadow: 0 1px 0 #5c4a38;
		transform: translateY(1px);
	}

	.title {
		@apply font-black;
		@apply text-center;
		font-size: 18px;
		color: #fff;
		text-shadow:
			0 2px 0 #c17a30,
			0 3px 0 #8b5a20;
		letter-spacing: 1px;
		-webkit-text-stroke: 1px #8b5a20;
		paint-order: stroke fill;
	}

	.star-badge {
		@apply flex items-center gap-1;
		@apply px-2 py-1;
		@apply rounded-full;
		background: linear-gradient(180deg, #3d3d3d 0%, #1a1a1a 100%);
		border: 2px solid #5a5a5a;
		box-shadow:
			0 2px 0 #0d0d0d,
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.star-icon {
		width: 16px;
		height: 16px;
	}

	.star-count {
		@apply font-bold text-white;
		font-size: 12px;
		text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
	}

	.spacer {
		width: 32px;
	}
</style>
