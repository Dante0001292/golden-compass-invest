import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Lock } from "lucide-react";
import { Particles } from "@/components/landing/Particles";
import { TELEGRAM_URL, TELEGRAM_HANDLE } from "@/config/users";

export const Route = createFileRoute("/signup")({
  component: AccessPage,
  head: () => ({
    meta: [
      { title: "アクセスリクエスト — Kumo Capital" },
      { name: "description", content: "Kumo Capitalへのアクセスは招待制です。" },
    ],
  }),
});

function AccessPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12 text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[70vh] bg-[var(--gradient-radial-gold)] opacity-55" />
      <div className="pointer-events-none fixed -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-gold/5 blur-3xl" />
      <Particles count={18} />

      <div className="relative z-10 w-full max-w-md animate-rise text-center">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-gold shadow-gold">
            <span className="font-display text-base font-semibold text-primary-foreground">K</span>
          </span>
          <span className="font-display text-lg tracking-tight">Kumo Capital</span>
        </Link>

        <div className="relative overflow-hidden rounded-[2rem] glass-gold p-8 md:p-10 shadow-elev">
          <div className="absolute -right-20 -top-20 size-48 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative">
            {!submitted ? (
              <>
                <h1 className="mt-2 font-display text-3xl tracking-tight text-left">新規登録</h1>
                <p className="mt-2 text-sm text-muted-foreground text-left">
                  Kumo Capitalのアカウントを作成する
                </p>

                <form 
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} 
                  className="mt-8 space-y-4 text-left"
                >
                  <label className="block">
                    <span className="mb-2 block text-xs text-muted-foreground">お名前 (フルネーム)</span>
                    <div className="group flex items-center gap-3 rounded-2xl glass px-4 py-3 transition focus-within:border-gold/60 focus-within:shadow-gold">
                      <input
                        type="text"
                        required
                        placeholder="例: 山田 太郎"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs text-muted-foreground">ユーザー名</span>
                    <div className="group flex items-center gap-3 rounded-2xl glass px-4 py-3 transition focus-within:border-gold/60 focus-within:shadow-gold">
                      <input
                        type="text"
                        required
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
                        required
                        placeholder="パスワード"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                      />
                    </div>
                  </label>

                  <button
                    type="submit"
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-4 text-base font-medium text-primary-foreground shadow-gold transition hover:scale-[1.02]"
                  >
                    アカウント作成をリクエスト
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto grid size-16 place-items-center rounded-full glass-gold glow-gold mb-6">
                  <Lock className="size-7 text-gold" />
                </div>
                <h2 className="font-display text-2xl tracking-tight">リクエスト受付完了</h2>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Kumo Capitalへのアクセスは招待制です。<br /><br />
                  ご登録いただいた情報を基に審査を行います。スムーズな承認のために、Telegramにて管理者までご連絡ください。
                </p>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-4 text-base font-medium text-primary-foreground shadow-gold transition hover:scale-[1.02]"
                >
                  <TelegramIcon />
                  {TELEGRAM_HANDLE} に連絡する
                </a>
              </div>
            )}

            <p className="mt-8 text-center text-[11px] text-muted-foreground">
              すでにアカウントをお持ちですか？{" "}
              <Link to="/login" className="text-gold hover:underline">ログイン</Link>
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

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
    </svg>
  );
}
