"use client"

import { useState } from "react"
import { 
  Package, Plus, Check, Edit3, Trash2, Layers, Zap, Users, 
  BookOpen, Globe, Award, Shield, X, Loader2, DollarSign,
  MessageCircle, Mail, ExternalLink, Tag, RefreshCw, CheckCircle2, AlertCircle
} from "lucide-react"
import { toast } from "sonner"

export interface PlatformModule {
  key: string
  name: string
  category: "Core" | "Engagement" | "Automation" | "Growth"
  description: string
}

export const ALL_PLATFORM_MODULES: PlatformModule[] = [
  // Core & Studio
  { key: "coreLms", name: "Core LMS & Course Studio", category: "Core", description: "Video hosting, DRM player, lesson builder & curriculum uploads" },
  { key: "studentPortal", name: "Student Portal & Digital ID", category: "Core", description: "Mobile-optimized student portal, assignments & digital passport" },
  { key: "quizBuilder", name: "Quizzes & Timed Assessments", category: "Core", description: "MCQ assessments, question banks & automatic scorecard generation" },
  { key: "certificates", name: "Verifiable PDF Certificates", category: "Core", description: "Automated certificate generator with public QR verification links" },
  { key: "feesEmi", name: "Fee Invoicing & EMI Plans", category: "Core", description: "Automated payment schedules, GST receipts & installment tracking" },
  { key: "customPaymentGateway", name: "Direct Payment Gateway", category: "Core", description: "Connect own Razorpay / Stripe credentials (0% platform commission)" },
  
  // Marketing & Ads Engine
  { key: "metaAdsSync", name: "Meta Ads CRM Bridge (FB/IG)", category: "Growth", description: "Auto-sync Facebook & Instagram Lead Ads to CRM with instant routing" },
  { key: "googleAdsSync", name: "Google Ads & Conversion Sync", category: "Growth", description: "Direct webhook listener for Google Search/PMax leads & conversion API" },
  { key: "landingPages", name: "Storefront & Theme Builder", category: "Growth", description: "Custom academy homepage, course storefront & landing page funnels" },
  { key: "referrals", name: "Affiliate & Student Referrals", category: "Growth", description: "Student ambassador links, coupon reward tracking & payouts" },
  { key: "marketplace", name: "Course Marketplace", category: "Growth", description: "Public course catalog to sell digital masterclasses & study material" },

  // Communications & Telephony
  { key: "callIntelligence", name: "Call Intelligence & Telephony", category: "Automation", description: "Browser click-to-call, call recording, AI transcripts & sentiment analysis" },
  { key: "whatsappAuto", name: "WhatsApp 1-Tap Cloud API", category: "Automation", description: "Official WABA broadcasts, fee due reminders & attendance alerts" },
  { key: "emailMarketing", name: "Visual Drip Email Sequences", category: "Automation", description: "Drag-and-drop workflow visual automation & drip email campaigns" },

  // Admissions & Operations
  { key: "crmPipelines", name: "Admissions CRM & Form Builder", category: "Core", description: "Kanban lead stage tracker, custom lead capture forms & demo booking" },
  { key: "walkInKiosk", name: "Campus Reception Walk-in Kiosk", category: "Engagement", description: "Tablet kiosk mode for physical visitors, OTP check-in & routing" },
  { key: "attendanceScanner", name: "Smart QR Attendance Scanner", category: "Core", description: "Fast QR code attendance check-in for students and campus faculty" },

  // Live Streaming & Mentorship
  { key: "webinars", name: "Interactive Live Webinars", category: "Engagement", description: "WebRTC live streams, pitch CTAs, live chat & evergreen replays" },
  { key: "mentorship", name: "1:1 Mentorship & Office Hours", category: "Engagement", description: "Instructor calendar booking, 1:1 paid consulting & doubt rooms" },

  // AI & Analytics
  { key: "aiLessonWriter", name: "AI Studio Course Generator", category: "Automation", description: "LLM-powered course syllabus drafting & instant quiz question writer" },
  { key: "aiRiskEngine", name: "AI Dropout & Payment Risk", category: "Growth", description: "Predictive early warning for student dropouts and overdue payments" },

  // Enterprise & Whitelabel
  { key: "whitelabel", name: "Full Whitelabel & Branding", category: "Growth", description: "Remove 'Powered by ECHO', custom logo, colors & theme CSS" },
  { key: "customDomain", name: "Custom Domain Mapping (SSL)", category: "Growth", description: "Host academy on custom domain (e.g. learn.myacademy.com) with SSL" },
  { key: "apiAccess", name: "Developer REST API & Webhooks", category: "Automation", description: "API keys, programmatic batch creation & raw webhook streaming" },
  { key: "multiBranch", name: "Multi-Branch Management", category: "Growth", description: "Manage multiple regional campus branches under a single master org" },
]

