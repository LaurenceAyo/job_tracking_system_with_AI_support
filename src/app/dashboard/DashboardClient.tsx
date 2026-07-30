"use client";
import { useRouter } from "next/navigation";
import { Application } from "@/types";

const statusColors: Record<string, string> = {
  applied: "bg-blue-50 text-blue-600",
  interview: "bg-yellow-50 text-yellow-700",
  offer: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-600",
};

export default function DashboardClient({ applications }: { applications: Application[] }) {
  const router = useRouter();

  const stats = [
    {
      label: "Total",
      value: applications.length,
      color: "bg-white border border-gray-200",
      status: "all",
    },
    {
      label: "Applied",
      value: applications.filter((a) => a.status === "applied").length,
      color: "bg-blue-100",
      status: "applied",
    },
    {
      label: "Interview",
      value: applications.filter((a) => a.status === "interview").length,
      color: "bg-yellow-100",
      status: "interview",
    },
    {
      label: "Offer",
      value: applications.filter((a) => a.status === "offer").length,
      color: "bg-green-100",
      status: "offer",
    },
  ];

  const recent = applications.slice(0, 5);

  return (
    <main className="flex-1 p-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-5">Overview</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6 mr-60">
        {stats.map((stat) => (
          <div
            key={stat.label}
            onClick={() =>
              router.push(
                stat.status === "all"
                  ? "/dashboard/applications"
                  : `/dashboard/applications?status=${stat.status}`
              )
            }
            className={`shadow-lg rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 active:scale-95 ${stat.color}`}
          >
            <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent applications */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Recent Job Applications</h2>
        </div>

        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            No applications yet.{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => router.push("/dashboard/applications")}
            >
              Add your first one
            </span>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.map((app) => (
              <div key={app.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">{app.company_name}</div>
                  <div className="text-sm text-gray-500">{app.job_title}</div>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                    statusColors[app.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}