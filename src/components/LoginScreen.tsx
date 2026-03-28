import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, ChevronRight, Server } from "lucide-react";

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
    
    // Total wait time is exactly 2000ms. We have 6 logs.
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
      {/* Left side: Premium Branding (High Contrast Dark) */}
      <div className="relative flex flex-col justify-center items-center p-12 overflow-hidden bg-[#030610] border-r border-[#0066B1]/20 shadow-[inset_-20px_0_50px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0066B1]/10 to-transparent mix-blend-overlay"></div>
        
        {/* Real BMW Logo */}
        <div className="relative z-10 mb-12 drop-shadow-[0_0_60px_rgba(0,102,177,0.4)]">
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

      {/* Right side: Interaction (Distinct Card Background) */}
      <div className="flex flex-col justify-center p-8 lg:p-24 relative bg-[#0B1120]">
        <div className="w-full max-w-xl mx-auto space-y-8">
          
          <div className="mb-10">
            <h2 className="text-3xl font-light tracking-tight mb-3 flex items-center gap-3">
              <Server className="w-7 h-7 text-[#0066B1]" />
              Secure Hub
            </h2>
            <p className="text-muted-foreground">Select an active intelligence instance to initialize the Multi-Agent framework.</p>
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
                  {/* Active Row */}
                  <button 
                    onClick={startBoot}
                    className="w-full text-left group flex items-center justify-between rounded-xl border p-6 border-[#0066B1]/30 bg-[#121A2F]/80 hover:bg-[#1A2642] hover:border-[#0066B1] transition-all duration-300 shadow-[0_4px_20px_rgba(0,102,177,0.08)]"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span className="font-semibold text-white tracking-wide">Instance 01: Board of Management</span>
                      </div>
                      <p className="text-sm text-slate-400 ml-8">Executive Search Profile • <span className="text-emerald-400/80">Agents Ready</span></p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#0066B1]/10 flex items-center justify-center group-hover:bg-[#0066B1]/30 transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </div>
                  </button>

                  {/* Locked Row 1 */}
                  <div className="w-full text-left flex items-center justify-between rounded-xl border border-white/5 p-6 opacity-50 cursor-not-allowed bg-black/40">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium text-muted-foreground tracking-wide">Instance 02: Plant Operations MUC</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">Clearance Level Insufficient</p>
                    </div>
                  </div>

                   {/* Locked Row 2 */}
                   <div className="w-full text-left flex items-center justify-between rounded-xl border border-white/5 p-6 opacity-40 cursor-not-allowed bg-black/40">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium text-muted-foreground tracking-wide">Instance 03: Global Sales Network</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">Offline for maintenance</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="terminal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bmw-card bg-[#0a0f18] p-6 lg:p-8 min-h-[300px] border-[#0066B1]/40 font-mono text-sm shadow-[inset_0_0_40px_rgba(0,102,177,0.05)]"
                >
                  <div className="flex items-center justify-between mb-6 border-b border-[#0066B1]/30 pb-3">
                    <span className="text-[#0066B1] font-semibold tracking-widest text-xs uppercase">Terminal // Boot Sequence</span>
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
