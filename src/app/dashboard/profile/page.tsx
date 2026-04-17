"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Profile } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
      setFullName(data?.full_name || "");
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
    setSaving(false);
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    const res = await fetch("/api/stripe/cancel", { method: "POST" });
    const data = await res.json();
    if (data.ok) toast.success("Subscription cancelled successfully");
    else toast.error("Failed to cancel. Please try again.");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">My Profile</h1>
        <p className="text-carbon-400 mt-1">Manage your account and subscription.</p>
      </div>

      {/* Profile form */}
      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-5">Personal Info</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input label="Email" value={profile?.email || ""} disabled />
          <Button type="submit" loading={saving}>Save Changes</Button>
        </form>
      </div>

      {/* Subscription info */}
      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-5">Subscription</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-carbon-800">
            <span className="text-carbon-400">Status</span>
            <Badge variant={profile?.subscription_status === "active" ? "green" : "red"}>
              {profile?.subscription_status || "inactive"}
            </Badge>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-carbon-800">
            <span className="text-carbon-400">Plan</span>
            <span className="text-white capitalize">{profile?.subscription_plan || "—"}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-carbon-400">Renewal Date</span>
            <span className="text-white">
              {profile?.subscription_renewal_date ? formatDate(profile.subscription_renewal_date) : "—"}
            </span>
          </div>
        </div>

        {profile?.subscription_status === "active" ? (
          <button
            onClick={handleCancelSubscription}
            className="mt-5 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Cancel Subscription
          </button>
        ) : (
          <div className="mt-5">
            <a href="/dashboard/subscribe" className="text-gold text-sm hover:underline">
              Activate Subscription →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
