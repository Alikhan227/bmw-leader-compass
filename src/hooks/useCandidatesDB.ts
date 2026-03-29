import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Candidate } from "@/lib/types";

export function useCandidatesDB() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCandidates() {
    setLoading(true);

    const { data, error } = await supabase
      .from("candidate_submissions")
      .select("*")
      .in("status", ["parsed", "ready"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("DB error:", error);
      setCandidates([]);
      setLoading(false);
      return;
    }

    const mapped: Candidate[] = (data || []).map((c: any) => ({
      id: c.id,
      name: c.full_name || "Unnamed Candidate",
      currentRole: c.current_job_title || "Candidate",
      company: c.company || "External Applicant",
      yearsExperience: c.experience_years || 0,
      avatarInitials:
        c.avatar_initials ||
        (c.full_name || "UC")
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      traits: {
        riskTaking: c.risk_taking ?? 5,
        processFocus: c.process_focus ?? 5,
        resilience: c.resilience ?? 5,
        innovation: c.innovation ?? 5,
        stakeholderManagement: c.stakeholder_management ?? 5,
        executionSpeed: c.execution_speed ?? 5,
      },
      fitScores: {
        "automotive-continuity": 50,
        transformation: 50,
        "supply-chain-crisis": 50,
      },
      timeToHire: c.time_to_hire ?? 30,
      costToHire: c.cost_to_hire ?? 5,
      riskScore: {
        "automotive-continuity": 5,
        transformation: 5,
        "supply-chain-crisis": 5,
      },
      reasoning: {
        "automotive-continuity": "Awaiting AI analysis.",
        transformation: "Awaiting AI analysis.",
        "supply-chain-crisis": "Awaiting AI analysis.",
      },
      bio: {
        dateOfBirth: "",
        placeOfBirth: "",
        education: "",
        applicationDate: "",
        description: c.background || c.cv_text || "Candidate submitted through HR system.",
        skills: Array.isArray(c.skills_json) ? c.skills_json : [],
      },
      isNew: true,
    }));

    setCandidates(mapped);
    setLoading(false);
  }

  useEffect(() => {
    void fetchCandidates();
  }, []);

  return { candidates, loading, refetch: fetchCandidates };
}