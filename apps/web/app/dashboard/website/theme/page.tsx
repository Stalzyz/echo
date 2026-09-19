"use client"

import { useState } from "react"
import { 
  Palette, Save, Monitor, Smartphone, Layout, Type, 
  Sparkles, Layers, Check, Image as ImageIcon, Eye, ArrowRight
} from "lucide-react"
import { toast } from "sonner"

export default function ThemeCustomizerPage() {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop")
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "hero" | "sections">("colors")
  const [isSaving, setIsSaving] = useState(false)

  // Live Theme Customizer State
  const [theme, setTheme] = useState({
    preset: "Teal Enterprise",
    primaryColor: "#0d9488",
    secondaryColor: "#f59e0b",
    fontFamily: "Inter",
    heroTitle: "Master In-Demand Skills with Echo Academy",
    heroSubhead: "Industry-aligned curriculums, live mentorship, and verified certifications.",
    ctaLabel: "Browse Courses",
    showHero: true,
    showFeatures: true,
    showCourses: true,
    showTestimonials: true,
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { ApiClient } = await import("@/lib/api")
      await ApiClient.patch("/settings/organization", {
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
      })

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("organization-updated", {
            detail: {
              primaryColor: theme.primaryColor,
              secondaryColor: theme.secondaryColor,
            },
          })
        )
      }
      toast.success("Theme settings published to live academy website!")
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to publish theme settings: " + (err.message || "Unknown error"))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Top Action Bar */}
      <div className="flex-none px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Shopify-Style Theme Customizer</h1>
            <p className="text-xs text-slate-500 font-medium">Customize academy branding, fonts, hero banners, and section layout live.</p>
          </div>
        </div>

        {/* Viewport Switcher & Save Button */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button 
              onClick={() => setViewport("desktop")}
              className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewport === "desktop" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Monitor className="w-4 h-4" /> Desktop
            </button>
            <button 
              onClick={() => setViewport("mobile")}
              className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewport === "mobile" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-4 h-4" /> Mobile
            </button>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
          >
            <Save className="w-4 h-4" /> Publish Theme
          </button>
        </div>
      </div>

      {/* Main Split View: Left Controls Drawer vs Right Live Viewport */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Settings Drawer */}
        <div className="w-80 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 pb-2 gap-2 text-xs font-bold text-slate-500">
            <button 
              onClick={() => setActiveTab("colors")}
              className={`pb-2 border-b-2 transition-all ${activeTab === "colors" ? "border-teal-600 text-teal-700 font-extrabold" : "border-transparent hover:text-slate-900"}`}
            >
              Colors
            </button>
            <button 
              onClick={() => setActiveTab("typography")}
              className={`pb-2 border-b-2 transition-all ${activeTab === "typography" ? "border-teal-600 text-teal-700 font-extrabold" : "border-transparent hover:text-slate-900"}`}
            >
              Fonts
            </button>
            <button 
              onClick={() => setActiveTab("hero")}
              className={`pb-2 border-b-2 transition-all ${activeTab === "hero" ? "border-teal-600 text-teal-700 font-extrabold" : "border-transparent hover:text-slate-900"}`}
            >
              Hero
            </button>
            <button 
              onClick={() => setActiveTab("sections")}
              className={`pb-2 border-b-2 transition-all ${activeTab === "sections" ? "border-teal-600 text-teal-700 font-extrabold" : "border-transparent hover:text-slate-900"}`}
            >
              Sections
            </button>
          </div>

          {/* Tab 1: Colors & Presets */}
          {activeTab === "colors" && (
            <div className="space-y-6 text-xs">
              <div>
                <label className="font-black uppercase tracking-wider text-slate-400 block mb-3">Theme Presets</label>
                <div className="space-y-2">
                  {[
                    { name: "Teal Enterprise", color: "#0d9488" },
                    { name: "Amber Studio", color: "#f59e0b" },
                    { name: "Emerald Learn", color: "#059669" },
                    { name: "Royal Indigo", color: "#4f46e5" },
                  ].map((preset, i) => (
                    <button 
                      key={i}
                      onClick={() => setTheme(p => ({ ...p, preset: preset.name, primaryColor: preset.color }))}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        theme.primaryColor === preset.color ? "border-teal-500 bg-teal-50/50 font-bold" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border border-slate-300" style={{ backgroundColor: preset.color }} />
                        <span className="text-slate-900">{preset.name}</span>
                      </div>
                      {theme.primaryColor === preset.color && <Check className="w-4 h-4 text-teal-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-black uppercase tracking-wider text-slate-400 block mb-2">Custom Accent Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={theme.primaryColor} onChange={e => setTheme(p => ({ ...p, primaryColor: e.target.value }))} className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200" />
                  <span className="font-mono font-bold text-slate-800">{theme.primaryColor}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Typography */}
          {activeTab === "typography" && (
            <div className="space-y-4 text-xs">
              <label className="font-black uppercase tracking-wider text-slate-400 block mb-2">Primary Font Family</label>
              {["Inter", "Outfit", "Roboto", "Playfair Display"].map(font => (
                <button 
                  key={font}
                  onClick={() => setTheme(p => ({ ...p, fontFamily: font }))}
                  className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                    theme.fontFamily === font ? "border-teal-500 bg-teal-50/50 text-teal-800" : "border-slate-200 text-slate-700"
                  }`}
                >
                  {font} Font
                </button>
              ))}
            </div>
          )}

          {/* Tab 3: Hero Config */}
          {activeTab === "hero" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hero Title</label>
                <textarea rows={2} value={theme.heroTitle} onChange={e => setTheme(p => ({ ...p, heroTitle: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold resize-none" />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hero Subtitle</label>
                <textarea rows={3} value={theme.heroSubhead} onChange={e => setTheme(p => ({ ...p, heroSubhead: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 resize-none" />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">CTA Button Text</label>
                <input type="text" value={theme.ctaLabel} onChange={e => setTheme(p => ({ ...p, ctaLabel: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold" />
              </div>
            </div>
          )}

          {/* Tab 4: Section Visibility */}
          {activeTab === "sections" && (
            <div className="space-y-3 text-xs">
              <label className="font-black uppercase tracking-wider text-slate-400 block mb-2">Storefront Sections</label>
              
              <ToggleSection label="Hero Header Banner" checked={theme.showHero} onChange={v => setTheme(p => ({ ...p, showHero: v }))} />
              <ToggleSection label="Platform Features Grid" checked={theme.showFeatures} onChange={v => setTheme(p => ({ ...p, showFeatures: v }))} />
              <ToggleSection label="Active Course Catalog" checked={theme.showCourses} onChange={v => setTheme(p => ({ ...p, showCourses: v }))} />
              <ToggleSection label="Student Testimonials" checked={theme.showTestimonials} onChange={v => setTheme(p => ({ ...p, showTestimonials: v }))} />
            </div>
          )}

        </div>

        {/* Right Live Viewport Preview Frame */}
        <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex items-center justify-center custom-scrollbar">
          
          <div 
            className={`bg-white rounded-3xl border border-slate-200 shadow-2xl transition-all overflow-hidden ${
              viewport === "desktop" ? "w-full max-w-4xl min-h-[600px]" : "w-[360px] min-h-[640px]"
            }`}
          >
            {/* Storefront Header */}
            <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <div className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs" style={{ backgroundColor: theme.primaryColor }}>
                  G
                </div>
                Echo Academy
              </div>
              <button className="px-4 py-2 text-white font-bold text-xs rounded-xl shadow-xs" style={{ backgroundColor: theme.primaryColor }}>
                Sign In
              </button>
            </div>

            {/* Storefront Hero Section */}
            {theme.showHero && (
              <div className="p-12 text-center border-b border-slate-100" style={{ backgroundColor: `${theme.primaryColor}08` }}>
                <h1 className="text-3xl font-black text-slate-900 max-w-xl mx-auto leading-tight" style={{ fontFamily: theme.fontFamily }}>
                  {theme.heroTitle}
                </h1>
                <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto font-medium">
                  {theme.heroSubhead}
                </p>
                <button className="mt-6 px-8 py-3 text-white font-extrabold text-sm rounded-2xl shadow-sm flex items-center gap-2 mx-auto" style={{ backgroundColor: theme.primaryColor }}>
                  {theme.ctaLabel} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Course Listing Mockup */}
            {theme.showCourses && (
              <div className="p-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Featured Curriculums</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-700">ONSITE BATCH</div>
                    <div className="font-bold text-slate-900 mt-1">Full Stack Web Development</div>
                    <div className="text-xs text-slate-500 mt-1">3 Months • ₹50,000</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-700">ONLINE BATCH</div>
                    <div className="font-bold text-slate-900 mt-1">UI/UX Masterclass</div>
                    <div className="text-xs text-slate-500 mt-1">2 Months • ₹35,000</div>
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

function ToggleSection({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
      <span className="text-xs font-bold text-slate-800">{label}</span>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-teal-600" : "bg-slate-300"}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${checked ? "left-5.5" : "left-0.5"}`} />
      </button>
    </div>
  )
}
