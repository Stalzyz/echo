"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  GraduationCap, Users, Bot, MessageSquare, CreditCard,
  BarChart3, CheckCircle2, ArrowRight, Play, ChevronDown, ChevronUp,
  Globe, Shield, Zap, Video, Check, Laptop, Layers, Calendar, Clock,
  Lock, Sliders, Search, Award, RefreshCw, FileText, Send, Building2,
  BookOpen, CheckSquare, PhoneCall, Workflow, ExternalLink, Mail, MapPin, Phone,
  Sparkles, Megaphone, Smartphone, HelpCircle, FileCheck, ShieldCheck, Database,
  TrendingUp, Star, Radio, Mic, Server, LayoutDashboard, QrCode, Receipt
} from "lucide-react"
import { toast } from "sonner"
import { DemoLoginModal } from "@/components/auth/DemoLoginModal"

interface Plan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  freeTrialDays: number
  studentLimit: number | string
  instructorLimit: number | string
  courseLimit: number | string
  storageLimitGB: number | string
  features: string[]
  status: "ACTIVE" | "DISABLED"
  popular?: boolean
}

const DEFAULT_HOMEPAGE_PLANS: Plan[] = [
  {
    id: "plan-starter",
    name: "STARTER ACADEMY",
    monthlyPrice: 999,
    yearlyPrice: 9990,
    freeTrialDays: 14,
    studentLimit: 500,
    instructorLimit: 5,
    courseLimit: 15,
    storageLimitGB: 50,
    features: [
      "Up to 500 Active Students",
      "5 Educator & Staff Accounts",
      "Courses, Quizzes & Video Player",
      "Admissions CRM & Lead Tracker",
      "Razorpay, PhonePe & Stripe Integration",
      "Basic WhatsApp & Email Alerts"
    ],
    status: "ACTIVE"
  },
  {
    id: "plan-growth",
    name: "GROWTH INSTITUTE",
    monthlyPrice: 2499,
    yearlyPrice: 24990,
    freeTrialDays: 14,
    studentLimit: 2500,
    instructorLimit: 20,
    courseLimit: 50,
    storageLimitGB: 250,
    features: [
      "Up to 2,500 Active Students",
      "20 Educator & Staff Accounts",
      "Meta Ads & Google Ads Direct Webhook Sync",
      "WhatsApp Cloud API Drips & Fee Reminders",
      "Call Intelligence & Audio Audit Logs",
      "Zoom & Google Meet Live Class Automation",
      "Automated EMI Invoicing & GST Tax Receipts",
      "QR Attendance Biometrics & Student Passport",
      "Custom Domain (CNAME) & White-Label"
    ],
    status: "ACTIVE",
    popular: true
  },
  {
    id: "plan-enterprise",
    name: "ENTERPRISE MULTI-BRANCH",
    monthlyPrice: 9999,
    yearlyPrice: 99990,
    freeTrialDays: 30,
    studentLimit: "Unlimited",
    instructorLimit: "Unlimited",
    courseLimit: "Unlimited",
    storageLimitGB: "Unlimited",
    features: [
      "Unlimited Students & Multi-Branch Campuses",
      "AI Student Drop-out Risk Predictive Engine",
      "Front-Desk Walk-Ins QR Kiosk Station",
      "Dedicated High-Performance Database Pod",
      "Bi-Directional Google Sheets 2-Way Pipeline",
      "Custom SSO, SAML & Active Directory Auth",
      "White-Glove Data Migration & 24/7 SLA"
    ],
    status: "ACTIVE"
  }
]

