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
    const username = data.username.trim().toLowerCase();
    const password = data.password.trim();
    console.log("[verifyLogin] request", { username, passwordLength: password.length });

    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      console.log("[verifyLogin] admin login success", { username });
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
        .eq("username", username)
        .maybeSingle();

      if (error) {
        console.error("Supabase fetch error:", error);
        return null;
      }

      if (row) {
        console.log("[verifyLogin] row fetched", {
          rowId: row.id,
          rowUsername: row.username,
          rowPasswordLength: String(row.password).trim().length,
          rowBalance: row.balance,
        });
      }
      if (row && String(row.password).trim() === password) {
        console.log("[verifyLogin] user login success", { username });
        return {
          id: row.id,
          username: row.username,
          displayName: row.display_name,
          password: row.password,
          balance: row.balance,
        };
      }
      console.log("[verifyLogin] login mismatch", { username, expectedPasswordLength: row ? String(row.password).trim().length : null });
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
    console.log("[createUser] called with:", JSON.stringify({
      username: data.username,
      displayName: data.displayName,
      passwordLength: data.password.length,
      balance: data.balance,
    }));
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

export const updateUser = createServerFn()
  .inputValidator((data: { id: string; balance?: number; password?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = await getSupabase();
      const patch: Record<string, unknown> = {};
      if (data.balance !== undefined) patch.balance = data.balance;
      if (data.password !== undefined) patch.password = data.password;
      const { error } = await supabase
        .from("kumo_users")
        .update(patch)
        .eq("id", data.id);
      if (error) {
        console.error("[updateUser] Supabase update error:", JSON.stringify(error));
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("[updateUser] exception:", err?.message);
      return { success: false, error: err?.message ?? String(err) };
    }
  });

export const getSiteSetting = createServerFn()
  .inputValidator((data: { key: string }) => data)
  .handler(async ({ data }): Promise<{ value: any | null }> => {
    try {
      const supabase = await getSupabase();
      const { data: row, error } = await supabase
        .from("kumo_settings")
        .select("value")
        .eq("key", data.key)
        .single();
      if (error) {
        console.error("[getSiteSetting] Supabase fetch error:", JSON.stringify(error));
        return { value: null };
      }
      return { value: row?.value ?? null };
    } catch (err: any) {
      console.error("[getSiteSetting] exception:", err?.message);
      return { value: null };
    }
  });

export const setSiteSetting = createServerFn()
  .inputValidator((data: { key: string; value: any }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase
        .from("kumo_settings")
        .upsert({ key: data.key, value: data.value }, { onConflict: "key" });
      if (error) {
        console.error("[setSiteSetting] Supabase upsert error:", JSON.stringify(error));
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("[setSiteSetting] exception:", err?.message);
      return { success: false, error: err?.message ?? String(err) };
    }
  });
