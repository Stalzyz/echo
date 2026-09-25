"use client"

import { useState } from  "react"
import { Play, Pause, Download, Trash2, Check, Copy, RefreshCw, Send, AlertTriangle, ShieldAlert, CheckCircle2, FileText, ArrowRight, UserCheck, MessageSquare, Mail, Mic, Activity, Headphones } from  "lucide-react"

interface CallIntelligenceModalProps {
  isOpen: boolean
  onClose: () => void
  callRecord: any
  onCrmSynced?: () => void
}

export function CallIntelligenceModal({ isOpen, onClose, callRecord, onCrmSynced }: CallIntelligenceModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [activeTab, setActiveTab] = useState<"INTEL" | "TRANSCRIPT" | "FOLLOWUP">("INTEL")
  const [copiedType, setCopiedType] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState(false)

  if (!isOpen || !callRecord) return null

  const intel = callRecord.intelligence || {}
  const lead = callRecord.lead || {}
  const counsellor = callRecord.counsellor || {}

  const score = intel.score || 75
  const temperature = intel.temperature || "WARM"
  const intent = intel.intent || "HIGH_INTENT_ADMISSION"
  const summary = intel.summary || "Student inquired about UI/UX weekend course, batch timings, and placement support."

  const requirements = intel.requirements || {
    course: lead.courseInterest || "UI/UX Masterclass",
    preferredBatch: "Weekend Batch",
    learningMode: "Campus / Onsite",
    estimatedBudget: "₹25,000 - ₹35,000"
  }

  const objections = (intel.objections as string[]) || ["Fee Structure & Payment Schedule", "Class Timing & Weekend Availability"]
  const questionsAsked = (intel.questionsAsked as string[]) || [
    "Is internship & live project work included?",
    "What placement assistance is provided?",
    "Can I attend weekend classes?"
  ]
  const scoreBreakdown = (intel.scoreBreakdown as any[]) || [
    { signal: "Asked about fee & payment options", detected: true, weight: 15 },
    { signal: "Asked about batch start date", detected: true, weight: 20 },
    { signal: "Asked about placement support", detected: true, weight: 15 },
    { signal: "Requested callback / brochure", detected: true, weight: 15 }
  ]
  const feedback = intel.counsellorFeedback || {
    wentWell: ["Explained course curriculum clearly", "Answered duration queries"],
    missedOpportunities: ["Did not ask current experience", "Did not explain EMI options"]
  }
  const risks = (intel.missedOpportunityRisks as string[]) || ["Lead asked about joining date but no callback was scheduled"]
  const followup = intel.suggestedFollowup || {
    whatsappDraft: `Hi ${lead.name || 'Student'}! As discussed during our call, here is the syllabus and weekend batch schedule. Let me know if you'd like me to help with registration!`,
    emailDraft: `Dear ${lead.name || 'Student'},\n\nThank you for taking our call today regarding the ${requirements.course}. Attachment includes course brochure and fee structure.\n\nBest regards,\nAdmissions Team`
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 2000)
  }

  const handleSyncToCrm = async () => {
    try {
      setIsSyncing(true)
      const res = await fetch(`/api/v1/calls/${callRecord.id}/sync-crm`, { method: "POST" })
      if (res.ok) {
        setSyncSuccess(true)
        if (onCrmSynced) onCrmSynced()
        setTimeout(() => setSyncSuccess(false), 3000)
      }
    } catch (err) {
      console.error("Failed to sync CRM:", err)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Title Bar */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest font-mono">Call Intelligence</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  temperature === "HOT" ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                }`}>
                  {temperature === "HOT" ? "Priority Lead" : "Warm Lead"}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white">Call with {lead.name || "Student"}</h2>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Audio Recording Player Card */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 text-white shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div>
              <div className="text-xs font-bold text-slate-200">
                {callRecord.durationSeconds ? `${Math.floor(callRecord.durationSeconds / 60)}:${(callRecord.durationSeconds % 60).toString().padStart(2, '0')} min` : "08:42 min"}
              </div>
              <div className="text-[10px] text-slate-400">
                Counsellor: {counsellor.firstName ? `${counsellor.firstName} ${counsellor.lastName || ''}` : "Priya"} • {new Date(callRecord.startedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Waveform Visualization Mock */}
          <div className="flex-1 max-w-md h-8 flex items-center gap-1 px-4 bg-slate-900/60 rounded-xl">
            {Array.from({ length: 32 }).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-full transition-all ${i < 12 ? 'bg-teal-400' : 'bg-slate-700'}`}
                style={{ height: `${Math.max(20, (Math.sin(i * 0.8) + 1.2) * 40)}%` }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPlaybackSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1)}
              className="px-2.5 py-1 rounded-lg bg-slate-700 text-[11px] font-bold text-slate-200 hover:bg-slate-600 font-mono"
            >
              {playbackSpeed}x
            </button>
            <a 
              href={callRecord.recordingUrl || "#"} 
              download 
              className="p-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
              title="Download Recording"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 shrink-0">
          <button
            onClick={() => setActiveTab("INTEL")}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "INTEL" ? "border-teal-600 text-teal-800" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Activity className="w-4 h-4" /> Call Analysis
          </button>
          <button
            onClick={() => setActiveTab("TRANSCRIPT")}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "TRANSCRIPT" ? "border-teal-600 text-teal-800" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" /> Diarized Transcript
          </button>
          <button
            onClick={() => setActiveTab("FOLLOWUP")}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "FOLLOWUP" ? "border-teal-600 text-teal-800" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Follow-up & CRM Sync
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

          {/* TAB 1: AI INTEL */}
          {activeTab === "INTEL" && (
            <div className="space-y-6">

              {/* Top Cards: Summary + Lead Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-5 bg-teal-50/60 border border-teal-200/80 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Call Summary
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">{summary}</p>
                </div>

                <div className="p-5 bg-slate-900 text-white rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lead Score</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-[10px] font-black uppercase">
                      {intent.replace("_", " ")}
                    </span>
                  </div>
                  <div className="my-2 flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{score}</span>
                    <span className="text-sm font-bold text-slate-400">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: `${score}%` }} />
                  </div>
                </div>
              </div>

              {/* Lead Score Detection Signals */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  🎯 Lead Score Signal Rationale
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scoreBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                      <span className="text-slate-700 font-semibold">{item.signal}</span>
                      {item.detected ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                          <Check className="w-3 h-3" /> +{item.weight} pts
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Not detected</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements & Objections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    📌 Detected Requirements
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Course:</span>
                      <span className="font-bold text-slate-900">{requirements.course}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Batch Preference:</span>
                      <span className="font-bold text-slate-900">{requirements.preferredBatch}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Learning Mode:</span>
                      <span className="font-bold text-slate-900">{requirements.learningMode}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
                    ⚠️ Detected Objections
                  </h4>
                  <ul className="space-y-1.5">
                    {objections.map((obj, i) => (
                      <li key={i} className="text-xs font-semibold text-amber-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Counsellor Training Coaching Analysis */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-600" /> Counsellor Performance Analysis (Priya)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                    <span className="font-extrabold text-emerald-900 block">✅ What Went Well</span>
                    {feedback.wentWell?.map((w: string, i: number) => (
                      <p key={i} className="text-emerald-800 font-medium">• {w}</p>
                    ))}
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                    <span className="font-extrabold text-rose-900 block">⚠️ Missed Opportunities</span>
                    {feedback.missedOpportunities?.map((m: string, i: number) => (
                      <p key={i} className="text-rose-800 font-medium">• {m}</p>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DIARIZED TRANSCRIPT */}
          {activeTab === "TRANSCRIPT" && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 font-mono flex items-center justify-between">
                <span>Diarized Speech-to-Text Transcription</span>
                <span>Language: English (India)</span>
              </div>
              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-2xl space-y-1">
                  <span className="font-extrabold text-teal-900 block">Counsellor (Priya) • 00:05</span>
                  <p className="text-slate-800">Hello Arjun! Good morning, this is Priya calling from Echo LMS. I saw your inquiry for our UI/UX Design program. Is this a good time to speak?</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="font-extrabold text-slate-900 block">{lead.name || "Arjun"} (Student) • 00:18</span>
                  <p className="text-slate-800">Hi Priya, yes! I'm currently working as a graphic designer and looking to transition into UI/UX. Can you share the weekend batch timings and fee structure?</p>
                </div>

                <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-2xl space-y-1">
                  <span className="font-extrabold text-teal-900 block">Counsellor (Priya) • 00:45</span>
                  <p className="text-slate-800">Our weekend batch runs Saturdays and Sundays from 10:00 AM to 1:00 PM over 12 weeks. It includes live project work and placement assistance.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="font-extrabold text-slate-900 block">{lead.name || "Arjun"} (Student) • 01:20</span>
                  <p className="text-slate-800">That sounds great! Is placement support guaranteed and can I pay the fee in installments?</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FOLLOWUP & CRM SYNC */}
          {activeTab === "FOLLOWUP" && (
            <div className="space-y-6">

              {/* WhatsApp Draft */}
              <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-700" /> Recommended WhatsApp Draft
                  </span>
                  <button
                    onClick={() => handleCopy(followup.whatsappDraft, "WA")}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-white border border-emerald-300 px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    {copiedType === "WA" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === "WA" ? "Copied!" : "Copy WhatsApp"}</span>
                  </button>
                </div>
                <p className="p-3 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800 whitespace-pre-wrap font-sans">
                  {followup.whatsappDraft}
                </p>
              </div>

              {/* Email Draft */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-700" /> Recommended Email Follow-up Draft
                  </span>
                  <button
                    onClick={() => handleCopy(followup.emailDraft, "EMAIL")}
                    className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-300 px-3 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {copiedType === "EMAIL" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === "EMAIL" ? "Copied!" : "Copy Email"}</span>
                  </button>
                </div>
                <p className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 whitespace-pre-wrap font-mono">
                  {followup.emailDraft}
                </p>
              </div>

              {/* 1-Click Sync to CRM Action */}
              <div className="p-6 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-extrabold text-white">1-Click Auto CRM Field Update</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Updates Lead Status to <strong className="text-teal-400">INTERESTED</strong>, Lead Score to <strong className="text-teal-400">{score}/100</strong>, and logs activity in CRM.
                  </p>
                </div>
                <button
                  disabled={isSyncing || syncSuccess}
                  onClick={handleSyncToCrm}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-all shadow-md disabled:opacity-50 shrink-0"
                >
                  {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : syncSuccess ? <Check className="w-4 h-4 text-emerald-950" /> : <ArrowRight className="w-4 h-4" />}
                  <span>{syncSuccess ? "Synced to CRM!" : "Sync Call Intel to CRM"}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}
