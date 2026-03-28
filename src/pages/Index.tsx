import { useState, useCallback, useMemo } from "react";
import { Scenario } from "@/lib/types";
import { candidates, vacancies } from "@/lib/data";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ScenarioToggle } from "@/components/ScenarioToggle";
import { CandidateRankList } from "@/components/CandidateRankList";
import { LeadershipRadar } from "@/components/LeadershipRadar";
import { ReasoningPanel } from "@/components/ReasoningPanel";
import { LoginScreen } from "@/components/LoginScreen";
import { VacancyListScreen } from "@/components/VacancyListScreen";
import { VacancyDetailPage } from "@/components/VacancyDetailPage";
import { TalentPoolTab } from "@/components/TalentPoolTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";

import { rankCandidates } from "@/lib/data";

type AppScreen = "login" | "vacancies" | "vacancy-detail" | "dashboard";

export default function Index() {
  const [screen, setScreen] = useState<AppScreen>("login");
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);
  const [scenario, setScenario] = useState<Scenario>("automotive-continuity");
  const [selectedId, setSelectedId] = useState<string | null>("c1");

  const ranked = useMemo(() => rankCandidates(candidates, scenario), [scenario]);
  
  const selectedCandidate = useMemo(
    () => candidates.find((c) => c.id === selectedId) ?? ranked[0],
    [selectedId, ranked]
  );

  const selectedVacancy = useMemo(
    () => vacancies.find((v) => v.id === selectedVacancyId) ?? null,
    [selectedVacancyId]
  );

  const handleScenarioChange = useCallback((s: Scenario) => {
    setScenario(s);
    const newRanked = rankCandidates(candidates, s);
    setSelectedId(newRanked[0].id);
  }, []);

  const handleLoginComplete = useCallback(() => {
    setScreen("vacancies");
  }, []);

  const handleVacancySelect = useCallback((id: string) => {
    setSelectedVacancyId(id);
    setScreen("vacancy-detail");
  }, []);

  const handleAnalyze = useCallback(() => {
    setScreen("dashboard");
  }, []);

  const handleBackToLogin = useCallback(() => {
    setScreen("login");
    setSelectedVacancyId(null);
  }, []);

  const handleBackToVacancies = useCallback(() => {
    setScreen("vacancies");
    setSelectedVacancyId(null);
  }, []);

  const handleBackToVacancyDetail = useCallback(() => {
    setScreen("vacancy-detail");
  }, []);

  return (
    <AnimatePresence mode="wait">
      {screen === "login" && (
        <LoginScreen key="login" onComplete={handleLoginComplete} />
      )}

      {screen === "vacancies" && (
        <VacancyListScreen 
          key="vacancies" 
          vacancies={vacancies} 
          onSelect={handleVacancySelect} 
          onBack={handleBackToLogin} 
        />
      )}

      {screen === "vacancy-detail" && selectedVacancy && (
        <VacancyDetailPage
          key="vacancy-detail"
          vacancy={selectedVacancy}
          onBack={handleBackToVacancies}
          onAnalyze={handleAnalyze}
        />
      )}

      {screen === "dashboard" && (
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen bg-background"
        >
          <DashboardHeader onLogout={handleBackToVacancyDetail} />

      <main className="container px-6 py-6 space-y-6">
        <Tabs defaultValue="decision" className="w-full">
          <div className="mb-6">
            <TabsList className="bg-card border border-border/20 p-1 h-auto">
              <TabsTrigger value="decision" className="text-xs px-6 py-2.5 uppercase tracking-wider font-semibold">Decision Engine</TabsTrigger>
              <TabsTrigger value="pool" className="text-xs px-6 py-2.5 uppercase tracking-wider font-semibold flex items-center gap-2">
                Talent Pool 
                <span className="text-muted-foreground ml-0.5">({candidates.length})</span>
                {candidates.some(c => c.isNew) && (
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bmw-danger opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-bmw-danger"></span>
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="decision" className="space-y-6 mt-0">
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
              <LeadershipRadar candidate={selectedCandidate} scenario={scenario} team={selectedVacancy?.team} />
            <ReasoningPanel candidate={selectedCandidate} scenario={scenario} />
          </section>
        </div>
          </TabsContent>

          <TabsContent value="pool" className="mt-0 outline-none">
            <TalentPoolTab candidates={candidates} />
          </TabsContent>
        </Tabs>
      </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
