import { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import * as Haptics from 'expo-haptics';

const GAME_URL = 'https://otome.pages.dev/cook2';

/**
 * 웹 → 네이티브 브릿지 메시지 타입
 */
interface BridgeMessage {
	type: 'haptic' | 'showRewardedAd';
	payload?: {
		style?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
	};
}

export default function App() {
	const webViewRef = useRef<WebView>(null);

	// 진동 실행
	const triggerHaptic = async (style: string) => {
		switch (style) {
			case 'light':
				await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				break;
			case 'medium':
				await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
				break;
			case 'heavy':
				await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
				break;
			case 'success':
				await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
				break;
			case 'warning':
				await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
				break;
			case 'error':
				await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
				break;
			default:
				await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		}
	};

	// 리워드 광고 표시 (TODO: 실제 AdMob 연동)
	const showRewardedAd = async () => {
		console.log('Rewarded ad requested - TODO: implement AdMob');
		// 테스트용: 바로 보상 지급
		webViewRef.current?.injectJavaScript(`
      window.dispatchEvent(new CustomEvent('adRewardEarned', { 
        detail: { type: 'test', amount: 1 }
      }));
      true;
    `);
	};

	// 웹에서 메시지 수신
	const handleMessage = (event: WebViewMessageEvent) => {
		try {
			const message: BridgeMessage = JSON.parse(event.nativeEvent.data);

			switch (message.type) {
				case 'haptic':
					triggerHaptic(message.payload?.style || 'medium');
					break;
				case 'showRewardedAd':
					showRewardedAd();
					break;
				default:
					console.log('Unknown message type:', message.type);
			}
		} catch (error) {
			console.error('Failed to parse message:', error);
		}
	};

	// 웹에 브릿지 주입
	const injectedJavaScript = `
    (function() {
      // 이미 주입되었는지 확인
      if (window.NativeBridge) return;

      window.NativeBridge = {
        // 진동
        haptic: function(style) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'haptic',
            payload: { style: style || 'medium' }
          }));
        },
        // 리워드 광고 표시
        showRewardedAd: function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'showRewardedAd'
          }));
        }
      };

      // 브릿지 준비 완료 이벤트
      window.dispatchEvent(new Event('NativeBridgeReady'));
      console.log('NativeBridge injected');
    })();
    true;
  `;

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container} edges={['top']}>
				<StatusBar style="light" />
				<WebView
					ref={webViewRef}
					source={{ uri: GAME_URL }}
					style={styles.webview}
					onMessage={handleMessage}
					injectedJavaScript={injectedJavaScript}
					// 성능 최적화
					javaScriptEnabled={true}
					domStorageEnabled={true}
					// 줌 비활성화
					scalesPageToFit={false}
					// 바운스 비활성화
					bounces={false}
					// 스크롤 설정
					scrollEnabled={true}
					// 캐시 설정
					cacheEnabled={true}
					// 미디어 자동재생
					mediaPlaybackRequiresUserAction={false}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000'
	},
	webview: {
		flex: 1
	}
});
