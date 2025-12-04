<script lang="ts">
	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="app-container">
	{@render children()}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.app-container {
		@apply flex flex-col;
		@apply h-screen;
		@apply bg-base-100;
		@apply overflow-auto;
	}
</style>
