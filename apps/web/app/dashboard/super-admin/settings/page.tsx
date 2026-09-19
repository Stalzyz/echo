"use client"

import { useState } from "react"
import { 
  Settings, ShieldCheck, Key, Mail, Bell, CreditCard, 
  HardDrive, Code, FileText, Save, CheckCircle2
} from "lucide-react"
import { toast } from "sonner"

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [platformName, setPlatformName] = useState("GECHO LMS Engine")
  const [supportEmail, setSupportEmail] = useState("support@echolms.com")
  const [twoFactorRequired, setTwoFactorRequired] = useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Platform settings updated successfully!")
  }

  const tabs = [
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
              GECHO SYSTEM CONFIGURATION
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Platform Super Admin Settings</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Global platform configuration, security policies, roles, payment gateways & API settings.</p>
        </div>

        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
        >
          <Save className="w-4 h-4" /> Save Settings
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

        {/* Tab Content Panel */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
          
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-4 border-b border-slate-100">General Platform Settings</h2>
              
              <div className="space-y-4 max-w-lg text-xs">
                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Platform Name</label>
                  <input type="text" value={platformName} onChange={e => setPlatformName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold" />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Support Email Address</label>
                  <input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold" />
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Default Timezone</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold">
                    <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
                    <option value="UTC">UTC (Universal Coordinated Time)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-4 border-b border-slate-100">Platform Security & Auth Policies</h2>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm">Enforce 2FA for Super Admins</span>
                    <span className="text-slate-500 text-xs">Requires TOTP authenticator app for super admin logins.</span>
                  </div>
                  <button 
                    onClick={() => setTwoFactorRequired(!twoFactorRequired)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${twoFactorRequired ? "bg-teal-600" : "bg-slate-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${twoFactorRequired ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="font-extrabold text-slate-900 block text-sm mb-1">Session Timeout</span>
                  <span className="text-slate-500 text-xs block mb-3">Auto logout inactive super admin sessions after period of inactivity.</span>
                  <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold">
                    <option value="60">60 Minutes</option>
                    <option value="120">2 Hours</option>
                    <option value="480">8 Hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "general" && activeTab !== "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 pb-4 border-b border-slate-100 capitalize">{activeTab} Configuration</h2>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 font-medium">
                Global {activeTab} policies are active and operational on the GECHO platform edge.
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
