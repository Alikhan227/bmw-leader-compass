import { Candidate, Scenario } from "@/lib/types";
import { getScenarioConfig } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

interface ReasoningPanelProps {
  candidate: Candidate;
  scenario: Scenario;
}

export function ReasoningPanel({ candidate, scenario }: ReasoningPanelProps) {
  const config = getScenarioConfig(scenario);
  const fitScore = candidate.fitScores[scenario];
  const risk = candidate.riskScore[scenario];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${candidate.id}-${scenario}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="bmw-card p-5 space-y-4"
      >
        <div>
          <h3 className="bmw-section-title mb-1">AI Reasoning</h3>
          <p className="text-sm font-semibold text-foreground">
            Why {candidate.name} for "{config.label}"
          </p>
        </div>

        {/* Reasoning text */}
        <div className="bg-accent/50 rounded-md p-4 border-l-4 border-primary">
          <p className="text-sm leading-relaxed text-foreground">
            {candidate.reasoning[scenario]}
          </p>
        </div>

        {/* Trade-off matrix */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Decision Trade-offs
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <TradeoffCard
              label="Fit Score"
              value={`${fitScore}%`}
              level={fitScore >= 85 ? "high" : fitScore >= 65 ? "mid" : "low"}
            />
            <TradeoffCard
              label="Risk Level"
              value={`${risk}/10`}
              level={risk <= 3 ? "high" : risk <= 6 ? "mid" : "low"}
            />
            <TradeoffCard
              label="Time to Deploy"
              value={`${candidate.timeToHire}d`}
              level={candidate.timeToHire <= 14 ? "high" : candidate.timeToHire <= 45 ? "mid" : "low"}
            />
            <TradeoffCard
              label="Source"
              value={candidate.source === "internal" ? "Internal" : "External"}
              level={candidate.source === "internal" ? "high" : "mid"}
            />
          </div>
        </div>

        {/* Speed vs Right Hire explicit trade-off */}
        <div className="bg-muted/50 rounded-md p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            ⚖️ Speed vs. Right Hire
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Faster</span>
                <span>Better Fit</span>
              </div>
              <div className="h-2 bg-muted rounded-full relative overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-bmw-warning to-bmw-success rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${fitScore}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {candidate.timeToHire <= 14
              ? "✅ Fast deployment — low transition risk."
              : candidate.timeToHire <= 45
              ? "⚠️ Moderate timeline — plan for interim coverage."
              : "🔴 Extended onboarding — consider interim leader."}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function TradeoffCard({
  label,
  value,
  level,
}: {
  label: string;
  value: string;
  level: "high" | "mid" | "low";
}) {
  const bg =
    level === "high" ? "bg-bmw-success/10 border-bmw-success/30" :
    level === "mid" ? "bg-bmw-warning/10 border-bmw-warning/30" :
    "bg-bmw-danger/10 border-bmw-danger/30";

  return (
    <div className={`rounded-md border p-3 ${bg}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
