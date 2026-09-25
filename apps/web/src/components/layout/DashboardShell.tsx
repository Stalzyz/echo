"use client"

import { usePathname } from  "next/navigation"
import { TopNav } from  "@/components/layout/TopNav"
import { AppSidebar } from  "@/components/layout/AppSidebar"
import { UpgradePlanModal } from  "@/components/subscription/UpgradePlanModal"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // If path is Educator Studio (/dashboard/studio), do NOT render Academy Admin sidebar or top nav!
  const isStudio = pathname?.startsWith("/dashboard/studio")

  if (isStudio) {
    return (
      <div className="min-h-screen w-full bg-slate-50">
        {children}
        <UpgradePlanModal />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 selection:bg-teal-500/20 font-sans">
      {/* Unified Collapsible Left Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto min-h-0 min-w-0 bg-slate-50 relative z-10 custom-scrollbar">
          {children}
        </main>
      </div>

      {/* Global Interactive Upgrade Modal */}
      <UpgradePlanModal />
    </div>
  )
}
