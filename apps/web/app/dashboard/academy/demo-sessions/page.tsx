"use client"

import { useApi, fetchApi } from "@/lib/useApi"
import { CalendarDays, Plus, MapPin, Users, Calendar, Loader2, PlayCircle, Video, Pencil, Trash2, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function DemoSessionsAdmin() {
  const { data: sessions, mutate } = useApi<any[]>("/academy/demo-sessions")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<any | null>(null)
  const [form, setForm] = useState({ title: "", scheduledAt: "", venue: "", meetLink: "", capacity: 20, durationMins: 60 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingMeet, setIsGeneratingMeet] = useState(false)

  const handleGenerateMeet = async () => {
    if (!form.title || !form.scheduledAt) {
      toast.error("Please enter a title and scheduled time first.")
      return
    }
    
    setIsGeneratingMeet(true)
    try {
      const startTime = new Date(form.scheduledAt)
      const endTime = new Date(startTime.getTime() + form.durationMins * 60000)

      const res = await fetchApi<any>("/google/meet", {
        method: "POST",
        body: JSON.stringify({
          summary: form.title,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })
      })

      if (res.meetUrl) {
        setForm(p => ({ ...p, meetLink: res.meetUrl }))
        toast.success("Google Meet link generated!")
      } else {
        throw new Error("No URL returned")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate Meet link. Check integrations.")
    } finally {
      setIsGeneratingMeet(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/academy/demo-sessions", { method: "POST", body: JSON.stringify({
        ...form, capacity: parseInt(form.capacity.toString()), durationMins: parseInt(form.durationMins.toString())
      }) })
      toast.success("Demo session created!")
      setIsAddOpen(false)
      setForm({ title: "", scheduledAt: "", venue: "", meetLink: "", capacity: 20, durationMins: 60 })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to create session")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSession) return
    setIsSubmitting(true)
    try {
      await fetchApi(`/academy/demo-sessions/${editingSession.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...form,
          capacity: parseInt(form.capacity.toString()),
          durationMins: parseInt(form.durationMins.toString())
        })
      })
      toast.success("Demo session updated!")
      setEditingSession(null)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to update session")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return
    try {
      await fetchApi(`/academy/demo-sessions/${id}`, { method: "DELETE" })
      toast.success("Demo session deleted!")
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete session")
    }
  }

  const openEditModal = (session: any) => {
    setEditingSession(session)
    const formattedDate = session.scheduledAt ? new Date(session.scheduledAt).toISOString().slice(0, 16) : ""
    setForm({
      title: session.title || "",
      scheduledAt: formattedDate,
      venue: session.venue || "",
      meetLink: session.meetLink || "",
      capacity: session.capacity || 20,
      durationMins: session.durationMins || 60
    })
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-slate-900">
            <PlayCircle className="w-8 h-8 text-teal-600" /> Demo Sessions
          </h1>
          <p className="text-slate-500 mt-2">Schedule and manage introductory demo classes for walk-in leads.</p>
        </div>
        <button onClick={() => { setForm({ title: "", scheduledAt: "", venue: "", meetLink: "", capacity: 20, durationMins: 60 }); setIsAddOpen(true); }} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Schedule Demo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(sessions || []).map((session: any) => (
          <div key={session.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-400 transition-colors shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-1 rounded font-bold uppercase tracking-widest border border-teal-200">DEMO CLASS</span>
              
              <div className="flex items-center gap-1">
                <button onClick={() => openEditModal(session)} title="Edit Session" className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(session.id)} title="Delete Session" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-2 text-slate-900">{session.title}</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" /> {new Date(session.scheduledAt).toLocaleString('en-IN')} ({session.durationMins} mins)
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" /> {session.venue || "Campus Main Hall"}
              </div>
              {session.meetLink && (
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                  <a href={session.meetLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold transition-colors">
                    <Video className="w-4 h-4" /> Join Google Meet
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Users className="w-4 h-4 text-slate-400" /> {session._count?.registrations || 0} / {session.capacity} Seats Booked
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full" style={{ width: `${Math.min(100, ((session._count?.registrations || 0) / session.capacity) * 100)}%` }} />
            </div>
          </div>
        ))}

        {(sessions || []).length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-white">
            No demo sessions scheduled. Click "Schedule Demo" to create one.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(isAddOpen || editingSession) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl text-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">{editingSession ? "Edit Demo Session" : "Schedule Demo Class"}</h2>
              <button onClick={() => { setIsAddOpen(false); setEditingSession(null); }}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>
            <form onSubmit={editingSession ? handleEdit : handleAdd} className="space-y-4">
              <input required placeholder="Demo Title (e.g. Intro to UI/UX)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-teal-500 outline-none"
                value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
              
              <div className="grid grid-cols-3 gap-4">
                <input required type="datetime-local" className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-teal-500 outline-none"
                  value={form.scheduledAt} onChange={e => setForm(p => ({...p, scheduledAt: e.target.value}))} />
                <input required type="number" placeholder="Duration (mins)" className="col-span-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-teal-500 outline-none"
                  value={form.durationMins} onChange={e => setForm(p => ({...p, durationMins: parseInt(e.target.value)}))} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Venue / Room" className="col-span-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-teal-500 outline-none"
                  value={form.venue} onChange={e => setForm(p => ({...p, venue: e.target.value}))} />
                
                <div className="col-span-1 relative flex gap-2">
                  <input placeholder="Google Meet Link (Optional)" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-teal-500 outline-none min-w-0"
                    value={form.meetLink} onChange={e => setForm(p => ({...p, meetLink: e.target.value}))} />
                  <button 
                    type="button"
                    onClick={handleGenerateMeet}
                    disabled={isGeneratingMeet}
                    className="shrink-0 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 px-3 py-3 rounded-xl font-bold transition-colors flex items-center justify-center min-w-[48px]"
                    title="Auto-generate Google Meet Link"
                  >
                    {isGeneratingMeet ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <input required type="number" placeholder="Capacity" className="col-span-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-teal-500 outline-none"
                  value={form.capacity} onChange={e => setForm(p => ({...p, capacity: parseInt(e.target.value)}))} />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => { setIsAddOpen(false); setEditingSession(null); }} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors flex justify-center items-center shadow-sm">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingSession ? "Update" : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

