"use client"

import { useState } from "react"
import {
  BookOpen, Users, DollarSign, Award, Video, MessageSquare, 
  CheckCircle2, TrendingUp, Layers, Flame, Zap, BarChart2,
  Calendar, Clock, GraduationCap, Bell, Settings, Shield,
  Globe, Mail, Phone, Star, Target, Activity, PieChart,
  FileText, Briefcase, Home, Map, UserCheck, CreditCard,
  Package, Tag, Megaphone, Link, Hash, Eye, ChevronRight,
  PlayCircle, Mic, Edit, Trash2, Plus, Search, Filter,
  Download, Upload, RefreshCw, AlertCircle, Info, Inbox,
  Building, Users2, LayoutDashboard, Sparkles, ArrowUp,
  ArrowDown, Wifi, WifiOff, CheckSquare, XCircle, Send,
  QrCode, Smartphone, LucideIcon
} from "lucide-react"

// ─── Mini Stat Card ──────────────────────────────────────────────
function StatCard({ label, value, sub, color = "purple", icon: Icon }: { label: string; value: string; sub?: string; color?: string; icon?: any }) {
  const colors: Record<string, string> = {
    purple: "text-purple-600", teal: "text-teal-600", pink: "text-pink-600",
    amber: "text-amber-600", emerald: "text-emerald-600", blue: "text-blue-600",
    red: "text-red-600", orange: "text-orange-600"
  }
  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5 flex flex-col gap-2">
      {Icon && <Icon className={`w-5 h-5 ${colors[color]}`} />}
      <div className="text-xs text-slate-600 font-medium">{label}</div>
      <div className={`text-2xl font-black ${colors[color]}`}>{value}</div>
      {sub && <div className="text-[11px] text-slate-600 font-mono">{sub}</div>}
    </div>
  )
}

// ─── Section Header ──────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, badge, color = "purple" }: { icon: any; title: string; subtitle?: string; badge?: string; color?: string }) {
  const colors: Record<string, string> = {
    purple: "text-purple-600", teal: "text-teal-600", pink: "text-pink-600",
    amber: "text-amber-600", emerald: "text-emerald-600", blue: "text-blue-600",
    orange: "text-orange-600", red: "text-red-600"
  }
  const bg: Record<string, string> = {
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    teal: "bg-teal-50 text-teal-600 border-teal-200",
    pink: "bg-pink-50 text-pink-600 border-pink-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200"
  }
  return (
    <div className="flex items-start justify-between border-t border-slate-200 pt-8 mb-6">
      <div>
        <h2 className={`text-lg font-bold flex items-center gap-2 text-slate-900`}>
          <Icon className={`w-5 h-5 ${colors[color]}`} /> {title}
        </h2>
        {subtitle && <p className="text-xs text-slate-600 mt-1">{subtitle}</p>}
      </div>
      {badge && (
        <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${bg[color]}`}>{badge}</span>
      )}
    </div>
  )
}

// ─── Table Row ────────────────────────────────────────────────────
function TableRow({ cells, badge }: { cells: string[]; badge?: { text: string; color: string } }) {
  const badgeColors: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    yellow: "bg-amber-50 text-amber-600 border-amber-200",
    red: "bg-red-50 text-red-600 border-red-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  }
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
      {cells.map((cell, i) => (
        <td key={i} className="px-4 py-3 text-sm text-slate-700">
          {i === 0 ? <span className="font-medium text-slate-900">{cell}</span> : cell}
        </td>
      ))}
      {badge && (
        <td className="px-4 py-3">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeColors[badge.color]}`}>{badge.text}</span>
        </td>
      )}
    </tr>
  )
}

