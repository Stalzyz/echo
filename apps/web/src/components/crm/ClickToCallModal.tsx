"use client"

import { useState, useEffect } from "react"
import { Phone, PhoneOff, Mic, MicOff, Volume2, ShieldCheck, Sparkles, Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react"

interface ClickToCallModalProps {
  isOpen: boolean
  onClose: () => void
  lead: {
    id: string
    name: string
    phone?: string | null
    courseInterest?: string | null
  }
  onCallEnded?: (callRecordId: string) => void
}

export function ClickToCallModal({ isOpen, onClose, lead, onCallEnded }: ClickToCallModalProps) {
  const [callState, setCallState] = useState<"DIALING" | "ACTIVE" | "ENDED">("DIALING")
  const [direction, setDirection] = useState<"OUTBOUND" | "INBOUND">("OUTBOUND")
  const [callStatus, setCallStatus] = useState<"CONNECTED" | "MISSED" | "BUSY" | "NO_ANSWER">("CONNECTED")
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [consentGiven, setConsentGiven] = useState(true)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Timer tick for active calls
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isOpen && callState === "ACTIVE") {
      timer = setInterval(() => {
        setDurationSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isOpen, callState])

  // Auto connect after 2 seconds simulate softphone dial
  useEffect(() => {
    if (isOpen && callState === "DIALING") {
      const timeout = setTimeout(() => {
        setCallState("ACTIVE")
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isOpen, callState])

  if (!isOpen) return null

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  const handleEndCall = async (overrideStatus?: "CONNECTED" | "MISSED" | "BUSY" | "NO_ANSWER") => {
    try {
      setIsSubmitting(true)
      const statusToUse = overrideStatus || callStatus

      // Log call record to backend
      const res = await fetch("/api/v1/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          direction,
          status: statusToUse,
          durationSeconds: statusToUse === "CONNECTED" ? durationSeconds : 0,
          notes,
          consentGiven,
          recordingUrl: statusToUse === "CONNECTED" ? "https://actions.google.com/sounds/v1/ambiences/office_space.ogg" : null
        })
      })

      const data = await res.json()
      if (res.ok && data.data?.id) {
        // Auto trigger AI analysis
        const analyzeRes = await fetch(`/api/v1/calls/${data.data.id}/analyze`, { method: "POST" })
        await analyzeRes.json()

        if (onCallEnded) {
          onCallEnded(data.data.id)
        }
      }
    } catch (err) {
      console.error("Failed to end and log call:", err)
    } finally {
      setIsSubmitting(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-teal-400 uppercase tracking-widest font-mono">
                ECHO Softphone Call
              </div>
              <h3 className="text-base font-extrabold text-white">{lead.name}</h3>
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full text-slate-300 border border-slate-700">
            {lead.phone || "+91 98765 43210"}
          </span>
        </div>

        {/* Consent Announcement Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Call Recording Consent Enabled</span>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-amber-800">
            <input 
              type="checkbox" 
              checked={consentGiven} 
              onChange={e => setConsentGiven(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            Consent Active
          </label>
        </div>

        {/* Main Body */}
        <div className="p-6 space-y-6 flex-1">

          {/* Active Call Status & Timer */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            {callState === "DIALING" && (
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-700 mx-auto animate-bounce">
                  <Phone className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-slate-800">Dialing Lead...</div>
                <div className="text-xs text-slate-500">Establishing WebRTC / Telephony Connection</div>
              </div>
            )}

            {callState === "ACTIVE" && (
              <div className="space-y-2">
                <div className="text-3xl font-black text-slate-900 font-mono tracking-wider">
                  {formatTime(durationSeconds)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                    Call Connected
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Call Controls: Audio Toggle */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                isMuted 
                  ? "bg-rose-100 text-rose-700 border border-rose-300" 
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <div className="text-xs font-bold text-slate-500 font-mono bg-slate-100 px-3 py-2 rounded-xl">
              Course: {lead.courseInterest || "UI/UX Masterclass"}
            </div>
          </div>

          {/* Quick Call Outcome Status Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Call Status Outcome</label>
            <div className="grid grid-cols-4 gap-2">
              {(["CONNECTED", "MISSED", "BUSY", "NO_ANSWER"] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setCallStatus(st)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all border text-center ${
                    callStatus === st
                      ? "bg-teal-600 text-white border-teal-700 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Live Notes During Call */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Live Counsellor Call Notes</span>
              <span className="text-[10px] text-teal-700 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto AI Analysis
              </span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Student inquired about UI/UX weekend batch, fees, placement assistance, requested syllabus PDF via WhatsApp..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleEndCall()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20 disabled:opacity-50"
          >
            <PhoneOff className="w-4 h-4" />
            <span>{isSubmitting ? "Analyzing Call..." : "End Call & Generate AI Intel"}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
