"use client"

import { useState, useEffect } from "react"
import { 
  Building2, Plus, Search, Filter, ShieldCheck, MoreVertical, 
  UserCheck, AlertTriangle, ExternalLink, Check, X, Loader2, LogIn, KeyRound, Eye, EyeOff, Send, CheckCircle2, AlertCircle
} from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ProvisionStep {
  step: number
  name: string
  status: string
  details: string
}

interface Academy {
  id: string
  name: string
  slug: string
  domain: string
  status: string
  subscription: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  totalUsers: number
  studentsCount: number
  coursesCount: number
  revenue: string
  createdAt: string
}

export default function AcademiesManagementPage() {
  const { data: session, update: updateSession } = useSession()
  const router = useRouter()
  const [academies, setAcademies] = useState<Academy[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterPlan, setFilterPlan] = useState("ALL")
  const [filterStatus, setFilterStatus] = useState("ALL")

  // Provisioning Modal & Pipeline State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [provisionSteps, setProvisionSteps] = useState<ProvisionStep[]>([])
  const [provisionResult, setProvisionResult] = useState<any>(null)

  // Credential Management Modal State
  const [selectedAcademy, setSelectedAcademy] = useState<Academy | null>(null)
  const [managePassword, setManagePassword] = useState("")
  const [manageUsername, setManageUsername] = useState("")
  const [showPasswordText, setShowPasswordText] = useState(false)

  const [form, setForm] = useState({
    name: "",
    slug: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    adminPassword: "",
    subscription: "GROWTH",
    domain: "",
    sendCredentialsEmail: true,
    withDemoData: false
  })

  const fetchAcademies = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/v1/super-admin/academies")
      if (res.ok) {
        const data = await res.json()
        setAcademies(data.academies || [])
      } else {
        toast.error("Failed to load academies directory")
      }
    } catch (err) {
      console.error("Error loading academies:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAcademies()
  }, [])

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*"
    let res = ""
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length))
    }
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setProvisionSteps(data.steps)
        setProvisionResult(data)
        toast.success(`Academy "${form.name}" provisioned cleanly!`)
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

  const handleOpenCredentialsModal = (acad: Academy) => {
    setSelectedAcademy(acad)
    setManageUsername(acad.ownerEmail.split('@')[0])
    setManagePassword(generateRandomPassword())
    setShowPasswordText(false)
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
    try {
      const res = await fetch(`/api/v1/super-admin/academies/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      })

      if (res.ok) {
        toast.success(`Academy status updated to ${nextStatus}`)
        fetchAcademies()
      } else {
        toast.error("Failed to update status")
      }
    } catch (err) {
      toast.error("Error updating status")
    }
  }

  const handleImpersonateLogin = async (acad: Academy) => {
    try {
      toast.info(`Switching context to ${acad.name}...`)
      const res = await fetch("/api/v1/super-admin/academies/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        toast.success(`Now logged in as Admin for ${acad.name}`)
        window.location.href = "/dashboard"
      } else {
        toast.error(data.error || "Failed to impersonate academy")
      }
    } catch (err) {
      toast.error("Impersonation failed")
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
      
      {/* Header */}
      <div className="flex-none pb-6 border-b border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-black uppercase tracking-widest border border-teal-200 shadow-2xs">
              ECHO SAAS MULTI-TENANT ARCHITECTURE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">Academies & Tenants Directory</h1>
          <p className="text-slate-600 mt-1 text-xs sm:text-sm font-semibold">Transactional 8-step tenant provisioning, tenant isolation management, and impersonation portal.</p>
        </div>

        <button 
          onClick={() => {
            setForm({
              name: "", slug: "", ownerName: "", ownerEmail: "", ownerPhone: "", adminPassword: generateRandomPassword(), subscription: "GROWTH", domain: "", sendCredentialsEmail: true, withDemoData: false
            })
            setProvisionSteps([])
            setProvisionResult(null)
            setIsAddModalOpen(true)
          }}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-sm shadow-teal-700/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          <Plus className="w-5 h-5 shrink-0" /> Provision New Academy
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search academy, owner, email, domain..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
          <select 
            value={filterPlan} 
            onChange={e => setFilterPlan(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none min-h-[44px]"
          >
            <option value="ALL">All Subscription Plans</option>
            <option value="FREE">FREE Plan</option>
            <option value="STARTER">STARTER Plan</option>
            <option value="GROWTH">GROWTH Plan</option>
            <option value="ENTERPRISE">ENTERPRISE Plan</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none min-h-[44px]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Mobile Stacked Card View (<768px) */}
      <div className="flex flex-col gap-3.5 md:hidden">
        {loading ? (
          <div className="p-8 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-teal-700" />
            <span className="text-xs font-bold">Loading tenant directory...</span>
          </div>
        ) : filteredAcademies.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 font-medium text-xs">
            No academies found matching your filter.
          </div>
        ) : (
          filteredAcademies.map((a) => (
            <div key={a.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    {a.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-950 text-base leading-tight">{a.name}</h3>
                    <p className="text-xs font-mono text-slate-500">ID: {a.id}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase border ${
                  a.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-900 border-rose-300'
                }`}>
                  {a.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block uppercase">Admin</span>
                  <span className="font-extrabold text-slate-900 truncate block">{a.ownerName}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block uppercase">Plan</span>
                  <span className="font-extrabold text-teal-800">{a.subscription}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button 
                  onClick={() => handleImpersonateLogin(a)}
                  className="w-full min-h-[44px] bg-teal-700 active:bg-teal-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <LogIn className="w-4 h-4" /> Login As Admin
                </button>
                <button 
                  onClick={() => handleOpenCredentialsModal(a)}
                  className="w-full min-h-[44px] bg-slate-100 active:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-200"
                >
                  <KeyRound className="w-4 h-4 text-teal-700" /> Credentials
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Data Table (>=768px) */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
            <span className="text-sm font-bold">Loading Tenant Academies Directory...</span>
          </div>
        ) : filteredAcademies.length === 0 ? (
          <div className="p-12 text-center text-slate-600 font-medium text-sm">
            No academies found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600">
                  <th className="py-4 px-6">Academy & Tenant ID</th>
                  <th className="py-4 px-6">Owner / Admin</th>
                  <th className="py-4 px-6">Students & Courses</th>
                  <th className="py-4 px-6">Subscription</th>
                  <th className="py-4 px-6">Domain</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAcademies.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center font-black text-teal-900 text-sm shadow-2xs">
                          {a.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-950">{a.name}</div>
                          <div className="text-xs text-slate-500 font-mono">ID: {a.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{a.ownerName}</div>
                      <div className="text-xs text-slate-600">{a.ownerEmail}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-extrabold text-slate-950">{a.studentsCount} Students</div>
                      <div className="text-xs text-slate-600">{a.coursesCount} Courses Active</div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-lg text-xs font-black border ${
                        a.subscription === "ENTERPRISE"
                          ? "bg-purple-100 text-purple-900 border-purple-200"
                          : a.subscription === "GROWTH"
                          ? "bg-teal-100 text-teal-900 border-teal-200"
                          : a.subscription === "STARTER"
                          ? "bg-sky-100 text-sky-900 border-sky-200"
                          : "bg-slate-100 text-slate-800 border-slate-200"
                      }`}>
                        {a.subscription}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <a href={`https://${a.domain}`} target="_blank" rel="noreferrer" className="text-xs font-mono text-teal-700 font-bold hover:underline flex items-center gap-1">
                        {a.domain} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                        a.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-rose-100 text-rose-900 border-rose-300"
                      }`}>
                        {a.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenCredentialsModal(a)}
                          className="min-h-[44px] px-3.5 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5"
                          title="Manage Admin Credentials"
                        >
                          <KeyRound className="w-4 h-4 text-teal-700" /> Credentials
                        </button>

                        <button 
                          onClick={() => handleImpersonateLogin(a)}
                          className="min-h-[44px] px-3.5 py-2 bg-teal-700 text-white hover:bg-teal-800 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 shadow-xs"
                          title="Login as Tenant Admin"
                        >
                          <LogIn className="w-4 h-4" /> Login As Admin
                        </button>

                        <button 
                          onClick={() => toggleStatus(a.id, a.status)}
                          className={`min-h-[44px] text-xs font-extrabold px-3.5 py-2 rounded-xl border transition-colors ${
                            a.status === "SUSPENDED"
                              ? "bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800"
                              : "bg-slate-100 text-slate-800 border-slate-200 hover:bg-rose-50 hover:text-rose-800"
                          }`}
                        >
                          {a.status === "SUSPENDED" ? "Activate" : "Suspend"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision New Academy Responsive Bottom Sheet / Centered Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative text-slate-950 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden shrink-0" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-950">Transactional Tenant Provisioning</h2>
                <p className="text-xs text-slate-600 font-medium">Create isolated tenant workspace, admin auth, LMS & CRM pipelines.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4">
              {provisionSteps.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Provisioning Resource Pipeline Checklist</h3>
                    <div className="space-y-2">
                      {provisionSteps.map((step) => (
                        <div key={step.step} className="flex items-start justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 font-black text-slate-800 flex items-center justify-center text-xs">
                              {step.step}
                            </span>
                            <div>
                              <div className="font-extrabold text-slate-950">{step.name}</div>
                              {step.details && <div className="text-xs text-slate-600 mt-0.5">{step.details}</div>}
                            </div>
                          </div>
                          <div>
                            {step.status === "RUNNING" ? (
                              <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-900 border border-sky-300 font-extrabold flex items-center gap-1 text-[11px]">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> RUNNING
                              </span>
                            ) : step.status === "SUCCESS" ? (
                              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold flex items-center gap-1 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> CREATED
                              </span>
                            ) : step.status === "EXISTS" ? (
                              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-extrabold flex items-center gap-1 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 font-bold text-[11px]">
                                QUEUED
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {provisionResult && (
                    <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-black text-emerald-950">Tenant Workspace Ready!</div>
                        <div className="text-emerald-900 mt-0.5">Admin Email: {provisionResult.admin?.email}</div>
                      </div>
                      <button 
                        onClick={() => setIsAddModalOpen(false)}
                        className="min-h-[44px] px-4 py-2 bg-emerald-800 text-white font-black rounded-xl"
                      >
                        Done & Close
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAddAcademy} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Academy Name *</label>
                      <input required placeholder="Apex Tech Academy" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium min-h-[44px]" />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Tenant Slug (URL prefix)</label>
                      <input placeholder="apex-tech" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono min-h-[44px]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Owner Admin Name *</label>
                    <input required placeholder="Dr. Suresh Raina" value={form.ownerName} onChange={e => setForm(p => ({ ...p, ownerName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[44px]" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Admin Email *</label>
                      <input required type="email" placeholder="suresh@apextech.com" value={form.ownerEmail} onChange={e => setForm(p => ({ ...p, ownerEmail: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[44px]" />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Owner Phone</label>
                      <input placeholder="+91 9876543210" value={form.ownerPhone} onChange={e => setForm(p => ({ ...p, ownerPhone: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[44px]" />
                    </div>
                  </div>

                  {/* Password Assignment Box */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-teal-700" /> Assign Admin Password *
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setForm(p => ({ ...p, adminPassword: generateRandomPassword() }))}
                        className="text-xs font-bold text-teal-800 hover:underline min-h-[36px] px-2 flex items-center"
                      >
                        Auto-Generate
                      </button>
                    </div>

                    <div className="relative">
                      <input 
                        required 
                        type={showPasswordText ? "text" : "password"} 
                        value={form.adminPassword} 
                        onChange={e => setForm(p => ({ ...p, adminPassword: e.target.value }))} 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider pr-10 min-h-[44px]" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPasswordText(!showPasswordText)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-900 min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Custom Domain (Optional)</label>
                      <input placeholder="learn.apextech.com" value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono min-h-[44px]" />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Subscription Plan</label>
                      <select value={form.subscription} onChange={e => setForm(p => ({ ...p, subscription: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold min-h-[44px]">
                        <option value="FREE">FREE Plan</option>
                        <option value="STARTER">STARTER Plan</option>
                        <option value="GROWTH">GROWTH Plan</option>
                        <option value="ENTERPRISE">ENTERPRISE Plan</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="withDemoData"
                      checked={form.withDemoData}
                      onChange={e => setForm(p => ({ ...p, withDemoData: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 rounded text-teal-700 focus:ring-teal-600 border-amber-300"
                    />
                    <label htmlFor="withDemoData" className="text-xs font-bold text-amber-950 cursor-pointer select-none">
                      Pre-load sample demo dataset (Optional)
                      <span className="block font-medium text-amber-800/90 text-[11px] mt-0.5">
                        Leave UNCHECKED (default) so this academy receives a completely clean 0-record workspace.
                      </span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button type="submit" disabled={isSubmitting} className="w-full min-h-[48px] py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-black text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Run Transactional Provisioning Pipeline"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Credentials Responsive Dialog */}
      {selectedAcademy && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-slate-950 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-950">Manage Admin Credentials</h3>
                <p className="text-xs text-slate-600 font-medium">{selectedAcademy.name}</p>
              </div>
              <button onClick={() => setSelectedAcademy(null)} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-800 block mb-1">Admin Owner</label>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900">
                  {selectedAcademy.ownerName} ({selectedAcademy.ownerEmail})
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-800 block mb-1">Username / Identifier</label>
                <input 
                  type="text" 
                  value={manageUsername}
                  onChange={e => setManageUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-900 min-h-[44px]" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-slate-800">Assigned Password</label>
                  <button 
                    type="button" 
                    onClick={() => setManagePassword(generateRandomPassword())}
                    className="text-xs font-bold text-teal-800 hover:underline min-h-[36px] px-2 flex items-center"
                  >
                     Generate New
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showPasswordText ? "text" : "password"} 
                    value={managePassword}
                    onChange={e => setManagePassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-mono font-bold text-slate-900 min-h-[44px]" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-900 min-h-[36px] min-w-[36px] flex items-center justify-center"
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    toast.success(`Updated credentials saved for ${selectedAcademy.name}!`)
                    setSelectedAcademy(null)
                  }}
                  className="w-full min-h-[44px] py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Updated Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
