import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { Users, Trophy, Heart, DollarSign } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();
  const [
    { count: userCount },
    { count: activeSubCount },
    { data: draws },
    { data: donations },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("subscription_status", "active"),
    supabase.from("draws").select("jackpot_amount, pool_4match, pool_3match").eq("status", "published"),
    supabase.from("charity_donations").select("amount"),
  ]);

  const totalPrizePool = draws?.reduce((s, d) => s + d.jackpot_amount + d.pool_4match + d.pool_3match, 0) || 0;
  const totalDonations = donations?.reduce((s, d) => s + d.amount, 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Admin Overview</h1>
        <p className="text-carbon-400 mt-1">Platform-wide statistics and controls.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={String(userCount || 0)} icon={<Users className="w-4 h-4" />} />
        <StatCard label="Active Subscribers" value={String(activeSubCount || 0)} icon={<Trophy className="w-4 h-4" />} />
        <StatCard label="Total Prize Pool" value={formatCurrency(totalPrizePool)} icon={<DollarSign className="w-4 h-4" />} />
        <StatCard label="Charity Raised" value={formatCurrency(totalDonations)} icon={<Heart className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { href: "/admin/draws", label: "→ Manage Draws", desc: "Run simulations, publish results" },
              { href: "/admin/winners", label: "→ Verify Winners", desc: "Review proof submissions" },
              { href: "/admin/users", label: "→ Manage Users", desc: "Edit profiles, subscriptions, scores" },
              { href: "/admin/charities", label: "→ Manage Charities", desc: "Add, edit, or feature charities" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center justify-between p-3 bg-carbon-800 rounded-xl hover:bg-carbon-700 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gold">{action.label}</p>
                  <p className="text-xs text-carbon-400 mt-0.5">{action.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Platform Health</h2>
          <div className="space-y-4">
            {[
              { label: "Subscription Rate", value: `${activeSubCount || 0}/${userCount || 0}`, pct: userCount ? Math.round(((activeSubCount || 0) / userCount) * 100) : 0 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-carbon-400">{item.label}</span>
                  <span className="text-white">{item.value} ({item.pct}%)</span>
                </div>
                <div className="h-2 bg-carbon-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-gold rounded-full transition-all"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
