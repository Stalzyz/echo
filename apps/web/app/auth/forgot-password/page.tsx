"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Mail, ArrowRight, ArrowLeft, Loader2, KeyRound } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your registered email address")
      return
    }
    setLoading(true)
    setError("")
    setSuccess("")

    setTimeout(() => {
      setLoading(false)
      setSuccess(`Password reset instructions sent to ${email}. Please check your inbox.`)
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
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Reset Your Password</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Enter your email to receive password reset instructions</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-emerald-900 leading-relaxed">{success}</p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Back to Login →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="user@echo.in"
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Password Reset Instructions"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </motion.div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs font-medium text-slate-400">
        © {new Date().getFullYear()} Echo LMS Inc. All rights reserved.
      </footer>
    </div>
  )
}
