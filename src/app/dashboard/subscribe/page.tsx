"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { Check, Shield, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Plan data defined here directly — never import stripe.ts on the client
const PLANS = {
  monthly: {
    name: "Monthly",
    price: 9.99,
    interval: "month",
    prize_pool_contribution: 4.0,
    charity_min: 1.0,
  },
  yearly: {
    name: "Yearly",
    price: 99.99,
    interval: "year",
    prize_pool_contribution: 44.0,
    charity_min: 10.0,
  },
} as const;

const features = [
  "Enter monthly prize draws with your golf scores",
  "Support a charity of your choice automatically",
  "View draw results and match history",
  "Winner verification and payout tracking",
  "Cancel anytime, no lock-in",
];

function SubscribePage() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<"monthly" | "yearly">(
    (searchParams.get("plan") as "monthly" | "yearly") || "monthly"
  );
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Choose Your Plan</h1>
        <p className="text-carbon-400 mt-1">Join thousands of golf heroes making a difference.</p>
      </div>

      {/* Plan toggle */}
      <div className="grid grid-cols-2 gap-4">
        {(["monthly", "yearly"] as const).map((p) => {
          const planData = PLANS[p];
          return (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={cn(
                "p-6 rounded-2xl border text-left transition-all duration-200",
                plan === p
                  ? "border-gold bg-gold/10 shadow-lg shadow-gold/10"
                  : "border-carbon-700 bg-carbon-900 hover:border-gold/40"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-white capitalize">{p}</span>
                {p === "yearly" && (
                  <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30">
                    Save 17%
                  </span>
                )}
              </div>
              <div className="font-display text-3xl font-bold text-gold">
                {formatCurrency(planData.price)}
                <span className="text-sm text-carbon-400 font-normal">/{planData.interval}</span>
              </div>
              <p className="text-xs text-carbon-400 mt-2">
                ~{formatCurrency(planData.prize_pool_contribution)} to prize pool
                &nbsp;·&nbsp;
                ~{formatCurrency(planData.charity_min)} min. to charity
              </p>
            </button>
          );
        })}
      </div>

      {/* Features */}
      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6 space-y-3">
        {features.map((f) => (
          <div key={f} className="flex items-center gap-3">
            <Check className="w-4 h-4 text-gold flex-shrink-0" />
            <span className="text-sm text-carbon-300">{f}</span>
          </div>
        ))}
      </div>

      <Button onClick={handleSubscribe} loading={loading} size="lg" className="w-full">
        Subscribe {formatCurrency(PLANS[plan].price)}/{PLANS[plan].interval}
      </Button>

      <div className="flex items-center justify-center gap-6 text-xs text-carbon-500">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Secured by Stripe
        </div>
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5" />
          Charity auto-donated
        </div>
      </div>
    </div>
  );
}

export default function SubscribePageWrapper() {
  return (
    <Suspense>
      <SubscribePage />
    </Suspense>
  );
}