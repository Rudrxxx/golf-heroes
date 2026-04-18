"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, getMonthName } from "@/lib/utils";
import { CheckCircle2, XCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchWinners = async () => {
    const { data } = await supabase
      .from("winners")
      .select("*, profiles(full_name, email), draws(draw_month, draw_year)")
      .order("created_at", { ascending: false });
    setWinners(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchWinners(); }, []);

  const updateStatus = async (id: string, field: string, value: string) => {
    const { error } = await supabase.from("winners").update({
      [field]: value,
      ...(field === "verification_status" ? { reviewed_at: new Date().toISOString() } : {}),
      ...(field === "payment_status" && value === "paid" ? { paid_at: new Date().toISOString() } : {}),
    }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); fetchWinners(); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Winners Management</h1>
        <p className="text-carbon-400 mt-1">Verify submissions and process payouts.</p>
      </div>

      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-carbon-400">Loading...</div>
        ) : winners.length === 0 ? (
          <div className="p-8 text-center text-carbon-400">No winners yet.</div>
        ) : (
          <div className="divide-y divide-carbon-800">
            {winners.map((w) => (
              <div key={w.id} className="px-6 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-white">{w.profiles?.full_name || "Unknown"}</p>
                    <p className="text-sm text-carbon-400">{w.profiles?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-gold text-lg">{formatCurrency(w.prize_amount)}</p>
                    <p className="text-xs text-carbon-500">{w.prize_tier}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="gray">
                    {getMonthName(w.draws?.draw_month)} {w.draws?.draw_year}
                  </Badge>
                  <Badge variant={
                    w.verification_status === "approved" ? "green" :
                    w.verification_status === "rejected" ? "red" : "gold"
                  }>
                    {w.verification_status}
                  </Badge>
                  <Badge variant={w.payment_status === "paid" ? "green" : "gray"}>
                    {w.payment_status}
                  </Badge>
                </div>

                <div className="flex gap-2 mt-3">
                  {w.verification_status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(w.id, "verification_status", "approved")} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => updateStatus(w.id, "verification_status", "rejected")} className="flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </Button>
                    </>
                  )}
                  {w.verification_status === "approved" && w.payment_status === "pending" && (
                    <Button size="sm" onClick={() => updateStatus(w.id, "payment_status", "paid")} className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" /> Mark Paid
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
