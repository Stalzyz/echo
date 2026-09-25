"use client"

import { useState } from  "react"
import { Calendar, Clock, Video, User, Plus, Search, Filter, CheckCircle2, AlertCircle, ExternalLink, Copy, Check, X, Loader2, DollarSign } from  "lucide-react"
import { toast } from  "sonner"

interface ConsultationSession {
  id: string
  studentName: string
  studentEmail: string
  instructorName: string
  topic: string
  date: string
  time: string
  durationMins: number
  fee: number
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED"
  meetingLink: string
}

export default function ConsultationsPage() {
  const [sessions, setSessions] = useState<ConsultationSession[]>([])
  const [activeTab, setActiveTab] = useState<"ALL" | "CONFIRMED" | "COMPLETED">("ALL")
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // New Booking Form State
  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    instructorName: "Stalin Kumar",
    topic: "",
    date: "",
    time: "11:00 AM",
    durationMins: 45,
    fee: 1499
  })

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault()
    const newSession: ConsultationSession = {
      id: `cs-${Date.now().toString().slice(-4)}`,
      ...form,
      status: "CONFIRMED",
      meetingLink: `https://meet.google.com/gch-${Date.now().toString().slice(-6)}`
    }
    setSessions([newSession, ...sessions])
    setIsModalOpen(false)
    toast.success("1:1 Consultation slot booked successfully!")
    setForm({
      studentName: "",
      studentEmail: "",
      instructorName: "Stalin Kumar",
      topic: "",
      date: "",
      time: "11:00 AM",
      durationMins: 45,
      fee: 1499
    })
  }

  const copyMeetingLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    toast.success("Meeting link copied to clipboard!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filtered = sessions.filter(s => {
    if (activeTab !== "ALL" && s.status !== activeTab) return false
    if (search && !s.studentName.toLowerCase().includes(search.toLowerCase()) && !s.topic.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Top Action Header */}
      <div className="flex-none px-8 py-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-black shadow-xs">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">1:1 Consultation & Mentorship Engine</h1>
            <p className="text-xs text-slate-500 font-medium">Schedule 1:1 mock interviews, career guidance, and private counseling sessions.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Book 1:1 Consultation Slot
        </button>
      </div>

      {/* Main Workspace Content */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
            <span className="text-2xl font-black text-slate-900 block">{sessions.length}</span>
            <span className="text-[10px] font-bold text-teal-600">Active Mentorships</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Confirmed Sessions</span>
            <span className="text-2xl font-black text-teal-600 block">{sessions.filter(s => s.status === "CONFIRMED").length}</span>
            <span className="text-[10px] font-bold text-slate-400">Scheduled Ahead</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Consultation Revenue</span>
            <span className="text-2xl font-black text-slate-900 block">₹{sessions.reduce((acc, s) => acc + s.fee, 0).toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-600">+18% vs Last Month</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg Session Duration</span>
            <span className="text-2xl font-black text-slate-900 block">45 Mins</span>
            <span className="text-[10px] font-bold text-slate-400">High Engagement</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            {(["ALL", "CONFIRMED", "COMPLETED"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? "bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs" 
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              placeholder="Search student or topic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600"
            />
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Student Details</th>
                <th className="py-4 px-6">Consultation Topic</th>
                <th className="py-4 px-4">Instructor</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4 text-right">Fee</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-900 block">{s.studentName}</span>
                    <span className="text-[11px] text-slate-400">{s.studentEmail}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800 max-w-xs">{s.topic}</td>
                  <td className="py-4 px-4 text-slate-700 font-bold">{s.instructorName}</td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block">{s.date}</span>
                    <span className="text-[11px] text-slate-500">{s.time} ({s.durationMins}m)</span>
                  </td>
                  <td className="py-4 px-4 text-right font-black text-slate-900">₹{s.fee}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${
                      s.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                      s.status === "COMPLETED" ? "bg-slate-100 text-slate-700 border-slate-200" :
                      "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => copyMeetingLink(s.meetingLink, s.id)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-teal-50 hover:text-teal-800 rounded-xl text-xs font-bold text-slate-700 transition-all inline-flex items-center gap-1.5"
                    >
                      {copiedId === s.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      {copiedId === s.id ? "Copied" : "Meeting Link"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book 1:1 Consultation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">Book 1:1 Consultation Session</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Student Full Name *</label>
                <input required value={form.studentName} onChange={e => setForm(p => ({ ...p, studentName: e.target.value }))} placeholder="e.g. Rahul Sharma" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Student Email Address *</label>
                <input required type="email" value={form.studentEmail} onChange={e => setForm(p => ({ ...p, studentEmail: e.target.value }))} placeholder="student@gmail.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Consultation Topic *</label>
                <input required value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} placeholder="e.g. UPSC Prelims Strategy & 1:1 Feedback" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Session Date *</label>
                  <input required type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Session Time *</label>
                  <input required value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} placeholder="11:00 AM" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duration (Mins)</label>
                  <input type="number" value={form.durationMins} onChange={e => setForm(p => ({ ...p, durationMins: parseInt(e.target.value) || 30 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Session Fee (₹)</label>
                  <input type="number" value={form.fee} onChange={e => setForm(p => ({ ...p, fee: parseInt(e.target.value) || 0 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold" />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
