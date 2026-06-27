import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://placeholder.supabase.co";
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  "placeholder-anon-key";

if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn(
    "[Kova] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
    "Copy .env.example → .env.local and add your Supabase project credentials."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
