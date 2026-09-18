"use client"

import { useApi, fetchApi } from "@/lib/useApi"
import { Video, Plus, Loader2, Users, Calendar, Clock, ExternalLink, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function OnsiteLiveSessionsPage() {
  const { data: sessions, isLoading, mutate } = useApi<any[]>("/academy/demo-sessions")
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: "",
    scheduledAt: "",
    durationMins: 60,
    capacity: 30,
    meetUrl: "",
    venue: "Online / Google Meet"
  })

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const finalMeetUrl = form.meetUrl || `https://meet.google.com/new`
      await fetchApi("/academy/demo-sessions", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          durationMins: Number(form.durationMins),
          capacity: Number(form.capacity),
          venue: `${form.venue} | ${finalMeetUrl}`
        })
      })
      toast.success("Live session scheduled successfully!")
      setIsScheduleOpen(false)
      setForm({ title: "", scheduledAt: "", durationMins: 60, capacity: 30, meetUrl: "", venue: "Online / Google Meet" })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule session")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto relative">
      <div className="flex-none border-b border-slate-200 pb-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center border border-teal-200">
              <Video className="w-6 h-6 text-teal-600 relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live Classes</h1>
              <p className="text-sm text-slate-500 mt-2">Manage ongoing live sessions and demo classes.</p>
            </div>
          </div>
          <button onClick={() => setIsScheduleOpen(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Schedule Session
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions?.map((session: any) => (
            <div key={session.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col group hover:border-teal-400 transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] bg-teal-50 text-teal-700 px-2.5 py-1 rounded font-bold uppercase tracking-widest border border-teal-200">
                  LIVE SESSION
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded font-bold uppercase border border-emerald-200">
                  SCHEDULED
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-2 text-slate-900">{session.title}</h3>
              <p className="text-sm text-slate-500 mb-6">{session.venue || "Main Hall"}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(session.scheduledAt).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {new Date(session.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ({session.durationMins} mins)
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Users className="w-4 h-4" />
                  {session._count?.registrations || 0} / {session.capacity}
                </div>
                <a 
                  href={session.venue?.includes('http') ? session.venue.split('|').pop()?.trim() : 'https://meet.google.com/new'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-teal-700 hover:text-teal-800 font-bold text-sm flex items-center gap-1.5 transition-colors bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Join Room
                </a>
              </div>
            </div>
          ))}

          {(!sessions || sessions.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <Video className="w-16 h-16 text-slate-300 mb-4" />
              <h2 className="text-xl font-bold text-slate-800">No Live Sessions</h2>
              <p className="text-sm text-slate-400 mt-2 max-w-md">Schedule a new live class or demo session to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Schedule Session Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl text-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Schedule Live Class</h2>
              <button onClick={() => setIsScheduleOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>
            <form onSubmit={handleScheduleSession} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-2">Class Title</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none"
                  placeholder="e.g. Advanced UI Workshop"
                  value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-2">Date & Time</label>
                <input required type="datetime-local" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none"
                  value={form.scheduledAt} onChange={e => setForm(p => ({...p, scheduledAt: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-2">Duration (Mins)</label>
                  <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none"
                    value={form.durationMins} onChange={e => setForm(p => ({...p, durationMins: Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-2">Max Capacity</label>
                  <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none"
                    value={form.capacity} onChange={e => setForm(p => ({...p, capacity: Number(e.target.value)}))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-2">Google Meet URL (Optional)</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={form.meetUrl} onChange={e => setForm(p => ({...p, meetUrl: e.target.value}))} />
                <p className="text-[10px] text-slate-400 mt-1">Leave empty to generate a new Google Meet room link automatically.</p>
              </div>
              <button disabled={isSubmitting || !form.title || !form.scheduledAt} type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 mt-4 flex justify-center items-center gap-2 shadow-sm">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Schedule Session"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
