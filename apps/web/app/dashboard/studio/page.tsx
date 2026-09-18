"use client"

import { motion } from "framer-motion"
import { Users, BookOpen, Star, DollarSign, ArrowUpRight, Plus, Video, Play, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function EducatorDashboard() {
  return (
    <div className="p-8 md:p-12 w-full h-full overflow-y-auto space-y-10 bg-slate-50 text-slate-900">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight mb-2 text-slate-900"
          >
            Welcome back to the Studio
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500"
          >
            Here's what's happening with your courses and students today.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-3 w-full md:w-auto"
        >
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full md:w-auto h-11 items-center shadow-sm">
            <button className="flex-1 md:w-32 py-1.5 px-3 bg-teal-600 text-white rounded-lg text-sm font-semibold shadow-sm transition-all">Campus</button>
            <button className="flex-1 md:w-32 py-1.5 px-3 text-slate-500 hover:text-slate-900 rounded-lg text-sm font-semibold transition-all">Virtual</button>
          </div>
          
          <button className="w-full md:w-auto justify-center px-5 py-3 md:py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 font-semibold text-sm text-slate-800 transition-colors flex items-center gap-2 min-h-[44px] shadow-sm">
            <Video className="w-4 h-4 text-teal-600" /> Go Live
          </button>
          <Link href="/dashboard/studio/courses/builder" className="w-full md:w-auto justify-center px-5 py-3 md:py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-sm min-h-[44px]">
            <Plus className="w-4 h-4" /> New Course
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="1,248" change="+12%" icon={Users} delay={0.1} />
        <StatCard title="Active Courses" value="4" change="+1" icon={BookOpen} delay={0.2} />
        <StatCard title="Average Rating" value="4.8" change="+0.2" icon={Star} delay={0.3} />
        <StatCard title="Monthly Revenue" value="$4,200" change="+8%" icon={DollarSign} delay={0.4} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col - Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pending Reviews / Assignments */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Recent Activity</h1>
              <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mt-1">Real-time Updates</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-xs">
                        UI
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 group-hover:text-teal-600 transition-colors">UI/UX Design Final Project</h4>
                        <p className="text-xs text-slate-500">Submitted by Alex Johnson • 2 hours ago</p>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Top Courses */}
          <section>
             <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Your Courses</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <CourseCard title="Advanced React Patterns" students="420" rating="4.9" revenue="$1,800" status="Published" />
              <CourseCard title="Figma for Developers" students="828" rating="4.7" revenue="$2,400" status="Published" />
            </div>
          </section>

        </div>

        {/* Right Col - Schedule & Tips */}
        <div className="space-y-8">
          
          {/* Upcoming Live Sessions */}
          <section className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900">
              <Video className="w-5 h-5 text-teal-600" /> Upcoming Live
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="p-4 rounded-2xl bg-white border border-teal-100 shadow-sm">
                <div className="text-xs font-bold text-teal-700 mb-1 uppercase tracking-wider">Today, 4:00 PM</div>
                <h4 className="font-semibold mb-3 text-slate-900">Q&A: State Management in React</h4>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm">Join Room</button>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">Edit</button>
                </div>
              </div>
            </div>
          </section>

          {/* AI Assistant Insight */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
              <Star className="w-5 h-5 text-amber-500" /> Smart Insights
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Based on recent quiz results, 40% of your students are struggling with "React Hooks dependencies". 
              Consider adding a supplementary video or a live Q&A session on this topic.
            </p>
            <button className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors">
              Generate Lesson Plan
            </button>
          </section>

        </div>

      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon: Icon, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition-colors group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
        </div>
        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          {change}
        </span>
      </div>
      <div>
        <div className="text-4xl font-bold tracking-tight mb-1 text-slate-900">{value}</div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</div>
      </div>
    </motion.div>
  )
}

function CourseCard({ title, students, rating, revenue, status }: any) {
  return (
    <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-teal-300 transition-all cursor-pointer">
      <div className="aspect-video bg-slate-100 border border-slate-200 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
        <Play className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="font-bold mb-2 text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">{title}</h3>
      
      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
        <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {students}</div>
        <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500" /> {rating}</div>
        <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {status}</div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">This month</span>
        <span className="font-bold text-emerald-600">{revenue}</span>
      </div>
    </div>
  )
}
