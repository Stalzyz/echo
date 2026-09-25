"use client"

import { useState } from  "react"
import { Video, Users, Calendar, Clock, Plus, Search, Filter, ExternalLink, Copy, Check, X, Eye, ArrowRight, PlayCircle, MessageCircle, Workflow, Tag, ShieldCheck, Radio, Settings, CheckCircle2, RefreshCw } from  "lucide-react"
import { toast } from  "sonner"
import Link from "next/link"

interface Webinar {
  id: string
  title: string
  slug: string
  hostName: string
  date: string
  time: string
  registeredAttendees: number
  conversionRate: string
  platform: "YOUTUBE_LIVE" | "ZOOM_WEBINAR" | "HLS_EMBED"
  status: "UPCOMING" | "LIVE_NOW" | "EVERGREEN" | "COMPLETED"
  isEvergreen: boolean
  timedPitch: {
    enabled: boolean
    triggerMinute: number
    headline: string
    couponCode: string
    courseTitle: string
    discountPrice: string
  }
  landingUrl: string
}

export default function WebinarsPage() {
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "LIVE_NOW" | "EVERGREEN" | "COMPLETED">("ALL")
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null)

  // New Webinar Form State
  const [form, setForm] = useState({
    title: "",
    slug: "",
    hostName: "Stalin Kumar",
    date: "",
    time: "07:00 PM IST",
    platform: "YOUTUBE_LIVE" as const,
    isEvergreen: false,
    pitchEnabled: true,
    pitchMinute: 45,
    pitchHeadline: "Webinar Special Discount Offer",
    pitchCoupon: "WEBINAR50",
    pitchCourse: "Full Access Academy Membership",
    pitchPrice: "₹2,499"
  })

  const handleCreateWebinar = (e: React.FormEvent) => {
    e.preventDefault()
    const generatedSlug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const newWeb: Webinar = {
      id: `web-${Date.now().toString().slice(-4)}`,
      title: form.title,
      slug: generatedSlug,
      hostName: form.hostName,
      date: form.isEvergreen ? "Evergreen (Every 15m)" : (form.date || "2026-09-25"),
      time: form.isEvergreen ? "Auto-Looping" : form.time,
      registeredAttendees: 0,
      conversionRate: "0%",
      platform: form.platform,
      status: form.isEvergreen ? "EVERGREEN" : "UPCOMING",
      isEvergreen: form.isEvergreen,
      timedPitch: {
        enabled: form.pitchEnabled,
        triggerMinute: Number(form.pitchMinute),
        headline: form.pitchHeadline,
        couponCode: form.pitchCoupon,
        courseTitle: form.pitchCourse,
        discountPrice: form.pitchPrice
      },
      landingUrl: `/w/${generatedSlug}`
    }
    setWebinars([newWeb, ...webinars])
    setIsModalOpen(false)
    toast.success("Marketing Webinar Funnel & Timed Pitch CTA published successfully!")
  }

  const copyLandingUrl = (slug: string, id: string) => {
    const fullUrl = `${window.location.origin}/w/${slug}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(id)
    toast.success("Public Webinar Funnel URL copied to clipboard!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleEvergreen = (id: string) => {
    setWebinars(prev => prev.map(w => {
      if (w.id !== id) return w
      const nextEvergreen = !w.isEvergreen
      return {
        ...w,
        isEvergreen: nextEvergreen,
        status: nextEvergreen ? "EVERGREEN" : "UPCOMING",
        date: nextEvergreen ? "Evergreen (Every 15m)" : "2026-09-25",
        time: nextEvergreen ? "Auto-Looping" : "07:00 PM IST"
      }
    }))
    toast.success("Webinar campaign status updated!")
  }

  const dispatchWhatsAppAlert = (webinar: Webinar) => {
    setBroadcastingId(webinar.id)
    setTimeout(() => {
      setBroadcastingId(null)
      toast.success(`WhatsApp 1-Tap Join Alert dispatched to ${webinar.registeredAttendees.toLocaleString()} registered leads!`)
    }, 1200)
  }

  const filtered = webinars.filter(w => {
    if (activeTab !== "ALL" && w.status !== activeTab) return false
    if (search && !w.title.toLowerCase().includes(search.toLowerCase()) && !w.hostName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      
      {/* Header */}
      <div className="flex-none px-4 sm:px-6 lg:px-8 py-5 sm:py-6 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-black shadow-xs shrink-0">
            <Video className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Webinar & Funnel Conversion Engine</h1>
            <p className="text-xs text-slate-500 font-medium">Host live & automated webinars with Timed Pitch CTAs, 1-tap WhatsApp reminders, and direct checkout.</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create High-Converting Funnel
        </button>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Webinar Funnels</span>
            <span className="text-2xl font-black text-slate-900 block">{webinars.length}</span>
            <span className="text-[10px] font-bold text-teal-600">Active High-Ticket Funnels</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Captured Leads</span>
            <span className="text-2xl font-black text-slate-900 block">{webinars.reduce((a, b) => a + b.registeredAttendees, 0).toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-600">WhatsApp & Email Leads</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg Pitch Conversion</span>
            <span className="text-2xl font-black text-emerald-600 block">21.4%</span>
            <span className="text-[10px] font-bold text-emerald-600">Timed Offer Checkout Rate</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Live & Evergreen Status</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-rose-600">{webinars.filter(w => w.status === "LIVE_NOW").length} Live</span>
              <span className="text-slate-300">/</span>
              <span className="text-2xl font-black text-teal-600">{webinars.filter(w => w.isEvergreen).length} Evergreen</span>
            </div>
            <span className="text-[10px] font-bold text-teal-600">Automated Lead Engine</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {(["ALL", "UPCOMING", "LIVE_NOW", "EVERGREEN", "COMPLETED"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? "bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs" 
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {tab === "LIVE_NOW" ? "🔴 Live Now" : tab === "EVERGREEN" ? "⚡ Evergreen" : tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              placeholder="Search funnel by title or host..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600"
            />
          </div>
        </div>

        {/* Webinars Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(w => (
            <div key={w.id} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${
                    w.status === "LIVE_NOW" ? "bg-rose-50 text-rose-800 border-rose-200 animate-pulse" :
                    w.status === "EVERGREEN" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                    w.status === "UPCOMING" ? "bg-teal-50 text-teal-800 border-teal-200" :
                    "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {w.status === "LIVE_NOW" ? "🔴 BROADCASTING LIVE" : w.status === "EVERGREEN" ? "⚡ EVERGREEN 24/7" : w.status}
                  </span>

                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{w.platform}</span>
                </div>

                <h3 className="font-black text-slate-900 text-base leading-snug">{w.title}</h3>
                <p className="text-xs text-slate-500 font-medium">Host: <strong className="text-slate-800">{w.hostName}</strong></p>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Schedule</span>
                    <span className="font-bold text-slate-800 block text-[11px] truncate">{w.date}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{w.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Leads & Conv.</span>
                    <span className="font-black text-teal-700 text-sm block">{w.registeredAttendees.toLocaleString()} Leads</span>
                    <span className="text-[11px] text-emerald-600 font-bold">{w.conversionRate} Pitch Conv.</span>
                  </div>
                </div>

                {/* Timed Pitch Banner Info */}
                {w.timedPitch.enabled && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <Workflow className="w-3 h-3 text-amber-600 fill-amber-500" /> Timed Pitch @ Min {w.timedPitch.triggerMinute}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded font-mono">{w.timedPitch.couponCode}</span>
                    </div>
                    <p className="text-[11px] font-bold text-amber-950 truncate">{w.timedPitch.headline}</p>
                    <p className="text-[10px] text-amber-700 font-medium">Special Price: <strong className="text-emerald-700 font-black">{w.timedPitch.discountPrice}</strong> for {w.timedPitch.courseTitle}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href={`/w/${w.slug}`}
                    target="_blank"
                    className="py-2 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-teal-600" /> Public Room
                  </Link>

                  <button 
                    onClick={() => copyLandingUrl(w.slug, w.id)}
                    className="py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    {copiedId === w.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    {copiedId === w.id ? "Copied" : "Copy Link"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => dispatchWhatsAppAlert(w)}
                    disabled={broadcastingId === w.id}
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-2xs disabled:opacity-50"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> 
                    {broadcastingId === w.id ? "Sending..." : "WhatsApp Alert"}
                  </button>

                  <button 
                    onClick={() => toggleEvergreen(w.id)}
                    className={`py-2 border rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                      w.isEvergreen 
                        ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200" 
                        : "bg-teal-600 text-white border-teal-700 hover:bg-teal-700"
                    }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    {w.isEvergreen ? "Make Live Only" : "Make Evergreen"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Webinar Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">Create Marketing Webinar Funnel</h2>
                <p className="text-xs text-slate-500 font-medium">Configure landing page, broadcast platform, and timed pitch CTA offer.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleCreateWebinar} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Webinar Headline / Title *</label>
                  <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Master React & Node.js in 90 Days" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Host / Presenter Name *</label>
                    <input required value={form.hostName} onChange={e => setForm(p => ({ ...p, hostName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Custom URL Slug</label>
                    <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="e.g. react-bootcamp" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-teal-50/60 border border-teal-200/80 rounded-2xl">
                  <div>
                    <span className="text-xs font-black text-teal-900 block">Evergreen On-Demand Loop</span>
                    <span className="text-[10px] text-teal-700 font-medium">Replays session every 15 mins automatically 24/7</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={form.isEvergreen} 
                    onChange={e => setForm(p => ({ ...p, isEvergreen: e.target.checked }))} 
                    className="w-4 h-4 accent-teal-600 rounded cursor-pointer" 
                  />
                </div>

                {!form.isEvergreen && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Date *</label>
                      <input required type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Broadcast Time</label>
                      <input value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Broadcasting Platform</label>
                  <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value as any }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-teal-600">
                    <option value="YOUTUBE_LIVE">YouTube Live / Unlisted Video Embed</option>
                    <option value="ZOOM_WEBINAR">Zoom Webinar Direct Integration</option>
                    <option value="HLS_EMBED">Native HLS Custom Stream</option>
                  </select>
                </div>
              </div>

              {/* Timed Pitch Configurator Section */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4 text-amber-500 fill-amber-400" /> Timed Pitch Offer Popup
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                    <input 
                      type="checkbox" 
                      checked={form.pitchEnabled} 
                      onChange={e => setForm(p => ({ ...p, pitchEnabled: e.target.checked }))} 
                      className="w-4 h-4 accent-amber-500 rounded" 
                    /> Enable
                  </label>
                </div>

                {form.pitchEnabled && (
                  <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Trigger (Minute) *</label>
                        <input type="number" min="1" value={form.pitchMinute} onChange={e => setForm(p => ({ ...p, pitchMinute: Number(e.target.value) }))} className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Coupon Code *</label>
                        <input value={form.pitchCoupon} onChange={e => setForm(p => ({ ...p, pitchCoupon: e.target.value }))} className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold font-mono" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Pitch Offer Banner Headline *</label>
                      <input value={form.pitchHeadline} onChange={e => setForm(p => ({ ...p, pitchHeadline: e.target.value }))} className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-medium" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Course Title *</label>
                        <input value={form.pitchCourse} onChange={e => setForm(p => ({ ...p, pitchCourse: e.target.value }))} className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-medium" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Special Discount Price *</label>
                        <input value={form.pitchPrice} onChange={e => setForm(p => ({ ...p, pitchPrice: e.target.value }))} className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-700" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs">Publish High-Converting Funnel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