export interface PackagePlan {
  id: string
  name: string
  originalPriceYearly: number
  offerPriceYearly: number
  gstText: string
  studentLimit: number | "Unlimited"
  instructorLimit: number | "Unlimited"
  courseLimit: number | "Unlimited"
  storageGB: number | "Unlimited"
  enabledModules: Record<string, boolean>
  customPaymentLink: string
  sendEmailAutomation: boolean
  sendWhatsAppAutomation: boolean
  isPopular?: boolean
  activeSubscribers: number
  badgeText?: string
}

const INITIAL_PACKAGES: PackagePlan[] = [
  {
    id: "pkg-starter",
    name: "Starter Academy",
    originalPriceYearly: 24999,
    offerPriceYearly: 14999,
    gstText: "+ 18% GST",
    studentLimit: 500,
    instructorLimit: 5,
    courseLimit: 15,
    storageGB: 50,
    enabledModules: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      whatsappAuto: false,
      emailMarketing: false,
      webinars: false,
      whitelabel: false,
      mentorship: false,
      walkInKiosk: false,
      referrals: false,
      customPaymentGateway: true
    },
    customPaymentLink: "https://echolms.com/subscribe/starter",
    sendEmailAutomation: true,
    sendWhatsAppAutomation: true,
    activeSubscribers: 18,
    badgeText: "Save 40%"
  },
  {
    id: "pkg-growth",
    name: "Growth Institute",
    originalPriceYearly: 49999,
    offerPriceYearly: 29999,
    gstText: "+ 18% GST",
    studentLimit: 2500,
    instructorLimit: 20,
    courseLimit: 50,
    storageGB: 250,
    enabledModules: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      whatsappAuto: true,
      emailMarketing: true,
      webinars: true,
      whitelabel: true,
      mentorship: true,
      walkInKiosk: false,
      referrals: true,
      customPaymentGateway: true
    },
    customPaymentLink: "https://echolms.com/subscribe/growth",
    sendEmailAutomation: true,
    sendWhatsAppAutomation: true,
    isPopular: true,
    activeSubscribers: 54,
    badgeText: "Most Popular • 40% OFF"
  },
  {
    id: "pkg-enterprise",
    name: "Enterprise Multi-Branch",
    originalPriceYearly: 99999,
    offerPriceYearly: 69999,
    gstText: "+ 18% GST",
    studentLimit: "Unlimited",
    instructorLimit: "Unlimited",
    courseLimit: "Unlimited",
    storageGB: "Unlimited",
    enabledModules: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      whatsappAuto: true,
      emailMarketing: true,
      webinars: true,
      whitelabel: true,
      mentorship: true,
      walkInKiosk: true,
      referrals: true,
      customPaymentGateway: true
    },
    customPaymentLink: "https://echolms.com/subscribe/enterprise",
    sendEmailAutomation: true,
    sendWhatsAppAutomation: true,
    activeSubscribers: 12,
    badgeText: "Full Suite Unlocked"
  }
]

