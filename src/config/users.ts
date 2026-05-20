// ─────────────────────────────────────────────────────────────────────────────
// KUMO CAPITAL — User Configuration
//
// Admin: add / remove users in the USERS array below, then push to GitHub.
// Cloudflare Pages will auto-deploy the changes in ~60 seconds.
//
// To add a user, copy one of the existing entries, change the values, and
// make sure the id is unique.
// ─────────────────────────────────────────────────────────────────────────────

export interface KumoUser {
  id: string;
  displayName: string; // Name shown on the dashboard welcome screen
  username: string;    // Used to log in
  password: string;    // Used to log in
  balance: number;     // Portfolio balance (shown on dashboard, in ¥)
}

// ── Users ─────────────────────────────────────────────────────────────────────
export const USERS: KumoUser[] = [
  {
    id: "u1",
    displayName: "Daniel Nakamura",
    username: "daniel",
    password: "kumo2024",
    balance: 3_820_440,
  },
  // ── Add more users below ────────────────────────────────────────────────────
  // {
  //   id: "u2",
  //   displayName: "Sarah Chen",
  //   username: "sarah",
  //   password: "sarah2024",
  //   balance: 1_500_000,
  // },
];

// ── Admin credentials ─────────────────────────────────────────────────────────
// Change the password before deploying!
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "KumoAdmin2024!",
} as const;

// ── Telegram ──────────────────────────────────────────────────────────────────
// Update this to your actual Telegram handle or group link.
export const TELEGRAM_HANDLE = "@KumoCapital";
export const TELEGRAM_URL = "https://t.me/KumoCapital";
