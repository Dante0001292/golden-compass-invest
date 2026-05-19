import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Globe2,
  LineChart,
  Lock,
  Menu,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { Particles } from "@/components/landing/Particles";
import { StockChart } from "@/components/landing/StockChart";
import { Ticker } from "@/components/landing/Ticker";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aurea — 米国・日本株のプレミアム投資アプリ" },
      {
        name: "description",
        content:
          "Aureaは初心者向けの上質な投資プラットフォーム。Apple、Tesla、Sony、Toyota、Nvidiaをリアルタイム価格と銀行水準のセキュリティで取引できます。",
      },
      { property: "og:title", content: "Aurea — 投資を、より美しく。" },
      { property: "og:description", content: "米国株と日本株を、ひとつの上質なアプリで。" },
    ],
  }),
});

const markets = [
  { sym: "TSLA", name: "テスラ", flag: "🇺🇸", price: "248.42", change: "+3.74%", data: [10, 12, 11, 14, 13, 16, 18, 17, 20, 22, 24, 26], up: true },
  { sym: "AAPL", name: "アップル", flag: "🇺🇸", price: "192.31", change: "+2.18%", data: [14, 13, 15, 14, 16, 17, 18, 19, 20, 21, 22, 23], up: true },
  { sym: "NVDA", name: "エヌビディア", flag: "🇺🇸", price: "892.10", change: "+5.23%", data: [8, 10, 11, 13, 12, 15, 17, 18, 20, 24, 27, 30], up: true },
  { sym: "6758", name: "ソニーグループ", flag: "🇯🇵", price: "¥13,420", change: "+1.62%", data: [12, 13, 12, 14, 13, 14, 15, 16, 16, 17, 18, 19], up: true },
  { sym: "7203", name: "トヨタ自動車", flag: "🇯🇵", price: "¥2,815", change: "-0.41%", data: [18, 17, 18, 16, 17, 15, 16, 14, 15, 14, 13, 14], up: false },
  { sym: "9984", name: "ソフトバンクG", flag: "🇯🇵", price: "¥9,210", change: "+2.04%", data: [10, 11, 10, 12, 13, 14, 13, 15, 16, 17, 18, 19], up: true },
];

const features = [
  { icon: Zap, title: "90秒で開設", text: "本人確認書類の写真だけ。書類のやりとりも待ち時間も不要です。" },
  { icon: Globe2, title: "米国＋日本、ひとつに", text: "NYSE、Nasdaq、東証の4,000銘柄以上を並べて取引。" },
  { icon: LineChart, title: "初心者のために", text: "難解な用語ゼロ。やさしい言葉とひと目で分かるチャート。" },
  { icon: Wallet, title: "1株未満から", text: "¥100から、AppleやSonyの一部を保有できます。" },
];

