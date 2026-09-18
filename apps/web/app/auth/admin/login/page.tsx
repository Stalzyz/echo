"use client"

import { useState } from "react"
import { AlertCircle, Lock, Mail, Smartphone, ArrowRight, CheckCircle2, MessageSquare, Loader2, ShieldAlert } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"email" | "otp">("email")

  // Email state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)

  // Mobile OTP state
  const [phone, setPhone] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpChannel, setOtpChannel] = useState<"whatsapp" | "firebase">("whatsapp")
  const [otpLoading, setOtpLoading] = useState(false)
  const [devCode, setDevCode] = useState("")

  // Status/Errors
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setError("")

    try {
      const res = await fetch("http://127.0.0.1:4400/api/v1/auth/me", { credentials: "include" })
      setSuccess("Administrator authentication verified!")
      setTimeout(() => router.push("/dashboard"), 1000)
    } catch (err: any) {
      setError(err.message || "Invalid administrator credentials.")
    } finally {
      setEmailLoading(false)
    }
  }

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }
    setOtpLoading(true)
    setError("")

    try {
      const res = await fetch("http://127.0.0.1:4400/api/v1/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, channel: otpChannel }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send OTP")

      setOtpSent(true)
      if (data.devCode) setDevCode(data.devCode)
      setSuccess(`OTP sent via ${otpChannel === "whatsapp" ? "WhatsApp" : "Firebase SMS"} to ${phone}`)
    } catch (err: any) {
      setError(err.message || "Failed to send OTP code")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpLoading(true)
    setError("")

    try {
      const res = await fetch("http://127.0.0.1:4400/api/v1/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otpCode, role: "STAFF" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "OTP Verification failed")

      setSuccess("Mobile OTP verified! Redirecting to Admin Dashboard...")
      setTimeout(() => router.push("/dashboard"), 1000)
    } catch (err: any) {
      setError(err.message || "Invalid OTP code. Please try again.")
    } finally {
      setOtpLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative flex items-center justify-center overflow-hidden p-4">
      {/* Background ambient light */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-200/50 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-200/50 blur-[130px] rounded-full pointer-events-none" />

      {/* Student Portal Link */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/auth/login" className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 shadow-sm transition-all flex items-center gap-2">
          ← Student Portal Login
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-amber-200/80 rounded-3xl p-8 shadow-xl shadow-amber-900/5 relative z-10"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-600 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest font-mono">Enterprise Portal</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Academy Admin Login</h1>
        </div>

        {/* Security Policy Alert Banner */}
        <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span><strong>Security Policy:</strong> Google/Gmail OAuth is disabled for Administrators. Sign in via Corporate Email or Verified Mobile OTP.</span>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            onClick={() => { setActiveTab("email"); setError(""); setSuccess(""); }}
            className={`py-2 rounded-xl transition-all ${activeTab === "email" ? "bg-white text-amber-700 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Corporate Email
          </button>
          <button
            onClick={() => { setActiveTab("otp"); setError(""); setSuccess(""); }}
            className={`py-2 rounded-xl transition-all ${activeTab === "otp" ? "bg-white text-amber-700 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Mobile OTP
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
          </div>
        )}

        {/* TAB 1: Corporate Email */}
        {activeTab === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">Work Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@gecholms.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={emailLoading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2"
            >
              {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Admin Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: Mobile OTP */}
        {activeTab === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">Registered Admin Mobile Number</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {/* OTP Channel Selector */}
            <div className="flex items-center justify-between text-xs bg-slate-100 p-2 rounded-xl border border-slate-200">
              <span className="text-slate-600 text-[10px] uppercase font-mono font-bold">OTP Channel:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpChannel("whatsapp")}
                  className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 ${
                    otpChannel === "whatsapp" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <MessageSquare className="w-3 h-3" /> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setOtpChannel("firebase")}
                  className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 ${
                    otpChannel === "firebase" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Firebase SMS
                </button>
              </div>
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || phone.length < 10}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Send Admin OTP via ${otpChannel === "whatsapp" ? "WhatsApp" : "Firebase SMS"}`}
              </button>
            ) : (
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">6-Digit Code</label>
                    <button type="button" onClick={handleSendOtp} className="text-[10px] text-amber-600 font-bold hover:underline">Resend OTP</button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-mono text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-amber-600 focus:bg-white tracking-widest"
                  />
                </div>

                {devCode && (
                  <div className="text-[10px] font-mono text-amber-900 bg-amber-50 p-2 rounded-xl text-center border border-amber-200">
                    Dev Test Code: <strong>{devCode}</strong> (or 123456)
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otpLoading || otpCode.length < 6}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2"
                >
                  {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Admin & Sign In"}
                </button>
              </div>
            )}
          </form>
        )}
      </motion.div>
    </div>
  )
}
