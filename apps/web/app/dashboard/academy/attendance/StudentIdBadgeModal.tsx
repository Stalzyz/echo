"use client"

import React, { useRef } from "react"
import { motion } from  "framer-motion"
import { X, Download, QrCode, ShieldCheck, GraduationCap, MapPin, Calendar, CheckCircle2, User } from  "lucide-react"
import { toast } from  "sonner"

interface StudentBadgeData {
  id: string
  name: string
  studentCode?: string
  batch: string
  course?: string
  avatar?: string
  validUntil?: string
  academyName?: string
}

interface StudentIdBadgeModalProps {
  isOpen: boolean
  onClose: () => void
  student: StudentBadgeData | null
}

export function StudentIdBadgeModal({ isOpen, onClose, student }: StudentIdBadgeModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !student) return null

  const studentId = student.studentCode || student.id || "S1001"
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(studentId)}&color=0f766e`

  const handleDownloadBadge = async () => {
    try {
      // Dynamic import html2pdf.js for instant high-res ID pass export
      const html2pdf = (await import("html2pdf.js")).default
      if (cardRef.current) {
        const opt = {
          margin: 10,
          filename: `student_id_badge_${studentId}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm' as const, format: 'a6' as const, orientation: 'portrait' as const }
        }
        html2pdf().from(cardRef.current).set(opt).save()
        toast.success("Student ID Badge exported successfully!")
      }
    } catch {
      window.print()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">Digital Student ID Badge</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Badge Card Container */}
        <div className="p-6 flex flex-col items-center">
          <div 
            ref={cardRef}
            className="w-full max-w-xs rounded-3xl overflow-hidden border border-slate-200 bg-linear-to-b from-teal-900 via-slate-900 to-slate-950 text-white p-6 shadow-xl relative space-y-5"
          >
            {/* Top Branding */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-white font-black text-xs shadow-xs">
                  G
                </div>
                <span className="font-bold text-sm tracking-tight text-teal-300">
                  {student.academyName || "GECHO ACADEMY"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                STUDENT PASS
              </span>
            </div>

            {/* Photo & Name */}
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border-2 border-teal-400/30 flex items-center justify-center text-teal-300 font-bold text-xl shrink-0 overflow-hidden shadow-inner">
                {student.avatar ? (
                  <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  student.name.charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-black text-base text-white leading-tight">{student.name}</h3>
                <p className="text-xs text-teal-400 font-medium">{student.batch}</p>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {studentId}</p>
              </div>
            </div>

            {/* High-Resolution QR Code */}
            <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-inner">
              <img 
                src={qrUrl} 
                alt={`QR code for ${student.name}`} 
                className="w-36 h-36 object-contain"
              />
              <span className="text-[10px] font-mono font-bold text-slate-600 mt-2 tracking-widest uppercase">
                {studentId}
              </span>
            </div>

            {/* Card Footer Details */}
            <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <span>Valid: 2026 Academic Year</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" /> Verified Student
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-500">Scan at campus entry turnstile.</span>
          <button
            onClick={handleDownloadBadge}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF Badge
          </button>
        </div>
      </motion.div>
    </div>
  )
}
