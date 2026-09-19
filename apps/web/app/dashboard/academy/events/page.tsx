"use client"

import { useApi, fetchApi } from "@/lib/useApi"
import { CalendarDays, Plus, MapPin, Users, Calendar, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function CampusEventsAdmin() {
  const { data: events, mutate } = useApi<any[]>("/academy/events")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", type: "WORKSHOP", date: "", location: "", maxCapacity: 50 })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/academy/events", { method: "POST", body: JSON.stringify({
        ...form, maxCapacity: parseInt(form.maxCapacity.toString())
      }) })
      toast.success("Event created successfully!")
      setIsAddOpen(false)
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to create event")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-teal-600" /> Event Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage workshops, hackathons, and guest sessions for Echo LMS.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs">
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(events || []).map((event: any) => (
          <div key={event.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-slate-300 transition-colors shadow-xs">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200/80 px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wider">{event.type}</span>
              <span className={`text-[10px] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wider border ${event.isActive ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {event.isActive ? 'UPCOMING' : 'PAST'}
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mb-2">{event.title}</h3>
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" /> {new Date(event.date).toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" /> {event.location || "Online"}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Users className="w-4 h-4 text-slate-400" /> {event._count?.registrations || 0} / {event.maxCapacity || "∞"} Registered
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-900">
            <h2 className="text-xl font-black mb-6 text-slate-900">Create Campus Event</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required placeholder="Event Title" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} />
              
              <div className="flex gap-4">
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="HACKATHON">Hackathon</option>
                  <option value="GUEST_SESSION">Guest Session</option>
                  <option value="WEBINAR">Webinar</option>
                </select>
                <input required type="datetime-local" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} />
              </div>

              <div className="flex gap-4">
                <input placeholder="Location / Link" className="flex-[2] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} />
                <input required type="number" placeholder="Capacity" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                  value={form.maxCapacity} onChange={e => setForm(p => ({...p, maxCapacity: parseInt(e.target.value)}))} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors text-slate-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors flex justify-center items-center shadow-xs">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
