"use client";
import { UserPlus, Flag, Shuffle, DollarSign } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Subscribe",
    desc: "Choose a monthly or yearly plan. A portion goes directly to your chosen charity — every month.",
  },
  {
    step: "02",
    icon: Flag,
    title: "Enter Scores",
    desc: "Log your last 5 Stableford scores (1-45) after each round. Scores are your lottery numbers.",
  },
  {
    step: "03",
    icon: Shuffle,
    title: "Monthly Draw",
    desc: "Every month, winning numbers are drawn. Match 3, 4, or all 5 to win your share of the prize pool.",
  },
  {
    step: "04",
    icon: DollarSign,
    title: "Win & Give",
    desc: "Prize winners are verified and paid out. Charity contributions flow automatically. Everyone benefits.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-carbon-950">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-gold tracking-widest uppercase">The Process</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">
            How It Works
          </h2>
          <p className="text-carbon-400 mt-4 max-w-xl mx-auto">
            Four simple steps to play, give, and win each month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, icon: Icon, title, desc }, i) => (
            <div
              key={step}
              className="relative group p-6 bg-carbon-900 border border-carbon-700 rounded-2xl hover:border-gold/40 transition-all duration-300 hover:-translate-y-1"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-gold/30 z-10" />
              )}
              <div className="text-xs font-mono text-gold/50 mb-4">{step}</div>
              <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display font-semibold text-lg text-white mb-2">{title}</h3>
              <p className="text-sm text-carbon-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}