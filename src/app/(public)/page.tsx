import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "./sections/HeroSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { CharitiesSection } from "./sections/CharitiesSection";
import { PrizesSection } from "./sections/PrizesSection";
import { CTASection } from "./sections/CTASection";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: charities } = await supabase
    .from("charities")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .limit(4);

  return (
    <main className="min-h-screen bg-carbon-950">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <CharitiesSection charities={charities || []} />
      <PrizesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
