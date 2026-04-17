import { cn } from "@/lib/utils";

type BadgeVariant = "gold" | "green" | "red" | "blue" | "gray";

const variants: Record<BadgeVariant, string> = {
  gold: "bg-gold/20 text-gold border-gold/30",
  green: "bg-emerald/20 text-emerald border-emerald/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  gray: "bg-carbon-700 text-carbon-300 border-carbon-600",
};

export function Badge({
  children,
  variant = "gray",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
