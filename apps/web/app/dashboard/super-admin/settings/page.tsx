"use client"

import { useState } from "react"
import { 
  Settings, ShieldCheck, Key, Mail, Bell, CreditCard, 
  HardDrive, Code, FileText, Save, CheckCircle2, AlertTriangle, 
  RefreshCw, Lock, Send, Plus, Eye, EyeOff, ShieldAlert, Check, Copy, Search, Building2
} from "lucide-react"
import { toast } from "sonner"

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState("vendor")
  const [isSaving, setIsSaving] = useState(false)

  // 0. Vendor Management Settings State
  const [vendorSettings, setVendorSettings] = useState({
    autoProvisioning: true,
    defaultPlan: "GROWTH",
    maxAcademiesPerVendor: 10,
    defaultStorageGB: 50,
    allowCustomDomains: true,
    requireCnameApproval: false,
    strictTenantIsolation: true,
    enableWalkInKioskGlobal: true,
    enableWebinarsGlobal: true,
    enableWhatsappAutoGlobal: true,
  })

  // 1. General Settings State
  const [general, setGeneral] = useState({
    platformName: "Echo LMS Platform",
    supportEmail: "support@echolms.com",
    timezone: "Asia/Kolkata",
    currency: "INR",
    maintenanceMode: false,
    allowSelfRegistration: true
  })

  // 2. Security Settings State
  const [security, setSecurity] = useState({
    enforce2FA: true,
    minPasswordLength: 8,
    requireSpecialChar: true,
    maxLoginAttempts: 5,
    sessionTimeoutMins: 60,
    allowedIPs: "192.168.1.1, 200.97.163.236"
  })

  // 3. Roles & Permissions State
  const [selectedRole, setSelectedRole] = useState("SUPER_ADMIN")
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    manage_academies: true,
    manage_billing: true,
    manage_global_courses: true,
    manage_integrations: true,
    access_audit_logs: true,
    export_financial_reports: true,
    impersonate_tenant_admin: true
  })

  // 4. Email / SMTP State
  const [smtp, setSmtp] = useState({
    host: "smtp.sendgrid.net",
    port: 587,
    username: "apikey",
    password: "SG.99a8b7c6d5e4f3a2b1_secret",
    encryption: "TLS",
    fromEmail: "notifications@echolms.com",
    fromName: "Echo Platform Notifications"
  })
  const [showSmtpPassword, setShowSmtpPassword] = useState(false)

  // 5. Notifications State
  const [notifications, setNotifications] = useState({
    securityAlertsEmail: true,
    whatsappTriggers: true,
    slackWebhookUrl: "https://hooks.slack.com/services/T0000/B0000/XXXXX",
    smsProvider: "MSG91",
    smsApiKey: "msg91_auth_key_991823",
    weeklyDigest: true
  })

  // 6. Payment Gateways State
  const [payments, setPayments] = useState({
    enableRazorpay: true,
    razorpayKeyId: "rzp_live_9a87d6f5e4c3b2a1",
    razorpayKeySecret: "secret_rzp_live_8877665544",
    razorpayWebhookSecret: "whsec_rzp_991823746",
    enableStripe: true,
    stripePublishableKey: "pk_live_51M0x988776655443322",
    stripeSecretKey: "sk_live_51M0x988776655443322_secret",
    autoGenerateTaxInvoice: true
  })
  const [showPaymentSecrets, setShowPaymentSecrets] = useState(false)

  // 7. Storage State
  const [storage, setStorage] = useState({
    provider: "Cloudflare R2",
    bucketName: "echo-lms-media-prod",
    region: "ap-south-1",
    accessKey: "AKIAIOSFODNN7EXAMPLE",
    secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    cdnDomain: "media.echolms.com",
    maxUploadMB: 500
  })

  // 8. API & Webhooks State
  const [apiConfig, setApiConfig] = useState({
    webhookUrl: "https://api.echolms.com/webhooks/master",
    webhookSecret: "whsec_echo_991823746501928",
    rateLimitPerMin: 600,
    enablePublicApiV1: true
  })
  const [apiTokens, setApiTokens] = useState([
    { id: "tok-1", name: "Mobile App Production Token", key: "echo_live_tok_99a8b...", createdAt: "2026-08-01" },
    { id: "tok-2", name: "WhatsApp Grafty Engine Token", key: "echo_live_tok_11c2d...", createdAt: "2026-09-10" }
  ])

  // 9. Audit Logs State
  const [auditLogs] = useState([
    { id: "log-1", timestamp: "2026-09-19 20:30:12", user: "Stalin Kumar (Super Admin)", action: "UPDATED_PAYMENT_GATEWAYS", ip: "200.97.163.236", status: "SUCCESS" },
    { id: "log-2", timestamp: "2026-09-19 19:45:00", user: "Stalin Kumar (Super Admin)", action: "PROVISIONED_ACADEMY", ip: "200.97.163.236", status: "SUCCESS" },
    { id: "log-3", timestamp: "2026-09-19 18:12:44", user: "System Auto-Engine", action: "VERIFIED_WHITELABEL_CNAME", ip: "127.0.0.1", status: "SUCCESS" },
    { id: "log-4", timestamp: "2026-09-19 15:00:22", user: "Stalin Kumar (Super Admin)", action: "TOGGLED_MAINTENANCE_MODE", ip: "200.97.163.236", status: "WARNING" },
    { id: "log-5", timestamp: "2026-09-18 22:10:15", user: "Unknown User", action: "FAILED_ADMIN_LOGIN_ATTEMPT", ip: "103.44.12.90", status: "FAILED" },
  ])
  const [auditSearch, setAuditSearch] = useState("")

  const handleGlobalSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success(`Platform ${activeTab.toUpperCase()} settings saved and synchronized across global edge servers!`)
    }, 600)
  }

  const handleSendTestEmail = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: `Sending test SMTP email to ${smtp.fromEmail}...`,
        success: `Test email successfully dispatched via ${smtp.host}:${smtp.port}!`,
        error: "Failed to connect to SMTP host."
      }
    )
  }

  const handleGenerateApiToken = () => {
    const newToken = {
      id: `tok-${Date.now()}`,
      name: "New System Integration Token",
      key: `echo_live_tok_${Math.random().toString(36).substring(2, 12)}`,
      createdAt: new Date().toISOString().split("T")[0]
    }
    setApiTokens([newToken, ...apiTokens])
    toast.success("New Platform API Bearer Token generated successfully!")
  }

  const tabs = [
    { id: "vendor", label: "Vendor Management", icon: Building2 },
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "roles", label: "Roles & Permissions", icon: Key },
    { id: "email", label: "Email / SMTP", icon: Mail },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payment", label: "Payment Gateways", icon: CreditCard },
    { id: "storage", label: "Storage", icon: HardDrive },
    { id: "api", label: "API & Webhooks", icon: Code },
    { id: "audit", label: "Audit Logs", icon: FileText },
  ]

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              Echo SYSTEM CONFIGURATION
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Platform Super Admin Settings</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Global platform configuration, security policies, roles, payment gateways & API settings.</p>
        </div>

        <button 
          onClick={handleGlobalSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save {activeTab.toUpperCase()} Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-1 h-fit">
          {tabs.map(t => {
            const Icon = t.icon
            const isActive = activeTab === t.id
            return (
              <button 
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  isActive 
                    ? "bg-teal-600 text-white shadow-xs" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
          
          {/* 0. VENDOR MANAGEMENT SETTINGS TAB */}
          {activeTab === "vendor" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-4 border-b border-slate-100 flex items-center justify-between">
                <span>Vendor & Academy Management Controls</span>
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-black uppercase">
                  Global Multi-Tenancy Policy
                </span>
              </h2>
              
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm">Automatic Vendor Provisioning</span>
                    <span className="text-slate-500 text-xs">Allow new vendors to auto-provision isolated 8-step LMS databases instantly on sign-up.</span>
                  </div>
                  <button 
                    onClick={() => setVendorSettings(p => ({ ...p, autoProvisioning: !p.autoProvisioning }))}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${vendorSettings.autoProvisioning ? "bg-teal-600" : "bg-slate-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${vendorSettings.autoProvisioning ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <label className="font-extrabold text-slate-900 block text-sm mb-1">Default Subscription Plan for New Vendors</label>
                    <span className="text-slate-500 text-xs block mb-3">Tiers determine feature limits & maximum active learners.</span>
                    <select value={vendorSettings.defaultPlan} onChange={e => setVendorSettings(p => ({ ...p, defaultPlan: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800">
                      <option value="FREE">FREE Tier (100 Students)</option>
                      <option value="STARTER">STARTER Plan (1,000 Students)</option>
                      <option value="GROWTH">GROWTH Plan (5,000 Students)</option>
                      <option value="ENTERPRISE">ENTERPRISE Plan (Unlimited)</option>
                    </select>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <label className="font-extrabold text-slate-900 block text-sm mb-1">Default Storage Quota Per Vendor</label>
                    <span className="text-slate-500 text-xs block mb-3">Allocated media & course asset cloud storage capacity.</span>
                    <select value={vendorSettings.defaultStorageGB} onChange={e => setVendorSettings(p => ({ ...p, defaultStorageGB: Number(e.target.value) }))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800">
                      <option value="10">10 GB per Vendor</option>
                      <option value="50">50 GB per Vendor (Recommended)</option>
                      <option value="100">100 GB per Vendor</option>
                      <option value="500">500 GB per Vendor</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm">Strict Multi-Tenant Database Isolation</span>
                    <span className="text-slate-500 text-xs">Enforces organizationId scoping on all query resolvers & REST endpoints.</span>
                  </div>
                  <button 
                    onClick={() => setVendorSettings(p => ({ ...p, strictTenantIsolation: !p.strictTenantIsolation }))}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${vendorSettings.strictTenantIsolation ? "bg-emerald-600" : "bg-slate-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${vendorSettings.strictTenantIsolation ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm">Custom CNAME Domain Verification Policy</span>
                    <span className="text-slate-500 text-xs">Require manual Super Admin approval before custom vendor domains go live.</span>
                  </div>
                  <button 
                    onClick={() => setVendorSettings(p => ({ ...p, requireCnameApproval: !p.requireCnameApproval }))}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${vendorSettings.requireCnameApproval ? "bg-teal-600" : "bg-slate-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${vendorSettings.requireCnameApproval ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <h3 className="font-black text-slate-900 text-sm">Global Vendor Add-on Module Overrides</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <span className="font-extrabold text-slate-800 text-xs">Walk-ins Kiosk</span>
                      <button onClick={() => setVendorSettings(p => ({ ...p, enableWalkInKioskGlobal: !p.enableWalkInKioskGlobal }))} className={`w-9 h-5 rounded-full p-0.5 transition-colors ${vendorSettings.enableWalkInKioskGlobal ? "bg-teal-600" : "bg-slate-300"}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${vendorSettings.enableWalkInKioskGlobal ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <span className="font-extrabold text-slate-800 text-xs">Webinars & Funnels</span>
                      <button onClick={() => setVendorSettings(p => ({ ...p, enableWebinarsGlobal: !p.enableWebinarsGlobal }))} className={`w-9 h-5 rounded-full p-0.5 transition-colors ${vendorSettings.enableWebinarsGlobal ? "bg-teal-600" : "bg-slate-300"}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${vendorSettings.enableWebinarsGlobal ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <span className="font-extrabold text-slate-800 text-xs">WhatsApp Auto-Bot</span>
                      <button onClick={() => setVendorSettings(p => ({ ...p, enableWhatsappAutoGlobal: !p.enableWhatsappAutoGlobal }))} className={`w-9 h-5 rounded-full p-0.5 transition-colors ${vendorSettings.enableWhatsappAutoGlobal ? "bg-teal-600" : "bg-slate-300"}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${vendorSettings.enableWhatsappAutoGlobal ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 1. GENERAL TAB */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-4 border-b border-slate-100">General Platform Settings</h2>
              
              <div className="space-y-5 text-xs max-w-xl">
                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Platform Name</label>
                  <input type="text" value={general.platformName} onChange={e => setGeneral(p => ({ ...p, platformName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold" />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Global Support Email Address</label>
                  <input type="email" value={general.supportEmail} onChange={e => setGeneral(p => ({ ...p, supportEmail: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Default Platform Timezone</label>
                    <select value={general.timezone} onChange={e => setGeneral(p => ({ ...p, timezone: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold">
                      <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="America/New_York">America/New_York (EST -05:00)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Default SaaS Currency</label>
                    <select value={general.currency} onChange={e => setGeneral(p => ({ ...p, currency: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold">
                      <option value="INR">INR (₹ - Indian Rupee)</option>
                      <option value="USD">USD ($ - US Dollar)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm">Platform Maintenance Mode</span>
                    <span className="text-slate-500 text-xs">Temporarily display maintenance page for non-super admin users.</span>
                  </div>
                  <button 
                    onClick={() => setGeneral(p => ({ ...p, maintenanceMode: !p.maintenanceMode }))}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${general.maintenanceMode ? "bg-amber-600" : "bg-slate-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${general.maintenanceMode ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-4 border-b border-slate-100">Security & Authentication Policies</h2>
              
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm">Enforce 2FA for Super Admins</span>
                    <span className="text-slate-500 text-xs">Requires TOTP authenticator app for super admin logins.</span>
                  </div>
                  <button 
                    onClick={() => setSecurity(p => ({ ...p, enforce2FA: !p.enforce2FA }))}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${security.enforce2FA ? "bg-teal-600" : "bg-slate-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${security.enforce2FA ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="font-extrabold text-slate-900 block text-sm mb-1">Max Login Failed Attempts</span>
                    <span className="text-slate-500 text-xs block mb-3">Lock user account after repeated failed login attempts.</span>
                    <select value={security.maxLoginAttempts} onChange={e => setSecurity(p => ({ ...p, maxLoginAttempts: Number(e.target.value) }))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold">
                      <option value="3">3 Attempts</option>
                      <option value="5">5 Attempts (Recommended)</option>
                      <option value="10">10 Attempts</option>
                    </select>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="font-extrabold text-slate-900 block text-sm mb-1">Session Inactivity Timeout</span>
                    <span className="text-slate-500 text-xs block mb-3">Auto logout inactive super admin sessions.</span>
                    <select value={security.sessionTimeoutMins} onChange={e => setSecurity(p => ({ ...p, sessionTimeoutMins: Number(e.target.value) }))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold">
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">60 Minutes (1 Hour)</option>
                      <option value="120">120 Minutes (2 Hours)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Super Admin Allowed IP Whitelist</label>
                  <input type="text" value={security.allowedIPs} onChange={e => setSecurity(p => ({ ...p, allowedIPs: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" placeholder="e.g. 200.97.163.236, 192.168.1.1" />
                </div>
              </div>
            </div>
          )}

          {/* 3. ROLES & PERMISSIONS TAB */}
          {activeTab === "roles" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-4 border-b border-slate-100">Roles & Permission Matrix</h2>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold text-slate-500">Configure Role:</span>
                <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-extrabold text-slate-800">
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full SaaS Access)</option>
                  <option value="ACADEMY_ADMIN">ACADEMY_ADMIN (Tenant Access)</option>
                  <option value="INSTRUCTOR">INSTRUCTOR (Faculty Portal)</option>
                  <option value="STUDENT">STUDENT (Learner Portal)</option>
                  <option value="STAFF">STAFF (Operations)</option>
                </select>
              </div>

              <div className="space-y-3 text-xs">
                {Object.entries(permissions).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div>
                      <span className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                      <span className="text-slate-500 text-[11px]">Grants operational execution rights for platform function.</span>
                    </div>
                    <button 
                      onClick={() => setPermissions(p => ({ ...p, [key]: !val }))}
                      className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${val ? "bg-teal-600" : "bg-slate-300"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${val ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. EMAIL / SMTP TAB */}
          {activeTab === "email" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900">Email & SMTP Relay Server</h2>
                <button onClick={handleSendTestEmail} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors">
                  <Send className="w-3.5 h-3.5" /> Send Test Email
                </button>
              </div>
              
              <div className="space-y-4 text-xs max-w-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">SMTP Host *</label>
                    <input type="text" value={smtp.host} onChange={e => setSmtp(p => ({ ...p, host: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                  </div>
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">SMTP Port *</label>
                    <input type="number" value={smtp.port} onChange={e => setSmtp(p => ({ ...p, port: Number(e.target.value) }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">SMTP Username *</label>
                    <input type="text" value={smtp.username} onChange={e => setSmtp(p => ({ ...p, username: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                  </div>
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">SMTP Password / API Key *</label>
                    <div className="relative">
                      <input type={showSmtpPassword ? "text" : "password"} value={smtp.password} onChange={e => setSmtp(p => ({ ...p, password: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-mono" />
                      <button type="button" onClick={() => setShowSmtpPassword(!showSmtpPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Sender Email Address</label>
                    <input type="email" value={smtp.fromEmail} onChange={e => setSmtp(p => ({ ...p, fromEmail: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                  </div>
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Sender Display Name</label>
                    <input type="text" value={smtp.fromName} onChange={e => setSmtp(p => ({ ...p, fromName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-4 border-b border-slate-100">Super Admin Automated Email Notifications & Channels</h2>
              
              <div className="space-y-4 text-xs mb-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm">Security & System Alerts Email</span>
                    <span className="text-slate-500 text-xs">Dispatch instant email alerts on failed logins or server errors.</span>
                  </div>
                  <button 
                    onClick={() => setNotifications(p => ({ ...p, securityAlertsEmail: !p.securityAlertsEmail }))}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${notifications.securityAlertsEmail ? "bg-teal-600" : "bg-slate-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${notifications.securityAlertsEmail ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm">WhatsApp Triggers via Grafty Engine</span>
                    <span className="text-slate-500 text-xs">Send 1-click WhatsApp transaction updates to tenant admins.</span>
                  </div>
                  <button 
                    onClick={() => setNotifications(p => ({ ...p, whatsappTriggers: !p.whatsappTriggers }))}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${notifications.whatsappTriggers ? "bg-teal-600" : "bg-slate-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${notifications.whatsappTriggers ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Slack / Webhook System Alert URL</label>
                  <input type="text" value={notifications.slackWebhookUrl} onChange={e => setNotifications(p => ({ ...p, slackWebhookUrl: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                </div>
              </div>

              {/* Super Admin Automated Email Triggers */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">SaaS Super Admin Automated Email Triggers</h3>
                    <p className="text-xs text-slate-500">System email triggers dispatched automatically to the Super Admin team.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[10px] font-black uppercase border border-teal-200">
                    8 Super Admin Triggers
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { code: "SUPERADMIN_NEW_ACADEMY_REGISTERED", name: "New Tenant Academy Provisioned", desc: "Sent when a new academy registers or is onboarded.", subject: "New Academy Registered: {{academy_name}}" },
                    { code: "SUPERADMIN_PAYMENT_SETTLED", name: "SaaS Subscription Payment Collected", desc: "Sent when a tenant subscription payment settles.", subject: "Subscription Payment Settled: ₹{{amount}} from {{academy_name}}" },
                    { code: "SUPERADMIN_SUBSCRIPTION_CANCELLED", name: "Tenant Subscription Cancellation / Churn", desc: "Sent when an academy cancels or downgrades.", subject: "Churn Alert: {{academy_name}} cancelled subscription" },
                    { code: "SUPERADMIN_CNAME_DNS_REQUEST", name: "Custom Domain CNAME Pending Verification", desc: "Sent when a tenant requests custom CNAME mapping.", subject: "CNAME Verification Request: {{custom_domain}}" },
                    { code: "SUPERADMIN_STORAGE_CAP_ALERT", name: "Tenant Storage Cap Exceeded (90%)", desc: "Sent when a tenant reaches 90% storage allocation.", subject: "Storage Warning: {{academy_name}} at {{percent}}% quota" },
                    { code: "SUPERADMIN_FAILED_PAYMENT_ALERT", name: "Subscription Payment Renewal Failed", desc: "Sent on card decline or UPI renewal failure.", subject: "URGENT: Payment failed for {{academy_name}}" },
                    { code: "SUPERADMIN_DAILY_DIGEST", name: "Executive Daily SaaS Revenue & Growth Digest", desc: "Daily summary of MRR, active learners, & platform uptime.", subject: "Echo Executive Daily Digest — {{date}}" },
                    { code: "SUPERADMIN_SECURITY_THREAT", name: "Security Alert: Unauthorized IP Brute-Force", desc: "Sent on repeated failed super admin login attempts.", subject: "SECURITY ALERT: Multiple failed login attempts from {{ip}}" },
                  ].map((trigger, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded border border-teal-200">{trigger.code}</span>
                          <span className="font-extrabold text-slate-900 text-xs">{trigger.name}</span>
                        </div>
                        <p className="text-slate-500 text-[11px]">{trigger.desc}</p>
                        <p className="text-slate-400 text-[10px] font-mono mt-0.5">Subject: {trigger.subject}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          type="button"
                          onClick={() => toast.success(`Test Super Admin email sent for ${trigger.code}!`)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                        >
                          <Send className="w-3 h-3" /> Test Email
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. PAYMENT GATEWAYS TAB */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-4 border-b border-slate-100">Payment Gateway Configuration</h2>
              
              {/* Razorpay Config Card */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-slate-900">Razorpay Payment Engine (India & UPI)</span>
                  </div>
                  <button 
                    onClick={() => setPayments(p => ({ ...p, enableRazorpay: !p.enableRazorpay }))}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${payments.enableRazorpay ? "bg-teal-600" : "bg-slate-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${payments.enableRazorpay ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold uppercase text-slate-700 block mb-1">Razorpay Key ID</label>
                    <input type="text" value={payments.razorpayKeyId} onChange={e => setPayments(p => ({ ...p, razorpayKeyId: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-mono" />
                  </div>
                  <div>
                    <label className="font-bold uppercase text-slate-700 block mb-1">Razorpay Key Secret</label>
                    <input type={showPaymentSecrets ? "text" : "password"} value={payments.razorpayKeySecret} onChange={e => setPayments(p => ({ ...p, razorpayKeySecret: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-mono" />
                  </div>
                </div>
              </div>

              {/* Stripe Config Card */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="font-black text-base text-slate-900">Stripe Global Card Payments</span>
                  <button 
                    onClick={() => setPayments(p => ({ ...p, enableStripe: !p.enableStripe }))}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${payments.enableStripe ? "bg-teal-600" : "bg-slate-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${payments.enableStripe ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold uppercase text-slate-700 block mb-1">Stripe Publishable Key</label>
                    <input type="text" value={payments.stripePublishableKey} onChange={e => setPayments(p => ({ ...p, stripePublishableKey: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-mono" />
                  </div>
                  <div>
                    <label className="font-bold uppercase text-slate-700 block mb-1">Stripe Secret Key</label>
                    <input type={showPaymentSecrets ? "text" : "password"} value={payments.stripeSecretKey} onChange={e => setPayments(p => ({ ...p, stripeSecretKey: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-mono" />
                  </div>
                </div>
              </div>

              <button type="button" onClick={() => setShowPaymentSecrets(!showPaymentSecrets)} className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
                {showPaymentSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} {showPaymentSecrets ? "Hide Secret Keys" : "Reveal Secret Keys"}
              </button>
            </div>
          )}

          {/* 7. STORAGE TAB */}
          {activeTab === "storage" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-4 border-b border-slate-100">Cloud Storage & Media CDN</h2>
              
              <div className="space-y-4 text-xs max-w-xl">
                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Primary Cloud Provider</label>
                  <select value={storage.provider} onChange={e => setStorage(p => ({ ...p, provider: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold">
                    <option value="Cloudflare R2">Cloudflare R2 Object Storage (Zero Egress)</option>
                    <option value="AWS S3">AWS S3 (Amazon Web Services)</option>
                    <option value="DigitalOcean Spaces">DigitalOcean Spaces</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">S3 / R2 Bucket Name</label>
                    <input type="text" value={storage.bucketName} onChange={e => setStorage(p => ({ ...p, bucketName: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                  </div>
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Cloud Region</label>
                    <input type="text" value={storage.region} onChange={e => setStorage(p => ({ ...p, region: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Access Key ID</label>
                    <input type="text" value={storage.accessKey} onChange={e => setStorage(p => ({ ...p, accessKey: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                  </div>
                  <div>
                    <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Secret Access Key</label>
                    <input type="password" value={storage.secretKey} onChange={e => setStorage(p => ({ ...p, secretKey: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">CDN Custom Domain CNAME</label>
                  <input type="text" value={storage.cdnDomain} onChange={e => setStorage(p => ({ ...p, cdnDomain: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                </div>
              </div>
            </div>
          )}

          {/* 8. API & WEBHOOKS TAB */}
          {activeTab === "api" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900">API Tokens & Master Webhooks</h2>
                <button onClick={handleGenerateApiToken} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors">
                  <Plus className="w-4 h-4" /> Generate API Token
                </button>
              </div>
              
              <div className="space-y-4 text-xs mb-8">
                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Platform Master Webhook Endpoint</label>
                  <input type="text" value={apiConfig.webhookUrl} onChange={e => setApiConfig(p => ({ ...p, webhookUrl: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Webhook Signing Secret</label>
                  <input type="text" value={apiConfig.webhookSecret} onChange={e => setApiConfig(p => ({ ...p, webhookSecret: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" />
                </div>
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-sm mb-3">Active System API Bearer Tokens</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100 font-bold text-slate-500">
                        <th className="p-3">Token Name</th>
                        <th className="p-3">Key Snippet</th>
                        <th className="p-3">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {apiTokens.map(t => (
                        <tr key={t.id}>
                          <td className="p-3 font-bold text-slate-800">{t.name}</td>
                          <td className="p-3 font-mono text-slate-500">{t.key}</td>
                          <td className="p-3 font-mono text-slate-400">{t.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 9. AUDIT LOGS TAB */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900">Real-Time Platform Audit Logs</h2>
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search logs..." 
                    value={auditSearch} 
                    onChange={e => setAuditSearch(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none" 
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100 font-bold text-slate-500 text-[10px] uppercase">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Action Event</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {auditLogs
                      .filter(l => l.action.toLowerCase().includes(auditSearch.toLowerCase()) || l.user.toLowerCase().includes(auditSearch.toLowerCase()))
                      .map(l => (
                        <tr key={l.id} className="hover:bg-slate-100/50">
                          <td className="p-3 font-mono text-slate-500">{l.timestamp}</td>
                          <td className="p-3 font-bold text-slate-800">{l.user}</td>
                          <td className="p-3 font-mono font-bold text-teal-700">{l.action}</td>
                          <td className="p-3 font-mono text-slate-400">{l.ip}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              l.status === "SUCCESS" ? "bg-emerald-100 text-emerald-800" : l.status === "WARNING" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                            }`}>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
