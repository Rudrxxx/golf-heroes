"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { GolfScore } from "@/lib/types";
import { Pencil, Trash2, Plus, Info } from "lucide-react";
import { toast } from "sonner";

export default function ScoresPage() {
  const [scores, setScores] = useState<GolfScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");
  const [editing, setEditing] = useState<GolfScore | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchScores = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("golf_scores")
      .select("*")
      .eq("user_id", user.id)
      .order("score_date", { ascending: false });
    setScores(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchScores(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const scoreNum = parseInt(score);
    if (scoreNum < 1 || scoreNum > 45) {
      toast.error("Score must be between 1 and 45");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editing) {
      const { error } = await supabase
        .from("golf_scores")
        .update({ score: scoreNum, score_date: date })
        .eq("id", editing.id);
      if (error) {
        // Duplicate date check
        if (error.code === "23505") toast.error("A score for this date already exists.");
        else toast.error(error.message);
      } else {
        toast.success("Score updated");
        setEditing(null);
      }
    } else {
      const { error } = await supabase
        .from("golf_scores")
        .insert({ user_id: user.id, score: scoreNum, score_date: date });
      if (error) {
        if (error.code === "23505") toast.error("A score for this date already exists.");
        else toast.error(error.message);
      } else {
        toast.success("Score added!");
      }
    }

    setScore("");
    setDate("");
    setSaving(false);
    fetchScores();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("golf_scores").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Score deleted"); fetchScores(); }
  };

  const handleEdit = (s: GolfScore) => {
    setEditing(s);
    setScore(String(s.score));
    setDate(s.score_date);
  };

  const cancelEdit = () => {
    setEditing(null);
    setScore("");
    setDate("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">My Scores</h1>
        <p className="text-carbon-400 mt-1">Track up to 5 Stableford scores. Your latest 5 are used for draws.</p>
      </div>

      {/* Info box */}
      <div className="bg-carbon-800 border border-carbon-700 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
        <p className="text-sm text-carbon-300">
          You can store up to 5 scores. When you add a 6th, the oldest is automatically removed.
          Scores must be between 1–45 (Stableford format). Only one score per date is allowed.
        </p>
      </div>

      {/* Add/Edit form */}
      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4">
          {editing ? "Edit Score" : "Add Score"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Stableford Score (1–45)"
              type="number"
              min={1}
              max={45}
              placeholder="e.g. 32"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <Input
              label="Date Played"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" loading={saving} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {editing ? "Update" : "Add Score"}
            </Button>
            {editing && (
              <Button type="button" variant="ghost" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Scores list */}
      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-carbon-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">Score History</h2>
          <Badge variant="gold">{scores.length}/5 scores</Badge>
        </div>

        {loading ? (
          <div className="p-8 text-center text-carbon-400">Loading...</div>
        ) : scores.length === 0 ? (
          <div className="p-8 text-center text-carbon-400">
            No scores yet. Add your first Stableford score above.
          </div>
        ) : (
          <div className="divide-y divide-carbon-800">
            {scores.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                    <span className="font-display font-bold text-lg text-gold">{s.score}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{formatDate(s.score_date)}</p>
                    {i === 0 && <span className="text-xs text-carbon-500">Most recent</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-carbon-400 hover:text-gold hover:bg-gold/10 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-carbon-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
