"use client"

import { useState } from "react"
import { 
  Video, PlayCircle, BookOpen, Users, Plus, 
  Sparkles, CheckCircle2, Clock, Calendar, 
  HelpCircle, Award, BarChart2, MessageSquare, 
  ArrowRight, Shield, Flame, Upload, FileText
} from "lucide-react"
import { DemoPersonaSwitcher } from "@/components/demo/DemoPersonaSwitcher"
import Link from "next/link"

export default function DemoEducatorStudioPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "live" | "quizzes" | "submissions">("courses")

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Marketing Demo Switcher */}
      <DemoPersonaSwitcher currentRole="educator" />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-xl shadow-xs">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider border border-indigo-200">
                  EDUCATOR STUDIO PRO DEMO
                </span>
                <span className="text-xs text-slate-400 font-bold">• Dr. Priya Menon</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Educator Teaching Hub</h1>
              <p className="text-slate-500 text-xs font-medium">Curriculum authoring, quiz creation, live broadcast scheduling & assignment grading.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pricing"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Start Teaching on Echo
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: "courses", label: "My Authoring Courses", icon: BookOpen },
            { id: "live", label: "Live Classroom & Streams", icon: PlayCircle },
            { id: "quizzes", label: "Interactive Quiz Builder", icon: HelpCircle },
            { id: "submissions", label: "Assignment Review Queue", icon: FileText }
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-xs" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* TAB 1: COURSES */}
        {activeTab === "courses" && (
          <div className="space-y-6">
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

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Fullstack AI & Next.js Masterclass", modules: 14, lessons: 48, students: 342, status: "PUBLISHED", isLive: true },
                { title: "Python for Data Science Bootcamp", modules: 10, lessons: 32, students: 196, status: "PUBLISHED", isLive: false },
                { title: "Advanced Microservices with Go", modules: 8, lessons: 24, students: 0, status: "DRAFT (SAVED)", isLive: false },
                { title: "Vector Databases & LLM Agents", modules: 6, lessons: 18, students: 0, status: "SUBMITTED FOR APPROVAL", isLive: false }
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

        {/* TAB 2: LIVE SESSIONS */}
        {activeTab === "live" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Live Broadcast & Workshop Scheduler</h3>
                <p className="text-xs text-slate-500 font-medium">Host interactive classes with screen sharing, timed pitch CTAs, and attendance logs.</p>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Schedule New Session
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                { title: "React 19 Server Components Deep Dive", date: "Today • 7:00 PM IST", batch: "Batch A (Online)", attendees: 89, isLiveNow: true },
                { title: "Building RAG with LangChain & Pinecone", date: "Tomorrow • 5:30 PM IST", batch: "Batch B (Hybrid)", attendees: 134, isLiveNow: false }
              ].map((s, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      s.isLiveNow ? "bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1" : "bg-slate-200 text-slate-700 border-slate-300"
                    }`}>
                      {s.isLiveNow && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />}
                      {s.isLiveNow ? "LIVE BROADCAST NOW" : "SCHEDULED"}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">{s.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{s.title}</h4>
                  <div className="text-xs text-slate-500 font-medium">{s.batch} • {s.attendees} Registered Students</div>

                  <div className="pt-2 border-t border-slate-200/80">
                    <Link
                      href="/dashboard/studio/live"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <PlayCircle className="w-4 h-4" /> Join Live Classroom Studio
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: QUIZZES */}
        {activeTab === "quizzes" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Quiz & Assessment Authoring</h3>
                <p className="text-xs text-slate-500 font-medium">Create multiple choice, true/false, and short code evaluation tests.</p>
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
                    <th className="py-3 px-4">Associated Course</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Student Submissions</th>
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

        {/* TAB 4: SUBMISSIONS */}
        {activeTab === "submissions" && (
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

      </div>
    </div>
  )
}
