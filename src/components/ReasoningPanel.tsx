import { Candidate, Scenario } from "@/lib/types";
import { getScenarioConfig } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

interface ReasoningPanelProps {
  candidate: Candidate;
  scenario: Scenario;
}

export function ReasoningPanel({ candidate, scenario }: ReasoningPanelProps) {
  if (!candidate) return (
    <div className="bmw-card p-5 h-64 flex items-center justify-center bg-[#0A0A0A] border border-[#222222]">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse">Calculating AI Reasoning Summary...</p>
    </div>
  );
  const config = getScenarioConfig(scenario);

  const fitScore = candidate.fitScores?.[scenario] ?? 0;
  const risk = candidate.riskScore?.[scenario] ?? 5;
  const reasoningText =
    candidate.reasoning?.[scenario] ||
    "AI reasoning is not available yet for this candidate.";

  const timeToHire = candidate.timeToHire ?? 30;

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

        <div className="bg-[#111111] rounded-none p-4 border-l-4 border-[#0066B1]">
          <p className="text-sm leading-relaxed text-foreground">
            {reasoningText}
          </p>
        </div>

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
              value={`${timeToHire}d`}
              level={timeToHire <= 14 ? "high" : timeToHire <= 45 ? "mid" : "low"}
            />
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-4">
          <h4 className="text-[10px] font-bold text-[#0066B1] uppercase tracking-[0.2em] mb-2">
            Speed vs. Right Hire
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1.5">
                <span>Faster</span>
                <span>Better Fit</span>
              </div>
              <div className="h-1 bg-[#222222] rounded-none relative overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-[#0066B1] rounded-none"
                  initial={{ width: 0 }}
                  animate={{ width: `${fitScore}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {timeToHire <= 14
              ? "✅ Fast deployment — low transition risk."
              : timeToHire <= 45
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
    level === "high"
      ? "bg-bmw-success/10 border-bmw-success/30"
      : level === "mid"
        ? "bg-bmw-warning/10 border-bmw-warning/30"
        : "bg-bmw-danger/10 border-bmw-danger/30";

  return (
    <div className={`rounded-none border p-3 ${bg}`}>
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
        {label}
      </p>
      <p className="text-lg font-bold text-white tracking-wider">{value}</p>
    </div>
  );
}