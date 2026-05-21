import { createServerFn } from "@tanstack/react-start";
import type { KumoUser } from "@/config/users";
import { ADMIN_CREDENTIALS } from "@/config/users";

async function getSupabase() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them in Vercel → Settings → Environment Variables."
    );
  }
  return createClient(supabaseUrl, supabaseKey);
}

export const verifyLogin = createServerFn()
  .inputValidator((data: { username: string; password: string }) => data)
  .handler(async ({ data }): Promise<KumoUser | null> => {
    const { username, password } = data;

    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      return {
        id: "admin",
        username: "admin",
        password: "",
        displayName: "Admin",
        balance: 0,
      } as KumoUser;
    }

    try {
      const supabase = await getSupabase();
      const { data: row, error } = await supabase
        .from("kumo_users")
        .select("*")
        .eq("username", username.toLowerCase())
        .single();

      if (error) {
        console.error("Supabase fetch error:", error);
        return null;
      }

      if (row && row.password === password) {
        return {
          id: row.id,
          username: row.username,
          displayName: row.display_name,
          password: row.password,
          balance: row.balance,
        };
      }
      return null;
    } catch (error) {
      console.error("Supabase exception:", error);
      return null;
    }
  });

export const getAllUsers = createServerFn()
  .handler(async (): Promise<KumoUser[]> => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.from("kumo_users").select("*");
      if (error) {
        console.error("Supabase fetch error:", error);
        return [];
      }
      return (data || []).map((u: any) => ({
        id: u.id,
        username: u.username,
        displayName: u.display_name,
        password: u.password,
        balance: u.balance,
      }));
    } catch (error) {
      console.error("Supabase exception:", error);
      return [];
    }
  });

export const createUser = createServerFn()
  .inputValidator((data: { username: string; displayName: string; password: string; balance: number }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    console.log("[createUser] called with:", JSON.stringify(data));
    try {
      const supabase = await getSupabase();
      const id = `u_${Date.now()}`;
      const { error } = await supabase.from("kumo_users").insert({
        id,
        username: data.username.toLowerCase().trim(),
        display_name: data.displayName.trim(),
        password: data.password,
        balance: data.balance,
      });
      if (error) {
        console.error("[createUser] Supabase insert error:", JSON.stringify(error));
        return { success: false, error: error.message };
      }
      console.log("[createUser] success");
      return { success: true };
    } catch (err: any) {
      console.error("[createUser] exception:", err?.message);
      return { success: false, error: err?.message ?? String(err) };
    }
  });

export const deleteUser = createServerFn()
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.from("kumo_users").delete().eq("id", data.id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message ?? String(err) };
    }
  });
