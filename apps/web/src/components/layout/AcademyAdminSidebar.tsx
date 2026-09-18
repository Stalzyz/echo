"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Users, BookOpen, GraduationCap, DollarSign, Trophy, 
  Calendar, FileText, ClipboardList, TrendingUp, HelpCircle,
  Briefcase, Percent, Award, ShieldAlert, Laptop, Video, MessageSquare
} from "lucide-react"

const academyAdminNavigation = [
  { title: "Admissions CRM", href: "/dashboard/academy/admissions", icon: Users },
  { title: "Form Builder", href: "/dashboard/academy/forms", icon: FileText },
  { title: "Walk-ins Kiosk", href: "/dashboard/academy/walk-ins", icon: Laptop },
  { title: "Demo Sessions", href: "/dashboard/academy/demo-sessions", icon: Calendar },
  { title: "Campus Students", href: "/dashboard/academy/students/onsite", icon: GraduationCap },
  { title: "Remote Students", href: "/dashboard/academy/students/online", icon: GraduationCap },
  { title: "Global Leaderboard", href: "/dashboard/academy/leaderboard", icon: Trophy },
  { title: "Campus Faculty", href: "/dashboard/academy/educators/onsite", icon: Users },
  { title: "Office Hours", href: "/dashboard/studio/office-hours", icon: Calendar },
  { title: "Remote Instructors", href: "/dashboard/academy/educators/online", icon: Users },
  { title: "Fee Collection", href: "/dashboard/academy/fees", icon: DollarSign },
  { title: "Student EMI Plans", href: "/dashboard/academy/fees/emi", icon: DollarSign },
  { title: "1:1 Consultations", href: "/dashboard/academy/consultations", icon: Users },
  { title: "Webinars & Funnels", href: "/dashboard/academy/webinars", icon: Video },
  { title: "Social Community", href: "/dashboard/academy/community", icon: MessageSquare },
  { title: "Batches", href: "/dashboard/academy/batches", icon: ClipboardList },
  { title: "Live Projects", href: "/dashboard/academy/projects", icon: Briefcase },
  { title: "Internships", href: "/dashboard/academy/internships", icon: Briefcase },
  { title: "Placements", href: "/dashboard/academy/placements", icon: Award },
  { title: "Marketplace", href: "/dashboard/academy/marketplace", icon: TrendingUp },
  { title: "Campus Events", href: "/dashboard/academy/events", icon: Calendar },
  { title: "Referrals", href: "/dashboard/academy/referrals", icon: Percent },
  { title: "AI Risk Engine", href: "/dashboard/academy/risk", icon: ShieldAlert },
]

export function AcademyAdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col text-slate-900 flex-shrink-0 relative z-40 hidden md:flex overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-200 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-teal-600" />
        </div>
        <span className="font-extrabold tracking-tight text-slate-900">Academy Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {academyAdminNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          const Icon = item.icon
          
          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                isActive 
                  ? "bg-teal-50 text-teal-800 font-bold shadow-2xs border-l-4 border-teal-600" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 transition-colors", 
                isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-700"
              )} />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

