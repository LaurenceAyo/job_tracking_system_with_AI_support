"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, Briefcase, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/applications", label: "Applications", icon: Briefcase },
  {href: "/dashboard/profile", label: "Profile", icon: User},
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <aside className="w-56 border-r border-gray-200 bg-white flex flex-col py-6 px-4">
      <div className="mb-8 px-2">
        <span className="text-base font-semibold text-gray-900">JobTracker</span>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{userEmail}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === href
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </aside>
  );
}