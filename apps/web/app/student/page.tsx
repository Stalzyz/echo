"use client"

import { useState } from "react"
import { useApi } from "@/lib/useApi"
import Link from "next/link"
import {
  BookOpen, PlayCircle, Clock, CheckCircle2, Award, 
  Search, FileText, ArrowRight, User, GraduationCap, 
  BarChart2, Calendar, Sparkles, Star, ChevronRight
} from "lucide-react"

export default function StudentDashboardPage() {
  const { data: coursesData, isLoading } = useApi<any>("/lms/courses")
  const [searchQuery, setSearchQuery] = useState("")

  const enrolledCourses = [
    {
      id: "course-1",
      title: "Full-Stack System Architecture & Cloud Masterclass",
      category: "Software Engineering",
      progress: 65,
      completedLessons: 12,
      totalLessons: 18,
      instructor: "Echo Faculty Team",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
      nextLesson: "Lesson 2.1: Building Scalable Microservices"
    },
    {
      id: "course-2",
      title: "UI/UX Design Systems & Product Strategy",
      category: "Design & UX",
      progress: 40,
      completedLessons: 6,
      totalLessons: 15,
      instructor: "Alex Rivera",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80",
      nextLesson: "Lesson 1.4: Design Tokens & Typography Scale"
    },
    {
      id: "course-3",
      title: "Data Structures & Algorithmic Problem Solving",
      category: "Computer Science",
      progress: 90,
      completedLessons: 18,
      totalLessons: 20,
      instructor: "Dr. Sarah Jenkins",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
      nextLesson: "Lesson 4.2: Graph Algorithms & Dynamic Programming"
    }
  ]

  const filteredCourses = enrolledCourses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. TOP NAVBAR */}
      <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-mono text-sm font-bold flex items-center justify-center">
            E
          </div>
          <div>
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest block font-mono">Echo Student Portal</span>
            <h1 className="text-sm font-bold text-slate-900">Learning Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-all w-60"
            />
          </div>

          <Link 
            href="/student/assignments" 
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-teal-600" /> Assignments
          </Link>

          <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 text-teal-800 font-bold text-xs flex items-center justify-center">
            S
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        
        {/* HERO WELCOME BANNER */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-bold text-teal-700 uppercase font-mono">
              Academic Status: Active Student
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back to Echo Learning!
            </h2>
            <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
              You have completed 3 lessons this week. Keep up the momentum to earn your course certificate.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-5 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-700 font-mono">65%</div>
              <div className="text-[10px] text-slate-500 font-medium uppercase font-mono">Overall Progress</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <Link 
              href="/student/learn/course-1" 
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              Resume Learning <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ENROLLED COURSES SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Enrolled Courses</h3>
              <p className="text-xs text-slate-500">Pick up right where you left off</p>
            </div>
            <span className="text-xs font-bold text-teal-700 font-mono bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              {filteredCourses.length} Courses
            </span>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div 
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Course Image */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white font-mono text-[10px] font-bold rounded-lg">
                    {course.category}
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {course.instructor}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 font-medium">
                        {course.completedLessons}/{course.totalLessons} Lessons
                      </span>
                      <span className="font-bold text-teal-700">{course.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-600 rounded-full transition-all duration-300" 
                        style={{ width: `${course.progress}%` }} 
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link 
                    href={`/student/learn/${course.id}`}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:bg-teal-600"
                  >
                    <PlayCircle className="w-4 h-4" /> Go to Learning Studio
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
