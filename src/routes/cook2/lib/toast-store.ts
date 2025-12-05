import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
}

const { subscribe, update } = writable<Toast[]>([]);

export const toastStore = {
	subscribe,
	/**
	 * 토스트 추가
	 */
	show: (message: string, type: Toast['type'] = 'info', duration = 2000) => {
		const id = crypto.randomUUID();
		const toast: Toast = { id, message, type, duration };

		update((toasts) => [...toasts, toast]);

		// 자동 제거
		if (duration > 0) {
			setTimeout(() => {
				update((toasts) => toasts.filter((t) => t.id !== id));
			}, duration);
		}

		return id;
	},
	/**
	 * 성공 토스트
	 */
	success: (message: string, duration = 2000) => {
		return toastStore.show(message, 'success', duration);
	},
	/**
	 * 에러 토스트
	 */
	error: (message: string, duration = 2500) => {
		return toastStore.show(message, 'error', duration);
	},
	/**
	 * 경고 토스트
	 */
	warning: (message: string, duration = 2000) => {
		return toastStore.show(message, 'warning', duration);
	},
	/**
	 * 정보 토스트
	 */
	info: (message: string, duration = 2000) => {
		return toastStore.show(message, 'info', duration);
	},
	/**
	 * 토스트 제거
	 */
	dismiss: (id: string) => {
		update((toasts) => toasts.filter((t) => t.id !== id));
	},
	/**
	 * 모든 토스트 제거
	 */
	clear: () => {
		update(() => []);
	}
};
