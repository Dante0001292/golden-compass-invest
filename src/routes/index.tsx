import { createFileRoute } from "@tanstack/react-router";
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
      { title: "Aurea — Premium investing in US & Japanese stocks" },
      {
        name: "description",
        content:
          "Aurea is the luxury investing app for beginners. Trade Apple, Tesla, Sony, Toyota and Nvidia with cinematic clarity, real-time prices and bank-grade security.",
      },
      { property: "og:title", content: "Aurea — Premium investing, beautifully simple" },
      { property: "og:description", content: "Trade US & Japanese stocks from one elegant app." },
    ],
  }),
});

const markets = [
  { sym: "TSLA", name: "Tesla, Inc.", flag: "🇺🇸", price: "248.42", change: "+3.74%", data: [10, 12, 11, 14, 13, 16, 18, 17, 20, 22, 24, 26], up: true },
  { sym: "AAPL", name: "Apple Inc.", flag: "🇺🇸", price: "192.31", change: "+2.18%", data: [14, 13, 15, 14, 16, 17, 18, 19, 20, 21, 22, 23], up: true },
  { sym: "NVDA", name: "NVIDIA Corp.", flag: "🇺🇸", price: "892.10", change: "+5.23%", data: [8, 10, 11, 13, 12, 15, 17, 18, 20, 24, 27, 30], up: true },
  { sym: "6758", name: "Sony Group", flag: "🇯🇵", price: "¥13,420", change: "+1.62%", data: [12, 13, 12, 14, 13, 14, 15, 16, 16, 17, 18, 19], up: true },
  { sym: "7203", name: "Toyota Motor", flag: "🇯🇵", price: "¥2,815", change: "-0.41%", data: [18, 17, 18, 16, 17, 15, 16, 14, 15, 14, 13, 14], up: false },
  { sym: "9984", name: "SoftBank Group", flag: "🇯🇵", price: "¥9,210", change: "+2.04%", data: [10, 11, 10, 12, 13, 14, 13, 15, 16, 17, 18, 19], up: true },
];

const features = [
  { icon: Zap, title: "Start in 90 seconds", text: "Onboard with a photo of your ID. No paperwork, no waiting." },
  { icon: Globe2, title: "US + Japan, one app", text: "Trade 4,000+ NYSE, Nasdaq and TSE stocks side by side." },
  { icon: LineChart, title: "Designed for beginners", text: "Plain-English insights, glanceable charts, zero jargon." },
  { icon: Wallet, title: "Fractional shares", text: "Own a slice of Apple or Sony from just $1." },
];

