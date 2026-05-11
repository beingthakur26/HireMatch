import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  Send, 
  Bot, 
  User as UserIcon, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Trophy,
  MessageSquare,
  Zap,
  ArrowRight,
  TrendingUp,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Job, ParsedResume } from "../types";
import { geminiService } from "../services/geminiService";

interface MockInterviewRoomProps {
  job: Job | null;
  resume: ParsedResume | null;
  pastInterviews: any[];
  onComplete: (debrief: any) => void;
  onExit: () => void;
  onSpendCredits: (amount: number, reason: string) => Promise<boolean>;
  creditsBalance: number;
}

export function MockInterviewRoom({ job, resume, pastInterviews, onComplete, onExit, onSpendCredits, creditsBalance }: MockInterviewRoomProps) {
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [debrief, setDebrief] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const startInterview = async () => {
    if (!resume || !job) return;
    
    if (creditsBalance < 5) {
      alert("You need 5 credits to start a mock interview.");
      return;
    }

    setIsLoading(true);
    try {
      const success = await onSpendCredits(5, `Mock Interview: ${job.title} at ${job.company}`);
      if (!success) {
        alert("Transaction failed.");
        return;
      }

      const firstQuestion = await geminiService.startInterview(resume, job);
      setMessages([{ role: "model", text: firstQuestion }]);
      setIsInterviewStarted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !resume || !job || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.text }]
      }));
      
      // Add the current user message to history
      history.push({ role: "user", parts: [{ text: userMessage }] });

      const nextResponse = await geminiService.continueInterview(resume, job, history);
      
      if (nextResponse.includes("INTERVIEW_OVER")) {
        const cleanText = nextResponse.replace("INTERVIEW_OVER", "").trim();
        setMessages(prev => [...prev, { role: "model", text: cleanText }]);
        finishInterview([...messages, { role: "user", text: userMessage }, { role: "model", text: cleanText }]);
      } else {
        setMessages(prev => [...prev, { role: "model", text: nextResponse }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const finishInterview = async (fullHistory: any[]) => {
    setIsFinished(true);
    setIsLoading(true);
    try {
      const evaluation = await geminiService.evaluateInterview(fullHistory);
      setDebrief(evaluation);
      onComplete(evaluation);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInterviewStarted) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl p-10 border border-slate-200 dark:border-zinc-800 shadow-xl"
        >
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-8">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-4">Start Your Interview Practice</h2>
          <p className="text-slate-500 dark:text-zinc-400 mb-8 leading-relaxed">
            Our AI interviewer will conduct a session tailored for the <strong>{job?.title}</strong> role at <strong>{job?.company}</strong>. 
            You'll receive a detailed performance debrief at the end.
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex gap-4 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
               <Zap className="w-5 h-5 text-amber-500 shrink-0" />
               <div className="text-sm">
                  <p className="font-bold">Real-time Coaching</p>
                  <p className="text-slate-500">Industry-specific questions based on your background.</p>
               </div>
            </div>
            <div className="flex gap-4 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800">
               <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
               <div className="text-sm">
                  <p className="font-bold">Score Guarantee</p>
                  <p className="text-slate-500">Improve your confidence by seeing exactly where you excel.</p>
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button 
              onClick={onExit}
              className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={startInterview}
              disabled={isLoading}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? "Preparing Room..." : "Begin Practice (5 pts)"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {pastInterviews.length > 0 && (
            <div className="mt-12 pt-12 border-t border-slate-100 dark:border-zinc-800">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <History className="w-3.5 h-3.5" /> Past Performances
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastInterviews.map((session) => (
                  <div key={session.id} className="p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold">{session.role}</p>
                      <p className="text-[10px] text-slate-400">{session.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-blue-600">{session.debrief.overallScore}%</p>
                      <p className="text-[9px] text-slate-400">{new Date(session.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-4">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-t-[3rem] border-x border-t border-slate-100 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Interviewer AI</p>
              <h3 className="font-bold">Active Session</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                Live Recording
             </div>
             <button 
               onClick={onExit}
               className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"
               title="End session"
             >
               <AlertCircle className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-slate-900 text-white" : "bg-blue-100 text-blue-600"}`}>
                  {msg.role === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] px-6 py-4 rounded-3xl text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-slate-900 text-white rounded-tr-none" 
                    : "bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 rounded-tl-none border border-slate-100 dark:border-zinc-700"
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 dark:bg-zinc-800 px-6 py-4 rounded-3xl rounded-tl-none border border-slate-100 dark:border-zinc-700">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-8 border-t border-slate-50 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky bottom-0">
          {!isFinished ? (
            <form onSubmit={handleSend} className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input 
                  autoFocus
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  placeholder="Type your response..."
                  className="w-full pl-6 pr-12 py-5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 rounded-2xl focus:ring-2 ring-blue-500/20 outline-none transition-all placeholder:text-slate-400"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <h3 className="text-lg font-bold mb-4">Interview Concluded</h3>
               {!debrief ? (
                 <div className="flex items-center justify-center gap-3 text-blue-600">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span className="font-bold text-sm uppercase tracking-widest">Compiling AI Evaluation...</span>
                 </div>
               ) : (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="space-y-6"
                 >
                    <div className="flex items-center justify-center gap-8 mb-8">
                       <div className="text-center">
                          <p className="text-5xl font-black text-blue-600">{debrief.overallScore}%</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Overall Score</p>
                       </div>
                       <div className="w-px h-12 bg-slate-200 dark:bg-zinc-800" />
                       <div className="text-center text-emerald-600">
                          <Trophy className="w-8 h-8 mx-auto mb-1" />
                          <p className="text-xs font-bold uppercase tracking-widest">{debrief.verdict}</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                       <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/20">
                          <h4 className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-4">
                             <CheckCircle2 className="w-4 h-4" /> Key Strengths
                          </h4>
                          <ul className="space-y-2">
                             {debrief.strengths.map((s: string, i: number) => (
                               <li key={i} className="text-xs text-emerald-700 dark:text-emerald-300 flex gap-2">
                                  <span className="shrink-0">•</span> {s}
                               </li>
                             ))}
                          </ul>
                       </div>
                       <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/20">
                          <h4 className="flex items-center gap-2 text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-4">
                             <TrendingUp className="w-4 h-4" /> Improvement Areas
                          </h4>
                          <ul className="space-y-2">
                             {debrief.weaknesses.map((w: string, i: number) => (
                               <li key={i} className="text-xs text-amber-700 dark:text-amber-300 flex gap-2">
                                  <span className="shrink-0">•</span> {w}
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>

                    <button 
                      onClick={onExit}
                      className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-widest"
                    >
                      Return to Dashboard
                    </button>
                 </motion.div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
