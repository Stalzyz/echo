"use client"

import { useState } from  "react"
import { RefreshCw, Search, Filter, ShieldCheck, ArrowUpRight, Calendar, Check, X, CreditCard, DollarSign, AlertCircle, TrendingUp, Users, Building, ShieldAlert, CheckCircle2, ChevronRight } from  "lucide-react"
import { toast } from  "sonner"
import { useApi, fetchApi } from  "@/lib/useApi"
import { ModifySubscriptionModal } from  "./ModifySubscriptionModal"

interface Subscription {
  id: string
  academyId: string
  academyName: string
  slug?: string
  ownerEmail?: string
  plan: string
  billingCycle: string
  mrr: string
  students: number
  status: "ACTIVE" | "TRIAL" | "PAST_DUE" | "EXPIRED" | "CANCELLED"
  nextBillingDate?: string
  createdAt?: string
}

const FALLBACK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub-org-1",
    academyId: "org-1",
    academyName: "Apex Coding Academy",
    slug: "apex-code",
    ownerEmail: "director@apexcode.in",
    plan: "GROWTH",
    billingCycle: "Yearly Billed",
    mrr: "₹29,999/yr",
    students: 1420,
    status: "ACTIVE",
    nextBillingDate: "2026-11-15",
    createdAt: "2025-11-15"
  },
  {
    id: "sub-org-2",
    academyId: "org-2",
    academyName: "Quantum IAS Academy",
    slug: "quantum-ias",
    ownerEmail: "admin@quantumias.org",
    plan: "ENTERPRISE",
    billingCycle: "Yearly Billed",
    mrr: "₹69,999/yr",
    students: 4890,
    status: "ACTIVE",
    nextBillingDate: "2026-12-01",
    createdAt: "2025-12-01"
  },
  {
    id: "sub-org-3",
    academyId: "org-3",
    academyName: "Sunrise English Institute",
    slug: "sunrise-english",
    ownerEmail: "head@sunrise.edu",
    plan: "STARTER",
    billingCycle: "Yearly Billed",
    mrr: "₹14,999/yr",
    students: 210,
    status: "TRIAL",
    nextBillingDate: "2026-10-08",
    createdAt: "2026-09-24"
  }
]

export default function SubscriptionsLifecyclePage() {
  const { data, isLoading, error, mutate } = useApi<{ subscriptions: Subscription[] }>('/super-admin/subscriptions')
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false)

  // Use real data from API if available, else fall back gracefully
  const allSubs: Subscription[] = (data?.subscriptions && data.subscriptions.length > 0)
    ? data.subscriptions
    : FALLBACK_SUBSCRIPTIONS

  const filteredSubs = allSubs.filter(s => {
    const searchLower = search.toLowerCase()
    const matchesSearch = 
      (s.academyName || "").toLowerCase().includes(searchLower) ||
      (s.ownerEmail || "").toLowerCase().includes(searchLower) ||
      (s.plan || "").toLowerCase().includes(searchLower) ||
      (s.slug || "").toLowerCase().includes(searchLower)

    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Summary Metrics
  const activeCount = allSubs.filter(s => s.status === "ACTIVE").length
  const trialCount = allSubs.filter(s => s.status === "TRIAL").length
  const expiredCount = allSubs.filter(s => s.status === "EXPIRED" || s.status === "PAST_DUE" || s.status === "CANCELLED").length
  const totalStudents = allSubs.reduce((acc, s) => acc + (s.students || 0), 0)

  const handleOpenModifyModal = (sub: Subscription) => {
    setSelectedSub(sub)
    setIsModifyModalOpen(true)
  }

  const handleQuickStatusChange = async (sub: Subscription, newStatus: string) => {
    try {
      toast.loading(`Updating ${sub.academyName} status to ${newStatus}...`, { id: "status-update" })
      await fetchApi("/super-admin/subscriptions", {
        method: "PATCH",
        body: JSON.stringify({
          academyId: sub.academyId || sub.id.replace("sub-", ""),
          status: newStatus
        })
      })
      toast.success(`Updated status to ${newStatus}`, { id: "status-update" })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to update status", { id: "status-update" })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex-none pb-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              ECHO SAAS SUBSCRIPTIONS & LIFECYCLE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Tenant Subscriptions</h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium">Fail-proof lifecycle management: instant tier adjustments, status suspensions, and renewal monitoring.</p>
        </div>

        <button 
          onClick={() => {
            mutate()
            toast.success("Subscriptions refreshed")
          }}
          className="flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-600' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Tenants</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeCount}</div>
          <p className="text-[11px] text-emerald-700 font-bold mt-1">Live in production</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Trials</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{trialCount}</div>
          <p className="text-[11px] text-amber-700 font-bold mt-1">14-day evaluation</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">At Risk / Suspended</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{expiredCount}</div>
          <p className="text-[11px] text-rose-700 font-bold mt-1">Expired or Past-due</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Managed Students</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalStudents.toLocaleString()}</div>
          <p className="text-[11px] text-teal-700 font-bold mt-1">Across all academies</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search academy, owner email, or plan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Lifecycle Statuses</option>
            <option value="ACTIVE">Active (Live)</option>
            <option value="TRIAL">Trial Mode</option>
            <option value="PAST_DUE">Past Due</option>
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
                <th className="py-4 px-6">Academy / Tenant</th>
                <th className="py-4 px-6">Current Plan</th>
                <th className="py-4 px-6">Students Enrolled</th>
                <th className="py-4 px-6">Billing & Pricing</th>
                <th className="py-4 px-6">Next Renewal</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium text-xs">
                    No subscriptions match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubs.map(s => {
                  const planUpper = (s.plan || "STARTER").toUpperCase()
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-black text-xs shrink-0">
                            {s.academyName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">{s.academyName}</div>
                            <div className="text-xs text-slate-400 font-medium">{s.ownerEmail || (s.slug ? `${s.slug}.echolms.com` : 'No email')}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${
                          planUpper.includes("ENTERPRISE") 
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : planUpper.includes("GROWTH") || planUpper.includes("PRO")
                            ? "bg-teal-50 text-teal-800 border-teal-200"
                            : "bg-slate-100 text-slate-800 border-slate-200"
                        }`}>
                          {s.plan}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-700">
                        {s.students?.toLocaleString() || 0} students
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-slate-900">{s.mrr || "₹29,999/yr"}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{s.billingCycle || "Yearly Billed"}</div>
                      </td>

                      <td className="py-4 px-6 font-mono text-xs text-slate-700">
                        {s.nextBillingDate || "Annual Renewal"}
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

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModifyModal(s)}
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" /> Modify Tier
                          </button>

                          {s.status === "ACTIVE" ? (
                            <button
                              onClick={() => handleQuickStatusChange(s, "EXPIRED")}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors"
                              title="Suspend tenant access"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleQuickStatusChange(s, "ACTIVE")}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl transition-colors"
                              title="Reactivate full tenant access"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modify Modal */}
      {selectedSub && (
        <ModifySubscriptionModal
          isOpen={isModifyModalOpen}
          onClose={() => {
            setIsModifyModalOpen(false)
            setSelectedSub(null)
          }}
          subscription={selectedSub}
          onSuccess={() => {
            mutate()
          }}
        />
      )}

    </div>
  )
}
