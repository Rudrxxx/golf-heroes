"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Draw } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, getMonthName, calculatePrizePools, runDrawAlgorithm } from "@/lib/utils";
import { toast } from "sonner";
import { Play, Send } from "lucide-react";
 
export default function AdminDrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [drawType, setDrawType] = useState<"random" | "algorithmic">("random");
  const supabase = createClient();
 
  const fetchDraws = async () => {
    const { data } = await supabase
      .from("draws")
      .select("*")
      .order("draw_year", { ascending: false })
      .order("draw_month", { ascending: false });
    setDraws(data || []);
    setLoading(false);
  };
 
  useEffect(() => { fetchDraws(); }, []);
 
  const createDraw = async () => {
    setCreating(true);
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
 
    const { count: subCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("subscription_status", "active");
 
    const { data: allScores } = await supabase.from("golf_scores").select("score");
    const scoreValues = allScores?.map((s) => s.score) || [];
    const winningNumbers = runDrawAlgorithm(drawType, scoreValues);
    const pools = calculatePrizePools(subCount || 0);
 
    // Check for jackpot rollover from last published draw
    const { data: lastDraw } = await supabase
      .from("draws")
      .select("jackpot_amount, rolled_over_jackpot, winning_numbers")
      .eq("status", "published")
      .order("draw_year", { ascending: false })
      .order("draw_month", { ascending: false })
      .limit(1)
      .maybeSingle();
 
    // Rollover applies if last draw had no 5-match winner
    let rollover = 0;
    if (lastDraw) {
      const { count: jackpotWinners } = await supabase
        .from("winners")
        .select("*", { count: "exact", head: true })
        .eq("prize_tier", "5-match");
      if ((jackpotWinners ?? 0) === 0) {
        rollover = lastDraw.jackpot_amount ?? 0;
      }
    }
 
    const { error } = await supabase.from("draws").insert({
      draw_month: month,
      draw_year: year,
      draw_type: drawType,
      winning_numbers: winningNumbers,
      jackpot_amount: pools.jackpot + rollover,
      pool_4match: pools.fourMatch,
      pool_3match: pools.threeMatch,
      rolled_over_jackpot: rollover,
      total_subscribers: subCount || 0,
      status: "simulated",
    });
 
    if (error) {
      if (error.code === "23505") toast.error("A draw already exists for this month.");
      else toast.error(error.message);
    } else {
      toast.success("Draw simulated successfully!");
      fetchDraws();
    }
    setCreating(false);
  };
 
  const publishDraw = async (draw: Draw) => {
    if (!confirm("Publish this draw? This will make results visible to all users.")) return;
 
    const { data: subscribers } = await supabase
      .from("profiles")
      .select("id")
      .eq("subscription_status", "active");
 
    for (const sub of subscribers || []) {
      const { data: scores } = await supabase
        .from("golf_scores")
        .select("score")
        .eq("user_id", sub.id);
 
      if (!scores || scores.length === 0) continue;
      const userNums = scores.map((s) => s.score);
      const matched = userNums.filter((n) => draw.winning_numbers.includes(n)).length;
 
      let tier: string | null = null;
      let prize = 0;
      if (matched === 5) { tier = "5-match"; prize = draw.jackpot_amount; }
      else if (matched === 4) { tier = "4-match"; prize = draw.pool_4match; }
      else if (matched === 3) { tier = "3-match"; prize = draw.pool_3match; }
 
      if (tier) {
        await supabase.from("winners").insert({
          draw_id: draw.id,
          user_id: sub.id,
          prize_tier: tier,
          prize_amount: prize,
        });
      }
 
      await supabase.from("draw_entries").upsert({
        draw_id: draw.id,
        user_id: sub.id,
        numbers_entered: userNums,
        match_count: matched,
        prize_tier: tier,
      });
    }
 
    // Split prizes equally among winners in same tier
    for (const tier of ["5-match", "4-match", "3-match"]) {
      const { data: tierWinners } = await supabase
        .from("winners")
        .select("id")
        .eq("draw_id", draw.id)
        .eq("prize_tier", tier);
 
      if (tierWinners && tierWinners.length > 1) {
        const pool =
          tier === "5-match" ? draw.jackpot_amount :
          tier === "4-match" ? draw.pool_4match :
          draw.pool_3match;
        const split = pool / tierWinners.length;
        for (const w of tierWinners) {
          await supabase.from("winners").update({ prize_amount: split }).eq("id", w.id);
        }
      }
    }
 
    await supabase.from("draws").update({
      status: "published",
      published_at: new Date().toISOString(),
    }).eq("id", draw.id);
 
    toast.success("Draw published! Winners notified.");
    fetchDraws();
  };
 
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Draw Management</h1>
          <p className="text-carbon-400 mt-1">Configure, simulate, and publish monthly draws.</p>
        </div>
      </div>
 
      {/* Create draw */}
      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4">Create New Draw</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-carbon-400">Draw Type:</label>
            <select
              value={drawType}
              onChange={(e) => setDrawType(e.target.value as "random" | "algorithmic")}
              className="bg-carbon-800 border border-carbon-600 rounded-xl px-3 py-2 text-carbon-100 text-sm focus:outline-none focus:border-gold"
            >
              <option value="random">Random (Lottery-style)</option>
              <option value="algorithmic">Algorithmic (Score-weighted)</option>
            </select>
          </div>
          <Button onClick={createDraw} loading={creating} className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Simulate Draw
          </Button>
        </div>
        <p className="text-xs text-carbon-500 mt-3">
          Simulation generates winning numbers and calculates prize pools. Review before publishing.
        </p>
      </div>
 
      {/* Draws list */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-carbon-400">Loading...</p>
        ) : draws.length === 0 ? (
          <p className="text-carbon-400 text-center py-8">No draws yet.</p>
        ) : (
          draws.map((draw) => (
            <div key={draw.id} className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-white text-lg">
                    {getMonthName(draw.draw_month)} {draw.draw_year}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={draw.status === "published" ? "green" : draw.status === "simulated" ? "gold" : "gray"}>
                      {draw.status}
                    </Badge>
                    <span className="text-xs text-carbon-500 capitalize">{draw.draw_type}</span>
                  </div>
                </div>
                {draw.status === "simulated" && (
                  <Button size="sm" onClick={() => publishDraw(draw)} className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5" />
                    Publish
                  </Button>
                )}
              </div>
 
              <div className="flex gap-2 mb-4">
                {draw.winning_numbers.map((n: number) => (
                  <div key={n} className="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 text-gold text-sm flex items-center justify-center font-mono font-bold">
                    {n}
                  </div>
                ))}
              </div>
 
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-carbon-800 rounded-xl p-3">
                  <p className="text-carbon-500 text-xs mb-1">Jackpot (5-match)</p>
                  <p className="text-white font-semibold">{formatCurrency(draw.jackpot_amount)}</p>
                </div>
                <div className="bg-carbon-800 rounded-xl p-3">
                  <p className="text-carbon-500 text-xs mb-1">4-Match Pool</p>
                  <p className="text-white font-semibold">{formatCurrency(draw.pool_4match)}</p>
                </div>
                <div className="bg-carbon-800 rounded-xl p-3">
                  <p className="text-carbon-500 text-xs mb-1">3-Match Pool</p>
                  <p className="text-white font-semibold">{formatCurrency(draw.pool_3match)}</p>
                </div>
              </div>
              <p className="text-xs text-carbon-500 mt-3">{draw.total_subscribers} subscribers · {draw.draw_type} draw</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}