import React from "react";
import { Check, Shield, Zap, Star, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function PricingPage({ onPlanSelect }: { onPlanSelect: () => void }) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for students and early career explorers.",
      features: [
        "Up to 5 AI resume parses",
        "Personalized job matching",
        "Community forum access",
        "Standard support"
      ],
      cta: "Continue Free",
      popular: false,
      color: "blue"
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For serious job seekers looking for a competitive edge.",
      features: [
        "Unlimited resume parses",
        "AI Cover Letter generator",
        "Real-time market insights",
        "Priority Support",
        "Advanced filtering"
      ],
      cta: "Go Pro",
      popular: true,
      color: "blue"
    },
    {
      name: "Elite",
      price: "$49",
      period: "/month",
      description: "Tailored for executives and high-stakes transitions.",
      features: [
        "1-on-1 AI Interview coaching",
        "Multiple resume profiles",
        "Automated application tracking",
        "Direct networking tools",
        "All Pro features"
      ],
      cta: "Get Elite",
      popular: false,
      color: "indigo"
    }
  ];

  return (
    <div className="py-24 px-6 sm:px-12 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-6"
          >
            Simple, <span className="text-blue-600">Transparent</span> Pricing
          </motion.h2>
          <p className="text-slate-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your career goals. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[2rem] border transition-all duration-300 ${
                plan.popular 
                  ? "bg-slate-900 dark:bg-blue-900/10 border-blue-500 shadow-2xl shadow-blue-500/20 scale-105 z-10" 
                  : "bg-slate-50/50 dark:bg-zinc-900/50 border-slate-100 dark:border-zinc-800 hover:border-blue-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg">
                  <Star className="w-3 h-3 fill-white" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-black ${plan.popular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${plan.popular ? "text-slate-400" : "text-slate-500"} leading-relaxed`}>
                  {plan.description}
                </p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.popular ? "bg-blue-600" : "bg-blue-100 dark:bg-blue-900/30"}`}>
                      <Check className={`w-2.5 h-2.5 ${plan.popular ? "text-white" : "text-blue-600"}`} />
                    </div>
                    <span className={`text-sm ${plan.popular ? "text-slate-300" : "text-slate-600 dark:text-zinc-400"}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={onPlanSelect}
                className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.popular 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20" 
                    : "bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-700"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-blue-50 dark:bg-blue-900/10 rounded-[3rem] p-8 md:p-16 border border-blue-100 dark:border-blue-900/30">
          <div>
            <h3 className="text-3xl font-black mb-6 tracking-tight">Need a custom plan for your team?</h3>
            <p className="text-slate-600 dark:text-zinc-400 mb-8 leading-relaxed">
              We offer specialized enterprise rates for educational institutions, bootcamps, and recruitment agencies. Total control over user licenses and bulk features.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-blue-50 dark:border-zinc-900 bg-slate-200" />
                ))}
              </div>
              <p className="text-sm font-bold text-blue-600">Joined by 200+ Organizations</p>
            </div>
          </div>
          <div className="flex justify-start md:justify-end">
            <button className="px-10 py-5 bg-slate-900 dark:bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-full shadow-2xl hover:scale-105 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
