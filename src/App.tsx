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
  Bookmark,
  Sun,
  Moon,
  LogIn
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { doc, onSnapshot, setDoc, updateDoc, collection, query, serverTimestamp, deleteDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db, loginWithGoogle, logout, OperationType, handleFirestoreError } from "./lib/firebase";
import { Job, ParsedResume, JobAlert, UserProfile } from "./types";
import { jobApi } from "./services/api";
import { geminiService } from "./services/geminiService";
import { ResumeUploader } from "./components/ResumeUploader";
import { JobGrid } from "./components/JobGrid";
import { JobDetailModal } from "./components/JobDetailModal";
import { JobAlerts } from "./components/JobAlerts";
import { ResumeFeedback } from "./components/ResumeFeedback";
import { ChatAssistant } from "./components/ChatAssistant";
import { ProfilePage } from "./components/ProfilePage";
import { LandingPage } from "./components/LandingPage";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discovery");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [profile, setProfile] = useState<UserProfile>({
    name: "User Name",
    title: "",
    email: "",
    phone: "",
    about: "",
    skills: [],
    experience: [],
    education: [],
  });
  
  const [resume, setResume] = useState<ParsedResume | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [alerts, setAlerts] = useState<JobAlert[]>([]);

  // Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Syncing Effect
  useEffect(() => {
    if (!user) {
      setProfile({
        name: "User Name",
        title: "",
        email: "",
        phone: "",
        about: "",
        skills: [],
        experience: [],
        education: [],
      });
      setSavedJobs([]);
      setAlerts([]);
      return;
    }

    const userId = user.uid;

    // Sync Profile
    const profileRef = doc(db, "users", userId);
    const unsubProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        if (data.resume) setResume(data.resume);
      } else {
        // Init profile if new user
        const initialProfile: UserProfile = {
          name: user.displayName || "User Name",
          email: user.email || "",
          userId: userId,
          title: "",
          phone: "",
          about: "",
          skills: [],
          experience: [],
          education: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setDoc(profileRef, initialProfile).catch(e => handleFirestoreError(e, OperationType.CREATE, `users/${userId}`));
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${userId}`));

    // Sync Saved Jobs
    const savedJobsRef = collection(db, "users", userId, "savedJobs");
    const unsubSaved = onSnapshot(savedJobsRef, (snap) => {
      const jobsList = snap.docs.map(d => d.data() as Job);
      setSavedJobs(jobsList);
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/savedJobs`));

    // Sync Alerts
    const alertsRef = collection(db, "users", userId, "jobAlerts");
    const unsubAlerts = onSnapshot(alertsRef, (snap) => {
      const alertsList = snap.docs.map(d => d.data() as JobAlert);
      setAlerts(alertsList);
    }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/jobAlerts`));

    return () => {
      unsubProfile();
      unsubSaved();
      unsubAlerts();
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSaveJob = async (job: Job) => {
    if (!user || !job.id) return;
    const userId = user.uid;
    const jobRef = doc(db, "users", userId, "savedJobs", job.id);
    
    const isSaved = savedJobs.some(j => j.id === job.id);
    try {
      if (isSaved) {
        await deleteDoc(jobRef);
      } else {
        await setDoc(jobRef, { ...job, savedAt: new Date().toISOString() });
      }
    } catch (e) {
      handleFirestoreError(e, isSaved ? OperationType.DELETE : OperationType.CREATE, `users/${userId}/savedJobs/${job.id}`);
    }
  };

  const handleCreateAlert = async (alertData: Omit<JobAlert, "id" | "createdAt" | "isActive">) => {
    if (!user) return;
    try {
      const userId = user.uid;
      const alertId = crypto.randomUUID();
      const alertRef = doc(db, "users", userId, "jobAlerts", alertId);
      const newAlert = {
        ...alertData,
        id: alertId,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      await setDoc(alertRef, newAlert);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/jobAlerts`);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "jobAlerts", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/jobAlerts/${id}`);
    }
  };

  const handleToggleAlert = async (id: string) => {
    if (!user) return;
    const alert = alerts.find(a => a.id === id);
    if (!alert) return;
    try {
      await updateDoc(doc(db, "users", user.uid, "jobAlerts", id), {
        isActive: !alert.isActive
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/jobAlerts/${id}`);
    }
  };

  const handleResumeUpload = async (parsed: ParsedResume) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        resume: parsed,
        updatedAt: new Date().toISOString()
      });
      setActiveTab("discovery");
      fetchJobs(parsed.inferredDomain || parsed.skills[0] || "Software Engineer", "");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const updateProfile = async (newProfile: UserProfile) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...newProfile,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return false;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

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

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-500/20" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing AI Matcher...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} />;
  }

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
                label="My Profile" 
                active={activeTab === "profile"} 
                onClick={() => setActiveTab("profile")}
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
              <NavItem 
                icon={<Bell className="w-4 h-4" />} 
                label="Job Alerts" 
                active={activeTab === "alerts"} 
                onClick={() => setActiveTab("alerts")}
              />
            </nav>

            <div className="p-6 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-600">
                    {profile.profilePicture ? <img src={profile.profilePicture} className="w-full h-full object-cover" /> : "MA"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">{profile.name || "User Name"}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Pro Member</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogIn className="w-4 h-4" />
                </button>
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
                {activeTab === "discovery" ? "Discovery" : activeTab === "profile" ? "Profile" : activeTab === "saved" ? "Saved" : activeTab === "alerts" ? "Alerts" : "Applications"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-md transition-colors text-slate-500"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <span className="pro-badge bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">System Ready</span>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors">
              Refresh Jobs
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {activeTab === "profile" ? (
            <ProfilePage 
              profile={profile} 
              onUpdateProfile={updateProfile} 
              onResumeParsed={handleResumeUpload} 
            />
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
                userSkills={resume?.skills || []}
                onSaveJob={toggleSaveJob}
                onSelectJob={(job) => {
                  setSelectedJob(job);
                  setIsModalOpen(true);
                }}
              />
            </div>
          ) : activeTab === "alerts" ? (
            <div className="max-w-7xl mx-auto">
              <JobAlerts 
                alerts={alerts}
                onCreateAlert={handleCreateAlert}
                onDeleteAlert={handleDeleteAlert}
                onToggleAlert={handleToggleAlert}
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
                userSkills={resume?.skills || []}
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
        userSkills={resume?.skills || []}
        isOpen={isModalOpen} 
        isSaved={selectedJob ? savedJobs.some(j => j.id === selectedJob.id) : false}
        onSave={() => selectedJob && toggleSaveJob(selectedJob)}
        onClose={() => setIsModalOpen(false)} 
      />

      <ChatAssistant profile={profile} />
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
