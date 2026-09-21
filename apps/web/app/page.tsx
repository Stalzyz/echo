"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  GraduationCap, Users, Bot, MessageSquare, CreditCard,
  BarChart3, CheckCircle2, ArrowRight, Play, ChevronDown, ChevronUp,
  Globe, Shield, Zap, Video, Check, Laptop, Layers, Calendar, Clock,
  Lock, User, Sliders, Search, Award, RefreshCw, FileText, Send, Building2,
  BookOpen, CheckSquare, PhoneCall, Workflow, ExternalLink, Mail, MapPin, Phone
} from "lucide-react"
import { toast } from "sonner"

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
      "5 Educator Accounts",
      "Courses & Video Player",
      "Razorpay & Stripe Integration",
      "Basic Admissions CRM",
      "Automated Email Alerts"
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
      "20 Educator Accounts",
      "Meta Lead Ads Webhook Receiver",
      "WhatsApp Business API Reminders",
      "Zoom & Google Meet Live Classes",
      "Automated GST PDF Invoices",
      "Custom Domain (CNAME) Support",
      "Full Whitelabel Engine"
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
      "Unlimited Active Students & Staff",
      "Multi-Branch Architecture",
      "Dedicated Edge Database Isolation",
      "Custom API & Webhook Dispatch",
      "Custom SSO & SAML Auth",
      "24/7 Dedicated Support & SLA"
    ],
    status: "ACTIVE"
  }
]

