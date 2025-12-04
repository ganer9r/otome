<script lang="ts">
	import { goto } from '$app/navigation';
	import MissionPanel from '../components/MissionPanel.svelte';
	import { missionStore } from '../lib/mission-store';
	import { starStore } from '../lib/store';

	let totalStars = $derived($starStore);
	let unclaimedCount = $derived(missionStore.getUnclaimedCount());

	function goBack() {
		goto('/cook2');
	}
</script>

<div class="mission-page">
	<!-- 헤더 -->
	<header class="header">
		<button class="back-btn" onclick={goBack}>←</button>
		<h1 class="title">미션</h1>
		<div class="star-badge">
			<img src="/imgs/ui/star.png" alt="star" class="star-icon" />
			<span>{totalStars}</span>
		</div>
	</header>

	<!-- 미션 리스트 -->
	<div class="content">
		<MissionPanel category="daily" />
		<div class="divider"></div>
		<MissionPanel category="achievement" />
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.mission-page {
		@apply flex flex-col;
		@apply min-h-screen;
		background: linear-gradient(180deg, #fff8e1 0%, #ffe0b2 100%);
	}

	.header {
		@apply flex items-center justify-between;
		@apply px-4 py-3;
		@apply sticky top-0;
		background: rgba(255, 248, 225, 0.95);
		border-bottom: 2px solid #e8d4a8;
		z-index: 10;
	}

	.back-btn {
		@apply h-10 w-10;
		@apply flex items-center justify-center;
		@apply rounded-full;
		@apply text-xl font-bold;
		background: #fff;
		border: 2px solid #8b7355;
		color: #5d4037;
	}

	.title {
		@apply text-xl font-bold;
		color: #5d4037;
	}

	.star-badge {
		@apply flex items-center gap-1;
		@apply px-3 py-1.5;
		@apply rounded-full;
		@apply font-bold;
		background: linear-gradient(180deg, #3d3d3d 0%, #1a1a1a 100%);
		border: 2px solid #5a5a5a;
		color: #fff;
		font-size: 14px;
	}

	.star-icon {
		width: 20px;
		height: 20px;
	}

	.content {
		@apply flex-1;
		@apply p-4;
		@apply overflow-y-auto;
	}

	.divider {
		@apply my-4;
		border-top: 2px dashed #e8d4a8;
	}
</style>
