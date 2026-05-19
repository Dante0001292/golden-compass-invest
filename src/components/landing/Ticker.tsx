const tickers = [
  { s: "TSLA", p: "248.42", c: "+3.74%", up: true },
  { s: "AAPL", p: "192.31", c: "+2.18%", up: true },
  { s: "NVDA", p: "892.10", c: "+5.23%", up: true },
  { s: "6758 SONY", p: "13,420", c: "+1.62%", up: true },
  { s: "7203 TOYOTA", p: "2,815", c: "-0.41%", up: false },
  { s: "MSFT", p: "418.92", c: "+0.84%", up: true },
  { s: "GOOGL", p: "172.16", c: "+1.45%", up: true },
  { s: "9984 SOFTBANK", p: "9,210", c: "+2.04%", up: true },
  { s: "AMZN", p: "186.40", c: "-0.22%", up: false },
  { s: "META", p: "503.12", c: "+1.91%", up: true },
];

export function Ticker() {
  const items = [...tickers, ...tickers];
  return (
    <div className="relative w-full overflow-hidden border-y border-border/60 bg-black/40 py-3 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-ticker gap-10">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap text-xs">
            <span className="font-medium tracking-wide text-foreground/80">{t.s}</span>
            <span className="text-muted-foreground">${t.p}</span>
            <span className={t.up ? "text-[color:var(--success)]" : "text-[color:var(--loss)]"}>{t.c}</span>
            <span className="size-1 rounded-full bg-gold/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
