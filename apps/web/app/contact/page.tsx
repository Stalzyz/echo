"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, Mail, Phone, Building, Send, CheckCircle2, Loader2 } from "lucide-react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", academyName: "", message: "" })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("/api/v1/crm/public/webhooks/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.academyName,
          source: "ECHO_WEBSITE_CONTACT",
          notes: form.message,
        }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950">
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">ECHO <span className="text-teal-400 font-normal text-xs uppercase tracking-widest ml-1 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">SaaS</span></span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/features" className="text-slate-300 hover:text-white">Features</Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white">Pricing</Link>
            <Link href="/contact" className="text-teal-400 font-bold">Contact Sales</Link>
            <Link href="/auth/login" className="bg-teal-500 text-slate-950 px-4 py-2 rounded-xl hover:bg-teal-400 font-bold">
              Academy Sign In
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-3">Talk to our <span className="text-teal-400">Academy Specialists</span></h1>
          <p className="text-slate-400 text-sm">Schedule a personalized platform walkthrough or request custom enterprise pricing.</p>
        </div>

        {submitted ? (
          <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-8 text-center max-w-md mx-auto">
            <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Request Received!</h3>
            <p className="text-xs text-slate-400 mb-6">Our academy onboarding team will connect with you shortly on WhatsApp & Phone.</p>
            <Link href="/" className="inline-block bg-teal-500 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-xs">Return to Homepage</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Your Full Name *</label>
              <input required type="text" placeholder="Dr. Stalin Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Work Email *</label>
              <input required type="email" placeholder="admin@academy.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Mobile Number (with Country Code) *</label>
              <input required type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Academy / Institution Name *</label>
              <input required type="text" placeholder="Bright Academy of Technology" value={form.academyName} onChange={e => setForm({ ...form, academyName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">How can we help you?</label>
              <textarea rows={3} placeholder="Tell us about your student volume & course requirements..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500 outline-none" />
            </div>
            <button disabled={loading} type="submit" className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? "Submitting..." : "Submit Inquiry & Request Demo"}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
