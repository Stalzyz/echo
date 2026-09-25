"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from  "framer-motion"
import { X, Workflow, MessageSquare, Mail, Send, CheckCircle2, Smartphone, Clock, Bell, ArrowRight, ToggleLeft, ToggleRight, FileText, ShieldCheck, Play } from  "lucide-react"
import { toast } from  "sonner"

export interface AutomationTrigger {
  id: string
  stage: string
  stageName: string
  channel: "WHATSAPP" | "EMAIL" | "BOTH"
  enabled: boolean
  delayMinutes: number
  templateTitle: string
  messageContent: string
  includePaymentLink?: boolean
  includeBrochure?: boolean
}

interface AutomationTriggersModalProps {
  isOpen: boolean
  onClose: () => void
}

const DEFAULT_TRIGGERS: AutomationTrigger[] = [
  {
    id: "trig_new_lead",
    stage: "NEW_LEAD",
    stageName: "New Lead Intake",
    channel: "WHATSAPP",
    enabled: true,
    delayMinutes: 0,
    templateTitle: "Instant Warm Welcome & Brochure",
    messageContent: "Hi {{student_name}}, thank you for your interest in {{course_name}} at Gecho Academy! 🎓 We have attached our official 2026 syllabus brochure. Our admissions counselor will connect shortly.",
    includeBrochure: true
  },
  {
    id: "trig_campus_visit",
    stage: "CAMPUS_VISIT",
    stageName: "Campus Visit Scheduled",
    channel: "BOTH",
    enabled: true,
    delayMinutes: 120,
    templateTitle: "Campus Visit Confirmation & Gate Pass",
    messageContent: "Hello {{student_name}}, your campus tour is confirmed for {{visit_date}}. View directions & show this digital pass at the entrance: {{campus_map_link}}",
    includeBrochure: false
  },
  {
    id: "trig_app_submitted",
    stage: "APPLICATION_SUBMITTED",
    stageName: "Application Submitted",
    channel: "EMAIL",
    enabled: true,
    delayMinutes: 0,
    templateTitle: "Application Review & Fee Token Link",
    messageContent: "Dear {{student_name}}, your application #{{app_id}} for {{course_name}} has been received! Please complete your registration fee of ₹{{token_amount}} here: {{payment_link}}",
    includePaymentLink: true
  },
  {
    id: "trig_enrolled",
    stage: "ENROLLED",
    stageName: "Student Enrolled",
    channel: "BOTH",
    enabled: true,
    delayMinutes: 0,
    templateTitle: "Onboarding Kit & Student Portal Access",
    messageContent: "🎉 Welcome to Gecho Academy, {{student_name}}! Your LMS Student Portal is ready. Login: {{student_email}} | Default Password: {{temp_password}}.",
    includeBrochure: false
  }
]

