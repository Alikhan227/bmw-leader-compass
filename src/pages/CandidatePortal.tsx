import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap, 
  BrainCircuit,
  FileText,
  X,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase, insertCandidateSubmission } from "@/lib/supabase";
import { useSearchParams } from "react-router-dom";

const SKILLS = [
  "Supply Chain Management", 
  "Artificial Intelligence", 
  "Electric Vehicle Tech", 
  "Lean Manufacturing", 
  "Strategic Planning", 
  "Financial Analysis", 
  "Change Management", 
  "Cybersecurity",
  "Quality Assurance",
  "Logistics Optimization"
];

const VACANCIES = [
  { id: "v1", title: "VP Powertrain Operations", department: "Production", location: "Munich, DE", status: "Active" },
  { id: "v2", title: "Head of Digital Transformation", department: "Strategy", location: "Berlin, DE", status: "Closed" },
  { id: "v3", title: "SVP Global Supply Chain", department: "Logistics", location: "Spartanburg, US", status: "Draft" }
];

const AVAILABILITY_OPTIONS = [
  { id: "immediate", label: "Immediately", days: 0, description: "Ready for transition within 7 days" },
  { id: "1month", label: "1 Month Notice", days: 30, description: "Standard corporate notice period" },
  { id: "3months", label: "3+ Months Notice", days: 90, description: "Executive or contractual notice period" }
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    scenario: "Innovation",
    question: "A new technology disrupts your core product line. What is your primary response?",
    options: [
      { id: "A", text: "Immediately halt current production and pivot all resources to the new tech." },
      { id: "B", text: "Create a dedicated task force to study the disruption while maintaining core stability." },
      { id: "C", text: "Acquire a startup that leads in the new technology to bridge the gap." },
      { id: "D", text: "Focus on optimizing current legacy products to outcompete on reliability." }
    ]
  },
  {
    id: "q2",
    scenario: "Crisis",
    question: "A critical global supplier goes bankrupt suddenly. Your first move is to...",
    options: [
      { id: "A", text: "Activate secondary local suppliers, even at significantly higher costs." },
      { id: "B", text: "Call an emergency board meeting to re-evaluate the quarterly production targets." },
      { id: "C", text: "Personally negotiate with the bankrupt supplier's receivers to secure existing stock." },
      { id: "D", text: "Implement a rapid engineering redesign to remove the supplier's specific component." }
    ]
  },
  {
    id: "q3",
    scenario: "Stakeholders",
    question: "The board is split 50/50 on a high-risk, high-reward international expansion. How do you align them?",
    options: [
      { id: "A", text: "Provide a data-heavy risk-mitigation report to win over the skeptical half." },
      { id: "B", text: "Propose a smaller, measurable pilot program to prove the concept first." },
      { id: "C", text: "Seek one-on-one meetings with key influencers to build a consensus." },
      { id: "D", text: "Use your executive authority to break the tie and proceed with the expansion." }
    ]
  },
  {
    id: "q4",
    scenario: "Team Management",
    question: "Your most critical engineer is showing signs of extreme burnout during a major deadline.",
    options: [
      { id: "A", text: "Offer a significant performance bonus to help them push through the last 2 weeks." },
      { id: "B", text: "Immediately re-assign their tasks to others and allow them to take leave." },
      { id: "C", text: "Pair them with a junior engineer to act as a surrogate and reduce cognitive load." },
      { id: "D", text: "Have a transparent 1-on-1 to align on a reduced but essential set of deliverables." }
    ]
  },
  {
    id: "q5",
    scenario: "Strategy",
    question: "A competitor launches a lower-quality product at 40% of your price point. How do you react?",
    options: [
      { id: "A", text: "Launch a sub-brand to compete directly on price without Diluting BMW's image." },
      { id: "B", text: "Ignore the low-tier market and double down on premium features and heritage." },
      { id: "C", text: "Initiate a marketing campaign highlighting the safety and longevity ROI of your product." },
      { id: "D", text: "Aggressively cut operational costs to lower your own prices within 6 months." }
    ]
  }
];

