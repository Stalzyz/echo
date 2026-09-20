"use client"

import Link from "next/link"
import { Lock, ArrowLeft, Phone, Mail, MapPin, KeyRound, ShieldAlert } from "lucide-react"

export default function TermsOfAccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500/20 antialiased">
      
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/echo_logo.png" alt="echo logo" className="h-8 w-auto object-contain" />
            <span className="font-bold text-lg text-slate-900 tracking-tight lowercase">echo</span>
            <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
              Terms of Access
            </span>
          </Link>

          <Link href="/" className="text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to echo
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        
        {/* Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-teal-800 text-xs font-bold">
            <Lock className="w-4 h-4 text-teal-600" />
            ROLE-BASED ACCESS CONTROL & POLICY
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms of Access</h1>
          <p className="text-xs font-mono text-slate-500">Effective: September 20, 2026 | Product by Grekam, Coimbatore</p>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">1. Scope of Access Protocol</h2>
            <p>
              These Terms of Access specify the credentials, security permissions, and operational constraints applying to every user role accessing the <strong>echo</strong> platform (product by <strong>Grekam</strong>).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">2. Portal Access Tier Definitions</h2>
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h3 className="font-bold text-teal-700 text-xs uppercase tracking-wider">A. Student Portal Access</h3>
              <p className="text-xs text-slate-600">
                Granted to individual learners enrolled in course batches. Students have read-only access to curriculum modules, interactive quiz submission privileges, live class joining access, and certificate download rights for completed courses.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h3 className="font-bold text-indigo-700 text-xs uppercase tracking-wider">B. Educator Studio Access</h3>
              <p className="text-xs text-slate-600">
                Granted to faculty and instructors assigned by Academy Admins. Educators may build course drafts, schedule Zoom/Meet sessions, review assignment submissions, and track batch progress. <em>Course publishing to public catalogues requires Admin authorization.</em>
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h3 className="font-bold text-amber-700 text-xs uppercase tracking-wider">C. Academy Admin Access</h3>
              <p className="text-xs text-slate-600">
                Granted to institute owners and operations staff. Provides full administrative privileges over CRM lead pipelines, student enrollments, educator assignment, fee collections, automation workflows, and custom domain white-labeling.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">3. Session Security & Multi-Factor Guardrails</h2>
            <p>
              Users are responsible for maintaining confidentiality of sign-in credentials (passwords and Mobile OTP codes). Shared account credentials are strictly prohibited. <strong>echo</strong> reserves the right to terminate session tokens exhibiting suspicious concurrent access patterns.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-4">
            <h2 className="text-lg font-bold text-slate-900">4. Support & Access Contact</h2>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs font-semibold text-slate-800">
              <p className="font-bold text-teal-700 text-sm">Grekam Access Administration</p>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-600 shrink-0" /> Grekam, Coimbatore, Tamil Nadu, India</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-600 shrink-0" /> Contact Phone: +91 98431 99556</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-teal-600 shrink-0" /> Support Email: admin@grekam.in</div>
            </div>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800 text-center">
        <p>© 2026 echo. All rights reserved. A product by Grekam, Coimbatore, Tamil Nadu, India.</p>
      </footer>

    </div>
  )
}
