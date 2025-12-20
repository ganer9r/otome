<script lang="ts">
	import { onMount } from 'svelte';
	import GameToast from './components/GameToast.svelte';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// 기준 해상도 (360x740)
	const BASE_WIDTH = 360;
	const BASE_HEIGHT = 740;

	let scaleX = $state(1);
	let scaleY = $state(1);

	function updateScale() {
		scaleX = window.innerWidth / BASE_WIDTH;
		scaleY = window.innerHeight / BASE_HEIGHT;

		console.log('scaleX', window.innerWidth, scaleX);
		console.log('scaleY', window.innerHeight, scaleY);
	}

	onMount(() => {
		updateScale();
		window.addEventListener('resize', updateScale);

		return () => window.removeEventListener('resize', updateScale);
	});
</script>

<div class="viewport-wrapper">
	<div class="game-viewport" style="transform: scale({scaleX}, {scaleY});">
		{@render children()}
	</div>
</div>

<GameToast />

<style lang="postcss">
	@reference '$styles/app.css';

	.viewport-wrapper {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: fixed;
		inset: 0;
		background: #000;
	}

	.game-viewport {
		width: 360px;
		height: 740px;
		transform-origin: top left;
		@apply flex flex-col;
		@apply bg-base-100;
		overflow: hidden;
	}
</style>
