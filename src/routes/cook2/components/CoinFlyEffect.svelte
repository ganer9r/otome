<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		/** 코인 개수 */
		coinCount?: number;
		/** 시작 위치 (화면 좌표) */
		startX: number;
		startY: number;
		/** 타겟 위치 (화면 좌표) */
		targetX: number;
		targetY: number;
		/** 완료 콜백 */
		onComplete?: () => void;
	}

	let { coinCount = 15, startX, startY, targetX, targetY, onComplete }: Props = $props();

	// 사운드 재생 함수
	function playSound(src: string, volume = 0.5) {
		const audio = new Audio(src);
		audio.volume = volume;
		audio.play().catch(() => {});
	}

	interface Coin {
		id: number;
		x: number;
		y: number;
		scale: number;
		opacity: number;
		rotation: number;
		// 폭발 방향
		explosionX: number;
		explosionY: number;
		// 지연 시간
		delay: number;
	}

	let coins = $state<Coin[]>([]);
	let phase = $state<'explosion' | 'fly' | 'done'>('explosion');

	onMount(() => {
		// 코인 초기화 (랜덤 폭발 방향 - 더 넓게)
		coins = Array.from({ length: coinCount }, (_, i) => {
			// 랜덤한 각도와 거리
			const angle = Math.random() * Math.PI * 2;
			const distance = 80 + Math.random() * 80; // 80~160px 반경 (더 넓게)
			return {
				id: i,
				x: startX,
				y: startY,
				scale: 0,
				opacity: 0,
				rotation: Math.random() * 360,
				explosionX: Math.cos(angle) * distance,
				explosionY: Math.sin(angle) * distance,
				delay: i * 60 // 순차적 등장 (더 천천히)
			};
		});

		// Phase 1: Explosion (등장 + 퍼지기) - 더 천천히
		setTimeout(() => {
			// 폭발 사운드 재생
			playSound('/sounds/sfx/coin_brust.mp3', 0.6);

			coins = coins.map((coin) => ({
				...coin,
				x: startX + coin.explosionX,
				y: startY + coin.explosionY,
				scale: 1,
				opacity: 1,
				rotation: coin.rotation + 180
			}));
		}, 50);

		// Phase 2: Hold (1초 대기 후 fly)
		setTimeout(() => {
			phase = 'fly';

			// 각 코인 도착 시 사운드 재생 (순차적으로)
			coins.forEach((_, i) => {
				setTimeout(() => {
					playSound('/sounds/sfx/coin_collect.mp3', 0.5);
				}, i * 50); // 각 코인 delay와 동일하게
			});

			coins = coins.map((coin, i) => ({
				...coin,
				x: targetX,
				y: targetY,
				scale: 0.5,
				opacity: 0,
				rotation: coin.rotation + 540,
				delay: i * 50 // 순차적 도착
			}));
		}, 1500); // 1.5초 후 (폭발 후 약 1초 대기)

		// Phase 3: Complete
		setTimeout(() => {
			phase = 'done';
			onComplete?.();
		}, 2200); // 전체 약 2.2초
	});
</script>

<div class="coin-fly-container">
	{#each coins as coin (coin.id)}
		<div
			class="coin"
			class:explosion={phase === 'explosion'}
			class:fly={phase === 'fly'}
			style="
				left: {coin.x}px;
				top: {coin.y}px;
				transform: translate(-50%, -50%) scale({coin.scale}) rotate({coin.rotation}deg);
				opacity: {coin.opacity};
				transition-delay: {coin.delay}ms;
			"
		>
			<div class="coin-inner">
				<span class="coin-icon">💰</span>
			</div>
		</div>
	{/each}

	<!-- 타겟 위치 피드백 (도착 시 펄스) -->
	{#if phase === 'fly'}
		<div class="target-pulse" style="left: {targetX}px; top: {targetY}px;"></div>
	{/if}
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.coin-fly-container {
		@apply fixed inset-0 z-[200];
		pointer-events: none;
	}

	.coin {
		@apply absolute;
		will-change: transform, opacity, left, top;
	}

	.coin.explosion {
		transition:
			left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
			top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
			transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
			opacity 0.3s ease-out;
	}

	.coin.fly {
		transition:
			left 0.6s cubic-bezier(0.4, 0, 0.2, 1),
			top 0.6s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.5s ease-in;
	}

	.coin-inner {
		@apply flex items-center justify-center;
		width: 48px;
		height: 48px;
	}

	.coin-icon {
		font-size: 42px;
		filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
	}

	/* 타겟 펄스 효과 */
	.target-pulse {
		@apply absolute;
		transform: translate(-50%, -50%);
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, transparent 70%);
		animation: targetPulse 0.6s ease-out forwards;
	}

	@keyframes targetPulse {
		0% {
			transform: translate(-50%, -50%) scale(0.5);
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%) scale(2);
			opacity: 0;
		}
	}
</style>
