"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Zap, Plus, Play, Pause, Trash2, ArrowDown, CheckCircle2, 
  MessageSquare, Mail, Award, Tag, Send, Layers, X, Loader2, Sparkles, Sliders
} from "lucide-react"
import { toast } from "sonner"

interface WorkflowRule {
  id: string
  name: string
  trigger: string
  condition: string
  action: string
  actionDetail: string
  isActive: boolean
  totalExecutions: number
  lastRunAt: string
}

const INITIAL_WORKFLOWS: WorkflowRule[] = [
  {
    id: "wf-1",
    name: "80% Progress WhatsApp Nudge",
    trigger: "Course Progress reaches 80%",
    condition: "Course == Full Stack Web Dev",
    action: "Send WhatsApp Message",
    actionDetail: "Template: 'Course Progress Nudge & Project Reminder'",
    isActive: true,
    totalExecutions: 480,
    lastRunAt: "2026-09-18 10:15"
  },
  {
    id: "wf-2",
    name: "Overdue Fee Payment Reminder",
    trigger: "Fee Installment Overdue (3 Days)",
    condition: "Payment Status == PENDING",
    action: "Send WhatsApp & Email",
    actionDetail: "Include direct Razorpay UPI payment link",
    isActive: true,
    totalExecutions: 142,
    lastRunAt: "2026-09-17 18:30"
  },
  {
    id: "wf-3",
    name: "Auto Certificate on Quiz Passing",
    trigger: "Final Quiz Passed (Score ≥ 80%)",
    condition: "Student Tag == Active Student",
    action: "Issue Verified Certificate",
    actionDetail: "Generate A4 PDF Certificate & email link",
    isActive: true,
    totalExecutions: 310,
    lastRunAt: "2026-09-18 09:45"
  },
  {
    id: "wf-4",
    name: "New Lead Auto-Followup",
    trigger: "New Lead Captured via Kiosk/Form",
    condition: "Lead Source == WEBSITE",
    action: "Move CRM Stage & Send WhatsApp",
    actionDetail: "Move to 'CONTACTED' & send welcome brochure",
    isActive: false,
    totalExecutions: 89,
    lastRunAt: "2026-09-12 14:20"
  }
]

