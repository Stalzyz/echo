"use client"

import { useState, useEffect } from  "react"
import { Phone, Activity, Clock, Play, FileText, CheckCircle2, ChevronRight } from  "lucide-react"

interface LeadCallHistoryTabProps {
  leadId: string
  onOpenCallIntel?: (callRecord: any) => void
}

export function LeadCallHistoryTab({ leadId, onOpenCallIntel }: LeadCallHistoryTabProps) {
  const [calls, setCalls] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCalls()
  }, [leadId])

  const fetchCalls = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/v1/calls?leadId=${leadId}`)
      const data = await res.json()
      if (res.ok && data.data) {
        setCalls(data.data)
      }
    } catch (err) {
      console.error("Failed to load call history:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 font-medium">
        Loading call intelligence history...
      </div>
    )
  }

  if (calls.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
        <Phone className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-xs font-bold text-slate-700">No calls recorded yet for this lead</p>
        <p className="text-[11px] text-slate-500">Use the "Call Lead" softphone button to start a call and generate AI Call Intelligence.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {calls.map((call) => {
        const intel = call.intelligence || {}
        const durationMins = Math.ceil((call.durationSeconds || 0) / 60)
        const temperature = intel.temperature || "WARM"

        return (
          <div 
            key={call.id} 
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-teal-500/50 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    Call ({call.direction}) • {durationMins} min
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {new Date(call.startedAt).toLocaleDateString()} at {new Date(call.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • By {call.counsellor?.firstName || "Counsellor"}
                  </div>
                </div>
              </div>

              {intel.score && (
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    temperature === "HOT" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {temperature === "HOT" ? "🔥 Hot" : "🌤️ Warm"} ({intel.score}/100)
                  </span>
                </div>
              )}
            </div>

            {/* Intel Summary Snippet */}
            {intel.summary && (
              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                {intel.summary}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400 font-mono">
                {call.status} • Consent Verified
              </span>
              
              <button
                type="button"
                onClick={() => onOpenCallIntel && onOpenCallIntel(call)}
                className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition-colors"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>View Call Intelligence</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
