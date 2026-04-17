import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gold?: boolean;
  hover?: boolean;
}

export function Card({ children, className, gold, hover }: CardProps) {
  return (
    <div
      className={cn(
        "bg-carbon-900 rounded-2xl p-6",
        gold ? "border border-gold/40 shadow-lg shadow-gold/5" : "border border-carbon-700",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-carbon-400">{label}</span>
        {icon && <span className="text-gold">{icon}</span>}
      </div>
      <span className="text-2xl font-display font-bold text-gold">{value}</span>
      {trend && (
        <span
          className={cn(
            "text-xs font-mono",
            trend.positive ? "text-emerald" : "text-red-400"
          )}
        >
          {trend.positive ? "↑" : "↓"} {trend.value}
        </span>
      )}
    </Card>
  );
}
