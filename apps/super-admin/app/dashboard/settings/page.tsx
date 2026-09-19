"use client"

import { useState } from "react"
import { Shield, Palette, Building, Bell, Save, Image as ImageIcon, CheckCircle2, DollarSign, Plug } from "lucide-react"
import { toast } from "sonner"

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState('branding')

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden custom-scrollbar">
      {/* Header */}
      <div className="flex-none px-8 py-6 border-b border-slate-200 bg-white flex items-center justify-between shadow-xs">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage workspace preferences, branding, and configurations for Echo LMS.</p>
        </div>
        <button onClick={() => toast.success("Settings saved!")} className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-colors shadow-xs">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Navigation */}
        <div className="w-64 border-r border-slate-200 bg-white p-4 space-y-1 font-semibold">
          <button 
            onClick={() => setActiveTab('branding')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${activeTab === 'branding' ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <Palette className="w-4 h-4 text-teal-600" /> Branding & Theme
          </button>
          <button 
            onClick={() => setActiveTab('company')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${activeTab === 'company' ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <Building className="w-4 h-4 text-slate-500" /> Company Details
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${activeTab === 'notifications' ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <Bell className="w-4 h-4 text-slate-500" /> Notifications
          </button>
          <a 
            href="/dashboard/settings/roles"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Shield className="w-4 h-4 text-slate-500" /> Roles & Permissions
          </a>
          <a 
            href="/dashboard/settings/finance"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <DollarSign className="w-4 h-4 text-slate-500" /> Finance & Currency
          </a>
          <a 
            href="/dashboard/settings/integrations"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Plug className="w-4 h-4 text-slate-500" /> Integrations & APIs
          </a>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50 relative">
          
          <div className="relative z-10 max-w-3xl space-y-8">
            
            {activeTab === 'branding' && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs">
                <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900">
                  <Palette className="w-5 h-5 text-teal-600" /> Workspace Branding
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">Workspace Name</label>
                    <input 
                      type="text" 
                      defaultValue="Echo LMS"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">Workspace Logo</label>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center font-black text-teal-800 text-2xl shadow-xs">
                        G
                      </div>
                      <label className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer shadow-xs">
                        <ImageIcon className="w-4 h-4 text-slate-500" /> Upload New Logo
                        <input type="file" className="hidden" accept="image/*" onChange={() => toast.success("Logo updated successfully!")} />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">Primary Brand Accent Color</label>
                    <div className="flex items-center gap-4">
                      {['bg-teal-600', 'bg-amber-500', 'bg-emerald-600', 'bg-sky-600', 'bg-rose-600'].map((color, i) => (
                        <button key={i} className={`w-8 h-8 rounded-full ${color} flex items-center justify-center ring-2 ring-transparent hover:ring-slate-400 transition-all`}>
                          {i === 0 && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs">
                <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900">
                  <Building className="w-5 h-5 text-teal-600" /> Company Details
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">Legal Entity Name</label>
                    <input type="text" defaultValue="Echo Technologies Pvt Ltd" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">GSTIN / Tax Registration</label>
                    <input type="text" defaultValue="29Echo1234F1Z5" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">Billing Address</label>
                    <textarea rows={3} defaultValue="123 Innovation Way, Tech District, India" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/50 resize-none" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs">
                <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900">
                  <Bell className="w-5 h-5 text-teal-600" /> Global Notifications
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">WhatsApp Messaging Service</div>
                      <div className="text-xs text-slate-500 font-medium">Send automated message updates to leads and students.</div>
                    </div>
                    <a href="/dashboard/settings/integrations" className="text-xs font-bold text-teal-700 hover:text-teal-800">
                      Configure Keys &rarr;
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">Email Notifications</div>
                      <div className="text-xs text-slate-500 font-medium">Send daily summaries to administration staff.</div>
                    </div>
                    <a href="/dashboard/settings/integrations" className="text-xs font-bold text-teal-700 hover:text-teal-800">
                      Configure SMTP &rarr;
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
