import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, FileText, AlertCircle, RefreshCw, ChevronRight, 
  Trash2, Flame, User, Mail, Phone, BookOpen, Briefcase, 
  Sparkles, Smile, ShieldAlert, Cpu, Award, Plus, Clipboard 
} from "lucide-react";
import { extractTextFromFile } from "../utils/fileParser";
import { ParsedResume, RoastMode } from "../types";

interface RoasterViewProps {
  onRoastCompleted: (fileName: string, text: string, parsed: ParsedResume, mode: RoastMode, result: any) => void;
}

export default function RoasterView({ onRoastCompleted }: RoasterViewProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [usePaste, setUsePaste] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Step workflow: "upload" | "review" | "roasting"
  const [step, setStep] = useState<"upload" | "review" | "roasting">("upload");
  const [selectedMode, setSelectedMode] = useState<RoastMode>("savage");
  const [roastingStatus, setRoastingStatus] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Funny supporting text selector (stably chosen per view mount)
  const [subtext] = useState(() => {
    const subtexts = [
      "We promise to judge the PDF, not you.",
      "Maximum file size: 10MB of career decisions.",
      "Our AI is already cracking its knuckles looking at this."
    ];
    return subtexts[Math.floor(Math.random() * subtexts.length)];
  });

  // No more random generic funny errors - we will show structured category-specific errors instead.

  const modesInfo = [
    {
      id: "friendly" as RoastMode,
      icon: <Smile className="w-5 h-5 text-green-500" />,
      label: "Friendly Roast 😊",
      desc: "Gentle teasing and lighthearted sarcasm. Best for sensitive souls who want simple feedback.",
      color: "border-green-500/30 hover:border-green-500/80 bg-green-500/5"
    },
    {
      id: "savage" as RoastMode,
      icon: <Flame className="w-5 h-5 text-orange-500 animate-pulse" />,
      label: "Savage Roast 🔥",
      desc: "Biting sarcasm, mocks career clichés, clobbers buzzwords, and calls out every formatting crime.",
      color: "border-orange-500/30 hover:border-orange-500/80 bg-orange-500/5"
    },
    {
      id: "brutal" as RoastMode,
      icon: <ShieldAlert className="w-5 h-5 text-red-600 animate-bounce" />,
      label: "Brutal Roast 💀",
      desc: "Absolute chaos. Hilariously devastating critique of your career paths, formatting, and education.",
      color: "border-red-600/30 hover:border-red-600/80 bg-red-600/5"
    },
    {
      id: "hr" as RoastMode,
      icon: <User className="w-5 h-5 text-purple-500" />,
      label: "HR Recruiter Roast 🎯",
      desc: "Passive-aggressive corporate speak. Polite on the surface but full of devastating undertones.",
      color: "border-purple-500/30 hover:border-purple-500/80 bg-purple-500/5"
    },
    {
      id: "ats" as RoastMode,
      icon: <Cpu className="w-5 h-5 text-blue-500" />,
      label: "ATS Robot Roast 🤖",
      desc: "Cold, logical, system-failure log analysis. Mocks your resume format as non-parsable waste.",
      color: "border-blue-500/30 hover:border-blue-500/80 bg-blue-500/5"
    }
  ];

  // Drag and Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndParseFile = async (selectedFile: File) => {
    setError(null);
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Upload Error: File exceeds maximum size of 10MB.");
      return;
    }

    setFile(selectedFile);
    setProgress(10);
    setIsParsing(true);

    try {
      const text = await extractTextFromFile(selectedFile, (pct) => setProgress(pct));
      setRawText(text);
      await parseResumeMetadata(text);
    } catch (err: any) {
      console.error(err);
      setError("Upload Error: " + (err.message || "An error occurred while reading the file."));
      setIsParsing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await validateAndParseFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await validateAndParseFile(e.target.files[0]);
    }
  };

  const handlePasteSubmit = async () => {
    if (!pasteText.trim()) {
      setError("Upload Error: Please paste some resume text first.");
      return;
    }
    setError(null);
    setIsParsing(true);
    try {
      setRawText(pasteText);
      await parseResumeMetadata(pasteText);
    } catch (err: any) {
      setError("Upload Error: " + (err.message || "An error occurred."));
      setIsParsing(false);
    }
  };

  // Call API to parse resume into structured schema before roasting
  const parseResumeMetadata = async (resumeText: string) => {
    setRoastingStatus("Deconstructing resume structure...");
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: resumeText }),
      });
      const data = await res.json();
      if (res.ok) {
        setParsedData(data);
        setStep("review");
      } else {
        throw new Error(data.error || "Failed to parse structured resume data.");
      }
    } catch (err: any) {
      // Fallback: Create a structured object from basic scanning or generic fields
      console.warn("Structured parsing failed, using simple fallback", err);
      setError("Parsing Error: " + (err.message || "Failed to parse structured resume data. Defaulting to manual editor view."));
      const fallbackData: ParsedResume = {
        name: "Resume Owner",
        email: "unknown@email.com",
        phone: "",
        skills: ["Technical Skills"],
        education: [{ school: "University", degree: "Bachelor's Degree", year: "" }],
        experience: [{ company: "Workplace", role: "Job Title", duration: "Dates", description: "Duties listed" }],
        projects: [],
        certifications: []
      };
      setParsedData(fallbackData);
      setStep("review");
    } finally {
      setIsParsing(false);
      setProgress(0);
    }
  };

  // Interactive Form Helpers
  const handleParsedFieldChange = (field: keyof ParsedResume, value: any) => {
    if (!parsedData) return;
    setParsedData({ ...parsedData, [field]: value });
  };

  const executeRoast = async () => {
    if (!rawText || !parsedData) return;
    setStep("roasting");
    setError(null);
    
    const statuses = [
      "Looking for buzzwords...",
      "Counting unnecessary adjectives...",
      "Checking if Comic Sans was involved...",
      "Searching for actual achievements...",
      "Finding 'Hardworking'...",
      "Scanning for copy-pasted objectives...",
      "Calling HR...",
      "Calculating emotional damage...",
      "Heating up the roaster coals...",
      "Consulting with passive-aggressive recruiters..."
    ];

    let currentStatusIdx = 0;
    setRoastingStatus(statuses[0]);
    
    const interval = setInterval(() => {
      currentStatusIdx = (currentStatusIdx + 1) % statuses.length;
      setRoastingStatus(statuses[currentStatusIdx]);
    }, 2500);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: rawText,
          mode: selectedMode,
          parsedResume: parsedData
        }),
      });
      
      const data = await response.json();
      clearInterval(interval);

      if (response.ok) {
        const fileName = file ? file.name : `${parsedData.name}_Resume.txt`;
        
        // --- EASTER EGGS INJECTION ---
        const updatedData = { ...data };
        if (updatedData.mistakes) {
          const lowerName = fileName.toLowerCase();
          
          // Filename checks
          if (lowerName === "resume.pdf" || lowerName === "resume.docx" || lowerName === "cv.pdf" || lowerName === "my_resume.pdf" || lowerName === "resume.txt") {
            updatedData.mistakes = [
              {
                section: "Header",
                severity: "critical",
                issue: "The Ultimate Generic Filename",
                funnyComment: "Naming your file 'Resume.pdf' is the ultimate power move to guarantee it gets instantly deleted or lost in the HR downloads folder vortex.",
                fix: "Rename the file to 'Firstname_Lastname_Resume.pdf' before HR deletes it out of sheer confusion."
              },
              ...updatedData.mistakes
            ];
            updatedData.roast = `⚠️ EASTER EGG UNLOCKED: GENERIC FILENAME DETECTED!\n\n"Ah, 'Resume.pdf'. How daring. How unique. It really showcases your absolute refusal to stand out."\n\n${updatedData.roast}`;
          } else if (lowerName.includes("awesome") || lowerName.includes("rockstar") || lowerName.includes("ninja") || lowerName.includes("legend") || lowerName.includes("best")) {
            updatedData.mistakes = [
              {
                section: "Header",
                severity: "medium",
                issue: "Excessive File Confidence",
                funnyComment: `Naming your file '${fileName}' displays dangerous levels of hubris. Let's see if the experience actually backs up this 'rockstar' status (spoiler: it doesn't).`,
                fix: "Humble the filename slightly to prevent recruiter eye-rolls before they even open it."
              },
              ...updatedData.mistakes
            ];
            updatedData.roast = `⚠️ EASTER EGG UNLOCKED: OVERCONFIDENT FILENAME DETECTED!\n\n"A 'rockstar' or 'awesome' filename has arrived on the review desk. Let the destruction begin."\n\n${updatedData.roast}`;
          }

          // ATS Score triggers
          if (updatedData.atsScore < 30) {
            updatedData.mistakes = [
              {
                section: "ATS Compliancy",
                severity: "critical",
                issue: "The Commodore 64 Paradox",
                funnyComment: `Your ATS score is so low (${updatedData.atsScore}%) that an electronic toaster has better digital compliance. Our robot parser almost self-destructed reading this.`,
                fix: "Clean up your columns and use machine-readable vertical spacing."
              },
              ...updatedData.mistakes
            ];
          } else if (updatedData.atsScore > 90) {
            updatedData.mistakes = [
              {
                section: "ATS Compliancy",
                severity: "high",
                issue: "Certified Robot Simulator",
                funnyComment: `Your ATS score is suspiciously high (${updatedData.atsScore}%). You have successfully optimized your resume to please the machine gods. Unfortunately, human eyes will still glaze over in 3 seconds.`,
                fix: "Inject minor human energy so it doesn't look like an automated machine export."
              },
              ...updatedData.mistakes
            ];
          }
        }
        // --- END OF EASTER EGGS ---

        onRoastCompleted(fileName, rawText, parsedData, selectedMode, updatedData);
      } else {
        throw new Error(data.error || "Failed to roast resume.");
      }
    } catch (err: any) {
      clearInterval(interval);
      setError("AI Analysis Error: " + (err.message || "Roasting failed due to server error."));
      setStep("review");
    }
  };

  const resetAll = () => {
    setFile(null);
    setRawText("");
    setPasteText("");
    setParsedData(null);
    setStep("upload");
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Steps Navigation Banner */}
      <div className="flex justify-center items-center gap-2 mb-8 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-2.5 rounded-xl w-fit mx-auto text-xs sm:text-sm font-medium backdrop-blur-md">
        <span className={`px-3 py-1 rounded-md ${step === "upload" ? "bg-purple-600 text-white font-bold" : "text-slate-500 dark:text-slate-400"}`}>1. Upload</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className={`px-3 py-1 rounded-md ${step === "review" ? "bg-purple-600 text-white font-bold" : "text-slate-500 dark:text-slate-400"}`}>2. Audit Info</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className={`px-3 py-1 rounded-md ${step === "roasting" ? "bg-purple-600 text-white font-bold animate-pulse" : "text-slate-500 dark:text-slate-400"}`}>3. The Roast</span>
      </div>

      <AnimatePresence mode="wait">
        {error && (() => {
          let category = "Error";
          let message = error;
          if (error.startsWith("Upload Error:")) {
            category = "Upload Error";
            message = error.replace("Upload Error:", "").trim();
          } else if (error.startsWith("Parsing Error:")) {
            category = "Parsing Error";
            message = error.replace("Parsing Error:", "").trim();
          } else if (error.startsWith("AI Analysis Error:")) {
            category = "AI Analysis Error";
            message = error.replace("AI Analysis Error:", "").trim();
          }

          return (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200 text-sm shadow-md"
            >
              <div className="flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5 animate-bounce" />
                <div className="flex-1 space-y-1">
                  <span className="font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 text-xs block">
                    ❌ {category}
                  </span>
                  <p className="text-slate-800 dark:text-slate-300 font-medium">
                    {message}
                  </p>
                  {!!(import.meta as any).env?.DEV && message.toLowerCase().includes("api key") && (
                    <p className="text-xs text-rose-700 dark:text-rose-400/90 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg mt-2 font-medium">
                      💡 <strong>Tip:</strong> Please check your <strong>GEMINI_API_KEY</strong> in the Secrets / Settings panel in the top-right of your Google AI Studio workspace. Once configured, you can click <strong>"Retry Roast 🔥"</strong> below to instantly resume your roast!
                    </p>
                  )}
                  {category === "AI Analysis Error" && (
                    <div className="mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setError(null);
                          executeRoast();
                        }}
                        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Retry Roast 🔥
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setError(null)} 
                  className="text-slate-400 hover:text-rose-500 font-bold px-2 cursor-pointer transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </motion.div>
          );
        })()}

        {/* STEP 1: UPLOAD AREA */}
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-10 shadow-xl backdrop-blur-md"
          >
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex justify-center items-center gap-2">
                <Flame className="w-7 h-7 text-orange-500 fill-orange-500 animate-pulse" />
                Feed the Roaster
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Upload your resume (PDF, DOCX, or plain TXT) or paste its text. We'll extract your structural profile before applying high-temperature critique.
              </p>
            </div>

            {/* Toggle Upload vs Paste */}
            <div className="flex justify-center mb-8 max-w-sm mx-auto p-1 bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl backdrop-blur-sm">
              <button
                onClick={() => setUsePaste(false)}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex justify-center items-center gap-2 cursor-pointer ${!usePaste ? "bg-white dark:bg-white/10 border border-slate-200/50 dark:border-white/10 text-purple-600 dark:text-purple-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
              <button
                onClick={() => setUsePaste(true)}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex justify-center items-center gap-2 cursor-pointer ${usePaste ? "bg-white dark:bg-white/10 border border-slate-200/50 dark:border-white/10 text-purple-600 dark:text-purple-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                <Clipboard className="w-4 h-4" />
                Paste Resume Text
              </button>
            </div>

            {!usePaste ? (
              /* Drag & Drop Upload Zone */
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  dragActive 
                    ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10" 
                    : "border-slate-300 dark:border-white/10 hover:border-red-500/50 hover:bg-slate-50 dark:hover:bg-white/5"
                } ${isParsing ? "pointer-events-none opacity-50" : ""}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {isParsing ? (
                  <div className="py-6 flex flex-col items-center">
                    <RefreshCw className="w-12 h-12 text-purple-500 animate-spin" />
                    <h3 className="mt-4 font-bold text-slate-800 dark:text-slate-200">Deconstructing career decisions...</h3>
                    <p className="text-slate-500 text-xs mt-1">{progress}% parsed</p>
                    {/* Progress Bar */}
                    <div className="w-full max-w-xs bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                      <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    whileHover={{ rotate: [0, -1, 1, -1, 1, 0] }}
                    transition={{ duration: 0.3 }}
                    className="py-6 flex flex-col items-center select-none"
                  >
                    <div className={`p-4 rounded-full transition-all ${dragActive ? 'bg-red-100 text-red-600' : 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400'}`}>
                      <FileText className={`w-10 h-10 ${dragActive ? 'animate-bounce' : ''}`} />
                    </div>
                    
                    <h3 className="mt-4 font-black text-slate-800 dark:text-white text-xl sm:text-2xl tracking-tight">
                      {dragActive ? "Careful... We're about to read this." : "Drop the crime scene here."}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium italic">
                      {dragActive ? "Drop to ignite." : subtext}
                    </p>
                    
                    <div className="mt-6 inline-flex gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900">
                      <span>PDF</span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span>DOCX</span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span>TXT</span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span>Max 10MB of regrets</span>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Paste Resume Text Field */
              <div className="space-y-4">
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Paste your raw, unformatted resume text here (copy from Word, PDF, or LinkedIn)..."
                  className="w-full h-64 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none font-sans"
                  disabled={isParsing}
                />
                <button
                  onClick={handlePasteSubmit}
                  disabled={isParsing || !pasteText.trim()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold flex justify-center items-center gap-2 shadow-md hover:shadow-purple-500/20 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isParsing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Parsing Resume Text...
                    </>
                  ) : (
                    <>
                      Analyze Text Structure
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2: REVIEW PARSED INFO & MODES */}
        {step === "review" && parsedData && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Top Info Banner */}
            <div className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 dark:bg-white/5 text-purple-600 dark:text-purple-400 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                    {file ? file.name : "Pasted Resume text"}
                  </h2>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                    🎉 Successfully imported your questionable formatting. Review details below before applying heat.
                  </p>
                </div>
              </div>
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                Clear & Upload Another
              </button>
            </div>

            {/* Parsing Review form */}
            <div className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-md backdrop-blur-md">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Resume Structure Audit
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={parsedData.name}
                      onChange={(e) => handleParsedFieldChange("name", e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={parsedData.email}
                      onChange={(e) => handleParsedFieldChange("email", e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={parsedData.phone || ""}
                      onChange={(e) => handleParsedFieldChange("phone", e.target.value)}
                      placeholder="Not specified"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Skills Chips */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Skills Found ({parsedData.skills.length})</label>
                  <div className="flex flex-wrap gap-2 p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl min-h-[46px]">
                    {parsedData.skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {skill}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = parsedData.skills.filter((_, idx) => idx !== i);
                            handleParsedFieldChange("skills", updated);
                          }}
                          className="hover:text-red-500 font-bold ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const val = prompt("Enter new skill:");
                        if (val && val.trim()) {
                          handleParsedFieldChange("skills", [...parsedData.skills, val.trim()]);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Experience List */}
              <div className="mt-8">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  Work Experience History
                </label>
                <div className="space-y-4">
                  {parsedData.experience.map((exp, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl space-y-3 relative group">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = parsedData.experience.filter((_, i) => i !== idx);
                          handleParsedFieldChange("experience", updated);
                        }}
                        className="absolute right-4 top-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <input
                            type="text"
                            value={exp.company}
                            placeholder="Company"
                            onChange={(e) => {
                              const copy = [...parsedData.experience];
                              copy[idx].company = e.target.value;
                              handleParsedFieldChange("experience", copy);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={exp.role}
                            placeholder="Role / Job Title"
                            onChange={(e) => {
                              const copy = [...parsedData.experience];
                              copy[idx].role = e.target.value;
                              handleParsedFieldChange("experience", copy);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={exp.duration || ""}
                            placeholder="Duration (e.g., 2021-Present)"
                            onChange={(e) => {
                              const copy = [...parsedData.experience];
                              copy[idx].duration = e.target.value;
                              handleParsedFieldChange("experience", copy);
                            }}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <textarea
                        value={exp.description}
                        placeholder="Experience details..."
                        rows={2}
                        onChange={(e) => {
                          const copy = [...parsedData.experience];
                          copy[idx].description = e.target.value;
                          handleParsedFieldChange("experience", copy);
                        }}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Education List */}
              <div className="mt-8">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-500" />
                  Education Details
                </label>
                <div className="space-y-4">
                  {parsedData.education.map((edu, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl grid sm:grid-cols-3 gap-4 relative group">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = parsedData.education.filter((_, i) => i !== idx);
                          handleParsedFieldChange("education", updated);
                        }}
                        className="absolute right-2 top-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div>
                        <input
                          type="text"
                          value={edu.school}
                          placeholder="University / School"
                          onChange={(e) => {
                            const copy = [...parsedData.education];
                            copy[idx].school = e.target.value;
                            handleParsedFieldChange("education", copy);
                          }}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={edu.degree}
                          placeholder="Degree / Specialization"
                          onChange={(e) => {
                            const copy = [...parsedData.education];
                            copy[idx].degree = e.target.value;
                            handleParsedFieldChange("education", copy);
                          }}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={edu.year || ""}
                          placeholder="Graduation Year"
                          onChange={(e) => {
                            const copy = [...parsedData.education];
                            copy[idx].year = e.target.value;
                            handleParsedFieldChange("education", copy);
                          }}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Roast mode picker */}
            <div className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-md backdrop-blur-md">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
                <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                Select Your Roast Style
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {modesInfo.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all duration-300 group cursor-pointer ${
                      selectedMode === mode.id 
                        ? "border-purple-500 dark:border-purple-500 shadow-lg shadow-purple-500/15 scale-[1.02] bg-purple-500/10" 
                        : "border-slate-200 dark:border-white/10 hover:scale-[1.01] bg-white/40 dark:bg-white/2"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {mode.icon}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-3 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {mode.label}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-normal flex-1">
                      {mode.desc}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-semibold text-sm cursor-pointer transition-colors"
                >
                  Start Over (Upload New File)
                </button>
                <button
                  onClick={executeRoast}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:scale-[1.02] active:scale-[0.98] text-white font-bold text-lg flex items-center gap-2 shadow-lg hover:shadow-purple-500/25 transition-all cursor-pointer"
                >
                  {error && error.startsWith("AI Analysis Error:") ? "Retry Roast 🔥" : "Apply High Temperature Roast"}
                  <Flame className="w-5 h-5 animate-pulse" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: THE ROAST LOADING STATE */}
        {step === "roasting" && (
          <motion.div
            key="roasting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl max-w-2xl mx-auto px-6 text-center overflow-hidden relative backdrop-blur-md"
          >
            {/* Ambient pulsing lights */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />

            <div className="relative">
              {/* Custom Animated Roaster Flame Logo */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center mb-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.15, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2.2, 
                    ease: "easeInOut" 
                  }}
                  className="absolute w-24 h-24 bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-500 rounded-full blur-xl opacity-60"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.08, 0.95, 1.05, 1],
                    y: [0, -4, 2, -2, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.8, 
                    ease: "easeInOut" 
                  }}
                  className="relative z-10 p-5 rounded-full bg-slate-950 border border-purple-500/40 text-orange-500 shadow-inner"
                >
                  <Flame className="w-14 h-14 text-orange-500 fill-orange-500 filter drop-shadow-[0_4px_10px_rgba(249,115,22,0.4)]" />
                </motion.div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Applying Heat to Resume Content...
              </h2>
              
              {/* Dynamic Status Text */}
              <p className="mt-3 text-purple-600 dark:text-purple-400 font-semibold text-sm sm:text-base animate-pulse tracking-wide font-mono">
                {roastingStatus}
              </p>

              <div className="mt-8 max-w-sm mx-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-500 leading-normal">
                🔥 <strong className="text-slate-700 dark:text-slate-300">Did you know?</strong> Our Savage and Brutal modes have a high rate of making candidates question their career choices. Take deep breaths.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
