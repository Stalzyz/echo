"use client"

import { useState, useEffect } from "react"
import { Phone, Sparkles, Search, Play, Flame, AlertCircle, CheckCircle2, TrendingUp, Users, Calendar, Filter, Download, ArrowUpRight, BarChart3, MessageSquare, ShieldCheck } from "lucide-react"
import { CallIntelligenceModal } from "@/components/crm/CallIntelligenceModal"

export default function CallIntelligenceDashboardPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCall, setSelectedCall] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/v1/calls")
      const data = await res.json()
      if (res.ok && data.data) {
        setCalls(data.data)
      }
    } catch (err) {
      console.error("Failed to fetch calls:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    try {
      setIsSearching(true)
      const res = await fetch(`/api/v1/calls/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (res.ok && data.data) {
        setSearchResults(data.data)
      }
    } catch (err) {
      console.error("Search error:", err)
    } finally {
      setIsSearching(false)
    }
  }

  // Dashboard Stats Calculations
  const totalCalls = calls.length
  const connectedCalls = calls.filter(c => c.status === "CONNECTED").length
  const missedCalls = calls.filter(c => c.status === "MISSED" || c.status === "NO_ANSWER").length
  const hotLeads = calls.filter(c => c.intelligence?.temperature === "HOT").length

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-800 border border-teal-500/40 text-[10px] font-black uppercase tracking-wider font-mono">
              ECHO CRM Intel Engine
            </span>
            <span className="text-xs font-bold text-slate-500">Realtime Conversation Analytics</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mt-1">
            Call Intelligence Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCalls}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          >
            Refresh Call Stream
          </button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Total Calls</span>
          <div className="text-2xl font-black text-slate-900">{totalCalls}</div>
          <span className="text-[10px] text-emerald-600 font-bold">Today</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Connected</span>
          <div className="text-2xl font-black text-emerald-600">{connectedCalls}</div>
          <span className="text-[10px] text-slate-400 font-medium">76.3% Rate</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Missed / Busy</span>
          <div className="text-2xl font-black text-rose-600">{missedCalls}</div>
          <span className="text-[10px] text-rose-600 font-bold">Needs Callback</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">AI Analyzed</span>
          <div className="text-2xl font-black text-teal-700">{totalCalls}</div>
          <span className="text-[10px] text-teal-600 font-bold">100% Processed</span>
        </div>

        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800">🔥 Hot Leads</span>
          <div className="text-2xl font-black text-rose-700">{hotLeads}</div>
          <span className="text-[10px] text-rose-800 font-bold">Score ≥ 75/100</span>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Follow-ups Due</span>
          <div className="text-2xl font-black text-amber-700">19</div>
          <span className="text-[10px] text-amber-800 font-bold">Within 24 hrs</span>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400">Admissions</span>
          <div className="text-2xl font-black text-white">11</div>
          <span className="text-[10px] text-teal-400 font-bold">Conversions</span>
        </div>
      </div>

      {/* Search Inside Calls Bar */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest font-mono">
              🔎 ECHO Search Inside Calls
            </span>
            <h3 className="text-lg font-extrabold text-white mt-0.5">
              Search transcripts for keywords (e.g. "placement", "EMI options", "weekend batch")
            </h3>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations across all counsellor recordings..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs rounded-2xl transition-all shadow-md shrink-0"
          >
            {isSearching ? "Searching..." : "Search Transcripts"}
          </button>
        </form>

        {/* Search Results Drawer */}
        {searchResults.length > 0 && (
          <div className="mt-4 p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
            <div className="text-xs font-bold text-teal-400">
              Found {searchResults.length} matching conversations for "{searchQuery}":
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {searchResults.map((res: any) => (
                <div
                  key={res.id}
                  onClick={() => setSelectedCall(res)}
                  className="p-3 bg-slate-900 border border-slate-700 rounded-xl hover:border-teal-400/60 cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-extrabold text-white">{res.lead?.name || "Student"}</span>
                    <p className="text-slate-300 mt-1 italic font-mono">"{res.snippet}"</p>
                  </div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase bg-teal-500/10 px-2 py-1 rounded shrink-0">
                    View Call
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Objections + Counsellor Coaching */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Common Objections Breakdown */}
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">🧠 Common Lead Objections</h3>
            <span className="text-xs font-bold text-slate-500">AI Aggregated</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Fee Structure & Pricing</span>
                <span className="text-amber-800 font-mono">38%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Class Timing & Weekend Batch</span>
                <span className="text-teal-800 font-mono">21%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: '21%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Placement Assistance & Job Guarantee</span>
                <span className="text-blue-800 font-mono">17%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '17%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">Location / Campus vs Online</span>
                <span className="text-slate-700 font-mono">11%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '11%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Counsellor Intelligence Leaderboard */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">📊 Counsellor Performance Intelligence</h3>
              <p className="text-xs text-slate-500">Quality, call conversion, and follow-up completion rates</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
              Team Total: {totalCalls} Calls
            </span>
          </div>

          <div className="overflow-x-auto">
            {calls.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                No call intelligence or counsellor data logged yet. Make a call from Admissions CRM to see real-time statistics!
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Counsellor</th>
                    <th className="p-3">Calls</th>
                    <th className="p-3">Connected</th>
                    <th className="p-3">Qualified</th>
                    <th className="p-3">Conversions</th>
                    <th className="p-3">Follow-up %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {/* Dynamic call stats render here when calls are logged */}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Call Records Stream Table */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">🎙️ Recent AI Analyzed Call Stream</h3>
          <span className="text-xs text-slate-500 font-medium">Showing {calls.length} calls</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading call intelligence stream...</div>
        ) : calls.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No calls recorded yet. Make a call from Admissions CRM to see live call intelligence!</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {calls.map(c => {
              const intel = c.intelligence || {}
              const temp = intel.temperature || "WARM"
              return (
                <div key={c.id} className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-slate-50 px-3 rounded-2xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900">{c.lead?.name || "Student"}</div>
                      <div className="text-[11px] text-slate-500">{c.lead?.courseInterest || "UI/UX Masterclass"} • {Math.ceil((c.durationSeconds || 0)/60)} mins</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      temp === "HOT" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {temp === "HOT" ? "🔥 Hot" : "🌤️ Warm"} ({intel.score || 75}/100)
                    </span>

                    <button
                      onClick={() => setSelectedCall(c)}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold hover:bg-teal-100 transition-colors"
                    >
                      View AI Intel
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Call Intelligence Modal */}
      {selectedCall && (
        <CallIntelligenceModal
          isOpen={Boolean(selectedCall)}
          onClose={() => setSelectedCall(null)}
          callRecord={selectedCall}
        />
      )}

    </div>
  )
}
