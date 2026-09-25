"use client"

import React, { useState } from "react"
import { motion } from  "framer-motion"
import { X, ShieldCheck, CreditCard, TrendingUp, Calendar, CheckCircle2, AlertCircle, RefreshCw, Loader2, Award, Workflow } from  "lucide-react"
import { toast } from  "sonner"
import { fetchApi } from  "@/lib/useApi"

interface ModifySubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: any | null
  onSuccess: () => void
}

const AVAILABLE_PLANS = [
  { id: "STARTER", name: "STARTER ACADEMY", price: "₹14,999/yr", students: "500 Students" },
  { id: "GROWTH", name: "GROWTH INSTITUTE", price: "₹29,999/yr", students: "2,500 Students", popular: true },
  { id: "ENTERPRISE", name: "ENTERPRISE PRO", price: "₹59,999/yr", students: "Unlimited Students" }
]

export function ModifySubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onSuccess
}: ModifySubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(subscription?.plan || "GROWTH")
  const [selectedStatus, setSelectedStatus] = useState<string>(subscription?.status || "ACTIVE")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !subscription) return null

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await fetchApi("/super-admin/subscriptions", {
        method: "PATCH",
        body: JSON.stringify({
          academyId: subscription.academyId || subscription.id.replace("sub-", ""),
          subscription: selectedPlan,
          status: selectedStatus
        })
      })

      toast.success(`Successfully updated subscription for ${subscription.academyName || 'Academy'}!`)
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to update subscription")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Manage Tenant Subscription</h2>
              <p className="text-xs text-slate-500 font-medium">{subscription.academyName || "Academy"}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Select Plan Tier */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 block">Subscription Tier</label>
            <div className="grid grid-cols-1 gap-2.5">
              {AVAILABLE_PLANS.map(p => {
                const isSelected = selectedPlan === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{p.name}</span>
                        {p.popular && (
                          <span className="px-2 py-0.2 rounded-full bg-teal-600 text-white text-[9px] font-black uppercase">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{p.students} • {p.price}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-teal-600 bg-teal-600 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subscription Lifecycle Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Lifecycle Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-500"
            >
              <option value="ACTIVE">ACTIVE — Full Access</option>
              <option value="TRIAL">TRIAL — 14-Day Evaluation</option>
              <option value="PAST_DUE">PAST_DUE — Payment Overdue Grace Period</option>
              <option value="EXPIRED">EXPIRED — Access Suspended</option>
              <option value="CANCELLED">CANCELLED — Terminated</option>
            </select>
          </div>

          {/* Safety Notification */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Modifications take effect immediately for this tenant. If upgrading or extending, new features and student quotas unlock automatically.
            </p>
          </div>

        </div>

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
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            Save & Apply Tier
          </button>
        </div>
      </motion.div>
    </div>
  )
}
