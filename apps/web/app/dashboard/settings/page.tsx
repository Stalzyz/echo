"use client"

import { useState, useRef } from "react"
import { 
  Palette, Building, Bell, Save, Image as ImageIcon, CheckCircle2, 
  DollarSign, Plug, RefreshCw, Upload, Eye, Lock, Layers, RotateCcw, 
  Check, Monitor, Smartphone, Sparkles, AlertCircle, Trash2, ArrowUpRight, History
} from "lucide-react"
import { toast } from "sonner"
import { DEFAULT_TENANT_THEME } from "@/components/theme/TenantThemeProvider"
import { DesignTokens, TenantTheme, ThemeVersionHistory } from "@/types/tenant-branding"

// Color Preset Themes
const COLOR_PRESETS = [
  {
    name: "Echo Teal (Default)",
    primary: "#0d9488",
    secondary: "#f59e0b",
    accent: "#6366f1",
    background: "#f8fafc",
    surface: "#ffffff",
    card: "#ffffff",
    text: "#0f172a",
  },
  {
    name: "Indigo Modern",
    primary: "#6366f1",
    secondary: "#ec4899",
    accent: "#10b981",
    background: "#faf5ff",
    surface: "#ffffff",
    card: "#ffffff",
    text: "#1e1b4b",
  },
  {
    name: "Emerald Executive",
    primary: "#059669",
    secondary: "#d97706",
    accent: "#3b82f6",
    background: "#f0fdf4",
    surface: "#ffffff",
    card: "#ffffff",
    text: "#064e3b",
  },
  {
    name: "Royal Obsidian",
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#f43f5e",
    background: "#f8fafc",
    surface: "#ffffff",
    card: "#ffffff",
    text: "#0f172a",
  }
]

