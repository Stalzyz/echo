"use client"

import { useState } from "react"
import { 
  CreditCard, Plus, Edit3, CheckCircle2, ShieldCheck, X, 
  Users, BookOpen, HardDrive, Check, AlertCircle, ExternalLink,
  MessageCircle, Mail, Zap
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { ALL_PLATFORM_MODULES } from "../packages/page"

interface Plan {
  id: string
  name: string
  originalPriceYearly: number
  offerPriceYearly: number
  gstText: string
  studentLimit: number | "Unlimited"
  instructorLimit: number | "Unlimited"
  courseLimit: number | "Unlimited"
  storageLimitGB: number | "Unlimited"
  enabledModules: Record<string, boolean>
  customPaymentLink: string
  status: "ACTIVE" | "DISABLED"
  popular?: boolean
  badgeText?: string
}

const INITIAL_PLANS: Plan[] = [
  {
    id: "plan-starter",
    name: "STARTER ACADEMY",
    originalPriceYearly: 24999,
    offerPriceYearly: 14999,
    gstText: "+ 18% GST",
    studentLimit: 500,
    instructorLimit: 5,
    courseLimit: 15,
    storageLimitGB: 50,
    enabledModules: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      customPaymentGateway: true
    },
    customPaymentLink: "https://echolms.com/subscribe/starter",
    status: "ACTIVE",
    badgeText: "Save 40%"
  },
  {
    id: "plan-growth",
    name: "GROWTH INSTITUTE",
    originalPriceYearly: 49999,
    offerPriceYearly: 29999,
    gstText: "+ 18% GST",
    studentLimit: 2500,
    instructorLimit: 20,
    courseLimit: 50,
    storageLimitGB: 250,
    enabledModules: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      whatsappAuto: true,
      emailMarketing: true,
      webinars: true,
      whitelabel: true,
      mentorship: true,
      referrals: true,
      customPaymentGateway: true
    },
    customPaymentLink: "https://echolms.com/subscribe/growth",
    status: "ACTIVE",
    popular: true,
    badgeText: "Most Popular Choice"
  },
  {
    id: "plan-enterprise",
    name: "ENTERPRISE MULTI-BRANCH",
    originalPriceYearly: 99999,
    offerPriceYearly: 69999,
    gstText: "+ 18% GST",
    studentLimit: "Unlimited",
    instructorLimit: "Unlimited",
    courseLimit: "Unlimited",
    storageLimitGB: "Unlimited",
    enabledModules: ALL_PLATFORM_MODULES.reduce((acc, m) => {
      acc[m.key] = true
      return acc
    }, {} as Record<string, boolean>),
    customPaymentLink: "https://echolms.com/subscribe/enterprise",
    status: "ACTIVE",
    badgeText: "Full Enterprise Suite"
  }
]

export default function SaaSPlansAndBillingPage() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS)

  const togglePlanStatus = (id: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === "DISABLED" ? "ACTIVE" : "DISABLED"
        toast.success(`Package "${p.name}" is now ${nextStatus}`)
        return { ...p, status: nextStatus }
      }
      return p
    }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex-none pb-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              ECHO SAAS PRICING & PACKAGE CONTROLS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Plans & Billing Controls</h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium">Manage yearly academy packages, custom payment link URLs, GST disclosure tags (+18% GST), and 12-module access permissions.</p>
        </div>

        <Link 
          href="/dashboard/super-admin/packages"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Open Full Package Builder
        </Link>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(p => {
          const enabledCount = Object.values(p.enabledModules).filter(Boolean).length
          const discountPct = Math.round(((p.originalPriceYearly - p.offerPriceYearly) / p.originalPriceYearly) * 100)

          return (
            <div key={p.id} className={`bg-white border rounded-3xl p-6 shadow-xs relative flex flex-col justify-between transition-all ${
              p.popular ? "border-teal-500 ring-2 ring-teal-500/20" : "border-slate-200"
            } ${p.status === "DISABLED" ? "opacity-60 grayscale" : ""}`}>
              
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {p.badgeText || "MOST POPULAR"}
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">{p.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    p.status === "ACTIVE" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900 font-mono">₹{p.offerPriceYearly.toLocaleString()}</span>
                      <span className="text-xs text-slate-400 font-mono line-through ml-2">₹{p.originalPriceYearly.toLocaleString()}</span>
                      <span className="text-xs text-slate-500 font-bold block">/ year</span>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      {discountPct}% OFF
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-200/80 flex items-center justify-between">
                    <span>{p.gstText}</span>
                    <span className="text-teal-700 font-mono">Yearly Billed</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
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

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Included Modules</span>
                    <span className="text-[10px] font-bold text-teal-700">{enabledCount} / 12 Active</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-1 max-h-36 overflow-y-auto custom-scrollbar">
                    {ALL_PLATFORM_MODULES.map(m => {
                      const active = !!p.enabledModules[m.key]
                      return (
                        <div key={m.key} className="flex items-center justify-between text-[11px] text-slate-700 font-medium">
                          <span className={active ? "text-slate-800 font-medium" : "text-slate-400 line-through"}>{m.name}</span>
                          {active ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 mt-4">
                <Link 
                  href="/dashboard/super-admin/packages"
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Customize Package
                </Link>

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
          )
        })}
      </div>

    </div>
  )
}
