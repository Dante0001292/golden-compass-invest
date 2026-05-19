import { useEffect, useState } from "react";
import { StockChart } from "./StockChart";
import { ArrowUpRight, Home, PieChart, Search, User } from "lucide-react";

const holdings = [
  { sym: "TSLA", name: "テスラ",       price: "248.42", change: "+3.74%", data: [225, 238, 227, 244, 235, 248, 236, 252, 240, 248], up: true  },
  { sym: "AAPL", name: "アップル",     price: "192.31", change: "+2.18%", data: [182, 183, 181, 184, 182, 185, 183, 186, 184, 192], up: true  },
  { sym: "6758", name: "ソニー",       price: "13,420", change: "+1.62%", data: [12700, 12750, 12725, 12780, 12800, 12840, 12820, 12870, 12850, 13420], up: true  },
  { sym: "7203", name: "トヨタ",       price: "2,815",  change: "-0.41%", data: [2920, 2905, 2918, 2896, 2910, 2888, 2902, 2878, 2855, 2815], up: false },
  { sym: "NVDA", name: "エヌビディア", price: "892.10", change: "+5.23%", data: [750, 790, 775, 815, 798, 840, 822, 858, 842, 892], up: true  },
];

// Realistic 22-point portfolio chart
const chartData = [
  3620, 3658, 3634, 3672, 3648, 3690, 3658, 3635, 3665, 3698,
  3672, 3710, 3685, 3720, 3695, 3730, 3706, 3742, 3718, 3755,
  3730, 3768,
];

export function PhoneMockup() {
  const [balance, setBalance] = useState(3_820_440);
  const [delta, setDelta] = useState(124_800);

  useEffect(() => {
    const id = setInterval(() => {
      const tick = (Math.random() - 0.4) * 60;
      setBalance((b) => Math.round(b + tick));
      setDelta((d) => Math.round(d + Math.abs(tick) * 0.3));
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const fmt = (n: number) => Math.round(n).toLocaleString("ja-JP");
  const pct = ((delta / (balance - delta)) * 100).toFixed(2);

  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px] animate-float [transform-style:preserve-3d]">
      <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,var(--gold)_0%,transparent_60%)] opacity-20 blur-3xl" />

      <div className="relative rounded-[3rem] bg-gradient-to-b from-neutral-800 to-black p-[3px] shadow-elev">
        <div className="rounded-[2.85rem] bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-2">
          <div className="relative overflow-hidden rounded-[2.4rem] bg-background">
            <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

            <div className="px-5 pb-6 pt-3">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>9:41</span>
                <span className="flex gap-1 opacity-70">●●●●</span>
              </div>

              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">総資産</p>
                <p className="font-display text-2xl tracking-tight text-foreground tabular-nums">¥{fmt(balance)}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[color:var(--success)] tabular-nums">
                  <ArrowUpRight className="size-3" /> +¥{fmt(delta)} ({pct}%) 本日
                </p>
              </div>

              <div className="relative mt-4 overflow-hidden rounded-2xl glass-gold p-3">
                <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                  <span>1日</span><span>1週</span>
                  <span className="rounded-full bg-gold px-2 py-0.5 text-[9px] font-medium text-primary-foreground">1ヶ月</span>
                  <span>3ヶ月</span><span>1年</span>
                </div>
                <StockChart data={chartData} width={260} height={64} className="mt-1 h-16 w-full" />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-medium text-foreground">保有株式</p>
                  <p className="text-[10px] text-gold">すべて見る</p>
                </div>
                <div className="space-y-2">
                  {holdings.slice(0, 4).map((h) => (
                    <div key={h.sym} className="flex items-center justify-between rounded-xl glass px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-neutral-800 to-black text-[9px] font-semibold text-gold ring-1 ring-[color:var(--gold)]/30">
                          {h.sym.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-[11px] font-medium leading-tight text-foreground">{h.sym}</p>
                          <p className="text-[9px] leading-tight text-muted-foreground">{h.name}</p>
                        </div>
                      </div>
                      <StockChart
                        data={h.data} width={50} height={18}
                        className="h-4 w-12"
                        color={h.up ? "var(--gold)" : "var(--loss)"}
                        fill={false} animate={false}
                      />
                      <div className="text-right">
                        <p className="text-[10px] font-medium text-foreground">{h.price.includes(",") ? `¥${h.price}` : `$${h.price}`}</p>
                        <p className={`text-[9px] ${h.up ? "text-[color:var(--success)]" : "text-[color:var(--loss)]"}`}>{h.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-around border-t border-white/5 bg-black/60 px-6 py-3 backdrop-blur">
              {[Home, PieChart, Search, User].map((Icon, i) => (
                <Icon key={i} className={`size-4 ${i === 0 ? "text-gold" : "text-muted-foreground"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
