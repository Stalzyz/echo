"use client"

import { useState, use } from  "react"
import { useApi, fetchApi } from  "@/lib/useApi"
import { QRCodeSVG } from  "qrcode.react"
import { toast } from  "sonner"
import { ArrowLeft, Star, Plus, X, Loader2, Shield, Award, BookOpen, Briefcase, GraduationCap, Heart, Phone, Mail, Check, Droplets, Workflow, Target } from  "lucide-react"
import Link from "next/link"

const CAREER_SCORE_SEGMENTS = [
  { label: "Attendance", weight: 15, color: "#0d9488" },
  { label: "Assignments", weight: 15, color: "#0284c7" },
  { label: "Projects", weight: 20, color: "#2563eb" },
  { label: "Skills", weight: 20, color: "#059669" },
  { label: "Communication", weight: 10, color: "#d97706" },
  { label: "Portfolio", weight: 10, color: "#ea580c" },
  { label: "Interview", weight: 10, color: "#db2777" },
]

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange?.(i)} type="button"
          className={`transition-transform hover:scale-110 ${onChange ? "cursor-pointer" : "cursor-default"}`}>
          <Star className={`w-4 h-4 ${i <= value ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
        </button>
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
        <div className="text-4xl font-black text-slate-900">{score}</div>
        <div className="text-xs text-slate-400 mt-0.5 font-bold">/ 100</div>
        <div className="text-[11px] font-extrabold mt-1 uppercase tracking-wider" style={{ color }}>{label}</div>
      </div>
    </div>
  )
}

const SKILL_CATEGORIES = ["TECHNICAL", "TOOL", "SOFT", "DOMAIN"]

export default function StudentPassportPage({ params }: { params: Promise<{ studentId: string }> }) {
  const resolvedParams = use(params)
  const studentId = resolvedParams.studentId

  const { data: passport, mutate, isLoading } = useApi<any>(`/academy/passport/${studentId}`)
  const [addSkillOpen, setAddSkillOpen] = useState(false)
  const [skillForm, setSkillForm] = useState({ skillName: "", category: "TECHNICAL", rating: 3, notes: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/passport/${studentId}/skills`, {
        method: "POST",
        body: JSON.stringify(skillForm)
      })
      toast.success("Skill updated!")
      setAddSkillOpen(false)
      setSkillForm({ skillName: "", category: "TECHNICAL", rating: 3, notes: "" })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to save skill")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingChange = async (skillId: string, skillName: string, category: string, newRating: number) => {
    try {
      await fetchApi(`/academy/passport/${studentId}/skills`, {
        method: "POST",
        body: JSON.stringify({ skillName, category, rating: newRating })
      })
      toast.success(`${skillName} updated to ${newRating}★`)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to update rating")
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await fetchApi(`/academy/passport/${studentId}/skills/${skillId}`, { method: "DELETE" })
      toast.success("Skill removed")
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete skill")
    }
  }

  if (isLoading && !passport) {
    return <div className="flex h-full items-center justify-center text-slate-500 font-medium bg-slate-50"><Loader2 className="animate-spin w-6 h-6 text-teal-600" /></div>
  }
  if (!passport) return <div className="flex h-full items-center justify-center text-slate-500 font-medium bg-slate-50">Student record not found.</div>

  const name = `${passport.user?.firstName || ''} ${passport.user?.lastName || ''}`.trim()
  const skills = passport.skills || []
  const skillsByCategory = SKILL_CATEGORIES.reduce((acc: any, cat) => {
    acc[cat] = skills.filter((s: any) => s.category === cat)
    return acc
  }, {})
  const careerScore = passport.careerScore || 0
  const passportUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://academy.echolms.com'}/student/${studentId}`

  return (
    <div className="flex flex-col min-h-full bg-slate-50 text-slate-900 p-8 overflow-auto custom-scrollbar">
      <Link href="/dashboard/academy/students/onsite" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-bold mb-8 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Left: ID Card ─────────────────────────────────────────────── */}
        <div className="xl:col-span-1 space-y-4">

          {/* Physical ID Card */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xs">

            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[10px] text-slate-400 tracking-wider uppercase font-bold">Echo LMS</div>
                  <div className="text-[11px] text-teal-700 tracking-wider uppercase font-black">Student Digital Passport</div>
                </div>
                <Shield className="w-6 h-6 text-teal-600" />
              </div>

              {/* Avatar + Name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-2xl font-black text-teal-800 shrink-0">
                  {name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900">{name}</h1>
                  <p className="text-xs text-slate-400 font-mono font-bold mt-0.5">{passport.studentCode}</p>
                  <div className={`inline-flex items-center gap-1.5 mt-2 text-[10px] px-2.5 py-1 rounded-md font-extrabold border
                    ${passport.isAlumni ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}>
                    {passport.isAlumni ? "ALUMNI" : "ACTIVE STUDENT"}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-xs font-medium">
                {[
                  { icon: Mail, label: "Email", value: passport.user?.email },
                  { icon: Phone, label: "Phone", value: passport.user?.phone || "—" },
                  { icon: Droplets, label: "Blood Group", value: passport.bloodGroup || "—" },
                  { icon: GraduationCap, label: "Delivery Mode", value: passport.deliveryMode },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase mb-1"><Icon className="w-3 h-3" />{label}</div>
                    <div className="text-slate-900 font-bold truncate">{value}</div>
                  </div>
                ))}
              </div>

              {/* Enrollments */}
              {passport.enrollments?.slice(0, 2).map((e: any) => (
                <div key={e.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-2 text-xs font-medium">
                  <div className="text-slate-400 text-[10px] uppercase font-bold mb-0.5">Enrolled Course</div>
                  <div className="font-extrabold text-slate-900">{e.batch?.course?.name}</div>
                  <div className="text-teal-700 font-bold">{e.batch?.name}</div>
                </div>
              ))}

              {/* QR Code */}
              <div className="mt-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="text-slate-900">
                  <div className="text-[10px] font-black uppercase tracking-wider mb-1">Scan to Verify</div>
                  <div className="text-[10px] text-slate-400 font-mono font-bold">{passport.studentCode}</div>
                </div>
                <QRCodeSVG value={passportUrl} size={65} bgColor="#f8fafc" fgColor="#0f172a" level="Q" />
              </div>
            </div>
          </div>

          {/* Badges */}
          {passport.badges?.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2 text-slate-900"><Award className="w-4 h-4 text-amber-500" /> Badges Earned</h3>
              <div className="flex flex-wrap gap-2">
                {passport.badges.map((b: any) => (
                  <div key={b.id} className="text-xs px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-bold">
                    {b.badge?.name || 'Badge'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Center: Career Score ──────────────────────────────────────── */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-600" /> Career Readiness Score
            </h2>
            <div className="flex justify-center mb-6">
              <ScoreRing score={careerScore} />
            </div>
            <div className="space-y-3">
              {CAREER_SCORE_SEGMENTS.map(seg => (
                <div key={seg.label} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <div className="flex-1 text-xs text-slate-700 font-semibold">{seg.label}</div>
                  <div className="text-xs text-slate-400 font-mono">{seg.weight}%</div>
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (careerScore / 100) * 100)}%`, backgroundColor: seg.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          {passport.emergencyContact && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-extrabold mb-3 flex items-center gap-2 text-rose-600"><Heart className="w-4 h-4" /> Emergency Contact</h3>
              <div className="text-sm text-slate-700 font-medium">
                {(() => { try { const c = JSON.parse(passport.emergencyContact); return `${c.name} · ${c.relation} · ${c.phone}` } catch { return passport.emergencyContact } })()}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Skill Matrix ───────────────────────────────────────── */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-amber-500" /> Skill Matrix
              </h2>
              <button onClick={() => setAddSkillOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </div>

            {skills.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm font-medium">No skills added yet. Click "Add Skill" to build matrix.</div>
            )}

            {SKILL_CATEGORIES.map(cat => {
              const catSkills = skillsByCategory[cat] || []
              if (catSkills.length === 0) return null
              const catColors: Record<string, string> = { TECHNICAL: "text-teal-700", TOOL: "text-sky-700", SOFT: "text-amber-700", DOMAIN: "text-emerald-700" }
              return (
                <div key={cat} className="mb-5">
                  <div className={`text-[10px] font-extrabold uppercase tracking-wider mb-2.5 ${catColors[cat]}`}>{cat}</div>
                  <div className="space-y-2">
                    {catSkills.map((skill: any) => (
                      <div key={skill.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                        <div className="flex-1 text-xs font-bold text-slate-800 truncate">{skill.skillName}</div>
                        <StarRating value={skill.rating}
                          onChange={(v) => handleRatingChange(skill.id, skill.skillName, skill.category, v)} />
                        <button onClick={() => handleDeleteSkill(skill.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      {addSkillOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl text-slate-900">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <h2 className="text-lg font-black text-slate-900">Add / Update Skill</h2>
              <button onClick={() => setAddSkillOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block mb-1">Skill Name</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  placeholder="e.g. Figma, React, Communication"
                  value={skillForm.skillName} onChange={e => setSkillForm(p => ({...p, skillName: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block mb-1">Category</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  value={skillForm.category} onChange={e => setSkillForm(p => ({...p, category: e.target.value}))}>
                  <option value="TECHNICAL">Technical</option>
                  <option value="TOOL">Tool / Software</option>
                  <option value="SOFT">Soft Skill</option>
                  <option value="DOMAIN">Domain Knowledge</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block mb-1">Rating</label>
                <div className="flex gap-2 items-center">
                  <StarRating value={skillForm.rating} onChange={(v) => setSkillForm(p => ({...p, rating: v}))} />
                  <span className="text-xs font-bold text-slate-500">{skillForm.rating} / 5</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 flex gap-3">
                <button type="button" onClick={() => setAddSkillOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-xs">
                  {isSubmitting ? "Saving..." : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
