import { createClient } from '@supabase/supabase-js';

// Client Supabase côté serveur (pour les actions serveur)
export const supabaseServer = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Pour l'utilisation côté client, on utilise les variables NEXT_PUBLIC_*
// mais on les récupère depuis les variables d'environnement côté serveur
export function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