export default function PublicDemoDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* ── Top Navigation ── */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-teal-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-white text-sm">e</div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">echo</span>
              <span className="text-[9px] font-mono font-bold uppercase bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded-full">FULL DEMO</span>
            </div>
            <p className="text-[10px] text-slate-600">Academy Operating System • All 14 Modules</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-full font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE DEMO
          </div>
          <div className="text-[10px] text-slate-600 font-mono hidden md:block">echo.grekam.in</div>
        </div>
      </header>

      {/* ── Sidebar + Content Layout ── */}
      <div className="flex">
        
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-slate-200 min-h-screen p-4 space-y-1 sticky top-[57px] h-screen overflow-y-auto">
          {[
            { icon: LayoutDashboard, label: "Overview", id: "overview" },
            { icon: GraduationCap, label: "Studio", id: "studio" },
            { icon: BookOpen, label: "Courses", id: "courses" },
            { icon: PlayCircle, label: "Live Sessions", id: "live" },
            { icon: Users, label: "Students", id: "students" },
            { icon: BarChart2, label: "Analytics", id: "analytics" },
            { icon: Award, label: "Certificates", id: "certificates" },
            { icon: CheckSquare, label: "Assignments", id: "assignments" },
            { icon: FileText, label: "Quiz Builder", id: "quiz" },
            { icon: Calendar, label: "Schedule", id: "schedule" },
            { icon: UserCheck, label: "Attendance", id: "attendance" },
            { icon: CreditCard, label: "Fees & EMI", id: "fees" },
            { icon: Users2, label: "Admissions", id: "admissions" },
            { icon: Briefcase, label: "Placements", id: "placements" },
            { icon: Star, label: "Leaderboard", id: "leaderboard" },
            { icon: MessageSquare, label: "Community", id: "community" },
            { icon: Video, label: "Webinars", id: "webinars" },
            { icon: Megaphone, label: "Automation", id: "automation" },
            { icon: Phone, label: "WhatsApp", id: "whatsapp" },
            { icon: Tag, label: "Coupons", id: "coupons" },
            { icon: Globe, label: "Website", id: "website" },
            { icon: Shield, label: "Roles & Access", id: "roles" },
            { icon: Settings, label: "Settings", id: "settings" },
            { icon: Building, label: "Super Admin", id: "superadmin" },
          ].map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === id
                  ? "bg-purple-600/20 text-purple-300 border border-purple-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </aside>

        {/* Main Content — ALL MODULES VISIBLE */}
        <main className="flex-1 p-8 space-y-12 max-w-6xl">

          {/* ══ SECTION: OVERVIEW ══ */}
          <section id="overview">
            <SectionHeader icon={LayoutDashboard} title="Academy Overview" subtitle="Real-time metrics across your entire academy" badge="LIVE DATA" color="purple" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Students" value="12,480" sub="↑ +18% this month" color="purple" icon={Users} />
              <StatCard label="Active Courses" value="84" sub="Online + Onsite" color="teal" icon={BookOpen} />
              <StatCard label="Revenue (MTD)" value="₹18.4L" sub="Yearly Subscriptions" color="emerald" icon={DollarSign} />
              <StatCard label="Cert. Issued" value="3,291" sub="Verified Credentials" color="amber" icon={Award} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Live Sessions" value="12" sub="Running right now" color="pink" icon={Video} />
              <StatCard label="Webinar Conv." value="24.8%" sub="Timed Pitch CTA" color="orange" icon={TrendingUp} />
              <StatCard label="WhatsApp Msgs" value="4,892" sub="Sent this week" color="blue" icon={MessageSquare} />
              <StatCard label="Placements" value="287" sub="This batch" color="purple" icon={Briefcase} />
            </div>
          </section>

          {/* ══ SECTION: STUDIO ══ */}
          <section id="studio">
            <SectionHeader icon={GraduationCap} title="Educator Studio" subtitle="Your personal content creation & teaching hub" badge="STUDIO PRO" color="teal" />
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5 col-span-2">
                <div className="text-xs text-slate-600 mb-3 font-mono">RECENT ACTIVITY</div>
                <div className="space-y-3">
                  {[
                    { action: "Course published", name: "Fullstack AI Masterclass", time: "2 hrs ago", color: "emerald" },
                    { action: "Quiz created", name: "Python Fundamentals Quiz", time: "5 hrs ago", color: "blue" },
                    { action: "Certificate issued", name: "Alex Martin — Web Dev", time: "1 day ago", color: "amber" },
                    { action: "Live session ended", name: "React Advanced Hooks", time: "2 days ago", color: "purple" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200">
                      <div>
                        <span className="text-xs text-slate-600">{item.action}: </span>
                        <span className="text-xs text-slate-900 font-medium">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <StatCard label="My Courses" value="14" sub="8 Published" color="teal" icon={BookOpen} />
                <StatCard label="My Students" value="1,284" sub="Active learners" color="purple" icon={Users} />
              </div>
            </div>
          </section>

          {/* ══ SECTION: COURSES ══ */}
          <section id="courses">
            <SectionHeader icon={BookOpen} title="Course Management" subtitle="Build, publish, and manage your course catalog" badge="84 COURSES" color="blue" />
            <div className="flex gap-3 mb-4">
              <div className="flex-1 flex items-center gap-2 bg-white shadow-sm border border-slate-200 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-600" />
                <span className="text-xs text-slate-600">Search courses...</span>
              </div>
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                <Plus className="w-4 h-4" /> New Course
              </button>
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-white shadow-sm/80">
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Course Name</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Students</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Revenue</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow cells={["Fullstack AI & Web Engineering", "342", "₹8,41,200"]} badge={{ text: "PUBLISHED", color: "green" }} />
                  <TableRow cells={["Advanced Product Design", "218", "₹4,99,800"]} badge={{ text: "PUBLISHED", color: "green" }} />
                  <TableRow cells={["Data Science with Python", "196", "₹3,12,400"]} badge={{ text: "PUBLISHED", color: "green" }} />
                  <TableRow cells={["Cloud Architecture Bootcamp", "87", "₹1,74,000"]} badge={{ text: "DRAFT", color: "yellow" }} />
                  <TableRow cells={["Mobile Dev with Flutter", "134", "₹2,68,000"]} badge={{ text: "PUBLISHED", color: "green" }} />
                  <TableRow cells={["Cybersecurity Fundamentals", "56", "₹84,000"]} badge={{ text: "REVIEW", color: "blue" }} />
                </tbody>
              </table>
            </div>
          </section>

          {/* ══ SECTION: LIVE SESSIONS ══ */}
          <section id="live">
            <SectionHeader icon={PlayCircle} title="Live Sessions" subtitle="Broadcast, record, and manage live classes" badge="12 ACTIVE NOW" color="pink" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { title: "React Advanced Hooks", educator: "Dr. Priya Menon", students: 89, duration: "1h 24m", status: "LIVE" },
                { title: "Python for Data Science", educator: "Rahul Sharma", students: 134, duration: "45m", status: "LIVE" },
                { title: "UI/UX Design Sprint", educator: "Sarah Jenkins", students: 67, duration: "2h 10m", status: "LIVE" },
                { title: "Docker & Kubernetes", educator: "Arjun Patel", students: 43, duration: "30m", status: "UPCOMING" },
              ].map((session, i) => (
                <div key={i} className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      session.status === "LIVE" 
                        ? "bg-red-50 text-red-600 border-red-200" 
                        : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}>
                      {session.status === "LIVE" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-ping mr-1" />}
                      {session.status}
                    </span>
                    <span className="text-xs text-slate-600 font-mono">{session.duration}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{session.title}</h3>
                  <p className="text-xs text-slate-600">{session.educator}</p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs text-slate-700">{session.students} attending</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ SECTION: STUDENTS ══ */}
          <section id="students">
            <SectionHeader icon={Users} title="Student Management" subtitle="Online & onsite student records, progress, and passports" badge="12,480 ENROLLED" color="purple" />
            <div className="flex gap-3 mb-4">
              {["All", "Online", "Onsite", "At-Risk", "Completed"].map((tab) => (
                <button key={tab} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  tab === "All" ? "bg-purple-600 text-slate-900" : "text-slate-600 hover:text-slate-900 bg-slate-100"
                }`}>{tab}</button>
              ))}
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Student</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Course</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Progress</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow cells={["Alex Martin", "Fullstack AI Masterclass", "87%"]} badge={{ text: "ON TRACK", color: "green" }} />
                  <TableRow cells={["Sarah Jenkins", "Product Design", "64%"]} badge={{ text: "ON TRACK", color: "green" }} />
                  <TableRow cells={["Rahul Verma", "Data Science", "23%"]} badge={{ text: "AT RISK", color: "red" }} />
                  <TableRow cells={["Priya Nair", "Cloud Architecture", "91%"]} badge={{ text: "AHEAD", color: "purple" }} />
                  <TableRow cells={["Arun Kumar", "Mobile Dev", "45%"]} badge={{ text: "ON TRACK", color: "blue" }} />
                </tbody>
              </table>
            </div>
          </section>

          {/* ══ SECTION: ANALYTICS ══ */}
          <section id="analytics">
            <SectionHeader icon={BarChart2} title="Analytics & Reports" subtitle="Deep insights on revenue, engagement, and performance" badge="REAL-TIME" color="teal" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatCard label="Completion Rate" value="78.4%" sub="↑ +4% vs last month" color="emerald" icon={Target} />
              <StatCard label="Avg. Session Time" value="2h 18m" sub="Per student/week" color="blue" icon={Clock} />
              <StatCard label="NPS Score" value="72" sub="Promoters: 81%" color="purple" icon={Star} />
              <StatCard label="Dropout Rate" value="6.2%" sub="↓ -1.4% improved" color="teal" icon={Activity} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">REVENUE TREND (Last 6 Months)</div>
                <div className="flex items-end gap-3 h-28">
                  {[40, 55, 48, 70, 65, 88].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-purple-600/20 rounded-t-lg relative overflow-hidden" style={{ height: `${h}%` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/60 to-purple-400/30" />
                      </div>
                      <span className="text-[9px] text-slate-600 font-mono">
                        {["Apr", "May", "Jun", "Jul", "Aug", "Sep"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4">
                  <div className="text-[10px] text-slate-600 mb-2 font-mono">TOP COURSE</div>
                  <div className="text-sm font-bold text-slate-900">Fullstack AI</div>
                  <div className="text-xs text-emerald-600 mt-1">₹8.4L revenue</div>
                </div>
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4">
                  <div className="text-[10px] text-slate-600 mb-2 font-mono">PEAK HOUR</div>
                  <div className="text-sm font-bold text-slate-900">7PM – 10PM IST</div>
                  <div className="text-xs text-purple-600 mt-1">68% sessions active</div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION: CERTIFICATES ══ */}
          <section id="certificates">
            <SectionHeader icon={Award} title="Certificates & Credentials" subtitle="Issue, verify, and share blockchain-backed certificates" badge="3,291 ISSUED" color="amber" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { id: "ECHO-2026-AI-9912", name: "Alex Martin", course: "Fullstack AI & Web Engineering", grade: "A+" },
                { id: "ECHO-2026-UX-4091", name: "Sarah Jenkins", course: "Advanced Product Design", grade: "A" },
                { id: "ECHO-2026-DS-7823", name: "Priya Nair", course: "Data Science with Python", grade: "A+" },
                { id: "ECHO-2026-CL-2341", name: "Arun Kumar", course: "Cloud Architecture", grade: "B+" },
              ].map((cert, i) => (
                <div key={i} className="bg-white shadow-sm border border-amber-500/20 rounded-2xl p-5 relative">
                  <div className="absolute top-4 right-4">
                    <Award className="w-6 h-6 text-amber-600/30" />
                  </div>
                  <span className="text-[9px] text-amber-600 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-500/20">VERIFIED</span>
                  <h3 className="font-bold text-slate-900 text-sm mt-2">{cert.course}</h3>
                  <p className="text-xs text-slate-600 mt-1">{cert.name} • Grade: <span className="text-emerald-600 font-bold">{cert.grade}</span></p>
                  <p className="text-[10px] text-slate-600 font-mono mt-2">{cert.id}</p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                    <button className="text-[10px] text-purple-600 hover:text-purple-300 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Brag Card
                    </button>
                    <button className="text-[10px] text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 ml-auto">
                      <QrCode className="w-3 h-3" /> Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ SECTION: ASSIGNMENTS ══ */}
          <section id="assignments">
            <SectionHeader icon={CheckSquare} title="Assignments" subtitle="Create, distribute, and auto-grade assignments" badge="AUTO-GRADE" color="blue" />
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Assignment</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Course</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Submitted</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow cells={["Build a REST API", "Fullstack AI", "284/342"]} badge={{ text: "GRADING", color: "yellow" }} />
                  <TableRow cells={["Design System Audit", "Product Design", "198/218"]} badge={{ text: "DONE", color: "green" }} />
                  <TableRow cells={["ML Model Submission", "Data Science", "142/196"]} badge={{ text: "OPEN", color: "blue" }} />
                  <TableRow cells={["Dockerfile Setup", "Cloud Arch", "67/87"]} badge={{ text: "OPEN", color: "blue" }} />
                </tbody>
              </table>
            </div>
          </section>

          {/* ══ SECTION: QUIZ BUILDER ══ */}
          <section id="quiz">
            <SectionHeader icon={FileText} title="Quiz Builder" subtitle="AI-powered quiz creation with analytics" badge="AI-GENERATED" color="purple" />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">ACTIVE QUIZZES</div>
                {[
                  { name: "Python Basics Quiz", questions: 20, attempts: 312, avg: "72%" },
                  { name: "React Hooks Deep Dive", questions: 15, attempts: 198, avg: "68%" },
                  { name: "SQL Fundamentals", questions: 25, attempts: 287, avg: "81%" },
                ].map((quiz, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <div className="text-sm text-slate-900 font-medium">{quiz.name}</div>
                      <div className="text-[10px] text-slate-600 font-mono mt-0.5">{quiz.questions} questions • {quiz.attempts} attempts</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{quiz.avg}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">AI QUIZ GENERATOR</div>
                <div className="space-y-3">
                  <div className="bg-slate-100 rounded-xl p-3">
                    <div className="text-[10px] text-slate-600 mb-1">Topic</div>
                    <div className="text-sm text-slate-900">React State Management</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-100 rounded-xl p-3">
                      <div className="text-[10px] text-slate-600 mb-1">Difficulty</div>
                      <div className="text-sm text-slate-900">Intermediate</div>
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-xl p-3">
                      <div className="text-[10px] text-slate-600 mb-1">Questions</div>
                      <div className="text-sm text-slate-900">20</div>
                    </div>
                  </div>
                  <button className="w-full bg-purple-600 hover:bg-purple-500 text-slate-900 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Zap className="w-4 h-4" /> Generate with AI
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION: SCHEDULE ══ */}
          <section id="schedule">
            <SectionHeader icon={Calendar} title="Schedule & Timetable" subtitle="Manage batch schedules, class timings & holidays" badge="WEEK VIEW" color="teal" />
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                  <div key={d} className="text-center text-[10px] text-slate-600 font-mono py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 2
                  const hasClass = [3, 5, 8, 10, 12, 15, 17, 19, 22, 24].includes(day)
                  const isToday = day === 22
                  return (
                    <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs
                      ${day < 1 ? "opacity-20" : ""}
                      ${isToday ? "bg-purple-600 text-slate-900 font-bold" : "bg-slate-100/30 text-slate-600"}
                    `}>
                      {day > 0 ? day : ""}
                      {hasClass && !isToday && <div className="w-1 h-1 rounded-full bg-teal-400" />}
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { time: "9:00 AM", class: "Fullstack AI — Batch A (Online)", room: "Zoom Room 1" },
                  { time: "11:00 AM", class: "Product Design Sprint — UX Batch", room: "Studio Lab" },
                  { time: "3:00 PM", class: "Data Science — Evening Batch", room: "Zoom Room 2" },
                  { time: "7:00 PM", class: "Cloud Architecture — Night Batch", room: "Zoom Room 3" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-100/30 rounded-xl px-4 py-2.5">
                    <span className="text-[10px] text-slate-600 font-mono w-16 shrink-0">{item.time}</span>
                    <span className="text-xs text-slate-900 flex-1">{item.class}</span>
                    <span className="text-[10px] text-slate-600 font-mono">{item.room}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ SECTION: ATTENDANCE ══ */}
          <section id="attendance">
            <SectionHeader icon={UserCheck} title="Attendance Tracking" subtitle="QR code, biometric, and manual attendance for all batches" badge="QR + BIOMETRIC" color="emerald" />
            <div className="grid grid-cols-3 gap-4 mb-4">
              <StatCard label="Today's Attendance" value="94.2%" sub="Online batches" color="emerald" icon={UserCheck} />
              <StatCard label="Onsite Attendance" value="87.8%" sub="QR scan verified" color="teal" icon={QrCode} />
              <StatCard label="Low Attendance Alert" value="42 Students" sub="Below 75% threshold" color="red" icon={AlertCircle} />
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Batch</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Today</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Monthly Avg</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Mode</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow cells={["Fullstack AI — Batch A", "38/42", "91%"]} badge={{ text: "QR CODE", color: "green" }} />
                  <TableRow cells={["Product Design — UX", "22/28", "87%"]} badge={{ text: "BIOMETRIC", color: "blue" }} />
                  <TableRow cells={["Data Science — Evng", "34/40", "78%"]} badge={{ text: "MANUAL", color: "yellow" }} />
                </tbody>
              </table>
            </div>
          </section>

          {/* ══ SECTION: FEES ══ */}
          <section id="fees">
            <SectionHeader icon={CreditCard} title="Fees & EMI Management" subtitle="Automated fee collection, EMI plans, and payment tracking" badge="AUTOMATED EMI" color="emerald" />
            <div className="grid grid-cols-4 gap-4 mb-4">
              <StatCard label="Fees Collected (MTD)" value="₹12.8L" sub="87% collection rate" color="emerald" icon={DollarSign} />
              <StatCard label="Pending Dues" value="₹1.9L" sub="42 students pending" color="amber" icon={AlertCircle} />
              <StatCard label="EMI Active" value="284" sub="Students on EMI plan" color="blue" icon={CreditCard} />
              <StatCard label="Overdue (>30d)" value="₹28,400" sub="12 students" color="red" icon={XCircle} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 text-xs text-slate-600 font-mono">RECENT PAYMENTS</div>
                <table className="w-full">
                  <tbody>
                    <TableRow cells={["Alex Martin", "₹8,333", "EMI 3/12"]} badge={{ text: "PAID", color: "green" }} />
                    <TableRow cells={["Priya Nair", "₹14,999", "Full Fee"]} badge={{ text: "PAID", color: "green" }} />
                    <TableRow cells={["Rahul Verma", "₹8,333", "EMI 2/12"]} badge={{ text: "PENDING", color: "yellow" }} />
                    <TableRow cells={["Arun Kumar", "₹8,333", "EMI 5/12"]} badge={{ text: "OVERDUE", color: "red" }} />
                  </tbody>
                </table>
              </div>
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">EMI PLAN CONFIGURATOR</div>
                <div className="space-y-3">
                  {[
                    { plan: "3-Month EMI", rate: "0%", students: 84 },
                    { plan: "6-Month EMI", rate: "0%", students: 124 },
                    { plan: "12-Month EMI", rate: "2%", students: 76 },
                  ].map((plan, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-100 rounded-xl px-4 py-3">
                      <div>
                        <div className="text-sm text-slate-900 font-medium">{plan.plan}</div>
                        <div className="text-[10px] text-slate-600 font-mono">Interest: {plan.rate}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-teal-600">{plan.students}</div>
                        <div className="text-[10px] text-slate-600">students</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION: ADMISSIONS ══ */}
          <section id="admissions">
            <SectionHeader icon={Users2} title="Admissions & Walk-ins" subtitle="Enquiry tracking, demo sessions, and enrollment pipeline" badge="CRM PIPELINE" color="blue" />
            <div className="grid grid-cols-4 gap-4 mb-4">
              <StatCard label="Total Enquiries" value="892" sub="This month" color="blue" icon={Inbox} />
              <StatCard label="Walk-ins" value="124" sub="Scheduled today" color="purple" icon={Users} />
              <StatCard label="Demo Sessions" value="47" sub="This week" color="teal" icon={PlayCircle} />
              <StatCard label="Conversion Rate" value="31.4%" sub="↑ +4.2% vs last month" color="emerald" icon={TrendingUp} />
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
              <div className="text-xs text-slate-600 font-mono mb-4">ADMISSION PIPELINE</div>
              <div className="flex items-center gap-2">
                {[
                  { stage: "Enquiry", count: 892, color: "bg-blue-500/20 border-blue-200 text-blue-600" },
                  { stage: "Demo", count: 234, color: "bg-purple-500/20 border-purple-200 text-purple-600" },
                  { stage: "Proposal", count: 112, color: "bg-amber-500/20 border-amber-200 text-amber-600" },
                  { stage: "Enrolled", count: 280, color: "bg-emerald-500/20 border-emerald-200 text-emerald-600" },
                ].map((stage, i, arr) => (
                  <div key={i} className="flex items-center gap-2 flex-1">
                    <div className={`flex-1 border rounded-xl p-3 text-center ${stage.color}`}>
                      <div className="text-lg font-black">{stage.count}</div>
                      <div className="text-[10px] font-mono">{stage.stage}</div>
                    </div>
                    {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ SECTION: PLACEMENTS ══ */}
          <section id="placements">
            <SectionHeader icon={Briefcase} title="Placements & Internships" subtitle="Job board, resume builder, and placement tracking" badge="287 PLACED" color="purple" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">PLACEMENT STATS</div>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Avg CTC" value="₹8.4L" sub="Per annum" color="emerald" />
                  <StatCard label="Top Offer" value="₹42L" sub="Google — Batch A" color="purple" />
                  <StatCard label="Placed" value="287" sub="87% batch" color="teal" />
                  <StatCard label="Partner Cos." value="124" sub="Hiring partners" color="blue" />
                </div>
              </div>
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">RECENT PLACEMENTS</div>
                <div className="space-y-3">
                  {[
                    { name: "Alex Martin", company: "Google", role: "SWE III", ctc: "₹42L" },
                    { name: "Priya Nair", company: "Amazon", role: "SDE II", ctc: "₹28L" },
                    { name: "Sarah Jenkins", company: "Flipkart", role: "UX Lead", ctc: "₹18L" },
                    { name: "Arun Kumar", company: "Razorpay", role: "DevOps", ctc: "₹14L" },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200">
                      <div>
                        <div className="text-sm text-slate-900 font-medium">{p.name}</div>
                        <div className="text-[10px] text-slate-600 font-mono">{p.company} — {p.role}</div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">{p.ctc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION: LEADERBOARD ══ */}
          <section id="leaderboard">
            <SectionHeader icon={Star} title="Leaderboard & Gamification" subtitle="Streak-based points, badges, and competitive rankings" badge="GAMIFIED" color="amber" />
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
              <div className="space-y-2">
                {[
                  { rank: 1, name: "Priya Nair", xp: "9,842", streak: 47, badge: "🏆 Legend" },
                  { rank: 2, name: "Alex Martin", xp: "8,921", streak: 38, badge: "⚡ Streak" },
                  { rank: 3, name: "Arun Kumar", xp: "7,634", streak: 29, badge: "🌟 Expert" },
                  { rank: 4, name: "Sarah Jenkins", xp: "6,891", streak: 21, badge: "🎯 Ace" },
                  { rank: 5, name: "Rahul Verma", xp: "5,342", streak: 14, badge: "📚 Scholar" },
                ].map((student, i) => (
                  <div key={i} className={`flex items-center gap-4 px-4 py-3 rounded-xl ${
                    i === 0 ? "bg-amber-50 border border-amber-500/20" : "bg-slate-100/30"
                  }`}>
                    <span className={`font-black text-lg w-8 text-center ${
                      i === 0 ? "text-amber-600" : i === 1 ? "text-slate-700" : i === 2 ? "text-amber-700" : "text-slate-600"
                    }`}>#{student.rank}</span>
                    <span className="flex-1 text-sm font-medium text-slate-900">{student.name}</span>
                    <span className="text-[10px] text-slate-600 font-mono">🔥 {student.streak} day streak</span>
                    <span className="text-xs font-bold text-purple-600">{student.xp} XP</span>
                    <span className="text-xs">{student.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ SECTION: COMMUNITY ══ */}
          <section id="community">
            <SectionHeader icon={MessageSquare} title="Community & Forums" subtitle="Discussion threads, Q&A, peer learning, and announcements" badge="ACTIVE" color="teal" />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">TRENDING THREADS</div>
                <div className="space-y-3">
                  {[
                    { title: "How to deploy Next.js on Vercel?", replies: 24, upvotes: 87 },
                    { title: "Best resources for system design?", replies: 18, upvotes: 64 },
                    { title: "Career switch from non-IT to SWE?", replies: 31, upvotes: 142 },
                    { title: "Mock interview thread — Week 12", replies: 47, upvotes: 93 },
                  ].map((thread, i) => (
                    <div key={i} className="py-2 border-b border-slate-200">
                      <div className="text-sm text-slate-900 font-medium mb-1">{thread.title}</div>
                      <div className="flex gap-4 text-[10px] text-slate-600 font-mono">
                        <span>💬 {thread.replies} replies</span>
                        <span>⬆ {thread.upvotes} upvotes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <StatCard label="Total Members" value="12,480" sub="All enrolled students" color="teal" icon={Users} />
                <StatCard label="Posts Today" value="342" sub="Questions & answers" color="purple" icon={MessageSquare} />
                <StatCard label="Resolution Rate" value="94%" sub="Questions answered" color="emerald" icon={CheckCircle2} />
              </div>
            </div>
          </section>

          {/* ══ SECTION: WEBINARS ══ */}
          <section id="webinars">
            <SectionHeader icon={Video} title="Webinars & Funnel Engine" subtitle="Live & evergreen 24/7 webinar funnels with timed pitch CTAs" badge="TIMED PITCH CTA" color="pink" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white shadow-sm border border-pink-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-amber-600 animate-bounce" />
                  <span className="text-xs font-mono font-bold text-pink-600">LIVE EVERGREEN WEBINAR</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Scaling AI SaaS Products in 2026</h3>
                <p className="text-xs text-slate-600 mb-4">24/7 automated loop. Timed pitch offer at minute 45. Coupon auto-applied: <span className="text-amber-600 font-mono font-bold">WEBINAR20</span></p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center bg-slate-100 rounded-lg p-2">
                    <div className="text-sm font-bold text-slate-900">2,841</div>
                    <div className="text-[9px] text-slate-600 font-mono">TOTAL VIEWS</div>
                  </div>
                  <div className="text-center bg-slate-100 rounded-lg p-2">
                    <div className="text-sm font-bold text-pink-600">24.8%</div>
                    <div className="text-[9px] text-slate-600 font-mono">CONVERSION</div>
                  </div>
                  <div className="text-center bg-slate-100 rounded-lg p-2">
                    <div className="text-sm font-bold text-emerald-600">₹8.4L</div>
                    <div className="text-[9px] text-slate-600 font-mono">REVENUE</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { title: "Python for Beginners — Intro", views: 1242, conv: "19%" },
                  { title: "AI Tools Workshop", views: 892, conv: "28%" },
                  { title: "Design to Developer", views: 634, conv: "22%" },
                ].map((w, i) => (
                  <div key={i} className="bg-white shadow-sm border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-900 font-medium">{w.title}</div>
                      <div className="text-[10px] text-slate-600 font-mono">{w.views} views</div>
                    </div>
                    <div className="text-sm font-bold text-pink-600">{w.conv}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ SECTION: AUTOMATION ══ */}
          <section id="automation">
            <SectionHeader icon={Megaphone} title="Email & Automation" subtitle="Drip campaigns, triggers, and lifecycle email automation" badge="AUTO-DRIP" color="purple" />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">ACTIVE WORKFLOWS</div>
                <div className="space-y-3">
                  {[
                    { name: "New Enrollment Welcome", emails: 5, trigger: "On Enrollment", active: true },
                    { name: "Assignment Reminder", emails: 3, trigger: "3 days before due", active: true },
                    { name: "Fee Reminder Sequence", emails: 4, trigger: "7 days before due", active: true },
                    { name: "Certificate Issued", emails: 2, trigger: "On Certificate", active: false },
                    { name: "Webinar Follow-up", emails: 6, trigger: "Post Webinar", active: true },
                  ].map((wf, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-200">
                      <div>
                        <div className="text-sm text-slate-900 font-medium">{wf.name}</div>
                        <div className="text-[10px] text-slate-600 font-mono">{wf.trigger} • {wf.emails} emails</div>
                      </div>
                      <div className={`w-8 h-4 rounded-full ${wf.active ? "bg-emerald-500" : "bg-slate-700"} relative`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${wf.active ? "left-4" : "left-0.5"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <StatCard label="Emails Sent (MTD)" value="48,291" sub="94.2% delivery rate" color="purple" icon={Mail} />
                <StatCard label="Avg Open Rate" value="34.8%" sub="↑ +6% vs industry" color="teal" icon={Eye} />
                <StatCard label="Click Rate" value="12.4%" sub="CTA performance" color="pink" icon={Link} />
                <StatCard label="Unsubscribe Rate" value="0.8%" sub="Well below 2% avg" color="emerald" icon={CheckCircle2} />
              </div>
            </div>
          </section>

          {/* ══ SECTION: WHATSAPP ══ */}
          <section id="whatsapp">
            <SectionHeader icon={Phone} title="WhatsApp WABA Engine" subtitle="1-tap WhatsApp broadcasts, lead alerts, and student notifications" badge="WABA API" color="emerald" />
            <div className="grid grid-cols-3 gap-4 mb-4">
              <StatCard label="Messages Sent" value="4,892" sub="This week" color="emerald" icon={Send} />
              <StatCard label="Delivery Rate" value="99.1%" sub="WABA verified" color="teal" icon={CheckCircle2} />
              <StatCard label="Response Rate" value="67.4%" sub="vs 20% email avg" color="purple" icon={MessageSquare} />
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
              <div className="text-xs text-slate-600 font-mono mb-4">BROADCAST TEMPLATES</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Class Reminder", type: "Notification", sent: "2,841" },
                  { name: "Fee Due Alert", type: "Alert", sent: "342" },
                  { name: "Assignment Deadline", type: "Reminder", sent: "1,284" },
                  { name: "Webinar Invite", type: "Marketing", sent: "892" },
                  { name: "Offer of the Day", type: "Promotional", sent: "4,102" },
                  { name: "Certificate Ready", type: "Notification", sent: "287" },
                ].map((t, i) => (
                  <div key={i} className="bg-slate-100 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-900 font-medium">{t.name}</div>
                      <div className="text-[10px] text-slate-600 font-mono">{t.type}</div>
                    </div>
                    <div className="text-xs font-bold text-emerald-600">{t.sent}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ SECTION: COUPONS ══ */}
          <section id="coupons">
            <SectionHeader icon={Tag} title="Coupons & Discount Engine" subtitle="Create, schedule, and track coupon performance" badge="AUTO-APPLY" color="orange" />
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Coupon Code</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Discount</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Used</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Revenue</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow cells={["WEBINAR20", "20% off", "284/500", "₹4.2L"]} badge={{ text: "ACTIVE", color: "green" }} />
                  <TableRow cells={["EARLYBIRD", "₹5,000 off", "142/200", "₹2.8L"]} badge={{ text: "ACTIVE", color: "green" }} />
                  <TableRow cells={["FLASH48", "30% off", "500/500", "₹6.1L"]} badge={{ text: "EXPIRED", color: "red" }} />
                  <TableRow cells={["REFER10", "10% off", "89/∞", "₹0.9L"]} badge={{ text: "ACTIVE", color: "green" }} />
                  <TableRow cells={["DIWALI40", "40% off", "0/300", "₹0"]} badge={{ text: "SCHEDULED", color: "yellow" }} />
                </tbody>
              </table>
            </div>
          </section>

          {/* ══ SECTION: WEBSITE ══ */}
          <section id="website">
            <SectionHeader icon={Globe} title="Website & Theme Builder" subtitle="No-code website builder with custom branding and SEO" badge="NO-CODE" color="blue" />
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">WEBSITE PREVIEW</div>
                <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-700">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border-b border-slate-700">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                    </div>
                    <div className="flex-1 bg-slate-600/50 rounded text-[10px] text-slate-600 px-2 py-0.5 font-mono">
                      echo.grekam.in
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-8 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg flex items-center px-3">
                      <span className="text-[10px] text-slate-900 font-bold">echo — Academy OS</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["Courses", "Live Classes", "Webinars"].map(t => (
                        <div key={t} className="h-6 bg-slate-700/50 rounded flex items-center justify-center">
                          <span className="text-[9px] text-slate-600">{t}</span>
                        </div>
                      ))}
                    </div>
                    <div className="h-16 bg-slate-700/30 rounded-lg flex items-center justify-center">
                      <span className="text-[10px] text-slate-600">Hero Banner</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4">
                  <div className="text-[10px] text-slate-600 font-mono mb-2">THEME</div>
                  <div className="flex gap-1.5">
                    {["#8B5CF6", "#EC4899", "#14B8A6", "#F59E0B", "#10B981"].map(c => (
                      <div key={c} className="w-5 h-5 rounded-full border-2 border-white/10 cursor-pointer hover:scale-110 transition-transform" style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <StatCard label="Page Views" value="24.8K" sub="This month" color="blue" icon={Eye} />
                <StatCard label="Lead Forms" value="892" sub="Submitted" color="purple" icon={FileText} />
                <StatCard label="SEO Score" value="94/100" sub="Core Web Vitals" color="emerald" icon={TrendingUp} />
              </div>
            </div>
          </section>

          {/* ══ SECTION: ROLES ══ */}
          <section id="roles">
            <SectionHeader icon={Shield} title="Roles & Access Control" subtitle="Fine-grained permissions for admins, educators, and staff" badge="RBAC" color="red" />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Role</th>
                      <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Users</th>
                      <th className="text-left px-4 py-3 text-[10px] text-slate-600 font-mono uppercase">Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    <TableRow cells={["Super Admin", "2", "Full Access"]} badge={{ text: "GOD MODE", color: "red" }} />
                    <TableRow cells={["Academy Admin", "8", "All Modules"]} badge={{ text: "ADMIN", color: "purple" }} />
                    <TableRow cells={["Educator", "34", "Studio + LMS"]} badge={{ text: "EDUCATOR", color: "blue" }} />
                    <TableRow cells={["Counselor", "12", "Admissions"]} badge={{ text: "LIMITED", color: "yellow" }} />
                    <TableRow cells={["Finance", "4", "Fees Only"]} badge={{ text: "RESTRICTED", color: "yellow" }} />
                  </tbody>
                </table>
              </div>
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">PERMISSION MATRIX</div>
                <div className="space-y-2">
                  {[
                    { module: "Course Builder", admin: true, edu: true, counsel: false, finance: false },
                    { module: "Fee Management", admin: true, edu: false, counsel: false, finance: true },
                    { module: "Admissions", admin: true, edu: false, counsel: true, finance: false },
                    { module: "Analytics", admin: true, edu: true, counsel: false, finance: false },
                    { module: "WhatsApp", admin: true, edu: false, counsel: true, finance: false },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-5 gap-2 items-center bg-slate-100/30 rounded-lg px-3 py-2">
                      <span className="text-[10px] text-slate-700 col-span-2">{row.module}</span>
                      {[row.admin, row.edu, row.counsel, row.finance].map((has, j) => (
                        <div key={j} className="flex justify-center">
                          {has ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-slate-700" />}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION: SETTINGS ══ */}
          <section id="settings">
            <SectionHeader icon={Settings} title="Academy Settings" subtitle="Integrations, branding, security, and audit logs" badge="CONFIG" color="teal" />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">INTEGRATIONS</div>
                <div className="space-y-3">
                  {[
                    { name: "Razorpay", category: "Payments", connected: true },
                    { name: "Zoom", category: "Live Classes", connected: true },
                    { name: "WhatsApp WABA", category: "Messaging", connected: true },
                    { name: "Google Analytics", category: "Analytics", connected: true },
                    { name: "Notion", category: "Notes", connected: false },
                    { name: "Slack", category: "Team", connected: false },
                  ].map((integration, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200">
                      <div>
                        <div className="text-sm text-slate-900 font-medium">{integration.name}</div>
                        <div className="text-[10px] text-slate-600 font-mono">{integration.category}</div>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        integration.connected 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-slate-700/50 text-slate-600 border-slate-700"
                      }`}>{integration.connected ? "CONNECTED" : "CONNECT"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                  <div className="text-xs text-slate-600 font-mono mb-3">SECURITY</div>
                  <div className="space-y-3">
                    {[
                      { label: "Two-Factor Auth", enabled: true },
                      { label: "IP Allowlisting", enabled: false },
                      { label: "Audit Logging", enabled: true },
                      { label: "Data Encryption", enabled: true },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-slate-700">{s.label}</span>
                        <div className={`w-8 h-4 rounded-full ${s.enabled ? "bg-emerald-500" : "bg-slate-700"} relative`}>
                          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${s.enabled ? "left-4" : "left-0.5"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                  <div className="text-xs text-slate-600 font-mono mb-3">ORGANIZATION</div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-900">Grekam Academy of Tech</div>
                    <div className="text-[10px] text-slate-600 font-mono">echo.grekam.in • GST: 33XXXXX</div>
                    <div className="text-[10px] text-slate-600 font-mono">Yearly Plan • Enterprise Whitelabel</div>
                    <div className="text-[10px] text-emerald-600 font-mono">✓ SSL Active • Domain Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION: SUPER ADMIN ══ */}
          <section id="superadmin">
            <SectionHeader icon={Building} title="Super Admin Control Panel" subtitle="Global academy management, billing, and white-label configuration" badge="SUPER ADMIN" color="red" />
            <div className="grid grid-cols-4 gap-4 mb-4">
              <StatCard label="Active Academies" value="142" sub="↑ +18 this month" color="purple" icon={Building} />
              <StatCard label="Platform MRR" value="₹18.45L" sub="Yearly + 18% GST" color="emerald" icon={DollarSign} />
              <StatCard label="Total Users" value="48,290" sub="Across all academies" color="teal" icon={Users} />
              <StatCard label="Support Tickets" value="12" sub="Open tickets" color="amber" icon={AlertCircle} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 text-xs text-slate-600 font-mono">TOP ACADEMIES BY REVENUE</div>
                <table className="w-full">
                  <tbody>
                    <TableRow cells={["Grekam Academy", "₹4.2L/mo", "Enterprise"]} badge={{ text: "ACTIVE", color: "green" }} />
                    <TableRow cells={["TechLearn Pro", "₹2.8L/mo", "Pro Growth"]} badge={{ text: "ACTIVE", color: "green" }} />
                    <TableRow cells={["DesignAcademy", "₹1.9L/mo", "Pro Growth"]} badge={{ text: "ACTIVE", color: "green" }} />
                    <TableRow cells={["CodeCamp India", "₹1.4L/mo", "Starter"]} badge={{ text: "TRIAL", color: "yellow" }} />
                  </tbody>
                </table>
              </div>
              <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <div className="text-xs text-slate-600 font-mono mb-4">PLAN DISTRIBUTION</div>
                <div className="space-y-3">
                  {[
                    { plan: "Enterprise Whitelabel", count: 28, percent: 20, color: "bg-purple-500" },
                    { plan: "Pro Growth Engine", count: 64, percent: 45, color: "bg-teal-500" },
                    { plan: "Starter Academy", count: 50, percent: 35, color: "bg-blue-500" },
                  ].map((p, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700">{p.plan}</span>
                        <span className="font-bold text-slate-900">{p.count} academies</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Spacer at bottom */}
          <div className="h-24" />
        </main>
      </div>
    </div>
  )
}
