"use client"

import { useState } from "react"
import { 
  Package, Plus, Check, Edit3, Trash2, Layers, Zap, Users, 
  BookOpen, Globe, Award, Shield, X, Loader2, DollarSign
} from "lucide-react"
import { toast } from "sonner"

interface Plan {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  maxStudents: number | "Unlimited"
  maxCourses: number | "Unlimited"
  storageGB: number
  whitelabel: boolean
  aiRiskEngine: boolean
  liveClass: boolean
  certificates: boolean
  apiAccess: boolean
  activeSubscribers: number
  isPopular?: boolean
}

const INITIAL_PLANS: Plan[] = [
  {
    id: "plan-starter",
    name: "Starter",
    priceMonthly: 49,
    priceYearly: 39,
    maxStudents: 250,
    maxCourses: 10,
    storageGB: 20,
    whitelabel: false,
    aiRiskEngine: false,
    liveClass: false,
    certificates: true,
    apiAccess: false,
    activeSubscribers: 12
  },
  {
    id: "plan-pro",
    name: "Professional",
    priceMonthly: 149,
    priceYearly: 119,
    maxStudents: 2500,
    maxCourses: "Unlimited",
    storageGB: 250,
    whitelabel: true,
    aiRiskEngine: true,
    liveClass: true,
    certificates: true,
    apiAccess: true,
    activeSubscribers: 45,
    isPopular: true
  },
  {
    id: "plan-ent",
    name: "Enterprise",
    priceMonthly: 499,
    priceYearly: 399,
    maxStudents: "Unlimited",
    maxCourses: "Unlimited",
    storageGB: 1000,
    whitelabel: true,
    aiRiskEngine: true,
    liveClass: true,
    certificates: true,
    apiAccess: true,
    activeSubscribers: 8
  }
]

