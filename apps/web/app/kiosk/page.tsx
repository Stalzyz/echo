"use client"

import { useState } from "react"
import { CheckCircle2, Loader2, GraduationCap, Star, Sparkles, Building2, HelpCircle, BookOpen, Compass } from "lucide-react"
import { fetchApi } from "@/lib/useApi"

const INTERESTS = [
  "Graphic Design", "UI/UX Design", "Web Development",
  "Motion Graphics", "Video Editing", "Photography",
  "Digital Marketing", "3D Design", "Brand Identity",
  "Interior Design", "Fashion Design", "Other"
]

const SOURCES = [
  { value: "GOOGLE", label: "Google / Search" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "YOUTUBE", label: "YouTube" },
  { value: "FRIEND", label: "Friend / Word of Mouth" },
  { value: "REFERRAL", label: "Student Referral" },
  { value: "HOARDING", label: "Banner / Hoarding" },
  { value: "OTHER", label: "Other" },
]

const TYPES = [
  { value: "WALKIN", label: "Just Enquiring", icon: HelpCircle },
  { value: "DEMO", label: "Want a Demo Class", icon: GraduationCap },
  { value: "ENQUIRY", label: "Course Information", icon: BookOpen },
  { value: "CAMPUS_TOUR", label: "Campus Tour", icon: Compass },
]

export default function KioskPage() {
  const [step, setStep] = useState<"FORM" | "SUCCESS">("FORM")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [tokenNumber, setTokenNumber] = useState("")

  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    interestArea: "", type: "WALKIN", source: "OTHER",
    preferredDate: "", notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.name) {
      setError("Please enter your full name.")
      return
    }
    if (!form.phone || form.phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.")
      return
    }
    if (!form.interestArea) {
      setError("Please select at least one course that interests you.")
      return
    }
    setIsSubmitting(true)
    try {
      const data: any = await fetchApi("/academy/walk-ins", {
        method: "POST",
        body: JSON.stringify(form)
      })
      setTokenNumber(data?.tokenNumber || `GCH-${Date.now().toString().slice(-5)}`)
      setStep("SUCCESS")
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === "SUCCESS") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center text-slate-900 bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black mb-3 text-slate-900">You're Registered!</h1>
          <p className="text-slate-500 text-base mb-8">Welcome to Gecho LMS. A counsellor will be with you shortly.</p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 mb-8">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Your Token Number</p>
            <div className="text-5xl font-black text-teal-600 tracking-wider mb-4">{tokenNumber}</div>
            <p className="text-slate-500 text-sm">Show this to our front desk team</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-700 mb-8">
            WhatsApp confirmation has been sent to <strong>{form.phone}</strong>
          </div>

          <button onClick={() => { setStep("FORM"); setForm({ name:"",phone:"",email:"",interestArea:"",type:"WALKIN",source:"OTHER",preferredDate:"",notes:"" }) }}
            className="text-slate-500 hover:text-slate-800 text-sm font-semibold underline">
            Register another visitor
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center shadow-sm">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="text-slate-900 font-black text-xl">Gecho LMS</div>
              <div className="text-teal-600 text-xs font-semibold">Welcome! Please register your visit.</div>
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Quick Visitor Registration</h1>
          <p className="text-slate-500">Fill in your details and we'll have a counsellor with you in minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 space-y-6">
          
          {/* Visit Type */}
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-3">What brings you here today?</label>
            <div className="grid grid-cols-2 gap-3">
              {TYPES.map(t => {
                const Icon = t.icon
                const isSelected = form.type === t.value
                return (
                  <button key={t.value} type="button" onClick={() => setForm(p => ({...p, type: t.value}))}
                    className={`py-3 px-4 rounded-2xl text-sm font-bold border transition-all text-left flex items-center gap-3
                      ${isSelected ? "bg-teal-50 border-teal-500 text-teal-700" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"}`}>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-teal-600" : "text-slate-400"}`} />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-2">Full Name *</label>
              <input required placeholder="Your name"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-2">Phone Number *</label>
              <input required type="tel" placeholder="10-digit mobile"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-2">Email (Optional)</label>
            <input type="email" placeholder="your@email.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
              value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
          </div>

          {/* Interest Area */}
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-3">Which course interests you? *</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(i => (
                <button key={i} type="button" onClick={() => setForm(p => ({...p, interestArea: i}))}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all
                    ${form.interestArea === i ? "bg-teal-50 border-teal-500 text-teal-700" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-2">How did you hear about us?</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-teal-500 transition-colors"
              value={form.source} onChange={e => setForm(p => ({...p, source: e.target.value}))}>
              {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Preferred Demo Date */}
          {form.type === "DEMO" && (
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-2">Preferred Demo Date</label>
              <input type="date" min={new Date().toISOString().split("T")[0]}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-teal-500 transition-colors"
                value={form.preferredDate} onChange={e => setForm(p => ({...p, preferredDate: e.target.value}))} />
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-600 text-sm font-medium">
              {error}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-lg rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-sm">
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <><Sparkles className="w-5 h-5" /> Register My Visit</>
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-6">
          By registering, you agree to be contacted by our team. Your data is safe with us.
        </p>
      </div>
    </div>
  )
}
