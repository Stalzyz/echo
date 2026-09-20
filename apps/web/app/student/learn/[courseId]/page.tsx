"use client"

import { use, useState, useEffect, useRef } from "react"
import { useApi } from "@/lib/useApi"
import Link from "next/link"
import {
  ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText, 
  Download, Award, ChevronRight, Lock, 
  HelpCircle, RefreshCw, Layers, ExternalLink, Video,
  Maximize2, Minimize2, MessageSquare, Bookmark, ListFilter,
  Send, ThumbsUp, Check, Clock, FastForward,
  ChevronDown, BookOpen, User
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
    { id: "1", time: "01:15", text: "Key system concept explained here", timestamp: 75 },
    { id: "2", time: "03:40", text: "Important calculation formula", timestamp: 220 }
  ])
  const [newNote, setNewNote] = useState("")

  // Q&A State
  const [qaList, setQaList] = useState<Array<{ id: string; author: string; avatar: string; time: string; question: string; upvotes: number; answer?: { author: string; text: string } }>>([
    {
      id: "q1",
      author: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      time: "2 hours ago",
      question: "Can someone clarify the difference between synchronous and asynchronous operations here?",
      upvotes: 4,
      answer: {
        author: "Instructor Team",
        text: "Synchronous operations block execution until completed, while asynchronous operations run in the background and notify when finished."
      }
    }
  ])
  const [newQuestion, setNewQuestion] = useState("")

  // Default Modules fallback if course has no modules yet
  const defaultModules = [
    {
      id: "mod-1",
      title: "Module 1: Fundamental Concepts & Setup",
      lessons: [
        {
          id: "les-1",
          title: "1.1 Course Introduction & Objectives",
          duration: "04:15",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          description: "Overview of course structure, tools, and prerequisites.",
          isCompleted: true,
          type: "video"
        },
        {
          id: "les-2",
          title: "1.2 Core Architecture Blueprint",
          duration: "12:30",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          description: "In-depth look at architecture, patterns, and workflows.",
          isCompleted: false,
          type: "video"
        },
        {
          id: "les-3",
          title: "1.3 Setup & Reading Material",
          duration: "08:45",
          content: "Detailed documentation and workspace setup steps.",
          isCompleted: false,
          type: "article"
        }
      ]
    },
    {
      id: "mod-2",
      title: "Module 2: Practical Implementation",
      lessons: [
        {
          id: "les-4",
          title: "2.1 Building Components",
          duration: "15:20",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          description: "Step-by-step walkthrough of building robust modules.",
          isCompleted: false,
          type: "video"
        },
        {
          id: "les-5",
          title: "2.2 Knowledge Check Quiz",
          duration: "10 mins",
          isCompleted: false,
          type: "quiz"
        }
      ]
    }
  ]

  const course = courseData?.course || courseData || { title: "Course Learning Studio" }
  const rawModules = courseData?.modules && courseData.modules.length > 0 ? courseData.modules : defaultModules
  const overallProgress = courseData?.progress ?? 35

  useEffect(() => {
    if (rawModules.length > 0) {
      const initialExpanded: Record<string, boolean> = {}
      rawModules.forEach((m: any, idx: number) => {
        initialExpanded[m.id || `mod-${idx}`] = true
      })
      setExpandedModules(initialExpanded)

      if (!activeLesson && rawModules[0]?.lessons?.[0]) {
        setActiveLesson(rawModules[0].lessons[0])
      }
    }
  }, [courseData])

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

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
      if (activeLesson) {
        activeLesson.isCompleted = true
      }
      setCompleting(false)
    }
  }

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
        answer: undefined
      },
      ...qaList
    ])
    setNewQuestion("")
  }

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }))
  }

  const allLessons = rawModules.flatMap((m: any) => m.lessons || [])
  const currentIndex = allLessons.findIndex((l: any) => l.id === activeLesson?.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3 font-sans">
        <RefreshCw className="animate-spin w-8 h-8 text-teal-600" />
        <p className="text-sm font-medium text-slate-700">Loading Echo Learning Studio...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden">
      
      {/* 1. TOP NAVBAR (UNIFIED LIGHT THEME) */}
      <header className="min-h-[64px] py-3 border-b border-slate-200 bg-white px-4 sm:px-6 flex flex-wrap items-center justify-between sticky top-0 z-40 shadow-xs gap-2">
        <div className="flex items-center gap-3">
          <Link 
            href="/student" 
            className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-600 hover:text-slate-900 border border-slate-200 shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest block font-mono">
              Echo Learning Studio
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md lg:max-w-lg">
              {course.title || course.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Clean Solid Progress Bar */}
          <div className="hidden md:flex items-center gap-3 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
            <span className="text-xs text-slate-600 font-medium">Progress</span>
            <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-600 rounded-full transition-all duration-300" 
                style={{ width: `${overallProgress}%` }} 
              />
            </div>
            <span className="text-xs font-bold text-teal-700 font-mono">{overallProgress}%</span>
          </div>

          {/* Theater Mode Switch */}
          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isTheaterMode 
                ? "bg-teal-50 text-teal-700 border-teal-200" 
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isTheaterMode ? "Standard" : "Theater"}</span>
          </button>

          {/* Assignments Link */}
          <Link 
            href="/student/assignments" 
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Assignments</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT AREA: Video Player & Tabs */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 ${isTheaterMode ? 'w-full' : ''}`}>
          
          {/* VIDEO CANVAS CONTAINER */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shadow-md flex items-center justify-center group">
            {activeLesson?.videoUrl ? (
              (() => {
                const url = activeLesson.videoUrl
                const isYouTube = url.includes("youtube.com") || url.includes("youtu.be")
                let ytEmbed = ""
                if (isYouTube) {
                  if (url.includes("v=")) {
                    ytEmbed = url.split("v=")[1]?.split("&")[0] || ""
                  } else if (url.includes("youtu.be/")) {
                    ytEmbed = url.split("youtu.be/")[1]?.split("?")[0] || ""
                  } else if (url.includes("embed/")) {
                    ytEmbed = url.split("embed/")[1]?.split("?")[0] || ""
                  }
                }

                if (isYouTube && ytEmbed) {
                  return (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ytEmbed}?autoplay=1&rel=0&modestbranding=1`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                }

                return (
                  <video 
                    ref={videoRef}
                    src={url.startsWith('http') ? url : `https://echo.grekam.in/${url}`}
                    controls 
                    autoPlay={autoPlayNext}
                    className="w-full h-full object-contain"
                    poster={activeLesson.thumbnailUrl || undefined}
                  />
                )
              })()
            ) : (
              <div className="text-center p-8 max-w-md text-white">
                <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                  {activeLesson?.type === 'article' ? (
                    <BookOpen className="w-7 h-7 text-teal-400" />
                  ) : activeLesson?.type === 'quiz' ? (
                    <HelpCircle className="w-7 h-7 text-amber-400" />
                  ) : (
                    <Video className="w-7 h-7 text-teal-400" />
                  )}
                </div>
                <h3 className="text-base font-bold mb-1">
                  {activeLesson ? activeLesson.title : "Select a Lesson"}
                </h3>
                <p className="text-xs text-slate-300">
                  {activeLesson?.description || "Select a lesson topic from the curriculum sidebar."}
                </p>
              </div>
            )}

            {/* Clean Speed & Autoplay Overlay Controls */}
            <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3 text-xs text-slate-200">
              <div className="flex items-center gap-1 font-mono">
                <FastForward className="w-3.5 h-3.5 text-teal-400" />
                <select 
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value={0.75} className="bg-slate-900 text-white">0.75x</option>
                  <option value={1.0} className="bg-slate-900 text-white">1.0x</option>
                  <option value={1.25} className="bg-slate-900 text-white">1.25x</option>
                  <option value={1.5} className="bg-slate-900 text-white">1.5x</option>
                  <option value={2.0} className="bg-slate-900 text-white">2.0x</option>
                </select>
              </div>

              <div className="w-px h-3 bg-slate-700" />

              <button 
                onClick={() => setAutoPlayNext(!autoPlayNext)}
                className={`flex items-center gap-1 font-medium ${autoPlayNext ? 'text-teal-400' : 'text-slate-400'}`}
              >
                <div className={`w-2 h-2 rounded-full ${autoPlayNext ? 'bg-teal-400' : 'bg-slate-600'}`} />
                <span>Autoplay</span>
              </button>
            </div>
          </div>

          {/* LESSON HEADER CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider font-mono">
                Lesson {currentIndex >= 0 ? currentIndex + 1 : 1} of {allLessons.length}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{activeLesson?.title || "Lesson Overview"}</h2>
            </div>

            <button
              onClick={handleMarkComplete}
              disabled={completing || activeLesson?.isCompleted}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeLesson?.isCompleted 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                  : "bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
              }`}
            >
              {activeLesson?.isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed
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

          {/* MULTI-TAB WORKSPACE */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Clean Light Tab Navigation */}
            <div className="flex items-center gap-1 border-b border-slate-200 px-4 pt-2 overflow-x-auto bg-slate-50/50">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === "overview" 
                    ? "border-teal-600 text-teal-700 bg-white" 
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Overview
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === "notes" 
                    ? "border-teal-600 text-teal-700 bg-white" 
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" /> Notes ({notes.length})
              </button>

              <button
                onClick={() => setActiveTab("qa")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === "qa" 
                    ? "border-teal-600 text-teal-700 bg-white" 
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Q&A Forum ({qaList.length})
              </button>

              <button
                onClick={() => setActiveTab("resources")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === "resources" 
                    ? "border-teal-600 text-teal-700 bg-white" 
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Download className="w-3.5 h-3.5" /> Resources & Files
              </button>

              <button
                onClick={() => setActiveTab("transcript")}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === "transcript" 
                    ? "border-teal-600 text-teal-700 bg-white" 
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Transcript
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4 text-slate-600 text-xs leading-relaxed">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">About This Lesson</h3>
                    <p className="leading-relaxed text-slate-600">
                      {activeLesson?.description || activeLesson?.content || "Detailed architectural concepts and implementation guidelines for this module."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Key Topics</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 pt-1">
                        <li>Core concept overview</li>
                        <li>Implementation steps</li>
                        <li>Practical exercises</li>
                      </ul>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instructor</div>
                        <div className="text-xs font-bold text-slate-900">Echo Learning Team</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NOTES */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a timestamped note..."
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Save Note
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {notes.map((note) => (
                      <div 
                        key={note.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => jumpToTime(note.timestamp)}
                            className="px-2 py-0.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-mono text-xs font-bold rounded-md border border-teal-200 flex items-center gap-1"
                          >
                            <PlayCircle className="w-3 h-3" /> {note.time}
                          </button>
                          <p className="text-xs text-slate-700 font-medium">{note.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Q&A */}
              {activeTab === "qa" && (
                <div className="space-y-4">
                  <form onSubmit={handleAddQuestion} className="space-y-2">
                    <textarea
                      rows={2}
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Ask a question about this lesson..."
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 resize-none"
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Post Question
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3">
                    {qaList.map((item) => (
                      <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={item.avatar} alt={item.author} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                            <div>
                              <div className="text-xs font-bold text-slate-900">{item.author}</div>
                              <div className="text-[10px] text-slate-500">{item.time}</div>
                            </div>
                          </div>
                          <button className="flex items-center gap-1 px-2 py-0.5 bg-white text-slate-600 text-[11px] rounded-md border border-slate-200">
                            <ThumbsUp className="w-3 h-3 text-teal-600" /> {item.upvotes}
                          </button>
                        </div>

                        <p className="text-xs text-slate-800 font-medium">{item.question}</p>

                        {item.answer && (
                          <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-lg space-y-1">
                            <div className="text-[11px] font-bold text-teal-800">{item.answer.author}</div>
                            <p className="text-xs text-slate-700">{item.answer.text}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: RESOURCES */}
              {activeTab === "resources" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Lesson Downloads
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href="#"
                      className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white border border-slate-200 rounded-lg text-teal-700">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                            Lesson Document (PDF)
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">3.4 MB</div>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-teal-700" />
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 5: TRANSCRIPT */}
              {activeTab === "transcript" && (
                <div className="space-y-2 max-h-64 overflow-y-auto text-xs text-slate-700 font-mono">
                  <div className="p-2 hover:bg-slate-100 rounded-lg flex gap-3 cursor-pointer" onClick={() => jumpToTime(5)}>
                    <span className="text-teal-700 font-bold shrink-0">00:05</span>
                    <span>Welcome to this lesson module overview.</span>
                  </div>
                  <div className="p-2 hover:bg-slate-100 rounded-lg flex gap-3 cursor-pointer" onClick={() => jumpToTime(45)}>
                    <span className="text-teal-700 font-bold shrink-0">00:45</span>
                    <span>We will explore step-by-step implementation details.</span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* STICKY BOTTOM NAVIGATION BAR */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-4 shadow-xs">
            <button
              onClick={() => prevLesson && setActiveLesson(prevLesson)}
              disabled={!prevLesson}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                prevLesson 
                  ? "bg-white hover:bg-slate-50 text-slate-700 border-slate-200" 
                  : "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
              Lesson {currentIndex + 1} of {allLessons.length}
            </span>

            <button
              onClick={() => nextLesson && setActiveLesson(nextLesson)}
              disabled={!nextLesson}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                nextLesson 
                  ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600 shadow-xs" 
                  : "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
              }`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* RIGHT AREA: CURRICULUM SIDEBAR */}
        {!isTheaterMode && (
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-4 sm:p-5 overflow-y-auto space-y-4 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono flex items-center gap-2">
                <ListFilter className="w-3.5 h-3.5 text-teal-700" /> Course Curriculum
              </h3>
              <span className="text-xs text-teal-700 font-mono font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                {rawModules.length} Modules
              </span>
            </div>

            <div className="space-y-3">
              {rawModules.map((mod: any, mIdx: number) => {
                const modId = mod.id || `mod-${mIdx}`
                const isExpanded = expandedModules[modId] !== false

                return (
                  <div key={modId} className="bg-slate-50/80 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <button
                      onClick={() => toggleModule(modId)}
                      className="w-full p-3 bg-slate-100/80 hover:bg-slate-100 font-semibold text-xs text-slate-800 flex items-center justify-between gap-3 text-left transition-colors border-b border-slate-200/80"
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <span className="w-5 h-5 rounded-md bg-teal-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0 font-bold">
                          {mIdx + 1}
                        </span>
                        <span className="truncate font-bold text-slate-900">{mod.title || mod.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-slate-200/60">
                        {mod.lessons?.map((les: any) => {
                          const isActive = activeLesson?.id === les.id
                          return (
                            <button
                              key={les.id}
                              onClick={() => setActiveLesson(les)}
                              className={`w-full text-left p-3 flex items-center justify-between gap-3 text-xs transition-all ${
                                isActive 
                                  ? "bg-teal-50 text-teal-900 font-bold border-l-4 border-teal-600" 
                                  : "hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                {les.isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : les.type === 'quiz' ? (
                                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                ) : les.type === 'article' ? (
                                  <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
                                ) : (
                                  <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                                )}
                                <span className="truncate">{les.title}</span>
                              </div>
                              {les.duration && (
                                <span className="text-[10px] text-slate-400 font-mono shrink-0">{les.duration}</span>
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
