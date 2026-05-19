import { useEffect, useState } from "react";
import { StockChart } from "./StockChart";
import { ArrowUpRight, Bell, Home, PieChart, Search, User } from "lucide-react";

const holdings = [
  { sym: "TSLA", name: "Tesla", price: "248.42", change: "+3.74%", data: [10, 12, 11, 14, 13, 16, 18, 17, 20, 22], up: true },
  { sym: "AAPL", name: "Apple", price: "192.31", change: "+2.18%", data: [14, 13, 15, 14, 16, 17, 18, 19, 20, 21], up: true },
  { sym: "6758", name: "Sony", price: "13,420", change: "+1.62%", data: [12, 13, 12, 14, 13, 14, 15, 16, 16, 17], up: true },
  { sym: "7203", name: "Toyota", price: "2,815", change: "-0.41%", data: [18, 17, 18, 16, 17, 15, 16, 14, 15, 14], up: false },
  { sym: "NVDA", name: "Nvidia", price: "892.10", change: "+5.23%", data: [8, 10, 11, 13, 12, 15, 17, 18, 20, 24], up: true },
];

const chartData = [22, 24, 21, 26, 28, 25, 30, 29, 33, 32, 36, 38, 35, 42, 44, 46, 43, 48, 52, 50, 56, 60];

export function PhoneMockup() {
  const [balance, setBalance] = useState(48392.5);
  const [delta, setDelta] = useState(1284.2);

  useEffect(() => {
    const id = setInterval(() => {
      // Always increase: small random positive tick
      const tick = Math.random() * 12 + 1.5;
      setBalance((b) => b + tick);
      setDelta((d) => d + tick);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [whole, cents] = fmt(balance).split(".");
  const pct = ((delta / (balance - delta)) * 100).toFixed(2);

  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px] animate-float [transform-style:preserve-3d]">
      {/* glow behind */}
      <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,var(--gold)_0%,transparent_60%)] opacity-20 blur-3xl" />

      {/* Phone frame */}
      <div className="relative rounded-[3rem] bg-gradient-to-b from-neutral-800 to-black p-[3px] shadow-elev">
        <div className="rounded-[2.85rem] bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-2">
          <div className="relative overflow-hidden rounded-[2.4rem] bg-background">
            {/* Notch */}
            <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

            <div className="px-5 pb-6 pt-3">
              {/* Status bar */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>9:41</span>
                <span className="flex gap-1 opacity-70">●●●●</span>
              </div>

              {/* Header */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Portfolio</p>
                  <p className="font-display text-2xl tracking-tight text-foreground">$48,392<span className="text-gold">.50</span></p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[color:var(--success)]">
                    <ArrowUpRight className="size-3" /> +$1,284.20 (2.72%) today
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="size-8 rounded-full glass flex items-center justify-center">
                    <Bell className="size-3.5 text-gold" />
                  </button>
                  <button className="size-8 rounded-full glass flex items-center justify-center">
                    <Search className="size-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Big chart */}
              <div className="relative mt-4 h-28 rounded-2xl glass-gold p-3">
                <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                  <span>1D</span><span>1W</span>
                  <span className="rounded-full bg-gold px-2 py-0.5 text-[9px] font-medium text-primary-foreground">1M</span>
                  <span>3M</span><span>1Y</span><span>ALL</span>
                </div>
                <StockChart data={chartData} width={260} height={64} className="mt-1 h-16 w-full" />
              </div>

              {/* Holdings */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-medium text-foreground">Holdings</p>
                  <p className="text-[10px] text-gold">See all</p>
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
                      <StockChart data={h.data} width={50} height={18} className="h-4 w-12" color={h.up ? "var(--success)" : "var(--loss)"} fill={false} animate={false} />
                      <div className="text-right">
                        <p className="text-[10px] font-medium text-foreground">${h.price}</p>
                        <p className={`text-[9px] ${h.up ? "text-[color:var(--success)]" : "text-[color:var(--loss)]"}`}>{h.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="mt-2 flex items-center justify-around border-t border-white/5 bg-black/60 px-6 py-3 backdrop-blur">
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
