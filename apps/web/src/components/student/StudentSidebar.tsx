"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  PlayCircle, 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  Trophy, 
  Briefcase, 
  LogOut,
  GraduationCap
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"

const studentNavigation = [
  { title: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
  { title: "My Learning", href: "/dashboard/student/learning", icon: PlayCircle },
  { title: "Assignments", href: "/dashboard/student/assignments", icon: CheckSquare },
  { title: "Schedule", href: "/dashboard/student/schedule", icon: Calendar },
  { title: "Community", href: "/dashboard/student/community", icon: MessageSquare },
  { title: "Certificates", href: "/dashboard/student/certificates", icon: Trophy },
  { title: "Career Hub", href: "/dashboard/student/career", icon: Briefcase },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col text-slate-900 shadow-xs">
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-200 shrink-0 bg-white">
        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-teal-700" />
        </div>
        <span className="font-extrabold tracking-tight text-xs uppercase text-slate-900">Learning Portal</span>
      </div>

      <div className="p-6 pb-4 shrink-0 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center font-bold text-teal-800 text-sm">
            {session?.user?.name?.charAt(0) || "S"}
          </div>
          <div className="overflow-hidden flex-1">
            <h3 className="font-bold text-sm text-slate-900 truncate">{session?.user?.name || "Student"}</h3>
            <p className="text-xs text-slate-500 truncate">Level 4 Scholar</p>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-bold">XP Progress</span>
            <span className="text-teal-700 font-extrabold">1,240 / 2,000</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 w-[62%] rounded-full" />
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {studentNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          const Icon = item.icon
          
          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                isActive 
                  ? "bg-teal-50 text-teal-800 border border-teal-200/80 font-extrabold" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 transition-colors", 
                isActive ? "text-teal-700" : "text-slate-400 group-hover:text-slate-600"
              )} />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 shrink-0 bg-slate-50">
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/60 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  )
}
