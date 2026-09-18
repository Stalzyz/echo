"use client"

import { use, useState, useEffect } from "react"
import { useApi } from "@/lib/useApi"
import Link from "next/link"
import {
  ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText, 
  Download, Award, Sparkles, ChevronRight, Lock, 
  HelpCircle, RefreshCw, Layers, ExternalLink, Video
} from "lucide-react"

export default function StudentCoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params)
  const courseId = resolvedParams.courseId

  const { data: courseData, isLoading, error, mutate } = useApi<any>(`/lms/courses/${courseId}`)
  const [activeLesson, setActiveLesson] = useState<any>(null)
  const [completing, setCompleting] = useState(false)

  // Auto-select first lesson on initial load
  useEffect(() => {
    if (courseData?.modules?.[0]?.lessons?.[0] && !activeLesson) {
      setActiveLesson(courseData.modules[0].lessons[0])
    }
  }, [courseData, activeLesson])

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
      setCompleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3 font-sans">
        <RefreshCw className="animate-spin w-8 h-8 text-violet-600" />
        <p className="text-sm font-medium tracking-wide">Loading Course Player...</p>
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 p-6 font-sans">
        <div className="max-w-md text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          <Layers className="w-12 h-12 text-rose-500 mx-auto mb-4 opacity-75" />
          <h2 className="text-xl font-bold mb-2">Course Unavailable</h2>
          <p className="text-sm text-slate-500 mb-6">Unable to load curriculum modules. Please verify your enrollment.</p>
          <Link href="/student" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const course = courseData.course || courseData
  const modules = courseData.modules || []
  const overallProgress = courseData.progress || 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/student" className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest block font-mono">Grekam LMS Player</span>
            <h1 className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">{course.title || course.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress Pill */}
          <div className="hidden md:flex items-center gap-3 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full">
            <span className="text-xs text-slate-600 font-medium">Progress</span>
            <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
            </div>
            <span className="text-xs font-bold text-violet-700 font-mono">{overallProgress}%</span>
          </div>

          <Link href="/student/assignments" className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Assignments
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Area: Video Player & Lesson Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          
          {/* Video Container */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xl flex items-center justify-center group">
            {activeLesson?.videoUrl ? (
              <video 
                src={activeLesson.videoUrl.startsWith('http') ? activeLesson.videoUrl : `https://echo.grekam.in/${activeLesson.videoUrl}`}
                controls 
                className="w-full h-full object-contain"
                poster={activeLesson.thumbnailUrl || undefined}
              />
            ) : (
              <div className="text-center p-8 text-white">
                <Video className="w-16 h-16 text-violet-400 mx-auto mb-3 opacity-80" />
                <h3 className="text-base font-bold text-white mb-1">
                  {activeLesson ? activeLesson.title : "Select a Lesson to Begin"}
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  {activeLesson?.content ? "Interactive text/code lesson below." : "Choose a topic from the right curriculum panel."}
                </p>
              </div>
            )}
          </div>

          {/* Lesson Header & Action Toolbar */}
          {activeLesson && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-[10px] font-bold text-violet-600 uppercase tracking-widest font-mono">Current Lesson</div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{activeLesson.title}</h2>
                </div>

                <button
                  onClick={handleMarkComplete}
                  disabled={completing || activeLesson.isCompleted}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeLesson.isCompleted 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {activeLesson.isCompleted ? "Completed" : completing ? "Saving..." : "Mark as Complete"}
                </button>
              </div>

              {/* Lesson Description */}
              <div className="prose max-w-none text-xs text-slate-600 leading-relaxed">
                {activeLesson.description || activeLesson.content || "No detailed description provided for this lesson module."}
              </div>

              {/* Downloadable Assets */}
              {activeLesson.assets?.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-cyan-600" /> Lesson Attachments
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {activeLesson.assets.map((asset: any, idx: number) => (
                      <a
                        key={idx}
                        href={asset.url.startsWith('http') ? asset.url : `https://echo.grekam.in/${asset.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 flex items-center gap-2 transition-all shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-violet-600" />
                        <span>{asset.name || `Resource ${idx + 1}`}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Area: Curriculum Sidebar */}
        <div className="w-full lg:w-96 border-l border-slate-200 bg-white p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Curriculum</h3>
            <span className="text-xs text-violet-600 font-mono font-bold">{modules.length} Modules</span>
          </div>

          <div className="space-y-4">
            {modules.map((mod: any, mIdx: number) => (
              <div key={mod.id || mIdx} className="bg-slate-50/80 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="p-4 bg-slate-100 font-semibold text-xs text-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-5 h-5 rounded-md bg-violet-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0 font-bold">
                      {mIdx + 1}
                    </span>
                    <span className="truncate">{mod.title || mod.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">{mod.lessons?.length || 0} lessons</span>
                </div>

                <div className="divide-y divide-slate-200/60">
                  {mod.lessons?.map((les: any) => {
                    const isActive = activeLesson?.id === les.id
                    return (
                      <button
                        key={les.id}
                        onClick={() => setActiveLesson(les)}
                        className={`w-full text-left p-3.5 flex items-center justify-between gap-3 text-xs transition-all ${
                          isActive 
                            ? "bg-violet-50 text-violet-900 font-bold border-l-3 border-violet-600" 
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          {les.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? "text-violet-600" : "text-slate-400"}`} />
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
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
