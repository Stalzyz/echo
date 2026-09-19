"use client"

import { useState } from "react"
import { 
  Building2, Plus, Search, Filter, ShieldCheck, MoreVertical, 
  UserCheck, AlertTriangle, ExternalLink, Check, X, Loader2, Sparkles, LogIn
} from "lucide-react"
import { toast } from "sonner"

interface Academy {
  id: string
  name: string
  owner: string
  email: string
  phone: string
  studentsCount: number
  coursesCount: number
  subscription: "FREE" | "STARTER" | "GROWTH" | "ENTERPRISE"
  status: "ACTIVE" | "TRIAL" | "SUSPENDED"
  domain: string
  createdAt: string
}

const INITIAL_ACADEMIES: Academy[] = [
  {
    id: "acad-101",
    name: "Apex Tech Institute",
    owner: "Dr. Rajesh Kumar",
    email: "rajesh@apextech.edu",
    phone: "+91 9876543210",
    studentsCount: 1420,
    coursesCount: 28,
    subscription: "ENTERPRISE",
    status: "ACTIVE",
    domain: "learn.apextech.edu",
    createdAt: "2026-01-15"
  },
  {
    id: "acad-102",
    name: "Stark Photography Academy",
    owner: "Elena Rostova",
    email: "elena@starkphoto.com",
    phone: "+91 9812345678",
    studentsCount: 680,
    coursesCount: 14,
    subscription: "GROWTH",
    status: "ACTIVE",
    domain: "academy.starkphoto.com",
    createdAt: "2026-03-10"
  },
  {
    id: "acad-103",
    name: "Quantum Coding Labs",
    owner: "Vikram Malhotra",
    email: "vikram@quantumlabs.io",
    phone: "+91 9988776655",
    studentsCount: 190,
    coursesCount: 6,
    subscription: "STARTER",
    status: "TRIAL",
    domain: "quantum.echolms.com",
    createdAt: "2026-09-02"
  },
  {
    id: "acad-104",
    name: "Global Civil Services Hub",
    owner: "Anjali Sharma",
    email: "admin@civilserviceshub.in",
    phone: "+91 9711223344",
    studentsCount: 950,
    coursesCount: 19,
    subscription: "GROWTH",
    status: "ACTIVE",
    domain: "learn.civilserviceshub.in",
    createdAt: "2026-04-20"
  },
  {
    id: "acad-105",
    name: "DesignCraft Studio Academy",
    owner: "Marco Rossi",
    email: "marco@designcraft.co",
    phone: "+91 9899001122",
    studentsCount: 45,
    coursesCount: 3,
    subscription: "FREE",
    status: "SUSPENDED",
    domain: "designcraft.echolms.com",
    createdAt: "2026-02-01"
  }
]

