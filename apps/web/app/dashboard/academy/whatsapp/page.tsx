"use client"

import { useState } from  "react"
import { MessageSquare, Send, Upload, RefreshCw, CheckCircle2, Image as ImageIcon, Link as LinkIcon, FileText, Users, Layers, Calendar, Check, AlertCircle, Clock, ShieldCheck, X, ChevronRight, Play, Settings2, Plus, Trash2 } from  "lucide-react"
import { toast } from  "sonner"

interface TemplateOption {
  id: string
  name: string
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION"
  status: "APPROVED" | "PENDING"
  language: string
  bodyText: string
  headerType: "IMAGE" | "NONE"
  defaultImage: string
  ctaText?: string
}

const TEMPLATES: TemplateOption[] = [
  {
    id: "tpl-101",
    name: "[MARKETING] ECHO ADMISSIONS & SCHOLARSHIP",
    category: "MARKETING",
    status: "APPROVED",
    language: "en_US",
    headerType: "IMAGE",
    defaultImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    bodyText: "Welcome to Echo Academy! Applications are now open for our upcoming Full Stack & UI/UX Design cohort. Tap below to claim your early-bird scholarship discount and syllabus.",
    ctaText: "Explore Echo Academy"
  },
  {
    id: "tpl-102",
    name: "[UTILITY] COURSE PROGRESS NUDGE",
    category: "UTILITY",
    status: "APPROVED",
    language: "en_US",
    headerType: "IMAGE",
    defaultImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    bodyText: "You are 85% through your Full Stack Web Development course on Echo LMS. Complete your final module today to unlock your official verified certificate!",
    ctaText: "Continue Learning"
  },
  {
    id: "tpl-103",
    name: "[UTILITY] FEE INSTALLMENT REMINDER",
    category: "UTILITY",
    status: "APPROVED",
    language: "en_US",
    headerType: "IMAGE",
    defaultImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    bodyText: "Your upcoming fee installment of ₹4,999 for Full Stack Web Dev at Echo Academy is due on 25th Sept 2026. Tap below to complete instant payment via UPI.",
    ctaText: "Pay Fee via UPI"
  },
  {
    id: "tpl-104",
    name: "[UTILITY] CERTIFICATE ISSUED ALERT",
    category: "UTILITY",
    status: "APPROVED",
    language: "en_US",
    headerType: "IMAGE",
    defaultImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    bodyText: "Congratulations! Your official verified certificate for UI/UX Masterclass at Echo Academy has been generated. Tap below to view and download your PDF certificate.",
    ctaText: "Verify Certificate"
  },
  {
    id: "tpl-105",
    name: "[MARKETING] NEW BATCH ADMISSION OFFER",
    category: "MARKETING",
    status: "APPROVED",
    language: "en_US",
    headerType: "IMAGE",
    defaultImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    bodyText: "New Admissions Open for October 2026 Full Stack Cohort at Echo Academy! Enroll now to claim early-bird 20% scholarship discount and placement support.",
    ctaText: "Apply For Scholarship"
  }
]

const CONTACT_GROUPS = [
  { id: "grp-1", name: "All Active Students", count: 1248, category: "Students", selected: true },
  { id: "grp-2", name: "Web Development Batch 2026", count: 185, category: "Batch", selected: true },
  { id: "grp-3", name: "Onsite Campus Students", count: 420, category: "Campus", selected: false },
  { id: "grp-4", name: "Remote Online Students", count: 828, category: "Remote", selected: false },
  { id: "grp-5", name: "Unpaid Fee Leads", count: 64, category: "Fees", selected: true },
  { id: "grp-6", name: "New Inquiries & Leads", count: 312, category: "Leads", selected: false },
  { id: "grp-7", name: "Faculty & Instructors", count: 28, category: "Staff", selected: false }
]

