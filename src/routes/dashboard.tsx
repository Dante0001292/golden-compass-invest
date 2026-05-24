import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  ChevronRight,
  Globe2,
  Home,
  LineChart,
  LogOut,
  PieChart,
  Shield,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { Particles } from "@/components/landing/Particles";
import { StockChart } from "@/components/landing/StockChart";
import { Ticker } from "@/components/landing/Ticker";
import { getCurrentUser, logout } from "@/lib/auth";
import { getSiteSetting, updateUser, getUserById } from "@/server-actions";
import type { KumoUser } from "@/config/users";


export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "ダッシュボード — Kumo Capital" },
      { name: "description", content: "ポートフォリオ、保有株式、リアルタイム市場データ。" },
    ],
  }),
});

// ─── Static market data ───────────────────────────────────────────────────────

const holdings = [
  { sym: "AAPL", name: "Apple",     jp: "アップル",       price: "$192.31", shares: 15, change: "+2.18%", value: "¥432,800", data: [182,181,184,182,179,183,185,183,187,185,189,192], up: true  },
  { sym: "TSLA", name: "Tesla",     jp: "テスラ",         price: "$248.42", shares: 8,  change: "+3.74%", value: "¥298,600", data: [225,238,227,244,235,248,236,252,240,245,238,248], up: true  },
  { sym: "6758", name: "Sony",      jp: "ソニー",         price: "¥13,420", shares: 20, change: "+1.62%", value: "¥268,400", data: [12700,12750,12725,12780,12755,12810,12790,12840,12820,12870,12850,13420], up: true  },
  { sym: "7203", name: "Toyota",    jp: "トヨタ",         price: "¥2,815",  shares: 30, change: "-0.41%", value: "¥84,450",  data: [2920,2905,2918,2896,2910,2888,2902,2878,2895,2858,2875,2815], up: false },
  { sym: "NVDA", name: "Nvidia",    jp: "エヌビディア",   price: "$892.10", shares: 3,  change: "+5.23%", value: "¥402,300", data: [750,790,775,815,798,840,822,856,840,868,852,892], up: true  },
  { sym: "MSFT", name: "Microsoft", jp: "マイクロソフト", price: "$415.32", shares: 5,  change: "-1.08%", value: "¥313,200", data: [440,436,438,432,435,429,432,425,429,421,418,415], up: false },
];

const indices = [
  { name: "NASDAQ",  val: "17,842.12", chg: "+1.24%", data: [16800,16950,16820,17050,16940,17180,17060,17320,17200,17420,17310,17560,17440,17620,17842], up: true  },
  { name: "日経平均", val: "38,451.20", chg: "-0.38%", data: [39200,38950,39100,38750,38920,38600,38780,38450,38620,38451], up: false },
  { name: "S&P 500", val: "5,624.18",  chg: "+0.86%", data: [5480,5510,5490,5530,5512,5548,5530,5568,5549,5585,5564,5602,5580,5610,5624], up: true  },
  { name: "TOPIX",   val: "2,741.18",  chg: "-0.22%", data: [2800,2782,2796,2768,2781,2755,2770,2745,2760,2741], up: false },
];

const sectors = [
  { name: "テクノロジー", chg: "+3.2%", alloc: 62, up: true  },
  { name: "自動車",       chg: "-0.4%", alloc: 8,  up: false },
  { name: "エンタメ",     chg: "+1.6%", alloc: 14, up: true  },
  { name: "現金",         chg: "—",     alloc: 16, up: true  },
];

const transactions = [
  { text: "Apple 10株 購入",    amount: "+¥285,640", time: "2分前",   up: true  },
  { text: "Nvidia 2株 購入",    amount: "+¥253,800", time: "18分前",  up: true  },
  { text: "Tesla 5株 追加購入", amount: "+¥182,320", time: "1時間前", up: true  },
  { text: "Sony 3株 売却",      amount: "-¥40,260",  time: "3時間前", up: false },
  { text: "Toyota 10株 売却",   amount: "-¥28,150",  time: "昨日",    up: false },
  { text: "Microsoft 1株 購入", amount: "+¥61,820",  time: "昨日",    up: true  },
];

const liveChart = [
  3620,3658,3632,3674,3645,3690,3658,3702,3670,3648,
  3684,3718,3692,3730,3706,3748,3720,3762,3734,3778,
  3750,3795,3765,3812,3784,3758,3804,3842,3816,3856,
];

