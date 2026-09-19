"use client"

import { useState } from "react"
import { 
  Building2, Plus, Search, Filter, ShieldCheck, MoreVertical, 
  UserCheck, AlertTriangle, ExternalLink, Check, X, Loader2, Sparkles, Layers, RefreshCw
} from "lucide-react"
import { toast } from "sonner"

interface Vendor {
  id: string
  name: string
  owner: string
  email: string
  plan: "Starter" | "Professional" | "Enterprise"
  customDomain: string
  studentsCount: number
  status: "ACTIVE" | "TRIAL" | "SUSPENDED"
  joinedAt: string
  mrr: number
}

const INITIAL_VENDORS: Vendor[] = [
  {
    id: "v-101",
    name: "Apex Tech Institute",
    owner: "Dr. Rajesh Kumar",
    email: "rajesh@apextech.edu",
    plan: "Enterprise",
    customDomain: "learn.apextech.edu",
    studentsCount: 1420,
    status: "ACTIVE",
    joinedAt: "2026-01-15",
    mrr: 499
  },
  {
    id: "v-102",
    name: "Stark Photography Academy",
    owner: "Elena Rostova",
    email: "elena@starkphoto.com",
    plan: "Professional",
    customDomain: "academy.starkphoto.com",
    studentsCount: 680,
    status: "ACTIVE",
    joinedAt: "2026-03-10",
    mrr: 149
  },
  {
    id: "v-103",
    name: "Quantum Coding Labs",
    owner: "Vikram Malhotra",
    email: "vikram@quantumlabs.io",
    plan: "Starter",
    customDomain: "quantum.echolms.com",
    studentsCount: 190,
    status: "TRIAL",
    joinedAt: "2026-09-02",
    mrr: 0
  },
  {
    id: "v-104",
    name: "Global Civil Services Hub",
    owner: "Anjali Sharma",
    email: "admin@civilserviceshub.in",
    plan: "Professional",
    customDomain: "learn.civilserviceshub.in",
    studentsCount: 950,
    status: "ACTIVE",
    joinedAt: "2026-04-20",
    mrr: 149
  },
  {
    id: "v-105",
    name: "DesignCraft Studio Academy",
    owner: "Marco Rossi",
    email: "marco@designcraft.co",
    plan: "Starter",
    customDomain: "designcraft.echolms.com",
    studentsCount: 45,
    status: "SUSPENDED",
    joinedAt: "2026-02-01",
    mrr: 0
  }
]

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS)
  const [search, setSearch] = useState("")
  const [filterPlan, setFilterPlan] = useState("ALL")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: "", owner: "", email: "", plan: "Professional" as Vendor["plan"], customDomain: ""
  })

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                          v.email.toLowerCase().includes(search.toLowerCase()) ||
                          v.customDomain.toLowerCase().includes(search.toLowerCase())
    const matchesPlan = filterPlan === "ALL" || v.plan === filterPlan
    const matchesStatus = filterStatus === "ALL" || v.status === filterStatus
    return matchesSearch && matchesPlan && matchesStatus
  })

  const totalMRR = vendors.reduce((acc, v) => acc + v.mrr, 0)
  const totalStudents = vendors.reduce((acc, v) => acc + v.studentsCount, 0)
  const activeVendors = vendors.filter(v => v.status === "ACTIVE").length

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      const newVendor: Vendor = {
        id: `v-${Date.now()}`,
        name: form.name,
        owner: form.owner,
        email: form.email,
        plan: form.plan,
        customDomain: form.customDomain || `${form.name.toLowerCase().replace(/\s+/g, '-')}.echolms.com`,
        studentsCount: 0,
        status: "ACTIVE",
        joinedAt: new Date().toISOString().split('T')[0],
        mrr: form.plan === "Enterprise" ? 499 : form.plan === "Professional" ? 149 : 49
      }
      setVendors([newVendor, ...vendors])
      setIsSubmitting(false)
      setIsOnboardModalOpen(false)
      toast.success(`Academy "${form.name}" onboarded successfully! Account credentials sent to ${form.email}`)
      setForm({ name: "", owner: "", email: "", plan: "Professional", customDomain: "" })
    }, 800)
  }

  const toggleStatus = (id: string) => {
    setVendors(prev => prev.map(v => {
      if (v.id === id) {
        const nextStatus = v.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
        toast.success(`Vendor ${v.name} status updated to ${nextStatus}`)
        return { ...v, status: nextStatus, mrr: nextStatus === "SUSPENDED" ? 0 : (v.plan === "Enterprise" ? 499 : 149) }
      }
      return v
    }))
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              SUPER ADMIN PORTAL
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Vendor & Academy Management</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage onboarded tenant academies, subscription tiers, and domain allocations.</p>
        </div>

        <button 
          onClick={() => setIsOnboardModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm shadow-teal-600/20"
        >
          <Plus className="w-4 h-4" /> Onboard New Academy
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Academies</span>
          <div className="text-3xl font-black text-slate-900 mt-2 font-mono">{vendors.length}</div>
          <span className="text-xs text-teal-700 font-bold mt-1 block">{activeVendors} Active Subscription Tenants</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Monthly Recurring Revenue (MRR)</span>
          <div className="text-3xl font-black text-slate-900 mt-2 font-mono">${totalMRR.toLocaleString()}</div>
          <span className="text-xs text-emerald-700 font-bold mt-1 block">+18.5% Growth this month</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Hosted Learners</span>
          <div className="text-3xl font-black text-slate-900 mt-2 font-mono">{totalStudents.toLocaleString()}</div>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">Across all active vendors</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Active Trials</span>
          <div className="text-3xl font-black text-amber-600 mt-2 font-mono">{vendors.filter(v => v.status === "TRIAL").length}</div>
          <span className="text-xs text-amber-700 font-bold mt-1 block">Conversion rate 78%</span>
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
            <option value="Starter">Starter Plan</option>
            <option value="Professional">Professional Plan</option>
            <option value="Enterprise">Enterprise Plan</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Academy Name</th>
                <th className="py-4 px-6">Owner / Admin</th>
                <th className="py-4 px-6">SaaS Plan</th>
                <th className="py-4 px-6">Custom Domain</th>
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
                    <div className="font-bold text-slate-800">{vendor.owner}</div>
                    <div className="text-xs text-slate-400">{vendor.email}</div>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                      vendor.plan === "Enterprise" 
                        ? "bg-purple-50 text-purple-800 border-purple-200" 
                        : vendor.plan === "Professional"
                        ? "bg-teal-50 text-teal-800 border-teal-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {vendor.plan} (${vendor.mrr}/mo)
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <a href={`https://${vendor.customDomain}`} target="_blank" rel="noreferrer" className="text-xs font-mono text-teal-600 font-bold hover:underline flex items-center gap-1">
                      {vendor.customDomain} <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>

                  <td className="py-4 px-6 font-mono font-bold text-slate-800">
                    {vendor.studentsCount.toLocaleString()}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      vendor.status === "ACTIVE" 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                        : vendor.status === "TRIAL"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      {vendor.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => toggleStatus(vendor.id)}
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

              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No vendor academies match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Modal */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-xl relative text-slate-900">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">Provision New Academy Vendor</h2>
              <button onClick={() => setIsOnboardModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleOnboard} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Academy / Organization Name *</label>
                <input required placeholder="e.g. Apex Coding Academy" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Admin Owner Full Name *</label>
                <input required placeholder="Dr. Suresh Raina" value={form.owner} onChange={e => setForm(p => ({ ...p, owner: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Owner Email Address *</label>
                <input required type="email" placeholder="suresh@apexcoding.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Assigned SaaS Plan</label>
                  <select value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value as Vendor["plan"] }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold">
                    <option value="Starter">Starter ($49/mo)</option>
                    <option value="Professional">Professional ($149/mo)</option>
                    <option value="Enterprise">Enterprise ($499/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Custom Domain CNAME</label>
                  <input placeholder="learn.apexcoding.com" value={form.customDomain} onChange={e => setForm(p => ({ ...p, customDomain: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Onboard Academy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
