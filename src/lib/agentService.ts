/**
 * ============================================================
 * BMW Decision Intelligence — Agent Integration Service
 * ============================================================
 *
 * This file is a TEMPLATE for connecting the AI backend agents
 * to the existing frontend components. Currently all data is
 * served from mock data in `src/lib/data.ts`.
 *
 * When the n8n agents are ready, follow these steps:
 *
 * ── STEP 1: CANDIDATE RANKING (CV Agent) ──
 * Currently: `rankCandidates()` in data.ts sorts by fitScores
 * To connect: Replace with webhook call that returns ranked candidates
 *
 *   async function fetchRankedCandidates(scenario: string): Promise<Candidate[]> {
 *     const res = await fetch(WEBHOOK_URL, {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ agent: "cv", scenario }),
 *     });
 *     const json = await res.json();
 *     return json.data.candidates; // must match Candidate[] type
 *   }
 *
 * Then in Index.tsx, replace:
 *   const ranked = useMemo(() => rankCandidates(candidates, scenario), [scenario]);
 * With:
 *   const { data: ranked } = useQuery(['ranking', scenario], () => fetchRankedCandidates(scenario));
 *
 *
 * ── STEP 2: LEADERSHIP PROFILE (Radar / Trait Agent) ──
 * Currently: candidate.traits is static mock data
 * To connect: Webhook returns traits per candidate
 *
 *   async function fetchCandidateTraits(candidateId: string): Promise<LeadershipTraits> {
 *     const res = await fetch(WEBHOOK_URL, {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ agent: "traits", candidateId }),
 *     });
 *     const json = await res.json();
 *     return json.data.traits;
 *   }
 *
 *
 * ── STEP 3: AI REASONING (Decision Agent) ──
 * Currently: candidate.reasoning[scenario] is static text
 * To connect: Webhook returns reasoning per candidate+scenario
 *
 *   async function fetchReasoning(candidateId: string, scenario: string): Promise<{
 *     rationale: string;
 *     trade_off: string;
 *     risks: { risk_type: string; severity: string; mitigation: string }[];
 *   }> {
 *     const res = await fetch(WEBHOOK_URL, {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ agent: "reasoning", candidateId, scenario }),
 *     });
 *     const json = await res.json();
 *     return json.data;
 *   }
 *
 *
 * ── WEBHOOK CONFIG ──
 */

export const WEBHOOK_URL = "https://timatakky.app.n8n.cloud/webhook-test/b57e4f76-abce-44e4-82bb-150979c13861";

export const SCENARIO_MAP: Record<string, string> = {
  "automotive-continuity": "Business as Usual",
  "transformation": "Digital Transformation",
  "supply-chain-crisis": "Supply Chain Crisis",
};

/**
 * Generic fetch helper with error handling.
 * Use this when connecting any agent.
 */
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
