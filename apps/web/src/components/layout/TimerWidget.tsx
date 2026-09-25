"use client"

import { useState, useEffect } from  "react"
import { Play, Square, Clock } from  "lucide-react"

export function TimerWidget() {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval: any
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isRunning, seconds])

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleToggle = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setSeconds(0)
  }

  return (
    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-xs">
      <div className="flex items-center gap-1.5 px-2">
        <Clock className={`w-3.5 h-3.5 ${isRunning ? 'text-teal-600 animate-pulse' : 'text-slate-400'}`} />
        <span className={`text-xs font-mono font-bold ${isRunning ? 'text-teal-700' : 'text-slate-600'}`}>
          {formatTime(seconds)}
        </span>
      </div>
      <button 
        onClick={handleToggle}
        className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${isRunning ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-teal-100 text-teal-800 hover:bg-teal-200'}`}
      >
        {isRunning ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
      </button>
      {seconds > 0 && !isRunning && (
        <button 
          onClick={handleReset}
          className="w-6 h-6 flex items-center justify-center rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
          title="Reset Timer"
        >
          <Square className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
