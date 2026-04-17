import { createClient } from "@/lib/supabase/server";
import { formatCurrency, getMonthName, checkMatch } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Trophy } from "lucide-react";

export default async function DrawsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: draws }, { data: myScores }] = await Promise.all([
    supabase.from("draws").select("*").eq("status", "published")
      .order("draw_year", { ascending: false }).order("draw_month", { ascending: false }),
    supabase.from("golf_scores").select("*").eq("user_id", user.id),
  ]);

  const userNumbers = myScores?.map((s) => s.score) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Draw History</h1>
        <p className="text-carbon-400 mt-1">Monthly prize draws — your numbers vs. winning numbers.</p>
      </div>

      {draws && draws.length > 0 ? (
        <div className="space-y-4">
          {draws.map((draw) => {
            const matchCount = checkMatch(userNumbers, draw.winning_numbers);
            const won = matchCount >= 3;
            return (
              <div
                key={draw.id}
                className={`bg-carbon-900 rounded-2xl p-6 border transition-colors ${won ? "border-gold/40 shadow-lg shadow-gold/5" : "border-carbon-700"}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-white text-lg">
                      {getMonthName(draw.draw_month)} {draw.draw_year}
                    </h3>
                    <p className="text-sm text-carbon-400 mt-0.5">{draw.total_subscribers} participants</p>
                  </div>
                  {won ? (
                    <Badge variant="gold">
                      <Trophy className="w-3 h-3 mr-1" />
                      {matchCount}-Match Winner!
                    </Badge>
                  ) : (
                    <Badge variant="gray">{matchCount} matched</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {draw.winning_numbers.map((n: number) => {
                    const isMatch = userNumbers.includes(n);
                    return (
                      <div
                        key={n}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono font-bold border ${
                          isMatch
                            ? "bg-gold text-carbon-950 border-gold"
                            : "bg-carbon-800 text-carbon-400 border-carbon-700"
                        }`}
                      >
                        {n}
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-carbon-500">Jackpot</p>
                    <p className="text-white font-semibold">{formatCurrency(draw.jackpot_amount)}</p>
                  </div>
                  <div>
                    <p className="text-carbon-500">4-Match</p>
                    <p className="text-white font-semibold">{formatCurrency(draw.pool_4match)}</p>
                  </div>
                  <div>
                    <p className="text-carbon-500">3-Match</p>
                    <p className="text-white font-semibold">{formatCurrency(draw.pool_3match)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-carbon-900 border border-carbon-700 rounded-2xl">
          <Trophy className="w-10 h-10 text-carbon-600 mx-auto mb-3" />
          <p className="text-carbon-400">No published draws yet. Check back next month!</p>
        </div>
      )}
    </div>
  );
}
