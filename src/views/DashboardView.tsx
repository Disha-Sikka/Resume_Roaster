import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, Flame, Sparkles, CheckCircle2, AlertTriangle, 
  ArrowLeft, Download, Clipboard, FileJson, FileText, 
  RefreshCw, Star, Info, Layout, Check, ShieldAlert, Award 
} from "lucide-react";
import { RoastResult, ParsedResume, RoastMode } from "../types";

interface DashboardViewProps {
  fileName: string;
  parsedResume: ParsedResume;
  mode: RoastMode;
  result: RoastResult;
  onBackToUpload: () => void;
}

export default function DashboardView({ 
  fileName, 
  parsedResume, 
  mode, 
  result, 
  onBackToUpload 
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "resume-audit" | "improvements">("dashboard");
  const [selectedMistake, setSelectedMistake] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Score categories for custom SVG bar charts
  const scoreCategories = [
    { label: "Overall Score", score: result.overallScore, color: "bg-purple-600 dark:bg-purple-500", text: "text-purple-600" },
    { label: "ATS Pass Rate", score: result.atsScore, color: "bg-blue-600 dark:bg-blue-500", text: "text-blue-600" },
    { label: "Grammar / Polish", score: result.grammarScore, color: "bg-emerald-600 dark:bg-emerald-500", text: "text-emerald-600" },
    { label: "Design / Format", score: result.designScore, color: "bg-pink-600 dark:bg-pink-500", text: "text-pink-600" },
    { label: "Skills Density", score: result.skillsScore, color: "bg-amber-600 dark:bg-amber-500", text: "text-amber-500" },
    { label: "Exp. Impact", score: result.experienceScore, color: "bg-rose-600 dark:bg-rose-500", text: "text-rose-600" }
  ];

  // Helper to copy content to clipboard
  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export report as markdown download
  const handleDownloadMarkdown = () => {
    const md = `
# Resume Roast Report: ${parsedResume.name}
**File:** ${fileName}
**Roast Mode:** ${mode.toUpperCase()}
**Overall Score:** ${result.overallScore}/100 | **ATS Score:** ${result.atsScore}/100

## 🔴 The AI Roast
${result.roast}

## 🔴 Mistakes Found
${result.mistakes.map((m, i) => `### ${i+1}. [${m.severity.toUpperCase()}] ${m.issue} (${m.section})
- *Comment:* ${m.funnyComment}
- *Fix:* ${m.fix}`).join("\n\n")}

## 🟢 Improvements Path
${result.improvements.map((imp, i) => `### ${i+1}. ${imp.suggestion} (${imp.section})
- *Expected Impact:* ${imp.impact}`).join("\n\n")}

## 🟢 Suggested Summary
${result.summarySuggestion}

## 🟢 Missing ATS Keywords
${result.keywordsMissing.join(", ")}

## 🔴 Verdict
${result.finalVerdict}
`;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${parsedResume.name.replace(/\s+/g, "_")}_Roast_Report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export full JSON report
  const handleDownloadJSON = () => {
    const fullJson = JSON.stringify({ fileName, parsedResume, mode, result }, null, 2);
    const blob = new Blob([fullJson], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${parsedResume.name.replace(/\s+/g, "_")}_Roast_Report.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get color for Severity level
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Background radial blobs */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header and Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <button
            onClick={onBackToUpload}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Upload
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3.5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Roast Dashboard: {parsedResume.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {mode}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Analyzing document: <strong className="text-slate-700 dark:text-slate-300">{fileName}</strong>
          </p>
        </div>

        {/* Action Export Row */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            title="Download full report as Markdown"
          >
            <FileText className="w-4 h-4 text-purple-500" />
            MD Report
          </button>
          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            title="Download full result as JSON"
          >
            <FileJson className="w-4 h-4 text-blue-500" />
            JSON Report
          </button>
          <button
            onClick={() => handleCopyToClipboard(result.roast, "Roast Text")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-850 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" />
                Copy Roast
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex mb-8 overflow-x-auto gap-2 p-1 bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl max-w-lg backdrop-blur-sm">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold text-center transition-all cursor-pointer ${activeTab === "dashboard" ? "bg-white dark:bg-white/10 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/50 dark:border-white/10" : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-300"}`}
        >
          Overview Score
        </button>
        <button
          onClick={() => setActiveTab("resume-audit")}
          className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold text-center transition-all cursor-pointer ${activeTab === "resume-audit" ? "bg-white dark:bg-white/10 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/50 dark:border-white/10" : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-300"}`}
        >
          Interactive Resume
        </button>
        <button
          onClick={() => setActiveTab("improvements")}
          className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold text-center transition-all cursor-pointer ${activeTab === "improvements" ? "bg-white dark:bg-white/10 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/50 dark:border-white/10" : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-300"}`}
        >
          Action Plan ({result.mistakes.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Left 2 Columns: Scores, Charts and Roasts */}
            <div className="lg:col-span-2 space-y-8">
              {/* Score Circular Rings Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {scoreCategories.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-all backdrop-blur-sm"
                  >
                    {/* Circle SVG */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          className="stroke-slate-100 dark:stroke-white/5"
                          strokeWidth="5"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="32"
                          cy="32"
                          r="28"
                          className={`stroke-current ${item.text}`}
                          strokeWidth="5"
                          fill="transparent"
                          strokeDasharray={175}
                          initial={{ strokeDashoffset: 175 }}
                          animate={{ strokeDashoffset: 175 - (175 * item.score) / 100 }}
                          transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                        />
                      </svg>
                      <span className="absolute text-sm font-bold text-slate-800 dark:text-white">
                        {item.score}
                      </span>
                    </div>
                    <div className="text-center mt-3">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 leading-tight">
                        {item.label}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Animated Bar Chart */}
              <div className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-md">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  Numerical Metric Audit
                </h3>
                
                <div className="space-y-4">
                  {scoreCategories.map((cat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <span>{cat.label}</span>
                        <span>{cat.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/5 h-2.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.score}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                          className={`h-full rounded-full ${cat.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* The AI Roast Text Box */}
              <div className="p-6 md:p-8 bg-gradient-to-r from-purple-900/10 via-pink-900/5 to-transparent border border-purple-500/30 rounded-2xl relative shadow-md backdrop-blur-md">
                <div className="absolute top-4 right-4 animate-bounce">
                  <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  The AI Roast Content
                </h3>
                <div className="text-slate-700 dark:text-slate-350 text-sm sm:text-base leading-relaxed font-sans whitespace-pre-wrap">
                  {result.roast}
                </div>
              </div>
            </div>

            {/* Right Column: Expert Recommendations & Fast Stats */}
            <div className="space-y-8">
              {/* missing keywords */}
              <div className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-md">
                <h3 className="text-md font-extrabold text-slate-950 dark:text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  ATS Keywords Missing
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-normal">
                  Our ATS algorithm found that you are missing these critical industry keywords. Adding these will significantly increase parsing scores:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.keywordsMissing.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* suggested skills */}
              {result.suggestedSkills && result.suggestedSkills.length > 0 && (
                <div className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-md">
                  <h3 className="text-md font-extrabold text-slate-955 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Suggested Skills to Highlight
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedSkills.map((sk, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/*Suggested Professional Summary */}
              <div className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-md">
                <h3 className="text-md font-extrabold text-slate-955 dark:text-white mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Suggested Career Summary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Replace your current header summary with this high-impact, professional, keyword-optimized statement:
                </p>
                <div className="p-3.5 bg-slate-100/50 dark:bg-black/25 border border-slate-200/50 dark:border-white/5 rounded-xl text-slate-600 dark:text-slate-350 text-xs sm:text-sm leading-relaxed font-sans relative group">
                  <button
                    onClick={() => handleCopyToClipboard(result.summarySuggestion, "Career Summary")}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-opacity cursor-pointer"
                    title="Copy to clipboard"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                  {result.summarySuggestion}
                </div>
              </div>

              {/* Interview Readiness */}
              <div className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-md">
                <h3 className="text-md font-extrabold text-slate-955 dark:text-white mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Interview Readiness
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  {result.interviewReadiness}
                </p>
              </div>

              {/* Final Verdict */}
              <div className="bg-slate-900/60 dark:bg-[#0a0512]/50 border border-purple-500/30 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden backdrop-blur-md">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/15 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400">Final Verdict</h3>
                <p className="text-sm sm:text-base font-bold leading-normal mt-2 italic">
                  "{result.finalVerdict}"
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: INTERACTIVE RESUME SHEET WITH FLOATING MISTAKE TAGS */}
        {activeTab === "resume-audit" && (
          <motion.div
            key="resume-audit"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Simulated Resume Sheet */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-xl text-slate-850 font-sans min-h-[800px] relative overflow-hidden">
              {/* Simulated PDF Header */}
              <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center relative group">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">{parsedResume.name}</h2>
                <p className="text-xs text-slate-500 mt-1 flex justify-center gap-3">
                  <span>{parsedResume.email}</span>
                  {parsedResume.phone && (
                    <>
                      <span>•</span>
                      <span>{parsedResume.phone}</span>
                    </>
                  )}
                </p>
                
                {/* Float tag for header section */}
                {result.mistakes.some(m => m.section.toLowerCase().includes("header") || m.section.toLowerCase().includes("contact") || m.section.toLowerCase().includes("summary")) && (
                  <button 
                    onClick={() => {
                      const idx = result.mistakes.findIndex(m => m.section.toLowerCase().includes("header") || m.section.toLowerCase().includes("contact") || m.section.toLowerCase().includes("summary"));
                      if (idx !== -1) setSelectedMistake(idx);
                    }}
                    className="absolute right-0 top-0 bg-rose-500 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full animate-bounce shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    ⚠️ Header Alert!
                  </button>
                )}
              </div>

              {/* Skills Section */}
              <div className="mb-6 relative group">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {parsedResume.skills.map((skill, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>

                {result.mistakes.some(m => m.section.toLowerCase().includes("skill")) && (
                  <button 
                    onClick={() => {
                      const idx = result.mistakes.findIndex(m => m.section.toLowerCase().includes("skill"));
                      if (idx !== -1) setSelectedMistake(idx);
                    }}
                    className="absolute right-0 top-0 bg-rose-500 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full animate-bounce shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    ⚠️ Skill Bloat!
                  </button>
                )}
              </div>

              {/* Experience Section */}
              <div className="mb-6 relative group">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-4">Work Experience</h3>
                <div className="space-y-4">
                  {parsedResume.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-bold text-slate-900">
                        <span>{exp.company} — {exp.role}</span>
                        <span className="text-slate-500">{exp.duration}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>

                {result.mistakes.some(m => m.section.toLowerCase().includes("experience") || m.section.toLowerCase().includes("work")) && (
                  <button 
                    onClick={() => {
                      const idx = result.mistakes.findIndex(m => m.section.toLowerCase().includes("experience") || m.section.toLowerCase().includes("work"));
                      if (idx !== -1) setSelectedMistake(idx);
                    }}
                    className="absolute right-0 top-0 bg-rose-500 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full animate-bounce shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    ⚠️ Metric Alert!
                  </button>
                )}
              </div>

              {/* Education Section */}
              <div className="relative group">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">Education</h3>
                <div className="space-y-3">
                  {parsedResume.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>{edu.school} — {edu.degree}</span>
                      <span className="text-slate-500 font-normal">{edu.year}</span>
                    </div>
                  ))}
                </div>

                {result.mistakes.some(m => m.section.toLowerCase().includes("education") || m.section.toLowerCase().includes("school")) && (
                  <button 
                    onClick={() => {
                      const idx = result.mistakes.findIndex(m => m.section.toLowerCase().includes("education") || m.section.toLowerCase().includes("school"));
                      if (idx !== -1) setSelectedMistake(idx);
                    }}
                    className="absolute right-0 top-0 bg-rose-500 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full animate-bounce shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    ⚠️ Education Alert!
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar detailing selected mistake details */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Interactive Inspector</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Click on the pulsing red badges over the resume layout on the left to inspect specific grammar, formatting, and impact issues.
                </p>

                <AnimatePresence mode="wait">
                  {selectedMistake !== null ? (
                    <motion.div
                      key={selectedMistake}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
                          {result.mistakes[selectedMistake].section}
                        </span>
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getSeverityBadge(result.mistakes[selectedMistake].severity)}`}>
                          {result.mistakes[selectedMistake].severity}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-slate-900 dark:text-white text-md">
                        {result.mistakes[selectedMistake].issue}
                      </h4>

                      <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 rounded-xl text-xs sm:text-sm font-semibold leading-relaxed">
                        🔥 <strong>Roast:</strong> {result.mistakes[selectedMistake].funnyComment}
                      </div>

                      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs sm:text-sm leading-relaxed">
                        🟢 <strong>Professional Fix:</strong> {result.mistakes[selectedMistake].fix}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs sm:text-sm">
                      No mistake selected. Click an alert badge on the resume page.
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: STEP-BY-STEP ACTION PLAN */}
        {activeTab === "improvements" && (
          <motion.div
            key="improvements"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* List every mistake & fix side-by-side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mistakes & Roasts Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-5 h-5" />
                  Every Spell & Format Crime Found ({result.mistakes.length})
                </h3>
                {result.mistakes.map((mistake, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">{mistake.section}</span>
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getSeverityBadge(mistake.severity)}`}>
                        {mistake.severity}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                      {mistake.issue}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-350 text-xs sm:text-sm bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl italic">
                      🔥 "{mistake.funnyComment}"
                    </p>
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      <strong className="text-emerald-600 dark:text-emerald-400">Action Fix:</strong> {mistake.fix}
                    </div>
                  </div>
                ))}
              </div>

              {/* Improvements & Career Impact Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Rigorous Upgrade Recommendations ({result.improvements.length})
                </h3>
                {result.improvements.map((imp, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{imp.section}</span>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                      {imp.suggestion}
                    </h4>
                    <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong className="text-blue-600 dark:text-blue-400">Expected Career/ATS Impact:</strong> {imp.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
