"use client"

import { useState } from "react"
import { useApi } from "@/lib/useApi"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, 
  GraduationCap, Award, Shield, CheckCircle2, Save, 
  Globe, Github, Linkedin, Bell, ArrowLeft, Loader2,
  Check, RefreshCw, AlertCircle
} from "lucide-react"

export default function StudentProfileEditPage() {
  const router = useRouter()
  const { data: userProfile, isLoading } = useApi<any>("/v1/auth/me")

  const [activeTab, setActiveTab] = useState<"personal" | "contact" | "academic" | "career" | "notifications">("personal")
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  // Form State initialized with student registration fields
  const [form, setForm] = useState({
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@echo.in",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    gender: "Male",
    dob: "2002-05-15",
    bloodGroup: "O+",
    bio: "Passionate full-stack developer focusing on Next.js, TypeScript, and distributed cloud architecture.",
    
    // Address
    address: "123 Innovation Tech Park, Indiranagar",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    postalCode: "560038",

    // Academic & Enrollment
    enrollmentType: "Remote Learner", // Remote Learner, Onsite Campus Student, Hybrid
    batch: "Full-Stack Web Dev - Cohort 12",
    studentId: "ECHO-2026-8942",
    emergencyContactName: "Robert Morgan",
    emergencyContactPhone: "+91 98123 45678",
    guardianRelation: "Parent / Father",

    // Career & Social
    githubUrl: "https://github.com/alexmorgan",
    linkedinUrl: "https://linkedin.com/in/alexmorgan",
    portfolioUrl: "https://alexmorgan.dev",
    skills: "React.js, Next.js, TypeScript, Node.js, PostgreSQL",

    // Notifications
    emailNotifications: true,
    whatsappAlerts: true,
    smsAlerts: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg("")

    try {
      // Optimistic update timeout simulation
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSuccessMsg("Student profile and enrollment details updated successfully!")
      setTimeout(() => setSuccessMsg(""), 4000)
    } catch (err: any) {
      console.error("Failed to update profile", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      
      {/* 1. TOP NAVBAR */}
      <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <Link 
            href="/student/profile" 
            className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-600 hover:text-slate-900 border border-slate-200"
            title="Back to Profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest block font-mono">
              Echo Account Settings
            </span>
            <h1 className="text-sm font-bold text-slate-900">Edit Student Profile & Enrollment</h1>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </header>

      {/* 2. MAIN FORM CONTAINER */}
      <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
        
        {/* SUCCESS NOTIFICATION */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xs flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "personal" 
                ? "bg-teal-50 text-teal-700 border border-teal-200" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <User className="w-4 h-4" /> Personal Details
          </button>

          <button
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "contact" 
                ? "bg-teal-50 text-teal-700 border border-teal-200" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Phone className="w-4 h-4" /> Contact & Address
          </button>

          <button
            onClick={() => setActiveTab("academic")}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "academic" 
                ? "bg-teal-50 text-teal-700 border border-teal-200" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Academic & Emergency
          </button>

          <button
            onClick={() => setActiveTab("career")}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "career" 
                ? "bg-teal-50 text-teal-700 border border-teal-200" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Globe className="w-4 h-4" /> Portfolio & Links
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "notifications" 
                ? "bg-teal-50 text-teal-700 border border-teal-200" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Bell className="w-4 h-4" /> Preferences
          </button>
        </div>

        {/* TAB 1: PERSONAL DETAILS */}
        {activeTab === "personal" && (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">First Name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Blood Group</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-mono"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Bio & Learning Goals</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all resize-none"
              />
            </div>
          </form>
        )}

        {/* TAB 2: CONTACT & ADDRESS */}
        {activeTab === "contact" && (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Contact & Address Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">WhatsApp Number</label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Street Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">State / Province</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: ACADEMIC & EMERGENCY */}
        {activeTab === "academic" && (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Academic & Emergency Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Enrollment Mode</label>
                <select
                  value={form.enrollmentType}
                  onChange={(e) => setForm({ ...form, enrollmentType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
                >
                  <option value="Remote Learner">Remote Learner (Online)</option>
                  <option value="Onsite Campus Student">Onsite Campus Student</option>
                  <option value="Hybrid Learner">Hybrid Learner</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Student Roll ID (Read-only)</label>
                <input
                  type="text"
                  disabled
                  value={form.studentId}
                  className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-2.5 text-xs font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Emergency Contact Name</label>
                <input
                  type="text"
                  value={form.emergencyContactName}
                  onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Emergency Phone</label>
                <input
                  type="tel"
                  value={form.emergencyContactPhone}
                  onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>
          </form>
        )}

        {/* TAB 4: CAREER & PORTFOLIO LINKS */}
        {activeTab === "career" && (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Portfolio & Social Links
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">GitHub Profile URL</label>
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Portfolio Website URL</label>
                <input
                  type="url"
                  value={form.portfolioUrl}
                  onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">Primary Skill Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </form>
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Notification & Alert Preferences
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Email Course Notifications</div>
                  <div className="text-[11px] text-slate-500">Receive assignment feedback and course updates via email</div>
                </div>
                <input 
                  type="checkbox"
                  checked={form.emailNotifications}
                  onChange={(e) => setForm({ ...form, emailNotifications: e.target.checked })}
                  className="w-5 h-5 accent-teal-600 cursor-pointer rounded"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">WhatsApp Live Class Alerts</div>
                  <div className="text-[11px] text-slate-500">Get instant WhatsApp reminders 15 minutes before live sessions</div>
                </div>
                <input 
                  type="checkbox"
                  checked={form.whatsappAlerts}
                  onChange={(e) => setForm({ ...form, whatsappAlerts: e.target.checked })}
                  className="w-5 h-5 accent-teal-600 cursor-pointer rounded"
                />
              </div>
            </div>
          </form>
        )}

      </main>
    </div>
  )
}
