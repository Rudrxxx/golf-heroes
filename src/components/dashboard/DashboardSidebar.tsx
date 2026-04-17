"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Trophy, Heart, BarChart3, User, LogOut, ChevronRight, Settings
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/scores", label: "My Scores", icon: BarChart3 },
  { href: "/dashboard/draws", label: "Draw History", icon: Trophy },
  { href: "/dashboard/charity", label: "My Charity", icon: Heart },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardSidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="hidden md:flex w-64 flex-col bg-carbon-900 border-r border-carbon-800 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-carbon-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-gold rounded-lg flex items-center justify-center">
            <Trophy className="w-3.5 h-3.5 text-carbon-950" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            Golf<span className="text-gradient-gold">Heroes</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-carbon-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold/20 rounded-full flex items-center justify-center text-gold font-semibold text-sm">
            {profile?.full_name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{profile?.full_name || "User"}</p>
            <p className={cn(
              "text-xs capitalize",
              profile?.subscription_status === "active" ? "text-emerald" : "text-carbon-400"
            )}>
              {profile?.subscription_status || "inactive"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                active
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-carbon-400 hover:text-white hover:bg-carbon-800"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Admin link */}
      {profile?.role === "admin" && (
        <div className="p-3 border-t border-carbon-800">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gold hover:bg-gold/10 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Admin Panel
          </Link>
        </div>
      )}

      {/* Sign out */}
      <div className="p-3 border-t border-carbon-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-carbon-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
