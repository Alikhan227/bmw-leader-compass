import { memo, useMemo } from "react";
import { Candidate, Scenario } from "@/lib/types";
import { rankCandidates } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface CandidateRankListProps {
  candidates: Candidate[];
  scenario: Scenario;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function ScoreBadge({ score }: { score: number }) {
  const colorClass =
    score >= 85 ? "bg-bmw-success/15 text-bmw-success" :
    score >= 65 ? "bg-bmw-warning/15 text-bmw-warning" :
    "bg-bmw-danger/15 text-bmw-danger";
  return <span className={`bmw-score-badge ${colorClass}`}>{score}%</span>;
}

function RiskIndicator({ risk }: { risk: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Risk score ${risk} out of 10`}>
      <span className="text-xs text-muted-foreground">Risk</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-3 rounded-sm ${
              i < risk
                ? risk >= 7 ? "bg-bmw-danger" : risk >= 4 ? "bg-bmw-warning" : "bg-bmw-success"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export const CandidateRankList = memo(function CandidateRankList({
  candidates,
  scenario,
  selectedId,
  onSelect,
}: CandidateRankListProps) {
  const ranked = useMemo(() => rankCandidates(candidates, scenario), [candidates, scenario]);

  return (
    <div className="space-y-2" role="listbox" aria-label="Candidate Rankings">
      <AnimatePresence mode="popLayout">
        {ranked.map((c, idx) => (
          <motion.button
            key={c.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            role="option"
            aria-selected={selectedId === c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full text-left bmw-card-elevated p-4 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selectedId === c.id ? "ring-2 ring-primary border-primary" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Rank number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {idx + 1}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-semibold">
                {c.avatarInitials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground truncate">{c.name}</h3>
                  <Badge variant={c.source === "internal" ? "default" : "secondary"} className="text-[10px]">
                    {c.source === "internal" ? "Internal" : "External"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{c.currentRole}</p>
                <p className="text-xs text-muted-foreground">{c.company} · {c.yearsExperience}y exp</p>
              </div>

              {/* Scores */}
              <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                <ScoreBadge score={c.fitScores[scenario]} />
                <RiskIndicator risk={c.riskScore[scenario]} />
              </div>
            </div>

            {/* Speed vs Right Hire bar */}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>⏱ {c.timeToHire}d to hire</span>
                <span>💰 Cost: {c.costToHire}/10</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${c.fitScores[scenario]}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                />
              </div>
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
});
