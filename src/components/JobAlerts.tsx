import React, { useState } from "react";
import { 
  Bell, 
  Plus, 
  Trash2, 
  Mail, 
  Clock, 
  MapPin, 
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { JobAlert } from "../types";

interface JobAlertsProps {
  alerts: JobAlert[];
  onCreateAlert: (alert: Omit<JobAlert, "id" | "createdAt" | "isActive">) => void;
  onDeleteAlert: (id: string) => void;
  onToggleAlert: (id: string) => void;
}

export function JobAlerts({ alerts, onCreateAlert, onDeleteAlert, onToggleAlert }: JobAlertsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    keywords: "",
    location: "",
    frequency: "daily" as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.keywords.trim()) return;
    
    onCreateAlert(formData);
    setFormData({ keywords: "", location: "", frequency: "daily" });
    setIsAdding(false);
  };

  return (
    <div id="job-alerts-container" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Job Alerts
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Get notified when new jobs match your criteria.
          </p>
        </div>
        <button
          id="add-alert-toggle"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
        >
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4" /> New Alert</>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form 
              id="new-alert-form"
              onSubmit={handleSubmit}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Keywords</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. React Developer, UI Designer"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="e.g. Remote, San Francisco"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Frequency</label>
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 gap-1">
                    {(["instant", "daily", "weekly"] as const).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFormData({ ...formData, frequency: freq })}
                        className={`flex-1 py-1.5 px-3 rounded text-xs font-medium capitalize transition-all ${
                          formData.frequency === freq
                            ? "bg-white dark:bg-zinc-700 text-blue-600 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-zinc-900 dark:bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
              <Mail className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold">No alerts yet</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Be the first to know when your dream job drops.
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <motion.div
              layout
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-blue-200 dark:hover:border-blue-900/30 transition-all shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                    {alert.keywords}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium font-sans">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {alert.location || "Anywhere"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.frequency}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleAlert(alert.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      alert.isActive 
                        ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" 
                        : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                    title={alert.isActive ? "Alert Active" : "Alert Paused"}
                  >
                    {alert.isActive ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                <span>Created {new Date(alert.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 text-blue-500">
                  <Mail className="w-2.5 h-2.5" /> Notifications Enabled
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
