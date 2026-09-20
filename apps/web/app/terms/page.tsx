import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950">
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">ECHO <span className="text-teal-400 text-xs">TERMS</span></span>
          </Link>
          <Link href="/" className="text-xs text-slate-400 hover:text-white">← Return Home</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-6 text-slate-300 text-sm leading-relaxed">
        <h1 className="text-3xl font-black text-white mb-4">Terms of Service</h1>
        <p className="text-xs font-mono text-teal-400">Last updated: September 20, 2026</p>
        <p>By subscribing to or creating an academy tenant on ECHO LMS SaaS (`echo.grekam.in`), you agree to adhere to these service terms.</p>
        <h2 className="text-xl font-bold text-white pt-4">1. Academy Responsibilities</h2>
        <p>Academy administrators are responsible for managing student enrollments, course content accuracy, and compliance with applicable educational regulations.</p>
      </main>
    </div>
  )
}