export default function CandidatePortal() {
  const [searchParams] = useSearchParams();
  const [selectedVacancyId, setSelectedVacancyId] = useState(searchParams.get("v") || "");
  const [step, setStep] = useState(selectedVacancyId ? 1 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState(5);
  const [availability, setAvailability] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [company, setCompany] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      // Attempt to extract name from filename as a placeholder
      const name = e.target.files[0].name.split(".")[0].replace(/[_-]/g, " ");
      if (!fullName) setFullName(name);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const initials = fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() ?? "")
        .join("");

      const submissionData = {
        vacancy_id: selectedVacancyId || "v1",
        submission_source: "candidate_portal" as const,
        status: "ready" as const,
        full_name: fullName || "New Candidate",
        email: email,
        current_job_title: currentRole,
        company: company,
        experience_years: Number(experience),
        avatar_initials: initials,
        skills_json: selectedSkills,
        time_to_hire: availability !== null ? availability : 30,
        cost_to_hire: 5,
        risk_taking: 5,
        process_focus: 5,
        resilience: 5,
        innovation: 5,
        stakeholder_management: 5,
        execution_speed: 5,
        background: `Candidate added via portal for ${VACANCIES.find(v => v.id === selectedVacancyId)?.title || "General Position"}. expertise: ${selectedSkills.join(", ")}`,
        cv_text: JSON.stringify({
          original_cv_filename: file?.name || "Manual Upload",
          skills: selectedSkills,
          quiz_results: answers,
          availability_days: availability,
          submission_date: new Date().toISOString()
        }, null, 2)
      };

      await insertCandidateSubmission(submissionData);
      
      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 p-12 bg-[#0A0A0A] border border-[#0066B1]/30 rounded-none shadow-[0_0_50px_rgba(0,102,177,0.1)]"
        >
          <div className="w-20 h-20 bg-[#0066B1]/10 rounded-none border border-[#0066B1]/50 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-[#0066B1]" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-light tracking-tight text-white uppercase">
              Application <span className="font-bold">Received</span>
            </h1>
            <p className="text-muted-foreground text-sm tracking-widest leading-relaxed uppercase opacity-70">
              Thank you for your interest in the BMW Group. Your leadership profile has been securely transmitted to our executive recruitment team.
            </p>
          </div>
          <div className="pt-8">
            <Button 
              variant="outline" 
              className="rounded-none border-[#333333] tracking-[0.2em] text-[10px] uppercase hover:bg-[#111111]"
              onClick={() => window.location.href = "/"}
            >
              Return to Portal
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#0066B1] selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 bg-[#050505]/80 backdrop-blur-md border-b border-[#ffffff]/5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" alt="BMW" className="w-10 h-10" />
          <div className="h-4 w-px bg-white/20"></div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-light">Candidate <span className="font-bold">Assessment</span></span>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Step {Math.floor(step) + 1} of 6</span>
            <Progress value={((Math.floor(step) + 1) / 6) * 100} className="w-24 h-1 rounded-none bg-white/5" />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-none p-2 hover:bg-white/5"
            onClick={() => { if(confirm("Exit assessment? Progress will be lost.")) window.location.href = "/"; }}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </header>

      {/* Main Wizard */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 pt-32 pb-24 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* Step 0: Vacancy Selection */}
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-light tracking-tight uppercase">Select Your <span className="font-bold text-[#0066B1]">Objective</span></h2>
                <p className="text-muted-foreground tracking-[0.1em] uppercase text-xs opacity-60">Choose the leadership role that aligns with your professional expertise.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {VACANCIES.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVacancyId(v.id)}
                    className={`p-8 text-left border transition-all duration-500 rounded-none relative group ${selectedVacancyId === v.id ? 'border-[#0066B1] bg-[#0066B1]/5' : 'border-[#222222] bg-[#0A0A0A] hover:border-[#0066B1]/30'}`}
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className={`text-[8px] px-2 py-0.5 border ${v.status === 'Active' ? 'border-[#0066B1] text-[#0066B1]' : 'border-white/10 text-white/30'} uppercase tracking-[0.2em]`}>
                          {v.status}
                        </div>
                        <Briefcase className={`w-4 h-4 ${selectedVacancyId === v.id ? 'text-[#0066B1]' : 'text-white/10'}`} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold uppercase tracking-widest leading-tight">{v.title}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">{v.department} // {v.location}</p>
                      </div>
                    </div>
                    {selectedVacancyId === v.id && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0066B1]"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="max-w-sm mx-auto pt-8">
                <Button 
                  className={`w-full rounded-none h-14 font-bold tracking-[0.3em] text-[10px] uppercase transition-all duration-500 ${selectedVacancyId && VACANCIES.find(v => v.id === selectedVacancyId)?.status === 'Active' ? 'bg-white text-black hover:bg-[#0066B1] hover:text-white' : 'bg-white/10 text-white/20 border border-white/5 cursor-not-allowed'}`}
                  disabled={!selectedVacancyId || VACANCIES.find(v => v.id === selectedVacancyId)?.status !== 'Active'}
                  onClick={() => setStep(1)}
                >
                  {selectedVacancyId && VACANCIES.find(v => v.id === selectedVacancyId)?.status !== 'Active' ? 'Position Closed' : 'Confirm Selection'} <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 1: CV Ingestion */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-light tracking-tight uppercase">Upload Your <span className="font-bold text-[#0066B1]">Professional Journey</span></h2>
                <p className="text-muted-foreground tracking-[0.1em] uppercase text-xs opacity-60">We accept PDF or DOCX formats for executive profiling.</p>
              </div>

              <div 
                className={`relative group border-2 border-dashed transition-all duration-500 p-16 flex flex-col items-center justify-center ${file ? 'border-[#0066B1] bg-[#0066B1]/5' : 'border-[#222222] hover:border-[#0066B1]/50 hover:bg-white/[0.02]'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleFileChange({ target: { files: e.dataTransfer.files } } as any);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.docx,.doc" 
                />
                
                <div className="w-20 h-20 bg-white/5 rounded-none flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {file ? <FileText className="w-10 h-10 text-[#0066B1]" /> : <Upload className="w-10 h-10 text-muted-foreground" />}
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm font-bold uppercase tracking-[0.2em]">{file ? file.name : "Drop CV here or Browse"}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Maximum file size: 10MB"}</p>
                </div>
              </div>

              <div className="max-w-sm mx-auto space-y-10">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground ml-1">Full Candidate Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ENTER OFFICIAL NAME"
                    className="w-full bg-transparent border-b border-[#222222] py-3 px-1 text-sm font-bold tracking-[0.1em] focus:outline-none focus:border-[#0066B1] transition-colors placeholder:opacity-20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER OFFICIAL EMAIL"
                    className="w-full bg-transparent border-b border-[#222222] py-3 px-1 text-sm font-bold tracking-[0.1em] focus:outline-none focus:border-[#0066B1] transition-colors placeholder:opacity-20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground ml-1">Current Role</label>
                  <input 
                    type="text" 
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="E.G. SENIOR LOGISTICS MANAGER"
                    className="w-full bg-transparent border-b border-[#222222] py-3 px-1 text-sm font-bold tracking-[0.1em] focus:outline-none focus:border-[#0066B1] transition-colors placeholder:opacity-20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground ml-1">Company</label>
                  <input 
                    type="text" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="E.G. LOGISTICS GLOBAL LTD"
                    className="w-full bg-transparent border-b border-[#222222] py-3 px-1 text-sm font-bold tracking-[0.1em] focus:outline-none focus:border-[#0066B1] transition-colors placeholder:opacity-20"
                  />
                </div>

                <Button 
                  className="w-full rounded-none h-14 bg-white text-black font-bold tracking-[0.3em] text-[10px] uppercase hover:bg-[#0066B1] hover:text-white transition-all disabled:opacity-20"
                  disabled={!file || !fullName || !currentRole || !email}
                  onClick={() => setStep(2)}
                >
                  Confirm & Procede <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Expertise & Experience */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-16"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-light tracking-tight uppercase">Define Your <span className="font-bold text-[#0066B1]">Core Expertise</span></h2>
                <p className="text-muted-foreground tracking-[0.1em] uppercase text-xs opacity-60">Select areas where you have delivered strategic impact.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {SKILLS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`p-4 text-[10px] font-bold uppercase tracking-[0.15em] border transition-all duration-300 rounded-none text-center ${selectedSkills.includes(skill) ? 'bg-[#0066B1] border-[#0066B1] text-white' : 'bg-[#0A0A0A] border-[#222222] text-muted-foreground hover:border-[#0066B1]/50'}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="space-y-12 max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Years of Executive Experience</label>
                    <span className="text-3xl font-light text-[#0066B1]">{experience} <span className="text-xs uppercase tracking-widest text-muted-foreground">Years</span></span>
                  </div>
                  <Slider 
                    value={[experience]} 
                    min={0} 
                    max={30} 
                    step={1} 
                    onValueChange={(val) => setExperience(val[0])}
                    className="py-4"
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    className="flex-1 rounded-none h-14 border-[#222222] font-bold tracking-[0.3em] text-[10px] uppercase hover:bg-white/5"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button 
                    className="flex-[2] rounded-none h-14 bg-white text-black font-bold tracking-[0.3em] text-[10px] uppercase hover:bg-[#0066B1] hover:text-white transition-all disabled:opacity-20"
                    disabled={selectedSkills.length === 0}
                    onClick={() => setStep(3)}
                  >
                    Enter Assessment <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Leadership Quiz */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-light tracking-tight uppercase">Leadership <span className="font-bold text-[#0066B1]">Simulation</span></h2>
                <p className="text-muted-foreground tracking-[0.1em] uppercase text-xs opacity-60">Decisions define character. Choose your course of action.</p>
              </div>

              <div className="space-y-16">
                {QUIZ_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="space-y-8 animate-in fade-in duration-700">
                    <div className="flex items-start gap-4">
                      <span className="text-[10px] font-mono text-[#0066B1] border border-[#0066B1]/30 px-2 py-1">SCENARIO_0{idx + 1}</span>
                      <h3 className="text-xl font-light tracking-tight leading-snug">{q.question}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleAnswer(q.id, opt.id)}
                          className={`p-6 text-left text-xs tracking-wide leading-relaxed border transition-all duration-300 rounded-none relative overflow-hidden group ${answers[q.id] === opt.id ? 'border-[#0066B1] bg-[#0066B1]/5' : 'border-[#222222] hover:border-[#0066B1]/30 bg-[#0A0A0A]'}`}
                        >
                          <div className={`absolute top-0 left-0 h-full w-1 transition-all ${answers[q.id] === opt.id ? 'bg-[#0066B1]' : 'bg-transparent group-hover:bg-[#0066B1]/20'}`}></div>
                          <span className="font-bold text-[#0066B1] mr-2 opacity-50">{opt.id}.</span> {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-4 pt-12">
                  <Button 
                    variant="outline"
                    className="flex-1 rounded-none h-14 border-[#222222] font-bold tracking-[0.3em] text-[10px] uppercase hover:bg-white/5"
                    onClick={() => setStep(2)}
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button 
                    className="flex-[2] rounded-none h-14 bg-white text-black font-bold tracking-[0.3em] text-[10px] uppercase hover:bg-[#0066B1] hover:text-white transition-all disabled:opacity-20"
                    disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length}
                    onClick={() => setStep(3.5)}
                  >
                    Finalize Application <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* New Step 3.5: Availability */}
          {step === 3.5 && (
            <motion.div 
              key="stepAvailability"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-12 max-w-3xl mx-auto"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-light tracking-tight uppercase">Operational <span className="font-bold text-[#0066B1]">Readiness</span></h2>
                <p className="text-muted-foreground tracking-[0.1em] uppercase text-xs opacity-60">Specify your earliest availability to integrate with the BMW executive team.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {AVAILABILITY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setAvailability(opt.days)}
                    className={`p-8 text-left border transition-all duration-300 rounded-none relative group flex justify-between items-center ${availability === opt.days ? 'border-[#0066B1] bg-[#0066B1]/5' : 'border-[#222222] bg-[#0A0A0A] hover:border-[#0066B1]/30'}`}
                  >
                    <div className="space-y-2">
                      <h3 className="text-lg font-light tracking-tight uppercase">{opt.label}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">{opt.description}</p>
                    </div>
                    {availability === opt.days && <CheckCircle2 className="w-6 h-6 text-[#0066B1]" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-12">
                <Button 
                  variant="outline"
                  className="flex-1 rounded-none h-14 border-[#222222] font-bold tracking-[0.3em] text-[10px] uppercase hover:bg-white/5"
                  onClick={() => setStep(3)}
                >
                  <ChevronLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  className="flex-[2] rounded-none h-14 bg-white text-black font-bold tracking-[0.3em] text-[10px] uppercase hover:bg-[#0066B1] hover:text-white transition-all disabled:opacity-20"
                  disabled={availability === null}
                  onClick={() => setStep(4)}
                >
                  Review Application <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-12 max-w-2xl mx-auto"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-light tracking-tight uppercase">Confirm <span className="font-bold text-[#0066B1]">Submission</span></h2>
                <p className="text-muted-foreground tracking-[0.1em] uppercase text-xs opacity-60">Review your executive profile before encryption and transmission.</p>
              </div>

              <div className="bg-[#0A0A0A] border border-[#222222] rounded-none p-8 space-y-8 divide-y divide-white/5">
                <div className="flex items-center gap-6 pb-6">
                  <div className="w-16 h-16 bg-white/5 flex items-center justify-center">
                    <UserCircle className="w-8 h-8 text-[#0066B1]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest">{fullName}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                      {experience} Years // {AVAILABILITY_OPTIONS.find(o => o.days === availability)?.label}
                    </p>
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3 h-3 text-[#0066B1]" />
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Target Role</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest">
                    {VACANCIES.find(v => v.id === selectedVacancyId)?.title}
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3 h-3 text-[#0066B1]" />
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Selected Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(s => (
                      <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-3 h-3 text-[#0066B1]" />
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Scenario Completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5">
                      <div className="h-full bg-emerald-500 w-full"></div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-500 uppercase">CALCULATED</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  className="flex-1 rounded-none h-14 border-[#222222] font-bold tracking-[0.3em] text-[10px] uppercase hover:bg-white/5"
                  onClick={() => setStep(3.5)}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="mr-2 w-4 h-4" /> Edit
                </Button>
                <Button 
                  className="flex-[2] rounded-none h-14 bg-[#0066B1] text-white font-bold tracking-[0.3em] text-[10px] uppercase hover:bg-white hover:text-[#0066B1] transition-all"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "TRANSMITTING..." : "Submit Secure Application"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Markers */}
      <footer className="fixed bottom-0 left-0 w-full px-8 py-6 flex justify-between items-center opacity-20 text-[8px] font-mono tracking-[0.3em] pointer-events-none">
        <div>© BMW Group // Global Recruitment</div>
        <div>AUTHORIZED_ACCESS_ONLY // {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}
