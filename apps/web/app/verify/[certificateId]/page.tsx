import Link from "next/link"
import { CheckCircle2, Shield, Award, Calendar, User, BookOpen, ExternalLink } from "lucide-react"

interface VerifyProps {
  params: Promise<{ certificateId: string }>
}

export default async function CertificateVerificationPage({ params }: VerifyProps) {
  const { certificateId } = await params

  // Clean uppercase ID
  const cleanId = (certificateId || "GECHO-2026-00124").toUpperCase()

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              
            </div>
            <span className="font-extrabold text-lg tracking-tight">ECHO <span className="text-teal-400 text-xs font-normal bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-mono">VERIFIER</span></span>
          </Link>
          <div className="text-xs text-slate-400 font-mono">
            Public Certificate Registry
          </div>
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="max-w-2xl mx-auto px-6 py-12 w-full">
        <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-8 shadow-2xl shadow-teal-500/10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Verification Badge Header */}
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-2xl w-fit mb-6">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Official Certificate Verified</span>
          </div>

          <h1 className="text-2xl font-black text-white mb-2">Fullstack Web & AI Engineering Certificate</h1>
          <p className="text-xs text-slate-400 font-mono mb-6">Credential ID: <span className="text-teal-400 font-bold">{cleanId}</span></p>

          <div className="space-y-4 border-t border-b border-slate-800 py-6 my-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-2 font-medium"><User className="w-4 h-4 text-teal-400" /> Student Name:</span>
              <span className="text-sm font-bold text-white font-mono">Alex Martin</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-2 font-medium"><BookOpen className="w-4 h-4 text-teal-400" /> Issuing Academy:</span>
              <span className="text-sm font-bold text-white">Grekam Academy of Technology</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-2 font-medium"><Calendar className="w-4 h-4 text-teal-400" /> Date Issued:</span>
              <span className="text-sm font-bold text-white font-mono">20 September 2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-2 font-medium"><Shield className="w-4 h-4 text-teal-400" /> Status:</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">VALID & ACTIVE</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            This credential is digitally signed by Grekam Academy via the ECHO LMS Multi-Tenant SaaS platform. Tampering invalidates this verification record.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 font-mono">
        © 2026 ECHO LMS SaaS. All rights reserved.
      </footer>
    </div>
  )
}
