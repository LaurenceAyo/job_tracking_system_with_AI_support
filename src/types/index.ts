export type ApplicationStatus = "applied" | "interview" | "offer";

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  job_url: string | null;
  status: ApplicationStatus;
  applied_date: string;
  interview_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoverLetter {
  id: string;
  application_id: string;
  content: string;
  created_at: string;
}