"use client"

import { UnifiedLoginPortal } from "@/components/auth/UnifiedLoginPortal"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col justify-between p-4 sm:p-6 selection:bg-teal-500/20">
      
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Home
        </Link>

        <span className="text-xs font-bold text-slate-500 bg-white px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs">
          Echo Single Window Access
        </span>
      </div>

      {/* Main Login Window */}
      <div className="my-auto py-8">
        <UnifiedLoginPortal defaultRole="student" isStandalonePage={true} />
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs font-medium text-slate-400">
        © {new Date().getFullYear()} Echo LMS Inc. All rights reserved. • Unified Authentication Portal
      </footer>
    </div>
  )
}
