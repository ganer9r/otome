import { useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import {
	getCrashlytics,
	setCrashlyticsCollectionEnabled,
	crash
} from '@react-native-firebase/crashlytics';
import * as NavigationBar from 'expo-navigation-bar';
import { useNotifications } from './src/hooks/useNotifications';
import { useBridge, bridgeScript } from './src/bridge';

const GAME_URL = __DEV__ ? 'http://192.168.0.13:5174/cook2' : 'https://otome.pages.dev/cook2';

export default function App() {
	const webViewRef = useRef<WebView>(null);

	// Firebase 초기화
	useEffect(() => {
		const crashlyticsInstance = getCrashlytics();
		const analyticsInstance = getAnalytics();

		// Crashlytics 활성화
		setCrashlyticsCollectionEnabled(crashlyticsInstance, true);

		// Analytics: 앱 시작 이벤트
		logEvent(analyticsInstance, 'app_open');

		// Android: 네비게이션 바 숨김 (immersive mode)
		if (Platform.OS === 'android') {
			NavigationBar.setVisibilityAsync('hidden');
			NavigationBar.setBehaviorAsync('overlay-swipe');
		}
	}, []);

	useNotifications();
	const { handleMessage } = useBridge(webViewRef);

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container} edges={['top']}>
				<StatusBar style="light" />
				<WebView
					ref={webViewRef}
					source={{ uri: GAME_URL }}
					style={styles.webview}
					onMessage={handleMessage}
					injectedJavaScript={bridgeScript}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					scalesPageToFit={false}
					bounces={false}
					scrollEnabled={true}
					cacheEnabled={true}
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
