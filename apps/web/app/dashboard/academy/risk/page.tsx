"use client"

import { useApi } from  "@/lib/useApi"
import { AlertTriangle, UserX, TrendingDown, IndianRupee, ShieldAlert, CheckCircle2, Activity } from  "lucide-react"
import Link from "next/link"

const RISK_ICONS: any = {
  FINANCIAL: IndianRupee,
  ATTENDANCE: UserX,
  PERFORMANCE: TrendingDown,
  ENGAGEMENT: Activity
}

const RISK_COLORS: any = {
  HIGH: "text-rose-800 bg-rose-50 border-rose-200",
  MEDIUM: "text-amber-800 bg-amber-50 border-amber-200",
  LOW: "text-amber-700 bg-yellow-50 border-yellow-200"
}

export default function AIRiskDashboard() {
  const { data: atRiskStudents, isLoading } = useApi<any[]>("/academy/risk")

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-rose-600" /> Student Risk Engine
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Detects students with low attendance, weak assessment scores, or pending tuition dues.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12 text-slate-500 font-medium animate-pulse">Analyzing student metrics...</div>
      ) : (atRiskStudents?.length === 0) ? (
        <div className="flex flex-col items-center justify-center p-16 border border-slate-200/80 rounded-2xl bg-white shadow-xs">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mb-4" />
          <h3 className="text-xl font-black text-slate-900">No Students at Risk</h3>
          <p className="text-slate-500 mt-1 font-medium">All enrolled students maintain strong attendance, course progress, and fee statuses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(atRiskStudents || []).map((student: any) => (
            <div key={student.studentId} className="bg-white border border-rose-200 rounded-2xl p-6 shadow-xs relative flex flex-col justify-between">
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{student.name}</h3>
                  <p className="text-xs font-mono text-slate-400 font-bold mt-0.5">{student.studentCode}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 font-black text-sm">
                  {student.risks.length}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {student.risks.map((risk: any, i: number) => {
                  const Icon = RISK_ICONS[risk.type] || AlertTriangle;
                  return (
                    <div key={i} className={`flex gap-3 items-start p-3 rounded-xl border ${RISK_COLORS[risk.level]}`}>
                      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-90 mb-0.5">{risk.type} RISK</div>
                        <div className="text-xs font-semibold leading-relaxed">{risk.message}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
                <Link href={`/dashboard/academy/students/${student.studentId}/passport`} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-center rounded-xl text-xs font-bold transition-colors">
                  View Passport
                </Link>
                <button className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-center rounded-xl text-xs font-bold transition-colors">
                  Contact Mentor
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
