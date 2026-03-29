import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { HR_WEBHOOK_URL } from "@/lib/agentService";
import { insertCandidateSubmission, upsertStrategyContext } from "@/lib/supabase";
import { extractPdfText } from "@/lib/extractPdfText";
import { parseCvTextToCandidate } from "@/lib/parseCvTextToCandidate";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Upload, FileText, CheckCircle2, FileUp, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function HrAdmin() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [contextText, setContextText] = useState("");
  const [originalJd, setOriginalJd] = useState(
    "We are looking for a Logistics Lead to manage our supply chain operations, ensuring timely deliveries and optimal inventory levels..."
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please upload a strategy document (CSV/PDF) first.");
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      // 1. Extract text from the CV document
      let extractedText = "";
      if (selectedFile.type === "application/pdf") {
        extractedText = await extractPdfText(selectedFile);
      } else {
        extractedText = await selectedFile.text();
      }

      // 2. Parse the text into candidate fields
      const parsed = parseCvTextToCandidate({ cvText: extractedText });

      // 3. Save Strategy Context (Persistence)
      await upsertStrategyContext(extractedText);

      // 4. Save Candidate to Supabase
      await insertCandidateSubmission({
        vacancy_id: "logistics-lead", // Default for hackathon demo
        submission_source: "hr_cv_upload",
        full_name: parsed.name,
        company: parsed.company,
        current_job_title: parsed.currentRole,
        experience_years: parsed.yearsExperience,
        cv_text: extractedText,
        background: parsed.bio?.description || "",
        skills_json: parsed.bio?.skills || []
      });

      // 4. Trigger n8n Webhook for "The Living JD" Re-scoring
      const formData = new FormData();
      formData.append("context", contextText);
      formData.append("original_jd", originalJd);
      formData.append("candidate_name", parsed.name);
      formData.append("document", selectedFile);

      const response = await fetch(HR_WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Candidate saved to DB, but AI Pipeline failed to trigger.");
      }

      setIsSuccess(true);
      toast.success("Candidate uploaded and AI Pipeline triggered!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      console.error("Error submitting HR plans:", error);
      toast.error(`Upload Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <header className="border-b border-border bg-card">
        <div className="container flex items-center h-16 px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-4 h-8 w-8 hover:bg-muted/50"
            aria-label="Back to App"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center p-0.5">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" alt="BMW" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">
                HR Master Control
              </h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5">
                Strategic Planning & Context Injection
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl px-6 py-8">
        <div className="mb-8 border-l-4 border-[#0066B1] pl-4">
          <h2 className="text-xl font-bold tracking-tight uppercase text-foreground">
            Inject Strategic Context (File Upload)
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Upload your internal strategy document (PDF or CSV). The AI Agent will read the file and fuse it with live market news to dynamically rewrite job descriptions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <section className="bg-card border border-border/50 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileUp className="w-5 h-5 text-[#0066B1]" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Upload Strategy Document</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Upload the PDF or CSV containing next year's plans, Q1-Q4 targets, or new production quotas.</p>
            
            <div className="w-full relative border-2 border-dashed border-border hover:border-[#0066B1]/50 bg-muted/20 transition-colors rounded-none p-8 flex flex-col items-center justify-center min-h-[160px]">
              <input
                type="file"
                ref={fileInputRef}
                accept=".txt,.csv,.pdf,.xlsx,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required={!selectedFile}
              />
              
              {!selectedFile ? (
                <div className="text-center pointer-events-none">
                  <div className="w-12 h-12 bg-[#0066B1]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-[#0066B1]" />
                  </div>
                  <p className="text-sm font-semibold">Drag and drop file or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports PDF, CSV, Excel or TXT</p>
                </div>
              ) : (
                <div className="text-center z-10 w-full max-w-md bg-background border border-border/80 p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-8 h-8 text-[#0066B1] flex-shrink-0" />
                    <div className="text-left truncate">
                      <p className="text-sm font-bold truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={clearFile}
                    className="hover:bg-bmw-danger/10 hover:text-bmw-danger ml-2 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Quick Context / Instruction Override */}
          <section className="bg-card border border-border/50 p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Urgent Business Reality</h3>
            <p className="text-xs text-muted-foreground mb-4">Provide any immediate macro conditions not included in the strategy document (e.g. "Sudden supply chain disruption").</p>
            <textarea
              name="context"
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              rows={2}
              className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0066B1] transition-all"
              placeholder="(Optional) Override context here..."
            />
          </section>

          {/* Target Baseline JD */}
          <section className="bg-card border border-border/50 p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Baseline Job Description</h3>
            <textarea
              name="original_jd"
              required
              value={originalJd}
              onChange={(e) => setOriginalJd(e.target.value)}
              rows={3}
              className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0066B1] transition-all font-mono text-xs"
            />
          </section>

          {/* Submit Action */}
          <div className="flex items-center gap-4 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !selectedFile}
              className="bg-[#0066B1] hover:bg-[#005596] text-white px-8 py-6 h-auto rounded-none uppercase tracking-widest font-bold text-xs"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Reading File & Injecting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Synchronize with Agent Pipeline
                </>
              )}
            </Button>
            
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center text-bmw-success text-sm font-bold uppercase tracking-wider"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Document Sent Successfully
              </motion.div>
            )}
          </div>
        </form>
      </main>
    </motion.div>
  );
}
