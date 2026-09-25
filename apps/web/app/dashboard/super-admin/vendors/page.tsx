"use client"

import { useState, useEffect } from  "react"
import { Building2, Plus, Search, Filter, ShieldCheck, MoreVertical, UserCheck, AlertTriangle, ExternalLink, Check, X, Loader2, Layers, RefreshCw, CheckCircle2, AlertCircle, Trash2, LogIn } from  "lucide-react"
import { toast } from  "sonner"
import { useSession } from  "next-auth/react"

interface Vendor {
  id: string
  name: string
  slug?: string
  ownerName: string
  ownerEmail: string
  subscription: string
  domain: string
  portalUrl?: string
  studentsCount: number
  coursesCount: number
  status: string
  createdAt: string
  revenue: string
}

interface ProvisionStep {
  step: number
  name: string
  status: string
  details: string
}

export default function VendorManagementPage() {
  const { data: session, update: updateSession } = useSession()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterPlan, setFilterPlan] = useState("ALL")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [provisionSteps, setProvisionSteps] = useState<ProvisionStep[]>([])

  const [form, setForm] = useState({
    name: "", slug: "", ownerName: "", ownerEmail: "", ownerPhone: "", adminPassword: "", subscription: "GROWTH", domain: ""
  })

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/v1/super-admin/academies")
      if (res.ok) {
        const data = await res.json()
        setVendors(data.academies || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                          v.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
                          v.domain.toLowerCase().includes(search.toLowerCase())
    const matchesPlan = filterPlan === "ALL" || v.subscription === filterPlan
    const matchesStatus = filterStatus === "ALL" || v.status === filterStatus
    return matchesSearch && matchesPlan && matchesStatus
  })

  const totalStudents = vendors.reduce((acc, v) => acc + v.studentsCount, 0)
  const activeVendors = vendors.filter(v => v.status === "ACTIVE").length

  const handleOnboard = async (e: React.FormEvent) => {
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
        toast.success(`Academy "${form.name}" provisioned cleanly!`)
        fetchVendors()
      } else {
        toast.error(data.error || "Provisioning failed")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to provision academy")
    } finally {
      setIsSubmitting(false)
    }
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
        toast.success(`Status updated to ${nextStatus}`)
        fetchVendors()
      }
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  const handleDeleteVendor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete "${name}"?\n\nThis will cascade delete all courses, batches, leads, students, and invoices. This action cannot be undone.`)) return

    try {
      toast.loading(`Permanently deleting "${name}"...`, { id: "del-vendor" })
      const res = await fetch(`/api/v1/super-admin/academies/${id}`, {
        method: "DELETE"
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast.success(`"${name}" deleted permanently.`, { id: "del-vendor" })
        fetchVendors()
      } else {
        toast.error(data.error || "Failed to delete vendor", { id: "del-vendor" })
      }
    } catch (err: any) {
      toast.error(err.message || "Network error deleting vendor", { id: "del-vendor" })
    }
  }

  const handleCleanSlate = async () => {
    if (!confirm("⚠️ RESET TO CLEAN SLATE?\n\nThis will keep ONLY the pristine Demo Academy (Echo Academy) connected to the landing page and delete all other dummy vendors and test data. Continue?")) return

    try {
      toast.loading("Executing Clean Slate purge...", { id: "clean-slate" })
      const res = await fetch("/api/v1/super-admin/academies/clean-slate", {
        method: "POST"
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast.success(data.message || "Clean slate complete!", { id: "clean-slate" })
        fetchVendors()
      } else {
        toast.error(data.error || "Clean slate failed", { id: "clean-slate" })
      }
    } catch (err: any) {
      toast.error(err.message || "Network error during clean slate", { id: "clean-slate" })
    }
  }

  const handleImpersonate = async (vendor: Vendor) => {
    try {
      toast.info(`Switching context to ${vendor.name}...`)
      const res = await fetch("/api/v1/super-admin/academies/impersonate", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ academyId: vendor.id })
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
        toast.success(`Now viewing as Admin for ${vendor.name}`)
        window.location.href = "/dashboard"
      } else {
        toast.error(data.error || "Failed to enter tenant mode")
      }
    } catch {
      toast.error("Impersonation failed")
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-950 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
      
      {/* Header */}
      <div className="flex-none pb-6 border-b border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-xs font-black uppercase tracking-widest border border-teal-200 shadow-2xs">
              SUPER ADMIN TENANT DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">Vendor & Academy Management</h1>
          <p className="text-slate-600 mt-1 text-xs sm:text-sm font-semibold">Provision isolated tenant academies, manage subscriptions, and purge test vendors.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCleanSlate}
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-xs"
            title="Purge dummy vendors and keep only the official Demo Academy"
          >
            <CheckCircle2 className="w-4 h-4 text-rose-600" /> Clean Slate (Keep Only Demo)
          </button>

          <button 
            type="button"
            onClick={() => {
              setForm({ name: "", slug: "", ownerName: "", ownerEmail: "", ownerPhone: "", adminPassword: "", subscription: "GROWTH", domain: "" })
              setProvisionSteps([])
              setIsOnboardModalOpen(true)
            }}
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-teal-700/20"
          >
            <Plus className="w-4 h-4 shrink-0" /> Provision New Academy
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Academies</span>
          <div className="text-3xl font-black text-slate-950 mt-2 font-mono">{vendors.length}</div>
          <span className="text-xs text-teal-800 font-extrabold mt-1 block">{activeVendors} Active Tenant Workspaces</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Hosted Learners</span>
          <div className="text-3xl font-black text-slate-950 mt-2 font-mono">{totalStudents.toLocaleString()}</div>
          <span className="text-xs text-slate-600 font-bold mt-1 block">Across all active academies</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Tenants</span>
          <div className="text-3xl font-black text-emerald-700 mt-2 font-mono">{activeVendors}</div>
          <span className="text-xs text-emerald-800 font-extrabold mt-1 block">Data Isolation Verified</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search academy, owner, or domain..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
          <select 
            value={filterPlan} 
            onChange={e => setFilterPlan(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none min-h-[44px]"
          >
            <option value="ALL">All Pricing Plans</option>
            <option value="FREE">FREE</option>
            <option value="STARTER">STARTER</option>
            <option value="GROWTH">GROWTH</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
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
            <span className="text-xs font-bold">Loading directory...</span>
          </div>
        ) : (
          filteredVendors.map(vendor => (
            <div key={vendor.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-950 text-base leading-tight">{vendor.name}</h3>
                    <p className="text-xs font-mono text-slate-500">ID: {vendor.id}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase border ${
                  vendor.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-900 border-rose-300'
                }`}>
                  {vendor.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block uppercase">Owner</span>
                  <span className="font-extrabold text-slate-900 truncate block">{vendor.ownerName}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block uppercase">Students</span>
                  <span className="font-extrabold text-slate-900">{vendor.studentsCount.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleImpersonate(vendor)}
                  className="min-h-[40px] px-2 bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" /> Enter
                </button>
                <button 
                  type="button"
                  onClick={() => toggleStatus(vendor.id, vendor.status)}
                  className={`min-h-[40px] px-2 text-xs font-bold rounded-xl border transition-colors ${
                    vendor.status === "SUSPENDED" 
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-slate-100 text-slate-800 border-slate-200"
                  }`}
                >
                  {vendor.status === "SUSPENDED" ? "Activate" : "Suspend"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                  className="min-h-[40px] px-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
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
            <span className="text-sm font-bold">Loading Vendor Directory...</span>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-bold">No vendors found. Click "Provision New Academy" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600">
                  <th className="py-4 px-6">Academy Name</th>
                  <th className="py-4 px-6">Owner / Admin</th>
                  <th className="py-4 px-6">SaaS Plan</th>
                  <th className="py-4 px-6">Domain</th>
                  <th className="py-4 px-6">Students</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredVendors.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center font-black text-teal-900 text-sm shadow-2xs">
                          {vendor.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-950">{vendor.name}</div>
                          <div className="text-xs text-slate-500 font-mono">ID: {vendor.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{vendor.ownerName}</div>
                      <div className="text-xs text-slate-600">{vendor.ownerEmail}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-lg text-xs font-black border ${
                        vendor.subscription === "ENTERPRISE" 
                          ? "bg-purple-100 text-purple-900 border-purple-200" 
                          : vendor.subscription === "GROWTH"
                          ? "bg-teal-100 text-teal-900 border-teal-200"
                          : "bg-slate-100 text-slate-800 border-slate-200"
                      }`}>
                        {vendor.subscription}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <a 
                        href={vendor.portalUrl || `/w/${vendor.slug || vendor.id}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs font-mono text-teal-700 font-bold hover:underline flex items-center gap-1"
                        title={`Vendor ID: ${vendor.id}`}
                      >
                        {vendor.portalUrl || `/w/${vendor.slug || vendor.id}`} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>

                    <td className="py-4 px-6 font-mono font-extrabold text-slate-950">
                      {vendor.studentsCount.toLocaleString()}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                        vendor.status === "ACTIVE" 
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300" 
                          : "bg-rose-100 text-rose-900 border-rose-300"
                      }`}>
                        {vendor.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleImpersonate(vendor)}
                          className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                          title="Enter tenant workspace as Administrator"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Enter
                        </button>

                        <button 
                          type="button"
                          onClick={() => toggleStatus(vendor.id, vendor.status)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                            vendor.status === "SUSPENDED" 
                              ? "bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800"
                              : "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {vendor.status === "SUSPENDED" ? "Activate" : "Suspend"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                          className="p-2 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Permanently Delete Vendor"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Provision Responsive Bottom Sheet Modal */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative text-slate-950 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden shrink-0" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
              <h2 className="text-lg sm:text-xl font-black text-slate-950">Provision New Academy Tenant</h2>
              <button onClick={() => setIsOnboardModalOpen(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4">
              {provisionSteps.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2">Provisioning Progress</h3>
                    {provisionSteps.map(step => (
                      <div key={step.step} className="flex items-center justify-between text-xs p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="font-extrabold text-slate-900">{step.step}. {step.name}</span>
                        <span className="font-black text-emerald-800">{step.status}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setIsOnboardModalOpen(false)} className="w-full min-h-[44px] py-3 bg-teal-700 text-white font-black rounded-xl">
                    Close & View Directory
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOnboard} className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Academy Name *</label>
                    <input required placeholder="e.g. Apex Coding Academy" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[44px]" />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Owner Full Name *</label>
                    <input required placeholder="Dr. Suresh Raina" value={form.ownerName} onChange={e => setForm(p => ({ ...p, ownerName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[44px]" />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Owner Email *</label>
                    <input required type="email" placeholder="suresh@apexcoding.com" value={form.ownerEmail} onChange={e => setForm(p => ({ ...p, ownerEmail: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[44px]" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Subscription Plan</label>
                      <select value={form.subscription} onChange={e => setForm(p => ({ ...p, subscription: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold min-h-[44px]">
                        <option value="FREE">FREE</option>
                        <option value="STARTER">STARTER</option>
                        <option value="GROWTH">GROWTH</option>
                        <option value="ENTERPRISE">ENTERPRISE</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase tracking-wider text-slate-800 block mb-1">Domain</label>
                      <input placeholder="learn.apexcoding.com" value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[44px]" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button type="submit" disabled={isSubmitting} className="w-full min-h-[48px] py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-black text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
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
