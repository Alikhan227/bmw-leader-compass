import { useState, useCallback, useMemo, useEffect } from "react";
import { Candidate, Scenario } from "@/lib/types";
import { candidates as mockCandidates, vacancies, rankCandidates } from "@/lib/data";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ScenarioToggle } from "@/components/ScenarioToggle";
import { CandidateRankList } from "@/components/CandidateRankList";
import { LeadershipRadar } from "@/components/LeadershipRadar";
import { ReasoningPanel } from "@/components/ReasoningPanel";
import { LoginScreen } from "@/components/LoginScreen";
import { VacancyListScreen } from "@/components/VacancyListScreen";
import { VacancyDetailPage } from "@/components/VacancyDetailPage";
import { TalentPoolTab } from "@/components/TalentPoolTab";
import { AiDecisionPanel } from "@/components/AiDecisionPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { useMasterWebhook } from "@/hooks/useDecisionWebhook";
import { useCandidatesDB } from "@/hooks/useCandidatesDB";

type AppScreen = "login" | "vacancies" | "vacancy-detail" | "dashboard";

export default function Index() {
  const { candidates: dbCandidates } = useCandidatesDB();
  const [screen, setScreen] = useState<AppScreen>("login");
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);
  const [scenario, setScenario] = useState<Scenario>("automotive-continuity");
  const [selectedId, setSelectedId] = useState<string | null>("c1");
  const [manualCandidates, setManualCandidates] = useState<Candidate[]>([]);

  const {
    masterData,
    isLoading: aiLoading,
    error: aiError,
    fetchAll,
    getDecision,
    getCandidates,
  } = useMasterWebhook();

  // Local candidates = mock + manually added
  const localCandidates = manualCandidates;
  const webhookCandidates = useMemo(() => {
  const defaultMapped = mockCandidates.map((c) => ({
    id: c.id,
    name: c.name,
    current_role: c.currentRole,
    company: c.company,
    experience_years: c.yearsExperience,
    avatar_initials: c.avatarInitials,
    time_to_hire: c.timeToHire,
    cost_to_hire: c.costToHire,
    is_new: c.isNew,
    skills: Array.isArray((c.bio as any)?.skills) ? (c.bio as any).skills : [],
    background:
      typeof (c.bio as any)?.description === "string"
        ? (c.bio as any).description
        : c.reasoning?.["automotive-continuity"] || "Default candidate",
    bio: c.bio ?? null,
  }));

  const manualMapped = manualCandidates.map((c) => ({
    id: c.id,
    name: c.name,
    current_role: c.currentRole,
    company: c.company,
    experience_years: c.yearsExperience,
    avatar_initials: c.avatarInitials,
    time_to_hire: c.timeToHire,
    cost_to_hire: c.costToHire,
    is_new: c.isNew,
    skills: Array.isArray((c.bio as any)?.skills) ? (c.bio as any).skills : [],
    background:
      typeof (c.bio as any)?.description === "string"
        ? (c.bio as any).description
        : c.reasoning?.["automotive-continuity"] || "Manually added candidate",
    bio: c.bio ?? null,
  }));

  const unique = new Map<string, (typeof defaultMapped)[number]>();

  for (const candidate of [...defaultMapped, ...manualMapped]) {
    const key = candidate.name.trim().toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, candidate);
    }
  }

  return Array.from(unique.values());
}, [manualCandidates]);
  // Live candidates from webhook
  const liveCandidates = masterData ? getCandidates(scenario) : null;

  // If we have live data, keep it as base and append manual candidates locally
  const candidates = useMemo(() => {
  const map = new Map<string, Candidate>();

  for (const c of dbCandidates || []) {
    map.set(c.name.toLowerCase(), c);
  }

  for (const c of liveCandidates || []) {
    map.set(c.name.toLowerCase(), c);
  }

  return rankCandidates(Array.from(map.values()), scenario);
}, [dbCandidates, liveCandidates, scenario]);

  const currentDecision = masterData ? getDecision(scenario) : null;

  const selectedCandidate = useMemo(
    () => candidates.find((c) => c.id === selectedId) ?? candidates[0],
    [selectedId, candidates]
  );

  const selectedVacancy = useMemo(
    () => vacancies.find((v) => v.id === selectedVacancyId) ?? null,
    [selectedVacancyId]
  );

  // Trigger AI pipeline only once on first dashboard entry, unless user retries manually

  const handleScenarioChange = useCallback(
    (s: Scenario) => {
      setScenario(s);
      const newCandidates = liveCandidates
        ? [...getCandidates(s), ...manualCandidates]
        : rankCandidates([...mockCandidates, ...manualCandidates], s);

      if (newCandidates.length > 0) {
        setSelectedId(newCandidates[0].id);
      }
    },
    [liveCandidates, getCandidates, manualCandidates]
  );

  const handleLoginComplete = useCallback(() => {
    setScreen("vacancies");
  }, []);

  const handleVacancySelect = useCallback((id: string) => {
    setSelectedVacancyId(id);
    setScreen("vacancy-detail");
  }, []);

  const candidatesForAnalyze = useMemo(() => {
  return candidates.map((c) => ({
    id: c.id,
    name: c.name,
    current_role: c.currentRole,
    company: c.company,
    experience_years: c.yearsExperience,
    avatar_initials: c.avatarInitials,
    time_to_hire: c.timeToHire,
    cost_to_hire: c.costToHire,
    is_new: c.isNew,
    skills: Array.isArray((c.bio as any)?.skills) ? (c.bio as any).skills : [],
    background:
      typeof (c.bio as any)?.description === "string"
        ? (c.bio as any).description
        : "Candidate from HR system",
    bio: c.bio ?? null,
  }));
}, [candidates]);

  const handleAnalyze = useCallback(() => {
  fetchAll("logistics_lead", candidatesForAnalyze);
  setScreen("dashboard");
}, [fetchAll, candidatesForAnalyze]);

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

  const handleRetryAi = useCallback(() => {
  fetchAll("logistics_lead", candidatesForAnalyze);
}, [fetchAll, candidatesForAnalyze]);

  const handleAddCandidate = useCallback((candidate: Candidate) => {
  setManualCandidates((prev) => {
    const normalizedName = candidate.name.trim().toLowerCase();

    const exists = prev.some(
      (c) =>
        c.id === candidate.id ||
        c.name.trim().toLowerCase() === normalizedName
    );

    if (exists) return prev;
    return [...prev, candidate];
  });

  setSelectedId(candidate.id);
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
    candidates={candidates}
    onAddCandidate={handleAddCandidate}
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
            {aiLoading && (
              <div className="bg-[#0066B1]/10 border border-[#0066B1]/30 rounded-none p-3 flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-[#0066B1] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#0066B1]">
                  BMW AI Pipeline is analyzing candidates across all scenarios...
                </p>
              </div>
            )}

            {aiError && !masterData && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-none p-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                  AI Agent unavailable — showing mock data
                </p>
                <button
                  onClick={handleRetryAi}
                  className="text-xs font-bold uppercase tracking-widest text-[#0066B1] hover:text-white transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {masterData && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-none p-3 flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  AI Pipeline active — all 3 scenarios pre-computed
                </p>
              </div>
            )}

            <Tabs defaultValue="decision" className="w-full">
              <div className="mb-6">
                <TabsList className="bg-card border border-border/20 p-1 h-auto">
                  <TabsTrigger
                    value="decision"
                    className="text-xs px-6 py-2.5 uppercase tracking-wider font-semibold"
                  >
                    Decision Engine
                  </TabsTrigger>
                  <TabsTrigger
                    value="pool"
                    className="text-xs px-6 py-2.5 uppercase tracking-wider font-semibold flex items-center gap-2"
                  >
                    Talent Pool
                    <span className="text-muted-foreground ml-0.5">
                      ({candidates.length})
                    </span>
                    {candidates.some((c) => c.isNew) && (
                      <span className="relative flex h-2 w-2 ml-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bmw-danger opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-bmw-danger" />
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="decision" className="space-y-6 mt-0">
                <section aria-label="Scenario Selection">
                  <p className="bmw-section-title mb-2">
                    Context Agent — Select Business Scenario
                  </p>
                  <ScenarioToggle active={scenario} onChange={handleScenarioChange} />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <section className="lg:col-span-5 space-y-2" aria-label="Candidate Rankings">
                    <p className="bmw-section-title">CV Agent — Candidate Ranking</p>
                    <CandidateRankList
                      candidates={candidates}
                      scenario={scenario}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                    />
                  </section>

                  <section className="lg:col-span-7 space-y-4" aria-label="Candidate Details">
                    <LeadershipRadar
                      candidate={selectedCandidate}
                      scenario={scenario}
                      team={selectedVacancy?.team}
                    />
                    <ReasoningPanel candidate={selectedCandidate} scenario={scenario} />
                  </section>
                </div>

                <section aria-label="AI Decision Intelligence">
                  <p className="bmw-section-title mb-2">
                    Decision Intelligence Agent
                  </p>
                  <AiDecisionPanel
                    decision={currentDecision}
                    isLoading={aiLoading}
                    error={aiError}
                    onRetry={handleRetryAi}
                  />
                </section>
              </TabsContent>

              <TabsContent value="pool" className="mt-0 outline-none">
                <TalentPoolTab
                  candidates={candidates}
                />
              </TabsContent>
            </Tabs>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}