export default function AutomationEnginePage() {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>(INITIAL_WORKFLOWS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: "",
    trigger: "Course Progress reaches 80%",
    condition: "All Active Students",
    action: "Send WhatsApp Message",
    actionDetail: "Template: 'Course Nudge'",
  })

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === id) {
        const next = !w.isActive
        toast.success(`Workflow "${w.name}" is now ${next ? 'ACTIVE' : 'PAUSED'}`)
        return { ...w, isActive: next }
      }
      return w
    }))
  }

  const deleteWorkflow = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete automation rule "${name}"?`)) {
      setWorkflows(prev => prev.filter(w => w.id !== id))
      toast.success(`Workflow "${name}" deleted.`)
    }
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      const newWf: WorkflowRule = {
        id: `wf-${Date.now()}`,
        name: form.name,
        trigger: form.trigger,
        condition: form.condition,
        action: form.action,
        actionDetail: form.actionDetail,
        isActive: true,
        totalExecutions: 0,
        lastRunAt: "Just now"
      }
      setWorkflows([newWf, ...workflows])
      setIsSubmitting(false)
      setIsModalOpen(false)
      toast.success(`Automation workflow "${form.name}" created and activated!`)
      setForm({ name: "", trigger: "Course Progress reaches 80%", condition: "All Active Students", action: "Send WhatsApp Message", actionDetail: "Template: 'Course Nudge'" })
    }, 600)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200 flex items-center gap-1">
              <Zap className="w-3 h-3 text-teal-600 fill-teal-600" /> GECHO OS AUTOMATION ENGINE
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Visual Workflow Automations</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Automate student retention, WhatsApp nudges, fee reminders, and certificate issuance with Trigger → Condition → Action rules.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/academy/automation/email"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-5 py-3 rounded-xl transition-all border border-slate-200"
          >
            <Mail className="w-4 h-4 text-teal-600" /> Email Notification Triggers
          </Link>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm shadow-teal-600/20"
          >
            <Plus className="w-4 h-4" /> Create Visual Workflow
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Active Workflow Rules</span>
          <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
            {workflows.filter(w => w.isActive).length} / {workflows.length}
          </div>
          <span className="text-xs text-teal-700 font-bold mt-1 block">Live execution pipeline active</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Actions Triggered</span>
          <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
            {workflows.reduce((a, b) => a + b.totalExecutions, 0).toLocaleString()}
          </div>
          <span className="text-xs text-emerald-700 font-bold mt-1 block">+24% automated student retention</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Primary Channel</span>
          <div className="text-3xl font-black text-teal-700 mt-2 font-mono">WhatsApp API</div>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">Meta verified delivery logs</span>
        </div>
      </div>

      {/* Visual Workflow Cards List */}
      <div className="space-y-6">
        {workflows.map(wf => (
          <div key={wf.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:border-teal-300 transition-all">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-xs ${wf.isActive ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{wf.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                    <span>Executions: <strong>{wf.totalExecutions}</strong></span>
                    <span>•</span>
                    <span>Last run: {wf.lastRunAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleWorkflow(wf.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    wf.isActive 
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100" 
                      : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {wf.isActive ? <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
                  {wf.isActive ? "ACTIVE" : "PAUSED"}
                </button>

                <button 
                  onClick={() => deleteWorkflow(wf.id, wf.name)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Trigger -> Condition -> Action Node Graph */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              
              {/* Trigger Node */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                  1. TRIGGER
                </span>
                <div className="font-bold text-sm text-slate-900 mt-2">{wf.trigger}</div>
              </div>

              {/* Condition Node */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
                  2. CONDITION
                </span>
                <div className="font-bold text-sm text-slate-900 mt-2">{wf.condition}</div>
              </div>

              {/* Action Node */}
              <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 relative">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded border border-teal-200">
                  3. ACTION
                </span>
                <div className="font-bold text-sm text-teal-900 mt-2">{wf.action}</div>
                <div className="text-xs text-teal-700 font-medium mt-1">{wf.actionDetail}</div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Workflow */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-8 shadow-xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">Build Visual Automation Rule</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Automation Workflow Name *</label>
                <input required placeholder="e.g. 80% Progress WhatsApp Nudge" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">1. Select Trigger Event *</label>
                <select value={form.trigger} onChange={e => setForm(p => ({ ...p, trigger: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold">
                  <option value="Course Progress reaches 80%">Course Progress reaches 80%</option>
                  <option value="Student Enrolls in Course">Student Enrolls in Course</option>
                  <option value="Fee Installment Overdue (3 Days)">Fee Installment Overdue (3 Days)</option>
                  <option value="Final Quiz Passed (Score ≥ 80%)">Final Quiz Passed (Score ≥ 80%)</option>
                  <option value="New Lead Captured via Kiosk/Form">New Lead Captured via Kiosk/Form</option>
                  <option value="Student Inactive for 7 Consecutive Days">Student Inactive for 7 Consecutive Days</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sky-700 block mb-1">2. Target Condition *</label>
                <input required placeholder="e.g. Course == Full Stack Web Dev OR All Students" value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium" />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-teal-800 block">3. Automated Action *</label>
                <select value={form.action} onChange={e => setForm(p => ({ ...p, action: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold">
                  <option value="Send WhatsApp Message">Send WhatsApp Message (Meta Template)</option>
                  <option value="Send Email Notification">Send Email Notification (Resend SMTP)</option>
                  <option value="Issue Verified Certificate">Issue Verified PDF Certificate</option>
                  <option value="Move CRM Pipeline Stage">Move CRM Pipeline Stage</option>
                  <option value="Tag Student as High Performer">Tag Student as High Performer</option>
                  <option value="Trigger Custom External Webhook">Trigger Custom External Webhook</option>
                </select>

                <input required placeholder="Action Config Details (e.g. Template: 'Course Nudge')" value={form.actionDetail} onChange={e => setForm(p => ({ ...p, actionDetail: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Activate Workflow Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