export default function PackageBuilderPage() {
  const [packages, setPackages] = useState<PackagePlan[]>(INITIAL_PACKAGES)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPkg, setEditingPkg] = useState<PackagePlan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: "",
    originalPriceYearly: 39999,
    offerPriceYearly: 24999,
    gstText: "+ 18% GST",
    studentLimit: 1000 as number | "Unlimited",
    instructorLimit: 10 as number | "Unlimited",
    courseLimit: 25 as number | "Unlimited",
    storageGB: 100 as number | "Unlimited",
    enabledModules: {
      coreLms: true,
      studentPortal: true,
      feesEmi: true,
      certificates: true,
      whatsappAuto: true,
      emailMarketing: true,
      webinars: false,
      whitelabel: true,
      mentorship: false,
      walkInKiosk: false,
      referrals: false,
      customPaymentGateway: true
    } as Record<string, boolean>,
    customPaymentLink: "https://echolms.com/subscribe/custom",
    sendEmailAutomation: true,
    sendWhatsAppAutomation: true,
    isPopular: false,
    badgeText: "Yearly Discount"
  })

  const openCreateModal = () => {
    setEditingPkg(null)
    setForm({
      name: "",
      originalPriceYearly: 39999,
      offerPriceYearly: 24999,
      gstText: "+ 18% GST",
      studentLimit: 1000,
      instructorLimit: 10,
      courseLimit: 25,
      storageGB: 100,
      enabledModules: ALL_PLATFORM_MODULES.reduce((acc, m) => {
        acc[m.key] = true
        return acc
      }, {} as Record<string, boolean>),
      customPaymentLink: "https://echolms.com/subscribe/custom",
      sendEmailAutomation: true,
      sendWhatsAppAutomation: true,
      isPopular: false,
      badgeText: "Yearly Discount"
    })
    setIsModalOpen(true)
  }

  const openEditModal = (pkg: PackagePlan) => {
    setEditingPkg(pkg)
    setForm({
      name: pkg.name,
      originalPriceYearly: pkg.originalPriceYearly,
      offerPriceYearly: pkg.offerPriceYearly,
      gstText: pkg.gstText || "+ 18% GST",
      studentLimit: pkg.studentLimit,
      instructorLimit: pkg.instructorLimit,
      courseLimit: pkg.courseLimit,
      storageGB: pkg.storageGB,
      enabledModules: { ...pkg.enabledModules },
      customPaymentLink: pkg.customPaymentLink,
      sendEmailAutomation: pkg.sendEmailAutomation,
      sendWhatsAppAutomation: pkg.sendWhatsAppAutomation,
      isPopular: !!pkg.isPopular,
      badgeText: pkg.badgeText || "Yearly Offer"
    })
    setIsModalOpen(true)
  }

  const toggleModuleInForm = (key: string) => {
    setForm(prev => ({
      ...prev,
      enabledModules: {
        ...prev.enabledModules,
        [key]: !prev.enabledModules[key]
      }
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      if (editingPkg) {
        setPackages(prev => prev.map(p => p.id === editingPkg.id ? { ...p, ...form } : p))
        toast.success(`Custom package "${form.name}" updated successfully!`)
      } else {
        const newPkg: PackagePlan = {
          id: `pkg-${Date.now()}`,
          ...form,
          activeSubscribers: 0
        }
        setPackages([...packages, newPkg])
        toast.success(`New package "${form.name}" published to landing & pricing page!`)
      }
      setIsSubmitting(false)
      setIsModalOpen(false)
    }, 500)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete package "${name}"?`)) {
      setPackages(prev => prev.filter(p => p.id !== id))
      toast.success(`Package "${name}" removed.`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex-none pb-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
              ECHO SAAS PACKAGING ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Subscription Package Builder</h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium">Customize yearly pricing (+18% GST), enable/disable platform modules, assign custom payment URLs, & configure WhatsApp/Email lead triggers.</p>
        </div>

        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Custom Package
        </button>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => {
          const discountPct = Math.round(((pkg.originalPriceYearly - pkg.offerPriceYearly) / pkg.originalPriceYearly) * 100)
          
          return (
            <div 
              key={pkg.id} 
              className={`bg-white rounded-3xl p-6 border flex flex-col justify-between relative shadow-xs transition-all ${
                pkg.isPopular ? "border-teal-500 ring-2 ring-teal-500/20" : "border-slate-200"
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  {pkg.badgeText || "Most Popular Choice"}
                </span>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{pkg.name}</h3>
                    <span className="text-xs text-slate-500 font-semibold">{pkg.activeSubscribers} Active Academies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditModal(pkg)} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(pkg.id, pkg.name)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pricing Banner */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black font-mono text-slate-900">₹{pkg.offerPriceYearly.toLocaleString()}</span>
                      <span className="text-xs font-bold text-slate-400 line-through ml-2 font-mono">₹{pkg.originalPriceYearly.toLocaleString()}</span>
                      <span className="text-xs font-black text-slate-500 block">/ year</span>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md uppercase border border-emerald-200">
                      {discountPct > 0 ? `${discountPct}% OFF` : "Yearly"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/80">
                    <span className="font-bold text-slate-600 uppercase tracking-wider">{pkg.gstText || "+ 18% GST"}</span>
                    <span className="font-mono text-teal-700 font-bold">Yearly Billing Only</span>
                  </div>
                </div>

                {/* Limits Checklist */}
                <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-2xl grid grid-cols-2 gap-2 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Max Students</span>
                    <span className="text-slate-900 font-mono font-black">{pkg.studentLimit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Instructors</span>
                    <span className="text-slate-900 font-mono font-black">{pkg.instructorLimit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Courses</span>
                    <span className="text-slate-900 font-mono font-black">{pkg.courseLimit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Storage</span>
                    <span className="text-slate-900 font-mono font-black">{pkg.storageGB} GB</span>
                  </div>
                </div>

                {/* Module Enable / Disable Matrix */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Module Entitlements ({Object.values(pkg.enabledModules).filter(Boolean).length}/12 Enabled)</span>
                  <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {ALL_PLATFORM_MODULES.map(mod => {
                      const enabled = !!pkg.enabledModules[mod.key]
                      return (
                        <div key={mod.key} className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[11px] ${
                          enabled ? "bg-white border-slate-200 text-slate-800 font-medium" : "bg-slate-50 border-slate-100 text-slate-400 line-through"
                        }`}>
                          <span className="truncate">{mod.name}</span>
                          {enabled ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 ml-1" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-slate-300 shrink-0 ml-1" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Payment Link & Automation Settings */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-500">Custom Payment URL:</span>
                    <span className="text-teal-700 font-mono text-[10px] truncate max-w-[150px]">{pkg.customPaymentLink}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px]">
                    <span className="flex items-center gap-1 text-slate-600 font-semibold">
                      <Mail className="w-3 h-3 text-teal-600" /> Email Auto
                    </span>
                    <span className={`px-1.5 py-0.2 rounded font-bold ${pkg.sendEmailAutomation ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                      {pkg.sendEmailAutomation ? "ON" : "OFF"}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 font-semibold ml-2">
                      <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp Auto
                    </span>
                    <span className={`px-1.5 py-0.2 rounded font-bold ${pkg.sendWhatsAppAutomation ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                      {pkg.sendWhatsAppAutomation ? "ON" : "OFF"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold">Annual Revenue:</span>
                <span className="font-black font-mono text-teal-700 text-sm">₹{(pkg.offerPriceYearly * pkg.activeSubscribers).toLocaleString()}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Create / Edit Package */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-xl relative text-slate-900 max-h-[90vh] overflow-y-auto my-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg sm:text-xl font-black">{editingPkg ? `Edit Package: ${editingPkg.name}` : "Create Custom Yearly Package"}</h2>
                <p className="text-xs text-slate-500 font-medium">Configure yearly pricing (+18% GST), enable/disable modules, and payment automation links.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Package Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Package Name *</label>
                  <input required placeholder="e.g. Growth Pro Institute" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Badge Text</label>
                  <input placeholder="e.g. Save 40% • Yearly Special" value={form.badgeText} onChange={e => setForm(p => ({ ...p, badgeText: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" />
                </div>
              </div>

              {/* Yearly Pricing Breakdown */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">Yearly Pricing & GST Controls</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Original Price (₹/yr) *</label>
                    <input required type="number" value={form.originalPriceYearly} onChange={e => setForm(p => ({ ...p, originalPriceYearly: parseFloat(e.target.value) || 0 }))} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Offer Price (₹/yr) *</label>
                    <input required type="number" value={form.offerPriceYearly} onChange={e => setForm(p => ({ ...p, offerPriceYearly: parseFloat(e.target.value) || 0 }))} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-700" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">GST Disclosure</label>
                    <input value={form.gstText} onChange={e => setForm(p => ({ ...p, gstText: e.target.value }))} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700" />
                  </div>
                </div>
              </div>

              {/* Capacity Limits */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Max Students</label>
                  <input type="text" value={form.studentLimit} onChange={e => setForm(p => ({ ...p, studentLimit: e.target.value === "Unlimited" ? "Unlimited" : parseInt(e.target.value) || 0 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Instructors</label>
                  <input type="text" value={form.instructorLimit} onChange={e => setForm(p => ({ ...p, instructorLimit: e.target.value === "Unlimited" ? "Unlimited" : parseInt(e.target.value) || 0 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Max Courses</label>
                  <input type="text" value={form.courseLimit} onChange={e => setForm(p => ({ ...p, courseLimit: e.target.value === "Unlimited" ? "Unlimited" : parseInt(e.target.value) || 0 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Storage (GB)</label>
                  <input type="text" value={form.storageGB} onChange={e => setForm(p => ({ ...p, storageGB: e.target.value === "Unlimited" ? "Unlimited" : parseInt(e.target.value) || 0 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold" />
                </div>
              </div>

              {/* Granular Module Control Switches */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">12 Platform Module Entitlements</h4>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {Object.values(form.enabledModules).filter(Boolean).length} / 12 Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto custom-scrollbar p-1">
                  {ALL_PLATFORM_MODULES.map(mod => {
                    const isChecked = !!form.enabledModules[mod.key]
                    return (
                      <div 
                        key={mod.key} 
                        onClick={() => toggleModuleInForm(mod.key)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                          isChecked 
                            ? "bg-teal-50/70 border-teal-300 ring-1 ring-teal-500/20" 
                            : "bg-slate-50 border-slate-200 opacity-60"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{mod.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium block leading-tight">{mod.description}</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => {}} 
                          className="w-4 h-4 accent-teal-600 rounded cursor-pointer mt-0.5 shrink-0" 
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Custom Payment Link & Automation Settings */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Custom Payment URL & Automations</h4>
                
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Custom Payment Link URL *</label>
                  <input required value={form.customPaymentLink} onChange={e => setForm(p => ({ ...p, customPaymentLink: e.target.value }))} placeholder="https://rzp.io/l/your-custom-link or https://wa.me/..." className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-teal-600" /> Send Email Onboarding
                    </span>
                    <input type="checkbox" checked={form.sendEmailAutomation} onChange={e => setForm(p => ({ ...p, sendEmailAutomation: e.target.checked }))} className="w-4 h-4 accent-teal-600 rounded" />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> Send WhatsApp Reminders
                    </span>
                    <input type="checkbox" checked={form.sendWhatsAppAutomation} onChange={e => setForm(p => ({ ...p, sendWhatsAppAutomation: e.target.checked }))} className="w-4 h-4 accent-emerald-600 rounded" />
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="w-1/2 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingPkg ? "Save Package Changes" : "Publish Custom Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
