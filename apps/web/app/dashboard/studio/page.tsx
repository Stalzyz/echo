"use client"

import { useState } from  "react"
import { motion } from  "framer-motion"
import { Users, BookOpen, Star, IndianRupee, ArrowUpRight, Plus, Video, Play, CheckCircle2, Clock, Info, Send, Laptop, Landmark, LayoutDashboard, ArrowLeft } from  "lucide-react"
import Link from "next/link"
import { toast } from  "sonner"
import { useApi } from  "@/lib/useApi"

export default function EducatorDashboard() {
  const [studioMode, setStudioMode] = useState<'CAMPUS' | 'VIRTUAL'>('CAMPUS')

  // Fetch live batches and courses
  const { data: batchesRes, isLoading: isLoadingBatches } = useApi<any>("/academy/batches")
  const rawBatches = Array.isArray(batchesRes?.data) ? batchesRes.data : Array.isArray(batchesRes) ? batchesRes : []

  // Filter courses based on campus vs virtual
  const filteredCourses = rawBatches.filter((b: any) => {
    if (studioMode === 'CAMPUS') {
      return !b.deliveryMode || b.deliveryMode === 'CAMPUS' || b.deliveryMode === 'ONSITE'
    } else {
      return b.deliveryMode === 'VIRTUAL' || b.deliveryMode === 'ONLINE' || b.deliveryMode === 'REMOTE'
    }
  })

  // Calculate live stats
  const totalStudents = rawBatches.reduce((acc: number, b: any) => acc + (b.studentsCount || b._count?.enrollments || 0), 0)
  const totalRevenue = rawBatches.reduce((acc: number, b: any) => acc + ((b.course?.fee || b.fee || 0) * (b.studentsCount || b._count?.enrollments || 0)), 0)

  const handleSubmitForApproval = (id: string, title: string) => {
    toast.success(`Course "${title}" submitted for Academy Admin approval!`)
  }

  const toggleStudioMode = (mode: 'CAMPUS' | 'VIRTUAL') => {
    setStudioMode(mode)
    toast.success(`Switched studio view to ${mode === 'VIRTUAL' ? 'Virtual Online Learning' : 'Onsite Campus Studio'}`)
  }

  return (
    <div className="p-8 md:p-12 w-full h-full overflow-y-auto space-y-10 bg-slate-50 text-slate-900 custom-scrollbar">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-teal-700 shadow-2xs transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
              <span>← Go to Admin Dashboard</span>
            </Link>

            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
              studioMode === 'VIRTUAL' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-teal-100 text-teal-800 border border-teal-200'
            }`}>
              {studioMode === 'VIRTUAL' ? <Laptop className="w-3.5 h-3.5" /> : <Landmark className="w-3.5 h-3.5" />}
              {studioMode === 'VIRTUAL' ? 'VIRTUAL ONLINE STUDIO MODE' : 'ONSITE CAMPUS STUDIO MODE'}
            </span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-slate-900"
          >
            Teaching Studio
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-sm font-medium"
          >
            Create curricula, manage course modules, configure pricing, and review students.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-3 w-full md:w-auto"
        >
          {/* Campus vs Virtual Toggle Button */}
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full md:w-auto h-11 items-center shadow-xs">
            <button 
              type="button"
              onClick={() => toggleStudioMode('CAMPUS')}
              className={`flex-1 md:w-32 py-1.5 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                studioMode === 'CAMPUS' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" /> Campus
            </button>
            <button 
              type="button"
              onClick={() => toggleStudioMode('VIRTUAL')}
              className={`flex-1 md:w-32 py-1.5 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                studioMode === 'VIRTUAL' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Virtual
            </button>
          </div>
          
          <Link href="/dashboard/studio/live" className="w-full md:w-auto justify-center px-5 py-3 md:py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 font-bold text-xs text-slate-800 transition-colors flex items-center gap-2 min-h-[44px] shadow-xs">
            <Video className="w-4 h-4 text-teal-600" /> Go Live Session
          </Link>
          <Link href="/dashboard/studio/courses/builder" className="w-full md:w-auto justify-center px-5 py-3 md:py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs min-h-[44px]">
            <Plus className="w-4 h-4" /> New Course Draft
          </Link>
        </motion.div>
      </div>

      {/* EDUCATOR POLICY NOTICE BANNER */}
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs text-indigo-900">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>
            <strong>Educator Course Publishing Policy:</strong> Educators can build and edit courses freely. Publishing a course to the public student catalog requires Academy Admin approval.
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={studioMode === 'CAMPUS' ? "Campus Onsite Students" : "Virtual Online Students"} 
          value={totalStudents.toString()} 
          change={`${filteredCourses.length} active`} 
          icon={Users} 
          delay={0.1} 
        />
        <StatCard 
          title="Studio Courses" 
          value={filteredCourses.length.toString()} 
          change="+0 new" 
          icon={BookOpen} 
          delay={0.2} 
        />
        <StatCard 
          title="Average Rating" 
          value={filteredCourses.length > 0 ? "5.0" : "N/A"} 
          change="Verified" 
          icon={Star} 
          delay={0.3} 
        />
        <StatCard 
          title="Total Course Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          change="Real-time" 
          icon={IndianRupee} 
          delay={0.4} 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col - Activity & Courses */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Educator Courses List */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  {studioMode === 'CAMPUS' ? 'Onsite Campus Courses' : 'Virtual Online Courses'}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  studioMode === 'VIRTUAL' ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  {studioMode}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full font-mono">
                {filteredCourses.length} Courses Total
              </span>
            </div>
            
            {filteredCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCourses.map((course: any) => (
                  <CourseCard 
                    key={course.id}
                    course={{
                      id: course.id,
                      title: course.course?.name || course.name || "Untitled Course",
                      students: course.studentsCount || course._count?.enrollments || 0,
                      rating: "5.0",
                      revenue: `₹${((course.course?.fee || course.fee || 0) * (course.studentsCount || 0)).toLocaleString()}`,
                      status: course.status || "PUBLISHED"
                    }}
                    onSubmitApproval={() => handleSubmitForApproval(course.id, course.course?.name || course.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-extrabold text-base text-slate-800 mb-1">No {studioMode.toLowerCase()} courses found</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">Get started by building your first curriculum draft in the course builder.</p>
                <Link 
                  href="/dashboard/studio/courses/builder"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Create Course Draft
                </Link>
              </div>
            )}
          </section>

          {/* Activity Feed */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black tracking-tight text-slate-900">Recent Studio Activity</h2>
              <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mt-1">Live Updates</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs text-center py-10">
              <CheckCircle2 className="w-8 h-8 text-teal-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Studio is clean & ready for your courses.</p>
              <p className="text-xs text-slate-400 mt-1">Student submissions and project reviews will stream here automatically.</p>
            </div>
          </section>

        </div>

        {/* Right Col - Schedule & Insights */}
        <div className="space-y-8">
          
          {/* Upcoming Live Sessions */}
          <section className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-3xl p-6 shadow-xs relative overflow-hidden">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
              <Video className="w-5 h-5 text-teal-600" /> Live Studio Sessions
            </h3>
            
            <div className="p-4 rounded-2xl bg-white border border-teal-100 shadow-xs text-center py-6">
              <p className="text-xs text-slate-500 mb-3">No live interactive sessions scheduled for today.</p>
              <Link href="/dashboard/studio/live" className="inline-block py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs">
                Schedule Live Class
              </Link>
            </div>
          </section>

          {/* AI Assistant Insight */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-slate-900">
              <Star className="w-5 h-5 text-amber-500" /> Studio Assistant
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Use the Teaching Studio to design bite-sized interactive modules, generate automated quizzes, and evaluate student submissions.
            </p>
            <Link 
              href="/dashboard/studio/courses/builder"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              Open Course Builder
            </Link>
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
      className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition-colors group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
        </div>
        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
          {change}
        </span>
      </div>
      <div>
        <div className="text-3xl font-black tracking-tight mb-1 text-slate-900">{value}</div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</div>
      </div>
    </motion.div>
  )
}

function CourseCard({ course, onSubmitApproval }: any) {
  return (
    <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between">
      <div>
        <div className="aspect-video bg-slate-100 border border-slate-200 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center">
          <Play className="w-8 h-8 text-slate-400" />
          
          <div className="absolute top-3 right-3">
            {course.status === "PUBLISHED" && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Published
              </span>
            )}
            {course.status === "PENDING_APPROVAL" && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                <Clock className="w-3 h-3" /> Pending Approval
              </span>
            )}
            {course.status === "DRAFT" && (
              <span className="px-2.5 py-1 rounded-full bg-slate-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                Draft
              </span>
            )}
          </div>
        </div>
        
        <h3 className="font-extrabold mb-2 text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">{course.title}</h3>
        
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
          <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {course.students} students</div>
          <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500" /> {course.rating}</div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Revenue</span>
          <span className="font-extrabold text-emerald-600 font-mono">{course.revenue}</span>
        </div>

        {course.status === "DRAFT" && (
          <button
            onClick={onSubmitApproval}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Submit for Admin Approval
          </button>
        )}
      </div>
    </div>
  )
}
