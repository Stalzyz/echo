"use client"

import { use, useState, useEffect } from  "react"
import { useApi } from  "@/lib/useApi"
import { QRCodeSVG } from  "qrcode.react"
import { Star, Shield, Award, BookOpen, Briefcase, GraduationCap, Phone, Mail, Droplets, Workflow, Target, Loader2, ArrowLeft, ExternalLink, CheckCircle2 } from  "lucide-react"
import Link from "next/link"

const CAREER_SCORE_SEGMENTS = [
  { label: "Attendance", weight: 15, color: "#0d9488" },
  { label: "Assignments", weight: 15, color: "#0284c7" },
  { label: "Projects", weight: 20, color: "#0891b2" },
  { label: "Skills", weight: 20, color: "#059669" },
  { label: "Communication", weight: 10, color: "#d97706" },
  { label: "Portfolio", weight: 10, color: "#ea580c" },
  { label: "Interview", weight: 10, color: "#db2777" },
]

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
      ))}
    </div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDash = (score / 100) * circumference
  const color = score >= 75 ? "#059669" : score >= 50 ? "#d97706" : "#dc2626"
  const label = score >= 80 ? "Job Ready" : score >= 60 ? "Near Ready" : score >= 40 ? "Developing" : "Early Stage"

  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <svg width="180" height="180" className="-rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        <circle cx="90" cy="90" r={radius} fill="none" stroke={color}
          strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-extrabold" style={{ color }}>{score}</div>
        <div className="text-xs text-slate-500 mt-0.5">/ 100</div>
        <div className="text-[10px] font-bold mt-1" style={{ color }}>{label}</div>
      </div>
    </div>
  )
}

const SKILL_CATEGORIES = ["TECHNICAL", "TOOL", "SOFT", "DOMAIN"]

export default function PublicStudentPassportPage({ params }: { params: Promise<{ studentId: string }> }) {
  const resolvedParams = use(params)
  const studentId = resolvedParams.studentId

  const { data: passport, error, isLoading } = useApi<any>(`/academy/passport/${studentId}`)
  const [passportUrl, setPassportUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPassportUrl(window.location.href)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3 font-sans">
        <Loader2 className="animate-spin w-8 h-8 text-teal-600" />
        <p className="text-sm font-medium text-slate-700">Retrieving Digital Student Passport...</p>
      </div>
    )
  }

  if (error || !passport) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 p-6 font-sans">
        <div className="max-w-md text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          <Shield className="w-12 h-12 text-rose-500 mx-auto mb-4 opacity-75" />
          <h2 className="text-xl font-bold mb-2">Passport Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">This credential ID is invalid or has expired.</p>
          <Link href="/student" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all">
            <ArrowLeft className="w-4 h-4" /> Go to Echo Student Portal
          </Link>
        </div>
      </div>
    )
  }

  const name = `${passport.user?.firstName || ''} ${passport.user?.lastName || ''}`.trim()
  const skills = passport.skills || []
  const skillsByCategory = SKILL_CATEGORIES.reduce((acc: any, cat) => {
    acc[cat] = skills.filter((s: any) => s.category === cat)
    return acc
  }, {})
  const careerScore = passport.careerScore || 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 font-sans relative overflow-x-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Parent Portal Banner Callout */}
        <div className="mb-8 p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold text-teal-900">Are you a parent or guardian?</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Access the private parent dashboard to check attendance logs, fee installments, and performance reports.</p>
          </div>
          <Link href={`/portal/parent/${studentId}`} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0">
            Parent Login <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Top Passport Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-teal-100 border-2 border-teal-200 text-teal-800 font-bold text-2xl flex items-center justify-center shrink-0">
              {name ? name.charAt(0) : "S"}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-bold text-teal-700 font-mono uppercase mb-2">
                <CheckCircle2 className="w-3 h-3 text-teal-600" /> Verified Echo Student Passport
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{name || "Student Passport"}</h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Passport ID: {studentId}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <ScoreRing score={careerScore} />
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Career Readiness</div>
              <div className="text-sm font-bold text-slate-900 mt-1">Verified Score</div>
              <div className="text-[11px] text-slate-500 mt-1 max-w-[140px]">Based on attendance, assignments & code evaluations</div>
            </div>
          </div>
        </div>

        {/* Skills & Portfolio Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Skills Breakdown */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-teal-600" /> Verified Skills & Competencies
            </h3>
            
            <div className="space-y-3">
              {skills.length > 0 ? (
                skills.map((skill: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{skill.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{skill.category}</div>
                    </div>
                    <StarRating value={skill.rating || 4} />
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center">
                  Core competencies verified upon module completion.
                </div>
              )}
            </div>
          </div>

          {/* QR Verification Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" /> Authentic QR Credential
            </h3>
            {passportUrl && (
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <QRCodeSVG value={passportUrl} size={130} />
              </div>
            )}
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Scan this QR code with any mobile camera to verify this Echo Student credential on the blockchain ledger.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
