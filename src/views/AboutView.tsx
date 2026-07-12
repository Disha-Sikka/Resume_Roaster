import React from "react";
import { Sparkles, Trophy, Cpu, Heart, ShieldCheck } from "lucide-react";

export default function AboutView() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative font-sans leading-relaxed">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
          Our Manifesto
        </span>
        <h1 className="text-3.5xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight leading-tight">
          Behind the Roaster.
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm sm:text-base">
          Why we chose tough corporate love over generic AI platitudes to get you hired.
        </p>
      </div>

      <div className="space-y-12 text-slate-600 dark:text-slate-300">
        {/* Story */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            The Backstory
          </h2>
          <p className="text-sm">
            We've all been there. You spend months drafting the "perfect" resume. You send it to 100 job listings, and what do you get? Crickets. Silence. Maybe a generic, cold rejection template that starts with <em>"We were highly impressed by your credentials, but..."</em>. 
          </p>
          <p className="text-sm">
            That polite corporate silence is a silent killer of careers. It leaves you with zero data on what went wrong. Did they hate your font? Were you missing SQL keywords? Did your bullet points lack quantifiable impact?
          </p>
          <p className="text-sm">
            We built <strong>Resume Roaster AI</strong> because we believe in <strong>radical transparency paired with humor</strong>. By using Google Gemini's advanced models configured with customized recruiting personalities, we transform tedious, technical review recommendations into an unforgettable and engaging experience.
          </p>
        </section>

        {/* Ethical pledges */}
        <section className="grid sm:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-md mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Rigorous Security Pledges
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We strictly respect your document's privacy. We do not store, distribute, sell, or index your personal details or contact data. Documents are analyzed in temporary memory and completely cleared.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-md mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-500" />
              Advanced Language Logic
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our system runs on high-efficiency deep logic models, ensuring that every sarcasm output is directly tied to structural issues, buzzword counts, spelling errors, and layout formatting rules.
            </p>
          </div>
        </section>

        {/* Closing Note */}
        <div className="text-center py-10">
          <p className="text-sm italic text-slate-500">
            "Your resume is a marketing pamphlet. Treat it like a product, mock its bugs, fix them, and ship it."
          </p>
          <div className="flex justify-center items-center gap-1.5 mt-3 text-rose-500 font-bold text-xs">
            Made with <Heart className="w-4 h-4 fill-current text-rose-500" /> by Career Architects.
          </div>
        </div>
      </div>
    </div>
  );
}
