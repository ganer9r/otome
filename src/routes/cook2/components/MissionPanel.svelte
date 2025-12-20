<script lang="ts">
	import { missionStore } from '../lib/mission-store';
	import { DAILY_MISSIONS, ACHIEVEMENTS } from '../lib/data/missions';
	import type { MissionDefinition, MissionProgress } from '../lib/types';
	import GameButton from './GameButton.svelte';

	interface Props {
		/** 표시할 카테고리 */
		category?: 'daily' | 'achievement' | 'all';
	}

	let { category = 'all' }: Props = $props();

	let missionProgress = $derived($missionStore);

	// 미션 진행도 가져오기
	function getProgress(mission: MissionDefinition): MissionProgress {
		return (
			missionProgress[mission.id] || {
				missionId: mission.id,
				current: 0,
				completed: false,
				claimed: false
			}
		);
	}

	// 보상 수령
	function handleClaim(missionId: string) {
		missionStore.claimReward(missionId);
	}

	// 진행률 계산
	function getProgressPercent(mission: MissionDefinition): number {
		const progress = getProgress(mission);
		return Math.min((progress.current / mission.target) * 100, 100);
	}
</script>

<div class="mission-panel">
	{#if category === 'all' || category === 'daily'}
		<div class="section">
			<h3 class="section-title">일일 미션</h3>
			<div class="mission-list">
				{#each DAILY_MISSIONS as mission (mission.id)}
					{@const progress = getProgress(mission)}
					<div
						class="mission-item"
						class:completed={progress.completed}
						class:claimed={progress.claimed}
					>
						<div class="mission-info">
							<div class="mission-title">{mission.title}</div>
							<div class="mission-progress-bar">
								<div
									class="mission-progress-fill"
									style="width: {getProgressPercent(mission)}%"
								></div>
							</div>
							<div class="mission-progress-text">
								{progress.current} / {mission.target}
							</div>
						</div>
						<div class="mission-reward">
							{#if progress.claimed}
								<span class="claimed-badge">완료</span>
							{:else if progress.completed}
								<GameButton
									variant="primary"
									size="sm"
									class="claim-btn"
									onclick={() => handleClaim(mission.id)}
								>
									+{mission.reward}
								</GameButton>
							{:else}
								<span class="reward-preview">+{mission.reward}</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if category === 'all' || category === 'achievement'}
		<div class="section">
			<h3 class="section-title">업적</h3>
			<div class="mission-list">
				{#each ACHIEVEMENTS as mission (mission.id)}
					{@const progress = getProgress(mission)}
					{#if !progress.claimed}
						<div class="mission-item" class:completed={progress.completed}>
							<div class="mission-info">
								<div class="mission-title">{mission.title}</div>
								<div class="mission-desc">{mission.description}</div>
								<div class="mission-progress-bar">
									<div
										class="mission-progress-fill"
										style="width: {getProgressPercent(mission)}%"
									></div>
								</div>
								<div class="mission-progress-text">
									{progress.current} / {mission.target}
								</div>
							</div>
							<div class="mission-reward">
								{#if progress.completed}
									<GameButton
										variant="primary"
										size="sm"
										class="claim-btn"
										onclick={() => handleClaim(mission.id)}
									>
										+{mission.reward}
									</GameButton>
								{:else}
									<span class="reward-preview">+{mission.reward}</span>
								{/if}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.mission-panel {
		@apply flex flex-col gap-4;
	}

	.section {
		@apply flex flex-col gap-2;
	}

	.section-title {
		@apply text-lg font-bold;
		color: #5d4037;
	}

	.mission-list {
		@apply flex flex-col gap-2;
	}

	.mission-item {
		@apply flex items-center gap-3;
		@apply rounded-xl p-3;
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid #e8d4a8;
	}

	.mission-item.completed {
		border-color: #4caf50;
		background: rgba(76, 175, 80, 0.1);
	}

	.mission-item.claimed {
		opacity: 0.6;
	}

	.mission-info {
		@apply flex flex-1 flex-col gap-1;
	}

	.mission-title {
		@apply font-bold;
		font-size: 14px;
		color: #5d4037;
	}

	.mission-desc {
		font-size: 12px;
		color: #8d6e63;
	}

	.mission-progress-bar {
		@apply h-2 w-full overflow-hidden rounded-full;
		background: #e0d4c0;
	}

	.mission-progress-fill {
		@apply h-full rounded-full;
		background: linear-gradient(90deg, #7cc576, #4caf50);
		transition: width 0.3s ease;
	}

	.mission-progress-text {
		font-size: 11px;
		color: #8d6e63;
	}

	.mission-reward {
		@apply flex-shrink-0;
	}

	.reward-preview {
		@apply font-bold;
		font-size: 14px;
		color: #ffc107;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	:global(.claim-btn) {
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	.claimed-badge {
		@apply rounded-lg px-2 py-1 font-bold;
		font-size: 12px;
		background: #e0e0e0;
		color: #9e9e9e;
	}
</style>
