import { useState, useMemo } from "react";
import { Candidate } from "@/lib/types";
import { LayoutGrid, List, ArrowDownWideNarrow } from "lucide-react";
import { CandidateProfileView } from "./CandidateProfileView";
import { AnimatePresence, motion } from "framer-motion";

interface TalentPoolTabProps {
  candidates: Candidate[];
}

export function TalentPoolTab({ candidates }: TalentPoolTabProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "experience">("name");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const traitLabels: Record<string, string> = {
    riskTaking: "Risk-Taking",
    processFocus: "Process",
    resilience: "Resilience",
    innovation: "Innovation",
    stakeholderManagement: "Stakeholder",
    executionSpeed: "Execution",
  };

  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b.yearsExperience - a.yearsExperience; // Descending experience
    });
  }, [candidates, sortBy]);

  const selectedCandidate = useMemo(() => {
    return candidates.find(c => c.id === selectedCandidateId) || null;
  }, [candidates, selectedCandidateId]);

  return (
    <div className="w-full relative min-h-[600px]">
      <AnimatePresence mode="wait">
        
        {selectedCandidateId && selectedCandidate ? (
          
          <CandidateProfileView 
             key="profile-view" 
             candidate={selectedCandidate} 
             onBack={() => setSelectedCandidateId(null)} 
          />
          
        ) : (
          
          <motion.div 
            key="grid-view"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 pt-4 w-full"
          >
            {/* Controls Bar */}
            <div className="flex items-center justify-between bg-card border border-border/40 p-3 rounded-none shadow-none">
              <div className="flex items-center gap-3">
                <ArrowDownWideNarrow className="w-4 h-4 text-muted-foreground ml-2" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Sort By:</span>
                <select 
                  className="bg-[#0B1120] border border-border/40 text-sm text-foreground focus:ring-1 focus:ring-[#0066B1] outline-none cursor-pointer font-medium px-2 py-1 rounded-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "experience")}
                >
                  <option value="name" className="bg-[#0B1120] text-slate-200">Alphabetical (A-Z)</option>
                  <option value="experience" className="bg-[#0B1120] text-slate-200">Years of Experience</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-black p-1 rounded-none border border-white/10">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-none transition-all ${viewMode === "grid" ? "bg-[#0066B1] text-white" : "text-muted-foreground hover:text-white"}`}
                  aria-label="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-none transition-all ${viewMode === "list" ? "bg-[#0066B1] text-white" : "text-muted-foreground hover:text-white"}`}
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Candidate Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-8" : "flex flex-col gap-6"}>
              {sortedCandidates.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCandidateId(c.id)}
                  className="cursor-pointer rounded-none border border-[#333333] bg-[#0A0A0A] hover:border-[#0066B1] transition-colors p-8 relative group shadow-none"
                >
                  
                  {/* New Application Indicator */}
                  {c.isNew && (
                    <div className="absolute top-8 right-8 flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-bmw-danger bg-bmw-danger/10 px-2 py-0.5 rounded-none border border-bmw-danger/30">New</span>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bmw-danger opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bmw-danger"></span>
                      </span>
                    </div>
                  )}

                  <div className={`flex ${viewMode === "list" ? "flex-row items-center justify-between gap-12" : "flex-col items-start"}`}>
                    
                    {/* Header info */}
                    <div className={`flex items-start gap-5 ${viewMode === "list" ? "w-1/3" : "mb-6"}`}>
                      <div className="w-16 h-16 shrink-0 rounded-none bg-[#111111] border border-[#333333] flex items-center justify-center font-bold text-xl text-white group-hover:bg-[#0066B1]/10 transition-colors">
                        {c.avatarInitials}
                      </div>
                      <div className="mt-1">
                        <h3 className="font-semibold text-xl leading-tight text-white mb-1.5 group-hover:text-[#0066B1] transition-colors">{c.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1.5 uppercase tracking-widest text-[10px] font-bold">{c.currentRole}</p>
                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">{c.company} • {c.yearsExperience} EXP</p>
                      </div>
                    </div>

                    {/* Trait Analysis Bars */}
                    <div className={`${viewMode === "list" ? "flex-1 border-l border-border/40 pl-12" : "w-full pt-6 border-t border-border/40"}`}>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Trait Breakdown</p>
                      </div>
                      <div className={`grid ${viewMode === "list" ? "grid-cols-3" : "grid-cols-2"} gap-x-6 gap-y-4`}>
                        {Object.entries(c.traits).map(([key, val]) => (
                          <div key={key}>
                            <div className="flex justify-between items-end mb-1.5">
                              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{traitLabels[key] || key}</span>
                              <span className="text-[10px] font-bold text-emerald-400">{val}/10</span>
                            </div>
                            <div className="w-full h-1 bg-[#222222] rounded-none overflow-hidden">
                              <div 
                                className="h-full bg-[#0066B1] transition-all duration-1000 ease-out flex" 
                                style={{ width: `${(val / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {viewMode === "list" && (
                        <div className="mt-6 pt-5 flex items-center gap-8 border-t border-[#333333]">
                          <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rel. Cost: <span className="text-white">{c.costToHire}/10</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deploy: <span className="text-white">{c.timeToHire} days</span></span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer metrics (Grid only to save space, list mode incorporates it above) */}
                    {viewMode === "grid" && (
                      <div className="w-full mt-8 pt-5 border-t border-[#333333] flex justify-between items-center">
                          <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rel. Cost: <span className="text-white">{c.costToHire}/10</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deploy: <span className="text-white">{c.timeToHire} days</span></span>
                          </div>
                      </div>
                    )}
                    
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
        )}
      </AnimatePresence>
    </div>
  );
}
