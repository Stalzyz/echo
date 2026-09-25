"use client"

import { useState } from  "react"
import { Building2, Users, BookOpen, CreditCard, Award, Video, PlayCircle, BarChart2, Calendar, UserCheck, MessageSquare, CheckCircle2, TrendingUp, Inbox, Briefcase, Star, Search, Plus, QrCode, Shield, Layers, Activity, DollarSign, Clock, Target, Phone, FileText, Megaphone, Tag, Globe, Settings, ChevronRight, Bell, ChevronDown, Check, AlertCircle, Filter, Download } from  "lucide-react"
import { DemoPersonaSwitcher } from  "@/components/demo/DemoPersonaSwitcher"
import Link from "next/link"

interface NavItem {
  id: string
  label: string
  icon: any
  badge?: string
}

const ADMIN_SIDEBAR_GROUPS: { groupName: string; items: NavItem[] }[] = [
  {
    groupName: "Main",
    items: [
      { id: "overview", label: "Dashboard Overview", icon: BarChart2 }
    ]
  },
  {
    groupName: "Admissions & CRM",
    items: [
      { id: "admissions", label: "Admissions CRM", icon: Inbox, badge: "892 Leads" },
      { id: "calls", label: "Call Intelligence", icon: Phone, badge: "AI Sync" },
      { id: "forms", label: "Lead Form Builder", icon: FileText },
      { id: "walkins", label: "Walk-in Kiosk CRM", icon: Building2 }
    ]
  },
  {
    groupName: "Academic Operations",
    items: [
      { id: "courses", label: "Courses & Approvals", icon: BookOpen, badge: "48 Live" },
      { id: "attendance", label: "QR Attendance & Badges", icon: QrCode, badge: "Live Cam" },
      { id: "fees", label: "Fees & GST Tax Invoicing", icon: CreditCard, badge: "Auto-EMI" },
      { id: "batches", label: "Batch Scheduling", icon: Calendar },
      { id: "certificates", label: "Verified Credentials", icon: Award }
    ]
  },
  {
    groupName: "Marketing & Automation",
    items: [
      { id: "webinars", label: "Webinars & Funnels", icon: Video, badge: "Timed Pitch" },
      { id: "whatsapp", label: "WhatsApp Automation", icon: MessageSquare, badge: "Official WABA" },
      { id: "coupons", label: "Coupons & Referrals", icon: Tag }
    ]
  },
  {
    groupName: "Settings & System",
    items: [
      { id: "analytics", label: "Analytics & Revenue", icon: TrendingUp },
      { id: "settings", label: "Academy Settings", icon: Settings }
    ]
  }
]

