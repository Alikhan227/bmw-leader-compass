/**
 * BMW Decision Intelligence — Agent Integration Service
 * Connects to the n8n AI pipeline via webhook.
 * Returns a "Master JSON" with all 3 scenarios pre-computed.
 */

import { Candidate, Scenario, LeadershipTraits } from "./types";

export const WEBHOOK_URL =
  import.meta.env.VITE_WEBHOOK_URL ||
  "https://timatakky.app.n8n.cloud/webhook/b57e4f76-abce-44e4-82bb-150979c13861";

// Direct n8n URL (for production or when not using Vite proxy):
export const WEBHOOK_DIRECT_URL =
  "https://timatakky.app.n8n.cloud/webhook/b57e4f76-abce-44e4-82bb-150979c13861";

export const SCENARIO_MAP: Record<string, string> = {
  "automotive-continuity": "Business as Usual",
  transformation: "Digital Transformation",
  "supply-chain-crisis": "Supply Chain Crisis",
};

// ── Types for Master JSON response ──

export interface WebhookRisk {
  risk_type: string;
  severity: "High" | "Medium" | "Low";
  mitigation: string;
}

export interface WebhookAlternative {
  candidate_name: string;
  brief_rationale: string;
}

export interface ScenarioDecision {
  recommended_candidate: string;
  rationale: string;
  trade_off: string;
  skill_gap_analysis: string;
  risks: WebhookRisk[];
  confidence_level: string;
  alternatives: WebhookAlternative[];
}

export interface MasterResponse {
  candidates: Candidate[];
  decisions: Record<Scenario, ScenarioDecision>;
  weights: Record<Scenario, LeadershipTraits>;
}

// ── Generic fetch helper ──

export async function callAgent<T>(payload: Record<string, unknown>): Promise<T> {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Agent responded with ${res.status}`);
  }

  const json = await res.json();
  return (json.data || json) as T;
}

// ── Fetch the full Master JSON (all scenarios pre-computed) ──

export async function fetchMasterAnalysis(
  roleId: string = "logistics_lead",
  teamMetrics?: Record<string, number>
): Promise<MasterResponse> {
  const payload: Record<string, unknown> = { role_id: roleId };
  if (teamMetrics) {
    payload.team_metrics = teamMetrics;
  }

  const data = await callAgent<MasterResponse>(payload);

  // Validate that we got candidates back
  if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
    throw new Error("Webhook returned no candidates");
  }

  return data;
}

// ── Fetch ranked candidates for a specific scenario (legacy helper) ──

export async function fetchRankedCandidates(scenario: Scenario): Promise<Candidate[]> {
  const master = await fetchMasterAnalysis();
  // Sort by fitScore for the requested scenario (descending)
  return [...master.candidates].sort(
    (a, b) => (b.fitScores[scenario] || 0) - (a.fitScores[scenario] || 0)
  );
}

// ── Fetch decision for a specific scenario ──

export async function fetchDecision(scenario: Scenario): Promise<ScenarioDecision> {
  const master = await fetchMasterAnalysis();
  return master.decisions[scenario];
}
