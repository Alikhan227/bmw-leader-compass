import { Candidate, Scenario } from "@/lib/types";
import { getScenarioConfig } from "@/lib/data";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo } from "react";

interface LeadershipRadarProps {
  candidate: Candidate;
  scenario: Scenario;
}

const traitLabels: Record<string, string> = {
  riskTaking: "Risk-Taking",
  processFocus: "Process Focus",
  resilience: "Resilience",
  innovation: "Innovation",
  stakeholderManagement: "Stakeholder Mgmt",
  executionSpeed: "Execution Speed",
};

export function LeadershipRadar({ candidate, scenario }: LeadershipRadarProps) {
  const config = getScenarioConfig(scenario);

  const data = useMemo(() => {
    return Object.entries(candidate.traits).map(([key, value]) => ({
      trait: traitLabels[key] || key,
      candidate: value,
      scenarioWeight: (config.weights[key as keyof typeof config.weights] || 0) * 10,
    }));
  }, [candidate, config]);

  return (
    <div className="bmw-card p-4">
      <h3 className="bmw-section-title mb-1">Leadership Profile</h3>
      <p className="text-sm font-semibold text-foreground mb-3">{candidate.name}</p>
      <div className="h-64" role="img" aria-label={`Radar chart showing leadership traits for ${candidate.name}`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="trait"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            />
            <Radar
              name="Candidate"
              dataKey="candidate"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Radar
              name="Scenario Weight"
              dataKey="scenarioWeight"
              stroke="hsl(var(--bmw-warning))"
              fill="hsl(var(--bmw-warning))"
              fillOpacity={0.1}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
