"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  CheckCircle2, ArrowRight, Shield, Zap, X, MessageCircle, Mail, 
  ArrowLeft, Check, ExternalLink, Globe, Sparkles, Building2, HelpCircle
} from "lucide-react"

export interface ComparisonRow {
  feature: string
  category: "Capacity & Scale" | "Core LMS & App" | "Webinars & Funnels" | "Automations" | "Branding & Domain" | "Fees & Financials" | "Mentorship & Offline" | "Support & SLA"
  starter: string | boolean
  growth: string | boolean
  enterprise: string | boolean
}

export const FEATURE_COMPARISON_MATRIX: ComparisonRow[] = [
  // Capacity & Scale
  { feature: "Active Student Capacity", category: "Capacity & Scale", starter: "500 Students", growth: "2,500 Students", enterprise: "Unlimited" },
  { feature: "Educator & Staff Accounts", category: "Capacity & Scale", starter: "5 Educators", growth: "20 Educators", enterprise: "Unlimited" },
  { feature: "Published Courses Limit", category: "Capacity & Scale", starter: "15 Courses", growth: "50 Courses", enterprise: "Unlimited" },
  { feature: "Video & Document Storage", category: "Capacity & Scale", starter: "50 GB", growth: "250 GB", enterprise: "Unlimited GB" },

  // Core LMS & App
  { feature: "Core Course Builder & Video Studio", category: "Core LMS & App", starter: true, growth: true, enterprise: true },
  { feature: "Student PWA Mobile App & Offline Mode", category: "Core LMS & App", starter: true, growth: true, enterprise: true },
  { feature: "Encrypted DRM Video Streaming", category: "Core LMS & App", starter: true, growth: true, enterprise: true },
  { feature: "Assignments & Quiz Engine", category: "Core LMS & App", starter: true, growth: true, enterprise: true },

  // Webinars & Funnels
  { feature: "Live Stream Broadcasts (YouTube/Zoom/HLS)", category: "Webinars & Funnels", starter: false, growth: true, enterprise: true },
  { feature: "Timed Pitch CTA Offer Popups", category: "Webinars & Funnels", starter: false, growth: true, enterprise: true },
  { feature: "24/7 Evergreen On-Demand Loops", category: "Webinars & Funnels", starter: false, growth: true, enterprise: true },
  { feature: "Live Chat & Attendee Counter", category: "Webinars & Funnels", starter: false, growth: true, enterprise: true },

  // Automations
  { feature: "WhatsApp 1-Tap Reminders & Broadcasts", category: "Automations", starter: false, growth: true, enterprise: true },
  { feature: "Official WhatsApp Business API (WABA)", category: "Automations", starter: false, growth: true, enterprise: true },
  { feature: "Email Drip & Sequence Builder", category: "Automations", starter: false, growth: true, enterprise: true },
  { feature: "Meta Lead Ads Webhook Receiver", category: "Automations", starter: false, growth: true, enterprise: true },

  // Branding & Domain
  { feature: "Custom Domain (CNAME SSL)", category: "Branding & Domain", starter: false, growth: true, enterprise: true },
  { feature: "Full Whitelabeling (Remove 'echo' Logo)", category: "Branding & Domain", starter: false, growth: true, enterprise: true },
  { feature: "Custom Theme & Color Customizer", category: "Branding & Domain", starter: true, growth: true, enterprise: true },

  // Fees & Financials
  { feature: "Student Fees & Automated EMI Engine", category: "Fees & Financials", starter: true, growth: true, enterprise: true },
  { feature: "Automated GST PDF Receipts", category: "Fees & Financials", starter: true, growth: true, enterprise: true },
  { feature: "Auto Payment Overdue Reminders", category: "Fees & Financials", starter: true, growth: true, enterprise: true },

  // Mentorship & Offline
  { feature: "1-on-1 Mentorship & Booking Room", category: "Mentorship & Offline", starter: false, growth: true, enterprise: true },
  { feature: "Offline Walk-in & Kiosk CRM", category: "Mentorship & Offline", starter: false, growth: false, enterprise: true },
  { feature: "Affiliate & Ambassador Referral Portal", category: "Mentorship & Offline", starter: false, growth: true, enterprise: true },

  // Support & SLA
  { feature: "Custom Payment Link Override", category: "Support & SLA", starter: true, growth: true, enterprise: true },
  { feature: "Dedicated Account Manager & SLA", category: "Support & SLA", starter: false, growth: false, enterprise: true }
]

