import { useState, useCallback, useRef } from "react";
import {
  WEBHOOK_URL,
  MasterResponse,
  ScenarioDecision,
  WebhookRisk,
  WebhookAlternative,
} from "@/lib/agentService";
import { Candidate, Scenario } from "@/lib/types";

export type { WebhookRisk, WebhookAlternative };

export interface WebhookDecision {
  recommended_candidate: string;
  rationale: string;
  trade_off: string;
  skill_gap_analysis: string;
  risks: WebhookRisk[];
  alternatives: WebhookAlternative[];
}

interface UseMasterWebhookReturn {
  candidates: Candidate[] | null;
  decision: WebhookDecision | null;
  masterData: MasterResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchAll: (roleId?: string, candidates?: unknown[]) => Promise<void>;
  getDecision: (scenario: Scenario) => WebhookDecision | null;
  getCandidates: (scenario: Scenario) => Candidate[];
}

export function useMasterWebhook(): UseMasterWebhookReturn {
  const [masterData, setMasterData] = useState<MasterResponse | null>(null);
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [decision, setDecision] = useState<WebhookDecision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchAll = useCallback(
    async (roleId: string = "logistics_lead", candidatesArg?: unknown[]) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const payload = {
          role_id: roleId,
          ...(candidatesArg && candidatesArg.length > 0
            ? { candidates: candidatesArg }
            : {}),
        };

        console.log("WEBHOOK_URL:", WEBHOOK_URL);
        console.log("WEBHOOK PAYLOAD:", payload);

        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        const rawText = await response.text();

        console.log("WEBHOOK STATUS:", response.status);
        console.log("WEBHOOK RAW RESPONSE:", rawText);

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${rawText}`);
        }

        let json: any;
        try {
          json = JSON.parse(rawText);
        } catch {
          throw new Error(`Webhook did not return valid JSON: ${rawText}`);
        }

        const data: MasterResponse = json.data || json;

        if (!data || !data.candidates || !Array.isArray(data.candidates)) {
          throw new Error(
            `Invalid response: missing candidates array. Parsed payload: ${JSON.stringify(data)}`
          );
        }

        setMasterData(data);
        setCandidates(data.candidates);

        const firstScenario = Object.keys(data.decisions || {})[0] as Scenario;
        if (firstScenario && data.decisions?.[firstScenario]) {
          const d = data.decisions[firstScenario];
          setDecision({
            recommended_candidate: d.recommended_candidate || "Unknown",
            rationale: d.rationale || "",
            trade_off: d.trade_off || "",
            skill_gap_analysis: d.skill_gap_analysis || "",
            risks: Array.isArray(d.risks) ? d.risks : [],
            alternatives: Array.isArray(d.alternatives) ? d.alternatives : [],
          });
        } else {
          setDecision(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("FETCH ALL ERROR:", err);
        setError(
          err instanceof Error ? err.message : "Failed to connect to AI Agent."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getDecision = useCallback(
    (scenario: Scenario): WebhookDecision | null => {
      if (!masterData?.decisions?.[scenario]) return null;
      const d = masterData.decisions[scenario];
      return {
        recommended_candidate: d.recommended_candidate || "Unknown",
        rationale: d.rationale || "",
        trade_off: d.trade_off || "",
        skill_gap_analysis: d.skill_gap_analysis || "",
        risks: Array.isArray(d.risks) ? d.risks : [],
        alternatives: Array.isArray(d.alternatives) ? d.alternatives : [],
      };
    },
    [masterData]
  );

  const getCandidates = useCallback(
    (scenario: Scenario): Candidate[] => {
      if (!masterData?.candidates) return [];
      return [...masterData.candidates].sort(
        (a, b) => (b.fitScores[scenario] || 0) - (a.fitScores[scenario] || 0)
      );
    },
    [masterData]
  );

  return {
    candidates,
    decision,
    masterData,
    isLoading,
    error,
    fetchAll,
    getDecision,
    getCandidates,
  };
}

interface UseDecisionWebhookReturn {
  decision: WebhookDecision | null;
  isLoading: boolean;
  error: string | null;
  fetchDecision: (scenarioName: string) => Promise<void>;
}

const scenarioMap: Record<string, string> = {
  "automotive-continuity": "Business as Usual",
  transformation: "Digital Transformation",
  "supply-chain-crisis": "Supply Chain Crisis",
};

export function useDecisionWebhook(): UseDecisionWebhookReturn {
  const [decision, setDecision] = useState<WebhookDecision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDecision = useCallback(async (scenarioId: string) => {
    setIsLoading(true);
    setError(null);
    setDecision(null);

    const scenarioName = scenarioMap[scenarioId] || scenarioId;

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenarioName }),
      });

      const rawText = await response.text();

      console.log("LEGACY WEBHOOK STATUS:", response.status);
      console.log("LEGACY WEBHOOK RAW RESPONSE:", rawText);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${rawText}`);
      }

      let json: any;
      try {
        json = JSON.parse(rawText);
      } catch {
        throw new Error(`Webhook did not return valid JSON: ${rawText}`);
      }

      const data = json.data || json;

      const parsed: WebhookDecision = {
        recommended_candidate: data.recommended_candidate || "Unknown",
        rationale: data.rationale || data.recommendation_rationale || "",
        trade_off: data.trade_off || data.trade_off_analysis || "",
        skill_gap_analysis: data.skill_gap_analysis || "",
        risks: Array.isArray(data.risks)
          ? data.risks
          : Array.isArray(data.risk_assessment)
            ? data.risk_assessment
            : [],
        alternatives: Array.isArray(data.alternatives)
          ? data.alternatives
          : Array.isArray(data.alternative_candidates)
            ? data.alternative_candidates
            : [],
      };

      setDecision(parsed);
    } catch (err: unknown) {
      console.error("FETCH DECISION ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to AI Agent."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { decision, isLoading, error, fetchDecision };
}