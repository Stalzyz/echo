import Link from "next/link"
import { Shield, Users, Award, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950">
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              
            </div>
            <span className="font-extrabold text-xl tracking-tight">ECHO <span className="text-teal-400 font-normal text-xs uppercase tracking-widest ml-1 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">SaaS</span></span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/features" className="text-slate-300 hover:text-white">Features</Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white">Pricing</Link>
            <Link href="/about" className="text-teal-400 font-bold">About</Link>
            <Link href="/faq" className="text-slate-300 hover:text-white">FAQ</Link>
            <Link href="/auth/login" className="bg-teal-500 text-slate-950 px-4 py-2 rounded-xl hover:bg-teal-400 font-bold">
              Academy Sign In
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
          Empowering Educational Institutions with <span className="text-teal-400">Autonomous SaaS Tech</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          ECHO LMS SaaS is engineered by Grekam Visuals to provide academy owners with a unified platform for multi-tenant learning management, automated admissions CRM, and WhatsApp Business autopilot workflows.
        </p>
      </section>
    </div>
  )
}
