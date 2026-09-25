import React, { useState, useEffect } from "react"
import { motion } from  "framer-motion"
import { X, CheckCircle2, Lock, ArrowRight, Phone, Video, MessageSquare, Layers, Award, Globe, Loader2, Megaphone, TrendingUp, BookOpen, ShieldCheck } from  "lucide-react"
import { useOrganization } from  "@/context/OrganizationContext"
import { useRouter } from  "next/navigation"

export interface UpgradeModalDetail {
  featureKey?: string
  featureTitle?: string
  featureDescription?: string
  requiredPlan?: "GROWTH" | "ENTERPRISE"
}

// Module descriptive names and teasers
export const MODULE_UPGRADE_METADATA: Record<string, { title: string; desc: string; requiredPlan: "GROWTH" | "ENTERPRISE"; icon: React.ElementType }> = {
  metaAdsSync: {
    title: "Meta Ads CRM Bridge",
    desc: "Sync Facebook & Instagram Lead Ads straight to your admissions pipeline with instant counsellor assignment.",
    requiredPlan: "GROWTH",
    icon: Megaphone
  },
  googleAdsSync: {
    title: "Google Ads Lead Sync",
    desc: "Capture high-intent Google Search & PMax leads automatically into ECHO CRM with real-time conversion API sync.",
    requiredPlan: "GROWTH",
    icon: Globe
  },
  callIntelligence: {
    title: "Call Intelligence & Telephony",
    desc: "1-Click browser dialer, automatic call recordings, speech-to-text transcripts, and conversation audits.",
    requiredPlan: "GROWTH",
    icon: Phone
  },
  whatsappAuto: {
    title: "WhatsApp Cloud API Automation",
    desc: "Official WhatsApp Cloud API for automated fee alerts, class reminders, attendance warnings, and bulk broadcasts.",
    requiredPlan: "GROWTH",
    icon: MessageSquare
  },
  webinars: {
    title: "Interactive Webinars & Funnels",
    desc: "Live broadcast studio with interactive student chat, screen sharing, automated CTA pitch popups, and replay funnels.",
    requiredPlan: "GROWTH",
    icon: Video
  },
  mentorship: {
    title: "1:1 Mentorship & Office Hours",
    desc: "Instructor slot booking calendar, 1:1 paid consulting rooms, and private doubt-clearing sessions.",
    requiredPlan: "GROWTH",
    icon: Video
  },
  walkInKiosk: {
    title: "Campus Reception Walk-in Kiosk",
    desc: "Tablet-optimized front-desk reception kiosk for physical visitors with QR pass verification and enquiry routing.",
    requiredPlan: "ENTERPRISE",
    icon: Layers
  },
  whitelabel: {
    title: "Custom Domain & Whitelabel",
    desc: "Remove ECHO branding, host on your own domain (e.g. learn.myacademy.com), custom favicon, and custom themes.",
    requiredPlan: "GROWTH",
    icon: Globe
  },
  referrals: {
    title: "Student Referrals & Rewards",
    desc: "Student affiliate links, coupon reward tracking, commission payouts, and ambassador leaderboards.",
    requiredPlan: "GROWTH",
    icon: Award
  },
  aiLessonWriter: {
    title: "Curriculum & Course Studio",
    desc: "Structured lesson planning, syllabus builders, resource attachments, and auto-graded assessments.",
    requiredPlan: "GROWTH",
    icon: BookOpen
  },
  aiRiskEngine: {
    title: "Dropout & Payment Risk Engine",
    desc: "Predict student dropouts and overdue fees before they happen using statistical attendance and activity scoring.",
    requiredPlan: "GROWTH",
    icon: TrendingUp
  },
  apiAccess: {
    title: "Developer REST API & Webhooks",
    desc: "Programmatic access to student databases, webhook event streaming, and custom ERP/SIS system integrations.",
    requiredPlan: "ENTERPRISE",
    icon: Layers
  }
}

export function UpgradePlanModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [detail, setDetail] = useState<UpgradeModalDetail | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const org = useOrganization()
  const router = useRouter()

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvt = e as CustomEvent<UpgradeModalDetail>
      const meta = customEvt.detail?.featureKey ? MODULE_UPGRADE_METADATA[customEvt.detail.featureKey] : null

      setDetail({
        featureKey: customEvt.detail?.featureKey,
        featureTitle: customEvt.detail?.featureTitle || meta?.title || "Premium Feature",
        featureDescription: customEvt.detail?.featureDescription || meta?.desc || "Upgrade your subscription tier to unlock this module.",
        requiredPlan: customEvt.detail?.requiredPlan || meta?.requiredPlan || "GROWTH"
      })
      setIsOpen(true)
    }

    window.addEventListener("open-upgrade-modal", handleOpen)
    return () => window.removeEventListener("open-upgrade-modal", handleOpen)
  }, [])

  if (!isOpen) return null

  const handleUpgradeNavigation = () => {
    setIsRedirecting(true)
    setIsOpen(false)
    router.push("/dashboard/settings/billing")
  }

  const currentPlanName = org?.plan?.name || (org?.subscription ? `${org.subscription} PLAN` : "STARTER PLAN")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col relative"
      >
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black tracking-wider uppercase backdrop-blur-xs flex items-center gap-1 border border-white/20">
              <Lock className="w-3 h-3" /> PRO MODULE LOCK
            </span>
            <span className="text-xs text-teal-100 font-mono">Current: {currentPlanName}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">{detail?.featureTitle}</h2>
          <p className="text-xs text-teal-50 mt-1 font-medium leading-relaxed max-w-md">
            {detail?.featureDescription}
          </p>
        </div>

        {/* Content & Plan Highlights */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                Available in {detail?.requiredPlan === "ENTERPRISE" ? "Enterprise Pro Plan" : "Growth Institute & Enterprise Pro Plans"}
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed font-medium">
                Your current plan does not include this module. Upgrading will immediately unlock this feature plus higher student limits and expanded storage.
              </p>
            </div>
          </div>

          {/* Quick Perks comparison */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-teal-700 font-mono">🥈 Growth Institute</span>
              <div className="text-base font-black text-slate-900 font-mono">₹2,499<span className="text-[10px] text-slate-500 font-normal">/mo</span></div>
              <ul className="space-y-1 text-[11px] text-slate-600 font-medium">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> 2,500 Active Students</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Meta & Google Ads Sync</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Call Intel & WhatsApp Auto</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/30 space-y-1.5 relative overflow-hidden">
              <span className="text-[10px] font-black uppercase text-emerald-700 font-mono">🥇 Enterprise Pro</span>
              <div className="text-base font-black text-slate-900 font-mono">₹5,833<span className="text-[10px] text-slate-500 font-normal">/mo</span></div>
              <ul className="space-y-1 text-[11px] text-slate-600 font-medium">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Unlimited Students</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Walk-ins Kiosk & Multi-Branch</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> REST API & 0% Fees</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgradeNavigation}
              disabled={isRedirecting}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all hover:gap-2.5"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading Plans...
                </>
              ) : (
                <>
                  View Pricing & Upgrade <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
