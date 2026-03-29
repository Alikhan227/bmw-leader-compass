import { Candidate, Scenario, TeamMember, LeadershipTraits } from "@/lib/types";
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
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface LeadershipRadarProps {
  candidate: Candidate;
  scenario: Scenario;
  team?: TeamMember[];
  allCandidates?: Candidate[];
}

const traitLabels: Record<string, string> = {
  riskTaking: "Risk-Taking",
  processFocus: "Process Focus",
  resilience: "Resilience",
  innovation: "Innovation",
  stakeholderManagement: "Stakeholder Mgmt",
  executionSpeed: "Execution Speed",
};

export function LeadershipRadar({
  candidate,
  scenario,
  team,
  allCandidates = [],
}: LeadershipRadarProps) {
  const config = getScenarioConfig(scenario);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showTeam, setShowTeam] = useState(false);

  const compareCandidates = allCandidates.filter((c) =>
    compareIds.includes(c.id)
  );

  const teamAvgTraits = useMemo(() => {
    if (!team || team.length === 0) return null;

    const keys = Object.keys(team[0].traits) as (keyof LeadershipTraits)[];
    const avg: Partial<LeadershipTraits> = {};

    keys.forEach((k) => {
      avg[k] =
        Math.round(
          (team.reduce((sum, m) => sum + m.traits[k], 0) / team.length) * 10
        ) / 10;
    });

    return avg as LeadershipTraits;
  }, [team]);

  const maxCandidates = showTeam ? 1 : 2;

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= maxCandidates) return prev;
      return [...prev, id];
    });
  };

  const toggleTeam = () => {
    setShowTeam((prev) => {
      const next = !prev;
      if (next && compareIds.length > 1) {
        setCompareIds((ids) => ids.slice(0, 1));
      }
      return next;
    });
  };

  const data = useMemo(() => {
    return Object.entries(candidate.traits).map(([key, value]) => {
      const point: Record<string, string | number> = {
        trait: traitLabels[key] || key,
        candidate: value,
        scenarioWeight:
          (config.weights[key as keyof typeof config.weights] || 0) * 10,
      };

      compareCandidates.forEach((c, index) => {
        point[`compare_${index}`] =
          c.traits[key as keyof typeof c.traits];
      });

      if (showTeam && teamAvgTraits) {
        point.teamAvg = teamAvgTraits[key as keyof LeadershipTraits];
      }

      return point;
    });
  }, [candidate, config, compareCandidates, showTeam, teamAvgTraits]);

  const selectedCount = compareIds.length + (showTeam ? 1 : 0);

  return (
    <div className="bmw-card p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="bmw-section-title mb-1">Leadership Profile</h3>
          <p className="text-sm font-semibold text-foreground">{candidate.name}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs w-[180px] justify-between bg-sidebar"
            >
              {selectedCount === 0 ? "Compare with..." : `${selectedCount} Selected`}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-[220px]">
            {team && team.length > 0 && (
              <>
                <DropdownMenuLabel className="text-xs">Team</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={showTeam}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleTeam();
                  }}
                  className="text-xs"
                >
                  Team Average
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuLabel className="text-xs">
              Candidates (Max {maxCandidates})
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {allCandidates
              .filter((c) => c.id !== candidate.id)
              .map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.id}
                  checked={compareIds.includes(c.id)}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleCompare(c.id);
                  }}
                  disabled={
                    !compareIds.includes(c.id) &&
                    compareIds.length >= maxCandidates
                  }
                  className="text-xs"
                >
                  {c.name}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="h-80">
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
              name="Scenario Target"
              dataKey="scenarioWeight"
              stroke="hsl(var(--bmw-warning))"
              fill="hsl(var(--bmw-warning))"
              fillOpacity={0.1}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />

            {showTeam && teamAvgTraits && (
              <Radar
                name="Team Average"
                dataKey="teamAvg"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.15}
                strokeWidth={2}
                strokeDasharray="6 3"
              />
            )}

            {compareCandidates[0] && (
              <Radar
                name={compareCandidates[0].name}
                dataKey="compare_0"
                stroke="#f43f5e"
                fill="#f43f5e"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            )}

            {compareCandidates[1] && (
              <Radar
                name={compareCandidates[1].name}
                dataKey="compare_1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            )}

            <Legend wrapperStyle={{ fontSize: 11 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t pt-4">
        {Object.entries(candidate.traits).map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col justify-center bg-[#111111] p-2 rounded-none border border-[#333333] text-center"
          >
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
              {traitLabels[key] || key}
            </span>
            <span className="text-lg font-bold text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}