"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from  "framer-motion"
import { X, QrCode, Camera, CheckCircle2, UserCheck, AlertCircle, RefreshCw, Volume2, ShieldCheck, User, Search } from  "lucide-react"
import { toast } from  "sonner"

interface QrAttendanceScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess: (studentCodeOrId: string) => void
  existingStudents?: { id: string; name: string; studentCode?: string; batch: string }[]
}

export function QrAttendanceScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  existingStudents = []
}: QrAttendanceScannerModalProps) {
  const [manualCode, setManualCode] = useState("")
  const [recentScans, setRecentScans] = useState<{ id: string; name: string; time: string; status: string }[]>([])
  const [isCameraActive, setIsCameraActive] = useState(false)
  const scannerRef = useRef<any>(null)

  useEffect(() => {
    let html5QrCode: any = null

    if (isOpen && isCameraActive) {
      // Dynamically import html5-qrcode on client side only
      import("html5-qrcode").then(({ Html5Qrcode }) => {
        try {
          html5QrCode = new Html5Qrcode("reader-qr-box")
          scannerRef.current = html5QrCode
          html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 }
            },
            (decodedText: string) => {
              handleProcessCode(decodedText)
            },
            () => {
              // ignore frame read errors
            }
          ).catch((err: any) => {
            console.warn("Camera init warning:", err)
          })
        } catch (e) {
          console.error("QR scanner start failed:", e)
        }
      })
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => null)
        scannerRef.current.clear().catch(() => null)
      }
    }
  }, [isOpen, isCameraActive])

  if (!isOpen) return null

  const handleProcessCode = (code: string) => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    // Find student in existing records
    const matched = existingStudents.find(
      s => s.id.toUpperCase() === trimmed || s.studentCode?.toUpperCase() === trimmed || s.name.toUpperCase().includes(trimmed)
    )

    const studentName = matched ? matched.name : `Student (${trimmed})`
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setRecentScans(prev => [
      { id: trimmed, name: studentName, time: nowTime, status: "PRESENT" },
      ...prev.slice(0, 7)
    ])

    onScanSuccess(matched ? matched.id : trimmed)
    toast.success(`Check-In Verified: ${studentName} marked PRESENT at ${nowTime}!`)
    setManualCode("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Live QR Code Attendance Scanner
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-200 uppercase">
                  Batch Check-in
                </span>
              </h2>
              <p className="text-xs text-slate-500">Scan student physical badges or digital phone passes for instant punch-in.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Scanner Viewport / Camera Toggle */}
          <div className="rounded-3xl border border-slate-200 bg-slate-950 overflow-hidden relative min-h-[280px] flex flex-col items-center justify-center text-center p-6 text-white">
            <div id="reader-qr-box" className="w-full max-w-sm rounded-2xl overflow-hidden" />

            {!isCameraActive ? (
              <div className="space-y-4 max-w-sm z-10">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Turn On Web / Device Camera</h4>
                  <p className="text-xs text-slate-400 mt-1">Use webcam or mobile rear camera to scan student QR badges automatically.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCameraActive(true)}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 mx-auto"
                >
                  <Camera className="w-4 h-4" /> Start Camera Scanner
                </button>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 text-xs text-teal-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Scanning live... Point at student QR badge
              </div>
            )}
          </div>

          {/* Manual Barcode / Student ID Fast Lookup */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-800 block">Manual Code / USB Barcode Scanner</span>
              <span className="text-[11px] text-slate-500">Scan or type student code (e.g. S1001, S1002) and press Enter.</span>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                handleProcessCode(manualCode)
              }} 
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. S1001"
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-500 uppercase w-32 text-center"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Present
              </button>
            </form>
          </div>

          {/* Real-time Punch-In Log Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-teal-600" /> Recent Live Check-Ins ({recentScans.length})
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">Today's Session</span>
            </div>

            {recentScans.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No scans recorded in this session yet. Scan a badge or enter an ID above.
              </div>
            ) : (
              <div className="space-y-2">
                {recentScans.map((scan, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-[11px]">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{scan.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">ID: {scan.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500 font-mono">{scan.time}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                        PRESENT
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-500">Live attendance syncs directly with student batch records.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  )
}
