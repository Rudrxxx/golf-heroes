import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*, charities(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Users</h1>
        <p className="text-carbon-400 mt-1">{users?.length || 0} total users</p>
      </div>

      <div className="bg-carbon-900 border border-carbon-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-carbon-800">
                {["Name", "Email", "Status", "Plan", "Charity", "Joined"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-carbon-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-carbon-800/50 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{user.full_name || "—"}</td>
                  <td className="px-4 py-3 text-carbon-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.subscription_status === "active" ? "green" : "gray"}>
                      {user.subscription_status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-carbon-300 capitalize">{user.subscription_plan || "—"}</td>
                  <td className="px-4 py-3 text-carbon-300">{(user as any).charities?.name || "—"}</td>
                  <td className="px-4 py-3 text-carbon-400">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
