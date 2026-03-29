import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pjbwgjbwspazpixkfakx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYndnamJ3c3BhenBpeGtmYWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NDI1MTIsImV4cCI6MjA5MDMxODUxMn0.JdR8RDuGl2k-87BRdzxLDUJH21b-1rl_NtvL9K8hl7E";


export const supabase = createClient(supabaseUrl, supabaseKey);

export async function insertCandidateSubmission(input: {
  vacancy_id: string;
  submission_source: "candidate_portal" | "hr_manual" | "hr_cv_upload";
  status?: "submitted" | "parsed" | "ready" | "archived";
  full_name: string;
  email?: string;
  phone?: string;
  current_job_title?: string;
  company?: string;
  experience_years?: number;
  avatar_initials?: string;
  background?: string;
  skills_json?: string[];
  time_to_hire?: number;
  cost_to_hire?: number;
  risk_taking?: number;
  process_focus?: number;
  resilience?: number;
  innovation?: number;
  stakeholder_management?: number;
  execution_speed?: number;
  cv_file_name?: string;
  cv_file_url?: string;
  cv_text?: string;
  parsed_candidate_json?: Record<string, unknown>;
  consent_given?: boolean;
  consent_text_version?: string;
}) {
  const { data, error } = await supabase
    .from("candidate_submissions")
    .insert([
      {
        vacancy_id: input.vacancy_id,
        submission_source: input.submission_source,
        status: input.status ?? "ready",
        full_name: input.full_name,
        email: input.email ?? null,
        phone: input.phone ?? null,
        current_job_title: input.current_job_title ?? null,
        company: input.company ?? null,
        experience_years: input.experience_years ?? null,
        avatar_initials: input.avatar_initials ?? null,
        background: input.background ?? null,
        skills_json: input.skills_json ?? [],
        time_to_hire: input.time_to_hire ?? 30,
        cost_to_hire: input.cost_to_hire ?? 5,
        risk_taking: input.risk_taking ?? 5,
        process_focus: input.process_focus ?? 5,
        resilience: input.resilience ?? 5,
        innovation: input.innovation ?? 5,
        stakeholder_management: input.stakeholder_management ?? 5,
        execution_speed: input.execution_speed ?? 5,
        cv_file_name: input.cv_file_name ?? null,
        cv_file_url: input.cv_file_url ?? null,
        cv_text: input.cv_text ?? null,
        parsed_candidate_json: input.parsed_candidate_json ?? null,
        consent_given: input.consent_given ?? false,
        consent_text_version: input.consent_text_version ?? null,
      },
    ])
    .select();

  if (error) {
    console.error("Insert candidate submission error:", error);
    throw error;
  }

  return data;
}