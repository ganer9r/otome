<script lang="ts">
	import { onMount } from 'svelte';
	import { Volume2, VolumeX, Music, Sparkles, Play } from 'lucide-svelte';
	import GameHeader from '../../components/GameHeader.svelte';
	import GameButton from '../../components/GameButton.svelte';
	import { getSoundManager } from '$lib/domain/sound';

	// 사운드 설정
	let bgmVolume = $state(100);
	let sfxVolume = $state(100);
	let isMuted = $state(false);

	onMount(() => {
		const soundManager = getSoundManager();
		bgmVolume = soundManager.getBgmVolume();
		sfxVolume = soundManager.getSfxVolume();
		isMuted = soundManager.isMuted();
	});

	// BGM 테스트 재생
	function testBgm() {
		const soundManager = getSoundManager();
		soundManager.playBgm('cook');
		// 3초 후 정지
		setTimeout(() => {
			soundManager.stopBgm();
		}, 3000);
	}

	// SFX 테스트 재생
	function testSfx() {
		getSoundManager().playSfx('button');
	}

	function handleBgmVolumeChange(e: Event) {
		const value = parseInt((e.target as HTMLInputElement).value);
		bgmVolume = value;
		getSoundManager().setBgmVolume(value);
	}

	function handleSfxVolumeChange(e: Event) {
		const value = parseInt((e.target as HTMLInputElement).value);
		sfxVolume = value;
		getSoundManager().setSfxVolume(value);
	}

	function toggleMute() {
		isMuted = !isMuted;
		getSoundManager().setMuted(isMuted);
	}
</script>

<div class="sound-container">
	<GameHeader title="사운드 설정" backHref="/cook2/my" />

	<div class="content">
		<!-- BGM 설정 -->
		<section class="sound-section">
			<div class="section-header">
				<Music size={20} />
				<span>배경음악 (BGM)</span>
			</div>
			<div class="volume-control">
				<input
					type="range"
					min="0"
					max="100"
					value={bgmVolume}
					oninput={handleBgmVolumeChange}
					class="volume-slider"
					disabled={isMuted}
				/>
				<span class="volume-value" class:disabled={isMuted}>{bgmVolume}%</span>
			</div>
		</section>

		<!-- SFX 설정 -->
		<section class="sound-section">
			<div class="section-header">
				<Sparkles size={20} />
				<span>효과음 (SFX)</span>
			</div>
			<div class="volume-control">
				<input
					type="range"
					min="0"
					max="100"
					value={sfxVolume}
					oninput={handleSfxVolumeChange}
					class="volume-slider"
					disabled={isMuted}
				/>
				<span class="volume-value" class:disabled={isMuted}>{sfxVolume}%</span>
			</div>
		</section>

		<!-- 테스트 섹션 -->
		<section class="test-section">
			<p class="test-title">테스트로 들어보기</p>
			<div class="test-buttons">
				<GameButton class="test-btn" disabled={isMuted} onclick={testBgm}>
					<Play size={18} />
					<span>BGM</span>
				</GameButton>
				<GameButton class="test-btn" disabled={isMuted} onclick={testSfx}>
					<Play size={18} />
					<span>효과음</span>
				</GameButton>
			</div>
		</section>

		<!-- 음소거 토글 -->
		<section class="mute-section">
			<GameButton
				variant={isMuted ? 'danger' : 'secondary'}
				class="mute-button"
				onclick={toggleMute}
			>
				{#if isMuted}
					<VolumeX size={24} />
					<div class="mute-text">
						<span class="mute-title">음소거 중</span>
						<span class="mute-desc">터치하여 소리 켜기</span>
					</div>
				{:else}
					<Volume2 size={24} />
					<div class="mute-text">
						<span class="mute-title">소리 켜짐</span>
						<span class="mute-desc">터치하여 음소거</span>
					</div>
				{/if}
			</GameButton>
		</section>
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.sound-container {
		@apply flex flex-col;
		@apply h-full w-full;
		@apply bg-base-100;
	}

	.content {
		@apply flex-1;
		@apply flex flex-col gap-6;
		@apply p-4;
		@apply overflow-y-auto;
	}

	/* 섹션 */
	.sound-section {
		@apply bg-base-200;
		@apply rounded-2xl;
		@apply p-4;
	}

	.section-header {
		@apply flex items-center gap-2;
		@apply font-bold;
		@apply mb-4;
	}

	/* 볼륨 컨트롤 */
	.volume-control {
		@apply flex items-center gap-3;
	}

	.volume-slider {
		@apply flex-1;
		@apply h-3;
		@apply rounded-full;
		@apply bg-base-300;
		@apply appearance-none;
		@apply cursor-pointer;
	}

	.volume-slider::-webkit-slider-thumb {
		@apply appearance-none;
		@apply h-6 w-6;
		@apply rounded-full;
		@apply bg-primary;
		@apply cursor-pointer;
		@apply shadow-lg;
		@apply border-2 border-white;
	}

	.volume-slider:disabled {
		@apply opacity-40;
		@apply cursor-not-allowed;
	}

	.volume-slider:disabled::-webkit-slider-thumb {
		@apply bg-base-content/30;
	}

	.volume-value {
		@apply w-14;
		@apply text-right;
		@apply font-bold;
		@apply text-primary;
	}

	.volume-value.disabled {
		@apply text-base-content/30;
	}

	/* 테스트 섹션 */
	.test-section {
		@apply bg-base-200;
		@apply rounded-2xl;
		@apply p-4;
	}

	.test-title {
		@apply text-sm font-medium;
		@apply text-base-content/70;
		@apply mb-3;
	}

	.test-buttons {
		@apply flex gap-3;
	}

	:global(.test-btn) {
		@apply flex-1;
	}

	/* 음소거 */
	.mute-section {
		@apply mt-auto;
	}

	:global(.mute-button) {
		@apply w-full;
		@apply justify-start;
		@apply p-5;
	}

	.mute-text {
		@apply flex flex-col items-start;
	}

	.mute-title {
		@apply font-bold;
	}

	.mute-desc {
		@apply text-xs;
		@apply opacity-60;
	}
</style>
