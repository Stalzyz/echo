"use client"

import { use, useState, useEffect, useRef } from "react"
import { useApi } from "@/lib/useApi"
import Link from "next/link"
import {
  ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText, 
  Download, Award, Sparkles, ChevronRight, Lock, 
  HelpCircle, RefreshCw, Layers, ExternalLink, Video,
  Maximize2, Minimize2, MessageSquare, Bookmark, ListFilter,
  Volume2, Send, ThumbsUp, Check, Share2, Clock, FastForward,
  ChevronDown, AlertCircle, BookOpen, User, CheckCircle
} from "lucide-react"

export default function StudentCoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params)
  const courseId = resolvedParams.courseId

  const { data: courseData, isLoading, error, mutate } = useApi<any>(`/lms/courses/${courseId}`)
  
  const [activeLesson, setActiveLesson] = useState<any>(null)
  const [completing, setCompleting] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "qa" | "resources" | "transcript">("overview")
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0)
  const [isTheaterMode, setIsTheaterMode] = useState(false)
  const [autoPlayNext, setAutoPlayNext] = useState(true)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

  // Video Ref
  const videoRef = useRef<HTMLVideoElement>(null)

  // Personal Notes State
  const [notes, setNotes] = useState<Array<{ id: string; time: string; text: string; timestamp: number }>>([
    { id: "1", time: "01:15", text: "Important concept on system design patterns", timestamp: 75 },
    { id: "2", time: "03:40", text: "Key formula for calculating operational metrics", timestamp: 220 }
  ])
  const [newNote, setNewNote] = useState("")

  // Q&A State
  const [qaList, setQaList] = useState([
    {
      id: "q1",
      author: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      time: "2 hours ago",
      question: "Can someone clarify the difference between synchronous and asynchronous dispatch in this context?",
      upvotes: 5,
      isUpvoted: false,
      answer: {
        author: "Dr. Sarah Jenkins (Instructor)",
        text: "Synchronous dispatch blocks execution until the target task finishes, whereas asynchronous schedules the task on a background worker queue and returns immediately."
      }
    }
  ])
  const [newQuestion, setNewQuestion] = useState("")

  // Demo Fallback Modules if API returns empty array (ensures top-notch preview even for new courses)
  const defaultModules = [
    {
      id: "demo-mod-1",
      title: "Module 1: Foundations & Architecture Overview",
      lessons: [
        {
          id: "demo-les-1",
          title: "1.1 Welcome & Course Orientation",
          duration: "04:15",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          description: "An overview of learning goals, expectations, and studio setup.",
          isCompleted: true,
          type: "video"
        },
        {
          id: "demo-les-2",
          title: "1.2 Core Conceptual Blueprint",
          duration: "12:30",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          description: "Understanding fundamental design patterns and system workflows.",
          isCompleted: false,
          type: "video"
        },
        {
          id: "demo-les-3",
          title: "1.3 Essential Setup & Quickstart Guide",
          duration: "08:45",
          content: "Comprehensive documentation and configuration instructions for your workspace.",
          isCompleted: false,
          type: "article"
        }
      ]
    },
    {
      id: "demo-mod-2",
      title: "Module 2: Advanced Implementation & Best Practices",
      lessons: [
        {
          id: "demo-les-4",
          title: "2.1 Building Scalable Components",
          duration: "15:20",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          description: "Hands-on guide to component architecture and state management.",
          isCompleted: false,
          type: "video"
        },
        {
          id: "demo-les-5",
          title: "2.2 Module Assessment & Knowledge Check",
          duration: "10 mins",
          isCompleted: false,
          type: "quiz"
        }
      ]
    }
  ]

  const course = courseData?.course || courseData || { title: "Mastering Modern Architecture & LMS Design" }
  const rawModules = courseData?.modules && courseData.modules.length > 0 ? courseData.modules : defaultModules
  const overallProgress = courseData?.progress ?? 35

  // Expand all modules by default on load
  useEffect(() => {
    if (rawModules.length > 0) {
      const initialExpanded: Record<string, boolean> = {}
      rawModules.forEach((m: any, idx: number) => {
        initialExpanded[m.id || `mod-${idx}`] = true
      })
      setExpandedModules(initialExpanded)

      // Set active lesson if none selected
      if (!activeLesson && rawModules[0]?.lessons?.[0]) {
        setActiveLesson(rawModules[0].lessons[0])
      }
    }
  }, [courseData])

  // Handle Playback Speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  // Handle Mark Complete
  const handleMarkComplete = async () => {
    if (!activeLesson) return
    setCompleting(true)
    try {
      const res = await fetch(`http://127.0.0.1:4400/api/v1/lms/progress/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: activeLesson.id }),
      })
      if (res.ok) {
        mutate()
      }
    } catch (e) {
      console.error("Failed to update lesson progress", e)
    } finally {
      // Local optimistic update
      if (activeLesson) {
        activeLesson.isCompleted = true
      }
      setCompleting(false)
    }
  }

  // Add Personal Note with timestamp
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    const currentTime = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0
    const minutes = Math.floor(currentTime / 60)
    const seconds = currentTime % 60
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    setNotes([
      ...notes,
      {
        id: Date.now().toString(),
        time: formattedTime,
        text: newNote.trim(),
        timestamp: currentTime
      }
    ])
    setNewNote("")
  }

  const jumpToTime = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp
      videoRef.current.play()
    }
  }

  // Add Q&A Question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim()) return
    setQaList([
      {
        id: Date.now().toString(),
        author: "You (Student)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
        time: "Just now",
        question: newQuestion.trim(),
        upvotes: 0,
        isUpvoted: false,
        answer: undefined
      },
      ...qaList
    ])
    setNewQuestion("")
  }

  // Toggle Module Accordion
  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }))
  }

  // Flatten lessons for Next/Prev Navigation
  const allLessons = rawModules.flatMap((m: any) => m.lessons || [])
  const currentIndex = allLessons.findIndex((l: any) => l.id === activeLesson?.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-400 gap-4 font-sans">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin" />
          <Sparkles className="w-5 h-5 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-semibold tracking-wider uppercase text-slate-300">Launching Echo Learning Studio...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-teal-500 selection:text-white">
      
      {/* 1. TOP NAVBAR */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-lg shadow-black/40">
        <div className="flex items-center gap-4">
          <Link 
            href="/student" 
            className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/10 border border-teal-500/30 rounded-lg text-[10px] font-bold text-teal-400 tracking-wider uppercase font-mono">
              <Sparkles className="w-3 h-3 text-teal-400" /> Echo Studio
            </span>
            <div>
              <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md lg:max-w-lg">
                {course.title || course.name}
              </h1>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                Lesson {currentIndex >= 0 ? currentIndex + 1 : 1} of {allLessons.length}: {activeLesson?.title || "Overview"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-full">
            <span className="text-xs text-slate-400 font-medium">Progress</span>
            <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500" 
                style={{ width: `${overallProgress}%` }} 
              />
            </div>
            <span className="text-xs font-bold text-teal-400 font-mono">{overallProgress}%</span>
          </div>

          {/* Theater Mode Toggle */}
          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isTheaterMode 
                ? "bg-teal-500/20 text-teal-300 border-teal-500/40" 
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700"
            }`}
          >
            {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isTheaterMode ? "Standard Mode" : "Theater Mode"}</span>
          </button>

          {/* Assignments Link */}
          <Link 
            href="/student/assignments" 
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Assignments</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT AREA: Video Player & Interactive Tabs */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 transition-all duration-300 ${isTheaterMode ? 'w-full' : ''}`}>
          
          {/* VIDEO PLAYER CONTAINER */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center group">
            {activeLesson?.videoUrl ? (
              <video 
                ref={videoRef}
                src={activeLesson.videoUrl.startsWith('http') ? activeLesson.videoUrl : `https://echo.grekam.in/${activeLesson.videoUrl}`}
                controls 
                autoPlay={autoPlayNext}
                className="w-full h-full object-contain"
                poster={activeLesson.thumbnailUrl || undefined}
              />
            ) : (
              <div className="text-center p-8 max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  {activeLesson?.type === 'article' ? (
                    <BookOpen className="w-8 h-8 text-teal-400" />
                  ) : activeLesson?.type === 'quiz' ? (
                    <HelpCircle className="w-8 h-8 text-amber-400" />
                  ) : (
                    <Video className="w-8 h-8 text-teal-400" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {activeLesson ? activeLesson.title : "Select a Lesson from Curriculum"}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {activeLesson?.description || "Select any topic from the curriculum sidebar to load video content, interactive code, or reading materials."}
                </p>
              </div>
            )}

            {/* Quick Player Bar Overlay (Speed & Autoplay) */}
            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3 text-xs text-slate-300">
              {/* Speed Controller */}
              <div className="flex items-center gap-1">
                <FastForward className="w-3.5 h-3.5 text-teal-400" />
                <select 
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer font-bold"
                >
                  <option value={0.75} className="bg-slate-900 text-white">0.75x</option>
                  <option value={1.0} className="bg-slate-900 text-white">1.0x (Normal)</option>
                  <option value={1.25} className="bg-slate-900 text-white">1.25x</option>
                  <option value={1.5} className="bg-slate-900 text-white">1.5x</option>
                  <option value={2.0} className="bg-slate-900 text-white">2.0x</option>
                </select>
              </div>

              <div className="w-px h-3 bg-slate-700" />

              {/* Autoplay Switch */}
              <button 
                onClick={() => setAutoPlayNext(!autoPlayNext)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${autoPlayNext ? 'text-teal-400' : 'text-slate-400'}`}
              >
                <div className={`w-2 h-2 rounded-full ${autoPlayNext ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>Autoplay</span>
              </button>
            </div>
          </div>

          {/* LESSON TITLE & QUICK CONTROLS BAR */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-teal-400 font-mono mb-1">
                <span className="font-semibold">{activeLesson?.duration || "10 mins"}</span>
                <span>•</span>
                <span className="capitalize">{activeLesson?.type || "Video Lesson"}</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">{activeLesson?.title || "Lesson Overview"}</h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkComplete}
                disabled={completing || activeLesson?.isCompleted}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeLesson?.isCompleted 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default"
                    : "bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold shadow-lg shadow-teal-500/25 active:scale-95"
                }`}
              >
                {activeLesson?.isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed
                  </>
                ) : completing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Mark as Complete
                  </>
                )}
              </button>
            </div>
          </div>

          {/* MULTI-TAB WORKSPACE BELOW VIDEO */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {/* Tab Header Navigation */}
            <div className="flex items-center gap-1 border-b border-slate-800 px-4 pt-3 overflow-x-auto bg-slate-950/40 no-scrollbar">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 shrink-0 ${
                  activeTab === "overview" 
                    ? "border-teal-500 text-teal-400 bg-slate-900" 
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Overview
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 shrink-0 ${
                  activeTab === "notes" 
                    ? "border-teal-500 text-teal-400 bg-slate-900" 
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" /> Personal Notes ({notes.length})
              </button>

              <button
                onClick={() => setActiveTab("qa")}
                className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 shrink-0 ${
                  activeTab === "qa" 
                    ? "border-teal-500 text-teal-400 bg-slate-900" 
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Q&A Forum ({qaList.length})
              </button>

              <button
                onClick={() => setActiveTab("resources")}
                className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 shrink-0 ${
                  activeTab === "resources" 
                    ? "border-teal-500 text-teal-400 bg-slate-900" 
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <Download className="w-3.5 h-3.5" /> Resources & Files
              </button>

              <button
                onClick={() => setActiveTab("transcript")}
                className={`px-4 py-3 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 shrink-0 ${
                  activeTab === "transcript" 
                    ? "border-teal-500 text-teal-400 bg-slate-900" 
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Transcript
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="p-6">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6 text-slate-300 text-xs leading-relaxed">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">Lesson Description</h3>
                    <p className="leading-relaxed text-slate-400">
                      {activeLesson?.description || activeLesson?.content || "In this lesson, you will master the foundational architecture and key principles needed to build high-performance software modules."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
                      <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider font-mono">Key Takeaways</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 pt-1">
                        <li>Understand core component lifecycle & state management</li>
                        <li>Implement clean separation of concerns</li>
                        <li>Apply performance optimizations for production scale</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instructor</div>
                        <div className="text-xs font-bold text-white">Echo Faculty Team</div>
                        <div className="text-[10px] text-slate-400">Senior Software Architects</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PERSONAL NOTES WITH TIMESTAMP JUMP */}
              {activeTab === "notes" && (
                <div className="space-y-6">
                  {/* Note Creator Input */}
                  <form onSubmit={handleAddNote} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-teal-400" /> Add Note at Current Time
                      </label>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                        Video Time Locked
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Type your notes here... (e.g. 'Important formula explained here')"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
                      >
                        Save Note
                      </button>
                    </div>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-3 pt-2">
                    {notes.map((note) => (
                      <div 
                        key={note.id}
                        className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => jumpToTime(note.timestamp)}
                            className="px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 font-mono text-xs font-bold rounded-lg border border-teal-500/30 flex items-center gap-1 transition-all"
                          >
                            <PlayCircle className="w-3 h-3" /> {note.time}
                          </button>
                          <p className="text-xs text-slate-300 font-medium">{note.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Q&A DISCUSSION */}
              {activeTab === "qa" && (
                <div className="space-y-6">
                  {/* Ask Question Form */}
                  <form onSubmit={handleAddQuestion} className="space-y-3">
                    <textarea
                      rows={2}
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Have a question about this lesson? Ask the instructor and peers..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Post Question
                      </button>
                    </div>
                  </form>

                  {/* Q&A Threads */}
                  <div className="space-y-4">
                    {qaList.map((item) => (
                      <div key={item.id} className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img src={item.avatar} alt={item.author} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                            <div>
                              <div className="text-xs font-bold text-white">{item.author}</div>
                              <div className="text-[10px] text-slate-500">{item.time}</div>
                            </div>
                          </div>
                          <button className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg border border-slate-700">
                            <ThumbsUp className="w-3 h-3 text-teal-400" /> {item.upvotes}
                          </button>
                        </div>

                        <p className="text-xs text-slate-200 font-medium pl-11">{item.question}</p>

                        {item.answer && (
                          <div className="ml-11 p-3 bg-teal-950/20 border border-teal-500/20 rounded-xl space-y-1">
                            <div className="text-[11px] font-bold text-teal-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-teal-400" /> {item.answer.author}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{item.answer.text}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: RESOURCES & DOWNLOADABLE FILES */}
              {activeTab === "resources" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Lesson Downloads & Attachments
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href="#"
                      className="p-4 bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                            Lesson Slide Deck (PDF)
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">4.2 MB • PDF Document</div>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
                    </a>

                    <a
                      href="#"
                      className="p-4 bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                            Source Code Starter Pack
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">1.8 MB • ZIP Archive</div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 5: TRANSCRIPT */}
              {activeTab === "transcript" && (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 text-xs text-slate-300 font-mono leading-relaxed">
                  <div className="p-2 hover:bg-slate-800/50 rounded-lg flex gap-3 cursor-pointer" onClick={() => jumpToTime(5)}>
                    <span className="text-teal-400 font-bold shrink-0">00:05</span>
                    <span>Welcome everyone to this lesson on system architecture foundations.</span>
                  </div>
                  <div className="p-2 hover:bg-slate-800/50 rounded-lg flex gap-3 cursor-pointer" onClick={() => jumpToTime(45)}>
                    <span className="text-teal-400 font-bold shrink-0">00:45</span>
                    <span>Today we will examine how request processing flows through decoupled modules.</span>
                  </div>
                  <div className="p-2 hover:bg-slate-800/50 rounded-lg flex gap-3 cursor-pointer" onClick={() => jumpToTime(120)}>
                    <span className="text-teal-400 font-bold shrink-0">02:00</span>
                    <span>Notice how asynchronous worker queues handle long-running operations without blocking.</span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* STICKY BOTTOM NAVIGATION BAR */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex items-center justify-between gap-4 shadow-xl">
            <button
              onClick={() => prevLesson && setActiveLesson(prevLesson)}
              disabled={!prevLesson}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                prevLesson 
                  ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700" 
                  : "bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed"
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Previous Lesson
            </button>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
              {currentIndex + 1} of {allLessons.length} Modules Completed
            </span>

            <button
              onClick={() => nextLesson && setActiveLesson(nextLesson)}
              disabled={!nextLesson}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                nextLesson 
                  ? "bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold border-teal-400 shadow-md shadow-teal-500/20" 
                  : "bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed"
              }`}
            >
              Next Lesson <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* RIGHT AREA: CURRICULUM SIDEBAR */}
        {!isTheaterMode && (
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800/80 bg-slate-900/80 p-4 sm:p-5 overflow-y-auto space-y-4 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <ListFilter className="w-3.5 h-3.5 text-teal-400" /> Course Curriculum
              </h3>
              <span className="text-xs text-teal-400 font-mono font-bold bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                {rawModules.length} Modules
              </span>
            </div>

            {/* Modules Accordion List */}
            <div className="space-y-3">
              {rawModules.map((mod: any, mIdx: number) => {
                const modId = mod.id || `mod-${mIdx}`
                const isExpanded = expandedModules[modId] !== false

                return (
                  <div key={modId} className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                    {/* Module Header Toggle */}
                    <button
                      onClick={() => toggleModule(modId)}
                      className="w-full p-3.5 bg-slate-900/90 hover:bg-slate-800/70 font-semibold text-xs text-slate-200 flex items-center justify-between gap-3 text-left transition-colors border-b border-slate-800/60"
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <span className="w-5 h-5 rounded-md bg-teal-500/20 border border-teal-500/30 text-teal-400 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold">
                          {mIdx + 1}
                        </span>
                        <span className="truncate font-bold text-white">{mod.title || mod.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Lessons List under Module */}
                    {isExpanded && (
                      <div className="divide-y divide-slate-800/50">
                        {mod.lessons?.map((les: any) => {
                          const isActive = activeLesson?.id === les.id
                          return (
                            <button
                              key={les.id}
                              onClick={() => setActiveLesson(les)}
                              className={`w-full text-left p-3 flex items-center justify-between gap-3 text-xs transition-all ${
                                isActive 
                                  ? "bg-teal-500/10 text-teal-300 font-bold border-l-4 border-teal-500" 
                                  : "hover:bg-slate-900/60 text-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-3 truncate">
                                {les.isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : les.type === 'quiz' ? (
                                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                ) : les.type === 'article' ? (
                                  <BookOpen className="w-4 h-4 text-teal-400 shrink-0" />
                                ) : (
                                  <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? "text-teal-400" : "text-slate-500"}`} />
                                )}
                                <span className="truncate">{les.title}</span>
                              </div>
                              {les.duration && (
                                <span className="text-[10px] text-slate-500 font-mono shrink-0">{les.duration}</span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
