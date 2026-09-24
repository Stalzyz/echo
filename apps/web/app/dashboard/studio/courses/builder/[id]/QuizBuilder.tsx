"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, Trash2, CheckCircle2, AlertCircle, HelpCircle, 
  Timer, Award, RotateCcw, Play, Check, X, Sparkles,
  Layers, Shuffle, ChevronRight, Eye
} from "lucide-react"
import { toast } from "sonner"

export interface QuizQuestion {
  id: string
  question: string
  type: "MCQ" | "TRUE_FALSE" | "SHORT"
  options: string[]
  correctAnswer: string | number // index or string
  explanation?: string
  points: number
}

export interface QuizData {
  title: string
  description?: string
  passPercentage: number
  timeLimitMinutes: number
  maxAttempts: number
  shuffleQuestions: boolean
  questions: QuizQuestion[]
}

interface QuizBuilderProps {
  initialData?: string | null
  onSave: (data: QuizData) => void
  isSaving?: boolean
}

export function QuizBuilder({ initialData, onSave, isSaving }: QuizBuilderProps) {
  const [quizData, setQuizData] = useState<QuizData>(() => {
    if (initialData) {
      try {
        const parsed = JSON.parse(initialData)
        if (parsed && Array.isArray(parsed.questions)) {
          return parsed
        }
      } catch {}
    }
    return {
      title: "Module Mastery Quiz",
      description: "Test your understanding of core concepts taught in this module.",
      passPercentage: 70,
      timeLimitMinutes: 15,
      maxAttempts: 3,
      shuffleQuestions: false,
      questions: [
        {
          id: "q1",
          question: "What is the primary benefit of responsive web design?",
          type: "MCQ",
          options: [
            "It ensures websites adapt seamlessly to any screen size and device",
            "It eliminates the need for CSS",
            "It makes JavaScript execute twice as fast",
            "It automatically optimizes database queries"
          ],
          correctAnswer: 0,
          explanation: "Responsive web design uses flexible grids and media queries to adapt layouts to all viewports.",
          points: 10
        },
        {
          id: "q2",
          question: "TypeScript is a statically-typed superset of JavaScript.",
          type: "TRUE_FALSE",
          options: ["True", "False"],
          correctAnswer: 0,
          explanation: "TypeScript adds optional static types and class-based object-oriented programming to JavaScript.",
          points: 10
        }
      ]
    }
  })

  const [previewMode, setPreviewMode] = useState(false)
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // Save changes whenever quizData changes
  const handleDataChange = (updated: QuizData) => {
    setQuizData(updated)
    onSave(updated)
  }

  const handleAddQuestion = (type: "MCQ" | "TRUE_FALSE" | "SHORT" = "MCQ") => {
    const newQ: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: type === "TRUE_FALSE" ? "State whether this statement is true or false." : "Enter your question here...",
      type,
      options: type === "TRUE_FALSE" ? ["True", "False"] : ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "",
      points: 10
    }
    const updated = {
      ...quizData,
      questions: [...quizData.questions, newQ]
    }
    handleDataChange(updated)
    setActiveQuestionIdx(updated.questions.length - 1)
    toast.success("Question added")
  }

  const handleDeleteQuestion = (idx: number) => {
    if (quizData.questions.length <= 1) {
      toast.error("Quiz must have at least one question")
      return
    }
    const updated = {
      ...quizData,
      questions: quizData.questions.filter((_, i) => i !== idx)
    }
    handleDataChange(updated)
    setActiveQuestionIdx(Math.max(0, idx - 1))
  }

  const handleUpdateQuestion = (idx: number, patch: Partial<QuizQuestion>) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[idx] = { ...updatedQuestions[idx], ...patch }
    handleDataChange({ ...quizData, questions: updatedQuestions })
  }

  const totalPoints = quizData.questions.reduce((acc, q) => acc + (q.points || 0), 0)

  // Preview Quiz Calculation
  const calculateScore = () => {
    let earned = 0
    quizData.questions.forEach((q) => {
      const ans = userAnswers[q.id]
      if (q.type === "MCQ" || q.type === "TRUE_FALSE") {
        if (ans === q.correctAnswer) {
          earned += q.points
        }
      } else if (q.type === "SHORT") {
        if (typeof ans === "string" && ans.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
          earned += q.points
        }
      }
    })
    return {
      earned,
      total: totalPoints,
      percentage: totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0,
      passed: totalPoints > 0 ? Math.round((earned / totalPoints) * 100) >= quizData.passPercentage : false
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
              Interactive Assessment
            </span>
            <span className="text-xs font-medium text-slate-400">
              {quizData.questions.length} Questions • {totalPoints} Total Points
            </span>
          </div>
          <input
            type="text"
            value={quizData.title}
            onChange={(e) => handleDataChange({ ...quizData, title: e.target.value })}
            className="text-xl font-bold text-slate-900 bg-transparent focus:outline-none border-b border-transparent focus:border-teal-500 mt-1 w-full"
            placeholder="Assessment Title"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => {
              setPreviewMode(!previewMode)
              setQuizSubmitted(false)
              setUserAnswers({})
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              previewMode 
                ? "bg-teal-600 text-white border-teal-600 shadow-xs" 
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
            }`}
          >
            {previewMode ? <RotateCcw className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {previewMode ? "Exit Test Mode" : "Preview & Test Quiz"}
          </button>
        </div>
      </div>

      {previewMode ? (
        /* LIVE TEST PREVIEW MODE */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">{quizData.title}</h3>
              <p className="text-xs text-slate-500">{quizData.description || "Answer all questions to check your knowledge."}</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1 text-slate-600">
                <Timer className="w-4 h-4 text-teal-600" /> {quizData.timeLimitMinutes} Mins
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Award className="w-4 h-4 text-amber-500" /> Pass: {quizData.passPercentage}%
              </span>
            </div>
          </div>

          {!quizSubmitted ? (
            <div className="space-y-8">
              {quizData.questions.map((q, qIndex) => (
                <div key={q.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      {qIndex + 1}. {q.question}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200">
                      {q.points} pts
                    </span>
                  </div>

                  {q.type === "MCQ" || q.type === "TRUE_FALSE" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[q.id] === optIdx
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setUserAnswers({ ...userAnswers, [q.id]: optIdx })}
                            className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-xs"
                                : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                            }`}
                          >
                            <span>{opt}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-teal-600 bg-teal-600 text-white" : "border-slate-300"
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Type your answer here..."
                      value={userAnswers[q.id] || ""}
                      onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setQuizSubmitted(true)}
                  className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-sm flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Assessment
                </button>
              </div>
            </div>
          ) : (
            /* SCORE RESULT SCREEN */
            (() => {
              const res = calculateScore()
              return (
                <div className="text-center py-8 space-y-6">
                  <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${
                    res.passed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                  }`}>
                    {res.passed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {res.passed ? "🎉 Congratulations! You Passed!" : "Keep Practicing!"}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      You scored <strong>{res.earned} / {res.total} points ({res.percentage}%)</strong>. Passing threshold is {quizData.passPercentage}%.
                    </p>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizSubmitted(false)
                        setUserAnswers({})
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(false)}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      Return to Builder
                    </button>
                  </div>
                </div>
              )
            })()
          )}
        </div>
      ) : (
        /* QUIZ EDITOR MODE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Questions List */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" /> Questions ({quizData.questions.length})
              </h4>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
              {quizData.questions.map((q, idx) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setActiveQuestionIdx(idx)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    activeQuestionIdx === idx
                      ? "bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-xs"
                      : "bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-5 h-5 rounded-full bg-white text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{q.question || "Untitled Question"}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono shrink-0">{q.type}</span>
                </button>
              ))}
            </div>

            {/* Add Question Controls */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleAddQuestion("MCQ")}
                className="w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-teal-200"
              >
                <Plus className="w-3.5 h-3.5 text-teal-600" /> Add Multiple Choice (MCQ)
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleAddQuestion("TRUE_FALSE")}
                  className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" /> True / False
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion("SHORT")}
                  className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Short Answer
                </button>
              </div>
            </div>
          </div>

          {/* Center Column: Active Question Editor */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            {(() => {
              const q = quizData.questions[activeQuestionIdx]
              if (!q) return null

              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold">
                        Question {activeQuestionIdx + 1} of {quizData.questions.length}
                      </span>
                      <span className="text-xs text-slate-400">• {q.type}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <span>Points:</span>
                        <input
                          type="number"
                          value={q.points}
                          onChange={(e) => handleUpdateQuestion(activeQuestionIdx, { points: Number(e.target.value) })}
                          className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-slate-900"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(activeQuestionIdx)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Question Title / Prompt</label>
                    <textarea
                      rows={2}
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(activeQuestionIdx, { question: e.target.value })}
                      placeholder="e.g. Which hook is used for side effects in React?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                    />
                  </div>

                  {/* Options Editor */}
                  {q.type === "MCQ" && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Answer Choices</span>
                        <span className="text-[11px] text-teal-600 font-normal">Select the green checkmark for the correct answer</span>
                      </label>
                      <div className="space-y-2.5">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = q.correctAnswer === optIdx
                          return (
                            <div key={optIdx} className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuestion(activeQuestionIdx, { correctAnswer: optIdx })}
                                className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                                  isCorrect 
                                    ? "bg-emerald-500 border-emerald-500 text-white shadow-xs" 
                                    : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-400"
                                }`}
                                title="Set as correct answer"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updatedOpts = [...q.options]
                                  updatedOpts[optIdx] = e.target.value
                                  handleUpdateQuestion(activeQuestionIdx, { options: updatedOpts })
                                }}
                                placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                className={`flex-1 bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none ${
                                  isCorrect ? "border-emerald-300 bg-emerald-50/20 font-medium" : "border-slate-200 focus:border-teal-500"
                                }`}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {q.type === "TRUE_FALSE" && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-700">Correct Answer</label>
                      <div className="grid grid-cols-2 gap-3">
                        {["True", "False"].map((val, idx) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleUpdateQuestion(activeQuestionIdx, { correctAnswer: idx })}
                            className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                              q.correctAnswer === idx
                                ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {q.type === "SHORT" && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">Exact Expected Answer</label>
                      <input
                        type="text"
                        value={String(q.correctAnswer || "")}
                        onChange={(e) => handleUpdateQuestion(activeQuestionIdx, { correctAnswer: e.target.value })}
                        placeholder="Expected text match (case-insensitive)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  )}

                  {/* Explanation for students */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-teal-600" /> Explanation / Learning Rationale
                    </label>
                    <input
                      type="text"
                      value={q.explanation || ""}
                      onChange={(e) => handleUpdateQuestion(activeQuestionIdx, { explanation: e.target.value })}
                      placeholder="Why is this answer correct? Displayed to students after answering."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Quiz Settings / Thresholds */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Pass Percentage</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={quizData.passPercentage}
                          onChange={(e) => handleDataChange({ ...quizData, passPercentage: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 text-center"
                        />
                        <span className="text-xs font-bold text-slate-500">%</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Time Limit</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={quizData.timeLimitMinutes}
                          onChange={(e) => handleDataChange({ ...quizData, timeLimitMinutes: Number(e.target.value) })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 text-center"
                        />
                        <span className="text-xs font-bold text-slate-500">Mins</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Max Attempts</label>
                      <input
                        type="number"
                        value={quizData.maxAttempts}
                        onChange={(e) => handleDataChange({ ...quizData, maxAttempts: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 text-center"
                      />
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