const securityPoints = [
  { icon: ShieldCheck, title: "SIPC & JSDA protected", text: "Assets insured up to $500,000 across regulated custodians." },
  { icon: Lock, title: "Biometric vault", text: "FaceID, hardware-backed keys, and isolated cold storage." },
  { icon: Sparkles, title: "Independently audited", text: "SOC 2 Type II, ISO 27001, and quarterly penetration tests." },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[80vh] bg-[var(--gradient-radial-gold)] opacity-60" />
      <div className="pointer-events-none fixed -left-40 top-1/3 h-[600px] w-[600px] rounded-full bg-[oklch(0.82_0.14_85)] opacity-[0.07] blur-3xl" />
      <div className="pointer-events-none fixed -right-40 top-2/3 h-[500px] w-[500px] rounded-full bg-[oklch(0.82_0.14_85)] opacity-[0.05] blur-3xl" />

      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-gradient-gold shadow-gold">
              <span className="font-display text-base font-semibold text-primary-foreground">A</span>
            </span>
            <span className="font-display text-lg tracking-tight">Aurea</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#markets" className="hover:text-foreground">Markets</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#app" className="hover:text-foreground">App</a>
            <a href="#security" className="hover:text-foreground">Security</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="/login" className="hidden rounded-full border border-border px-4 py-2 text-sm text-foreground/80 hover:border-gold/50 hover:text-foreground sm:inline-flex">Sign in</a>
            <a href="/signup" className="rounded-full bg-gradient-gold px-4 py-2 text-sm font-medium text-primary-foreground shadow-gold transition hover:scale-[1.02]">
              Sign up
            </a>
            <button className="grid size-10 place-items-center rounded-full glass md:hidden" aria-label="Menu">
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <Particles />
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-12 md:pt-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="animate-rise text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full glass-gold px-3 py-1 text-xs text-gold">
                <span className="size-1.5 animate-pulse rounded-full bg-gold" />
                Live in US & Japan
              </span>
              <h1 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
                Investing,
                <br />
                <span className="text-gradient-gold">refined.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground md:mx-0 md:text-lg">
                A cinematic, beginner-friendly way to own Apple, Tesla, Sony, Toyota and Nvidia — from a single, beautifully crafted app.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row md:justify-start">
                <a href="/signup" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-4 text-base font-medium text-primary-foreground shadow-gold transition hover:scale-[1.02]">
                  Sign up
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </a>
                <a href="/login" className="inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-4 text-base font-medium text-foreground hover:border-gold/40">
                  Sign in
                </a>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground md:justify-start">
                <div>
                  <p className="font-display text-xl text-foreground">4.9<span className="text-gold">★</span></p>
                  <p>App Store</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="font-display text-xl text-foreground">1.2M+</p>
                  <p>Investors</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="font-display text-xl text-foreground">$0</p>
                  <p>Commission</p>
                </div>
              </div>
            </div>

            <div className="relative mt-8 md:mt-0">
              {/* Floating widgets */}
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
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Today</p>
                <p className="font-display text-xl text-foreground">+$1,284<span className="text-gold">.20</span></p>
              </div>
              <div
                className="pointer-events-none absolute -bottom-2 left-4 z-20 rounded-2xl glass px-4 py-3 shadow-elev md:left-2"
                style={{ animation: "float-soft 7s ease-in-out 0.5s infinite" }}
              >
                <div className="flex items-center gap-2">
                  <div className="size-2 animate-pulse rounded-full bg-[color:var(--success)]" />
                  <p className="text-xs text-foreground/80">Markets open · TYO 🇯🇵</p>
                </div>
              </div>

              <PhoneMockup />
            </div>
          </div>
        </div>
        <Ticker />
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Why Aurea</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
            Built for the next <span className="text-gradient-gold">generation</span> of investors.
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

      {/* Live markets */}
      <section id="markets" className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Live markets</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              The world's best companies, <br /> at a glance.
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--success)]" />
            Real-time · delayed 0s
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

      {/* App Showcase */}
      <section id="app" className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] glass-gold p-8 md:p-16">
          <div className="absolute -right-32 -top-32 size-96 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">The Aurea App</p>
              <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl">
                Your portfolio, choreographed.
              </h2>
              <p className="mt-5 max-w-md text-muted-foreground">
                Every gesture is intentional. Every chart, alive. Watch your holdings breathe with the market — beautifully animated, instantly readable.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "Glanceable balance with one-tap insights",
                  "Animated charts for every timeframe",
                  "Smart alerts that learn your style",
                  "One-tap buy with biometric confirmation",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="grid size-6 place-items-center rounded-full glass-gold">
                      <ChevronRight className="size-3 text-gold" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center md:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Security</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
            Quiet vault. <span className="text-gradient-gold">Loud trust.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Your capital deserves bank-grade defense — built by engineers from Goldman Sachs, Apple and Mizuho.
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

      {/* CTA */}
      <section className="relative mx-auto max-w-6xl px-5 py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[color:var(--gold)]/30 bg-gradient-to-br from-black via-neutral-950 to-black p-10 text-center md:p-20">
          <div className="absolute inset-0 bg-[var(--gradient-radial-gold)] opacity-60" />
          <Particles count={14} />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Begin</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">
              Wealth, <span className="text-gradient-gold">elegantly</span> within reach.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-muted-foreground">
              Join 1.2M investors trading the world's most iconic companies on Aurea.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-7 py-4 text-base font-medium text-primary-foreground shadow-gold transition hover:scale-[1.02]">
                Sign up
                <ArrowRight className="size-4" />
              </a>
              <a href="/login" className="inline-flex items-center justify-center gap-2 rounded-full glass px-7 py-4 text-base font-medium text-foreground hover:border-gold/40">
                Sign in
              </a>
            </div>
            <p className="mt-6 text-[11px] text-muted-foreground">
              Investing involves risk. Past performance is no guarantee of future results.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full bg-gradient-gold">
              <span className="font-display text-sm font-semibold text-primary-foreground">A</span>
            </span>
            <span className="font-display tracking-tight">Aurea</span>
            <span className="ml-3 text-xs text-muted-foreground">© 2026 · Tokyo · New York</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Disclosures</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Press</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
