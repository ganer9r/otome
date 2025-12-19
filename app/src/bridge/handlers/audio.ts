import { Audio, AVPlaybackStatus } from 'expo-av';

export type SoundEffect = 'success' | 'fail' | 'click' | 'cooking' | 'complete';
export type BGMTrack = 'menu' | 'cooking' | 'story';

/**
 * 오디오 매니저
 * - BGM과 효과음 동시 재생 지원
 * - BGM: 1개만 재생 (교체 시 페이드아웃)
 * - 효과음: 여러 개 동시 재생 가능
 */
class AudioManager {
	private bgm: Audio.Sound | null = null;
	private bgmVolume = 0.5;
	private effectVolume = 0.8;
	private isMuted = false;
	private isInitialized = false;

	// 효과음 풀 (동시 재생 위해 여러 인스턴스)
	private effectPool: Map<string, Audio.Sound[]> = new Map();

	/**
	 * 오디오 시스템 초기화
	 * 앱 시작 시 한 번 호출
	 */
	async init(): Promise<void> {
		if (this.isInitialized) return;

		try {
			await Audio.setAudioModeAsync({
				playsInSilentModeIOS: true, // iOS 무음모드에서도 재생
				staysActiveInBackground: false, // 백그라운드 재생 안함
				shouldDuckAndroid: true // 다른 앱 오디오와 믹싱
			});
			this.isInitialized = true;
			console.log('[AudioManager] Initialized');
		} catch (error) {
			console.error('[AudioManager] Init failed:', error);
		}
	}

	/**
	 * BGM 재생
	 * 기존 BGM이 있으면 교체
	 */
	async playBGM(uri: string, loop = true): Promise<void> {
		if (this.isMuted) return;

		try {
			// 기존 BGM 정리
			if (this.bgm) {
				await this.bgm.stopAsync();
				await this.bgm.unloadAsync();
				this.bgm = null;
			}

			const { sound } = await Audio.Sound.createAsync(
				{ uri },
				{
					isLooping: loop,
					volume: this.bgmVolume,
					shouldPlay: true
				}
			);

			this.bgm = sound;
			console.log('[AudioManager] BGM playing:', uri);
		} catch (error) {
			console.error('[AudioManager] BGM play failed:', error);
		}
	}

	/**
	 * BGM 정지
	 */
	async stopBGM(): Promise<void> {
		if (this.bgm) {
			try {
				await this.bgm.stopAsync();
				await this.bgm.unloadAsync();
				this.bgm = null;
				console.log('[AudioManager] BGM stopped');
			} catch (error) {
				console.error('[AudioManager] BGM stop failed:', error);
			}
		}
	}

	/**
	 * BGM 일시정지
	 */
	async pauseBGM(): Promise<void> {
		if (this.bgm) {
			try {
				await this.bgm.pauseAsync();
			} catch (error) {
				console.error('[AudioManager] BGM pause failed:', error);
			}
		}
	}

	/**
	 * BGM 재개
	 */
	async resumeBGM(): Promise<void> {
		if (this.bgm && !this.isMuted) {
			try {
				await this.bgm.playAsync();
			} catch (error) {
				console.error('[AudioManager] BGM resume failed:', error);
			}
		}
	}

	/**
	 * 효과음 재생
	 * 동시에 여러 효과음 재생 가능
	 */
	async playEffect(uri: string): Promise<void> {
		if (this.isMuted) return;

		try {
			const { sound } = await Audio.Sound.createAsync(
				{ uri },
				{
					volume: this.effectVolume,
					shouldPlay: true
				}
			);

			// 재생 완료 시 자동 정리
			sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
				if (status.isLoaded && status.didJustFinish) {
					sound.unloadAsync();
				}
			});

			console.log('[AudioManager] Effect playing:', uri);
		} catch (error) {
			console.error('[AudioManager] Effect play failed:', error);
		}
	}

	/**
	 * BGM 볼륨 설정 (0.0 ~ 1.0)
	 */
	async setBGMVolume(volume: number): Promise<void> {
		this.bgmVolume = Math.max(0, Math.min(1, volume));
		if (this.bgm) {
			try {
				await this.bgm.setVolumeAsync(this.bgmVolume);
			} catch (error) {
				console.error('[AudioManager] Set BGM volume failed:', error);
			}
		}
	}

	/**
	 * 효과음 볼륨 설정 (0.0 ~ 1.0)
	 */
	setEffectVolume(volume: number): void {
		this.effectVolume = Math.max(0, Math.min(1, volume));
	}

	/**
	 * 전체 음소거 토글
	 */
	async setMuted(muted: boolean): Promise<void> {
		this.isMuted = muted;
		if (this.bgm) {
			try {
				if (muted) {
					await this.bgm.pauseAsync();
				} else {
					await this.bgm.playAsync();
				}
			} catch (error) {
				console.error('[AudioManager] Set muted failed:', error);
			}
		}
	}

	/**
	 * 음소거 상태 반환
	 */
	getMuted(): boolean {
		return this.isMuted;
	}

	/**
	 * 현재 볼륨 설정 반환
	 */
	getVolumes(): { bgm: number; effect: number } {
		return {
			bgm: this.bgmVolume,
			effect: this.effectVolume
		};
	}

	/**
	 * 모든 오디오 정리
	 * 앱 종료 시 호출
	 */
	async cleanup(): Promise<void> {
		if (this.bgm) {
			await this.bgm.unloadAsync();
			this.bgm = null;
		}
		this.effectPool.clear();
		console.log('[AudioManager] Cleanup complete');
	}
}

// 싱글톤 인스턴스
export const audioManager = new AudioManager();

/**
 * 브릿지 핸들러용 함수들
 */
export async function handlePlayBGM(uri: string, loop?: boolean): Promise<{ success: boolean }> {
	await audioManager.playBGM(uri, loop);
	return { success: true };
}

export async function handleStopBGM(): Promise<{ success: boolean }> {
	await audioManager.stopBGM();
	return { success: true };
}

export async function handlePauseBGM(): Promise<{ success: boolean }> {
	await audioManager.pauseBGM();
	return { success: true };
}

export async function handleResumeBGM(): Promise<{ success: boolean }> {
	await audioManager.resumeBGM();
	return { success: true };
}

export async function handlePlayEffect(uri: string): Promise<{ success: boolean }> {
	await audioManager.playEffect(uri);
	return { success: true };
}

export async function handleSetBGMVolume(volume: number): Promise<{ success: boolean }> {
	await audioManager.setBGMVolume(volume);
	return { success: true };
}

export async function handleSetEffectVolume(volume: number): Promise<{ success: boolean }> {
	audioManager.setEffectVolume(volume);
	return { success: true };
}

export async function handleSetMuted(
	muted: boolean
): Promise<{ success: boolean; muted: boolean }> {
	await audioManager.setMuted(muted);
	return { success: true, muted };
}

export function handleGetAudioStatus(): {
	muted: boolean;
	bgmVolume: number;
	effectVolume: number;
} {
	const volumes = audioManager.getVolumes();
	return {
		muted: audioManager.getMuted(),
		bgmVolume: volumes.bgm,
		effectVolume: volumes.effect
	};
}
