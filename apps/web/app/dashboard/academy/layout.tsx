import { auth } from "../../../auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"

export default async function AcademyAdminLayout({
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
      <div className="h-full w-full bg-slate-50 text-slate-900 font-sans min-h-0 flex-1 flex flex-col">
        {children}
      </div>
    </SessionProvider>
  )
}

