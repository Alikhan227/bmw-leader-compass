import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Candidate } from "@/lib/types";

export function useCandidatesDB() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function fetchCandidates() {
    const { data, error } = await supabase
      .from("candidate_submissions")
      .select("*");

    if (error) {
      console.error("DB error:", error);
      return;
    }

    const mapped: Candidate[] = (data || []).map((c) => ({
      id: c.id,
      name: c.full_name,
      currentRole: c.current_job_title,
      company: c.company,
      yearsExperience: c.experience_years || 0,
      avatarInitials: (c.full_name || "?")
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      traits: {
        riskTaking: 5,
        processFocus: 5,
        resilience: 5,
        innovation: 5,
        stakeholderManagement: 5,
        executionSpeed: 5,
      },
      fitScores: {
        "automotive-continuity": 50,
        transformation: 50,
        "supply-chain-crisis": 50,
      },
      timeToHire: 30,
      costToHire: 5,
      riskScore: {
        "automotive-continuity": 5,
        transformation: 5,
        "supply-chain-crisis": 5,
      },
      bio: {
        dateOfBirth: "",
        placeOfBirth: "",
        education: "",
        applicationDate: "",
        description: c.cv_text || "",
      },
      isNew: true,
    }));

    setCandidates(mapped);
    setLoading(false);
  }

  return { candidates, loading, refetch: fetchCandidates };
}