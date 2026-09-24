"use client"

import { useState } from "react"
import { 
  GraduationCap, PlayCircle, BookOpen, Award, CheckCircle2, 
  Clock, Calendar, Sparkles, Star, Flame, FileText, 
  ArrowRight, ShieldCheck, QrCode, Check, HelpCircle
} from "lucide-react"
import { DemoPersonaSwitcher } from "@/components/demo/DemoPersonaSwitcher"
import Link from "next/link"

export default function DemoStudentPortalPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "quiz" | "certificates" | "leaderboard">("courses")
  
  // Interactive Quiz State inside Demo
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Marketing Demo Switcher */}
      <DemoPersonaSwitcher currentRole="student" />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white border border-teal-800/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-wider border border-teal-400/30 font-mono">
                STUDENT LMS PORTAL DEMO
              </span>
              <span className="text-xs text-slate-400 font-bold">• Apex Coding Academy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Welcome back, Alex Martin! 👋</h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl">
              You are enrolled in <strong>Fullstack AI & Web Engineering</strong>. Your next live workshop begins at 7:00 PM IST.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 text-center">
              <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-amber-400" /> 14 Days
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Study Streak</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 text-center">
              <div className="text-lg font-black text-teal-300 font-mono">8,920 XP</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Rank #2</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {[
            { id: "courses", label: "My Enrolled Courses", icon: BookOpen },
            { id: "quiz", label: "Interactive Quiz Runner", icon: HelpCircle },
            { id: "certificates", label: "Verified Certificates", icon: Award },
            { id: "leaderboard", label: "Gamified Leaderboard", icon: Star }
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive 
                    ? "bg-teal-600 text-white shadow-xs" 
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
            {/* Active Resume Card */}
            <div className="bg-white border border-teal-200 rounded-3xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-200">
                  IN PROGRESS • 74% COMPLETE
                </span>
                <h3 className="text-lg font-black text-slate-900">Fullstack AI & Next.js Masterclass</h3>
                <p className="text-xs text-slate-500 font-medium">Currently on: <strong>Lesson 8: Vector Embeddings & RAG Pipelines</strong></p>
                
                {/* Progress bar */}
                <div className="w-full sm:w-80 bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: "74%" }} />
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <Link
                  href="/student/learn/course-1"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" /> Resume Video Player
                </Link>
              </div>
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
                      onClick={() => setActiveTab("quiz")}
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

        {/* TAB 2: INTERACTIVE QUIZ RUNNER */}
        {activeTab === "quiz" && (
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

        {/* TAB 3: VERIFIED CERTIFICATES */}
        {activeTab === "certificates" && (
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

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Certificate Security & Benefits</h3>
              <ul className="space-y-3 text-xs text-slate-600 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Permanent blockchain-backed cryptographic signature for instant employer verification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>1-Click LinkedIn Add to Profile credential synchronization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Includes transcript summary of completed project capstones & graded quizzes.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Academy Batch Leaderboard (Gamified XP)</h3>
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

      </div>
    </div>
  )
}
