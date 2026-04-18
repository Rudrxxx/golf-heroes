import { createClient } from "@/lib/supabase/server";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { StatCard } from "@/components/ui/Card";
import { Users, TrendingUp, Heart, Trophy } from "lucide-react";

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: activeUsers },
    { data: draws },
    { data: winners },
    { data: donations },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("subscription_status", "active"),
    supabase.from("draws").select("*").eq("status", "published").order("draw_year", { ascending: false }).order("draw_month", { ascending: false }),
    supabase.from("winners").select("*, profiles(full_name), draws(draw_month, draw_year)").eq("payment_status", "paid"),
    supabase.from("charity_donations").select("amount, charities(name)"),
  ]);

  const totalPaid = winners?.reduce((s, w) => s + w.prize_amount, 0) || 0;
  const totalDonated = donations?.reduce((s, d) => s + d.amount, 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-carbon-400 mt-1">Platform-wide data overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={String(totalUsers || 0)} icon={<Users className="w-4 h-4" />} />
        <StatCard label="Active Subscribers" value={String(activeUsers || 0)} icon={<TrendingUp className="w-4 h-4" />} />
        <StatCard label="Total Prizes Paid" value={formatCurrency(totalPaid)} icon={<Trophy className="w-4 h-4" />} />
        <StatCard label="Charity Total" value={formatCurrency(totalDonated)} icon={<Heart className="w-4 h-4" />} />
      </div>

      {/* Draw stats */}
      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-5">Draw Statistics</h2>
        {draws && draws.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-carbon-800">
                  {["Month", "Subscribers", "Jackpot", "4-Match", "3-Match", "Type"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-xs font-medium text-carbon-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-carbon-800">
                {draws.map((d) => (
                  <tr key={d.id}>
                    <td className="px-3 py-3 text-white">{getMonthName(d.draw_month)} {d.draw_year}</td>
                    <td className="px-3 py-3 text-carbon-300">{d.total_subscribers}</td>
                    <td className="px-3 py-3 text-gold font-mono">{formatCurrency(d.jackpot_amount)}</td>
                    <td className="px-3 py-3 text-carbon-300 font-mono">{formatCurrency(d.pool_4match)}</td>
                    <td className="px-3 py-3 text-carbon-300 font-mono">{formatCurrency(d.pool_3match)}</td>
                    <td className="px-3 py-3 text-carbon-400 capitalize">{d.draw_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-carbon-400 text-center py-6">No draw data yet.</p>
        )}
      </div>
    </div>
  );
}
