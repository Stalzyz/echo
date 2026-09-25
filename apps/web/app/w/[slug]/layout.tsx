import { auth } from  "@/auth"
import { redirect } from  "next/navigation"
import { SessionProvider } from  "next-auth/react"
import { CommandPalette } from  "@/components/ui/CommandPalette"
import { WebSocketProvider } from  "@/components/providers/WebSocketProvider"
import { CurrentUserProvider } from  "@/context/CurrentUserContext"
import { DashboardShell } from  "@/components/layout/DashboardShell"

export default async function VendorWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/login")
  }

  return (
    <SessionProvider session={session}>
      <WebSocketProvider>
        <CurrentUserProvider>
          <DashboardShell>
            {children}
          </DashboardShell>
          <CommandPalette />
        </CurrentUserProvider>
      </WebSocketProvider>
    </SessionProvider>
  )
}
