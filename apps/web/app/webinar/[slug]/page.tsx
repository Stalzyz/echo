"use client"

import { use, useState, useEffect } from  "react"
import Link from "next/link"
import { Video, Calendar, Clock, Users, ArrowRight, Play, CheckCircle2, Send, ThumbsUp, ShieldCheck, MessageSquare, DollarSign, Copy, Check, User, Share2, HelpCircle, Lock, Award, Heart, Gift } from  "lucide-react"
import { toast } from  "sonner"

interface WebinarData {
  id: string
  slug: string
  title: string
  subtitle: string
  hostName: string
  hostTitle: string
  hostAvatar: string
  date: string
  time: string
  registeredCount: number
  platform: "YOUTUBE_LIVE" | "ZOOM_WEBINAR" | "HLS_EMBED"
  videoUrl: string
  isEvergreen: boolean
  status: "UPCOMING" | "LIVE_NOW" | "COMPLETED"
  pitchTriggerMinutes: number
  offerCoupon: string
  offerDiscountPct: number
  offerCourseTitle: string
  offerPrice: number
  offerListPrice: number
}

const MOCK_WEBINARS: Record<string, WebinarData> = {
  "saas-masterclass": {
    id: "web-302",
    slug: "saas-masterclass",
    title: "Build & Deploy Full-Stack Production SaaS Apps with Next.js 15 & Fastify",
    subtitle: "Learn enterprise microservice architecture, multi-tenant database design, automated billing, and live VPS deployment in 90 minutes.",
    hostName: "Prof. Stalin Kumar",
    hostTitle: "Founder & Lead Architect, Grekam Echo LMS",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    date: "2026-09-20",
    time: "06:00 PM IST",
    registeredCount: 2890,
    platform: "YOUTUBE_LIVE",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isEvergreen: true,
    status: "LIVE_NOW",
    pitchTriggerMinutes: 1, // Show pitch CTA after 1 minute for demo
    offerCoupon: "WEBINAR20",
    offerDiscountPct: 20,
    offerCourseTitle: "Full Stack SaaS Development Masterclass",
    offerPrice: 7999,
    offerListPrice: 12000
  },
  "upsc-strategy": {
    id: "web-301",
    slug: "upsc-strategy",
    title: "Cracking UPSC Prelims: 90-Day High-Impact Master Strategy",
    subtitle: "Proven framework to cover current affairs, GS static subjects, CSAT shortcuts, and mock test analytics.",
    hostName: "Raj Malhotra & Stalin Kumar",
    hostTitle: "Senior Civil Service Mentors",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    date: "2026-09-22",
    time: "07:00 PM IST",
    registeredCount: 1420,
    platform: "YOUTUBE_LIVE",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isEvergreen: false,
    status: "UPCOMING",
    pitchTriggerMinutes: 30,
    offerCoupon: "UPSC2026",
    offerDiscountPct: 25,
    offerCourseTitle: "UPSC Prelims & Mains Comprehensive Batch 2026",
    offerPrice: 14999,
    offerListPrice: 20000
  }
}

