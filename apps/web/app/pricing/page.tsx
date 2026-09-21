"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  CheckCircle2, ArrowRight, Shield, Zap, X, MessageCircle, Mail, 
  HelpCircle, PhoneCall, Check, ExternalLink, Globe, Sparkles 
} from "lucide-react"

export const ALL_PUBLIC_MODULES = [
  { key: "coreLms", label: "Core LMS & Course Studio (Video Player, DRM, Attachments)" },
  { key: "studentPortal", label: "Student Portal & Mobile PWA App" },
  { key: "feesEmi", label: "Student Fees & Automated EMI Rules Engine" },
  { key: "certificates", label: "AI Certificate Designer & Public QR Verification" },
  { key: "whatsappAuto", label: "WhatsApp 1-Tap Automation Engine (Broadcasts & WABA API)" },
  { key: "emailMarketing", label: "Email Drip & Newsletter Automation" },
  { key: "webinars", label: "Webinars & Conversion Funnels (Live Stream & 24/7 Evergreen)" },
  { key: "whitelabel", label: "Custom Domain SSL & Full Whitelabeling (No 'echo' Branding)" },
  { key: "mentorship", label: "1-on-1 Mentorship & Booking Room" },
  { key: "walkInKiosk", label: "Offline Walk-in & Kiosk CRM (QR Attendance & Receipts)" },
  { key: "referrals", label: "Affiliate & Student Ambassador Referral Portal" },
  { key: "customPaymentGateway", label: "Custom Payment Link & Custom Gateway Integration" }
]

export default function PricingPage() {
  const packages = [
    {
      name: "Starter Academy",
      desc: "Ideal for boutique training institutes & independent educators scaling online.",
      originalPriceYearly: "₹24,999",
      offerPriceYearly: "₹14,999",
      gstText: "+ 18% GST",
      discountBadge: "Save 40% • Yearly Only",
      studentLimit: "500 Active Students",
      instructorLimit: "5 Educator Accounts",
      popular: false,
      paymentLink: "https://echolms.com/subscribe/starter",
      enabledModuleKeys: ["coreLms", "studentPortal", "feesEmi", "certificates", "customPaymentGateway"]
    },
    {
      name: "Growth Institute",
      desc: "Designed for established academies scaling admissions, WhatsApp automation & webinars.",
      originalPriceYearly: "₹49,999",
      offerPriceYearly: "₹29,999",
      gstText: "+ 18% GST",
      discountBadge: "Most Popular Choice • 40% OFF",
      studentLimit: "2,500 Active Students",
      instructorLimit: "20 Educator Accounts",
      popular: true,
      paymentLink: "https://echolms.com/subscribe/growth",
      enabledModuleKeys: ["coreLms", "studentPortal", "feesEmi", "certificates", "whatsappAuto", "emailMarketing", "webinars", "whitelabel", "mentorship", "referrals", "customPaymentGateway"]
    },
    {
      name: "Enterprise Multi-Branch",
      desc: "For multi-city colleges, large coaching franchises & enterprise education networks.",
      originalPriceYearly: "₹99,999",
      offerPriceYearly: "₹69,999",
      gstText: "+ 18% GST",
      discountBadge: "Full Suite Unlocked",
      studentLimit: "Unlimited Active Students",
      instructorLimit: "Unlimited Educator Accounts",
      popular: false,
      paymentLink: "https://echolms.com/subscribe/enterprise",
      enabledModuleKeys: ["coreLms", "studentPortal", "feesEmi", "certificates", "whatsappAuto", "emailMarketing", "webinars", "whitelabel", "mentorship", "walkInKiosk", "referrals", "customPaymentGateway"]
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-poppins selection:bg-teal-500/20 selection:text-teal-900 antialiased">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/echo_logo.png" alt="echo logo" className="h-9 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900 tracking-tight lowercase">echo</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">Academy Operating System by Grekam</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-teal-700 transition-colors">Home</Link>
            <Link href="/features" className="hover:text-teal-700 transition-colors">Features</Link>
            <Link href="/pricing" className="text-teal-700 font-extrabold">Pricing</Link>
            <Link href="/about" className="hover:text-teal-700 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-teal-700 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/auth/login" 
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all"
            >
              Sign In
            </Link>

            <Link 
              href="/contact"
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative pt-12 pb-16 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-teal-50/20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-teal-600" /> Transparent Annual Pricing • No Per-Student Fees
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Predictable Yearly Subscriptions for <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">Growing Academies</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
            Zero per-transaction charges or hidden commission fees. Billed annually with explicit <strong className="text-teal-800 font-bold">+ 18% GST</strong> disclosure and customizable module permissions.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Save up to 40% on Yearly Billing
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((plan, i) => (
            <div 
              key={i} 
              className={`bg-white border rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xs transition-all ${
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
              
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 block mb-1">
                    {plan.discountBadge}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed font-medium">{plan.desc}</p>
                </div>

                {/* Pricing Box */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-black text-slate-900 font-mono">{plan.offerPriceYearly}</span>
                      <span className="text-xs text-slate-400 font-mono line-through ml-2">{plan.originalPriceYearly}</span>
                      <span className="text-xs text-slate-500 font-bold block">/ year</span>
                    </div>
                    <span className="text-[10px] font-black bg-teal-100 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg uppercase">
                      Yearly Billed
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/80 font-bold text-slate-600">
                    <span className="text-teal-800 font-black">{plan.gstText}</span>
                    <span className="text-slate-500">No Student Commission</span>
                  </div>
                </div>

                {/* Capacity Card */}
                <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span>Student Limit:</span>
                    <span className="text-teal-800 font-mono font-black">{plan.studentLimit}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span>Educator Accounts:</span>
                    <span className="text-teal-800 font-mono font-black">{plan.instructorLimit}</span>
                  </div>
                </div>

                {/* Controllable Modules Checklist */}
                <div className="space-y-2 border-t border-slate-100 pt-5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Included Platform Modules ({plan.enabledModuleKeys.length}/12 Active)
                  </span>

                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                    {ALL_PUBLIC_MODULES.map(mod => {
                      const isEnabled = plan.enabledModuleKeys.includes(mod.key)
                      return (
                        <div key={mod.key} className="flex items-start gap-2.5 text-xs">
                          {isEnabled ? (
                            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                          )}
                          <span className={isEnabled ? "text-slate-800 font-medium leading-snug" : "text-slate-400 line-through leading-snug"}>
                            {mod.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href={plan.paymentLink}
                  target="_blank"
                  className={`w-full text-center font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs ${
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

      {/* Enterprise Contact Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg text-white">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-black">Need a Custom Module Combination or SLA Guarantee?</h2>
            <p className="text-teal-100 text-xs sm:text-sm font-medium">Our enterprise team can craft custom module combinations, multi-city franchise permissions, and dedicated database isolation.</p>
          </div>
          <Link 
            href="/contact"
            className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs rounded-xl transition-all whitespace-nowrap shadow-md"
          >
            Talk to Enterprise Sales
          </Link>
        </div>
      </section>
    </div>
  )
}

