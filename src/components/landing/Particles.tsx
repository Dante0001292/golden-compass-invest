export function Particles({ count = 22 }: { count?: number }) {
  const items = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((_, i) => {
        const left = (i * 37) % 100;
        const size = 1 + ((i * 13) % 4);
        const delay = (i * 0.7) % 12;
        const dur = 14 + ((i * 3) % 16);
        return (
          <span
            key={i}
            className="absolute rounded-full bg-gold"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              bottom: `-10px`,
              opacity: 0.5,
              filter: "blur(0.5px)",
              boxShadow: "0 0 8px var(--gold)",
              animation: `particle-float ${dur}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
