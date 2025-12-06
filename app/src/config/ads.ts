import { TestIds } from 'react-native-google-mobile-ads';

const IS_DEV = __DEV__;

// AdMob 광고 ID 설정
export const AD_CONFIG = {
	// 앱 ID (app.config.js에서 설정됨)
	appId: {
		dev: 'ca-app-pub-3940256099942544~3347511713',
		prod: 'ca-app-pub-6415089322279122~7564837233'
	},

	// 광고 단위 ID
	unitIds: {
		rewarded: IS_DEV ? TestIds.REWARDED : 'ca-app-pub-6415089322279122/6720968357',
		interstitial: IS_DEV ? TestIds.INTERSTITIAL : 'ca-app-pub-6415089322279122/8034050027'
	}
};
