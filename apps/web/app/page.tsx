"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users, Bot, MessageSquare, ArrowRight, Play, ChevronDown, ChevronUp,
  Globe, Video, Laptop, BookOpen, PhoneCall, Workflow, ExternalLink, Mail, MapPin, Phone,
  Sparkles, Megaphone, CheckCircle2, QrCode, Receipt, Mic, FileText, Calendar,
  GraduationCap, Trophy, Briefcase, Award, ShieldAlert, Percent, CheckSquare,
  HelpCircle, Layers, Sliders, Smartphone, Clock, ShieldCheck, Database, Compass
} from "lucide-react"
import { DemoLoginModal } from "@/components/auth/DemoLoginModal"
import { PricingInquiryModal } from "@/components/auth/PricingInquiryModal"

export default function PublicHomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0)
  const [activeModuleCategory, setActiveModuleCategory] = useState<string>("all")

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // 8-Stage Admission Pipeline Journey
  const PIPELINE_STEPS = [
    {
      id: "crm",
      number: "01",
      title: "Lead Ingestion (CRM)",
      subtitle: "Catch it instantly",
      badge: "Real-time Webhooks",
      color: "bg-blue-500",
      lightColor: "bg-blue-50 border-blue-200 text-blue-700",
      icon: (
        <svg className="w-5 h-5 text-blue-600 fill-current" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      description: "Leads from Meta Ads, Google Ads, website forms and walk-in QR kiosks land directly into the Admissions CRM in sub-seconds with zero manual entry.",
      highlight: "Sub-second Meta & Google sync"
    },
    {
      id: "automation",
      number: "02",
      title: "WhatsApp Welcome",
      subtitle: "Welcome msg sent",
      badge: "Official Cloud API",
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
      icon: (
        <svg className="w-5 h-5 text-emerald-600 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      description: "An automated verified WhatsApp welcome message delivers the course syllabus, fee structure, and video preview to the student's phone instantly.",
      highlight: "98% open rates within 3 mins"
    },
    {
      id: "followups",
      number: "03",
      title: "Counselor Follow-ups",
      subtitle: "No one slips through",
      badge: "Voice & Call Audit",
      color: "bg-amber-500",
      lightColor: "bg-amber-50 border-amber-200 text-amber-700",
      icon: (
        <svg className="w-5 h-5 text-amber-600 fill-current" viewBox="0 0 24 24">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
        </svg>
      ),
      description: "Counselors log call notes, record conversations for quality audits, set automated callback reminders, and manage lead stages on Kanban boards.",
      highlight: "Call recording & smart disposition"
    },
    {
      id: "demo",
      number: "04",
      title: "Demo & Reminders",
      subtitle: "Lock in interest",
      badge: "Meet & Zoom Sync",
      color: "bg-teal-500",
      lightColor: "bg-teal-50 border-teal-200 text-teal-700",
      icon: (
        <svg className="w-5 h-5 text-teal-600 fill-current" viewBox="0 0 24 24">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
        </svg>
      ),
      description: "Automated 1-click live demo class or consultation scheduling with calendar sync, auto Zoom/Meet links, and WhatsApp nudge alerts before the session.",
      highlight: "Zero no-shows with smart nudges"
    },
    {
      id: "payment",
      number: "05",
      title: "Payments & EMI",
      subtitle: "Easy & flexible",
      badge: "Razorpay & PhonePe",
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50 border-indigo-200 text-indigo-700",
      icon: (
        <svg className="w-5 h-5 text-indigo-600 fill-current" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
        </svg>
      ),
      description: "Students complete enrollment via instant UPI, credit cards, or split payments into automated monthly EMI installments with zero friction.",
      highlight: "Auto EMI schedules & split fees"
    },
    {
      id: "invoices",
      number: "06",
      title: "Invoices & Receipts",
      subtitle: "Auto-generated",
      badge: "100% GST Compliant",
      color: "bg-purple-500",
      lightColor: "bg-purple-50 border-purple-200 text-purple-700",
      icon: (
        <svg className="w-5 h-5 text-purple-600 fill-current" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      ),
      description: "The moment payment clears, a branded GST tax invoice and fee receipt is generated and dispatched to the student and parent via WhatsApp & Email.",
      highlight: "Downloadable PDF tax receipts"
    },
    {
      id: "communication",
      number: "07",
      title: "Communication & Alerts",
      subtitle: "Stay connected",
      badge: "Batch Broadcasting",
      color: "bg-rose-500",
      lightColor: "bg-rose-50 border-rose-200 text-rose-700",
      icon: (
        <svg className="w-5 h-5 text-rose-600 fill-current" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
        </svg>
      ),
      description: "Auto-add enrolled students to cohort batch channels, send daily timetable updates, homework notices, and automated absentee notifications to parents.",
      highlight: "Multi-channel batch broadcasts"
    },
    {
      id: "lms",
      number: "08",
      title: "LMS & Student Passport",
      subtitle: "Learners ready",
      badge: "Instant Provisioning",
      color: "bg-teal-600",
      lightColor: "bg-teal-50 border-teal-200 text-teal-800",
      icon: (
        <svg className="w-5 h-5 text-teal-700 fill-current" viewBox="0 0 24 24">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
      ),
      description: "Student portal account is activated with access to video lessons, live classrooms, quizzes, verifiable QR certificates, and digital Student Passport ID.",
      highlight: "QR attendance & verifiable certificates"
    }
  ]

  // All 24+ Dashboard Modules categorized with colorful minimal SVG icons
  const MODULE_CATEGORIES = [
    { id: "all", name: "All Modules (24)" },
    { id: "lms", name: "Course Builder & Studio" },
    { id: "crm", name: "Admissions & Leads" },
    { id: "student", name: "Student & Faculty" },
    { id: "operations", name: "Finance & Operations" }
  ]

  const DASHBOARD_MODULES = [
    // Course Builder & Studio
    {
      category: "lms",
      name: "Course Builder & Studio",
      href: "/dashboard/studio/course-builder",
      desc: "Visual drag-and-drop curriculum builder with video chapters, PDF handouts, coding sandboxes, and drip release schedules.",
      badge: "Core Studio",
      iconColor: "bg-indigo-50 border-indigo-200 text-indigo-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      category: "lms",
      name: "Teaching Studio & Live Rooms",
      href: "/dashboard/studio/live",
      desc: "Host live classrooms directly integrated with Zoom & Google Meet, complete with student attendance capture and cloud recordings.",
      badge: "Live Class",
      iconColor: "bg-blue-50 border-blue-200 text-blue-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      )
    },
    {
      category: "lms",
      name: "Interactive Quiz Runner",
      href: "/dashboard/studio/quizzes",
      desc: "Create timed tests, multiple choice assessments, negative marking schemes, and instant grading with automated ranking.",
      badge: "Assessments",
      iconColor: "bg-amber-50 border-amber-200 text-amber-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      )
    },
    {
      category: "lms",
      name: "Assignments & Project Hub",
      href: "/dashboard/studio/assignments",
      desc: "Assign homework, capstone projects, and code tasks with student file uploads, educator rubrics, and feedback grading.",
      badge: "Grading",
      iconColor: "bg-teal-50 border-teal-200 text-teal-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    },
    {
      category: "lms",
      name: "Verifiable QR Certificates",
      href: "/dashboard/studio/certificates",
      desc: "Auto-issue tamper-proof digital completion certificates with unique public verification URLs and scannable QR codes.",
      badge: "Credentials",
      iconColor: "bg-purple-50 border-purple-200 text-purple-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      )
    },

    // Admissions & CRM
    {
      category: "crm",
      name: "Admissions CRM & Kanban",
      href: "/dashboard/academy/admissions",
      desc: "Visual lead pipeline from initial inquiry to enrollment with stages, assigned counselors, follow-up dates, and conversion metrics.",
      badge: "Lead Pipeline",
      iconColor: "bg-blue-50 border-blue-200 text-blue-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d="M15 3v18" />
        </svg>
      )
    },
    {
      category: "crm",
      name: "Meta & Google Ads Sync",
      href: "/dashboard/settings/integrations",
      desc: "Sub-second webhook ingestion of lead ad forms from Facebook, Instagram & Google Search campaigns with ROI attribution.",
      badge: "Direct Sync",
      iconColor: "bg-sky-50 border-sky-200 text-sky-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )
    },
    {
      category: "crm",
      name: "Call Intelligence & Voice Audio",
      href: "/dashboard/academy/calls",
      desc: "Counselor call recording audio player, duration logging, disposition tracking, and quality audit benchmarks.",
      badge: "Voice Analytics",
      iconColor: "bg-rose-50 border-rose-200 text-rose-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
        </svg>
      )
    },
    {
      category: "crm",
      name: "Walk-ins Kiosk & Reception QR",
      href: "/dashboard/academy/walk-ins",
      desc: "Tablet-friendly kiosk station for physical academy visitors to register, scan QR, and get assigned to available counselors.",
      badge: "Campus Kiosk",
      iconColor: "bg-amber-50 border-amber-200 text-amber-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    {
      category: "crm",
      name: "Demo Sessions & Consultations",
      href: "/dashboard/academy/demo-sessions",
      desc: "Book and schedule 1:1 counseling consultations or group masterclass demos with automated calendar links and reminders.",
      badge: "Scheduling",
      iconColor: "bg-emerald-50 border-emerald-200 text-emerald-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      category: "crm",
      name: "Dynamic Form Builder",
      href: "/dashboard/academy/forms",
      desc: "Create embeddable admission forms, survey questionnaires, and feedback polls with conditional logic and custom fields.",
      badge: "Lead Forms",
      iconColor: "bg-teal-50 border-teal-200 text-teal-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
      )
    },

    // Student & Faculty
    {
      category: "student",
      name: "Student LMS Portal",
      href: "/student",
      desc: "Personalized student experience with interactive video lesson player, course progress tracking, notes, and discussion boards.",
      badge: "Learner Hub",
      iconColor: "bg-teal-50 border-teal-200 text-teal-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      )
    },
    {
      category: "student",
      name: "Student Passport & QR ID",
      href: "/dashboard/academy/students",
      desc: "Digital student ID card with scannable QR code for campus biometric attendance scanning, library access, and exam hall entry.",
      badge: "Digital ID",
      iconColor: "bg-indigo-50 border-indigo-200 text-indigo-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><line x1="15" y1="8" x2="17" y2="8" /><line x1="15" y1="12" x2="17" y2="12" />
        </svg>
      )
    },
    {
      category: "student",
      name: "Educator Studio & Faculty Hub",
      href: "/dashboard/studio",
      desc: "Dedicated workspace for faculty to manage live batches, publish teaching notes, review student tasks, and host office hours.",
      badge: "Faculty Studio",
      iconColor: "bg-purple-50 border-purple-200 text-purple-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      category: "student",
      name: "Leaderboards & Gamification",
      href: "/dashboard/academy/leaderboard",
      desc: "Motivate students with XP points, streak counters, badges, and weekly batch rankings to maximize course completion rates.",
      badge: "Gamification",
      iconColor: "bg-amber-50 border-amber-200 text-amber-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34c3.38-.85 5.5-4.04 5.5-7.66V4H6v7c0 3.62 2.12 6.81 5.5 7.66z" />
        </svg>
      )
    },
    {
      category: "student",
      name: "Social Community & Circles",
      href: "/dashboard/academy/community",
      desc: "Batch discussion circles, doubt resolution forums, peer networking, and direct educator messaging channels.",
      badge: "Community",
      iconColor: "bg-emerald-50 border-emerald-200 text-emerald-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },

    // Finance & Operations
    {
      category: "operations",
      name: "Automated EMI Invoicing & GST",
      href: "/dashboard/academy/fees/emi",
      desc: "Split course fees into monthly installment milestones with automated payment reminder links and GST tax receipts.",
      badge: "Finance & EMI",
      iconColor: "bg-teal-50 border-teal-200 text-teal-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      )
    },
    {
      category: "operations",
      name: "AI Student Drop-out Risk Engine",
      href: "/dashboard/academy/risk",
      desc: "Algorithmic early-warning engine that flags inactive learners, falling quiz scores, or missed classes before students drop out.",
      badge: "Predictive AI",
      iconColor: "bg-purple-50 border-purple-200 text-purple-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
      )
    },
    {
      category: "operations",
      name: "Batches & Cohort Scheduling",
      href: "/dashboard/academy/batches",
      desc: "Organize students into structured weekday, weekend, or online cohorts with teacher allocation and capacity caps.",
      badge: "Cohorts",
      iconColor: "bg-blue-50 border-blue-200 text-blue-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        </svg>
      )
    },
    {
      category: "operations",
      name: "Placements & Career Board",
      href: "/dashboard/academy/placements",
      desc: "Manage corporate hiring partners, student resume profiles, interview rounds, and job placement offers.",
      badge: "Careers",
      iconColor: "bg-amber-50 border-amber-200 text-amber-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      category: "operations",
      name: "Coupons & Viral Referrals",
      href: "/dashboard/academy/referrals",
      desc: "Create coupon discount codes, track student affiliate referral payouts, and run promotional scholarship campaigns.",
      badge: "Growth Engine",
      iconColor: "bg-rose-50 border-rose-200 text-rose-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      )
    },
    {
      category: "operations",
      name: "White-Label & Custom Domain",
      href: "/dashboard/super-admin/whitelabel",
      desc: "Host academy under your custom CNAME (`learn.myacademy.com`) with custom brand palettes, logos, and branded notifications.",
      badge: "Whitelabel",
      iconColor: "bg-emerald-50 border-emerald-200 text-emerald-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    },
    {
      category: "operations",
      name: "Campus Events & Masterclasses",
      href: "/dashboard/academy/events",
      desc: "Publish ticketed offline workshops, industry guest lectures, and live hackathons with RSVP attendance management.",
      badge: "Events",
      iconColor: "bg-sky-50 border-sky-200 text-sky-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
        </svg>
      )
    },
    {
      category: "operations",
      name: "Multi-Branch Campus Control",
      href: "/dashboard/super-admin/academies",
      desc: "Manage multiple city branches or franchise centers from one centralized Super Admin command console with isolated permissions.",
      badge: "Enterprise",
      iconColor: "bg-indigo-50 border-indigo-200 text-indigo-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-3" /><line x1="9" y1="9" x2="9" y2="9.01" /><line x1="9" y1="13" x2="9" y2="13.01" /><line x1="9" y1="17" x2="9" y2="17.01" />
        </svg>
      )
    }
  ]

  const filteredModules = activeModuleCategory === "all" 
    ? DASHBOARD_MODULES 
    : DASHBOARD_MODULES.filter(m => m.category === activeModuleCategory)

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
            <a href="#pipeline" className="hover:text-teal-700 transition-colors">Admission Pipeline</a>
            <a href="#modules" className="hover:text-teal-700 transition-colors">All Modules</a>
            <a href="#integrations" className="hover:text-teal-700 transition-colors">Integrations</a>
            <a href="#about-grekam" className="hover:text-teal-700 transition-colors">About Grekam</a>
            <a href="#faq" className="hover:text-teal-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-950 text-xs font-bold transition-all cursor-pointer"
            >
              View Pricing
            </button>
            <Link 
              href="/auth/login" 
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all"
            >
              Sign In
            </Link>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
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
            
            <p className="text-xs sm:text-sm font-bold text-teal-700 tracking-wider uppercase">
              echo • ACADEMY OPERATING SYSTEM BY GREKAM
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              YOUR ACADEMY.<br />
              <span className="text-teal-600">ONE CONNECTED SYSTEM.</span>
            </h1>

            <p className="text-base sm:text-lg font-bold text-teal-700 tracking-wide">
              Teach. &bull; Manage. &bull; Sell. &bull; Grow.
            </p>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              <strong>echo</strong> brings your course builder, teaching studio, students, educators, live classes, Meta & Google lead ingestion, Call Intelligence, automated WhatsApp communication, and EMI invoicing into one connected platform.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button 
                onClick={() => setIsPricingModalOpen(true)}
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
                onClick={() => setIsPricingModalOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                View Pricing
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                <strong className="text-slate-900">No complicated setup. No scattered tools.</strong> Built for coaching institutes, competitive exam centres, skill academies, creative schools, and modern learning businesses.
              </p>
            </div>
          </div>

          {/* Right Column (Hero Image Blended Naturally to Background) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl bg-white/40 backdrop-blur-xs transition-transform duration-500 hover:scale-[1.01]">
              <img 
                src="/echohero.png" 
                alt="echo LMS Academy OS Dashboard Interface" 
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 — ADMISSION PIPELINE: FROM LEAD TO LEARNER (CODE-BASED & RESPONSIVE) */}
      {/* ========================================================================= */}
      <section id="pipeline" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              AUTOMATED LIFECYCLE ENGINE
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              From Lead to Learner,<br />
              <span className="text-teal-600">Fully Automated.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Watch every step flow seamlessly into the next — one connected experience. Experience every step connecting smoothly into a unified journey. Manage leads, automate processes, and deliver learning effortlessly.
            </p>
          </div>

          {/* Connected Step Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {PIPELINE_STEPS.map((step, idx) => {
              const isSelected = activePipelineStep === idx
              return (
                <div
                  key={step.id}
                  onClick={() => setActivePipelineStep(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left relative flex flex-col justify-between ${
                    isSelected 
                      ? "bg-teal-50/40 border-teal-500 shadow-md ring-1 ring-teal-500" 
                      : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Number & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {step.number}
                      </span>
                      <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        {step.icon}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-900 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-teal-700 mt-0.5">
                        {step.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-500">{step.highlight}</span>
                    <span className={`px-2 py-0.5 rounded font-bold border ${step.lightColor}`}>
                      {step.badge}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Interactive Flow Summary Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                ACTIVE STEP: {PIPELINE_STEPS[activePipelineStep].number} — {PIPELINE_STEPS[activePipelineStep].title}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                {PIPELINE_STEPS[activePipelineStep].description}
              </p>
            </div>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="shrink-0 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Test Live Pipeline
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03 — COMPLETE MODULE MATRIX (COURSE BUILDER, STUDIO, STUDENT, EDUCATOR & ADMIN) */}
      {/* ========================================================================= */}
      <section id="modules" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              COMPLETE DASHBOARD CAPABILITY MATRIX
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Every Module You Need to Run Your Academy.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              From course creation and live classroom streaming to CRM lead capture, automated EMI invoicing, and faculty management.
            </p>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {MODULE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveModuleCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeModuleCategory === cat.id
                      ? "bg-teal-600 text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModules.map((mod, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all space-y-3.5 flex flex-col justify-between text-left group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center group-hover:scale-105 transition-transform ${mod.iconColor}`}>
                      {mod.icon}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                      {mod.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-teal-700 group-hover:text-teal-800">
                  <span className="cursor-pointer flex items-center gap-1" onClick={() => setIsDemoModalOpen(true)}>
                    Explore in Demo <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Module #{i + 1}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 — INTEGRATIONS ECOSYSTEM */}
      {/* ========================================================================= */}
      <section id="integrations" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              SEAMLESS API & DIRECT PIPELINE INTEGRATIONS
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Connect Every Tool Your Academy Relies On.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No manual copy-pasting or broken webhooks. echo natively connects with lead generation platforms, video infrastructure, communication rails, and payment gateways.
            </p>
          </div>

          {/* Integrations Grid with Perfectly Fitted Rectangular Logo Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {[
              {
                name: "Meta Ads",
                tag: "Direct Leads Connection",
                desc: "Instant webhook lead ingestion from Facebook & Instagram lead gen ads.",
                icon: (
                  <svg className="w-7 h-7 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )
              },
              {
                name: "Google Ads",
                tag: "Direct Leads Connection",
                desc: "Real-time Google search & display lead form extension sync into CRM.",
                icon: (
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
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
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <rect width="14" height="14" x="2" y="5" rx="3" fill="#00832d" />
                    <path d="M16 10l5-3.5v11L16 14v-4z" fill="#00ac47" />
                  </svg>
                )
              },
              {
                name: "Zoom",
                tag: "Cloud Recordings",
                desc: "Native SDK live sessions, interactive breakout rooms & auto cloud sync.",
                icon: (
                  <div className="w-7 h-7 rounded-md bg-[#2D8CFF] flex items-center justify-center text-white shadow-2xs">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M4 6.5A2.5 2.5 0 016.5 4h8A2.5 2.5 0 0117 6.5v11a2.5 2.5 0 01-2.5 2.5h-8A2.5 2.5 0 014 17.5v-11zm15 3.12v4.76l4 2.67V7l-4 2.62z"/>
                    </svg>
                  </div>
                )
              },
              {
                name: "Google Sheets",
                tag: "2-Way Live Sync",
                desc: "Continuous bi-directional export/import for counselors and branch reports.",
                icon: (
                  <div className="w-7 h-7 rounded-md bg-[#0F9D58] flex items-center justify-center text-white shadow-2xs">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H6v-3h4v3zm0-5H6V9h4v3zm0-5H6V6h4v1zm6 10h-4v-3h4v3zm0-5h-4V9h4v3zm0-5h-4V6h4v1z"/>
                    </svg>
                  </div>
                )
              },
              {
                name: "Grafty",
                tag: "Visual Design Engine",
                desc: "Integrated media asset library and promotional graphics designer.",
                icon: (
                  <div className="w-7 h-7 flex items-center justify-center">
                    <img src="https://grafty.pro/grafty.svg" alt="Grafty" className="w-7 h-7 object-contain" />
                  </div>
                )
              },
              {
                name: "WhatsApp",
                tag: "Automated Drips",
                desc: "Official Cloud API triggers for welcome packs, fee dues & batch reminders.",
                icon: (
                  <svg className="w-7 h-7 text-[#25D366] fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                )
              },
              {
                name: "Email Drips",
                tag: "Transactional & Marketing",
                desc: "Deliver high-inbox GST invoices, homework notices and drip nurture flows.",
                icon: <Mail className="w-7 h-7 text-blue-500" />
              },
              {
                name: "AI Engine",
                tag: "OpenAI & Gemini",
                desc: "Student at-risk drop detection, quiz generation and smart study notes.",
                icon: <Bot className="w-7 h-7 text-purple-600" />
              },
              {
                name: "YouTube",
                tag: "Unlisted & Live",
                desc: "Distribute unlisted video lectures with seamless iframe player privacy.",
                icon: (
                  <div className="w-7 h-7 rounded-md bg-[#FF0000] flex items-center justify-center text-white shadow-2xs">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                )
              },
              {
                name: "Vimeo",
                tag: "DRM Protection",
                desc: "Encrypted, domain-restricted video streaming preventing piracy.",
                icon: (
                  <div className="w-7 h-7 rounded-md bg-[#1AB7EA] flex items-center justify-center text-white shadow-2xs">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22.396 7.164c-.093 2.026-1.507 4.798-4.245 8.32C15.323 19.161 12.927 21 10.96 21c-1.215 0-2.24-1.119-3.08-3.358-.56-2.052-1.12-4.105-1.68-6.158-.62-2.39-1.28-3.585-1.98-3.585-.156 0-.7.327-1.632.98L1 7.21c1.026-.902 2.037-1.804 3.033-2.705 1.37-1.182 2.4-1.804 3.09-1.866 1.62-.156 2.617.95 2.99 3.32.404 2.553.684 4.143.84 4.766.467 2.117.98 3.175 1.54 3.175.435 0 1.072-.685 1.91-2.055.84-1.37 1.29-2.413 1.353-3.13.125-1.183-.342-1.775-1.4-1.775-.5 0-1.01.11-1.53.327.995-3.256 2.89-4.836 5.684-4.742 2.068.062 3.038 1.4 2.91 4.01z"/>
                    </svg>
                  </div>
                )
              },
              {
                name: "Razorpay",
                tag: "UPI, Cards & EMI",
                desc: "India's premier payment gateway with automated webhook fee reconciliation.",
                icon: (
                  <div className="w-7 h-7 rounded-md bg-[#0C2340] flex items-center justify-center text-[#3395FF] font-black text-xs shadow-2xs">
                    <span className="tracking-tighter">Rzp</span>
                  </div>
                )
              },
              {
                name: "PhonePe",
                tag: "Direct Merchant UPI",
                desc: "Instant UPI dynamic QR generation for zero-drop fee collection.",
                icon: (
                  <div className="w-7 h-7 rounded-md bg-[#5F259F] flex items-center justify-center text-white font-black text-xs shadow-2xs">
                    <span className="tracking-tighter">पे</span>
                  </div>
                )
              },
              {
                name: "Stripe",
                tag: "Global Payments",
                desc: "Accept international student enrollments in 135+ currencies.",
                icon: (
                  <div className="w-7 h-7 rounded-md bg-[#635BFF] flex items-center justify-center text-white font-black text-xs shadow-2xs">
                    <span>S</span>
                  </div>
                )
              },
              {
                name: "Call Recorder",
                tag: "Voice Intelligence",
                desc: "In-app call audit logs, audio playback and counselor conversation analytics.",
                icon: <Mic className="w-7 h-7 text-rose-500" />
              }
            ].map((integ, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-teal-300 hover:shadow-md transition-all space-y-2 group">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
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
      {/* 05 — ABOUT GREKAM & NETWORK SHOWCASE */}
      {/* ========================================================================= */}
      <section id="about-grekam" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                ABOUT GREKAM NETWORK • COIMBATORE, INDIA
              </p>

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
      {/* 06 — FAQ SECTION */}
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
                a: "Absolutely. echo allows complete CNAME whitelabeling with automatic SSL certification and custom branding." 
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
      {/* 07 — FINAL CTA & FOOTER */}
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
              onClick={() => setIsPricingModalOpen(true)}
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
              <li><a href="#modules" className="hover:text-white">Course Builder & Studio</a></li>
              <li><a href="#modules" className="hover:text-white">Teaching Studio & Live</a></li>
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
      {/* 08 — MINIMAL MONOCHROME WHATSAPP FLOATING FAB */}
      {/* ========================================================================= */}
      <a
        href="https://wa.me/919789359407?text=Hi%20echo%20team,%20I%20would%20like%20to%20know%20more%20about%20echo%20LMS%20for%20my%20academy."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 p-3.5 bg-slate-950 hover:bg-black text-white rounded-full shadow-2xl border border-slate-700 hover:border-teal-400 transition-all duration-300 hover:scale-105"
      >
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
      {/* 09 — DEMO MODAL (Prefilled Demo Academy Admin) */}
      {/* ========================================================================= */}
      <DemoLoginModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* ========================================================================= */}
      {/* 10 — PRICING & INQUIRY MODAL (LIGHT THEMED POPUP) */}
      {/* ========================================================================= */}
      <PricingInquiryModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />

    </div>
  )
}
