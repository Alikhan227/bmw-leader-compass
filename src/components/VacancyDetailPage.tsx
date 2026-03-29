import { useMemo } from "react";
import { Vacancy, LeadershipTraits, Candidate } from "@/lib/types";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Building2,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { TalentPoolTab } from "@/components/TalentPoolTab";

interface VacancyDetailPageProps {
  vacancy: Vacancy;
  candidates: Candidate[];
  onAddCandidate: (candidate: Candidate) => void;
  onBack: () => void;
  onAnalyze: () => void;
}

const traitLabels: Record<string, string> = {
  riskTaking: "Risk-Taking",
  processFocus: "Process Focus",
  resilience: "Resilience",
  innovation: "Innovation",
  stakeholderManagement: "Stakeholder Mgmt",
  executionSpeed: "Execution Speed",
};
export function VacancyDetailPage({
  vacancy,
  candidates,
  onAddCandidate,
  onBack,
  onAnalyze,
}: VacancyDetailPageProps) {
  const avgTraits = useMemo(() => {
    if (vacancy.team.length === 0) return null;
    const keys = Object.keys(vacancy.team[0].traits) as (keyof LeadershipTraits)[];
    const avg: Partial<LeadershipTraits> = {};
    keys.forEach((k) => {
      avg[k] =
        Math.round(
          (vacancy.team.reduce((sum, m) => sum + m.traits[k], 0) / vacancy.team.length) * 10
        ) / 10;
    });
    return avg as LeadershipTraits;
  }, [vacancy.team]);



  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
      <header className="border-b border-[#333333] bg-[#0A0A0A]">
        <div className="container flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="mr-2 h-8 w-8 flex items-center justify-center hover:bg-[#111111] transition-colors"
              aria-label="Back to Vacancies"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-white" />
            </button>
            <div className="w-8 h-8 bg-slate-100 flex items-center justify-center p-0.5">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg"
                alt="BMW"
                className="w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">
                {vacancy.title}
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                {vacancy.department}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 border border-emerald-400/30 bg-emerald-400/10 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
            ● ACTIVE
          </div>
        </div>
      </header>

      <main className="container px-6 py-10 max-w-6xl space-y-10">
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-4">
            Position Overview
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#0A0A0A] border border-[#333333] rounded-none p-8">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Job Description
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm">{vacancy.description}</p>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Location
                    </p>
                    <p className="text-white font-bold text-sm">{vacancy.location}</p>
                  </div>
                </div>
                <div className="border-t border-[#333333]"></div>

                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Work Type
                    </p>
                    <p className="text-white font-bold text-sm">
                      {vacancy.locationType === "in-person"
                        ? "In-Person"
                        : vacancy.locationType === "remote"
                          ? "Remote"
                          : "Hybrid"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-[#333333]"></div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Employment
                    </p>
                    <p className="text-white font-bold text-sm capitalize">
                      {vacancy.employmentType}
                    </p>
                  </div>
                </div>
                <div className="border-t border-[#333333]"></div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Salary Range
                    </p>
                    <p className="text-white font-bold text-sm">{vacancy.salaryRange}</p>
                  </div>
                </div>
                <div className="border-t border-[#333333]"></div>

                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Applicants
                    </p>
                    <p className="text-white font-bold text-sm">
                      {candidates.length} candidates
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onAnalyze}
                className="w-full py-4 bg-[#0066B1] hover:bg-white hover:text-[#0066B1] text-white rounded-none font-bold uppercase tracking-[0.2em] text-[10px] transition-colors flex items-center justify-center gap-2 group"
              >
                Analysis of Candidates
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-4">
            Candidate Intake
          </p>
          <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-6">
            <TalentPoolTab
              candidates={candidates}
              onAddCandidate={onAddCandidate}
              editable={true}
            />
          </div>
        </section>

        {vacancy.team.length > 0 && (
          <section>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-4">
              Current Team Composition
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vacancy.team.map((member) => (
                    <div
                      key={member.id}
                      className="bg-[#0A0A0A] border border-[#333333] rounded-none p-6"
                    >
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-none bg-[#111111] border border-[#333333] flex items-center justify-center font-bold text-lg text-white">
                          {member.avatarInitials}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{member.name}</h4>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {Object.entries(member.traits).map(([key, val]) => (
                          <div key={key}>
                            <div className="flex justify-between items-end mb-1">
                              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                                {traitLabels[key] || key}
                              </span>
                              <span className="text-[9px] font-bold text-[#0066B1]">
                                {val}/10
                              </span>
                            </div>
                            <div className="w-full h-1 bg-[#222222] rounded-none overflow-hidden">
                              <div
                                className="h-full bg-[#0066B1] transition-all duration-700"
                                style={{ width: `${(val / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {avgTraits && (
                  <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">
                      Aggregated Team Profile (Average)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                      {Object.entries(avgTraits).map(([key, val]) => (
                        <div key={key}>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                              {traitLabels[key] || key}
                            </span>
                            <span className="text-[10px] font-bold text-white">
                              {val}/10
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[#222222] rounded-none overflow-hidden">
                            <div
                              className={`h-full transition-all duration-700 ${
                                val >= 7
                                  ? "bg-emerald-400"
                                  : val >= 5
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                              }`}
                              style={{ width: `${(val / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Cpu className="w-4 h-4 text-red-400" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                      Identified Gaps
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {vacancy.teamGaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-none mt-1.5 shrink-0"></span>
                        <span className="text-sm text-slate-300 font-medium">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Cpu className="w-4 h-4 text-[#0066B1]" />
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1]">
                      AI Overview
                    </h4>
                  </div>
                  <div className="border-l-2 border-[#0066B1] pl-4">
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {vacancy.teamAiOverview}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#333333]">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                      Powered by BMW Decision Intelligence Agent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </motion.div>
  );
}