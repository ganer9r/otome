/**
 * 네이티브 브릿지 유틸리티
 * - 앱(RN WebView)에서 실행 시 네이티브 기능 사용
 * - 웹 브라우저에서는 fallback 또는 무시
 */

// 타입 정의
interface AdResult {
	success: boolean;
	type?: string;
	amount?: number;
	error?: string;
}

declare global {
	interface Window {
		NativeBridge?: {
			haptic: (
				style?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'
			) => Promise<{ success: boolean }>;
			showRewardedAd: () => Promise<AdResult>;
			showInterstitialAd: () => Promise<AdResult>;
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
export async function haptic(
	style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'medium'
): Promise<void> {
	if (isBridgeReady()) {
		await window.NativeBridge!.haptic(style);
	} else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
		// 웹 fallback (Vibration API)
		const duration = style === 'light' ? 10 : style === 'heavy' ? 50 : 25;
		navigator.vibrate(duration);
	}
}

/**
 * 리워드 광고 표시
 * @returns Promise<AdResult> - 광고 결과
 */
export async function showRewardedAd(): Promise<AdResult> {
	if (!isBridgeReady()) {
		console.log('NativeBridge not available, skipping ad');
		// 개발/웹 환경에서는 바로 보상 지급
		return { success: true, type: 'dev', amount: 1 };
	}

	return await window.NativeBridge!.showRewardedAd();
}

/**
 * 전면 광고 표시
 * @returns Promise<AdResult> - 광고 결과
 */
export async function showInterstitialAd(): Promise<AdResult> {
	if (!isBridgeReady()) {
		console.log('NativeBridge not available, skipping interstitial ad');
		return { success: true };
	}

	return await window.NativeBridge!.showInterstitialAd();
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

// AdResult 타입 export
export type { AdResult };