const extendedChart = [
  3420,3458,3432,3468,3445,3480,3455,3492,3468,3440,
  3475,3510,3485,3522,3498,3535,3510,3548,3522,3560,
  3534,3572,3546,3585,3558,3532,3568,3604,3580,3618,
  3595,3634,3610,3650,3626,3665,3642,3680,3658,3700,
];

const timeframes = ["1日", "1週", "1ヶ月", "3ヶ月", "1年", "全期間"];
type Tab = "home" | "portfolio" | "markets" | "profile";

// ─── Root ─────────────────────────────────────────────────────────────────────

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<KumoUser | null>(null);
  const [balance, setBalance] = useState(0);
  const [initialBalance, setInitialBalance] = useState(0);
  const [profit, setProfit] = useState(12.4);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [timeframe, setTimeframe] = useState("1ヶ月");
  const [saltBalance, setSaltBalance] = useState(15623321);

  const balanceRef = useRef(balance);
  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  // Auth guard — redirect to login if no session
  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      navigate({ to: "/login" });
      return;
    }
    setUser(u);
    setBalance(u.balance);
    setInitialBalance(u.balance);
    fetchSiteSaltBalance();

    // Fetch fresh balance from DB so admin edits are reflected immediately
    if (u.id !== "admin") {
      getUserById({ data: { id: u.id } }).then((fresh) => {
        if (fresh) {
          setBalance(fresh.balance);
          setInitialBalance(fresh.balance);
          // Keep localStorage in sync with the authoritative DB value
          try {
            const session = localStorage.getItem("kumo_session");
            if (session) {
              const parsed = JSON.parse(session);
              parsed.balance = fresh.balance;
              localStorage.setItem("kumo_session", JSON.stringify(parsed));
            }
          } catch (e) {
            console.error("localStorage sync error:", e);
          }
        }
      }).catch((err) => {
        console.error("Failed to fetch fresh balance:", err);
      });
    }
  }, [navigate]);

  async function fetchSiteSaltBalance() {
    try {
      const result = await getSiteSetting({ data: { key: "salt_balance" } });
      if (result?.value !== null && result?.value !== undefined) {
        setSaltBalance(Number(result.value));
      }
    } catch (err) {
      console.error("fetchSiteSaltBalance error:", err);
    }
  }

  // Realistic micro-fluctuation (slow, realistic stock-like movements)
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      setBalance((b) => {
        // Fluctuates by up to ±18 Yen with a slight positive bias (average +0.18 Yen per tick)
        const change = (Math.random() - 0.49) * 18;
        const newBalance = Math.round(b + change);

        // Update localStorage instantly so a page refresh doesn't jump back
        const session = localStorage.getItem("kumo_session");
        if (session) {
          try {
            const parsed = JSON.parse(session);
            parsed.balance = newBalance;
            localStorage.setItem("kumo_session", JSON.stringify(parsed));
          } catch (e) {
            console.error("LocalStorage session update error:", e);
          }
        }
        return newBalance;
      });
      
      setProfit((p) =>
        +Math.max(10.5, Math.min(15.8, p + (Math.random() - 0.49) * 0.02)).toFixed(2),
      );
    }, 3500);
    return () => clearInterval(id);
  }, [user]);

  // Periodic background sync to database (every 15 seconds)
  useEffect(() => {
    if (!user || user.id === "admin") return;
    const dbSyncId = setInterval(async () => {
      const currentVal = balanceRef.current;
      try {
        await updateUser({ data: { id: user.id, balance: currentVal } });
      } catch (err) {
        console.error("Failed to sync balance to database:", err);
      }
    }, 15000);
    return () => clearInterval(dbSyncId);
  }, [user]);

  async function handleLogout() {
    if (user && user.id !== "admin") {
      try {
        await updateUser({ data: { id: user.id, balance: balanceRef.current } });
      } catch (err) {
        console.error("Logout balance database sync error:", err);
      }
    }
    logout();
    navigate({ to: "/login" });
  }

  if (!user) return null;

  const fmtY = (n: number) => Math.round(n).toLocaleString("ja-JP");

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] bg-[var(--gradient-radial-gold)] opacity-40" />
      <div className="pointer-events-none fixed -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-gold/8 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-gold/5 blur-3xl" />
      <Particles count={8} />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-gradient-gold shadow-gold">
              <span className="font-display text-base font-semibold text-primary-foreground">K</span>
            </span>
            <span className="font-display text-lg tracking-tight">Kumo Capital</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">ログアウト</span>
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 pb-32">
        {activeTab === "home"      && <HomeTab      user={user} balance={balance} initialBalance={initialBalance} profit={profit} timeframe={timeframe} setTimeframe={setTimeframe} fmtY={fmtY} saltBalance={saltBalance} />}
        {activeTab === "portfolio" && <PortfolioTab />}
        {activeTab === "markets"   && <MarketsTab   />}
        {activeTab === "profile"   && <ProfileTab   user={user} onLogout={handleLogout} />}
      </main>

      <Ticker />

      {/* Bottom nav */}
      <nav
        className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-2.5 shadow-elev"
        style={{
          background: "oklch(0.16 0.006 80 / 0.97)",
          backdropFilter: "blur(28px) saturate(160%)",
          border: "1px solid oklch(1 0 0 / 0.09)",
        }}
      >
        {([
          { id: "home"      as Tab, icon: Home,     label: "ホーム" },
          { id: "portfolio" as Tab, icon: PieChart,  label: "保有"   },
          { id: "markets"   as Tab, icon: LineChart, label: "市場"   },
          { id: "profile"   as Tab, icon: User,      label: "設定"   },
        ]).map((it) => {
          const active = activeTab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setActiveTab(it.id)}
              className={`flex flex-col items-center gap-0.5 rounded-full px-5 py-2 transition-all duration-200 ${
                active ? "bg-gradient-gold shadow-gold" : "hover:bg-white/5"
              }`}
            >
              <it.icon className={`size-[18px] ${active ? "text-primary-foreground" : "text-muted-foreground/60"}`} />
              <span className={`text-[9px] font-medium tracking-wide ${active ? "text-primary-foreground" : "text-muted-foreground/50"}`}>
                {it.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ─── Home tab ─────────────────────────────────────────────────────────────────

function HomeTab({
  user, balance, initialBalance, profit, timeframe, setTimeframe, fmtY, saltBalance,
}: {
  user: KumoUser; balance: number; initialBalance: number; profit: number;
  timeframe: string; setTimeframe: (t: string) => void;
  fmtY: (n: number) => string;
  saltBalance: number;
}) {
  const [animatedSaltBalance, setAnimatedSaltBalance] = useState(saltBalance);
  const [saltModalOpen, setSaltModalOpen] = useState(false);

  useEffect(() => {
    setAnimatedSaltBalance(saltBalance);
  }, [saltBalance]);

  useEffect(() => {
    const id = setInterval(() => {
      setAnimatedSaltBalance((b) => b + Math.round(Math.random() * 850 + 150));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const timeframeData = useMemo(() => {
    // Determine percent change relative to the absolute value to handle negatives properly
    const liveChangePercent = initialBalance !== 0 
      ? ((balance - initialBalance) / Math.abs(initialBalance)) * 100 
      : (balance !== 0 ? (balance > 0 ? 1 : -1) : 0);
    
    let basePct = 0;
    let label = "";
    let profitLabel = "";
    let numPoints = 30;

    switch (timeframe) {
      case "1日":
        basePct = 1.35;
        label = "本日";
        profitLabel = "本日の損益";
        numPoints = 24;
        break;
      case "1週":
        basePct = 4.65;
        label = "今週";
        profitLabel = "今週の損益";
        numPoints = 14;
        break;
      case "1ヶ月":
        basePct = 12.40;
        label = "今月";
        profitLabel = "今月の損益";
        numPoints = 30;
        break;
      case "3ヶ月":
        basePct = 27.30;
        label = "3ヶ月";
        profitLabel = "過去3ヶ月の損益";
        numPoints = 45;
        break;
      case "1年":
        basePct = 47.10;
        label = "1年";
        profitLabel = "過去1年の損益";
        numPoints = 60;
        break;
      case "全期間":
      default:
        basePct = 105.40;
        label = "全期間";
        profitLabel = "全期間の損益";
        numPoints = 80;
        break;
    }

    const pct = +(basePct + liveChangePercent).toFixed(2);
    // Calculate profit based on absolute balance so a positive pct means the value went UP
    const profitAmt = Math.round(Math.abs(balance) * (pct / 100));
    const startVal = balance - profitAmt;

    // Generate beautifully shaped deterministic wave-based chart data points
    const chartData: number[] = [];
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1 || 1);
      let val = startVal + t * (balance - startVal);

      // Waves: combine low frequency sines and higher frequency noise
      // using trigonometric functions of 't' and 'i' (for high frequency deterministic noise)
      const wave1 = Math.sin(t * Math.PI * 3.5) * 0.05;
      const wave2 = Math.cos(t * Math.PI * 8.2) * 0.02;
      const wave3 = Math.sin(i * 2.3) * 0.012; // high-frequency noise

      // Envelope guarantees that startVal is exactly at index 0 (t=0) and balance is exactly at index numPoints-1 (t=1)
      const envelope = Math.sin(t * Math.PI);
      const fluctuation = (wave1 + wave2 + wave3) * envelope * (balance - startVal);

      val += fluctuation;
      chartData.push(Math.round(val));
    }

    return {
      pct,
      label,
      profitLabel,
      profitAmt,
      chartData,
    };
  }, [timeframe, balance, initialBalance]);

  return (
    <>
      <div className="animate-rise mb-8 mt-4">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">ダッシュボード</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">
          お帰りなさい、<span className="text-gradient-gold">{user.displayName}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">本日の市場はあなたに微笑んでいます。</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl glass-gold p-6 md:col-span-2">
          <div className="absolute -right-20 -top-20 size-56 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 size-56 rounded-full bg-[oklch(0.78_0.16_150)]/8 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">総資産</p>
                <p className="mt-2 font-display text-4xl tracking-tight tabular-nums md:text-5xl">
                  ¥{fmtY(balance)}
                </p>
                <p className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                  timeframeData.pct >= 0 
                    ? "bg-[oklch(0.78_0.16_150)]/10 text-[color:var(--success)]" 
                    : "bg-[oklch(0.65_0.2_25)]/10 text-[color:var(--loss)]"
                }`}>
                  {timeframeData.pct >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {timeframeData.label}の利益 {timeframeData.pct >= 0 ? "+" : ""}{timeframeData.pct}% (+¥{fmtY(timeframeData.profitAmt)})
                </p>
              </div>
              <div className="grid size-12 place-items-center rounded-2xl glass-gold">
                <Wallet className="size-5 text-gold" />
              </div>
            </div>
            <div className="mt-6">
              <StockChart data={timeframeData.chartData} width={600} height={120} className="h-32 w-full" color="var(--gold)" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-0.5">
              {timeframes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all ${
                    timeframe === t ? "bg-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          <StatCard 
            label={timeframeData.profitLabel} 
            value={`${timeframeData.pct >= 0 ? "+" : "-"}¥${fmtY(Math.abs(timeframeData.profitAmt))}`} 
            up={timeframeData.pct >= 0} 
          />
          <StatCard label="保有銘柄"     value="6銘柄" />
          <StatCard label="現金残高"     value={`¥${fmtY(Math.round(balance * 0.16))}`} />
          <StatCard 
            label="期間リターン" 
            value={`${timeframeData.pct >= 0 ? "+" : ""}${timeframeData.pct}%`} 
            up={timeframeData.pct >= 0} 
          />
        </div>
      </div>

      <section className="mt-10">
        <SectionHeader title="市場概要" icon={TrendingUp} subtitle="主要インデックス" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {indices.map((idx) => (
            <div key={idx.name} className="relative overflow-hidden rounded-3xl glass p-5 transition hover:border-gold/30">
              <p className="text-xs text-muted-foreground">{idx.name}</p>
              <p className="mt-1 font-display text-xl tracking-tight tabular-nums">{idx.val}</p>
              <p className={`mt-0.5 text-xs ${idx.up ? "text-[color:var(--success)]" : "text-[color:var(--loss)]"}`}>{idx.chg}</p>
              <div className="mt-2">
                <StockChart data={idx.data} width={220} height={36} className="h-9 w-full" color={idx.up ? "var(--gold)" : "var(--loss)"} fill={false} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader title="最近の取引" icon={Wallet} subtitle="ご利用履歴" />
        <div className="overflow-hidden rounded-3xl glass">
          <ul className="divide-y divide-white/5">
            {transactions.map((t, i) => (
              <li key={i} className="flex items-center justify-between px-5 py-4 transition hover:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className={`grid size-10 place-items-center rounded-2xl ${t.up ? "glass-gold" : "glass"}`}>
                    {t.up ? <ArrowUpRight className="size-4 text-[color:var(--success)]" /> : <ArrowDownRight className="size-4 text-[color:var(--loss)]" />}
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

      <section className="mt-10 mb-6">
        <button
          onClick={() => setSaltModalOpen(true)}
          className="w-full text-left relative overflow-hidden rounded-[2rem] glass p-6 md:p-8 transition hover:border-gold/30 hover:shadow-gold cursor-pointer"
        >
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-[oklch(0.78_0.16_150)]/5 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Award className="size-3 text-gold" />
                ソルトクン投資 ——&gt; Salt-San investment
              </p>
              <p className="mt-3 font-display text-4xl tracking-tight tabular-nums md:text-5xl text-foreground">
                ¥{fmtY(animatedSaltBalance)}
              </p>
              <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-[oklch(0.78_0.16_150)]/10 px-3 py-1 text-xs text-[color:var(--success)]">
                <ArrowUpRight className="size-3" /> 継続成長中
              </p>
            </div>
            <div className="flex items-center gap-3 md:flex-col md:items-end">
              <div className="hidden md:grid size-16 place-items-center rounded-3xl glass-gold shrink-0">
                <TrendingUp className="size-7 text-gold" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full glass-gold px-3 py-1.5 text-[11px] text-gold">
                <ChevronRight className="size-3" /> 詳細を見る
              </span>
            </div>
          </div>
        </button>
      </section>

      {/* Salt-San holdings modal */}
      {saltModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSaltModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl glass-gold p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Salt-San ポートフォリオ</p>
                <h2 className="mt-1 font-display text-2xl tracking-tight">投資銘柄一覧</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  総評価額 ¥{fmtY(animatedSaltBalance)}
                </p>
              </div>
              <button
                onClick={() => setSaltModalOpen(false)}
                className="grid size-9 place-items-center rounded-full glass text-muted-foreground transition hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {holdings.map((h) => (
                <div
                  key={h.sym}
                  className="flex items-center gap-4 rounded-2xl glass p-4 transition hover:border-gold/20"
                >
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-neutral-900 to-black text-sm font-semibold text-gold ring-1 ring-[color:var(--gold)]/30">
                    {h.sym.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-sm">{h.sym}</p>
                      <p className="text-xs text-muted-foreground">{h.jp}</p>
                    </div>
                    <div className="mt-1">
                      <StockChart
                        data={h.data}
                        width={160}
                        height={28}
                        className="h-7 w-40"
                        color={h.up ? "var(--gold)" : "var(--loss)"}
                        fill={false}
                        animate={false}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-base tabular-nums">{h.price}</p>
                    <p className={`text-xs ${h.up ? "text-[color:var(--success)]" : "text-[color:var(--loss)]"}`}>
                      {h.change}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{h.shares}株</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-center text-[10px] text-muted-foreground">
              Salt-San の運用するポートフォリオ · リアルタイム更新中
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Portfolio tab ─────────────────────────────────────────────────────────────

function PortfolioTab() {
  return (
    <>
      <div className="animate-rise mb-8 mt-4">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">ポートフォリオ</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">保有株式</h1>
        <p className="mt-2 text-sm text-muted-foreground">6銘柄 · 総評価額 ¥1,799,750</p>
      </div>

      <section className="mb-10">
        <SectionHeader title="セクター配分" icon={PieChart} subtitle="資産配分" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((s) => (
            <div key={s.name} className="rounded-3xl glass p-5">
              <p className="text-xs text-muted-foreground">{s.name}</p>
              <p className="mt-2 font-display text-2xl tracking-tight">{s.alloc}%</p>
              <div className="mt-2 h-1 rounded-full bg-white/10">
                <div className="h-1 rounded-full bg-gradient-gold" style={{ width: `${s.alloc}%` }} />
              </div>
              <p className={`mt-2 text-xs ${s.up ? "text-[color:var(--success)]" : "text-[color:var(--loss)]"}`}>{s.chg}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="保有銘柄" icon={TrendingUp} subtitle="個別株" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {holdings.map((h) => (
            <div key={h.sym} className="group relative overflow-hidden rounded-3xl glass p-5 transition hover:border-gold/30 hover:shadow-gold">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-gold/5 blur-2xl transition group-hover:bg-gold/10" />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-neutral-900 to-black text-sm font-semibold text-gold ring-1 ring-[color:var(--gold)]/30">
                    {h.sym.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-display text-base">{h.sym}</p>
                    <p className="text-xs text-muted-foreground">{h.jp}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${h.up ? "bg-[oklch(0.78_0.16_150)]/10 text-[color:var(--success)]" : "bg-[oklch(0.65_0.2_25)]/10 text-[color:var(--loss)]"}`}>
                  {h.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}{h.change}
                </span>
              </div>
              <div className="relative mt-4">
                <StockChart data={h.data} width={300} height={56} className="h-14 w-full" color={h.up ? "var(--gold)" : "var(--loss)"} />
              </div>
              <div className="relative mt-3 flex items-end justify-between">
                <div>
                  <p className="font-display text-xl tracking-tight tabular-nums">{h.price}</p>
                  <p className="text-xs text-muted-foreground">{h.shares}株保有</p>
                </div>
                <div className="text-right">
                  <p className="text-sm tabular-nums">{h.value}</p>
                  <p className="text-xs text-muted-foreground">評価額</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ─── Markets tab ──────────────────────────────────────────────────────────────

function MarketsTab() {
  return (
    <>
      <div className="animate-rise mb-8 mt-4">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">マーケット</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">市場概要</h1>
        <p className="mt-2 text-sm text-muted-foreground">主要指数とリアルタイムデータ</p>
      </div>

      <section className="mb-10">
        <SectionHeader title="主要インデックス" icon={Globe2} subtitle="グローバル市場" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {indices.map((idx) => (
            <div key={idx.name} className="relative overflow-hidden rounded-3xl glass p-5 transition hover:border-gold/30">
              <p className="text-xs text-muted-foreground">{idx.name}</p>
              <p className="mt-1 font-display text-2xl tracking-tight tabular-nums">{idx.val}</p>
              <p className={`mt-0.5 text-xs ${idx.up ? "text-[color:var(--success)]" : "text-[color:var(--loss)]"}`}>{idx.chg}</p>
              <div className="mt-3">
                <StockChart data={idx.data} width={220} height={40} className="h-10 w-full" color={idx.up ? "var(--gold)" : "var(--loss)"} fill={false} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="ポートフォリオ推移" icon={LineChart} subtitle="リアルタイムチャート" />
        <div className="relative overflow-hidden rounded-[2rem] glass-gold p-6 md:p-10">
          <div className="absolute -right-32 -top-32 size-96 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-gold/8 blur-3xl" />
          <div className="relative">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--success)]" />
                ライブ配信中 · 遅延 0秒
              </div>
              <p className="font-display text-xl tracking-tight text-[color:var(--success)]">+¥128,420</p>
            </div>
            <p className="mb-5 text-xs text-muted-foreground">過去40取引セッション</p>
            <StockChart data={extendedChart} width={1100} height={220} className="h-56 w-full md:h-72" color="var(--gold)" />
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Profile tab ──────────────────────────────────────────────────────────────

function ProfileTab({ user, onLogout }: { user: KumoUser; onLogout: () => void }) {
  return (
    <>
      <div className="animate-rise mb-8 mt-4">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">アカウント</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">プロフィール</h1>
      </div>

      <div className="mb-5 relative overflow-hidden rounded-3xl glass-gold p-6">
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-2xl bg-gradient-gold shadow-gold">
            <span className="font-display text-2xl font-bold text-primary-foreground">
              {user.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-display text-xl">{user.displayName}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] text-gold">
              <Award className="size-3" /> プレミアム会員
            </span>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <StatCard label="総資産"  value={`¥${Math.round(user.balance).toLocaleString("ja-JP")}`} />
        <StatCard label="利益率"  value="+12.4%" up />
        <StatCard label="取引数"  value="147回" />
      </div>

      <div className="mb-5 overflow-hidden rounded-3xl glass p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">リスクプロフィール</p>
            <p className="mt-1 font-display text-xl">成長型</p>
            <p className="mt-0.5 text-xs text-muted-foreground">中〜高リスク · 長期投資</p>
          </div>
          <div className="grid size-12 place-items-center rounded-2xl glass-gold">
            <Shield className="size-5 text-gold" />
          </div>
        </div>
        <div className="mt-4 flex gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={`h-1.5 flex-1 rounded-full ${n <= 3 ? "bg-gradient-gold" : "bg-white/10"}`} />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl glass">
        {["通知設定", "セキュリティ", "支払い方法", "取引履歴", "プライバシー"].map((item, i, arr) => (
          <button
            key={item}
            className={`flex w-full items-center justify-between px-5 py-4 text-sm transition hover:bg-white/[0.03] ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
          >
            {item}
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-between border-t border-white/5 px-5 py-4 text-sm text-[color:var(--loss)] transition hover:bg-white/[0.03]"
        >
          ログアウト
          <LogOut className="size-4" />
        </button>
      </div>
    </>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function StatCard({ label, value, up }: { label: string; value: string; up?: boolean }) {
  return (
    <div className="rounded-3xl glass p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-xl tracking-tight tabular-nums ${up ? "text-[color:var(--success)]" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function SectionHeader({
  title, subtitle, icon: Icon,
}: {
  title: string; subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
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
