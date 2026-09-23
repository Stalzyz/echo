"use client"

import { useState, useEffect } from "react"
import { 
  Building2, Plus, Search, Filter, ShieldCheck, MoreVertical, 
  UserCheck, AlertTriangle, ExternalLink, Check, X, Loader2, Layers, RefreshCw, CheckCircle2, AlertCircle
} from "lucide-react"
import { toast } from "sonner"

interface Vendor {
  id: string
  name: string
  ownerName: string
  ownerEmail: string
  subscription: string
  domain: string
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

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              SUPER ADMIN TENANT DIRECTORY
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Vendor & Academy Management</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Provision isolated tenant academies, subscription tiers, and domain allocations.</p>
        </div>

        <button 
          onClick={() => {
            setForm({ name: "", slug: "", ownerName: "", ownerEmail: "", ownerPhone: "", adminPassword: "", subscription: "GROWTH", domain: "" })
            setProvisionSteps([])
            setIsOnboardModalOpen(true)
          }}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm shadow-teal-600/20"
        >
          <Plus className="w-4 h-4" /> Provision New Academy
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Academies</span>
          <div className="text-3xl font-black text-slate-900 mt-2 font-mono">{vendors.length}</div>
          <span className="text-xs text-teal-700 font-bold mt-1 block">{activeVendors} Active Tenant Workspaces</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Hosted Learners</span>
          <div className="text-3xl font-black text-slate-900 mt-2 font-mono">{totalStudents.toLocaleString()}</div>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">Across all active academies</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Active Tenants</span>
          <div className="text-3xl font-black text-emerald-600 mt-2 font-mono">{activeVendors}</div>
          <span className="text-xs text-emerald-700 font-bold mt-1 block">Data Isolation Verified</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search academy, owner, or domain..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={filterPlan} 
            onChange={e => setFilterPlan(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
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
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            <span className="text-sm font-bold">Loading Vendor Directory...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
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
                  <tr key={vendor.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-black text-teal-800 text-sm">
                          {vendor.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900">{vendor.name}</div>
                          <div className="text-xs text-slate-400 font-mono">ID: {vendor.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{vendor.ownerName}</div>
                      <div className="text-xs text-slate-400">{vendor.ownerEmail}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                        vendor.subscription === "ENTERPRISE" 
                          ? "bg-purple-50 text-purple-800 border-purple-200" 
                          : vendor.subscription === "GROWTH"
                          ? "bg-teal-50 text-teal-800 border-teal-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                        {vendor.subscription}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <a href={`https://${vendor.domain}`} target="_blank" rel="noreferrer" className="text-xs font-mono text-teal-600 font-bold hover:underline flex items-center gap-1">
                        {vendor.domain} <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>

                    <td className="py-4 px-6 font-mono font-bold text-slate-800">
                      {vendor.studentsCount.toLocaleString()}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        vendor.status === "ACTIVE" 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}>
                        {vendor.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => toggleStatus(vendor.id, vendor.status)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                          vendor.status === "SUSPENDED" 
                            ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                        }`}
                      >
                        {vendor.status === "SUSPENDED" ? "Activate" : "Suspend"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboard Modal */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-xl relative text-slate-900">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">Provision New Academy Tenant</h2>
              <button onClick={() => setIsOnboardModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            {provisionSteps.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Provisioning Progress</h3>
                  {provisionSteps.map(step => (
                    <div key={step.step} className="flex items-center justify-between text-xs p-2 bg-white rounded-lg border">
                      <span>{step.step}. {step.name}</span>
                      <span className="font-bold text-emerald-700">{step.status}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setIsOnboardModalOpen(false)} className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl">
                  Close & View Directory
                </button>
              </div>
            ) : (
              <form onSubmit={handleOnboard} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Academy Name *</label>
                  <input required placeholder="e.g. Apex Coding Academy" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Owner Full Name *</label>
                  <input required placeholder="Dr. Suresh Raina" value={form.ownerName} onChange={e => setForm(p => ({ ...p, ownerName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Owner Email *</label>
                  <input required type="email" placeholder="suresh@apexcoding.com" value={form.ownerEmail} onChange={e => setForm(p => ({ ...p, ownerEmail: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Subscription Plan</label>
                    <select value={form.subscription} onChange={e => setForm(p => ({ ...p, subscription: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold">
                      <option value="FREE">FREE</option>
                      <option value="STARTER">STARTER</option>
                      <option value="GROWTH">GROWTH</option>
                      <option value="ENTERPRISE">ENTERPRISE</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Domain</label>
                    <input placeholder="learn.apexcoding.com" value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Run Provisioning Pipeline"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
