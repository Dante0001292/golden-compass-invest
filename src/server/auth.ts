import { createServerFn } from "@tanstack/react-start";
import { Redis } from "@upstash/redis";

const kv = Redis.fromEnv();
import type { KumoUser } from "@/config/users";
import { ADMIN_CREDENTIALS } from "@/config/users";

export const verifyLogin = createServerFn(
  "POST",
  async (payload: { username: string; password: string }): Promise<KumoUser | null> => {
    const { username, password } = payload;
    
    // Check if it's admin
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
      // Fetch user from KV
      const user = await kv.hget<KumoUser>("users", username.toLowerCase());
      
      if (user && user.password === password) {
        return user;
      }
      return null;
    } catch (error) {
      console.error("KV fetch error:", error);
      return null;
    }
  }
);

export const getAllUsers = createServerFn(
  "GET",
  async (): Promise<KumoUser[]> => {
    try {
      // HGETALL returns a Record<string, KumoUser>
      const all = await kv.hgetall<Record<string, KumoUser>>("users");
      if (!all) return [];
      return Object.values(all);
    } catch (error) {
      console.error("KV fetch error:", error);
      return [];
    }
  }
);
