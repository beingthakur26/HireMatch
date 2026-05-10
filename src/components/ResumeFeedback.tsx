import React from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  BarChart3, 
  Zap,
  Briefcase,
  GraduationCap,
  Calendar,
  Building
} from "lucide-react";
import { ParsedResume } from "../types";

interface ResumeFeedbackProps {
  resume: ParsedResume;
}

export function ResumeFeedback({ resume }: ResumeFeedbackProps) {
  const metadata = resume.parsingMetadata;

  if (!metadata) return null;

  return (
    <div id="resume-feedback" className="space-y-8 mt-8">
      {/* Warnings Section */}
      {metadata.warnings.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400 p-4 rounded-r-xl">
          <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 font-bold" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Parsing Observations</h3>
          </div>
          <ul className="space-y-1 ml-7">
            {metadata.warnings.map((warning, i) => (
              <li key={i} className="text-xs text-amber-700 dark:text-amber-300 font-medium list-disc">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section Quality Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metadata.sectionsQuality.map((quality, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{quality.section}</h4>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      quality.score > 80 ? 'bg-emerald-500' : quality.score > 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${quality.score}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{quality.score}%</span>
              </div>
            </div>
            
            {quality.missingInfo.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-400 font-bold uppercase">Missing/Ambiguous Data:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quality.missingInfo.map((info, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800 text-[10px] text-zinc-500 border border-zinc-200 dark:border-zinc-700 rounded-full font-medium">
                      {info}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase">
                <CheckCircle2 className="w-3 h-3" />
                Optimal Data Density
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Extraction Preview */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Zap className="w-3 h-3 text-blue-500" />
          Refined Extraction Preview
        </h3>

        {/* Experience Extraction */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
            <Briefcase className="w-4 h-4 text-blue-500" />
            WORK EXPERIENCE DATA
          </div>
          <div className="grid gap-3">
            {resume.experience.map((exp, i) => (
              <div key={i} className="group bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{exp.company}</span>
                    <span className="text-xs text-zinc-400">—</span>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{exp.role}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2 py-1 rounded text-[10px] font-bold text-blue-600 border border-zinc-200 dark:border-zinc-700">
                    <Calendar className="w-3 h-3" />
                    {exp.startDate || "N/A"} - {exp.endDate || "N/A"}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.slice(0, 5).map((tech, idx) => (
                    <span key={idx} className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                      #{tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Extraction */}
        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
            <GraduationCap className="w-4 h-4 text-emerald-500" />
            ACADEMIC INSTITUTIONS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resume.education.map((edu, i) => (
              <div key={i} className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">{edu.institution}</div>
                <div className="text-[10px] text-zinc-500 font-medium">
                  {edu.degree} in {edu.field} • Class of {edu.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
          HireMatch AI has normalized your data points for industry-standard compatibility. 
          If any critical information like <span className="font-bold underline">Dates</span> or <span className="font-bold underline">Institutions</span> appear incorrect, we recommend polishing the layout of your original PDF document.
        </p>
      </div>
    </div>
  );
}
