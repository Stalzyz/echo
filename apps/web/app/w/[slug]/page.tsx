"use client"

import { use, useState, useEffect } from  "react"
import { useSession } from  "next-auth/react"
import { Users, DollarSign, TrendingUp, Calendar, AlertCircle, Briefcase, GraduationCap, CheckCircle2, Clock, Plus, Rocket, Palette, Globe, Shield, ExternalLink } from  "lucide-react"
import Link from "next/link"
import { toast } from  "sonner"
import { useOrganization } from  "@/context/OrganizationContext"
import { usePlan } from  "@/hooks/usePlan"

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

export default function VendorWorkspacePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug
  const { data: session } = useSession()
  const org = useOrganization()
  const plan = usePlan()

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/v1/analytics/overview")
        if (res.ok) {
          const json = await res.json()
          setAnalytics(json)
        }
      } catch (err) {
        console.error("Error fetching overview:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOverview()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Workspace Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 border border-teal-500/20 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-teal-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            {org.logoUrl ? (
              <img 
                src={org.logoUrl} 
                alt={org.name} 
                className="w-16 h-16 rounded-2xl object-contain bg-white/10 p-2 border border-white/20 backdrop-blur-md shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-black text-2xl shadow-md">
                {org.name ? org.name.charAt(0).toUpperCase() : "A"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{org.name || "Vendor Workspace"}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {plan.planName} Plan
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 flex items-center gap-2 font-mono">
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span>echo.grekam.in/w/{slug}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {plan.hasFeature("coreLms") && (
              <Link 
                href="/dashboard/studio/courses"
                className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Course
              </Link>
            )}
            <Link 
              href="/dashboard/settings/branding"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <Palette className="w-4 h-4" /> Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Revenue Collected</span>
            <h3 className="text-xl font-bold text-slate-900 font-mono">
              ₹{(analytics?.metrics?.revenueCollected || 0).toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Active Students</span>
            <h3 className="text-xl font-bold text-slate-900 font-mono">
              {analytics?.metrics?.totalStudents || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Published Courses</span>
            <h3 className="text-xl font-bold text-slate-900 font-mono">
              {analytics?.metrics?.activeCourses || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Plan Tier</span>
            <h3 className="text-lg font-bold text-slate-900 uppercase font-mono">
              {plan.planName}
            </h3>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Shortcuts */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Workspace Management Modules</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {plan.hasFeature("studentPortal") && (
            <Link 
              href="/dashboard/academy/students/onsite"
              className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group bg-slate-50/50"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-teal-600" />
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Students Directory</h4>
              <p className="text-xs text-slate-500 mt-0.5">Manage enrolled student profiles</p>
            </Link>
          )}

          {plan.hasFeature("coreLms") && (
            <Link 
              href="/dashboard/academy/batches"
              className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group bg-slate-50/50"
            >
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Live Batches</h4>
              <p className="text-xs text-slate-500 mt-0.5">Create & schedule course batches</p>
            </Link>
          )}

          {plan.hasFeature("certificates") && (
            <Link 
              href="/dashboard/studio/certificates"
              className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group bg-slate-50/50"
            >
              <div className="flex items-center justify-between mb-2">
                <GraduationCap className="w-5 h-5 text-amber-600" />
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Certificates</h4>
              <p className="text-xs text-slate-500 mt-0.5">Issue custom completion certificates</p>
            </Link>
          )}

          {plan.hasFeature("webinars") ? (
            <Link 
              href={`/webinar/${slug}`}
              className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group bg-slate-50/50"
            >
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-5 h-5 text-rose-600" />
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Live Webinar Room</h4>
              <p className="text-xs text-slate-500 mt-0.5">Host high-converting webinars</p>
            </Link>
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-100/50 opacity-60">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Growth Plan</span>
              </div>
              <h4 className="font-bold text-sm text-slate-700">Webinar Studio</h4>
              <p className="text-xs text-slate-500 mt-0.5">Upgrade to unlock live webinars</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
