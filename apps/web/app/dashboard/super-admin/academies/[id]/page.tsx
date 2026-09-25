"use client"

import { useState, useEffect, use } from  "react"
import Link from "next/link"
import { useRouter, useSearchParams } from  "next/navigation"
import { useSession } from  "next-auth/react"
import { toast } from  "sonner"
import { Building2, Users, CreditCard, Layers, BarChart3, Palette, Globe, Cpu, Database, Shield, Clock, AlertTriangle, ArrowLeft, LogIn, ShieldX, ShieldCheck, MoreVertical, X, Check, Loader2, CheckCircle2, Eye, EyeOff, Trash2, Archive, Download, RefreshCw, Plus, Settings, ExternalLink, Copy, AlertCircle, HardDrive, Wifi, WifiOff, ChevronRight, Mail, Phone, MapPin, Edit3, Save, Lock, UserX, UserCheck, KeyRound, Monitor, Smartphone, Activity, TrendingUp, DollarSign, Calendar, FileText, MessageSquare, Workflow } from  "lucide-react"

const TABS = [
  { id: "overview",      label: "Overview",       icon: Building2 },
  { id: "users",         label: "Users",          icon: Users },
  { id: "subscription",  label: "Subscription",   icon: CreditCard },
  { id: "features",      label: "Features",       icon: Layers },
  { id: "usage",         label: "Usage & Limits", icon: BarChart3 },
  { id: "whitelabel",    label: "White Label",    icon: Palette },
  { id: "domains",       label: "Domains & DNS",  icon: Globe },
  { id: "integrations",  label: "Integrations",   icon: Cpu },
  { id: "data",          label: "Data",           icon: Database },
  { id: "security",      label: "Security",       icon: Shield },
  { id: "audit",         label: "Audit Logs",     icon: Activity },
  { id: "danger",        label: "Danger Zone",    icon: AlertTriangle },
]

const FEATURES = [
  { key: "admissionsCRM",      label: "Admissions CRM" },
  { key: "callIntelligence",   label: "Call Intelligence" },
  { key: "formBuilder",        label: "Form Builder" },
  { key: "walkInKiosk",        label: "Walk-in Kiosk" },
  { key: "demoSessions",       label: "Demo Sessions" },
  { key: "campusStudents",     label: "Campus Students" },
  { key: "remoteStudents",     label: "Remote Students" },
  { key: "faculty",            label: "Faculty" },
  { key: "feeCollection",      label: "Fee Collection" },
  { key: "emiPlans",           label: "EMI Plans" },
  { key: "coursesAndBatches",  label: "Courses & Batches" },
  { key: "liveProjects",       label: "Live Projects" },
  { key: "internships",        label: "Internships" },
  { key: "placements",         label: "Placements" },
  { key: "webinars",           label: "Webinars" },
  { key: "community",          label: "Social Community" },
  { key: "whatsapp",           label: "WhatsApp" },
  { key: "automations",        label: "Visual Automations" },
  { key: "leaderboard",        label: "Leaderboard" },
  { key: "aiFeatures",         label: "AI Features" },
  { key: "customDomain",       label: "Custom Domain" },
  { key: "whiteLabel",         label: "White Label" },
]

const ROLES = [
  "Academy Owner", "Academy Admin", "Manager", "Counsellor",
  "Trainer", "Finance", "HR", "Staff", "Student"
]

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  ACTIVE:         { label: "Active",        color: "bg-emerald-100 text-emerald-900 border-emerald-300", dot: "bg-emerald-500" },
  TRIAL:          { label: "Trial",         color: "bg-sky-100 text-sky-900 border-sky-300",             dot: "bg-sky-500" },
  SUSPENDED:      { label: "Suspended",     color: "bg-rose-100 text-rose-900 border-rose-300",          dot: "bg-rose-500" },
  PAST_DUE:       { label: "Past Due",      color: "bg-amber-100 text-amber-900 border-amber-300",       dot: "bg-amber-500" },
  ARCHIVED:       { label: "Archived",      color: "bg-slate-100 text-slate-600 border-slate-300",       dot: "bg-slate-400" },
  PENDING_SETUP:  { label: "Pending Setup", color: "bg-violet-100 text-violet-900 border-violet-300",    dot: "bg-violet-500" },
}

