"use client"

import { useState } from "react"
import { 
  RefreshCw, Search, Filter, ShieldCheck, ArrowUpRight, 
  Calendar, Check, X, CreditCard, DollarSign, AlertCircle
} from "lucide-react"
import { toast } from "sonner"

interface Subscription {
  id: string
  academyName: string
  owner: string
  planName: string
  billingCycle: "MONTHLY" | "YEARLY"
  amount: number
  status: "ACTIVE" | "TRIAL" | "EXPIRED" | "CANCELLED"
  startDate: string
  renewalDate: string
  paymentStatus: "PAID" | "PENDING" | "FAILED"
}

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  { id: "sub-101", academyName: "Apex Tech Institute", owner: "Dr. Rajesh Kumar", planName: "ENTERPRISE", billingCycle: "YEARLY", amount: 99990, status: "ACTIVE", startDate: "2026-01-15", renewalDate: "2027-01-15", paymentStatus: "PAID" },
  { id: "sub-102", academyName: "Stark Photography Academy", owner: "Elena Rostova", planName: "GROWTH", billingCycle: "MONTHLY", amount: 2499, status: "ACTIVE", startDate: "2026-03-10", renewalDate: "2026-10-10", paymentStatus: "PAID" },
  { id: "sub-103", academyName: "Quantum Coding Labs", owner: "Vikram Malhotra", planName: "STARTER", billingCycle: "MONTHLY", amount: 999, status: "TRIAL", startDate: "2026-09-02", renewalDate: "2026-09-16", paymentStatus: "PENDING" },
  { id: "sub-104", academyName: "Global Civil Services Hub", owner: "Anjali Sharma", planName: "GROWTH", billingCycle: "YEARLY", amount: 24990, status: "ACTIVE", startDate: "2026-04-20", renewalDate: "2027-04-20", paymentStatus: "PAID" },
  { id: "sub-105", academyName: "DesignCraft Studio", owner: "Marco Rossi", planName: "STARTER", billingCycle: "MONTHLY", amount: 999, status: "EXPIRED", startDate: "2026-02-01", renewalDate: "2026-03-01", paymentStatus: "FAILED" },
]

export default function SubscriptionsLifecyclePage() {
  const [subs, setSubs] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filteredSubs = subs.filter(s => {
    const matchesSearch = s.academyName.toLowerCase().includes(search.toLowerCase()) || s.owner.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleModifyPlan = (id: string, academy: string) => {
    toast.info(`Opening Plan Upgrade/Downgrade dialog for ${academy}...`)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              GECHO SAAS SUBSCRIPTIONS
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Tenant Subscriptions Lifecycle</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Track active, trial, expired, and cancelled subscriptions, renewal dates & payment statuses.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search academy or owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Academy</th>
                <th className="py-4 px-6">Current Plan</th>
                <th className="py-4 px-6">Cycle</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Next Renewal</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSubs.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-slate-900">{s.academyName}</div>
                    <div className="text-xs text-slate-400">{s.owner}</div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                      {s.planName}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-mono text-xs font-bold text-slate-600">
                    {s.billingCycle}
                  </td>

                  <td className="py-4 px-6 font-mono font-bold text-slate-900">
                    ₹{s.amount.toLocaleString()}
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-700">
                    {s.renewalDate}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      s.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : s.status === "TRIAL"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      {s.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      s.paymentStatus === "PAID" ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                    }`}>
                      {s.paymentStatus}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleModifyPlan(s.id, s.academyName)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors"
                    >
                      Upgrade / Downgrade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
