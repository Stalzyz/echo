"use client"

import Link from "next/link"
import { CheckCircle2, Shield, Award, Calendar, User, BookOpen, Share2, MessageSquare } from  "lucide-react"
import { useState, use } from  "react"
import { toast } from  "sonner"
import { BragGeneratorModal, BragData } from  "@/components/BragGeneratorModal"

interface VerifyProps {
  params: Promise<{ certificateId: string }>
}

export default function CertificateVerificationPage({ params }: VerifyProps) {
  const { certificateId } = use(params)
  const cleanId = (certificateId || "ECHO-2026-00124").toUpperCase()

  const [bragModal, setBragModal] = useState<{ isOpen: boolean; data: BragData }>({
    isOpen: false,
    data: { type: "CERTIFICATE", title: "" }
  })

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 font-black text-slate-950 text-sm">
              e
            </div>
            <span className="font-extrabold text-lg tracking-tight">echo <span className="text-teal-400 text-xs font-normal bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-mono">VERIFIER</span></span>
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-2xl w-fit">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">Official Certificate Verified</span>
            </div>
            
            <button
              onClick={() =>
                setBragModal({
                  isOpen: true,
                  data: {
                    type: "CERTIFICATE",
                    title: "Fullstack Web & AI Engineering Certificate",
                    authorOrAcademy: "Grekam Academy of Technology",
                    priceOrId: cleanId,
                    highlights: [
                      "Verified Industry Credential",
                      "Multi-Tenant SaaS Signed",
                      "Alex Martin • 2026"
                    ],
                    linkUrl: `https://echo.grekam.in/verify/${cleanId}`
                  }
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-xs transition-all hover:scale-105"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Share Credentials
            </button>
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

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400 leading-relaxed">
              Digitally signed by Grekam Academy via echo LMS Multi-Tenant SaaS.
            </div>
            <button
              onClick={() =>
                setBragModal({
                  isOpen: true,
                  data: {
                    type: "CERTIFICATE",
                    title: "Fullstack Web & AI Engineering Certificate",
                    authorOrAcademy: "Grekam Academy of Technology",
                    priceOrId: cleanId,
                    highlights: [
                      "Verified Industry Credential",
                      "Multi-Tenant SaaS Signed",
                      "Alex Martin • 2026"
                    ],
                    linkUrl: `https://echo.grekam.in/verify/${cleanId}`
                  }
                })
              }
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-all shrink-0"
            >
              <Share2 className="w-4 h-4" /> ⚡ Brag Video Generator
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 font-mono">
        © 2026 echo LMS SaaS. All rights reserved.
      </footer>

      <BragGeneratorModal
        isOpen={bragModal.isOpen}
        onClose={() => setBragModal(prev => ({ ...prev, isOpen: false }))}
        data={bragModal.data}
      />
    </div>
  )
}