export default function PublicHomePage() {
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0)
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<"lead" | "payment" | "inactive" | "completion">("lead")
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [activeBrandTab, setActiveBrandTab] = useState<"bright" | "northstar" | "creative">("northstar")
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_HOMEPAGE_PLANS)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  useEffect(() => {
    // Attempt to fetch dynamic packages/plans configured by Super Admin
    fetch("/api/v1/plans")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.plans) && data.plans.length > 0) {
          setPlans(data.plans)
        }
      })
      .catch(() => {
        // Fallback to default pricing plans if endpoint is offline or SSR
      })
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-poppins selection:bg-teal-500/20 selection:text-teal-900 antialiased">
      
      {/* ========================================================================= */}
      {/* 00 — NAVIGATION HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/echo_logo.png" alt="echo logo" className="h-9 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900 tracking-tight lowercase">echo</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">Academy Operating System by Grekam</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#ecosystem" className="hover:text-teal-700 transition-colors">Ecosystem</a>
            <a href="#journey" className="hover:text-teal-700 transition-colors">Journey</a>
            <a href="#student-experience" className="hover:text-teal-700 transition-colors">Learner UI</a>
            <a href="#crm" className="hover:text-teal-700 transition-colors">CRM & Sales</a>
            <a href="#automation" className="hover:text-teal-700 transition-colors">Automation</a>
            <a href="#branding" className="hover:text-teal-700 transition-colors">White-Label</a>
            <a href="#faq" className="hover:text-teal-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/auth/login" 
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-900 text-xs font-bold transition-all"
            >
              Sign In
            </Link>

            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              Book Demo
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 01 — HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-teal-50/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (70% Content) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              echo • ACADEMY OPERATING SYSTEM BY GREKAM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              YOUR ACADEMY.<br />
              <span className="text-teal-600">ONE CONNECTED SYSTEM.</span>
            </h1>

            <div className="flex flex-wrap gap-2 text-sm sm:text-base font-bold text-teal-700">
              <span>Teach.</span>
              <span className="text-slate-400">•</span>
              <span>Manage.</span>
              <span className="text-slate-400">•</span>
              <span>Sell.</span>
              <span className="text-slate-400">•</span>
              <span>Grow.</span>
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              <strong>echo</strong> brings your courses, students, educators, live classes, payments, CRM, communication and academy website into one connected platform.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link 
                href="/auth/login"
                className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm text-center transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2"
              >
                Start Your Academy <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-teal-600 fill-teal-600" /> Watch Demo
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <p className="text-xs font-semibold text-slate-500">
                <strong className="text-slate-900">No complicated setup. No scattered tools.</strong> Built for coaching institutes, academies, educators, training centres and modern learning businesses.
              </p>
            </div>
          </div>

          {/* Right Column (30% Overlap Visual - Realistic Product Screenshot) */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xl space-y-4 font-sans text-xs">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="font-mono text-[10px] text-slate-400 ml-2">echo.northstaracademy.in/admin</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold text-[10px]">Northstar Academy</span>
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">SK</div>
                </div>
              </div>

              {/* Top Greeting */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">Good morning, Sarah</p>
                  <p className="text-[10px] text-slate-500">Academy Manager • Northstar Academy</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-200">
                  ● 8 Classes Today
                </span>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-medium text-slate-500">Students</p>
                  <p className="text-base font-black text-slate-900">1,248</p>
                  <span className="text-[9px] text-emerald-700 font-bold">+14% this mo.</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-medium text-slate-500">Courses</p>
                  <p className="text-base font-black text-slate-900">36</p>
                  <span className="text-[9px] text-slate-500">Active batches</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-medium text-slate-500">Revenue</p>
                  <p className="text-base font-black text-teal-700">₹4.82L</p>
                  <span className="text-[9px] text-emerald-700 font-bold">This month</span>
                </div>
              </div>

              {/* Enrollment Bar Graph */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-900">Monthly Admissions Trend</span>
                  <span className="text-teal-700">84 New Enrollments</span>
                </div>
                <div className="h-14 flex items-end gap-2 pt-2 border-b border-slate-200 pb-1">
                  {[35, 42, 58, 65, 74, 84].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-teal-100 rounded-t hover:bg-teal-600 transition-all" style={{ height: `${h}%` }}>
                        <div className="w-full bg-teal-600 rounded-t" style={{ height: `${h * 0.7}%` }} />
                      </div>
                      <span className="text-[8px] text-slate-400 font-mono">{['Apr','May','Jun','Jul','Aug','Sep'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Classes Widget */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-900">Upcoming Live Sessions</p>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between p-2 bg-teal-50/70 border border-teal-200 rounded-lg">
                    <div>
                      <p className="font-bold text-slate-900">UI/UX Design Masterclass</p>
                      <p className="text-slate-500">Batch #14 • 48 Students enrolled</p>
                    </div>
                    <span className="px-2 py-1 bg-teal-600 text-white rounded font-bold text-[9px]">06:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-bold text-slate-900">Digital Marketing Sprint</p>
                      <p className="text-slate-500">Batch #09 • 32 Students enrolled</p>
                    </div>
                    <span className="px-2 py-1 bg-white border border-slate-200 text-slate-900 rounded font-bold text-[9px]">07:30 PM</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 — CAPABILITY RIBBON */}
      {/* ========================================================================= */}
      <section className="py-4 bg-slate-900 text-white overflow-hidden font-mono text-xs uppercase tracking-widest border-b border-slate-800">
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
          {["COURSES", "LIVE CLASSES", "CRM", "PAYMENTS", "AUTOMATION", "CERTIFICATES", "WEBSITE", "ANALYTICS", "WHATSAPP", "EXAMS", "BATCHES"].map((cap, i) => (
            <div key={i} className="flex items-center gap-6 text-teal-300/90 font-bold">
              <span>{cap}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            </div>
          ))}
          {["COURSES", "LIVE CLASSES", "CRM", "PAYMENTS", "AUTOMATION", "CERTIFICATES", "WEBSITE", "ANALYTICS", "WHATSAPP", "EXAMS", "BATCHES"].map((cap, i) => (
            <div key={`repeat-${i}`} className="flex items-center gap-6 text-teal-300/90 font-bold">
              <span>{cap}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03 — THE PROBLEM */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">03 — UNIFIED ARCHITECTURE</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Your academy shouldn't run across 10 different tools.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Moving student data manually between WhatsApp chats, spreadsheets, zoom links and payment gateways causes lost admissions and exhausted staff.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Before echo: Scattered Tools */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">BEFORE ECHO</span>
                <span className="text-xs text-slate-500 font-mono">Disconnected Stack</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { title: "WhatsApp", desc: "Leads lost in chats" },
                  { title: "Google Meet", desc: "Untracked links" },
                  { title: "Spreadsheets", desc: "Outdated records" },
                  { title: "Payment Gateway", desc: "Manual reconciliation" },
                  { title: "Website Builder", desc: "Static pages" },
                  { title: "Standalone CRM", desc: "Not linked to LMS" },
                  { title: "Course Platform", desc: "Separate logins" },
                  { title: "Email Tools", desc: "Unread newsletters" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-left space-y-1 shadow-2xs">
                    <p className="font-bold text-xs text-slate-900">{item.title}</p>
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-rose-700 font-medium border-t border-slate-200 pt-4">
                ❌ Result: High drop-off rate, missed follow-ups, double entry, and frustrated learners.
              </p>
            </div>

            {/* With echo: One Connected System */}
            <div className="p-8 rounded-2xl bg-slate-900 text-white border border-slate-900 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-teal-600 text-white font-bold text-xs">WITH ECHO</span>
                <span className="text-xs text-teal-300 font-mono">One Connected Platform</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-teal-950/60 border border-teal-800/60 rounded-xl space-y-2">
                  <h3 className="font-bold text-base text-teal-200">echo Unified Engine</h3>
                  <p className="text-xs text-slate-300">
                    Brings enquiries, admissions, learning, live sessions, fees, notifications and certificates into one single source of truth.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl font-medium text-slate-200">
                    ✅ Automated Lead Routing
                  </div>
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl font-medium text-slate-200">
                    ✅ Unified Student ID
                  </div>
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl font-medium text-slate-200">
                    ✅ Instant Fee Receipts
                  </div>
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl font-medium text-slate-200">
                    ✅ Automated Certificates
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs font-bold text-teal-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" /> Every step connected naturally.
              </div>
            </div>

          </div>

          <div className="text-center font-mono text-xs font-bold text-slate-500 tracking-wider uppercase pt-4">
            SCATTERED TOOLS ↓ ECHO ↓ ONE CONNECTED ACADEMY
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 — CORE STORY (LEAD TO LEARNER JOURNEY) */}
      {/* ========================================================================= */}
      <section id="journey" className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">04 — THE ECHO JOURNEY</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Every step connected.
            </h2>
            <p className="text-sm text-slate-600">
              <strong>echo</strong> connects the business side of your academy with the learning side—so information moves naturally from enquiry to enrollment to learning.
            </p>
          </div>

          {/* Timeline Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { num: "01", title: "LEAD", desc: "New enquiry arrives via web or ads" },
              { num: "02", title: "CRM", desc: "Counsellor receives & follows up" },
              { num: "03", title: "ENROLLMENT", desc: "Student selects batch & course" },
              { num: "04", title: "PAYMENT", desc: "Fee collected & receipt generated" },
              { num: "05", title: "LEARNING", desc: "Student attends live & recorded classes" },
              { num: "06", title: "ASSESSMENT", desc: "Tests & assignments submitted" },
              { num: "07", title: "CERTIFICATE", desc: "Branded certificate auto-issued" },
              { num: "08", title: "RETENTION", desc: "Alumni network & upsell courses" },
            ].map((step, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveJourneyStep(idx)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  activeJourneyStep === idx 
                    ? "bg-teal-600 text-white border-teal-600 shadow-md" 
                    : "bg-white text-slate-900 border-slate-200 hover:border-teal-500"
                }`}
              >
                <span className={`font-mono text-xs font-bold block mb-1 ${activeJourneyStep === idx ? "text-teal-100" : "text-teal-700"}`}>
                  {step.num}
                </span>
                <h3 className="font-bold text-xs tracking-tight mb-1">{step.title}</h3>
                <p className={`text-[10px] leading-tight ${activeJourneyStep === idx ? "text-teal-50" : "text-slate-500"}`}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold font-mono text-base">
                0{activeJourneyStep + 1}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {[
                    "Stage 1: Lead Capture & Multi-Channel Ingestion",
                    "Stage 2: CRM & Automated Counsellor Assignment",
                    "Stage 3: Seamless Self-Serve or Counsellor Enrollment",
                    "Stage 4: Automated Payment Gateway & Invoicing",
                    "Stage 5: Unified Student Workspace & Classroom",
                    "Stage 6: Automated Grading, Quizzes & Assignments",
                    "Stage 7: Instant PDF Certificate Issuance",
                    "Stage 8: Community Nurturing & Renewal Workflows"
                  ][activeJourneyStep]}
                </h4>
                <p className="text-xs text-slate-500">
                  No manual copy-pasting. echo passes state data down the pipeline smoothly.
                </p>
              </div>
            </div>
            <Link 
              href="/auth/login"
              className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl whitespace-nowrap hover:bg-teal-700 transition-colors"
            >
              Test Journey Workflow →
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05 — PRODUCT ECOSYSTEM (6 CORE SYSTEMS) */}
      {/* ========================================================================= */}
      <section id="ecosystem" className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">05 — PRODUCT ECOSYSTEM</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Everything Your Academy Needs
            </h2>
            <p className="text-sm text-slate-600">
              Instead of 20 small feature cards, <strong>echo</strong> organizes your education business into 6 meaningful core systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Learn",
                desc: "Courses, curriculum, video lessons, quizzes, assignments and completion certificates.",
                items: ["Structured Course Modules", "Video & PDF Lesson Player", "Interactive Quizzes", "Auto Certificates"]
              },
              {
                num: "02",
                title: "Teach",
                desc: "Educator profiles, batch scheduling, live classes, attendance tracking and student engagement.",
                items: ["Educator Workspaces", "Zoom & Meet Integrations", "Batch Attendance Logs", "Assignment Reviews"]
              },
              {
                num: "03",
                title: "Manage",
                desc: "Students, educators, admissions, CRM, staff tasks and daily academy operations.",
                items: ["Unified Student Directory", "Role-Based Permissions", "Multi-Branch Control", "Operational Audit Logs"]
              },
              {
                num: "04",
                title: "Sell",
                desc: "Course sales pages, online payments, automatic GST invoices, coupons and enrollment.",
                items: ["Integrated Payment Checkout", "Razorpay / Stripe Gateways", "Coupon & Discount Codes", "Instant Automated Invoices"]
              },
              {
                num: "05",
                title: "Connect",
                desc: "Meta WhatsApp API, email campaigns, in-app notifications and academy announcements.",
                items: ["WhatsApp Class Reminders", "Email Transactional Alerts", "Push Notifications", "Student Broadcasts"]
              },
              {
                num: "06",
                title: "Grow",
                desc: "Analytics, visual workflow automation, reports, academy website builder and custom branding.",
                items: ["Trigger-Condition Automation", "Custom Domain CNAME", "Drag-and-Drop Theme Builder", "Revenue & Growth Metrics"]
              }
            ].map((system, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-teal-500 transition-colors flex flex-col justify-between shadow-2xs">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-teal-800 px-2.5 py-1 bg-teal-100 rounded-md">
                      SYSTEM {system.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{system.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{system.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  {system.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06 — DYNAMIC PRICING SECTION */}
      {/* ======================      <section id="pricing" className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">06 — ANNUAL ACADEMY PACKAGING & PRICING</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Transparent Yearly Plans for Growing Academies
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              No hidden per-student commissions. Billed annually with explicit <strong className="text-teal-700">+ 18% GST</strong> disclosure and customizable module permissions.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 font-mono text-xs font-black border border-teal-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Billed Yearly Only • Save up to 40%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: "starter",
                name: "Starter Academy",
                originalPrice: "₹24,999",
                offerPrice: "₹14,999",
                gstText: "+ 18% GST",
                studentLimit: "500",
                instructorLimit: "5",
                storageLimitGB: "50 GB",
                badge: "Save 40% • Yearly",
                popular: false,
                features: ["Core LMS & Course Studio", "Student Portal & Mobile App", "Student Fees & Automated EMI", "AI Certificate Verification", "Custom Payment Gateway Link"]
              },
              {
                id: "growth",
                name: "Growth Institute",
                originalPrice: "₹49,999",
                offerPrice: "₹29,999",
                gstText: "+ 18% GST",
                studentLimit: "2,500",
                instructorLimit: "20",
                storageLimitGB: "250 GB",
                badge: "RECOMMENDED FOR ACADEMIES",
                popular: true,
                features: ["All Starter Features", "WhatsApp 1-Tap Automation", "Email Drip & Sequences", "Webinars & Conversion Funnels", "Custom Domain & Whitelabel", "1-on-1 Mentorship Booking"]
              },
              {
                id: "enterprise",
                name: "Enterprise Multi-Branch",
                originalPrice: "₹99,999",
                offerPrice: "₹69,999",
                gstText: "+ 18% GST",
                studentLimit: "Unlimited",
                instructorLimit: "Unlimited",
                storageLimitGB: "Unlimited GB",
                badge: "FULL SUITE UNLOCKED",
                popular: false,
                features: ["All Growth Features", "Offline Walk-in & Kiosk CRM", "Affiliate & Student Referrals", "Dedicated SLA Support", "Custom API & Webhooks Engine"]
              }
            ].map((p, idx) => (
              <div 
                key={p.id}
                className={`bg-white border rounded-3xl p-8 flex flex-col justify-between shadow-xs relative transition-all ${
                  p.popular ? "border-teal-500 ring-2 ring-teal-500/20" : "border-slate-200"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {p.badge}
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-teal-700">{p.name}</span>
                    <div className="mt-3 flex items-baseline justify-between">
                      <div>
                        <span className="text-3xl font-black text-slate-900 font-mono">{p.offerPrice}</span>
                        <span className="text-xs text-slate-400 font-mono line-through ml-2">{p.originalPrice}</span>
                        <span className="text-xs text-slate-500 font-bold block">/ year</span>
                      </div>
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Yearly
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] font-bold text-slate-600 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-teal-700 font-black">{p.gstText}</span>
                      <span>No Per-Student Fee</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100 text-xs font-semibold">
                    <div className="flex justify-between text-slate-700">
                      <span>Student Limit</span>
                      <span className="font-mono font-bold text-slate-900">{p.studentLimit}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Educator Limit</span>
                      <span className="font-mono font-bold text-slate-900">{p.instructorLimit}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Storage Cap</span>
                      <span className="font-mono font-bold text-slate-900">{p.storageLimitGB}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Included Platform Modules</span>
                    {p.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" /> {feat}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href="/pricing"
                    className={`w-full py-3.5 rounded-xl font-bold text-xs text-center block transition-all shadow-sm ${
                      p.popular 
                        ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    }`}
                  >
                    Subscribe to {p.name} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07 — LEARNING EXPERIENCE (STUDENT DASHBOARD MOCKUP) */}
      {/* ========================================================================= */}
      <section id="student-experience" className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-700">07 — LEARNER EXPERIENCE</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Give Students a Better Place to Learn
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Everything students need. Nothing they don't. Students can access their courses, attend live classes, submit assignments, take assessments, track progress and download certificates from one dashboard.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-900">
                <span className="p-3 bg-slate-50 rounded-xl border border-slate-200">COURSES</span>
                <span className="p-3 bg-slate-50 rounded-xl border border-slate-200">LIVE CLASSES</span>
                <span className="p-3 bg-slate-50 rounded-xl border border-slate-200">ASSIGNMENTS</span>
                <span className="p-3 bg-slate-50 rounded-xl border border-slate-200">CERTIFICATES</span>
              </div>
            </div>

            {/* Dummy Student Dashboard Screenshot Composition */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    AS
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Hello, Arjun Sharma</h3>
                    <p className="text-[10px] text-slate-500">Student ID: #NS-8921 • Northstar Academy</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-teal-50 text-teal-800 font-bold text-xs rounded-full border border-teal-200">Active Learner</span>
              </div>

              {/* Continue Learning Section */}
              <div className="space-y-3">
                <p className="font-bold text-xs text-slate-900 uppercase tracking-wider">Continue Learning</p>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-900">UI/UX Design Masterclass</span>
                    <span className="font-mono text-xs text-teal-700 font-bold">68% Complete</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full w-[68%]" />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-slate-500">Module 4: Wireframing & Prototyping</span>
                    <button className="px-4 py-1.5 bg-teal-600 text-white font-bold rounded-lg text-xs hover:bg-teal-700 transition-colors">
                      Continue Learning →
                    </button>
                  </div>
                </div>
              </div>

              {/* Upcoming & Certificates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <p className="font-bold text-xs text-slate-900">Upcoming Live Class</p>
                  <p className="font-bold text-xs text-teal-700">UX Workshop</p>
                  <p className="text-[10px] text-slate-500">Today at 6:00 PM • Zoom Integration</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <p className="font-bold text-xs text-slate-900">Earned Certificates</p>
                  <p className="font-bold text-xs text-slate-900">2 Verified Certificates</p>
                  <p className="text-[10px] text-emerald-700 font-bold">Ready to Download PDF</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08 — EDUCATOR WORKSPACE */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Dummy Educator Dashboard Screenshot Composition */}
            <div className="lg:col-span-7 bg-slate-900 text-white border border-slate-900 rounded-2xl p-6 shadow-xl space-y-6 text-xs order-2 lg:order-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-sm text-teal-200">Educator Workspace • Prof. Rajesh Kumar</h3>
                  <p className="text-[10px] text-slate-400">Department of Design & Digital Skills</p>
                </div>
                <span className="px-3 py-1 bg-teal-600 text-white font-bold text-xs rounded-full">Educator Portal</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                  <p className="text-[10px] text-slate-400">My Courses</p>
                  <p className="text-base font-black text-white">3 Active</p>
                </div>
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                  <p className="text-[10px] text-slate-400">Today's Classes</p>
                  <p className="text-base font-black font-mono text-teal-300">2 Sessions</p>
                </div>
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                  <p className="text-[10px] text-slate-400">Pending Reviews</p>
                  <p className="text-base font-black text-rose-400">12 Submissions</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-300">Today's Teaching Schedule</p>
                <div className="space-y-2 font-mono">
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-xs">06:00 PM — UI/UX Design Workshop</p>
                      <p className="text-[10px] text-slate-400">48 Students • Batch #14</p>
                    </div>
                    <span className="px-2.5 py-1 bg-teal-600 text-white rounded font-bold text-[10px]">Start Class</span>
                  </div>
                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-xs">07:30 PM — Figma Masterclass</p>
                      <p className="text-[10px] text-slate-400">32 Students • Batch #09</p>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded font-bold text-[10px]">Upcoming</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-700">08 — EDUCATOR WORKSPACE</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Give Educators Their Own Workspace
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Don't just say &quot;educator management.&quot; Show what educators actually do. Educators can manage curriculum, launch live classes, review assignments, conduct assessments and track learner progress.
              </p>

              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold text-teal-700">
                <span className="px-3 py-1 bg-teal-50 rounded-md border border-teal-200">CREATE</span>
                <span>→</span>
                <span className="px-3 py-1 bg-teal-50 rounded-md border border-teal-200">TEACH</span>
                <span>→</span>
                <span className="px-3 py-1 bg-teal-50 rounded-md border border-teal-200">TRACK</span>
                <span>→</span>
                <span className="px-3 py-1 bg-teal-50 rounded-md border border-teal-200">ENGAGE</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 09 — INTEGRATED CRM */}
      {/* ========================================================================= */}
      <section id="crm" className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">09 — INTEGRATED CRM</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Turn Enquiries Into Enrollments
            </h2>
            <p className="text-sm text-slate-600">
              Stop losing admissions between WhatsApp conversations, spreadsheets and follow-ups.
            </p>
          </div>

          {/* Dummy CRM Board Mockup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            
            {/* New Leads */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-900">NEW LEADS</span>
                <span className="px-2 py-0.5 bg-slate-200 rounded text-[10px]">12</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-slate-900">Priya Sharma</p>
                  <p className="text-[10px] text-slate-500">Course: UI/UX Design</p>
                  <span className="text-[9px] px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold">Meta Ads</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-slate-900">Karthik V.</p>
                  <p className="text-[10px] text-slate-500">Course: Digital Marketing</p>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Contacted */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-900">CONTACTED</span>
                <span className="px-2 py-0.5 bg-slate-200 rounded text-[10px]">18</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-slate-900">Rahul Verma</p>
                  <p className="text-[10px] text-slate-500">Follow-up today at 4 PM</p>
                  <span className="text-[9px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">Counsellor Assigned</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-slate-900">Divya N.</p>
                  <p className="text-[10px] text-slate-500">Sent syllabus brochure</p>
                  <span className="text-[9px] px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold">WhatsApp Sent</span>
                </div>
              </div>
            </div>

            {/* Demo */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-900">DEMO / TRIAL</span>
                <span className="px-2 py-0.5 bg-slate-200 rounded text-[10px]">7</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-slate-900">Arjun S.</p>
                  <p className="text-[10px] text-slate-500">Attended Live Workshop</p>
                  <span className="text-[9px] px-2 py-0.5 bg-teal-50 text-teal-800 rounded font-bold border border-teal-200">High Intent</span>
                </div>
              </div>
            </div>

            {/* Enrolled */}
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 space-y-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-teal-800">ENROLLED (WON)</span>
                <span className="px-2 py-0.5 bg-teal-600 text-white rounded text-[10px]">24</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-teal-200 rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-slate-900">Vivek M.</p>
                  <p className="text-[10px] text-teal-700 font-bold">Fee Paid ₹14,999</p>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Auto Access Granted</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10 — VISUAL AUTOMATION */}
      {/* ========================================================================= */}
      <section id="automation" className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">10 — VISUAL AUTOMATION</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Let echo Handle the Repetitive Work
            </h2>
            <p className="text-sm text-slate-600">
              Build the workflow once. Let <strong>echo</strong> run it automatically.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              {[
                { id: "lead", label: "New Lead Workflow" },
                { id: "payment", label: "Payment Due Workflow" },
                { id: "inactive", label: "Enrollment Workflow" },
                { id: "completion", label: "Completion Workflow" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveWorkflowTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeWorkflowTab === tab.id
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 font-mono text-xs">
              {activeWorkflowTab === "lead" && [
                "WHEN New Lead Created",
                "THEN Send WhatsApp Welcome Message",
                "THEN Create Follow-up Task",
                "THEN Assign Counsellor",
                "THEN Send Follow-up Reminder"
              ].map((node, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">{i + 1}</span>
                  {node}
                </div>
              ))}

              {activeWorkflowTab === "payment" && [
                "WHEN Student Enrolled",
                "THEN Send Welcome Message",
                "THEN Grant Instant Course Access",
                "THEN Send Class Reminder via WhatsApp"
              ].map((node, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">{i + 1}</span>
                  {node}
                </div>
              ))}

              {activeWorkflowTab === "inactive" && [
                "WHEN Payment Due in 2 Days",
                "THEN Send WhatsApp Fee Reminder",
                "THEN Send Email Invoice Breakdown"
              ].map((node, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">{i + 1}</span>
                  {node}
                </div>
              ))}

              {activeWorkflowTab === "completion" && [
                "WHEN Final Assessment Passed",
                "THEN Generate PDF Certificate #ECHO-CERT",
                "THEN Send Certificate via WhatsApp & Email"
              ].map((node, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">{i + 1}</span>
                  {node}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11 — WHITE-LABEL BRANDING */}
      {/* ========================================================================= */}
      <section id="branding" className="py-20 border-b border-slate-200 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-300">11 — WHITE-LABEL BRANDING</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Powered by echo. Experienced as your academy.
            </h2>
            <p className="text-sm text-slate-300">
              <strong>echo</strong> disappears behind your brand. Custom domain, logo, colors, and unique student portal.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {(["northstar", "bright", "creative"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveBrandTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeBrandTab === tab
                    ? "bg-teal-600 text-white"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {tab} Academy Preview
              </button>
            ))}
          </div>

          <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700 text-center space-y-4 shadow-xl">
            <p className="text-xs font-mono text-teal-300">
              {activeBrandTab === "northstar" && "https://learn.northstaracademy.in"}
              {activeBrandTab === "bright" && "https://courses.brightacademy.com"}
              {activeBrandTab === "creative" && "https://academy.creativeskills.io"}
            </p>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider">
              {activeBrandTab === "northstar" && "NORTHSTAR ACADEMY"}
              {activeBrandTab === "bright" && "BRIGHT SKILLS INSTITUTE"}
              {activeBrandTab === "creative" && "CREATIVE DESIGN SCHOOL"}
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Same echo underlying technology. Entirely customized branding, logo, colors, and CNAME domain.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12 — FAQ ACCORDION */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">12 — FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: "Can I create my own academy website?", a: "Yes. echo provides academy website and branding tools." },
              { q: "Can students register themselves?", a: "Yes. Academy administrators can control student registration." },
              { q: "Can educators register?", a: "Yes, depending on the academy's registration and approval settings." },
              { q: "Can academy admins register themselves?", a: "No. Academy owner accounts are created through Grekam onboarding." },
              { q: "Can I conduct live classes?", a: "Yes. echo supports live learning workflows and integrations such as Zoom and Google Meet where configured." },
              { q: "Can I sell courses?", a: "Yes. You can create paid courses and connect supported payment gateways." },
              { q: "Can I connect my own domain?", a: "Yes, with custom-domain support." },
              { q: "Can I use my own branding?", a: "Yes. echo is designed to support academy branding and white-label experiences depending on your plan." },
              { q: "Can I manage leads?", a: "Yes. echo combines LMS and CRM workflows so enquiries can move toward enrollment." },
              { q: "Can I automate WhatsApp communication?", a: "Yes, when the relevant WhatsApp integration is connected and configured." }
            ].map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp className="w-4 h-4 text-teal-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {openFaq === index && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13 — FINAL CTA & FOOTER */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#E5F0EA]">
            Your Academy Is Ready for Its Next Chapter.
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Build your courses. Bring your students together. Run your academy from one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link 
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg"
            >
              Start Your Academy
            </Link>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-all"
            >
              Talk to echo
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Book a walkthrough and see how <strong>echo</strong> fits your academy.
          </p>
        </div>
      </section>

      {/* Multi-Column Editorial Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg tracking-tight lowercase">echo</span>
              <span className="px-2 py-0.5 bg-teal-600 text-white text-[10px] font-bold rounded uppercase">OS</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Your Academy. One Connected System. Teach, manage, sell and grow from one platform.
            </p>

            <div className="space-y-1.5 pt-2 font-mono text-[11px] text-slate-400">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" /> Grekam, Coimbatore, Tamil Nadu, India</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" /> +91 98431 99556</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" /> admin@grekam.in</div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white uppercase tracking-wider text-[10px]">PRODUCT</p>
            <ul className="space-y-1.5 font-medium">
              <li><a href="#ecosystem" className="hover:text-white">LMS</a></li>
              <li><a href="#crm" className="hover:text-white">CRM</a></li>
              <li><a href="#automation" className="hover:text-white">Automation</a></li>
              <li><a href="#branding" className="hover:text-white">White Label</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white uppercase tracking-wider text-[10px]">SOLUTIONS</p>
            <ul className="space-y-1.5 font-medium">
              <li><a href="#ecosystem" className="hover:text-white">Coaching Institutes</a></li>
              <li><a href="#ecosystem" className="hover:text-white">Training Centres</a></li>
              <li><a href="#ecosystem" className="hover:text-white">Online Educators</a></li>
              <li><a href="#ecosystem" className="hover:text-white">Skill Academies</a></li>
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

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500">
          <p>© 2026 echo. All rights reserved. A product by Grekam, Coimbatore, Tamil Nadu, India.</p>
          <p>The Operating System for Modern Education Businesses.</p>
        </div>
      </footer>

      {/* DEMO BOOKING MODAL */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-left text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-black text-slate-900">Book an echo Demo</h3>
                <p className="text-[10px] text-slate-500">Walkthrough for your academy</p>
              </div>
              <button onClick={() => setIsDemoModalOpen(false)} className="text-slate-400 hover:text-slate-900 text-base font-bold">&times;</button>
            </div>

            <form onSubmit={e => { e.preventDefault(); toast.success("Demo booking submitted! An echo specialist will contact you shortly."); setIsDemoModalOpen(false) }} className="space-y-3">
              <div>
                <label className="font-bold text-slate-900 block mb-1">Full Name *</label>
                <input required placeholder="e.g. Sarah Jenkins" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" />
              </div>
              <div>
                <label className="font-bold text-slate-900 block mb-1">Academy / Business Name *</label>
                <input required placeholder="e.g. Northstar Academy" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" />
              </div>
              <div>
                <label className="font-bold text-slate-900 block mb-1">WhatsApp Phone Number *</label>
                <input required placeholder="+91 98431 99556" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-teal-600" />
              </div>
              <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-all">
                Submit Demo Request →
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
