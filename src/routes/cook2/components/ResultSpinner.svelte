<script lang="ts">
	import { onMount } from 'svelte';
	import type { DishResultType } from '../lib/types';

	interface Props {
		/** 확률 (UI 영역 크기용) */
		probabilities?: { success: number; fail: number; critical: number };
		/** 스핀 완료 콜백 - 멈춘 위치의 결과 전달 */
		onComplete?: (result: DishResultType) => void;
	}

	let { probabilities = { success: 70, fail: 20, critical: 10 }, onComplete }: Props = $props();

	// 실제 결과 (멈춘 위치에서 결정)
	let actualResult: DishResultType | null = $state(null);

	// 상태
	type SpinnerState = 'ready' | 'charging' | 'spinning' | 'stopping' | 'done';
	let spinnerState: SpinnerState = $state('ready');

	// 파워 게이지 (0 ~ 100)
	let power = $state(0);
	let chargeInterval: ReturnType<typeof setInterval> | null = null;

	// 휠 회전 각도
	let wheelRotation = $state(0);

	// 램프 상태: 'off' | 'chasing' | 'blinking'
	type LampPhase = 'off' | 'chasing' | 'blinking';
	let lampPhase: LampPhase = $state('off');
	let lampBlinkInterval: ReturnType<typeof setInterval> | null = null;

	// 스피너용 결과 타입
	type SpinnerResultType = 'success' | 'fail' | 'critical';

	interface Segment {
		type: SpinnerResultType;
		startAngle: number;
		angle: number;
		color: string;
		icon: string;
	}

	const segmentColors: Record<SpinnerResultType, string> = {
		success: '#22C55E',
		fail: '#EF4444',
		critical: '#FBBF24'
	};

	const segmentIcons: Record<SpinnerResultType, string> = {
		success: '✓',
		fail: '✗',
		critical: '⭐'
	};

	// 5% 단위로 분산 배치, 5% 미만은 실제 비율 유지
	function generateSegments(): Segment[] {
		const total = probabilities.success + probabilities.fail + probabilities.critical;
		const unit = 5; // 5% 단위

		// 각 타입별 5% 칸 수 계산
		const successSlices = Math.floor(probabilities.success / unit);
		const failSlices = Math.floor(probabilities.fail / unit);
		const criticalSlices = Math.max(1, Math.floor(probabilities.critical / unit));

		// 나머지 % 계산
		const successRemainder = probabilities.success % unit;
		const failRemainder = probabilities.fail % unit;
		const criticalRemainder =
			probabilities.critical < unit ? probabilities.critical : probabilities.critical % unit;

		// 슬라이스 배열 생성
		const slices: { type: SpinnerResultType; percent: number }[] = [];

		// 5% 칸들 추가
		for (let i = 0; i < successSlices; i++) slices.push({ type: 'success', percent: unit });
		for (let i = 0; i < failSlices; i++) slices.push({ type: 'fail', percent: unit });

		// 대성공 (5% 미만이면 실제 비율, 아니면 5% 칸들 + 나머지)
		if (probabilities.critical < unit) {
			slices.push({ type: 'critical', percent: probabilities.critical });
		} else {
			for (let i = 0; i < criticalSlices; i++) slices.push({ type: 'critical', percent: unit });
			if (criticalRemainder > 0) slices.push({ type: 'critical', percent: criticalRemainder });
		}

		// 나머지 추가
		if (successRemainder > 0) slices.push({ type: 'success', percent: successRemainder });
		if (failRemainder > 0) slices.push({ type: 'fail', percent: failRemainder });

		// 분산 배치 (성공/실패 번갈아가며, 대성공은 중간에)
		const successArr = slices.filter((s) => s.type === 'success');
		const failArr = slices.filter((s) => s.type === 'fail');
		const criticalArr = slices.filter((s) => s.type === 'critical');

		const mixed: { type: SpinnerResultType; percent: number }[] = [];
		const maxLen = Math.max(successArr.length, failArr.length);

		// 번갈아 배치
		for (let i = 0; i < maxLen; i++) {
			if (i < successArr.length) mixed.push(successArr[i]);
			if (i < failArr.length) mixed.push(failArr[i]);
		}

		// 대성공을 중간쯤에 삽입
		const criticalPos = Math.floor(mixed.length / 2);
		for (let i = criticalArr.length - 1; i >= 0; i--) {
			mixed.splice(criticalPos, 0, criticalArr[i]);
		}

		// Fisher-Yates 셔플로 랜덤 섞기
		for (let i = mixed.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[mixed[i], mixed[j]] = [mixed[j], mixed[i]];
		}

		// 각도 계산
		const segments: Segment[] = [];
		let currentAngle = 0;

		for (const slice of mixed) {
			const angle = (slice.percent / total) * 360;
			segments.push({
				type: slice.type,
				startAngle: currentAngle,
				angle: angle,
				color: segmentColors[slice.type],
				icon: segmentIcons[slice.type]
			});
			currentAngle += angle;
		}

		return segments;
	}

	const segments = generateSegments();

	// 현재 휠 각도에서 포인터가 가리키는 세그먼트 찾기
	function getResultAtCurrentPosition(): DishResultType {
		// 포인터는 12시 방향(상단)에 있음
		// wheelRotation이 0일 때, 0도 위치가 포인터에 있음
		// wheelRotation이 증가하면 휠이 시계방향으로 회전
		// 포인터가 가리키는 각도 = (360 - wheelRotation) % 360
		const pointerAngle = (360 - (wheelRotation % 360) + 360) % 360;

		for (const segment of segments) {
			const endAngle = segment.startAngle + segment.angle;
			if (pointerAngle >= segment.startAngle && pointerAngle < endAngle) {
				return segment.type === 'critical' ? 'critical' : segment.type;
			}
		}

		// 첫 번째 세그먼트 반환 (fallback)
		return segments[0].type === 'critical' ? 'critical' : segments[0].type;
	}

	// 꾹 누르기 시작
	function handlePressStart() {
		if (spinnerState !== 'ready') return;
		spinnerState = 'charging';
		power = 0;

		chargeInterval = setInterval(() => {
			power = Math.min(power + 3, 100);
		}, 30);
	}

	// 꾹 누르기 끝 → 스핀 시작
	function handlePressEnd() {
		if (spinnerState !== 'charging') return;

		if (chargeInterval) {
			clearInterval(chargeInterval);
			chargeInterval = null;
		}

		if (power < 20) power = 20;
		startSpin();
	}

	// 스핀 시작
	function startSpin() {
		spinnerState = 'spinning';
		actualResult = null;

		// 램프 순차 점등 시작
		lampPhase = 'chasing';

		// 물리 기반 스피너 - 파워에 따라 초기 속도 결정
		let velocity = (power / 100) * 65; // 초기 속도 (0~65)
		const minVelocity = 0.02; // 멈춤 판정 속도

		// 파워에 따라 감속 계수 달라짐 (파워 높으면 더 오래 굴러감)
		// 파워 0%: k = 0.0003 (빨리 멈춤)
		// 파워 100%: k = 0.0002 (오래 굴러감)
		const k = 0.0003 - (power / 100) * 0.0001;

		function animate() {
			// 회전
			wheelRotation += velocity;

			// 속도² 비례 감속 (빠를 때 확 감속, 느릴 때 오래 미끄러짐)
			// 최소 감속량 0.01 추가 (느린 속도에서도 확실히 멈추게)
			const deceleration = Math.max(velocity * velocity * k, 0.01);
			velocity -= deceleration;

			if (velocity > minVelocity) {
				requestAnimationFrame(animate);
			} else {
				// 멈춤 - 현재 위치에서 결과 확인
				actualResult = getResultAtCurrentPosition();

				// 성공/대성공: 깜빡임, 실패: 꺼짐
				if (actualResult === 'success' || actualResult === 'critical') {
					lampPhase = 'off';
					requestAnimationFrame(() => {
						lampPhase = 'blinking';
					});
				} else {
					lampPhase = 'off';
				}

				spinnerState = 'stopping';
				setTimeout(() => {
					spinnerState = 'done';
					onComplete?.(actualResult!);
				}, 500);
			}
		}

		requestAnimationFrame(animate);
	}

	function handlePointerDown(e: PointerEvent) {
		e.preventDefault();
		handlePressStart();
	}

	function handlePointerUp(e: PointerEvent) {
		e.preventDefault();
		handlePressEnd();
	}

	function handlePointerLeave() {
		if (spinnerState === 'charging') {
			handlePressEnd();
		}
	}

	onMount(() => {
		return () => {
			if (chargeInterval) clearInterval(chargeInterval);
		};
	});
