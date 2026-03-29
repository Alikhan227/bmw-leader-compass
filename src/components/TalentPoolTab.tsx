import { useMemo, useState } from "react";
import { Candidate } from "@/lib/types";
import { createManualCandidate } from "@/lib/manualCandidate";
import { parseCvTextToCandidate } from "@/lib/parseCvTextToCandidate";
import { extractPdfText } from "@/lib/extractPdfText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type TalentPoolTabProps = {
  candidates: Candidate[];
  onAddCandidate?: (candidate: Candidate) => void;
  editable?: boolean;
};

export function TalentPoolTab({
  candidates,
  onAddCandidate,
  editable = false,
}: TalentPoolTabProps) {
  const [manualOpen, setManualOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [company, setCompany] = useState("");
  const [yearsExperience, setYearsExperience] = useState("5");
  const [skills, setSkills] = useState("");
  const [background, setBackground] = useState("");
  const [timeToHire, setTimeToHire] = useState("30");
  const [costToHire, setCostToHire] = useState("5");

  const [cvCandidateName, setCvCandidateName] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvTimeToHire, setCvTimeToHire] = useState("30");
  const [cvCostToHire, setCvCostToHire] = useState("5");

  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [candidates]);

  function resetManualForm() {
    setName("");
    setCurrentRole("");
    setCompany("");
    setYearsExperience("5");
    setSkills("");
    setBackground("");
    setTimeToHire("30");
    setCostToHire("5");
  }

  function resetCvForm() {
    setCvCandidateName("");
    setCvText("");
    setCvTimeToHire("30");
    setCvCostToHire("5");
    setPdfError(null);
    setIsParsingPdf(false);
  }

  function handleManualSubmit() {
    if (!name.trim()) return;

    const candidate = createManualCandidate({
      name: name.trim(),
      currentRole: currentRole.trim() || "Candidate",
      company: company.trim() || "External Applicant",
      yearsExperience: Number(yearsExperience) || 0,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      background: background.trim(),
      timeToHire: Number(timeToHire) || 30,
      costToHire: Number(costToHire) || 5,
    });

    onAddCandidate?.(candidate);
    resetManualForm();
    setManualOpen(false);
  }

  function handleCvSubmit() {
    if (!cvText.trim()) return;

    const candidate = parseCvTextToCandidate({
      cvText,
      candidateName: cvCandidateName.trim() || undefined,
      timeToHire: Number(cvTimeToHire) || 30,
      costToHire: Number(cvCostToHire) || 5,
    });

    onAddCandidate?.(candidate);
    resetCvForm();
    setCvOpen(false);
  }

  async function handlePdfUpload(file: File | null) {
    if (!file) return;

    setPdfError(null);
    setIsParsingPdf(true);

    try {
      const text = await extractPdfText(file);

      if (!text.trim()) {
        throw new Error("No readable text found in this PDF.");
      }

      setCvText(text);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to parse PDF.";
      setPdfError(message);
    } finally {
      setIsParsingPdf(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="bmw-section-title">Talent Pool</p>
          <p className="text-sm text-muted-foreground">
            {editable
              ? "Review current candidates and add new profiles manually or from CV."
              : "Review the current candidate pool."}
          </p>
        </div>

        {editable && (
          <div className="flex items-center gap-3">
            <Dialog open={manualOpen} onOpenChange={setManualOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="uppercase tracking-wider font-semibold">
                  Add Candidate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                  <DialogTitle>Add Candidate</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input placeholder="Current role" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} />
                  <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                  <Input type="number" placeholder="Years of experience" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />
                  <Input type="number" placeholder="Time to hire (days)" value={timeToHire} onChange={(e) => setTimeToHire(e.target.value)} />
                  <Input type="number" placeholder="Cost to hire (1-10)" value={costToHire} onChange={(e) => setCostToHire(e.target.value)} />
                </div>

                <Input placeholder="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />

                <Textarea placeholder="Background / summary" value={background} onChange={(e) => setBackground(e.target.value)} rows={5} />

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => { resetManualForm(); setManualOpen(false); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleManualSubmit}>Save Candidate</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={cvOpen} onOpenChange={setCvOpen}>
              <DialogTrigger asChild>
                <Button className="uppercase tracking-wider font-semibold">
                  Add CV
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                  <DialogTitle>Add Candidate from CV</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Candidate name (optional)"
                    value={cvCandidateName}
                    onChange={(e) => setCvCandidateName(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Time to hire (days)"
                    value={cvTimeToHire}
                    onChange={(e) => setCvTimeToHire(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Cost to hire (1-10)"
                    value={cvCostToHire}
                    onChange={(e) => setCvCostToHire(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload PDF CV</label>
                  <Input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      void handlePdfUpload(file);
                    }}
                  />
                  {isParsingPdf && (
                    <p className="text-xs text-[#0066B1]">
                      Parsing PDF and extracting text...
                    </p>
                  )}
                  {pdfError && <p className="text-xs text-red-500">{pdfError}</p>}
                </div>

                <Textarea
                  placeholder="CV text will appear here after upload, or paste text manually..."
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  rows={14}
                />

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetCvForm();
                      setCvOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCvSubmit} disabled={!cvText.trim() || isParsingPdf}>
                    Parse CV & Add
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {sortedCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="border border-border/30 bg-card p-4 rounded-none space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-base">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {candidate.currentRole} · {candidate.company}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {candidate.isNew && (
                  <span className="text-[10px] px-2 py-1 border border-red-500/30 bg-red-500/10 text-red-400 uppercase tracking-widest font-bold">
                    New
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>Experience: {candidate.yearsExperience} yrs</div>
              <div>Time to hire: {candidate.timeToHire} days</div>
              <div>Cost to hire: {candidate.costToHire}/10</div>
              <div>
                Top fit:{" "}
                {Math.max(
                  candidate.fitScores?.["automotive-continuity"] || 0,
                  candidate.fitScores?.transformation || 0,
                  candidate.fitScores?.["supply-chain-crisis"] || 0
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}