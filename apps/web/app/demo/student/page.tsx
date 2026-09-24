"use client"

import { useState } from "react"
import { 
  GraduationCap, PlayCircle, BookOpen, Award, CheckCircle2, 
  Clock, Calendar, Sparkles, Star, Flame, FileText, 
  ArrowRight, ShieldCheck, QrCode, Check, HelpCircle,
  Search, Bell, User, LayoutDashboard, CheckSquare
} from "lucide-react"
import { DemoPersonaSwitcher } from "@/components/demo/DemoPersonaSwitcher"
import Link from "next/link"

const STUDENT_SIDEBAR_ITEMS = [
  { id: "overview", label: "My Learning Hub", icon: LayoutDashboard },
  { id: "courses", label: "Enrolled Courses", icon: BookOpen, badge: "3 Active" },
  { id: "quiz", label: "Interactive Quizzes", icon: HelpCircle, badge: "Due" },
  { id: "assignments", label: "Projects & Tasks", icon: CheckSquare },
  { id: "certificates", label: "Verified Credentials", icon: Award, badge: "1 New" },
  { id: "leaderboard", label: "Batch Leaderboard", icon: Star }
]

export default function DemoStudentPortalPage() {
  const [activeMenu, setActiveMenu] = useState<string>("overview")
  const [searchQuery, setSearchQuery] = useState("")

  // Interactive Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const sampleQuiz = [
    {
      question: "Which hook in React is used for handling side effects like data fetching and subscriptions?",
      options: ["useState", "useEffect", "useMemo", "useCallback"],
      correct: 1
    },
    {
      question: "What is the primary benefit of Server-Side Rendering (SSR) in Next.js?",
      options: ["Faster client CPU usage", "Improved SEO & First Contentful Paint", "Disables JavaScript", "Offline file storage"],
      correct: 1
    },
    {
      question: "In TypeScript, what does the 'readonly' modifier do on object properties?",
      options: ["Deletes the property", "Prevents reassignment after creation", "Hides the property from JSON", "Makes it async"],
      correct: 1
    }
  ]

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }))
  }

  const calculateScore = () => {
    let score = 0
    sampleQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score += 1
    })
    return score
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500/20">
      
      {/* 1. TOP MARKETING DEMO BANNER */}
      <DemoPersonaSwitcher currentRole="student" />

      {/* 2. MAIN DASHBOARD SHELL */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT STUDENT SIDEBAR */}
        <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex h-[calc(100vh-50px)] sticky top-[50px] overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-6">
            
            {/* Student Profile Snapshot */}
            <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                AM
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-xs text-slate-900 truncate">Alex Martin</div>
                <div className="text-[10px] text-teal-700 font-bold font-mono">Cohort 12 • Fullstack AI</div>
              </div>
            </div>

            {/* Navigation List */}
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 font-mono">
                Student Menu
              </div>
              <div className="space-y-0.5">
                {STUDENT_SIDEBAR_ITEMS.map(item => {
                  const Icon = item.icon
                  const isActive = activeMenu === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-teal-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono shrink-0 ${
                          isActive ? "bg-white/20 text-white" : "bg-teal-100 text-teal-800"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Streak & XP Widget */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">Study Streak</span>
                <span className="text-amber-400 font-black flex items-center gap-1 font-mono">
                  <Flame className="w-3.5 h-3.5" /> 14 Days
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span className="text-slate-400 font-bold">Total XP</span>
                <span className="text-teal-400 font-black font-mono">8,920 XP</span>
              </div>
            </div>

          </div>

          {/* Bottom Sidebar */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <Link
              href="/pricing"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Launch LMS for Students
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
                  placeholder="Search lessons, quizzes, resources..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                  AM
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-none">Alex Martin</div>
                  <div className="text-[10px] text-slate-400 font-medium">alex@echo.in</div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Viewport */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50">
            
            {/* VIEW 1: OVERVIEW & COURSES */}
            {(activeMenu === "overview" || activeMenu === "courses") && (
              <div className="space-y-6">
                
                {/* Active Learning Hero Card */}
                <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white border border-teal-800/40 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-wider border border-teal-400/30 font-mono">
                      CONTINUE LEARNING • 74% PROGRESS
                    </span>
                    <h2 className="text-2xl font-black tracking-tight">Fullstack AI & Next.js Masterclass</h2>
                    <p className="text-slate-300 text-xs font-medium">
                      Next up: <strong>Lesson 8: Vector Embeddings, LangChain & RAG Pipelines</strong>
                    </p>
                    
                    <div className="w-full sm:w-80 bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                      <div className="bg-teal-400 h-full rounded-full" style={{ width: "74%" }} />
                    </div>
                  </div>

                  <Link
                    href="/student/learn/course-1"
                    className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
                  >
                    <PlayCircle className="w-4 h-4" /> Open Course Player
                  </Link>
                </div>

                {/* Course Catalog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "Fullstack AI & Next.js", educator: "Dr. Priya Menon", progress: 74, lessons: 32, badge: "Web & AI" },
                    { title: "Data Science with Python", educator: "Rahul Sharma", progress: 40, lessons: 24, badge: "Analytics" },
                    { title: "UI/UX Product Design", educator: "Sarah Jenkins", progress: 100, lessons: 18, badge: "Completed" }
                  ].map((c, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase font-mono">{c.badge}</span>
                          <span className="text-xs font-mono font-bold text-teal-700">{c.progress}%</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">{c.educator} • {c.lessons} Lessons</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <button 
                          onClick={() => setActiveMenu("quiz")}
                          className="w-full py-2 bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <HelpCircle className="w-3.5 h-3.5" /> Practice Quiz
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 2: INTERACTIVE QUIZZES */}
            {activeMenu === "quiz" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest font-mono">Module 4 Assessment</span>
                    <h3 className="text-lg font-black text-slate-900">React & Modern Frontend Architecture Quiz</h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-xl text-slate-700">
                    Question {currentQuestion + 1} of {sampleQuiz.length}
                  </span>
                </div>

                {!quizSubmitted ? (
                  <div className="space-y-6">
                    <div className="text-sm font-bold text-slate-900 leading-relaxed">
                      {sampleQuiz[currentQuestion].question}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {sampleQuiz[currentQuestion].options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[currentQuestion] === optIdx
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(currentQuestion, optIdx)}
                            className={`p-4 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-teal-50 border-teal-500 text-teal-950 font-bold ring-2 ring-teal-500/20"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <span>{opt}</span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected ? "bg-teal-600 border-teal-600 text-white" : "border-slate-300"
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        disabled={currentQuestion === 0}
                        onClick={() => setCurrentQuestion(q => q - 1)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        Previous
                      </button>

                      {currentQuestion < sampleQuiz.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestion(q => q + 1)}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                        >
                          Next Question →
                        </button>
                      ) : (
                        <button
                          onClick={() => setQuizSubmitted(true)}
                          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Submit Quiz
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                      <Award className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900">Quiz Completed! 🎉</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      You scored <strong>{calculateScore()} / {sampleQuiz.length}</strong> points ({(calculateScore() / sampleQuiz.length * 100).toFixed(0)}%).
                    </p>
                    <button
                      onClick={() => {
                        setSelectedAnswers({})
                        setQuizSubmitted(false)
                        setCurrentQuestion(0)
                      }}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
                    >
                      Retake Quiz
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: CERTIFICATES */}
            {activeMenu === "certificates" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-amber-200 rounded-3xl p-6 shadow-xs relative overflow-hidden space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                      VERIFIED CERTIFICATE
                    </span>
                    <span className="font-mono text-xs text-slate-400">CERT-2026-AI-9912</span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">Fullstack AI & Web Engineering</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Awarded to <strong>Alex Martin</strong> with Distinction (Grade A+)</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <QrCode className="w-8 h-8 text-slate-700" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Public QR Verification</div>
                        <div className="text-[10px] text-teal-700 font-mono">echolms.com/verify/9912</div>
                      </div>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>

                  <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs">
                    <Sparkles className="w-4 h-4" /> Download PDF Certificate
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 4: LEADERBOARD */}
            {activeMenu === "leaderboard" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900">Batch Leaderboard (Gamified XP)</h3>
                <div className="space-y-2">
                  {[
                    { rank: 1, name: "Priya Nair", xp: "9,842 XP", streak: "47 Days", badge: "🏆 Champion" },
                    { rank: 2, name: "Alex Martin (You)", xp: "8,920 XP", streak: "14 Days", badge: "⚡ Challenger", isMe: true },
                    { rank: 3, name: "Arun Kumar", xp: "7,634 XP", streak: "29 Days", badge: "🌟 Expert" },
                    { rank: 4, name: "Sarah Jenkins", xp: "6,891 XP", streak: "21 Days", badge: "🎯 Ace" }
                  ].map((u, i) => (
                    <div key={i} className={`p-4 rounded-2xl flex items-center justify-between ${
                      u.isMe ? "bg-teal-50 border border-teal-300 ring-2 ring-teal-500/20" : "bg-slate-50 border border-slate-200"
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-base text-slate-700 w-6">#{u.rank}</span>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">🔥 {u.streak} streak</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-xs text-teal-700">{u.xp}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{u.badge}</div>
                      </div>
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
