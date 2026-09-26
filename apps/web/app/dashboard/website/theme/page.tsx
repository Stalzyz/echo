"use client"

import { useState } from "react"
import { 
  Palette, Save, Monitor, Smartphone, Layers, Check, Image as ImageIcon, 
  ArrowRight, ChevronLeft, ChevronRight, Plus, Trash2, Star, Building2, 
  Users, Briefcase, Award, GraduationCap, Globe, Sparkles, Sliders, Type
} from "lucide-react"
import { toast } from "sonner"

export default function LandingPageCustomizerPage() {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop")
  const [activeTab, setActiveTab] = useState<"branding" | "hero" | "sections" | "logos" | "cta_gallery">("hero")
  const [isSaving, setIsSaving] = useState(false)

  // Landing Page Configuration State
  const [theme, setTheme] = useState({
    preset: "Teal Enterprise",
    primaryColor: "#0d9488",
    secondaryColor: "#f59e0b",
    accentColor: "#6366f1",
    fontFamily: "Inter",
    
    // Hero & Slideshow State
    heroTitle: "Master In-Demand Skills with Echo Academy",
    heroSubhead: "Industry-aligned curriculums, live mentorship, and verified certifications for next-gen leaders.",
    ctaLabel: "Explore Curriculums",
    heroSlides: [
      { title: "Master In-Demand Skills with Echo Academy", sub: "Industry-aligned curriculums & real-world projects.", cta: "Explore Curriculums" },
      { title: "100% Placement Assistance & Mentorship", sub: "Get hired by top tech companies and digital agencies.", cta: "Book Free Consultation" },
      { title: "Interactive Live Classes & Hybrid Campus", sub: "Learn online remotely or at our state-of-the-art campus.", cta: "Apply for Next Batch" },
    ],
    activeSlideIdx: 0,

    // Partner Logos Bar
    logoBarTitle: "Trusted by Leading Tech Companies & Hiring Partners",
    partnerLogos: [
      { name: "Google", logo: "G" },
      { name: "Amazon", logo: "A" },
      { name: "Microsoft", logo: "M" },
      { name: "Meta", logo: "∞" },
      { name: "TCS", logo: "T" },
      { name: "Infosys", logo: "I" }
    ],

    // Featured Courses Grid
    coursesTitle: "Featured Academy Curriculums",
    coursesSubtitle: "Comprehensive career tracks designed with industry experts.",

    // Platform Features Grid
    featuresTitle: "Why Choose Echo Academy?",
    features: [
      { title: "1-on-1 Mentorship", desc: "Weekly dedicated feedback from top industry senior engineers.", icon: "Users" },
      { title: "Live Real-World Projects", desc: "Build production-grade applications for your portfolio.", icon: "Briefcase" },
      { title: "Guaranteed Placement Support", desc: "Resume building, mock interviews, and direct employer referrals.", icon: "Award" },
      { title: "LMS & Mobile Learning", desc: "24/7 access to recordings, assignments, and verified certificates.", icon: "GraduationCap" }
    ],

    // Slideshow / Testimonials Carousel
    carouselTitle: "Student Success Stories & Reviews",
    activeCarouselIdx: 0,
    testimonials: [
      { name: "Rahul Sharma", role: "Frontend Developer @ TechCorp", text: "Echo Academy's live projects helped me switch careers within 4 months! The mentors are incredible.", rating: 5 },
      { name: "Ananya Roy", role: "UI/UX Designer @ Creative Agency", text: "The 1-on-1 mentorship and practical design feedback were completely unmatched anywhere else.", rating: 5 },
      { name: "Priya Patel", role: "Full Stack Engineer @ Global Startup", text: "Best decision of my career! The placement team got me 3 interview calls within my first week of graduation.", rating: 5 },
    ],

    // Call to Action (CTA) Banner
    ctaTitle: "Ready to Accelerate Your Career?",
    ctaSubtitle: "Join over 5,000+ graduates already learning with Echo Academy. Admissions open for Next Batch!",
    ctaButtonText: "Book Free Demo Session",

    // Gallery Grid
    galleryTitle: "Life at Echo Campus & Live Studio",
    galleryImages: [
      { title: "State-of-the-Art Mac Lab", category: "Campus" },
      { title: "Live Workshop & Hackathon", category: "Events" },
      { title: "Student Convocation Day", category: "Placement" },
      { title: "1-on-1 Mentorship Session", category: "Mentorship" },
    ],

    // Section Visibility Toggles
    showHero: true,
    showLogos: true,
    showCourses: true,
    showFeatures: true,
    showCarousel: true,
    showCta: true,
    showGallery: true,
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
      toast.success("Academy Landing Page customizer settings published live!")
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to publish landing page settings: " + (err.message || "Unknown error"))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Top Header & Viewport Bar */}
      <div className="flex-none px-6 py-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Academy Landing Page Customizer</h1>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase">Live Builder</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Customize hero slideshow, partner logos, featured courses, carousel, CTA, and photo gallery.</p>
          </div>
        </div>

        {/* Viewport Mode Switcher & Save Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
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
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0"
          >
            <Save className="w-4 h-4" /> Publish Landing Page
          </button>
        </div>
      </div>

      {/* Main Builder: Left Editor Drawer vs Right Live Preview */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Control Drawer */}
        <div className="w-96 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          {/* Section Navigation Tabs */}
          <div className="flex border-b border-slate-200 pb-2 gap-1.5 text-xs font-bold text-slate-500 overflow-x-auto scrollbar-none flex-nowrap">
            {[
              { id: "hero", label: "Hero & Slides" },
              { id: "branding", label: "Branding" },
              { id: "sections", label: "Sections" },
              { id: "logos", label: "Logos" },
              { id: "cta_gallery", label: "CTA & Gallery" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 px-1 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "border-teal-600 text-teal-700 font-extrabold" : "border-transparent hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: HERO & SLIDESHOW */}
          {activeTab === "hero" && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-black uppercase tracking-wider text-slate-400">Hero Slideshow Settings</span>
                <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full">{theme.heroSlides.length} Slides</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Active Slide Index</label>
                <div className="flex gap-2">
                  {theme.heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTheme(p => ({ ...p, activeSlideIdx: i }))}
                      className={`flex-1 py-1.5 rounded-lg border font-bold text-xs ${
                        theme.activeSlideIdx === i ? "bg-teal-600 text-white border-teal-600" : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      Slide #{i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hero Main Title</label>
                <textarea 
                  rows={2} 
                  value={theme.heroSlides[theme.activeSlideIdx]?.title || theme.heroTitle} 
                  onChange={e => {
                    const newTitle = e.target.value
                    setTheme(p => {
                      const updatedSlides = [...p.heroSlides]
                      if (updatedSlides[p.activeSlideIdx]) updatedSlides[p.activeSlideIdx].title = newTitle
                      return { ...p, heroTitle: newTitle, heroSlides: updatedSlides }
                    })
                  }} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold resize-none focus:outline-teal-600" 
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hero Subtitle</label>
                <textarea 
                  rows={3} 
                  value={theme.heroSlides[theme.activeSlideIdx]?.sub || theme.heroSubhead} 
                  onChange={e => {
                    const newSub = e.target.value
                    setTheme(p => {
                      const updatedSlides = [...p.heroSlides]
                      if (updatedSlides[p.activeSlideIdx]) updatedSlides[p.activeSlideIdx].sub = newSub
                      return { ...p, heroSubhead: newSub, heroSlides: updatedSlides }
                    })
                  }} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium resize-none focus:outline-teal-600" 
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">CTA Button Label</label>
                <input 
                  type="text" 
                  value={theme.heroSlides[theme.activeSlideIdx]?.cta || theme.ctaLabel} 
                  onChange={e => {
                    const newCta = e.target.value
                    setTheme(p => {
                      const updatedSlides = [...p.heroSlides]
                      if (updatedSlides[p.activeSlideIdx]) updatedSlides[p.activeSlideIdx].cta = newCta
                      return { ...p, ctaLabel: newCta, heroSlides: updatedSlides }
                    })
                  }} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold focus:outline-teal-600" 
                />
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING */}
          {activeTab === "branding" && (
            <div className="space-y-5 text-xs">
              <div>
                <label className="font-black uppercase tracking-wider text-slate-400 block mb-3">Color Presets</label>
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
                <label className="font-black uppercase tracking-wider text-slate-400 block mb-2">Custom Primary Accent Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={theme.primaryColor} onChange={e => setTheme(p => ({ ...p, primaryColor: e.target.value }))} className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200" />
                  <span className="font-mono font-bold text-slate-800">{theme.primaryColor}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <label className="font-black uppercase tracking-wider text-slate-400 block mb-2">Primary Typography</label>
                {["Inter", "Outfit", "Roboto", "Playfair Display"].map(font => (
                  <button 
                    key={font}
                    onClick={() => setTheme(p => ({ ...p, fontFamily: font }))}
                    className={`w-full p-2.5 mb-2 rounded-xl border text-left font-bold transition-all ${
                      theme.fontFamily === font ? "border-teal-500 bg-teal-50/50 text-teal-800" : "border-slate-200 text-slate-700"
                    }`}
                  >
                    {font} Font
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SECTIONS TOGGLE */}
          {activeTab === "sections" && (
            <div className="space-y-3 text-xs">
              <label className="font-black uppercase tracking-wider text-slate-400 block mb-2">Enable / Disable Page Sections</label>
              
              <ToggleSection label="Hero Slideshow Banner" checked={theme.showHero} onChange={v => setTheme(p => ({ ...p, showHero: v }))} />
              <ToggleSection label="Hiring Partners / Logo Bar" checked={theme.showLogos} onChange={v => setTheme(p => ({ ...p, showLogos: v }))} />
              <ToggleSection label="Featured Courses Grid" checked={theme.showCourses} onChange={v => setTheme(p => ({ ...p, showCourses: v }))} />
              <ToggleSection label="Why Choose Us / Features" checked={theme.showFeatures} onChange={v => setTheme(p => ({ ...p, showFeatures: v }))} />
              <ToggleSection label="Testimonials / Review Carousel" checked={theme.showCarousel} onChange={v => setTheme(p => ({ ...p, showCarousel: v }))} />
              <ToggleSection label="High-Impact CTA Banner" checked={theme.showCta} onChange={v => setTheme(p => ({ ...p, showCta: v }))} />
              <ToggleSection label="Campus Photo Gallery Grid" checked={theme.showGallery} onChange={v => setTheme(p => ({ ...p, showGallery: v }))} />
            </div>
          )}

          {/* TAB 4: LOGOS & PARTNERS */}
          {activeTab === "logos" && (
            <div className="space-y-4 text-xs">
              <label className="font-black uppercase tracking-wider text-slate-400 block mb-1">Partner Logos Bar</label>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Bar Title</label>
                <input 
                  type="text" 
                  value={theme.logoBarTitle} 
                  onChange={e => setTheme(p => ({ ...p, logoBarTitle: e.target.value }))} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold" 
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-2">Partner Companies ({theme.partnerLogos.length})</label>
                <div className="grid grid-cols-2 gap-2">
                  {theme.partnerLogos.map((partner, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-200 font-bold flex items-center justify-center text-slate-700 text-xs">
                          {partner.logo}
                        </span>
                        <span className="font-bold text-slate-800">{partner.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CTA & GALLERY */}
          {activeTab === "cta_gallery" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-black uppercase tracking-wider text-slate-400 block mb-2">CTA Banner Settings</label>
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">CTA Headline</label>
                    <input type="text" value={theme.ctaTitle} onChange={e => setTheme(p => ({ ...p, ctaTitle: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">CTA Button Label</label>
                    <input type="text" value={theme.ctaButtonText} onChange={e => setTheme(p => ({ ...p, ctaButtonText: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <label className="font-black uppercase tracking-wider text-slate-400 block mb-2">Photo Gallery Title</label>
                <input type="text" value={theme.galleryTitle} onChange={e => setTheme(p => ({ ...p, galleryTitle: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold" />
              </div>
            </div>
          )}

        </div>

        {/* Right Live Viewport Preview Frame */}
        <div className="flex-1 bg-slate-100 p-6 overflow-y-auto flex items-start justify-center custom-scrollbar">
          
          <div 
            className={`bg-white rounded-3xl border border-slate-200 shadow-2xl transition-all overflow-hidden my-auto ${
              viewport === "desktop" ? "w-full max-w-4xl min-h-[700px]" : "w-[360px] min-h-[640px]"
            }`}
            style={{ fontFamily: theme.fontFamily }}
          >
            {/* 1. Header */}
            <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-30 shadow-2xs">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <div className="w-8 h-8 rounded-xl text-white font-black flex items-center justify-center text-sm shadow-xs" style={{ backgroundColor: theme.primaryColor }}>
                  E
                </div>
                Echo Academy
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-white font-bold text-xs rounded-xl shadow-xs" style={{ backgroundColor: theme.primaryColor }}>
                  Sign In
                </button>
              </div>
            </div>

            {/* 2. Hero & Slideshow Section */}
            {theme.showHero && (
              <div className="p-10 text-center border-b border-slate-100 relative overflow-hidden" style={{ backgroundColor: `${theme.primaryColor}08` }}>
                <div className="max-w-2xl mx-auto space-y-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs inline-block" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}30`, backgroundColor: `${theme.primaryColor}15` }}>
                    🚀 Admissions Open for 2026 Batches
                  </span>
                  
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {theme.heroSlides[theme.activeSlideIdx]?.title || theme.heroTitle}
                  </h1>
                  
                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
                    {theme.heroSlides[theme.activeSlideIdx]?.sub || theme.heroSubhead}
                  </p>

                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button className="px-7 py-3 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2" style={{ backgroundColor: theme.primaryColor }}>
                      {theme.heroSlides[theme.activeSlideIdx]?.cta || theme.ctaLabel} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Slideshow Controls / Navigation Dots */}
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button 
                      onClick={() => setTheme(p => ({ ...p, activeSlideIdx: (p.activeSlideIdx - 1 + p.heroSlides.length) % p.heroSlides.length }))}
                      className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-2xs hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    {theme.heroSlides.map((_, i) => (
                      <span 
                        key={i} 
                        onClick={() => setTheme(p => ({ ...p, activeSlideIdx: i }))}
                        className={`h-2 rounded-full cursor-pointer transition-all ${theme.activeSlideIdx === i ? "w-6" : "w-2 bg-slate-300"}`}
                        style={{ backgroundColor: theme.activeSlideIdx === i ? theme.primaryColor : undefined }}
                      />
                    ))}
                    <button 
                      onClick={() => setTheme(p => ({ ...p, activeSlideIdx: (p.activeSlideIdx + 1) % p.heroSlides.length }))}
                      className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-2xs hover:bg-slate-50"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Partner Logos Bar Section */}
            {theme.showLogos && (
              <div className="py-6 px-8 border-b border-slate-100 bg-slate-50/60 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">
                  {theme.logoBarTitle}
                </span>
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                  {theme.partnerLogos.map((partner, idx) => (
                    <div key={idx} className="flex items-center gap-2 font-black text-slate-400 hover:text-slate-700 transition-colors">
                      <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-extrabold text-xs shadow-2xs text-slate-600">
                        {partner.logo}
                      </span>
                      <span className="text-xs font-extrabold tracking-tight">{partner.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Featured Courses Section */}
            {theme.showCourses && (
              <div className="p-8 border-b border-slate-100">
                <div className="text-center max-w-md mx-auto mb-6">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{theme.coursesTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{theme.coursesSubtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 hover:border-teal-500/50 rounded-2xl p-5 shadow-2xs transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase border border-amber-200">🏫 Onsite Campus</span>
                      <span className="text-xs font-black text-slate-900">₹50,000</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Full Stack Web Development (MERN + AI)</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">Master React, Node.js, Next.js, and build production AI web applications with 1-on-1 mentorship.</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-bold">
                      <span>⏱️ 16 Weeks</span>
                      <span style={{ color: theme.primaryColor }}>View Curriculum →</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 hover:border-teal-500/50 rounded-2xl p-5 shadow-2xs transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900 text-[10px] font-black uppercase border border-indigo-200">💻 Remote Online</span>
                      <span className="text-xs font-black text-slate-900">₹35,000</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">UI/UX Design & Product Systems</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">Learn Figma, wireframing, component design systems, and build real client portfolios.</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-bold">
                      <span>⏱️ 12 Weeks</span>
                      <span style={{ color: theme.primaryColor }}>View Curriculum →</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Features Grid Section */}
            {theme.showFeatures && (
              <div className="p-8 border-b border-slate-100 bg-slate-50/40">
                <h3 className="text-lg font-black text-slate-900 text-center mb-6">{theme.featuresTitle}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {theme.features.map((feat, idx) => (
                    <div key={idx} className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}>
                        {idx === 0 ? <Users className="w-4 h-4" /> : idx === 1 ? <Briefcase className="w-4 h-4" /> : idx === 2 ? <Award className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-xs">{feat.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Slideshow Testimonials Carousel Section */}
            {theme.showCarousel && (
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-slate-900">{theme.carouselTitle}</h3>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => setTheme(p => ({ ...p, activeCarouselIdx: (p.activeCarouselIdx - 1 + p.testimonials.length) % p.testimonials.length }))}
                      className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setTheme(p => ({ ...p, activeCarouselIdx: (p.activeCarouselIdx + 1) % p.testimonials.length }))}
                      className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 relative overflow-hidden space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium italic leading-relaxed">
                    "{theme.testimonials[theme.activeCarouselIdx]?.text}"
                  </p>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900">{theme.testimonials[theme.activeCarouselIdx]?.name}</h5>
                      <span className="text-[10px] text-slate-500 font-medium">{theme.testimonials[theme.activeCarouselIdx]?.role}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-100 text-teal-800">Verified Graduate</span>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Gallery Grid Section */}
            {theme.showGallery && (
              <div className="p-8 border-b border-slate-100 bg-slate-50/40">
                <h3 className="text-lg font-black text-slate-900 text-center mb-6">{theme.galleryTitle}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {theme.galleryImages.map((img, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 group hover:shadow-md transition-all">
                      <div className="h-24 rounded-xl bg-slate-100 border border-slate-200/80 flex flex-col items-center justify-center text-slate-400 text-xs font-bold gap-1 group-hover:bg-slate-200/60 transition-colors">
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                        <span>{img.category}</span>
                      </div>
                      <div className="font-extrabold text-xs text-slate-900">{img.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Call to Action (CTA) Section */}
            {theme.showCta && (
              <div className="p-10 text-center text-white relative overflow-hidden" style={{ backgroundColor: theme.primaryColor }}>
                <div className="max-w-md mx-auto space-y-3">
                  <h3 className="text-xl font-black">{theme.ctaTitle}</h3>
                  <p className="text-xs opacity-90 leading-relaxed font-medium">{theme.ctaSubtitle}</p>
                  <button className="mt-4 px-7 py-3 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-all inline-flex items-center gap-2">
                    {theme.ctaButtonText} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-6 bg-slate-900 text-slate-400 text-[11px] text-center font-medium">
              © {new Date().getFullYear()} Echo Academy. All rights reserved. Powered by Echo LMS Engine.
            </div>

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
