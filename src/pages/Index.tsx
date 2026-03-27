import { useState, useCallback, useMemo } from "react";
import { Scenario } from "@/lib/types";
import { candidates } from "@/lib/data";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ScenarioToggle } from "@/components/ScenarioToggle";
import { CandidateRankList } from "@/components/CandidateRankList";
import { LeadershipRadar } from "@/components/LeadershipRadar";
import { ReasoningPanel } from "@/components/ReasoningPanel";
import { SourceComparison } from "@/components/SourceComparison";
import { rankCandidates } from "@/lib/data";

export default function Index() {
  const [scenario, setScenario] = useState<Scenario>("automotive-continuity");
  const [selectedId, setSelectedId] = useState<string | null>("c1");

  const ranked = useMemo(() => rankCandidates(candidates, scenario), [scenario]);
  
  const selectedCandidate = useMemo(
    () => candidates.find((c) => c.id === selectedId) ?? ranked[0],
    [selectedId, ranked]
  );

  const handleScenarioChange = useCallback((s: Scenario) => {
    setScenario(s);
    // Auto-select the top candidate for the new scenario
    const newRanked = rankCandidates(candidates, s);
    setSelectedId(newRanked[0].id);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container px-6 py-6 space-y-6">
        {/* Scenario Selector */}
        <section aria-label="Scenario Selection">
          <p className="bmw-section-title mb-2">Context Agent — Select Business Scenario</p>
          <ScenarioToggle active={scenario} onChange={handleScenarioChange} />
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Candidate Rankings */}
          <section className="lg:col-span-5 space-y-2" aria-label="Candidate Rankings">
            <p className="bmw-section-title">CV Agent — Candidate Ranking</p>
            <CandidateRankList
              candidates={candidates}
              scenario={scenario}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </section>

          {/* Right: Detail Panel */}
          <section className="lg:col-span-7 space-y-4" aria-label="Candidate Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LeadershipRadar candidate={selectedCandidate} scenario={scenario} />
              <SourceComparison candidates={candidates} scenario={scenario} />
            </div>
            <ReasoningPanel candidate={selectedCandidate} scenario={scenario} />
          </section>
        </div>
      </main>
    </div>
  );
}
