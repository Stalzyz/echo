"use client"

import { useState } from  "react"
import { Palette, Globe, ShieldCheck, Image as ImageIcon, Copy, Check, X, CheckCircle2, AlertCircle, ExternalLink, Save, Sliders } from  "lucide-react"
import { toast } from  "sonner"

export default function BrandingAndWhitelabelPage() {
  const [echoLogo, setEchoLogo] = useState("https://echo.grekam.in/logo.png")
  const [primaryColor, setPrimaryColor] = useState("#0d9488") // Teal
  const [fontFamily, setFontFamily] = useState("Inter")
  const [whiteLabelEnabled, setWhiteLabelEnabled] = useState(true)
  const [removeEchoBranding, setRemoveEchoBranding] = useState(true)

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Global Echo Branding & White Label settings updated successfully!")
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar p-8">
      
      {/* Header */}
      <div className="flex-none pb-8 border-b border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              Echo SAAS BRANDING ENGINE
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Website & White Label Branding</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage default Echo SaaS platform branding as well as customer White Label custom domain allocations.</p>
        </div>

        <button 
          onClick={handleSaveBranding}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
        >
          <Save className="w-4 h-4" /> Save Branding Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Global Echo SaaS Branding */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <Palette className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Global Echo Platform Branding</h2>
              <p className="text-xs text-slate-500">Default logos, colors, fonts, and login page styling for non-whitelabeled tenants.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Platform Logo URL</label>
              <input 
                type="text" 
                value={echoLogo} 
                onChange={e => setEchoLogo(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono" 
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Platform Primary Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={e => setPrimaryColor(e.target.value)} 
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={primaryColor} 
                  onChange={e => setPrimaryColor(e.target.value)} 
                  className="w-32 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold" 
                />
              </div>
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-slate-700 block mb-1">Default Typography Font</label>
              <select 
                value={fontFamily} 
                onChange={e => setFontFamily(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold"
              >
                <option value="Inter">Inter (Default Modern Sans)</option>
                <option value="Roboto">Roboto</option>
                <option value="Outfit">Outfit</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              </select>
            </div>
          </div>
        </div>

        {/* White Label Controls */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">White Label Engine Controls</h2>
              <p className="text-xs text-slate-500">Allow Growth & Enterprise tenant academies to remove Echo branding & use CNAME domains.</p>
            </div>
          </div>

          <div className="space-y-5 text-xs">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <span className="font-extrabold text-slate-900 block text-sm">Enable White Label Module</span>
                <span className="text-slate-500 text-xs">Permits tenant academies to map custom CNAME domains and custom logos.</span>
              </div>
              <button 
                onClick={() => setWhiteLabelEnabled(!whiteLabelEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${whiteLabelEnabled ? "bg-teal-600" : "bg-slate-300"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${whiteLabelEnabled ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <span className="font-extrabold text-slate-900 block text-sm">Allow "Remove Echo Branding"</span>
                <span className="text-slate-500 text-xs">Hides "Powered by Echo LMS" footer credits for paid tenants.</span>
              </div>
              <button 
                onClick={() => setRemoveEchoBranding(!removeEchoBranding)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${removeEchoBranding ? "bg-teal-600" : "bg-slate-300"}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${removeEchoBranding ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="p-4 bg-teal-50/50 border border-teal-200/80 rounded-2xl">
              <span className="font-bold text-teal-900 block text-xs mb-1">Global CNAME Target DNS Record</span>
              <div className="font-mono text-xs font-bold text-teal-700 bg-white px-3 py-2 rounded-xl border border-teal-200 flex items-center justify-between">
                <span>cname.echolms.com</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
