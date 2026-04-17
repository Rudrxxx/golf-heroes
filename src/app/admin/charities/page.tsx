"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Charity } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Charity | null>(null);
  const [form, setForm] = useState({ name: "", description: "", website_url: "", is_featured: false });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchCharities = async () => {
    const { data } = await supabase.from("charities").select("*").order("created_at", { ascending: false });
    setCharities(data || []);
  };

  useEffect(() => { fetchCharities(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("charities").update(form).eq("id", editing.id);
      if (error) toast.error(error.message);
      else { toast.success("Charity updated"); setEditing(null); setShowForm(false); }
    } else {
      const { error } = await supabase.from("charities").insert({ ...form, is_active: true });
      if (error) toast.error(error.message);
      else { toast.success("Charity added"); setShowForm(false); }
    }
    setForm({ name: "", description: "", website_url: "", is_featured: false });
    setSaving(false);
    fetchCharities();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this charity?")) return;
    const { error } = await supabase.from("charities").update({ is_active: false }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Charity deactivated"); fetchCharities(); }
  };

  const handleEdit = (c: Charity) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || "", website_url: c.website_url || "", is_featured: c.is_featured });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Charities</h1>
          <p className="text-carbon-400 mt-1">{charities.length} charities</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: "", description: "", website_url: "", is_featured: false }); }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Charity
        </Button>
      </div>

      {showForm && (
        <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">{editing ? "Edit Charity" : "New Charity"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-carbon-300">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-carbon-800 border border-carbon-600 rounded-xl px-4 py-3 text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold h-24 resize-none"
              />
            </div>
            <Input label="Website URL" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-gold" />
              <span className="text-sm text-carbon-300">Feature on homepage</span>
            </label>
            <div className="flex gap-3">
              <Button type="submit" loading={saving}>{editing ? "Update" : "Create"}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl overflow-hidden">
        <div className="divide-y divide-carbon-800">
          {charities.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{c.name}</span>
                  {c.is_featured && <Star className="w-3.5 h-3.5 text-gold fill-gold" />}
                  <Badge variant={c.is_active ? "green" : "gray"}>{c.is_active ? "active" : "inactive"}</Badge>
                </div>
                <p className="text-sm text-carbon-400 mt-0.5 line-clamp-1">{c.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => handleEdit(c)} className="w-8 h-8 rounded-lg flex items-center justify-center text-carbon-400 hover:text-gold hover:bg-gold/10 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-carbon-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
