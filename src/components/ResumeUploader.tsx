import React, { useCallback, useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { jobApi } from "../services/api";
import { geminiService } from "../services/geminiService";
import { ParsedResume } from "../types";

interface ResumeUploaderProps {
  onUploadComplete: (resume: ParsedResume) => void;
}

export function ResumeUploader({ onUploadComplete }: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setStatus("Extracting text from PDF...");

    try {
      // 1. Extract text via backend
      const rawText = await jobApi.extractResumeText(file);
      
      setStatus("Analyzing resume with AI...");
      // 2. Parse text via Gemini
      const parsed = await geminiService.parseResume(rawText);
      
      onUploadComplete(parsed);
      setStatus("Complete!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <label 
        className={`
          relative flex flex-col items-center justify-center w-full h-64 
          border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-200 ease-in-out
          ${isUploading ? 'bg-slate-50 border-blue-400' : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'}
          dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-blue-500/50
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-8 text-center">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 mb-4 text-blue-600 animate-spin" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {status}
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4 border border-slate-200 dark:border-zinc-700">
                <Upload className="w-6 h-6 text-slate-400" />
              </div>
              <p className="mb-1 text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                Import Professional Document
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                PDF Standards Only • Max 5MB • Optimized for ATS
              </p>
            </>
          )}
        </div>
        <input 
          id="dropzone-file" 
          type="file" 
          className="hidden" 
          accept=".pdf" 
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </label>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-l-red-500 rounded-r-lg flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-0.5">System Error</p>
            <p className="text-xs text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      {status === "Complete!" && !error && (
        <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-l-emerald-500 rounded-r-lg flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-0.5">Verification Successful</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              Profile generated. Aggregating matching opportunities...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
