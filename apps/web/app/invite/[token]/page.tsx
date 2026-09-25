"use client"

import { useState } from  "react"
import Link from "next/link"
import { CheckCircle2, Lock, User, ArrowRight, Loader2 } from  "lucide-react"

export default function AcceptInvitationPage() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAccepted(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 selection:bg-teal-500 selection:text-slate-950">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-2.5 mb-6 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            
          </div>
          <span className="font-extrabold text-xl tracking-tight">ECHO <span className="text-teal-400 text-xs font-normal">ACADEMY</span></span>
        </div>

        {accepted ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Invitation Accepted!</h2>
            <p className="text-xs text-slate-400 mb-6">Your account is activated. Proceed to your dashboard.</p>
            <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition-all shadow-md">
              Sign In to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-white">Join Grekam Academy</h2>
              <p className="text-xs text-slate-400 mt-1">You have been invited as an Educator / Staff Member. Set your password to activate your account.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Set Account Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-teal-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 6}
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Activate Account & Sign In"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
