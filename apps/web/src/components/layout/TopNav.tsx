"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { getNavItemsByRole, Role } from "@/config/navigation"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"
import { ShieldCheck, Moon, Sun, Menu, X, LogOut, Sparkles, Layers } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useOrganization } from "@/context/OrganizationContext"
import { NotificationMenu } from "./NotificationMenu"
import { TimerWidget } from "./TimerWidget"

const RealtimeIndicator = dynamic(() => import("@/components/RealtimeIndicator"), { ssr: false })

function OrgHeader() {
  const org = useOrganization()
  const orgName = org?.name && !org.name.includes("Grekam") ? org.name : "Gecho LMS"

  return (
    <div className="flex items-center gap-3 shrink-0">
      <div 
        className="w-9 h-9 rounded-xl bg-primary border border-white/20 flex items-center justify-center shrink-0 shadow-md shadow-primary/20 text-white"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <Layers className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-base font-black tracking-tight text-slate-900">{orgName}</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-800 text-[10px] font-extrabold border border-amber-400/40 uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 fill-amber-500 text-amber-600" /> PRO SAAS
          </span>
        </div>
      </div>
    </div>
  )
}

export function TopNav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  
  let rawRole = session?.user?.role || "SUPER_ADMIN"
  if (rawRole === "Super Admin") rawRole = "SUPER_ADMIN"
  if (rawRole === "Manager") rawRole = "MANAGER"
  if (rawRole === "Staff") rawRole = "STAFF"
  if (rawRole === "Client") rawRole = "CLIENT"
  if (rawRole === "Student") rawRole = "STUDENT"
  if (rawRole === "Vendor") rawRole = "VENDOR"
  if (rawRole === "Intern") rawRole = "INTERN"
  
  const role = rawRole as Role

  return (
    <>
      {/* Top Header Bar */}
      <header className="h-16 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-4 md:px-6 relative z-50 shrink-0 shadow-xs">
        
        {/* Left: Top Navigation Header Tabs */}
        <div className="flex items-center gap-2">
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/dashboard"
              onClick={() => window.dispatchEvent(new CustomEvent('anchor-sidebar', { detail: 'Main' }))}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                pathname === "/dashboard"
                  ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/academy/admissions"
              onClick={() => window.dispatchEvent(new CustomEvent('anchor-sidebar', { detail: 'Academy Admin' }))}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                pathname?.startsWith("/dashboard/academy")
                  ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              )}
            >
              Academy Admin
            </Link>
            <Link
              href="/dashboard/studio"
              onClick={() => window.dispatchEvent(new CustomEvent('anchor-sidebar', { detail: 'Teaching Studio' }))}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                pathname?.startsWith("/dashboard/studio")
                  ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              )}
            >
              Teaching Studio
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => window.dispatchEvent(new CustomEvent('anchor-sidebar', { detail: 'Settings' }))}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                pathname?.startsWith("/dashboard/settings")
                  ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              )}
            >
              Settings
            </Link>
          </nav>
        </div>

        {/* Right: Actions & User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <TimerWidget />
            <NotificationMenu />
            <RealtimeIndicator />
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block mx-1"></div>

          {/* User Profile */}
          <div className="hidden md:flex items-center gap-3 pl-1">
            <div className="flex flex-col items-end min-w-0">
              <span className="text-sm font-bold leading-none text-slate-900">{session?.user?.name || "Stalin Kumar"}</span>
              <span className="text-[10px] uppercase tracking-wider text-primary font-bold mt-1 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{role}</span>
            </div>
            <button 
              onClick={() => signOut()} 
              title="Logout" 
              className="h-9 w-9 rounded-full bg-primary border border-primary/30 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm hover:scale-105 transition-all"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {session?.user?.name?.charAt(0) || "S"}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="relative w-[85%] max-w-sm h-full flex flex-col bg-white border-r border-slate-200 shadow-2xl animate-in slide-in-from-left">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
              <OrgHeader />
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-2 mt-auto">
               <div className="flex items-center justify-around py-2 border-b border-slate-200 mb-2">
                 <NotificationMenu />
                 <RealtimeIndicator />
               </div>
               <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50">
                  <LogOut className="w-5 h-5" /> Sign Out
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