export default function DedicatedPricingPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL")

  const packages = [
    {
      name: "Starter Academy",
      desc: "Ideal for boutique training institutes & independent educators launching online.",
      originalPriceYearly: "₹24,999",
      offerPriceYearly: "₹14,999",
      gstText: "+ 18% GST",
      discountBadge: "Save 40% • Yearly Only",
      popular: false,
      paymentLink: "https://echolms.com/subscribe/starter"
    },
    {
      name: "Growth Institute",
      desc: "Designed for established academies scaling admissions, WhatsApp automation & webinars.",
      originalPriceYearly: "₹49,999",
      offerPriceYearly: "₹29,999",
      gstText: "+ 18% GST",
      discountBadge: "Most Popular Choice • 40% OFF",
      popular: true,
      paymentLink: "https://echolms.com/subscribe/growth"
    },
    {
      name: "Enterprise Multi-Branch",
      desc: "For multi-city colleges, large coaching franchises & enterprise education networks.",
      originalPriceYearly: "₹99,999",
      offerPriceYearly: "₹69,999",
      gstText: "+ 18% GST",
      discountBadge: "Full Suite Unlocked",
      popular: false,
      paymentLink: "https://echolms.com/subscribe/enterprise"
    }
  ]

  const categories = ["ALL", "Capacity & Scale", "Core LMS & App", "Webinars & Funnels", "Automations", "Branding & Domain", "Fees & Financials", "Mentorship & Offline", "Support & SLA"]

  const filteredComparison = FEATURE_COMPARISON_MATRIX.filter(item => {
    if (activeCategory !== "ALL" && item.category !== activeCategory) return false
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-poppins selection:bg-teal-500/20 selection:text-teal-900 antialiased">
      
      {/* Top Header Bar (Dedicated to Pricing: Logo + Go to Home Button) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/echo_logo.png" alt="echo logo" className="h-8 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-slate-900 tracking-tight lowercase">echo</span>
                <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
                  OS
                </span>
              </div>
            </div>
          </Link>

          {/* Go to Home Button */}
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go to Home
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative pt-10 pb-12 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-teal-50/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-teal-600" /> Dedicated Pricing & Plan Matrix
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Subscription Pricing & <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">Complete Feature Comparison</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-medium">
            Transparent yearly pricing with explicit <strong className="text-teal-800 font-bold">+ 18% GST</strong> disclosure. Zero per-student transaction fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {packages.map((plan, i) => (
            <div 
              key={i} 
              className={`bg-white border rounded-3xl p-6 flex flex-col justify-between relative shadow-xs transition-all ${
                plan.popular 
                  ? "border-teal-500 ring-2 ring-teal-500/20 shadow-md" 
                  : "border-slate-200 hover:border-teal-300"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                  MOST POPULAR CHOICE
                </span>
              )}
              
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 block mb-1">
                    {plan.discountBadge}
                  </span>
                  <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed font-medium">{plan.desc}</p>
                </div>

                {/* Pricing Box */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{plan.offerPriceYearly}</span>
                      <span className="text-xs text-slate-400 font-mono line-through ml-2">{plan.originalPriceYearly}</span>
                      <span className="text-xs text-slate-500 font-bold block">/ year</span>
                    </div>
                    <span className="text-[10px] font-black bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.5 rounded uppercase">
                      Yearly
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/80 font-bold text-slate-600">
                    <span className="text-teal-800 font-black">{plan.gstText}</span>
                    <span className="text-slate-500">No Student Commission</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href={plan.paymentLink}
                  target="_blank"
                  className={`w-full text-center font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs ${
                    plan.popular 
                      ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20" 
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  Subscribe to {plan.name} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Matrix Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Full Side-by-Side Feature Comparison Matrix</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Compare capabilities, limits, and module entitlements across all three plans.</p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-2 justify-start sm:justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? "bg-teal-600 text-white shadow-2xs" 
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-900 text-xs font-black">
                  <th className="p-4 sm:p-5 w-2/5">Platform Capability / Module</th>
                  <th className="p-4 sm:p-5 text-center w-1/5">Starter Academy</th>
                  <th className="p-4 sm:p-5 text-center w-1/5 bg-teal-50/60 text-teal-900 border-x border-teal-200">Growth Institute</th>
                  <th className="p-4 sm:p-5 text-center w-1/5">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredComparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 sm:p-4.5 font-bold text-slate-900 flex items-center justify-between">
                      <span>{row.feature}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{row.category}</span>
                    </td>
                    
                    {/* Starter */}
                    <td className="p-4 sm:p-4.5 text-center font-bold">
                      {typeof row.starter === "boolean" ? (
                        row.starter ? <CheckCircle2 className="w-4 h-4 text-teal-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <span className="font-mono text-slate-800">{row.starter}</span>
                      )}
                    </td>

                    {/* Growth */}
                    <td className="p-4 sm:p-4.5 text-center font-bold bg-teal-50/30 border-x border-teal-100">
                      {typeof row.growth === "boolean" ? (
                        row.growth ? <CheckCircle2 className="w-4 h-4 text-teal-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <span className="font-mono text-teal-900 font-black">{row.growth}</span>
                      )}
                    </td>

                    {/* Enterprise */}
                    <td className="p-4 sm:p-4.5 text-center font-bold">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? <CheckCircle2 className="w-4 h-4 text-teal-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : (
                        <span className="font-mono text-slate-900">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer Navigation Bar */}
      <section className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">echo OS — Academy Operating System by Grekam</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-xs flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Return to Homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


