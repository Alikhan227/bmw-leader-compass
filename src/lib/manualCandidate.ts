import { Candidate } from "@/lib/types";

const emptyTraits = {
  riskTaking: 5,
  processFocus: 5,
  resilience: 5,
  innovation: 5,
  stakeholderManagement: 5,
  executionSpeed: 5,
};

const emptyFitScores = {
  "automotive-continuity": 0,
  transformation: 0,
  "supply-chain-crisis": 0,
};

const emptyRiskScores = {
  "automotive-continuity": 5,
  transformation: 5,
  "supply-chain-crisis": 5,
};

const emptyReasoning = {
  "automotive-continuity":
    "Manual candidate added locally. Run AI analysis to generate scenario reasoning.",
  transformation:
    "Manual candidate added locally. Run AI analysis to generate scenario reasoning.",
  "supply-chain-crisis":
    "Manual candidate added locally. Run AI analysis to generate scenario reasoning.",
};

function initialsFromName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export type ManualCandidateInput = {
  name: string;
  currentRole: string;
  company: string;
  yearsExperience: number;
  skills: string[];
  background: string;
  timeToHire: number;
  costToHire: number;
};

export function createManualCandidate(input: ManualCandidateInput): Candidate {
  const id = `manual-${Date.now()}`;

  return {
    id,
    name: input.name,
    currentRole: input.currentRole,
    company: input.company,
    yearsExperience: input.yearsExperience,
    avatarInitials: initialsFromName(input.name),
    traits: emptyTraits,
    fitScores: emptyFitScores,
    timeToHire: input.timeToHire,
    costToHire: input.costToHire,
    riskScore: emptyRiskScores,
    reasoning: emptyReasoning,
    isNew: true,
    bio: {
      education: "Not provided",
      description: input.background || "Manually added candidate",
      skills: input.skills,
    },
  } as Candidate;
}