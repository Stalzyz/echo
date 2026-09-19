"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Layers, ArrowRight, Sparkles, Globe, BookOpen, Video, 
  Award, Users, Zap, Check, X, Loader2
} from "lucide-react"
import { toast } from "sonner"

export default function SaaSLandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("Professional")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [form, setForm] = useState({
    academyName: "",
    adminName: "",
    email: "",
    domainSlug: "",
  })

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setRegisterModalOpen(false)
      toast.success(`Welcome to Echo LMS! Trial activated for ${form.academyName}. Check your email to get started.`)
      setForm({ academyName: "", adminName: "", email: "", domainSlug: "" })
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500/20">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-teal-50/50 to-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
            <span>Powering 500+ Academies & Universities Worldwide</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            Launch & Scale Your <br /><span className="text-teal-600">White-Labeled LMS</span> in Minutes
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            The all-in-one multi-tenant SaaS platform for academies, educators, and enterprise training. Course builder, live classes, automated certificates, and fee management with your own custom domain.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setRegisterModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-base rounded-2xl transition-all shadow-lg shadow-teal-600/25 flex items-center justify-center gap-3"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <Link 
              href="/dashboard/vendors" 
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base rounded-2xl border border-slate-200 transition-all flex items-center justify-center"
            >
              Super Admin Console
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-600" /> 14-Day Free Trial</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-600" /> No Credit Card Required</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-600" /> Instant Custom Domain setup</span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-teal-600 mb-2">Platform Capabilities</h2>
            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Everything You Need to Run an Enterprise Academy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-teal-600" />}
              title="Whitelabel Custom Domain"
              desc="Host your academy under your own domain (e.g., learn.yourbrand.com) with automated SSL and custom theme colors."
            />
            <FeatureCard 
              icon={<BookOpen className="w-6 h-6 text-teal-600" />}
              title="Interactive Course Builder"
              desc="Create multi-module curriculums, video lessons, downloadable resources, and quizzes with drag-and-drop ease."
            />
            <FeatureCard 
              icon={<Video className="w-6 h-6 text-teal-600" />}
              title="Live Class & Meetings"
              desc="Integrate Google Meet & Zoom natively to schedule live interactive webinars and track automated student attendance."
            />
            <FeatureCard 
              icon={<Award className="w-6 h-6 text-teal-600" />}
              title="Automated Certificates"
              desc="Issue verifiable completion certificates with unique QR codes and customizable A4 canvas layouts."
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-teal-600" />}
              title="Admissions & Fee Management"
              desc="Built-in CRM for lead capture, student onboarding, fee installment collection, and automated payment receipts."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-teal-600" />}
              title="AI Student Risk Engine"
              desc="Predict dropouts early using AI engagement scoring and trigger automated student retention workflows."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-black uppercase tracking-widest text-teal-600 mb-2">Flexible SaaS Pricing</h2>
            <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Simple Plans for Academies of All Sizes</p>
            
            <div className="mt-8 inline-flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xs">
              <button 
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === "monthly" ? "bg-teal-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
              >
                Monthly Billing
              </button>
              <button 
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${billingCycle === "yearly" ? "bg-teal-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
              >
                Yearly Billing <span className="text-[10px] bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-black">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard 
              name="Starter"
              price={billingCycle === "monthly" ? "$49" : "$39"}
              period={billingCycle === "monthly" ? "/month" : "/month billed yearly"}
              desc="Ideal for solo educators and newly launched coaching centers."
              features={[
                "Up to 250 Active Students",
                "10 Active Courses",
                "Basic Quiz & Assignment Builder",
                "Echo Domain Subdomain",
                "Email Support",
              ]}
              ctaText="Start 14-Day Free Trial"
              onSelect={() => { setSelectedPlan("Starter"); setRegisterModalOpen(true); }}
            />

            <PricingCard 
              name="Professional"
              price={billingCycle === "monthly" ? "$149" : "$119"}
              period={billingCycle === "monthly" ? "/month" : "/month billed yearly"}
              desc="Perfect for growing academies requiring whitelabeling & live classes."
              isPopular
              features={[
                "Up to 2,500 Active Students",
                "Unlimited Courses & Modules",
                "Whitelabel Custom Domain (CNAME)",
                "Live Classes & Auto Attendance",
                "Automated PDF Certificates",
                "Admissions CRM & Fee Collection",
                "Priority 24/7 Support",
              ]}
              ctaText="Start 14-Day Free Trial"
              onSelect={() => { setSelectedPlan("Professional"); setRegisterModalOpen(true); }}
            />

            <PricingCard 
              name="Enterprise"
              price={billingCycle === "monthly" ? "$499" : "$399"}
              period={billingCycle === "monthly" ? "/month" : "/month billed yearly"}
              desc="For multi-branch institutions and large universities."
              features={[
                "Unlimited Students & Courses",
                "Dedicated Isolated DB & Server",
                "Multi-Branch & Vendor Management",
                "AI Drop-Out Risk Prediction Engine",
                "Custom API & Webhooks Access",
                "Dedicated Success Manager",
                "99.99% Uptime SLA",
              ]}
              ctaText="Contact Enterprise Sales"
              onSelect={() => { setSelectedPlan("Enterprise"); setRegisterModalOpen(true); }}
            />
          </div>
        </div>
      </section>

      {/* Vendor Onboarding Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative text-slate-900">
            <button 
              onClick={() => setRegisterModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                14-DAY FREE TRIAL • {selectedPlan.toUpperCase()} PLAN
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">Activate Your Academy Tenant</h3>
              <p className="text-xs text-slate-500 mt-1">Get instant access to your whitelabeled learning dashboard.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Academy / Company Name *</label>
                <input 
                  required 
                  placeholder="e.g. Apex Tech Academy"
                  value={form.academyName}
                  onChange={e => setForm(p => ({ ...p, academyName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Administrator Full Name *</label>
                <input 
                  required 
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={form.adminName}
                  onChange={e => setForm(p => ({ ...p, adminName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">Work Email Address *</label>
                <input 
                  required 
                  type="email"
                  placeholder="admin@apexacademy.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-black transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Provision My Academy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 hover:border-teal-400 hover:shadow-md transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-xs group-hover:bg-teal-50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 font-medium leading-relaxed">{desc}</p>
    </div>
  )
}

function PricingCard({ name, price, period, desc, features, ctaText, isPopular, onSelect }: any) {
  return (
    <div className={`bg-white rounded-3xl p-8 flex flex-col justify-between border transition-all relative ${isPopular ? "border-teal-500 ring-2 ring-teal-500/20 shadow-xl" : "border-slate-200 shadow-sm"}`}>
      {isPopular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
          Most Popular Plan
        </span>
      )}

      <div>
        <h3 className="text-xl font-black text-slate-900 mb-2">{name}</h3>
        <p className="text-xs text-slate-500 font-medium mb-6">{desc}</p>
        
        <div className="mb-6">
          <span className="text-4xl font-black text-slate-900 tracking-tight">{price}</span>
          <span className="text-xs text-slate-500 font-bold ml-1">{period}</span>
        </div>

        <ul className="space-y-3 mb-8 border-t border-slate-100 pt-6">
          {features.map((feat: string, i: number) => (
            <li key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-700">
              <Check className="w-4 h-4 text-teal-600 shrink-0" />
              {feat}
            </li>
          ))}
        </ul>
      </div>

      <button 
        onClick={onSelect}
        className={`w-full py-3.5 rounded-xl text-sm font-extrabold transition-all shadow-xs ${isPopular ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
      >
        {ctaText}
      </button>
    </div>
  )
}
