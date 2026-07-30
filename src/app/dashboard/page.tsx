import { createClient } from "@/lib/supabase/server";
import { Application } from "@/types";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  return <DashboardClient applications={(data as Application[]) ?? []} />;
}