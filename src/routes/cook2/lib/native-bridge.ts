/**
 * 네이티브 브릿지 유틸리티
 * - 앱(RN WebView)에서 실행 시 네이티브 기능 사용
 * - 웹 브라우저에서는 fallback 또는 무시
 */

// 타입 정의
declare global {
	interface Window {
		NativeBridge?: {
			haptic: (style?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => void;
			showRewardedAd: () => void;
		};
		ReactNativeWebView?: {
			postMessage: (message: string) => void;
		};
	}
}

/**
 * 네이티브 앱에서 실행 중인지 확인
 */
export function isNativeApp(): boolean {
	return typeof window !== 'undefined' && !!window.ReactNativeWebView;
}

/**
 * NativeBridge가 준비되었는지 확인
 */
export function isBridgeReady(): boolean {
	return typeof window !== 'undefined' && !!window.NativeBridge;
}

/**
 * 진동 피드백
 * @param style - 진동 스타일
 *   - light: 가벼운 터치
 *   - medium: 일반 터치 (기본값)
 *   - heavy: 강한 터치
 *   - success: 성공 알림
 *   - warning: 경고 알림
 *   - error: 에러 알림
 */
export function haptic(
	style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'medium'
): void {
	if (isBridgeReady()) {
		window.NativeBridge!.haptic(style);
	} else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
		// 웹 fallback (Vibration API)
		const duration = style === 'light' ? 10 : style === 'heavy' ? 50 : 25;
		navigator.vibrate(duration);
	}
}

/**
 * 리워드 광고 표시
 * @returns Promise<boolean> - 광고 시청 완료 여부
 */
export function showRewardedAd(): Promise<boolean> {
	return new Promise((resolve) => {
		if (!isBridgeReady()) {
			console.log('NativeBridge not available, skipping ad');
			// 개발/웹 환경에서는 바로 보상 지급
			resolve(true);
			return;
		}

		// 광고 보상 이벤트 리스너
		const handleReward = () => {
			cleanup();
			resolve(true);
		};

		// 광고 종료 이벤트 리스너 (보상 없이 종료)
		const handleClosed = () => {
			cleanup();
			// 이미 resolve되지 않았다면 false 반환
		};

		// 광고 에러 이벤트 리스너
		const handleError = (e: CustomEvent) => {
			console.error('Ad error:', e.detail?.message);
			cleanup();
			resolve(false);
		};

		// 광고 미준비 이벤트 리스너
		const handleNotReady = () => {
			console.log('Ad not ready');
			cleanup();
			resolve(false);
		};

		const cleanup = () => {
			window.removeEventListener('adRewardEarned', handleReward);
			window.removeEventListener('adClosed', handleClosed);
			window.removeEventListener('adError', handleError as EventListener);
			window.removeEventListener('adNotReady', handleNotReady);
		};

		// 이벤트 리스너 등록
		window.addEventListener('adRewardEarned', handleReward);
		window.addEventListener('adClosed', handleClosed);
		window.addEventListener('adError', handleError as EventListener);
		window.addEventListener('adNotReady', handleNotReady);

		// 광고 표시 요청
		window.NativeBridge!.showRewardedAd();

		// 30초 타임아웃
		setTimeout(() => {
			cleanup();
			resolve(false);
		}, 30000);
	});
}

/**
 * NativeBridge 준비 대기
 */
export function waitForBridge(timeout: number = 5000): Promise<boolean> {
	return new Promise((resolve) => {
		if (isBridgeReady()) {
			resolve(true);
			return;
		}

		const handleReady = () => {
			window.removeEventListener('NativeBridgeReady', handleReady);
			resolve(true);
		};

		window.addEventListener('NativeBridgeReady', handleReady);

		setTimeout(() => {
			window.removeEventListener('NativeBridgeReady', handleReady);
			resolve(isBridgeReady());
		}, timeout);
	});
}

/**
 * 리워드 광고 콜백 인터페이스
 */
export interface RewardedAdCallbacks {
	/** 광고 시청 완료 및 보상 획득 */
	onRewarded?: (reward: { type: string; amount: number }) => void;
	/** 광고 종료 (보상 없이) */
	onClosed?: () => void;
	/** 광고 에러 */
	onError?: (error: string) => void;
	/** 광고 미준비 */
	onNotReady?: () => void;
}

/**
 * 리워드 광고 표시 (콜백 버전)
 * @param callbacks - 광고 이벤트 콜백
 */
export function showRewardedAdWithCallback(callbacks: RewardedAdCallbacks): void {
	if (!isBridgeReady()) {
		console.log('NativeBridge not available, simulating reward');
		// 개발/웹 환경에서는 바로 보상 지급
		callbacks.onRewarded?.({ type: 'reward', amount: 1 });
		return;
	}

	let rewarded = false;

	// 광고 보상 이벤트 리스너
	const handleReward = (e: CustomEvent) => {
		rewarded = true;
		cleanup();
		haptic('success');
		callbacks.onRewarded?.({
			type: e.detail?.type || 'reward',
			amount: e.detail?.amount || 1
		});
	};

	// 광고 종료 이벤트 리스너
	const handleClosed = () => {
		cleanup();
		if (!rewarded) {
			callbacks.onClosed?.();
		}
	};

	// 광고 에러 이벤트 리스너
	const handleError = (e: CustomEvent) => {
		cleanup();
		haptic('error');
		callbacks.onError?.(e.detail?.message || 'Unknown error');
	};

	// 광고 미준비 이벤트 리스너
	const handleNotReady = () => {
		cleanup();
		callbacks.onNotReady?.();
	};

	const cleanup = () => {
		window.removeEventListener('adRewardEarned', handleReward as EventListener);
		window.removeEventListener('adClosed', handleClosed);
		window.removeEventListener('adError', handleError as EventListener);
		window.removeEventListener('adNotReady', handleNotReady);
	};

	// 이벤트 리스너 등록
	window.addEventListener('adRewardEarned', handleReward as EventListener);
	window.addEventListener('adClosed', handleClosed);
	window.addEventListener('adError', handleError as EventListener);
	window.addEventListener('adNotReady', handleNotReady);

	// 광고 표시 요청
	window.NativeBridge!.showRewardedAd();

	// 60초 타임아웃 (광고가 길 수 있음)
	setTimeout(() => {
		cleanup();
		if (!rewarded) {
			callbacks.onError?.('Timeout');
		}
	}, 60000);
}
