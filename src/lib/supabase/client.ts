"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabasePublicKey, supabaseUrl } from "./config";

export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabasePublicKey);
}
