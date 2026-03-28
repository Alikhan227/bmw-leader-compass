import { useState, useCallback } from "react";

export interface WebhookRisk {
  risk_type: string;
  severity: "High" | "Medium" | "Low";
  mitigation: string;
}

export interface WebhookAlternative {
  candidate_name: string;
  brief_rationale: string;
}

export interface WebhookDecision {
  recommended_candidate: string;
  rationale: string;
  trade_off: string;
  risks: WebhookRisk[];
  alternatives: WebhookAlternative[];
}

interface UseDecisionWebhookReturn {
  decision: WebhookDecision | null;
  isLoading: boolean;
  error: string | null;
  fetchDecision: (scenarioName: string) => Promise<void>;
}

const WEBHOOK_URL = "https://timatakky.app.n8n.cloud/webhook-test/b57e4f76-abce-44e4-82bb-150979c13861";

const scenarioMap: Record<string, string> = {
  "automotive-continuity": "Business as Usual",
  "transformation": "Digital Transformation",
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

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const json = await response.json();

      // Handle both wrapper and direct format
      const data = json.data || json;

      const parsed: WebhookDecision = {
        recommended_candidate: data.recommended_candidate || "Unknown",
        rationale: data.rationale || "",
        trade_off: data.trade_off || "",
        risks: Array.isArray(data.risks) ? data.risks : [],
        alternatives: Array.isArray(data.alternatives) ? data.alternatives : [],
      };

      setDecision(parsed);
    } catch (err: any) {
      setError(err.message || "Failed to connect to AI Agent. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { decision, isLoading, error, fetchDecision };
}
