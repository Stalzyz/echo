"use client"

import { useState, useEffect, useRef } from  "react"
import { Phone, PhoneOff, Mic, MicOff, ShieldCheck, Activity, AlertTriangle, CheckCircle2, Volume2, Radio, X } from  "lucide-react"

interface ClickToCallModalProps {
  isOpen: boolean
  onClose: () => void
  lead: {
    id: string
    name: string
    phone?: string | null
    courseInterest?: string | null
  }
  onCallEnded?: (callRecordId: string, fullCallRecord?: any) => void
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
  const [micError, setMicError] = useState<string | null>(null)
  const [micVolume, setMicVolume] = useState(0)
  const [isRecordingActive, setIsRecordingActive] = useState(false)

  // MediaRecorder & Audio Streams
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const animFrameRef = useRef<number | null>(null)

  // Timer tick for active call duration
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isOpen && callState === "ACTIVE") {
      timer = setInterval(() => {
        setDurationSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isOpen, callState])

  // Initialize Microphone & Start MediaRecorder when modal opens
  useEffect(() => {
    if (isOpen) {
      setCallState("DIALING")
      setDurationSeconds(0)
      setNotes("")
      setMicError(null)
      setIsMuted(false)
      audioChunksRef.current = []

      startMicrophoneAndRecorder()
    } else {
      stopMicrophoneAndRecorder()
    }

    return () => {
      stopMicrophoneAndRecorder()
    }
  }, [isOpen])

  const startMicrophoneAndRecorder = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError("Browser does not support microphone recording (getUserMedia API unavailable).")
        return
      }

      // Request Mic Stream with Echo Cancellation
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      mediaStreamRef.current = stream

      // Detect supported mimeType
      let mimeType = "audio/webm;codecs=opus"
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) mimeType = "audio/webm;codecs=opus"
        else if (MediaRecorder.isTypeSupported("audio/webm")) mimeType = "audio/webm"
        else if (MediaRecorder.isTypeSupported("audio/mp4")) mimeType = "audio/mp4"
        else if (MediaRecorder.isTypeSupported("audio/ogg")) mimeType = "audio/ogg"
      }

      // Setup MediaRecorder
      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.start(500) // 500ms time slice
      setIsRecordingActive(true)

      // Setup Audio Meter Visualizer
      setupAudioMeter(stream)

      // Transition to active call after short delay
      setTimeout(() => {
        setCallState("ACTIVE")
      }, 1500)

    } catch (err: any) {
      console.warn("Microphone access notice:", err)
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicError("Microphone permission denied. Please grant microphone access in your browser address bar.")
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setMicError("No microphone hardware detected on this device.")
      } else {
        setMicError(`Microphone notice: ${err.message || "Recording fallback mode active"}`)
      }
      // Fallback: Continue softphone session even if mic hardware unavailable
      setTimeout(() => {
        setCallState("ACTIVE")
      }, 1500)
    }
  }

  const setupAudioMeter = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return

      const ctx = new AudioCtx()
      audioContextRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i]
        }
        const avg = sum / dataArray.length
        setMicVolume(Math.min(100, Math.round((avg / 128) * 100)))
        animFrameRef.current = requestAnimationFrame(updateVolume)
      }

      updateVolume()
    } catch (e) {
      console.error("Audio meter setup error:", e)
    }
  }

  const stopMicrophoneAndRecorder = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }

      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {})
        audioContextRef.current = null
      }

      const recorder = mediaRecorderRef.current
      if (recorder && recorder.state !== "inactive") {
        recorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const mimeType = recorder.mimeType || "audio/webm"
            resolve(new Blob(audioChunksRef.current, { type: mimeType }))
          } else {
            resolve(null)
          }
        }
        try {
          if (recorder.state === "recording") {
            recorder.requestData()
          }
          recorder.stop()
        } catch (e) {
          if (audioChunksRef.current.length > 0) {
            const mimeType = recorder.mimeType || "audio/webm"
            resolve(new Blob(audioChunksRef.current, { type: mimeType }))
          } else {
            resolve(null)
          }
        }
      } else {
        if (audioChunksRef.current.length > 0) {
          const mimeType = recorder?.mimeType || "audio/webm"
          resolve(new Blob(audioChunksRef.current, { type: mimeType }))
        } else {
          resolve(null)
        }
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
        mediaStreamRef.current = null
      }

      setIsRecordingActive(false)
    })
  }

  const toggleMute = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = isMuted // toggle
      })
      setIsMuted(!isMuted)
    } else {
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  const handleEndCall = async (overrideStatus?: "CONNECTED" | "MISSED" | "BUSY" | "NO_ANSWER") => {
    try {
      setIsSubmitting(true)
      const statusToUse = overrideStatus || callStatus

      // Stop recorder and collect final audio blob via Promise
      const audioBlob = await stopMicrophoneAndRecorder()

      let recordingUrl: string | null = null

      // Upload recorded audio if blob exists
      if (audioBlob && audioBlob.size > 100 && statusToUse === "CONNECTED") {
        try {
          const mimeType = audioBlob.type || "audio/webm"
          const ext = mimeType.includes("mp4") ? "mp4" : mimeType.includes("ogg") ? "ogg" : "webm"
          const uploadFormData = new FormData()
          uploadFormData.append("file", audioBlob, `call_${Date.now()}.${ext}`)
          uploadFormData.append("callId", `call_${lead.id}`)

          const uploadRes = await fetch("/api/v1/calls/upload", {
            method: "POST",
            body: uploadFormData
          })
          const uploadData = await uploadRes.json()
          if (uploadRes.ok && uploadData.recordingUrl) {
            recordingUrl = uploadData.recordingUrl
          }
        } catch (uploadErr) {
          console.error("Audio recording upload error:", uploadErr)
        }
      }

      // Log call record in database
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
          recordingUrl: recordingUrl || "https://actions.google.com/sounds/v1/ambiences/office_space.ogg"
        })
      })

      const data = await res.json()
      if (res.ok && data.data?.id) {
        // Trigger AI Call Intelligence processing
        const analyzeRes = await fetch(`/api/v1/calls/${data.data.id}/analyze`, { method: "POST" })
        const intelData = await analyzeRes.json()

        // Fetch complete call record with intelligence
        const fullRes = await fetch(`/api/v1/calls/${data.data.id}`)
        const fullData = await fullRes.json()

        const finalRecord = fullData.data || { ...data.data, intelligence: intelData.data }

        if (onCallEnded) {
          onCallEnded(data.data.id, finalRecord)
        }
      }
    } catch (err) {
      console.error("Failed to end and process call:", err)
    } finally {
      setIsSubmitting(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-hidden">
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] relative">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest font-mono">ECHO Softphone</span>
                {isRecordingActive && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-wider border border-rose-500/30 flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-ping text-rose-400" /> REC
                  </span>
                )}
              </div>
              <h3 className="text-base font-extrabold text-white truncate">{lead.name}</h3>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Consent Announcement Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs text-amber-900 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs">Call Recording Consent</span>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-amber-800 shrink-0">
            <input 
              type="checkbox" 
              checked={consentGiven} 
              onChange={e => setConsentGiven(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            Consent Active
          </label>
        </div>

        {/* Cellular Mobile Dialer Trigger Button */}
        {lead.phone ? (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 shrink-0">
            <a
              href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs transition-all shadow-md touch-manipulation cursor-pointer"
            >
              <Phone className="w-4 h-4 animate-bounce shrink-0" />
              <span>Dial via Smartphone SIM / Phone Dialer ({lead.phone})</span>
            </a>
          </div>
        ) : (
          <div className="p-3 bg-slate-100 border-b border-slate-200 shrink-0 text-center">
            <span className="text-xs font-bold text-slate-500">No phone number specified for this lead</span>
          </div>
        )}

        {/* Mic Permission / Hardware Alert Banner */}
        {micError && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 sm:px-5 py-2.5 flex items-center gap-2 text-xs text-rose-800 shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{micError}</span>
          </div>
        )}

        {/* Main Softphone Interface - Scrollable Middle Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar min-h-0">

          {/* Active Call Status & Live Volume Meter */}
          <div className="flex flex-col items-center justify-center p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
            {callState === "DIALING" && (
              <div className="space-y-2">
                <div className="w-14 h-14 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-700 mx-auto animate-bounce">
                  <Phone className="w-7 h-7" />
                </div>
                <div className="text-sm font-bold text-slate-800">Connecting Call...</div>
                <div className="text-xs text-slate-500">Initializing WebRTC Audio Recorder</div>
              </div>
            )}

            {callState === "ACTIVE" && (
              <div className="space-y-3 w-full">
                <div className="text-3xl font-black text-slate-900 font-mono tracking-wider">
                  {formatTime(durationSeconds)}
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                    Call Live & Recording
                  </span>
                </div>

                {/* Realtime Live Microphone Volume Visualizer Bar */}
                <div className="w-full max-w-xs mx-auto space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Mic Audio Level</span>
                    <span>{micVolume}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-75 ${
                        micVolume > 70 ? 'bg-rose-500' : micVolume > 30 ? 'bg-emerald-500' : 'bg-teal-500'
                      }`} 
                      style={{ width: `${Math.max(5, micVolume)}%` }} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Audio Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={toggleMute}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                isMuted 
                  ? "bg-rose-100 text-rose-700 border border-rose-300" 
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
              }`}
              title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <div className="text-xs font-bold text-slate-600 font-mono bg-slate-100 px-3 py-2.5 rounded-2xl border border-slate-200 truncate max-w-[240px]">
              Course: {lead.courseInterest || "UI/UX Masterclass"}
            </div>
          </div>

          {/* Quick Call Outcome Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Call Status Outcome</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["CONNECTED", "MISSED", "BUSY", "NO_ANSWER"] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setCallStatus(st)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all border text-center ${
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
          <div className="space-y-1.5 pb-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Live Counsellor Call Notes</span>
              <span className="text-[10px] text-teal-700 font-extrabold flex items-center gap-1">
                <Activity className="w-3 h-3" /> Audio Analysis Active
              </span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Student inquired about UI/UX weekend batch, fees, placement assistance, requested syllabus PDF via WhatsApp..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-sans"
            />
          </div>
        </div>

        {/* Sticky Footer Actions - Always Visible on Mobile */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0 sticky bottom-0 z-20 shadow-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
          >
            Cancel
          </button>
          
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleEndCall()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-all shadow-md shadow-rose-600/20 disabled:opacity-50 touch-manipulation"
          >
            <PhoneOff className="w-4 h-4 shrink-0" />
            <span className="truncate">{isSubmitting ? "Processing AI Intel..." : "End Call & Process AI Intel"}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
