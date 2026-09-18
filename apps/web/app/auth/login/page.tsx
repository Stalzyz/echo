"use client"

import { useState } from "react"
import { AlertCircle, Lock, Mail, Smartphone, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function StudentAndEducatorLoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"email" | "otp" | "google">("email")

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

  // Google OAuth state
  const [googleLoading, setGoogleLoading] = useState(false)

  // Status/Errors
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setError("")

    try {
      const res = await fetch("http://127.0.0.1:4400/api/v1/auth/me", { credentials: "include" })
      setSuccess("Authenticated successfully!")
      setTimeout(() => router.push("/student"), 1000)
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your email and password.")
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
    setSuccess("")

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
        body: JSON.stringify({ phone, code: otpCode, role: "STUDENT" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "OTP Verification failed")

      setSuccess("Mobile OTP verified! Redirecting to Learning Portal...")
      setTimeout(() => router.push("/student"), 1000)
    } catch (err: any) {
      setError(err.message || "Invalid OTP code. Please try again.")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError("")

    try {
      const testEmail = `student_${Date.now()}@gmail.com`
      const res = await fetch("http://127.0.0.1:4400/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          name: "Learner User",
          googleId: `google_${Date.now()}`
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === "ADMIN_LOGIN_RESTRICTED") {
          throw new Error("Academy Administrators are restricted from Google Login. Please use Corporate Email or Mobile OTP.")
        }
        throw new Error(data.message || "Google Authentication failed")
      }

      setSuccess("Google Authentication successful!")
      setTimeout(() => router.push("/student"), 1000)
    } catch (err: any) {
      setError(err.message || "Google OAuth sign-in failed")
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative flex items-center justify-center overflow-hidden p-4">
      {/* Background soft mesh gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-200/50 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-200/50 blur-[130px] rounded-full pointer-events-none" />

      {/* Admin Portal Redirect Button */}
      <div className="absolute top-6 right-6 z-50">
        <Link href="/auth/admin/login" className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 shadow-sm transition-all flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-600" /> Academy Admin Login →
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/60 relative z-10"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-violet-50 border border-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-3 text-violet-600 shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest font-mono">Learners & Faculty</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Student Sign In</h1>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            onClick={() => { setActiveTab("email"); setError(""); setSuccess(""); }}
            className={`py-2 rounded-xl transition-all ${activeTab === "email" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Email
          </button>
          <button
            onClick={() => { setActiveTab("otp"); setError(""); setSuccess(""); }}
            className={`py-2 rounded-xl transition-all ${activeTab === "otp" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Mobile OTP
          </button>
          <button
            onClick={() => { setActiveTab("google"); setError(""); setSuccess(""); }}
            className={`py-2 rounded-xl transition-all ${activeTab === "google" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Gmail
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

        {/* TAB 1: Email Login */}
        {activeTab === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="student@grekam.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white transition-all font-medium"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={emailLoading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2"
            >
              {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In with Email"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: Mobile OTP */}
        {activeTab === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">10-Digit Mobile Number</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white transition-all font-mono"
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
                {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Send OTP via ${otpChannel === "whatsapp" ? "WhatsApp" : "Firebase SMS"}`}
              </button>
            ) : (
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">6-Digit Code</label>
                    <button type="button" onClick={handleSendOtp} className="text-[10px] text-violet-600 font-bold hover:underline">Resend OTP</button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-mono text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-violet-600 focus:bg-white tracking-widest"
                  />
                </div>

                {devCode && (
                  <div className="text-[10px] font-mono text-amber-800 bg-amber-50 p-2 rounded-xl text-center border border-amber-200">
                    Dev Test Code: <strong>{devCode}</strong> (or 123456)
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otpLoading || otpCode.length < 6}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-2"
                >
                  {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Sign In"}
                </button>
              </div>
            )}
          </form>
        )}

        {/* TAB 3: Google OAuth */}
        {activeTab === "google" && (
          <div className="space-y-4 text-center py-4">
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Sign in with your verified Google / Gmail account to load your courses and student passport.
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-3 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              Continue with Google
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
