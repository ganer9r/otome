// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/schema.gen';
import type { AppUser } from '$lib/types';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: AppUser | null }>;
			session: Session | null;
			user: AppUser;
		}
		interface PageData {
			session: Session | null;
		}
		interface Error {
			code?: string | number;
			title?: string;
			message: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
