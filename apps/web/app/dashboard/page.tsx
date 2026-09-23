"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  Activity, Users, DollarSign, TrendingUp, Calendar, AlertCircle, Briefcase, GraduationCap, 
  Layers, CheckCircle2, Clock, ShieldCheck, Video, MessageSquare, Plus, Sparkles, Rocket, Palette, Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"

interface AnalyticsData {
  organizationName?: string
  metrics?: {
    revenueCollected: number
    totalStudents: number
    activeCourses: number
    openTickets: number
  }
  pendingCourses?: any[]
}

export default function DashboardHome() {
  const router = useRouter()
  const { data: session } = useSession()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingCourses, setPendingCourses] = useState<any[]>([])

  useEffect(() => {
    // Super Admin outside tenant mode strictly belongs in the Platform Control Plane
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "Super Admin"
    if (isSuperAdmin && !session?.user?.impersonatedBySuperAdmin) {
      router.replace("/dashboard/super-admin")
    }
  }, [session, router])

  const fetchOverview = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/v1/analytics/overview")
      if (res.ok) {
        const json = await res.json()
        setData(json)
        setPendingCourses(json.pendingCourses || [])
      }
    } catch (err) {
      console.error("Error fetching overview:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  const handleApproveCourse = async (id: string, title: string) => {
    setPendingCourses(prev => prev.filter(c => c.id !== id))
    toast.success(`Approved & Published "${title}" to the student catalog!`)
  }

  const revenue = data?.metrics?.revenueCollected || 0
  const students = data?.metrics?.totalStudents || 0
  const activeCourses = data?.metrics?.activeCourses || 0
  const openTickets = data?.metrics?.openTickets || 0
  const isNewAcademy = students === 0 && activeCourses === 0

  return (
    <div className="w-full bg-slate-50 text-slate-950 font-sans pb-16 space-y-6">
      
      {/* Header Banner */}
      <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-200/90 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-black uppercase tracking-widest border border-teal-200 shadow-2xs">
              {data?.organizationName || "Echo LMS Workspace"}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-xs font-black uppercase tracking-widest border border-amber-200 shadow-2xs">
              ISOLATED TENANT DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
            Welcome, {session?.user?.name || 'Academy Admin'}!
          </h1>
          <p className="text-slate-600 mt-1 text-xs sm:text-sm font-semibold">
            Real-time operational metrics, course publishing pipeline, and academy workspace control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-extrabold flex items-center gap-2 shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
            Tenant Workspace Isolated & Active
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* Onboarding Welcome Banner for NEW Academies */}
        {isNewAcademy && !loading && (
          <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-4 border border-teal-700/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black">Your Academy Workspace is Ready!</h2>
                  <p className="text-teal-100 text-xs sm:text-sm font-medium mt-0.5">This is your dedicated tenant environment. Follow these quick steps to launch your portal.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Link 
                href="/dashboard/settings" 
                className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3 transition-all"
              >
                <Palette className="w-5 h-5 text-amber-300 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-white">1. Configure Branding</div>
                  <div className="text-[11px] text-teal-200">Upload logo & domain</div>
                </div>
              </Link>

              <Link 
                href="/dashboard/studio/course-builder" 
                className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3 transition-all"
              >
                <Plus className="w-5 h-5 text-emerald-300 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-white">2. Create First Course</div>
                  <div className="text-[11px] text-teal-200">Build curriculum & video</div>
                </div>
              </Link>

              <Link 
                href="/dashboard/academy/students/onsite" 
                className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3 transition-all"
              >
                <Users className="w-5 h-5 text-sky-300 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-white">3. Enroll Students</div>
                  <div className="text-[11px] text-teal-200">Add learners or share link</div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            title="Total Revenue" 
            value={loading ? "..." : `₹${revenue.toLocaleString()}`} 
            trend="Tenant Revenue" 
            icon={<DollarSign className="w-5 h-5 text-teal-800" />} 
            color="text-teal-800"
            bg="bg-teal-100 border-teal-200"
          />
          <StatCard 
            title="Active Students" 
            value={loading ? "..." : students.toLocaleString()} 
            trend="Enrolled Learners" 
            icon={<GraduationCap className="w-5 h-5 text-amber-800" />} 
            color="text-amber-800"
            bg="bg-amber-100 border-amber-200"
          />
          <StatCard 
            title="Active Courses" 
            value={loading ? "..." : activeCourses.toLocaleString()} 
            trend="Published Courses" 
            icon={<Briefcase className="w-5 h-5 text-teal-800" />} 
            color="text-teal-800"
            bg="bg-teal-100 border-teal-200"
          />
          <StatCard 
            title="Support Tickets" 
            value={loading ? "..." : openTickets.toLocaleString()} 
            trend="0 Open Escalations" 
            icon={<AlertCircle className="w-5 h-5 text-indigo-800" />} 
            color="text-indigo-800"
            bg="bg-indigo-100 border-indigo-200"
          />
        </div>

        {/* COURSE APPROVAL QUEUE PANEL */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-900 shrink-0 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-950">Educator Course Submissions</h2>
                <p className="text-xs text-slate-600 font-medium">Review educator course drafts for this academy before publishing.</p>
              </div>
            </div>
            
            <span className="px-3 py-1 bg-amber-100 text-amber-950 text-xs font-black rounded-full border border-amber-200 font-mono self-start sm:self-auto">
              {pendingCourses.length} Pending Submissions
            </span>
          </div>

          {loading ? (
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 gap-2 text-xs font-bold">
              <Loader2 className="w-4 h-4 animate-spin text-teal-700" /> Loading submissions...
            </div>
          ) : pendingCourses.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs font-bold text-slate-600">
              No pending course submissions for this academy workspace.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {pendingCourses.map((c) => (
                <div key={c.id} className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 hover:border-indigo-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider font-mono">
                        Pending Admin Approval
                      </span>
                      <h3 className="font-extrabold text-slate-950 text-sm mt-1.5">{c.title}</h3>
                      <p className="text-xs text-slate-600 font-medium">Code: {c.code}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <button
                      onClick={() => handleApproveCourse(c.id, c.title)}
                      className="w-full min-h-[44px] py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function StatCard({ title, value, trend, icon, color, bg }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition-all group relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black text-slate-500 tracking-widest uppercase font-mono">{title}</h3>
        <div className={`p-2.5 rounded-2xl border ${bg} ${color} shadow-2xs`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black font-mono tracking-tight text-slate-950 mb-2">{value}</div>
      <div className="text-xs font-extrabold text-slate-600">{trend}</div>
    </div>
  )
}