export default function BrandingThemeSettingsPage() {
  const [brandSubTab, setBrandSubTab] = useState<'identity' | 'colors' | 'typography' | 'login' | 'history'>('identity')
  const [previewView, setPreviewView] = useState<'dashboard' | 'lms' | 'crm' | 'login'>('dashboard')
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop')
  
  const [theme, setTheme] = useState<TenantTheme>(DEFAULT_TENANT_THEME)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Version History State
  const [versions, setVersions] = useState<ThemeVersionHistory[]>([
    {
      version: 2,
      publishedAt: "2026-09-18 10:30",
      publishedBy: "Stalin Kumar (Admin)",
      summary: "Updated primary color to Teal #0d9488 and configured custom login heading.",
      theme: DEFAULT_TENANT_THEME
    },
    {
      version: 1,
      publishedAt: "2026-09-10 14:15",
      publishedBy: "System Setup",
      summary: "Initial default academy theme creation.",
      theme: DEFAULT_TENANT_THEME
    }
  ])

  // File Upload Refs & Handler
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const mobileLogoInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetKey: 'mainLogoUrl' | 'faviconUrl' | 'mobileLogoUrl') => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/v1/storage/upload-local', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.downloadUrl) {
        setTheme(prev => ({
          ...prev,
          identity: {
            ...prev.identity,
            [targetKey]: data.downloadUrl
          }
        }))
        setIsDirty(true)
        toast.success(`Logo asset uploaded successfully!`)
      } else {
        toast.error(data.error || "Upload failed")
      }
    } catch (err: any) {
      toast.error("File upload error: " + err.message)
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const triggerLiveThemeUpdate = (colors: { primary?: string; secondary?: string; accent?: string; name?: string }) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("organization-updated", {
          detail: {
            primaryColor: colors.primary,
            secondaryColor: colors.secondary,
            accentColor: colors.accent,
            name: colors.name,
          },
        })
      );
    }
  };

  const updateColor = (key: keyof DesignTokens, value: string) => {
    setTheme(prev => {
      const updatedColors = {
        ...prev.colors,
        [key]: value,
        button: key === 'primary' ? value : prev.colors.button,
        link: key === 'primary' ? value : prev.colors.link,
      };
      triggerLiveThemeUpdate(updatedColors as any);
      return {
        ...prev,
        colors: updatedColors
      };
    });
    setIsDirty(true);
  };

  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        primary: preset.primary,
        secondary: preset.secondary,
        accent: preset.accent,
        background: preset.background,
        surface: preset.surface,
        card: preset.card,
        text: preset.text,
        button: preset.primary,
        link: preset.primary,
      }
    }));
    triggerLiveThemeUpdate(preset as any);
    setIsDirty(true);
    toast.success(`Applied ${preset.name} color palette!`);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const { ApiClient } = await import("@/lib/api");
      await ApiClient.patch("/settings/organization", {
        name: theme.identity.academyName,
        primaryColor: theme.colors.primary,
        secondaryColor: theme.colors.secondary,
        accentColor: theme.colors.accent,
      });

      triggerLiveThemeUpdate({
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        name: theme.identity.academyName,
      });

      const newVersionNum = theme.version + 1;
      const newTheme = { ...theme, version: newVersionNum, updatedAt: new Date().toISOString() };
      setTheme(newTheme);
      setVersions(prev => [
        {
          version: newVersionNum,
          publishedAt: new Date().toLocaleString(),
          publishedBy: "Current Admin",
          summary: `Published Theme v${newVersionNum} with primary ${newTheme.colors.primary}`,
          theme: newTheme
        },
        ...prev
      ]);
      setIsDirty(false);
      toast.success(`Theme v${newVersionNum} published live to all organization applications!`);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to publish theme: " + (err.message || "Unknown error"));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRestoreVersion = (ver: ThemeVersionHistory) => {
    setTheme(ver.theme)
    setIsDirty(true)
    toast.success(`Restored draft settings from Version ${ver.version}! Click Publish to apply live.`)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Top Header */}
      <div className="flex-none px-8 py-5 border-b border-slate-200 bg-white flex items-center justify-between shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Branding & Theme Editor</h1>
            {isDirty && (
              <span className="px-2.5 py-0.5 text-xs font-black bg-amber-100 text-amber-800 rounded-full border border-amber-200 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Customize academy identity, design tokens, typography, and login portal live.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTheme(DEFAULT_TENANT_THEME)} 
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Default
          </button>
          
          <button 
            onClick={handlePublish} 
            disabled={isPublishing}
            style={{ backgroundColor: theme.colors.primary }}
            className="flex items-center gap-2 px-5 py-2.5 text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publish Theme (v{theme.version})
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        
        {/* Editor Controls Workspace */}
        <div className="w-full lg:w-[480px] border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col overflow-hidden flex-none">
          
          {/* Sub-tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-2 pt-2 gap-1 overflow-x-auto flex-none scrollbar-none">
            {[
              { id: 'identity', label: 'Identity', icon: ImageIcon },
              { id: 'colors', label: 'Colors', icon: Palette },
              { id: 'typography', label: 'Style & Fonts', icon: Layers },
              { id: 'login', label: 'Login Portal', icon: Sparkles },
              { id: 'history', label: 'History', icon: History },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setBrandSubTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-lg transition-all border-t border-x ${
                  brandSubTab === t.id 
                    ? 'bg-white border-slate-200 text-slate-900 border-b-white -mb-px' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            ))}
          </div>

          {/* Sub-tab Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* 1. BRAND IDENTITY */}
            {brandSubTab === 'identity' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Brand Information</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Academy naming and public metadata.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Academy Name *</label>
                    <input 
                      value={theme.identity.academyName} 
                      onChange={e => { setTheme(p => ({ ...p, identity: { ...p.identity, academyName: e.target.value } })); setIsDirty(true) }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Short Name / Code</label>
                    <input 
                      value={theme.identity.shortName} 
                      onChange={e => { setTheme(p => ({ ...p, identity: { ...p.identity, shortName: e.target.value } })); setIsDirty(true) }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tagline</label>
                    <input 
                      value={theme.identity.tagline} 
                      onChange={e => { setTheme(p => ({ ...p, identity: { ...p.identity, tagline: e.target.value } })); setIsDirty(true) }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" 
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Brand Assets & Logos</h2>
                  
                  {/* Main Logo */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Main Academy Logo</span>
                      <span className="text-[10px] text-slate-400">PNG / SVG • Max 2MB</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden font-black text-xs text-slate-400">
                        {theme.identity.mainLogoUrl ? (
                          <img src={theme.identity.mainLogoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                        ) : (
                          "LOGO"
                        )}
                      </div>
                      <button 
                        onClick={() => logoInputRef.current?.click()}
                        disabled={isUploadingLogo}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        {isUploadingLogo ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-slate-500" />}
                        {isUploadingLogo ? "Uploading..." : "Upload Image"}
                      </button>
                      <input 
                        type="file" 
                        ref={logoInputRef} 
                        accept="image/*"
                        className="hidden" 
                        onChange={e => handleFileUpload(e, 'mainLogoUrl')} 
                      />
                    </div>
                  </div>

                  {/* Login Logo & Favicon Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                      <span className="text-xs font-bold text-slate-800 block">Favicon</span>
                      <button 
                        onClick={() => faviconInputRef.current?.click()} 
                        className="w-full py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3 h-3 text-slate-400" />
                        {theme.identity.faviconUrl ? "Change Favicon" : "Upload Favicon"}
                      </button>
                      <input 
                        type="file" 
                        ref={faviconInputRef} 
                        accept="image/*"
                        className="hidden" 
                        onChange={e => handleFileUpload(e, 'faviconUrl')} 
                      />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                      <span className="text-xs font-bold text-slate-800 block">Mobile Logo</span>
                      <button 
                        onClick={() => mobileLogoInputRef.current?.click()} 
                        className="w-full py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3 h-3 text-slate-400" />
                        {theme.identity.mobileLogoUrl ? "Change Mobile" : "Upload Mobile"}
                      </button>
                      <input 
                        type="file" 
                        ref={mobileLogoInputRef} 
                        accept="image/*"
                        className="hidden" 
                        onChange={e => handleFileUpload(e, 'mobileLogoUrl')} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. DESIGN TOKENS & COLORS */}
            {brandSubTab === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Color Presets</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Quickly apply curated color themes across your workspace.</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {COLOR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyPreset(preset)}
                        className="p-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-teal-500 text-left transition-all group"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.secondary }} />
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.accent }} />
                        </div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700 block">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Design Token Swatches</h2>
                  
                  {[
                    { key: 'primary', label: 'Primary Accent Color', desc: 'Used for main CTA buttons, active sidebar items, and highlights.' },
                    { key: 'secondary', label: 'Secondary Color', desc: 'Used for badges, highlights, and secondary actions.' },
                    { key: 'accent', label: 'Accent Highlight', desc: 'Used for alerts, banners, and feature tags.' },
                    { key: 'background', label: 'Workspace Background', desc: 'Canvas background for LMS and CRM screens.' },
                    { key: 'surface', label: 'Surface / Panel Color', desc: 'Cards, headers, and modal backgrounds.' },
                    { key: 'text', label: 'Primary Text Color', desc: 'Body text and heading labels.' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                        <span className="text-[11px] text-slate-500">{item.desc}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={(theme.colors as any)[item.key]} 
                          onChange={e => updateColor(item.key as any, e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-xs font-mono font-bold text-slate-700 uppercase">{(theme.colors as any)[item.key]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TYPOGRAPHY & UI STYLE */}
            {brandSubTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Typography Settings</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Select primary fonts for headings and body content.</p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Font Family</label>
                      <select 
                        value={theme.typography.fontFamily}
                        onChange={e => { setTheme(p => ({ ...p, typography: { ...p.typography, fontFamily: e.target.value } })); setIsDirty(true) }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white"
                      >
                        <option value="Inter">Inter (Clean Modern Sans)</option>
                        <option value="Outfit">Outfit (Geometric & Tech)</option>
                        <option value="Roboto">Roboto (Classic Universal)</option>
                        <option value="Playfair Display">Playfair Display (Academic Serif)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">UI Corner Radius & Density</h2>
                  
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Border Corner Radius</span>
                      <span>{theme.uiStyle.borderRadius}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="20" 
                      value={theme.uiStyle.borderRadius}
                      onChange={e => { setTheme(p => ({ ...p, uiStyle: { ...p.uiStyle, borderRadius: parseInt(e.target.value) } })); setIsDirty(true) }}
                      className="w-full accent-teal-600"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[
                      { key: 'ROUNDED', label: 'Rounded' },
                      { key: 'PILL', label: 'Pill' },
                      { key: 'SHARP', label: 'Sharp' },
                    ].map(btn => (
                      <button
                        key={btn.key}
                        onClick={() => { setTheme(p => ({ ...p, uiStyle: { ...p.uiStyle, buttonStyle: btn.key as any } })); setIsDirty(true) }}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          theme.uiStyle.buttonStyle === btn.key 
                            ? 'bg-teal-50 border-teal-500 text-teal-800' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. LOGIN PORTAL CUSTOMIZATION */}
            {brandSubTab === 'login' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Login Page Hero & Branding</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Customize student and instructor sign-in portal appearance.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Welcome Heading</label>
                    <input 
                      value={theme.loginPage.welcomeHeading}
                      onChange={e => { setTheme(p => ({ ...p, loginPage: { ...p.loginPage, welcomeHeading: e.target.value } })); setIsDirty(true) }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Description Subtext</label>
                    <textarea 
                      rows={2}
                      value={theme.loginPage.description}
                      onChange={e => { setTheme(p => ({ ...p, loginPage: { ...p.loginPage, description: e.target.value } })); setIsDirty(true) }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Login Button Text</label>
                    <input 
                      value={theme.loginPage.buttonText}
                      onChange={e => { setTheme(p => ({ ...p, loginPage: { ...p.loginPage, buttonText: e.target.value } })); setIsDirty(true) }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Show "Powered by GECHO"</span>
                      <span className="text-[11px] text-slate-500">Gated by SaaS Plan (Enterprise allows hiding)</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={theme.loginPage.showEchoBranding}
                      onChange={e => { setTheme(p => ({ ...p, loginPage: { ...p.loginPage, showEchoBranding: e.target.checked } })); setIsDirty(true) }}
                      className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. VERSION HISTORY & RESTORE */}
            {brandSubTab === 'history' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Theme Version Log</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Audit history of published themes and restore prior versions.</p>
                </div>

                <div className="space-y-3">
                  {versions.map((ver, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 text-[11px] font-black rounded-full border border-teal-200">
                          Version {ver.version} {ver.version === theme.version ? "(Current)" : ""}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{ver.publishedAt}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{ver.summary}</p>
                      <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-200/60">
                        <span className="text-slate-400 font-medium">By: {ver.publishedBy}</span>
                        {ver.version !== theme.version && (
                          <button 
                            onClick={() => handleRestoreVersion(ver)}
                            className="text-teal-700 font-bold hover:underline flex items-center gap-1"
                          >
                            Restore Draft <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Interactive Live Preview Panel */}
        <div className="flex-1 bg-slate-100 p-6 flex flex-col overflow-hidden">
          
          {/* Preview Header Actions */}
          <div className="flex-none bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview Context:</span>
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'lms', label: 'LMS Courses' },
                { id: 'crm', label: 'CRM Leads' },
                { id: 'login', label: 'Login Portal' },
              ].map(pv => (
                <button
                  key={pv.id}
                  onClick={() => setPreviewView(pv.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    previewView === pv.id 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pv.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setViewportMode('desktop')} 
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${viewportMode === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'}`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button 
                onClick={() => setViewportMode('mobile')} 
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${viewportMode === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'}`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>
          </div>

          {/* Dynamic Live Canvas Container */}
          <div className="flex-1 flex items-center justify-center overflow-auto">
            <div 
              style={{
                width: viewportMode === 'mobile' ? '375px' : '100%',
                maxHeight: '100%',
                borderRadius: `${theme.uiStyle.borderRadius}px`,
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
              }}
              className="h-full border border-slate-300 shadow-md flex flex-col overflow-hidden transition-all duration-300 relative"
            >
              
              {/* PREVIEW 1: DASHBOARD VIEW */}
              {previewView === 'dashboard' && (
                <div className="flex h-full overflow-hidden">
                  {/* Sidebar */}
                  <div className="w-56 border-r border-slate-200/80 p-4 space-y-4 flex-none bg-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: theme.colors.primary }}>
                        {theme.identity.shortName ? theme.identity.shortName.slice(0, 2).toUpperCase() : "GC"}
                      </div>
                      <div>
                        <h3 className="text-xs font-black leading-tight text-slate-900">{theme.identity.academyName}</h3>
                        <p className="text-[10px] text-slate-400">Academy CRM</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between text-white" style={{ backgroundColor: theme.colors.primary }}>
                        <span>Dashboard</span>
                        <span className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Students</div>
                      <div className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Courses</div>
                      <div className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Live Studio</div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-black">{theme.identity.academyName} Overview</h2>
                        <p className="text-xs text-slate-500">{theme.identity.tagline}</p>
                      </div>
                      <button 
                        className="px-4 py-2 text-xs font-bold text-white rounded-lg transition-all"
                        style={{ backgroundColor: theme.colors.primary, borderRadius: `${theme.uiStyle.borderRadius}px` }}
                      >
                        + Quick Action
                      </button>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Active Students", val: "1,248", change: "+12%" },
                        { label: "Course Revenue", val: "₹4.8L", change: "+24%" },
                        { label: "Live Classes", val: "8 Today", change: "On Track" },
                      ].map((m, i) => (
                        <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{m.label}</span>
                          <span className="text-xl font-black text-slate-900 block">{m.val}</span>
                          <span className="text-[10px] font-bold text-emerald-600">{m.change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW 2: LMS COURSES VIEW */}
              {previewView === 'lms' && (
                <div className="p-6 space-y-4 overflow-y-auto h-full">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <div>
                      <h2 className="text-lg font-black">Course Catalog</h2>
                      <p className="text-xs text-slate-500">Explore industry certified training tracks</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-full">
                      {theme.identity.academyName} LMS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: "Full Stack MERN Development", duration: "12 Weeks", fee: "₹24,999" },
                      { title: "UI/UX Product Design Masterclass", duration: "8 Weeks", fee: "₹18,500" }
                    ].map((c, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs">
                        <div className="w-full h-24 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-400">
                          COURSE THUMBNAIL
                        </div>
                        <h3 className="font-bold text-sm text-slate-900">{c.title}</h3>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">{c.duration}</span>
                          <span className="font-black text-slate-900">{c.fee}</span>
                        </div>
                        <button 
                          className="w-full py-2 text-xs font-bold text-white rounded-lg transition-all"
                          style={{ backgroundColor: theme.colors.primary, borderRadius: `${theme.uiStyle.borderRadius}px` }}
                        >
                          Enroll Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PREVIEW 3: CRM LEADS VIEW */}
              {previewView === 'crm' && (
                <div className="p-6 space-y-4 overflow-y-auto h-full">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-black">Admission Leads Pipeline</h2>
                    <button className="px-3 py-1.5 text-xs font-bold text-white rounded-lg" style={{ backgroundColor: theme.colors.primary }}>
                      + Add Lead
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {['New Inquiries', 'Demo Attended', 'Enrolled'].map((stage, sIdx) => (
                      <div key={sIdx} className="bg-slate-100/70 p-3 rounded-xl space-y-2 border border-slate-200/60">
                        <span className="text-xs font-bold text-slate-600 block">{stage}</span>
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
                          <span className="text-xs font-bold text-slate-900 block">Rahul Sharma</span>
                          <span className="text-[10px] text-slate-400 block">Python Data Science</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PREVIEW 4: LOGIN PORTAL VIEW */}
              {previewView === 'login' && (
                <div className="h-full flex items-center justify-center p-6 bg-slate-50">
                  <div className="max-w-sm w-full bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm text-center">
                    <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center font-black text-white text-lg" style={{ backgroundColor: theme.colors.primary }}>
                      {theme.identity.shortName ? theme.identity.shortName.slice(0, 2) : "GC"}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">{theme.loginPage.welcomeHeading}</h2>
                      <p className="text-xs text-slate-500 mt-1">{theme.loginPage.description}</p>
                    </div>
                    <div className="space-y-3 text-left">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Email Address</label>
                        <input disabled placeholder="student@academy.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Password</label>
                        <input disabled type="password" value="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs" />
                      </div>
                    </div>
                    <button 
                      className="w-full py-3 text-xs font-bold text-white rounded-xl shadow-xs"
                      style={{ backgroundColor: theme.colors.primary, borderRadius: `${theme.uiStyle.borderRadius}px` }}
                    >
                      {theme.loginPage.buttonText}
                    </button>

                    {theme.loginPage.showEchoBranding && (
                      <span className="text-[10px] text-slate-400 font-medium block">Powered by GECHO LMS Platform</span>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