export default function PublicHomePage() {
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0)
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<"lead" | "payment" | "inactive" | "completion">("lead")
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_HOMEPAGE_PLANS)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  // Contact / Pricing Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    academyName: "",
    phone: "",
    email: "",
    studentVolume: "100-500",
    message: ""
  })
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false)

  useEffect(() => {
    fetch("/api/v1/plans")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.plans) && data.plans.length > 0) {
          setPlans(data.plans)
        }
      })
      .catch(() => {})
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingInquiry(true)
    setTimeout(() => {
      setIsSubmittingInquiry(false)
      toast.success("Thank you! Your pricing inquiry has been received. A Grekam specialist will reach out on WhatsApp within 15 minutes.")
      setInquiryForm({
        name: "",
        academyName: "",
        phone: "",
        email: "",
        studentVolume: "100-500",
        message: ""
      })
    }, 900)
  }

  const scrollToPricing = () => {
    const el = document.getElementById("pricing-section")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToForm = () => {
    const el = document.getElementById("contact-inquiry-form")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500/20 selection:text-teal-900 antialiased relative">
      
      {/* ========================================================================= */}
      {/* 00 — NAVIGATION HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/echo_logo.png" alt="echo logo" className="h-9 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight lowercase">echo</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">Academy Operating System by Grekam</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#ecosystem" className="hover:text-teal-700 transition-colors">Ecosystem</a>
            <a href="#integrations" className="hover:text-teal-700 transition-colors">Integrations</a>
            <a href="#modules" className="hover:text-teal-700 transition-colors">Modules</a>
            <a href="#pricing-section" className="hover:text-teal-700 transition-colors">Pricing</a>
            <a href="#about-grekam" className="hover:text-teal-700 transition-colors">About Grekam</a>
            <a href="#faq" className="hover:text-teal-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={scrollToPricing}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-950 text-xs font-bold transition-all"
            >
              View Prices
            </button>
            <Link 
              href="/auth/login" 
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all"
            >
              Sign In
            </Link>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Live Demo
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 01 — HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-teal-50/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              <span>echo • ACADEMY OPERATING SYSTEM BY GREKAM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              YOUR ACADEMY.<br />
              <span className="text-teal-600">ONE CONNECTED SYSTEM.</span>
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-teal-700">
              <span className="bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">Teach.</span>
              <span className="text-slate-300">•</span>
              <span className="bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">Manage.</span>
              <span className="text-slate-300">•</span>
              <span className="bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">Sell.</span>
              <span className="text-slate-300">•</span>
              <span className="bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">Grow.</span>
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              <strong>echo</strong> brings your courses, students, educators, live classes, Meta & Google lead ingestion, Call Intelligence, automated WhatsApp communication, EMI invoicing and academy website into one connected platform.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button 
                onClick={scrollToForm}
                className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm text-center transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Start Your Academy <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <Play className="w-4 h-4 text-teal-600 fill-teal-600" /> Live Demo
              </button>

              <button 
                onClick={scrollToPricing}
                className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                View Prices
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                <strong className="text-slate-900">No complicated setup. No scattered tools.</strong> Built for coaching institutes, competitive exam centres, skill academies, creative schools, and modern learning businesses.
              </p>
            </div>
          </div>

          {/* Right Column (High-Resolution Hero Image from User Asset) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-950 group">
              <img 
                src="/echohero.png" 
                alt="echo LMS Academy OS Dashboard Interface" 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Feature Badges */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white text-[11px] font-medium shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-emerald-300">Live Meta & Google Ads Sync</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <span>🎙️ Call Intelligence</span>
                  <span>⚡ WhatsApp Drips</span>
                  <span>💳 Instant EMI</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 — INTEGRATIONS ECOSYSTEM (Meta, Google, Grafty, WhatsApp, Payment Gateways) */}
      {/* ========================================================================= */}
      <section id="integrations" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-bold">
              <Workflow className="w-3.5 h-3.5" />
              SEAMLESS API & DIRECT PIPELINE INTEGRATIONS
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Connect Every Tool Your Academy Relies On.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No manual copy-pasting or broken webhooks. echo natively connects with lead generation platforms, video infrastructure, communication rails, and payment gateways.
            </p>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {[
              {
                name: "Meta Ads",
                tag: "Direct Leads Connection",
                desc: "Instant webhook lead ingestion from Facebook & Instagram lead gen ads.",
                icon: (
                  <svg className="w-6 h-6 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )
              },
              {
                name: "Google Ads",
                tag: "Direct Leads Connection",
                desc: "Real-time Google search & display lead form extension sync into CRM.",
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                )
              },
              {
                name: "Google Meet",
                tag: "1-Click Classroom",
                desc: "Automated recurring calendar links and live room launch for batches.",
                icon: (
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-emerald-600 text-white font-black text-[10px]">
                    Meet
                  </div>
                )
              },
              {
                name: "Zoom Video",
                tag: "Cloud Recordings",
                desc: "Native SDK live sessions, interactive breakout rooms & auto cloud sync.",
                icon: (
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-blue-600 text-white font-black text-[10px]">
                    Zoom
                  </div>
                )
              },
              {
                name: "Google Sheets",
                tag: "2-Way Live Sync",
                desc: "Continuous bi-directional export/import for counselors and branch reports.",
                icon: (
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-emerald-700 text-white font-black text-[10px]">
                    Sheets
                  </div>
                )
              },
              {
                name: "Grafty",
                tag: "Visual Design Engine",
                desc: "Integrated media asset library and promotional graphics designer.",
                icon: (
                  <img src="https://grafty.pro/grafty.svg" alt="Grafty" className="w-6 h-6 object-contain" />
                )
              },
              {
                name: "WhatsApp API",
                tag: "Automated Drips",
                desc: "Official Cloud API triggers for welcome packs, fee dues & batch reminders.",
                icon: (
                  <svg className="w-6 h-6 text-emerald-500 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                )
              },
              {
                name: "Email Drips",
                tag: "Transactional & Marketing",
                desc: "Deliver high-inbox GST invoices, homework notices and drip nurture flows.",
                icon: <Mail className="w-6 h-6 text-blue-500" />
              },
              {
                name: "AI Engine",
                tag: "OpenAI & Gemini",
                desc: "Student at-risk drop detection, quiz generation and smart study notes.",
                icon: <Bot className="w-6 h-6 text-purple-600" />
              },
              {
                name: "YouTube",
                tag: "Unlisted & Live",
                desc: "Distribute unlisted video lectures with seamless iframe player privacy.",
                icon: (
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-rose-600 text-white font-black text-[10px]">
                    YT
                  </div>
                )
              },
              {
                name: "Vimeo OTT",
                tag: "DRM Protection",
                desc: "Encrypted, domain-restricted video streaming preventing piracy.",
                icon: (
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-sky-500 text-white font-black text-[10px]">
                    Vimeo
                  </div>
                )
              },
              {
                name: "Razorpay",
                tag: "UPI, Cards & EMI",
                desc: "India's premier payment gateway with automated webhook fee reconciliation.",
                icon: (
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-blue-700 text-white font-black text-[9px]">
                    Razor
                  </div>
                )
              },
              {
                name: "PhonePe",
                tag: "Direct Merchant UPI",
                desc: "Instant UPI dynamic QR generation for zero-drop fee collection.",
                icon: (
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-purple-700 text-white font-black text-[9px]">
                    PhonePe
                  </div>
                )
              },
              {
                name: "Stripe",
                tag: "Global Payments",
                desc: "Accept international student enrollments in 135+ currencies.",
                icon: (
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-indigo-600 text-white font-black text-[10px]">
                    Stripe
                  </div>
                )
              },
              {
                name: "Call Recorder",
                tag: "Voice Intelligence",
                desc: "In-app call audit logs, audio playback and counselor conversation analytics.",
                icon: <Mic className="w-6 h-6 text-rose-500" />
              }
            ].map((integ, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-teal-300 hover:shadow-md transition-all space-y-2 group">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                    {integ.icon}
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-100">
                    Active Sync
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 group-hover:text-teal-700 transition-colors">{integ.name}</h3>
                  <p className="text-[10px] font-semibold text-teal-600 line-clamp-1">{integ.tag}</p>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                  {integ.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03 — NEW CAPABILITIES & CORE MODULES */}
      {/* ========================================================================= */}
      <section id="modules" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/70 border border-teal-300 text-teal-900 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              NEXT-GENERATION ACADEMY MODULES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Engineered for Revenue, Operations & Student Success.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              echo consolidates disparate fragmented software into one robust, audit-ready operational hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Meta & Google Ads Sync */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Megaphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Lead Pipeline</span>
                <h3 className="text-base font-black text-slate-900">Meta & Google Ads Direct Sync</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect Facebook, Instagram & Google lead forms directly into your CRM. Zero delays, instant counselor assignment, and automated WhatsApp welcome messages.
              </p>
              <ul className="text-[11px] space-y-1.5 text-slate-600 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Sub-second webhook processing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Campaign & Ad-set ROI attribution</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Automatic deduplication & routing</li>
              </ul>
            </div>

            {/* 2. Call Intelligence */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Counselor Audits</span>
                <h3 className="text-base font-black text-slate-900">Call Intelligence & Voice Audio</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track counselor calls, log follow-up notes, listen to audio recordings, and benchmark conversion rates across admission executives.
              </p>
              <ul className="text-[11px] space-y-1.5 text-slate-600 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Secure in-app audio player & transcripts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Call duration & disposition tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Counselor performance leaderboard</li>
              </ul>
            </div>

            {/* 3. WhatsApp Cloud API Automation */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Engagement</span>
                <h3 className="text-base font-black text-slate-900">WhatsApp Automation & Drips</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send verified WhatsApp alerts for course logins, live class reminders, quiz results, payment receipts, and fee installment reminders.
              </p>
              <ul className="text-[11px] space-y-1.5 text-slate-600 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> 98% open rates with official templates</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Automated absentee alert to parents</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> One-click payment link dispatch</li>
              </ul>
            </div>

            {/* 4. AI Student Risk Engine */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Predictive Retention</span>
                <h3 className="text-base font-black text-slate-900">AI Student Drop-out Risk Engine</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart algorithmic scoring that flags inactive learners, falling quiz scores, or missed classes before students drop out or fail.
              </p>
              <ul className="text-[11px] space-y-1.5 text-slate-600 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Early-warning intervention alerts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> AI quiz & curriculum generator</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Automated study re-engagement nudges</li>
              </ul>
            </div>

            {/* 5. Front Desk Walk-Ins Kiosk */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Physical Campus</span>
                <h3 className="text-base font-black text-slate-900">Walk-Ins Kiosk & QR Check-in</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tablet-friendly front desk kiosk for physical academy walk-ins. Parents and students scan QR, fill inquiries, and get matched to available counselors.
              </p>
              <ul className="text-[11px] space-y-1.5 text-slate-600 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Instant SMS & WhatsApp brochure delivery</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Counselor queue management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Daily physical footfall analytics</li>
              </ul>
            </div>

            {/* 6. Automated EMI Invoicing & GST */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Finance & Billing</span>
                <h3 className="text-base font-black text-slate-900">Automated EMI & GST Invoicing</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Split high-ticket course fees into monthly installments. Automated payment reminders, instant GST tax receipts, and ledger reconciliation.
              </p>
              <ul className="text-[11px] space-y-1.5 text-slate-600 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Downloadable branded PDF receipts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Partial payment & discount coupon rules</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> Multi-branch financial ledger export</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 — ECOSYSTEM PILLARS & ARCHITECTURE */}
      {/* ========================================================================= */}
      <section id="ecosystem" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              One Unified System. Zero Redundancy.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Eliminate software chaos. echo integrates Learning Management (LMS), Customer Relationship Management (CRM), Live Streaming, Attendance Biometrics, and Invoicing into one unified OS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-all space-y-3">
              <div className="p-3 w-fit rounded-xl bg-teal-100 text-teal-800">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">Modern LMS & Video Studio</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Host modular video lessons, downloadable PDFs, interactive coding sandboxes, timed quizzes, and verifiable completion certificates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-all space-y-3">
              <div className="p-3 w-fit rounded-xl bg-blue-100 text-blue-800">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">Admissions & Lead CRM</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track enquiries from first contact to enrollment. Kanban lead pipeline, counselor call logs, follow-up dates, and conversion metrics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-all space-y-3">
              <div className="p-3 w-fit rounded-xl bg-indigo-100 text-indigo-800">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">Live Classes & Webinars</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Schedule batch sessions with Zoom & Google Meet. Automatic student attendance logging, classroom recording links, and calendar sync.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-all space-y-3">
              <div className="p-3 w-fit rounded-xl bg-emerald-100 text-emerald-800">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">White-Label & Custom Domain</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deploy under your own domain (`academy.yourbrand.in`). Customize brand colors, custom logos, SSL certificates, and transactional email headers.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05 — PRICING & INQUIRY FORM */}
      {/* ========================================================================= */}
      <section id="pricing-section" className="py-20 bg-slate-900 text-white border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-bold">
              TRANSPARENT PLANS & CUSTOM PACKAGES
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Scale Your Academy Without Hidden Penalties.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every plan includes full LMS and CRM core access, encrypted student data, and multi-channel support.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-white" : "text-slate-400"}`}>Monthly Billing</span>
              <button
                onClick={() => setBillingCycle(b => b === "monthly" ? "yearly" : "monthly")}
                className="w-12 h-6 rounded-full bg-slate-800 border border-slate-700 p-0.5 relative transition-colors focus:outline-none"
              >
                <div className={`w-5 h-5 rounded-full bg-teal-500 transition-transform ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"}`} />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${billingCycle === "yearly" ? "text-white" : "text-slate-400"}`}>Yearly Billing</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black border border-teal-500/30">
                  SAVE 20%
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const price = billingCycle === "monthly" ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)
              return (
                <div 
                  key={plan.id}
                  className={`rounded-2xl p-7 flex flex-col justify-between transition-all relative ${
                    plan.popular 
                      ? "bg-slate-800/90 border-2 border-teal-500 shadow-2xl shadow-teal-500/10" 
                      : "bg-slate-950/60 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                      Most Popular For Institutes
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-black text-white">{plan.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-1">{plan.freeTrialDays}-Day Free Full Access Trial</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white">₹{price.toLocaleString()}</span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>

                    <div className="pt-4 border-t border-slate-800 space-y-2 text-xs font-medium text-slate-300">
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Student Capacity:</span>
                        <span className="font-bold text-white">{plan.studentLimit}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Educator Accounts:</span>
                        <span className="font-bold text-white">{plan.instructorLimit}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Course Limit:</span>
                        <span className="font-bold text-white">{plan.courseLimit}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Cloud Storage:</span>
                        <span className="font-bold text-white">{plan.storageLimitGB} GB</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Included Capabilities:</p>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {plan.features.map((feat, fi) => (
                          <li key={fi} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={scrollToForm}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        plan.popular 
                          ? "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg" 
                          : "bg-slate-800 hover:bg-slate-700 text-white"
                      }`}
                    >
                      Choose {plan.name} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Dedicated Interactive Contact / Pricing Inquiry Form */}
          <div id="contact-inquiry-form" className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-4 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/40">
                  <Sparkles className="w-3 h-3" /> CUSTOM ENTERPRISE QUOTATION
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Request a Custom Pricing Quote or Live Walkthrough.
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Have multi-branch locations, 5,000+ students, or need custom ERP/CRM data migration? Fill out the form and our solutions engineering team will get back to you with a tailored deployment plan.
                </p>

                <div className="space-y-2 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Free 1-on-1 Architecture Walkthrough</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Assisted Data & Student Migration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Instant WhatsApp Follow-up Support</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <form onSubmit={handleInquirySubmit} className="space-y-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-700/80 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Full Name *</label>
                      <input 
                        type="text"
                        required
                        value={inquiryForm.name}
                        onChange={e => setInquiryForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Dr. Rajesh Kumar"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Academy / Institute Name *</label>
                      <input 
                        type="text"
                        required
                        value={inquiryForm.academyName}
                        onChange={e => setInquiryForm(prev => ({ ...prev, academyName: e.target.value }))}
                        placeholder="e.g. Coimbatore Skill Academy"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">WhatsApp Phone Number *</label>
                      <input 
                        type="tel"
                        required
                        value={inquiryForm.phone}
                        onChange={e => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 97893 59407"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Work Email Address *</label>
                      <input 
                        type="email"
                        required
                        value={inquiryForm.email}
                        onChange={e => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="admin@academy.in"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Current Active Student Volume</label>
                    <select
                      value={inquiryForm.studentVolume}
                      onChange={e => setInquiryForm(prev => ({ ...prev, studentVolume: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="50-200">50 – 200 Students</option>
                      <option value="200-1000">200 – 1,000 Students</option>
                      <option value="1000-5000">1,000 – 5,000 Students</option>
                      <option value="5000+">5,000+ Multi-Branch Institution</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Requirements / Questions (Optional)</label>
                    <textarea 
                      rows={2}
                      value={inquiryForm.message}
                      onChange={e => setInquiryForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us about your current courses, marketing stack, or data migration needs..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="w-full py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingInquiry ? "Submitting Inquiry..." : "Submit Pricing & Demo Request →"}
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06 — ABOUT GREKAM & NETWORK SHOWCASE */}
      {/* ========================================================================= */}
      <section id="about-grekam" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                ABOUT GREKAM NETWORK • COIMBATORE, INDIA
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Built by Grekam. Powering Modern Learning Ventures.
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>echo</strong> is crafted and maintained by <strong>Grekam Visuals</strong>, a pioneering creative technology and digital marketing agency headquartered in <strong>Coimbatore, Tamil Nadu</strong>.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Born out of the real-world operational challenges of managing courses, multi-teacher schedules, lead attribution, and offline-to-online workflows at <strong>Grekam Academy Coimbatore</strong>, echo was developed as a full-fledged Operating System to power modern learning enterprises across India.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <a 
                  href="https://www.grekam.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-400 hover:shadow-xs transition-all group block"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    <span>Grekam Main</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">www.grekam.in</p>
                </a>

                <a 
                  href="https://agency.grekam.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-400 hover:shadow-xs transition-all group block"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    <span>Grekam Visuals</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">agency.grekam.in</p>
                </a>

                <a 
                  href="https://academy.grekam.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-400 hover:shadow-xs transition-all group block"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    <span>Grekam Academy</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">academy.grekam.in</p>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
                <img 
                  src="/visuals-logo.png" 
                  alt="Grekam Visuals" 
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h3 className="text-sm font-black text-slate-900">Grekam Visuals & Academy</h3>
                  <p className="text-[11px] text-slate-500">Creative Media, Digital Strategy & Education Tech</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Headquarters:</strong> Grekam Visuals, Coimbatore, Tamil Nadu 641001, India.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Contact & Support:</strong> +91 97893 59407 / +91 98431 99556
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Inquiries:</strong> admin@grekam.in / contact@agency.grekam.in
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <p className="text-[11px] text-slate-500 italic">
                  &ldquo;We built echo because no LMS or CRM in the market truly connected advertising spend directly to classroom attendance and fee receipts.&rdquo;
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07 — FAQ SECTION */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Everything you need to know about switching to echo OS.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { 
                q: "Can I migrate existing students and course videos to echo?", 
                a: "Yes! echo supports bulk CSV student import, past fee ledger reconciliation, and one-click video integration via Vimeo, YouTube Unlisted, or direct MP4 S3 cloud storage." 
              },
              { 
                q: "How does the Meta & Google Ads direct integration work?", 
                a: "You provide your Facebook / Google Lead Form Webhook URL or connect via API. Every lead generated on your ads lands inside echo CRM instantly with campaign tags, triggering an automated WhatsApp welcome pack." 
              },
              { 
                q: "Can I use my own domain name (e.g., learn.myacademy.com)?", 
                a: "Absolutely. Growth and Enterprise plans allow complete CNAME whitelabeling with automatic SSL certification and custom branding." 
              },
              { 
                q: "Is WhatsApp automation included or do I need my own API?", 
                a: "echo connects directly to the Meta Official WhatsApp Cloud API. You can either plug in your WhatsApp Business account or use our managed routing service." 
              },
              { 
                q: "What payment gateways are supported for fee collection?", 
                a: "echo natively supports Razorpay, PhonePe, and Stripe for automated checkout links, recurring subscriptions, UPI QR codes, and multi-currency transactions." 
              }
            ].map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp className="w-4 h-4 text-teal-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {openFaq === index && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08 — FINAL CTA & FOOTER */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Your Academy Is Ready for Its Next Chapter.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Build your courses. Ingest your leads. Automate your WhatsApp drips. Run your entire academy from one platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button 
              onClick={scrollToForm}
              className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Start Your Academy Free →
            </button>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              Open Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Modern Multi-Column Editorial Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg tracking-tight lowercase">echo</span>
              <span className="px-2 py-0.5 bg-teal-600 text-white text-[10px] font-bold rounded uppercase">OS</span>
            </div>
            
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Your Academy. One Connected System. Teach, manage, sell and grow from one platform.
            </p>

            {/* Grekam Visuals Logo & Link Requirement */}
            <div className="pt-2 border-t border-slate-900 space-y-2">
              <a 
                href="https://agency.grekam.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 group p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-all"
              >
                <img 
                  src="/visuals-logo.png" 
                  alt="Grekam Visuals" 
                  className="h-8 w-auto object-contain"
                />
                <div>
                  <span className="text-[11px] font-bold text-white group-hover:text-teal-400 transition-colors flex items-center gap-1">
                    a product by Grekam Visuals <ExternalLink className="w-3 h-3 text-slate-500" />
                  </span>
                  <p className="text-[9px] text-slate-500">https://agency.grekam.in</p>
                </div>
              </a>
            </div>

            <div className="space-y-1.5 pt-2 font-mono text-[11px] text-slate-400">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Grekam Visuals, Coimbatore, Tamil Nadu, India</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" /> +91 97893 59407 / +91 98431 99556</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" /> admin@grekam.in</div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white uppercase tracking-wider text-[10px]">MODULES</p>
            <ul className="space-y-1.5 font-medium">
              <li><a href="#modules" className="hover:text-white">Meta & Google Ads Sync</a></li>
              <li><a href="#modules" className="hover:text-white">Call Intelligence</a></li>
              <li><a href="#modules" className="hover:text-white">WhatsApp Automation</a></li>
              <li><a href="#modules" className="hover:text-white">AI Risk Predictive Engine</a></li>
              <li><a href="#modules" className="hover:text-white">Walk-Ins Kiosk Station</a></li>
              <li><a href="#modules" className="hover:text-white">EMI Invoicing & GST</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white uppercase tracking-wider text-[10px]">GREKAM NETWORK</p>
            <ul className="space-y-1.5 font-medium">
              <li><a href="https://www.grekam.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Grekam Main Portal</a></li>
              <li><a href="https://agency.grekam.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Grekam Visuals Agency</a></li>
              <li><a href="https://academy.grekam.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Grekam Academy Coimbatore</a></li>
              <li><a href="https://grafty.pro" target="_blank" rel="noopener noreferrer" className="hover:text-white">Grafty Design Pro</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white uppercase tracking-wider text-[10px]">LEGAL & POLICIES</p>
            <ul className="space-y-1.5 font-medium">
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms and Conditions</Link></li>
              <li><Link href="/terms-of-access" className="hover:text-white">Terms of Access</Link></li>
              <li><Link href="/data-deletion" className="hover:text-white text-rose-400">Data Deletion Request</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500">
          <p>© 2026 echo. All rights reserved. A product by Grekam Visuals, Coimbatore, Tamil Nadu, India.</p>
          <p>The Operating System for Modern Education Businesses.</p>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 09 — MINIMAL MONOCHROME WHATSAPP FLOATING FAB */}
      {/* ========================================================================= */}
      <a
        href="https://wa.me/919789359407?text=Hi%20echo%20team,%20I%20would%20like%20to%20know%20more%20about%20echo%20LMS%20for%20my%20academy."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 p-3.5 bg-slate-950 hover:bg-black text-white rounded-full shadow-2xl border border-slate-700 hover:border-teal-400 transition-all duration-300 hover:scale-105"
      >
        {/* Minimal Monochrome SVG WhatsApp Icon */}
        <svg 
          className="w-5 h-5 fill-current text-white" 
          viewBox="0 0 24 24"
        >
          <path d="M12.031 0c-6.627 0-12 5.373-12 12 0 2.155.57 4.177 1.564 5.927l-1.595 5.824 5.973-1.567c1.69.932 3.636 1.464 5.708 1.464 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.6c-1.85 0-3.585-.494-5.087-1.354l-.364-.208-3.774.99 1.008-3.682-.234-.373c-.947-1.509-1.449-3.267-1.449-5.073 0-5.348 4.352-9.7 9.7-9.7 5.348 0 9.7 4.352 9.7 9.7 0 5.348-4.352 9.7-9.7 9.7zm5.322-7.272c-.292-.146-1.728-.853-1.996-.95-.268-.098-.463-.146-.658.146-.195.292-.756.95-.927 1.145-.171.195-.341.219-.633.073-.292-.146-1.234-.455-2.351-1.451-.869-.775-1.456-1.733-1.626-2.025-.171-.292-.018-.45.128-.595.132-.131.292-.341.438-.512.146-.171.195-.292.292-.487.098-.195.049-.365-.024-.512-.073-.146-.658-1.583-.902-2.168-.238-.57-.48-.492-.658-.501-.17-.009-.365-.011-.56-.011-.195 0-.512.073-.78.365-.268.292-1.023.999-1.023 2.436s1.047 2.826 1.193 3.021c.146.195 2.06 3.145 4.99 4.411.697.301 1.242.481 1.666.616.7.223 1.337.191 1.841.116.562-.084 1.728-.707 1.972-1.389.244-.682.244-1.266.171-1.389-.073-.122-.268-.195-.56-.341z"/>
        </svg>

        <span className="hidden sm:inline-block text-xs font-bold tracking-tight pr-1">
          Chat on WhatsApp
        </span>
      </a>

      {/* ========================================================================= */}
      {/* 10 — DEMO MODAL (Prefilled Demo Academy Admin) */}
      {/* ========================================================================= */}
      <DemoLoginModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

    </div>
  )
}