const securityPoints = [
  { icon: ShieldCheck, title: "SIPC・JSDA加入", text: "規制下のカストディアンで最大$500,000まで資産を保護。" },
  { icon: Lock, title: "生体認証ボルト", text: "Face ID、ハードウェアキー、隔離されたコールドストレージ。" },
  { icon: Sparkles, title: "第三者監査済み", text: "SOC 2 Type II、ISO 27001、四半期ごとの侵入テスト。" },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[80vh] bg-[var(--gradient-radial-gold)] opacity-60" />
      <div className="pointer-events-none fixed -left-40 top-1/3 h-[600px] w-[600px] rounded-full bg-[oklch(0.82_0.14_85)] opacity-[0.07] blur-3xl" />
      <div className="pointer-events-none fixed -right-40 top-2/3 h-[500px] w-[500px] rounded-full bg-[oklch(0.82_0.14_85)] opacity-[0.05] blur-3xl" />

      <header className="sticky top-0 z-50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-gradient-gold shadow-gold">
              <span className="font-display text-base font-semibold text-primary-foreground">A</span>
            </span>
            <span className="font-display text-lg tracking-tight">Aurea</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#markets" className="hover:text-foreground">マーケット</a>
            <a href="#features" className="hover:text-foreground">特長</a>
            <a href="#app" className="hover:text-foreground">アプリ</a>
            <a href="#security" className="hover:text-foreground">セキュリティ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden rounded-full border border-border px-4 py-2 text-sm text-foreground/80 hover:border-gold/50 hover:text-foreground sm:inline-flex">ログイン</Link>
            <Link to="/signup" className="rounded-full bg-gradient-gold px-4 py-2 text-sm font-medium text-primary-foreground shadow-gold transition hover:scale-[1.02]">
              新規登録
            </Link>
            <button className="grid size-10 place-items-center rounded-full glass md:hidden" aria-label="メニュー">
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <section className="relative">
        <Particles />
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-12 md:pt-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="animate-rise text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full glass-gold px-3 py-1 text-xs text-gold">
                <span className="size-1.5 animate-pulse rounded-full bg-gold" />
                米国・日本でライブ取引中
              </span>
              <h1 className="mt-5 font-display text-5xl leading-[1.1] tracking-tight md:text-7xl">
                投資を、
                <br />
                <span className="text-gradient-gold">洗練する。</span>
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground md:mx-0 md:text-lg">
                Apple、Tesla、Sony、Toyota、Nvidia——世界の名だたる企業を、ひとつの美しいアプリで。初心者にやさしく、上質に。
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row md:justify-start">
                <Link to="/signup" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-4 text-base font-medium text-primary-foreground shadow-gold transition hover:scale-[1.02]">
                  新規登録
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-4 text-base font-medium text-foreground hover:border-gold/40">
                  ログイン
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground md:justify-start">
                <div>
                  <p className="font-display text-xl text-foreground">4.9<span className="text-gold">★</span></p>
                  <p>App Store評価</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="font-display text-xl text-foreground">120万+</p>
                  <p>投資家</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="font-display text-xl text-foreground">¥0</p>
                  <p>取引手数料</p>
                </div>
              </div>
            </div>

            <div className="relative mt-8 md:mt-0">
              <div className="pointer-events-none absolute -left-2 top-8 z-20 animate-float-soft rounded-2xl glass px-4 py-3 shadow-elev md:-left-10">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-neutral-800 to-black text-[10px] font-semibold text-gold ring-1 ring-[color:var(--gold)]/30">NV</div>
                  <div>
                    <p className="text-xs font-medium">NVDA</p>
                    <p className="text-[10px] text-[color:var(--success)]">+5.23%</p>
                  </div>
                  <StockChart data={[8,11,10,14,13,17,20,24]} width={50} height={18} className="h-5 w-14" color="var(--success)" fill={false} />
                </div>
              </div>
              <div
                className="pointer-events-none absolute -right-2 top-32 z-20 rounded-2xl glass-gold px-4 py-3 shadow-gold md:-right-6"
                style={{ animation: "float-soft 6s ease-in-out 1s infinite" }}
              >
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">本日</p>
                <p className="font-display text-xl text-foreground">+¥128,420</p>
              </div>
              <div
                className="pointer-events-none absolute -bottom-2 left-4 z-20 rounded-2xl glass px-4 py-3 shadow-elev md:left-2"
                style={{ animation: "float-soft 7s ease-in-out 0.5s infinite" }}
              >
                <div className="flex items-center gap-2">
                  <div className="size-2 animate-pulse rounded-full bg-[color:var(--success)]" />
                  <p className="text-xs text-foreground/80">東京証券取引所 営業中 🇯🇵</p>
                </div>
              </div>

              <PhoneMockup />
            </div>
          </div>
        </div>
        <Ticker />
      </section>

      <section id="features" className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Aureaが選ばれる理由</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
            次世代の投資家のために、<span className="text-gradient-gold">設計されました。</span>
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-3xl glass p-6 transition hover:border-gold/30"
            >
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-gold/10 blur-2xl transition group-hover:bg-gold/20" />
              <div className="relative">
                <div className="grid size-11 place-items-center rounded-2xl glass-gold">
                  <f.icon className="size-5 text-gold" />
                </div>
                <h3 className="mt-5 font-display text-lg text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="markets" className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">ライブマーケット</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              世界を動かす企業を、<br /> ひと目で。
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--success)]" />
            リアルタイム配信中
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((m) => (
            <div
              key={m.sym}
              className="group relative overflow-hidden rounded-3xl glass p-5 transition hover:border-gold/30 hover:shadow-gold"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-neutral-900 to-black text-sm font-semibold text-gold ring-1 ring-[color:var(--gold)]/20">
                    {m.sym.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-display text-base text-foreground">{m.sym} <span className="ml-1 text-xs">{m.flag}</span></p>
                    <p className="text-xs text-muted-foreground">{m.name}</p>
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-gold" />
              </div>
              <div className="mt-4">
                <StockChart data={m.data} width={300} height={60} className="h-16 w-full" color={m.up ? "var(--gold)" : "var(--loss)"} />
              </div>
              <div className="mt-3 flex items-end justify-between">
                <p className="font-display text-2xl tracking-tight text-foreground">{m.price.startsWith("¥") ? m.price : `$${m.price}`}</p>
                <p className={`text-sm font-medium ${m.up ? "text-[color:var(--success)]" : "text-[color:var(--loss)]"}`}>{m.change}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="app" className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] glass-gold p-8 md:p-16">
          <div className="absolute -right-32 -top-32 size-96 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Aurea アプリ</p>
              <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl">
                あなたのポートフォリオを、振付ける。
              </h2>
              <p className="mt-5 max-w-md text-muted-foreground">
                すべての操作に意味を。すべてのチャートに鼓動を。市場とともに呼吸するポートフォリオを、美しく、瞬時に。
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "ひと目で分かる残高とワンタップ分析",
                  "全期間に対応したアニメーション付きチャート",
                  "あなたのスタイルを学ぶスマート通知",
                  "生体認証でワンタップ売買",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="grid size-6 place-items-center rounded-full glass-gold">
                      <ChevronRight className="size-3 text-gold" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold">新規登録</Link>
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium">ログイン</Link>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      <section id="security" className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">セキュリティ</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
            静かなる金庫。<span className="text-gradient-gold">確かなる信頼。</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            ゴールドマン・サックス、Apple、みずほ出身のエンジニアが設計した、銀行水準の防御。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {securityPoints.map((s) => (
            <div key={s.title} className="relative rounded-3xl glass p-8 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full glass-gold glow-gold">
                <s.icon className="size-6 text-gold" />
              </div>
              <h3 className="mt-5 font-display text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[color:var(--gold)]/30 bg-gradient-to-br from-black via-neutral-950 to-black p-10 text-center md:p-20">
          <div className="absolute inset-0 bg-[var(--gradient-radial-gold)] opacity-60" />
          <Particles count={14} />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">はじめる</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">
              豊かさを、<span className="text-gradient-gold">優雅に</span>手のひらへ。
            </h2>
            <p className="mx-auto mt-5 max-w-md text-muted-foreground">
              120万人の投資家が、世界の名だたる企業をAureaで取引しています。
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-7 py-4 text-base font-medium text-primary-foreground shadow-gold transition hover:scale-[1.02]">
                新規登録
                <ArrowRight className="size-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full glass px-7 py-4 text-base font-medium text-foreground hover:border-gold/40">
                ログイン
              </Link>
            </div>
            <p className="mt-6 text-[11px] text-muted-foreground">
              投資にはリスクが伴います。過去の運用実績は将来の成果を保証するものではありません。
            </p>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full bg-gradient-gold">
              <span className="font-display text-sm font-semibold text-primary-foreground">A</span>
            </span>
            <span className="font-display tracking-tight">Aurea</span>
            <span className="ml-3 text-xs text-muted-foreground">© 2026 · 東京 · ニューヨーク</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">開示事項</a>
            <a href="#" className="hover:text-foreground">プライバシー</a>
            <a href="#" className="hover:text-foreground">利用規約</a>
            <a href="#" className="hover:text-foreground">プレス</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
