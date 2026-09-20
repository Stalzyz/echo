import Link from "next/link"
import { Shield, Zap, Users, BookOpen, CreditCard, MessageSquare, CheckCircle2, ArrowRight } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950">
      {/* Header Nav */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              
            </div>
            <span className="font-extrabold text-xl tracking-tight">ECHO <span className="text-teal-400 font-normal text-xs uppercase tracking-widest ml-1 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">SaaS</span></span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/features" className="text-teal-400">Features</Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
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
           Complete Platform Capabilities
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
          Everything your academy needs to <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Scale & Automate</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          From multi-tenant isolation and automated lead capture to WhatsApp Business API workflows, live classes, and automated tax invoicing.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Shield,
            title: "Multi-Tenant Academy Isolation",
            desc: "Every academy operates in complete isolation with its own domain, student database, branding, and billing controls.",
            items: ["Custom Subdomains & Domains", "Separate Student Databases", "Role-Based Access Control"]
          },
          {
            icon: Zap,
            title: "Meta & Lead Ads Automation",
            desc: "Direct Facebook & Instagram Lead Ads integration. Leads flow into CRM instantly with auto-responder triggers.",
            items: ["Meta Graph API Webhook", "Instant CRM Assignment", "Lead Leadgen Field Mapping"]
          },
          {
            icon: MessageSquare,
            title: "WhatsApp Business Autopilot",
            desc: "Send automated WhatsApp template notifications for new inquiries, proposals, payment links, and class updates.",
            items: ["Official Meta WABA & Grafty", "Approved Business Templates", "Real-Time Delivery Logs"]
          },
          {
            icon: BookOpen,
            title: "Course Studio & Live Streaming",
            desc: "Build video courses, quizzes, assignments, and conduct live interactive webinars via Google Meet & Zoom.",
            items: ["Course Builder & Video Player", "Quiz & Exam Engine", "Google Meet / Zoom Integration"]
          },
          {
            icon: CreditCard,
            title: "Automated Tax Invoicing & UPI",
            desc: "Collect tuition fees via Razorpay, PhonePe, and Stripe with auto-reconciled GST tax invoices.",
            items: ["Razorpay & PhonePe Gateways", "Automated PDF Invoices", "Payment Link Sharing"]
          },
          {
            icon: Zap,
            title: "Public Certificate Verification",
            desc: "Every issued certificate gets a public tamper-proof verification URL for employer verification.",
            items: ["QR Code Credential Verification", "Public Verifier Portal", "Custom Academy Badging"]
          }
        ].map((f, i) => {
          const Icon = f.icon
          return (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-teal-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-5">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{f.desc}</p>
              <ul className="space-y-2 border-t border-slate-800/80 pt-4">
                {f.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-bold text-lg text-white">Ready to transform your academy?</div>
            <div className="text-xs text-slate-400 mt-1">Get your dedicated ECHO LMS workspace running in minutes.</div>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20">
            Request Academy Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </footer>
    </div>
  )
}
