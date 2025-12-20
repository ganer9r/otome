import { Howl, Howler } from 'howler';

export type BgmKey = 'cook';
export type SfxKey = 'button' | 'click';

interface SoundConfig {
	src: string;
	loop?: boolean;
}

const BGM_CONFIG: Record<BgmKey, SoundConfig> = {
	cook: { src: '/sounds/bgm/cook.mp3', loop: true }
};

const SFX_CONFIG: Record<SfxKey, SoundConfig> = {
	button: { src: '/sounds/sfx/button.mp3' },
	click: { src: '/sounds/sfx/click.mp3' }
};

// 볼륨 최대값 (유저 100% 설정 시 실제 볼륨)
const BGM_MAX_VOLUME = 0.3; // 30%
const SFX_MAX_VOLUME = 1.0; // 100%

// localStorage 키
const STORAGE_KEY = 'sound_settings';

interface SoundSettings {
	bgmVolume: number; // 0~100 (유저 설정값)
	sfxVolume: number; // 0~100 (유저 설정값)
	muted: boolean;
}

const DEFAULT_SETTINGS: SoundSettings = {
	bgmVolume: 100,
	sfxVolume: 100,
	muted: false
};

class SoundManager {
	private bgmSounds: Map<BgmKey, Howl> = new Map();
	private sfxSounds: Map<SfxKey, Howl> = new Map();
	private currentBgm: BgmKey | null = null;
	private isUnlocked = false;
	private pendingBgm: BgmKey | null = null;
	private settings: SoundSettings;

	constructor() {
		this.settings = this.loadSettings();
		this.preloadAll();
		this.setupUnlock();
		this.applySettings();
	}

	/**
	 * 설정 로드 (localStorage)
	 */
	private loadSettings(): SoundSettings {
		if (typeof window === 'undefined') return DEFAULT_SETTINGS;
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
			}
		} catch (e) {
			console.error('[SoundManager] Failed to load settings:', e);
		}
		return DEFAULT_SETTINGS;
	}

	/**
	 * 설정 저장 (localStorage)
	 */
	private saveSettings() {
		if (typeof window === 'undefined') return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
		} catch (e) {
			console.error('[SoundManager] Failed to save settings:', e);
		}
	}

	/**
	 * 설정 적용 (볼륨, 음소거)
	 */
	private applySettings() {
		this.applyBgmVolume();
		this.applySfxVolume();
		Howler.mute(this.settings.muted);
	}

	/**
	 * BGM 실제 볼륨 적용
	 */
	private applyBgmVolume() {
		const realVolume = (this.settings.bgmVolume / 100) * BGM_MAX_VOLUME;
		for (const sound of this.bgmSounds.values()) {
			sound.volume(realVolume);
		}
	}

	/**
	 * SFX 실제 볼륨 적용
	 */
	private applySfxVolume() {
		const realVolume = (this.settings.sfxVolume / 100) * SFX_MAX_VOLUME;
		for (const sound of this.sfxSounds.values()) {
			sound.volume(realVolume);
		}
	}

	/**
	 * 모든 사운드 preload
	 */
	private preloadAll() {
		const bgmRealVolume = (this.settings.bgmVolume / 100) * BGM_MAX_VOLUME;
		const sfxRealVolume = (this.settings.sfxVolume / 100) * SFX_MAX_VOLUME;

		// BGM preload
		for (const [key, config] of Object.entries(BGM_CONFIG)) {
			const howl = new Howl({
				src: [config.src],
				loop: config.loop ?? false,
				volume: bgmRealVolume,
				preload: true
			});
			this.bgmSounds.set(key as BgmKey, howl);
		}

		// SFX preload
		for (const [key, config] of Object.entries(SFX_CONFIG)) {
			const howl = new Howl({
				src: [config.src],
				loop: false,
				volume: sfxRealVolume,
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
	 * BGM 볼륨 설정 (유저 설정값 0~100)
	 */
	setBgmVolume(volume: number) {
		this.settings.bgmVolume = Math.max(0, Math.min(100, volume));
		this.applyBgmVolume();
		this.saveSettings();
	}

	/**
	 * SFX 볼륨 설정 (유저 설정값 0~100)
	 */
	setSfxVolume(volume: number) {
		this.settings.sfxVolume = Math.max(0, Math.min(100, volume));
		this.applySfxVolume();
		this.saveSettings();
	}

	/**
	 * 음소거 설정
	 */
	setMuted(muted: boolean) {
		this.settings.muted = muted;
		Howler.mute(muted);
		this.saveSettings();
	}

	/**
	 * BGM 볼륨 가져오기 (유저 설정값 0~100)
	 */
	getBgmVolume(): number {
		return this.settings.bgmVolume;
	}

	/**
	 * SFX 볼륨 가져오기 (유저 설정값 0~100)
	 */
	getSfxVolume(): number {
		return this.settings.sfxVolume;
	}

	/**
	 * 음소거 상태 가져오기
	 */
	isMuted(): boolean {
		return this.settings.muted;
	}
}

// 싱글톤 인스턴스
let instance: SoundManager | null = null;

// Dummy SoundManager for SSR
const dummySoundManager = {
	playBgm: () => {},
	stopBgm: () => {},
	playSfx: () => {},
	setBgmVolume: () => {},
	setSfxVolume: () => {},
	setMuted: () => {},
	getBgmVolume: () => 100,
	getSfxVolume: () => 100,
	isMuted: () => false
} as unknown as SoundManager;

export function getSoundManager(): SoundManager {
	// SSR에서는 dummy 반환
	if (typeof window === 'undefined') {
		return dummySoundManager;
	}
	if (!instance) {
		instance = new SoundManager();
	}
	return instance;
}

export { SoundManager };
