"use client";

const tiers = [
  {
    match: "5 Numbers",
    share: "40%",
    tag: "Jackpot",
    desc: "Match all five numbers. Jackpot rolls over monthly if unclaimed.",
    rollover: true,
    example: "~£2,400",
  },
  {
    match: "4 Numbers",
    share: "35%",
    tag: "Major Prize",
    desc: "Match any four. Split equally among all 4-match winners.",
    rollover: false,
    example: "~£2,100",
  },
  {
    match: "3 Numbers",
    share: "25%",
    tag: "Starter Prize",
    desc: "Match any three numbers. Split equally among all 3-match winners.",
    rollover: false,
    example: "~£1,500",
  },
];

export function PrizesSection() {
  return (
    <section id="prizes" className="py-24 bg-carbon-950">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-gold tracking-widest uppercase">Monthly Draws</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">
            Prize Structure
          </h2>
          <p className="text-carbon-400 mt-4 max-w-xl mx-auto">
            A fixed share of every subscription builds the prize pool. Three ways to win every month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <div
              key={tier.match}
              className={`relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                i === 0
                  ? "bg-gradient-to-br from-gold/10 to-transparent border-gold/50 shadow-lg shadow-gold/10"
                  : "bg-carbon-900 border-carbon-700 hover:border-gold/30"
              }`}
            >
              <div className="text-xs font-mono tracking-widest uppercase mb-2 text-gold/70">
                {tier.tag}
              </div>
              <div className="font-display text-4xl font-bold text-gold mb-1">{tier.share}</div>
              <div className="text-sm text-carbon-300 mb-4">of pool — {tier.match}</div>
              <p className="text-sm text-carbon-400 leading-relaxed mb-4">{tier.desc}</p>
              <div className="text-xs font-mono text-carbon-400">
                Example (600 members):{" "}
                <span className="text-gold">{tier.example}</span>
              </div>
              {tier.rollover && (
                <div className="mt-3 text-xs bg-gold/10 border border-gold/20 rounded-lg px-3 py-1.5 text-gold">
                  🔄 Jackpot rolls over if no 5-match winner
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
