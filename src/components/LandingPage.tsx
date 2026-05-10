import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  Github, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ArrowRight,
  UserPlus,
  LogIn,
  Twitter,
  Linkedin,
  Mail,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PricingPage } from "./PricingPage";
import { HowItWorksPage } from "./HowItWorksPage";
import { AboutPage } from "./AboutPage";
import { ContactPage } from "./ContactPage";
import { PrivacyPage, TermsPage } from "./LegalPages";

interface LandingPageProps {
  onLogin: () => void;
}

type View = "home" | "features" | "how-it-works" | "pricing" | "about" | "contact" | "privacy" | "terms";

export function LandingPage({ onLogin }: LandingPageProps) {
  const [email, setEmail] = useState("");
  const [currentView, setCurrentView] = useState<View>("home");

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-zinc-800/50 px-6 sm:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Briefcase className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">HireMatch AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <button 
            onClick={() => navigateTo("home")} 
            className={`text-sm font-semibold transition-colors ${currentView === "home" ? "text-blue-600" : "text-slate-500 hover:text-blue-600"}`}
          >
            Home
          </button>
          <button 
            onClick={() => navigateTo("how-it-works")} 
            className={`text-sm font-semibold transition-colors ${currentView === "how-it-works" ? "text-blue-600" : "text-slate-500 hover:text-blue-600"}`}
          >
            How it works
          </button>
          <button 
            onClick={() => navigateTo("pricing")} 
            className={`text-sm font-semibold transition-colors ${currentView === "pricing" ? "text-blue-600" : "text-slate-500 hover:text-blue-600"}`}
          >
            Pricing
          </button>
          <button 
            onClick={() => navigateTo("about")} 
            className={`text-sm font-semibold transition-colors ${currentView === "about" ? "text-blue-600" : "text-slate-500 hover:text-blue-600"}`}
          >
            About
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-500 transition-all"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
          <button 
            onClick={onLogin}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {currentView === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero Section */}
            <section className="pt-40 pb-24 px-6 sm:px-12 relative overflow-hidden">
              <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px] pointer-events-none" />

              <div className="max-w-7xl mx-auto text-center">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col items-center"
                >
                  <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mb-8">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">The Future of Job Hunting is here</span>
                  </motion.div>

                  <motion.h1 variants={item} className="text-5xl md:text-7xl font-black text-slate-900 dark:text-zinc-50 tracking-tighter leading-[1.05] mb-8 max-w-4xl">
                    Get hired with <span className="text-blue-600">AI precision</span>. 
                    Not just luck.
                  </motion.h1>

                  <motion.p variants={item} className="text-lg md:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl mb-12 leading-relaxed">
                    HireMatch AI parses your resume, matches you with perfect roles, 
                    and generates tailored cover letters that actually get you noticed.
                  </motion.p>

                  <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                    <div className="relative w-full">
                      <input 
                        type="email" 
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-900 dark:text-zinc-100 focus:ring-2 ring-blue-500/20 outline-none transition-all shadow-sm"
                      />
                    </div>
                    <button 
                      onClick={onLogin}
                      className="w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      Join Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>

                  <motion.div variants={item} className="mt-16 flex items-center gap-8 grayscale opacity-50">
                    <div className="flex items-center gap-2 font-bold text-sm tracking-tight"><Github className="w-5 h-5" /> GitHub</div>
                    <div className="flex items-center gap-2 font-bold text-sm tracking-tight italic">Stripe</div>
                    <div className="flex items-center gap-2 font-bold text-sm tracking-tight">OpenAI</div>
                    <div className="flex items-center gap-2 font-bold text-sm tracking-tight opacity-50">Discord</div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white dark:bg-zinc-950 px-6 sm:px-12 border-y border-slate-100 dark:border-zinc-900">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <FeatureCard 
                    icon={<ShieldCheck className="w-6 h-6 text-blue-600" />}
                    title="AI Resume Matching"
                    description="Our advanced algorithms analyze your skills and experience to find the absolute best fit for your career trajectory."
                  />
                  <FeatureCard 
                    icon={<Zap className="w-6 h-6 text-blue-600" />}
                    title="Instant Tailoring"
                    description="One click to generate cover letters and resume enhancements specifically designed for a particular job description."
                  />
                  <FeatureCard 
                    icon={<Globe className="w-6 h-6 text-blue-600" />}
                    title="Real-time Tracking"
                    description="Keep track of all your applications in one centralized, beautiful dashboard. Never lose sight of an opportunity."
                  />
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 sm:px-12 overflow-hidden">
              <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-24 text-center relative">
                <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles className="w-32 h-32 text-white" /></div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Ready to skyrocket your career?</h2>
                  <p className="text-blue-100 text-lg mb-12 max-w-xl mx-auto">Join 50,000+ engineers using AI to automate the boring parts of job searching.</p>
                  <button 
                    onClick={onLogin}
                    className="px-12 py-5 bg-white text-blue-600 hover:bg-slate-50 font-black uppercase tracking-widest text-xs rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95"
                  >
                    Start for Free
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {currentView === "how-it-works" && (
          <motion.div key="how-it-works" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-20">
            <HowItWorksPage />
          </motion.div>
        )}

        {currentView === "pricing" && (
          <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-20">
            <PricingPage onPlanSelect={onLogin} />
          </motion.div>
        )}

        {currentView === "about" && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-20">
            <AboutPage />
          </motion.div>
        )}

        {currentView === "contact" && (
          <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-20">
            <ContactPage />
          </motion.div>
        )}

        {currentView === "privacy" && (
          <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-20">
            <PrivacyPage />
          </motion.div>
        )}

        {currentView === "terms" && (
          <motion.div key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-20">
            <TermsPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 text-slate-400 px-6 sm:px-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Briefcase className="text-white w-4 h-4" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">HireMatch AI</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Automating the future of job hunting. Get matched, get hired, get ahead.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Github className="w-4 h-4" /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => navigateTo("how-it-works")} className="hover:text-blue-500 transition-colors">How it works</button></li>
                <li><button onClick={() => navigateTo("pricing")} className="hover:text-blue-500 transition-colors">Pricing</button></li>
                <li><button className="hover:text-blue-500 transition-colors">Features</button></li>
                <li><button className="hover:text-blue-500 transition-colors">Changelog</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => navigateTo("about")} className="hover:text-blue-500 transition-colors">About Us</button></li>
                <li><button onClick={() => navigateTo("contact")} className="hover:text-blue-500 transition-colors">Contact</button></li>
                <li><button className="flex items-center gap-1 hover:text-blue-500 transition-colors">Careers <ArrowUpRight className="w-3 h-3" /></button></li>
                <li><button className="hover:text-blue-500 transition-colors">Blog</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => navigateTo("privacy")} className="hover:text-blue-500 transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => navigateTo("terms")} className="hover:text-blue-500 transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-blue-500 transition-colors">Cookie Policy</button></li>
                <li><button className="hover:text-blue-500 transition-colors">Security</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs uppercase font-black tracking-[0.2em]">© 2026 HireMatch AI Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] uppercase font-bold tracking-widest">System Status: All Systems Operational</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-3xl border border-slate-100 dark:border-zinc-900 hover:border-blue-200 dark:hover:border-blue-900/50 bg-slate-50/50 dark:bg-zinc-900/30 transition-all hover:shadow-2xl shadow-blue-500/5">
      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-zinc-800">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-500 dark:text-zinc-400 leading-relaxed text-sm">
        {description}
      </p>
      <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
        Learn more <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}
