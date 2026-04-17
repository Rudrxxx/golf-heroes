import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate, getMonthName } from "@/lib/utils";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trophy, Heart, BarChart3, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: scores }, { data: draws }, { data: winners }, { data: charity }] =
    await Promise.all([
      supabase.from("profiles").select("*, charities(name)").eq("id", user.id).single(),
      supabase.from("golf_scores").select("*").eq("user_id", user.id).order("score_date", { ascending: false }).limit(5),
      supabase.from("draws").select("*").eq("status", "published").order("draw_year", { ascending: false }).order("draw_month", { ascending: false }).limit(3),
      supabase.from("winners").select("*, draws(draw_month, draw_year)").eq("user_id", user.id),
      supabase.from("charities").select("name").eq("id", profile?.charity_id || "").single(),
    ]);

  const totalWon = winners?.reduce((sum, w) => sum + w.prize_amount, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Hey, {profile?.full_name?.split(" ")[0] || "Hero"} 👋
          </h1>
          <p className="text-carbon-400 mt-1">Here&apos;s your GolfHeroes overview.</p>
        </div>
        <Badge variant={profile?.subscription_status === "active" ? "green" : "red"}>
          {profile?.subscription_status || "inactive"}
        </Badge>
      </div>

      {/* Subscription warning */}
      {profile?.subscription_status !== "active" && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-gold flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gold font-medium">Subscription required</p>
            <p className="text-xs text-gold/70 mt-0.5">Subscribe to enter monthly draws and support your charity.</p>
          </div>
          <Link href="/dashboard/subscribe">
            <Button size="sm">Subscribe Now</Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Subscription"
          value={profile?.subscription_plan ? `${profile.subscription_plan}` : "None"}
          icon={<Calendar className="w-4 h-4" />}
        />
        <StatCard
          label="Scores Logged"
          value={String(scores?.length || 0)}
          icon={<BarChart3 className="w-4 h-4" />}
        />
        <StatCard
          label="Total Won"
          value={formatCurrency(totalWon)}
          icon={<Trophy className="w-4 h-4" />}
        />
        <StatCard
          label="Charity Given"
          value={`${profile?.charity_contribution_percent || 10}%`}
          icon={<Heart className="w-4 h-4" />}
        />
      </div>

      {/* Scores + Charity side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scores */}
        <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Latest Scores</h2>
            <Link href="/dashboard/scores">
              <Button size="sm" variant="ghost">Manage →</Button>
            </Link>
          </div>
          {scores && scores.length > 0 ? (
            <div className="space-y-2">
              {scores.map((score, i) => (
                <div key={score.id} className="flex items-center justify-between py-2.5 border-b border-carbon-800 last:border-0">
                  <span className="text-sm text-carbon-400">{formatDate(score.score_date)}</span>
                  <div className="flex items-center gap-3">
                    {i === 0 && <Badge variant="gold">Latest</Badge>}
                    <span className="font-display font-bold text-xl text-gold">{score.score}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-8 h-8 text-carbon-600 mx-auto mb-2" />
              <p className="text-sm text-carbon-400">No scores yet</p>
              <Link href="/dashboard/scores" className="text-gold text-sm mt-1 hover:underline">Add your first score →</Link>
            </div>
          )}
        </div>

        {/* Charity */}
        <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">My Charity</h2>
            <Link href="/dashboard/charity">
              <Button size="sm" variant="ghost">Change →</Button>
            </Link>
          </div>
          {profile?.charity_id ? (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-gold fill-gold/30" />
              </div>
              <h3 className="font-display font-semibold text-white">{(profile as any).charities?.name || charity?.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-carbon-400">Contribution:</span>
                <span className="text-gold font-semibold">{profile.charity_contribution_percent}%</span>
                <span className="text-carbon-500">of subscription</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="w-8 h-8 text-carbon-600 mx-auto mb-2" />
              <p className="text-sm text-carbon-400">No charity selected</p>
              <Link href="/dashboard/charity" className="text-gold text-sm mt-1 hover:underline">Choose a charity →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent draws */}
      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Recent Draws</h2>
          <Link href="/dashboard/draws">
            <Button size="sm" variant="ghost">View all →</Button>
          </Link>
        </div>
        {draws && draws.length > 0 ? (
          <div className="space-y-3">
            {draws.map((draw) => (
              <div key={draw.id} className="flex items-center justify-between py-3 border-b border-carbon-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">
                    {getMonthName(draw.draw_month)} {draw.draw_year}
                  </p>
                  <p className="text-xs text-carbon-500 mt-0.5">
                    Jackpot: {formatCurrency(draw.jackpot_amount)}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {draw.winning_numbers.map((n: number) => (
                    <span key={n} className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs flex items-center justify-center font-mono">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-carbon-400 text-center py-6">No published draws yet.</p>
        )}
      </div>
    </div>
  );
}
