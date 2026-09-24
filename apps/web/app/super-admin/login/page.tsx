"use client"

import { useState } from "react"
import { AlertCircle, Lock, Mail, ArrowRight, CheckCircle2, Loader2, ShieldCheck, KeyRound, Eye, EyeOff, Server, Building2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, signOut } from "next-auth/react"

export default function SuperAdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [code, setCode] = useState("")
  const [requires2FA, setRequires2FA] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        code: code || undefined,
        redirect: false
      })

      if (res?.error) {
        if (res.error === "2FA_REQUIRED" || res.error.includes("2FA_REQUIRED")) {
          setRequires2FA(true)
          setError("Two-Factor Authentication is enabled on this account. Please enter your 6-digit authenticator code.")
          setLoading(false)
          return
        }
        if (res.error === "2FA_INVALID" || res.error.includes("2FA_INVALID")) {
          setError("Invalid Two-Factor Authentication code. Please check your authenticator app.")
          setLoading(false)
          return
        }
        setError("Invalid Super Admin credentials. Please verify your root email and password.")
        setLoading(false)
        return
      }

      // Check session to confirm SUPER_ADMIN role
      const sessionRes = await fetch("/api/auth/session")
      const sessionData = await sessionRes.json()
      const role = sessionData?.user?.role

      if (role !== "SUPER_ADMIN" && role !== "Super Admin") {
        await signOut({ redirect: false })
        setError("Access Denied: This window is strictly reserved for Platform Super Administrators. Academy staff and teachers must sign in via the Academy Portal.")
        setLoading(false)
        return
      }

      setSuccess("Super Admin root identity verified. Launching Vendor Management...")
      setTimeout(() => {
        router.push("/dashboard/super-admin/academies")
        router.refresh()
      }, 600)
    } catch (err: any) {
      setError(err.message || "Failed to authenticate Super Admin.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 relative flex flex-col justify-between p-4 sm:p-6 selection:bg-amber-500/30 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[-15%] left-[20%] w-[60%] h-[60%] bg-amber-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Top Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black tracking-wider uppercase text-white font-mono">ECHO PLATFORM</div>
            <div className="text-[10px] text-amber-400/80 font-bold uppercase tracking-widest font-mono">Control Plane</div>
          </div>
        </div>

        <Link
          href="/auth/login"
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-900/80 hover:bg-slate-850 px-4 py-2 rounded-full border border-slate-800 shadow-sm flex items-center gap-2"
        >
          <Building2 className="w-3.5 h-3.5 text-teal-400" />
          Academy Portal Login →
        </Link>
      </header>

      {/* Main Login Card */}
      <div className="my-auto py-8 relative z-10 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/80 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400/20 to-amber-500/5 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-black uppercase tracking-widest text-amber-300 font-mono">
              Root Super Administrator
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Platform Control Plane
            </h1>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
              Reserved for platform infrastructure operators to manage academies, vendor contracts, plans & global settings.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-2xl text-xs text-rose-300 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div>{error}</div>
                {error.includes("Academy staff") && (
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs"
                  >
                    Go to Academy Portal Login →
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl text-xs text-emerald-300 flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">
                Super Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  autoComplete="username email"
                  placeholder="admin@grekam.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">
                Root Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-11 pr-11 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {requires2FA && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1.5 pt-1"
              >
                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-mono">
                  Two-Factor Authentication Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-amber-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-950/90 border border-amber-500/50 rounded-xl pl-11 pr-4 py-3 text-center text-sm font-mono tracking-widest font-black text-amber-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Root Access...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Platform Control Plane</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Info footer */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              Not a platform operator?{" "}
              <Link href="/auth/login" className="text-teal-400 hover:text-teal-300 font-bold transition-colors">
                Go to Academy Portal Login →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs font-mono text-slate-600 relative z-10">
        Echo LMS SaaS • Super Administrator Security Gateway • High Security Mode Active
      </footer>
    </div>
  )
}
