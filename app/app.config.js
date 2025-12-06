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
			predictiveBackGestureEnabled: false
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
						enablePngCrunchInReleaseBuilds: false
					}
				}
			],
			// Adaptive Icon inset 0% (원본 100% 표시)
			'./plugins/withAdaptiveIconInset.js'
		],
		extra: {
			isDev: IS_DEV
		}
	}
};
