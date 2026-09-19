"use client"

import { useState } from "react"
import { useApi, fetchApi } from "@/lib/useApi"
import { Briefcase, Building, X, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

export default function AcademyInternships() {
  const { data: internships, mutate } = useApi<any[]>("/academy/internships")
  const { data: students } = useApi<any>("/academy/students")
  
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    studentId: "",
    companyName: "",
    role: "",
    status: "IN_PROGRESS"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/academy/internships", {
        method: "POST",
        body: JSON.stringify(form)
      })
      toast.success("Internship recorded successfully!")
      setIsSlideOverOpen(false)
      setForm({ studentId: "", companyName: "", role: "", status: "IN_PROGRESS" })
      mutate()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to record internship")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-teal-600" /> Internship Portal
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Track student internships and daily logs for Echo LMS.</p>
        </div>
        <button 
          onClick={() => setIsSlideOverOpen(true)}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Record Internship
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(internships?.length === 0) && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl border-dashed shadow-xs">
            <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">No Internships Recorded</h3>
            <p className="text-slate-500 text-center max-w-sm mb-6 font-medium">You haven't added any student internships yet. Track external placements and work logs here.</p>
            <button 
              onClick={() => setIsSlideOverOpen(true)}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors shadow-xs"
            >
              + Record Internship
            </button>
          </div>
        )}
        {(internships || []).map((intern: any) => (
          <div key={intern.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-slate-300 transition-colors shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-lg mb-1">{intern.role}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold mb-4">
              <Building className="w-4 h-4 text-slate-400" /> {intern.companyName}
            </div>
            <div className="text-xs text-slate-500 mb-4 font-medium">
              Student: <span className="text-slate-900 ml-1 font-bold">{intern.student?.user?.firstName} {intern.student?.user?.lastName}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-4">
              <span className={`px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wider border ${intern.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {intern.status}
              </span>
              <span className="text-slate-400 font-mono font-bold">{intern._count?.dailyLogs || 0} Logs</span>
            </div>
          </div>
        ))}
      </div>

      {/* SlideOver for Record Internship */}
      {isSlideOverOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" onClick={() => setIsSlideOverOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white border-l border-slate-200 z-50 p-6 overflow-y-auto flex flex-col shadow-2xl text-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black flex items-center gap-2 text-slate-900"><Briefcase className="w-5 h-5 text-teal-600" /> Record Internship</h2>
              <button onClick={() => setIsSlideOverOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
              
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Student</label>
                <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  value={form.studentId} onChange={e => setForm(f => ({...f, studentId: e.target.value}))}>
                  <option value="">Select a student...</option>
                  {(students?.data || []).map((s: any) => (
                    <option key={s.id} value={s.id}>{s.user?.firstName} {s.user?.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Company Name</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  placeholder="e.g. Google"
                  value={form.companyName} onChange={e => setForm(f => ({...f, companyName: e.target.value}))} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Role</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  placeholder="e.g. Frontend Engineer Intern"
                  value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Status</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="TERMINATED">Terminated</option>
                </select>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-200 flex justify-end gap-3">
                <button type="button" onClick={() => setIsSlideOverOpen(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-700 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2 shadow-xs">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />}
                  Save Internship
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