export default function DemoAcademyAdminPage() {
  const [activeMenu, setActiveMenu] = useState<string>("overview")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500/20">
      
      {/* 1. TOP MARKETING DEMO BANNER */}
      <DemoPersonaSwitcher currentRole="admin" />

      {/* 2. MAIN DASHBOARD SHELL (SIDEBAR + CONTENT) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex h-[calc(100vh-50px)] sticky top-[50px] overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-6">
            
            {/* Academy Branding Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                AP
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-xs text-slate-900 truncate">Apex Coding Academy</div>
                <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Enterprise Plan</div>
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="space-y-4">
              {ADMIN_SIDEBAR_GROUPS.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 font-mono">
                    {group.groupName}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map(item => {
                      const Icon = item.icon
                      const isActive = activeMenu === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveMenu(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-slate-900 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono shrink-0 ${
                              isActive ? "bg-amber-400 text-slate-950" : "bg-slate-100 text-slate-600"
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Sidebar Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <Link
              href="/pricing"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Deploy Your Academy
            </Link>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 h-[calc(100vh-50px)] overflow-hidden">
          
          {/* Top Bar Header */}
          <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 w-96">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students, courses, invoices, leads..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:border-slate-400 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                1,420 Active Students Online
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                  AD
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-none">Apex Director</div>
                  <div className="text-[10px] text-slate-400 font-medium">admin@apexcode.in</div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Dynamic Viewport */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50">
            
            {/* VIEW 1: OVERVIEW */}
            {activeMenu === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Academy Command Center</h2>
                    <p className="text-xs text-slate-500 font-medium">Live telemetry across CRM admissions, batch attendance, fees & educator publishing.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                    Executive Dashboard
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase">Total Students</span>
                      <Users className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">1,420</div>
                    <div className="text-[11px] text-emerald-700 font-bold mt-1">↑ +24% new this month</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase">Live Courses</span>
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">48</div>
                    <div className="text-[11px] text-indigo-700 font-bold mt-1">Online & Classroom</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase">Gross Revenue (MTD)</span>
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">₹18.4 Lakhs</div>
                    <div className="text-[11px] text-emerald-700 font-bold mt-1">88% on-time collection</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase">Verified Credentials</span>
                      <Award className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">3,291</div>
                    <div className="text-[11px] text-amber-700 font-bold mt-1">Blockchain verified</div>
                  </div>
                </div>

                {/* Funnel & Fast Access */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-teal-600" /> Admissions Inquiries Funnel
                      </h3>
                      <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        31.4% Conversion Rate
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {[
                        { stage: "New Leads", count: 892, color: "bg-blue-50 border-blue-200 text-blue-900" },
                        { stage: "Counselled", count: 412, color: "bg-indigo-50 border-indigo-200 text-indigo-900" },
                        { stage: "Demo Attended", count: 234, color: "bg-amber-50 border-amber-200 text-amber-900" },
                        { stage: "Fee Paid", count: 184, color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
                      ].map((s, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl border text-center ${s.color}`}>
                          <div className="text-2xl font-black font-mono">{s.count}</div>
                          <div className="text-[11px] font-bold mt-1">{s.stage}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                      <div className="flex items-center justify-between font-medium text-slate-600">
                        <span>Automated WhatsApp Drip Broadcasts</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active (98.2% Delivery)
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-medium text-slate-600">
                        <span>GST Invoices Auto-Dispatched to Parents</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Connected
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shortcuts */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Quick Actions</h3>
                    
                    <button 
                      onClick={() => setActiveMenu("admissions")}
                      className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">Manage Admissions CRM</div>
                        <div className="text-[10px] text-slate-400">View stages & counselors</div>
                      </div>
                      <Inbox className="w-4 h-4 text-slate-400" />
                    </button>

                    <button 
                      onClick={() => setActiveMenu("attendance")}
                      className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">Camera QR Scanner</div>
                        <div className="text-[10px] text-slate-400">Live attendance logging</div>
                      </div>
                      <QrCode className="w-4 h-4 text-slate-400" />
                    </button>

                    <button 
                      onClick={() => setActiveMenu("fees")}
                      className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">GST Invoices & Fee Ledger</div>
                        <div className="text-[10px] text-slate-400">18% GST calculation</div>
                      </div>
                      <CreditCard className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: ADMISSIONS CRM */}
            {activeMenu === "admissions" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Admissions CRM & Inquiry Tracker</h3>
                    <p className="text-xs text-slate-500 font-medium">Track new student leads, WhatsApp followups, counselling stages, and fee payments.</p>
                  </div>
                  <button className="px-3.5 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs">
                    <Plus className="w-3.5 h-3.5" /> Add New Lead
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Target Course</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Stage</th>
                        <th className="py-3 px-4">Counselor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {[
                        { name: "Aarav Sharma", course: "Fullstack AI Masterclass", contact: "+91 98450 11223", stage: "DEMO SCHEDULED", counselor: "Pooja Hegde" },
                        { name: "Ananya Iyer", course: "Data Science & Python", contact: "+91 98765 44332", stage: "PROPOSAL SENT", counselor: "Rajesh Kumar" },
                        { name: "Vikram Malhotra", course: "Cloud Architecture (AWS)", contact: "+91 91234 56789", stage: "FEES PAID", counselor: "Pooja Hegde" },
                        { name: "Sneha Reddy", course: "UI/UX Product Design", contact: "+91 98111 22334", stage: "NEW INQUIRY", counselor: "Vikram Rao" }
                      ].map((lead, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-900">{lead.name}</td>
                          <td className="py-3 px-4 font-medium text-slate-600">{lead.course}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{lead.contact}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              lead.stage === "FEES PAID" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                              lead.stage === "DEMO SCHEDULED" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                              "bg-blue-50 text-blue-800 border border-blue-200"
                            }`}>
                              {lead.stage}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700">{lead.counselor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 3: QR ATTENDANCE */}
            {activeMenu === "attendance" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">QR Attendance & ID Scanner</h3>
                    <p className="text-xs text-slate-500 font-medium">Automatic attendance check-ins using laptop webcam or USB barcode reader.</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Camera Scanner Live
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {[
                    { name: "Rahul Verma", id: "STU-8842", batch: "Batch A — AI & Web", status: "PRESENT (08:58 AM)", img: "RV" },
                    { name: "Priya Nair", id: "STU-9021", batch: "Batch A — AI & Web", status: "PRESENT (09:02 AM)", img: "PN" },
                    { name: "Arun Kumar", id: "STU-7411", batch: "Batch B — Python DS", status: "PRESENT (09:14 AM)", img: "AK" }
                  ].map((stu, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-sm">
                          {stu.img}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{stu.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{stu.id} • {stu.batch}</div>
                        </div>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 p-1.5 rounded-lg text-center border border-emerald-200">
                        {stu.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 4: FEES & GST */}
            {activeMenu === "fees" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">GST Tax Invoices & Automated EMI</h3>
                    <p className="text-xs text-slate-500 font-medium">Automatic 18% GST calculation (HSN 999293) and PDF receipt generation.</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                    GSTIN: 33AAACG1234F1Z5
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4">Invoice #</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Taxable Value</th>
                        <th className="py-3 px-4">CGST + SGST (18%)</th>
                        <th className="py-3 px-4">Total Paid</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-mono">
                      {[
                        { inv: "INV-2026-0891", name: "Alex Martin", base: "₹25,423", tax: "₹4,576", total: "₹29,999", status: "PAID" },
                        { inv: "INV-2026-0892", name: "Priya Nair", base: "₹12,711", tax: "₹2,288", total: "₹14,999", status: "PAID" },
                        { inv: "INV-2026-0893", name: "Sarah Jenkins", base: "₹21,186", tax: "₹3,813", total: "₹24,999", status: "PAID" }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-teal-700">{row.inv}</td>
                          <td className="py-3 px-4 font-sans font-bold text-slate-900">{row.name}</td>
                          <td className="py-3 px-4 text-slate-600">{row.base}</td>
                          <td className="py-3 px-4 text-slate-600">{row.tax}</td>
                          <td className="py-3 px-4 font-black text-slate-900">{row.total}</td>
                          <td className="py-3 px-4 font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 5: COURSES */}
            {activeMenu === "courses" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Course Approvals & Publishing Queue</h3>
                    <p className="text-xs text-slate-500 font-medium">Review and approve curriculum submissions drafted by Educators.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Fullstack AI & Next.js Masterclass", educator: "Dr. Priya Menon", modules: 14, students: 342, status: "APPROVED" },
                    { title: "Python for Data Science Bootcamp", educator: "Rahul Sharma", modules: 10, students: 196, status: "APPROVED" },
                    { title: "Cybersecurity & Ethical Hacking", educator: "Arjun Patel", modules: 8, students: 56, status: "PENDING APPROVAL" },
                    { title: "Advanced Mobile App Dev with Flutter", educator: "Sarah Jenkins", modules: 12, students: 134, status: "APPROVED" }
                  ].map((c, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{c.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{c.educator} • {c.modules} Modules • {c.students} Students</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                        c.status === "APPROVED" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 6: WEBINARS & FUNNELS */}
            {activeMenu === "webinars" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Webinar Funnels & Timed Pitch CTAs</h3>
                    <p className="text-xs text-slate-500 font-medium">24/7 evergreen automated conversion loop with timed payment triggers.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold text-rose-700 uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      LIVE EVERGREEN LOOP
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">Scaling AI SaaS Products in 2026</h4>
                    <p className="text-xs text-slate-500">Timed pitch trigger at minute 45. 24.8% conversion rate.</p>
                  </div>
                </div>
              </div>
            )}

            {/* FALLBACK FOR OTHER TABS */}
            {["calls", "forms", "walkins", "batches", "certificates", "whatsapp", "coupons", "analytics", "settings"].includes(activeMenu) && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900 capitalize">{activeMenu.replace("-", " ")} Module Active</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  This module is fully unlocked and ready in your Echo Academy Operating System deployment.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Start 14-Day Free Trial
                </Link>
              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  )
}
