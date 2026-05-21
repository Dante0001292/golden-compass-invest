import { createServerFn } from "@tanstack/react-start";
import type { KumoUser } from "@/config/users";
import { ADMIN_CREDENTIALS } from "@/config/users";

function getSupabase() {
  const { createClient } = require("@supabase/supabase-js");
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
  return createClient(supabaseUrl, supabaseKey);
}

export const verifyLogin = createServerFn(
  "POST",
  async (payload: { username: string; password: string }): Promise<KumoUser | null> => {
    const { username, password } = payload;
    
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
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("kumo_users")
        .select("*")
        .eq("username", username.toLowerCase())
        .single();
      
      if (error) {
        console.error("Supabase fetch error:", error);
        return null;
      }
      
      if (data && data.password === password) {
        return {
          id: data.id,
          username: data.username,
          displayName: data.display_name,
          password: data.password,
          balance: data.balance,
        };
      }
      return null;
    } catch (error) {
      console.error("Supabase exception:", error);
      return null;
    }
  }
);

export const getAllUsers = createServerFn(
  "GET",
  async (): Promise<KumoUser[]> => {
    try {
      const supabase = getSupabase();
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
  }
);

export const createUser = createServerFn(
  "POST",
  async (payload: {
    username: string;
    displayName: string;
    password: string;
    balance: number;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = getSupabase();
      const id = `u_${Date.now()}`;
      const { error } = await supabase.from("kumo_users").insert({
        id,
        username: payload.username.toLowerCase().trim(),
        display_name: payload.displayName.trim(),
        password: payload.password,
        balance: payload.balance,
      });
      if (error) {
        console.error("Supabase insert error:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("createUser exception:", err);
      return { success: false, error: err.message };
    }
  }
);

export const deleteUser = createServerFn(
  "POST",
  async (payload: { id: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("kumo_users").delete().eq("id", payload.id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
);

