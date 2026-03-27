import { Candidate, Scenario } from "@/lib/types";
import { rankCandidates } from "@/lib/data";
import { useMemo } from "react";

interface SourceComparisonProps {
  candidates: Candidate[];
  scenario: Scenario;
}

export function SourceComparison({ candidates, scenario }: SourceComparisonProps) {
  const stats = useMemo(() => {
    const ranked = rankCandidates(candidates, scenario);
    const internal = ranked.filter((c) => c.source === "internal");
    const external = ranked.filter((c) => c.source === "external");

    const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    return {
      internal: {
        count: internal.length,
        avgFit: avg(internal.map((c) => c.fitScores[scenario])),
        avgTime: avg(internal.map((c) => c.timeToHire)),
        avgCost: avg(internal.map((c) => c.costToHire)),
        avgRisk: avg(internal.map((c) => c.riskScore[scenario])),
      },
      external: {
        count: external.length,
        avgFit: avg(external.map((c) => c.fitScores[scenario])),
        avgTime: avg(external.map((c) => c.timeToHire)),
        avgCost: avg(external.map((c) => c.costToHire)),
        avgRisk: avg(external.map((c) => c.riskScore[scenario])),
      },
    };
  }, [candidates, scenario]);

  return (
    <div className="bmw-card p-4">
      <h3 className="bmw-section-title mb-3">Internal vs. External Sourcing</h3>
      <div className="grid grid-cols-2 gap-3">
        <SourceColumn label="Internal" data={stats.internal} />
        <SourceColumn label="External" data={stats.external} />
      </div>
    </div>
  );
}

function SourceColumn({ label, data }: { label: string; data: { count: number; avgFit: number; avgTime: number; avgCost: number; avgRisk: number } }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">{label} <span className="text-muted-foreground font-normal">({data.count})</span></p>
      <div className="space-y-1.5 text-xs">
        <Row label="Avg Fit" value={`${data.avgFit}%`} />
        <Row label="Avg Time" value={`${data.avgTime}d`} />
        <Row label="Avg Cost" value={`${data.avgCost}/10`} />
        <Row label="Avg Risk" value={`${data.avgRisk}/10`} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
