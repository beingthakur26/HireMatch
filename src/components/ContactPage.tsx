import React, { useState } from "react";
import { Mail, MessageSquare, Phone, Globe, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="py-24 px-6 sm:px-12 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
                Get in <span className="text-blue-600">Touch</span>
              </h2>
              <p className="text-xl text-slate-500 dark:text-zinc-400 leading-relaxed max-w-lg">
                Have questions about our enterprise plans, or just want to say hi? Our team is always here to help you navigate your journey.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Email Us</p>
                  <p className="text-lg font-bold">support@hirematch.ai</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Call Us</p>
                  <p className="text-lg font-bold">+1 (555) 000-0000</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Global HQ</p>
                  <p className="text-lg font-bold">Delhi, India</p>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-slate-100 dark:border-zinc-800">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Social Connect</p>
               <div className="flex gap-6">
                  {['Twitter', 'LinkedIn', 'GitHub', 'Medium'].map(platform => (
                    <a key={platform} href="#" className="font-bold hover:text-blue-600 transition-colors">{platform}</a>
                  ))}
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-slate-50/50 dark:bg-zinc-900/30 p-8 md:p-12 rounded-[3.5rem] border border-slate-100 dark:border-zinc-800"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                       <input 
                         required 
                         type="text" 
                         className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-2 ring-blue-500/20 outline-none" 
                         placeholder="John Doe"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                       <input 
                         required 
                         type="email" 
                         className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-2 ring-blue-500/20 outline-none" 
                         placeholder="john@example.com"
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                     <select className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-2 ring-blue-500/20 outline-none">
                        <option>General Inquiry</option>
                        <option>Support Request</option>
                        <option>Enterprise Query</option>
                        <option>Feature Request</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400">Message</label>
                     <textarea 
                       required 
                       rows={5} 
                       className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:ring-2 ring-blue-500/20 outline-none resize-none" 
                       placeholder="How can we help you?"
                     ></textarea>
                  </div>
                  <button className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                    Send Message
                    <Send className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-8">
                    <Check className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                  <p className="text-slate-500 dark:text-zinc-400">We've received your inquiry and will get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-blue-600 font-bold text-sm uppercase tracking-widest"
                  >
                    Send another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
