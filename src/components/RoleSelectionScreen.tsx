import { motion } from "framer-motion";
import { Building2, UserCircle, ShieldCheck, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoleSelectionScreenProps {
  onSelectRole: (role: "hr" | "candidate") => void;
}

export function RoleSelectionScreen({ onSelectRole }: RoleSelectionScreenProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-foreground overflow-hidden w-full m-0 p-0 relative font-sans">
      {/* Background Decor: Grid and Technical Markers */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-10 left-10 text-[10px] font-mono text-muted-foreground tracking-widest uppercase">SYS_REF: DE-B-89</div>
        <div className="absolute top-10 right-10 text-[10px] font-mono text-muted-foreground tracking-widest uppercase">LOC: MUNICH_HQ</div>
        <div className="absolute bottom-10 left-10 text-[10px] font-mono text-muted-foreground tracking-widest uppercase opacity-40">ENCRYPTION: AES_256_ACTIVE</div>
        <div className="absolute bottom-10 right-10 text-[10px] font-mono text-muted-foreground tracking-widest uppercase opacity-40">VERSION: 4.1.0_STABLE</div>
      </div>

      {/* Floating Logo (BMW Center) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none hidden lg:block opacity-10">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" 
          alt="BMW Decorative Logo" 
          className="w-96 h-96 grayscale"
        />
      </div>

      {/* Main Header (Branding) */}
      <div className="absolute top-12 left-0 w-full z-40 flex justify-center pointer-events-none">
        <div className="flex flex-col items-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" 
            alt="BMW Official Logo" 
            className="w-16 h-16 lg:w-20 lg:h-20 object-contain mb-4 filter drop-shadow-[0_0_15px_rgba(0,102,177,0.3)] pointer-events-auto" 
          />
          <h1 className="text-xl lg:text-2xl font-light tracking-[0.3em] text-white uppercase text-center">
            LEADER <span className="font-bold">COMPASS</span>
          </h1>
        </div>
      </div>

      {/* Left split: HR / Enterprise */}
      <section 
        className="w-full lg:w-1/2 h-full min-h-[50vh] lg:min-h-screen relative flex flex-col justify-center items-center p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#0066B1]/20 bg-[#030610] group cursor-pointer transition-colors duration-500 hover:bg-[#050a1b]"
        onClick={() => onSelectRole("hr")}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0066B1]/5 to-transparent mix-blend-overlay pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-[#0066B1]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-none bg-[#0a0f18] border border-[#0066B1]/40 flex items-center justify-center transition-all duration-500 group-hover:border-[#0066B1] group-hover:scale-105">
              <Building2 className="w-10 h-10 lg:w-12 lg:h-12 text-[#0066B1] transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-4 h-4 rounded-none border-2 border-[#030610] group-hover:animate-pulse"></div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-light tracking-tight text-white uppercase">
              Recruitment <span className="font-bold text-[#0066B1]">Team</span>
            </h2>
            <div className="h-px w-12 bg-[#0066B1] mx-auto group-hover:w-24 transition-all duration-500"></div>
            <p className="text-xs lg:text-sm tracking-[0.15em] leading-relaxed uppercase opacity-60 group-hover:opacity-100 transition-opacity">
              Configure business scenarios, analyze workforce gaps, and execute high-stakes leadership decisions.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button className="px-10 py-3 bg-[#0066B1] text-white border border-[#0066B1] font-bold tracking-[0.25em] text-[10px] uppercase hover:bg-white hover:text-[#0066B1] transition-all duration-300 shadow-[0_0_20px_rgba(0,102,177,0.2)] group-hover:shadow-[0_0_30px_rgba(0,102,177,0.4)]">
              Authorized Entry
            </button>
            <div className="flex items-center gap-2 opacity-30 text-[9px] uppercase tracking-widest font-mono">
              <ShieldCheck className="w-3 h-3" /> SECURITY_OVR: ACTIVE
            </div>
          </div>
        </motion.div>
      </section>

      {/* Right split: Candidate */}
      <section 
        className="w-full lg:w-1/2 h-full min-h-[50vh] lg:min-h-screen relative flex flex-col justify-center items-center p-8 lg:p-16 bg-[#0a0a0a] group cursor-default"
      >
         <div className="absolute inset-0 bg-gradient-to-bl from-white/2 to-transparent mix-blend-overlay pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md"
        >
          <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-none bg-[#111111] border border-[#222222] flex items-center justify-center grayscale opacity-60 transition-all duration-500">
            <UserCircle className="w-10 h-10 lg:w-12 lg:h-12 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-light tracking-tight text-white uppercase">
              Applicant <span className="font-bold">Portal</span>
            </h2>
            <div className="h-px w-12 bg-[#333333] mx-auto group-hover:w-24 transition-all duration-500"></div>
            <p className="text-xs lg:text-sm tracking-[0.15em] leading-relaxed uppercase opacity-40 group-hover:opacity-60 transition-opacity">
              Advance your career within the BMW Group. Access open leadership roles and synchronize your professional profile.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button 
              className="px-10 py-3 bg-transparent text-muted-foreground border border-[#222222] font-bold tracking-[0.25em] text-[10px] uppercase hover:bg-[#111111] transition-all duration-300"
              onClick={() => navigate("/assessment")}
            >
              Candidate Login
            </button>
            <div className="flex items-center gap-2 opacity-20 text-[9px] uppercase tracking-widest font-mono">
              <Cpu className="w-3 h-3" /> MODULE: SYNC_PENDING
            </div>
          </div>
        </motion.div>
      </section>

      {/* Industrial Footer Credit */}
      <div className="absolute bottom-6 left-0 w-full px-10 flex justify-between items-center z-40 opacity-30 pointer-events-none text-[9px] font-mono tracking-[0.3em] uppercase">
        <div>© BMW RECRUITMENT_INTEL 2026</div>
        <div className="flex items-center gap-2">
          INTELLIGENCE_AUGMENTED <div className="w-1.5 h-1.5 bg-[#0066B1]"></div>
        </div>
      </div>
    </div>
  );
}
