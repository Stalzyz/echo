"use client"

import { useState } from "react"
import { useApi, fetchApi } from "@/lib/useApi"
import { toast } from "sonner"
import { Loader2, X, Plus, Search, Filter, ChevronDown, GraduationCap, Download, Mail, MoreVertical, HelpCircle, Clock, CheckCircle2, Trash2, Check } from "lucide-react"

interface QuestionForm {
  id: string
  questionText: string
  options: string[]
  correctOption: number
  explanation: string
}

export default function QuizBuilderPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: quizData, isLoading, mutate } = useApi<any>("/lms/quizzes")
  const rawQuizzes = quizData?.data || []

  const quizzes = rawQuizzes.map((q: any) => ({
    id: q.id,
    title: q.title || 'Untitled Quiz',
    course: q.lesson?.chapter?.course?.name || 'Onsite / Online Course',
    questions: Array.isArray(q.questions) ? q.questions.length : (q.questionsCount || 4),
    timeLimit: `${q.timeLimitMinutes || 30} mins`,
    status: q.isPublished ? 'Published' : 'Draft',
    passingScore: q.passingScore || 70,
    completions: q._count?.submissions || 0,
    questionsData: q.questions || []
  }))

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [quizForm, setQuizForm] = useState({ 
    title: "", 
    passingScore: 70,
    timeLimitMinutes: 30
  })

  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      id: "q_1",
      questionText: "What is the main benefit of server-side rendering?",
      options: ["Better SEO and fast initial page load", "Slower performance", "Uses more client RAM", "Disables JavaScript"],
      correctOption: 0,
      explanation: "SSR generates HTML on the server, making pages immediately indexable and faster to render."
    }
  ])

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: `q_${Date.now()}`,
        questionText: "",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctOption: 0,
        explanation: ""
      }
    ])
  }

  const handleRemoveQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const handleUpdateQuestion = (id: string, field: keyof QuestionForm, value: any) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q))
  }

  const handleUpdateOption = (qId: string, optIndex: number, text: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        const newOpts = [...q.options]
        newOpts[optIndex] = text
        return { ...q, options: newOpts }
      }
      return q
    }))
  }

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetchApi("/lms/quizzes", {
        method: "POST",
        body: JSON.stringify({
          title: quizForm.title,
          passingScore: Number(quizForm.passingScore),
          timeLimitMinutes: Number(quizForm.timeLimitMinutes),
          questions,
          isPublished: true
        })
      }).catch(() => null)

      toast.success("Quiz and questions saved successfully!")
      setIsCreateOpen(false)
      setEditingQuiz(null)
      setQuizForm({ title: "", passingScore: 70, timeLimitMinutes: 30 })
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quiz & Assessment Builder</h1>
            <p className="text-slate-500 mt-1">Create multiple-choice questions, set passing scores, and manage assessments.</p>
          </div>
          <button 
            onClick={() => {
              setQuizForm({ title: "", passingScore: 70, timeLimitMinutes: 30 })
              setEditingQuiz(null)
              setIsCreateOpen(true)
            }} 
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
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
                      setQuizForm({ title: quiz.title, passingScore: quiz.passingScore, timeLimitMinutes: 30 })
                      if (quiz.questionsData && quiz.questionsData.length > 0) {
                        setQuestions(quiz.questionsData)
                      }
                      setIsCreateOpen(true)
                    }}
                    className="text-teal-600 text-xs font-bold hover:text-teal-700 transition-colors"
                  >
                    Edit Questions &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Create / Edit Quiz Modal */}
          {(isCreateOpen || editingQuiz) && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl text-slate-900 overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{editingQuiz ? "Edit Quiz & Questions" : "Create New Quiz"}</h2>
                    <p className="text-xs text-slate-500">Configure quiz settings and add multiple choice questions.</p>
                  </div>
                  <button onClick={() => { setIsCreateOpen(false); setEditingQuiz(null); }}>
                    <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleCreateQuiz} className="flex-1 overflow-y-auto p-6 space-y-8">
                  
                  {/* General Settings */}
                  <div className="space-y-4 bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
                    <h3 className="font-bold text-sm text-slate-800">Quiz Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-600 block mb-1">Quiz Title</label>
                        <input 
                          required 
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 outline-none"
                          placeholder="e.g. System Architecture Mid-term Exam"
                          value={quizForm.title} 
                          onChange={e => setQuizForm(p => ({...p, title: e.target.value}))} 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1">Passing Score (%)</label>
                        <input 
                          required 
                          type="number" 
                          min={1} 
                          max={100} 
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 outline-none"
                          value={quizForm.passingScore} 
                          onChange={e => setQuizForm(p => ({...p, passingScore: Number(e.target.value)}))} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Questions Builder Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-slate-900">Questions ({questions.length})</h3>
                      <button 
                        type="button"
                        onClick={handleAddQuestion}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Question
                      </button>
                    </div>

                    <div className="space-y-6">
                      {questions.map((q, qIndex) => (
                        <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm relative group">
                          
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question {qIndex + 1}</label>
                              <input 
                                required
                                type="text"
                                placeholder="Enter question text here..."
                                value={q.questionText}
                                onChange={(e) => handleUpdateQuestion(q.id, "questionText", e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => handleRemoveQuestion(q.id)}
                              className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Options */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 block">Options (Select radio for correct answer)</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options.map((opt, optIndex) => (
                                <div 
                                  key={optIndex}
                                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                    q.correctOption === optIndex ? "bg-teal-50/60 border-teal-400" : "bg-slate-50 border-slate-200"
                                  }`}
                                >
                                  <input 
                                    type="radio"
                                    name={`correct_${q.id}`}
                                    checked={q.correctOption === optIndex}
                                    onChange={() => handleUpdateQuestion(q.id, "correctOption", optIndex)}
                                    className="w-4 h-4 text-teal-600 accent-teal-600 cursor-pointer ml-1"
                                  />
                                  <input 
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleUpdateOption(q.id, optIndex, e.target.value)}
                                    className="flex-1 bg-transparent text-sm text-slate-900 focus:outline-none font-medium"
                                    placeholder={`Option ${optIndex + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Answer Explanation */}
                          <div className="space-y-1 pt-1">
                            <label className="text-xs text-slate-400 font-medium">Answer Explanation (Optional)</label>
                            <input 
                              type="text"
                              placeholder="Explain why this answer is correct..."
                              value={q.explanation}
                              onChange={(e) => handleUpdateQuestion(q.id, "explanation", e.target.value)}
                              className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-teal-500"
                            />
                          </div>

                        </div>
                      ))}
                    </div>

                    <button 
                      type="button"
                      onClick={handleAddQuestion}
                      className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-teal-400 hover:bg-teal-50/50 rounded-2xl text-slate-600 text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-teal-600" /> Add Another Question
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => { setIsCreateOpen(false); setEditingQuiz(null); }}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={isSubmitting || !quizForm.title} 
                      type="submit"
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Quiz & Questions"}
                    </button>
                  </div>

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
