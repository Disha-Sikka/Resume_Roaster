export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  education: {
    school: string;
    degree: string;
    year: string;
  }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
  }[];
  certifications: string[];
}

export interface RoastMistake {
  section: string;
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  funnyComment: string;
  fix: string;
}

export interface RoastImprovement {
  section: string;
  suggestion: string;
  impact: string;
}

export interface RoastResult {
  overallScore: number;
  atsScore: number;
  grammarScore: number;
  designScore: number;
  skillsScore: number;
  experienceScore: number;
  roast: string;
  mistakes: RoastMistake[];
  improvements: RoastImprovement[];
  summarySuggestion: string;
  suggestedSkills?: string[]; // Prompt Section 6
  keywordsMissing: string[];
  interviewReadiness: string;
  finalVerdict: string;
}

export type RoastMode = "friendly" | "savage" | "brutal" | "hr" | "ats";

export interface RoastHistoryItem {
  id: string;
  date: string;
  fileName: string;
  resumeText: string;
  parsedData: ParsedResume;
  mode: RoastMode;
  result: RoastResult;
}

export interface UserProfile {
  email: string;
  name: string;
  isGuest: boolean;
  avatarUrl?: string;
}
