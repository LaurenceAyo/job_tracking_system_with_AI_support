import { createClient } from "@/lib/supabase/server";
import { Application } from "@/types";
import ApplicationsClient from "@/app/dashboard/applications/ApplicationsClient";

export default async function ApplicationsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  return <ApplicationsClient initialApplications={(data as Application[]) ?? []} />;
}