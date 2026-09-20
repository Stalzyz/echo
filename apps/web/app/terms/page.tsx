"use client"

import Link from "next/link"
import { FileText, ArrowLeft, Phone, Mail, MapPin } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500/20 antialiased">
      
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/echo_logo.png" alt="echo logo" className="h-8 w-auto object-contain" />
            <span className="font-bold text-lg text-slate-900 tracking-tight lowercase">echo</span>
            <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
              Terms & Conditions
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
            <FileText className="w-4 h-4 text-teal-600" />
            TERMS OF SERVICE & ACADEMY AGREEMENT
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms and Conditions</h1>
          <p className="text-xs font-mono text-slate-500">Last updated: September 20, 2026 | Product by Grekam, Coimbatore</p>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">1. Acceptance of Terms</h2>
            <p>
              These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;Academy Owner&quot;, &quot;Administrator&quot;, &quot;Educator&quot;, or &quot;Student&quot;) and <strong>Grekam</strong> (Coimbatore, Tamil Nadu, India) governing your access to and use of the <strong>echo</strong> platform at <code>echo.grekam.in</code>.
            </p>
            <p>
              By signing up for an account, selecting &quot;I Accept Terms and Conditions&quot;, or creating an academy instance on <strong>echo</strong>, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">2. Description of Service</h2>
            <p>
              <strong>echo</strong> is an education operating system providing multi-tenant Learning Management System (LMS), Customer Relationship Management (CRM), admissions management, live video class scheduling, payment processing, visual workflow automation, website building, and certificate issuing tools for coaching institutes, skill academies, educators, and education businesses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">3. Academy Accounts & User Conduct</h2>
            <ul className="list-disc pl-5 space-y-2 text-xs font-medium text-slate-700">
              <li>
                <strong>Academy Ownership:</strong> Academy Owner accounts are established through Grekam onboarding. Owners are responsible for assigning appropriate access roles to staff, educators, and students.
              </li>
              <li>
                <strong>Content Liability:</strong> Academies maintain full intellectual property rights to their uploaded courses, video lessons, and curriculum. Academies are solely responsible for ensuring content compliance with copyright and local education guidelines.
              </li>
              <li>
                <strong>Prohibited Uses:</strong> Users must not upload malicious code, engage in unauthorized data scraping, spam learners via automated SMS/WhatsApp, or distribute illegal material through <strong>echo</strong>.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">4. Subscriptions & Billing</h2>
            <p>
              SaaS subscription plans (Starter, Growth, Enterprise) are billed on a recurring monthly or annual basis as configured by <strong>Grekam Super Admin</strong>. Plan upgrades take effect immediately. Failure to settle invoice dues after a 7-day grace period may result in temporary tenant suspension.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">5. Limitation of Liability & Governing Law</h2>
            <p>
              To the maximum extent permitted by applicable law in India, <strong>Grekam</strong> shall not be liable for indirect, incidental, or consequential damages resulting from platform downtime, payment gateway processing failures, or unauthorized access to user credentials.
            </p>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts in <strong>Coimbatore, Tamil Nadu, India</strong>.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-4">
            <h2 className="text-lg font-bold text-slate-900">6. Contact Information</h2>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs font-semibold text-slate-800">
              <p className="font-bold text-teal-700 text-sm">Grekam Legal & Business Contact</p>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-600 shrink-0" /> Grekam, Coimbatore, Tamil Nadu, India</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-600 shrink-0" /> Contact Phone: +91 98431 99556</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-teal-600 shrink-0" /> Official Email: admin@grekam.in</div>
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
