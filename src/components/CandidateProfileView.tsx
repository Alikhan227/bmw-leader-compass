import { Candidate } from "@/lib/types";
import { ArrowLeft, FileText, Download, Briefcase, GraduationCap, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface CandidateProfileViewProps {
  candidate: Candidate;
  onBack: () => void;
}

export function CandidateProfileView({ candidate, onBack }: CandidateProfileViewProps) {
  const traitLabels: Record<string, string> = {
    riskTaking: "Risk-Taking",
    processFocus: "Process",
    resilience: "Resilience",
    innovation: "Innovation",
    stakeholderManagement: "Stakeholder",
    executionSpeed: "Execution",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-2 pb-12 w-full"
    >
      {/* Header Area */}
      <div className="flex items-center gap-4 border-b border-border/40 pb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-none bg-[#111111] hover:bg-[#0066B1] border border-[#333333] text-sm font-bold uppercase tracking-widest text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Talent Pool
        </button>
        <h2 className="text-xl font-medium text-muted-foreground ml-auto">Candidate Profile</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Core Identity & Bio */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-8 relative overflow-hidden">
            <div className="absolute top-0 w-full h-1 bg-[#0066B1] left-0"></div>
            
            <div className="relative flex flex-col items-center text-center mt-4">
              <div className="w-32 h-32 rounded-none bg-[#111111] border border-[#333333] flex items-center justify-center font-bold text-4xl text-white mb-6">
                {candidate.avatarInitials}
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">{candidate.name}</h1>
              <p className="text-[#0066B1] font-bold uppercase tracking-[0.2em] text-[10px] mb-2">{candidate.currentRole}</p>
              <p className="text-sm text-muted-foreground/60 font-bold uppercase tracking-widest mb-6">{candidate.company}</p>

              <div className="w-full flex justify-center items-center gap-2 py-2 bg-[#111111] border border-[#333333] rounded-none text-white text-xs font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> System Verified
              </div>
            </div>

            <div className="mt-8 space-y-4 pt-6 border-t border-border/40">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-24">Date of Birth</span>
                <span className="text-white font-medium">{candidate.bio?.dateOfBirth}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-24">Place of Birth</span>
                <span className="text-white font-medium">{candidate.bio?.placeOfBirth}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm pt-2">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground w-24">Experience</span>
                  <span className="text-white font-medium">{candidate.yearsExperience} Years</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground w-24 shrink-0">Education</span>
                <span className="text-white font-medium">{candidate.bio?.education}</span>
              </div>
              <div className="flex items-center gap-3 text-sm pt-2 border-t border-border/20">
                <span className="w-4 h-4 text-muted-foreground shrink-0 flex justify-center items-center font-serif text-[10px]">@</span>
                <span className="text-muted-foreground w-24">Applied On</span>
                <span className="text-white font-medium">{candidate.bio?.applicationDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle & Right Columns */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* About Me Section */}
          <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-4">About Candidate</h3>
            <p className="text-slate-300 leading-relaxed text-sm font-medium tracking-wide">
              {candidate.bio?.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traits Duplication */}
            <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-6">Characteristic Breakdown</h3>
              <div className="space-y-5">
                {Object.entries(candidate.traits).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{traitLabels[key] || key}</span>
                      <span className="text-[10px] font-bold text-[#0066B1]">{val}/10</span>
                    </div>
                    <div className="w-full h-1 bg-[#222222] rounded-none overflow-hidden">
                      <div 
                        className="h-full bg-[#0066B1] transition-all duration-1000 ease-out" 
                        style={{ width: `${(val / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments & Documents */}
            <div className="bg-[#0A0A0A] border border-[#333333] rounded-none p-8 flex flex-col">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066B1] mb-6">Attachments</h3>
              
              <div className="space-y-4 flex-1">
                {/* CV File */}
                <div className="group flex items-center justify-between p-4 rounded-none border border-[#333333] bg-[#111111] hover:border-[#0066B1] transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-[#222222] flex items-center justify-center text-white">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white uppercase tracking-wider mb-0.5">Resume_CV.pdf</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">1.2 MB</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-[#0066B1] transition-colors" />
                </div>

                {/* Cover Letter File */}
                <div className="group flex items-center justify-between p-4 rounded-none border border-[#333333] bg-[#111111] hover:border-[#0066B1] transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-[#222222] flex items-center justify-center text-white">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white uppercase tracking-wider mb-0.5">Cover_Letter.pdf</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">845 KB</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-[#0066B1] transition-colors" />
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-[#333333]">
                 <button className="w-full py-3 bg-[#0066B1] hover:bg-white hover:text-[#0066B1] text-white rounded-none font-bold uppercase tracking-[0.2em] text-[10px] transition-colors">
                   Download All Archive (.ZIP)
                 </button>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
