"use client"

import Link from "next/link"
import { ShieldCheck, ArrowLeft, Mail, Phone, MapPin } from  "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500/20 antialiased">
      
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/echo_logo.png" alt="echo logo" className="h-8 w-auto object-contain" />
            <span className="font-bold text-lg text-slate-900 tracking-tight lowercase">echo</span>
            <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
              Legal
            </span>
          </Link>

          <Link href="/" className="text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to echo
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        
        {/* Page Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-teal-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            PRIVACY POLICY & DATA PROTECTION
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-xs font-mono text-slate-500">Effective Date: September 20, 2026 | Product by Grekam</p>
        </div>

        {/* Content Sections */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">1. Overview</h2>
            <p>
              This Privacy Policy describes how <strong>echo</strong> (a software product developed and operated by <strong>Grekam</strong>, headquartered in Coimbatore, Tamil Nadu, India) collects, uses, stores, and protects personal data when you use the <strong>echo LMS & CRM SaaS platform</strong> hosted at <code>echo.grekam.in</code> or related academy custom subdomains.
            </p>
            <p>
              By accessing or using <strong>echo</strong> as an Academy Administrator, Educator, Student, or Lead Prospect, you consent to the data collection and processing practices described herein.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-xs font-medium text-slate-700">
              <li>
                <strong>Academy & User Profiles:</strong> Full name, email address, mobile phone number, academy designation, profile picture, and authentication credentials.
              </li>
              <li>
                <strong>Student & Admission Data:</strong> Enrolled courses, batch assignments, attendance records, test/quiz responses, assignment submissions, fee payment records, and generated certificates.
              </li>
              <li>
                <strong>CRM & Meta Lead Ingestion:</strong> Lead contact details ingested via landing page forms, Meta Lead Ads, Google Ads, or WhatsApp Business API webhooks for academy admissions follow-ups.
              </li>
              <li>
                <strong>Payment & Invoicing Information:</strong> Payment transaction references, invoice IDs, payment status, and gateway logs (processed securely via Razorpay or Stripe). <em>We do not store raw credit card numbers or UPI PINs on our servers.</em>
              </li>
              <li>
                <strong>Technical Logs:</strong> IP address, device browser parameters, sign-in logs, and activity timestamps used for security audits and performance monitoring.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">3. Multi-Tenant Data Isolation</h2>
            <p>
              <strong>echo</strong> enforces strict multi-tenant database isolation. Each academy's data (students, courses, CRM leads, and financial records) is tagged with a unique tenant identifier (<code>academyId</code>). Personnel from one academy cannot access or view data belonging to another academy under any circumstances.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">4. Third-Party Integrations & Webhooks</h2>
            <p>
              <strong>echo</strong> integrates with third-party service providers to deliver seamless communications and learning:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li><strong>Meta WhatsApp API:</strong> Automated delivery of class reminders, payment receipts, and lead follow-up messages.</li>
              <li><strong>Zoom & Google Meet:</strong> Generation of live video class links and session attendance sync.</li>
              <li><strong>Payment Gateways (Razorpay / Stripe):</strong> Secure transaction processing and automated GST invoice issuance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">5. Data Retention & Deletion</h2>
            <p>
              We retain personal data as long as your academy account remains active or as required by Indian tax and educational reporting laws. Account owners or individual learners may request data export or data purge by visiting our <Link href="/data-deletion" className="text-teal-700 font-bold underline">Data Deletion Request Page</Link> or contacting our privacy desk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">6. Contact & Grievance Officer</h2>
            <p>
              For any questions, data subject requests, or privacy concerns regarding <strong>echo</strong>, please contact our administrative team:
            </p>
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs font-semibold text-slate-800">
              <p className="font-bold text-teal-700 text-sm">Grekam Privacy & Legal Desk</p>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-600 shrink-0" /> Grekam, Coimbatore, Tamil Nadu, India</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-600 shrink-0" /> Phone: +91 98431 99556</div>
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
