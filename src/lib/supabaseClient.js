import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Whether real Supabase credentials are present. Components can check this
// to show a friendly "backend not configured" state instead of crashing.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local (or your host\'s environment settings).'
  );
}

// Fall back to a syntactically valid placeholder URL so createClient() never
// throws at import time (an invalid URL there would blank the entire app).
// Calls made with this placeholder will fail gracefully at the network layer
// instead, which every query already handles via isError / try-catch.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// The only email allowed to access the admin panel (product management +
// real-time analytics). Everything else on the site is public / anonymous.
export const ADMIN_EMAIL = 'samuelivere92@gmail.com';
