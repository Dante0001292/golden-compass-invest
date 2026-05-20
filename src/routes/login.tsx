import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock, User } from "lucide-react";
import { Particles } from "@/components/landing/Particles";
import { StockChart } from "@/components/landing/StockChart";
import { loginUser } from "@/lib/auth";
import { TELEGRAM_URL, TELEGRAM_HANDLE } from "@/config/users";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "ログイン — Kumo Capital" },
      { name: "description", content: "Kumo Capitalアカウントにログインして、ポートフォリオを管理。" },
    ],
  }),
});

const bgChart = [
  3420, 3458, 3432, 3474, 3448, 3492, 3464, 3440, 3476, 3514,
  3488, 3526, 3500, 3540, 3512, 3554, 3528, 3570, 3544, 3588,
  3560, 3604, 3578, 3622, 3596, 3568, 3612, 3650, 3624, 3665,
];

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 400));

    const user = loginUser(username, password);
    if (user) {
      navigate({ to: "/dashboard" });
    } else {
      setError("ユーザー名またはパスワードが正しくありません");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12 text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[70vh] bg-[var(--gradient-radial-gold)] opacity-55" />
      <div className="pointer-events-none fixed -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-gold/5 blur-3xl" />
      <Particles count={18} />

      {/* Ghost background chart */}
      <div className="pointer-events-none absolute inset-x-0 top-1/3 opacity-[0.18]">
        <StockChart
          data={bgChart}
          width={1400} height={280}
          className="w-full"
          color="var(--gold)"
          animate={false}
        />
      </div>

      {/* Floating chips */}
      <div className="pointer-events-none absolute left-4 top-20 animate-float-soft rounded-2xl glass px-4 py-3 shadow-elev md:left-16">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-neutral-800 to-black text-[10px] font-semibold text-gold">AP</div>
          <div>
            <p className="text-xs">AAPL</p>
            <p className="text-[10px] text-[color:var(--success)]">+2.18%</p>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute right-4 bottom-24 rounded-2xl glass-gold px-4 py-3 shadow-gold md:right-16"
        style={{ animation: "float-soft 6s ease-in-out 1s infinite" }}
      >
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">日経平均</p>
        <p className="font-display text-base text-foreground">+1.42%</p>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md animate-rise">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-gold shadow-gold">
            <span className="font-display text-base font-semibold text-primary-foreground">K</span>
          </span>
          <span className="font-display text-lg tracking-tight">Kumo Capital</span>
        </Link>

        <div className="relative overflow-hidden rounded-[2rem] glass-gold p-8 shadow-elev md:p-10">
          <div className="absolute -right-20 -top-20 size-48 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative">
            <h1 className="font-display text-3xl tracking-tight md:text-4xl">お帰りなさい</h1>
            <p className="mt-2 text-sm text-muted-foreground">アカウントにログインしてください</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs text-muted-foreground">ユーザー名</span>
                <div className="group flex items-center gap-3 rounded-2xl glass px-4 py-3 transition focus-within:border-gold/60 focus-within:shadow-gold">
                  <User className="size-4 text-muted-foreground transition group-focus-within:text-gold" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    placeholder="ユーザー名"
                    autoComplete="username"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs text-muted-foreground">パスワード</span>
                <div className="group flex items-center gap-3 rounded-2xl glass px-4 py-3 transition focus-within:border-gold/60 focus-within:shadow-gold">
                  <Lock className="size-4 text-muted-foreground transition group-focus-within:text-gold" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="パスワード"
                    autoComplete="current-password"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </label>

              {error && (
                <p className="rounded-2xl bg-[oklch(0.65_0.2_25)]/10 px-4 py-2.5 text-xs text-[color:var(--loss)]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !username || !password}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-4 text-base font-medium text-primary-foreground shadow-gold transition hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? "確認中..." : "ログイン"}
                {!loading && <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />}
              </button>
            </form>

            <div className="mt-6 border-t border-white/5 pt-5 text-center">
              <p className="text-[11px] text-muted-foreground">アクセスが必要ですか？</p>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs text-muted-foreground transition hover:border-gold/40 hover:text-foreground"
              >
                <TelegramIcon />
                {TELEGRAM_HANDLE} に連絡する
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← ホームへ戻る</Link>
        </p>
      </div>
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
    </svg>
  );
}
