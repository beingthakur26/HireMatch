import React from "react";
import { 
  FileUp, 
  Cpu, 
  Target, 
  Send, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  MousePointer2,
  Check
} from "lucide-react";
import { motion } from "motion/react";

export function HowItWorksPage() {
  const steps = [
    {
      icon: <FileUp className="w-8 h-8 text-blue-600" />,
      title: "Upload Resume",
      description: "Simply drop your PDF resume. Our AI instantly extracts your skills, experience, and domain expertise with 99% accuracy.",
      color: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: <Cpu className="w-8 h-8 text-indigo-600" />,
      title: "AI Analysis",
      description: "Our engine performs a multi-vector match against thousands of live job listings to find roles that actually fit your profile.",
      color: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      icon: <Target className="w-8 h-8 text-emerald-600" />,
      title: "Get Matched",
      description: "See a 0-100% match score for every job. Know exactly which skills you have and which ones are missing for each role.",
      color: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      icon: <Send className="w-8 h-8 text-orange-600" />,
      title: "Apply with AI",
      description: "Use our Apply with AI tool to generate a unique, data-driven cover letter for every application. Review and send in seconds.",
      color: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="py-24 px-6 sm:px-12 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">Pure Efficiency</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-6"
          >
            How it <span className="text-blue-600">Actually</span> Works
          </motion.h2>
          <p className="text-slate-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Traditional job hunting is broken. We use artificial intelligence to automate the grunt work and focus on what matters.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-px bg-slate-100 dark:bg-zinc-800 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-28 h-28 rounded-[2.5rem] ${step.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-all duration-500 border border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-900/50`}>
                  {step.icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-xs font-black text-slate-400 mb-6 group-hover:text-blue-600 group-hover:border-blue-600 transition-colors">
                  0{index + 1}
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Highlight */}
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-4xl font-black tracking-tight leading-tight">
                Stop guessing. <br />
                <span className="text-blue-600">Start Knowing.</span>
              </h3>
              <p className="text-lg text-slate-500 dark:text-zinc-400 leading-relaxed">
                Our match engine doesn't just look for keyword matches. It understands semantic relationships between your experience and what recruiters are actually looking for.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800">
                <ShieldCheck className="w-6 h-6 text-blue-600 mb-4" />
                <h4 className="font-bold text-sm mb-2">Verified Data</h4>
                <p className="text-xs text-slate-500">All job listings are verified in real-time from top boards.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800">
                <MousePointer2 className="w-6 h-6 text-blue-600 mb-4" />
                <h4 className="font-bold text-sm mb-2">One-Click Apply</h4>
                <p className="text-xs text-slate-500">Automate your outreach without losing the personal touch.</p>
              </div>
            </div>

            <button className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs hover:translate-x-2 transition-all group">
              Explore Enterprise Solutions <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square bg-blue-600/5 rounded-full absolute inset-0 blur-3xl" />
            <div className="relative bg-white dark:bg-zinc-900 rounded-[3rem] p-4 shadow-2xl border border-slate-200 dark:border-zinc-800 rotate-2">
               <div className="bg-slate-50 dark:bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-zinc-800">
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">HM</div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Analysis Result</p>
                          <p className="font-bold">Match Confidence</p>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full border-4 border-blue-600 flex items-center justify-center font-black text-xs">94%</div>
                    </div>
                    <div className="space-y-2">
                       <div className="h-2 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '94%' }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-blue-600" 
                          />
                       </div>
                       <p className="text-[10px] text-right font-bold text-blue-600">Strong Match</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                       <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Key Similarities</p>
                       <ul className="space-y-3">
                          {['React Architecture', 'Cloud Deployment', 'Team Management'].map(skill => (
                            <li key={skill} className="flex items-center gap-2 text-sm">
                               <Check className="w-4 h-4 text-emerald-500" />
                               {skill}
                            </li>
                          ))}
                       </ul>
                    </div>
                  </div>
               </div>
            </div>
            {/* Floating Element */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-8 p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-slate-100 dark:border-zinc-700 z-20"
            >
               <Sparkles className="w-6 h-6 text-yellow-500 mb-2" />
               <p className="text-xs font-black">AI Tip:</p>
               <p className="text-[10px] text-slate-500">Highlight your 'AWS' skills to score 100%!</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
