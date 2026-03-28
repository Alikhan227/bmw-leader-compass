import { Vacancy } from "@/lib/types";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Users, Lock, CheckCircle2, FileEdit, Briefcase } from "lucide-react";

interface VacancyListScreenProps {
  vacancies: Vacancy[];
  onSelect: (id: string) => void;
  onBack: () => void;
}

export function VacancyListScreen({ vacancies, onSelect, onBack }: VacancyListScreenProps) {
  const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    active: { label: "ACTIVE", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10", icon: <CheckCircle2 className="w-3 h-3" /> },
    closed: { label: "CLOSED", color: "text-red-400 border-red-400/30 bg-red-400/10", icon: <Lock className="w-3 h-3" /> },
    draft: { label: "DRAFT", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10", icon: <FileEdit className="w-3 h-3" /> },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <header className="border-b border-[#333333] bg-[#0A0A0A]">
        <div className="container flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="mr-2 h-8 w-8 flex items-center justify-center hover:bg-[#111111] transition-colors" aria-label="Back to Login">
              <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-white" />
            </button>
            <div className="w-8 h-8 bg-slate-100 flex items-center justify-center p-0.5">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" alt="BMW" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">My Vacancies</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Anna Müller • Senior HR Director</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-6 py-10 max-w-4xl">
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-2">Curated Positions</p>
          <h2 className="text-2xl font-bold text-white tracking-tight">Active Vacancy Pipeline</h2>
          <p className="text-sm text-muted-foreground mt-2">Select a vacancy to view details, team composition, and AI analysis.</p>
        </div>

        <div className="space-y-4">
          {vacancies.map((v) => {
            const status = statusConfig[v.status];
            const isClickable = v.status === "active";

            return (
              <button
                key={v.id}
                onClick={() => isClickable && onSelect(v.id)}
                disabled={!isClickable}
                className={`w-full text-left rounded-none border p-6 transition-all group ${
                  isClickable
                    ? "border-[#333333] bg-[#0A0A0A] hover:border-[#0066B1] cursor-pointer"
                    : "border-[#222222] bg-[#0A0A0A] opacity-40 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-5 flex-1">
                    <div className={`w-12 h-12 rounded-none flex items-center justify-center border shrink-0 ${
                      isClickable ? "bg-[#111111] border-[#333333] text-[#0066B1] group-hover:bg-[#0066B1]/10" : "bg-[#111111] border-[#222222] text-muted-foreground"
                    }`}>
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-bold text-lg mb-1 ${isClickable ? "text-white group-hover:text-[#0066B1]" : "text-muted-foreground"} transition-colors`}>{v.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">{v.department}</p>
                      <div className="flex items-center gap-6 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" /> {v.location}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {v.locationType === "in-person" ? "In-Person" : v.locationType === "remote" ? "Remote" : "Hybrid"}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <Users className="w-3 h-3" /> {v.applicantCount} Applicants
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-none text-[10px] font-bold uppercase tracking-[0.2em] shrink-0 ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </motion.div>
  );
}
