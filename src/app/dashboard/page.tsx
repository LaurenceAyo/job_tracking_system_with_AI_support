import { createClient } from "@/lib/supabase/server";
import { Application } from "@/types";

const statusColors: Record<string, string> = {
  applied: "bg-blue-50 text-blue-700",
  interview: "bg-yellow-50 text-yellow-700",
  offer: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  const apps = (applications as Application[]) ?? [];

  const stats = {
    total: apps.length,
    applied: apps.filter((a) => a.status === "applied").length,
    interview: apps.filter((a) => a.status === "interview").length,
    offer: apps.filter((a) => a.status === "offer").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "text-gray-900" },
          { label: "Applied", value: stats.applied, color: "text-blue-700" },
          { label: "Interview", value: stats.interview, color: "text-yellow-700" },
          { label: "Offers", value: stats.offer, color: "text-green-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-900">Recent applications</h2>
        </div>
        {apps.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            No applications yet. Add your first one!
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {apps.slice(0, 8).map((app) => (
              <li key={app.id} className="px-5 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{app.company_name}</p>
                  <p className="text-xs text-gray-500">{app.job_title}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[app.status]}`}>
                  {app.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}