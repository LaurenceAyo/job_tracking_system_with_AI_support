"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutGrid, FileText, User, LogOut } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Applications", href: "/dashboard/applications", icon: FileText },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

// Replace with real data from your `applications` table
const stats = [
  { label: "Total", value: 6, color: "bg-white border border-gray-200" },
  { label: "Applied", value: 2, color: "bg-blue-100" },
  { label: "Interview", value: 2, color: "bg-yellow-100" },
  { label: "Offers", value: 2, color: "bg-green-100" },
];

const recentApplications = [
  { company: "AB Company", role: "Quality Assurance Officer", status: "Applied" },
  { company: "CD Company", role: "Full-stack Developer", status: "Applied" },
];

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <div className="min-h-screen  bg-[#eaf3ff]">

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-5">Overview</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-6 mr-60">
          {stats.map((stat) => (
            <div
              key={stat.label}
              onClick={() => router.push(`/dashboard/applications?status=${stat.label.toLowerCase()}`)}
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
          <div className="divide-y divide-gray-100">
            {recentApplications.map((app, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">{app.company}</div>
                  <div className="text-sm text-gray-500">{app.role}</div>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}