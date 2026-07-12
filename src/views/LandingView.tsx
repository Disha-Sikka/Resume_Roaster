import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Flame, Sparkles, Trophy, Cpu, ShieldCheck, 
  HelpCircle, ArrowRight, Star, Heart, CheckCircle2,
  Skull, Zap, RefreshCw
} from "lucide-react";
import { useState } from "react";

interface LandingViewProps {
  onNavigate: (view: string) => void;
  onLoadDemo: () => void;
}

export default function LandingView({ onNavigate, onLoadDemo }: LandingViewProps) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Buzzword Decimator State
  const [decimatedWords, setDecimatedWords] = useState<string[]>([]);
  const [lastQuip, setLastQuip] = useState<string>("");

  const buzzwords = [
    { term: "Synergy Coordinator", quip: "🎯 'I sat in 4 meetings daily to discuss scheduling another meeting to talk about work.'" },
    { term: "Self-Starter", quip: "🏃‍♂️ 'I don't wait for instructions because I don't read standard documentation anyway.'" },
    { term: "Team Player", quip: "🤝 'I read the group chat, post reaction emojis, and successfully avoid merging any code.'" },
    { term: "Result-Oriented", quip: "📈 'I actively work for exactly 15 minutes when my manager asks for an update.'" },
    { term: "Out of the Box Thinker", quip: "📦 'I refuse to follow standard, working procedures because they require reading.'" },
    { term: "Detail-Oriented Expert", quip: "🔍 'I find minor styling typos in others' PRs but regularly break production db queries.'" },
  ];

  const handleDecimate = (term: string, quip: string) => {
    if (!decimatedWords.includes(term)) {
      setDecimatedWords(prev => [...prev, term]);
      setLastQuip(quip);
    }
  };

  const resetBuzzwords = () => {
    setDecimatedWords([]);
    setLastQuip("");
  };

  // Sarcastic Translator State
  const [selectedTranslateId, setSelectedTranslateId] = useState<number>(0);

  const translations = [
    {
      realReason: "I am lazy and just want to get paid",
      corporateSpeak: "Seeking a high-leverage opportunity to maximize operational efficiencies through delegation and cross-functional coordination.",
      recruiterReality: "Seeking to do the absolute minimum required to avoid being fired while browsing Reddit on my second screen."
    },
    {
      realReason: "I got fired for arguing with my previous boss",
      corporateSpeak: "Seeking a dynamic, progressive culture that champions constructive intellectual alignment and independent critical feedback.",
      recruiterReality: "I have a massive ego and spent 3 hours in Slack arguing about why we should rewrite a stable system in a new framework."
    },
    {
      realReason: "I have no idea what I'm doing in React",
      corporateSpeak: "A highly adaptive framework generalist capable of immediate, self-guided upskilling in high-velocity tech stacks.",
      recruiterReality: "I copy-paste from StackOverflow and spend 90% of my day fighting CSS alignment issues while praying it builds."
    },
    {
      realReason: "I just need to pay my rent",
      corporateSpeak: "Deeply aligned with your company's core values, growth flywheel, and global mission to revolutionize modern workflow metrics.",
      recruiterReality: "I don't know or care what your enterprise SaaS B2B tool does, but my landlord is breathing down my neck."
    }
  ];

  // Runaway "I'm Nervous" button state
  const [nervousOffset, setNervousOffset] = useState({ x: 0, y: 0 });
  const [hasNervousHovered, setHasNervousHovered] = useState(false);

  const handleNervousHover = () => {
    if (!hasNervousHovered) {
      // Calculate random runaway offset (moves away by 80px - 140px in a random quadrant)
      const angles = [45, 135, 225, 315, 60, 150, 240, 330];
      const randomAngle = angles[Math.floor(Math.random() * angles.length)] * (Math.PI / 180);
      const distance = 110;
      setNervousOffset({
        x: Math.round(Math.cos(randomAngle) * distance),
        y: Math.round(Math.sin(randomAngle) * distance)
      });
      setHasNervousHovered(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const features = [
    {
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      title: "Custom AI Roast Modes",
      desc: "Get roasted by a friendly teaser, a savage recruiter, a mechanical ATS system, or a passive-aggressive corporate HR drone."
    },
    {
      icon: <Trophy className="w-6 h-6 text-purple-500" />,
      title: "Real ATS Check",
      desc: "Audit your formatting, word choice, and structural choices. Score your ATS readiness with rigorous numerical checklists."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-pink-500" />,
      title: "Actionable Fixes",
      desc: "Every burn is paired with professional, highly specific advice. We don't just laugh at your mistakes, we tell you how to fix them."
    },
    {
      icon: <Cpu className="w-6 h-6 text-blue-500" />,
      title: "Suggested Summaries",
      desc: "Receive beautifully written, highly compelling professional summaries and skills list suggestions customized for you."
    }
  ];

  const testimonials = [
    {
      quote: "It roasted my experience so hard I questioned my career. But then I applied the improvements and landed an interview at a Tier 1 tech company in two weeks.",
      name: "Alex Rivera",
      role: "Software Engineer",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
    },
    {
      quote: "I've reviewed thousands of resumes, and this AI hits the nail on the head. The passive-aggressive HR mode was so real I got goosebumps.",
      name: "Sarah Chen",
      role: "Senior Recruiter",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    {
      quote: "The ATS mode called my layout 'a digital crime scene'. Replaced my 3-column resume with their suggestion, and my response rate went up by 300%.",
      name: "Marcus Brody",
      role: "Product Manager",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus"
    }
  ];

  const faqs = [
    {
      q: "Is my resume private and secure?",
      a: "Absolutely. We do not store your uploaded documents on any permanent server. They are parsed on the client side or fully in-memory, passed to Gemini API for immediate analysis, and discarded. Your history is stored entirely in your own browser's local storage."
    },
    {
      q: "Why are the roasts so mean?",
      a: "Tough love works! A boring, polite recruiter will just silently click 'Reject' and you'll never know why. Our AI roaster points out your resume errors with hilarious exaggeration so you actually remember to fix them."
    },
    {
      q: "What file formats do you support?",
      a: "We support PDF, DOCX, and plain text (.txt) files up to 10MB. We parse the text directly to examine keywords, metrics, grammar, and layout parsability."
    },
    {
      q: "Can I use this for free?",
      a: "Yes! Our Free tier includes 3 full roasts in Friendly or Savage modes, along with basic score metrics. If you want Savage/Brutal access and unlimited history, check out our affordable Pro tier!"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Immersive Desk Assets & Background Elements */}
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Coffee Stain Overlay */}
      <div className="absolute top-[28%] left-[4%] md:left-[8%] w-32 h-32 rounded-full border-4 border-amber-800/10 dark:border-amber-500/5 rotate-[24deg] pointer-events-none scale-110 z-0 hidden sm:block">
        <div className="absolute inset-1.5 rounded-full border-2 border-amber-800/5 dark:border-amber-500/3" />
        <div className="absolute top-3 left-8 w-16 h-5 bg-amber-800/[0.03] dark:bg-amber-500/[0.01] blur-md rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 max-w-7xl mx-auto text-center z-10">
        
        {/* Floating Sticky Notes - Left Side */}
        <div className="hidden lg:block absolute left-4 top-[24%] rotate-[-6deg] bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/50 p-4 rounded-sm shadow-md max-w-[170px] text-left text-xs font-mono select-none">
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-10 h-3.5 bg-white/40 dark:bg-white/20 backdrop-blur-sm rotate-[1deg] border border-white/5" />
          <span className="text-red-500 font-bold block mb-1">✍️ REVIEW NOTES:</span>
          "Delete entire experience section. Pls do not say 'synergy' ever again."
        </div>

        {/* Floating Sticky Notes - Right Side */}
        <div className="hidden lg:block absolute right-4 top-[32%] rotate-[8deg] bg-pink-100 dark:bg-pink-950/40 text-pink-900 dark:text-pink-200 border border-pink-200/50 p-4 rounded-sm shadow-md max-w-[175px] text-left text-xs font-mono select-none">
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-10 h-3.5 bg-white/40 dark:bg-white/20 backdrop-blur-sm rotate-[-2deg] border border-white/5" />
          <span className="text-pink-600 dark:text-pink-400 font-bold block mb-1">🚨 CRITICAL FAILURE:</span>
          "Formatting is so bad our parser requested an emotional support program."
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-bold tracking-wider text-red-500 uppercase">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse fill-orange-500" />
            No Filters. Just Raw Fire.
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white leading-none relative"
        >
          Your Resume Called.<br className="hidden sm:inline" />
          <span className="relative inline-block mt-2">
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              It Wants Therapy.
            </span>
            {/* Scribble underline */}
            <span className="absolute bottom-[-6px] left-0 right-0 h-[4px] bg-rose-500 rounded-full opacity-60 pointer-events-none blur-[0.5px]" />
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-lg sm:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed"
        >
          Upload your resume. We'll roast it harder than HR ever could, then actually help you improve it.
        </motion.p>

        {/* Dynamic CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center relative min-h-[80px]"
        >
          <button
            onClick={() => onNavigate("roaster")}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-2xl bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 text-white font-extrabold text-lg shadow-xl hover:shadow-red-500/25 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer"
          >
            🔥 Roast My Resume
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          {/* Interactive Runaway Nervous Button */}
          <motion.button
            animate={{ x: nervousOffset.x, y: nervousOffset.y }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            onMouseEnter={handleNervousHover}
            onClick={onLoadDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-bold text-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors duration-300 cursor-pointer select-none"
          >
            😬 I'm Nervous
          </motion.button>
        </motion.div>


        {/* Floating elements showcasing scores */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 md:p-8 max-w-4xl mx-auto shadow-2xl overflow-hidden backdrop-blur-md"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 border-r border-slate-200 dark:border-white/10 last:border-0">
              <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Emotional Damage</div>
            </div>
            <div className="p-4 sm:border-r border-slate-200 dark:border-white/10 last:border-0">
              <div className="text-3xl font-extrabold text-pink-600 dark:text-pink-400">85%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Interviews Increased</div>
            </div>
            <div className="p-4 border-r border-slate-200 dark:border-white/10 last:border-0">
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">0g</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Sugarcoating</div>
            </div>
            <div className="p-4 last:border-0">
              <div className="text-3xl font-extrabold text-orange-500">5</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Roast Styles</div>
            </div>
          </div>
        </motion.div>

        {/* INTERACTIVE GAMES CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto text-left relative z-20"
        >
          {/* GAME 1: BUZZWORD DECIMATOR */}
          <div className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-3xl shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                  <Flame className="w-5 h-5 fill-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Resume Buzzword Decimator</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Click on typical fluff words below to vaporize them from existence and read their translation into plain human speak.
              </p>

              {/* Buzzwords grid */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                {buzzwords.map((bw) => {
                  const isDecimated = decimatedWords.includes(bw.term);
                  return (
                    <button
                      key={bw.term}
                      onClick={() => handleDecimate(bw.term, bw.quip)}
                      disabled={isDecimated}
                      className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 select-none overflow-hidden ${
                        isDecimated
                          ? "bg-red-500/10 border border-red-500/20 text-red-500/50 line-through cursor-not-allowed scale-95"
                          : "bg-slate-100/80 dark:bg-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 border border-transparent dark:text-slate-300 cursor-pointer hover:scale-105 active:scale-95"
                      }`}
                    >
                      {isDecimated ? <Skull className="w-3.5 h-3.5 animate-pulse" /> : <Zap className="w-3.5 h-3.5 text-yellow-500" />}
                      {bw.term}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quip Display Area */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#090514] border border-slate-100 dark:border-white/5 min-h-[100px] flex flex-col justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                {lastQuip ? (
                  <motion.div
                    key={lastQuip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 leading-relaxed font-mono">
                      {lastQuip}
                    </p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-slate-400 dark:text-slate-500 italic text-center"
                  >
                    💡 Click a buzzword above to trigger high-intensity heat.
                  </motion.p>
                )}
              </AnimatePresence>

              {decimatedWords.length > 0 && (
                <button
                  onClick={resetBuzzwords}
                  className="absolute bottom-2 right-2 text-[10px] font-bold text-slate-400 hover:text-purple-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 animate-spin-once" />
                  Restore Clichés
                </button>
              )}
            </div>
          </div>

          {/* GAME 2: CORPORATE TRANSLATOR */}
          <div className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-3xl shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                  <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Corporate Speak Translator</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Choose what you actually meant to write on your resume to see the corporate translation vs. what recruiters really see.
              </p>

              {/* Translation buttons */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {translations.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTranslateId(idx)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all border leading-tight flex flex-col justify-between ${
                      selectedTranslateId === idx
                        ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400 shadow-sm"
                        : "border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-650 dark:text-slate-350 cursor-pointer"
                    }`}
                  >
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1 block">Reason #{idx+1}</span>
                    <span className="line-clamp-2 italic">"{t.realReason}"</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Output Cards */}
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Your Polished Resume Speak
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                  "{translations[selectedTranslateId].corporateSpeak}"
                </p>
              </div>

              <div className="p-3 bg-rose-500/5 dark:bg-rose-500/5 border border-rose-500/20 rounded-xl">
                <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Skull className="w-3.5 h-3.5 text-rose-500" />
                  What the Recruiter Hears
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium italic">
                  "{translations[selectedTranslateId].recruiterReality}"
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 max-w-7xl mx-auto border-t border-slate-200/50 dark:border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white">
            Comprehensive Analysis disguised as Sarcastic Roast
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            We use advanced natural language processing powered by Google Gemini to dissect your profile and format, translating deep resume feedback into an entertaining experience.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-6 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:shadow-xl dark:hover:shadow-purple-500/10 transition-all group duration-300 backdrop-blur-sm"
            >
              <div className="p-3 w-fit rounded-xl bg-slate-100 dark:bg-white/5 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {feat.title}
              </h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20 bg-slate-50/20 dark:bg-[#0a0512]/30 border-y border-slate-200/50 dark:border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white">
              What survivors say about us
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Thousands of candidates have put their careers under the roaster flame. Here are their confessions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-sm relative overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                    "{test.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{test.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-950 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Got questions? We've got sarcastic (but helpful) answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-white/40 dark:bg-white/5 backdrop-blur-sm"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <span>{faq.q}</span>
                <HelpCircle className={`w-5 h-5 text-purple-500 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen === i && (
                <div className="px-6 pb-5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-white/10 pt-4 bg-slate-50/50 dark:bg-black/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-20 max-w-7xl mx-auto text-center relative">
        <div className="p-8 md:p-16 rounded-3xl bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white overflow-hidden relative border border-purple-500/20 shadow-2xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to face the flame? Stop sending boring resumes.
          </h2>
          <p className="mt-4 text-purple-200 max-w-lg mx-auto text-sm md:text-base font-sans">
            It takes exactly 15 seconds to reveal every hidden flaw holding you back from high-paying interviews.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onNavigate("roaster")}
              className="px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-purple-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              Roast My Resume Now
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
