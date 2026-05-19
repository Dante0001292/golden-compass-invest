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
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => `${i * stepX},${height - ((v - min) / range) * height}`);
  const path = `M ${points.join(" L ")}`;
  const area = `${path} L ${width},${height} L 0,${height} Z`;
  const gid = `g-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "animate-draw" : ""}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
}
