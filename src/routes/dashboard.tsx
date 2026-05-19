import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Bell, Home, LineChart, LogOut, PieChart, Search, Settings, TrendingUp, User, Wallet } from "lucide-react";
import { Particles } from "@/components/landing/Particles";
import { StockChart } from "@/components/landing/StockChart";
import { Ticker } from "@/components/landing/Ticker";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "ダッシュボード — Aurea" },
      { name: "description", content: "ポートフォリオ、保有株式、リアルタイム市場データ。" },
    ],
  }),
});

const holdings = [
  { sym: "AAPL", name: "Apple", jp: "アップル", price: "192.31", change: "+2.18%", data: [14, 13, 15, 14, 16, 17, 18, 19, 20, 21, 22, 23], up: true },
  { sym: "TSLA", name: "Tesla", jp: "テスラ", price: "248.42", change: "+3.74%", data: [10, 12, 11, 14, 13, 16, 18, 17, 20, 22, 24, 26], up: true },
  { sym: "6758", name: "Sony", jp: "ソニー", price: "¥13,420", change: "+1.62%", data: [12, 13, 12, 14, 13, 14, 15, 16, 16, 17, 18, 19], up: true },
  { sym: "7203", name: "Toyota", jp: "トヨタ", price: "¥2,815", change: "+0.41%", data: [14, 15, 14, 16, 17, 16, 18, 17, 19, 20, 19, 21], up: true },
  { sym: "NVDA", name: "Nvidia", jp: "エヌビディア", price: "892.10", change: "+5.23%", data: [8, 10, 11, 13, 12, 15, 17, 18, 20, 24, 27, 30], up: true },
];

const indices = [
  { name: "NASDAQ", val: "17,842.12", chg: "+1.24%", data: [20, 22, 21, 25, 24, 28, 27, 31, 30, 34], up: true },
  { name: "日経平均", val: "39,128.50", chg: "+1.42%", data: [18, 19, 18, 22, 21, 24, 23, 27, 26, 30], up: true },
  { name: "S&P 500", val: "5,624.18", chg: "+0.86%", data: [16, 17, 16, 19, 18, 21, 20, 23, 22, 25], up: true },
  { name: "TOPIX", val: "2,793.42", chg: "+0.62%", data: [14, 15, 14, 17, 16, 18, 17, 20, 19, 22], up: true },
];

const transactions = [
  { text: "Apple株を購入しました", amount: "+10株", time: "数秒前", up: true },
  { text: "Tesla株を追加しました", amount: "+5株", time: "12分前", up: true },
  { text: "Sony株を売却しました", amount: "-3株", time: "1時間前", up: false },
  { text: "Nvidia株を購入しました", amount: "+2株", time: "本日", up: true },
];

const liveChart = [22, 24, 21, 26, 28, 25, 30, 29, 33, 32, 36, 38, 35, 42, 44, 46, 43, 48, 52, 50, 56, 60, 58, 64, 68];

