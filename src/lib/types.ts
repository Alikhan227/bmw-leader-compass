export type Scenario = "automotive-continuity" | "transformation" | "supply-chain-crisis";

export interface LeadershipTraits {
  riskTaking: number;
  processFocus: number;
  resilience: number;
  innovation: number;
  stakeholderManagement: number;
  executionSpeed: number;
}

export interface Candidate {
  id: string;
  name: string;
  currentRole: string;
  company: string;
  yearsExperience: number;
  avatarInitials: string;
  traits: LeadershipTraits;
  fitScores: Record<Scenario, number>;
  timeToHire: number; // days
  costToHire: number; // relative 1-10
  riskScore: Record<Scenario, number>; // 1-10
  reasoning: Record<Scenario, string>;
  isNew?: boolean;
  bio?: {
    dateOfBirth: string;
    placeOfBirth: string;
    education: string;
    applicationDate: string;
    description: string;
  };
}

export interface ScenarioConfig {
  id: Scenario;
  label: string;
  description: string;
  icon: string;
  weights: LeadershipTraits;
}
