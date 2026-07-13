"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ApplicationStatus } from "@/types";

export async function addApplication(formData: {
  company_name: string;
  job_title: string;
  job_url: string;
  status: ApplicationStatus;
  applied_date: string;
  notes: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("applications").insert({
    ...formData,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard");
}

export async function updateStatus(id: string, status: ApplicationStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard");
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard");
}