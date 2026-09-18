"use client"

import { useState } from "react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"
import { Loader2, X, Plus, Search, Filter, ChevronDown, GraduationCap, Download, Mail, MoreVertical, HelpCircle, Clock, CheckCircle2 } from "lucide-react"

export default function QuizBuilderPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: quizData, isLoading, mutate } = useApi<any>("/lms/quizzes")
  const rawQuizzes = quizData?.data || []

  const quizzes = rawQuizzes.map((q: any) => ({
    id: q.id,
    title: q.title || 'Untitled Quiz',
    course: q.lesson?.chapter?.course?.name || 'Onsite Course',
    questions: Array.isArray(q.questions) ? q.questions.length : 10,
    timeLimit: `${q.timeLimitMinutes || 30} mins`,
    status: q.isPublished ? 'Published' : 'Draft',
    passingScore: q.passingScore || 70,
    completions: q._count?.submissions || 0
  }))

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quizForm, setQuizForm] = useState({ title: "", passingScore: 70 })

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/lms/quizzes", {
        method: "POST",
        body: JSON.stringify({
          title: quizForm.title,
          passingScore: Number(quizForm.passingScore),
          isPublished: true
        })
      })
      toast.success("Quiz created successfully!")
      setIsCreateOpen(false)
      setQuizForm({ title: "", passingScore: 70 })
      mutate()
    } catch (err: any) {
      toast.error(err.message || "Failed to create quiz")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto h-full bg-slate-50 text-slate-900">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quiz Builder</h1>
            <p className="text-slate-500 mt-1">Create and manage assessments for your courses.</p>
          </div>
          <button onClick={() => setIsCreateOpen(true)} className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Create Quiz
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search quizzes..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quizzes Grid */}
        {isLoading ? (
          <div className="text-slate-400 text-center py-8">Loading quizzes...</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes
            .filter((q: any) => q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.course.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((quiz: any) => (
            <div key={quiz.id} className="bg-white border border-slate-200 hover:border-teal-400 transition-all rounded-2xl p-6 flex flex-col group shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                  quiz.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {quiz.status}
                </span>
                <button className="text-slate-400 hover:text-slate-700 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">{quiz.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-1">{quiz.course}</p>
              
              <div className="mt-auto grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Questions</div>
                    <div className="text-sm font-semibold text-slate-900">{quiz.questions}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Time Limit</div>
                    <div className="text-sm font-semibold text-slate-900">{quiz.timeLimit}</div>
                  </div>
                </div>
                
                <div className="col-span-2 pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {quiz.completions} Completions
                  </div>
                  <button 
                    onClick={() => {
                      setEditingQuiz(quiz)
                      setQuizForm({ title: quiz.title, passingScore: quiz.passingScore })
                    }}
                    className="text-teal-600 text-xs font-bold hover:text-teal-700 transition-colors"
                  >
                    Edit Assessment &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Create / Edit Quiz Modal */}
          {(isCreateOpen || editingQuiz) && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl text-slate-900">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">{editingQuiz ? "Edit Quiz" : "Create Quiz"}</h2>
                  <button onClick={() => { setIsCreateOpen(false); setEditingQuiz(null); }}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
                </div>
                <form onSubmit={handleCreateQuiz} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-2">Quiz Title</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none"
                      placeholder="e.g. Advanced System Architecture"
                      value={quizForm.title} onChange={e => setQuizForm(p => ({...p, title: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-2">Passing Score (%)</label>
                    <input required type="number" min={1} max={100} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-teal-500 outline-none"
                      value={quizForm.passingScore} onChange={e => setQuizForm(p => ({...p, passingScore: Number(e.target.value)}))} />
                  </div>
                  <button disabled={isSubmitting || !quizForm.title} type="submit"
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 mt-4 flex justify-center items-center gap-2 shadow-sm">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Quiz"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Empty State / Add New Card */}
          <div onClick={() => setIsCreateOpen(true)} className="border-2 border-dashed border-slate-300 hover:border-teal-400 transition-all rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[280px] bg-white">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create New Quiz</h3>
            <p className="text-slate-500 text-sm max-w-[200px]">Add multiple choice, true/false, and coding questions.</p>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
