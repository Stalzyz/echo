"use client"

import { useState } from  "react"
import { Video, PlayCircle, BookOpen, Users, Plus, CheckCircle2, Clock, Calendar, HelpCircle, Award, BarChart2, MessageSquare, ArrowRight, Shield, Activity, Upload, FileText, Search, Bell, LayoutDashboard, CheckSquare } from  "lucide-react"
import { DemoPersonaSwitcher } from  "@/components/demo/DemoPersonaSwitcher"
import Link from "next/link"

const EDUCATOR_SIDEBAR_ITEMS = [
  { id: "overview", label: "Studio Overview", icon: LayoutDashboard },
  { id: "courses", label: "My Authoring Courses", icon: BookOpen, badge: "14 Drafts" },
  { id: "live", label: "Live Classroom Broadcast", icon: PlayCircle, badge: "Live" },
  { id: "quizzes", label: "Quiz Authoring", icon: HelpCircle },
  { id: "submissions", label: "Assignment Review Queue", icon: FileText, badge: "3 New" },
  { id: "students", label: "Enrolled Learners", icon: Users }
]

export default function DemoEducatorStudioPage() {
  const [activeMenu, setActiveMenu] = useState<string>("overview")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500/20">
      
      {/* 1. TOP MARKETING DEMO BANNER */}
      <DemoPersonaSwitcher currentRole="educator" />

      {/* 2. MAIN DASHBOARD SHELL */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT EDUCATOR SIDEBAR */}
        <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex h-[calc(100vh-50px)] sticky top-[50px] overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-6">
            
            {/* Educator Profile Snapshot */}
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                PM
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-xs text-slate-900 truncate">Dr. Priya Menon</div>
                <div className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">Lead Faculty • AI</div>
              </div>
            </div>

            {/* Navigation List */}
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 font-mono">
                Studio Authoring
              </div>
              <div className="space-y-0.5">
                {EDUCATOR_SIDEBAR_ITEMS.map(item => {
                  const Icon = item.icon
                  const isActive = activeMenu === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono shrink-0 ${
                          isActive ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-800"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Bottom Sidebar */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <Link
              href="/pricing"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Start Educator Studio
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
                  placeholder="Search your courses, drafts, live rooms..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  PM
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-none">Dr. Priya Menon</div>
                  <div className="text-[10px] text-slate-400 font-medium">priya@echo.in</div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Viewport */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50">
            
            {/* VIEW 1: OVERVIEW & COURSES */}
            {(activeMenu === "overview" || activeMenu === "courses") && (
              <div className="space-y-6">
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Courses</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">14</div>
                    <div className="text-[11px] text-teal-700 font-bold mt-0.5">8 Published • 6 In Review</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Learners</div>
                    <div className="text-2xl font-black text-slate-900 font-mono mt-1">1,284</div>
                    <div className="text-[11px] text-indigo-700 font-bold mt-0.5">Across all enrolled batches</div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Course Rating</div>
                    <div className="text-2xl font-black text-amber-500 mt-1">4.9 ★</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">482 Student Reviews</div>
                  </div>
                </div>

                {/* Courses List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Fullstack AI & Next.js Masterclass", modules: 14, lessons: 48, students: 342, status: "PUBLISHED" },
                    { title: "Python for Data Science Bootcamp", modules: 10, lessons: 32, students: 196, status: "PUBLISHED" },
                    { title: "Advanced Microservices with Go", modules: 8, lessons: 24, students: 0, status: "DRAFT (SAVED)" },
                    { title: "Vector Databases & LLM Agents", modules: 6, lessons: 18, students: 0, status: "SUBMITTED FOR APPROVAL" }
                  ].map((c, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          c.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                          c.status === "SUBMITTED FOR APPROVAL" ? "bg-amber-50 text-amber-800 border-amber-200" :
                          "bg-slate-100 text-slate-700 border-slate-200"
                        }`}>
                          {c.status}
                        </span>
                        <span className="text-xs font-bold text-slate-400 font-mono">{c.modules} Modules • {c.lessons} Lessons</span>
                      </div>

                      <h3 className="text-base font-black text-slate-900">{c.title}</h3>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">{c.students} Active Learners</span>
                        <Link
                          href="/dashboard/studio/courses/builder"
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-xl transition-colors"
                        >
                          Open Course Builder →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 2: LIVE BROADCAST */}
            {activeMenu === "live" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Live Classroom Broadcasts</h3>
                    <p className="text-xs text-slate-500 font-medium">Interactive live streaming with Timed Pitch CTAs and chat moderation.</p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Start Live Class
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" /> LIVE BROADCAST NOW
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">Today • 7:00 PM IST</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">React 19 Server Components Deep Dive</h4>
                    <div className="text-xs text-slate-500 font-medium">Batch A (Online) • 89 Registered Students</div>

                    <div className="pt-2 border-t border-slate-200/80">
                      <Link
                        href="/dashboard/studio/live"
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <PlayCircle className="w-4 h-4" /> Enter Live Studio Room
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: QUIZZES */}
            {activeMenu === "quizzes" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Quiz Authoring</h3>
                    <p className="text-xs text-slate-500 font-medium">Build assessments, multiple-choice questions, and automated test evaluations.</p>
                  </div>
                  <Link
                    href="/dashboard/studio/quiz-builder"
                    className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Launch Quiz Builder
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4">Quiz Title</th>
                        <th className="py-3 px-4">Course</th>
                        <th className="py-3 px-4">Questions</th>
                        <th className="py-3 px-4">Submissions</th>
                        <th className="py-3 px-4">Avg Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {[
                        { title: "React State & Hooks Master Check", course: "Fullstack AI Masterclass", q: 15, subs: 312, avg: "78%" },
                        { title: "Python Data Structures & Pandas", course: "Data Science Bootcamp", q: 20, subs: 184, avg: "82%" },
                        { title: "REST API Design & Security", course: "Fullstack AI Masterclass", q: 10, subs: 240, avg: "71%" }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-900">{row.title}</td>
                          <td className="py-3 px-4 text-slate-600 font-medium">{row.course}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{row.q} Questions</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">{row.subs} attempts</td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-700">{row.avg}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 4: SUBMISSIONS & STUDENTS */}
            {(activeMenu === "submissions" || activeMenu === "students") && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900">Student Assignment Grading Queue</h3>
                <div className="space-y-3">
                  {[
                    { student: "Alex Martin", project: "E-Commerce Microservices Capstone", submitted: "2 hrs ago", status: "PENDING REVIEW" },
                    { student: "Priya Nair", project: "Vector Embeddings Search Engine", submitted: "5 hrs ago", status: "GRADED (95/100)" },
                    { student: "Rahul Verma", project: "Fullstack Auth with NextAuth v5", submitted: "1 day ago", status: "GRADED (88/100)" }
                  ].map((sub, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{sub.student} — {sub.project}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">Submitted {sub.submitted}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                        sub.status.includes("GRADED") ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  )
}
