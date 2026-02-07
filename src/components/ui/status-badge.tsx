import { cn } from "@/lib/utils";

type StatusType = "pending" | "approved" | "rejected" | "processing" | "submitted" | "review" | "disbursed";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-status-pending/15 text-status-pending",
  },
  approved: {
    label: "Approved",
    className: "bg-status-approved/15 text-status-approved",
  },
  rejected: {
    label: "Rejected",
    className: "bg-status-rejected/15 text-status-rejected",
  },
  processing: {
    label: "Processing",
    className: "bg-status-processing/15 text-status-processing",
  },
  submitted: {
    label: "Submitted",
    className: "bg-status-processing/15 text-status-processing",
  },
  review: {
    label: "Under Review",
    className: "bg-status-pending/15 text-status-pending",
  },
  disbursed: {
    label: "Disbursed",
    className: "bg-status-approved/15 text-status-approved",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
        config.className,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
