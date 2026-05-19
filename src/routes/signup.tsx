import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, AtSign, Lock, User, UserCircle2, X } from "lucide-react";
import { Particles } from "@/components/landing/Particles";
import { StockChart } from "@/components/landing/StockChart";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "新規登録 — Aurea" },
      { name: "description", content: "Aureaで投資を始めましょう。" },
    ],
  }),
});

function SignupPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12 text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[70vh] bg-[var(--gradient-radial-gold)] opacity-60" />
      <div className="pointer-events-none fixed -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-gold/5 blur-3xl" />
      <Particles count={18} />

      <div className="pointer-events-none absolute inset-x-0 top-1/3 opacity-20">
        <StockChart
          data={[12, 16, 14, 20, 18, 24, 22, 28, 26, 32, 30, 36, 34, 42, 40, 46, 44, 52, 50, 58, 56, 64]}
          width={1400}
          height={280}
          className="w-full"
          color="var(--gold)"
        />
      </div>

      <div className="pointer-events-none absolute right-4 top-24 rounded-2xl glass-gold px-4 py-3 shadow-gold md:right-16" style={{ animation: "float-soft 6s ease-in-out infinite" }}>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">TOPIX</p>
        <p className="font-display text-base text-foreground">+0.86%</p>
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
            <h1 className="font-display text-3xl tracking-tight md:text-4xl">新規登録</h1>
            <p className="mt-2 text-sm text-muted-foreground">投資を始めましょう</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
              className="mt-8 space-y-4"
            >
              <Field icon={UserCircle2} label="氏名" placeholder="氏名" type="text" />
              <Field icon={AtSign} label="メールアドレス" placeholder="メールアドレス" type="email" />
              <Field icon={User} label="ユーザー名" placeholder="ユーザー名" type="text" />
              <Field icon={Lock} label="パスワード" placeholder="パスワード" type="password" />

              <button
                type="submit"
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-4 text-base font-medium text-primary-foreground shadow-gold transition hover:scale-[1.02]"
              >
                新規登録
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>

            <p className="mt-6 text-center text-[11px] text-muted-foreground">
              すでにアカウントをお持ちですか？{" "}
              <Link to="/login" className="text-gold hover:underline">ログイン</Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← ホームへ戻る</Link>
        </p>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-rise"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl glass-gold p-8 text-center shadow-elev animate-rise">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full glass"
              aria-label="閉じる"
            >
              <X className="size-4" />
            </button>
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,var(--gold)_0%,transparent_60%)] opacity-20 blur-2xl" />
            <div className="relative">
              <div className="mx-auto grid size-14 place-items-center rounded-full glass-gold glow-gold">
                <Lock className="size-6 text-gold" />
              </div>
              <h2 className="mt-5 font-display text-2xl tracking-tight">招待制のご案内</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                現在、新規登録は招待制です。<br />
                管理者にお問い合わせください。
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  type,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  placeholder: string;
  type: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-muted-foreground">{label}</span>
      <div className="group flex items-center gap-3 rounded-2xl glass px-4 py-3 transition focus-within:border-gold/60 focus-within:shadow-gold">
        <Icon className="size-4 text-muted-foreground transition group-focus-within:text-gold" />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </label>
  );
}
