import { Howl, Howler } from 'howler';

export type BgmKey = 'cook';
export type SfxKey = 'click';

interface SoundConfig {
	src: string;
	loop?: boolean;
	volume?: number;
}

const BGM_CONFIG: Record<BgmKey, SoundConfig> = {
	cook: { src: '/sounds/bgm/cook.mp3', loop: true, volume: 0.2 }
};

const SFX_CONFIG: Record<SfxKey, SoundConfig> = {
	click: { src: '/sounds/sfx/click.mp3', volume: 0.7 }
};

class SoundManager {
	private bgmSounds: Map<BgmKey, Howl> = new Map();
	private sfxSounds: Map<SfxKey, Howl> = new Map();
	private currentBgm: BgmKey | null = null;
	private isUnlocked = false;
	private pendingBgm: BgmKey | null = null;

	constructor() {
		this.preloadAll();
		this.setupUnlock();
	}

	/**
	 * 모든 사운드 preload
	 */
	private preloadAll() {
		// BGM preload
		for (const [key, config] of Object.entries(BGM_CONFIG)) {
			const howl = new Howl({
				src: [config.src],
				loop: config.loop ?? false,
				volume: config.volume ?? 1,
				preload: true
			});
			this.bgmSounds.set(key as BgmKey, howl);
		}

		// SFX preload
		for (const [key, config] of Object.entries(SFX_CONFIG)) {
			const howl = new Howl({
				src: [config.src],
				loop: false,
				volume: config.volume ?? 1,
				preload: true
			});
			this.sfxSounds.set(key as SfxKey, howl);
		}
	}

	/**
	 * 첫 터치/클릭 시 AudioContext unlock
	 */
	private setupUnlock() {
		if (typeof window === 'undefined') return;

		const unlock = () => {
			if (this.isUnlocked) return;

			// Howler AudioContext resume
			const ctx = Howler.ctx;
			if (ctx && ctx.state === 'suspended') {
				ctx.resume();
			}

			this.isUnlocked = true;
			console.log('[SoundManager] Audio unlocked');

			// 대기 중인 BGM 재생
			if (this.pendingBgm) {
				this.playBgm(this.pendingBgm);
				this.pendingBgm = null;
			}

			// 이벤트 리스너 제거
			document.removeEventListener('touchstart', unlock);
			document.removeEventListener('click', unlock);
		};

		document.addEventListener('touchstart', unlock, { once: true });
		document.addEventListener('click', unlock, { once: true });
	}

	/**
	 * BGM 재생
	 */
	playBgm(key: BgmKey) {
		// 아직 unlock 안 됨 → 대기
		if (!this.isUnlocked) {
			this.pendingBgm = key;
			console.log('[SoundManager] BGM pending:', key);
			return;
		}

		// 이미 같은 BGM 재생 중
		if (this.currentBgm === key) return;

		// 기존 BGM 정지
		if (this.currentBgm) {
			const prevSound = this.bgmSounds.get(this.currentBgm);
			prevSound?.stop();
		}

		// 새 BGM 재생
		const sound = this.bgmSounds.get(key);
		if (sound) {
			sound.play();
			this.currentBgm = key;
			console.log('[SoundManager] BGM playing:', key);
		}
	}

	/**
	 * BGM 정지
	 */
	stopBgm() {
		if (this.currentBgm) {
			const sound = this.bgmSounds.get(this.currentBgm);
			sound?.stop();
			this.currentBgm = null;
		}
		this.pendingBgm = null;
	}

	/**
	 * 효과음 재생
	 */
	playSfx(key: SfxKey) {
		if (!this.isUnlocked) return;

		const sound = this.sfxSounds.get(key);
		if (sound) {
			sound.play();
		}
	}

	/**
	 * BGM 볼륨 조절
	 */
	setBgmVolume(volume: number) {
		for (const sound of this.bgmSounds.values()) {
			sound.volume(volume);
		}
	}

	/**
	 * SFX 볼륨 조절
	 */
	setSfxVolume(volume: number) {
		for (const sound of this.sfxSounds.values()) {
			sound.volume(volume);
		}
	}

	/**
	 * 전체 음소거
	 */
	mute(muted: boolean) {
		Howler.mute(muted);
	}
}

// 싱글톤 인스턴스
let instance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
	if (!instance) {
		instance = new SoundManager();
	}
	return instance;
}

export { SoundManager };
