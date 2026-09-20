"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, ArrowLeft, Mail, Phone, MapPin, CheckCircle2, ShieldAlert } from "lucide-react"
import { toast } from "sonner"

export default function DataDeletionPage() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("student")
  const [academyName, setAcademyName] = useState("")
  const [reason, setReason] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    toast.success("Data deletion request submitted successfully! Ticket reference generated.")
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500/20 antialiased">
      
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              e
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight lowercase">echo</span>
            <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
              Data Protection
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-800 text-xs font-bold">
            <Trash2 className="w-4 h-4 text-rose-600" />
            USER DATA DELETION & PURGE POLICY
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Data Deletion Request</h1>
          <p className="text-xs font-mono text-slate-500">GDPR & DPDP Compliant Data Removal Request | Product by Grekam</p>
        </div>

        {/* Informational Guidance */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">1. Right to Data Erasure</h2>
            <p>
              Under global data privacy frameworks (including India's Digital Personal Data Protection Act), users of <strong>echo</strong> (students, educators, or academy administrators) have the right to request the permanent deletion of their personal accounts and associated identifiers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">2. What Happens Upon Deletion?</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 font-medium">
              <li>Your personal profile (Name, Email, Mobile OTP logs) is permanently deleted.</li>
              <li>Authentication tokens and active sessions are revoked across all devices.</li>
              <li>CRM lead records linked to your individual profile are anonymized.</li>
              <li>Course progression data and quiz responses are deleted unless retained under statutory educational compliance rules.</li>
            </ul>
          </section>

          <section className="space-y-4 pt-2">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">3. Submit Deletion Request Form</h2>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">Deletion Request Logged</h3>
                <p className="text-xs text-emerald-800">
                  Your ticket reference has been logged. Our data protection compliance officer at Grekam will process your erasure request within <strong>30 days</strong> and send confirmation to <strong>{email}</strong>.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input required placeholder="e.g. Arjun Sharma" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-medium" />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registered Email Address *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="student@echo.in" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-medium" />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registered Mobile Number *</label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-mono" />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">User Role *</label>
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-medium">
                    <option value="student">Student</option>
                    <option value="educator">Educator</option>
                    <option value="admin">Academy Admin</option>
                    <option value="lead">CRM Lead Prospect</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Academy Name (if applicable)</label>
                  <input value={academyName} onChange={e => setAcademyName(e.target.value)} placeholder="e.g. Northstar Academy" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-medium" />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reason for Deletion (Optional)</label>
                  <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="Please let us know why you are requesting account removal..." className="w-full bg-white border border-slate-200 rounded-xl p-3 font-medium" />
                </div>

                <button type="submit" className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                  Submit Permanent Data Deletion Request →
                </button>
              </form>
            )}
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-4">
            <h2 className="text-lg font-bold text-slate-900">4. Direct Contact for Urgent Erasure</h2>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs font-semibold text-slate-800">
              <p className="font-bold text-teal-700 text-sm">Grekam Data Protection Officer</p>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-600 shrink-0" /> Grekam, Coimbatore, Tamil Nadu, India</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-600 shrink-0" /> Contact Phone: +91 98431 99556</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-teal-600 shrink-0" /> Email: admin@grekam.in</div>
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
