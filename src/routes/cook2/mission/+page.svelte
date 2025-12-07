<script lang="ts">
	import MissionPanel from '../components/MissionPanel.svelte';
	import { missionStore } from '../lib/mission-store';
	import { starStore } from '../lib/store';
	import GameHeader from '../components/GameHeader.svelte';

	let totalStars = $derived($starStore);
	let unclaimedCount = $derived(missionStore.getUnclaimedCount());
</script>

<div class="mission-page">
	<GameHeader title="미션" backHref="/cook2" showStar stars={totalStars} />

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
		@apply h-full w-full;
		background: linear-gradient(180deg, #fff8e1 0%, #ffe0b2 100%);
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
