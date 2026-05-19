import { useId, useMemo } from "react";

interface StockChartProps {
  data: number[];
  color?: string;
  className?: string;
  fill?: boolean;
  animate?: boolean;
  width?: number;
  height?: number;
}

export function StockChart({
  data,
  color = "var(--gold)",
  className,
  fill = true,
  animate = true,
  width = 100,
  height = 30,
}: StockChartProps) {
  const uid = useId();
  const gid = `g${uid.replace(/:/g, "")}`;

  const { path, area, last } = useMemo(() => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const pad = height * 0.1;
    const stepX = width / (data.length - 1);

    const pts = data.map((v, i) => ({
      x: i * stepX,
      y: pad + (1 - (v - min) / range) * (height - pad * 2),
    }));

    // Catmull-Rom → cubic bezier for smooth curves
    let p = `M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const t = 0.35;
      const cp1x = p1.x + (p2.x - p0.x) * t;
      const cp1y = p1.y + (p2.y - p0.y) * t;
      const cp2x = p2.x - (p3.x - p1.x) * t;
      const cp2y = p2.y - (p3.y - p1.y) * t;
      p += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
    }

    const a = `${p} L ${width},${height} L 0,${height} Z`;
    return { path: p, area: a, last: pts[pts.length - 1] };
  }, [data, width, height]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.45" />
          <stop offset="60%"  stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "animate-draw" : ""}
        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
      />
      <circle
        cx={last.x}
        cy={last.y}
        r="2.2"
        fill={color}
        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
      />
    </svg>
  );
}
