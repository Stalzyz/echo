import Link from "next/link"
import { ShieldAlert, ArrowLeft } from  "lucide-react"

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 selection:bg-teal-500 selection:text-slate-950">
      <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">403 — Access Denied</h1>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          You do not have permission to view this portal or module. Please log in with the correct role credentials.
        </p>
        <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition-all">
          <ArrowLeft className="w-4 h-4" /> Return to Login
        </Link>
      </div>
    </div>
  )
}
