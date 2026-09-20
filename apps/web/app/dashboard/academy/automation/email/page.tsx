"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Mail, Send, Eye, Edit3, CheckCircle2, ShieldAlert, 
  Search, Filter, X, Save, RefreshCw, Copy, ExternalLink, Zap
} from "lucide-react"
import { toast } from "sonner"

interface EmailTemplate {
  id: string
  code: string
  name: string
  category: "Academy Lifecycle" | "Authentication & Security" | "Billing & Payments" | "System Warnings" | "Student Learning"
  subject: string
  triggerEvent: string
  recipientRole: "Academy Admin" | "User / Student" | "Super Admin" | "Parent"
  autoDispatch: boolean
  totalSent: number
  htmlBody: string
}

const MASTER_EMAIL_TEMPLATES: EmailTemplate[] = [
  // Category 1: Academy Lifecycle
  {
    id: "tpl-1",
    code: "ACADEMY_WELCOME",
    name: "Academy Onboarding & Credentials",
    category: "Academy Lifecycle",
    subject: "Welcome to Echo LMS — Provisioning Complete for {{academy_name}}",
    triggerEvent: "On provisioning new academy tenant",
    recipientRole: "Academy Admin",
    autoDispatch: true,
    totalSent: 24,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px;">
        <h2 style="color: #0d9488;">Welcome to Echo LMS, {{owner_name}}!</h2>
        <p>Your tenant academy <strong>{{academy_name}}</strong> has been provisioned successfully.</p>
        <div style="background: #f8fafc; padding: 16px; border-radius: 12px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Subdomain:</strong> {{subdomain}}</p>
          <p style="margin: 4px 0;"><strong>Admin Email:</strong> {{admin_email}}</p>
          <p style="margin: 4px 0;"><strong>Temporary Password:</strong> {{temp_password}}</p>
        </div>
        <a href="{{login_url}}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Login to Academy Dashboard</a>
      </div>
    `
  },
  {
    id: "tpl-2",
    code: "ACADEMY_DOMAIN_VERIFIED",
    name: "Custom CNAME DNS & SSL Activated",
    category: "Academy Lifecycle",
    subject: "Custom Domain {{custom_domain}} Active & SSL Secured",
    triggerEvent: "CNAME DNS verified & SSL issued",
    recipientRole: "Academy Admin",
    autoDispatch: true,
    totalSent: 18,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #059669;">Custom Domain Verified!</h2>
        <p>Your custom domain <strong>{{custom_domain}}</strong> is now active with Let's Encrypt SSL encryption.</p>
        <p>Students can now access your academy directly at <a href="https://{{custom_domain}}">https://{{custom_domain}}</a>.</p>
      </div>
    `
  },
  {
    id: "tpl-3",
    code: "ACADEMY_TRIAL_EXPIRING",
    name: "Free Trial Expiring Warning",
    category: "Academy Lifecycle",
    subject: "Action Required: 3 Days Left on Your Echo Free Trial",
    triggerEvent: "3 days before trial completion",
    recipientRole: "Academy Admin",
    autoDispatch: true,
    totalSent: 12,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #d97706;">Your Trial Expires Soon</h2>
        <p>Your 14-day free trial for <strong>{{academy_name}}</strong> ends in 3 days.</p>
        <p>Upgrade to a Growth or Enterprise plan to keep your courses and student enrollments active.</p>
        <a href="{{upgrade_url}}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Upgrade Plan Now</a>
      </div>
    `
  },

  // Category 2: Authentication & Security
  {
    id: "tpl-4",
    code: "SECURITY_NEW_DEVICE_LOGIN",
    name: "New Device / IP Security Alert",
    category: "Authentication & Security",
    subject: "Security Alert: New Login from {{ip_address}}",
    triggerEvent: "Login from unrecognized IP/device",
    recipientRole: "User / Student",
    autoDispatch: true,
    totalSent: 142,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #e11d48;">Security Alert: New Login Detected</h2>
        <p>We detected a new login to your account <strong>{{user_email}}</strong>.</p>
        <p><strong>Device:</strong> {{device_name}}<br><strong>IP Address:</strong> {{ip_address}}<br><strong>Timestamp:</strong> {{timestamp}}</p>
        <p>If this was not you, please reset your password immediately.</p>
      </div>
    `
  },
  {
    id: "tpl-5",
    code: "SECURITY_PASSWORD_RESET",
    name: "Password Reset Code & Link",
    category: "Authentication & Security",
    subject: "Echo Password Reset Verification Code: {{otp_code}}",
    triggerEvent: "User requests password reset",
    recipientRole: "User / Student",
    autoDispatch: true,
    totalSent: 98,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0d9488;">Reset Your Password</h2>
        <p>Your 6-digit verification code is:</p>
        <div style="font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 4px; color: #0d9488; margin: 16px 0;">{{otp_code}}</div>
        <p>This code expires in 15 minutes.</p>
      </div>
    `
  },
  {
    id: "tpl-6",
    code: "SECURITY_2FA_OTP",
    name: "Two-Factor Authentication OTP",
    category: "Authentication & Security",
    subject: "Your Echo 2FA Security Passcode is {{otp_code}}",
    triggerEvent: "2FA login challenge",
    recipientRole: "User / Student",
    autoDispatch: true,
    totalSent: 540,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0d9488;">2FA Authentication Code</h2>
        <p>Your one-time passcode is <strong>{{otp_code}}</strong>. Valid for 5 minutes.</p>
      </div>
    `
  },

  // Category 3: Billing & Payments
  {
    id: "tpl-7",
    code: "BILLING_PAYMENT_RECEIPT",
    name: "Payment Confirmation & Tax Invoice",
    category: "Billing & Payments",
    subject: "Payment Received: Tax Invoice {{invoice_number}}",
    triggerEvent: "Successful subscription / fee payment",
    recipientRole: "Academy Admin",
    autoDispatch: true,
    totalSent: 86,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #059669;">Payment Confirmed</h2>
        <p>Thank you! We received your payment of <strong>₹{{amount}}</strong> for {{plan_name}}.</p>
        <p><strong>Invoice #:</strong> {{invoice_number}}<br><strong>Date:</strong> {{date}}</p>
      </div>
    `
  },
  {
    id: "tpl-8",
    code: "STUDENT_EMI_DUE",
    name: "Student EMI Installment Reminder",
    category: "Billing & Payments",
    subject: "Reminder: Student EMI Installment Due in 3 Days (₹{{amount}})",
    triggerEvent: "3 days before EMI due date",
    recipientRole: "User / Student",
    autoDispatch: true,
    totalSent: 164,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0d9488;">Upcoming EMI Due</h2>
        <p>Hi {{student_name}}, your installment of <strong>₹{{amount}}</strong> for {{course_name}} is due on {{due_date}}.</p>
        <a href="{{payment_link}}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Pay Now via Razorpay / UPI</a>
      </div>
    `
  },
  {
    id: "tpl-9",
    code: "STUDENT_EMI_OVERDUE",
    name: "Overdue EMI & Late Fee Alert",
    category: "Billing & Payments",
    subject: "URGENT: Overdue EMI Payment Notice (₹{{amount}})",
    triggerEvent: "1 day after EMI due date passes",
    recipientRole: "User / Student",
    autoDispatch: true,
    totalSent: 32,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #e11d48;">Overdue EMI Installment</h2>
        <p>Hi {{student_name}}, your EMI installment of <strong>₹{{amount}}</strong> was due on {{due_date}} and remains unpaid.</p>
        <p>Please complete payment within 48 hours to avoid late fee penalties.</p>
      </div>
    `
  },

  // Category 4: System Warnings
  {
    id: "tpl-10",
    code: "SYSTEM_STORAGE_WARNING",
    name: "90% Cloud Storage Quota Warning",
    category: "System Warnings",
    subject: "Warning: 90% Storage Limit Reached for {{academy_name}}",
    triggerEvent: "Tenant storage reaches 90%",
    recipientRole: "Academy Admin",
    autoDispatch: true,
    totalSent: 6,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #d97706;">Storage Limit Reached</h2>
        <p>Your media storage usage is at <strong>{{storage_percent}}%</strong> ({{used_gb}} GB of {{limit_gb}} GB).</p>
      </div>
    `
  },

  // Category 5: Student Learning
  {
    id: "tpl-11",
    code: "STUDENT_WELCOME_ENROLLMENT",
    name: "Course Enrollment Confirmation",
    category: "Student Learning",
    subject: "Welcome to {{course_name}} — Enrolled at {{academy_name}}",
    triggerEvent: "Student course enrollment",
    recipientRole: "User / Student",
    autoDispatch: true,
    totalSent: 1250,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0d9488;">You're Enrolled!</h2>
        <p>Hi {{student_name}}, welcome to <strong>{{course_name}}</strong>!</p>
        <a href="{{portal_url}}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Access Learning Portal</a>
      </div>
    `
  },
  {
    id: "tpl-12",
    code: "STUDENT_CERTIFICATE_ISSUED",
    name: "Course Completion & Certificate Link",
    category: "Student Learning",
    subject: "Congratulations! Your Certificate for {{course_name}} is Issued",
    triggerEvent: "100% course completion & exam pass",
    recipientRole: "User / Student",
    autoDispatch: true,
    totalSent: 420,
    htmlBody: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; text-align: center;">
        <h2 style="color: #059669;">Congratulations, {{student_name}}!</h2>
        <p>You have successfully completed <strong>{{course_name}}</strong>.</p>
        <a href="{{certificate_url}}" style="display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Download PDF Certificate</a>
      </div>
    `
  }
]