function Dashboard() {
  const [balance, setBalance] = useState(3820000);
  const [profit, setProfit] = useState(12.4);

  useEffect(() => {
    const id = setInterval(() => {
      setBalance((b) => b + Math.random() * 900 + 150);
      setProfit((p) => +(p + Math.random() * 0.02).toFixed(2));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const fmtY = (n: number) => Math.round(n).toLocaleString("ja-JP");

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-[var(--gradient-radial-gold)] opacity-50" />
      <div className="pointer-events-none fixed -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-gold/5 blur-3xl" />
      <Particles count={10} />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-gradient-gold shadow-gold">
              <span className="font-display text-base font-semibold text-primary-foreground">A</span>
            </span>
            <span className="font-display text-lg tracking-tight">Aurea</span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="grid size-9 place-items-center rounded-full glass" aria-label="検索">
              <Search className="size-4 text-muted-foreground" />
            </button>
            <button className="grid size-9 place-items-center rounded-full glass" aria-label="通知">
              <Bell className="size-4 text-gold" />
            </button>
            <button className="grid size-9 place-items-center rounded-full glass" aria-label="設定">
              <Settings className="size-4 text-muted-foreground" />
            </button>
            <Link to="/login" className="grid size-9 place-items-center rounded-full glass" aria-label="ログアウト">
              <LogOut className="size-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 pb-24">
        {/* Welcome */}
        <div className="animate-rise mb-8 mt-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">ダッシュボード</p>
          <h1 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">
            お帰りなさい、<span className="text-gradient-gold">Daniel</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">本日の市場はあなたに微笑んでいます。</p>
        </div>

        {/* Balance + live chart */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl glass-gold p-6 md:col-span-2">
            <div className="absolute -right-20 -top-20 size-56 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 size-56 rounded-full bg-[oklch(0.78_0.16_150)]/15 blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">総資産</p>
                  <p className="mt-2 font-display text-4xl tracking-tight tabular-nums text-foreground md:text-5xl">
                    ¥{fmtY(balance)}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-[oklch(0.78_0.16_150)]/10 px-3 py-1 text-xs text-[color:var(--success)] shadow-[0_0_24px_oklch(0.78_0.16_150_/_0.3)]">
                    <ArrowUpRight className="size-3" /> 本日の利益 +{profit}%
                  </p>
                </div>
                <div className="grid size-12 place-items-center rounded-2xl glass-gold">
                  <Wallet className="size-5 text-gold" />
                </div>
              </div>

              <div className="mt-5">
                <StockChart data={liveChart} width={600} height={120} className="h-32 w-full" color="var(--gold)" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>1日</span><span>1週</span>
                <span className="rounded-full bg-gold px-3 py-0.5 text-[10px] font-medium text-primary-foreground">1ヶ月</span>
                <span>3ヶ月</span><span>1年</span><span>全期間</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
            <StatCard label="本日の損益" value="+¥128,420" up />
            <StatCard label="保有銘柄" value="12" />
            <StatCard label="現金残高" value="¥412,300" />
            <StatCard label="月次リターン" value="+8.6%" up />
          </div>
        </div>

        {/* Holdings */}
        <section className="mt-12">
          <SectionHeader title="保有株式" icon={PieChart} subtitle="お客様のポートフォリオ" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {holdings.map((h) => (
              <div key={h.sym} className="group relative overflow-hidden rounded-3xl glass p-5 transition hover:border-gold/30 hover:shadow-gold">
                <div className="absolute -right-10 -top-10 size-32 rounded-full bg-gold/5 blur-2xl transition group-hover:bg-gold/15" />
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-neutral-900 to-black text-sm font-semibold text-gold ring-1 ring-[color:var(--gold)]/30">
                      {h.sym.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-display text-base text-foreground">{h.sym}</p>
                      <p className="text-xs text-muted-foreground">{h.jp}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.78_0.16_150)]/10 px-2 py-0.5 text-[10px] text-[color:var(--success)] shadow-[0_0_16px_oklch(0.78_0.16_150_/_0.25)]">
                    <ArrowUpRight className="size-3" /> {h.change}
                  </span>
                </div>
                <div className="relative mt-4">
                  <StockChart data={h.data} width={300} height={56} className="h-14 w-full" color="var(--gold)" />
                </div>
                <div className="relative mt-3 flex items-end justify-between">
                  <p className="font-display text-xl tracking-tight tabular-nums">{h.price.startsWith("¥") ? h.price : `$${h.price}`}</p>
                  <p className="text-xs text-muted-foreground">含み益</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Market overview */}
        <section className="mt-12">
          <SectionHeader title="市場概要" icon={TrendingUp} subtitle="主要インデックス" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {indices.map((idx) => (
              <div key={idx.name} className="relative overflow-hidden rounded-3xl glass p-5 transition hover:border-gold/30">
                <p className="text-xs text-muted-foreground">{idx.name}</p>
                <p className="mt-1 font-display text-2xl tracking-tight tabular-nums">{idx.val}</p>
                <p className="mt-1 text-xs text-[color:var(--success)]">{idx.chg}</p>
                <div className="mt-3">
                  <StockChart data={idx.data} width={220} height={40} className="h-10 w-full" color="var(--gold)" fill={false} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live chart */}
        <section className="mt-12">
          <SectionHeader title="リアルタイムチャート" icon={LineChart} subtitle="ポートフォリオの動き" />
          <div className="relative overflow-hidden rounded-[2rem] glass-gold p-6 md:p-10">
            <div className="absolute -right-32 -top-32 size-96 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--success)]" />
                ライブ配信中 · 遅延 0秒
              </div>
              <StockChart data={[...liveChart, ...liveChart.map((v) => v + Math.random() * 6)]} width={1100} height={220} className="h-56 w-full md:h-72" color="var(--gold)" />
            </div>
          </div>
        </section>

        {/* Transactions */}
        <section className="mt-12">
          <SectionHeader title="最近の取引" icon={Wallet} subtitle="ご利用履歴" />
          <div className="overflow-hidden rounded-3xl glass">
            <ul className="divide-y divide-white/5">
              {transactions.map((t, i) => (
                <li key={i} className="flex items-center justify-between px-5 py-4 transition hover:bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className={`grid size-10 place-items-center rounded-2xl glass-gold ${t.up ? "" : "opacity-80"}`}>
                      <ArrowUpRight className={`size-4 ${t.up ? "text-[color:var(--success)]" : "text-[color:var(--loss)] rotate-180"}`} />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{t.text}</p>
                      <p className="text-[11px] text-muted-foreground">{t.time}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-medium tabular-nums ${t.up ? "text-[color:var(--success)]" : "text-[color:var(--loss)]"}`}>{t.amount}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Ticker />

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-[min(420px,calc(100%-2rem))] items-center justify-around rounded-full glass px-4 py-3 shadow-elev md:hidden">
        {[
          { i: Home, a: true },
          { i: PieChart },
          { i: LineChart },
          { i: User },
        ].map((it, i) => (
          <button key={i} className={`grid size-10 place-items-center rounded-full ${it.a ? "bg-gradient-gold text-primary-foreground shadow-gold" : "text-muted-foreground"}`}>
            <it.i className="size-4" />
          </button>
        ))}
      </nav>
    </div>
  );
}

function StatCard({ label, value, up }: { label: string; value: string; up?: boolean }) {
  return (
    <div className="rounded-3xl glass p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-xl tracking-tight tabular-nums ${up ? "text-[color:var(--success)]" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function SectionHeader({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{subtitle}</p>
        <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">{title}</h2>
      </div>
      <div className="grid size-10 place-items-center rounded-2xl glass-gold">
        <Icon className="size-4 text-gold" />
      </div>
    </div>
  );
}
