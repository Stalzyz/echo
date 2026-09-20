"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Mail, ArrowRight, ArrowLeft, Loader2, KeyRound, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "reset" | "complete">("request")
  const [email, setEmail] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [devCode, setDevCode] = useState("")

  const handleSendResetEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your registered email address")
      return
    }
    setLoading(true)
    setError("")

    setTimeout(() => {
      setLoading(false)
      setDevCode("849201")
      setStep("reset")
    }, 900)
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetCode || resetCode.length < 6) {
      setError("Please enter the 6-digit reset code sent to your email.")
      return
    }
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify your new password.")
      return
    }

    setLoading(true)
    setError("")

    setTimeout(() => {
      setLoading(false)
      setStep("complete")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col justify-between p-4 sm:p-6 selection:bg-teal-500/20">
      
      {/* Top Header */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between py-4">
        <Link 
          href="/auth/login" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
        </Link>
      </div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/60 my-auto text-left"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-3 text-teal-700 shadow-xs">
            <KeyRound className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest font-mono">Access Recovery</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">
            {step === "request" ? "Reset Your Password" : step === "reset" ? "Set New Password" : "Password Reset Done!"}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {step === "request" 
              ? "Enter your email to receive reset code instructions" 
              : step === "reset" 
              ? `Enter the 6-digit code sent to ${email}`
              : "Your account password has been updated successfully!"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* STEP 1: EMAIL REQUEST */}
        {step === "request" && (
          <form onSubmit={handleSendResetEmail} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@grekam.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Password Reset Code"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: CODE VERIFICATION & NEW PASSWORD */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {devCode && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-[11px] text-teal-800 font-mono text-center">
                Verification Code sent to {email}. Demo Code: <strong>{devCode}</strong>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">
                6-Digit Reset Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="849201"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-mono text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all tracking-widest font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 py-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-mono"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save New Password & Continue"}
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === "complete" && (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <div>
              <h3 className="text-base font-black text-emerald-950">Password Updated!</h3>
              <p className="text-xs font-bold text-emerald-800 mt-1 leading-relaxed">
                Your password has been changed successfully. You can now log into your academy panel using your email and new password.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-block px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Back to Sign In →
            </Link>
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs font-medium text-slate-400">
        © {new Date().getFullYear()} echo LMS by Grekam. All rights reserved.
      </footer>
    </div>
  )
}
