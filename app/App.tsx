import { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useNotifications } from './src/hooks/useNotifications';
import { useBridge, bridgeScript } from './src/bridge';

const GAME_URL = __DEV__ ? 'http://192.168.0.53:5174/cook2' : 'https://otome.pages.dev/cook2';

export default function App() {
	const webViewRef = useRef<WebView>(null);

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
