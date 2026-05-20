import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LogOut, Shield, Users } from "lucide-react";
import { ADMIN_CREDENTIALS } from "@/config/users";
import type { KumoUser } from "@/config/users";
import { isAdminLogin } from "@/lib/auth";
import { getAllUsers } from "@/server-actions";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Admin — Kumo Capital" }],
  }),
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (isAdminLogin(username, password)) {
      setAuthed(true);
      setError("");
    } else {
      setError("認証情報が正しくありません");
    }
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-[var(--gradient-radial-gold)] opacity-40" />
        <div className="relative z-10 w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-2">
            <span className="grid size-12 place-items-center rounded-full bg-gradient-gold shadow-gold">
              <Shield className="size-5 text-primary-foreground" />
            </span>
            <p className="font-display text-xl tracking-tight">Kumo Capital Admin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 rounded-3xl glass-gold p-8">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">ユーザー名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full rounded-2xl glass px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-gold/60"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl glass px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-gold/60"
              />
            </div>
            {error && <p className="text-xs text-[color:var(--loss)]">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-gold py-3 text-sm font-medium text-primary-foreground shadow-gold"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminPanel onLogout={() => setAuthed(false)} />;
}

// ─── Admin panel ──────────────────────────────────────────────────────────────

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<KumoUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((fetchedUsers) => {
      setUsers(fetchedUsers);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[50vh] bg-[var(--gradient-radial-gold)] opacity-30" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-gradient-gold shadow-gold">
              <Shield className="size-4 text-primary-foreground" />
            </span>
            <div>
              <p className="font-display text-base leading-none">Kumo Capital</p>
              <p className="text-[10px] text-gold">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => { onLogout(); navigate({ to: "/login" }); }}
            className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <LogOut className="size-4" /> ログアウト
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 py-10">
        {/* Current users */}
        <section className="mb-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl glass-gold">
              <Users className="size-4 text-gold" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">現在のユーザー</p>
              <h2 className="font-display text-2xl tracking-tight">登録済みユーザー</h2>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl glass">
            <div className="hidden grid-cols-[1fr_1fr_1fr_1fr] gap-4 border-b border-white/5 px-5 py-3 text-[11px] uppercase tracking-widest text-muted-foreground sm:grid">
              <span>表示名</span>
              <span>ユーザー名</span>
              <span>パスワード</span>
              <span>残高</span>
            </div>
            
            {loading ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">読み込み中...</div>
            ) : users.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">ユーザーが見つかりません。</div>
            ) : (
              users.map((u) => (
                <div
                  key={u.id}
                  className="grid grid-cols-2 gap-3 border-b border-white/5 px-5 py-4 last:border-0 sm:grid-cols-[1fr_1fr_1fr_1fr]"
                >
                  <p className="text-sm font-medium">{u.displayName}</p>
                  <p className="text-sm text-muted-foreground">{u.username}</p>
                  <p className="font-mono text-sm text-muted-foreground">{u.password}</p>
                  <p className="text-sm text-[color:var(--success)]">¥{u.balance.toLocaleString("ja-JP")}</p>
                </div>
              ))
            )}
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            ユーザーの追加は <strong>Telegram ボット</strong> (<code className="rounded bg-white/5 px-1.5 py-0.5 text-gold">/adduser</code> コマンド) から行ってください。追加すると自動的に反映されます。
          </p>
        </section>
      </main>
    </div>
  );
}
