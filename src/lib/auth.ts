import { ADMIN_CREDENTIALS } from "@/config/users";
import type { KumoUser } from "@/config/users";

const SESSION_KEY = "kumo_session";

import { verifyLogin } from "@/server-actions";

export async function loginUser(username: string, password: string): Promise<KumoUser | null> {
  const user = await verifyLogin({ data: { username, password } });
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function isAdminLogin(username: string, password: string): boolean {
  return (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  );
}

export function getCurrentUser(): KumoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as KumoUser) : null;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}
