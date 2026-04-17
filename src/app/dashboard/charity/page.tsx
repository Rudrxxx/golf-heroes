"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Charity, Profile } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Heart, CheckCircle2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CharityPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [percent, setPercent] = useState(10);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("charities").select("*").eq("is_active", true).order("is_featured", { ascending: false }),
      ]);
      setProfile(p);
      setCharities(c || []);
      setSelected(p?.charity_id || null);
      setPercent(p?.charity_contribution_percent || 10);
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!selected) { toast.error("Please select a charity"); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ charity_id: selected, charity_contribution_percent: percent })
      .eq("id", user.id);
    if (error) toast.error(error.message);
    else toast.success("Charity preferences saved!");
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">My Charity</h1>
        <p className="text-carbon-400 mt-1">Choose the charity your subscription supports every month.</p>
      </div>

      {/* Contribution slider */}
      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-2">Contribution Percentage</h2>
        <p className="text-sm text-carbon-400 mb-5">Minimum 10%. You can give more.</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={percent}
            onChange={(e) => setPercent(parseInt(e.target.value))}
            className="flex-1 accent-gold"
          />
          <span className="text-2xl font-display font-bold text-gold w-16 text-right">{percent}%</span>
        </div>
        <p className="text-xs text-carbon-500 mt-2">
          Monthly: approx. <span className="text-gold">£{(9.99 * percent / 100).toFixed(2)}</span> donated
        </p>
      </div>

      {/* Charity grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {charities.map((charity) => (
          <button
            key={charity.id}
            onClick={() => setSelected(charity.id)}
            className={cn(
              "text-left p-5 rounded-2xl border transition-all duration-200",
              selected === charity.id
                ? "border-gold bg-gold/10 shadow-lg shadow-gold/10"
                : "border-carbon-700 bg-carbon-900 hover:border-gold/40"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                <Heart className={cn("w-5 h-5", selected === charity.id ? "text-gold fill-gold/50" : "text-carbon-400")} />
              </div>
              {selected === charity.id && (
                <CheckCircle2 className="w-5 h-5 text-gold" />
              )}
            </div>
            <h3 className="font-semibold text-white mb-1">{charity.name}</h3>
            <p className="text-sm text-carbon-400 line-clamp-2">{charity.description}</p>
            {charity.is_featured && (
              <span className="text-xs text-gold font-mono mt-2 inline-block">★ Featured</span>
            )}
          </button>
        ))}
      </div>

      <Button onClick={handleSave} loading={saving} size="lg">
        Save Charity Preferences
      </Button>
    </div>
  );
}
