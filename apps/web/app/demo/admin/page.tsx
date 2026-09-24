"use client"

import { useState } from "react"
import { 
  Building2, Users, BookOpen, CreditCard, Award, 
  Video, PlayCircle, BarChart2, Calendar, UserCheck, 
  MessageSquare, Sparkles, CheckCircle2, TrendingUp,
  Inbox, Briefcase, Star, Search, Plus, QrCode,
  Shield, Layers, Flame, DollarSign, Clock, Target, Activity
} from "lucide-react"
import { DemoPersonaSwitcher } from "@/components/demo/DemoPersonaSwitcher"
import Link from "next/link"

function StatCard({ label, value, sub, color = "teal", icon: Icon }: { label: string; value: string; sub?: string; color?: string; icon?: any }) {
  const colors: Record<string, string> = {
    teal: "text-teal-600 bg-teal-50 border-teal-200",
    amber: "text-amber-600 bg-amber-50 border-amber-200",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200"
  }
  return (
    <div className="bg-white shadow-xs border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${colors[color] || colors.teal}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-black text-slate-900 font-mono">{value}</div>
        {sub && <div className="text-[11px] text-slate-400 font-medium mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

export default function DemoAcademyAdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "admissions" | "attendance" | "fees" | "courses">("overview")

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Marketing Demo Switcher */}
      <DemoPersonaSwitcher currentRole="admin" />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-900 flex items-center justify-center font-black text-xl shadow-xs">
              <Building2 className="w-7 h-7 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                  ACADEMY ADMIN CONSOLE DEMO
                </span>
                <span className="text-xs text-slate-400 font-bold">• Apex Coding Academy</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Academy Command Center</h1>
              <p className="text-slate-500 text-xs font-medium">Complete CRM pipeline, course publishing approvals, GST fee receipts, QR attendance & WhatsApp automations.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pricing"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Deploy Your Academy
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: "overview", label: "Executive Overview", icon: BarChart2 },
            { id: "admissions", label: "Admissions CRM & Inquiries", icon: Inbox },
            { id: "attendance", label: "QR Attendance & Badges", icon: QrCode },
            { id: "fees", label: "Fees & GST Tax Invoicing", icon: CreditCard },
            { id: "courses", label: "Courses & Approvals", icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-xs" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Enrolled Students" value="1,420" sub="↑ +24% new this month" color="teal" icon={Users} />
              <StatCard label="Live Academy Courses" value="48" sub="Online + Classroom Hybrid" color="indigo" icon={BookOpen} />
              <StatCard label="Gross Revenue (MTD)" value="₹18.4 Lakhs" sub="88% collected on-time" color="emerald" icon={CreditCard} />
              <StatCard label="Verified Credentials" value="3,291" sub="100% blockchain verifiable" color="amber" icon={Award} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Admissions Pipeline Summary */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-teal-600" /> Real-Time Admissions Funnel
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

              {/* Quick Actions Panel */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Admin Shortcuts
                </h3>

                <div className="space-y-2.5">
                  <button 
                    onClick={() => setActiveTab("admissions")}
                    className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">View Inquiries CRM</div>
                      <div className="text-[10px] text-slate-400">Manage demo walk-ins & stages</div>
                    </div>
                    <Inbox className="w-4 h-4 text-slate-400" />
                  </button>

                  <button 
                    onClick={() => setActiveTab("attendance")}
                    className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">Launch QR Attendance</div>
                      <div className="text-[10px] text-slate-400">Scan student badges & ID cards</div>
                    </div>
                    <QrCode className="w-4 h-4 text-slate-400" />
                  </button>

                  <button 
                    onClick={() => setActiveTab("fees")}
                    className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">Generate GST Invoices</div>
                      <div className="text-[10px] text-slate-400">PDF receipt exports with GSTIN</div>
                    </div>
                    <CreditCard className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADMISSIONS */}
        {activeTab === "admissions" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Inquiry Pipeline & Lead Tracker</h3>
                <p className="text-xs text-slate-500 font-medium">Auto-captures inquiries from website forms, walk-ins, and WhatsApp campaigns.</p>
              </div>
              <button className="px-3.5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs">
                <Plus className="w-3.5 h-3.5" /> New Lead
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Target Course</th>
                    <th className="py-3 px-4">Mobile / Email</th>
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

        {/* TAB 3: ATTENDANCE */}
        {activeTab === "attendance" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">QR Attendance & Student ID Badges</h3>
                <p className="text-xs text-slate-500 font-medium">1-Tap live camera scanning and printable digital student badges.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl">
                Camera Scanner Ready
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

        {/* TAB 4: FEES */}
        {activeTab === "fees" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">GST Tax Invoices & Fee Ledger</h3>
                <p className="text-xs text-slate-500 font-medium">Automatic 18% GST calculation with HSN/SAC code 999293 and PDF receipt generation.</p>
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

        {/* TAB 5: COURSES */}
        {activeTab === "courses" && (
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

      </div>
    </div>
  )
}
