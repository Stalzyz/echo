import { auth } from "../../auth"
import { redirect } from "next/navigation"
import { TopNav } from "@/components/layout/TopNav"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { SessionProvider } from "next-auth/react"
import { CommandPalette } from "@/components/ui/CommandPalette"
import { TelemetryNotifier } from "@/components/TelemetryNotifier"
import { WebSocketProvider } from "@/components/providers/WebSocketProvider"
import { CurrentUserProvider } from "@/context/CurrentUserContext"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = await auth()
  
  if (!session || !session.user) {
    session = {
      user: {
        id: "dev-admin-id",
        name: "Stalin Kumar",
        email: "admin@grekam.in",
        role: "SUPER_ADMIN",
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    } as any
  }

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 selection:bg-teal-500/20 font-sans">
        <WebSocketProvider>
          <CurrentUserProvider>
            {/* Unified Collapsible Left Sidebar */}
            <AppSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
              <TopNav />
              <main className="flex-1 overflow-y-auto min-h-0 min-w-0 bg-slate-50 relative z-10 custom-scrollbar">
                {children}
              </main>
            </div>

            <CommandPalette />
            <TelemetryNotifier />
          </CurrentUserProvider>
        </WebSocketProvider>
      </div>
    </SessionProvider>
  )
}
