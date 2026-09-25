import { auth } from  "../../../auth"
import { redirect } from  "next/navigation"
import { SessionProvider } from  "next-auth/react"

export default async function AcademyAdminLayout({
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
      <div className="h-full w-full bg-slate-50 text-slate-900 font-sans min-h-0 flex-1 flex flex-col">
        {children}
      </div>
    </SessionProvider>
  )
}