export default function AcademiesManagementPage() {
  const [academies, setAcademies] = useState<Academy[]>(INITIAL_ACADEMIES)
  const [search, setSearch] = useState("")
  const [filterPlan, setFilterPlan] = useState("ALL")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: "", owner: "", email: "", phone: "", subscription: "GROWTH" as Academy["subscription"], domain: ""
  })

  const filteredAcademies = academies.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.owner.toLowerCase().includes(search.toLowerCase()) ||
                          a.email.toLowerCase().includes(search.toLowerCase()) ||
                          a.domain.toLowerCase().includes(search.toLowerCase())
    const matchesPlan = filterPlan === "ALL" || a.subscription === filterPlan
    const matchesStatus = filterStatus === "ALL" || a.status === filterStatus
    return matchesSearch && matchesPlan && matchesStatus
  })

  const handleAddAcademy = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      const newAcad: Academy = {
        id: `acad-${Date.now()}`,
        name: form.name,
        owner: form.owner,
        email: form.email,
        phone: form.phone || "+91 9800000000",
        studentsCount: 0,
        coursesCount: 0,
        subscription: form.subscription,
        status: "ACTIVE",
        domain: form.domain || `${form.name.toLowerCase().replace(/\s+/g, '-')}.echolms.com`,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setAcademies([newAcad, ...academies])
      setIsSubmitting(false)
      setIsAddModalOpen(false)
      toast.success(`Academy "${form.name}" added successfully! Credentials dispatched to ${form.email}`)
      setForm({ name: "", owner: "", email: "", phone: "", subscription: "GROWTH", domain: "" })
    }, 800)
  }

  const toggleStatus = (id: string) => {
    setAcademies(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
        toast.success(`Academy "${a.name}" status updated to ${nextStatus}`)
        return { ...a, status: nextStatus }
      }
      return a
    }))
  }

  const handleImpersonateLogin = (name: string) => {
    toast.info(`Logging in as Academy Admin for "${name}"... Redirecting to tenant dashboard.`)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              GECHO SAAS TENANTS
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Academies Directory</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage all customer LMS academies, domain allocations, subscription tiers & admin impersonation logins.</p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Academy
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search academy, owner, email, domain..."
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
            <option value="ALL">All Subscription Plans</option>
            <option value="FREE">FREE Plan</option>
            <option value="STARTER">STARTER Plan</option>
            <option value="GROWTH">GROWTH Plan</option>
            <option value="ENTERPRISE">ENTERPRISE Plan</option>
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

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Academy Name</th>
                <th className="py-4 px-6">Owner / Email</th>
                <th className="py-4 px-6">Students</th>
                <th className="py-4 px-6">Courses</th>
                <th className="py-4 px-6">Subscription</th>
                <th className="py-4 px-6">Domain</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAcademies.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-black text-teal-800 text-sm">
                        {a.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{a.name}</div>
                        <div className="text-xs text-slate-400 font-mono">Created {a.createdAt}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800">{a.owner}</div>
                    <div className="text-xs text-slate-400">{a.email}</div>
                  </td>

                  <td className="py-4 px-6 font-mono font-bold text-slate-800">
                    {a.studentsCount.toLocaleString()}
                  </td>

                  <td className="py-4 px-6 font-mono font-bold text-slate-800">
                    {a.coursesCount}
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                      a.subscription === "ENTERPRISE"
                        ? "bg-purple-50 text-purple-800 border-purple-200"
                        : a.subscription === "GROWTH"
                        ? "bg-teal-50 text-teal-800 border-teal-200"
                        : a.subscription === "STARTER"
                        ? "bg-sky-50 text-sky-800 border-sky-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {a.subscription}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <a href={`https://${a.domain}`} target="_blank" rel="noreferrer" className="text-xs font-mono text-teal-600 font-bold hover:underline flex items-center gap-1">
                      {a.domain} <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>

                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      a.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : a.status === "TRIAL"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      {a.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleImpersonateLogin(a.name)}
                        className="px-3 py-1.5 bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        title="Login as Academy Admin"
                      >
                        <LogIn className="w-3.5 h-3.5" /> Login Admin
                      </button>

                      <button 
                        onClick={() => toggleStatus(a.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                          a.status === "SUSPENDED"
                            ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700"
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
      </div>

      {/* Add Academy Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-xl relative text-slate-900">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">Provision New Academy Tenant</h2>
              <button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleAddAcademy} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Academy Name *</label>
                <input required placeholder="e.g. Apex Coding Academy" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Owner Admin Name *</label>
                <input required placeholder="Dr. Suresh Raina" value={form.owner} onChange={e => setForm(p => ({ ...p, owner: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Email *</label>
                  <input required type="email" placeholder="suresh@apexcoding.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Phone *</label>
                  <input required placeholder="+91 9876543210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Subscription Plan</label>
                  <select value={form.subscription} onChange={e => setForm(p => ({ ...p, subscription: e.target.value as Academy["subscription"] }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold">
                    <option value="FREE">FREE (₹0/mo)</option>
                    <option value="STARTER">STARTER (₹999/mo)</option>
                    <option value="GROWTH">GROWTH (₹2,499/mo)</option>
                    <option value="ENTERPRISE">ENTERPRISE (Custom)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Custom Domain CNAME</label>
                  <input placeholder="learn.apexcoding.com" value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Provision Academy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