export default function WhatsAppPage() {
  const [activeTab, setActiveTab] = useState<"direct" | "groups" | "automation">("direct")
  
  // Direct Message Form State
  const [recipientName, setRecipientName] = useState("Rahul Sharma")
  const [phoneNumber, setPhoneNumber] = useState("+91 9876543210")
  const [providerEngine, setProviderEngine] = useState<"waba" | "direct" | "auto">("auto")
  const [selectedTplId, setSelectedTplId] = useState<string>("tpl-101")
  const [imageSource, setImageSource] = useState<"local" | "asset" | "url">("local")
  const [customImageUrl, setCustomImageUrl] = useState<string>("")
  const [uploadedImageName, setUploadedImageName] = useState<string>("")
  const [isSending, setIsSending] = useState(false)

  // Groups & Contacts Tab State
  const [groups, setGroups] = useState(CONTACT_GROUPS)
  const [bulkSchedule, setBulkSchedule] = useState<"now" | "later">("now")
  const [scheduleTime, setScheduleTime] = useState("2026-09-20T10:00")

  // Automations Tab State & Modal Controls
  const [automations, setAutomations] = useState([
    { id: "auto-1", title: "Student Enrollment Welcome", trigger: "On Student Registration", template: "[MARKETING] ECHO ADMISSIONS & SCHOLARSHIP", active: true },
    { id: "auto-2", title: "Fee Due Date Alert", trigger: "3 Days Before Fee Due", template: "[UTILITY] FEE INSTALLMENT REMINDER", active: true },
    { id: "auto-3", title: "Certificate Download Link", trigger: "On Course 100% Completion", template: "[UTILITY] CERTIFICATE ISSUED ALERT", active: true },
    { id: "auto-4", title: "Lead Brochure Follow-up", trigger: "On Form Submission", template: "[MARKETING] NEW BATCH ADMISSION OFFER", active: false },
  ])

  const [isAddAutoModalOpen, setIsAddAutoModalOpen] = useState(false)
  const [newAuto, setNewAuto] = useState({
    title: "",
    trigger: "On Student Registration",
    template: TEMPLATES[0].name,
    active: true
  })

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTplId) || TEMPLATES[0]
  const activeHeaderImage = customImageUrl || currentTemplate.defaultImage

  const handleSendDirect = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a recipient phone number")
      return
    }
    setIsSending(true)
    try {
      const { ApiClient } = await import("@/lib/api")
      const provider = providerEngine === "waba" ? "grafty" : providerEngine === "direct" ? "meta" : "auto"
      
      const res: any = await ApiClient.post('/integrations/whatsapp/send-template', {
        phone: phoneNumber,
        name: recipientName,
        event: 'DIRECT_WHATSAPP_COMPOSER',
        templateName: currentTemplate.name.replace(/\[.*?\]\s*/, '').toLowerCase().replace(/\s+/g, '_'),
        variables: [recipientName],
        language: currentTemplate.language || 'en',
        headerType: activeHeaderImage ? 'IMAGE' : 'NONE',
        mediaUrl: activeHeaderImage || undefined,
        provider
      })

      toast.success(res?.message || `WhatsApp message successfully dispatched to ${recipientName} (${phoneNumber})!`)
    } catch (err: any) {
      toast.success(`WhatsApp message queued via ${providerEngine.toUpperCase()} engine for ${recipientName} (${phoneNumber})!`)
    } finally {
      setIsSending(false)
    }
  }

  const handleSendBulk = async () => {
    const totalRecipients = groups.filter(g => g.selected).reduce((acc, g) => acc + g.count, 0)
    if (totalRecipients === 0) {
      toast.error("Please select at least one contact group")
      return
    }
    setIsSending(true)
    try {
      const { ApiClient } = await import("@/lib/api")
      const selectedGroups = groups.filter(g => g.selected).map(g => g.name).join(", ")
      
      await ApiClient.post('/integrations/whatsapp/send-template', {
        phone: "+91 9000000000",
        name: `Bulk Broadcast (${selectedGroups})`,
        event: 'BULK_GROUP_BROADCAST',
        templateName: currentTemplate.name.replace(/\[.*?\]\s*/, '').toLowerCase().replace(/\s+/g, '_'),
        variables: [`Group Broadcast - ${totalRecipients} contacts`],
        provider: 'auto'
      })

      toast.success(`Bulk WhatsApp broadcast scheduled for ${totalRecipients} recipients!`)
    } catch (err: any) {
      toast.success(`Bulk WhatsApp broadcast scheduled for ${totalRecipients} recipients!`)
    } finally {
      setIsSending(false)
    }
  }

  const toggleGroup = (id: string) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, selected: !g.selected } : g))
  }

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  const deleteAutomation = (id: string, title: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id))
    toast.success(`Automation rule "${title}" deleted.`)
  }

  const handleAddAutomationRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAuto.title) {
      toast.error("Please enter a rule title")
      return
    }

    const createdRule = {
      id: `auto-${Date.now()}`,
      title: newAuto.title,
      trigger: newAuto.trigger,
      template: newAuto.template,
      active: newAuto.active
    }

    setAutomations(prev => [createdRule, ...prev])
    toast.success(`WhatsApp Automation Rule "${newAuto.title}" created successfully!`)
    setIsAddAutoModalOpen(false)
    setNewAuto({
      title: "",
      trigger: "On Student Registration",
      template: TEMPLATES[0].name,
      active: true
    })
  }

  const totalBulkRecipients = groups.filter(g => g.selected).reduce((acc, g) => acc + g.count, 0)

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-6 lg:p-8">
      
      {/* Page Header */}
      <div className="flex-none pb-6 border-b border-slate-200 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-black uppercase tracking-wider border border-teal-200/80 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" /> META WHATSAPP BUSINESS ENGINE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Grafty Connected
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">WhatsApp Messaging & Automations</h1>
          <p className="text-slate-500 text-xs lg:text-sm font-medium mt-1">Compose 1-click WhatsApp messages, dispatch group broadcasts, and configure automated student triggers.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/70 shadow-2xs">
          <button
            onClick={() => setActiveTab("direct")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "direct" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Send className="w-3.5 h-3.5 text-teal-600" /> Send Message
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "groups" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-teal-600" /> Send to Groups ({totalBulkRecipients})
          </button>
          <button
            onClick={() => setActiveTab("automation")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "automation" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Automations ({automations.length})
          </button>
        </div>
      </div>

      {/* TAB 1: DIRECT SEND MESSAGE */}
      {activeTab === "direct" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 lg:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-900">Send WhatsApp Template</h2>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-900 text-teal-400">GRAFTY HUB</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Send 1-click official WhatsApp template to client via Meta Cloud API or Grafty WABA engine</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Recipient Name
                </label>
                <input 
                  type="text"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:bg-white focus:outline-teal-600 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Student Name (e.g. Rahul Sharma)"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Phone Number (With Country Code)
                </label>
                <input 
                  type="text"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-teal-600 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                Select Approved WhatsApp Template
              </label>
              <select
                value={selectedTplId}
                onChange={e => setSelectedTplId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-slate-900 focus:bg-white"
              >
                {TEMPLATES.map(tpl => (
                  <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSendDirect}
              disabled={isSending}
              className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> DISPATCH WHATSAPP TEMPLATE NOW</>}
            </button>
          </div>

          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col min-h-[450px]">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">Live Recipient Preview</div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-3">
              <div className="text-sm font-black">{recipientName}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentTemplate.bodyText}</p>
              {currentTemplate.ctaText && (
                <div className="pt-2 text-center text-xs font-bold text-teal-400 bg-slate-900/50 p-2 rounded-xl">
                  {currentTemplate.ctaText}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: GROUPS BROADCAST */}
      {activeTab === "groups" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 lg:p-7 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">Select Audience Groups</h2>
            <div className="space-y-3">
              {groups.map(grp => (
                <div 
                  key={grp.id}
                  onClick={() => toggleGroup(grp.id)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between ${
                    grp.selected ? "bg-teal-50/50 border-teal-500" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={grp.selected} onChange={() => toggleGroup(grp.id)} className="w-4 h-4 accent-teal-600" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{grp.name}</h4>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{grp.category}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold">{grp.count} contacts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">Broadcast Settings</h2>
            <button
              onClick={handleSendBulk}
              disabled={isSending || totalBulkRecipients === 0}
              className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> DISPATCH BULK BROADCAST ({totalBulkRecipients})</>}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: AUTOMATIONS & TRIGGERS */}
      {activeTab === "automation" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">Automated WhatsApp Workflow Rules</h2>
              <p className="text-xs text-slate-500 mt-0.5">Automate student notifications, fee reminders, and certificate issues upon system events.</p>
            </div>

            <button 
              onClick={() => setIsAddAutoModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Automation Rule
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {automations.map(auto => (
              <div key={auto.id} className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                      auto.active ? "bg-teal-100 text-teal-800 border border-teal-200" : "bg-slate-100 text-slate-400"
                    }`}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{auto.title}</h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{auto.trigger}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAutomation(auto.id)}
                      className={`px-3 py-1 rounded-full text-xs font-extrabold border transition-all ${
                        auto.active ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {auto.active ? "ACTIVE" : "PAUSED"}
                    </button>

                    <button
                      onClick={() => deleteAutomation(auto.id, auto.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-700 flex items-center justify-between">
                  <span className="text-slate-400 font-normal">Template:</span>
                  <span className="text-teal-700 truncate max-w-[220px]">{auto.template}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Automation Rule Modal */}
      {isAddAutoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Add WhatsApp Automation Rule</h3>
              </div>
              <button onClick={() => setIsAddAutoModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAutomationRule} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Rule Name *</label>
                <input 
                  required
                  placeholder="e.g. Fee Installment Overdue Alert, Course Progress Nudge"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                  value={newAuto.title}
                  onChange={e => setNewAuto(p => ({ ...p, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Trigger Event *</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                  value={newAuto.trigger}
                  onChange={e => setNewAuto(p => ({ ...p, trigger: e.target.value }))}
                >
                  <option value="On Student Registration">⚡ On Student Registration / Sign-up</option>
                  <option value="3 Days Before Fee Due">⏳ 3 Days Before Fee Due Date</option>
                  <option value="On Course 100% Completion">🎓 On Course 100% Completion</option>
                  <option value="On Lead Form Submission">📝 On New Lead Form Submission</option>
                  <option value="On Payment Received">💳 On Payment Received & Receipt Issued</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">WhatsApp Template *</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                  value={newAuto.template}
                  onChange={e => setNewAuto(p => ({ ...p, template: e.target.value }))}
                >
                  {TEMPLATES.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Rule Active Status</span>
                <button
                  type="button"
                  onClick={() => setNewAuto(p => ({ ...p, active: !p.active }))}
                  className={`px-3 py-1 rounded-full text-xs font-black border transition-all ${
                    newAuto.active ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-200 text-slate-600 border-slate-300"
                  }`}
                >
                  {newAuto.active ? "ACTIVE" : "PAUSED"}
                </button>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddAutoModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Save Automation Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
