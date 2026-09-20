"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Sparkles, GraduationCap, Users, Bot, MessageSquare, CreditCard,
  BarChart3, CheckCircle2, ArrowRight, Play, ChevronDown, ChevronUp,
  Globe, Shield, Zap, Video, Check, Laptop, Layers, Calendar, Clock,
  Lock, User, Sliders, Search, Award, RefreshCw, FileText, Send, Building2,
  BookOpen, CheckSquare, PhoneCall, Workflow, Sparkle, ExternalLink
} from "lucide-react"
import { toast } from "sonner"

export default function PublicHomePage() {
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0)
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<"lead" | "payment" | "inactive" | "completion">("lead")
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [activeBrandTab, setActiveBrandTab] = useState<"bright" | "northstar" | "creative">("northstar")

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#151515] font-sans antialiased selection:bg-[#1F6B4F]/20 selection:text-[#1F6B4F]">
      
      {/* ========================================================================= */}
      {/* 00 — NAVIGATION HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#F7F6F2]/90 backdrop-blur-md border-b border-[#DEDED8]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#1F6B4F] flex items-center justify-center text-white font-black shadow-xs group-hover:bg-[#16513B] transition-colors">
              <span className="text-base tracking-tighter">E</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#151515] tracking-tight">ECHO</span>
                <span className="px-2 py-0.5 rounded-md bg-[#E5F0EA] border border-[#1F6B4F]/20 text-[#1F6B4F] text-[10px] font-bold uppercase tracking-wider">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-[#6B6B67] font-medium tracking-wide">Academy Operating System</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-[#6B6B67]">
            <a href="#ecosystem" className="hover:text-[#1F6B4F] transition-colors">Ecosystem</a>
            <a href="#journey" className="hover:text-[#1F6B4F] transition-colors">Journey</a>
            <a href="#student-experience" className="hover:text-[#1F6B4F] transition-colors">Learner UI</a>
            <a href="#crm" className="hover:text-[#1F6B4F] transition-colors">CRM & Sales</a>
            <a href="#automation" className="hover:text-[#1F6B4F] transition-colors">Automation</a>
            <a href="#website-builder" className="hover:text-[#1F6B4F] transition-colors">Website</a>
            <a href="#branding" className="hover:text-[#1F6B4F] transition-colors">White-Label</a>
            <a href="#faq" className="hover:text-[#1F6B4F] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/auth/login" 
              className="px-4 py-2.5 rounded-xl border border-[#DEDED8] hover:bg-white text-[#151515] text-xs font-bold transition-all"
            >
              Sign In
            </Link>

            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#1F6B4F] hover:bg-[#16513B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              Book Demo
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 01 — HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 border-b border-[#DEDED8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (70% Content) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5F0EA] border border-[#1F6B4F]/20 text-[#1F6B4F] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#1F6B4F] animate-pulse" />
              ECHO • ACADEMY OPERATING SYSTEM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#151515] tracking-tight leading-[1.08]">
              YOUR ACADEMY.<br />
              <span className="text-[#1F6B4F]">ONE CONNECTED SYSTEM.</span>
            </h1>

            <div className="flex flex-wrap gap-2 text-sm sm:text-base font-bold text-[#1F6B4F]">
              <span>Teach.</span>
              <span className="text-[#6B6B67]">•</span>
              <span>Manage.</span>
              <span className="text-[#6B6B67]">•</span>
              <span>Sell.</span>
              <span className="text-[#6B6B67]">•</span>
              <span>Grow.</span>
            </div>

            <p className="text-sm sm:text-base text-[#6B6B67] font-normal leading-relaxed max-w-xl">
              ECHO brings your courses, students, educators, live classes, payments, CRM, communication and academy website into one connected platform.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link 
                href="/auth/login"
                className="px-6 py-3.5 rounded-xl bg-[#1F6B4F] hover:bg-[#16513B] text-white font-bold text-xs sm:text-sm text-center transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Start Your Academy <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-white border border-[#DEDED8] hover:bg-slate-50 text-[#151515] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-[#1F6B4F] fill-[#1F6B4F]" /> Watch Demo
              </button>
            </div>

            <div className="pt-4 border-t border-[#DEDED8]/60 space-y-2">
              <p className="text-xs font-semibold text-[#6B6B67]">
                <strong className="text-[#151515]">No complicated setup. No scattered tools.</strong> Built for coaching institutes, academies, educators, training centres and modern learning businesses.
              </p>
            </div>
          </div>

          {/* Right Column (30% Overlap Visual - Realistic Product Screenshot) */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white border border-[#DEDED8] rounded-2xl p-4 shadow-xl space-y-4 font-sans text-xs">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-[#DEDED8] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="font-mono text-[10px] text-[#6B6B67] ml-2">echo.northstaracademy.in/admin</span>
                </div>
                <div className="flex items-center gap-2 text-[#6B6B67]">
                  <span className="px-2 py-0.5 rounded bg-[#E5F0EA] text-[#1F6B4F] font-bold text-[10px]">Northstar Academy</span>
                  <div className="w-6 h-6 rounded-full bg-[#1F6B4F] text-white flex items-center justify-center font-bold text-[10px]">SK</div>
                </div>
              </div>

              {/* Top Greeting */}
              <div className="flex items-center justify-between bg-[#F7F6F2] p-3 rounded-xl border border-[#DEDED8]">
                <div>
                  <p className="font-bold text-[#151515]">Good morning, Sarah</p>
                  <p className="text-[10px] text-[#6B6B67]">Academy Manager • Northstar Academy</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-200">
                  ● 8 Classes Today
                </span>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F7F6F2] p-3 rounded-xl border border-[#DEDED8]">
                  <p className="text-[10px] font-medium text-[#6B6B67]">Students</p>
                  <p className="text-base font-black text-[#151515]">1,248</p>
                  <span className="text-[9px] text-emerald-700 font-bold">+14% this mo.</span>
                </div>
                <div className="bg-[#F7F6F2] p-3 rounded-xl border border-[#DEDED8]">
                  <p className="text-[10px] font-medium text-[#6B6B67]">Courses</p>
                  <p className="text-base font-black text-[#151515]">36</p>
                  <span className="text-[9px] text-[#6B6B67]">Active batches</span>
                </div>
                <div className="bg-[#F7F6F2] p-3 rounded-xl border border-[#DEDED8]">
                  <p className="text-[10px] font-medium text-[#6B6B67]">Revenue</p>
                  <p className="text-base font-black text-[#1F6B4F]">₹4.82L</p>
                  <span className="text-[9px] text-emerald-700 font-bold">This month</span>
                </div>
              </div>

              {/* Enrollment Bar Graph */}
              <div className="bg-[#F7F6F2] p-3 rounded-xl border border-[#DEDED8] space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-[#151515]">Monthly Admissions Trend</span>
                  <span className="text-[#1F6B4F]">84 New Enrollments</span>
                </div>
                <div className="h-14 flex items-end gap-2 pt-2 border-b border-[#DEDED8] pb-1">
                  {[35, 42, 58, 65, 74, 84].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-[#1F6B4F]/20 rounded-t hover:bg-[#1F6B4F] transition-all" style={{ height: `${h}%` }}>
                        <div className="w-full bg-[#1F6B4F] rounded-t" style={{ height: `${h * 0.7}%` }} />
                      </div>
                      <span className="text-[8px] text-[#6B6B67] font-mono">{['Apr','May','Jun','Jul','Aug','Sep'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Classes Widget */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-[#151515]">Upcoming Live Sessions</p>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between p-2 bg-[#E5F0EA] border border-[#1F6B4F]/20 rounded-lg">
                    <div>
                      <p className="font-bold text-[#151515]">UI/UX Design Masterclass</p>
                      <p className="text-[#6B6B67]">Batch #14 • 48 Students enrolled</p>
                    </div>
                    <span className="px-2 py-1 bg-[#1F6B4F] text-white rounded font-bold text-[9px]">06:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#F7F6F2] border border-[#DEDED8] rounded-lg">
                    <div>
                      <p className="font-bold text-[#151515]">Digital Marketing Sprint</p>
                      <p className="text-[#6B6B67]">Batch #09 • 32 Students enrolled</p>
                    </div>
                    <span className="px-2 py-1 bg-white border border-[#DEDED8] text-[#151515] rounded font-bold text-[9px]">07:30 PM</span>
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
      <section className="py-4 bg-[#151515] text-white overflow-hidden font-mono text-xs uppercase tracking-widest border-b border-[#DEDED8]">
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
          {["COURSES", "LIVE CLASSES", "CRM", "PAYMENTS", "AUTOMATION", "CERTIFICATES", "WEBSITE", "ANALYTICS", "WHATSAPP", "EXAMS", "BATCHES"].map((cap, i) => (
            <div key={i} className="flex items-center gap-6 text-[#E5F0EA]/80 font-bold">
              <span>{cap}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F6B4F]" />
            </div>
          ))}
          {["COURSES", "LIVE CLASSES", "CRM", "PAYMENTS", "AUTOMATION", "CERTIFICATES", "WEBSITE", "ANALYTICS", "WHATSAPP", "EXAMS", "BATCHES"].map((cap, i) => (
            <div key={`repeat-${i}`} className="flex items-center gap-6 text-[#E5F0EA]/80 font-bold">
              <span>{cap}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F6B4F]" />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03 — THE PROBLEM */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">03 — UNIFIED ARCHITECTURE</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#151515] tracking-tight">
              Your academy shouldn't run across 10 different tools.
            </h2>
            <p className="text-sm text-[#6B6B67] leading-relaxed">
              Moving student data manually between WhatsApp chats, spreadsheets, zoom links and payment gateways causes lost admissions and exhausted staff.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Before ECHO: Scattered Tools */}
            <div className="p-8 rounded-2xl bg-[#F7F6F2] border border-[#DEDED8] space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">BEFORE ECHO</span>
                <span className="text-xs text-[#6B6B67] font-mono">Disconnected Stack</span>
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
                  <div key={idx} className="p-3 bg-white border border-[#DEDED8] rounded-xl text-left space-y-1 shadow-2xs">
                    <p className="font-bold text-xs text-[#151515]">{item.title}</p>
                    <p className="text-[10px] text-[#6B6B67]">{item.desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-rose-700 font-medium border-t border-[#DEDED8] pt-4">
                ❌ Result: High drop-off rate, missed follow-ups, double entry, and frustrated learners.
              </p>
            </div>

            {/* With ECHO: One Connected System */}
            <div className="p-8 rounded-2xl bg-[#151515] text-white border border-[#151515] space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#1F6B4F] text-white font-bold text-xs">WITH ECHO</span>
                <span className="text-xs text-[#E5F0EA] font-mono">One Connected Platform</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#1F6B4F]/20 border border-[#1F6B4F]/40 rounded-xl space-y-2">
                  <h3 className="font-bold text-base text-[#E5F0EA]">ECHO Unified Engine</h3>
                  <p className="text-xs text-slate-300">
                    Brings enquiries, admissions, learning, live sessions, fees, notifications and certificates into one single source of truth.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-medium text-slate-300">
                    ✅ Automated Lead Routing
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-medium text-slate-300">
                    ✅ Unified Student ID
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-medium text-slate-300">
                    ✅ Instant Fee Receipts
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-medium text-slate-300">
                    ✅ Automated Certificates
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs font-bold text-[#E5F0EA] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F6B4F]" /> Every step connected naturally.
              </div>
            </div>

          </div>

          <div className="text-center font-mono text-xs font-bold text-[#6B6B67] tracking-wider uppercase pt-4">
            SCATTERED TOOLS ↓ ECHO ↓ ONE CONNECTED ACADEMY
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 — CORE STORY (LEAD TO LEARNER JOURNEY) */}
      {/* ========================================================================= */}
      <section id="journey" className="py-20 border-b border-[#DEDED8] bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">04 — THE ECHO JOURNEY</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#151515] tracking-tight">
              Every step connected.
            </h2>
            <p className="text-sm text-[#6B6B67]">
              ECHO connects the business side of your academy with the learning side—so information moves naturally from enquiry to enrollment to learning.
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
                    ? "bg-[#1F6B4F] text-white border-[#1F6B4F] shadow-md" 
                    : "bg-white text-[#151515] border-[#DEDED8] hover:border-[#1F6B4F]"
                }`}
              >
                <span className={`font-mono text-xs font-bold block mb-1 ${activeJourneyStep === idx ? "text-[#E5F0EA]" : "text-[#1F6B4F]"}`}>
                  {step.num}
                </span>
                <h3 className="font-bold text-xs tracking-tight mb-1">{step.title}</h3>
                <p className={`text-[10px] leading-tight ${activeJourneyStep === idx ? "text-[#E5F0EA]/90" : "text-[#6B6B67]"}`}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DEDED8] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E5F0EA] text-[#1F6B4F] flex items-center justify-center font-bold font-mono">
                0{activeJourneyStep + 1}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#151515]">
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
                <p className="text-xs text-[#6B6B67]">
                  No manual copy-pasting. ECHO passes state data down the pipeline smoothly.
                </p>
              </div>
            </div>
            <Link 
              href="/auth/login"
              className="px-4 py-2 bg-[#1F6B4F] text-white text-xs font-bold rounded-xl whitespace-nowrap hover:bg-[#16513B] transition-colors"
            >
              Test Journey Workflow →
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05 — PRODUCT ECOSYSTEM (6 CORE SYSTEMS) */}
      {/* ========================================================================= */}
      <section id="ecosystem" className="py-20 border-b border-[#DEDED8] bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">05 — PRODUCT ECOSYSTEM</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#151515] tracking-tight">
              Everything Your Academy Needs
            </h2>
            <p className="text-sm text-[#6B6B67]">
              Instead of 20 small feature cards, ECHO organizes your education business into 6 meaningful core systems.
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
              <div key={idx} className="p-8 rounded-2xl bg-[#F7F6F2] border border-[#DEDED8] space-y-4 hover:border-[#1F6B4F] transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-[#1F6B4F] px-2.5 py-1 bg-[#E5F0EA] rounded-md">
                      SYSTEM {system.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#151515]">{system.title}</h3>
                  <p className="text-xs text-[#6B6B67] leading-relaxed font-normal">{system.desc}</p>
                </div>

                <div className="pt-4 border-t border-[#DEDED8] space-y-2">
                  {system.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#151515]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F6B4F]" />
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
      {/* 06 — LEARNING EXPERIENCE (STUDENT DASHBOARD MOCKUP) */}
      {/* ========================================================================= */}
      <section id="student-experience" className="py-20 border-b border-[#DEDED8] bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">06 — LEARNER EXPERIENCE</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#151515] tracking-tight">
                Give Students a Better Place to Learn
              </h2>
              <p className="text-sm text-[#6B6B67] leading-relaxed">
                Everything students need. Nothing they don't. Students can access their courses, attend live classes, submit assignments, take assessments, track progress and download certificates from one dashboard.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-[#151515]">
                <span className="p-3 bg-white rounded-xl border border-[#DEDED8]">COURSES</span>
                <span className="p-3 bg-white rounded-xl border border-[#DEDED8]">LIVE CLASSES</span>
                <span className="p-3 bg-white rounded-xl border border-[#DEDED8]">ASSIGNMENTS</span>
                <span className="p-3 bg-white rounded-xl border border-[#DEDED8]">CERTIFICATES</span>
              </div>
            </div>

            {/* Dummy Student Dashboard Screenshot Composition */}
            <div className="lg:col-span-7 bg-white border border-[#DEDED8] rounded-2xl p-6 shadow-xl space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-[#DEDED8] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1F6B4F] text-white flex items-center justify-center font-bold text-sm">
                    AS
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#151515]">Hello, Arjun Sharma</h3>
                    <p className="text-[10px] text-[#6B6B67]">Student ID: #NS-8921 • Northstar Academy</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#E5F0EA] text-[#1F6B4F] font-bold text-xs rounded-full">Active Learner</span>
              </div>

              {/* Continue Learning Section */}
              <div className="space-y-3">
                <p className="font-bold text-xs text-[#151515] uppercase tracking-wider">Continue Learning</p>
                <div className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#151515]">UI/UX Design Masterclass</span>
                    <span className="font-mono text-xs text-[#1F6B4F] font-bold">68% Complete</span>
                  </div>
                  <div className="w-full bg-[#DEDED8] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1F6B4F] h-full w-[68%]" />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-[#6B6B67]">Module 4: Wireframing & Prototyping</span>
                    <button className="px-4 py-1.5 bg-[#1F6B4F] text-white font-bold rounded-lg text-xs hover:bg-[#16513B] transition-colors">
                      Continue Learning →
                    </button>
                  </div>
                </div>
              </div>

              {/* Upcoming & Certificates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl space-y-2">
                  <p className="font-bold text-xs text-[#151515]">Upcoming Live Class</p>
                  <p className="font-bold text-xs text-[#1F6B4F]">UX Workshop</p>
                  <p className="text-[10px] text-[#6B6B67]">Today at 6:00 PM • Zoom Integration</p>
                </div>
                <div className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl space-y-2">
                  <p className="font-bold text-xs text-[#151515]">Earned Certificates</p>
                  <p className="font-bold text-xs text-[#151515]">2 Verified Certificates</p>
                  <p className="text-[10px] text-emerald-700 font-bold">Ready to Download PDF</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07 — EDUCATOR EXPERIENCE */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Dummy Educator Dashboard Screenshot Composition */}
            <div className="lg:col-span-7 bg-[#151515] text-white border border-[#151515] rounded-2xl p-6 shadow-xl space-y-6 text-xs order-2 lg:order-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-sm text-[#E5F0EA]">Educator Workspace • Prof. Rajesh Kumar</h3>
                  <p className="text-[10px] text-slate-400">Department of Design & Digital Skills</p>
                </div>
                <span className="px-3 py-1 bg-[#1F6B4F] text-white font-bold text-xs rounded-full">Educator Portal</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-[10px] text-slate-400">My Courses</p>
                  <p className="text-base font-black text-white">3 Active</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-[10px] text-slate-400">Today's Classes</p>
                  <p className="text-base font-black font-mono text-[#E5F0EA]">2 Sessions</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-[10px] text-slate-400">Pending Reviews</p>
                  <p className="text-base font-black text-rose-400">12 Submissions</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-300">Today's Teaching Schedule</p>
                <div className="space-y-2 font-mono">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-xs">06:00 PM — UI/UX Design Workshop</p>
                      <p className="text-[10px] text-slate-400">48 Students • Batch #14</p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#1F6B4F] text-white rounded font-bold text-[10px]">Start Class</span>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">07 — EDUCATOR WORKSPACE</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#151515] tracking-tight">
                Give Educators Their Own Workspace
              </h2>
              <p className="text-sm text-[#6B6B67] leading-relaxed">
                Don't just say "educator management." Show what educators actually do. Educators can manage curriculum, launch live classes, review assignments, conduct assessments and track learner progress.
              </p>

              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold text-[#1F6B4F]">
                <span className="px-3 py-1 bg-[#E5F0EA] rounded-md">CREATE</span>
                <span>→</span>
                <span className="px-3 py-1 bg-[#E5F0EA] rounded-md">TEACH</span>
                <span>→</span>
                <span className="px-3 py-1 bg-[#E5F0EA] rounded-md">TRACK</span>
                <span>→</span>
                <span className="px-3 py-1 bg-[#E5F0EA] rounded-md">ENGAGE</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08 — ACADEMY ADMIN */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">08 — ACADEMY ADMIN</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#151515] tracking-tight">
              Run the Academy From One Dashboard
            </h2>
            <p className="text-sm text-[#6B6B67]">
              Manage the people, learning, payments and daily operations of your academy from one place.
            </p>
          </div>

          <div className="bg-white border border-[#DEDED8] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl space-y-1">
                <p className="text-xs text-[#6B6B67] font-medium">Active Students</p>
                <p className="text-2xl font-black text-[#151515]">1,248</p>
              </div>
              <div className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl space-y-1">
                <p className="text-xs text-[#6B6B67] font-medium">Active Courses</p>
                <p className="text-2xl font-black text-[#151515]">36</p>
              </div>
              <div className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl space-y-1">
                <p className="text-xs text-[#6B6B67] font-medium">Monthly Revenue</p>
                <p className="text-2xl font-black text-[#1F6B4F]">₹4.82L</p>
              </div>
              <div className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl space-y-1">
                <p className="text-xs text-[#6B6B67] font-medium">Avg Attendance</p>
                <p className="text-2xl font-black text-[#151515]">91%</p>
              </div>
            </div>

            <div className="p-4 bg-[#E5F0EA] border border-[#1F6B4F]/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#1F6B4F] animate-pulse" />
                <span className="font-bold text-[#151515]">Academy Operations Operating Normal</span>
              </div>
              <span className="font-mono text-[#1F6B4F] font-bold">Northstar Academy • Central Instance</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 09 — CRM (TURN ENQUIRIES INTO ENROLLMENTS) */}
      {/* ========================================================================= */}
      <section id="crm" className="py-20 border-b border-[#DEDED8] bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">09 — INTEGRATED CRM</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#151515] tracking-tight">
              Turn Enquiries Into Enrollments
            </h2>
            <p className="text-sm text-[#6B6B67]">
              Stop losing admissions between WhatsApp conversations, spreadsheets and follow-ups.
            </p>
          </div>

          {/* Dummy CRM Board Mockup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            
            {/* New Leads */}
            <div className="bg-[#F7F6F2] p-4 rounded-xl border border-[#DEDED8] space-y-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-[#151515]">NEW LEADS</span>
                <span className="px-2 py-0.5 bg-[#DEDED8] rounded text-[10px]">12</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-[#DEDED8] rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-[#151515]">Priya Sharma</p>
                  <p className="text-[10px] text-[#6B6B67]">Course: UI/UX Design</p>
                  <span className="text-[9px] px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold">Meta Ads</span>
                </div>
                <div className="p-3 bg-white border border-[#DEDED8] rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-[#151515]">Karthik V.</p>
                  <p className="text-[10px] text-[#6B6B67]">Course: Digital Marketing</p>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Contacted */}
            <div className="bg-[#F7F6F2] p-4 rounded-xl border border-[#DEDED8] space-y-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-[#151515]">CONTACTED</span>
                <span className="px-2 py-0.5 bg-[#DEDED8] rounded text-[10px]">18</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-[#DEDED8] rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-[#151515]">Rahul Verma</p>
                  <p className="text-[10px] text-[#6B6B67]">Follow-up today at 4 PM</p>
                  <span className="text-[9px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">Counsellor Assigned</span>
                </div>
                <div className="p-3 bg-white border border-[#DEDED8] rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-[#151515]">Divya N.</p>
                  <p className="text-[10px] text-[#6B6B67]">Sent syllabus brochure</p>
                  <span className="text-[9px] px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold">WhatsApp Sent</span>
                </div>
              </div>
            </div>

            {/* Demo */}
            <div className="bg-[#F7F6F2] p-4 rounded-xl border border-[#DEDED8] space-y-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-[#151515]">DEMO / TRIAL</span>
                <span className="px-2 py-0.5 bg-[#DEDED8] rounded text-[10px]">7</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-[#DEDED8] rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-[#151515]">Arjun S.</p>
                  <p className="text-[10px] text-[#6B6B67]">Attended Live Workshop</p>
                  <span className="text-[9px] px-2 py-0.5 bg-[#E5F0EA] text-[#1F6B4F] rounded font-bold">High Intent</span>
                </div>
              </div>
            </div>

            {/* Enrolled */}
            <div className="bg-[#E5F0EA] p-4 rounded-xl border border-[#1F6B4F]/30 space-y-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-[#1F6B4F]">ENROLLED (WON)</span>
                <span className="px-2 py-0.5 bg-[#1F6B4F] text-white rounded text-[10px]">24</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-[#1F6B4F]/30 rounded-lg shadow-2xs space-y-1">
                  <p className="font-bold text-[#151515]">Vivek M.</p>
                  <p className="text-[10px] text-[#1F6B4F] font-bold">Fee Paid ₹14,999</p>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Auto Access Granted</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10 — AUTOMATION */}
      {/* ========================================================================= */}
      <section id="automation" className="py-20 border-b border-[#DEDED8] bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">10 — VISUAL AUTOMATION</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#151515] tracking-tight">
              Let ECHO Handle the Repetitive Work
            </h2>
            <p className="text-sm text-[#6B6B67]">
              Build the workflow once. Let ECHO run it automatically.
            </p>
          </div>

          <div className="bg-white border border-[#DEDED8] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-[#DEDED8] pb-4">
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
                      ? "bg-[#1F6B4F] text-white"
                      : "bg-[#F7F6F2] text-[#6B6B67] hover:bg-[#DEDED8]"
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
                <div key={i} className="p-3 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl font-bold text-[#151515] flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F6B4F] flex items-center justify-center text-[10px]">{i + 1}</span>
                  {node}
                </div>
              ))}

              {activeWorkflowTab === "payment" && [
                "WHEN Student Enrolled",
                "THEN Send Welcome Message",
                "THEN Grant Instant Course Access",
                "THEN Send Class Reminder via WhatsApp"
              ].map((node, i) => (
                <div key={i} className="p-3 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl font-bold text-[#151515] flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F6B4F] flex items-center justify-center text-[10px]">{i + 1}</span>
                  {node}
                </div>
              ))}

              {activeWorkflowTab === "inactive" && [
                "WHEN Payment Due in 2 Days",
                "THEN Send WhatsApp Fee Reminder",
                "THEN Send Email Invoice Breakdown"
              ].map((node, i) => (
                <div key={i} className="p-3 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl font-bold text-[#151515] flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F6B4F] flex items-center justify-center text-[10px]">{i + 1}</span>
                  {node}
                </div>
              ))}

              {activeWorkflowTab === "completion" && [
                "WHEN Final Assessment Passed",
                "THEN Generate PDF Certificate #ECHO-CERT",
                "THEN Send Certificate via WhatsApp & Email"
              ].map((node, i) => (
                <div key={i} className="p-3 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl font-bold text-[#151515] flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F6B4F] flex items-center justify-center text-[10px]">{i + 1}</span>
                  {node}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11 — LIVE LEARNING */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">11 — LIVE LEARNING</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#151515] tracking-tight">
                Teach Live. Teach Recorded. Teach Your Way.
              </h2>
              <p className="text-sm text-[#6B6B67] leading-relaxed">
                Schedule classes, webinars, and mentoring sessions using native Zoom and Google Meet integrations where configured.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-[#151515]">
                <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#DEDED8]">● Live Classes</div>
                <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#DEDED8]">● Recorded Courses</div>
                <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#DEDED8]">● Hybrid Learning</div>
                <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#DEDED8]">● Attendance Logs</div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#151515] text-white p-6 rounded-2xl border border-[#151515] shadow-xl space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-[#E5F0EA] font-bold">LIVE CLASS STUDIO</span>
                <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] rounded font-bold animate-pulse">● LIVE NOW</span>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-3">
                <p className="text-sm font-bold text-white">UI/UX Design Masterclass Workshop</p>
                <p className="text-xs text-slate-400">Host: Prof. Rajesh Kumar • 48 Students Joined</p>
                <button className="px-6 py-2.5 bg-[#1F6B4F] text-white font-bold rounded-lg text-xs hover:bg-[#16513B] transition-colors">
                  Join Live Session (Zoom / Meet)
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12 — COURSE BUILDER */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">12 — COURSE BUILDER</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#151515] tracking-tight">
              Turn Knowledge Into Structured Learning
            </h2>
            <p className="text-sm text-[#6B6B67]">
              Build multi-module curriculums with videos, PDFs, live sessions, quizzes, assignments and certificates.
            </p>
          </div>

          <div className="bg-white border border-[#DEDED8] rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
            <div className="font-bold text-sm text-[#151515] border-b border-[#DEDED8] pb-3">
              CURRICULUM BUILDER: UI/UX Design Masterclass
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#DEDED8] font-bold text-[#151515]">
                MODULE 01: Introduction to Design Systems
              </div>
              <div className="p-3 bg-[#F7F6F2] rounded-xl border border-[#DEDED8] font-bold text-[#151515]">
                MODULE 02: User Research & Wireframing
              </div>
              <div className="p-3 bg-[#E5F0EA] rounded-xl border border-[#1F6B4F]/30 font-bold text-[#1F6B4F]">
                MODULE 03: Interactive Prototyping in Figma
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 bg-white border border-[#DEDED8] rounded text-[10px] font-bold">+ Add Video</span>
              <span className="px-3 py-1 bg-white border border-[#DEDED8] rounded text-[10px] font-bold">+ Add PDF</span>
              <span className="px-3 py-1 bg-white border border-[#DEDED8] rounded text-[10px] font-bold">+ Add Quiz</span>
              <span className="px-3 py-1 bg-white border border-[#DEDED8] rounded text-[10px] font-bold">+ Add Live Class</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13 — WEBSITE BUILDER */}
      {/* ========================================================================= */}
      <section id="website-builder" className="py-20 border-b border-[#DEDED8] bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">13 — ACADEMY WEBSITE BUILDER</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#151515] tracking-tight">
                Your Academy Deserves Its Own Website
              </h2>
              <p className="text-sm text-[#6B6B67] leading-relaxed">
                Build your academy website without waiting for a developer. Includes custom domain, logo, colors, pages, course catalogue, and mobile responsive design.
              </p>

              <div className="space-y-2 text-xs font-semibold text-[#151515]">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1F6B4F]" /> Custom Domain Support</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1F6B4F]" /> Course Catalogue Pages</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1F6B4F]" /> Admission Forms</div>
              </div>
            </div>

            {/* Dummy Theme Builder Mockup */}
            <div className="lg:col-span-7 bg-[#F7F6F2] border border-[#DEDED8] rounded-2xl p-6 shadow-xl space-y-4 font-sans text-xs">
              <div className="flex justify-between items-center border-b border-[#DEDED8] pb-3">
                <span className="font-bold text-[#151515]">WEBSITE THEME EDITOR</span>
                <span className="px-2.5 py-1 bg-[#1F6B4F] text-white rounded font-bold text-[10px]">Published Live</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-xl border border-[#DEDED8] space-y-2 font-mono text-[10px]">
                  <p className="font-bold text-[#151515]">SECTIONS</p>
                  <p className="p-1 bg-[#E5F0EA] text-[#1F6B4F] rounded">Hero Banner</p>
                  <p className="p-1 bg-[#F7F6F2] rounded">Courses Grid</p>
                  <p className="p-1 bg-[#F7F6F2] rounded">About Section</p>
                  <p className="p-1 bg-[#F7F6F2] rounded">FAQ Accordion</p>
                </div>

                <div className="col-span-2 bg-white p-4 rounded-xl border border-[#DEDED8] space-y-3">
                  <div className="p-3 bg-[#151515] text-white rounded-lg space-y-1">
                    <p className="font-black text-sm">BRIGHT ACADEMY</p>
                    <p className="text-[10px] text-slate-300">Learn Skills That Matter. Join 1,200+ Students.</p>
                  </div>
                  <div className="p-2 bg-[#F7F6F2] rounded text-[10px] font-bold text-center">
                    [ Explore Courses ]
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14 — YOUR BRAND (WHITE LABEL) */}
      {/* ========================================================================= */}
      <section id="branding" className="py-20 border-b border-[#DEDED8] bg-[#151515] text-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E5F0EA]">14 — WHITE-LABEL BRANDING</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Powered by ECHO. Experienced as your academy.
            </h2>
            <p className="text-sm text-slate-300">
              ECHO disappears behind your brand. Your custom domain, logo, colors, and unique student experience.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {(["northstar", "bright", "creative"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveBrandTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeBrandTab === tab
                    ? "bg-[#1F6B4F] text-white"
                    : "bg-slate-900 text-slate-400 border border-slate-800"
                }`}
              >
                {tab} Academy Preview
              </button>
            ))}
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center space-y-4">
            <p className="text-xs font-mono text-slate-400">
              {activeBrandTab === "northstar" && "https://learn.northstaracademy.in"}
              {activeBrandTab === "bright" && "https://courses.brightacademy.com"}
              {activeBrandTab === "creative" && "https://academy.creativeskills.io"}
            </p>
            <h3 className="text-2xl font-black text-[#E5F0EA] uppercase tracking-wider">
              {activeBrandTab === "northstar" && "NORTHSTAR ACADEMY"}
              {activeBrandTab === "bright" && "BRIGHT SKILLS INSTITUTE"}
              {activeBrandTab === "creative" && "CREATIVE DESIGN SCHOOL"}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Same ECHO underlying technology. Entirely customized branding, logo, colors, and CNAME domain.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 15 — PAYMENTS */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">15 — PAYMENTS & COMMERCE</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#151515] tracking-tight">
                Make Getting Paid Part of Learning
              </h2>
              <p className="text-sm text-[#6B6B67] leading-relaxed">
                Online payments, course fees, instant GST invoices, coupons, payment tracking and automated fee reminders via Razorpay & Stripe integrations.
              </p>
            </div>

            <div className="lg:col-span-7 bg-[#F7F6F2] border border-[#DEDED8] rounded-2xl p-6 shadow-xl space-y-4 font-sans text-xs">
              <div className="p-4 bg-white border border-[#DEDED8] rounded-xl space-y-3">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-[#151515]">COURSE CHECKOUT</span>
                  <span className="text-[#1F6B4F]">₹12,999</span>
                </div>
                <p className="text-[10px] text-[#6B6B67]">Advanced UI/UX Masterclass • Northstar Academy</p>
                <div className="flex gap-2 text-[10px] font-bold">
                  <span className="px-2 py-1 bg-[#E5F0EA] text-[#1F6B4F] rounded">UPI</span>
                  <span className="px-2 py-1 bg-[#F7F6F2] rounded">Card</span>
                  <span className="px-2 py-1 bg-[#F7F6F2] rounded">Net Banking</span>
                </div>
              </div>

              <div className="p-4 bg-[#E5F0EA] border border-[#1F6B4F]/30 rounded-xl space-y-1 font-mono text-[10px]">
                <p className="font-bold text-[#1F6B4F]">PAYMENT RECEIVED • INVOICE #ECHO-1024</p>
                <p className="text-[#151515]">Student enrolled automatically. Login credentials sent to WhatsApp.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 16 — COMMUNICATION */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">16 — AUTOMATED COMMUNICATION</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#151515] tracking-tight">
              Stay Connected Without Chasing Everyone
            </h2>
            <p className="text-sm text-[#6B6B67]">
              Class reminders, payment updates, announcements and student communication—without manually sending every message.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white border border-[#DEDED8] rounded-2xl p-4 shadow-xl space-y-3 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-[#DEDED8] pb-2 text-[10px] font-bold text-[#6B6B67]">
              <span>WHATSAPP OFFICIAL NOTIFICATION</span>
              <span>10:42 AM</span>
            </div>

            <div className="p-3 bg-[#E5F0EA] border border-[#1F6B4F]/20 rounded-xl space-y-2">
              <p className="font-bold text-[#151515]">BRIGHT ACADEMY</p>
              <p className="text-[#151515]">
                Your UI/UX Design class starts today at 6:00 PM. Tap below to join your live room:
              </p>
              <div className="p-2 bg-[#1F6B4F] text-white rounded text-center font-bold text-[10px]">
                [ Join Live Class ]
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-[#6B6B67] font-mono pt-1">
              <span>WhatsApp</span>
              <span>• Email</span>
              <span>• Push Notification</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 17 — ANALYTICS */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">17 — ACADEMY ANALYTICS</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#151515] tracking-tight">
              Know What's Happening Inside Your Academy
            </h2>
            <p className="text-sm text-[#6B6B67]">
              Real-time demo data and analytics for enrollments, revenue, attendance, course completion rates and lead conversion.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center font-mono text-xs">
            <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#DEDED8]">
              <p className="text-[10px] text-[#6B6B67]">STUDENTS</p>
              <p className="text-xl font-black text-[#151515]">1,248</p>
            </div>
            <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#DEDED8]">
              <p className="text-[10px] text-[#6B6B67]">ENROLLMENTS</p>
              <p className="text-xl font-black text-[#151515]">324</p>
            </div>
            <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#DEDED8]">
              <p className="text-[10px] text-[#6B6B67]">COMPLETION</p>
              <p className="text-xl font-black text-[#151515]">78%</p>
            </div>
            <div className="p-4 bg-[#F7F6F2] rounded-xl border border-[#DEDED8]">
              <p className="text-[10px] text-[#6B6B67]">ATTENDANCE</p>
              <p className="text-xl font-black text-[#151515]">91%</p>
            </div>
            <div className="p-4 bg-[#E5F0EA] rounded-xl border border-[#1F6B4F]/30 col-span-2 sm:col-span-1">
              <p className="text-[10px] text-[#1F6B4F]">REVENUE</p>
              <p className="text-xl font-black text-[#1F6B4F]">₹4.82L</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 18 — WHO IS ECHO FOR */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">18 — AUDIENCE & USE CASES</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#151515] tracking-tight">
              One Platform. Different Ways to Teach.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Coaching Institutes", desc: "Admissions, batches, attendance, exams and communication." },
              { title: "Skill Academies", desc: "Courses, assignments, projects and certificates." },
              { title: "Online Educators", desc: "Recorded courses, live classes and payments." },
              { title: "Training Centres", desc: "Students, educators, schedules and reporting." },
              { title: "Professional Institutes", desc: "Programs, assessments, certificates and CRM." },
              { title: "Education Businesses", desc: "Sell courses, build communities and grow your audience." },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white border border-[#DEDED8] rounded-2xl space-y-2">
                <h3 className="font-bold text-base text-[#151515]">{item.title}</h3>
                <p className="text-xs text-[#6B6B67] font-normal leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 19 — INTEGRATIONS */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">19 — INTEGRATIONS</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#151515] tracking-tight">
              ECHO Fits Into Your Existing Workflow
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
            {[
              { name: "ZOOM", status: "Active" },
              { name: "GOOGLE MEET", status: "Active" },
              { name: "RAZORPAY", status: "Active" },
              { name: "STRIPE", status: "Active" },
              { name: "WHATSAPP (META)", status: "Active" },
              { name: "EMAIL (SMTP)", status: "Active" },
              { name: "GOOGLE CALENDAR", status: "Active" },
              { name: "CLOUD STORAGE", status: "Active" },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl space-y-1">
                <p className="font-black text-[#151515]">{item.name}</p>
                <span className="text-[10px] text-[#1F6B4F] font-bold">{item.status}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 20 — SETUP JOURNEY */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">20 — SETUP JOURNEY</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#151515] tracking-tight">
              Start Small. Build As You Grow.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 font-mono text-xs">
            {[
              { step: "01", title: "CREATE", desc: "Create your account and academy profile." },
              { step: "02", title: "BRAND", desc: "Add logo, colors, domain and details." },
              { step: "03", title: "BUILD", desc: "Build your curriculum and learning content." },
              { step: "04", title: "CONNECT", desc: "Import or invite your learners." },
              { step: "05", title: "SELL", desc: "Start accepting course fees online." },
              { step: "06", title: "GO LIVE", desc: "Publish your academy and start teaching." },
            ].map((s, idx) => (
              <div key={idx} className="p-4 bg-white border border-[#DEDED8] rounded-xl space-y-2">
                <span className="text-[#1F6B4F] font-bold">{s.step}</span>
                <p className="font-bold text-[#151515]">{s.title}</p>
                <p className="text-[10px] text-[#6B6B67] font-sans">{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 21 — WHITE LABEL & DATA ISOLATION */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-[#151515] text-white">
        <div className="max-w-7xl mx-auto px-6 space-y-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E5F0EA]">21 — WHITE LABEL & DATA ISOLATION</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Your Academy. Your Data. Your Identity.
          </h2>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl mx-auto font-mono text-xs space-y-2 text-[#E5F0EA]">
            <p>ECHO ↓ YOUR LOGO • YOUR DOMAIN • YOUR COLORS • YOUR WEBSITE • YOUR STUDENT EXPERIENCE</p>
            <p className="text-[10px] text-slate-400">ECHO powers the technology in the background. Your academy stays at the front.</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 22 — SECURITY & CONTROL */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">22 — SECURITY & CONTROL</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#151515] tracking-tight">
              Built With Control at Every Level
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
            <div className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl font-bold">ROLE-BASED ACCESS</div>
            <div className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl font-bold">DATA ISOLATION</div>
            <div className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl font-bold">AUDIT LOGS</div>
            <div className="p-4 bg-[#F7F6F2] border border-[#DEDED8] rounded-xl font-bold">BACKUPS & SSL</div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 23 — SOCIAL PROOF / DEMO ACADEMIES */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-[#DEDED8] bg-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">23 — ACADEMY PROFILES</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#151515] tracking-tight">
              Designed for Real Education Businesses
            </h2>
            <p className="text-xs text-[#6B6B67]">
              Demo academy profiles below illustrate live system capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
            {[
              { name: "Northstar Academy", type: "Coaching Institute", stats: "1,248 Students • 36 Courses" },
              { name: "Bright Academy", type: "Skill Institute", stats: "850 Students • 18 Courses" },
              { name: "Creative Skills School", type: "Design Studio", stats: "420 Students • 12 Courses" },
            ].map((demo, idx) => (
              <div key={idx} className="p-6 bg-white border border-[#DEDED8] rounded-2xl space-y-2">
                <span className="text-[10px] px-2 py-0.5 bg-[#E5F0EA] text-[#1F6B4F] font-bold rounded">Demo Academy</span>
                <h3 className="font-bold text-base text-[#151515]">{demo.name}</h3>
                <p className="text-xs text-[#6B6B67]">{demo.type}</p>
                <p className="text-xs font-mono font-bold text-[#1F6B4F] pt-2">{demo.stats}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 24 — FAQ ACCORDION */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 border-b border-[#DEDED8] bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F6B4F]">24 — FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#151515] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: "Can I create my own academy website?", a: "Yes. ECHO provides academy website and branding tools." },
              { q: "Can students register themselves?", a: "Yes. Academy administrators can control student registration." },
              { q: "Can educators register?", a: "Yes, depending on the academy's registration and approval settings." },
              { q: "Can academy admins register themselves?", a: "No. Academy owner accounts are created through ECHO onboarding." },
              { q: "Can I conduct live classes?", a: "Yes. ECHO supports live learning workflows and integrations such as Zoom and Google Meet where configured." },
              { q: "Can I sell courses?", a: "Yes. You can create paid courses and connect supported payment gateways." },
              { q: "Can I connect my own domain?", a: "Yes, with custom-domain support." },
              { q: "Can I use my own branding?", a: "Yes. ECHO is designed to support academy branding and white-label experiences depending on your plan." },
              { q: "Can I manage leads?", a: "Yes. ECHO combines LMS and CRM workflows so enquiries can move toward enrollment." },
              { q: "Can I automate WhatsApp communication?", a: "Yes, when the relevant WhatsApp integration is connected and configured." }
            ].map((faq, index) => (
              <div key={index} className="border border-[#DEDED8] rounded-xl overflow-hidden bg-[#F7F6F2]">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 flex items-center justify-between font-bold text-xs sm:text-sm text-[#151515] hover:bg-[#DEDED8]/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp className="w-4 h-4 text-[#1F6B4F]" /> : <ChevronDown className="w-4 h-4 text-[#6B6B67]" />}
                </button>

                {openFaq === index && (
                  <div className="px-4 pb-4 text-xs text-[#6B6B67] leading-relaxed border-t border-[#DEDED8]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 25 — FINAL CTA & FOOTER */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#151515] text-white">
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
              className="w-full sm:w-auto px-8 py-4 bg-[#1F6B4F] hover:bg-[#16513B] text-white font-bold text-sm rounded-xl transition-all shadow-lg"
            >
              Start Your Academy
            </Link>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all"
            >
              Talk to ECHO
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Book a walkthrough and see how ECHO fits your academy.
          </p>
        </div>
      </section>

      {/* Multi-Column Editorial Footer */}
      <footer className="py-12 bg-[#0D0D0D] text-slate-400 text-xs border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base">ECHO</span>
              <span className="px-2 py-0.5 bg-[#1F6B4F] text-white text-[10px] font-bold rounded">OS</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Your Academy. One Connected System. Teach, manage, sell and grow from one platform.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white uppercase tracking-wider text-[10px]">PRODUCT</p>
            <ul className="space-y-1.5 font-medium">
              <li><a href="#ecosystem" className="hover:text-white">LMS</a></li>
              <li><a href="#crm" className="hover:text-white">CRM</a></li>
              <li><a href="#automation" className="hover:text-white">Automation</a></li>
              <li><a href="#website-builder" className="hover:text-white">Website Builder</a></li>
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
            <p className="font-bold text-white uppercase tracking-wider text-[10px]">LEGAL & COMPANY</p>
            <ul className="space-y-1.5 font-medium">
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500">
          <p>© 2026 ECHO. Powered by Grekam.</p>
          <p>The Operating System for Modern Education Businesses.</p>
        </div>
      </footer>

      {/* DEMO BOOKING MODAL */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#151515]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DEDED8] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-left text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDED8]">
              <div>
                <h3 className="text-base font-black text-[#151515]">Book an ECHO Demo</h3>
                <p className="text-[10px] text-[#6B6B67]">Walkthrough for your academy</p>
              </div>
              <button onClick={() => setIsDemoModalOpen(false)} className="text-[#6B6B67] hover:text-[#151515] text-base font-bold">&times;</button>
            </div>

            <form onSubmit={e => { e.preventDefault(); toast.success("Demo booking submitted! An ECHO specialist will contact you shortly."); setIsDemoModalOpen(false) }} className="space-y-3">
              <div>
                <label className="font-bold text-[#151515] block mb-1">Full Name *</label>
                <input required placeholder="e.g. Sarah Jenkins" className="w-full bg-[#F7F6F2] border border-[#DEDED8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-[#1F6B4F]" />
              </div>
              <div>
                <label className="font-bold text-[#151515] block mb-1">Academy / Business Name *</label>
                <input required placeholder="e.g. Northstar Academy" className="w-full bg-[#F7F6F2] border border-[#DEDED8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-[#1F6B4F]" />
              </div>
              <div>
                <label className="font-bold text-[#151515] block mb-1">WhatsApp Phone Number *</label>
                <input required placeholder="+91 98765 43210" className="w-full bg-[#F7F6F2] border border-[#DEDED8] rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-[#1F6B4F]" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#1F6B4F] hover:bg-[#16513B] text-white font-bold rounded-xl shadow-xs transition-all">
                Submit Demo Request →
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
