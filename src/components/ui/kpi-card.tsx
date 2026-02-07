import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "accent" | "warning" | "danger";
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  accent: {
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  warning: {
    iconBg: "bg-risk-medium/10",
    iconColor: "text-risk-medium",
  },
  danger: {
    iconBg: "bg-risk-high/10",
    iconColor: "text-risk-high",
  },
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: KPICardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className="flex items-center gap-1.5">
              {trend.value >= 0 ? (
                <TrendingUp className="h-4 w-4 text-risk-low" />
              ) : (
                <TrendingDown className="h-4 w-4 text-risk-high" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.value >= 0 ? "text-risk-low" : "text-risk-high"
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-sm text-muted-foreground">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", styles.iconBg)}>
          <Icon className={cn("h-6 w-6", styles.iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}
