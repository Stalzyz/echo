"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  Building2, Plus, Search, MoreVertical, LogIn, KeyRound, Eye, EyeOff,
  Send, CheckCircle2, AlertCircle, Loader2, X, Check, ExternalLink,
  ShieldCheck, ShieldX, Archive, Trash2, DollarSign, Globe, Download,
  Settings, Users, RefreshCw, TrendingUp, Activity, HardDrive, Clock,
  AlertTriangle, ChevronDown
} from "lucide-react"

interface Academy {
  id: string
  name: string
  slug: string
  domain: string
  portalUrl?: string
  status: string
  subscription: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  totalUsers: number
  studentsCount: number
  coursesCount: number
  staffCount?: number
  storageUsed?: string
  revenue: string
  createdAt: string
}

interface ProvisionStep {
  step: number
  name: string
  status: string
  details: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  ACTIVE:         { label: "Active",         color: "bg-emerald-100 text-emerald-900 border-emerald-300" },
  TRIAL:          { label: "Trial",          color: "bg-sky-100 text-sky-900 border-sky-300" },
  SUSPENDED:      { label: "Suspended",      color: "bg-rose-100 text-rose-900 border-rose-300" },
  PAST_DUE:       { label: "Past Due",       color: "bg-amber-100 text-amber-900 border-amber-300" },
  ARCHIVED:       { label: "Archived",       color: "bg-slate-100 text-slate-600 border-slate-300" },
  PENDING_SETUP:  { label: "Pending Setup",  color: "bg-violet-100 text-violet-900 border-violet-300" },
}

const PLAN_CONFIG: Record<string, string> = {
  FREE:       "bg-slate-100 text-slate-800 border-slate-200",
  STARTER:    "bg-sky-100 text-sky-900 border-sky-200",
  GROWTH:     "bg-teal-100 text-teal-900 border-teal-200",
  ENTERPRISE: "bg-purple-100 text-purple-900 border-purple-200",
}

