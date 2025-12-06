const IS_DEV = process.env.APP_ENV === 'development';

export default {
	expo: {
		name: IS_DEV ? '[DEV] 흑백의 쉐프' : '흑백의 쉐프',
		slug: 'otome-cooking',
		version: '1.0.0',
		orientation: 'portrait',
		icon: IS_DEV ? './assets/icon-dev.png' : './assets/icon.png',
		userInterfaceStyle: 'light',
		newArchEnabled: true,
		splash: {
			image: './assets/splash-icon.png',
			resizeMode: 'contain',
			backgroundColor: '#fff8e1'
		},
		ios: {
			supportsTablet: true,
			bundleIdentifier: IS_DEV ? 'com.ganer.cooking.dev' : 'com.ganer.cooking'
		},
		android: {
			adaptiveIcon: {
				foregroundImage: IS_DEV ? './assets/adaptive-icon-dev.png' : './assets/adaptive-icon.png',
				backgroundColor: IS_DEV ? '#ffcccc' : '#fff8e1'
			},
			package: IS_DEV ? 'com.ganer.cooking.dev' : 'com.ganer.cooking',
			edgeToEdgeEnabled: true,
			predictiveBackGestureEnabled: false,
			googleServicesFile: './google-services.json'
		},
		web: {
			favicon: './assets/favicon.png'
		},
		plugins: [
			[
				'expo-build-properties',
				{
					android: {
						// R8/ProGuard shrinking 비활성화
						enableProguardInReleaseBuilds: false,
						// 미사용 리소스 제거 비활성화
						enableShrinkResourcesInReleaseBuilds: false,
						// PNG Crunch 비활성화 (아이콘 품질 유지)
						enablePngCrunchInReleaseBuilds: false,
						// 개발 환경에서 HTTP 허용
						usesCleartextTraffic: IS_DEV
					}
				}
			],
			// Adaptive Icon inset 적용
			'./plugins/withAdaptiveIconInset.js',
			// FCM 푸시 알림
			[
				'expo-notifications',
				{
					icon: './assets/icon.png',
					color: '#ffffff'
				}
			],
			// AdMob 광고
			[
				'react-native-google-mobile-ads',
				{
					androidAppId: IS_DEV
						? 'ca-app-pub-3940256099942544~3347511713'
						: 'ca-app-pub-6415089322279122~7564837233'
				}
			]
		],
		extra: {
			isDev: IS_DEV
		}
	}
};
