"use client"

import { useState } from  "react"
import { BarChart3, TrendingUp, Users, DollarSign, Building2, Download, Calendar, ArrowUpRight, ArrowDownRight, Activity } from  "lucide-react"
import { toast } from  "sonner"

export default function PlatformReportsPage() {
  const [timeRange, setTimeRange] = useState("THIS_MONTH")

  const downloadReport = (name: string) => {
    toast.success(`Exporting ${name} CSV report...`)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              Echo SAAS ANALYTICS
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Platform Reports & Analytics</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Academy growth, user expansion, subscription revenue charts, churn rate & course usage.</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={e => setTimeRange(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none shadow-xs"
          >
            <option value="THIS_MONTH">This Month (Sep 2026)</option>
            <option value="LAST_3_MONTHS">Last 3 Months</option>
            <option value="THIS_YEAR">Year to Date (2026)</option>
          </select>

          <button 
            onClick={() => downloadReport("Comprehensive Platform Growth")}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export All Reports
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <ReportKPICard title="Academy Growth" value="+3 New Academies" sub="14.2% MoM growth" icon={<Building2 className="w-5 h-5 text-teal-600" />} />
        <ReportKPICard title="User Growth" value="+1,850 Learners" sub="Active across 21 tenants" icon={<Users className="w-5 h-5 text-indigo-600" />} />
        <ReportKPICard title="Subscription Revenue" value="₹4.85L MRR" sub="+22.4% revenue increase" icon={<DollarSign className="w-5 h-5 text-emerald-600" />} />
        <ReportKPICard title="Platform Churn Rate" value="1.2%" sub="Industry leading retention" icon={<Activity className="w-5 h-5 text-amber-600" />} />
      </div>

      {/* Report Modules List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-black text-slate-900 text-lg mb-4">Downloadable SaaS Executive Reports</h3>
        
        <ReportDownloadItem 
          title="Academy Growth & Onboarding Report" 
          desc="Monthly breakdown of new customer academy registrations, trial conversions, and custom domain setups."
          onExport={() => downloadReport("Academy Growth")}
        />
        <ReportDownloadItem 
          title="Platform User Expansion & Active Learners" 
          desc="Student, instructor, and admin user counts grouped by academy tenant."
          onExport={() => downloadReport("User Expansion")}
        />
        <ReportDownloadItem 
          title="Subscription MRR & Revenue Audit" 
          desc="Detailed breakdown of monthly recurring revenue, upgrades, downgrades, and payment gateway fees."
          onExport={() => downloadReport("Subscription Revenue")}
        />
        <ReportDownloadItem 
          title="Course Usage & Content Engagement" 
          desc="Global course publishing volume, video playback hours, and active student quiz completions."
          onExport={() => downloadReport("Course Usage")}
        />
        <ReportDownloadItem 
          title="Tenant Churn & Retention Analytics" 
          desc="Subscription cancellations, expired trial accounts, and retention cohorts."
          onExport={() => downloadReport("Churn & Retention")}
        />
      </div>

    </div>
  )
}

function ReportKPICard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black uppercase text-slate-400 tracking-wider">{title}</span>
        <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">{icon}</div>
      </div>
      <div className="text-2xl font-black text-slate-900 font-mono">{value}</div>
      <span className="text-xs font-bold text-emerald-700 mt-1 block">{sub}</span>
    </div>
  )
}

function ReportDownloadItem({ title, desc, onExport }: { title: string; desc: string; onExport: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
      <div>
        <h4 className="font-extrabold text-sm text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button onClick={onExport} className="px-4 py-2 bg-white border border-slate-200 hover:border-teal-300 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 ml-4">
        <Download className="w-3.5 h-3.5 text-teal-600" /> Export CSV
      </button>
    </div>
  )
}
