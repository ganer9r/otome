import { writable } from 'svelte/store';
import type { AppUser } from '$lib/types';

export const userStore = writable<AppUser | null>(null);

export const updateUser = (user: AppUser | null) => {
	userStore.set(user);
};
