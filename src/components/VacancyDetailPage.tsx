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
  FileUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TalentPoolTab } from "@/components/TalentPoolTab";

interface VacancyDetailPageProps {
  vacancy: Vacancy;
  candidates: Candidate[];
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
          <div className="flex items-center gap-4">
            <Link to="/hr-admin" className="flex items-center gap-2 px-3 py-1 border border-[#0066B1]/30 bg-[#0066B1]/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] hover:bg-[#0066B1] hover:text-white transition-all">
              <FileUp className="w-3 h-3" />
              HR Admin
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1 border border-emerald-400/30 bg-emerald-400/10 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              ● ACTIVE
            </div>
          </div>
        </div>
      </header>

      <main className="container px-6 py-10 max-w-6xl space-y-10">
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-4">
            Position Overview
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#0A0A0A] border border-[#333333] p-8">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Job Description
              </h2>
              <p className="text-slate-300 text-sm">{vacancy.description}</p>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#0A0A0A] border border-[#333333] p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="text-white font-bold text-sm">{vacancy.location}</p>
                </div>

                <div className="border-t border-[#333333]" />

                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <p className="text-white font-bold text-sm">
                    {vacancy.locationType === "in-person"
                      ? "In-Person"
                      : vacancy.locationType === "remote"
                      ? "Remote"
                      : "Hybrid"}
                  </p>
                </div>

                <div className="border-t border-[#333333]" />

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <p className="text-white font-bold text-sm capitalize">
                    {vacancy.employmentType}
                  </p>
                </div>

                <div className="border-t border-[#333333]" />

                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <p className="text-white font-bold text-sm">{vacancy.salaryRange}</p>
                </div>

                <div className="border-t border-[#333333]" />

                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <p className="text-white font-bold text-sm">
                    {candidates.length} candidates
                  </p>
                </div>
              </div>

              <button
                onClick={onAnalyze}
                className="w-full py-4 bg-[#0066B1] hover:bg-white hover:text-[#0066B1] text-white font-bold uppercase text-[10px] flex items-center justify-center gap-2"
              >
                Analysis of Candidates
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-4">
            Talent Pool
          </p>
          <div className="bg-[#0A0A0A] border border-[#333333] p-6">
            <TalentPoolTab candidates={candidates} />
          </div>
        </section>
      </main>
    </motion.div>
  );
}