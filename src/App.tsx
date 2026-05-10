/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  LayoutDashboard, 
  FileUser, 
  History, 
  Settings,
  Bell,
  Menu,
  X,
  PlusCircle,
  Filter,
  Bookmark
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Job, ParsedResume } from "./types";
import { jobApi } from "./services/api";
import { geminiService } from "./services/geminiService";
import { ResumeUploader } from "./components/ResumeUploader";
import { JobGrid } from "./components/JobGrid";
import { JobDetailModal } from "./components/JobDetailModal";

export default function App() {
  const [activeTab, setActiveTab] = useState("discovery");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [resume, setResume] = useState<ParsedResume | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const toggleSaveJob = (job: Job) => {
    setSavedJobs(prev => {
      const isSaved = prev.some(j => j.id === job.id);
      if (isSaved) {
        return prev.filter(j => j.id !== job.id);
      } else {
        return [...prev, job];
      }
    });
  };

  const handleResumeUpload = async (parsed: ParsedResume) => {
    setResume(parsed);
    setActiveTab("discovery");
    // Initial search based on resume
    fetchJobs(parsed.inferredDomain || parsed.skills[0] || "Software Engineer", "");
  };

  const fetchJobs = async (query: string, loc: string) => {
    setLoading(true);
    try {
      let results = await jobApi.searchJobs(query, loc);
      
      // If resume exists, score them
      if (resume && results.length > 0) {
        const scoredResults = await Promise.all(
          results.slice(0, 6).map(async (job) => {
            const scoreData = await geminiService.scoreJobMatch(resume, job);
            return { ...job, ...scoreData };
          })
        );
        // Combine with remaining unscored results
        results = [...scoredResults, ...results.slice(6)];
        results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      }

      setJobs(results);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial placeholder jobs
    fetchJobs("Software Engineer Intern", "Remote");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(searchQuery, location);
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] dark:bg-zinc-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col z-20"
          >
            <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Briefcase className="text-white w-4 h-4" />
                </div>
                <span className="font-bold tracking-tight text-slate-800 dark:text-zinc-100">
                  HireMatch AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Discovery Dashboard</p>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-3 mt-2">
              <div className="px-3 mb-1">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</h3>
              </div>
              <NavItem 
                icon={<LayoutDashboard className="w-4 h-4" />} 
                label="Job Discovery" 
                active={activeTab === "discovery"} 
                onClick={() => setActiveTab("discovery")}
              />
              <NavItem 
                icon={<FileUser className="w-4 h-4" />} 
                label="My Resume" 
                active={activeTab === "resume"} 
                onClick={() => setActiveTab("resume")}
              />
              <NavItem 
                icon={<History className="w-4 h-4" />} 
                label="Tracking" 
                active={activeTab === "tracker"} 
                onClick={() => setActiveTab("tracker")}
              />
              <NavItem 
                icon={<Bookmark className="w-4 h-4" />} 
                label="Saved Jobs" 
                active={activeTab === "saved"} 
                onClick={() => setActiveTab("saved")}
              />
            </nav>

            <div className="p-6 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-slate-600">
                  MA
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">Manas Singh</p>
                  <p className="text-[10px] text-slate-500 uppercase">Pro Member</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-bottom border-slate-200 dark:border-zinc-800 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-md transition-colors"
            >
              {isSidebarOpen ? <X className="w-4 h-4 text-slate-500" /> : <Menu className="w-4 h-4 text-slate-500" />}
            </button>
            <div className="flex items-center gap-3 text-sm font-medium">
              <span className="text-slate-400">HireMatch AI</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700 dark:text-zinc-200">
                {activeTab === "discovery" ? "Discovery" : activeTab === "resume" ? "Resume" : activeTab === "saved" ? "Saved" : "Applications"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="pro-badge bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">System Ready</span>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors">
              Refresh Jobs
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {activeTab === "resume" ? (
            <section className="max-w-4xl mx-auto py-6">
              <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mb-2">
                  Talent Profile
                </h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm">
                  Strategic analysis and optimization of your professional documents.
                </p>
              </header>
              
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
                <ResumeUploader onUploadComplete={handleResumeUpload} />
              </div>

              {resume && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 bg-white dark:bg-zinc-900 rounded-xl p-8 border border-slate-200 dark:border-zinc-800 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100 dark:border-zinc-800">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-1">{resume.name}</h2>
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest">{resume.inferredDomain} • {resume.inferredSeniority}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Match Potential</p>
                      <p className="text-3xl font-light text-blue-600">Expert</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2">
                       <h3 className="text-[11px] font-bold text-slate-400 uppercase mb-4 tracking-wider">Professional Profile</h3>
                       <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                        "{resume.summary}"
                      </p>
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase mb-4 tracking-wider">Core Capabilities</h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.map(skill => (
                          <span key={skill} className="px-2.5 py-1 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded text-xs font-semibold border border-slate-200/60 dark:border-zinc-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </section>
          ) : activeTab === "saved" ? (
            <div className="max-w-7xl mx-auto space-y-8">
              <header>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Saved Opportunities
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Personal shortlist of roles you're interested in.
                </p>
              </header>

              <JobGrid 
                jobs={savedJobs} 
                isLoading={false} 
                savedJobIds={savedJobs.map(j => j.id || "")}
                onSaveJob={toggleSaveJob}
                onSelectJob={(job) => {
                  setSelectedJob(job);
                  setIsModalOpen(true);
                }}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Search Bar */}
              <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-stretch gap-2 transition-all focus-within:ring-2 ring-blue-500/20">
                <div className="flex-1 flex items-center px-4 gap-3">
                  <Search className="w-5 h-5 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder={resume ? `Searching for ${resume.inferredDomain} roles...` : "Search by role or title..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-zinc-900 dark:text-zinc-100 py-3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block my-2" />
                <div className="flex-1 flex items-center px-4 gap-3">
                  <MapPin className="w-5 h-5 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Location (e.g. Remote, India)"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-zinc-900 dark:text-zinc-100 py-3"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Find Jobs
                </button>
              </div>

              {/* Filters & Results Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Results for you
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {jobs.length} relevant opportunities found recently
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Job Grid */}
              <JobGrid 
                jobs={jobs} 
                isLoading={isLoading} 
                savedJobIds={savedJobs.map(j => j.id || "")}
                onSaveJob={toggleSaveJob}
                onSelectJob={(job) => {
                  setSelectedJob(job);
                  setIsModalOpen(true);
                }}
              />
            </div>
          )}
        </div>
      </main>

      <JobDetailModal 
        job={selectedJob} 
        resume={resume}
        isOpen={isModalOpen} 
        isSaved={selectedJob ? savedJobs.some(j => j.id === selectedJob.id) : false}
        onSave={() => selectedJob && toggleSaveJob(selectedJob)}
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex flex-col gap-1 px-4 py-3 border-l-4 transition-all text-left
        ${active 
          ? 'bg-blue-50/50 border-blue-600 dark:bg-blue-900/10' 
          : 'bg-white dark:bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-zinc-800'}`}
    >
      <span className={`text-[10px] font-bold uppercase tracking-widest 
        ${active ? 'text-blue-700' : 'text-slate-400'}`}>
        {active ? 'Current' : 'Selection'}
      </span>
      <div className="flex items-center gap-2">
        <span className={active ? 'text-blue-600' : 'text-slate-400'}>
          {icon}
        </span>
        <span className={`font-semibold text-sm ${active ? 'text-slate-800 dark:text-zinc-100' : 'text-slate-500 dark:text-zinc-400'}`}>
          {label}
        </span>
      </div>
    </button>
  );
}