export function AutomationTriggersModal({ isOpen, onClose }: AutomationTriggersModalProps) {
  const [triggers, setTriggers] = useState<AutomationTrigger[]>(DEFAULT_TRIGGERS)
  const [activeTriggerId, setActiveTriggerId] = useState<string>(DEFAULT_TRIGGERS[0].id)
  const [isSimulating, setIsSimulating] = useState(false)
  const [testPhone, setTestPhone] = useState("+91 98765 43210")

  if (!isOpen) return null

  const activeTrigger = triggers.find(t => t.id === activeTriggerId) || triggers[0]

  const handleToggle = (id: string) => {
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t))
    toast.success("Trigger status updated")
  }

  const handleUpdateActive = (patch: Partial<AutomationTrigger>) => {
    setTriggers(prev => prev.map(t => t.id === activeTriggerId ? { ...t, ...patch } : t))
  }

  const handleTestDispatch = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      toast.success(`Test notification dispatched via ${activeTrigger.channel} to ${testPhone}!`)
    }, 900)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-xs">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Lead Automation & Communication Triggers
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-200 uppercase">
                  Active
                </span>
              </h2>
              <p className="text-xs text-slate-500">Automate real-time WhatsApp & Email messages when leads progress through stages.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Left Column: Trigger Stage List (4 cols) */}
          <div className="md:col-span-4 p-4 space-y-2 bg-slate-50/30">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Pipeline Workflows</span>
            
            <div className="space-y-1.5">
              {triggers.map(t => {
                const isActive = t.id === activeTriggerId
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTriggerId(t.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isActive 
                        ? "bg-white border-teal-500 shadow-xs" 
                        : "bg-white/60 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        t.channel === "WHATSAPP" ? "bg-emerald-50 text-emerald-600" :
                        t.channel === "EMAIL" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      }`}>
                        {t.channel === "WHATSAPP" ? <MessageSquare className="w-4 h-4" /> :
                         t.channel === "EMAIL" ? <Mail className="w-4 h-4" /> : <Workflow className="w-4 h-4" />}
                      </div>
                      <div className="truncate">
                        <p className={`text-xs font-bold truncate ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                          {t.stageName}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          {t.enabled ? (
                            <span className="text-emerald-700 font-medium">● Enabled</span>
                          ) : (
                            <span className="text-slate-400">○ Paused</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-teal-600 translate-x-0.5" : "text-slate-300"}`} />
                  </button>
                )
              })}
            </div>

            <div className="pt-4 px-2">
              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-teal-950 space-y-1 text-xs">
                <p className="font-bold flex items-center gap-1 text-teal-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Supported Variables
                </p>
                <p className="text-[11px] text-teal-800 leading-relaxed font-mono">
                  {"{{student_name}}, {{course_name}}, {{payment_link}}, {{campus_map_link}}"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Template & Action Editor (8 cols) */}
          <div className="md:col-span-8 p-6 space-y-6">
            
            {/* Top Config Row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{activeTrigger.stageName} Trigger</h3>
                <p className="text-xs text-slate-500">Configures immediate or delayed dispatches on stage entry.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggle(activeTrigger.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                    activeTrigger.enabled 
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {activeTrigger.enabled ? "Trigger Active" : "Trigger Paused"}
                </button>
              </div>
            </div>

            {/* Channels & Delay */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Dispatch Channel</label>
                <select
                  value={activeTrigger.channel}
                  onChange={(e: any) => handleUpdateActive({ channel: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                >
                  <option value="WHATSAPP">WhatsApp Official API</option>
                  <option value="EMAIL">Transactional Email (Resend/SendGrid)</option>
                  <option value="BOTH">Multi-Channel (WhatsApp + Email)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Dispatch Delay</label>
                <select
                  value={activeTrigger.delayMinutes}
                  onChange={(e) => handleUpdateActive({ delayMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                >
                  <option value={0}>Instant (0 mins upon stage drop)</option>
                  <option value={15}>15 Minutes After</option>
                  <option value={60}>1 Hour After</option>
                  <option value={120}>2 Hours Before Scheduled Event</option>
                </select>
              </div>
            </div>

            {/* Message Template Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Message Template</label>
                <span className="text-[11px] text-slate-400">WhatsApp HSM Approved Format</span>
              </div>
              <textarea
                rows={4}
                value={activeTrigger.messageContent}
                onChange={(e) => handleUpdateActive({ messageContent: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium leading-relaxed"
              />
            </div>

            {/* Additional Attachments / Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={!!activeTrigger.includeBrochure}
                  onChange={(e) => handleUpdateActive({ includeBrochure: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-800">Attach Course Syllabus PDF</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={!!activeTrigger.includePaymentLink}
                  onChange={(e) => handleUpdateActive({ includePaymentLink: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-800">Attach Razorpay Token Fee Link</span>
              </label>
            </div>

            {/* Live Test Dispatcher */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-800 block">Send Live Test Message</span>
                <span className="text-[11px] text-slate-500">Verify rendering with your test device.</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-500 w-36"
                />
                <button
                  type="button"
                  onClick={handleTestDispatch}
                  disabled={isSimulating}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSimulating ? "Sending..." : "Test Dispatch"}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-500">Changes take effect immediately across all active pipelines.</span>
          <button
            onClick={() => {
              toast.success("Automation workflows saved successfully!")
              onClose()
            }}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Save All Triggers
          </button>
        </div>

      </motion.div>
    </div>
  )
}
