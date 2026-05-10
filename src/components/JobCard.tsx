import React from "react";
import { 
  MapPin, 
  Briefcase, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Building2,
  Bookmark,
  Share2,
  X
} from "lucide-react";
import { Job } from "../types";
import { timeAgo } from "../lib/utils";

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  userSkills?: string[];
  onSave?: (job: Job) => void;
  onSelect?: (job: Job) => void;
  onApplyWithAI?: (job: Job) => void;
  key?: string | number;
}

export function JobCard({ job, isSaved, userSkills = [], onSave, onSelect, onApplyWithAI }: JobCardProps) {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleApplyWithAI = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApplyWithAI) {
      onApplyWithAI(job);
    } else {
      window.dispatchEvent(new CustomEvent("hirematch:apply-ai", { detail: { job } }));
    }
  };

  const scoreColor = job.matchScore 
    ? job.matchScore >= 80 ? "emerald" 
    : job.matchScore >= 60 ? "blue" 
    : "slate"
    : "slate";

  const isMatch = (skill: string) => {
    return userSkills.some(s => s.toLowerCase() === skill.toLowerCase());
  };

  return (
    <div 
      onClick={() => onSelect?.(job)}
      className="group relative bg-white dark:bg-zinc-900 rounded-xl p-6 border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 shadow-sm flex flex-col h-full cursor-pointer"
    >
      {/* AI Apply Quick Action */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleApplyWithAI}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3 h-3" />
          Apply with AI
        </button>
      </div>

      {/* AI Score Badge - Professional Header Style */}
      {job.matchScore !== undefined && (
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
             <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Match Potential</span>
             <div className={`text-xl font-light
               ${scoreColor === 'emerald' ? 'text-emerald-600' : 
                 scoreColor === 'blue' ? 'text-blue-600' : 
                 'text-slate-400'}`}
             >
               {job.matchScore}%
             </div>
          </div>
          <div className={`p-1.5 rounded-md border
            ${scoreColor === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
              scoreColor === 'blue' ? 'bg-blue-50 border-blue-100 text-blue-600' : 
              'bg-slate-50 border-slate-100 text-slate-400'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-base leading-tight mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
        {job.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-zinc-700">
          <Building2 className="w-3 h-3 text-slate-400" />
        </div>
        <span className="text-slate-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wide truncate">
          {job.company}
        </span>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-y-3 mb-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Region</p>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-zinc-300">
            <MapPin className="w-3 h-3 text-slate-300" />
            {job.location}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Type</p>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-zinc-300">
            <Briefcase className="w-3 h-3 text-slate-300" />
            {job.jobType || "Full-time"}
          </div>
        </div>
      </div>

      {/* Skills Tags */}
      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {job.requiredSkills.slice(0, 4).map((skill) => {
            const matched = isMatch(skill);
            return (
              <span 
                key={skill} 
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all border
                  ${matched 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                    : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400'}`}
              >
                {matched && <Sparkles className="inline-block w-2 h-2 mr-1 animate-pulse" />}
                {!matched && <X className="inline-block w-2 h-2 mr-1 opacity-50" />}
                {skill}
              </span>
            );
          })}
          {job.requiredSkills.length > 4 && (
            <span className="text-[10px] text-slate-400 font-bold self-center">+{job.requiredSkills.length - 4} more</span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
          <Clock className="w-3 h-3" />
          {timeAgo(job.postedAt)}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="p-2 rounded bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 hover:text-blue-600 transition-colors"
            title="Share job"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onSave?.(job); }}
            className={`p-2 rounded border transition-colors ${isSaved ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 hover:text-blue-600'}`}
            title={isSaved ? "Unsave job" : "Save job"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <a 
            href={job.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all shadow-sm"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}
