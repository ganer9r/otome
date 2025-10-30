<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="container mx-auto p-4">
	<!-- 헤더 -->
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">캐릭터 목록</h1>
	</div>

	<!-- 캐릭터 목록 -->
	{#if data.characters.length === 0}
		<!-- 빈 상태 -->
		<div class="text-center py-12">
			<p class="text-lg text-base-content/60 mb-4">
				아직 생성된 캐릭터가 없습니다.
			</p>
			<a href=" /app/characters/new" class="btn btn-primary">
				첫 캐릭터 만들기
			</a>
		</div>
	{:else}
		<!-- 그리드 레이아웃: 모바일 1열, 태블릿 2열, 데스크톱 3열 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each data.characters as character (character.id)}
				<a
					href="/app/characters/{character.id}"
					class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
				>
					<div class="card-body">
						<h2 class="card-title">{character.name}</h2>
						{#if character.info}
							<p class="line-clamp-3">{character.info}</p>
						{/if}
						<div class="card-actions justify-end mt-2">
							<span class="text-sm text-base-content/60">
								{new Date(character.created_at).toLocaleDateString('ko-KR')}
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
