"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  X, ShieldCheck, CreditCard, CheckCircle2, AlertCircle, 
  Loader2, Sparkles, Layers, DollarSign, Users, BookOpen, HardDrive, Link as LinkIcon
} from "lucide-react"
import { toast } from "sonner"
import { fetchApi } from "@/lib/useApi"
import { ALL_PLATFORM_MODULES } from "../packages/page"

export interface SubscriptionPlan {
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

interface PlanEditModalProps {
  isOpen: boolean
  onClose: () => void
  plan: SubscriptionPlan | null
  onSuccess: () => void
}

export function PlanEditModal({
  isOpen,
  onClose,
  plan,
  onSuccess
}: PlanEditModalProps) {
  const isEditing = !!plan?.id

  const [formData, setFormData] = useState<SubscriptionPlan>({
    id: "",
    name: "",
    originalPriceYearly: 29999,
    offerPriceYearly: 19999,
    gstText: "+ 18% GST",
    studentLimit: 1000,
    instructorLimit: 10,
    courseLimit: 25,
    storageLimitGB: 100,
    enabledModules: {},
    customPaymentLink: "",
    status: "ACTIVE",
    popular: false,
    badgeText: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (plan) {
      setFormData({
        ...plan,
        enabledModules: plan.enabledModules || {}
      })
    } else {
      setFormData({
        id: `plan-${Date.now()}`,
        name: "CUSTOM GROWTH PLAN",
        originalPriceYearly: 39999,
        offerPriceYearly: 24999,
        gstText: "+ 18% GST",
        studentLimit: 1500,
        instructorLimit: 15,
        courseLimit: 30,
        storageLimitGB: 150,
        enabledModules: {
          coreLms: true,
          studentPortal: true,
          feesEmi: true,
          certificates: true,
          customPaymentGateway: true
        },
        customPaymentLink: "https://echolms.com/subscribe/custom",
        status: "ACTIVE",
        popular: false,
        badgeText: "New Special Offer"
      })
    }
  }, [plan, isOpen])

  if (!isOpen) return null

  const handleModuleToggle = (moduleKey: string) => {
    setFormData(prev => ({
      ...prev,
      enabledModules: {
        ...prev.enabledModules,
        [moduleKey]: !prev.enabledModules[moduleKey]
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error("Plan name is required")
      return
    }
    if (formData.offerPriceYearly <= 0) {
      toast.error("Offer price must be greater than 0")
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditing) {
        await fetchApi("/super-admin/plans", {
          method: "PUT",
          body: JSON.stringify(formData)
        })
        toast.success(`Plan "${formData.name}" updated successfully!`)
      } else {
        await fetchApi("/super-admin/plans", {
          method: "POST",
          body: JSON.stringify(formData)
        })
        toast.success(`New plan "${formData.name}" created!`)
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to save plan")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? `Edit ${formData.name}` : "Create New Subscription Plan"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">Configure pricing, student capacities, and 12-module permissions.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Plan Name & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Plan Display Name *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. ULTRA ACADEMY PRO"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Badge Tag / Offer Label</label>
              <input 
                type="text" 
                value={formData.badgeText || ""}
                onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                placeholder="e.g. Save 40% • Recommended"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Pricing & GST */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">Annual Pricing & Tax</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Original Price (₹/yr)</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.originalPriceYearly}
                  onChange={e => setFormData({ ...formData, originalPriceYearly: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-teal-800 block mb-1">Offer Price (₹/yr) *</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={formData.offerPriceYearly}
                  onChange={e => setFormData({ ...formData, offerPriceYearly: Number(e.target.value) })}
                  className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 text-xs font-mono font-black text-teal-700 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Tax Disclosure</label>
                <input 
                  type="text" 
                  value={formData.gstText}
                  onChange={e => setFormData({ ...formData, gstText: e.target.value })}
                  placeholder="+ 18% GST"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Quotas & Limits */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Students</label>
              <input 
                type="text" 
                value={formData.studentLimit}
                onChange={e => {
                  const val = e.target.value
                  setFormData({ ...formData, studentLimit: val.toLowerCase() === "unlimited" ? "Unlimited" : (parseInt(val, 10) || 0) })
                }}
                placeholder="500 or Unlimited"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Instructors</label>
              <input 
                type="text" 
                value={formData.instructorLimit}
                onChange={e => {
                  const val = e.target.value
                  setFormData({ ...formData, instructorLimit: val.toLowerCase() === "unlimited" ? "Unlimited" : (parseInt(val, 10) || 0) })
                }}
                placeholder="5 or Unlimited"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Courses</label>
              <input 
                type="text" 
                value={formData.courseLimit}
                onChange={e => {
                  const val = e.target.value
                  setFormData({ ...formData, courseLimit: val.toLowerCase() === "unlimited" ? "Unlimited" : (parseInt(val, 10) || 0) })
                }}
                placeholder="15 or Unlimited"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Storage (GB)</label>
              <input 
                type="text" 
                value={formData.storageLimitGB}
                onChange={e => {
                  const val = e.target.value
                  setFormData({ ...formData, storageLimitGB: val.toLowerCase() === "unlimited" ? "Unlimited" : (parseInt(val, 10) || 0) })
                }}
                placeholder="50 or Unlimited"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-teal-500"
              />
            </div>
          </div>

          {/* Custom Payment Link */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Custom Checkout / Payment Link</label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="url" 
                value={formData.customPaymentLink}
                onChange={e => setFormData({ ...formData, customPaymentLink: e.target.value })}
                placeholder="https://echolms.com/subscribe/starter or Razorpay payment page link"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Module Access Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Enabled SaaS Modules ({ALL_PLATFORM_MODULES.length}-Module Matrix)</label>
              <span className="text-[11px] font-bold text-teal-700">
                {Object.values(formData.enabledModules).filter(Boolean).length} / {ALL_PLATFORM_MODULES.length} Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto custom-scrollbar p-1">
              {ALL_PLATFORM_MODULES.map(m => {
                const isActive = !!formData.enabledModules[m.key]
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => handleModuleToggle(m.key)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-teal-50 border-teal-300 text-teal-950 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-500 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="pr-2">
                      <div className="text-xs">{m.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate max-w-[200px]">{m.description}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isActive ? "bg-teal-600 border-teal-600 text-white" : "bg-white border-slate-300"
                    }`}>
                      {isActive && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status & Popular Highlight */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={formData.popular || false}
                onChange={e => setFormData({ ...formData, popular: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs font-bold text-slate-800">Highlight as &quot;Most Popular&quot;</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Plan Status:</span>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as "ACTIVE" | "DISABLED" })}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ACTIVE">ACTIVE (Available)</option>
                <option value="DISABLED">DISABLED (Hidden)</option>
              </select>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            {isEditing ? "Save Changes" : "Create Plan"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
