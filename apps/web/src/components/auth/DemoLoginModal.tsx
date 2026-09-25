"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, Building2, GraduationCap, Video, ArrowRight, 
  Loader2, Sparkles, CheckCircle2, ShieldCheck, Eye
} from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DemoLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DemoPersona {
  id: "admin" | "student" | "educator"
  title: string
  roleSubtitle: string
  email: string
  password: string
  targetRoute: string
  description: string
  icon: any
  badge: string
  color: {
    badge: string
    border: string
    bgHover: string
    btn: string
  }
  features: string[]
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "admin",
    title: "Academy Admin Dashboard",
    roleSubtitle: "Echo Academy (Admin)",
    email: "demo.academy@echo.in",
    password: "echo123",
    targetRoute: "/dashboard",
    description: "Complete operational control over admissions, attendance, fees, batches & course approvals.",
    icon: Building2,
    badge: "Full Academy CRM",
    color: {
      badge: "bg-amber-100 text-amber-900 border-amber-300",
      border: "border-amber-200 hover:border-amber-400",
      bgHover: "hover:bg-amber-50/40",
      btn: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black"
    },
    features: [
      "Admissions CRM & WhatsApp Lead Tracking",
      "QR Code Live Camera Attendance",
      "Student Fees, Automated EMI & GST Invoices",
      "Curriculum Approvals & Batch Management"
    ]
  },
  {
    id: "student",
    title: "Student LMS Portal",
    roleSubtitle: "Alex Martin (Enrolled Learner)",
    email: "demo.student@echo.in",
    password: "echo123",
    targetRoute: "/student",
    description: "Personalized student workspace for video lessons, live classrooms, quizzes & certificates.",
    icon: GraduationCap,
    badge: "Student Experience",
    color: {
      badge: "bg-teal-100 text-teal-900 border-teal-300",
      border: "border-teal-200 hover:border-teal-400",
      bgHover: "hover:bg-teal-50/40",
      btn: "bg-teal-600 hover:bg-teal-700 text-white font-bold"
    },
    features: [
      "Course Video Player & Progress Tracking",
      "Interactive Quiz & Assessment Runner",
      "Verified Blockchain Certificates & QR Codes",
      "Gamified Batch Leaderboard & XP Streaks"
    ]
  },
  {
    id: "educator",
    title: "Educator Studio",
    roleSubtitle: "Dr. Priya Menon (Lead Faculty)",
    email: "demo.educator@echo.in",
    password: "echo123",
    targetRoute: "/dashboard/studio",
    description: "Content creator and instructor hub to build courses, schedule live classes & grade tasks.",
    icon: Video,
    badge: "Teaching Hub",
    color: {
      badge: "bg-indigo-100 text-indigo-900 border-indigo-300",
      border: "border-indigo-200 hover:border-indigo-400",
      bgHover: "hover:bg-indigo-50/40",
      btn: "bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
    },
    features: [
      "Modular Course Builder & Lesson Editor",
      "Live Class Streamer & Timed Pitch CTAs",
      "Quiz & Evaluation Creator",
      "Student Assignment Submission Review Queue"
    ]
  }
]

export function DemoLoginModal({ isOpen, onClose }: DemoLoginModalProps) {
  const router = useRouter()
  const [selectedPersona, setSelectedPersona] = useState<"admin" | "student" | "educator">("admin")
  const [loadingRole, setLoadingRole] = useState<string | null>(null)

  if (!isOpen) return null

  const handleLaunchDemo = async (persona: DemoPersona) => {
    setLoadingRole(persona.id)
    toast.loading(`Authenticating as ${persona.title}...`, { id: "demo-auth" })

    try {
      const res = await signIn("credentials", {
        email: persona.email,
        password: persona.password,
        redirect: false
      })

      if (res?.error) {
        toast.error(`Authentication failed: ${res.error}`, { id: "demo-auth" })
        setLoadingRole(null)
        return
      }

      toast.success(`Welcome to ${persona.title}! Redirecting...`, { id: "demo-auth" })

      setTimeout(() => {
        router.push(persona.targetRoute)
        router.refresh()
        onClose()
      }, 500)
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in to demo dashboard", { id: "demo-auth" })
      setLoadingRole(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-8 max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">Explore Live Demo Experience</h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
                  Instant Auto-Login
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Select a role to instantly sign in and experience the full live dashboard.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Persona Options */}
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-3">
            {DEMO_PERSONAS.map(p => {
              const Icon = p.icon
              const isSelected = selectedPersona === p.id
              const isLoading = loadingRole === p.id

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id)}
                  className={`p-5 rounded-3xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? `bg-slate-50/90 ring-2 ring-slate-900/10 ${p.color.border} shadow-sm`
                      : `bg-white border-slate-200 ${p.color.bgHover}`
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex items-start gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isSelected ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900">{p.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${p.color.badge}`}>
                            {p.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-bold">{p.roleSubtitle}</div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-md">{p.description}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!!loadingRole}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLaunchDemo(p)
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 ${p.color.btn} disabled:opacity-50`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing in...
                        </>
                      ) : (
                        <>
                          Launch Dashboard <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Auto-fill credentials badge */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-medium gap-2">
                    <div className="flex items-center gap-2">
                      <span>Auto-filled: <strong className="font-mono text-slate-900">{p.email}</strong></span>
                      <span>•</span>
                      <span>Password: <strong className="font-mono text-slate-900">{p.password}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 text-teal-700 font-bold text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Pre-Configured Live Data
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-500 font-medium">
            No credit card or setup required.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}
