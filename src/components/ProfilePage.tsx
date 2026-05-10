import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Sparkles, 
  Camera, 
  Plus, 
  X,
  Save,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, ParsedResume, UserExperience, UserEducation } from "../types";
import { ResumeUploader } from "./ResumeUploader";
import { ResumeFeedback } from "./ResumeFeedback";

interface ProfilePageProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResumeParsed: (parsed: ParsedResume) => void;
}

export function ProfilePage({ profile, onUpdateProfile, onResumeParsed }: ProfilePageProps) {
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    onUpdateProfile(editedProfile);
    setIsSaving(false);
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const addSkill = () => {
    const currentSkills = editedProfile?.skills || [];
    if (newSkill.trim() && !currentSkills.includes(newSkill.trim())) {
      setEditedProfile(prev => ({
        ...prev,
        skills: [...(prev?.skills || []), newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: (prev?.skills || []).filter(s => s !== skillToRemove)
    }));
  };

  const addExperience = () => {
    const newExp: UserExperience = {
      id: Date.now().toString(),
      company: "",
      role: "",
      period: "2024 - Present",
      description: ""
    };
    setEditedProfile(prev => ({ ...prev, experience: [newExp, ...(prev?.experience || [])] }));
  };

  const updateExperience = (id: string, updates: Partial<UserExperience>) => {
    setEditedProfile(prev => ({
      ...prev,
      experience: (prev?.experience || []).map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const removeExperience = (id: string) => {
    setEditedProfile(prev => ({
      ...prev,
      experience: (prev?.experience || []).filter(e => e.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu: UserEducation = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      year: "2024"
    };
    setEditedProfile(prev => ({ ...prev, education: [newEdu, ...(prev?.education || [])] }));
  };

  const updateEducation = (id: string, updates: Partial<UserEducation>) => {
    setEditedProfile(prev => ({
      ...prev,
      education: (prev?.education || []).map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const removeEducation = (id: string) => {
    setEditedProfile(prev => ({
      ...prev,
      education: (prev?.education || []).filter(e => e.id !== id)
    }));
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mb-2">
            Professional Profile
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">
            Manage your professional identity and let AI tailor your job search.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => {
                  setEditedProfile(profile);
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-lg shadow-sm transition-all"
              >
                {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Save Profile
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-500 text-slate-700 dark:text-zinc-200 text-sm font-bold rounded-lg shadow-sm transition-all"
            >
              Edit Details
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 dark:border-zinc-800 shadow-inner bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                {editedProfile.profilePicture ? (
                  <img src={editedProfile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-300" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-lg transition-colors">
                  <Camera className="w-4 h-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handlePictureChange} />
                </label>
              )}
            </div>
            
            {isEditing ? (
              <>
                <input 
                  type="text"
                  value={editedProfile.name}
                  onChange={e => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-center text-xl font-bold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1 focus:ring-2 ring-blue-500 transition-all mt-2"
                  placeholder="Your Name"
                />
                <input 
                  type="text"
                  value={editedProfile.title}
                  onChange={e => setEditedProfile(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-center text-sm font-medium text-blue-600 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-1 focus:ring-2 ring-blue-500 transition-all mt-2"
                  placeholder="Professional Title"
                />
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">{profile.name || "Set your name"}</h2>
                <p className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mt-1">
                  {profile.title || profile.resume?.inferredDomain || "Professional"}
                </p>
              </>
            )}
          </section>

          <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Links</h3>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              {isEditing ? (
                <input 
                  type="email"
                  value={editedProfile.email}
                  onChange={e => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="flex-1 bg-slate-50 dark:bg-zinc-800 border-none rounded-lg px-3 py-1.5 focus:ring-0 text-slate-700 dark:text-zinc-300"
                  placeholder="Email Address"
                />
              ) : (
                <span className="text-slate-600 dark:text-zinc-400 truncate">{profile.email || "Not set"}</span>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              {isEditing ? (
                <input 
                  type="text"
                  value={editedProfile.phone}
                  onChange={e => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="flex-1 bg-slate-50 dark:bg-zinc-800 border-none rounded-lg px-3 py-1.5 focus:ring-0 text-slate-700 dark:text-zinc-300"
                  placeholder="Phone Number"
                />
              ) : (
                <span className="text-slate-600 dark:text-zinc-400">{profile.phone || "Not set"}</span>
              )}
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Core Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(isEditing ? editedProfile?.skills : profile?.skills || []).map(skill => (
                <span 
                  key={skill} 
                  className="group flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-full text-xs font-semibold border border-slate-200/60 dark:border-zinc-700 transition-all hover:border-slate-300 dark:hover:border-zinc-600"
                >
                  {skill}
                  {isEditing && (
                    <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <div className="flex items-center gap-2 w-full mt-2">
                  <input 
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addSkill()}
                    placeholder="Add skill..."
                    className="flex-1 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 focus:ring-1 ring-blue-500 outline-none"
                  />
                  <button 
                    onClick={addSkill}
                    className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Bio & Resume */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3 text-blue-500" />
              Professional About
            </h3>
            {isEditing ? (
              <textarea 
                value={editedProfile.about}
                onChange={e => setEditedProfile(prev => ({ ...prev, about: e.target.value }))}
                className="w-full h-40 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-slate-700 dark:text-zinc-300 focus:ring-2 ring-blue-500 outline-none transition-all"
                placeholder="Write a brief professional summary about yourself..."
              />
            ) : (
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                {profile.about || "Describe your career goals and expertise to help our AI matches."}
              </p>
            )}
          </section>

          <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Briefcase className="w-3 h-3 text-blue-500" />
                Work Experience
              </h3>
              {isEditing && (
                <button onClick={addExperience} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {(isEditing ? editedProfile?.experience : profile?.experience || []).map((exp) => (
                <div key={exp.id} className="relative group p-4 border border-slate-100 dark:border-zinc-800 rounded-xl bg-slate-50/30 dark:bg-zinc-800/30">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          value={exp.role} 
                          onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                          className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm font-bold"
                          placeholder="Role (e.g. Software Engineer)"
                        />
                        <input 
                          value={exp.period} 
                          onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                          className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm"
                          placeholder="Period (e.g. 2022 - 2024)"
                        />
                      </div>
                      <input 
                        value={exp.company} 
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-blue-600"
                        placeholder="Company"
                      />
                      <textarea 
                        value={exp.description} 
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        className="w-full h-24 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs"
                        placeholder="Description of responsibilities..."
                      />
                      <button onClick={() => removeExperience(exp.id)} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{exp.role}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{exp.period}</span>
                      </div>
                      <p className="text-xs font-bold text-blue-600 mb-2">{exp.company}</p>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-3">{exp.description}</p>
                    </div>
                  )}
                </div>
              ))}
              {(isEditing ? editedProfile?.experience : profile?.experience || []).length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4">No experience added yet.</p>
              )}
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <GraduationCap className="w-3 h-3 text-blue-500" />
                Education
              </h3>
              {isEditing && (
                <button onClick={addEducation} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(isEditing ? editedProfile?.education : profile?.education || []).map((edu) => (
                <div key={edu.id} className="relative group p-4 border border-slate-100 dark:border-zinc-800 rounded-xl bg-slate-50/30 dark:bg-zinc-800/30">
                  {isEditing ? (
                    <div className="space-y-2">
                       <input 
                        value={edu.degree} 
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-bold"
                        placeholder="Degree"
                      />
                       <input 
                        value={edu.institution} 
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs"
                        placeholder="Institution"
                      />
                       <input 
                        value={edu.year} 
                        onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs"
                        placeholder="Year"
                      />
                      <button onClick={() => removeEducation(edu.id)} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 mb-1">{edu.degree}</h4>
                      <p className="text-[10px] text-slate-500">{edu.institution} • {edu.year}</p>
                    </div>
                  )}
                </div>
              ))}
              {(isEditing ? editedProfile?.education : profile?.education || []).length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4 w-full col-span-2">No education history added yet.</p>
              )}
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
            <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
              <FileText className="w-3 h-3 text-blue-500" />
              Primary Resume
            </h3>
            
            <ResumeUploader onUploadComplete={(parsed) => {
              onResumeParsed(parsed);
              // Automaticaly update profile fields if they are empty
              setEditedProfile(prev => ({
                ...prev,
                name: prev.name || parsed.name,
                title: prev.title || parsed.inferredDomain,
                email: prev.email || parsed.email,
                phone: prev.phone || parsed.phone,
                about: prev.about || parsed.summary,
                skills: [...new Set([...prev.skills, ...parsed.skills])]
              }));
              setShowSavedToast(true);
              setTimeout(() => setShowSavedToast(false), 3000);
            }} />

            {profile.resume && (
              <div className="mt-8 space-y-8">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">{profile.resume.name}'s Resume</p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Active Analysis</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-blue-600">
                    {profile.resume.inferredSeniority}
                  </div>
                </div>

                <ResumeFeedback resume={profile.resume} />
              </div>
            )}
          </section>
        </div>
      </div>

      <AnimatePresence>
        {showSavedToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 border border-zinc-700 dark:border-zinc-200"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm font-bold">Profile Updated Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
