import React from "react";
import { Shield, Lock, FileText, Scale } from "lucide-react";
import { motion } from "motion/react";

export function PrivacyPage() {
  return (
    <div className="py-24 px-6 sm:px-12 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-4xl font-black tracking-tight">Privacy Policy</h2>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-zinc-400">
          <p className="text-lg leading-relaxed">
            Last updated: May 10, 2026. Your privacy is paramount to us at HireMatch AI. We provide this policy to explain how we collect, use, and protect your data.
          </p>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">1. Data We Collect</h3>
            <p>We collect information you provide directly to us when you create an account, upload a resume, or communicate with us. This includes your name, email address, phone number, and professional history contained in your resumes.</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">2. AI Processing</h3>
            <p>Our artificial intelligence analyzes your resume to provide job matching and cover letter generation services. This data is processed securely and is never used to train third-party public models without your explicit consent.</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">3. Information Sharing</h3>
            <p>We do not sell your personal data. We only share information with third-party services (like Firebase or Google Gemini) as necessary to provide our application's core functionality.</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">4. Your Rights</h3>
            <p>You have the right to access, update, or delete your data at any time through your Profile settings. If you delete your account, all associated resumes and personal data will be permanently removed from our active databases.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="py-24 px-6 sm:px-12 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
            <Scale className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-4xl font-black tracking-tight">Terms of Service</h2>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-zinc-400">
          <p className="text-lg leading-relaxed">
            By using HireMatch AI, you agree to the following terms. Please read them carefully.
          </p>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h3>
            <p>By accessing our services, you confirm that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy.</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">2. User Accounts</h3>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to provide accurate and complete information when creating your profile.</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">3. Use of AI Tools</h3>
            <p>Our AI tools are provided for assistance only. We do not guarantee employment results or the 100% accuracy of AI-generated content. Users should always review AI-generated resumes and cover letters before submission.</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">4. Prohibited Conduct</h3>
            <p>Users may not use HireMatch AI to generate spam, harass others, or attempt to bypass the application's security measures.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
