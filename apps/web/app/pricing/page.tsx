import Link from "next/link"
import { CheckCircle2, ArrowRight, Shield, Zap } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950">
      {/* Header Nav */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              
            </div>
            <span className="font-extrabold text-xl tracking-tight">ECHO <span className="text-teal-400 font-normal text-xs uppercase tracking-widest ml-1 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">SaaS</span></span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/features" className="text-slate-300 hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="text-teal-400 font-bold">Pricing</Link>
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
            <Link href="/faq" className="text-slate-300 hover:text-white transition-colors">FAQ</Link>
            <Link href="/auth/login" className="bg-teal-500 text-slate-950 px-4 py-2 rounded-xl hover:bg-teal-400 transition-all font-bold shadow-md shadow-teal-500/20">
              Academy Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-semibold mb-6">
          <Zap className="w-3.5 h-3.5" /> Transparent Academy Pricing
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
          Simple, Predictable Plans for <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Growing Academies</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          No hidden transaction charges. Choose the plan that fits your student scale.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
        {[
          {
            name: "Starter Academy",
            desc: "Ideal for boutique training institutes & independent educators launching online.",
            price: "₹4,999",
            period: "/ month",
            popular: false,
            features: [
              "Up to 250 Active Students",
              "5 Educator Accounts",
              "Courses & Video Player",
              "Integrated Razorpay / PhonePe Payments",
              "Basic Lead CRM",
              "Email Notifications"
            ]
          },
          {
            name: "Growth Institute",
            desc: "Designed for established academies scaling admissions & automated marketing.",
            price: "₹12,499",
            period: "/ month",
            popular: true,
            features: [
              "Up to 1,500 Active Students",
              "20 Educator Accounts",
              "Meta Facebook Lead Ads Webhooks",
              "WhatsApp Business API Autopilot",
              "Live Classes (Google Meet / Zoom)",
              "Automated GST PDF Invoicing",
              "Custom Domain Support",
              "Public Certificate Verification"
            ]
          },
          {
            name: "Enterprise Multi-Branch",
            desc: "For large colleges, franchises & multi-city educational institutions.",
            price: "Custom",
            period: "quote",
            popular: false,
            features: [
              "Unlimited Active Students",
              "Unlimited Educators & Admins",
              "Dedicated Database Isolation",
              "Multi-Branch Franchise Architecture",
              "Custom API & Webhooks Engine",
              "SLA & Priority Support Manager"
            ]
          }
        ].map((plan, i) => (
          <div key={i} className={`relative bg-slate-900/80 border rounded-2xl p-8 flex flex-col justify-between transition-all ${plan.popular ? 'border-teal-500 shadow-xl shadow-teal-500/10' : 'border-slate-800'}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Most Popular Choice
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-xs mb-6 leading-relaxed">{plan.desc}</p>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-slate-400 text-xs">{plan.period}</span>
              </div>
              <ul className="space-y-3 border-t border-slate-800 pt-6 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/contact"
              className={`w-full text-center font-extrabold text-xs py-3 rounded-xl transition-all ${plan.popular ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
            >
              Get Started with {plan.name}
            </Link>
          </div>
        ))}
      </section>
    </div>
  )
}
