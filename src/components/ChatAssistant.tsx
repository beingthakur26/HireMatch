import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  Briefcase, 
  User, 
  ArrowRight,
  Bot,
  Search,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { aiAssistantService, ChatMessage } from "../services/aiAssistantService";
import { ParsedResume, UserProfile } from "../types";

interface ChatAssistantProps {
  profile: UserProfile | null;
}

export function ChatAssistant({ profile }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e?: React.FormEvent, customInput?: string) => {
    e?.preventDefault();
    const messageText = customInput || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ text: messageText }]
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customInput) setInput("");
    setIsLoading(true);

    try {
      const responseText = await aiAssistantService.chat([...messages, userMessage], profile);
      const modelMessage: ChatMessage = {
        role: "model",
        parts: [{ text: responseText || "I couldn't generate a response." }]
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleApplyAI = (event: any) => {
      const { job } = event.detail;
      setIsOpen(true);
      const prompt = `I want to apply for the position of "${job.title}" at "${job.company}". 
Based on my resume, can you generate a tailored cover letter for me? 

Here are the job details:
Description: ${job.description || 'Not provided'}
Required Skills: ${job.requiredSkills?.join(', ') || 'Not provided'}

Please write a professional and compelling cover letter that highlights my matching skills and enthusiasm for the role.`;
      
      // Use a timeout to ensure state has settled if needed, or just call handleSend
      setTimeout(() => handleSend(undefined, prompt), 100);
    };

    window.addEventListener("hirematch:apply-ai", handleApplyAI);
    return () => window.removeEventListener("hirematch:apply-ai", handleApplyAI);
  }, [profile, messages, isLoading]); // Include isLoading to avoid concurrent requests

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const quickPrompts = [
    { label: "Find React Jobs", icon: <Search className="w-3 h-3" />, prompt: "Find me some React Developer jobs or internships currently available." },
    { label: "Optimize resume", icon: <Sparkles className="w-3 h-3" />, prompt: "Can you help me optimize my resume for a Software Engineering role? Please tell me what to remove or highlight." },
    { label: "Career advice", icon: <Briefcase className="w-3 h-3" />, prompt: "I need some career advice. What skills should I focus on for 2025?" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">HireMatch AI</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Assistant</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">How can I help you today?</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px] mx-auto">
                      Ask me to find jobs, optimize your resume, or provide career coaching.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pt-4">
                    {quickPrompts.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => handleSend(undefined, p.prompt)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:border-blue-300 dark:hover:border-blue-900/30 transition-all"
                      >
                        {p.icon}
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      m.role === 'user' ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-blue-600'
                    }`}>
                      {m.role === 'user' ? <User className="w-4 h-4 text-zinc-500" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-zinc-900 text-white rounded-tr-none' 
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-100 dark:border-zinc-700'
                    }`}>
                      {m.parts[0].text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl rounded-tl-none border border-zinc-100 dark:border-zinc-700">
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form 
              onSubmit={handleSend}
              className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask HireMatch AI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-zinc-100"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 text-center mt-2 font-medium uppercase tracking-widest">
                Powered by Gemini 3 Flash
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isOpen && (
          <div className="absolute right-16 px-3 py-2 bg-zinc-900 dark:bg-blue-900 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Chat with AI Assistant
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-zinc-900 dark:bg-blue-900 rotate-45" />
          </div>
        )}
      </button>
    </div>
  );
}