</script>

<div class="spinner-overlay">
	<div class="spinner-container" class:spinning={spinnerState === 'spinning'}>
		<!-- 외곽 장식 링 + 휠 (중앙 정렬을 위해 휠을 링 안에 배치) -->
		<div class="outer-ring">
			<!-- 램프 -->
			<div class="ring-lights">
				{#each Array(12) as _, i}
					<div
						class="ring-light"
						class:chasing={lampPhase === 'chasing'}
						class:blinking={lampPhase === 'blinking'}
						style="--delay: {i * 0.1}s; --angle: {i * 30}deg"
					></div>
				{/each}
			</div>

			<!-- 휠 -->
			<div class="wheel-wrapper">
				<!-- 포인터 -->
				<div class="pointer">
					<div class="pointer-arrow"></div>
				</div>

				<!-- 회전하는 휠 -->
				<div class="wheel" style="transform: rotate({wheelRotation}deg)">
					<svg viewBox="0 0 200 200" class="wheel-svg">
						{#each segments as segment, i}
							{@const startRad = ((segment.startAngle - 90) * Math.PI) / 180}
							{@const endRad = ((segment.startAngle + segment.angle - 90) * Math.PI) / 180}
							{@const x1 = 100 + 100 * Math.cos(startRad)}
							{@const y1 = 100 + 100 * Math.sin(startRad)}
							{@const x2 = 100 + 100 * Math.cos(endRad)}
							{@const y2 = 100 + 100 * Math.sin(endRad)}
							{@const largeArc = segment.angle > 180 ? 1 : 0}
							{@const midRad = ((segment.startAngle + segment.angle / 2 - 90) * Math.PI) / 180}
							{@const labelX = 100 + 60 * Math.cos(midRad)}
							{@const labelY = 100 + 60 * Math.sin(midRad)}
							{@const nextSegment = segments[(i + 1) % segments.length]}
							{@const showBorder = segment.type !== nextSegment.type}

							<!-- 세그먼트 영역 -->
							<path
								d="M 100 100 L {x1} {y1} A 100 100 0 {largeArc} 1 {x2} {y2} Z"
								fill={segment.color}
							/>
							<!-- 경계선 (다른 타입과 맞닿을 때만) -->
							{#if showBorder}
								<line x1="100" y1="100" {x2} {y2} stroke="white" stroke-width="1" />
							{/if}
							<text
								x={labelX}
								y={labelY}
								text-anchor="middle"
								dominant-baseline="middle"
								fill="white"
								font-size={segment.angle < 30 ? '10' : '14'}
								font-weight="bold"
								class="segment-text"
							>
								{segment.icon}
							</text>
						{/each}
					</svg>

					<!-- 중심 원 -->
					<div class="center-circle">
						<div class="center-inner">🍳</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 파워 게이지 & 버튼 -->
		{#if spinnerState === 'ready' || spinnerState === 'charging'}
			<div class="control-section">
				<div class="power-gauge">
					<div class="power-fill" style="width: {power}%"></div>
					<div class="power-text">
						{#if spinnerState === 'ready'}
							파워를 모아라!
						{:else}
							{power}%
						{/if}
					</div>
				</div>

				<button
					class="spin-button"
					class:charging={spinnerState === 'charging'}
					class:ready={spinnerState === 'ready'}
					onpointerdown={handlePointerDown}
					onpointerup={handlePointerUp}
					onpointerleave={handlePointerLeave}
					onpointercancel={handlePointerLeave}
				>
					{#if spinnerState === 'charging'}
						<span class="button-charging">💪 충전중!</span>
					{:else}
						<span class="button-ready">🎰 꾹 눌러!</span>
					{/if}
				</button>
			</div>
		{/if}

		<!-- 스핀 중 -->
		{#if spinnerState === 'spinning'}
			<div class="spin-message">
				<span class="spin-text">두근두근...</span>
			</div>
		{/if}

		<!-- 결과 -->
		{#if spinnerState === 'done' && actualResult}
			<div
				class="result-display"
				class:success={actualResult === 'success'}
				class:fail={actualResult === 'fail'}
				class:critical={actualResult === 'critical'}
			>
				{#if actualResult === 'critical'}
					<span class="result-icon">⭐</span>
					<span class="result-label">대성공!</span>
				{:else if actualResult === 'success'}
					<span class="result-icon">✓</span>
					<span class="result-label">성공!</span>
				{:else}
					<span class="result-icon">💀</span>
					<span class="result-label">실패...</span>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.spinner-overlay {
		@apply fixed inset-0 z-50;
		@apply flex items-center justify-center;
		background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.9) 100%);
	}

	.spinner-container {
		@apply relative flex flex-col items-center justify-center;
		@apply h-full w-full;

		/* 320px 기준 고정값 */
		--ring-size: 320px;
		--ring-padding: 20px;
		--wheel-size: calc(var(--ring-size) - var(--ring-padding) * 2); /* 280px */
		--lamp-radius: calc(var(--ring-size) / 2); /* 160px - 링 바깥 둘레 */
	}

	@keyframes tickShake {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(2px);
		}
	}

	/* 외곽 장식 링 - 320px 고정, flex로 휠 중앙 배치 */
	.outer-ring {
		@apply relative flex items-center justify-center;
		width: var(--ring-size);
		height: var(--ring-size);
		border-radius: 50%;
		background: linear-gradient(180deg, #5d4037 0%, #3e2723 100%);
		padding: var(--ring-padding);
		box-shadow:
			0 0 30px rgba(251, 191, 36, 0.3),
			inset 0 2px 4px rgba(255, 255, 255, 0.2);
	}

	.ring-lights {
		@apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
		width: var(--ring-size);
		height: var(--ring-size);
	}

	.ring-light {
		@apply absolute;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #666;
		top: 50%;
		left: 50%;
		/* 램프 중심을 링 중심에 맞추고(-6px), 반지름만큼 이동 */
		margin-top: -6px;
		margin-left: -6px;
		transform: rotate(var(--angle)) translateY(calc(var(--lamp-radius) * -1));
		transform-origin: 6px 6px; /* 램프 중심 기준으로 회전 */
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	/* 순차 점등 (chasing) - delay로 하나씩 켜지고 유지 */
	.ring-light.chasing {
		animation: lightOn 0.1s ease-out forwards;
		animation-delay: var(--delay);
	}

	@keyframes lightOn {
		0% {
			background: #666;
			box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
		}
		100% {
			background: #fde047;
			box-shadow: 0 0 15px #fde047;
		}
	}

	/* 전체 동시 깜빡임 (blinking) */
	.ring-light.blinking {
		animation: lightBlink 0.3s ease-in-out infinite !important;
	}

	@keyframes lightBlink {
		0%,
		100% {
			background: #fde047;
			box-shadow: 0 0 15px #fde047;
		}
		50% {
			background: #666;
			box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
		}
	}

	/* 휠 래퍼 - outer-ring 중앙에 배치 */
	.wheel-wrapper {
		@apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
		width: var(--wheel-size);
		height: var(--wheel-size);
	}

	/* 포인터 */
	.pointer {
		@apply absolute left-1/2 z-20 -translate-x-1/2;
		top: -4px;
	}

	.pointer-arrow {
		width: 20px;
		height: 18px;
		background: linear-gradient(180deg, #fde047 0%, #f59e0b 100%);
		clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
		filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
	}

	/* 휠 */
	.wheel {
		@apply relative h-full w-full;
		border-radius: 50%;
		overflow: hidden;
		border: 6px solid #8b4513;
	}

	/* 세그먼트 - 8칸 (45도씩) */
	.wheel-svg {
		@apply absolute inset-0 h-full w-full;
	}

	.segment-text {
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		pointer-events: none;
	}

	/* 중심 원 */
	.center-circle {
		@apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
		@apply flex items-center justify-center;
		width: clamp(50px, 15vw, 70px);
		height: clamp(50px, 15vw, 70px);
		border-radius: 50%;
		background: linear-gradient(180deg, #8b4513 0%, #5d4037 100%);
		border: 4px solid #d4a574;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
		z-index: 10;
	}

	.center-inner {
		font-size: clamp(24px, 6vw, 32px);
	}

	/* 컨트롤 섹션 */
	.control-section {
		@apply absolute left-1/2 -translate-x-1/2;
		@apply flex flex-col items-center gap-4;
		@apply w-full max-w-xs px-4;
		bottom: 10%;
	}

	.power-gauge {
		@apply relative h-10 w-full overflow-hidden rounded-full;
		background: linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%);
		border: 3px solid #5d4037;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.power-fill {
		@apply absolute top-0 left-0 h-full;
		background: linear-gradient(90deg, #22c55e 0%, #fbbf24 50%, #ef4444 100%);
		transition: width 0.05s linear;
		border-radius: 9999px;
	}

	.power-text {
		@apply absolute inset-0 flex items-center justify-center;
		@apply font-black text-white;
		font-size: clamp(14px, 4vw, 18px);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
	}

	/* 스핀 버튼 */
	.spin-button {
		@apply rounded-2xl px-10 py-5;
		@apply font-black text-white;
		font-size: clamp(20px, 5vw, 28px);
		border: none;
		cursor: pointer;
		user-select: none;
		touch-action: manipulation;
		transition:
			transform 0.1s,
			box-shadow 0.1s;
	}

	.spin-button.ready {
		background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
		border-bottom: 5px solid #b45309;
		box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
		animation: buttonPulse 1s ease-in-out infinite;
	}

	.spin-button.charging {
		background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
		border-bottom: 3px solid #b91c1c;
		box-shadow: 0 3px 15px rgba(239, 68, 68, 0.5);
		transform: scale(0.95);
	}

	@keyframes buttonPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.03);
		}
	}

	.button-charging {
		animation: chargeShake 0.1s linear infinite;
	}

	@keyframes chargeShake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-2px);
		}
		75% {
			transform: translateX(2px);
		}
	}

	/* 스핀 메시지 */
	.spin-message {
		@apply absolute left-1/2 -translate-x-1/2;
		bottom: 15%;
	}

	.spin-text {
		@apply font-black;
		font-size: clamp(24px, 6vw, 32px);
		color: #fbbf24;
		text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
		animation: spinTextPulse 0.5s ease-in-out infinite;
	}

	@keyframes spinTextPulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.05);
		}
	}

	/* 결과 표시 */
	.result-display {
		@apply absolute left-1/2 -translate-x-1/2;
		@apply flex flex-col items-center gap-2;
		bottom: 12%;
		animation: resultBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.result-icon {
		font-size: clamp(48px, 12vw, 64px);
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
	}

	.result-label {
		@apply font-black;
		font-size: clamp(32px, 8vw, 48px);
	}

	.result-display.success .result-label {
		color: #22c55e;
		text-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
	}

	.result-display.fail .result-label {
		color: #ef4444;
		text-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
	}

	.result-display.critical .result-label {
		color: #fbbf24;
		text-shadow:
			0 0 20px rgba(251, 191, 36, 0.7),
			0 0 40px rgba(251, 191, 36, 0.5);
		animation: criticalGlow 0.5s ease-in-out infinite alternate;
	}

	@keyframes criticalGlow {
		from {
			text-shadow: 0 0 20px rgba(251, 191, 36, 0.7);
		}
		to {
			text-shadow:
				0 0 40px rgba(251, 191, 36, 1),
				0 0 60px rgba(251, 191, 36, 0.7);
		}
	}

	@keyframes resultBounce {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* 스피닝 상태 효과 */
	.spinner-container.spinning .outer-ring {
		animation: ringPulse 0.3s ease-in-out infinite;
	}

	@keyframes ringPulse {
		0%,
		100% {
			box-shadow: 0 0 30px rgba(251, 191, 36, 0.3);
		}
		50% {
			box-shadow: 0 0 50px rgba(251, 191, 36, 0.6);
		}
	}
</style>
