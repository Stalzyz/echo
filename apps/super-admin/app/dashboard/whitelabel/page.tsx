"use client"

import { useState } from "react"
import { 
  Globe, ShieldCheck, RefreshCw, Palette, CheckCircle2, 
  AlertCircle, ExternalLink, Edit3, Image as ImageIcon, Copy, Check, X, Loader2,
  Sliders, Shield, Layers, Lock, CheckSquare, Plus, Trash2, Server
} from "lucide-react"
import { toast } from "sonner"

interface PlanFeatureMatrix {
  planId: "STARTER" | "GROWTH" | "ENTERPRISE"
  planName: string
  allowCustomLogo: boolean
  allowCustomFavicon: boolean
  allowBasicColors: boolean
  allowFullColors: boolean
  allowDarkMode: boolean
  allowCustomLogin: boolean
  allowCustomDomain: boolean
  allowEmailWhiteLabel: boolean
  allowRemoveGechoBranding: boolean
  allowMobileAppBranding: boolean
}

interface VendorOverride {
  id: string
  academyName: string
  subdomain: string
  customDomain: string
  plan: "STARTER" | "GROWTH" | "ENTERPRISE"
  whiteLabelEnabled: boolean
  customDomainAllowed: boolean
  removeGechoBrandingAllowed: boolean
  cnameVerified: boolean
  sslStatus: "ACTIVE" | "PROVISIONING" | "FAILED"
}

interface GechoBrandingLocation {
  id: string
  locationName: string
  description: string
  rule: "ALWAYS_GECHO" | "VENDOR_BRANDING" | "HIDDEN"
}

export default function SuperAdminWhitelabelPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'plans' | 'vendors' | 'branding' | 'domains'>('global')
  const [globalWhiteLabel, setGlobalWhiteLabel] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // 1. Plan-Based Feature Matrix State
  const [plans, setPlans] = useState<PlanFeatureMatrix[]>([
    {
      planId: "STARTER",
      planName: "Starter Tier",
      allowCustomLogo: true,
      allowCustomFavicon: true,
      allowBasicColors: true,
      allowFullColors: false,
      allowDarkMode: false,
      allowCustomLogin: false,
      allowCustomDomain: false,
      allowEmailWhiteLabel: false,
      allowRemoveGechoBranding: false,
      allowMobileAppBranding: false,
    },
    {
      planId: "GROWTH",
      planName: "Growth Tier",
      allowCustomLogo: true,
      allowCustomFavicon: true,
      allowBasicColors: true,
      allowFullColors: true,
      allowDarkMode: true,
      allowCustomLogin: true,
      allowCustomDomain: true,
      allowEmailWhiteLabel: true,
      allowRemoveGechoBranding: false,
      allowMobileAppBranding: false,
    },
    {
      planId: "ENTERPRISE",
      planName: "Enterprise Tier",
      allowCustomLogo: true,
      allowCustomFavicon: true,
      allowBasicColors: true,
      allowFullColors: true,
      allowDarkMode: true,
      allowCustomLogin: true,
      allowCustomDomain: true,
      allowEmailWhiteLabel: true,
      allowRemoveGechoBranding: true,
      allowMobileAppBranding: true,
    }
  ])

  // 2. Vendor Overrides Directory
  const [vendors, setVendors] = useState<VendorOverride[]>([
    {
      id: "v-1",
      academyName: "Apex Tech Institute",
      subdomain: "apex.gecholms.com",
      customDomain: "learn.apextech.edu",
      plan: "ENTERPRISE",
      whiteLabelEnabled: true,
      customDomainAllowed: true,
      removeGechoBrandingAllowed: true,
      cnameVerified: true,
      sslStatus: "ACTIVE",
    },
    {
      id: "v-2",
      academyName: "Stark Photography Academy",
      subdomain: "starkphoto.gecholms.com",
      customDomain: "academy.starkphoto.com",
      plan: "GROWTH",
      whiteLabelEnabled: true,
      customDomainAllowed: true,
      removeGechoBrandingAllowed: false,
      cnameVerified: true,
      sslStatus: "ACTIVE",
    },
    {
      id: "v-3",
      academyName: "Quantum Coding Labs",
      subdomain: "quantum.gecholms.com",
      customDomain: "learn.quantumlabs.io",
      plan: "STARTER",
      whiteLabelEnabled: false,
      customDomainAllowed: false,
      removeGechoBrandingAllowed: false,
      cnameVerified: false,
      sslStatus: "PROVISIONING",
    }
  ])

  // 3. GECHO Branding Placement Matrix
  const [brandingRules, setBrandingRules] = useState<GechoBrandingLocation[]>([
    { id: "loc-1", locationName: "Login Portal Footer", description: "Shows 'Powered by GECHO' on student sign-in screens.", rule: "VENDOR_BRANDING" },
    { id: "loc-2", locationName: "Academy Dashboard Sidebar", description: "Bottom branding badge in main navigation sidebar.", rule: "VENDOR_BRANDING" },
    { id: "loc-3", locationName: "Verified PDF Certificates", description: "Certificate validation link and watermark footer.", rule: "ALWAYS_GECHO" },
    { id: "loc-4", locationName: "Automated Email Templates", description: "Email footer copyright and provider links.", rule: "VENDOR_BRANDING" },
    { id: "loc-5", locationName: "System Error Pages (404/500)", description: "Error diagnostic screens and fallback support.", rule: "ALWAYS_GECHO" },
  ])

  // New Custom Domain Modal State
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false)
  const [newDomainInput, setNewDomainInput] = useState({ vendorId: "v-1", customDomain: "" })
  const [verifyingDomainId, setVerifyingDomainId] = useState<string | null>(null)

  const togglePlanFeature = (planId: string, featureKey: keyof PlanFeatureMatrix) => {
    setPlans(prev => prev.map(p => {
      if (p.planId === planId) {
        return { ...p, [featureKey]: !p[featureKey] }
      }
      return p
    }))
    toast.success("Updated SaaS plan white-label permissions matrix!")
  }

  const toggleVendorOverride = (vendorId: string, overrideKey: keyof VendorOverride) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        return { ...v, [overrideKey]: !v[overrideKey] }
      }
      return v
    }))
    toast.success("Updated vendor white-label override permissions!")
  }

  const updateBrandingRule = (locId: string, newRule: "ALWAYS_GECHO" | "VENDOR_BRANDING" | "HIDDEN") => {
    setBrandingRules(prev => prev.map(b => b.id === locId ? { ...b, rule: newRule } : b))
    toast.success("Updated GECHO platform branding placement policy!")
  }

  const handleVerifyDomain = (vendorId: string) => {
    setVerifyingDomainId(vendorId)
    setTimeout(() => {
      setVendors(prev => prev.map(v => {
        if (v.id === vendorId) {
          return { ...v, cnameVerified: true, sslStatus: "ACTIVE" }
        }
        return v
      }))
      setVerifyingDomainId(null)
      toast.success("CNAME record verified & SSL certificate provisioned!")
    }, 1000)
  }

  const handleSaveGlobal = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Global White-Label platform settings published!")
    }, 500)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Top Header */}
      <div className="flex-none px-8 py-6 border-b border-slate-200 bg-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-black shadow-xs">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Super Admin • White-Label System</h1>
            <p className="text-xs text-slate-500 font-medium">Control global white-labeling, SaaS plan permissions, vendor overrides, and custom domains.</p>
          </div>
        </div>

        <button 
          onClick={handleSaveGlobal}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          Save Global White-Label Rules
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-white p-4 space-y-1 flex-none font-semibold">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 mb-2">Control Layers</p>

          {[
            { id: 'global', label: 'Global Platform Settings', icon: Globe },
            { id: 'plans', label: 'SaaS Plan Permissions', icon: Layers },
            { id: 'vendors', label: 'Vendor Overrides', icon: Shield },
            { id: 'branding', label: 'GECHO Branding Matrix', icon: Palette },
            { id: 'domains', label: 'Custom Domain CNAME', icon: Server },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                activeTab === tab.id 
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4 text-teal-600" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Workspace View Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* TAB 1: GLOBAL PLATFORM SETTINGS */}
          {activeTab === 'global' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">White-Label System Master Switch</h2>
                    <p className="text-xs text-slate-500 mt-0.5">When ON, eligible vendors can replace GECHO branding with their own academy identity.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={globalWhiteLabel}
                    onChange={e => setGlobalWhiteLabel(e.target.checked)}
                    className="w-6 h-6 accent-teal-600 rounded cursor-pointer"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <span className="text-xs font-bold text-slate-900 block">System Mode</span>
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-wider block">
                      {globalWhiteLabel ? "Multi-Tenant White Label Active" : "Default GECHO Branding Only"}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <span className="text-xs font-bold text-slate-900 block">Active White-Label Vendors</span>
                    <span className="text-xs font-black text-slate-900 block">24 Academies</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAAS PLAN PERMISSIONS MATRIX */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">SaaS Plan Feature Permission Matrix</h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">Configure white-label features unlocked per subscription plan.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">White-Label Feature</th>
                      <th className="py-4 px-4 text-center">Starter Tier</th>
                      <th className="py-4 px-4 text-center">Growth Tier</th>
                      <th className="py-4 px-4 text-center">Enterprise Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs font-medium">
                    {[
                      { key: 'allowCustomLogo', label: 'Custom Academy Logo' },
                      { key: 'allowCustomFavicon', label: 'Custom Favicon & App Icon' },
                      { key: 'allowBasicColors', label: 'Basic Brand Colors' },
                      { key: 'allowFullColors', label: 'Full 16-Token Design System' },
                      { key: 'allowDarkMode', label: 'Dark Mode Tokens' },
                      { key: 'allowCustomLogin', label: 'Custom Login Portal Layout' },
                      { key: 'allowCustomDomain', label: 'Custom CNAME Domain (learn.academy.com)' },
                      { key: 'allowEmailWhiteLabel', label: 'Custom Email SMTP Branding' },
                      { key: 'allowRemoveGechoBranding', label: 'Remove "Powered by GECHO"' },
                      { key: 'allowMobileAppBranding', label: 'Standalone Mobile App Branding' },
                    ].map(row => (
                      <tr key={row.key} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-6 font-bold text-slate-900">{row.label}</td>
                        {plans.map(plan => (
                          <td key={plan.planId} className="py-3.5 px-4 text-center">
                            <input 
                              type="checkbox"
                              checked={(plan as any)[row.key]}
                              onChange={() => togglePlanFeature(plan.planId, row.key as any)}
                              className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: VENDOR OVERRIDES */}
          {activeTab === 'vendors' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Vendor White-Label Overrides</h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">Override plan-level defaults for specific academies.</p>
              </div>

              <div className="space-y-4">
                {vendors.map(v => (
                  <div key={v.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-slate-900">{v.academyName}</h3>
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-black rounded-full border border-slate-200">
                            {v.plan}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{v.subdomain} • {v.customDomain}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleVendorOverride(v.id, 'whiteLabelEnabled')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                            v.whiteLabelEnabled ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-slate-100 border-slate-200 text-slate-500'
                          }`}
                        >
                          White Label: {v.whiteLabelEnabled ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={v.customDomainAllowed}
                          onChange={() => toggleVendorOverride(v.id, 'customDomainAllowed')}
                          className="w-4 h-4 accent-teal-600 rounded"
                        />
                        Allow Custom CNAME Domain
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={v.removeGechoBrandingAllowed}
                          onChange={() => toggleVendorOverride(v.id, 'removeGechoBrandingAllowed')}
                          className="w-4 h-4 accent-teal-600 rounded"
                        />
                        Allow Removing GECHO Branding
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GECHO BRANDING PLACEMENT MATRIX */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">GECHO Branding Placement Rules</h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">Define platform rules for where GECHO branding appears across academy views.</p>
              </div>

              <div className="space-y-3">
                {brandingRules.map(rule => (
                  <div key={rule.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{rule.locationName}</h3>
                      <p className="text-xs text-slate-500">{rule.description}</p>
                    </div>

                    <select
                      value={rule.rule}
                      onChange={e => updateBrandingRule(rule.id, e.target.value as any)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800"
                    >
                      <option value="ALWAYS_GECHO">Always GECHO</option>
                      <option value="VENDOR_BRANDING">Allow Vendor Branding</option>
                      <option value="HIDDEN">Can Be Hidden (Enterprise)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOM DOMAIN & CNAME ENGINE */}
          {activeTab === 'domains' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Multi-Tenant Custom Domain CNAME Engine</h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Manage CNAME verification, DNS routing instructions, and auto-SSL provisioning.</p>
                </div>
              </div>

              {/* DNS Instructions Box */}
              <div className="p-5 bg-teal-50 border border-teal-200 rounded-3xl space-y-2">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-xs">
                  <Server className="w-4 h-4 text-teal-600" /> Platform DNS Target Instructions for Vendors
                </div>
                <p className="text-xs text-teal-800 font-medium">
                  Vendors must point their custom domain CNAME record to: <code className="bg-white px-2 py-0.5 rounded font-mono font-bold border border-teal-300">cname.gecholms.com</code>
                </p>
              </div>

              <div className="space-y-4">
                {vendors.map(v => (
                  <div key={v.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-slate-900">{v.academyName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{v.customDomain}</code>
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border ${
                            v.cnameVerified ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {v.cnameVerified ? "CNAME Verified" : "Verification Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleVerifyDomain(v.id)}
                          disabled={verifyingDomainId === v.id}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
                        >
                          {verifyingDomainId === v.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                          Verify CNAME & SSL
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