export default function EmailAutomationsHubPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(MASTER_EMAIL_TEMPLATES)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.code.toLowerCase().includes(search.toLowerCase()) ||
                          t.subject.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCategory === "ALL" || t.category === selectedCategory
    return matchesSearch && matchesCat
  })

  const toggleAutoDispatch = (id: string, name: string) => {
    setTemplates(prev => prev.map(t => {
      if (t.id === id) {
        const next = !t.autoDispatch
        toast.success(`Email trigger "${name}" auto-dispatch set to ${next ? 'ACTIVE' : 'PAUSED'}`)
        return { ...t, autoDispatch: next }
      }
      return t
    }))
  }

  const handleSendTestEmail = (name: string, recipient: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 800)),
      {
        loading: `Sending test email for "${name}"...`,
        success: `Test notification sent successfully for ${name}! Check inbox.`,
        error: "Failed to dispatch test email."
      }
    )
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTemplate) return
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t))
    toast.success(`Template "${editingTemplate.name}" updated successfully!`)
    setEditingTemplate(null)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200 flex items-center gap-1">
              <Mail className="w-3 h-3 text-teal-600" /> EMAIL AUTOMATIONS ENGINE
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Email Notification Triggers</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage 19 automated email notifications across Academy Onboarding, Security, Payments, EMI & Student Progress.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/academy/automation"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-teal-600" /> Visual Workflows
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
        {["ALL", "Academy Lifecycle", "Authentication & Security", "Billing & Payments", "System Warnings", "Student Learning"].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat === "ALL" ? "All Notification Triggers" : cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search template name, code, or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">{filteredTemplates.length} Templates</span>
      </div>

      {/* Templates List Cards */}
      <div className="space-y-4 mb-8">
        {filteredTemplates.map(t => (
          <div key={t.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:border-teal-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-mono text-[10px] font-black">
                  {t.code}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                  {t.category}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900">{t.name}</h3>
              <p className="text-xs text-slate-500 font-medium">
                <strong className="text-slate-700">Subject:</strong> {t.subject}
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                Trigger: {t.triggerEvent} • Target: {t.recipientRole} • Total Sent: <strong>{t.totalSent.toLocaleString()}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Auto Dispatch Toggle */}
              <button 
                onClick={() => toggleAutoDispatch(t.id, t.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  t.autoDispatch 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                {t.autoDispatch ? "Auto-Send ON" : "Paused"}
              </button>

              <button 
                onClick={() => setPreviewTemplate(t)}
                className="p-2 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="Preview HTML Template"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setEditingTemplate(t)}
                className="p-2 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="Edit Subject & HTML Body"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button 
                onClick={() => handleSendTestEmail(t.name, t.recipientRole)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
              >
                <Send className="w-3 h-3" /> Test
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* HTML Preview Drawer */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-white border-l border-slate-200 w-full max-w-xl h-full p-8 shadow-2xl overflow-y-auto relative text-slate-900">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{previewTemplate.code}</span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{previewTemplate.name}</h3>
              </div>
              <button onClick={() => setPreviewTemplate(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Email Subject Line</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs text-slate-900">{previewTemplate.subject}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Formatted HTML Template Render</label>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs" dangerouslySetInnerHTML={{ __html: previewTemplate.htmlBody }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-8 shadow-xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <h3 className="text-xl font-black">Edit Email Template: {editingTemplate.code}</h3>
              <button onClick={() => setEditingTemplate(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Subject Line *</label>
                <input required value={editingTemplate.subject} onChange={e => setEditingTemplate({ ...editingTemplate, subject: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">HTML Body Content *</label>
                <textarea rows={10} required value={editingTemplate.htmlBody} onChange={e => setEditingTemplate({ ...editingTemplate, htmlBody: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono" />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button type="submit" className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl shadow-sm flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
