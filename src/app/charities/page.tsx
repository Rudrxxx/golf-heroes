import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency } from "@/lib/utils";
import { Heart, ExternalLink } from "lucide-react";

export default async function CharitiesPage() {
  const supabase = await createClient();
  const { data: charities } = await supabase
    .from("charities")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false });

  return (
    <main className="min-h-screen bg-carbon-950">
      <Navbar />
      <section className="pt-32 pb-24 section-padding max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-gold tracking-widest uppercase">Our Partners</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">Charities We Support</h1>
          <p className="text-carbon-400 mt-4 max-w-xl mx-auto">
            10% of every subscription — or more if you choose — goes to a cause you care about.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities?.map((charity) => (
            <div key={charity.id} className="group bg-carbon-900 border border-carbon-700 rounded-2xl p-6 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1">
              {charity.is_featured && (
                <span className="text-xs font-mono text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 rounded-full">★ Featured</span>
              )}
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center my-4">
                <Heart className="w-5 h-5 text-gold" />
              </div>
              <h2 className="font-display font-semibold text-white text-lg mb-2">{charity.name}</h2>
              <p className="text-sm text-carbon-400 leading-relaxed mb-4">{charity.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gold">{formatCurrency(charity.total_raised)} raised</span>
                {charity.website_url && (
                  <a href={charity.website_url} target="_blank" rel="noopener noreferrer" className="text-carbon-400 hover:text-gold transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
