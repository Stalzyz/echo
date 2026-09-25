"use client"

import Link from "next/link"
import { usePathname } from  "next/navigation"
import { GraduationCap, Video, Building2, ArrowRight, ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2 } from  "lucide-react"

interface DemoPersonaSwitcherProps {
  currentRole: "admin" | "student" | "educator"
}

export function DemoPersonaSwitcher({ currentRole }: DemoPersonaSwitcherProps) {
  const pathname = usePathname()

  const personas = [
    {
      id: "admin",
      label: "Academy Admin Demo",
      short: "Admin Portal",
      href: "/demo/admin",
      icon: Building2,
      activeColor: "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20",
      pillColor: "bg-amber-500/10 text-amber-800 border-amber-300"
    },
    {
      id: "educator",
      label: "Educator Studio Demo",
      short: "Educator Studio",
      href: "/demo/educator",
      icon: Video,
      activeColor: "bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/20",
      pillColor: "bg-indigo-50 text-indigo-800 border-indigo-200"
    },
    {
      id: "student",
      label: "Student LMS Demo",
      short: "Student Portal",
      href: "/demo/student",
      icon: GraduationCap,
      activeColor: "bg-teal-600 text-white font-black shadow-md shadow-teal-600/20",
      pillColor: "bg-teal-50 text-teal-800 border-teal-200"
    }
  ]

  return (
    <div className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Branding & Current Mode Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center font-black text-slate-950 text-xs">
              e
            </div>
            <span className="font-extrabold tracking-tight text-white text-sm">echo</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              LIVE MARKETING DEMO
            </span>
          </div>

          <Link
            href="/auth/login"
            className="md:hidden text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>

        {/* Center: 1-Tap Persona Switcher */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-2xl border border-slate-700 w-full md:w-auto justify-center">
          <span className="text-[10px] font-black uppercase text-slate-400 px-2 hidden lg:inline-block font-mono">
            Switch Persona:
          </span>
          {personas.map(p => {
            const Icon = p.icon
            const isActive = currentRole === p.id
            return (
              <Link
                key={p.id}
                href={p.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all ${
                  isActive ? p.activeColor : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline font-bold">{p.short}</span>
              </Link>
            )
          })}
        </div>

        {/* Right: Conversion CTAs */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Link
            href="/auth/login"
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-medium px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Login Portal
          </Link>

          <Link
            href="/auth/login"
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-xl transition-all hover:shadow-md flex items-center gap-1.5 shrink-0"
          >
            <ArrowRight className="w-3.5 h-3.5" /> Start Free Trial
          </Link>
        </div>

      </div>
    </div>
  )
}
