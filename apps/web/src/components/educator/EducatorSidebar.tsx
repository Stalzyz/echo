"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  Users, 
  CheckSquare, 
  HelpCircle, 
  BarChart2, 
  Folder, 
  LogOut,
  GraduationCap,
  Award
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"

const getEducatorNavigation = (basePath: string) => {
  return [
    { title: "Studio Dashboard", href: basePath, icon: LayoutDashboard },
    { title: "My Students", href: `${basePath}/students`, icon: Users },
    { title: "My Courses", href: `${basePath}/courses`, icon: BookOpen },
    { title: "Course Builder", href: `${basePath}/courses/builder`, icon: Folder },
    { title: "Quiz Builder", href: `${basePath}/quizzes`, icon: HelpCircle },
    { title: "Coupons & Discounts", href: `${basePath}/coupons`, icon: Award },
    { title: "Assignments", href: `${basePath}/assignments`, icon: CheckSquare },
    { title: "Certificates", href: `${basePath}/certificates`, icon: GraduationCap },
    { title: "Analytics", href: `${basePath}/analytics`, icon: BarChart2 },
    { title: "Live Studio", href: `${basePath}/live`, icon: Video },
    { title: "Office Hours", href: `${basePath}/office-hours`, icon: Users },
  ];
}

export function EducatorSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const basePath = '/dashboard/studio';
  const educatorNavigation = getEducatorNavigation(basePath);

  return (
    <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col text-slate-900 flex-shrink-0 relative z-40 hidden md:flex shadow-xs">
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-200 bg-white">
        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-teal-700" />
        </div>
        <span className="font-extrabold tracking-tight text-slate-900">Teaching Studio</span>
      </div>

      <div className="p-6 pb-2 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center font-bold text-teal-800 text-sm">
            {session?.user?.name?.charAt(0) || "E"}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-sm text-slate-900 truncate">{session?.user?.name || "Educator"}</h3>
            <p className="text-xs text-slate-500 truncate">{session?.user?.email || "educator@echolms.com"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {educatorNavigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== basePath && pathname?.startsWith(`${item.href}/`))
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

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <button 
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/60 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  )
}
