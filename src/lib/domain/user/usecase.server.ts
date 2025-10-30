import { supabase } from '$lib/supabase/supabase.server';
import type { AppUser } from '$lib/types';

export async function findUser(uid: string | undefined): Promise<AppUser | null> {
	if (!uid) return null;

	const { data, error } = await supabase
		.from('app_user')
		.select('*')
		.eq('uid', uid)
		.maybeSingle();

	if (error) {
		console.error('findUser error:', error);
		return null;
	}

	return data;
}

export async function createUser(userData: {
	uid: string;
	email: string;
	nickname?: string;
	profile_img?: string;
}): Promise<AppUser | null> {
	const { data, error } = await supabase
		.from('app_user')
		.insert(userData)
		.select()
		.single();

	if (error) {
		console.error('createUser error:', error);
		return null;
	}

	return data;
}
