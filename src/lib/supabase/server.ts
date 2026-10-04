import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabasePublicKey, supabaseUrl } from "./config";

/** Supabase-Client im Namen der angemeldeten Person (Cookies). `null`, wenn Supabase nicht eingerichtet ist. */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabasePublicKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // In Server Components nicht möglich – der Proxy aktualisiert die Sitzung.
        }
      },
    },
  });
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
