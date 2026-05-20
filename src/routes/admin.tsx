import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle, Copy, LogOut, Plus, Shield, Users } from "lucide-react";
import { USERS, ADMIN_CREDENTIALS } from "@/config/users";
import { isAdminLogin } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Admin — Kumu Capital" }],
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
            <p className="font-display text-xl tracking-tight">Kumu Capital Admin</p>
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
  const [form, setForm] = useState({
    id: `u${Date.now()}`,
    displayName: "",
    username: "",
    password: "",
    balance: "",
  });
  const [snippet, setSnippet] = useState("");
  const [copied, setCopied] = useState(false);

  function generateSnippet() {
    const balance = parseInt(form.balance.replace(/,/g, ""), 10) || 0;
    const code = `  {
    id: "${form.id}",
    displayName: "${form.displayName}",
    username: "${form.username}",
    password: "${form.password}",
    balance: ${balance.toLocaleString().replace(/,/g, "_")},
  },`;
    setSnippet(code);
  }

  function copySnippet() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
              <p className="font-display text-base leading-none">Kumu Capital</p>
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
            {USERS.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-2 gap-3 border-b border-white/5 px-5 py-4 last:border-0 sm:grid-cols-[1fr_1fr_1fr_1fr]"
              >
                <p className="text-sm font-medium">{u.displayName}</p>
                <p className="text-sm text-muted-foreground">{u.username}</p>
                <p className="font-mono text-sm text-muted-foreground">{u.password}</p>
                <p className="text-sm text-[color:var(--success)]">¥{u.balance.toLocaleString("ja-JP")}</p>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            ユーザーを追加・削除するには <code className="rounded bg-white/5 px-1.5 py-0.5 text-gold">src/config/users.ts</code> を編集してGitHubにプッシュしてください。
          </p>
        </section>

        {/* Add user form */}
        <section className="mb-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl glass-gold">
              <Plus className="size-4 text-gold" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">ユーザー追加</p>
              <h2 className="font-display text-2xl tracking-tight">新規ユーザー作成</h2>
            </div>
          </div>

          <div className="rounded-3xl glass-gold p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="表示名"
                placeholder="例: 中村 ダニエル"
                value={form.displayName}
                onChange={(v) => setForm((f) => ({ ...f, displayName: v }))}
              />
              <FormField
                label="ユーザー名"
                placeholder="例: daniel"
                value={form.username}
                onChange={(v) => setForm((f) => ({ ...f, username: v }))}
              />
              <FormField
                label="パスワード"
                placeholder="例: kumu2024"
                value={form.password}
                onChange={(v) => setForm((f) => ({ ...f, password: v }))}
              />
              <FormField
                label="残高 (¥)"
                placeholder="例: 3820440"
                value={form.balance}
                onChange={(v) => setForm((f) => ({ ...f, balance: v }))}
              />
            </div>
            <button
              onClick={generateSnippet}
              disabled={!form.displayName || !form.username || !form.password}
              className="mt-5 rounded-full bg-gradient-gold px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-gold transition disabled:opacity-40"
            >
              コードを生成する
            </button>
          </div>

          {snippet && (
            <div className="mt-4 overflow-hidden rounded-3xl glass">
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                <p className="text-xs text-muted-foreground">
                  このコードを <code className="text-gold">src/config/users.ts</code> の <code className="text-gold">USERS</code> 配列に貼り付けてください
                </p>
                <button
                  onClick={copySnippet}
                  className="flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs transition hover:text-gold"
                >
                  {copied ? <CheckCircle className="size-3.5 text-[color:var(--success)]" /> : <Copy className="size-3.5" />}
                  {copied ? "コピー済み" : "コピー"}
                </button>
              </div>
              <pre className="overflow-x-auto px-5 py-4 font-mono text-sm text-gold/80">{snippet}</pre>
            </div>
          )}
        </section>

        {/* Deploy instructions */}
        <section>
          <div className="rounded-3xl glass p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">デプロイ手順</p>
            <h2 className="mt-2 font-display text-xl">ユーザーを追加したら</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                "上記のコードをコピーする",
                "GitHub で src/config/users.ts を開く",
                "USERS 配列内に貼り付けて保存する",
                "Cloudflare Pages が自動的に再デプロイします（約60秒）",
                "Telegram でユーザーに認証情報を送信する",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold/15 text-[10px] font-medium text-gold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}

function FormField({
  label, placeholder, value, onChange,
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-muted-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl glass px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-gold/50"
      />
    </div>
  );
}
