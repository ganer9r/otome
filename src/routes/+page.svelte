<script lang="ts">
	// 홈 페이지 로직 (추후 구현)
</script>

<div class="home-container">
	<!-- 상단 바 -->
	<div class="top-bar">
		<h1 class="game-title">Pi-Friends</h1>
		<button class="settings-btn">⚙</button>
	</div>

	<!-- 리소스 그룹 -->
	<div class="resource-group">
		<div class="resource-badge">
			<img src="/imgs/ui/coin.png" alt="coin" class="resource-icon" />
			<span class="resource-value">1,000</span>
		</div>
		<div class="resource-badge">
			<img src="/imgs/ui/star.png" alt="star" class="resource-icon" />
			<span class="resource-value">5</span>
		</div>
	</div>

	<!-- 캐릭터 영역 -->
	<div class="character-area">
		<div class="speech-bubble">오늘도 맛있는 요리를 만들어볼까요?</div>
		<img src="/imgs/character/chef.png" alt="character" class="character-img" />
	</div>

	<!-- 런 상태 -->
	<div class="run-status">
		<div class="run-info">
			<span class="run-badge">DAY 1</span>
			<span class="run-capital">자본금: 500원</span>
		</div>
	</div>

	<!-- 일일 미션 -->
	<div class="daily-missions">
		<div class="mission-item">
			<span class="mission-title">요리 3번 하기</span>
			<span class="mission-progress">1/3</span>
		</div>
	</div>

	<!-- 메인 액션 -->
	<div class="main-action">
		<a href="/cook2" class="play-button">🍳 요리하기</a>
	</div>

	<!-- 하단 메뉴 -->
	<div class="bottom-menu">
		<button class="menu-btn">
			<span class="menu-icon">🏠</span>
			<span class="menu-label">홈</span>
		</button>
		<button class="menu-btn">
			<span class="menu-icon">📖</span>
			<span class="menu-label">레시피</span>
		</button>
		<button class="menu-btn">
			<span class="menu-icon">🏪</span>
			<span class="menu-label">상점</span>
		</button>
		<button class="menu-btn">
			<span class="menu-icon">👤</span>
			<span class="menu-label">프로필</span>
		</button>
	</div>

	<!-- 플로팅 배틀 버튼 -->
	<button class="floating-battle">⚔</button>
</div>

<style lang="postcss">
	@reference '$styles/app.css';

	.home-container {
		@apply flex flex-col;
		@apply h-full w-full;
		@apply relative;
		background: linear-gradient(to bottom, #fff8e1, #ffecb3);
		max-width: 360px;
		margin: 0 auto;
	}

	/* 상단 바 */
	.top-bar {
		@apply flex items-center justify-between;
		@apply px-3 py-2;
	}

	.game-title {
		@apply font-bold;
		font-size: 24px;
		color: #5d4037;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
	}

	.settings-btn {
		@apply flex items-center justify-center;
		@apply rounded-full;
		width: 32px;
		height: 32px;
		font-size: 18px;
		background: rgba(255, 255, 255, 0.8);
		border: 2px solid #e8d4a8;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	/* 리소스 그룹 */
	.resource-group {
		@apply flex items-center gap-2;
		@apply px-3 py-1;
	}

	.resource-badge {
		@apply flex items-center gap-1;
		@apply px-2 py-1;
		@apply rounded-lg;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid #e8d4a8;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.resource-icon {
		width: 16px;
		height: 16px;
	}

	.resource-value {
		@apply font-bold;
		font-size: 12px;
		color: #5d4037;
	}

	/* 캐릭터 영역 */
	.character-area {
		@apply flex flex-col items-center;
		@apply flex-1;
		@apply px-4 py-2;
	}

	.speech-bubble {
		@apply px-4 py-2;
		@apply rounded-xl;
		@apply text-center;
		font-size: 13px;
		color: #5d4037;
		background: white;
		border: 2px solid #e8d4a8;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
		margin-bottom: 8px;
	}

	.speech-bubble::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 50%;
		transform: translateX(-50%);
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 8px solid white;
	}

	.character-img {
		width: 180px;
		height: 180px;
		object-fit: contain;
	}

	/* 런 상태 */
	.run-status {
		@apply px-3 py-2;
	}

	.run-info {
		@apply flex items-center gap-2;
		@apply px-3 py-2;
		@apply rounded-xl;
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid #ffb74d;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.run-badge {
		@apply px-2 py-0.5;
		@apply rounded-lg;
		@apply font-bold;
		font-size: 10px;
		background: linear-gradient(to bottom, #ff7043, #f4511e);
		color: white;
	}

	.run-capital {
		@apply font-bold;
		font-size: 12px;
		color: #e65100;
	}

	/* 일일 미션 */
	.daily-missions {
		@apply px-3 py-2;
	}

	.mission-item {
		@apply flex items-center justify-between;
		@apply px-3 py-2;
		@apply rounded-lg;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid #e8d4a8;
	}

	.mission-title {
		font-size: 11px;
		color: #5d4037;
	}

	.mission-progress {
		@apply font-bold;
		font-size: 10px;
		color: #ff7043;
	}

	/* 메인 액션 */
	.main-action {
		@apply flex justify-center;
		@apply px-4 py-3;
	}

	.play-button {
		@apply flex items-center justify-center;
		@apply px-6 py-3;
		@apply rounded-xl;
		@apply font-bold;
		@apply no-underline;
		max-width: 200px;
		width: 100%;
		font-size: 16px;
		background: linear-gradient(to bottom, #ff7043, #f4511e);
		color: white;
		border: 3px solid #e64a19;
		box-shadow: 0 4px 0 #bf360c;
		animation: pulse 2s ease-in-out infinite;
	}

	.play-button:active {
		box-shadow: 0 2px 0 #bf360c;
		transform: translateY(2px);
	}

	/* 하단 메뉴 */
	.bottom-menu {
		@apply flex items-center justify-around;
		@apply px-2 py-2;
		background: white;
		border-top: 1px solid #e8d4a8;
	}

	.menu-btn {
		@apply flex flex-col items-center;
		@apply px-3 py-1;
		background: transparent;
		border: none;
	}

	.menu-icon {
		font-size: 14px;
	}

	.menu-label {
		font-size: 10px;
		color: #8d6e63;
	}

	/* 플로팅 배틀 버튼 */
	.floating-battle {
		@apply fixed;
		@apply flex items-center justify-center;
		@apply rounded-full;
		top: 90px;
		right: 12px;
		width: 36px;
		height: 36px;
		font-size: 18px;
		background: linear-gradient(to bottom, #ff5252, #d32f2f);
		color: white;
		border: 2px solid #b71c1c;
		box-shadow: 0 3px 0 #b71c1c;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
			box-shadow:
				0 4px 0 #bf360c,
				0 0 20px rgba(255, 112, 67, 0.5);
		}
	}
</style>
