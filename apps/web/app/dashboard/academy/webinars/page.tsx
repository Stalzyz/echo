"use client"

import { useState } from "react"
import { 
  Video, Users, Calendar, Clock, Plus, Search, Filter, 
  ExternalLink, Copy, Check, X, Sparkles, Eye, ArrowRight, PlayCircle
} from "lucide-react"
import { toast } from "sonner"

interface Webinar {
  id: string
  title: string
  hostName: string
  date: string
  time: string
  registeredAttendees: number
  conversionRate: string
  platform: "YOUTUBE_LIVE" | "ZOOM_WEBINAR" | "HLS_EMBED"
  status: "UPCOMING" | "LIVE_NOW" | "COMPLETED"
  landingUrl: string
}

const INITIAL_WEBINARS: Webinar[] = [
  {
    id: "web-301",
    title: "Cracking UPSC Prelims: 90-Day High-Impact Strategy",
    hostName: "Raj Malhotra & Stalin Kumar",
    date: "2026-09-22",
    time: "07:00 PM IST",
    registeredAttendees: 1420,
    conversionRate: "18.4%",
    platform: "YOUTUBE_LIVE",
    status: "UPCOMING",
    landingUrl: "https://gecholms.com/w/upsc-strategy"
  },
  {
    id: "web-302",
    title: "Build & Deploy Full Stack SaaS Apps with Next.js & Fastify",
    hostName: "Stalin Kumar",
    date: "2026-09-20",
    time: "06:00 PM IST",
    registeredAttendees: 2890,
    conversionRate: "24.2%",
    platform: "ZOOM_WEBINAR",
    status: "LIVE_NOW",
    landingUrl: "https://gecholms.com/w/saas-masterclass"
  },
  {
    id: "web-303",
    title: "AI & Machine Learning Career Roadmap 2026",
    hostName: "Dr. Ananya Ray",
    date: "2026-09-15",
    time: "05:00 PM IST",
    registeredAttendees: 950,
    conversionRate: "15.8%",
    platform: "HLS_EMBED",
    status: "COMPLETED",
    landingUrl: "https://gecholms.com/w/ai-roadmap"
  }
]

export default function WebinarsPage() {
  const [webinars, setWebinars] = useState<Webinar[]>(INITIAL_WEBINARS)
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "LIVE_NOW" | "COMPLETED">("ALL")
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // New Webinar Form State
  const [form, setForm] = useState({
    title: "",
    hostName: "Stalin Kumar",
    date: "",
    time: "07:00 PM IST",
    platform: "ZOOM_WEBINAR" as const
  })

  const handleCreateWebinar = (e: React.FormEvent) => {
    e.preventDefault()
    const newWeb: Webinar = {
      id: `web-${Date.now().toString().slice(-4)}`,
      title: form.title,
      hostName: form.hostName,
      date: form.date || "2026-09-25",
      time: form.time,
      registeredAttendees: 0,
      conversionRate: "0%",
      platform: form.platform,
      status: "UPCOMING",
      landingUrl: `https://gecholms.com/w/${form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    }
    setWebinars([newWeb, ...webinars])
    setIsModalOpen(false)
    toast.success("Marketing Webinar Funnel created & landing page published!")
  }

  const copyLandingUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast.success("Webinar landing page URL copied!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filtered = webinars.filter(w => {
    if (activeTab !== "ALL" && w.status !== activeTab) return false
    if (search && !w.title.toLowerCase().includes(search.toLowerCase()) && !w.hostName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Header */}
      <div className="flex-none px-8 py-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-black shadow-xs">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Webinar & Workshop Funnel Builder</h1>
            <p className="text-xs text-slate-500 font-medium">Host live lead-gen webinars, workshops, and automated course sales funnels.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Webinar Funnel
        </button>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Webinar Funnels</span>
            <span className="text-2xl font-black text-slate-900 block">{webinars.length}</span>
            <span className="text-[10px] font-bold text-teal-600">Active Campaign Funnels</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Registrations</span>
            <span className="text-2xl font-black text-slate-900 block">{webinars.reduce((a, b) => a + b.registeredAttendees, 0).toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-600">Captured Leads</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg Lead Conversion</span>
            <span className="text-2xl font-black text-emerald-600 block">19.4%</span>
            <span className="text-[10px] font-bold text-emerald-600">Course Purchase Rate</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Live Webinars Now</span>
            <span className="text-2xl font-black text-rose-600 block">{webinars.filter(w => w.status === "LIVE_NOW").length}</span>
            <span className="text-[10px] font-bold text-rose-600 animate-pulse">Broadcasting Live</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            {(["ALL", "UPCOMING", "LIVE_NOW", "COMPLETED"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? "bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs" 
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {tab === "LIVE_NOW" ? "🔴 Live Now" : tab}
              </button>
            ))}
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              placeholder="Search webinar or host..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600"
            />
          </div>
        </div>

        {/* Webinars Cards Grid */}
        <div className="grid grid-cols-3 gap-5">
          {filtered.map(w => (
            <div key={w.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${
                    w.status === "LIVE_NOW" ? "bg-rose-50 text-rose-800 border-rose-200 animate-pulse" :
                    w.status === "UPCOMING" ? "bg-teal-50 text-teal-800 border-teal-200" :
                    "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {w.status === "LIVE_NOW" ? "🔴 BROADCASTING LIVE" : w.status}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400 font-bold">{w.platform}</span>
                </div>

                <h3 className="font-black text-slate-900 text-base leading-snug">{w.title}</h3>
                <p className="text-xs text-slate-500 font-medium">Host: <strong className="text-slate-800">{w.hostName}</strong></p>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Schedule</span>
                    <span className="font-bold text-slate-800 block">{w.date}</span>
                    <span className="text-[11px] text-slate-500">{w.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Leads</span>
                    <span className="font-black text-teal-700 text-sm block">{w.registeredAttendees.toLocaleString()}</span>
                    <span className="text-[11px] text-emerald-600 font-bold">{w.conversionRate} Conv.</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button 
                  onClick={() => copyLandingUrl(w.landingUrl, w.id)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedId === w.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  {copiedId === w.id ? "Copied" : "Copy Landing URL"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Webinar Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">Create Marketing Webinar Funnel</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleCreateWebinar} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Webinar Headline / Title *</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Master React & Node.js in 90 Days" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Host / Presenter Name *</label>
                <input required value={form.hostName} onChange={e => setForm(p => ({ ...p, hostName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date *</label>
                  <input required type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Broadcast Time</label>
                  <input value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Broadcasting Platform</label>
                <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value as any }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold">
                  <option value="ZOOM_WEBINAR">Zoom Webinar Integration</option>
                  <option value="YOUTUBE_LIVE">YouTube Live Stream Embed</option>
                  <option value="HLS_EMBED">Native HLS Custom Stream</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl">Publish Funnel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
