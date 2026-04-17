import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Shield, RefreshCw } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-carbon-900/60">
      <div className="max-w-4xl mx-auto section-padding text-center">
        <span className="text-xs font-mono text-gold tracking-widest uppercase">Get Started</span>
        <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
          Ready to become a{" "}
          <span className="text-gradient-gold">hero?</span>
        </h2>
        <p className="text-carbon-400 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands who play golf, support meaningful causes, and win life-changing prizes — every single month.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link href="/signup?plan=monthly">
            <Button size="lg" className="group">
              Monthly — £9.99/mo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/signup?plan=yearly">
            <Button size="lg" variant="outline">
              Yearly — £99/yr
              <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full ml-1">Save 17%</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-carbon-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Stripe-secured payments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
