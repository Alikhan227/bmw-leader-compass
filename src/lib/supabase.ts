import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pjbwgjbwspazpixkfakx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYndnamJ3c3BhenBpeGtmYWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NDI1MTIsImV4cCI6MjA5MDMxODUxMn0.JdR8RDuGl2k-87BRdzxLDUJH21b-1rl_NtvL9K8hl7E";

export const supabase = createClient(supabaseUrl, supabaseKey);
export async function insertCandidate(candidate: {
  full_name: string;
  company?: string;
  current_job_title?: string;
  experience_years?: number;
  cv_text?: string;
}) {
  const { data, error } = await supabase
    .from("candidate_submissions")
    .insert([candidate])
    .select();

  if (error) {
    console.error("Insert error:", error);
    throw error;
  }

  return data;
}