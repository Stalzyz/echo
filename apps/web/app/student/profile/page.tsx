"use client"

import { useState } from "react"
import { useApi } from "@/lib/useApi"
import Link from "next/link"
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, 
  GraduationCap, Award, Shield, CheckCircle2, Edit3, 
  Globe, Github, Linkedin, ExternalLink, Zap, Star,
  BookOpen, Clock, FileText, ArrowLeft, QRCode
} from "lucide-react"

export default function StudentProfilePage() {
  const { data: userProfile, isLoading } = useApi<any>("/v1/auth/me")

  const profile = userProfile || {
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@echo.in",
    phone: "+91 98765 43210",
    role: "STUDENT",
    studentId: "ECHO-2026-8942",
    enrollmentType: "Remote Learner", // Remote, Campus, Hybrid
    batch: "Full-Stack Web Dev - Cohort 12",
    joinedDate: "January 2026",
    bio: "Passionate full-stack developer focusing on Next.js, TypeScript, and distributed cloud architecture.",
    city: "Bangalore",
    country: "India",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    portfolioUrl: "https://alexmorgan.dev",
    careerScore: 85,
    streak: 7,
    completedCourses: 3,
    hoursLearned: 48,
    skills: [
      { name: "React.js & Next.js", level: "Advanced", rating: 5 },
      { name: "TypeScript", level: "Advanced", rating: 5 },
      { name: "Node.js & PostgreSQL", level: "Intermediate", rating: 4 },
      { name: "System Design & Architecture", level: "Intermediate", rating: 4 }
    ]
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. TOP NAVBAR */}
      <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <Link 
            href="/student" 
            className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-600 hover:text-slate-900 border border-slate-200"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest block font-mono">
              Echo Learning Studio
            </span>
            <h1 className="text-sm font-bold text-slate-900">Student Profile & Passport</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/student/profile/edit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </Link>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
        
        {/* PROFILE HEADER CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-24 h-24 rounded-full bg-teal-100 border-2 border-teal-200 text-teal-800 font-bold text-3xl flex items-center justify-center shrink-0">
              {profile.firstName ? profile.firstName.charAt(0) : "S"}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-bold text-teal-700 font-mono uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-600" /> Verified Student
                </span>
                <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-700 font-mono">
                  {profile.enrollmentType}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {profile.firstName} {profile.lastName}
              </h2>

              <p className="text-xs text-slate-500 font-mono">
                Student ID: <span className="font-bold text-slate-800">{profile.studentId}</span> • {profile.batch}
              </p>

              <p className="text-xs text-slate-600 max-w-xl pt-1 leading-relaxed">
                {profile.bio}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/student/profile/edit"
              className="w-full px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Full Profile
            </Link>
            
            <a
              href={`/student/${profile.studentId}`}
              target="_blank"
              rel="noreferrer"
              className="w-full px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2"
            >
              <Globe className="w-3.5 h-3.5" /> View Public Passport
            </a>
          </div>
        </div>

        {/* STATS OVERVIEW GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
              <BookOpen className="w-4 h-4 text-teal-600" /> Enrolled
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">3 Courses</div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
              <Clock className="w-4 h-4 text-teal-600" /> Hours Spent
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">48 Hours</div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
              <Award className="w-4 h-4 text-amber-600" /> Streak
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">🔥 7 Days</div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
              <Shield className="w-4 h-4 text-emerald-600" /> Readiness
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono text-emerald-700">85 / 100</div>
          </div>
        </div>

        {/* TWO COLUMN DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS: Personal Details & Skills */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" /> Personal & Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Email Address</span>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {profile.email}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Phone Number</span>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {profile.phone}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Enrollment Mode</span>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> {profile.enrollmentType}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Location</span>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.city}, {profile.country}
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Skills Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-600" /> Verified Competencies & Skills
              </h3>

              <div className="space-y-3">
                {profile.skills.map((skill: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{skill.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{skill.level}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i <= skill.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Portfolio Links & Parent Connect */}
          <div className="space-y-6">
            
            {/* Online Links Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-600" /> Portfolio & Social Profiles
              </h3>

              <div className="space-y-3">
                <a 
                  href={profile.githubUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-slate-700" /> GitHub Profile
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a 
                  href={profile.linkedinUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn Profile
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a 
                  href={profile.portfolioUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-teal-600" /> Personal Portfolio
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Parent & Guardian Connect Card */}
            <div className="bg-teal-50 border border-teal-200 rounded-3xl p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider font-mono">
                Parent & Guardian Portal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parents can log in with your Student ID to check attendance records, assignment marks, and fee invoices.
              </p>
              <Link 
                href={`/portal/parent/${profile.studentId}`}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 shadow-xs"
              >
                Open Parent Access Link
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  )
}
