<script lang="ts">
	import { goto } from '$app/navigation';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	async function handleLogout() {
		const response = await fetch('/api/auth/logout', { method: 'POST' });
		if (response.ok) {
			goto('/auth');
		}
	}
</script>

<!-- 앱바 -->
<div class="flex items-center justify-between px-4 py-3 bg-base-100 shadow-lg">
	<a href="/app/characters" class="text-xl font-bold">Otome</a>
	<div class="flex items-center gap-4">
		<div class="flex flex-col items-end">
			<span class="font-semibold">{data.user.nickname || '사용자'}</span>
			<span class="text-xs opacity-70">{data.user.email}</span>
		</div>
		<button class="btn btn-outline btn-sm" onclick={handleLogout}>로그아웃</button>
	</div>
</div>

<!-- 메인 콘텐츠 -->
<main class="container mx-auto p-4">
	{@render children()}
</main>
