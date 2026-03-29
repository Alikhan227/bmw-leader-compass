import { useMemo } from "react";
import { Candidate } from "@/lib/types";

type TalentPoolTabProps = {
  candidates: Candidate[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

export function TalentPoolTab({
  candidates,
  selectedId,
  onSelect,
}: TalentPoolTabProps) {
  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [candidates]);

  return (
    <div className="space-y-6">
      <div>
        <p className="bmw-section-title">Talent Pool</p>
        <p className="text-sm text-muted-foreground">
          Review the current candidate pool.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {sortedCandidates.map((candidate) => {
          const isSelected = selectedId === candidate.id;

          return (
            <button
              key={candidate.id}
              type="button"
              onClick={() => onSelect?.(candidate.id)}
              className={`text-left border p-4 rounded-none space-y-2 transition-colors w-full ${
                isSelected
                  ? "border-[#0066B1] bg-[#0066B1]/10"
                  : "border-border/30 bg-card hover:border-[#0066B1]/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-base">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {candidate.currentRole} · {candidate.company}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {candidate.isNew && (
                    <span className="text-[10px] px-2 py-1 border border-red-500/30 bg-red-500/10 text-red-400 uppercase tracking-widest font-bold">
                      New
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div>Experience: {candidate.yearsExperience} yrs</div>
                <div>Time to hire: {candidate.timeToHire} days</div>
                <div>Cost to hire: {candidate.costToHire}/10</div>
                <div>
                  Top fit:{" "}
                  {Math.max(
                    candidate.fitScores?.["automotive-continuity"] || 0,
                    candidate.fitScores?.transformation || 0,
                    candidate.fitScores?.["supply-chain-crisis"] || 0
                  )}
                </div>
              </div>

              {candidate.bio?.description && (
                <p className="text-xs text-muted-foreground line-clamp-3 pt-1">
                  {candidate.bio.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}