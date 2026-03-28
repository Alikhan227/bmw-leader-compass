import { Candidate } from "@/lib/types";
import { createManualCandidate } from "@/lib/manualCandidate";

function extractYears(text: string): number {
  const normalized = text.toLowerCase();

  const directMatch = normalized.match(/(\d{1,2})\+?\s+years?/);
  if (directMatch) return Number(directMatch[1]);

  const expMatch = normalized.match(/experience[:\s]+(\d{1,2})/);
  if (expMatch) return Number(expMatch[1]);

  return 5;
}

function extractCompany(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const companyLine = lines.find((line) =>
    /company|employer|organization/i.test(line)
  );
  if (companyLine) {
    const value = companyLine.split(":")[1]?.trim();
    if (value) return value;
  }

  const atMatch = text.match(/\bat\s+([A-Z][A-Za-z0-9&.\- ]{2,40})/);
  if (atMatch?.[1]) return atMatch[1].trim();

  return "External Applicant";
}

function extractRole(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const roleLine = lines.find((line) =>
    /current role|title|position|role/i.test(line)
  );
  if (roleLine) {
    const value = roleLine.split(":")[1]?.trim();
    if (value) return value;
  }

  const commonRoles = [
    "VP Operations",
    "Director",
    "Head of Manufacturing",
    "SVP Global Supply Chain",
    "Chief Transformation Officer",
    "Engineering Manager",
    "Program Manager",
    "Product Manager",
  ];

  const found = commonRoles.find((role) =>
    text.toLowerCase().includes(role.toLowerCase())
  );
  if (found) return found;

  return "Candidate";
}

function extractSkills(text: string): string[] {
  const knownSkills = [
    "Lean Manufacturing",
    "Supply Chain Management",
    "Crisis Management",
    "Cross-functional Leadership",
    "Operational Excellence",
    "Stakeholder Management",
    "Digital Transformation",
    "Agile Scaling",
    "Innovation Strategy",
    "Risk Assessment",
    "Process Improvement",
    "Quality Assurance",
    "Production Planning",
    "Factory Operations",
    "AI/ML Integration",
    "Vendor Management",
    "Rapid Response Operations",
    "Change Management",
    "Software Engineering",
    "EV Battery Systems",
  ];

  const lower = text.toLowerCase();
  const matched = knownSkills.filter((skill) =>
    lower.includes(skill.toLowerCase())
  );

  if (matched.length > 0) return matched;

  const skillsLine = text
    .split("\n")
    .map((l) => l.trim())
    .find((line) => /skills/i.test(line));

  if (skillsLine) {
    const value = skillsLine.split(":")[1]?.trim();
    if (value) {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8);
    }
  }

  return ["Leadership", "Operations", "Execution"];
}

function extractName(text: string, fallbackName?: string): string {
  if (fallbackName?.trim()) return fallbackName.trim();

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const firstReasonableLine = lines.find(
    (line) =>
      line.length >= 4 &&
      line.length <= 40 &&
      /^[A-Za-z][A-Za-z.\- ]+$/.test(line) &&
      !/curriculum|resume|cv|profile|experience|skills/i.test(line)
  );

  return firstReasonableLine || "Unnamed Candidate";
}

function buildBackground(text: string): string {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 6)
    .join(" ")
    .slice(0, 500);
}

export function parseCvTextToCandidate(params: {
  cvText: string;
  candidateName?: string;
  timeToHire?: number;
  costToHire?: number;
}): Candidate {
  const { cvText, candidateName, timeToHire = 30, costToHire = 5 } = params;

  const name = extractName(cvText, candidateName);
  const currentRole = extractRole(cvText);
  const company = extractCompany(cvText);
  const yearsExperience = extractYears(cvText);
  const skills = extractSkills(cvText);
  const background = buildBackground(cvText);

  return createManualCandidate({
    name,
    currentRole,
    company,
    yearsExperience,
    skills,
    background,
    timeToHire,
    costToHire,
  });
}