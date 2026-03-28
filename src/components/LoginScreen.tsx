import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, ChevronRight, Server, User } from "lucide-react";

interface LoginScreenProps {
  onComplete: () => void;
}

export function LoginScreen({ onComplete }: LoginScreenProps) {
  const [isBooting, setIsBooting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const bootSequence = [
    "> Authenticating Executive Clearance... [SUCCESS]",
    "> Booting Multi-Agent Core Framework...",
    "> [JD AGENT] Instantiating Scenario Requirements...",
    "> [CV AGENT] Extracting & Scoring Leader Profiles...",
    "> [SCENARIO AGENT] Calculating Dynamic Confidence Weights...",
    "> Executive Dashboard Interface Ready."
  ];

  const startBoot = () => {
    setIsBooting(true);
    let currentLog = 0;
    const intervalTime = 2000 / (bootSequence.length + 1);
    
    const interval = setInterval(() => {
      setLogs((prev) => [...prev, bootSequence[currentLog]]);
      currentLog++;
      
      if (currentLog >= bootSequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, intervalTime);
      }
    }, intervalTime);
  };

  return (
    <motion.div 
      className="grid lg:grid-cols-2 min-h-screen bg-background text-foreground overflow-hidden"
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Left side: Premium Branding */}
      <div className="relative flex flex-col justify-center items-center p-12 overflow-hidden bg-[#030610] border-r border-[#0066B1]/20">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0066B1]/10 to-transparent mix-blend-overlay"></div>
        
        <div className="relative z-10 mb-12">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" alt="BMW Official Logo" className="w-40 h-40 object-contain" />
        </div>
        
        <div className="relative z-10 text-center space-y-4 max-w-md">
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">
            BMW <span className="font-bold">Decision Intelligence</span>
          </h1>
          <div className="h-px w-24 bg-[#0066B1] mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm tracking-widest uppercase opacity-80">AI-Augmented Leadership Selection</p>
        </div>
      </div>

      {/* Right side: Employee Profile Selection */}
      <div className="flex flex-col justify-center p-8 lg:p-24 relative bg-[#0B1120]">
        <div className="w-full max-w-xl mx-auto space-y-8">
          
          <div className="mb-10">
            <h2 className="text-3xl font-light tracking-tight mb-3 flex items-center gap-3">
              <User className="w-7 h-7 text-[#0066B1]" />
              Employee Hub
            </h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest">Select your profile to continue.</p>
          </div>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {!isBooting ? (
                <motion.div 
                  key="selection"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Active Profile */}
                  <button 
                    onClick={startBoot}
                    className="w-full text-left group flex items-center justify-between rounded-none border p-6 border-[#0066B1]/30 bg-[#0A0A0A] hover:bg-[#111111] hover:border-[#0066B1] transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-none bg-[#111111] border border-[#333333] flex items-center justify-center font-bold text-lg text-white group-hover:bg-[#0066B1]/10 transition-colors">
                        AM
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-white tracking-wide uppercase text-sm">Anna Müller</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Senior HR Director • Board Relations</p>
                        <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest mt-1 font-bold">● Online</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-none bg-[#111111] border border-[#333333] flex items-center justify-center group-hover:bg-[#0066B1]/20 transition-colors">
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </div>
                  </button>

                  {/* Locked Profile 1 */}
                  <div className="w-full text-left flex items-center justify-between rounded-none border border-[#222222] p-6 opacity-40 cursor-not-allowed bg-[#0A0A0A]">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-none bg-[#111111] border border-[#222222] flex items-center justify-center font-bold text-lg text-muted-foreground">
                        JK
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-bold text-muted-foreground tracking-wide uppercase text-sm">Jürgen Kloss</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Recruitment Lead • Plant Operations</p>
                        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-1 font-bold">Clearance Insufficient</p>
                      </div>
                    </div>
                  </div>

                   {/* Locked Profile 2 */}
                   <div className="w-full text-left flex items-center justify-between rounded-none border border-[#222222] p-6 opacity-30 cursor-not-allowed bg-[#0A0A0A]">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-none bg-[#111111] border border-[#222222] flex items-center justify-center font-bold text-lg text-muted-foreground">
                        LP
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-bold text-muted-foreground tracking-wide uppercase text-sm">Lisa Park</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Talent Acquisition • Digital Division</p>
                        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-1 font-bold">Offline</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="terminal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#0a0f18] p-6 lg:p-8 min-h-[300px] border border-[#0066B1]/40 font-mono text-sm"
                >
                  <div className="flex items-center justify-between mb-6 border-b border-[#0066B1]/30 pb-3">
                    <span className="text-[#0066B1] font-bold tracking-[0.2em] text-[10px] uppercase">Terminal // Boot Sequence</span>
                    <span className="animate-pulse text-[#0066B1]">■</span>
                  </div>
                  <div className="space-y-3 text-emerald-400">
                    {logs.map((log, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        {log}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
