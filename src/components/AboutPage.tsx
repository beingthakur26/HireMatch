import React from "react";
import { Users, Heart, Lightbulb, Target, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function AboutPage() {
  return (
    <div className="py-24 px-6 sm:px-12 bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
            Our Mission: Empower <span className="text-blue-600">Every</span> Career
          </h2>
          <p className="text-xl text-slate-500 dark:text-zinc-400 leading-relaxed">
            We believe that the best talent shouldn't be missed because of a poorly formatted PDF or a complex application system. Our AI bridges the gap between potential and opportunity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold">The Problem</h3>
            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed">
              Recruiters spend an average of 6 seconds looking at a resume. Many great candidates are filtered out by outdated ATS systems before a human even sees them.
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold">Our Solution</h3>
            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed">
              We empower candidates with the same AI tools that recruiters use. We help you understand exactly what a job needs and how to present your unique value.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Target className="w-64 h-64" /></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-8">Guided by Core Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div>
                <p className="text-blue-400 font-black uppercase tracking-widest text-xs mb-3">01 / Transparency</p>
                <p className="text-slate-400 text-sm leading-relaxed">We are open about how our AI works. No hidden bias, just pure data matching.</p>
              </div>
              <div>
                <p className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-3">02 / Empathy</p>
                <p className="text-slate-400 text-sm leading-relaxed">We understand that job hunting is stressful. Our tools are designed to reduce friction.</p>
              </div>
              <div>
                <p className="text-orange-400 font-black uppercase tracking-widest text-xs mb-3">03 / Privacy</p>
                <p className="text-slate-400 text-sm leading-relaxed">Your data belongs to you. We never sell your resume or personal information to third parties.</p>
              </div>
              <div>
                <p className="text-pink-400 font-black uppercase tracking-widest text-xs mb-3">04 / Performance</p>
                <p className="text-slate-400 text-sm leading-relaxed">Every second counts in a job hunt. We build tools that are lightning fast.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
           <h3 className="text-2xl font-bold mb-8">Founded by Engineers, for Everyone.</h3>
           <div className="flex justify-center -space-x-4 mb-12">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-16 h-16 rounded-full border-4 border-white dark:border-zinc-950 bg-slate-200 shadow-xl" />
              ))}
           </div>
           <button className="flex items-center gap-2 mx-auto text-blue-600 font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
              Meet the Team <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
}
