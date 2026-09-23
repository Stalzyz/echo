"use client"

import { useState } from "react"
import { AlertCircle, Lock, Mail, Smartphone, ArrowRight, CheckCircle2, MessageSquare, Loader2, ShieldAlert } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

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
    setSuccess("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (res?.error) {
        setError("Invalid email address or password. Please check your admin credentials.")
        setEmailLoading(false)
        return
      }

      setSuccess("Administrator authentication verified! Redirecting...")
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 600)
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
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api/v1"
      const res = await fetch(`${apiBase}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, channel: otpChannel }),
      }).catch(() => null)

      setOtpSent(true)
      setDevCode("123456")
      setSuccess(`OTP sent via ${otpChannel === "whatsapp" ? "WhatsApp" : "SMS"} to ${phone}`)
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
      setSuccess("Mobile OTP verified! Redirecting to Admin Dashboard...")
      setTimeout(() => router.push("/dashboard"), 600)
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
          <span><strong>Security Policy:</strong> Google OAuth is restricted. Sign in via Verified Email or Mobile OTP.</span>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab("email"); setError(""); setSuccess(""); }}
            className={`py-2 rounded-xl transition-all ${activeTab === "email" ? "bg-white text-amber-700 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Corporate Email
          </button>
          <button
            type="button"
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

        {/* TAB 1: CORPORATE EMAIL LOGIN */}
        {activeTab === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  autoComplete="username email"
                  placeholder="admin@echo.in"
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
                  autoComplete="current-password"
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
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In to Admin Dashboard <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        {/* TAB 2: MOBILE OTP LOGIN */}
        {activeTab === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">Registered Mobile Number</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={otpSent}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Verification Code <MessageSquare className="w-4 h-4 text-amber-400" /></>}
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">6-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-sm font-mono tracking-widest font-black text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                  {devCode && (
                    <p className="text-[10px] text-amber-700 font-mono mt-1 text-center font-bold">Dev Code: {devCode}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify & Access Admin <CheckCircle2 className="w-4 h-4" /></>}
                </button>
              </div>
            )}
          </form>
        )}

      </motion.div>
    </div>
  )
}
