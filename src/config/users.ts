// ─── ADMIN ────────────────────────────────────────────────────────────────
// The default admin credentials used for logging into the admin page.
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "password", // Change this in a real environment
};

export interface KumoUser {
  id: string;
  displayName: string;
  username: string;
  password?: string;
  balance: number;
}
