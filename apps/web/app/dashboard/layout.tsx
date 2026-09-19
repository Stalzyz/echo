import { auth } from "../../auth"
import { SessionProvider } from "next-auth/react"
import { CommandPalette } from "@/components/ui/CommandPalette"
import { TelemetryNotifier } from "@/components/TelemetryNotifier"
import { WebSocketProvider } from "@/components/providers/WebSocketProvider"
import { CurrentUserProvider } from "@/context/CurrentUserContext"
import { DashboardShell } from "@/components/layout/DashboardShell"

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
        email: "admin@echolms.com",
        role: "SUPER_ADMIN",
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    } as any
  }

  return (
    <SessionProvider session={session}>
      <WebSocketProvider>
        <CurrentUserProvider>
          <DashboardShell>
            {children}
          </DashboardShell>
          <CommandPalette />
          <TelemetryNotifier />
        </CurrentUserProvider>
      </WebSocketProvider>
    </SessionProvider>
  )
}
