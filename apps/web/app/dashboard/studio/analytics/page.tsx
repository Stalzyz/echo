"use client"

import { useState } from  "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from  "recharts"
import { TrendingUp, Users, BookOpen, DollarSign, ArrowUpRight, ArrowDownRight } from  "lucide-react"

const monthlyRevenue = [
  { name: "Jan", revenue: 4000, students: 240 },
  { name: "Feb", revenue: 3000, students: 139 },
  { name: "Mar", revenue: 2000, students: 980 },
  { name: "Apr", revenue: 2780, students: 390 },
  { name: "May", revenue: 1890, students: 480 },
  { name: "Jun", revenue: 2390, students: 380 },
  { name: "Jul", revenue: 3490, students: 430 },
]

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("6m")

  return (
    <div className="flex-1 overflow-y-auto h-full bg-slate-50 text-slate-900">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics & Revenue</h1>
            <p className="text-slate-500 mt-1">Track your course performance and earnings.</p>
          </div>
          <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
            {['1w', '1m', '3m', '6m', '1y', 'all'].map((t) => (
              <button 
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                  timeframe === t ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex items-center gap-1 text-emerald-700 text-sm font-bold">
                <ArrowUpRight className="w-4 h-4" />
                12.5%
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Total Revenue</h3>
            <div className="text-3xl font-bold text-slate-900">$24,590.00</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex items-center gap-1 text-teal-700 text-sm font-bold">
                <ArrowUpRight className="w-4 h-4" />
                8.2%
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Active Students</h3>
            <div className="text-3xl font-bold text-slate-900">1,492</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex items-center gap-1 text-amber-700 text-sm font-bold">
                <ArrowDownRight className="w-4 h-4" />
                2.1%
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Course Enrollments</h3>
            <div className="text-3xl font-bold text-slate-900">3,240</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex items-center gap-1 text-emerald-700 text-sm font-bold">
                <ArrowUpRight className="w-4 h-4" />
                18.4%
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Completion Rate</h3>
            <div className="text-3xl font-bold text-slate-900">68.2%</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Overview</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a' }}
                    itemStyle={{ color: '#0d9488' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Student Enrollments</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a' }}
                    itemStyle={{ color: '#0d9488' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="students" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
