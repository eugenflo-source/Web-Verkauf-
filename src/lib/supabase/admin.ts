import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseSecretKey } from "@/lib/env";
import { supabaseUrl } from "./config";

/**
 * Supabase mit Service-Rolle – umgeht Row Level Security.
 * Nur serverseitig verwenden (Webhooks, Downloads, Formulareingänge).
 */
export function createSupabaseAdminClient() {
  const key = supabaseSecretKey();
  if (!supabaseUrl || !key) return null;
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
