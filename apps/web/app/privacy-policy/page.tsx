import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950">
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">ECHO <span className="text-teal-400 text-xs">LEGAL</span></span>
          </Link>
          <Link href="/" className="text-xs text-slate-400 hover:text-white">← Return Home</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-6 text-slate-300 text-sm leading-relaxed">
        <h1 className="text-3xl font-black text-white mb-4">Privacy Policy</h1>
        <p className="text-xs font-mono text-teal-400">Last updated: September 20, 2026</p>
        <p>ECHO LMS SaaS (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the multi-tenant academy platform at echo.grekam.in. We respect your privacy and are committed to protecting personal data collected from academy administrators, educators, and students.</p>
        <h2 className="text-xl font-bold text-white pt-4">1. Data Collection & Isolation</h2>
        <p>All student and course data stored within an academy tenant is logically isolated using database-level academy tags. Secrets and access tokens are encrypted at rest using AES-256 standards.</p>
        <h2 className="text-xl font-bold text-white pt-4">2. Meta Lead Ads & Third-Party APIs</h2>
        <p>Lead information ingested via Meta Lead Ads or WhatsApp Business API is processed solely for CRM follow-ups initiated by your authorized academy personnel.</p>
      </main>
    </div>
  )
}