export default function PackageBuilderPage() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: "",
    priceMonthly: 99,
    priceYearly: 79,
    maxStudents: 1000 as number | "Unlimited",
    maxCourses: 20 as number | "Unlimited",
    storageGB: 50,
    whitelabel: true,
    aiRiskEngine: false,
    liveClass: true,
    certificates: true,
    apiAccess: false,
    isPopular: false
  })

  const openCreateModal = () => {
    setEditingPlan(null)
    setForm({
      name: "",
      priceMonthly: 99,
      priceYearly: 79,
      maxStudents: 1000,
      maxCourses: 20,
      storageGB: 50,
      whitelabel: true,
      aiRiskEngine: false,
      liveClass: true,
      certificates: true,
      apiAccess: false,
      isPopular: false
    })
    setIsModalOpen(true)
  }

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan)
    setForm({
      name: plan.name,
      priceMonthly: plan.priceMonthly,
      priceYearly: plan.priceYearly,
      maxStudents: plan.maxStudents,
      maxCourses: plan.maxCourses,
      storageGB: plan.storageGB,
      whitelabel: plan.whitelabel,
      aiRiskEngine: plan.aiRiskEngine,
      liveClass: plan.liveClass,
      certificates: plan.certificates,
      apiAccess: plan.apiAccess,
      isPopular: !!plan.isPopular
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      if (editingPlan) {
        setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...p, ...form } : p))
        toast.success(`Package "${form.name}" updated successfully!`)
      } else {
        const newPlan: Plan = {
          id: `plan-${Date.now()}`,
          ...form,
          activeSubscribers: 0
        }
        setPlans([...plans, newPlan])
        toast.success(`New package "${form.name}" published to landing page!`)
      }
      setIsSubmitting(false)
      setIsModalOpen(false)
    }, 600)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete package "${name}"?`)) {
      setPlans(prev => prev.filter(p => p.id !== id))
      toast.success(`Package "${name}" removed.`)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              SAAS PLATFORM ENGINE
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Subscription Package Builder</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Configure tier pricing, feature permissions, and student capacity limits for academy vendors.</p>
        </div>

        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm shadow-teal-600/20"
        >
          <Plus className="w-4 h-4" /> Create New Package
        </button>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => (
          <div 
            key={plan.id} 
            className={`bg-white rounded-3xl p-8 border flex flex-col justify-between relative shadow-xs transition-all ${
              plan.isPopular ? "border-teal-500 ring-2 ring-teal-500/20" : "border-slate-200"
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
                Popular Choice
              </span>
            )}

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                  <span className="text-xs text-slate-500 font-bold">{plan.activeSubscribers} Active Academies</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditModal(plan)} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(plan.id, plan.name)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black font-mono text-slate-900">${plan.priceMonthly}</span>
                  <span className="text-xs font-bold text-slate-500">/mo</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-teal-700">${plan.priceYearly}/mo</span>
                  <span className="block text-[10px] text-slate-400 font-medium">Billed annually</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-6 text-xs font-semibold text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Max Students</span>
                  <span className="font-bold font-mono text-slate-900">{plan.maxStudents}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Max Courses</span>
                  <span className="font-bold font-mono text-slate-900">{plan.maxCourses}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Cloud Storage</span>
                  <span className="font-bold font-mono text-slate-900">{plan.storageGB} GB</span>
                </div>

                <div className="pt-2 space-y-2">
                  <FeatureCheck label="Whitelabel Custom Domain" active={plan.whitelabel} />
                  <FeatureCheck label="Live Classes & Stream" active={plan.liveClass} />
                  <FeatureCheck label="Automated Certificates" active={plan.certificates} />
                  <FeatureCheck label="AI Risk & Retention Engine" active={plan.aiRiskEngine} />
                  <FeatureCheck label="Custom API & Webhooks" active={plan.apiAccess} />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center">
              <span className="text-xs font-bold text-slate-400">Monthly Tier Revenue: </span>
              <span className="text-sm font-black font-mono text-teal-700">${(plan.priceMonthly * plan.activeSubscribers).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create / Edit Package */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-8 shadow-xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">{editingPlan ? `Edit Package: ${editingPlan.name}` : "Create New SaaS Package"}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Package Name *</label>
                <input required placeholder="e.g. Pro Growth" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Monthly Price ($) *</label>
                  <input required type="number" value={form.priceMonthly} onChange={e => setForm(p => ({ ...p, priceMonthly: parseFloat(e.target.value) }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Yearly Rate ($/mo) *</label>
                  <input required type="number" value={form.priceYearly} onChange={e => setForm(p => ({ ...p, priceYearly: parseFloat(e.target.value) }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Max Students</label>
                  <input type="text" value={form.maxStudents} onChange={e => setForm(p => ({ ...p, maxStudents: e.target.value === "Unlimited" ? "Unlimited" : parseInt(e.target.value) || 0 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Max Courses</label>
                  <input type="text" value={form.maxCourses} onChange={e => setForm(p => ({ ...p, maxCourses: e.target.value === "Unlimited" ? "Unlimited" : parseInt(e.target.value) || 0 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Storage (GB)</label>
                  <input type="number" value={form.storageGB} onChange={e => setForm(p => ({ ...p, storageGB: parseInt(e.target.value) || 0 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Feature Entitlements</h4>
                <ToggleRow label="Whitelabel Custom Domain" checked={form.whitelabel} onChange={v => setForm(p => ({ ...p, whitelabel: v }))} />
                <ToggleRow label="Live Classes & Streaming" checked={form.liveClass} onChange={v => setForm(p => ({ ...p, liveClass: v }))} />
                <ToggleRow label="Automated Certificates" checked={form.certificates} onChange={v => setForm(p => ({ ...p, certificates: v }))} />
                <ToggleRow label="AI Risk & Retention Engine" checked={form.aiRiskEngine} onChange={v => setForm(p => ({ ...p, aiRiskEngine: v }))} />
                <ToggleRow label="Custom API & Webhooks" checked={form.apiAccess} onChange={v => setForm(p => ({ ...p, apiAccess: v }))} />
                <ToggleRow label="Highlight as 'Popular Plan' on Landing Page" checked={form.isPopular} onChange={v => setForm(p => ({ ...p, isPopular: v }))} />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingPlan ? "Save Package Changes" : "Publish SaaS Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

function FeatureCheck({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {active ? (
        <Check className="w-4 h-4 text-teal-600 shrink-0" />
      ) : (
        <X className="w-4 h-4 text-slate-300 shrink-0" />
      )}
      <span className={active ? "text-slate-800" : "text-slate-400 line-through"}>{label}</span>
    </div>
  )
}

function ToggleRow({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
      <span className="text-xs font-bold text-slate-800">{label}</span>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative ${checked ? "bg-teal-600" : "bg-slate-300"}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${checked ? "left-6.5" : "left-0.5"}`} />
      </button>
    </div>
  )
}
