"use client"

import React from "react"
import { Lock, Sparkles, ArrowRight, ShieldCheck } from "lucide-react"
import { MODULE_UPGRADE_METADATA } from "./UpgradePlanModal"
import { useOrganization } from "@/context/OrganizationContext"
import { useRouter } from "next/navigation"

interface LockedFeatureGateProps {
  featureKey: string
  title?: string
  description?: string
  children?: React.ReactNode
}

export function LockedFeatureGate({
  featureKey,
  title,
  description,
  children
}: LockedFeatureGateProps) {
  const org = useOrganization()
  const router = useRouter()
  const meta = MODULE_UPGRADE_METADATA[featureKey]
  const displayTitle = title || meta?.title || "Premium Feature Locked"
  const displayDesc = description || meta?.desc || "This feature is only available on Growth Institute and Enterprise Pro plans."
  const requiredTier = meta?.requiredPlan || "GROWTH"

  const openUpgradeModal = () => {
    window.dispatchEvent(
      new CustomEvent("open-upgrade-modal", {
        detail: {
          featureKey,
          featureTitle: displayTitle,
          featureDescription: displayDesc,
          requiredPlan: requiredTier
        }
      })
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center max-w-2xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/10 border border-amber-200">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Requires {requiredTier === "ENTERPRISE" ? "Enterprise Pro" : "Growth Institute or Enterprise Pro"}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{displayTitle}</h1>
        <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-lg mx-auto">
          {displayDesc}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-md w-full text-left space-y-2">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          Why upgrade your subscription?
        </div>
        <ul className="space-y-1 text-slate-500 list-disc list-inside">
          <li>Immediate access to {displayTitle}</li>
          <li>Higher student, instructor & batch limits</li>
          <li>Full CRM automations & priority support</li>
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          ← Go Back
        </button>
        <button
          onClick={openUpgradeModal}
          className="px-6 py-2.5 rounded-xl text-xs font-black bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all hover:gap-2.5"
        >
          Upgrade Plan to Unlock <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
