import { useEffect, useCallback, useRef } from 'react';
import {
	RewardedAd,
	RewardedAdEventType,
	InterstitialAd,
	AdEventType
} from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../../config/ads';

// 광고 인스턴스 생성
const rewardedAd = RewardedAd.createForAdRequest(AD_CONFIG.unitIds.rewarded);
const interstitialAd = InterstitialAd.createForAdRequest(AD_CONFIG.unitIds.interstitial);

interface AdResult {
	success: boolean;
	type?: string;
	amount?: number;
	error?: string;
}

export function useAdsHandler() {
	// 리워드 광고 Promise resolver 저장
	const rewardedResolverRef = useRef<((result: AdResult) => void) | null>(null);
	const interstitialResolverRef = useRef<((result: AdResult) => void) | null>(null);

	// 광고 로드 및 이벤트 설정
	useEffect(() => {
		const rewardedLoadedUnsub = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
			console.log('Rewarded ad loaded');
		});

		const rewardedEarnedUnsub = rewardedAd.addAdEventListener(
			RewardedAdEventType.EARNED_REWARD,
			(reward) => {
				console.log('Reward earned:', reward);
				if (rewardedResolverRef.current) {
					rewardedResolverRef.current({
						success: true,
						type: reward.type,
						amount: reward.amount
					});
					rewardedResolverRef.current = null;
				}
			}
		);

		const rewardedClosedUnsub = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
			console.log('Rewarded ad closed');
			// 보상 없이 닫힌 경우 (이미 resolve 됐으면 무시됨)
			if (rewardedResolverRef.current) {
				rewardedResolverRef.current({ success: false, error: 'Ad closed without reward' });
				rewardedResolverRef.current = null;
			}
			rewardedAd.load();
		});

		const interstitialLoadedUnsub = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
			console.log('Interstitial ad loaded');
		});

		const interstitialClosedUnsub = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
			console.log('Interstitial ad closed');
			if (interstitialResolverRef.current) {
				interstitialResolverRef.current({ success: true });
				interstitialResolverRef.current = null;
			}
			interstitialAd.load();
		});

		rewardedAd.load();
		interstitialAd.load();

		return () => {
			rewardedLoadedUnsub();
			rewardedEarnedUnsub();
			rewardedClosedUnsub();
			interstitialLoadedUnsub();
			interstitialClosedUnsub();
		};
	}, []);

	const showRewardedAd = useCallback((): Promise<AdResult> => {
		return new Promise((resolve) => {
			if (rewardedAd.loaded) {
				rewardedResolverRef.current = resolve;
				rewardedAd.show();
			} else {
				console.log('Rewarded ad not loaded yet');
				rewardedAd.load();
				resolve({ success: false, error: 'Ad not loaded' });
			}
		});
	}, []);

	const showInterstitialAd = useCallback((): Promise<AdResult> => {
		return new Promise((resolve) => {
			if (interstitialAd.loaded) {
				interstitialResolverRef.current = resolve;
				interstitialAd.show();
			} else {
				console.log('Interstitial ad not loaded yet');
				interstitialAd.load();
				resolve({ success: false, error: 'Ad not loaded' });
			}
		});
	}, []);

	return { showRewardedAd, showInterstitialAd };
}
