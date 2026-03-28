import { Candidate, Scenario, ScenarioConfig } from "./types";

export const scenarios: ScenarioConfig[] = [
  {
    id: "automotive-continuity",
    label: "Automotive Continuity",
    description: "Stability, legacy systems, and operational excellence",
    icon: "🏭",
    weights: { riskTaking: 0.1, processFocus: 0.9, resilience: 0.3, innovation: 0.2, stakeholderManagement: 0.7, executionSpeed: 0.4 },
  },
  {
    id: "transformation",
    label: "Transformation",
    description: "Digital change, future-readiness, and disruption",
    icon: "🚀",
    weights: { riskTaking: 0.8, processFocus: 0.2, resilience: 0.5, innovation: 0.9, stakeholderManagement: 0.6, executionSpeed: 0.7 },
  },
  {
    id: "supply-chain-crisis",
    label: "Supply-Chain Crisis",
    description: "Resilience, rapid response, and risk mitigation",
    icon: "⚡",
    weights: { riskTaking: 0.5, processFocus: 0.1, resilience: 0.9, innovation: 0.3, stakeholderManagement: 0.8, executionSpeed: 0.9 },
  },
];

export const candidates: Candidate[] = [
  {
    id: "c1",
    name: "Dr. Helena Richter",
    currentRole: "VP Operations, Powertrain Division",
    company: "BMW Group",
    yearsExperience: 18,
    avatarInitials: "HR",
    traits: { riskTaking: 3, processFocus: 9, resilience: 7, innovation: 4, stakeholderManagement: 8, executionSpeed: 6 },
    fitScores: { "automotive-continuity": 92, transformation: 58, "supply-chain-crisis": 74 },
    timeToHire: 14,
    costToHire: 2,
    riskScore: { "automotive-continuity": 2, transformation: 7, "supply-chain-crisis": 4 },
    reasoning: {
      "automotive-continuity": "Dr. Richter's 18-year tenure and deep process expertise make her the strongest continuity candidate. Her robust network across the powertrain division ensures seamless transitions with minimal disruption.",
      transformation: "While experienced, Dr. Richter's low risk-taking and innovation scores suggest she may resist the pace of digital transformation. Consider pairing with a Chief Digital Officer.",
      "supply-chain-crisis": "Strong resilience and stakeholder management compensate for moderate execution speed. Her broad organizational network enables rapid cross-functional coordination during crises.",
    },
  },
  {
    id: "c2",
    name: "Marcus Chen",
    currentRole: "Chief Transformation Officer",
    company: "Siemens Mobility",
    yearsExperience: 15,
    avatarInitials: "MC",
    traits: { riskTaking: 8, processFocus: 4, resilience: 6, innovation: 9, stakeholderManagement: 7, executionSpeed: 8 },
    fitScores: { "automotive-continuity": 45, transformation: 94, "supply-chain-crisis": 71 },
    timeToHire: 60,
    costToHire: 8,
    riskScore: { "automotive-continuity": 8, transformation: 2, "supply-chain-crisis": 5 },
    reasoning: {
      "automotive-continuity": "Chen's disruption-oriented profile creates significant risk for continuity-focused operations. His low process-focus score conflicts with the stability requirements of this scenario.",
      transformation: "Top candidate. Chen led Siemens Mobility's €2B digital platform migration. His innovation score (9/10) and execution speed (8/10) directly align with transformation priorities.",
      "supply-chain-crisis": "Strong execution speed but moderate resilience. His fresh perspective could bring novel crisis management approaches, though onboarding time (60 days) is a concern.",
    },
  },
  {
    id: "c3",
    name: "Sarah Okonkwo",
    currentRole: "SVP Global Supply Chain",
    company: "Stellantis",
    yearsExperience: 20,
    avatarInitials: "SO",
    traits: { riskTaking: 6, processFocus: 5, resilience: 9, innovation: 6, stakeholderManagement: 9, executionSpeed: 9 },
    fitScores: { "automotive-continuity": 68, transformation: 72, "supply-chain-crisis": 96 },
    timeToHire: 45,
    costToHire: 9,
    riskScore: { "automotive-continuity": 5, transformation: 4, "supply-chain-crisis": 1 },
    reasoning: {
      "automotive-continuity": "Okonkwo's balanced profile works for continuity but her higher cost creates unnecessary friction for a stability-focused role.",
      transformation: "Well-rounded leadership traits with strong innovation capacity. Her supply chain transformation experience at Stellantis is transferable to broader digital initiatives.",
      "supply-chain-crisis": "Definitive crisis leader. Resilience (9/10), stakeholder management (9/10), and execution speed (9/10) form the ideal crisis response profile. She managed Stellantis' semiconductor shortage response, reducing downtime by 40%.",
    },
  },
  {
    id: "c4",
    name: "Thomas Weber",
    currentRole: "Director of Manufacturing Excellence",
    company: "BMW Group",
    yearsExperience: 12,
    avatarInitials: "TW",
    traits: { riskTaking: 5, processFocus: 7, resilience: 8, innovation: 5, stakeholderManagement: 6, executionSpeed: 7 },
    fitScores: { "automotive-continuity": 78, transformation: 62, "supply-chain-crisis": 80 },
    timeToHire: 7,
    costToHire: 1,
    riskScore: { "automotive-continuity": 3, transformation: 5, "supply-chain-crisis": 3 },
    reasoning: {
      "automotive-continuity": "Weber is a strong continuity candidate with balanced traits. His current background means practically zero onboarding friction, though his stakeholder network is narrower than Dr. Richter's.",
      transformation: "Moderate innovation and risk-taking scores limit his transformation potential. Could serve as a stabilizing force in a transformation team but not as lead.",
      "supply-chain-crisis": "Excellent crisis candidate due to resilience (8/10) and fastest time-to-deploy (7 days). The speed-to-deployment advantage may outweigh marginally lower fit scores vs. Okonkwo.",
    },
  },
  {
    id: "c5",
    name: "Priya Kapoor",
    currentRole: "Head of Digital Products",
    company: "Volkswagen AG",
    yearsExperience: 10,
    avatarInitials: "PK",
    traits: { riskTaking: 7, processFocus: 3, resilience: 5, innovation: 8, stakeholderManagement: 5, executionSpeed: 8 },
    fitScores: { "automotive-continuity": 38, transformation: 88, "supply-chain-crisis": 55 },
    timeToHire: 50,
    costToHire: 7,
    riskScore: { "automotive-continuity": 9, transformation: 3, "supply-chain-crisis": 7 },
    reasoning: {
      "automotive-continuity": "Kapoor's digital-first approach and low process-focus score make her a poor fit for continuity operations. High risk of cultural misalignment.",
      transformation: "Strong transformation candidate with proven digital product leadership. Her VW experience brings relevant automotive context. Ranked #2 behind Chen due to less executive-level experience.",
      "supply-chain-crisis": "Innovation and speed are assets, but low resilience (5/10) and stakeholder management (5/10) are critical gaps for crisis leadership.",
    },
  },
];

export function rankCandidates(candidateList: Candidate[], scenario: Scenario): Candidate[] {
  return [...candidateList].sort((a, b) => b.fitScores[scenario] - a.fitScores[scenario]);
}

export function getScenarioConfig(scenario: Scenario): ScenarioConfig {
  return scenarios.find((s) => s.id === scenario)!;
}
