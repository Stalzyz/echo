"use client"

import { useState } from "react"
import { 
  CreditCard, Plus, Edit3, CheckCircle2, ShieldCheck, X, 
  Users, BookOpen, HardDrive, Check, AlertCircle
} from "lucide-react"
import { toast } from "sonner"

interface Plan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  freeTrialDays: number
  studentLimit: number | "Unlimited"
  instructorLimit: number | "Unlimited"
  courseLimit: number | "Unlimited"
  storageLimitGB: number | "Unlimited"
  features: string[]
  status: "ACTIVE" | "DISABLED"
  popular?: boolean
}

const INITIAL_PLANS: Plan[] = [
  {
    id: "plan-free",
    name: "FREE",
    monthlyPrice: 0,
    yearlyPrice: 0,
    freeTrialDays: 0,
    studentLimit: 50,
    instructorLimit: 2,
    courseLimit: 3,
    storageLimitGB: 5,
    features: ["Basic LMS Features", "Community Forums", "Default Subdomain"],
    status: "ACTIVE"
  },
  {
    id: "plan-starter",
    name: "STARTER",
    monthlyPrice: 999,
    yearlyPrice: 9990,
    freeTrialDays: 14,
    studentLimit: 500,
    instructorLimit: 5,
    courseLimit: 15,
    storageLimitGB: 50,
    features: ["All Free Features", "Custom CNAME Domain", "WhatsApp Notifications", "Basic EMI Plans"],
    status: "ACTIVE"
  },
  {
    id: "plan-growth",
    name: "GROWTH",
    monthlyPrice: 2499,
    yearlyPrice: 24990,
    freeTrialDays: 14,
    studentLimit: 2500,
    instructorLimit: 20,
    courseLimit: 50,
    storageLimitGB: 250,
    features: ["All Starter Features", "Full Whitelabel Engine", "Grafty WABA Engine", "Custom EMI Control Engine", "Priority Support"],
    status: "ACTIVE",
    popular: true
  },
  {
    id: "plan-enterprise",
    name: "ENTERPRISE",
    monthlyPrice: 9999,
    yearlyPrice: 99990,
    freeTrialDays: 30,
    studentLimit: "Unlimited",
    instructorLimit: "Unlimited",
    courseLimit: "Unlimited",
    storageLimitGB: "Unlimited",
    features: ["All Growth Features", "Dedicated Edge Server", "Custom SSO & SAML Auth", "24/7 Phone Support", "SLA Guarantee 99.99%"],
    status: "ACTIVE"
  }
]

export default function SaaSPlansAndBillingPage() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const togglePlanStatus = (id: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === "DISABLED" ? "ACTIVE" : "DISABLED"
        toast.success(`Plan "${p.name}" is now ${nextStatus}`)
        return { ...p, status: nextStatus }
      }
      return p
    }))
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="flex-none pb-6 sm:pb-8 border-b border-slate-200 mb-6 sm:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              Echo SAAS PRICING ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Plans & Billing Controls</h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium">Create & edit subscription tiers, student/instructor limits, storage allocations, and pricing structures.</p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Plan
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {plans.map(p => (
          <div key={p.id} className={`bg-white border rounded-3xl p-6 shadow-xs relative flex flex-col justify-between transition-all ${
            p.popular ? "border-teal-500 ring-2 ring-teal-500/20" : "border-slate-200"
          } ${p.status === "DISABLED" ? "opacity-60 grayscale" : ""}`}>
            
            {p.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                MOST POPULAR
              </span>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">{p.name}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  p.status === "ACTIVE" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
                }`}>
                  {p.status}
                </span>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-black text-slate-900 font-mono">
                  {p.monthlyPrice === 0 ? "₹0" : `₹${p.monthlyPrice.toLocaleString()}`}
                  <span className="text-xs text-slate-400 font-sans font-normal"> / month</span>
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  Yearly: ₹{p.yearlyPrice.toLocaleString()} {p.freeTrialDays > 0 && `• ${p.freeTrialDays} Days Free Trial`}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs mb-6">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-500">Student Limit</span>
                  <span className="text-slate-900 font-mono">{p.studentLimit}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-500">Instructor Limit</span>
                  <span className="text-slate-900 font-mono">{p.instructorLimit}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-500">Course Limit</span>
                  <span className="text-slate-900 font-mono">{p.courseLimit}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-500">Storage Cap</span>
                  <span className="text-slate-900 font-mono">{p.storageLimitGB} GB</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Included Features</span>
                {p.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> {feat}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <button 
                onClick={() => setEditingPlan(p)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Plan
              </button>

              <button 
                onClick={() => togglePlanStatus(p.id)}
                className={`py-2 px-3 rounded-xl font-bold text-xs border transition-colors ${
                  p.status === "DISABLED"
                    ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700"
                }`}
              >
                {p.status === "DISABLED" ? "Enable" : "Disable"}
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
