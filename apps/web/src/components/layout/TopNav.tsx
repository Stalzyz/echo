"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { getNavItemsByRole, Role } from "@/config/navigation"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"
import { ShieldCheck, Moon, Sun, Menu, X, LogOut, Layers, LayoutDashboard, Users, Phone, GraduationCap, CreditCard, Calendar, Video, Settings, Building2 } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useOrganization } from "@/context/OrganizationContext"
import { toast } from "sonner"
import { NotificationMenu } from "./NotificationMenu"
import { TimerWidget } from "./TimerWidget"

const RealtimeIndicator = dynamic(() => import("@/components/RealtimeIndicator"), { ssr: false })

function OrgHeader() {
  const org = useOrganization()
  const orgName = org?.name && !org.name.includes("Grekam") ? org.name : "Echo LMS"
  const logoSrc = org?.logoUrl || org?.academyLogoUrl || "/echo_logo.png"
  const planBadge = org?.plan?.name || (org?.subscription ? `${org.subscription} PLAN` : "STARTER PLAN")

  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div 
        className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs overflow-hidden p-1"
      >
        <img src={logoSrc} alt={orgName} className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-base font-black tracking-tight text-slate-900 truncate max-w-[120px] sm:max-w-none">{orgName}</span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-800 text-[10px] font-black border border-teal-500/20 uppercase tracking-wider items-center gap-1 shadow-xs font-mono">
            {planBadge}
          </span>
        </div>
      </div>
    </div>
  )
}

