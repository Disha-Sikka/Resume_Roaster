import { motion } from "motion/react";
import { 
  FileText, Flame, Sparkles, Trophy, Cpu, ShieldCheck, 
  HelpCircle, ArrowRight, Star, Heart, CheckCircle2 
} from "lucide-react";
import { useState } from "react";

interface LandingViewProps {
  onNavigate: (view: string) => void;
  onLoadDemo: () => void;
}

export default function LandingView({ onNavigate, onLoadDemo }: LandingViewProps) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

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
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold tracking-wider text-purple-400 uppercase">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            AI-Powered Career Correction
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
        >
          Roast Your Resume. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Optimize Your Future.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-sans leading-relaxed"
        >
          Upload your resume and let our brilliant AI Roast Engine tear it apart with hilarious, cutting feedback—while secretly providing a rigorous ATS audit and expert suggestions.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => onNavigate("roaster")}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Upload Your Resume
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onLoadDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Try Live Demo
          </button>
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
              <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">100k+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Resumes Burned</div>
            </div>
            <div className="p-4 sm:border-r border-slate-200 dark:border-white/10 last:border-0">
              <div className="text-3xl font-extrabold text-pink-600 dark:text-pink-400">85%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Interviews Increased</div>
            </div>
            <div className="p-4 border-r border-slate-200 dark:border-white/10 last:border-0">
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">4.9/5</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Sass Rating</div>
            </div>
            <div className="p-4 last:border-0">
              <div className="text-3xl font-extrabold text-orange-500">5</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Roast Styles</div>
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
