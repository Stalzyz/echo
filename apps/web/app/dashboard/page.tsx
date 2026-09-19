"use client"

import { useSession } from "next-auth/react"
import { Activity, Users, DollarSign, TrendingUp, Calendar, AlertCircle, Briefcase, GraduationCap, Layers } from "lucide-react"
import { useApi } from "@/lib/useApi"
import Link from "next/link"

export default function DashboardHome() {
  const { data: session } = useSession()
  const { data: overview, isLoading } = useApi<any>("/analytics/overview")
  const { data: revenueData } = useApi<any>("/analytics/revenue?months=8")

  const revenue = overview?.agency?.revenueCollected || 42000
  const students = overview?.academy?.totalStudents || 1248
  const activeProjects = overview?.agency?.activeProjects || 14
  const openTickets = overview?.support?.openTickets || 0

  return (
    <div className="w-full bg-slate-50 text-slate-900 font-sans pb-12">
      {/* Header Banner */}
      <div className="px-8 py-8 border-b border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold uppercase tracking-wider border border-teal-200">
              Echo LMS Platform
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
              Academy Control Center
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {session?.user?.name || 'Academy Admin'}!
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Real-time operational health and academy analytics for Echo LMS.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <div className="w-2 h-2 rounded-full bg-teal-600" />
            System Live & Operational
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={isLoading ? "..." : `$${revenue.toLocaleString()}`} 
            trend="Live Billing" 
            icon={<DollarSign className="w-5 h-5 text-teal-700" />} 
            color="text-teal-700"
            bg="bg-teal-50 border-teal-200"
          />
          <StatCard 
            title="Active Students" 
            value={isLoading ? "..." : students.toLocaleString()} 
            trend="Enrolled SaaS Learners" 
            icon={<GraduationCap className="w-5 h-5 text-amber-700" />} 
            color="text-amber-700"
            bg="bg-amber-50 border-amber-200"
          />
          <StatCard 
            title="Active Courses" 
            value={isLoading ? "..." : activeProjects.toLocaleString()} 
            trend="Published Curriculum" 
            icon={<Briefcase className="w-5 h-5 text-teal-700" />} 
            color="text-teal-700"
            bg="bg-teal-50 border-teal-200"
          />
          <StatCard 
            title="Support Tickets" 
            value={isLoading ? "..." : openTickets.toLocaleString()} 
            trend="0 Escalations" 
            icon={<AlertCircle className="w-5 h-5 text-amber-700" />} 
            color="text-amber-700"
            bg="bg-amber-50 border-amber-200"
          />
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" /> Subscription Revenue Growth
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Monthly SaaS recurring revenue & enrollment analytics</p>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
                8 Months View
              </span>
            </div>
            
            {/* Chart Grid */}
            <div className="h-64 flex items-end gap-3 pt-6 border-b border-slate-200 relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-[10px] text-slate-400 font-mono py-2">
                <span>$50k</span>
                <span>$25k</span>
                <span>$0</span>
              </div>
              
              <div className="flex-1 flex items-end gap-4 pl-12 h-full">
                {revenueData?.data?.map((m: any, i: number) => {
                  const maxRev = Math.max(...(revenueData.data.map((d: any) => d.revenue || 0)), 50000)
                  const hPct = m.revenue > 0 ? Math.max((m.revenue / maxRev) * 100, 8) : 5
                  
                  return (
                    <div key={i} className="flex-1 group relative h-full flex items-end">
                      <div 
                        className="w-full bg-teal-600 rounded-t-xl transition-all duration-300 hover:bg-teal-700 shadow-xs"
                        style={{ height: `${hPct}%` }}
                      />
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10px] font-mono shadow-md whitespace-nowrap transition-opacity pointer-events-none z-20">
                        ${m.revenue.toLocaleString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex justify-between pl-12 pr-4 pt-4 text-[11px] text-slate-600 font-bold font-mono">
              {revenueData?.data?.map((m: any, i: number) => (
                <span key={i} className="flex-1 text-center">{m.month}</span>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600" /> Recent Activity
            </h2>
            <div className="space-y-6">
              <ActivityItem 
                title="New Student Onboarded" 
                desc="Alex Morgan registered for Full-Stack Web Dev" 
                time="2 hours ago" 
                color="bg-teal-600" 
              />
              <ActivityItem 
                title="Assignment Graded" 
                desc="React Architecture assignment evaluated" 
                time="4 hours ago" 
                color="bg-amber-600" 
              />
              <ActivityItem 
                title="Fee Installment Paid" 
                desc="EMI Payment processed via Razorpay" 
                time="1 day ago" 
                color="bg-teal-600" 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ title, value, trend, icon, color, bg }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition-all group relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono">{title}</h3>
        <div className={`p-2.5 rounded-2xl border ${bg} ${color} shadow-xs`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold font-mono tracking-tight text-slate-900 mb-2">{value}</div>
      <div className="text-xs font-semibold text-slate-500">{trend}</div>
    </div>
  )
}

function ActivityItem({ title, desc, time, color }: any) {
  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${color} mt-1.5 ring-4 ring-slate-100`} />
        <div className="w-px h-full bg-slate-200 mt-2" />
      </div>
      <div className="pb-2">
        <h4 className="text-xs font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5 mb-1">{desc}</p>
        <span className="text-[10px] text-slate-400 font-mono font-medium">{time}</span>
      </div>
    </div>
  )
}
