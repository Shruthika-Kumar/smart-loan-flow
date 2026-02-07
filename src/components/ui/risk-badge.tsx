import { cn } from "@/lib/utils";

type RiskLevel = "low" | "medium" | "high";

interface RiskBadgeProps {
  level: RiskLevel;
  showLabel?: boolean;
  className?: string;
}

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  low: {
    label: "Low Risk",
    className: "bg-risk-low text-white",
  },
  medium: {
    label: "Medium Risk",
    className: "bg-risk-medium text-white",
  },
  high: {
    label: "High Risk",
    className: "bg-risk-high text-white",
  },
};

export function RiskBadge({ level, showLabel = true, className }: RiskBadgeProps) {
  const config = riskConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
        config.className,
        className
      )}
    >
      {showLabel && config.label}
    </span>
  );
}
