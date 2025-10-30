import type { Database } from './supabase/schema.gen';

export type Supabase<T extends keyof Database['public']['Tables']> =
	Database['public']['Tables'][T]['Row'];

export type AppUser = Supabase<'app_user'>;
export type Character = Supabase<'characters'>;
