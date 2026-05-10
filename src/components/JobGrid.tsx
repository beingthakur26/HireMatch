import React from "react";
import { JobCard } from "./JobCard";
import { Job } from "../types";
import { Loader2, SearchX } from "lucide-react";

interface JobGridProps {
  jobs: Job[];
  isLoading: boolean;
  onSaveJob?: (job: Job) => void;
  onSelectJob?: (job: Job) => void;
  savedJobIds?: string[];
}

export function JobGrid({ jobs, isLoading, onSaveJob, onSelectJob, savedJobIds = [] }: JobGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Hunting for the best matches...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-full mb-4">
          <SearchX className="w-10 h-10 text-zinc-300" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No jobs found</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
          Try adjusting your search filters or upload a resume for personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          isSaved={savedJobIds.includes(job.id || "")}
          onSave={onSaveJob} 
          onSelect={onSelectJob}
        />
      ))}
    </div>
  );
}