export default function PublicWebinarRoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug || "saas-masterclass"

  const webinar = MOCK_WEBINARS[slug] || MOCK_WEBINARS["saas-masterclass"]

  // Registration Form State
  const [isRegistered, setIsRegistered] = useState(false)
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)

  // Live Broadcast State
  const [liveViewers, setLiveViewers] = useState(webinar.registeredCount)
  const [watchSeconds, setWatchSeconds] = useState(0)
  const [showPitchOverlay, setShowPitchOverlay] = useState(false)

  // Q&A Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; name: string; message: string; time: string; isHost?: boolean }>>([
    { id: "c1", name: "Ananya S.", message: "Super excited for this masterclass session!", time: "06:01 PM" },
    { id: "c2", name: "Rajesh K.", message: "Will the recording and slides be shared afterwards?", time: "06:02 PM" },
    { id: "c3", name: "Prof. Stalin Kumar", message: "Yes! All registered students get lifetime access to course slides and source code.", time: "06:03 PM", isHost: true }
  ])
  const [newChatMessage, setNewChatMessage] = useState("")

  // Offer Checkout Modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(webinar.offerCoupon)
  const [isEnrolling, setIsEnrolling] = useState(false)

  // Simulating live viewers fluctuate & timer for pitch overlay
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setLiveViewers(prev => prev + Math.floor(Math.random() * 5) - 2)
    }, 4000)

    const timer = setInterval(() => {
      setWatchSeconds(prev => {
        const next = prev + 1
        // Trigger Pitch CTA Popup when watch time reaches configured threshold
        if (next >= webinar.pitchTriggerMinutes * 60 && !showPitchOverlay) {
          setShowPitchOverlay(true)
          toast.success("🔥 Special Webinar Discount Unlocked! Check the live offer banner.")
        }
        return next
      })
    }, 1000)

    return () => {
      clearInterval(viewerInterval)
      clearInterval(timer)
    }
  }, [webinar.pitchTriggerMinutes, showPitchOverlay])

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName || !regEmail || !regPhone) {
      toast.error("Please fill in your name, email and 10-digit mobile number")
      return
    }
    setIsRegistering(true)
    setTimeout(() => {
      setIsRegistering(false)
      setIsRegistered(true)
      toast.success("Webinar registration successful! Join details sent via WhatsApp & Email.")
    }, 700)
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChatMessage.trim()) return
    const newMsg = {
      id: `chat_${Date.now()}`,
      name: regName || "Student (You)",
      message: newChatMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setChatMessages(prev => [...prev, newMsg])
    setNewChatMessage("")
  }

  const handleClaimOffer = () => {
    setIsCheckoutOpen(true)
  }

  const handleCompleteEnrollment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEnrolling(true)
    setTimeout(() => {
      setIsEnrolling(false)
      setIsCheckoutOpen(false)
      toast.success("Congratulations! You have successfully enrolled in the course with Webinar Discount!")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-teal-500 selection:text-white">
      
      {/* 1. TOP BRAND HEADER */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/echo_logo.png" alt="echo logo" className="w-8 h-8 object-contain" />
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-tight text-white lowercase">echo</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-black uppercase tracking-wider">
              Webinar & Funnel Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {webinar.status === "LIVE_NOW" && (
            <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 text-xs font-bold flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> LIVE BROADCAST
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-bold text-white">{liveViewers.toLocaleString()}</span> Attendees Online
          </div>
        </div>
      </header>

      {/* 2. REGISTRATION GATEWAY (If student not registered) */}
      {!isRegistered ? (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Webinar Pitch Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold font-mono">
                <Gift className="w-3.5 h-3.5" /> Free Live Interactive Masterclass
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                {webinar.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {webinar.subtitle}
              </p>

              {/* Schedule Info Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Date</span>
                    <span className="text-xs font-bold text-white">{webinar.date}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Time</span>
                    <span className="text-xs font-bold text-white">{webinar.time}</span>
                  </div>
                </div>
              </div>

              {/* Host Profile */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
                <img src={webinar.hostAvatar} alt={webinar.hostName} className="w-12 h-12 rounded-xl object-cover border border-teal-500/30 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">{webinar.hostName}</h4>
                  <p className="text-xs text-slate-400">{webinar.hostTitle}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Registration Form Card */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-white">Reserve Your Free Seat</h3>
                <p className="text-xs text-slate-400">Join {webinar.registeredCount.toLocaleString()}+ students registered for this batch.</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name" 
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="student@gmail.com" 
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">WhatsApp Mobile Number *</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="10-digit mobile number" 
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 font-mono" 
                  />
                  <span className="text-[10px] text-teal-400/80 mt-1 block">📲 Instant 1-tap join link dispatched to your WhatsApp!</span>
                </div>

                <button 
                  type="submit" 
                  disabled={isRegistering}
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
                >
                  {isRegistering ? "Registering Seat..." : "Confirm Free Registration & Join →"}
                </button>
              </form>
            </div>

          </div>
        </div>
      ) : (
        /* 3. LIVE BROADCAST WEBINAR ROOM (When Student is Registered) */
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Main Video Broadcast Canvas & Pitch Overlay */}
          <div className="flex-1 bg-slate-950 p-4 sm:p-6 flex flex-col space-y-4 overflow-y-auto custom-scrollbar">
            
            {/* Live Video Canvas */}
            <div className="relative aspect-video w-full bg-black border border-slate-800 rounded-2xl overflow-hidden shadow-2xl group flex items-center justify-center">
              <iframe
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&modestbranding=1&rel=0"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* TIMED PITCH OVERLAY BANNER (Pops up at minute 45 or demo trigger) */}
              {showPitchOverlay && (
                <div className="absolute top-4 inset-x-4 z-30 bg-slate-900/95 border border-teal-500/50 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">{webinar.offerCourseTitle}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-black border border-amber-500/30">
                          {webinar.offerDiscountPct}% WEBINAR DISCOUNT
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">Use Coupon Code <strong className="text-teal-400 font-mono">{webinar.offerCoupon}</strong> for direct enrollment!</p>
                    </div>
                  </div>

                  <button 
                    onClick={handleClaimOffer}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-1.5"
                  >
                    Claim Offer ₹{webinar.offerPrice.toLocaleString()} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Webinar Details & Offer Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-white">{webinar.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Hosted by <strong className="text-slate-200">{webinar.hostName}</strong></p>
                </div>

                <button 
                  onClick={handleClaimOffer}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
                >
                  <DollarSign className="w-4 h-4" /> Enroll with Webinar Discount (₹{webinar.offerPrice})
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Live Chat & Attendees Q&A */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 h-96 lg:h-full">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2 font-mono">
                <MessageSquare className="w-4 h-4 text-teal-400" /> Live Chat & Q&A
              </h3>
              <span className="text-[10px] text-teal-400 font-bold font-mono">{liveViewers} Live</span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`p-3 rounded-xl border ${msg.isHost ? 'bg-teal-500/10 border-teal-500/30' : 'bg-slate-950/60 border-slate-800'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${msg.isHost ? 'text-teal-400' : 'text-slate-200'}`}>
                      {msg.name} {msg.isHost && "⭐ Host"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.time}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask a question..."
                value={newChatMessage}
                onChange={e => setNewChatMessage(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500" 
              />
              <button type="submit" className="p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition-all">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* 4. OFFER CHECKOUT MODAL WIDGET */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white">Enroll with Webinar Special Discount</h3>
                <p className="text-xs text-slate-400">{webinar.offerCourseTitle}</p>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Offer Coupon Code:</span>
                <span className="font-mono font-black text-teal-400 text-sm">{webinar.offerCoupon} ({webinar.offerDiscountPct}% OFF)</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 line-through text-xs block">₹{webinar.offerListPrice.toLocaleString()}</span>
                <span className="text-lg font-black text-emerald-400 font-mono">₹{webinar.offerPrice.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleCompleteEnrollment} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Full Name</label>
                <input required defaultValue={regName || "Stalin Kumar"} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Email Address</label>
                <input required type="email" defaultValue={regEmail || "student@grekam.in"} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Payment Method</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white">
                  <option value="RAZORPAY">Razorpay / UPI / Credit Card</option>
                  <option value="EMI">Echo 3-Month Interest-Free EMI (₹{Math.round(webinar.offerPrice / 3)}/mo)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isEnrolling}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isEnrolling ? "Processing Enrollment..." : `Pay ₹${webinar.offerPrice.toLocaleString()} & Access Course Now →`}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
