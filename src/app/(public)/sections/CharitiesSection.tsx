import { Charity } from "@/lib/types";
import { Heart, ExternalLink } from "lucide-react";
import Link from "next/link";

export function CharitiesSection({ charities }: { charities: Charity[] }) {
  return (
    <section id="charities" className="py-24 bg-carbon-900/50">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-gold tracking-widest uppercase">Making a Difference</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">
            Charities We Support
          </h2>
          <p className="text-carbon-400 mt-4 max-w-xl mx-auto">
            Every subscription sends at least 10% to a cause that matters. You choose which.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {charities.map((charity) => (
            <div
              key={charity.id}
              className="group relative bg-carbon-900 border border-carbon-700 rounded-2xl p-6 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {charity.is_featured && (
                <div className="absolute top-3 right-3">
                  <span className="bg-gold/20 text-gold text-xs font-mono px-2 py-0.5 rounded-full border border-gold/30">
                    Featured
                  </span>
                </div>
              )}
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{charity.name}</h3>
              <p className="text-sm text-carbon-400 leading-relaxed line-clamp-3 mb-4">
                {charity.description}
              </p>
              <div className="text-xs font-mono text-gold">
                £{charity.total_raised.toFixed(0)} raised
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/charities" className="text-sm text-gold hover:text-gold-light transition-colors underline underline-offset-4">
            View all charities →
          </Link>
        </div>
      </div>
    </section>
  );
}
