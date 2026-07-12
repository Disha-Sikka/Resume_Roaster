import React from "react";
import { Check, Flame, Sparkles, HelpCircle } from "lucide-react";

export default function PricingView() {
  const plans = [
    {
      name: "Free / Guest",
      price: "$0",
      period: "forever",
      desc: "Perfect for a quick self-esteem check before sending that resume out.",
      features: [
        "3 full resume roasts",
        "Friendly & Savage roast styles",
        "Overall score & basic ATS scan",
        "Temporary session history",
        "Standard processing speed"
      ],
      cta: "Start Free",
      popular: false,
      color: "border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-sm"
    },
    {
      name: "Pro Roaster",
      price: "$9",
      period: "month",
      desc: "For active job seekers who want serious formatting and keyword optimization.",
      features: [
        "Unlimited resume roasts",
        "Access to all 5 styles (including Brutal & HR)",
        "Comprehensive ATS keyword audit",
        "Interactive Resume with Floating Mistakes",
        "Suggested Summaries & Missed Keywords lists",
        "Full export options (MD, JSON)",
        "Permanent archive & searching",
        "Priority processing"
      ],
      cta: "Go Pro 🔥",
      popular: true,
      color: "border-purple-500 bg-slate-950/40 dark:bg-white/10 text-white relative backdrop-blur-sm"
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "month",
      desc: "For universities, bootcamp providers, or recruiting agencies optimizing pools.",
      features: [
        "Everything in Pro plan",
        "Team folders & sharing facilities",
        "Bulk resume uploads & parsing (ZIP)",
        "API access to parse & roast services",
        "Custom branding & white-label reviews",
        "Dedicated account support"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-sm"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
          Fair & Simple Pricing
        </span>
        <h1 className="text-3.5xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4 leading-tight">
          Invest in interviews, not templates.
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Unlock unlimited roasts, brutal style settings, missing ATS keyword lists, and professional career summaries starting at just a single cup of coffee.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-3xl border-2 flex flex-col justify-between shadow-lg transition-all ${
              plan.popular ? "scale-105 shadow-purple-500/10" : ""
            } ${plan.color}`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] uppercase font-extrabold tracking-widest px-4 py-1 rounded-full border border-purple-400/20 shadow-md flex items-center gap-1">
                <Flame className="w-3 h-3" /> Most Popular
              </span>
            )}
            
            <div>
              <h3 className="text-xl font-extrabold">{plan.name}</h3>
              <p className={`text-xs mt-2 ${plan.popular ? "text-slate-300" : "text-slate-500"}`}>
                {plan.desc}
              </p>
              
              <div className="flex items-baseline mt-6 mb-8">
                <span className="text-4xl sm:text-5xl font-black tracking-tight">{plan.price}</span>
                <span className={`text-xs font-bold ml-2 ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>
                  / {plan.period}
                </span>
              </div>

              <div className={`border-t my-6 ${plan.popular ? "border-slate-800" : "border-slate-100 dark:border-slate-800"}`} />

              <ul className="space-y-4 text-sm font-semibold">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-purple-400" : "text-purple-600"}`} />
                    <span className={plan.popular ? "text-slate-200" : "text-slate-600 dark:text-slate-350"}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                className={`w-full py-3.5 rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm ${
                  plan.popular 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
                onClick={() => alert(`Payment systems are disabled in development previews. To upgrade to ${plan.name}, contact our system admin or select Guest Mode!`)}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
