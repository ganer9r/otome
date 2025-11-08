import { writable, get } from 'svelte/store';
import type { Component } from 'svelte';

// 모달 타입 정의
export type ModalType = 'dialog' | 'bottom';

// 기본 모달 Props 인터페이스 - 모든 모달 컴포넌트가 가져야 하는 기본 props
export interface ModalProps {
	id: string;
	close: (result?: unknown) => void;
}

// 모달 설정 옵션
export type ModalConfig = {
	hideClose?: boolean;
};

// 컴포넌트 모달 옵션
export type ComponentModalOptions = {
	id?: string;
	component: Component<ModalProps & Record<string, unknown>>;
	props?: Record<string, unknown> | null;
	type?: ModalType;
	hideClose?: boolean;
};

// 스니펫 모달 옵션
export type SnippetModalOptions = {
	props?: Record<string, unknown> | null;
	type?: ModalType;
	hideClose?: boolean;
};

// 통합 모달 옵션
export type ModalOptions = ComponentModalOptions | SnippetModalOptions;

export type ModalInstance = {
	id: string;
	type: ModalType;
	component?: Component<ModalProps & Record<string, unknown>>;
	props: ModalProps & Record<string, unknown>;
	config: ModalConfig;
	onClose?: () => void;
	promise: {
		resolve: (value: unknown) => void;
		reject: (reason?: unknown) => void;
	};
};

// 모달 인스턴스를 저장하는 스토어
const modals = writable<ModalInstance[]>([]);

// 고유한 ID 생성 함수
export const generateModalId = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * 모달을 열고 결과를 반환하는 함수
 */
function openModalImpl<TResult = unknown>(options: ModalOptions): Promise<TResult> {
	return new Promise<TResult>((resolve, reject) => {
		const id =
			((options.props as Record<string, unknown> | null | undefined)?.id as string) ??
			generateModalId();

		// 기본 설정
		const finalConfig: ModalConfig = {
			hideClose: options.hideClose ?? false
		};

		const modalInstance: ModalInstance = {
			id,
			type: options.type ?? 'dialog',
			component: 'component' in options ? options.component : undefined,
			props: {
				...(options.props || {}),
				id,
				close: (result?: unknown) => closeModalImpl(id, result)
			},
			config: finalConfig,
			promise: {
				resolve: resolve as (value: unknown) => void,
				reject
			}
		};

		modals.update((items) => [...items, modalInstance]);
	});
}

/**
 * 모달을 닫고 결과를 반환하는 함수
 */
function closeModalImpl<TResult = unknown>(id: string, result?: TResult): void {
	const currentModals = get(modals);
	const modal = currentModals.find((m) => m.id === id);

	if (modal) {
		modal.promise.resolve(result);
		if (modal.onClose) modal.onClose();
	}

	modals.update((items) => items.filter((m) => m.id !== id));
}

/**
 * 모달을 닫고 오류를 반환하는 함수
 */
function closeModalWithErrorImpl(id: string, reason?: unknown): void {
	const currentModals = get(modals);
	const modal = currentModals.find((m) => m.id === id);

	if (modal) {
		modal.promise.reject(reason);
		if (modal.onClose) modal.onClose();
	}

	modals.update((items) => items.filter((m) => m.id !== id));
}

// 제네릭 모달 옵션 타입
type GenericModalOptions<TProps extends Record<string, unknown> = Record<string, unknown>> = {
	id?: string;
	component: Component<ModalProps & TProps>;
	props?: TProps;
	type?: ModalType;
	hideClose?: boolean;
};

// 오버로드 정의 - 제네릭 컴포넌트용
function openModal<
	TResult = unknown,
	TProps extends Record<string, unknown> = Record<string, unknown>
>(options: GenericModalOptions<TProps>): Promise<TResult>;

// 오버로드 정의 - 기본 컴포넌트용
function openModal<TResult = unknown>(options: ModalOptions): Promise<TResult>;

// 구현
function openModal<TResult = unknown>(
	options: GenericModalOptions | ModalOptions
): Promise<TResult> {
	return openModalImpl<TResult>(options);
}

/**
 * 모달 스토어 객체
 */
export const modalStore = {
	// 모달 스토어 구독
	subscribe: modals.subscribe,

	// 모달 열기
	open: openModal,
	close: closeModalImpl,
	closeWithError: closeModalWithErrorImpl
};

// Svelte 스토어 구독을 위한 modals export
export { modals };
