import Link from "next/link"
import { CheckCircle2, ArrowRight, Shield, Zap, X, MessageCircle, Mail, HelpCircle, PhoneCall } from "lucide-react"

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
      studentLimit: "Up to 500 Active Students",
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
      studentLimit: "Up to 2,500 Active Students",
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
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950">
      {/* Header Nav */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 font-black text-slate-950">
              e
            </div>
            <span className="font-extrabold text-xl tracking-tight">ECHO <span className="text-teal-400 font-normal text-xs uppercase tracking-widest ml-1 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">SaaS</span></span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/features" className="text-slate-300 hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="text-teal-400 font-bold">Pricing</Link>
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
            <Link href="/auth/login" className="bg-teal-500 text-slate-950 px-4 py-2 rounded-xl hover:bg-teal-400 transition-all font-bold shadow-md shadow-teal-500/20">
              Academy Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-20 px-6 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-semibold">
          <Zap className="w-3.5 h-3.5" /> Yearly Transparent Subscription Pricing
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Simple Annual Plans for <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Scaling Academies</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
          No hidden per-student commission fees. Billed annually with explicit <strong className="text-teal-400">+ 18% GST</strong> disclosure and custom payment link support.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
        {packages.map((plan, i) => (
          <div key={i} className={`relative bg-slate-900/90 border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${plan.popular ? 'border-teal-500 shadow-xl shadow-teal-500/10 ring-2 ring-teal-500/20' : 'border-slate-800'}`}>
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                {plan.discountBadge}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-1">{plan.discountBadge}</span>
                <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed font-medium">{plan.desc}</p>
              </div>

              {/* Pricing Block */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-black text-white font-mono">{plan.offerPriceYearly}</span>
                    <span className="text-xs text-slate-500 line-through font-mono ml-2">{plan.originalPriceYearly}</span>
                    <span className="text-xs text-slate-400 block font-sans">/ year</span>
                  </div>
                  <span className="text-[10px] font-black bg-teal-500/10 text-teal-400 border border-teal-500/30 px-2.5 py-1 rounded-lg uppercase">
                    Yearly Billed
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80 text-slate-400 font-semibold">
                  <span className="text-teal-400 font-bold">{plan.gstText}</span>
                  <span>No Per-Student Commission</span>
                </div>
              </div>

              {/* Capacity Banner */}
              <div className="p-3 bg-teal-500/5 border border-teal-500/20 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>Student Limit:</span>
                  <span className="text-teal-400 font-mono">{plan.studentLimit}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>Educator Accounts:</span>
                  <span className="text-teal-400 font-mono">{plan.instructorLimit}</span>
                </div>
              </div>

              {/* Controllable Modules Checklist */}
              <div className="space-y-2 border-t border-slate-800 pt-5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Platform Modules Included ({plan.enabledModuleKeys.length}/12 Active)
                </span>

                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {ALL_PUBLIC_MODULES.map(mod => {
                    const isEnabled = plan.enabledModuleKeys.includes(mod.key)
                    return (
                      <div key={mod.key} className="flex items-start gap-2.5 text-xs">
                        {isEnabled ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                        )}
                        <span className={isEnabled ? "text-slate-200 font-medium" : "text-slate-600 line-through"}>
                          {mod.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800">
              <Link
                href={plan.paymentLink}
                target="_blank"
                className={`w-full text-center font-extrabold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  plan.popular 
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                Subscribe to {plan.name} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Enterprise Contact Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-500/30 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-black text-white">Need a Custom Module Combination or SLA Guarantee?</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">Our enterprise team can craft custom module permissions, multi-branch architecture, and custom payment gateway integrations.</p>
          </div>
          <Link 
            href="/contact"
            className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl transition-all whitespace-nowrap shadow-md shadow-teal-500/20"
          >
            Talk to Enterprise Sales
          </Link>
        </div>
      </section>
    </div>
  )
}
