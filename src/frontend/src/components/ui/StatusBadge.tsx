import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  Pending: {
    label: "অপেক্ষমান",
    classes: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  },
  Processing: {
    label: "প্রক্রিয়াধীন",
    classes: "bg-blue-100 text-blue-800 border border-blue-200",
  },
  Approved: {
    label: "অনুমোদিত",
    classes: "bg-green-100 text-green-800 border border-green-200",
  },
  Rejected: {
    label: "প্রত্যাখ্যাত",
    classes: "bg-red-100 text-red-800 border border-red-200",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    classes: "bg-muted text-muted-foreground border border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold",
        config.classes,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
