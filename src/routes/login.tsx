import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock, User } from "lucide-react";
import { Particles } from "@/components/landing/Particles";
import { StockChart } from "@/components/landing/StockChart";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "ログイン — Aurea" },
      { name: "description", content: "Aureaアカウントにログインして、米国株と日本株のポートフォリオを管理。" },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12 text-foreground">
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[70vh] bg-[var(--gradient-radial-gold)] opacity-60" />
      <div className="pointer-events-none fixed -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-gold/5 blur-3xl" />
      <Particles count={18} />

      {/* Background ghost chart */}
      <div className="pointer-events-none absolute inset-x-0 top-1/3 opacity-[0.18]">
        <StockChart
          data={[3420, 3458, 3432, 3474, 3448, 3492, 3464, 3440, 3476, 3514, 3488, 3526, 3500, 3540, 3512, 3554, 3528, 3570, 3544, 3588, 3560, 3604, 3578, 3622, 3596, 3568, 3612, 3650, 3624, 3665]}
          width={1400}
          height={280}
          className="w-full"
          color="var(--gold)"
          animate={false}
        />
      </div>

      {/* Floating ticker chips */}
      <div className="pointer-events-none absolute left-4 top-20 animate-float-soft rounded-2xl glass px-4 py-3 shadow-elev md:left-16">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-neutral-800 to-black text-[10px] font-semibold text-gold">AP</div>
          <div>
            <p className="text-xs">AAPL</p>
            <p className="text-[10px] text-[color:var(--success)]">+2.18%</p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute right-4 bottom-24 rounded-2xl glass-gold px-4 py-3 shadow-gold md:right-16" style={{ animation: "float-soft 6s ease-in-out 1s infinite" }}>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">日経平均</p>
        <p className="font-display text-base text-foreground">+1.42%</p>
      </div>

      <div className="relative z-10 w-full max-w-md animate-rise">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-gold shadow-gold">
            <span className="font-display text-base font-semibold text-primary-foreground">A</span>
          </span>
          <span className="font-display text-lg tracking-tight">Aurea</span>
        </Link>

        <div className="relative overflow-hidden rounded-[2rem] glass-gold p-8 shadow-elev md:p-10">
          <div className="absolute -right-20 -top-20 size-48 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative">
            <h1 className="font-display text-3xl tracking-tight md:text-4xl">お帰りなさい</h1>
            <p className="mt-2 text-sm text-muted-foreground">アカウントにログインしてください</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/dashboard" });
              }}
              className="mt-8 space-y-4"
            >
              <label className="block">
                <span className="mb-2 block text-xs text-muted-foreground">ユーザー名</span>
                <div className="group flex items-center gap-3 rounded-2xl glass px-4 py-3 transition focus-within:border-gold/60 focus-within:shadow-gold">
                  <User className="size-4 text-muted-foreground transition group-focus-within:text-gold" />
                  <input
                    type="text"
                    value={u}
                    onChange={(e) => setU(e.target.value)}
                    placeholder="ユーザー名"
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
                    value={p}
                    onChange={(e) => setP(e.target.value)}
                    placeholder="パスワード"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-4 text-base font-medium text-primary-foreground shadow-gold transition hover:scale-[1.02]"
              >
                ログイン
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>

            <p className="mt-6 text-center text-[11px] text-muted-foreground">
              アカウントは管理者によって作成されます
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← ホームへ戻る</Link>
        </p>
      </div>
    </div>
  );
}
