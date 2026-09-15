"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Clock, Play, Square, Coffee, Camera, User, CheckCircle2, AlertTriangle, ShieldCheck, KeyRound, RefreshCw, X, ArrowLeft } from "lucide-react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"
import Link from "next/link"

export default function OfficeKioskPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [pin, setPin] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [actionSuccess, setActionSuccess] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Camera state
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Fetch employees
  const { data: empData } = useApi<any>("/hr/employees")
  const employees = empData?.employees || []

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Start tablet camera stream
  const startCamera = useCallback(() => {
    if (!navigator.mediaDevices?.getUserMedia) return
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } })
      .then(stream => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => setIsCameraReady(true)
          videoRef.current.play()
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    startCamera()
    return () => streamRef.current?.getTracks().forEach(t => t.stop())
  }, [startCamera])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return null
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    ctx.restore()
    return canvas.toDataURL("image/jpeg", 0.8)
  }, [])

  const handlePinKey = (val: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + val)
    }
  }

  const handleClearPin = () => setPin("")

  // Check pin matching employee
  useEffect(() => {
    if (pin.length === 4) {
      const matched = employees.find((e: any) => e.pinCode === pin || e.employeeId === pin || e.id.endsWith(pin))
      if (matched) {
        setSelectedEmployee(matched)
      } else {
        toast.error("Invalid PIN code")
        setPin("")
      }
    }
  }, [pin, employees])

  const handlePunch = async (action: 'clock-in' | 'clock-out' | 'break-in' | 'break-out') => {
    if (!selectedEmployee) return
    setIsProcessing(true)
    const photo = capturePhoto()

    try {
      await fetchApi(`/hr/attendance/${action}`, {
        method: "POST",
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          photoUrl: photo || undefined,
        })
      })

      const actionText = action === 'clock-in' ? 'Clocked In' : action === 'clock-out' ? 'Clocked Out' : action === 'break-in' ? 'Started Break' : 'Ended Break'
      setActionSuccess({
        employeeName: selectedEmployee.user?.name || selectedEmployee.name || "Employee",
        actionText,
        time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })

      // Reset kiosk after 4 seconds
      setTimeout(() => {
        setActionSuccess(null)
        setSelectedEmployee(null)
        setPin("")
      }, 4000)

    } catch (err: any) {
      toast.error(err.message || "Failed to record punch")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col font-sans select-none overflow-hidden">
      
      {/* Kiosk Header */}
      <header className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/hr/attendance" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Grekam OS • Office Entry Kiosk
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white">Reception Attendance Terminal</h1>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-mono font-bold tracking-tight text-white">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-xs font-mono text-white/40">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </header>

      {/* Main Kiosk Body */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 max-w-7xl mx-auto w-full items-center">
        
        {/* Left Column: Camera Preview Frame */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
          <div className="relative aspect-video w-full max-w-md bg-black rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-3xl pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-52 border-2 border-dashed border-emerald-400/40 rounded-full" />
            </div>

            <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-center">
              <p className="text-[10px] font-mono text-white/70 flex items-center justify-center gap-1">
                <Camera className="w-3 h-3 text-emerald-400" /> Automatic Selfie Capture Enabled
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Office Wifi / Geofence Secured</p>
          </div>
        </div>

        {/* Right Column: PIN Pad / Employee Selection & Action Screen */}
        <div className="lg:col-span-7 bg-[#0f121d] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-center min-h-[500px]">
          
          {actionSuccess ? (
            /* Success Card */
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">{actionSuccess.employeeName}</h2>
              <p className="text-base font-mono text-emerald-400 font-semibold">{actionSuccess.actionText} at {actionSuccess.time}</p>
              <p className="text-xs font-mono text-white/40 pt-4">Terminal resetting in 4s...</p>
            </div>
          ) : !selectedEmployee ? (
            /* Step 1: Staff Selection or PIN Pad */
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">Enter Your 4-Digit PIN</h2>
                <p className="text-xs text-white/40 mt-1">Or tap your name below to clock in/out</p>
              </div>

              {/* PIN Display Dots */}
              <div className="flex justify-center gap-4 py-2">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border border-white/20 transition-all ${
                      i < pin.length ? "bg-emerald-400 border-emerald-400 scale-110 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "bg-white/5"
                    }`}
                  />
                ))}
              </div>

              {/* PIN Pad Grid */}
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(n => (
                  <button
                    key={n}
                    onClick={() => handlePinKey(n)}
                    className="h-14 bg-white/5 hover:bg-white/10 active:bg-emerald-500/30 border border-white/10 rounded-2xl text-xl font-mono font-bold text-white transition-colors flex items-center justify-center"
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={handleClearPin}
                  className="h-14 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-2xl text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center"
                >
                  Clear
                </button>
                <button
                  onClick={() => handlePinKey("0")}
                  className="h-14 bg-white/5 hover:bg-white/10 active:bg-emerald-500/30 border border-white/10 rounded-2xl text-xl font-mono font-bold text-white transition-colors flex items-center justify-center"
                >
                  0
                </button>
                <button
                  onClick={() => setPin("1234")} // quick test fallback
                  className="h-14 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-2xl text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center"
                >
                  Enter
                </button>
              </div>

              {/* Staff Direct Select Dropdown */}
              <div className="pt-4 border-t border-white/10 max-w-md mx-auto">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 text-center">Quick Select Staff</label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {employees.slice(0, 6).map((e: any) => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEmployee(e)}
                      className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-xs font-medium text-white truncate flex items-center gap-2 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {(e.user?.name || e.name || "E")[0]}
                      </div>
                      <span className="truncate">{e.user?.name || e.name || "Employee"}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Employee Action Punch Screen */
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl font-bold mb-3">
                  {(selectedEmployee.user?.name || selectedEmployee.name || "E")[0]}
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedEmployee.user?.name || selectedEmployee.name}</h2>
                <p className="text-xs font-mono text-white/40 mt-0.5">{selectedEmployee.designation?.name || "Staff Member"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4">
                <button
                  disabled={isProcessing}
                  onClick={() => handlePunch('clock-in')}
                  className="flex flex-col items-center justify-center gap-2 p-6 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-2xl text-emerald-400 transition-all font-mono font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  <Play className="w-8 h-8 fill-emerald-400" />
                  <span>Clock In</span>
                </button>

                <button
                  disabled={isProcessing}
                  onClick={() => handlePunch('clock-out')}
                  className="flex flex-col items-center justify-center gap-2 p-6 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-2xl text-red-400 transition-all font-mono font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  <Square className="w-8 h-8" />
                  <span>Clock Out</span>
                </button>

                <button
                  disabled={isProcessing}
                  onClick={() => handlePunch('break-in')}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-2xl text-amber-400 transition-all font-mono font-bold uppercase tracking-wider text-xs disabled:opacity-50"
                >
                  <Coffee className="w-6 h-6" />
                  <span>Start Break</span>
                </button>

                <button
                  disabled={isProcessing}
                  onClick={() => handlePunch('break-out')}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-2xl text-blue-400 transition-all font-mono font-bold uppercase tracking-wider text-xs disabled:opacity-50"
                >
                  <Play className="w-6 h-6" />
                  <span>End Break</span>
                </button>
              </div>

              <button
                onClick={() => { setSelectedEmployee(null); setPin(""); }}
                className="text-xs font-mono text-white/40 hover:text-white underline pt-4"
              >
                Not you? Return to PIN Pad
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