export function TopNav() {
  const { data: session, update: updateSession } = useSession()
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
  const isSuperAdminPlatform =
    (role === "SUPER_ADMIN" || session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "Super Admin") &&
    !session?.user?.impersonatedBySuperAdmin

  return (
    <>
      {/* Top Header Bar */}
      <header className="h-16 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-4 md:px-6 relative z-50 shrink-0 shadow-xs">
        
        {/* Left: Top Navigation Header Logo & Tabs */}
        <div className="flex items-center gap-3">
          <Link
            href={isSuperAdminPlatform ? "/dashboard/super-admin" : "/dashboard"}
            className="flex items-center gap-2 shrink-0"
          >
            <OrgHeader />
          </Link>
          <nav className="hidden lg:flex items-center gap-1 border-l border-slate-200 pl-3">
            {pathname?.startsWith("/dashboard/super-admin") ? (
              <>
                <Link
                  href="/dashboard/super-admin"
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                    pathname === "/dashboard/super-admin"
                      ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/super-admin/academies"
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                    pathname?.startsWith("/dashboard/super-admin/academies") || pathname?.startsWith("/dashboard/super-admin/vendors")
                      ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  )}
                >
                  Vendor Management
                </Link>
                <Link
                  href="/dashboard/super-admin/plans"
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                    pathname?.startsWith("/dashboard/super-admin/plans") || pathname?.startsWith("/dashboard/super-admin/packages")
                      ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  )}
                >
                  Plans & Billing
                </Link>
                <Link
                  href="/dashboard/super-admin/branding"
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                    pathname?.startsWith("/dashboard/super-admin/branding") || pathname?.startsWith("/dashboard/super-admin/whitelabel")
                      ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  )}
                >
                  Branding
                </Link>
                <Link
                  href="/dashboard/super-admin/settings"
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                    pathname?.startsWith("/dashboard/super-admin/settings")
                      ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  )}
                >
                  Settings
                </Link>
                <Link
                  href="/dashboard/academy/admissions"
                  className="ml-2 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                >
                  Academy Mode →
                </Link>
              </>
            ) : (
              <>
                {isSuperAdminPlatform && (
                  <Link
                    href="/dashboard/super-admin"
                    className="mr-1 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-all flex items-center gap-1 shadow-2xs"
                  >
                    🛡️ Platform Control
                  </Link>
                )}
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
              </>
            )}
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

          {/* Exit Impersonation Banner/Button */}
          {(session?.user?.impersonatedBySuperAdmin || (session?.user?.organizationId && (session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'Super Admin'))) && (
            <button
              onClick={async () => {
                try {
                  // 1. Clear the server-side impersonation cookie
                  await fetch("/api/v1/super-admin/academies/impersonate/exit", { method: "POST" })
                  // 2. Flush the JWT session to remove stale organizationId/tenantMode state.
                  //    Without this, the NextAuth JWT still carries the old tenant context
                  //    even after the cookie is gone, until the user re-logs in.
                  await updateSession({
                    organizationId: null,
                    tenantId: null,
                    impersonatedBySuperAdmin: false,
                    role: "SUPER_ADMIN"
                  })
                  toast.success("Exited tenant mode. Returned to Super Admin dashboard.")
                } catch (err) {
                  console.error("Error exiting tenant mode:", err)
                  toast.error("Failed to exit tenant mode cleanly.")
                } finally {
                  window.location.href = "/dashboard/super-admin/academies"
                }
              }}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-xl border border-amber-500 flex items-center gap-1 shadow-xs transition-colors"
              title="Return to Super Admin Global View"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit Tenant Mode
            </button>
          )}

          {/* User Profile */}
          <div className="hidden md:flex items-center gap-3 pl-1">
            <div className="flex flex-col items-end min-w-0">
              <span className="text-sm font-bold leading-none text-slate-900">{session?.user?.name || "Stalin Kumar"}</span>
              <span className="text-[10px] uppercase tracking-wider text-primary font-bold mt-1 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{role}</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="h-9 w-9 rounded-full bg-primary border border-primary/30 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {session?.user?.name?.charAt(0) || "S"}
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: isSuperAdminPlatform ? "/super-admin/login" : "/auth/login" })} 
                title="Sign Out" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
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
          <div className="relative w-[85%] max-w-sm h-full flex flex-col bg-white border-r border-slate-200 shadow-2xl animate-in slide-in-from-left overflow-y-auto">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 shrink-0">
              <OrgHeader />
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-3 mb-2 font-mono">Mobile Workspace Nav</span>
              
              {pathname?.startsWith("/dashboard/super-admin") ? (
                <>
                  <Link href="/dashboard/super-admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100">
                    Dashboard Overview
                  </Link>
                  <Link href="/dashboard/super-admin/academies" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100">
                    Academies Directory
                  </Link>
                  <Link href="/dashboard/super-admin/plans" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100">
                    Plans & Billing
                  </Link>
                  <Link href="/dashboard/super-admin/branding" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100">
                    Branding Controls
                  </Link>
                </>
              ) : (
                <div className="space-y-1">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Main Dashboard</span>
                  </Link>
                  <Link href="/dashboard/academy/admissions" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors">
                    <Users className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Admissions CRM (Leads)</span>
                  </Link>
                  <Link href="/dashboard/academy/calls" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors">
                    <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Call Intelligence</span>
                  </Link>
                  <Link href="/dashboard/academy/students" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors">
                    <GraduationCap className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Student Directory</span>
                  </Link>
                  <Link href="/dashboard/academy/fees" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors">
                    <CreditCard className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Fees & Payments</span>
                  </Link>
                  <Link href="/dashboard/academy/batches" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors">
                    <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Batches & Schedule</span>
                  </Link>
                  <Link href="/dashboard/studio" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors">
                    <Video className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Teaching Studio</span>
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors">
                    <Settings className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Branding & Settings</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Footer & User Card */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-3 mt-auto shrink-0">
               <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl">
                 <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                   {session?.user?.name?.charAt(0) || "S"}
                 </div>
                 <div className="min-w-0 flex-1">
                   <div className="text-xs font-bold text-slate-900 truncate">{session?.user?.name || "Stalin Kumar"}</div>
                   <div className="text-[10px] text-teal-700 font-bold uppercase font-mono">{role}</div>
                 </div>
               </div>

               <div className="flex items-center justify-around py-1 border-b border-slate-200 mb-1">
                 <NotificationMenu />
                 <RealtimeIndicator />
               </div>
               
               <button onClick={() => signOut({ callbackUrl: "/auth/login" })} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

