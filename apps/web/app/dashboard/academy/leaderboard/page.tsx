"use client"

import { useApi } from "@/lib/useApi"
import { Trophy, Star, Shield, Crown } from "lucide-react"

export default function LeaderboardPage() {
  const { data, isLoading } = useApi<any>("/academy/leaderboard")

  if (isLoading) return <div className="h-full flex items-center justify-center text-slate-500 font-medium bg-slate-50">Loading Leaderboard...</div>

  const students = data?.data || []
  const top3 = students.slice(0, 3)
  const rest = students.slice(3)

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 p-8 flex items-center justify-between shrink-0 text-white shadow-sm">
        <div>
          <h1 className="text-3xl font-black mb-1 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-300" /> Global Academy Leaderboard
          </h1>
          <p className="text-teal-100 font-medium">Top students ranked by course accomplishment XP and career readiness score.</p>
        </div>
        <div className="hidden md:block">
          <Shield className="w-16 h-16 text-teal-500/40" />
        </div>
      </div>

      <div className="p-8 flex-1 max-w-6xl mx-auto w-full">
        
        {/* Podium (Top 3) */}
        <div className="flex justify-center items-end gap-6 mb-12 pt-6">
          
          {/* Rank 2 - Silver */}
          {top3[1] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <img src={top3[1].user.avatarUrl || `https://ui-avatars.com/api/?name=${top3[1].user.firstName}`} className="w-20 h-20 rounded-full border-4 border-slate-300 object-cover shadow-sm" />
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center font-black text-slate-800 text-xs shadow-xs">2</div>
              </div>
              <div className="text-center">
                <div className="font-black text-slate-900 text-base">{top3[1].user.firstName} {top3[1].user.lastName}</div>
                <div className="text-slate-500 font-bold flex items-center justify-center gap-1 text-xs"><Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {top3[1].xp} XP</div>
              </div>
              <div className="w-28 h-28 bg-slate-200 rounded-t-xl mt-4 border border-slate-300 border-b-0" />
            </div>
          )}

          {/* Rank 1 - Gold */}
          {top3[0] && (
            <div className="flex flex-col items-center z-10">
              <Crown className="w-8 h-8 text-amber-500 mb-1" />
              <div className="relative mb-3">
                <img src={top3[0].user.avatarUrl || `https://ui-avatars.com/api/?name=${top3[0].user.firstName}`} className="w-24 h-24 rounded-full border-4 border-amber-400 object-cover shadow-md" />
                <div className="absolute -bottom-3 -right-2 w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center font-black text-amber-950 shadow-xs text-sm">1</div>
              </div>
              <div className="text-center">
                <div className="font-black text-xl text-slate-900">{top3[0].user.firstName} {top3[0].user.lastName}</div>
                <div className="text-teal-700 font-extrabold flex items-center justify-center gap-1 text-base"><Star className="w-4 h-4 fill-amber-400 text-amber-500" /> {top3[0].xp} XP</div>
              </div>
              <div className="w-32 h-36 bg-amber-100 rounded-t-xl mt-4 border border-amber-300 border-b-0" />
            </div>
          )}

          {/* Rank 3 - Bronze */}
          {top3[2] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <img src={top3[2].user.avatarUrl || `https://ui-avatars.com/api/?name=${top3[2].user.firstName}`} className="w-20 h-20 rounded-full border-4 border-amber-700/60 object-cover shadow-sm" />
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-amber-700 text-white rounded-full flex items-center justify-center font-black text-xs shadow-xs">3</div>
              </div>
              <div className="text-center">
                <div className="font-black text-slate-900 text-base">{top3[2].user.firstName} {top3[2].user.lastName}</div>
                <div className="text-slate-500 font-bold flex items-center justify-center gap-1 text-xs"><Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {top3[2].xp} XP</div>
              </div>
              <div className="w-28 h-20 bg-amber-50 rounded-t-xl mt-4 border border-amber-200 border-b-0" />
            </div>
          )}

        </div>

        {/* The Rest of the List */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden max-w-4xl mx-auto shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 font-extrabold text-slate-600 tracking-wider uppercase text-[11px] flex">
            <div className="w-16 text-center">Rank</div>
            <div className="flex-1">Student</div>
            <div className="w-32 text-right">Score</div>
            <div className="w-32 text-right">XP</div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {rest.map((student: any, index: number) => (
              <div key={student.id} className="p-4 flex items-center hover:bg-slate-50 transition-colors">
                <div className="w-16 text-center font-black text-lg text-slate-400">
                  {index + 4}
                </div>
                <div className="flex-1 flex items-center gap-4">
                  <img src={student.user.avatarUrl || `https://ui-avatars.com/api/?name=${student.user.firstName}`} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  <div>
                    <div className="font-bold text-slate-900 text-base">{student.user.firstName} {student.user.lastName}</div>
                  </div>
                </div>
                <div className="w-32 text-right">
                  <div className="font-bold text-slate-800">{(student.careerScore || 0).toFixed(1)}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Career Score</div>
                </div>
                <div className="w-32 text-right">
                  <div className="font-black text-teal-700 text-base flex items-center justify-end gap-1">
                    {student.xp}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Points</div>
                </div>
              </div>
            ))}
            
            {rest.length === 0 && (
              <div className="p-8 text-center text-slate-500 font-medium">
                No additional students ranked yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
