"use client"

import React, { useState } from "react"
import { motion } from  "framer-motion"
import { Award, AlertCircle, CheckCircle2, Clock, Check, HelpCircle, RotateCcw, ArrowRight } from  "lucide-react"

interface StudentQuizViewProps {
  quizDataRaw?: string | null
  title: string
  onPassed?: () => void
}

export function StudentQuizView({ quizDataRaw, title, onPassed }: StudentQuizViewProps) {
  const quiz = (() => {
    if (quizDataRaw) {
      try {
        const parsed = JSON.parse(quizDataRaw)
        if (parsed && Array.isArray(parsed.questions)) {
          return parsed
        }
      } catch {}
    }
    return {
      title: title || "Lesson Assessment",
      passPercentage: 70,
      timeLimitMinutes: 10,
      questions: [
        {
          id: "q1",
          question: "What is the primary advantage of Next.js App Router for frontend development?",
          options: [
            "React Server Components and streaming architecture",
            "It deletes all client-side JavaScript",
            "It requires zero CSS files",
            "It only runs on Apache servers"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          id: "q2",
          question: "TypeScript provides compile-time type validation for safer codebases.",
          options: ["True", "False"],
          correctAnswer: 0,
          points: 10
        }
      ]
    }
  })()

  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)

  const totalPoints = quiz.questions.reduce((acc: number, q: any) => acc + (q.points || 10), 0)

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qId]: optIdx }))
  }

  const score = (() => {
    let earned = 0
    quiz.questions.forEach((q: any) => {
      const userAns = answers[q.id]
      if (userAns === q.correctAnswer) {
        earned += (q.points || 10)
      }
    })
    const percentage = totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0
    const passed = percentage >= (quiz.passPercentage || 70)
    return { earned, total: totalPoints, percentage, passed }
  })()

  const handleSubmit = () => {
    setSubmitted(true)
    if (score.passed && onPassed) {
      onPassed()
    }
  }

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between custom-scrollbar">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{quiz.title || title}</h3>
              <p className="text-xs text-slate-400">{quiz.questions.length} Questions • Passing: {quiz.passPercentage || 70}%</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-teal-400 border border-slate-700">
            {quiz.timeLimitMinutes || 10} Mins
          </span>
        </div>

        {!submitted ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            {quiz.questions.map((q: any, qIdx: number) => (
              <div key={q.id || qIdx} className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-white">
                    {qIdx + 1}. {q.question}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {q.points || 10} pts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isSelected = answers[q.id] === optIdx
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-teal-600/30 border-teal-500 text-teal-200 font-bold shadow-xs"
                            : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/60"
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isSelected ? "border-teal-400 bg-teal-500 text-white" : "border-slate-600"
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* RESULT SCREEN */
          <div className="max-w-md mx-auto py-8 text-center space-y-6">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center ${
              score.passed ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}>
              {score.passed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">
                {score.passed ? "Assessment Passed! 🎓" : "Review & Try Again"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                You scored <strong className="text-white">{score.earned} / {score.total} points ({score.percentage}%)</strong>.
                Required threshold: {quiz.passPercentage || 70}%.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false)
                  setAnswers({})
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>

      {!submitted && (
        <div className="max-w-2xl mx-auto w-full pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Submit Answers
          </button>
        </div>
      )}
    </div>
  )
}
