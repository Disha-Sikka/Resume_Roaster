import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, History, Sparkles, User, LogOut, Sun, Moon, 
  HelpCircle, ShieldCheck, Mail, LogIn, Menu, X, ArrowRight, CheckCircle2 
} from "lucide-react";

import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { HistoryProvider, useHistory } from "./contexts/HistoryContext";
import { RoastHistoryItem, RoastResult, ParsedResume, RoastMode } from "./types";

// Import Views
import LandingView from "./views/LandingView";
import RoasterView from "./views/RoasterView";
import DashboardView from "./views/DashboardView";
import HistoryView from "./views/HistoryView";
import PricingView from "./views/PricingView";
import ContactView from "./views/ContactView";
import AboutView from "./views/AboutView";
import { PrivacyView, TermsView } from "./views/LegalViews";

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, loginWithGoogle, loginWithEmail, enterGuestMode } = useAuth();
  const { saveRoast } = useHistory();

  const [activeView, setActiveView] = useState<string>("landing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Authentication form state
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [loginMethod, setLoginMethod] = useState<"google" | "email">("email");

  // Dashboard state (active roast results)
  const [activeRoast, setActiveRoast] = useState<{
    fileName: string;
    resumeText: string;
    parsedData: ParsedResume;
    mode: RoastMode;
    result: RoastResult;
  } | null>(null);

  // Set default guest session on mount if no session is stored
  useEffect(() => {
    if (!user) {
      enterGuestMode();
    }
  }, [user]);

  // Handle a finished roast event
  const handleRoastCompleted = async (
    fileName: string,
    resumeText: string,
    parsedData: ParsedResume,
    mode: RoastMode,
    result: RoastResult
  ) => {
    // Save to local archive history
    const savedItem = await saveRoast(fileName, resumeText, parsedData, mode, result);
    // Open in active dashboard
    setActiveRoast({
      fileName: savedItem.fileName,
      resumeText: savedItem.resumeText,
      parsedData: savedItem.parsedData,
      mode: savedItem.mode,
      result: savedItem.result,
    });
    setActiveView("dashboard");
  };

  // Click on a history item
  const handleSelectHistoryItem = (item: RoastHistoryItem) => {
    setActiveRoast({
      fileName: item.fileName,
      resumeText: item.resumeText,
      parsedData: item.parsedData,
      mode: item.mode,
      result: item.result,
    });
    setActiveView("dashboard");
  };

  // Launch pre-loaded high-quality demo resume roast
  const handleLoadDemo = async () => {
    const demoParsed: ParsedResume = {
      name: "John Doe",
      email: "john.doe.expert@gmail.com",
      phone: "+1 (555) 019-2834",
      skills: ["Java", "Microsoft Word", "Synergy", "Strategic Planning", "HTML", "Creative Thinking", "Team Player", "Problem Solving"],
      education: [
        { school: "State College of Creative Arts", degree: "Bachelor of Arts in General Studies", year: "2015" }
      ],
      experience: [
        { 
          company: "MegaCorp Industries", 
          role: "Junior Associate Synergy Coordinator", 
          duration: "2021 - Present", 
          description: "Responsible for coordinating multiple daily sync meetings across 4 distinct departments. Crafted strategic presentations to enhance department alignment. Promoted synergy values and ensured teams had high cross-functional communication flows." 
        },
        { 
          company: "Bait & Tackle Shop", 
          role: "Assistant Cashier Manager", 
          duration: "2018 - 2021", 
          description: "Counted physical registers, sorted fishing tackle buckets, and welcomed customers warmly. Successfully handled cash and card transaction procedures." 
        }
      ],
      projects: [
        {
          title: "Personal To-Do List App",
          description: "A simple command-line interface tool created to organize personal tasks.",
          technologies: ["Java"]
        }
      ],
      certifications: ["Expert Microsoft Word Certification"]
    };

    const demoResult: RoastResult = {
      overallScore: 54,
      atsScore: 49,
      grammarScore: 82,
      designScore: 60,
      skillsScore: 45,
      experienceScore: 42,
      roast: "Oh, John. Where do we even start? You've got an 'Expert Microsoft Word Certification' listed as a milestone accomplishment in 2026. What's next, a bronze medal for double-clicking? Your experience at MegaCorp reads like a handbook of generic corporate buzzword bingo—'promoting synergy values' and 'enhancing alignment' is code for 'I sat in Zoom meetings and nodded while holding a coffee mug.' Your BA in General Studies from State Arts further establishes you as a master of not choosing a direction. And let's not overlook your bait shop experience where you 'welcomed customers warmly'—reorganizing fishing hooks is great, but it won't help you bypass a modern ATS parser looking for real engineering impact.",
      mistakes: [
        {
          section: "Header & Certifications",
          issue: "Listed Microsoft Word as an Expert Milestone Certification",
          severity: "critical",
          funnyComment: "Listing MS Word as a certification in 2026 is like bragging that you know how to use a microwave. Recruiters are checking if you can write code, not if you can type a letter in double spacing.",
          fix: "Remove MS Word from certifications. Use that space for modern frameworks, system design, cloud credentials, or actual development platforms."
        },
        {
          section: "Work Experience",
          issue: "Zero metrics or quantifiable results in role descriptions",
          severity: "high",
          funnyComment: "You 'coordinated multiple daily sync meetings.' Wow, fascinating. Did any of those meetings save money, ship code, or actually do anything besides waste aggregate company hours?",
          fix: "Add quantifiable results using the X-Y-Z formula. For example: 'Coordinated daily standups for 12 engineers, reducing code release friction and cutting delivery timelines by 15%.'"
        },
        {
          section: "Skills",
          issue: "Overuse of fluffy soft skills like 'Team Player' and 'Problem Solving'",
          severity: "medium",
          funnyComment: "Listing 'Team Player' is like saying you are a 'Breather of Oxygen'. It's a baseline requirement, not a technical capability worth ink on paper.",
          fix: "Replace soft skills with hard technical toolings (databases, languages, libraries) and demonstrate your soft skills directly through metric-driven achievements."
        }
      ],
      improvements: [
        {
          section: "Summary & Branding",
          suggestion: "Ditch the buzzword-heavy profile header. Establish yourself as a focused engineering specialist with clear language competencies.",
          impact: "Increases ATS keyword matching rates by 70% and makes your resume instantly legible to recruiters in 6 seconds."
        },
        {
          section: "Experience Section",
          suggestion: "Rewrite every single bullet point to lead with strong action verbs (e.g. 'Engineered', 'Optimized', 'Reduced') instead of passive statements like 'Responsible for'.",
          impact: "Dramatically enhances read-quality scores and shows corporate impact rather than a simple duty list."
        }
      ],
      summarySuggestion: "Results-driven Software Associate with hands-on experience building structured console solutions in Java. Proven background designing efficient data pipelines and coordinating cross-functional team delivery schedules to streamline agile release timelines.",
      suggestedSkills: ["Java", "Git/Version Control", "SQL", "Agile Methodologies", "Object-Oriented Design", "Command Line Tools"],
      keywordsMissing: ["SQL Databases", "Git Workflow", "REST APIs", "Unit Testing", "Continuous Integration", "CI/CD"],
      interviewReadiness: "You're ready to interview for a role coordinating bait boxes at the tackle shop. For a serious software role, your resume needs to demonstrate actual technical complexity, database management, and hard engineering metrics first.",
      finalVerdict: "Verdict: 54/100. High risk of immediate ATS filtration. Apply recommended hard-skill updates immediately to escape the recruiter's trash can."
    };

    setActiveRoast({
      fileName: "John_Doe_Synergy_Resume.pdf",
      resumeText: "John Doe ... Synergy ... Microsoft Word ... General Studies",
      parsedData: demoParsed,
      mode: "savage",
      result: demoResult
    });
    setActiveView("dashboard");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    
    if (loginMethod === "google") {
      await loginWithGoogle(emailInput, nameInput || "Google User");
    } else {
      await loginWithEmail(emailInput, nameInput);
    }
    setShowLoginModal(false);
    setEmailInput("");
    setNameInput("");
  };

  // Render subview based on current state
  const renderView = () => {
    switch (activeView) {
      case "roaster":
        return <RoasterView onRoastCompleted={handleRoastCompleted} />;
      case "dashboard":
        return activeRoast ? (
          <DashboardView
            fileName={activeRoast.fileName}
            parsedResume={activeRoast.parsedData}
            mode={activeRoast.mode}
            result={activeRoast.result}
            onBackToUpload={() => setActiveView("roaster")}
          />
        ) : (
          <LandingView onNavigate={setActiveView} onLoadDemo={handleLoadDemo} />
        );
      case "history":
        return <HistoryView onSelectHistoryItem={handleSelectHistoryItem} />;
      case "pricing":
        return <PricingView />;
      case "contact":
        return <ContactView />;
      case "about":
        return <AboutView />;
      case "privacy":
        return <PrivacyView />;
      case "terms":
        return <TermsView />;
      default:
        return <LandingView onNavigate={setActiveView} onLoadDemo={handleLoadDemo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050208] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between relative overflow-hidden">
      
      {/* Immersive Background Glow Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/15 blur-[120px] pointer-events-none hidden dark:block" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-blue-900/12 blur-[100px] pointer-events-none hidden dark:block" />
      
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#050208]/50 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex justify-between items-center">
          
          {/* Logo */}
          <div 
            onClick={() => { setActiveView("landing"); setActiveRoast(null); }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-extrabold tracking-tight text-lg sm:text-xl bg-gradient-to-r from-slate-900 via-purple-900 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-400 bg-clip-text text-transparent">
              Resume Roaster AI
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-350">
            <button onClick={() => setActiveView("landing")} className={`hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer ${activeView === "landing" ? "text-purple-600 dark:text-purple-400 font-bold" : ""}`}>Home</button>
            <button onClick={() => setActiveView("roaster")} className={`hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer ${activeView === "roaster" ? "text-purple-600 dark:hover:text-purple-400 font-bold" : ""}`}>Roast Me</button>
            <button onClick={() => setActiveView("history")} className={`hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer ${activeView === "history" ? "text-purple-600 dark:hover:text-purple-400 font-bold" : ""}`}>History</button>
            <button onClick={() => setActiveView("pricing")} className={`hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer ${activeView === "pricing" ? "text-purple-600 dark:hover:text-purple-400 font-bold" : ""}`}>Pricing</button>
            <button onClick={() => setActiveView("about")} className={`hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer ${activeView === "about" ? "text-purple-600 dark:hover:text-purple-400 font-bold" : ""}`}>About</button>
            <button onClick={() => setActiveView("contact")} className={`hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer ${activeView === "contact" ? "text-purple-600 dark:hover:text-purple-400 font-bold" : ""}`}>Contact</button>
          </nav>


          {/* Right Header Panel Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-500 dark:text-slate-400 cursor-pointer"
              title={theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Profile Dropdown or Login Button */}
            {user ? (
              <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 pl-2.5 bg-slate-50 dark:bg-slate-900 shadow-sm">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-850 dark:text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 leading-none mt-0.5">{user.isGuest ? "Guest Mode" : user.email}</p>
                </div>
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-full border border-purple-500/30"
                />
                <button
                  onClick={() => { logout(); enterGuestMode(); }}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden font-semibold text-slate-600 dark:text-slate-400"
            >
              <div className="p-4 flex flex-col gap-4 text-sm">
                <button onClick={() => { setActiveView("landing"); setMobileMenuOpen(false); }} className="text-left py-1">Home</button>
                <button onClick={() => { setActiveView("roaster"); setMobileMenuOpen(false); }} className="text-left py-1">Roast Me</button>
                <button onClick={() => { setActiveView("history"); setMobileMenuOpen(false); }} className="text-left py-1">History</button>
                <button onClick={() => { setActiveView("pricing"); setMobileMenuOpen(false); }} className="text-left py-1">Pricing</button>
                <button onClick={() => { setActiveView("about"); setMobileMenuOpen(false); }} className="text-left py-1">About</button>
                <button onClick={() => { setActiveView("contact"); setMobileMenuOpen(false); }} className="text-left py-1">Contact</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CORE VIEW SECTION */}
      <main className="flex-1 bg-transparent relative z-10">
        {renderView()}
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="bg-white/40 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-xs py-10 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Flame className="w-4 h-4 text-purple-600" />
              Resume Roaster AI
            </div>
            <p className="text-[11px] leading-relaxed">
              Google Gemini powered AI audit platform deconstructing career path templates with savage humor and professional precision.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs tracking-wider uppercase">Platform</h4>
            <ul className="space-y-1.5 flex flex-col">
              <li><button onClick={() => setActiveView("roaster")} className="hover:text-purple-600 text-left">Upload Resume</button></li>
              <li><button onClick={handleLoadDemo} className="hover:text-purple-600 text-left">Try Live Demo</button></li>
              <li><button onClick={() => setActiveView("pricing")} className="hover:text-purple-600 text-left">Pricing Packages</button></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs tracking-wider uppercase">Manifesto</h4>
            <ul className="space-y-1.5 flex flex-col">
              <li><button onClick={() => setActiveView("about")} className="hover:text-purple-600 text-left">Why We Roast</button></li>
              <li><button onClick={() => setActiveView("contact")} className="hover:text-purple-600 text-left">Contact & Dispute</button></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs tracking-wider uppercase">Legal & Ethic</h4>
            <ul className="space-y-1.5 flex flex-col">
              <li><button onClick={() => setActiveView("privacy")} className="hover:text-purple-600 text-left">Privacy Policy</button></li>
              <li><button onClick={() => setActiveView("terms")} className="hover:text-purple-600 text-left">Terms of Service</button></li>
              <li className="flex items-center gap-1 text-green-500 font-bold"><ShieldCheck className="w-3.5 h-3.5" /> 100% Secure</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center text-[10px] text-slate-400">
          © {new Date().getFullYear()} Resume Roaster AI. Google Gemini API integration built for high-compatibility production.
        </div>
      </footer>

      {/* SIGN IN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#0d091a]/95 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative backdrop-blur-lg"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">Sign In to Resume Roaster</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Unlock persistent resume archives, premium Brutal and HR roast style modes, and detailed ATS missing keyword lists.
                </p>
              </div>

              {/* Login Method Toggle */}
              <div className="flex border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-lg p-0.5 mb-6 text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setLoginMethod("email")}
                  className={`flex-1 py-1.5 rounded-md ${loginMethod === "email" ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm" : ""}`}
                >
                  Email & Name
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("google")}
                  className={`flex-1 py-1.5 rounded-md ${loginMethod === "google" ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm" : ""}`}
                >
                  Google Account (Simulated)
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginMethod === "email" ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">First / Last Name</label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Select Simulated Google Account</label>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEmailInput("john.doe@gmail.com");
                          setNameInput("John Doe");
                        }}
                        className={`w-full p-3 border rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${emailInput === "john.doe@gmail.com" ? "border-purple-600 bg-purple-500/5 text-purple-600" : "border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-950"}`}
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">John Doe</p>
                          <p className="text-[10px] text-slate-500">john.doe@gmail.com</p>
                        </div>
                        {emailInput === "john.doe@gmail.com" && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmailInput("sara.smith@gmail.com");
                          setNameInput("Sara Smith");
                        }}
                        className={`w-full p-3 border rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${emailInput === "sara.smith@gmail.com" ? "border-purple-600 bg-purple-500/5 text-purple-600" : "border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-950"}`}
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">Sara Smith</p>
                          <p className="text-[10px] text-slate-500">sara.smith@gmail.com</p>
                        </div>
                        {emailInput === "sara.smith@gmail.com" && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!emailInput.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm shadow-md flex justify-center items-center gap-2 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
                >
                  Confirm Sign In
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HistoryProvider>
          <AppContent />
        </HistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
