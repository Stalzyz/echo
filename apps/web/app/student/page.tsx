"use client"

import { useState } from "react"
import { useApi } from "@/lib/useApi"
import Link from "next/link"
import {
  BookOpen, PlayCircle, Clock, CheckCircle2, Award, 
  Search, FileText, ArrowRight, User, GraduationCap, 
  BarChart2, Calendar, Star, ChevronRight, Menu, X,
  Edit3, Shield, Globe, Mail, Phone, MapPin, Zap, 
  Code, Share2, Save, Loader2, LogOut, Download, ExternalLink,
  Flame, Bell
} from "lucide-react"

export default function UnifiedStudentDashboardPage() {
  const { data: coursesData } = useApi<any>("/lms/courses")
  const { data: userProfile } = useApi<any>("/v1/auth/me")

  const [activeNav, setActiveNav] = useState<"overview" | "courses" | "profile" | "edit-profile" | "assignments" | "certificates">("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Edit Profile Form State
  const [savingProfile, setSavingProfile] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState("")
  const [editTab, setEditTab] = useState<"personal" | "contact" | "academic" | "portfolio" | "notifications">("personal")

  const [form, setForm] = useState({
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@echo.in",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    gender: "Male",
    dob: "2002-05-15",
    bloodGroup: "O+",
    bio: "Passionate full-stack developer focusing on Next.js, TypeScript, and distributed cloud architecture.",
    address: "123 Innovation Tech Park, Indiranagar",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    postalCode: "560038",
    enrollmentType: "Remote Learner",
    batch: "Full-Stack Web Dev - Cohort 12",
    studentId: "ECHO-2026-8942",
    emergencyContactName: "Robert Morgan",
    emergencyContactPhone: "+91 98123 45678",
    githubUrl: "https://github.com/alexmorgan",
    linkedinUrl: "https://linkedin.com/in/alexmorgan",
    portfolioUrl: "https://alexmorgan.dev",
    skills: "React.js, Next.js, TypeScript, Node.js, PostgreSQL",
    emailNotifications: true,
    whatsappAlerts: true
  })

  // Enrolled Courses List
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setSaveSuccess("")
    await new Promise((res) => setTimeout(res, 600))
    setSaveSuccess("Profile details updated successfully!")
    setSavingProfile(false)
    setTimeout(() => setSaveSuccess(""), 4000)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-x-hidden">
      
      {/* 1. LEFT SIDEBAR (ACCESSIBLE & MOBILE RESPONSIVE) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-mono text-sm font-bold flex items-center justify-center shadow-xs">
                E
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 tracking-tight block">Echo LMS</span>
                <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider font-mono">Student Portal</span>
              </div>
            </div>

            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              aria-label="Close sidebar navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="p-4 space-y-1.5" aria-label="Main Navigation">
            <button
              onClick={() => { setActiveNav("overview"); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                activeNav === "overview" || activeNav === "courses"
                  ? "bg-teal-50 text-teal-900 border border-teal-200" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Dashboard & Courses</span>
            </button>

            <button
              onClick={() => { setActiveNav("profile"); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                activeNav === "profile" 
                  ? "bg-teal-50 text-teal-900 border border-teal-200" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <User className="w-4 h-4 text-teal-600" />
              <span>My Profile & Passport</span>
            </button>

            <button
              onClick={() => { setActiveNav("edit-profile"); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                activeNav === "edit-profile" 
                  ? "bg-teal-50 text-teal-900 border border-teal-200" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <Edit3 className="w-4 h-4 text-teal-600" />
              <span>Edit Account Details</span>
            </button>

            <button
              onClick={() => { setActiveNav("assignments"); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                activeNav === "assignments" 
                  ? "bg-teal-50 text-teal-900 border border-teal-200" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Assignments</span>
            </button>

            <button
              onClick={() => { setActiveNav("certificates"); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                activeNav === "certificates" 
                  ? "bg-teal-50 text-teal-900 border border-teal-200" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>Certificates</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 truncate">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-900 font-bold text-xs flex items-center justify-center shrink-0">
                {form.firstName.charAt(0)}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">{form.firstName} {form.lastName}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">{form.studentId}</div>
              </div>
            </div>

            <Link href="/auth/login" className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* 2. RIGHT MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-slate-900 capitalize">
              {activeNav === "overview" && "Student Learning Workspace"}
              {activeNav === "profile" && "Student Profile & Career Passport"}
              {activeNav === "edit-profile" && "Edit Account & Registration Settings"}
              {activeNav === "assignments" && "Assignments & Submissions"}
              {activeNav === "certificates" && "Earned Certificates & Credentials"}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-all w-52"
              />
            </div>

            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-900 font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> 7-Day Streak
            </div>

            {/* Profile Avatar Button */}
            <button 
              onClick={() => setActiveNav("profile")}
              className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              aria-label="Open profile view"
            >
              {form.firstName.charAt(0)}
            </button>
          </div>
        </header>

        {/* DYNAMIC VIEW BODY */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
          
          {/* VIEW 1: DASHBOARD OVERVIEW & COURSES */}
          {(activeNav === "overview" || activeNav === "courses") && (
            <>
              {/* HERO WELCOME BANNER (HIGH-CONTRAST WCAG COMPLIANT) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-bold text-teal-900 uppercase font-mono">
                    Academic Status: Active Student
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Welcome back, {form.firstName}!
                  </h2>
                  <p className="text-xs text-slate-700 max-w-lg leading-relaxed font-medium">
                    Next up: <span className="font-bold text-teal-900">Lesson 2.1 — Building Scalable Microservices</span> (14 mins remaining)
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-5 shrink-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-900 font-mono">65%</div>
                    <div className="text-[10px] text-slate-600 font-bold uppercase font-mono">Overall Progress</div>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <Link 
                    href="/student/learn/course-1" 
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  >
                    Resume Learning <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* COURSES GRID */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Enrolled Courses</h3>
                    <p className="text-xs text-slate-600 font-medium">Pick up right where you left off</p>
                  </div>
                  <span className="text-xs font-bold text-teal-900 font-mono bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                    {filteredCourses.length} Enrolled
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <div 
                      key={course.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/90 text-white font-mono text-[10px] font-bold rounded-lg">
                          {course.category}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors line-clamp-2">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium mt-1">
                            Instructor: <span className="text-slate-900 font-bold">{course.instructor}</span>
                          </p>
                        </div>

                        {/* Accessibility Compliant ARIA Progress Bar */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-700 font-bold">
                              {course.completedLessons}/{course.totalLessons} Lessons
                            </span>
                            <span className="font-bold text-teal-900">{course.progress}%</span>
                          </div>
                          <div 
                            role="progressbar"
                            aria-label={`Course progress for ${course.title}`}
                            aria-valuenow={course.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
                          >
                            <div 
                              className="h-full bg-teal-600 rounded-full transition-all duration-300" 
                              style={{ width: `${course.progress}%` }} 
                            />
                          </div>
                        </div>

                        <Link 
                          href={`/student/learn/${course.id}`}
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                        >
                          <PlayCircle className="w-4 h-4" /> Go to Learning Studio
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: STUDENT PROFILE & PASSPORT */}
          {activeNav === "profile" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-full bg-teal-100 border-2 border-teal-200 text-teal-900 font-bold text-2xl flex items-center justify-center shrink-0">
                    {form.firstName.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-bold text-teal-900 font-mono uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-teal-600" /> Verified Passport
                      </span>
                      <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-800 font-mono">
                        {form.enrollmentType}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{form.firstName} {form.lastName}</h2>
                    <p className="text-xs text-slate-600 font-mono">ID: {form.studentId} • {form.batch}</p>
                    <p className="text-xs text-slate-600 max-w-lg pt-1">{form.bio}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveNav("edit-profile")}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile Details
                </button>
              </div>

              {/* Skills & Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" /> Personal & Contact Information
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div><span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Email:</span> <span className="font-bold text-slate-900">{form.email}</span></div>
                    <div><span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Phone:</span> <span className="font-bold text-slate-900">{form.phone}</span></div>
                    <div><span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Location:</span> <span className="font-bold text-slate-900">{form.city}, {form.country}</span></div>
                    <div><span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Emergency Contact:</span> <span className="font-bold text-slate-900">{form.emergencyContactName} ({form.emergencyContactPhone})</span></div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-teal-600" /> Portfolio & Links
                  </h3>
                  <div className="space-y-2 text-xs">
                    <a href={form.githubUrl} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-slate-800">
                      <span>GitHub Profile</span> <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                    <a href={form.linkedinUrl} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-slate-800">
                      <span>LinkedIn Profile</span> <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                    <a href={form.portfolioUrl} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between font-bold text-slate-800">
                      <span>Personal Portfolio</span> <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: EDIT PROFILE SETTINGS */}
          {activeNav === "edit-profile" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-sm font-bold text-slate-900">Edit Registration & Account Details</h3>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {saveSuccess}
                </div>
              )}

              {/* Edit Tabs */}
              <div className="flex gap-2 border-b border-slate-100 pb-2">
                <button 
                  onClick={() => setEditTab("personal")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg ${editTab === "personal" ? "bg-teal-50 text-teal-900 border border-teal-200" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Personal
                </button>
                <button 
                  onClick={() => setEditTab("contact")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg ${editTab === "contact" ? "bg-teal-50 text-teal-900 border border-teal-200" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Contact & Address
                </button>
                <button 
                  onClick={() => setEditTab("academic")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg ${editTab === "academic" ? "bg-teal-50 text-teal-900 border border-teal-200" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Academic Mode
                </button>
                <button 
                  onClick={() => setEditTab("portfolio")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg ${editTab === "portfolio" ? "bg-teal-50 text-teal-900 border border-teal-200" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Portfolio Links
                </button>
              </div>

              {/* Edit Tab Inputs */}
              {editTab === "personal" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">First Name</label>
                    <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Last Name</label>
                    <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Personal Bio</label>
                    <textarea rows={2} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-600 resize-none" />
                  </div>
                </div>
              )}

              {editTab === "contact" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">City</label>
                    <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Country</label>
                    <input type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600" />
                  </div>
                </div>
              )}

              {editTab === "academic" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Enrollment Mode</label>
                    <select value={form.enrollmentType} onChange={e => setForm({...form, enrollmentType: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600">
                      <option value="Remote Learner">Remote Learner (Online)</option>
                      <option value="Onsite Campus Student">Onsite Campus Student</option>
                      <option value="Hybrid Learner">Hybrid Learner</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Emergency Contact Name</label>
                    <input type="text" value={form.emergencyContactName} onChange={e => setForm({...form, emergencyContactName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600" />
                  </div>
                </div>
              )}

              {editTab === "portfolio" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">GitHub URL</label>
                    <input type="url" value={form.githubUrl} onChange={e => setForm({...form, githubUrl: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">LinkedIn URL</label>
                    <input type="url" value={form.linkedinUrl} onChange={e => setForm({...form, linkedinUrl: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-600 font-mono" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 4: ASSIGNMENTS */}
          {activeNav === "assignments" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" /> Pending & Submitted Assignments
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">System Architecture Diagram Brief</div>
                    <div className="text-[10px] text-slate-500 font-mono">Due in 2 days • 100 Points</div>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-[10px] font-bold font-mono">Pending</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">React State Management Implementation</div>
                    <div className="text-[10px] text-slate-500 font-mono">Graded: 95/100</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-[10px] font-bold font-mono">Completed</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: CERTIFICATES */}
          {activeNav === "certificates" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" /> Verified Course Certificates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
                    <Award className="w-6 h-6 text-teal-700" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Data Structures & Algorithms</div>
                    <div className="text-[10px] text-slate-500 font-mono">Issued Jan 2026 • Verified Blockchain Record</div>
                  </div>
                  <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                    <Download className="w-3.5 h-3.5" /> Download PDF Certificate
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  )
}
