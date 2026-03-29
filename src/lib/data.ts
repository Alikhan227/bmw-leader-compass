import { Candidate, Scenario, ScenarioConfig, Vacancy } from "./types";

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
export const candidates: Candidate[] = [];

export const vacancies: Vacancy[] = [
  {
    id: "v1",
    title: "VP Powertrain Operations",
    department: "Powertrain Division",
    location: "Munich, Germany",
    locationType: "in-person",
    employmentType: "full-time",
    salaryRange: "€120,000 – €160,000",
    applicantCount: 4,
    status: "active",
    description: "We are seeking an exceptional executive to lead our Powertrain Operations division through a period of transformational change. The ideal candidate will oversee a team of 200+ engineers across 3 manufacturing sites, driving operational excellence while navigating the transition from internal combustion to electrified powertrains. This role demands a leader who can balance legacy system stability with aggressive innovation targets, ensuring BMW maintains its competitive edge in next-generation mobility solutions.",
    team: [
      {
        id: "tm1",
        name: "Klaus Bergmann",
        role: "Director of Powertrain Engineering",
        avatarInitials: "KB",
        traits: { riskTaking: 4, processFocus: 8, resilience: 7, innovation: 5, stakeholderManagement: 6, executionSpeed: 7 },
      },
      {
        id: "tm2",
        name: "Yuki Tanaka",
        role: "Head of E-Drive Systems",
        avatarInitials: "YT",
        traits: { riskTaking: 7, processFocus: 5, resilience: 6, innovation: 9, stakeholderManagement: 4, executionSpeed: 8 },
      },
      {
        id: "tm3",
        name: "Martin Schulze",
        role: "Senior Manager, Quality Assurance",
        avatarInitials: "MS",
        traits: { riskTaking: 2, processFocus: 9, resilience: 8, innovation: 3, stakeholderManagement: 7, executionSpeed: 5 },
      },
    ],
    teamGaps: [
      "Low Stakeholder Management (avg 5.7/10)",
      "Weak Risk-Taking appetite (avg 4.3/10)",
      "No board-level executive representation",
    ],
    teamAiOverview: "The current Powertrain team shows strong Process Focus (avg 7.3) and Resilience (avg 7.0) but critically lacks in Stakeholder Management (avg 5.7) and balanced Risk-Taking (avg 4.3). The AI recommends prioritizing a candidate with high Stakeholder Management (≥8) and moderate Risk-Taking appetite to bridge the leadership gap. The team also lacks a unifying executive voice capable of championing cross-divisional initiatives at the board level — this is the key capability gap that the new VP must fill.",
  },
  {
    id: "v2",
    title: "Head of Digital Transformation",
    department: "Digital Innovation Lab",
    location: "Munich, Germany",
    locationType: "hybrid",
    employmentType: "full-time",
    salaryRange: "€110,000 – €145,000",
    applicantCount: 12,
    status: "closed",
    description: "Lead BMW's digital transformation initiatives across connected car services, digital twin manufacturing, and AI-driven customer engagement platforms.",
    team: [],
    teamGaps: [],
    teamAiOverview: "",
  },
  {
    id: "v3",
    title: "SVP Global Supply Chain",
    department: "Operations & Logistics",
    location: "Leipzig, Germany",
    locationType: "in-person",
    employmentType: "full-time",
    salaryRange: "€140,000 – €180,000",
    applicantCount: 0,
    status: "draft",
    description: "Build and lead a resilient global supply chain network capable of withstanding geopolitical disruptions and semiconductor shortages.",
    team: [],
    teamGaps: [],
    teamAiOverview: "",
  },
];

export function rankCandidates(candidateList: Candidate[], scenario: Scenario): Candidate[] {
  return [...candidateList].sort((a, b) => b.fitScores[scenario] - a.fitScores[scenario]);
}

export function getScenarioConfig(scenario: Scenario): ScenarioConfig {
  return scenarios.find((s) => s.id === scenario)!;
}

