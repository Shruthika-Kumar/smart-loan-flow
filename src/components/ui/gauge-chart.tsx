import { cn } from "@/lib/utils";

interface GaugeChartProps {
  value: number;
  max?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "risk";
  className?: string;
}

export function GaugeChart({
  value,
  max = 100,
  label,
  size = "md",
  variant = "default",
  className,
}: GaugeChartProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const rotation = (percentage / 100) * 180;

  const sizeConfig = {
    sm: { width: 80, height: 40, strokeWidth: 6 },
    md: { width: 120, height: 60, strokeWidth: 8 },
    lg: { width: 160, height: 80, strokeWidth: 10 },
  };

  const { width, height, strokeWidth } = sizeConfig[size];
  const radius = height - strokeWidth;
  const circumference = Math.PI * radius;

  // Calculate color based on value for risk variant
  const getColor = () => {
    if (variant === "default") return "hsl(var(--accent))";
    if (percentage >= 70) return "hsl(var(--risk-low))";
    if (percentage >= 40) return "hsl(var(--risk-medium))";
    return "hsl(var(--risk-high))";
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg width={width} height={height + 10} className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M ${strokeWidth} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${height}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Foreground arc */}
        <path
          d={`M ${strokeWidth} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth} ${height}`}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percentage / 100) * circumference}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
        {/* Value text */}
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          className="text-lg font-bold fill-foreground"
          style={{ fontSize: size === "sm" ? 14 : size === "md" ? 18 : 24 }}
        >
          {value}
          {variant === "default" && "%"}
        </text>
      </svg>
      {label && (
        <p className="text-xs text-muted-foreground mt-1 text-center">{label}</p>
      )}
    </div>
  );
}
