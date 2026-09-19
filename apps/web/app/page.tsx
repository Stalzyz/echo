"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Sparkles, GraduationCap, Users, Bot, MessageSquare, CreditCard, 
  BarChart3, CheckCircle2, ArrowRight, Play, ChevronDown, ChevronUp, 
  Globe, Shield, Zap, Video, Check, Laptop, Layers, Calendar, Clock, Lock, User
} from "lucide-react"
import { toast } from "sonner"
import { UnifiedLoginPortal } from "@/components/auth/UnifiedLoginPortal"

export default function PublicHomePage() {
  const [activeWorkflow, setActiveWorkflow] = useState<"lead" | "payment" | "inactive" | "completion">("lead")
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500/20">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-black shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">Echo</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-black uppercase tracking-wider">
                  Pro SaaS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Operating System for Education</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-teal-700 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-teal-700 transition-colors">Solutions</a>
            <a href="#journey" className="hover:text-teal-700 transition-colors">Student Journey</a>
            <a href="#automation" className="hover:text-teal-700 transition-colors">Automation</a>
            <a href="#live-classes" className="hover:text-teal-700 transition-colors">Live Learning</a>
            <a href="#white-label" className="hover:text-teal-700 transition-colors">White Label</a>
            <a href="#faq" className="hover:text-teal-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/auth/login" 
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              Academy Login →
            </Link>

            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Get Started
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH ALL-IN-ONE UNIFIED LOGIN PORTAL */}
      <section className="relative pt-12 pb-20 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              Echo • UNIFIED SINGLE WINDOW PLATFORM
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Run Your Entire Academy <br />
              <span className="text-teal-600 underline decoration-teal-300 decoration-wavy">From One Unified Platform.</span>
            </h1>

            <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-2xl mx-auto">
              Single-window access for Students, Educators, Academy Admins & Super Admins.
            </p>
          </div>

          {/* SINGLE WINDOW UNIFIED LOGIN CARD EMBEDDED IN HERO */}
          <div id="login-portal" className="pt-4 max-w-2xl mx-auto">
            <UnifiedLoginPortal defaultRole="student" isStandalonePage={false} />
          </div>

        </div>
      </section>

      {/* 3. PROBLEM / TRANSFORMATION SECTION */}
      <section className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Your Academy Has Outgrown Spreadsheets.
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">
              Disconnected tools slow your growth and cause lost enquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, title: "Leads scattered in WhatsApp", desc: "Enquiries sit unreplied in personal chats." },
              { icon: Layers, title: "Student data in spreadsheets", desc: "Fragmented sheets that get outdated instantly." },
              { icon: Laptop, title: "Courses on separate platforms", desc: "No connection between lead signup and LMS access." },
              { icon: CreditCard, title: "Payments in isolated gateways", desc: "Manual payment tracking and delayed fee reminders." },
              { icon: Video, title: "Classes on random Zoom links", desc: "Untracked attendance and manual recording shares." },
              { icon: Clock, title: "Follow-ups depend on memory", desc: "No automated reminders or structured counsellors pipeline." },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Transformation Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
            <span className="text-xs font-black uppercase tracking-widest text-teal-400 block">The Echo Unified Solution</span>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight text-white">Echo brings it all together.</h3>
            
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-bold pt-2">
              {["Leads", "CRM", "Admissions", "Payments", "Learning", "Automation", "Certification", "Growth"].map((step, i, arr) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-teal-300">
                    {step}
                  </span>
                  {i < arr.length - 1 && <span className="text-slate-600 font-mono">→</span>}
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> One connected student journey</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> One centralized platform</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. EVERYTHING YOUR ACADEMY NEEDS (6 PILLARS GRID) */}
      <section id="features" className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider rounded-full border border-teal-200">
              EVERYTHING YOUR ACADEMY NEEDS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              One Platform. Every Part of Your Education Business.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "🎓 LMS",
                desc: "Create and sell courses, manage lessons, assignments, quizzes, certificates and student progress.",
                chips: ["Courses", "Batches", "Assessments", "Certificates"]
              },
              {
                icon: Users,
                title: "🤝 CRM & Admissions",
                desc: "Capture leads, assign counsellors, manage follow-ups and convert enquiries into enrollments.",
                chips: ["Leads", "Pipeline", "Counselling", "Admissions"]
              },
              {
                icon: Bot,
                title: "🤖 Automation",
                desc: "Build workflows that automatically handle repetitive tasks across your academy.",
                chips: ["Trigger", "Condition", "Action", "Node Builder"]
              },
              {
                icon: MessageSquare,
                title: "📱 WhatsApp & Communication",
                desc: "Automate reminders, follow-ups, announcements, payment alerts and student engagement.",
                chips: ["WhatsApp", "Email", "SMS", "Notifications"]
              },
              {
                icon: CreditCard,
                title: "💳 Payments & Commerce",
                desc: "Sell courses, workshops, subscriptions and memberships with integrated payments.",
                chips: ["Payments", "Invoices", "Coupons", "Subscriptions"]
              },
              {
                icon: BarChart3,
                title: "📊 Analytics",
                desc: "Know what's happening across your students, sales, courses, teams and revenue.",
                chips: ["LMS", "CRM", "Sales", "Marketing", "Automation"]
              }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-8 space-y-5 shadow-2xs hover:border-teal-300 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 font-black">
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{pillar.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{pillar.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {pillar.chips.map((chip, cIdx) => (
                    <span key={cIdx} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200/80">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. FROM LEAD TO LEARNER (7-STEP STUDENT JOURNEY) */}
      <section id="journey" className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider rounded-full border border-teal-200">
              FROM LEAD TO LEARNER
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Echo Connects the Entire Student Journey.
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { num: "01", title: "Capture", desc: "Bring enquiries from your website, landing pages, Meta, Google, WhatsApp, referrals and more." },
              { num: "02", title: "Convert", desc: "Automatically assign leads, notify counsellors and start follow-up workflows." },
              { num: "03", title: "Enroll", desc: "Collect payment and automatically create the student's learning account." },
              { num: "04", title: "Teach", desc: "Deliver recorded courses, assignments, assessments and live sessions." },
              { num: "05", title: "Engage", desc: "Keep students active with automated WhatsApp, email and notification journeys." },
              { num: "06", title: "Certify", desc: "Automatically generate and deliver branded certificates." },
              { num: "07", title: "Grow", desc: "Recommend courses, workshops, memberships and renewal opportunities." },
            ].map((step, idx) => (
              <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex items-start gap-6 hover:bg-white hover:border-teal-300 transition-all group">
                <span className="text-2xl font-black text-teal-600 font-mono group-hover:scale-110 transition-transform">{step.num}</span>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <span className="text-sm font-black text-slate-900 bg-teal-50 border border-teal-200 px-6 py-3 rounded-2xl inline-block shadow-2xs">
              Every stage connected. Nothing gets lost.
            </span>
          </div>

        </div>
      </section>

      {/* 6. AUTOMATION THAT ACTUALLY DOES THE WORK */}
      <section id="automation" className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider rounded-full border border-teal-200">
              VISUAL AUTOMATION ENGINE
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Stop Chasing Tasks. Build Workflows.
            </h2>
            <p className="text-slate-500 font-medium text-sm">Visual TRIGGER → CONDITION → ACTION automation builder.</p>
          </div>

          {/* Interactive Workflow Tabs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xs">
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              {[
                { id: "lead", label: "New Lead Workflow" },
                { id: "payment", label: "Payment Failed Recovery" },
                { id: "inactive", label: "Student Inactive Alert" },
                { id: "completion", label: "Course Completed" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveWorkflow(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeWorkflow === tab.id 
                      ? "bg-teal-600 text-white shadow-xs" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Workflow Flow Steps */}
            <div className="space-y-3 pt-2 font-mono text-xs">
              {activeWorkflow === "lead" && [
                "TRIGGER: New Lead Captured from Facebook / Website",
                "ACTION: Assign Lead to Counsellor (Rahul)",
                "ACTION: Dispatch Welcome WhatsApp Message with Brochure",
                "ACTION: Create Follow-up Task in CRM",
                "CONDITION: Check Response after 2 Hours",
                "ACTION: Continue Nurture Sequence"
              ].map((step, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">{i + 1}</span>
                  {step}
                </div>
              ))}

              {activeWorkflow === "payment" && [
                "TRIGGER: Payment Failed at Checkout",
                "ACTION: Dispatch Instant WhatsApp Payment Link",
                "ACTION: Send Email Invoice & Breakdown",
                "ACTION: Notify Accounts Team in CRM",
                "ACTION: Schedule Automated 24h Reminder"
              ].map((step, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">{i + 1}</span>
                  {step}
                </div>
              ))}

              {activeWorkflow === "inactive" && [
                "TRIGGER: Student Inactive in LMS for 7 Days",
                "ACTION: Dispatch Encapsulated WhatsApp Encouragement Message",
                "ACTION: Notify Assigned Educator / Mentor",
                "ACTION: Create Retention Re-engagement Task"
              ].map((step, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">{i + 1}</span>
                  {step}
                </div>
              ))}

              {activeWorkflow === "completion" && [
                "TRIGGER: Student Completed Final Course Assessment",
                "ACTION: Auto-Generate Branded A4 PDF Certificate",
                "ACTION: Send Certificate via WhatsApp & Email",
                "ACTION: Request Course Review & Feedback",
                "ACTION: Recommend Advanced Upsell Course"
              ].map((step, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center text-xs font-semibold text-slate-500 border-t border-slate-100">
              <span>Your team focuses on people. Echo handles the repetitive work.</span>
              <Link href="/dashboard/academy/automation" className="text-teal-700 font-bold hover:underline">Explore Automation →</Link>
            </div>
          </div>

        </div>
      </section>

      {/* 7. LIVE CLASSES, WORKSHOPS, WEBINARS */}
      <section id="live-classes" className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider rounded-full border border-teal-200">
              LIVE LEARNING & WEBINARS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Teach Live Without Leaving Echo.
            </h2>
            <p className="text-slate-500 font-medium text-sm">Connect your Zoom and Google Meet accounts directly with your academy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
              <h3 className="text-lg font-black text-slate-900">Create & Manage</h3>
              <ul className="space-y-2 text-xs font-bold text-slate-700">
                {["Live Classes", "Workshops", "Webinars", "Masterclasses", "Mentoring Sessions", "Consultations"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
              <h3 className="text-lg font-black text-slate-900">Automate Everything</h3>
              <ul className="space-y-2 text-xs font-bold text-slate-700">
                {["Schedule sessions & generate links", "Assign instructors & notify students", "Send reminders & track attendance", "Share recordings & trigger follow-ups"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <span className="text-sm font-black text-slate-900 bg-teal-50 border border-teal-200 px-6 py-3 rounded-2xl inline-block">
              One calendar for your entire academy.
            </span>
          </div>

        </div>
      </section>

      {/* 8. SALES TEAM + ACADEMIC TEAM UNIFIED DATA */}
      <section className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Your Sales Team + Your Academic Team
            </h2>
            <p className="text-slate-500 font-medium text-sm">Finally Working From the Same Data.</p>
          </div>

          <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-bold text-slate-800">
              {["CRM", "Admission", "Payment", "Enrollment", "LMS", "Student Progress", "Certificate", "Next Purchase"].map((node, i, arr) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl">{node}</span>
                  {i < arr.length - 1 && <span className="text-slate-400">→</span>}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-center">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs text-slate-800">
                Your counsellors see the student.
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs text-slate-800">
                Your instructors see the student.
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs text-slate-800">
                Your management sees the numbers.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9. YOUR BRAND. YOUR PLATFORM (WHITE LABEL SHOWCASE) */}
      <section id="white-label" className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider rounded-full border border-teal-200">
              MULTI-TENANT WHITE LABEL
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Make Echo Look Like Your Business.
            </h2>
            <p className="text-slate-500 font-medium text-sm">Customize your LMS + CRM directly from your dashboard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { category: "Brand", items: ["Logo", "Favicon", "App Icon", "Login Branding"] },
              { category: "Design", items: ["Colors", "Typography", "Buttons", "Cards", "Sidebar", "Navigation"] },
              { category: "Experience", items: ["Light Mode", "Dark Mode", "Login Page", "Dashboard", "LMS", "CRM"] },
              { category: "Enterprise White Label", items: ["Custom Domain", "Custom Branding", "Email Branding", "Certificate Branding", "App Branding", "Remove Echo Branding"] }
            ].map((col, i) => (
              <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{col.category}</h3>
                <ul className="space-y-1.5 text-xs font-semibold text-slate-600">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-600" /> {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm font-black text-slate-900">Your academy doesn't have to look like everyone else's.</p>
          </div>

        </div>
      </section>

      {/* 10. BUILT FOR GROWING EDUCATION BUSINESSES */}
      <section className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Built for Growing Education Businesses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { type: "Coaching Institutes", formula: "Admissions + CRM + Batches + Fees + LMS" },
              { type: "Training Academies", formula: "Courses + Live Classes + Assessments + Certificates" },
              { type: "EdTech Companies", formula: "LMS + CRM + Automation + Commerce + APIs" },
              { type: "Universities & Institutions", formula: "Students + Programs + Departments + Branches + Analytics" },
              { type: "Corporate Training", formula: "Programs + Employees + Assessments + Completion" },
              { type: "Multi-Branch Academies", formula: "Centralized management across every location." }
            ].map((uc, i) => (
              <div key={i} className="p-6 bg-white border border-slate-200 rounded-3xl space-y-2 shadow-2xs">
                <h3 className="font-black text-base text-slate-900">{uc.type}</h3>
                <p className="text-xs font-bold text-teal-700 font-mono">{uc.formula}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider rounded-full border border-teal-200">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is Echo an LMS or CRM?", a: "Both. Echo combines LMS, CRM, admissions, automation, payments, communication and analytics into one unified education-focused platform." },
              { q: "Can I run live classes?", a: "Yes. Echo integrates directly with Zoom and Google Meet for live classes, workshops, webinars, mentoring and private consultation sessions." },
              { q: "Can I automate WhatsApp messages?", a: "Yes. Build visual workflows around leads, payments, live classes, student activity, course completion and other events using the Meta WhatsApp API." },
              { q: "Can I sell courses online?", a: "Yes. Sell courses, bundles, workshops, memberships and subscriptions with integrated payment gateways and automatic invoicing." },
              { q: "Can I manage physical batches?", a: "Yes. Manage physical campus batches, instructors, schedules, attendance, students and live sessions." },
              { q: "Can I manage multiple branches?", a: "Yes. Enterprise organizations can centrally manage multiple branches, teams, courses, students and revenue metrics." },
              { q: "Can I use my own branding?", a: "Yes. Echo provides customizable branding and enterprise white-label capabilities, including custom CNAME domains depending on your plan." },
              { q: "Can Echo connect with our existing systems?", a: "Yes. Enterprise plans can use APIs, webhooks and integrations to connect Echo with your existing technology stack." }
            ].map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp className="w-4 h-4 text-teal-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {openFaq === index && (
                  <div className="px-5 pb-5 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 12. FINAL HIGH-CONVERTING CTA BANNER */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-teal-400 block">FINAL CTA</span>
          
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            One Platform. One Student Journey. One Growing Business.
          </h2>

          <p className="text-sm md:text-base text-slate-300 font-medium max-w-2xl mx-auto">
            Stop managing your academy with disconnected tools. Start scaling with Echo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-black text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Book Your Free Demo →
            </button>
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              Go to Dashboard Access
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm">Echo</span>
            <span>• The Operating System for Education Businesses.</span>
          </div>

          <div className="flex gap-6 font-semibold text-slate-400">
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#white-label" className="hover:text-white">White Label</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </div>

          <span>© {new Date().getFullYear()} Echo LMS Inc. All rights reserved.</span>
        </div>
      </footer>

      {/* DEMO BOOKING MODAL */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">Book a Free Echo Demo</h3>
                <p className="text-xs text-slate-500">See how Echo can streamline your academy</p>
              </div>
              <button onClick={() => setIsDemoModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">&times;</button>
            </div>

            <form onSubmit={e => { e.preventDefault(); toast.success("Demo booking request submitted! A counsellor will reach out shortly."); setIsDemoModalOpen(false) }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name *</label>
                <input required placeholder="e.g. Stalin Kumar" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-teal-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Academy / Organization Name *</label>
                <input required placeholder="e.g. Apex EdTech Academy" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-teal-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number (WhatsApp) *</label>
                <input required placeholder="+91 98765 43210" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-teal-600" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all">
                Submit Demo Request →
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
