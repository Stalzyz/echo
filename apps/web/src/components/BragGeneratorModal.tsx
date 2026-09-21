"use client"

import { useState, useEffect } from "react"
import { X, Play, Pause, Copy, Share2, Sparkles, Check, Download, Video, Smartphone, Monitor, MessageSquare, ExternalLink, Volume2, ShieldCheck, Flame, Globe } from "lucide-react"
import { toast } from "sonner"

export interface BragData {
  type: "COURSE" | "CERTIFICATE" | "PROJECT"
  title: string
  subtitle?: string
  authorOrAcademy?: string
  priceOrId?: string
  highlights?: string[]
  linkUrl?: string
}

interface BragGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  data: BragData
}

export function BragGeneratorModal({ isOpen, onClose, data }: BragGeneratorModalProps) {
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9")
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<"linkedin" | "twitter" | "whatsapp">("linkedin")
  const [copiedTab, setCopiedTab] = useState<string | null>(null)

  // Simulation timer for video frame playback
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 2))
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isOpen, isPlaying])

  if (!isOpen) return null

  const isCourse = data.type === "COURSE"
  const academyName = data.authorOrAcademy || "echo Academy"
  const targetLink = data.linkUrl || "https://echo.grekam.in"

  // Generated copy strings
  const copyTemplates = {
    linkedin: isCourse
      ? `🚀 EXCITED TO ANNOUNCE: "${data.title}" is officially live on ${academyName}!\n\nIf you're looking to master ${data.highlights?.[0] || "modern skills"} and level up your career with interactive projects and live sessions, this course is built for you.\n\n✨ Key Highlights:\n• ${data.highlights?.join("\n• ") || "Full curriculum access & live mentorship"}\n• Certificate of completion & job assistance\n\n👉 Enroll now: ${targetLink}\n\n#Learning #TechEducation #CourseLaunch #${academyName.replace(/\s+/g, '')} #echoLMS`
      : `🎓 MILESTONE ACHIEVED: I just earned my official verified certificate in "${data.title}" from ${academyName}!\n\nSpecial thanks to the instructors for hands-on mentorship and project-based learning.\n\n🔍 Verify Credential: ${targetLink}\n\n#Certificate #CareerGrowth #SkillUp #${academyName.replace(/\s+/g, '')} #echoLMS`,

    twitter: isCourse
      ? `🔥 Just launched! "${data.title}" is now open for enrollment on ${academyName}.\n\nWhat you'll learn:\n1. ${data.highlights?.[0] || "Hands-on projects"}\n2. ${data.highlights?.[1] || "Industry best practices"}\n3. ${data.highlights?.[2] || "Verified Certification"}\n\n👇 Claim your spot today:\n${targetLink} 🧵 (1/3)`
      : `🎉 Proud to share that I just completed "${data.title}" at ${academyName}!\n\nLearned tons of practical skills & built real-world projects.\n\nVerify certificate here 👇\n${targetLink}`,

    whatsapp: isCourse
      ? `*📢 NEW COURSE LAUNCH: ${data.title}*\n\nHey everyone! We're excited to announce our brand new course at *${academyName}*.\n\n💡 *What you get:*\n- ${data.highlights?.join("\n- ") || "Full video access + Live Q&A"}\n- Interactive Quizzes & Projects\n- Verified Industry Certificate\n\n👉 Join today: ${targetLink}`
      : `*🎓 Achievement Unlocked!*\nI just earned my official certificate in *${data.title}* from *${academyName}*!\n\nCheck out my verified badge & certificate: ${targetLink}`
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTab(type)
    toast.success(`${type.toUpperCase()} launch copy copied to clipboard!`)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  const handleSocialShare = (platform: "linkedin" | "twitter" | "whatsapp") => {
    const text = encodeURIComponent(copyTemplates[platform])
    const url = encodeURIComponent(targetLink)

    let shareUrl = ""
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}`
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    } else if (platform === "whatsapp") {
      shareUrl = `https://api.whatsapp.com/send?text=${text}`
    }
    window.open(shareUrl, "_blank")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col my-auto text-white">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-white">echo Brag Generator</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                  1-Click Video & Social Brief
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Turn your {isCourse ? "course launch" : "verified certificate"} into an animated video frame & social campaign.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          
          {/* Left Column: Animated Video Canvas Preview */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Aspect Ratio Switcher */}
            <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 px-3 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-purple-400" /> Format:
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAspectRatio("16:9")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    aspectRatio === "16:9"
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> 16:9 Landscape (LinkedIn/X)
                </button>
                <button
                  onClick={() => setAspectRatio("9:16")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    aspectRatio === "9:16"
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> 9:16 Vertical (Reels/Status)
                </button>
              </div>
            </div>

            {/* Simulated Animated Video Canvas Container */}
            <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4 min-h-[340px]">
              
              {/* Outer Card Aspect Box */}
              <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 border border-purple-500/30 shadow-2xl transition-all duration-300 flex flex-col justify-between p-6 ${
                  aspectRatio === "16:9" ? "w-full aspect-[16/9]" : "w-[240px] aspect-[9/16] py-8"
                }`}
              >
                {/* Glowing Background Blur Effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none animate-pulse" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold text-purple-300 font-mono">
                    <Flame className="w-3 h-3 text-amber-400 animate-bounce" />
                    {isCourse ? "NEW LAUNCH" : "VERIFIED CREDENTIAL"}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">
                    echo LMS
                  </span>
                </div>

                {/* Middle Content Banner */}
                <div className="relative z-10 my-auto text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 mb-1">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-white text-base md:text-lg leading-tight line-clamp-2 drop-shadow-md">
                    {data.title}
                  </h3>
                  <p className="text-xs text-purple-300/80 font-medium">
                    {academyName}
                  </p>

                  {/* Dynamic Highlights / Badges */}
                  {data.highlights && data.highlights.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                      {data.highlights.slice(0, 2).map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-white/10 backdrop-blur-md text-white text-[9px] font-semibold px-2 py-0.5 rounded-md border border-white/10"
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Bar inside Card */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 block font-mono">VERIFIED AT</span>
                    <span className="text-[10px] font-bold text-teal-400 font-mono">echo.grekam.in</span>
                  </div>
                  <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[9px] font-bold font-mono">
                    QR
                  </div>
                </div>

                {/* Progress bar overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Playback Overlay Controls */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <div className="flex items-center gap-0.5 text-purple-400">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span className="text-[10px] font-mono text-slate-400">Audio Preview</span>
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toast.success("Animated video card downloaded successfully! (.mp4 / frame preview)")}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl border border-slate-700 transition-colors text-xs"
              >
                <Download className="w-4 h-4 text-purple-400" /> Download Video Frame
              </button>
            </div>
          </div>

          {/* Right Column: AI Launch Copy Generator */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col h-full">
              
              {/* Copy Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab("linkedin")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === "linkedin"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" /> LinkedIn
                  </button>
                  <button
                    onClick={() => setActiveTab("twitter")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === "twitter"
                        ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5" /> X / Twitter
                  </button>
                  <button
                    onClick={() => setActiveTab("whatsapp")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === "whatsapp"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                  </button>
                </div>

                <button
                  onClick={() => handleCopy(copyTemplates[activeTab], activeTab)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 px-3 py-1.5 rounded-xl border border-purple-500/20 transition-colors"
                >
                  {copiedTab === activeTab ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedTab === activeTab ? "Copied!" : "Copy Copy"}
                </button>
              </div>

              {/* Textarea Copy Box */}
              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[220px]">
                {copyTemplates[activeTab]}
              </div>

              {/* Direct Social Share Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Instant Launch:</span>
                <button
                  onClick={() => handleSocialShare(activeTab)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
                >
                  <Share2 className="w-4 h-4" /> Share on {activeTab.toUpperCase()}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
