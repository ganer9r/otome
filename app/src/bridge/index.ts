/**
 * 브릿지 모듈
 *
 * 웹(WebView) ↔ 앱(RN) 통신을 담당
 * Promise 기반 양방향 통신 지원
 */
import { useCallback } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { handleHaptic, HapticStyle } from './handlers/haptics';
import { useAdsHandler } from './handlers/ads';

// 스크립트 export
export { bridgeScript } from './script';

// 타입 export
export type { HapticStyle } from './handlers/haptics';

/**
 * 웹 → 앱 메시지 타입
 */
interface BridgeMessage {
	type: 'haptic' | 'showRewardedAd' | 'showInterstitialAd';
	callId: number;
	payload?: {
		style?: HapticStyle;
	};
}

/**
 * 웹으로 결과 전송
 */
function sendResult(webViewRef: React.RefObject<WebView | null>, callId: number, result: unknown) {
	webViewRef.current?.injectJavaScript(`
		window.NativeBridge._resolve(${callId}, ${JSON.stringify(result)});
		true;
	`);
}

/**
 * 웹으로 에러 전송
 */
function sendError(webViewRef: React.RefObject<WebView | null>, callId: number, error: string) {
	webViewRef.current?.injectJavaScript(`
		window.NativeBridge._reject(${callId}, ${JSON.stringify(error)});
		true;
	`);
}

/**
 * 브릿지 훅
 * - 웹에서 오는 메시지 처리
 * - 광고, 진동 등 핸들러 연결
 * - Promise 기반 양방향 통신
 */
export function useBridge(webViewRef: React.RefObject<WebView | null>) {
	const { showRewardedAd, showInterstitialAd } = useAdsHandler();

	const handleMessage = useCallback(
		async (event: WebViewMessageEvent) => {
			try {
				const message: BridgeMessage = JSON.parse(event.nativeEvent.data);
				const { type, callId, payload } = message;

				switch (type) {
					case 'haptic':
						handleHaptic(payload?.style || 'medium');
						sendResult(webViewRef, callId, { success: true });
						break;

					case 'showRewardedAd': {
						const result = await showRewardedAd();
						sendResult(webViewRef, callId, result);
						break;
					}

					case 'showInterstitialAd': {
						const result = await showInterstitialAd();
						sendResult(webViewRef, callId, result);
						break;
					}

					default:
						console.log('Unknown bridge message:', type);
						sendError(webViewRef, callId, `Unknown message type: ${type}`);
				}
			} catch (error) {
				console.error('Failed to parse bridge message:', error);
			}
		},
		[webViewRef, showRewardedAd, showInterstitialAd]
	);

	return { handleMessage };
}
