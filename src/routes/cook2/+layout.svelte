<script lang="ts">
	import { page } from '$app/state';
	import { Home as HomeIcon, BookOpen, User } from 'lucide-svelte';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// 현재 경로가 play면 탭 숨김
	let isPlayPage = $derived(page.url.pathname.includes('/cook2/play'));

	const tabs = [
		{ path: '/cook2', label: 'Home', icon: HomeIcon },
		{ path: '/cook2/collection', label: 'Collection', icon: BookOpen },
		{ path: '/cook2/my', label: 'My', icon: User }
	];

	function isActive(path: string) {
		if (path === '/cook2') {
			return page.url.pathname === '/cook2';
		}
		return page.url.pathname.startsWith(path);
	}
</script>

<div class="app-container">
	<main class="main-content" class:full-screen={isPlayPage}>
		{@render children()}
	</main>

	{#if !isPlayPage}
		<nav class="bottom-tabs">
			{#each tabs as tab}
				<a href={tab.path} class="tab-item" class:active={isActive(tab.path)}>
					<tab.icon size={24} />
					<span class="tab-label">{tab.label}</span>
				</a>
			{/each}
		</nav>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.app-container {
		@apply flex flex-col;
		@apply h-screen;
		@apply bg-base-100;
	}

	.main-content {
		@apply flex-1;
		@apply overflow-auto;
		padding-bottom: 70px; /* 탭 높이 */
	}

	.main-content.full-screen {
		padding-bottom: 0;
	}

	.bottom-tabs {
		@apply fixed right-0 bottom-0 left-0;
		@apply flex justify-around;
		@apply bg-base-100;
		@apply border-base-300 border-t;
		@apply py-2;
		height: 70px;
		z-index: 100;
	}

	.tab-item {
		@apply flex flex-col items-center justify-center;
		@apply gap-1;
		@apply text-gray-400;
		@apply transition-colors;
		@apply flex-1;
	}

	.tab-item.active {
		@apply text-primary;
	}

	.tab-label {
		@apply text-xs font-medium;
	}
</style>
