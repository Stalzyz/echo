"use client"

import Link from "next/link"
import { usePathname } from  "next/navigation"
import { Building, GraduationCap, Video, ShieldCheck, ChevronRight } from  "lucide-react"

export function UniversalWorkspaceBar() {
  const pathname = usePathname()

  const workspaces = [
    {
      id: "academy",
      name: "Academy Admin",
      href: "/dashboard",
      icon: Building,
      active: pathname === "/dashboard" || (pathname?.startsWith("/dashboard/academy") && !pathname?.startsWith("/dashboard/studio") && !pathname?.startsWith("/dashboard/super-admin"))
    },
    {
      id: "student",
      name: "Student Portal",
      href: "/student",
      icon: GraduationCap,
      active: pathname?.startsWith("/student")
    },
    {
      id: "educator",
      name: "Educator Studio",
      href: "/dashboard/studio",
      icon: Video,
      active: pathname?.startsWith("/dashboard/studio")
    },
    {
      id: "superadmin",
      name: "Super Admin",
      href: "/dashboard/super-admin",
      icon: ShieldCheck,
      active: pathname?.startsWith("/dashboard/super-admin")
    }
  ]

  return (
    <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs border-b border-slate-800 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-teal-400 font-mono uppercase tracking-wider bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-md">
          Unified Workspace Switcher
        </span>
      </div>

      {/* Switcher Pills */}
      <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
        {workspaces.map((ws) => {
          const Icon = ws.icon
          return (
            <Link
              key={ws.id}
              href={ws.href}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                ws.active
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{ws.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
