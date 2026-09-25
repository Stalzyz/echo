"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { getNavItemsByRole, NavItem, Role } from "@/config/navigation"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"
import { 
  ChevronDown, ChevronRight, Menu, X, ShieldCheck, 
  LayoutDashboard, BookOpen, Briefcase, MessageSquare, Layers, DollarSign, Bell 
} from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useOrganization } from "@/context/OrganizationContext"

const RealtimeIndicator = dynamic(() => import("@/components/RealtimeIndicator"), { ssr: false })

import { NotificationMenu } from "./NotificationMenu"
import { TimerWidget } from "./TimerWidget"

function OrgHeader() {
  const org = useOrganization()
  const logoSrc = org?.logoUrl || org?.academyLogoUrl || "/echo_logo.png"

  return (
    <div className="flex h-16 items-center px-6 gap-3 relative z-10 border-b border-slate-200 bg-white">
      <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-200 p-0.5 bg-white flex items-center justify-center">
        <img src={logoSrc} alt={org.name} className="object-contain w-full h-full" />
      </div>
      <span className="text-base font-black tracking-tight text-slate-900">{org.name}</span>
      <div className="ml-auto flex items-center gap-2">
        <TimerWidget />
        <NotificationMenu />
        <RealtimeIndicator />
      </div>
    </div>
  )
}

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon
  const isGroupActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
  const [open, setOpen] = useState(isGroupActive)

  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all group",
          isGroupActive
            ? "bg-teal-50 text-teal-800 border border-teal-200/80 font-bold"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isGroupActive ? "text-teal-700" : "text-slate-400 group-hover:text-slate-600")} />
        {item.title}
      </Link>
    )
  }

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all group",
          isGroupActive
            ? "text-slate-900 font-extrabold bg-slate-50"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isGroupActive ? "text-teal-700" : "text-slate-400 group-hover:text-slate-600")} />
        <span className="flex-1 text-left tracking-tight">{item.title}</span>
        {open
          ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        }
      </button>

      <div className={cn(
        "grid transition-all duration-200 ease-in-out",
        open ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <div className="ml-5 pl-3 border-l border-slate-200 space-y-1">
            {item.children!.map(child => {
              const isChildActive = pathname === child.href
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all group",
                    isChildActive
                      ? "bg-teal-50 text-teal-800 font-bold border border-teal-200/60"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full transition-all", isChildActive ? "bg-teal-600" : "bg-slate-300 group-hover:bg-slate-500")} />
                  {child.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const org = useOrganization()

  let rawRole = session?.user?.role || "INTERN"
  if (rawRole === "Super Admin") rawRole = "SUPER_ADMIN"
  if (rawRole === "Manager") rawRole = "MANAGER"
  if (rawRole === "Staff") rawRole = "STAFF"
  if (rawRole === "Client") rawRole = "CLIENT"
  if (rawRole === "Student") rawRole = "STUDENT"
  if (rawRole === "Vendor") rawRole = "VENDOR"
  if (rawRole === "Intern") rawRole = "INTERN"
  
  const role = rawRole as Role
  const customPermissions = (session?.user as any)?.permissions || []
  const isSuperAdminPlatform =
    (role === "SUPER_ADMIN" || session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "Super Admin") &&
    !session?.user?.impersonatedBySuperAdmin

  const navItems = getNavItemsByRole(role, customPermissions, org?.plan?.features || null, isSuperAdminPlatform)

  const getBottomTabs = (role: Role) => {
    switch (role) {
      case "STUDENT":
      case "INTERN":
        return [
          { title: "Home", href: "/dashboard", icon: LayoutDashboard },
          { title: "Courses", href: "/dashboard/lms", icon: BookOpen },
          { title: "Tasks", href: "/dashboard/lms/assignments", icon: Briefcase },
          { title: "Chat", href: "/dashboard/chat", icon: MessageSquare },
        ]
      case "CLIENT":
        return [
          { title: "Home", href: "/dashboard", icon: LayoutDashboard },
          { title: "Billing", href: "/dashboard/finance/revenue", icon: DollarSign },
          { title: "Board", href: "/dashboard/projects", icon: Briefcase },
          { title: "Chat", href: "/dashboard/chat", icon: MessageSquare },
        ]
      case "VENDOR":
        return [
          { title: "Home", href: "/dashboard", icon: LayoutDashboard },
          { title: "Board", href: "/dashboard/projects", icon: Briefcase },
          { title: "Chat", href: "/dashboard/chat", icon: MessageSquare },
          { title: "Alerts", href: "/dashboard/notifications", icon: Bell },
        ]
      default:
        return [
          { title: "Home", href: "/dashboard", icon: LayoutDashboard },
          { title: "CRM", href: "/dashboard/crm", icon: Layers },
          { title: "Board", href: "/dashboard/projects", icon: Briefcase },
          { title: "Chat", href: "/dashboard/chat", icon: MessageSquare },
        ]
    }
  }

  const sidebarContent = (
    <div className="flex flex-1 w-full flex-col min-h-0 overflow-hidden bg-white text-slate-900 font-sans relative">
      <OrgHeader />

      <div className="px-6 py-4 relative z-10 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 w-fit shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
            {role} ACCESS
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-3 space-y-1 py-4 relative z-10">
        {navItems.map(item => (
          <NavGroup key={item.href} item={item} pathname={pathname} />
        ))}
      </div>

      <div className="p-4 relative z-10 border-t border-slate-200 bg-slate-50">
        <div onClick={() => signOut({ callbackUrl: "/auth/login" })} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer border border-slate-200 bg-white shadow-xs" title="Click to logout">
          <div className="h-10 w-10 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-sm shrink-0">
            {session?.user?.name?.charAt(0) || "S"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold leading-none truncate text-slate-900">{session?.user?.name || "Stalin Kumar"}</span>
            <span className="text-xs text-slate-500 mt-1 truncate font-mono">{session?.user?.email || "admin@echolms.com"}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden md:flex h-screen w-72 flex-col border-r border-slate-200 shrink-0 bg-white relative z-20 shadow-xs overflow-hidden">
        {sidebarContent}
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200 p-0.5 bg-white flex items-center justify-center">
            <img src={org?.logoUrl || org?.academyLogoUrl || "/echo_logo.png"} alt={org.name} className="object-contain w-full h-full" />
          </div>
          <span className="text-xs font-bold tracking-tight text-slate-900 truncate max-w-[120px]">{org.name}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <NotificationMenu />
          <RealtimeIndicator />
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 flex items-center justify-around px-2 shadow-sm">
        {getBottomTabs(role).map(tab => {
          const TabIcon = tab.icon
          const isTabActive = pathname === tab.href || (tab.href !== "/dashboard" && pathname?.startsWith(`${tab.href}/`))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                isTabActive ? "text-teal-600 font-bold" : "text-slate-500"
              )}
            >
              <TabIcon className="w-5 h-5" />
              <span className="text-[9px] uppercase tracking-wider font-bold">{tab.title}</span>
              {isTabActive && <span className="absolute bottom-1 w-5 h-0.5 bg-teal-600 rounded-full" />}
            </Link>
          )
        })}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-bold">Menu</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-[85%] max-w-sm h-full flex flex-col shadow-2xl border-r border-slate-200 overflow-hidden bg-white">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
