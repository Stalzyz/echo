"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  Building, GraduationCap, Video, ShieldCheck, 
  TrendingUp, Users, DollarSign, BookOpen, Star, 
  Plus, ArrowRight, ExternalLink, Activity, CheckCircle2, 
  Settings, Layers, ChevronRight, FileText, Zap, Flame,
  Search, PlayCircle, Clock
} from "lucide-react"
import { useApi } from "@/lib/useApi"

export default function AllInOneUnifiedDashboardPage() {
  const { data: session } = useSession()
  const [activeWorkspace, setActiveWorkspace] = useState<"academy" | "student" | "educator" | "superadmin">("academy")

  // API Data
  const { data: overview } = useApi<any>("/analytics/overview")
  const { data: revenueData } = useApi<any>("/analytics/revenue?months=8")

  const revenue = overview?.agency?.revenueCollected || 42000
  const students = overview?.academy?.totalStudents || 1248
  const activeProjects = overview?.agency?.activeProjects || 14

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* 1. MASTER SINGLE WINDOW WORKSPACE HEADER */}
      <header className="bg-slate-900 text-white px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-mono text-sm font-bold flex items-center justify-center">
            E
          </div>
          <div>
            <div className="text-[10px] font-bold text-teal-400 font-mono uppercase tracking-widest">
              Echo All-In-One Unified Command Center
            </div>
            <h1 className="text-sm font-bold text-white">Single-Window Workspace Switcher</h1>
          </div>
        </div>

        {/* Master Workspace Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveWorkspace("academy")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeWorkspace === "academy"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-4 h-4 text-teal-400" />
            <span>Academy Admin</span>
          </button>

          <button
            onClick={() => setActiveWorkspace("student")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeWorkspace === "student"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-teal-400" />
            <span>Student Portal</span>
          </button>

          <button
            onClick={() => setActiveWorkspace("educator")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeWorkspace === "educator"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Video className="w-4 h-4 text-teal-400" />
            <span>Educator Studio</span>
          </button>

          <button
            onClick={() => setActiveWorkspace("superadmin")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeWorkspace === "superadmin"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Super Admin</span>
          </button>
        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE VIEW (ALL IN SINGLE WINDOW) */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* WORKSPACE 1: ACADEMY ADMIN DASHBOARD */}
        {activeWorkspace === "academy" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-bold text-teal-900 uppercase font-mono">
                  Academy Management Center
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Academy Administrator Control Panel</h2>
                <p className="text-xs text-slate-600 mt-1">Manage student admissions, batch scheduling, educator assignments, and revenue billing.</p>
              </div>

              <div className="flex gap-2">
                <Link href="/dashboard/academy/students" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                  <Users className="w-4 h-4" /> Manage Students
                </Link>
                <Link href="/dashboard/academy/batches" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Course Batches
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="text-xs text-slate-500 font-mono">Total Revenue</div>
                <div className="text-2xl font-bold text-teal-900 font-mono mt-1">${revenue.toLocaleString()}</div>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="text-xs text-slate-500 font-mono">Total Students</div>
                <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{students.toLocaleString()}</div>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="text-xs text-slate-500 font-mono">Active Batches</div>
                <div className="text-2xl font-bold text-slate-900 font-mono mt-1">{activeProjects}</div>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="text-xs text-slate-500 font-mono">Operational Status</div>
                <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">100% Healthy</div>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE 2: STUDENT PORTAL DASHBOARD */}
        {activeWorkspace === "student" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-bold text-teal-900 uppercase font-mono">
                  Student Portal
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Welcome back to Echo Learning Studio!</h2>
                <p className="text-xs text-slate-600 mt-1">Next: <span className="font-bold text-teal-900">Lesson 2.1 — Building Scalable Microservices</span></p>
              </div>

              <div className="flex gap-2">
                <Link href="/student/profile" className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                  <User className="w-4 h-4" /> My Profile & Passport
                </Link>
                <Link href="/student/learn/course-1" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" /> Resume Course
                </Link>
              </div>
            </div>

            {/* Enrolled Courses Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-900">Full-Stack System Architecture</div>
                <div className="text-[10px] text-teal-900 font-mono font-bold">Progress: 65%</div>
                <Link href="/student/learn/course-1" className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                  Open Player
                </Link>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-900">UI/UX Design Systems</div>
                <div className="text-[10px] text-teal-900 font-mono font-bold">Progress: 40%</div>
                <Link href="/student/learn/course-2" className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                  Open Player
                </Link>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-900">Data Structures & Algorithms</div>
                <div className="text-[10px] text-teal-900 font-mono font-bold">Progress: 90%</div>
                <Link href="/student/learn/course-3" className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                  Open Player
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE 3: EDUCATOR STUDIO DASHBOARD */}
        {activeWorkspace === "educator" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-bold text-teal-900 uppercase font-mono">
                  Teaching Studio
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Educator Studio & Course Creator</h2>
                <p className="text-xs text-slate-600 mt-1">Build curriculum modules, grade submissions, and stream live interactive workshops.</p>
              </div>

              <div className="flex gap-2">
                <Link href="/dashboard/studio/live" className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                  <Video className="w-4 h-4 text-teal-600" /> Go Live
                </Link>
                <Link href="/dashboard/studio/courses/builder" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Course Builder
                </Link>
              </div>
            </div>

            {/* Educator Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-slate-200 rounded-2xl">
                <div className="text-xs text-slate-500 font-mono">Total Students</div>
                <div className="text-2xl font-bold text-slate-900 font-mono mt-1">1,248</div>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl">
                <div className="text-xs text-slate-500 font-mono">Active Courses</div>
                <div className="text-2xl font-bold text-slate-900 font-mono mt-1">4</div>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl">
                <div className="text-xs text-slate-500 font-mono">Average Rating</div>
                <div className="text-2xl font-bold text-slate-900 font-mono mt-1">4.8 / 5.0</div>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl">
                <div className="text-xs text-slate-500 font-mono">Monthly Earnings</div>
                <div className="text-2xl font-bold text-emerald-700 font-mono mt-1">$4,200</div>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE 4: SUPER ADMIN SAAS PLATFORM */}
        {activeWorkspace === "superadmin" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-bold text-teal-900 uppercase font-mono">
                  SaaS Platform Super Admin
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Echo SaaS Command Center</h2>
                <p className="text-xs text-slate-600 mt-1">Platform-level tenant academies, billing plans, integrations, and email automations.</p>
              </div>

              <div className="flex gap-2">
                <Link href="/dashboard/super-admin/academies" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                  <Building className="w-4 h-4" /> Manage SaaS Academies
                </Link>
                <Link href="/dashboard/super-admin/settings" className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Platform Settings
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
