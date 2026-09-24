"use client"

import { useActionState, useState } from "react"
import { authenticate } from "./actions"
import { AlertCircle, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { DemoLoginModal } from "@/components/auth/DemoLoginModal"

export default function AcademyLoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-3 text-teal-700 shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest font-mono">Academy Portal</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Echo Academy Login</h1>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMessage}
          </div>
        )}

        <form action={dispatch} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="email"
                name="email"
                required
                autoComplete="username email"
                placeholder="demo.academy@echo.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 font-mono">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            Sign In to Academy <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-CLICK DEMO ACCESS BAR */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> LIVE DEMO DASHBOARDS:
            </span>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Auto-Fill
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDemoModalOpen(true)}
            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-between shadow-2xs hover:shadow-xs group"
          >
            <span className="truncate">⚡ Choose Demo Experience (Admin / Student / Faculty)</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="mt-6 text-center border-t border-slate-100 pt-4 space-y-2">
          <div>
            <Link href="/auth/login" className="text-xs font-semibold text-teal-700 hover:underline">
              Are you a student or educator? Switch to Unified Login →
            </Link>
          </div>
          <div>
            <Link href="/super-admin/login" className="text-xs font-semibold text-amber-700 hover:underline font-mono">
              Platform Super Admin Login →
            </Link>
          </div>
        </div>

        {/* DEMO POPUP MODAL */}
        <DemoLoginModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
        />
      </motion.div>
    </div>
  )
}
