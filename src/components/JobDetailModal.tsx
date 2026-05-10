import React, { useState } from "react";
import { 
  X, 
  MapPin, 
  Briefcase, 
  Clock, 
  Building2, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Bookmark,
  Zap,
  FileText,
  TrendingUp,
  Loader2,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Job, ParsedResume } from "../types";
import { timeAgo } from "../lib/utils";
import { geminiService } from "../services/geminiService";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface JobDetailModalProps {
  job: Job | null;
  resume: ParsedResume | null;
  userSkills?: string[];
  isOpen: boolean;
  isSaved?: boolean;
  onSave?: (job: Job) => void;
  onClose: () => void;
}

export function JobDetailModal({ job, resume, userSkills = [], isOpen, isSaved, onSave, onClose }: JobDetailModalProps) {
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [improvements, setImprovements] = useState<any>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  if (!job) return null;

  const scoreColor = job.matchScore 
    ? job.matchScore >= 80 ? "emerald" 
    : job.matchScore >= 60 ? "blue" 
    : "slate"
    : "slate";

  const isMatch = (skill: string) => {
    return userSkills.some(s => s.toLowerCase() === skill.toLowerCase());
  };

  const handleGenerateCoverLetter = async () => {
    if (!resume) return;
    setIsLoadingAI(true);
    try {
      const letter = await geminiService.generateCoverLetter(resume, job);
      setCoverLetter(letter);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleGetImprovements = async () => {
    if (!resume) return;
    setIsLoadingAI(true);
    try {
      const data = await geminiService.getResumeImprovements(resume, job);
      setImprovements(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: job.sourceUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(job.sourceUrl);
      alert("Link copied to clipboard!");
    }
  };

  // Mock Radar Data for Visuals
  const radarData = [
    { subject: 'Frontend', A: 80, fullMark: 100 },
    { subject: 'Backend', A: 65, fullMark: 100 },
    { subject: 'Database', A: 70, fullMark: 100 },
    { subject: 'DevOps', A: 40, fullMark: 100 },
    { subject: 'AI/ML', A: 50, fullMark: 100 },
    { subject: 'Soft Skills', A: 90, fullMark: 100 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] cursor-pointer"
          />

          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 pointer-events-auto flex flex-col"
            >
              {/* Sticky Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-start shrink-0">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-zinc-700 shrink-0">
                    <Building2 className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.company}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{job.locationType || "Verified"}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight leading-tight">
                      {job.title}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {resume && (
                    <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      <ShieldCheck className="w-3 h-3" />
                      Optimized Profile Found
                    </div>
                  )}
                  <button 
                    onClick={handleShare}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-slate-400 group"
                    title="Share job"
                  >
                    <Share2 className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                  </button>
                  <button 
                    onClick={() => job && onSave?.(job)}
                    className={`p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group ${isSaved ? 'text-blue-600' : 'text-slate-400'}`}
                    title={isSaved ? "Unsave job" : "Save job"}
                  >
                    <Bookmark className={`w-5 h-5 group-hover:text-blue-500 transition-colors ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-slate-400"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Sidebar stats */}
                  <div className="space-y-8">
                    {job.matchScore !== undefined && (
                      <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-6">
                          <Sparkles className={`w-4 h-4 ${scoreColor === 'emerald' ? 'text-emerald-500' : 'text-blue-500'}`} />
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Skill Gap Analysis</span>
                        </div>
                        
                        <div className="h-48 w-full mb-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                              <Radar
                                name="You"
                                dataKey="A"
                                stroke="#2563eb"
                                fill="#2563eb"
                                fillOpacity={0.3}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="flex items-baseline gap-1 justify-center">
                          <span className={`text-5xl font-light tracking-tighter ${scoreColor === 'emerald' ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {job.matchScore}%
                          </span>
                        </div>
                        <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest mt-2">ATS Compatibility</p>
                      </div>
                    )}

                    <div className="space-y-6">
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Logistics</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{job.location || "Remote"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{job.jobType || "Full-time"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{timeAgo(job.postedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">AI Tools</h3>
                      <div className="grid grid-cols-1 gap-2">
                        <button 
                          onClick={handleGenerateCoverLetter}
                          disabled={isLoadingAI || !resume}
                          className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                        >
                          <FileText className="w-4 h-4 text-blue-500" />
                          {isLoadingAI ? "Processing..." : "Generate Letter"}
                        </button>
                        <button 
                          onClick={handleGetImprovements}
                          disabled={isLoadingAI || !resume}
                          className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                        >
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          {isLoadingAI ? "Processing..." : "ATS Improvement"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="lg:col-span-2 space-y-10">
                    {/* Skills Breakdown */}
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Target Skills</h3>
                        <div className="flex flex-wrap gap-2.5">
                          {job.requiredSkills.map(skill => {
                            const matched = isMatch(skill);
                            return (
                              <div 
                                key={skill}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all
                                  ${matched 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-105' 
                                    : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300'}`}
                              >
                                {matched ? (
                                  <ShieldCheck className="w-4 h-4 text-white" />
                                ) : (
                                  <Zap className="w-3.5 h-3.5 text-slate-300" />
                                )}
                                <span className="text-xs font-bold tracking-tight">{skill}</span>
                                {matched && (
                                  <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-[8px] uppercase font-black rounded-md">Matched</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Conditionally reveal AI results */}
                    {(coverLetter || improvements) && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        {coverLetter && (
                          <div className="bg-blue-50/50 rounded-xl p-8 border border-blue-100">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-widest">AI Cover Letter</h3>
                              <button onClick={() => setCoverLetter(null)} className="text-blue-400 hover:text-blue-600"><X className="w-4 h-4" /></button>
                            </div>
                            <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap font-medium">
                              {coverLetter}
                            </p>
                          </div>
                        )}

                        {improvements && (
                          <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl p-8 border border-emerald-100 dark:border-emerald-900/30">
                            <div className="flex items-center justify-between mb-8">
                              <div>
                                <h3 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100 uppercase tracking-widest mb-1">ATS Optimization Report</h3>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-tighter italic">Personalized strategy by HireMatch AI</p>
                              </div>
                              <button onClick={() => setImprovements(null)} className="text-emerald-400 hover:text-emerald-600"><X className="w-5 h-5" /></button>
                            </div>
                            
                            <div className="space-y-10">
                              {/* Tailored Summary */}
                              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900/20 shadow-sm">
                                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <Sparkles className="w-3 h-3" />
                                  Optimized Career Summary
                                </p>
                                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium italic">
                                  "{improvements.tailoredSummary}"
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                  <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-wider mb-4">Strategic Suggestions</p>
                                  <ul className="space-y-4">
                                    {improvements.suggestions.map((s: any, i: number) => (
                                      <li key={i} className="group flex gap-4 text-xs">
                                        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                                          s.impact === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 
                                          s.impact === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                                          'bg-blue-50 text-blue-600 border border-blue-100'
                                        }`}>
                                          {s.impact[0]}
                                        </div>
                                        <div>
                                          <span className="font-bold text-zinc-800 dark:text-zinc-100 block mb-1 group-hover:text-emerald-600 transition-colors">{s.section}</span>
                                          <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-1.5">{s.suggestion}</p>
                                          <p className="text-[10px] text-zinc-400 italic">Why: {s.reasoning}</p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-wider mb-4">Missing Keywords</p>
                                  <div className="flex flex-wrap gap-2">
                                    {improvements.atsKeywords.map((k: string) => (
                                      <span key={k} className="group px-3 py-1.5 bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-emerald-900/30 rounded-lg text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase hover:bg-emerald-50 dark:hover:bg-emerald-500/10 cursor-default transition-all">
                                        + {k}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="mt-6 p-4 bg-emerald-50/50 dark:bg-emerald-900/5 rounded-lg border border-emerald-100 dark:border-emerald-900/10">
                                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                                      <span className="font-bold">Pro Tip:</span> Naturally weave these keywords into your skills and bullet points to increase your ATS match score.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Job Description</h3>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                        {job.description || "Refer to the source portal for full details."}
                      </p>
                    </div>

                    {job.matchReasons && job.matchReasons.length > 0 && (
                      <div>
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Why you're a fit</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {job.matchReasons.map(reason => (
                            <div key={reason} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] font-semibold text-slate-700">
                              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                              {reason}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-8 border-t border-slate-100 bg-slate-50 shrink-0">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium italic">"Opportunities don't happen, you create them."</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform: {job.source}</span>
                    </div>
                  </div>
                  <a 
                    href={job.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-12 py-4 bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-widest text-[11px] rounded shadow-xl transition-all flex items-center justify-center gap-3"
                  >
                    Proceed to Application
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
