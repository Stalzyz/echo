"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  GraduationCap, Video, Building2, Mail, Lock, 
  Smartphone, MessageSquare, ArrowRight, Loader2, CheckCircle2, 
  AlertCircle, Sparkles, X, User, Briefcase, Award, Info
} from "lucide-react"

export type RoleType = "student" | "educator" | "admin"
export type ModeType = "signin" | "signup"

interface UnifiedLoginPortalProps {
  defaultRole?: RoleType
  isStandalonePage?: boolean
}

export function UnifiedLoginPortal({ defaultRole = "student", isStandalonePage = true }: UnifiedLoginPortalProps) {
  const router = useRouter()
  const [mode, setMode] = useState<ModeType>("signin")
  const [selectedRole, setSelectedRole] = useState<RoleType>(defaultRole)
  const [authMethod, setAuthMethod] = useState<"email" | "otp">("email")

  // Form states (Sign In)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpChannel, setOtpChannel] = useState<"whatsapp" | "sms">("whatsapp")
  const [devCode, setDevCode] = useState("")

  // Form states (Sign Up)
  const [fullName, setFullName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [courseInterest, setCourseInterest] = useState("Full Stack Web Development")
  const [expertise, setExpertise] = useState("Computer Science & Web Dev")
  const [qualification, setQualification] = useState("Senior Educator / 5+ Yrs Experience")
  
  // Forgot password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState("")

  // Loading & error states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const roleConfig = {
    student: {
      id: "student",
      title: "Student Portal",
      shortTitle: "Student",
      subtitle: "Access learning studio, courses, quizzes & certificates",
      icon: GraduationCap,
      bgBadge: "bg-teal-50 border-teal-200 text-teal-800",
      activeTab: "bg-teal-600 text-white shadow-md shadow-teal-600/20",
      btnClass: "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20",
      targetPath: "/student",
      demoUser: "student@echo.in"
    },
    educator: {
      id: "educator",
      title: "Educator Studio",
      shortTitle: "Educator",
      subtitle: "Create courses, host live sessions (Requires Admin approval to publish)",
      icon: Video,
      bgBadge: "bg-indigo-50 border-indigo-200 text-indigo-800",
      activeTab: "bg-indigo-600 text-white shadow-md shadow-indigo-600/20",
      btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20",
      targetPath: "/dashboard/studio",
      demoUser: "educator@echo.in"
    },
    admin: {
      id: "admin",
      title: "Academy Admin",
      shortTitle: "Academy Admin",
      subtitle: "Full control over CRM, LMS, admissions, course approvals & billing",
      icon: Building2,
      bgBadge: "bg-amber-50 border-amber-200 text-amber-900",
      activeTab: "bg-amber-600 text-white shadow-md shadow-amber-600/20",
      btnClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20",
      targetPath: "/dashboard",
      demoUser: "admin@echo.in"
    }
  }

  const currentRole = roleConfig[selectedRole]

  const handleSwitchRole = (role: RoleType) => {
    setSelectedRole(role)
    setError("")
    setSuccess("")
    setOtpSent(false)
    setOtpCode("")
  }

  const handleDirectDemoLogin = (targetPath: string, roleName: string) => {
    setLoading(true)
    setError("")
    setSuccess(`Signing in to ${roleName}... Redirecting...`)
    setTimeout(() => {
      router.push(targetPath)
    }, 600)
  }

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(`Authenticated successfully as ${currentRole.shortTitle}! Redirecting...`)
    setTimeout(() => {
      router.push(currentRole.targetPath)
    }, 800)
  }

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !signupEmail || !signupPassword) {
      setError("Please fill in all required fields.")
      return
    }

    setLoading(true)
    setError("")

    if (selectedRole === "educator") {
      setSuccess("Educator profile registered! Draft course creation enabled. Redirecting to Studio...")
      setTimeout(() => {
        router.push("/dashboard/studio")
      }, 1000)
    } else {
      setSuccess("Account created successfully! Redirecting to Learning Portal...")
      setTimeout(() => {
        router.push("/student")
      }, 1000)
    }
  }

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }
    setLoading(true)
    setError("")
    setSuccess("")
    setTimeout(() => {
      setLoading(false)
      setOtpSent(true)
      setDevCode("123456")
      setSuccess(`OTP sent via ${otpChannel === "whatsapp" ? "WhatsApp" : "SMS"} to ${phone}`)
    }, 700)
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) return
    setResetLoading(true)
    setTimeout(() => {
      setResetLoading(false)
      setResetSuccess(`Password reset instructions sent to ${resetEmail}!`)
    }, 1000)
  }

  return (
    <div className={`w-full ${isStandalonePage ? "max-w-xl mx-auto" : "w-full"}`}>
      
      {/* CARD MAIN CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 relative overflow-hidden text-left"
      >
        {/* Top Brand Tag & Mode Switcher (Sign In vs Sign Up) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-black shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900 tracking-tight">Echo</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-black uppercase tracking-wider">
                  {mode === "signin" ? "Sign In Portal" : "Create Account"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Unified Education Gateway</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === "signin" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === "signup" ? "bg-teal-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* 1-WINDOW ROLE SELECTION SWITCHER TABS */}
        <div className="pt-6 pb-4 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">
            1. SELECT PORTAL ROLE:
          </label>
          
          <div className={`grid ${mode === "signup" ? "grid-cols-2" : "grid-cols-3"} gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80`}>
            {(Object.keys(roleConfig) as RoleType[])
              .filter(rKey => mode === "signin" || rKey !== "admin") // Admins don't self-signup
              .map((rKey) => {
                const r = roleConfig[rKey]
                const Icon = r.icon
                const isSelected = selectedRole === rKey
                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => handleSwitchRole(rKey)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      isSelected ? r.activeTab : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-center">{r.shortTitle}</span>
                  </button>
                )
              })}
          </div>
        </div>

        {/* ROLE HEADER BANNER */}
        <div className={`p-4 rounded-2xl border ${currentRole.bgBadge} mb-6 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/80 border border-current/20 flex items-center justify-center shrink-0">
              <currentRole.icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider">{mode === "signup" ? `${currentRole.title} Registration` : currentRole.title}</h3>
              <p className="text-[11px] font-medium opacity-90">{currentRole.subtitle}</p>
            </div>
          </div>
        </div>

        {/* ERROR / SUCCESS ALERTS */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
          </div>
        )}

        {/* MODE A: SIGN IN FORM */}
        {mode === "signin" && (
          <>
            {/* AUTH METHOD SUB-TABS */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                2. SIGN IN METHOD:
              </span>

              <div className="flex items-center gap-1 text-xs font-bold bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setAuthMethod("email"); setError(""); setSuccess(""); }}
                  className={`px-3 py-1 rounded-lg transition-all ${authMethod === "email" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Email & Password
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethod("otp"); setError(""); setSuccess(""); }}
                  className={`px-3 py-1 rounded-lg transition-all ${authMethod === "otp" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Mobile OTP
                </button>
              </div>
            </div>

            {/* EMAIL SIGN IN */}
            {authMethod === "email" && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">
                    {selectedRole === "student" ? "Student Email" : selectedRole === "educator" ? "Educator Email" : "Corporate Email"}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder={currentRole.demoUser}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Password</label>
                    <button
                      type="button"
                      onClick={() => { setIsForgotPasswordOpen(true); setResetSuccess(""); setResetEmail(email); }}
                      className="text-[10px] text-teal-700 font-bold hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${currentRole.btnClass}`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Sign In to ${currentRole.title}`}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* MOBILE OTP SIGN IN */}
            {authMethod === "otp" && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">
                    10-Digit Mobile Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

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
                      onClick={() => setOtpChannel("sms")}
                      className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 ${
                        otpChannel === "sms" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      SMS
                    </button>
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || phone.length < 10}
                    className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${currentRole.btnClass}`}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Send OTP via ${otpChannel === "whatsapp" ? "WhatsApp" : "SMS"}`}
                  </button>
                ) : (
                  <div className="space-y-4 pt-2">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">6-Digit Code</label>
                        <button type="button" onClick={handleSendOtp} className="text-[10px] text-teal-700 font-bold hover:underline">Resend OTP</button>
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="000000"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-mono text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 focus:bg-white tracking-widest"
                      />
                    </div>

                    {devCode && (
                      <div className="text-[10px] font-mono text-amber-900 bg-amber-50 p-2 rounded-xl text-center border border-amber-200">
                        Dev Test Code: <strong>123456</strong>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || otpCode.length < 6}
                      className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${currentRole.btnClass}`}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Verify & Sign In to ${currentRole.title}`}
                    </button>
                  </div>
                )}
              </form>
            )}
          </>
        )}

        {/* MODE B: CREATE ACCOUNT / SIGN UP FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-mono">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Stalin Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-mono">
                {selectedRole === "student" ? "Student Email *" : "Work / Corporate Email *"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="user@echo.in"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-mono">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {selectedRole === "student" ? (
              <>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-mono">Mobile Number (WhatsApp updates)</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-mono">Course Interest</label>
                  <select
                    value={courseInterest}
                    onChange={(e) => setCourseInterest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white font-medium"
                  >
                    <option value="Full Stack Web Development">Full Stack Web Development</option>
                    <option value="Data Science & Machine Learning">Data Science & Machine Learning</option>
                    <option value="UI/UX Design Masterclass">UI/UX Design Masterclass</option>
                    <option value="Cyber Security Essentials">Cyber Security Essentials</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-mono">Primary Teaching Expertise</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. React & Next.js Frameworks"
                      value={expertise}
                      onChange={(e) => setExpertise(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                {/* Educator Course Approval Policy Alert */}
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed text-[11px]">
                    <strong>Educator Course Policy:</strong> Educators can create, edit, and manage course drafts in Educator Studio. Course publishing to the public catalog requires Academy Admin approval.
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${currentRole.btnClass}`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : selectedRole === "student" ? "Create Student Account →" : "Register Educator Account →"}
            </button>
          </form>
        )}

        {/* 1-CLICK DEMO ACCESS BAR */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
              ⚡ 1-CLICK DIRECT DEMO ACCESS:
            </span>
            <span className="text-[10px] font-bold text-slate-400">Instant Preview</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(roleConfig) as RoleType[]).map((rKey) => {
              const r = roleConfig[rKey]
              return (
                <button
                  key={`demo-${rKey}`}
                  type="button"
                  onClick={() => handleDirectDemoLogin(r.targetPath, r.title)}
                  className="px-2.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1.5 hover:border-slate-300"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{r.shortTitle}</span>
                </button>
              )
            })}
          </div>
        </div>

      </motion.div>

      {/* POPUP MODAL WINDOW FOR FORGOT PASSWORD */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Reset Your Password</h3>
                <p className="text-xs text-slate-500 font-medium">Enter your registered email address</p>
              </div>
              <button 
                onClick={() => setIsForgotPasswordOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-900">{resetSuccess}</p>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="user@echo.in"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-medium focus:bg-white focus:outline-teal-600"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-1/2 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {resetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

    </div>
  )
}