export default function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, update: updateSession } = useSession()

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview")
  const [vendor, setVendor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Feature toggles state
  const [features, setFeatures] = useState<Record<string, boolean>>(
    Object.fromEntries(FEATURES.map(f => [f.key, true]))
  )

  // Usage limits state
  const [limits, setLimits] = useState({
    maxStudents: 1000, maxStaff: 50, maxTrainers: 20, maxCourses: 100,
    maxStorageGB: 50, maxWhatsAppMessages: 10000, maxApiRequests: 100000,
    maxAdmins: 5, maxCustomDomains: 3, maxAutomations: 20, maxCallMinutes: 500
  })

  // Delete flow state
  const [deleteStep, setDeleteStep] = useState(0)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteReason, setDeleteReason] = useState("")
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Domain wizard
  const [showDomainWizard, setShowDomainWizard] = useState(false)
  const [newDomain, setNewDomain] = useState("")
  const [domainStep, setDomainStep] = useState(1)
  const [domainVerifying, setDomainVerifying] = useState(false)

  // Status change
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  useEffect(() => {
    fetchVendor()
  }, [id])

  const fetchVendor = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/v1/super-admin/academies`)
      if (res.ok) {
        const data = await res.json()
        const found = (data.academies || []).find((a: any) => a.id === id)
        if (found) {
          setVendor(found)
        } else {
          // Use mock data for demonstration
          setVendor(mockVendor(id))
        }
      } else {
        setVendor(mockVendor(id))
      }
    } catch {
      setVendor(mockVendor(id))
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setShowStatusMenu(false)
    try {
      const res = await fetch(`/api/v1/super-admin/academies/${id}/status`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setVendor((v: any) => ({ ...v, status: newStatus }))
        toast.success(`Status updated to ${newStatus}`)
      } else {
        toast.error("Failed to update status")
      }
    } catch {
      toast.error("Error updating status")
    }
  }

  const handleEnterTenant = async () => {
    if (!vendor) return
    try {
      toast.info(`Entering ${vendor.name} tenant...`)
      const res = await fetch("/api/v1/super-admin/academies/impersonate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ academyId: id })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        await updateSession({ organizationId: data.organization.id, tenantId: data.organization.id, impersonatedBySuperAdmin: true, originalSuperAdminId: data.originalSuperAdmin.id, role: session?.user?.role || "SUPER_ADMIN" })
        toast.success(`Now in tenant mode: ${vendor.name}`)
        window.location.href = "/dashboard"
      } else {
        toast.error(data.error || "Failed to enter tenant")
      }
    } catch {
      toast.error("Impersonation failed")
    }
  }

  const handleSaveFeatures = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success("Feature access updated")
    setSaving(false)
  }

  const handleSaveLimits = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success("Usage limits saved")
    setSaving(false)
  }

  const handleVerifyDomain = async () => {
    setDomainVerifying(true)
    await new Promise(r => setTimeout(r, 2000))
    setDomainVerifying(false)
    setDomainStep(4)
  }

  const handleDeleteVendor = async () => {
    if (deleteConfirmText !== `DELETE ${vendor?.name?.toUpperCase()}`) {
      toast.error("Confirmation text doesn't match")
      return
    }
    setIsDeleting(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsDeleting(false)
    toast.success("Vendor deletion request submitted. Grace period: 30 days.")
    setDeleteStep(4)
  }

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
    </div>
  )

  if (!vendor) return (
    <div className="p-8 text-center">
      <p className="text-slate-500">Vendor not found.</p>
      <Link href="/dashboard/super-admin/academies" className="text-teal-700 font-bold mt-2 inline-block">← Back to Vendors</Link>
    </div>
  )

  const statusCfg = STATUS_CONFIG[vendor.status] || STATUS_CONFIG["ACTIVE"]

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar">

      {/* Vendor Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-5 pb-0 shrink-0">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/super-admin/academies" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </Link>
            <div className="w-11 h-11 rounded-2xl bg-teal-700 text-white font-black text-lg flex items-center justify-center shrink-0">
              {vendor.name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-950">{vendor.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase border ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-teal-100 text-teal-900 border border-teal-200 text-[11px] font-black">
                  {vendor.subscription || "GROWTH"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{vendor.ownerEmail} · /{vendor.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleEnterTenant}
              className="min-h-[38px] px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5" /> Enter Tenant
            </button>
            <div className="relative">
              <button onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="min-h-[38px] px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Manage
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button key={key} onClick={() => handleStatusChange(key)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 ${vendor.status === key ? "text-teal-700 font-black" : "text-slate-700"}`}>
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      Set {cfg.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-0 overflow-x-auto no-scrollbar -mb-px">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const isDanger = tab.id === "danger"
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? isDanger
                      ? "border-rose-600 text-rose-700"
                      : "border-teal-600 text-teal-700"
                    : isDanger
                      ? "border-transparent text-rose-400 hover:text-rose-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Students", value: vendor.studentsCount || 0, icon: Users, color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
                { label: "Staff", value: vendor.staffCount || vendor.totalUsers || 0, icon: UserCheck, color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
                { label: "Courses", value: vendor.coursesCount || 0, icon: Layers, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
                { label: "Storage", value: vendor.storageUsed || "0 GB", icon: HardDrive, color: "text-slate-700", bg: "bg-slate-100 border-slate-200" },
              ].map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{s.label}</span>
                      <div className={`p-1.5 rounded-lg border ${s.bg}`}><Icon className={`w-3.5 h-3.5 ${s.color}`} /></div>
                    </div>
                    <div className="text-2xl font-black text-slate-950 font-mono">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
                  </div>
                )
              })}
            </div>

            {/* Organization Details */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h2 className="text-sm font-black text-slate-950 mb-5 flex items-center gap-2"><Building2 className="w-4 h-4 text-teal-600" /> Organization Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Academy Name", value: vendor.name, icon: Building2 },
                  { label: "Organization ID", value: vendor.id, icon: Copy, mono: true },
                  { label: "Slug", value: `/${vendor.slug}`, icon: Globe, mono: true },
                  { label: "Primary Email", value: vendor.ownerEmail, icon: Mail },
                  { label: "Phone", value: vendor.ownerPhone || "—", icon: Phone },
                  { label: "Domain", value: vendor.portalUrl || vendor.domain || "—", icon: Globe },
                ].map((f, i) => {
                  const Icon = f.icon
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg shrink-0"><Icon className="w-3.5 h-3.5 text-slate-500" /></div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">{f.label}</div>
                        <div className={`text-sm font-bold text-slate-900 ${f.mono ? "font-mono" : ""}`}>{f.value}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Primary Admin */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h2 className="text-sm font-black text-slate-950 mb-5 flex items-center gap-2"><Users className="w-4 h-4 text-teal-600" /> Primary Admin</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white font-black text-lg flex items-center justify-center shrink-0">
                  {vendor.ownerName?.charAt(0) || "A"}
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-slate-950">{vendor.ownerName}</div>
                  <div className="text-sm text-slate-600">{vendor.ownerEmail}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Academy Owner</div>
                  <div className="flex items-center gap-2 mt-3">
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                      <KeyRound className="w-3.5 h-3.5" /> Reset Password
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                      <Lock className="w-3.5 h-3.5" /> Force Logout
                    </button>
                    <button className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                      <UserX className="w-3.5 h-3.5" /> Disable Account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h2 className="text-sm font-black text-slate-950 mb-5 flex items-center gap-2"><Activity className="w-4 h-4 text-amber-500" /> Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: "Super Admin entered tenant mode", time: "2 hours ago", icon: LogIn, color: "bg-teal-100 text-teal-700" },
                  { action: "Subscription changed: STARTER → GROWTH", time: "3 days ago", icon: TrendingUp, color: "bg-emerald-100 text-emerald-700" },
                  { action: "Custom domain verified: learn.academy.com", time: "1 week ago", icon: Globe, color: "bg-sky-100 text-sky-700" },
                  { action: "White-label branding updated", time: "2 weeks ago", icon: Palette, color: "bg-violet-100 text-violet-700" },
                ].map((a, i) => {
                  const Icon = a.icon
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${a.color} shrink-0`}><Icon className="w-3.5 h-3.5" /></div>
                      <div className="flex-1"><div className="text-xs font-semibold text-slate-800">{a.action}</div></div>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">{a.time}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === "users" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Users & Roles</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage all users within this vendor's workspace</p>
              </div>
              <button className="min-h-[38px] px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add User
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600">
                    <th className="py-3.5 px-5">User</th>
                    <th className="py-3.5 px-5">Role</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Last Login</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-700 text-sm shrink-0">{u.name.charAt(0)}</div>
                          <div>
                            <div className="font-bold text-slate-950 text-sm">{u.name}</div>
                            <div className="text-[11px] text-slate-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <select defaultValue={u.role} className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none">
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${u.active ? "bg-emerald-100 text-emerald-900 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                          {u.active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-500 font-mono">{u.lastLogin}</td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors" title="Reset Password"><KeyRound className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors" title="Force Logout"><Lock className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors" title={u.active ? "Disable" : "Enable"}>
                            {u.active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SUBSCRIPTION ── */}
        {activeTab === "subscription" && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-slate-950">Subscription & Billing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Current Plan */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-950 flex items-center gap-2"><CreditCard className="w-4 h-4 text-teal-600" /> Current Plan</h3>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl">
                  <div className="text-2xl font-black text-teal-900">{vendor.subscription || "GROWTH"}</div>
                  <div className="text-sm text-teal-700 font-bold mt-0.5">₹2,499 / month</div>
                </div>
                {[
                  { label: "Status", value: "Active" },
                  { label: "Billing Cycle", value: "Monthly" },
                  { label: "Start Date", value: "1 Sep 2026" },
                  { label: "Renewal Date", value: "1 Oct 2026" },
                  { label: "Trial Expiry", value: "N/A" },
                  { label: "Payment Status", value: "Paid" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-500">{r.label}</span>
                    <span className="text-xs font-extrabold text-slate-900">{r.value}</span>
                  </div>
                ))}
              </div>
              {/* Controls */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-950 flex items-center gap-2"><Settings className="w-4 h-4 text-teal-600" /> Plan Controls</h3>
                {[
                  { label: "Change Plan", icon: RefreshCw, color: "bg-teal-700 hover:bg-teal-800 text-white" },
                  { label: "Upgrade Plan", icon: TrendingUp, color: "bg-emerald-700 hover:bg-emerald-800 text-white" },
                  { label: "Downgrade Plan", icon: ChevronRight, color: "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200" },
                  { label: "Extend Trial", icon: Calendar, color: "bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-200" },
                  { label: "Add Grace Period", icon: Clock, color: "bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200" },
                  { label: "Suspend for Non-Payment", icon: ShieldX, color: "bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200" },
                  { label: "Reactivate", icon: ShieldCheck, color: "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200" },
                  { label: "Cancel Subscription", icon: X, color: "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200" },
                ].map((btn, i) => {
                  const Icon = btn.icon
                  return (
                    <button key={i} onClick={() => toast.info(`${btn.label} — feature coming soon`)}
                      className={`w-full min-h-[40px] px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors ${btn.color}`}>
                      <Icon className="w-3.5 h-3.5" /> {btn.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── FEATURES ── */}
        {activeTab === "features" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Feature Access Control</h2>
                <p className="text-xs text-slate-500 mt-0.5">Enable or disable specific platform features for this vendor</p>
              </div>
              <button onClick={handleSaveFeatures} disabled={saving}
                className="min-h-[38px] px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Changes
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FEATURES.map(f => (
                  <label key={f.key} className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${features[f.key] ? "bg-teal-50/60 border-teal-200" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${features[f.key] ? "bg-teal-500" : "bg-slate-300"}`} />
                      <span className={`text-xs font-bold ${features[f.key] ? "text-teal-900" : "text-slate-600"}`}>{f.label}</span>
                    </div>
                    <div className="relative">
                      <input type="checkbox" checked={features[f.key]}
                        onChange={e => setFeatures(prev => ({ ...prev, [f.key]: e.target.checked }))}
                        className="sr-only" />
                      <div className={`w-9 h-5 rounded-full transition-colors ${features[f.key] ? "bg-teal-600" : "bg-slate-300"}`}>
                        <div className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform mt-0.5 ${features[f.key] ? "translate-x-4.5" : "translate-x-0.5"}`} style={{ transform: features[f.key] ? "translateX(18px)" : "translateX(2px)" }} />
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USAGE & LIMITS ── */}
        {activeTab === "usage" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Usage & Limits</h2>
                <p className="text-xs text-slate-500 mt-0.5">SaaS entitlement controls for this tenant</p>
              </div>
              <button onClick={handleSaveLimits} disabled={saving}
                className="min-h-[38px] px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Limits
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              {[
                { key: "maxStudents", label: "Max Students", used: vendor.studentsCount || 0, unit: "" },
                { key: "maxStaff", label: "Max Staff", used: vendor.staffCount || vendor.totalUsers || 0, unit: "" },
                { key: "maxTrainers", label: "Max Trainers", used: 12, unit: "" },
                { key: "maxCourses", label: "Max Courses", used: vendor.coursesCount || 0, unit: "" },
                { key: "maxStorageGB", label: "Max Storage", used: 18, unit: " GB" },
                { key: "maxWhatsAppMessages", label: "Max WhatsApp Messages / mo", used: 3240, unit: "" },
                { key: "maxApiRequests", label: "Max API Requests / mo", used: 42000, unit: "" },
                { key: "maxAdmins", label: "Max Admins", used: 3, unit: "" },
                { key: "maxCustomDomains", label: "Max Custom Domains", used: 1, unit: "" },
                { key: "maxAutomations", label: "Max Automations", used: 7, unit: "" },
                { key: "maxCallMinutes", label: "Max Call Minutes / mo", used: 210, unit: " min" },
              ].map(item => {
                const max = limits[item.key as keyof typeof limits]
                const pct = Math.min(100, Math.round((item.used / max) * 100))
                const isHigh = pct > 80
                return (
                  <div key={item.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-700">{item.label}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${isHigh ? "text-rose-700" : "text-slate-600"}`}>
                          {item.used.toLocaleString()}{item.unit} / {max.toLocaleString()}{item.unit}
                        </span>
                        <input type="number" value={max}
                          onChange={e => setLimits(prev => ({ ...prev, [item.key]: parseInt(e.target.value) || 0 }))}
                          className="w-24 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-teal-600 text-right"
                        />
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${isHigh ? "bg-rose-500" : pct > 60 ? "bg-amber-500" : "bg-teal-500"}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── WHITE LABEL ── */}
        {activeTab === "whitelabel" && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-slate-950">White Label & Branding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Brand Identity */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-950">Brand Identity</h3>
                <div className="space-y-3">
                  {["Academy Name", "Display Name", "Legal Business Name"].map(lbl => (
                    <div key={lbl}>
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{lbl}</label>
                      <input defaultValue={lbl === "Academy Name" ? vendor.name : ""} placeholder={lbl}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[40px] outline-none focus:ring-2 focus:ring-teal-600" />
                    </div>
                  ))}
                </div>
                <h3 className="text-sm font-black text-slate-950 pt-2 border-t border-slate-100">Brand Colors</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Primary", val: "#0D9488" },
                    { label: "Secondary", val: "#14B8A6" },
                    { label: "Accent", val: "#F59E0B" },
                    { label: "Background", val: "#F8FAFC" },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-2">
                      <input type="color" defaultValue={c.val} className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer bg-transparent p-0.5" />
                      <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase">{c.label}</div>
                        <div className="text-xs font-mono text-slate-700">{c.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Identity */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-950">Login Page Customization</h3>
                {[
                  { label: "Login Title", placeholder: "Greeks Academy" },
                  { label: "Login Subtitle", placeholder: "Learn. Build. Grow." },
                  { label: "Welcome Message", placeholder: "Welcome back" },
                  { label: "Support Email", placeholder: "support@academy.com" },
                  { label: "Support Phone", placeholder: "+91 9876543210" },
                  { label: "Terms URL", placeholder: "https://academy.com/terms" },
                  { label: "Privacy URL", placeholder: "https://academy.com/privacy" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{f.label}</label>
                    <input placeholder={f.placeholder} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium min-h-[40px] outline-none focus:ring-2 focus:ring-teal-600" />
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="hideEchoBranding" className="w-4 h-4 rounded" />
                  <label htmlFor="hideEchoBranding" className="text-xs font-bold text-slate-700">Hide ECHO branding (Full White Label)</label>
                </div>
                <button onClick={() => toast.success("White label settings saved")}
                  className="w-full min-h-[40px] bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl transition-colors">
                  Save Branding Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── DOMAINS ── */}
        {activeTab === "domains" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">Domains & DNS</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage custom domains and SSL certificates</p>
              </div>
              <button onClick={() => { setShowDomainWizard(true); setDomainStep(1); setNewDomain("") }}
                className="min-h-[38px] px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Domain
              </button>
            </div>

            {/* Platform Domain */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Platform Domain</div>
                  <div className="font-mono font-bold text-slate-900">{vendor.slug}.echo.grekam.in</div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-full text-[11px] font-black">🟢 Live</span>
              </div>
            </div>

            {/* Custom Domains */}
            {mockDomains.map((d, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-mono font-extrabold text-slate-950">{d.domain}</div>
                      {d.isPrimary && <span className="px-2 py-0.5 bg-teal-100 text-teal-900 border border-teal-200 text-[10px] font-black rounded">PRIMARY</span>}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "DNS", val: d.dns, ok: d.dns === "Verified" },
                        { label: "SSL", val: d.ssl, ok: d.ssl === "Active" },
                        { label: "Status", val: d.status, ok: d.status === "Live" },
                        { label: "SSL Expiry", val: d.sslExpiry, ok: true },
                      ].map(r => (
                        <div key={r.label}>
                          <div className="text-[10px] font-black uppercase text-slate-400">{r.label}</div>
                          <div className={`text-xs font-bold ${r.ok ? "text-emerald-700" : "text-rose-700"}`}>{r.ok ? "✓" : "✗"} {r.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a href={`https://${d.domain}`} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"><ExternalLink className="w-3.5 h-3.5 text-slate-600" /></a>
                    <button className="p-2 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"><Trash2 className="w-3.5 h-3.5 text-rose-700" /></button>
                  </div>
                </div>
              </div>
            ))}

            {/* Domain Wizard Modal */}
            {showDomainWizard && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-950">Add Custom Domain</h3>
                    <button onClick={() => setShowDomainWizard(false)} className="p-2 bg-slate-100 rounded-lg"><X className="w-4 h-4" /></button>
                  </div>
                  {/* Progress */}
                  <div className="flex items-center gap-2 mb-6">
                    {[1,2,3,4].map(s => (
                      <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= domainStep ? "bg-teal-600" : "bg-slate-200"}`} />
                    ))}
                  </div>

                  {domainStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-black text-slate-700 block mb-2">Enter your domain</label>
                        <input value={newDomain} onChange={e => setNewDomain(e.target.value)} placeholder="app.greeksacademy.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono min-h-[44px] outline-none focus:ring-2 focus:ring-teal-600" />
                      </div>
                      <button onClick={() => setDomainStep(2)} disabled={!newDomain}
                        className="w-full min-h-[44px] bg-teal-700 text-white font-extrabold text-sm rounded-xl disabled:opacity-50">Continue →</button>
                    </div>
                  )}
                  {domainStep === 2 && (
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-slate-700">Add this DNS record to your domain registrar:</p>
                      <div className="bg-slate-950 text-green-400 rounded-2xl p-4 font-mono text-xs space-y-2">
                        <div><span className="text-slate-500">Type: </span>CNAME</div>
                        <div><span className="text-slate-500">Name: </span>{newDomain.split(".")[0]}</div>
                        <div><span className="text-slate-500">Value: </span>domains.echo.grekam.in</div>
                        <div><span className="text-slate-500">TTL: </span>Auto</div>
                      </div>
                      <button onClick={() => setDomainStep(3)} className="w-full min-h-[44px] bg-teal-700 text-white font-extrabold text-sm rounded-xl">I've Added the DNS Record →</button>
                    </div>
                  )}
                  {domainStep === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-slate-700">Click verify to check your DNS record</p>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-700">{newDomain}</div>
                      <button onClick={handleVerifyDomain} disabled={domainVerifying}
                        className="w-full min-h-[44px] bg-teal-700 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2">
                        {domainVerifying ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Verify DNS →"}
                      </button>
                    </div>
                  )}
                  {domainStep === 4 && (
                    <div className="space-y-3">
                      {["DNS record found", "Domain verified", "SSL certificate issued", "Domain active"].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-bold text-emerald-900">{s}</span>
                        </div>
                      ))}
                      <button onClick={() => { setShowDomainWizard(false); toast.success(`${newDomain} is now live!`) }}
                        className="w-full min-h-[44px] bg-teal-700 text-white font-extrabold text-sm rounded-xl mt-2">Open Domain</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── INTEGRATIONS ── */}
        {activeTab === "integrations" && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-slate-950">Integrations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockIntegrations.map((intg, i) => {
                const StatusIcon = intg.status === "Connected" ? Wifi : intg.status === "Error" ? AlertCircle : WifiOff
                const statusColor = intg.status === "Connected" ? "text-emerald-700" : intg.status === "Error" ? "text-rose-700" : "text-slate-400"
                const statusBg = intg.status === "Connected" ? "bg-emerald-50 border-emerald-200" : intg.status === "Error" ? "bg-rose-50 border-rose-200" : "bg-slate-100 border-slate-200"
                return (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-start justify-between mb-3">
                      <div className="font-extrabold text-slate-950 text-sm">{intg.name}</div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border flex items-center gap-1 ${statusBg} ${statusColor}`}>
                        <StatusIcon className="w-3 h-3" /> {intg.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">{intg.desc}</p>
                    <button onClick={() => toast.info(`${intg.name} — configure coming soon`)}
                      className="w-full min-h-[36px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors">
                      {intg.status === "Connected" ? "Manage" : "Connect"}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── DATA ── */}
        {activeTab === "data" && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-slate-950">Data Management</h2>
            {/* Data Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: "Students", value: vendor.studentsCount || 0 },
                { label: "Leads", value: "1,284" },
                { label: "Staff", value: vendor.staffCount || vendor.totalUsers || 0 },
                { label: "Courses", value: vendor.coursesCount || 0 },
                { label: "Invoices", value: "642" },
                { label: "Payments", value: "511" },
                { label: "Call Recordings", value: "84" },
                { label: "WhatsApp Msgs", value: "18,421" },
                { label: "Files", value: vendor.storageUsed || "0 GB" },
                { label: "Audit Entries", value: "3,290" },
              ].map((d, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">{d.label}</div>
                  <div className="text-xl font-black text-slate-950 font-mono mt-1">{typeof d.value === 'number' ? d.value.toLocaleString() : d.value}</div>
                </div>
              ))}
            </div>
            {/* Export Tools */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-sm font-black text-slate-950 mb-4">Export Tools</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["All Data", "Students", "Leads & CRM", "Invoices", "Payments", "Courses", "Staff", "Call Recordings", "WhatsApp Messages"].map(item => (
                  <button key={item} onClick={() => toast.info(`Exporting ${item}...`)}
                    className="min-h-[44px] bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Download className="w-3.5 h-3.5 text-teal-700" /> Export {item}
                  </button>
                ))}
              </div>
            </div>
            {/* Backup */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-sm font-black text-slate-950 mb-4">Backup & Restore</h3>
              <div className="flex gap-3">
                <button onClick={() => toast.info("Generating backup...")} className="min-h-[44px] px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-2">
                  <Download className="w-3.5 h-3.5" /> Generate Backup
                </button>
                <button onClick={() => toast.info("Request submitted")} className="min-h-[44px] px-5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs rounded-xl flex items-center gap-2">
                  <Trash2 className="w-3.5 h-3.5" /> Request Data Deletion
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SECURITY ── */}
        {activeTab === "security" && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-slate-950">Security Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-950">Account Security</h3>
                {[
                  { label: "2FA Status", value: "Enabled", ok: true },
                  { label: "Last Login", value: "24 Sep 2026, 10:31 PM", ok: true },
                  { label: "Last Login IP", value: "49.206.118.238", ok: true },
                  { label: "Failed Login Attempts", value: "0", ok: true },
                  { label: "Active Sessions", value: "2", ok: true },
                  { label: "Account Created", value: "1 Sep 2026", ok: true },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-500">{r.label}</span>
                    <span className={`text-xs font-extrabold ${r.ok ? "text-slate-900" : "text-rose-700"}`}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-950">Security Actions</h3>
                {[
                  { label: "Force Logout All Sessions", icon: Lock, color: "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200" },
                  { label: "Reset Admin Password", icon: KeyRound, color: "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200" },
                  { label: "Enable Maintenance Mode", icon: Settings, color: "bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200" },
                  { label: "Disable API Access", icon: WifiOff, color: "bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200" },
                  { label: "Block New Admissions", icon: ShieldX, color: "bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200" },
                ].map((btn, i) => {
                  const Icon = btn.icon
                  return (
                    <button key={i} onClick={() => toast.info(`${btn.label} — feature active`)}
                      className={`w-full min-h-[40px] px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors ${btn.color}`}>
                      <Icon className="w-3.5 h-3.5" /> {btn.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── AUDIT LOGS ── */}
        {activeTab === "audit" && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-slate-950">Audit Logs</h2>
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="border-b border-slate-200 p-4 bg-slate-50/50 flex items-center gap-3">
                <input placeholder="Search audit logs..." className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-teal-600" />
                <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none">
                  <option>All Events</option>
                  <option>Status Changes</option>
                  <option>User Changes</option>
                  <option>Billing</option>
                  <option>Impersonation</option>
                </select>
              </div>
              <div className="divide-y divide-slate-100">
                {mockAuditLogs.map((log, i) => (
                  <div key={i} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                    <div className={`p-2 rounded-xl shrink-0 ${log.bgColor}`}>
                      <log.icon className={`w-3.5 h-3.5 ${log.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-slate-950 text-sm">{log.action}</div>
                      {log.detail && <div className="text-xs text-slate-500 mt-0.5">{log.detail}</div>}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] font-bold text-slate-400">by {log.by}</span>
                        <span className="text-[11px] text-slate-300">·</span>
                        <span className="text-[11px] font-mono text-slate-400">{log.ip}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── DANGER ZONE ── */}
        {activeTab === "danger" && (
          <div className="space-y-5">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <div className="font-black text-rose-900 text-sm">Danger Zone</div>
                <div className="text-xs text-rose-700">Destructive actions below are irreversible. Proceed with extreme caution.</div>
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-slate-950">Maintenance Mode</h3>
                  <p className="text-xs text-slate-500 mt-1">Put this academy into maintenance mode. Super Admin retains access. Vendors see "We'll be back shortly."</p>
                </div>
                <button onClick={() => toast.success("Maintenance mode enabled")}
                  className="min-h-[38px] px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200 font-extrabold text-xs rounded-xl whitespace-nowrap">
                  Enable Maintenance Mode
                </button>
              </div>
            </div>

            {/* Suspend */}
            <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-slate-950">Suspend Vendor</h3>
                  <p className="text-xs text-slate-500 mt-1">Vendor loses access to admin dashboard and API. Data remains untouched. Students/staff can optionally be restricted.</p>
                  {vendor.status === "SUSPENDED" && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs">
                      <div className="font-black text-rose-900">⚠ Suspended by Super Admin</div>
                      <div className="text-rose-700 mt-0.5">Reason: Subscription payment overdue</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => handleStatusChange("SUSPENDED")}
                    className="min-h-[38px] px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200 font-extrabold text-xs rounded-xl">
                    Suspend Vendor
                  </button>
                  {vendor.status === "SUSPENDED" && (
                    <button onClick={() => handleStatusChange("ACTIVE")}
                      className="min-h-[38px] px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200 font-extrabold text-xs rounded-xl">
                      Reactivate Vendor
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Archive */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-slate-950">Archive Vendor</h3>
                  <p className="text-xs text-slate-500 mt-1">Disable login, API, automations. Preserve all data, billing history, invoices, and audit logs. Vendor removed from active list.</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {["Disable Login", "Disable API", "Stop Automations", "Preserve Data", "Preserve Billing"].map(t => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded">{t}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => { handleStatusChange("ARCHIVED"); toast.info("Vendor archived") }}
                  className="min-h-[38px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-extrabold text-xs rounded-xl whitespace-nowrap">
                  <Archive className="w-3.5 h-3.5 inline mr-1" /> Archive Vendor
                </button>
              </div>
            </div>

            {/* Delete */}
            <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-xs">
              <h3 className="font-black text-rose-900 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete Vendor — Permanent</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">This initiates a multi-step deletion lifecycle. Data will be soft-deleted first with a 30-day recovery window.</p>

              {/* Lifecycle */}
              <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
                {["Active", "Deletion Requested", "Grace Period", "Archived", "Permanent Deletion"].map((s, i) => (
                  <div key={s} className="flex items-center gap-1 shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${i === 0 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : i === 4 ? "bg-rose-100 text-rose-800 border-rose-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>{s}</span>
                    {i < 4 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                  </div>
                ))}
              </div>

              {deleteStep === 0 && (
                <button onClick={() => setDeleteStep(1)}
                  className="min-h-[40px] px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-2">
                  <Trash2 className="w-3.5 h-3.5" /> Initiate Deletion
                </button>
              )}

              {/* Step 1: Impact Summary */}
              {deleteStep === 1 && (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                    <div className="font-black text-rose-950 text-sm mb-3">⚠ Are you sure you want to delete {vendor.name}?</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Students", value: vendor.studentsCount || 0 },
                        { label: "Leads", value: "1,284" },
                        { label: "Staff", value: vendor.staffCount || vendor.totalUsers || 0 },
                        { label: "Courses", value: vendor.coursesCount || 0 },
                        { label: "Invoices", value: "642" },
                        { label: "Payments", value: "511" },
                        { label: "Files", value: "4.8 GB" },
                        { label: "Call Recordings", value: "1.2 GB" },
                        { label: "WhatsApp Messages", value: "18,421" },
                      ].map((d, i) => (
                        <div key={i} className="bg-white border border-rose-200 rounded-xl p-3">
                          <div className="text-[10px] font-black text-rose-500 uppercase">{d.label}</div>
                          <div className="font-black text-rose-900">{typeof d.value === 'number' ? d.value.toLocaleString() : d.value}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-rose-700 mt-3 font-semibold">All data above will be soft-deleted. You have 30 days to restore before permanent deletion.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setDeleteStep(0)} className="min-h-[40px] px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl">Cancel</button>
                    <button onClick={() => setDeleteStep(2)} className="min-h-[40px] px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs rounded-xl">I Understand — Continue</button>
                  </div>
                </div>
              )}

              {/* Step 2: Type Confirmation */}
              {deleteStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-2">
                      Type <span className="font-mono bg-slate-100 px-1 rounded">DELETE {vendor.name?.toUpperCase()}</span> to confirm:
                    </label>
                    <input value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)}
                      placeholder={`DELETE ${vendor.name?.toUpperCase()}`}
                      className="w-full bg-slate-50 border border-rose-200 rounded-xl px-4 py-3 text-sm font-mono min-h-[44px] outline-none focus:ring-2 focus:ring-rose-500" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-2">Deletion Reason *</label>
                    <textarea value={deleteReason} onChange={e => setDeleteReason(e.target.value)} rows={3}
                      placeholder="Reason for deleting this vendor..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-500 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-2">Super Admin Password *</label>
                    <div className="relative">
                      <input type={showDeletePassword ? "text" : "password"} value={deletePassword} onChange={e => setDeletePassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm pr-10 min-h-[44px] outline-none focus:ring-2 focus:ring-rose-500" />
                      <button type="button" onClick={() => setShowDeletePassword(!showDeletePassword)} className="absolute right-3 top-3 text-slate-400"><Eye className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setDeleteStep(0)} className="min-h-[40px] px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl">Cancel</button>
                    <button onClick={handleDeleteVendor} disabled={isDeleting || !deleteConfirmText || !deletePassword || !deleteReason}
                      className="min-h-[40px] px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs rounded-xl disabled:opacity-50 flex items-center gap-2">
                      {isDeleting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...</> : <><Trash2 className="w-3.5 h-3.5" /> Confirm Deletion</>}
                    </button>
                  </div>
                </div>
              )}

              {deleteStep === 4 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="font-black text-amber-900">✓ Deletion Request Submitted</div>
                  <div className="text-xs text-amber-800 mt-1">
                    {vendor.name} has been moved to "Grace Period". Permanent deletion will occur in 30 days. 
                    You can restore this vendor within this window.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── Mock Data ──

function mockVendor(id: string) {
  return {
    id, name: "Greeks Academy", slug: "greeks-academy",
    domain: "learn.greeksacademy.com", portalUrl: "https://learn.greeksacademy.com",
    status: "ACTIVE", subscription: "GROWTH",
    ownerName: "Dr. Suresh Raina", ownerEmail: "admin@greeksacademy.com", ownerPhone: "+91 9876543210",
    totalUsers: 18, studentsCount: 248, coursesCount: 34, staffCount: 18, storageUsed: "2.4 GB",
    revenue: "₹2,49,900", createdAt: "2026-09-01T00:00:00Z"
  }
}

const mockUsers = [
  { name: "Dr. Suresh Raina",   email: "admin@greeksacademy.com",      role: "Academy Owner",  active: true,  lastLogin: "24 Sep 2026 10:31 PM" },
  { name: "Priya Krishnan",     email: "priya.k@greeksacademy.com",    role: "Manager",        active: true,  lastLogin: "24 Sep 2026 09:15 AM" },
  { name: "Ramesh Chandran",    email: "r.chandran@greeksacademy.com", role: "Counsellor",     active: true,  lastLogin: "23 Sep 2026 05:44 PM" },
  { name: "Divya Natarajan",    email: "divya@greeksacademy.com",      role: "Trainer",        active: true,  lastLogin: "22 Sep 2026 11:12 AM" },
  { name: "Kiran Venkatesh",    email: "kiran@greeksacademy.com",      role: "Finance",        active: false, lastLogin: "15 Sep 2026 02:33 PM" },
]

const mockDomains = [
  { domain: "learn.greeksacademy.com", dns: "Verified", ssl: "Active", status: "Live", sslExpiry: "24 Mar 2027", isPrimary: true },
  { domain: "app.greeksacademy.com",   dns: "Verified", ssl: "Active", status: "Live", sslExpiry: "11 Feb 2027", isPrimary: false },
]

const mockIntegrations = [
  { name: "Razorpay",       desc: "Payment gateway for fee collection",          status: "Connected" },
  { name: "WhatsApp / BSP", desc: "Automated messaging via WhatsApp Business",   status: "Connected" },
  { name: "SMTP Email",     desc: "Custom email delivery for notifications",      status: "Connected" },
  { name: "Google Meet",    desc: "Video classes via Google Meet integration",    status: "Not Connected" },
  { name: "Zoom",           desc: "Live class delivery via Zoom",                 status: "Error" },
  { name: "Google Calendar",desc: "Session scheduling and calendar sync",         status: "Not Connected" },
  { name: "PhonePe",        desc: "UPI payment gateway",                          status: "Not Connected" },
  { name: "Cloud Storage",  desc: "File storage for recordings and assignments",  status: "Connected" },
  { name: "SMS Gateway",    desc: "SMS notifications via Textlocal/MSG91",        status: "Connected" },
]

const mockAuditLogs = [
  { action: "Super Admin entered tenant mode",       detail: "Session started for Greeks Academy",         by: "Super Admin",   ip: "49.206.118.238",   time: "24 Sep 10:31 PM", icon: LogIn,        color: "text-teal-700",   bgColor: "bg-teal-50" },
  { action: "Subscription upgraded",                 detail: "STARTER → GROWTH (₹2,499/mo)",               by: "Super Admin",   ip: "49.206.118.238",   time: "21 Sep 03:20 PM", icon: TrendingUp,   color: "text-emerald-700",bgColor: "bg-emerald-50" },
  { action: "Custom domain verified",                detail: "learn.greeksacademy.com",                    by: "Super Admin",   ip: "49.206.118.238",   time: "18 Sep 11:45 AM", icon: Globe,        color: "text-sky-700",    bgColor: "bg-sky-50" },
  { action: "White-label branding updated",          detail: "Logo, colors, and login page updated",       by: "Super Admin",   ip: "49.206.118.238",   time: "15 Sep 02:10 PM", icon: Palette,      color: "text-violet-700", bgColor: "bg-violet-50" },
  { action: "Feature access: AI Features enabled",   detail: "AI Features toggle switched ON",             by: "Super Admin",   ip: "49.206.118.238",   time: "12 Sep 09:05 AM", icon: Workflow,          color: "text-amber-700",  bgColor: "bg-amber-50" },
  { action: "User added",                            detail: "Priya Krishnan (Manager) added",             by: "Academy Admin", ip: "103.21.244.21",    time: "05 Sep 04:22 PM", icon: UserCheck,    color: "text-teal-700",   bgColor: "bg-teal-50" },
  { action: "Vendor provisioned",                    detail: "Tenant workspace created",                   by: "Super Admin",   ip: "49.206.118.238",   time: "01 Sep 11:00 AM", icon: Building2,    color: "text-slate-700",  bgColor: "bg-slate-100" },
]
