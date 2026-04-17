"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Trophy, Heart, Award, BarChart3, LogOut, Settings
} from "lucide-react";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/draws", label: "Draws", icon: Trophy },
  { href: "/admin/charities", label: "Charities", icon: Heart },
  { href: "/admin/winners", label: "Winners", icon: Award },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="hidden md:flex w-60 flex-col bg-carbon-900 border-r border-carbon-800 min-h-screen">
      <div className="p-5 border-b border-carbon-800">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gold" />
          <span className="font-semibold text-white text-sm">Admin Panel</span>
        </div>
        <p className="text-xs text-carbon-500 mt-1">GolfHeroes Control</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                active ? "bg-gold/10 text-gold border border-gold/20" : "text-carbon-400 hover:text-white hover:bg-carbon-800"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

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
