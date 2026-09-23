import { auth } from "../../../auth"
import { EducatorSidebar } from "@/components/educator/EducatorSidebar"
import { SessionProvider } from "next-auth/react"

export default async function EducatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/login")
  }

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
        <EducatorSidebar />
        <div className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </div>
      </div>
    </SessionProvider>
  )
}