export default function AcademiesManagementPage() {
  const { data: session, update: updateSession } = useSession()
  const router = useRouter()
  const [academies, setAcademies] = useState<Academy[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterPlan, setFilterPlan] = useState("ALL")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Provision Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [provisionSteps, setProvisionSteps] = useState<ProvisionStep[]>([])
  const [provisionResult, setProvisionResult] = useState<any>(null)
  const [showPasswordText, setShowPasswordText] = useState(false)

  const [form, setForm] = useState({
    name: "", slug: "", ownerName: "", ownerEmail: "", ownerPhone: "",
    adminPassword: "", subscription: "GROWTH", domain: "",
    sendCredentialsEmail: true, withDemoData: false
  })

  const fetchAcademies = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/v1/super-admin/academies")
      if (res.ok) {
        const data = await res.json()
        setAcademies(data.academies || [])
      } else {
        toast.error("Failed to load vendors directory")
      }
    } catch (err) {
      console.error("Error loading academies:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAcademies() }, [])

  useEffect(() => {
    const handler = () => setOpenMenuId(null)
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [])

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*"
    let res = ""
    for (let i = 0; i < 12; i++) res += chars.charAt(Math.floor(Math.random() * chars.length))
    return res
  }

  const filteredAcademies = academies.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      a.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
      a.domain.toLowerCase().includes(search.toLowerCase())
    const matchesPlan = filterPlan === "ALL" || a.subscription === filterPlan
    const matchesStatus = filterStatus === "ALL" || a.status === filterStatus
    return matchesSearch && matchesPlan && matchesStatus
  })

  const handleAddAcademy = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setProvisionSteps([
      { step: 1, name: "Tenant ID & Organization Profile", status: "RUNNING", details: "Creating tenant record..." },
      { step: 2, name: "Admin Account & Auth Profile", status: "PENDING", details: "" },
      { step: 3, name: "Roles & Permissions Matrix", status: "PENDING", details: "" },
      { step: 4, name: "LMS Workspace Initialization", status: "PENDING", details: "" },
      { step: 5, name: "CRM Pipeline & Lead Routing", status: "PENDING", details: "" },
      { step: 6, name: "Communication & Telephony Gateway", status: "PENDING", details: "" },
      { step: 7, name: "Finance & Fee Structure Setup", status: "PENDING", details: "" },
      { step: 8, name: "Tenant Workspace & Dashboard Binding", status: "PENDING", details: "" }
    ])
    try {
      const res = await fetch("/api/v1/super-admin/academies/provision", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setProvisionSteps(data.steps)
        setProvisionResult(data)
        toast.success(`Academy "${form.name}" provisioned!`)
        fetchAcademies()
      } else {
        toast.error(data.error || "Provisioning failed")
      }
    } catch (error: any) {
      toast.error(error.message || "Network error during provisioning")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/super-admin/academies/${id}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        toast.success(`Vendor status updated to ${newStatus}`)
        fetchAcademies()
      } else {
        toast.error("Failed to update status")
      }
    } catch {
      toast.error("Error updating status")
    }
  }

  const handleImpersonate = async (acad: Academy) => {
    try {
      toast.info(`Switching context to ${acad.name}...`)
      const res = await fetch("/api/v1/super-admin/academies/impersonate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ academyId: acad.id })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        await updateSession({
          organizationId: data.organization.id,
          tenantId: data.organization.id,
          impersonatedBySuperAdmin: true,
          originalSuperAdminId: data.originalSuperAdmin.id,
          role: session?.user?.role || "SUPER_ADMIN"
        })
        toast.success(`Now viewing as Admin for ${acad.name}`)
        window.location.href = "/dashboard"
      } else {
        toast.error(data.error || "Failed to enter tenant mode")
      }
    } catch {
      toast.error("Impersonation failed")
    }
  }

  const handleDeleteAcademy = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete "${name}"?\n\nThis will cascade delete all courses, batches, leads, students, and invoices. This action cannot be undone.`)) return

    try {
      toast.loading(`Permanently deleting "${name}"...`, { id: "del-acad" })
      const res = await fetch(`/api/v1/super-admin/academies/${id}`, {
        method: "DELETE"
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast.success(`"${name}" deleted permanently.`, { id: "del-acad" })
        fetchAcademies()
      } else {
        toast.error(data.error || "Failed to delete academy", { id: "del-acad" })
      }
    } catch (err: any) {
      toast.error(err.message || "Network error deleting academy", { id: "del-acad" })
    }
  }

  const handleCleanSlate = async () => {
    if (!confirm("⚠️ RESET TO CLEAN SLATE?\n\nThis will keep ONLY the pristine Demo Academy (Apex Coding Academy) connected to the landing page and delete all other dummy vendors and test data. Continue?")) return

    try {
      toast.loading("Executing Clean Slate purge...", { id: "clean-slate" })
      const res = await fetch("/api/v1/super-admin/academies/clean-slate", {
        method: "POST"
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast.success(data.message || "Clean slate complete!", { id: "clean-slate" })
        fetchAcademies()
      } else {
        toast.error(data.error || "Clean slate failed", { id: "clean-slate" })
      }
    } catch (err: any) {
      toast.error(err.message || "Network error during clean slate", { id: "clean-slate" })
    }
  }

  // Counts
  const counts = {
    total: academies.length,
    active: academies.filter(a => a.status === "ACTIVE").length,
    trial: academies.filter(a => a.status === "TRIAL").length,
    suspended: academies.filter(a => a.status === "SUSPENDED").length,
    pastDue: academies.filter(a => a.status === "PAST_DUE").length,
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">

      {/* Header */}
      <div className="flex-none pb-6 border-b border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-black uppercase tracking-widest border border-teal-200">
              ECHO PLATFORM · VENDOR MANAGEMENT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">Vendors & Tenants</h1>
          <p className="text-slate-600 mt-1 text-xs sm:text-sm font-semibold">
            Provision, manage, and control all tenant academies from this control plane.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCleanSlate}
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-xs"
            title="Purge dummy vendors and keep only the official Demo Academy"
          >
            <Trash2 className="w-4 h-4 text-rose-600" /> Clean Slate (Keep Only Demo)
          </button>
          <button
            onClick={() => {
              setForm({ name: "", slug: "", ownerName: "", ownerEmail: "", ownerPhone: "", adminPassword: generateRandomPassword(), subscription: "GROWTH", domain: "", sendCredentialsEmail: true, withDemoData: false })
              setProvisionSteps([])
              setProvisionResult(null)
              setIsAddModalOpen(true)
            }}
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 shrink-0" /> Provision New Vendor
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Vendors", value: counts.total, icon: Building2, color: "text-slate-700", bg: "bg-slate-100 border-slate-200" },
          { label: "Active", value: counts.active, icon: ShieldCheck, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
          { label: "Trial", value: counts.trial, icon: Clock, color: "text-sky-700", bg: "bg-sky-50 border-sky-200" },
          { label: "Suspended", value: counts.suspended, icon: ShieldX, color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
          { label: "Past Due", value: counts.pastDue, icon: AlertTriangle, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{s.label}</span>
                <div className={`p-1.5 rounded-lg border ${s.bg}`}><Icon className={`w-3.5 h-3.5 ${s.color}`} /></div>
              </div>
              <div className="text-2xl font-black text-slate-950 font-mono">{loading ? "—" : s.value}</div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search vendor, admin, email, domain..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none min-h-[44px]">
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="PAST_DUE">Past Due</option>
            <option value="ARCHIVED">Archived</option>
            <option value="PENDING_SETUP">Pending Setup</option>
          </select>
          <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none min-h-[44px]">
            <option value="ALL">All Plans</option>
            <option value="FREE">FREE</option>
            <option value="STARTER">STARTER</option>
            <option value="GROWTH">GROWTH</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
            <span className="text-sm font-bold">Loading Vendor Directory...</span>
          </div>
        ) : filteredAcademies.length === 0 ? (
          <div className="p-12 text-center text-slate-600 font-medium text-sm">No vendors found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-5">Vendor</th>
                  <th className="py-3.5 px-5">Admin</th>
                  <th className="py-3.5 px-5">Plan</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Students</th>
                  <th className="py-3.5 px-5 text-right">Staff</th>
                  <th className="py-3.5 px-5">Storage</th>
                  <th className="py-3.5 px-5">Domain</th>
                  <th className="py-3.5 px-5">Created</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAcademies.map(a => {
                  const statusCfg = STATUS_CONFIG[a.status] || STATUS_CONFIG["ACTIVE"]
                  const planCfg = PLAN_CONFIG[a.subscription] || PLAN_CONFIG["FREE"]
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {a.name.charAt(0)}
                          </div>
                          <div>
                            <Link href={`/dashboard/super-admin/academies/${a.id}`}
                              className="font-extrabold text-slate-950 hover:text-teal-700 transition-colors">
                              {a.name}
                            </Link>
                            <div className="text-[10px] text-slate-400 font-mono">/{a.slug || a.id.slice(0,8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900 text-xs">{a.ownerName}</div>
                        <div className="text-[11px] text-slate-500">{a.ownerEmail}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${planCfg}`}>
                          {a.subscription}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide border ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-extrabold text-slate-950 text-sm">{a.studentsCount.toLocaleString()}</td>
                      <td className="py-3.5 px-5 text-right font-bold text-slate-700 text-sm">{a.staffCount || a.totalUsers}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-1.5">
                          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-bold text-slate-700">{a.storageUsed || "—"}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <a href={a.portalUrl || `#`} target="_blank" rel="noreferrer"
                          className="text-[11px] font-mono text-teal-700 hover:underline flex items-center gap-1">
                          {a.portalUrl || `/w/${a.slug}`} <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-500 font-medium">{a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/dashboard/super-admin/academies/${a.id}`}
                            className="min-h-[36px] px-3 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                          <button onClick={() => handleImpersonate(a)}
                            className="min-h-[36px] px-3 py-1.5 bg-teal-700 text-white hover:bg-teal-800 rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1">
                            <LogIn className="w-3.5 h-3.5" /> Enter
                          </button>
                          {/* Actions Dropdown */}
                          <div className="relative" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setOpenMenuId(openMenuId === a.id ? null : a.id)}
                              className="min-h-[36px] min-w-[36px] flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-slate-600" />
                            </button>
                            {openMenuId === a.id && (
                              <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                                {[
                                  { label: "View Profile", icon: Eye, href: `/dashboard/super-admin/academies/${a.id}` },
                                  { label: "Edit Details", icon: Settings, href: `/dashboard/super-admin/academies/${a.id}?tab=overview` },
                                  { label: "Manage Users", icon: Users, href: `/dashboard/super-admin/academies/${a.id}?tab=users` },
                                  { label: "Billing & Plan", icon: DollarSign, href: `/dashboard/super-admin/academies/${a.id}?tab=subscription` },
                                  { label: "White Label", icon: Activity, href: `/dashboard/super-admin/academies/${a.id}?tab=whitelabel` },
                                  { label: "Domains & DNS", icon: Globe, href: `/dashboard/super-admin/academies/${a.id}?tab=domains` },
                                  { label: "Export Data", icon: Download, href: `/dashboard/super-admin/academies/${a.id}?tab=data` },
                                ].map(item => (
                                  <Link key={item.label} href={item.href}
                                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                    <item.icon className="w-3.5 h-3.5 text-slate-500" /> {item.label}
                                  </Link>
                                ))}
                                <div className="border-t border-slate-100 my-1" />
                                {a.status !== "SUSPENDED" ? (
                                  <button onClick={() => handleStatusChange(a.id, "SUSPENDED")}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
                                    <ShieldX className="w-3.5 h-3.5" /> Suspend Vendor
                                  </button>
                                ) : (
                                  <button onClick={() => handleStatusChange(a.id, "ACTIVE")}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Activate Vendor
                                  </button>
                                )}
                                <button onClick={() => handleStatusChange(a.id, "ARCHIVED")}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                                  <Archive className="w-3.5 h-3.5" /> Archive Vendor
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteAcademy(a.id, a.name)}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors text-left"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Permanent Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading ? (
          <div className="p-8 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-teal-700" />
            <span className="text-xs font-bold text-slate-500">Loading...</span>
          </div>
        ) : filteredAcademies.map(a => {
          const statusCfg = STATUS_CONFIG[a.status] || STATUS_CONFIG["ACTIVE"]
          const planCfg = PLAN_CONFIG[a.subscription] || PLAN_CONFIG["FREE"]
          return (
            <div key={a.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-black text-sm flex items-center justify-center">
                    {a.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-950 text-base leading-tight">{a.name}</h3>
                    <p className="text-xs text-slate-500">{a.ownerEmail}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase border ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div><span className="text-[10px] font-bold text-slate-500 block uppercase">Plan</span>
                  <span className={`font-extrabold px-1.5 py-0.5 rounded text-[10px] border ${planCfg}`}>{a.subscription}</span></div>
                <div><span className="text-[10px] font-bold text-slate-500 block uppercase">Students</span>
                  <span className="font-extrabold text-slate-900">{a.studentsCount}</span></div>
                <div><span className="text-[10px] font-bold text-slate-500 block uppercase">Staff</span>
                  <span className="font-extrabold text-slate-900">{a.staffCount || a.totalUsers}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`/dashboard/super-admin/academies/${a.id}`}
                  className="min-h-[44px] bg-slate-100 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-200">
                  <Eye className="w-4 h-4" /> View
                </Link>
                <button onClick={() => handleImpersonate(a)}
                  className="min-h-[44px] bg-teal-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5">
                  <LogIn className="w-4 h-4" /> Enter Tenant
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Provision Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden shrink-0" />
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-950">Provision New Vendor Tenant</h2>
                <p className="text-xs text-slate-600">Create isolated workspace, admin auth, LMS & CRM pipelines.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {provisionSteps.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Provisioning Pipeline</h3>
                    {provisionSteps.map(step => (
                      <div key={step.step} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 font-black text-slate-800 flex items-center justify-center text-xs">{step.step}</span>
                          <div>
                            <div className="font-extrabold text-slate-950">{step.name}</div>
                            {step.details && <div className="text-slate-600">{step.details}</div>}
                          </div>
                        </div>
                        {step.status === "RUNNING" ? <span className="px-2 py-1 rounded bg-sky-100 text-sky-900 font-extrabold flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> RUNNING</span>
                          : step.status === "SUCCESS" ? <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-900 font-extrabold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> DONE</span>
                          : step.status === "EXISTS" ? <span className="px-2 py-1 rounded bg-amber-100 text-amber-900 font-extrabold">VERIFIED</span>
                          : <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 font-bold">QUEUED</span>}
                      </div>
                    ))}
                  </div>
                  {provisionResult && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="font-black text-emerald-950 text-sm">Tenant Ready!</div>
                        <div className="text-emerald-800 text-xs">{provisionResult.admin?.email}</div>
                      </div>
                      <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-emerald-800 text-white font-black rounded-xl text-xs min-h-[44px]">Done</button>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAddAcademy} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-black text-slate-800 block mb-1">Academy Name *</label>
                      <input required placeholder="Apex Tech Academy" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[44px] outline-none focus:ring-2 focus:ring-teal-600" /></div>
                    <div><label className="text-xs font-black text-slate-800 block mb-1">Tenant Slug</label>
                      <input placeholder="apex-tech" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono min-h-[44px] outline-none focus:ring-2 focus:ring-teal-600" /></div>
                  </div>
                  <div><label className="text-xs font-black text-slate-800 block mb-1">Owner Admin Name *</label>
                    <input required placeholder="Dr. Suresh Raina" value={form.ownerName} onChange={e => setForm(p => ({ ...p, ownerName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[44px] outline-none focus:ring-2 focus:ring-teal-600" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-black text-slate-800 block mb-1">Admin Email *</label>
                      <input required type="email" placeholder="admin@academy.com" value={form.ownerEmail} onChange={e => setForm(p => ({ ...p, ownerEmail: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[44px] outline-none focus:ring-2 focus:ring-teal-600" /></div>
                    <div><label className="text-xs font-black text-slate-800 block mb-1">Owner Phone</label>
                      <input placeholder="+91 9876543210" value={form.ownerPhone} onChange={e => setForm(p => ({ ...p, ownerPhone: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[44px] outline-none focus:ring-2 focus:ring-teal-600" /></div>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-900 flex items-center gap-1.5"><KeyRound className="w-4 h-4 text-teal-700" /> Admin Password *</label>
                      <button type="button" onClick={() => setForm(p => ({ ...p, adminPassword: generateRandomPassword() }))} className="text-xs font-bold text-teal-800 hover:underline">Auto-Generate</button>
                    </div>
                    <div className="relative">
                      <input required type={showPasswordText ? "text" : "password"} value={form.adminPassword} onChange={e => setForm(p => ({ ...p, adminPassword: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono pr-10 min-h-[44px] outline-none" />
                      <button type="button" onClick={() => setShowPasswordText(!showPasswordText)} className="absolute right-3 top-3 text-slate-400"><Eye className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-black text-slate-800 block mb-1">Custom Domain</label>
                      <input placeholder="learn.academy.com" value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono min-h-[44px] outline-none" /></div>
                    <div><label className="text-xs font-black text-slate-800 block mb-1">Plan</label>
                      <select value={form.subscription} onChange={e => setForm(p => ({ ...p, subscription: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold min-h-[44px] outline-none">
                        <option value="FREE">FREE</option>
                        <option value="STARTER">STARTER</option>
                        <option value="GROWTH">GROWTH</option>
                        <option value="ENTERPRISE">ENTERPRISE</option>
                      </select></div>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <button type="submit" disabled={isSubmitting} className="w-full min-h-[48px] bg-teal-700 hover:bg-teal-800 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Run Provisioning Pipeline"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
